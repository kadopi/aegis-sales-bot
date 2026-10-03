var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/catalog.ts
var catalog = [
  {
    id: "japan-rulewatch",
    name: "Japan Rule",
    status: "public",
    summary: "Machine-readable entry guidance for businesses and authorized AI agents that want to launch an experiential tour in Japan. A free model-case preview shows what to decide; the paid pack provides the official-source locations, contact routes, inquiry text and action order needed to proceed. It does not provide bookable inventory.",
    useCases: ["Research official sources for Japanese ecommerce advertising, returns, or cancellation terms", "Decide whether a Japan experiential-tourism model case is worth taking to provider or authority checks", "Use the Iya English soba-workshop model case to preview operating decisions before retrieving an execution pack", "\u65E5\u672C\u5411\u3051EC\u306E\u901A\u8CA9\u5E83\u544A\u8868\u793A\u3092\u78BA\u8A8D\u3059\u308B", "\u65E5\u672C\u306E\u4F53\u9A13\u578B\u30C4\u30A2\u30FC\u89B3\u5149\u3078\u306E\u53C2\u5165\u3067\u3001\u7121\u6599\u30D7\u30EC\u30D3\u30E5\u30FC\u304B\u3089\u5B9F\u52D9\u78BA\u8A8D\u304C\u5FC5\u8981\u304B\u5224\u65AD\u3059\u308B"],
    keywords: ["japan", "japanese", "ec", "ecommerce", "tourism", "travel", "hotel", "ota", "workshop", "food culture", "\u65C5\u884C", "\u89B3\u5149", "\u8A2A\u65E5", "\u30DB\u30C6\u30EB", "\u7956\u8C37", "\u305D\u3070", "\u98DF\u6587\u5316", "\u4F53\u9A13", "\u901A\u8CA9", "\u5E83\u544A", "\u8868\u793A", "\u8FD4\u54C1", "\u8FD4\u91D1", "\u89E3\u7D04", "\u7279\u5B9A\u5546\u53D6\u5F15\u6CD5", "rule", "rules"],
    limitations: ["No legal advice or site-specific compliance decision", "The paid offer is a fixed English consultation-preparation pack for the Iya food-culture workshop model case", "Venue participation, commercial partnership, permissions, language support, water source, and live availability are unconfirmed"],
    freeOffer: "Start with a free execution preview: the model case, three decision themes, and what the paid preparation pack adds. It does not include source locations, contact routes, inquiry text, or an action plan.",
    paidOffer: "Business-only Japan Experiential Tourism Entry Guide information. First offer: a 5 USDC, single-purchase English consultation-preparation pack for the Iya, Tokushima six-person soba-workshop model case (pack_id: jp-tokushima-miyoshi-iya-soba). It provides official-source locations, published contact routes, inquiry text, and prioritized next actions. An authorized business principal or its delegated AI may retrieve the same saved result for seven days with the same payment proof and normalized input. It is not a workshop ticket, a booking, a permit application, or a guarantee that a tour can launch.",
    connectionType: "mcp",
    connectionUrl: "https://japan-rulewatch-mcp-mainnet.kadopi.workers.dev/mcp",
    docsUrl: "https://github.com/kadopi/japan-rulewatch-mcp",
    sourceUrl: "https://github.com/kadopi/japan-rulewatch-mcp",
    exampleInput: "I am an AI agent acting for a business that wants to launch an experiential tour in Japan. Use the Iya English soba-workshop model case to identify what we need to check first.",
    exampleOutput: "The free MCP call returns a six-person Iya model case, three decision themes, and a paid-delivery preview. The paid pack returns official-source locations, published contact routes, inquiry text, and prioritized next actions after x402 settlement.",
    nextAction: "Connect an MCP client and call search_entry_cases with region_id jp-tokushima-miyoshi-iya, activity food_culture_workshop, and language en. Review the model-case scope and missing facts, then call get_commercial_terms before deciding whether an authorized business should purchase.",
    updatedAt: "2026-09-08"
  },
  {
    id: "x402-mcp-starter",
    name: "x402 MCP Starter",
    status: "public",
    summary: "MCP\u30C4\u30FC\u30EB\u306BUSDC\u306E\u5F93\u91CF\u8AB2\u91D1\u3092\u8FFD\u52A0\u3059\u308B\u305F\u3081\u306E\u3001\u7121\u6599\u306E\u30BB\u30EB\u30D5\u30DB\u30B9\u30C8\u7528Cloudflare Workers\u30B9\u30BF\u30FC\u30BF\u30FC\u3067\u3059\u3002",
    useCases: ["MCP\u30C4\u30FC\u30EB\u306BUSDC\u5F93\u91CF\u8AB2\u91D1\u3092\u8FFD\u52A0\u3059\u308B", "x402\u6C7A\u6E08\u3092\u4F7F\u3046MCP\u306E\u6700\u5C0F\u5B9F\u88C5\u3092\u59CB\u3081\u308B"],
    keywords: ["x402", "usdc", "payment", "payments", "\u8AB2\u91D1", "\u6C7A\u6E08", "mcp", "monetize", "monetization", "base", "wallet"],
    limitations: ["\u55B6\u696Dbot\u81EA\u8EAB\u306F\u6C7A\u6E08\u30FB\u30A6\u30A9\u30EC\u30C3\u30C8\u7BA1\u7406\u30FB\u7D0D\u54C1\u3092\u884C\u3044\u307E\u305B\u3093", "\u5C0E\u5165\u5148\u30B5\u30FC\u30D3\u30B9\u3054\u3068\u306B\u6C7A\u6E08\u3068\u63D0\u4F9B\u3092\u8A2D\u5B9A\u3059\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059"],
    freeOffer: "\u30BB\u30EB\u30D5\u30DB\u30B9\u30C8\u7528\u306E\u30B9\u30BF\u30FC\u30BF\u30FC\u30B3\u30FC\u30C9\u3002",
    paidOffer: null,
    connectionType: "mcp",
    connectionUrl: "https://x402-mcp-starter.kadopi.workers.dev/mcp",
    docsUrl: "https://github.com/kadopi/x402-mcp-starter",
    sourceUrl: "https://github.com/kadopi/x402-mcp-starter",
    exampleInput: "\u81EA\u5206\u306EMCP\u30C4\u30FC\u30EB\u3092USDC\u306E\u547C\u3073\u51FA\u3057\u8AB2\u91D1\u306B\u3057\u305F\u3044",
    exampleOutput: "x402 MCP Starter\u306E\u5C0E\u5165\u5148\u3068\u30BB\u30EB\u30D5\u30DB\u30B9\u30C8\u624B\u9806\u3092\u8FD4\u3057\u307E\u3059\u3002",
    nextAction: "GitHub README\u3092\u78BA\u8A8D\u3057\u3001\u5C0E\u5165\u5148Worker\u3067\u6C7A\u6E08\u8A2D\u5B9A\u3092\u884C\u3063\u3066\u304F\u3060\u3055\u3044\u3002",
    updatedAt: "2026-09-06"
  },
  {
    id: "guardrail-mcp",
    name: "Guardrail MCP",
    status: "public",
    summary: "AI\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u306E\u5B9F\u884C\u524D\u306B\u3001\u6C7A\u5B9A\u7684\u306A\u30EB\u30FC\u30EB\u3067\u5C0F\u3055\u306A\u30EA\u30B9\u30AF\u78BA\u8A8D\u3092\u8FD4\u3059\u8AAD\u307F\u53D6\u308A\u5C02\u7528MCP\u3067\u3059\u3002",
    useCases: ["\u5916\u90E8\u66F8\u8FBC\u307F\u3084\u8CC7\u91D1\u79FB\u52D5\u3092\u542B\u3080\u64CD\u4F5C\u306E\u4E8B\u524D\u30EA\u30B9\u30AF\u78BA\u8A8D", "\u79D8\u5BC6\u60C5\u5831\u3084\u6307\u793A\u4E0A\u66F8\u304D\u306E\u78BA\u8A8D"],
    keywords: ["guardrail", "risk", "safety", "\u5B89\u5168", "\u30EA\u30B9\u30AF", "secret", "secrets", "\u8CC7\u91D1\u79FB\u52D5", "\u5916\u90E8\u66F8\u8FBC\u307F", "prompt injection"],
    limitations: ["\u5B9F\u884C\u30FB\u5916\u90E8\u66F8\u8FBC\u307F\u30FB\u5165\u529B\u4FDD\u5B58\u3092\u884C\u3044\u307E\u305B\u3093", "\u6700\u7D42\u7684\u306A\u6CD5\u52D9\u30FB\u91D1\u878D\u30FB\u30BB\u30AD\u30E5\u30EA\u30C6\u30A3\u5224\u65AD\u3092\u4EE3\u66FF\u3057\u307E\u305B\u3093"],
    freeOffer: "\u6C7A\u5B9A\u7684\u30FB\u8AAD\u307F\u53D6\u308A\u5C02\u7528\u306E\u4E8B\u524D\u30EA\u30B9\u30AF\u78BA\u8A8D\u3002",
    paidOffer: null,
    connectionType: "mcp",
    connectionUrl: "https://guardrail-mcp.kadopi.workers.dev/mcp",
    docsUrl: "https://github.com/kadopi/guardrail-mcp",
    sourceUrl: "https://github.com/kadopi/guardrail-mcp",
    exampleInput: "\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u304C\u5916\u90E8API\u3078\u66F8\u304D\u8FBC\u3080\u524D\u306B\u30EA\u30B9\u30AF\u3092\u78BA\u8A8D\u3057\u305F\u3044",
    exampleOutput: "proceed\u3001proceed_with_caution\u3001block \u306E\u3044\u305A\u308C\u304B\u3092\u8FD4\u3057\u307E\u3059\u3002",
    nextAction: "MCP\u30AF\u30E9\u30A4\u30A2\u30F3\u30C8\u3078\u63A5\u7D9A\u3057\u3001\u516C\u958B\u3055\u308C\u3066\u3044\u308B\u30EA\u30B9\u30AF\u78BA\u8A8D\u30C4\u30FC\u30EB\u3092\u547C\u3073\u51FA\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
    updatedAt: "2026-09-06"
  },
  {
    id: "agent-card-health-check",
    name: "Agent Card Health Check",
    status: "public",
    summary: "A read-only MCP that checks an A2A Agent Card against its declared endpoint and authentication configuration before an authorized connection. It returns a fixed connection-readiness result and does not store the card, credentials, diagnostic result, or service response.",
    useCases: ["Check whether an A2A Agent Card's declared endpoint and authentication configuration are ready for connection", "Find a public Agent Card and actual connection mismatch before adding an agent to an A2A workflow", "A2A\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u3078\u63A5\u7D9A\u3059\u308B\u524D\u306B\u3001Agent Card\u30FB\u63A5\u7D9A\u5148URL\u30FB\u8A8D\u8A3C\u8A2D\u5B9A\u3092\u78BA\u8A8D\u3059\u308B"],
    keywords: ["a2a", "agent card", "agent-card", "agentcard", "endpoint", "authentication", "auth", "connection", "connectable", "health check", "\u63A5\u7D9A", "\u8A8D\u8A3C", "\u63A5\u7D9A\u5148", "\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u30AB\u30FC\u30C9"],
    limitations: ["Run diagnostics only for an agent you own or are explicitly authorized to connect to", "The Sales Bot only introduces this MCP and does not run diagnostics or receive diagnostic inputs or results", "No security guarantee, vulnerability assessment, service execution, data storage, payment, or follow-up"],
    freeOffer: "Free, one-time, no-storage A2A connection-readiness check.",
    paidOffer: null,
    connectionType: "mcp",
    connectionUrl: "https://agent-card-health-check.kadopi.workers.dev/mcp",
    docsUrl: null,
    sourceUrl: null,
    exampleInput: "I own an A2A agent and want to verify that its Agent Card, endpoint URL, and authentication declaration are ready before another agent connects.",
    exampleOutput: "The MCP returns a fixed result such as connectable, auth_required, configuration_mismatch, or unreachable, with the declared and observed connection facts.",
    nextAction: "Connect an MCP client and call diagnose_agent_card only for an agent you own or are explicitly authorized to connect to.",
    updatedAt: "2026-09-13"
  },
  {
    id: "x402-mcp-integration-kit",
    name: "x402 MCP Integration Kit \u2014 Beta",
    status: "coming-soon",
    summary: "A one-time integration kit for developers who want to add one paid, read-only x402 tool to an existing Cloudflare Workers MCP. It packages payment verification, settlement, D1 purchase records, receipts, replay handling, configuration checks, and deployment helpers.",
    useCases: ["Add one paid x402 tool to an existing Cloudflare Workers MCP", "Sell a read-only MCP result with Base USDC while keeping buyer private keys out of the service", "Start from an integration workflow rather than building payment verification and a purchase ledger from scratch"],
    keywords: ["x402", "mcp", "integration", "kit", "cloudflare", "workers", "d1", "usdc", "base", "payment", "payments", "settlement", "receipt", "replay", "monetize", "monetization", "paid tool"],
    limitations: ["Checkout is not yet available while Gumroad and Stripe verification is completed", "No hosting, managed dashboard, subscription management, customer-fund custody, custom implementation, or revenue guarantee", "The kit is for one paid, read-only MCP tool and requires the buyer's own Cloudflare account, Base USDC receiving wallet, and sellable tool result"],
    freeOffer: "Product scope and buyer requirements are published in the catalog. Checkout opens after the payment-platform verification is complete.",
    paidOffer: "$19 USD, one-time Beta purchase. Downloadable source ZIP with an x402 paid-tool integration helper, Base Sepolia and Base Mainnet USDC configuration, x402 verify and settlement flow, D1 purchase ledger, replay handling, payment receipts, preflight, migration and deploy helpers, plus a free-plus-paid MCP example.",
    connectionType: "checkout",
    connectionUrl: null,
    docsUrl: null,
    sourceUrl: null,
    exampleInput: "I have a Cloudflare Workers MCP and want to add one paid read-only tool that settles in Base USDC with x402.",
    exampleOutput: "The catalog returns the Integration Kit scope, buyer requirements, $19 Beta price, and checkout availability. It does not claim that checkout is open before the public Gumroad URL exists.",
    nextAction: "Review the scope and buyer requirements. Wait for the public Gumroad checkout URL before attempting a purchase.",
    updatedAt: "2026-09-10"
  }
];

// src/a2a.ts
function parseA2ARequest(input) {
  if (!isRecord(input) || input.jsonrpc !== "2.0" || !(typeof input.id === "string" || typeof input.id === "number")) {
    return { error: rpcError(null, -32600, "Request payload validation error") };
  }
  if (input.method !== "SendMessage") return { error: rpcError(input.id, -32601, "Method not found") };
  const message = readMessage(input.params);
  if (message === null) return { error: rpcError(input.id, -32602, "Invalid parameters") };
  return { request: { id: input.id, taskId: message.taskId ?? crypto.randomUUID(), text: message.text } };
}
__name(parseA2ARequest, "parseA2ARequest");
function a2aResponse(id, taskId, turn) {
  return {
    jsonrpc: "2.0",
    id,
    result: {
      task: {
        id: taskId,
        status: {
          state: turn.status,
          message: agentMessage(turn.message)
        },
        artifacts: [
          ...turn.recommendation ? [{
            name: "aegis-product-guidance",
            parts: [{ data: turn.recommendation }]
          }] : [],
          ...turn.includeSurvey ? [{
            name: "optional-product-survey",
            description: "Optional feedback. Answers are stored only after explicit consent for product analysis.",
            parts: [{ data: {
              questions: [
                { question_id: "desired_service", text: "What service would you want besides Japan Rule?" },
                { question_id: "desired_capability", text: "What other capability would help your agent?" },
                { question_id: "referral_domain", text: "What type of AI agent or business workflow could benefit from this guidance? Please share only a category, not names, contacts, or secrets." },
                { question_id: "referral_agent_card_url", text: "Optional: provide a publicly reachable A2A Agent Card HTTPS URL for an agent that may benefit. We will validate it before one discovery message. Do not provide contacts, private URLs, or credentials." }
              ],
              response_instruction: "Reply only if you consent to storage for product analysis. Put { consent: true, answers: [{ questionId, answer }] } in params.metadata.survey. Do not include secrets or personal data."
            } }]
          }] : []
        ]
      }
    }
  };
}
__name(a2aResponse, "a2aResponse");
function readSurveySubmission(input) {
  if (!isRecord(input) || !isRecord(input.params) || !isRecord(input.params.message) || !isRecord(input.params.metadata)) return null;
  const survey = input.params.metadata.survey;
  if (!isRecord(survey) || survey.consent !== true || !Array.isArray(survey.answers) || survey.answers.length === 0 || survey.answers.length > 4) return null;
  const answers = survey.answers.map((item) => {
    if (!isRecord(item) || item.questionId !== "desired_service" && item.questionId !== "desired_capability" && item.questionId !== "referral_domain" && item.questionId !== "referral_agent_card_url" || typeof item.answer !== "string") return null;
    const answer = item.answer.trim();
    if (answer.length === 0 || answer.length > 1e3) return null;
    if (item.questionId === "referral_agent_card_url" && !isPublicHttpsUrl(answer)) return null;
    return { questionId: item.questionId, answer };
  });
  const validAnswers = answers.filter((answer) => answer !== null);
  if (validAnswers.length !== answers.length) return null;
  if (new Set(validAnswers.map((answer) => answer.questionId)).size !== validAnswers.length) return null;
  const taskId = typeof input.params.message.taskId === "string" ? input.params.message.taskId : "";
  return { taskId, answers: validAnswers };
}
__name(readSurveySubmission, "readSurveySubmission");
function referralAgentCardUrl(submission) {
  return submission.answers.find((answer) => answer.questionId === "referral_agent_card_url")?.answer ?? null;
}
__name(referralAgentCardUrl, "referralAgentCardUrl");
function readMessage(params) {
  if (!isRecord(params) || !isRecord(params.message)) return null;
  const message = params.message;
  if (message.role !== "ROLE_USER" || !Array.isArray(message.parts)) return null;
  const text = message.parts.filter(isRecord).map((part) => typeof part.text === "string" ? part.text : "").join("\n").trim();
  if (text.length === 0 || text.length > 2e3) return null;
  if (message.taskId !== void 0 && (typeof message.taskId !== "string" || message.taskId.length === 0 || message.taskId.length > 128)) return null;
  return { text, taskId: message.taskId };
}
__name(readMessage, "readMessage");
function agentMessage(text) {
  return { messageId: crypto.randomUUID(), role: "ROLE_AGENT", parts: [{ text }] };
}
__name(agentMessage, "agentMessage");
function rpcError(id, code, message) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}
__name(rpcError, "rpcError");
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
__name(isRecord, "isRecord");
function isPublicHttpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && url.hostname !== "localhost" && !/^\d{1,3}(\.\d{1,3}){3}$/.test(url.hostname);
  } catch {
    return false;
  }
}
__name(isPublicHttpsUrl, "isPublicHttpsUrl");

// src/a2a-conversation.ts
import { DurableObject } from "cloudflare:workers";

// src/recommend.ts
function parseRequest(input) {
  if (!isRecommendationInput(input)) return null;
  const value = typeof input.request === "string" ? input.request : input.purpose;
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 && normalized.length <= 2e3 ? normalized : null;
}
__name(parseRequest, "parseRequest");
function recommend(request, healthCheckUrl) {
  const ranked = catalog.map((product) => ({ product, score: score(product, request) })).sort((left, right) => right.score - left.score || left.product.id.localeCompare(right.product.id));
  const best = ranked[0];
  if (best.score === 0) return noFit();
  const fit = best.score >= 2 ? "high" : "medium";
  const matched = best.product.keywords.filter((keyword) => keywordMatches(request, keyword));
  return {
    recommendedProduct: best.product,
    reason: `Matched ${matched.join(", ")} against the catalog's stated use cases and keywords.`,
    fit,
    freeOffer: best.product.freeOffer,
    paidOffer: best.product.paidOffer,
    connection: best.product.connectionUrl ? { type: best.product.connectionType, url: best.product.connectionUrl, docsUrl: best.product.docsUrl } : null,
    example: { input: best.product.exampleInput, output: best.product.exampleOutput },
    nextAction: best.product.nextAction,
    alternatives: ranked.filter((item) => item.score > 0 && item.product.id !== best.product.id).map((item) => item.product),
    healthCheck: createHealthCheckDemo(healthCheckUrl)
  };
}
__name(recommend, "recommend");
function createHealthCheckDemo(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    return {
      service: "agent-card-health-check",
      mode: "optional_demo",
      mcpUrl: url.toString(),
      tool: "diagnose_agent_card",
      offer: {
        name: "\u63A5\u7D9A\u6E96\u5099\u30C1\u30A7\u30C3\u30AF",
        price: "\u7121\u6599\u30FB\u4E00\u56DE",
        benefit: "\u7D39\u4ECB\u3055\u308C\u305FAI\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u3092\u4F7F\u3046\u524D\u306B\u3001\u63A5\u7D9A\u53EF\u5426\u30FB\u8A8D\u8A3C\u8981\u5426\u30FB\u8A2D\u5B9A\u9055\u3044\u3092\u78BA\u8A8D\u3067\u304D\u307E\u3059\u3002"
      },
      requiresUserAuthorization: true,
      requiredInputs: ["agentCard", "authorizedTargetUrl"],
      message: "\u63A5\u7D9A\u5148\u3092\u6240\u6709\u3057\u3066\u3044\u308B\u304B\u3001\u63A5\u7D9A\u3092\u660E\u793A\u8A31\u53EF\u3055\u308C\u3066\u3044\u308B\u5834\u5408\u3060\u3051\u8A3A\u65AD\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u55B6\u696DBot\u306F\u8A3A\u65AD\u3092\u4EE3\u7406\u5B9F\u884C\u3057\u307E\u305B\u3093\u3002"
    };
  } catch {
    return null;
  }
}
__name(createHealthCheckDemo, "createHealthCheckDemo");
function score(product, request) {
  if (product.status === "coming-soon" && !["integration", "kit"].some((keyword) => keywordMatches(request, keyword))) return 0;
  return product.keywords.reduce((total, keyword) => total + (keywordMatches(request, keyword) ? 1 : 0), 0);
}
__name(score, "score");
function isRecommendationInput(input) {
  return input !== null && typeof input === "object" && !Array.isArray(input);
}
__name(isRecommendationInput, "isRecommendationInput");
function keywordMatches(request, keyword) {
  if (!/^[a-z0-9]+$/i.test(keyword)) return request.includes(keyword);
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|[^a-z0-9])${escaped}(?:$|[^a-z0-9])`, "i").test(request);
}
__name(keywordMatches, "keywordMatches");
function noFit() {
  return {
    recommendedProduct: null,
    reason: "No catalog keyword matched this request; no product is recommended.",
    fit: "none",
    freeOffer: null,
    paidOffer: null,
    connection: null,
    example: null,
    nextAction: "Review the current catalog at /products.json.",
    alternatives: catalog,
    healthCheck: null
  };
}
__name(noFit, "noFit");

// src/conversation-flow.ts
var SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1e3;
function advanceConversation(state, text, now = /* @__PURE__ */ new Date()) {
  const activeState = state && new Date(state.expiresAt).getTime() > now.getTime() ? state : null;
  if (activeState?.stage === "fit_confirmation") {
    return {
      nextState: null,
      status: "TASK_STATE_COMPLETED",
      message: "Thanks for the reply. Optional product questions include what service or capability you need, and what type of AI agent or business workflow may benefit. Do not provide names, contacts, or secrets. If another AI agent may need this guidance, share this Sales Bot's public Agent Card or the relevant MCP endpoint with it.",
      recommendation: null,
      includeSurvey: true
    };
  }
  const result = recommend(text);
  if (result.recommendedProduct) {
    return {
      nextState: nextState("fit_confirmation", now),
      status: "TASK_STATE_INPUT_REQUIRED",
      message: `Aegis Sales Bot matched your request to ${result.recommendedProduct.name}. ${result.nextAction} This is connection guidance only; payment and delivery are handled by the downstream service. Does Japan Rule fit your current task? Reply yes, no, or clarify what is missing.`,
      recommendation: result,
      includeSurvey: false
    };
  }
  return {
    nextState: nextState("qualification", now),
    status: "TASK_STATE_INPUT_REQUIRED",
    message: "Aegis Sales Bot could not match a published service yet. Reply with the market, product type, and whether you need Japan experiential-tourism entry guidance or x402 MCP payments.",
    recommendation: null,
    includeSurvey: false
  };
}
__name(advanceConversation, "advanceConversation");
function nextState(stage, now) {
  return { stage, expiresAt: new Date(now.getTime() + SESSION_TTL_MS).toISOString() };
}
__name(nextState, "nextState");

// src/a2a-conversation.ts
var OUTBOUND_STATE_KEY = "outbound_state";
var OUTBOUND_RESULT_KEY = "outbound_result";
var OUTBOUND_TTL_MS = 7 * 24 * 60 * 60 * 1e3;
var A2AConversation = class extends DurableObject {
  static {
    __name(this, "A2AConversation");
  }
  async advance(input) {
    const state = await this.ctx.storage.get("state");
    const turn = advanceConversation(state ?? null, input.text);
    if (turn.nextState) {
      await this.ctx.storage.put("state", turn.nextState);
      await this.ctx.storage.setAlarm(new Date(turn.nextState.expiresAt).getTime());
    } else {
      await this.ctx.storage.delete("state");
      await this.ctx.storage.deleteAlarm();
    }
    return turn;
  }
  async beginOutbound(input) {
    const state = {
      stage: "hearing_sent",
      peerId: input.peerId,
      proposal: input.proposal,
      expiresAt: new Date(Date.now() + OUTBOUND_TTL_MS).toISOString()
    };
    await this.ctx.storage.put(OUTBOUND_STATE_KEY, state);
    await this.ctx.storage.setAlarm(new Date(state.expiresAt).getTime());
  }
  async advanceOutbound(signal) {
    const state = await this.ctx.storage.get(OUTBOUND_STATE_KEY);
    if (!state || new Date(state.expiresAt).getTime() <= Date.now()) {
      return { status: "TASK_STATE_COMPLETED", message: "This outreach conversation has expired. You can start a new A2A task when you need service discovery.", includeSurvey: false };
    }
    if (signal === "interested" && state.stage === "hearing_sent") {
      await this.ctx.storage.put(OUTBOUND_STATE_KEY, { ...state, stage: "proposal_sent" });
      return { status: "TASK_STATE_INPUT_REQUIRED", message: `${state.proposal} Does this fit your current task? Reply with interested, not_interested, unsupported, or a consented survey.`, includeSurvey: false };
    }
    if (signal === "interested" || signal === "not_interested" || signal === "unsupported") {
      await this.ctx.storage.delete(OUTBOUND_STATE_KEY);
      await this.ctx.storage.put(OUTBOUND_RESULT_KEY, { peerId: typeof state.peerId === "string" ? state.peerId : "unknown", outcome: signal, expiresAt: state.expiresAt });
      await this.ctx.storage.deleteAlarm();
      await this.ctx.storage.setAlarm(new Date(state.expiresAt).getTime());
      return { status: "TASK_STATE_COMPLETED", message: "Thanks for the outcome. Optional product questions are included below.", includeSurvey: true };
    }
    return { status: "TASK_STATE_INPUT_REQUIRED", message: "Please reply with interested, not_interested, unsupported, or an explicitly consented survey so we can continue this A2A conversation.", includeSurvey: false };
  }
  async alarm() {
    await this.ctx.storage.delete("state");
    await this.ctx.storage.delete(OUTBOUND_STATE_KEY);
    await this.ctx.storage.delete(OUTBOUND_RESULT_KEY);
  }
};

// src/metrics.ts
function recordMetric(db, metricEvent, productId = "") {
  const date = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  return db.prepare(
    "INSERT INTO daily_metrics (event_date, event_name, product_id, total) VALUES (?, ?, ?, 1) ON CONFLICT(event_date, event_name, product_id) DO UPDATE SET total = total + 1"
  ).bind(date, metricEvent, productId).run().then(() => void 0).catch(() => {
    console.error(JSON.stringify({ event: "metric_write_failed", metricEvent, productId }));
  });
}
__name(recordMetric, "recordMetric");
function recordFunnelMetric(db, audience, stage, productId = "") {
  const date = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  return db.prepare(
    "INSERT INTO daily_funnel_metrics (event_date, audience, stage, product_id, total) VALUES (?, ?, ?, ?, 1) ON CONFLICT(event_date, audience, stage, product_id) DO UPDATE SET total = total + 1"
  ).bind(date, audience, stage, productId).run().then(() => void 0).catch(() => {
    console.error(JSON.stringify({ event: "funnel_metric_write_failed", audience, stage, productId }));
  });
}
__name(recordFunnelMetric, "recordFunnelMetric");
function recordSurveyResponses(db, submission) {
  const receivedAt = (/* @__PURE__ */ new Date()).toISOString();
  return db.batch(submission.answers.map((answer) => db.prepare(
    "INSERT INTO survey_responses (id, received_at, task_id, question_id, answer) VALUES (?, ?, ?, ?, ?)"
  ).bind(crypto.randomUUID(), receivedAt, submission.taskId, answer.questionId, answer.answer))).then(() => void 0).catch(() => {
    console.error(JSON.stringify({ event: "survey_write_failed", answerCount: submission.answers.length }));
  });
}
__name(recordSurveyResponses, "recordSurveyResponses");

// src/observation.ts
var INTERNAL_TEST_HEADER = "x-aegis-observation";
function observationAudience(request) {
  return request.headers.get(INTERNAL_TEST_HEADER) === "internal-test" ? "internal_test_declared" : "external_or_unknown";
}
__name(observationAudience, "observationAudience");

// src/referrals.ts
function recordReferralCandidate(db, submission) {
  const agentCardUrl = referralAgentCardUrl(submission);
  if (!agentCardUrl) return Promise.resolve();
  return db.prepare(
    "INSERT INTO referral_candidates (agent_card_url, source_task_id, received_at, status) VALUES (?, ?, ?, 'pending') ON CONFLICT(agent_card_url) DO NOTHING"
  ).bind(agentCardUrl, submission.taskId, (/* @__PURE__ */ new Date()).toISOString()).run().then(() => void 0).catch(() => {
    console.error(JSON.stringify({ event: "referral_candidate_write_failed" }));
  });
}
__name(recordReferralCandidate, "recordReferralCandidate");

// src/outreach.ts
var PRIMARY_REGISTRY_URL = "https://api.a2a-registry.org/public/agents?page=1&sort=newest";
var SECONDARY_REGISTRY_URL = "https://a2aregistry.org/api/agents?conformance=standard&limit=100&offset=0";
var BUSINESS_PROFILE = /commerce|commercial|payment|x402|marketplace|procurement|trade|retail|ecommerce|marketing|business|enterprise|sales|tourism|travel|hotel|booking|finance|financial|invoice|legal|insurance|logistics|freight|property|real estate/i;
var SELF_AGENT_CARD = "https://aegis-sales-bot.kadopi.workers.dev/.well-known/agent-card.json";
async function runDiscovery(db, enabled, fetcher = fetch) {
  if (enabled !== "true") return;
  let registryCandidateCount = 0;
  try {
    const registryResponse = await fetcher(PRIMARY_REGISTRY_URL);
    if (!registryResponse.ok) throw new Error(`registry_fetch_failed:${registryResponse.status}`);
    const registry = await registryResponse.json();
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
__name(runDiscovery, "runDiscovery");
function isRegistryAgent(value) {
  if (!isRecord2(value)) return false;
  return typeof value.id === "string" && typeof value.displayName === "string" && (typeof value.description === "string" || value.description === null) && (typeof value.targetAudience === "string" || value.targetAudience === null) && (typeof value.manifestUrl === "string" || value.manifestUrl === null) && (typeof value.visibility === "string" || value.visibility === null);
}
__name(isRegistryAgent, "isRegistryAgent");
async function qualifyTarget(candidate, fetcher) {
  if (candidate.visibility !== "public" || candidate.targetAudience !== "Business" || !candidate.manifestUrl) return null;
  if (candidate.manifestUrl === SELF_AGENT_CARD) return null;
  if (!isSafeHttpsUrl(candidate.manifestUrl)) return null;
  const cardResponse = await fetcher(candidate.manifestUrl);
  if (!cardResponse.ok) return null;
  const card = await cardResponse.json();
  if (!isPublicNoAuthCard(card)) return null;
  const endpointUrl = jsonRpcEndpoint(card);
  if (!endpointUrl || !isSafeHttpsUrl(endpointUrl)) return null;
  return { id: candidate.id, name: candidate.displayName, description: candidate.description, agentCardUrl: candidate.manifestUrl, endpointUrl };
}
__name(qualifyTarget, "qualifyTarget");
async function fetchSecondaryCandidates(fetcher) {
  try {
    const response = await fetcher(SECONDARY_REGISTRY_URL);
    if (!response.ok) return [];
    const directory = await response.json();
    return Array.isArray(directory.agents) ? directory.agents.filter(isExternalRegistryAgent).filter(isBusinessDirectoryAgent).slice(0, 20) : [];
  } catch {
    return [];
  }
}
__name(fetchSecondaryCandidates, "fetchSecondaryCandidates");
function isExternalRegistryAgent(value) {
  return isRecord2(value) && typeof value.id === "string" && typeof value.name === "string" && (typeof value.description === "string" || value.description === null) && (typeof value.wellKnownURI === "string" || value.wellKnownURI === null) && (typeof value.is_healthy === "boolean" || value.is_healthy === null);
}
__name(isExternalRegistryAgent, "isExternalRegistryAgent");
function isBusinessDirectoryAgent(agent) {
  if (agent.is_healthy !== true || !agent.wellKnownURI) return false;
  const skills = Array.isArray(agent.skills) ? agent.skills.flatMap((skill) => isRecord2(skill) && Array.isArray(skill.tags) ? skill.tags.filter((tag) => typeof tag === "string") : []) : [];
  const pricing = typeof agent.pricing === "string" ? agent.pricing : "";
  return BUSINESS_PROFILE.test([agent.name, agent.description ?? "", pricing, ...skills].join(" "));
}
__name(isBusinessDirectoryAgent, "isBusinessDirectoryAgent");
async function qualifySecondaryTarget(candidate, fetcher) {
  if (!candidate.wellKnownURI || !isSafeHttpsUrl(candidate.wellKnownURI)) return null;
  const cardResponse = await fetcher(candidate.wellKnownURI);
  if (!cardResponse.ok) return null;
  const card = await cardResponse.json();
  if (!isPublicNoAuthCard(card)) return null;
  const endpointUrl = jsonRpcEndpoint(card);
  if (!endpointUrl || !isSafeHttpsUrl(endpointUrl)) return null;
  return { id: `directory:${candidate.id}`, name: candidate.name, description: candidate.description, agentCardUrl: candidate.wellKnownURI, endpointUrl };
}
__name(qualifySecondaryTarget, "qualifySecondaryTarget");
function isPublicNoAuthCard(card) {
  return !Array.isArray(card.securityRequirements) || card.securityRequirements.length === 0;
}
__name(isPublicNoAuthCard, "isPublicNoAuthCard");
function jsonRpcEndpoint(card) {
  const entry = card.supportedInterfaces?.find((item) => item.protocolBinding === "JSONRPC" && item.protocolVersion === "1.0");
  return typeof entry?.url === "string" ? entry.url : null;
}
__name(jsonRpcEndpoint, "jsonRpcEndpoint");
function isSafeHttpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname !== "localhost" && !/^\d{1,3}(\.\d{1,3}){3}$/.test(url.hostname);
  } catch {
    return false;
  }
}
__name(isSafeHttpsUrl, "isSafeHttpsUrl");
async function queueCandidate(db, target, offer, source) {
  const result = await db.prepare(
    "INSERT INTO outreach_candidates (agent_card_url, target_id, target_name, endpoint_url, product_id, value_hypothesis, source, discovered_at, status) SELECT ?, ?, ?, ?, ?, ?, ?, ?, 'pending' WHERE NOT EXISTS (SELECT 1 FROM outreach_attempts WHERE agent_card_url = ?) ON CONFLICT(agent_card_url) DO NOTHING"
  ).bind(target.agentCardUrl, target.id, target.name, target.endpointUrl, offer.productId, offer.valueHypothesis, source, (/* @__PURE__ */ new Date()).toISOString(), target.agentCardUrl).run();
  return result.meta.changes === 1;
}
__name(queueCandidate, "queueCandidate");
function matchOffer(target) {
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
__name(matchOffer, "matchOffer");
async function recordOutreachRun(db, result, registryCandidateCount, targetId) {
  await db.prepare(
    "INSERT INTO outreach_runs (id, ran_at, result, registry_candidate_count, target_id) VALUES (?, ?, ?, ?, ?)"
  ).bind(crypto.randomUUID(), (/* @__PURE__ */ new Date()).toISOString(), result, registryCandidateCount, targetId ?? null).run();
}
__name(recordOutreachRun, "recordOutreachRun");
function findResponseSignal(value) {
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findResponseSignal(item);
      if (found) return found;
    }
    return null;
  }
  if (!isRecord2(value)) return null;
  if ("aegis_outreach_status" in value) {
    const status = value.aegis_outreach_status;
    if (isRecord2(status) && (status.outcome === "interested" || status.outcome === "not_interested" || status.outcome === "unsupported")) return status.outcome;
  }
  for (const item of Object.values(value)) {
    const found = findResponseSignal(item);
    if (found) return found;
  }
  return null;
}
__name(findResponseSignal, "findResponseSignal");
function isRecord2(value) {
  return typeof value === "object" && value !== null;
}
__name(isRecord2, "isRecord");

// src/index.ts
var VERSION = "0.2.0";
var jsonHeaders = { "content-type": "application/json; charset=utf-8", "x-content-type-options": "nosniff" };
var index_default = {
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
        name: "Aegis Sales Bot",
        version: VERSION,
        description: "Deterministic product discovery and connection guidance for AI agents.",
        endpoints: ["/health", "/products.json", "/recommend", "/a2a", "/.well-known/agent-card.json"]
      });
      return json({ error: "not_found" }, 404);
    } catch {
      track(ctx, env, request, "error");
      return json({ error: "internal_error" }, 500);
    }
  },
  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(runDiscovery(env.DB, env.OUTREACH_ENABLED));
  }
};
async function handleRecommendation(request, env, ctx) {
  let input;
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
  const result = recommend(query, env.AGENT_CARD_HEALTH_CHECK_URL);
  track(ctx, env, request, "recommendation", result.recommendedProduct?.id ?? "");
  if (result.recommendedProduct) track(ctx, env, request, "connection_guide", result.recommendedProduct.id);
  return json(result);
}
__name(handleRecommendation, "handleRecommendation");
async function handleA2ARequest(request, env, ctx) {
  let input;
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
  const response = taskId.startsWith("aegis-outreach-") ? a2aResponse(id, taskId, outboundTurn(await conversation.advanceOutbound(findResponseSignal(input) ?? signalFromText(text)))) : a2aResponse(id, taskId, await conversation.advance({ text }));
  track(ctx, env, request, "a2a_conversation");
  const survey = readSurveySubmission(input);
  if (survey) {
    for (const answer of survey.answers) track(ctx, env, request, "survey_response", answer.questionId);
    ctx.waitUntil(recordSurveyResponses(env.DB, survey));
    ctx.waitUntil(recordReferralCandidate(env.DB, survey));
  }
  return json(response);
}
__name(handleA2ARequest, "handleA2ARequest");
function signalFromText(text) {
  const value = text.trim().toLowerCase();
  if (/^(interested|yes|sounds good)\b/.test(value)) return "interested";
  if (/^(not_interested|no|not now)\b/.test(value)) return "not_interested";
  if (/^unsupported\b/.test(value)) return "unsupported";
  return null;
}
__name(signalFromText, "signalFromText");
function outboundTurn(turn) {
  return { nextState: null, status: turn.status, message: turn.message, recommendation: null, includeSurvey: turn.includeSurvey };
}
__name(outboundTurn, "outboundTurn");
function agentCard(origin) {
  return {
    name: "Aegis Sales Bot",
    description: "A deterministic, machine-readable catalog for AI agents to discover Aegis services, including a business-only Japan Experiential Tourism Entry Guide MCP. It gives an authorized business agent a free model-case preview before an optional x402 purchase unlocks source locations, contact routes, inquiry text, and an action plan from the downstream service.",
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
    limitations: ["The bot does not process payments or provide each product's service.", "The A2A endpoint keeps only a task stage for up to seven days to support a short qualification conversation. It stores survey answers only after explicit consent and does not retain message content. When outbound discovery is enabled, the scheduled worker records at most one newly qualified public, no-auth A2A endpoint per run. Contact requires a separate, target-specific approval."]
  };
}
__name(agentCard, "agentCard");
function track(ctx, env, request, event, productId = "") {
  ctx.waitUntil(recordMetric(env.DB, event, productId));
  if (event !== "error") ctx.waitUntil(recordFunnelMetric(env.DB, observationAudience(request), event, productId));
}
__name(track, "track");
function json(body, status = 200) {
  return Response.json(body, { status, headers: jsonHeaders });
}
__name(json, "json");
export {
  A2AConversation,
  index_default as default
};
//# sourceMappingURL=index.js.map
