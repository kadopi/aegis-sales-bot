import { markReferralCandidate, nextReferralCandidate } from "./referrals";
import { readSurveySubmission, type SurveySubmission } from "./a2a";
import { recordSurveyResponses } from "./metrics";

type RegistryAgent = {
  id: string;
  displayName: string;
  description: string | null;
  targetAudience: string | null;
  manifestUrl: string | null;
  visibility: string | null;
};

type ExternalRegistryAgent = {
  id: string;
  name: string;
  description: string | null;
  wellKnownURI: string | null;
  is_healthy: boolean | null;
  skills: unknown;
  pricing: unknown;
};

type AgentCard = {
  name?: unknown;
  description?: unknown;
  supportedInterfaces?: Array<{ url?: string; protocolBinding?: string; protocolVersion?: string }>;
  securityRequirements?: unknown;
};

type OutboundTarget = {
  id: string;
  name: string;
  description: string | null;
  agentCardUrl: string;
  endpointUrl: string;
};

type MatchedOffer = {
  productId: "japan-rulewatch" | "x402-mcp-starter" | "agent-card-health-check";
  valueHypothesis: string;
};

type ResponseSignal = "interested" | "not_interested" | "unsupported";
type OutboundConversation = {
  beginOutbound(input: { peerId: string; proposal: string }): Promise<void>;
  advanceOutbound(signal: ResponseSignal | null): Promise<{ status: "TASK_STATE_INPUT_REQUIRED" | "TASK_STATE_COMPLETED"; message: string; includeSurvey: boolean }>;
};
type OutboundConversations = { getByName(name: string): OutboundConversation };

const PRIMARY_REGISTRY_URL = "https://api.a2a-registry.org/public/agents?page=1&sort=newest";
const SECONDARY_REGISTRY_URL = "https://a2aregistry.org/api/agents?conformance=standard&limit=100&offset=0";
const BUSINESS_PROFILE = /commerce|commercial|payment|x402|marketplace|procurement|trade|retail|ecommerce|marketing|business|enterprise|sales|tourism|travel|hotel|booking|finance|financial|invoice|legal|insurance|logistics|freight|property|real estate/i;
const SELF_AGENT_CARD = "https://aegis-sales-bot.kadopi.workers.dev/.well-known/agent-card.json";

export async function runDiscovery(db: D1Database, enabled: string | undefined, fetcher: typeof fetch = fetch): Promise<void> {
  if (enabled !== "true") return;
  let registryCandidateCount = 0;
  try {
    const registryResponse = await fetcher(PRIMARY_REGISTRY_URL);
    if (!registryResponse.ok) throw new Error(`registry_fetch_failed:${registryResponse.status}`);
    const registry = await registryResponse.json() as { agents?: unknown };
    const candidates = Array.isArray(registry.agents) ? registry.agents.filter(isRegistryAgent) : [];
    registryCandidateCount = candidates.length;

    for (const candidate of candidates) {
      const target = await qualifyTarget(candidate, fetcher);
      if (!target) continue;
      const offer = matchOffer(target);
      if (!offer) continue;
      if (await queueCandidate(db, target, offer, "global_a2a_registry")) {
        await recordOutreachRun(db, "candidate_found", registryCandidateCount, target.id);
        return;
      }
    }

    const secondaryCandidates = await fetchSecondaryCandidates(fetcher);
    registryCandidateCount += secondaryCandidates.length;
    for (const candidate of secondaryCandidates) {
      const target = await qualifySecondaryTarget(candidate, fetcher);
      if (!target) continue;
      const offer = matchOffer(target);
      if (!offer) continue;
      if (await queueCandidate(db, target, offer, "a2a_directory")) {
        await recordOutreachRun(db, "candidate_found", registryCandidateCount, target.id);
        return;
      }
    }
    await recordOutreachRun(db, "no_candidate", registryCandidateCount);
  } catch {
    await recordOutreachRun(db, "failed", registryCandidateCount);
  }
}

export async function runOutreach(db: D1Database, enabled: string | undefined, conversations: OutboundConversations, fetcher: typeof fetch = fetch): Promise<void> {
  if (enabled !== "true") return;
  let registryCandidateCount = 0;
  try {
    const referral = await nextReferralCandidate(db);
    if (referral) {
      const target = await qualifyReferredTarget(referral.agentCardUrl, fetcher);
      if (!target) {
        await markReferralCandidate(db, referral.agentCardUrl, "not_qualified");
        await recordOutreachRun(db, "no_candidate", 0);
        return;
      }
      const inserted = await reserveTarget(db, target);
      await markReferralCandidate(db, referral.agentCardUrl, "contacted");
      if (!inserted) {
        await recordOutreachRun(db, "no_candidate", 0, target.id);
        return;
      }
      await contactTarget(db, target, conversations, fetcher, 0);
      return;
    }
    const registryResponse = await fetcher(PRIMARY_REGISTRY_URL);
    if (!registryResponse.ok) throw new Error(`registry_fetch_failed:${registryResponse.status}`);
    const registry = await registryResponse.json() as { agents?: unknown };
    const candidates = Array.isArray(registry.agents) ? registry.agents.filter(isRegistryAgent) : [];
    registryCandidateCount = candidates.length;

    for (const candidate of candidates) {
      const target = await qualifyTarget(candidate, fetcher);
      if (!target) continue;
      const inserted = await reserveTarget(db, target);
      if (!inserted) continue;

      await contactTarget(db, target, conversations, fetcher, registryCandidateCount);
      return;
    }

    const secondaryCandidates = await fetchSecondaryCandidates(fetcher);
    registryCandidateCount += secondaryCandidates.length;
    for (const candidate of secondaryCandidates) {
      const target = await qualifySecondaryTarget(candidate, fetcher);
      if (!target) continue;
      const inserted = await reserveTarget(db, target);
      if (!inserted) continue;

      await contactTarget(db, target, conversations, fetcher, registryCandidateCount);
      return;
    }
    await recordOutreachRun(db, "no_candidate", registryCandidateCount);
  } catch {
    await recordOutreachRun(db, "failed", registryCandidateCount);
  }
}

async function contactTarget(db: D1Database, target: OutboundTarget, conversations: OutboundConversations, fetcher: typeof fetch, registryCandidateCount: number): Promise<void> {
  const conversation = conversations.getByName(`aegis-outreach-${target.id}`);
  await conversation.beginOutbound({ peerId: target.id, proposal: proposalFor(target.description) });
  const result = await sendHearing(db, target, conversation, fetcher);
  await recordOutreachRun(db, result, registryCandidateCount, target.id);
}

function isRegistryAgent(value: unknown): value is RegistryAgent {
  if (!isRecord(value)) return false;
  return typeof value.id === "string" && typeof value.displayName === "string" &&
    (typeof value.description === "string" || value.description === null) &&
    (typeof value.targetAudience === "string" || value.targetAudience === null) &&
    (typeof value.manifestUrl === "string" || value.manifestUrl === null) &&
    (typeof value.visibility === "string" || value.visibility === null);
}

async function qualifyTarget(candidate: RegistryAgent, fetcher: typeof fetch): Promise<OutboundTarget | null> {
  if (candidate.visibility !== "public" || candidate.targetAudience !== "Business" || !candidate.manifestUrl) return null;
  if (candidate.manifestUrl === SELF_AGENT_CARD) return null;
  if (!isSafeHttpsUrl(candidate.manifestUrl)) return null;

  const cardResponse = await fetcher(candidate.manifestUrl);
  if (!cardResponse.ok) return null;
  const card = await cardResponse.json() as AgentCard;
  if (!isPublicNoAuthCard(card)) return null;
  const endpointUrl = jsonRpcEndpoint(card);
  if (!endpointUrl || !isSafeHttpsUrl(endpointUrl)) return null;

  return { id: candidate.id, name: candidate.displayName, description: candidate.description, agentCardUrl: candidate.manifestUrl, endpointUrl };
}

async function fetchSecondaryCandidates(fetcher: typeof fetch): Promise<ExternalRegistryAgent[]> {
  try {
    const response = await fetcher(SECONDARY_REGISTRY_URL);
    if (!response.ok) return [];
    const directory = await response.json() as { agents?: unknown };
    return Array.isArray(directory.agents) ? directory.agents.filter(isExternalRegistryAgent).filter(isBusinessDirectoryAgent).slice(0, 20) : [];
  } catch {
    return [];
  }
}

function isExternalRegistryAgent(value: unknown): value is ExternalRegistryAgent {
  return isRecord(value) && typeof value.id === "string" && typeof value.name === "string" &&
    (typeof value.description === "string" || value.description === null) &&
    (typeof value.wellKnownURI === "string" || value.wellKnownURI === null) &&
    (typeof value.is_healthy === "boolean" || value.is_healthy === null);
}

function isBusinessDirectoryAgent(agent: ExternalRegistryAgent): boolean {
  if (agent.is_healthy !== true || !agent.wellKnownURI) return false;
  const skills = Array.isArray(agent.skills) ? agent.skills.flatMap((skill) => isRecord(skill) && Array.isArray(skill.tags) ? skill.tags.filter((tag): tag is string => typeof tag === "string") : []) : [];
  const pricing = typeof agent.pricing === "string" ? agent.pricing : "";
  return BUSINESS_PROFILE.test([agent.name, agent.description ?? "", pricing, ...skills].join(" "));
}

async function qualifySecondaryTarget(candidate: ExternalRegistryAgent, fetcher: typeof fetch): Promise<OutboundTarget | null> {
  if (!candidate.wellKnownURI || !isSafeHttpsUrl(candidate.wellKnownURI)) return null;
  const cardResponse = await fetcher(candidate.wellKnownURI);
  if (!cardResponse.ok) return null;
  const card = await cardResponse.json() as AgentCard;
  if (!isPublicNoAuthCard(card)) return null;
  const endpointUrl = jsonRpcEndpoint(card);
  if (!endpointUrl || !isSafeHttpsUrl(endpointUrl)) return null;
  return { id: `directory:${candidate.id}`, name: candidate.name, description: candidate.description, agentCardUrl: candidate.wellKnownURI, endpointUrl };
}

async function qualifyReferredTarget(agentCardUrl: string, fetcher: typeof fetch): Promise<OutboundTarget | null> {
  if (agentCardUrl === SELF_AGENT_CARD || !isSafeHttpsUrl(agentCardUrl)) return null;
  const cardResponse = await fetcher(agentCardUrl);
  if (!cardResponse.ok) return null;
  const card = await cardResponse.json() as AgentCard;
  if (!isPublicNoAuthCard(card)) return null;
  const endpointUrl = jsonRpcEndpoint(card);
  if (!endpointUrl || !isSafeHttpsUrl(endpointUrl)) return null;
  return {
    id: `referral:${agentCardUrl}`,
    name: typeof card.name === "string" && card.name.length > 0 ? card.name.slice(0, 200) : "Referred A2A agent",
    description: typeof card.description === "string" ? card.description.slice(0, 2_000) : null,
    agentCardUrl,
    endpointUrl
  };
}

function isPublicNoAuthCard(card: AgentCard): boolean {
  return !Array.isArray(card.securityRequirements) || card.securityRequirements.length === 0;
}

function jsonRpcEndpoint(card: AgentCard): string | null {
  const entry = card.supportedInterfaces?.find((item) => item.protocolBinding === "JSONRPC" && item.protocolVersion === "1.0");
  return typeof entry?.url === "string" ? entry.url : null;
}

function isSafeHttpsUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname !== "localhost" && !/^\d{1,3}(\.\d{1,3}){3}$/.test(url.hostname);
  } catch {
    return false;
  }
}

async function queueCandidate(db: D1Database, target: OutboundTarget, offer: MatchedOffer, source: "global_a2a_registry" | "a2a_directory"): Promise<boolean> {
  const result = await db.prepare(
    "INSERT INTO outreach_candidates (agent_card_url, target_id, target_name, endpoint_url, product_id, value_hypothesis, source, discovered_at, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending') ON CONFLICT(agent_card_url) DO NOTHING"
  ).bind(target.agentCardUrl, target.id, target.name, target.endpointUrl, offer.productId, offer.valueHypothesis, source, new Date().toISOString()).run();
  return result.meta.changes === 1;
}

function matchOffer(target: OutboundTarget): MatchedOffer | null {
  const profile = `${target.name} ${target.description ?? ""}`.toLowerCase();
  if (/tourism|travel|hotel|booking|destination|experience|japan entry/.test(profile)) {
    return { productId: "japan-rulewatch", valueHypothesis: "A free Japan Rule model-case preview may help this agent identify the first checks for a Japan experiential-tourism entry workflow." };
  }
  if (/payment|commerce|marketplace|procurement|trade|retail|ecommerce/.test(profile)) {
    return { productId: "x402-mcp-starter", valueHypothesis: "A free x402 MCP Starter may help this agent validate a programmatic USDC payment route for an MCP tool." };
  }
  if (/\bmcp\b|\ba2a\b|agent card|api|developer|workflow|automation|integration/.test(profile)) {
    return { productId: "agent-card-health-check", valueHypothesis: "A free Agent Card Health Check may help this agent verify connection readiness before an authorized A2A integration." };
  }
  return null;
}

async function reserveTarget(db: D1Database, target: OutboundTarget): Promise<boolean> {
  const result = await db.prepare(
    "INSERT INTO outreach_attempts (target_id, target_name, agent_card_url, endpoint_url, selected_at, status) SELECT ?, ?, ?, ?, ?, 'selected' WHERE NOT EXISTS (SELECT 1 FROM outreach_attempts WHERE agent_card_url = ?) ON CONFLICT(target_id) DO NOTHING"
  ).bind(target.id, target.name, target.agentCardUrl, target.endpointUrl, new Date().toISOString(), target.agentCardUrl).run();
  return result.meta.changes === 1;
}

async function sendHearing(db: D1Database, target: OutboundTarget, conversation: OutboundConversation, fetcher: typeof fetch): Promise<"sent" | "survey_received" | "rejected" | "failed"> {
  const taskId = `aegis-outreach-${target.id}`;
  const body = {
    jsonrpc: "2.0",
    id: taskId,
    method: "SendMessage",
    params: {
      message: {
        messageId: crypto.randomUUID(),
        taskId,
        role: "ROLE_USER",
        parts: [{ text: hearingTextFor(target.name, target.description) }]
      }
    }
  };

  try {
    const response = await fetcher(target.endpointUrl, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const outcome = response.ok ? await readOutboundOutcome(response, taskId) : { survey: null, signal: null };
    if (outcome.survey) await recordSurveyResponses(db, outcome.survey);
    if (outcome.signal === "interested") {
      const next = await conversation.advanceOutbound(outcome.signal);
      if (next.status === "TASK_STATE_INPUT_REQUIRED") {
        try {
          await sendProposal(target.endpointUrl, taskId, next.message, fetcher);
        } catch {
          // The initial hearing was delivered; a follow-up failure must not relabel it as failed.
        }
      }
    } else if (outcome.signal) {
      await conversation.advanceOutbound(outcome.signal);
    }
    const result = outcome.survey ? "survey_received" : response.ok ? "sent" : "rejected";
    await db.prepare(
      "UPDATE outreach_attempts SET sent_at = ?, status = ?, http_status = ?, response_signal = ? WHERE target_id = ?"
    ).bind(new Date().toISOString(), result, response.status, outcome.signal, target.id).run();
    return result;
  } catch {
    await db.prepare(
      "UPDATE outreach_attempts SET sent_at = ?, status = 'failed' WHERE target_id = ?"
    ).bind(new Date().toISOString(), target.id).run();
    return "failed";
  }
}

async function sendProposal(endpointUrl: string, taskId: string, text: string, fetcher: typeof fetch): Promise<void> {
  await fetcher(endpointUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: `${taskId}-proposal`, method: "SendMessage", params: { message: { messageId: crypto.randomUUID(), taskId, role: "ROLE_USER", parts: [{ text }] } } })
  });
}

export function hearingTextFor(name: string, description: string | null): string {
  const opening = audienceOpening(name, description);
  return `${opening} No sign-up, payment, order, or follow-up is requested. To let us measure the outcome without storing your message text, you may include { "aegis_outreach_status": { "outcome": "interested" } }, using interested, not_interested, or unsupported. To permit storage for product analysis, include one JSON data part: { "aegis_survey": { "consent": true, "answers": [{ "questionId": "desired_service", "answer": "your answer" }, { "questionId": "desired_capability", "answer": "your answer" }, { "questionId": "referral_domain", "answer": "agent or workflow category only; no names, contacts, or secrets" }, { "questionId": "referral_agent_card_url", "answer": "optional public HTTPS Agent Card URL only" }] } }. Without that explicit consent, your response is not stored.`;
}

function proposalFor(description: string | null): string {
  const profile = description?.toLowerCase() ?? "";
  if (/tourism|travel|hotel|booking|destination|experience/.test(profile)) return "Japan Rule is a free MCP preview for a Japan experiential-tourism entry model case. Connect at https://japan-rulewatch-mcp-mainnet.kadopi.workers.dev/mcp and call search_entry_cases. Japan Rule handles its own commercial terms, purchase, and delivery if you choose to continue.";
  if (/payment|commerce|marketplace|procurement|trade|retail|ecommerce/.test(profile)) return "x402 MCP Starter is a free self-hosted starting point for adding USDC usage payments to an MCP tool. Connect at https://x402-mcp-starter.kadopi.workers.dev/mcp and call validate_x402_config with your own configuration.";
  return "Agent Card Health Check is a free, no-storage MCP for an A2A Agent Card, endpoint, and authentication declaration. Connect at https://agent-card-health-check.kadopi.workers.dev/mcp and call diagnose_agent_card only for an agent you own or are authorized to connect to.";
}

function audienceOpening(name: string, description: string | null): string {
  const profile = description?.toLowerCase() ?? "";
  if (/tourism|travel|hotel|booking|destination|experience/.test(profile)) {
    return `Hello ${name}. Your Agent Card suggests travel or tourism work. If your users need a programmatic way to prepare for entering Japan's experiential-tourism market, would a Japan Rule MCP with official-source guidance be useful? What outcome would they need?`;
  }
  if (/payment|commerce|marketplace|procurement|trade|retail|ecommerce/.test(profile)) {
    return `Hello ${name}. Your Agent Card suggests commerce or procurement work. Where do your users or agents currently struggle to discover, verify, or pay for a programmatic business service? We are researching MCP and x402-compatible service access.`;
  }
  if (/mcp|api|developer|workflow|automation|software|integration/.test(profile)) {
    return `Hello ${name}. Your Agent Card suggests agent or workflow development. Do your users need help checking A2A connection readiness, finding an MCP capability, or adding a payment-ready service route? Which outcome is hardest to obtain programmatically?`;
  }
  return `Hello ${name}. Aegis Sales Bot is conducting a short agent-to-agent discovery interview. What business capability is currently difficult for your users or agents to obtain programmatically? We are researching verified information, service discovery, and payment-ready access.`;
}

async function recordOutreachRun(db: D1Database, result: "candidate_found" | "sent" | "survey_received" | "rejected" | "failed" | "no_candidate", registryCandidateCount: number, targetId?: string): Promise<void> {
  await db.prepare(
    "INSERT INTO outreach_runs (id, ran_at, result, registry_candidate_count, target_id) VALUES (?, ?, ?, ?, ?)"
  ).bind(crypto.randomUUID(), new Date().toISOString(), result, registryCandidateCount, targetId ?? null).run();
}

async function readOutboundOutcome(response: Response, taskId: string): Promise<{ survey: SurveySubmission | null; signal: ResponseSignal | null }> {
  try {
    return outboundOutcomeFromResponse(await response.json(), taskId);
  } catch {
    return { survey: null, signal: null };
  }
}

function outboundOutcomeFromResponse(payload: unknown, taskId: string): { survey: SurveySubmission | null; signal: ResponseSignal | null } {
  const survey = findSurvey(payload);
  return {
    survey: survey ? readSurveySubmission({ params: { message: { taskId }, metadata: { survey } } }) : null,
    signal: findResponseSignal(payload)
  };
}

function findSurvey(value: unknown): unknown {
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findSurvey(item);
      if (found) return found;
    }
    return null;
  }
  if (!isRecord(value)) return null;
  if ("aegis_survey" in value) return value.aegis_survey;
  for (const item of Object.values(value)) {
    const found = findSurvey(item);
    if (found) return found;
  }
  return null;
}

export function findResponseSignal(value: unknown): ResponseSignal | null {
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findResponseSignal(item);
      if (found) return found;
    }
    return null;
  }
  if (!isRecord(value)) return null;
  if ("aegis_outreach_status" in value) {
    const status = value.aegis_outreach_status;
    if (isRecord(status) && (status.outcome === "interested" || status.outcome === "not_interested" || status.outcome === "unsupported")) return status.outcome;
  }
  for (const item of Object.values(value)) {
    const found = findResponseSignal(item);
    if (found) return found;
  }
  return null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
