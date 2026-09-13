import { describe, expect, it } from "vitest";
import worker from "../src/index";
import { readSurveySubmission } from "../src/a2a";
import { advanceConversation, type ConversationState } from "../src/conversation-flow";
import { observationAudience } from "../src/observation";

const db = { prepare: () => ({ bind: () => ({ run: async () => ({}) }) }) } as unknown as D1Database;
const conversationStates = new Map<string, ConversationState | null>();
const conversations = {
  getByName: (taskId: string) => ({
    advance: async ({ text }: { text: string }) => {
      const turn = advanceConversation(conversationStates.get(taskId) ?? null, text);
      conversationStates.set(taskId, turn.nextState);
      return turn;
    },
    advanceOutbound: async (signal: "interested" | "not_interested" | "unsupported" | null) => {
      if (signal === "interested") {
        return { status: "TASK_STATE_INPUT_REQUIRED" as const, message: "Personalized proposal for this agent.", includeSurvey: false };
      }
      return { status: "TASK_STATE_COMPLETED" as const, message: "Outcome recorded.", includeSurvey: true };
    },
  }),
};
const env = { DB: db, A2A_CONVERSATIONS: conversations } as unknown as Env;
const ctx = { waitUntil: (promise: Promise<unknown>) => void promise } as ExecutionContext;
const incomingRequest = (input: RequestInfo, init?: RequestInit): Parameters<typeof worker.fetch>[0] => new Request(input, init) as Parameters<typeof worker.fetch>[0];
type A2AResponse = {
  result: {
    task: {
      status: { state: string; message: { parts: Array<{ text: string }> } };
      artifacts: Array<{ name: string; parts: Array<{ data: { recommendedProduct?: { id: string }; questions?: Array<{ question_id: string; text: string }> } }> }>;
    };
  };
};

describe("public HTTP routes", () => {
  it("labels only an explicit internal-test header as an internal observation", () => {
    expect(observationAudience(new Request("https://example.test/products.json", { headers: { "x-aegis-observation": "internal-test" } }))).toBe("internal_test_declared");
    expect(observationAudience(new Request("https://example.test/products.json"))).toBe("external_or_unknown");
  });

  it("serves the catalog", async () => {
    const response = await worker.fetch(incomingRequest("https://example.test/products.json"), env, ctx);
    expect(response.status).toBe(200);
    const products = (await response.json() as { products: Array<{ id: string; status: string; connectionUrl: string | null }> }).products;
    expect(products).toHaveLength(5);
    expect(products.find((product) => product.id === "x402-mcp-integration-kit")).toMatchObject({ status: "coming-soon", connectionUrl: null });
    expect(products.find((product) => product.id === "agent-card-health-check")).toMatchObject({ status: "public", connectionUrl: "https://agent-card-health-check.kadopi.workers.dev/mcp" });
  });

  it("serves a concise AI discovery page for each public product", async () => {
    const japanRule = await worker.fetch(incomingRequest("https://example.test/products/japan-rulewatch"), env, ctx);
    expect(japanRule.status).toBe(200);
    expect(await japanRule.json()).toMatchObject({
      id: "japan-rulewatch",
      connection: { url: "https://japan-rulewatch-mcp-mainnet.kadopi.workers.dev/mcp" },
      firstTool: "search_entry_cases",
      paidAccess: { price: "5 USDC, one-time" },
      discovery: {
        agentCard: "https://japan-rulewatch-mcp-mainnet.kadopi.workers.dev/.well-known/agent-card.json",
        mcpRegistry: { status: "published" },
        clawHubSkill: { status: "published", url: "https://clawhub.ai/kadopi/japan-rulewatch" }
      }
    });

    const x402Starter = await worker.fetch(incomingRequest("https://example.test/products/x402-mcp-starter"), env, ctx);
    expect(await x402Starter.json()).toMatchObject({ id: "x402-mcp-starter", firstTool: "validate_x402_config", paidAccess: null, discovery: { mcpRegistry: { status: "published" }, clawHubSkill: { status: "prepared", url: null } } });

    const healthCheck = await worker.fetch(incomingRequest("https://example.test/products/agent-card-health-check"), env, ctx);
    expect(await healthCheck.json()).toMatchObject({ id: "agent-card-health-check", firstTool: "diagnose_agent_card", paidAccess: null, discovery: { mcpRegistry: { status: "prepared" }, clawHubSkill: { status: "published", url: "https://clawhub.ai/kadopi/agent-card-health-check" } } });
  });

  it("returns 404 for an unknown product discovery page", async () => {
    const response = await worker.fetch(incomingRequest("https://example.test/products/unknown"), env, ctx);
    expect(response.status).toBe(404);
    expect(await response.json()).toEqual({ error: "product_not_found" });
  });

  it("returns a JSON recommendation", async () => {
    const response = await worker.fetch(incomingRequest("https://example.test/recommend", { method: "POST", body: JSON.stringify({ request: "x402 USDC payment for MCP" }) }), env, ctx);
    expect(response.status).toBe(200);
    expect((await response.json() as { recommendedProduct: { id: string } }).recommendedProduct.id).toBe("x402-mcp-starter");
  });

  it("adds the optional demo guide without calling the Health Check service", async () => {
    const demoEnv = { ...env, AGENT_CARD_HEALTH_CHECK_URL: "https://health-check.example/mcp" } as Env;
    const response = await worker.fetch(incomingRequest("https://example.test/recommend", { method: "POST", body: JSON.stringify({ request: "x402 USDC payment for MCP" }) }), demoEnv, ctx);
    const payload = await response.json() as { healthCheck: { mode: string; mcpUrl: string; offer: { price: string } } | null };
    expect(response.status).toBe(200);
    expect(payload.healthCheck).toEqual(expect.objectContaining({
      mode: "optional_demo",
      mcpUrl: "https://health-check.example/mcp",
      offer: expect.objectContaining({ price: "無料・一回" }),
    }));
  });

  it("rejects malformed recommendation payloads", async () => {
    const response = await worker.fetch(incomingRequest("https://example.test/recommend", { method: "POST", body: "not json" }), env, ctx);
    expect(response.status).toBe(400);
  });

  it("returns a JSON validation error for a valid JSON null payload", async () => {
    const response = await worker.fetch(incomingRequest("https://example.test/recommend", { method: "POST", body: "null" }), env, ctx);
    expect(response.status).toBe(400);
    expect(response.headers.get("content-type")).toContain("application/json");
    expect(await response.json()).toEqual({ error: "request_or_purpose_must_be_a_nonempty_string_of_at_most_2000_characters" });
  });

  it("declares the custom JSON recommendation binding in its agent card", async () => {
    const response = await worker.fetch(incomingRequest("https://example.test/.well-known/agent-card.json"), env, ctx);
    const card = await response.json() as {
      supportedInterfaces: Array<{ url: string; protocolBinding: string }>;
      defaultInputModes: string[];
      defaultOutputModes: string[];
      description: string;
      skills: Array<{ tags: string[]; examples: string[] }>;
    };
    expect(card.supportedInterfaces[0]).toEqual({ url: "https://example.test/a2a", protocolBinding: "JSONRPC", protocolVersion: "1.0" });
    expect(card.supportedInterfaces[1]).toEqual({ url: "https://example.test/recommend", protocolBinding: "urn:kadopi:aegis-sales-bot:recommend:1", protocolVersion: "1.0" });
    expect(card.defaultInputModes).toEqual(["application/json"]);
    expect(card.defaultOutputModes).toEqual(["application/json"]);
    expect(card.skills[0].tags).toContain("a2a");
    expect(card.skills[0].tags).toContain("x402");
    expect(card.skills[0].examples).toContain("I am an AI agent helping a business prepare to launch an experiential tour in Japan");
    expect(card.description).toContain("business-only Japan Experiential Tourism Entry Guide MCP");
  });

  it("runs an A2A qualification turn for Japan tourism", async () => {
    const response = await worker.fetch(incomingRequest("https://example.test/a2a", {
      method: "POST",
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "SendMessage", params: { message: { messageId: "m-1", taskId: "tourism-task", role: "ROLE_USER", parts: [{ text: "I am an AI agent helping a business launch a food culture workshop tour in Japan" }] } } })
    }), env, ctx);
    const payload = await response.json() as A2AResponse;
    expect(response.status).toBe(200);
    expect(payload.result.task.status.state).toBe("TASK_STATE_INPUT_REQUIRED");
    expect(payload.result.task.status.message.parts[0].text).toContain("Japan Rule");
    expect(payload.result.task.status.message.parts[0].text).toContain("Does Japan Rule fit your current task?");
    expect(payload.result.task.artifacts[0].parts[0].data.recommendedProduct?.id).toBe("japan-rulewatch");

    const followUp = await worker.fetch(incomingRequest("https://example.test/a2a", {
      method: "POST",
      body: JSON.stringify({ jsonrpc: "2.0", id: 2, method: "SendMessage", params: { message: { messageId: "m-2", taskId: "tourism-task", role: "ROLE_USER", parts: [{ text: "Yes, it fits." }] } } })
    }), env, ctx);
    const followUpPayload = await followUp.json() as A2AResponse;
    expect(followUpPayload.result.task.status.state).toBe("TASK_STATE_COMPLETED");
    expect(followUpPayload.result.task.artifacts[0].name).toBe("optional-product-survey");
    expect(followUpPayload.result.task.artifacts[0].parts[0].data.questions?.map((question) => question.question_id)).toContain("referral_domain");
  });

  it("asks an A2A caller to qualify an unmatched request", async () => {
    const response = await worker.fetch(incomingRequest("https://example.test/a2a", {
      method: "POST",
      body: JSON.stringify({ jsonrpc: "2.0", id: "q-1", method: "SendMessage", params: { message: { messageId: "m-2", role: "ROLE_USER", parts: [{ text: "Hello, I have a possible partnership" }] } } })
    }), env, ctx);
    const payload = await response.json() as { result: { task: { status: { state: string } } } };
    expect(payload.result.task.status.state).toBe("TASK_STATE_INPUT_REQUIRED");
  });

  it("continues an outbound A2A task with the same task ID", async () => {
    const response = await worker.fetch(incomingRequest("https://example.test/a2a", {
      method: "POST",
      body: JSON.stringify({ jsonrpc: "2.0", id: "outbound-1", method: "SendMessage", params: { message: { messageId: "m-outbound-1", taskId: "aegis-outreach-peer-1", role: "ROLE_USER", parts: [{ text: "interested" }] } } })
    }), env, ctx);
    const payload = await response.json() as A2AResponse;
    expect(response.status).toBe(200);
    expect(payload.result.task.status.state).toBe("TASK_STATE_INPUT_REQUIRED");
    expect(payload.result.task.status.message.parts[0].text).toContain("Personalized proposal");
  });

  it("accepts only explicitly consented survey answers with known question IDs", () => {
    const submission = readSurveySubmission({
      jsonrpc: "2.0",
      params: {
        message: { taskId: "task-1" },
        metadata: { survey: { consent: true, answers: [
          { questionId: "desired_service", answer: "Tour operator discovery" },
          { questionId: "desired_capability", answer: "A2A referrals" },
          { questionId: "referral_domain", answer: "Travel planning agents" },
          { questionId: "referral_agent_card_url", answer: "https://referral.example/.well-known/agent-card.json" },
        ] } },
      },
    });
    expect(submission?.taskId).toBe("task-1");
    expect(submission?.answers).toHaveLength(4);
    expect(readSurveySubmission({ params: { message: {}, metadata: { survey: { consent: true, answers: [{ questionId: "referral_agent_card_url", answer: "https://referral.example/card" }] } } } })).not.toBeNull();
    expect(readSurveySubmission({ params: { message: {}, metadata: { survey: { consent: false, answers: [] } } } })).toBeNull();
  });
});
