type RegistryAgent = {
  id: string;
  displayName: string;
  description: string | null;
  targetAudience: string | null;
  manifestUrl: string | null;
  visibility: string | null;
};

type AgentCard = {
  supportedInterfaces?: Array<{ url?: string; protocolBinding?: string; protocolVersion?: string }>;
  securityRequirements?: unknown;
};

type OutboundTarget = {
  id: string;
  name: string;
  agentCardUrl: string;
  endpointUrl: string;
};

type ResponseSignal = "interested" | "not_interested" | "unsupported";

const REGISTRY_URL = "https://api.a2a-registry.org/public/agents?page=1&sort=newest";
const SELF_AGENT_CARD = "https://aegis-sales-bot.kadopi.workers.dev/.well-known/agent-card.json";

export async function runOutreach(db: D1Database, enabled: string | undefined, fetcher: typeof fetch = fetch): Promise<void> {
  if (enabled !== "true") return;
  let registryCandidateCount = 0;
  try {
    const registryResponse = await fetcher(REGISTRY_URL);
    if (!registryResponse.ok) throw new Error(`registry_fetch_failed:${registryResponse.status}`);
    const registry = await registryResponse.json() as { agents?: unknown };
    const candidates = Array.isArray(registry.agents) ? registry.agents.filter(isRegistryAgent) : [];
    registryCandidateCount = candidates.length;

    for (const candidate of candidates) {
      const target = await qualifyTarget(candidate, fetcher);
      if (!target) continue;
      const inserted = await reserveTarget(db, target);
      if (!inserted) continue;

      const result = await sendHearing(db, target, fetcher);
      await recordOutreachRun(db, result, registryCandidateCount, target.id);
      return;
    }
    await recordOutreachRun(db, "no_candidate", registryCandidateCount);
  } catch {
    await recordOutreachRun(db, "failed", registryCandidateCount);
  }
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

  return { id: candidate.id, name: candidate.displayName, agentCardUrl: candidate.manifestUrl, endpointUrl };
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

async function reserveTarget(db: D1Database, target: OutboundTarget): Promise<boolean> {
  const result = await db.prepare(
    "INSERT INTO outreach_attempts (target_id, target_name, agent_card_url, endpoint_url, selected_at, status) VALUES (?, ?, ?, ?, ?, 'selected') ON CONFLICT(target_id) DO NOTHING"
  ).bind(target.id, target.name, target.agentCardUrl, target.endpointUrl, new Date().toISOString()).run();
  return result.meta.changes === 1;
}

async function sendHearing(db: D1Database, target: OutboundTarget, fetcher: typeof fetch): Promise<"sent" | "survey_received" | "rejected" | "failed"> {
  const taskId = `aegis-outreach-${target.id}`;
  const body = {
    jsonrpc: "2.0",
    id: taskId,
    method: "SendMessage",
    params: {
      message: {
        messageId: crypto.randomUUID(),
        role: "ROLE_USER",
        parts: [{ text: "Hello. Aegis Sales Bot is conducting a short agent-to-agent discovery interview. What business capability is currently difficult for your users or agents to obtain programmatically? We are especially researching country-entry workflows: official-source preparation, tourism-business research, local partner discovery, and payment-ready service access. If a Japan-related MCP, API, or verified information service would help, please tell us what outcome you need. No sign-up, payment, order, or follow-up is requested. To let us measure the outcome without storing your message text, you may include { \"aegis_outreach_status\": { \"outcome\": \"interested\" } }, using interested, not_interested, or unsupported. To permit storage for product analysis, include one JSON data part: { \"aegis_survey\": { \"consent\": true, \"answers\": [{ \"questionId\": \"desired_service\", \"answer\": \"your answer\" }, { \"questionId\": \"desired_capability\", \"answer\": \"your answer\" }] } }. Without that explicit consent, your response is not stored." }]
      }
    }
  };

  try {
    const response = await fetcher(target.endpointUrl, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    const outcome = response.ok ? await readOutboundOutcome(response, taskId) : { survey: null, signal: null };
    if (outcome.survey) await recordSurveyResponses(db, outcome.survey);
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

async function recordOutreachRun(db: D1Database, result: "sent" | "survey_received" | "rejected" | "failed" | "no_candidate", registryCandidateCount: number, targetId?: string): Promise<void> {
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

function findResponseSignal(value: unknown): ResponseSignal | null {
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
import { readSurveySubmission, type SurveySubmission } from "./a2a";
import { recordSurveyResponses } from "./metrics";
