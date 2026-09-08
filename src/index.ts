import { catalog } from "./catalog";
import { recordMetric, type MetricEvent } from "./metrics";
import { parseRequest, recommend } from "./recommend";

const VERSION = "0.1.0";
const jsonHeaders = { "content-type": "application/json; charset=utf-8", "x-content-type-options": "nosniff" };

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    try {
      if (request.method === "GET" && url.pathname === "/health") return json({ status: "ok", version: VERSION });
      if (request.method === "GET" && url.pathname === "/products.json") {
        track(ctx, env, "catalog_view");
        return json({ version: VERSION, products: catalog });
      }
      if (request.method === "GET" && url.pathname === "/.well-known/agent-card.json") return json(agentCard(url.origin));
      if (request.method === "POST" && url.pathname === "/recommend") return await handleRecommendation(request, env, ctx);
      if (request.method === "GET" && url.pathname === "/") return json({
        name: "Aegis Sales Bot", version: VERSION,
        description: "Deterministic product discovery and connection guidance for AI agents.",
        endpoints: ["/health", "/products.json", "/recommend", "/.well-known/agent-card.json"]
      });
      return json({ error: "not_found" }, 404);
    } catch {
      track(ctx, env, "error");
      return json({ error: "internal_error" }, 500);
    }
  }
} satisfies ExportedHandler<Env>;

async function handleRecommendation(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  let input: unknown;
  try {
    input = await request.json();
  } catch {
    track(ctx, env, "error");
    return json({ error: "invalid_json" }, 400);
  }
  const query = parseRequest(input);
  if (query === null) {
    track(ctx, env, "error");
    return json({ error: "request_or_purpose_must_be_a_nonempty_string_of_at_most_2000_characters" }, 400);
  }
  const result = recommend(query);
  track(ctx, env, "recommendation", result.recommendedProduct?.id ?? "");
  if (result.recommendedProduct) track(ctx, env, "connection_guide", result.recommendedProduct.id);
  return json(result);
}

function agentCard(origin: string) {
  return {
    name: "Aegis Sales Bot",
    description: "A deterministic, machine-readable catalog for discovering Aegis services and their connection points.",
    version: VERSION,
    url: origin,
    supportedInterfaces: [{
      url: `${origin}/recommend`,
      protocolBinding: "urn:kadopi:aegis-sales-bot:recommend:1",
      protocolVersion: "1.0"
    }],
    capabilities: { streaming: false, pushNotifications: false, extendedAgentCard: false, extensions: [] },
    defaultInputModes: ["application/json"],
    defaultOutputModes: ["application/json"],
    skills: [{
      id: "product-recommendation",
      name: "Product recommendation",
      description: "Matches a request to a published catalog item without AI inference, payment, or external sending.",
      tags: ["catalog", "product-discovery", "deterministic"],
      examples: ["Find a service for Japanese ecommerce return-policy research", "Add USDC usage payments to an MCP server"]
    }],
    endpoints: { catalog: `${origin}/products.json`, recommend: `${origin}/recommend`, health: `${origin}/health` },
    limitations: ["The bot does not process payments or provide each product's service.", "No outbound messages or conversation history are used.", "The custom HTTP JSON binding is not an A2A JSON-RPC endpoint."]
  };
}

function track(ctx: ExecutionContext, env: Env, event: MetricEvent, productId = ""): void {
  ctx.waitUntil(recordMetric(env.DB, event, productId));
}

function json(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: jsonHeaders });
}
