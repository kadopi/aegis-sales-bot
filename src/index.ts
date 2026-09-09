import { catalog } from "./catalog";
import { a2aResponse, parseA2ARequest, readSurveySubmission } from "./a2a";
export { A2AConversation } from "./a2a-conversation";
import { recordFunnelMetric, recordMetric, recordSurveyResponses, type MetricEvent } from "./metrics";
import { observationAudience } from "./observation";
import { parseRequest, recommend } from "./recommend";

const VERSION = "0.1.0";
const jsonHeaders = { "content-type": "application/json; charset=utf-8", "x-content-type-options": "nosniff" };

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    try {
      if (request.method === "GET" && url.pathname === "/health") return json({ status: "ok", version: VERSION });
      if (request.method === "GET" && url.pathname === "/products.json") {
        track(ctx, env, request, "catalog_view");
        return json({ version: VERSION, products: catalog });
      }
      if (request.method === "GET" && url.pathname === "/.well-known/agent-card.json") return json(agentCard(url.origin));
      if (request.method === "POST" && url.pathname === "/recommend") return await handleRecommendation(request, env, ctx);
      if (request.method === "POST" && url.pathname === "/a2a") return await handleA2ARequest(request, env, ctx);
      if (request.method === "GET" && url.pathname === "/") return json({
        name: "Aegis Sales Bot", version: VERSION,
        description: "Deterministic product discovery and connection guidance for AI agents.",
        endpoints: ["/health", "/products.json", "/recommend", "/a2a", "/.well-known/agent-card.json"]
      });
      return json({ error: "not_found" }, 404);
    } catch {
      track(ctx, env, request, "error");
      return json({ error: "internal_error" }, 500);
    }
  }
} satisfies ExportedHandler<Env>;

async function handleRecommendation(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    track(ctx, env, request, "error");
    return json({ error: "invalid_json" }, 400);
  }
  const query = parseRequest(input);
  if (query === null) {
    track(ctx, env, request, "error");
    return json({ error: "request_or_purpose_must_be_a_nonempty_string_of_at_most_2000_characters" }, 400);
  }
  const result = recommend(query);
  track(ctx, env, request, "recommendation", result.recommendedProduct?.id ?? "");
  if (result.recommendedProduct) track(ctx, env, request, "connection_guide", result.recommendedProduct.id);
  return json(result);
}

async function handleA2ARequest(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    track(ctx, env, request, "error");
    return json({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Invalid JSON payload" } }, 400);
  }
  const parsed = parseA2ARequest(input);
  if ("error" in parsed) return json(parsed.error, 400);
  const { id, taskId, text } = parsed.request;
  const conversation = env.A2A_CONVERSATIONS.getByName(taskId);
  const response = a2aResponse(id, taskId, await conversation.advance({ text }));
  track(ctx, env, request, "a2a_conversation");
  const survey = readSurveySubmission(input);
  if (survey) {
    for (const answer of survey.answers) track(ctx, env, request, "survey_response", answer.questionId);
    ctx.waitUntil(recordSurveyResponses(env.DB, survey));
  }
  return json(response);
}

function agentCard(origin: string) {
  return {
    name: "Aegis Sales Bot",
    description: "A deterministic, machine-readable catalog for AI agents to discover Aegis services, including a business-only Japan Experiential Tourism Entry Guide MCP. It helps an authorized business agent identify official sources, consultation points, and missing facts before an optional x402 purchase handled by the downstream service.",
    version: VERSION,
    url: origin,
    supportedInterfaces: [{
      url: `${origin}/a2a`,
      protocolBinding: "JSONRPC",
      protocolVersion: "1.0"
    }, {
      url: `${origin}/recommend`,
      protocolBinding: "urn:kadopi:aegis-sales-bot:recommend:1",
      protocolVersion: "1.0"
    }],
    capabilities: { streaming: false, pushNotifications: false, stateTransitionHistory: true, extendedAgentCard: false, extensions: [] },
    defaultInputModes: ["application/json"],
    defaultOutputModes: ["application/json"],
    skills: [{
      id: "product-recommendation",
      name: "Product recommendation",
      description: "Runs a deterministic A2A qualification turn and matches a request to a published catalog item. For Japan Rule, it returns an MCP endpoint where an authorized business agent can inspect a reusable experiential-tourism entry model case before an optional x402 purchase.",
      tags: ["catalog", "product-discovery", "a2a", "deterministic", "mcp", "x402", "japan-tourism"],
      examples: ["Find a service for Japanese ecommerce return-policy research", "I am an AI agent helping a business prepare to launch an experiential tour in Japan", "Add USDC usage payments to an MCP server"]
    }],
    endpoints: { catalog: `${origin}/products.json`, recommend: `${origin}/recommend`, a2a: `${origin}/a2a`, health: `${origin}/health` },
    limitations: ["The bot does not process payments or provide each product's service.", "The A2A endpoint keeps only a task stage for up to seven days to support a short qualification conversation. It stores survey answers only after explicit consent; it does not retain message content or send outbound messages."]
  };
}

function track(ctx: ExecutionContext, env: Env, request: Request, event: MetricEvent, productId = ""): void {
  ctx.waitUntil(recordMetric(env.DB, event, productId));
  if (event !== "error") ctx.waitUntil(recordFunnelMetric(env.DB, observationAudience(request), event, productId));
}

function json(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: jsonHeaders });
}
