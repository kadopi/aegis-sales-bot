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

const REGISTRY_URL = "https://api.a2a-registry.org/public/agents?page=1&sort=newest";
const DISCOVERY_TERMS = /tourism|travel|marketplace|business|research|discovery|procurement|commerce/i;
const SELF_AGENT_CARD = "https://aegis-sales-bot.kadopi.workers.dev/.well-known/agent-card.json";

export async function runOutreach(db: D1Database, enabled: string | undefined, fetcher: typeof fetch = fetch): Promise<void> {
  if (enabled !== "true") return;

  const registryResponse = await fetcher(REGISTRY_URL);
  if (!registryResponse.ok) throw new Error(`registry_fetch_failed:${registryResponse.status}`);
  const registry = await registryResponse.json() as { agents?: unknown };
  const candidates = Array.isArray(registry.agents) ? registry.agents.filter(isRegistryAgent) : [];

  for (const candidate of candidates) {
    const target = await qualifyTarget(candidate, fetcher);
    if (!target) continue;
    const inserted = await reserveTarget(db, target);
    if (!inserted) continue;

    await sendHearing(db, target, fetcher);
    return;
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
  if (!DISCOVERY_TERMS.test(candidate.description ?? "")) return null;
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

async function sendHearing(db: D1Database, target: OutboundTarget, fetcher: typeof fetch): Promise<void> {
  const body = {
    jsonrpc: "2.0",
    id: `aegis-outreach-${target.id}`,
    method: "SendMessage",
    params: {
      message: {
        messageId: crypto.randomUUID(),
        role: "ROLE_USER",
        parts: [{ text: "Hello. Aegis Sales Bot is conducting a short agent-to-agent discovery interview. What business capability is currently difficult for your users or agents to obtain programmatically? We are especially researching country-entry workflows: official-source preparation, tourism-business research, local partner discovery, and payment-ready service access. If a Japan-related MCP, API, or verified information service would help, please tell us what outcome you need. No sign-up, payment, order, or follow-up is requested. If you choose to respond through Aegis Sales Bot, you may opt into its survey; otherwise this message and your response are not stored." }]
      }
    }
  };

  try {
    const response = await fetcher(target.endpointUrl, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
    await db.prepare(
      "UPDATE outreach_attempts SET sent_at = ?, status = ?, http_status = ? WHERE target_id = ?"
    ).bind(new Date().toISOString(), response.ok ? "sent" : "rejected", response.status, target.id).run();
  } catch {
    await db.prepare(
      "UPDATE outreach_attempts SET sent_at = ?, status = 'failed' WHERE target_id = ?"
    ).bind(new Date().toISOString(), target.id).run();
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
