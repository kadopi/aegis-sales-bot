import { describe, expect, it } from "vitest";
import { recommend } from "../src/recommend";

describe("recommend", () => {
  it("recommends Japan Rule for ecommerce return-policy research", () => {
    const result = recommend("日本向けECの通販広告と返品条件を調べたい");
    expect(result.fit).toBe("high");
    expect(result.recommendedProduct?.id).toBe("japan-rulewatch");
  });

  it("describes Japan tourism entry guidance with the Iya pack as its first offering", () => {
    const result = recommend("祖谷で英語のそば打ち体験を検討している。観光サービスの公式根拠を準備したい");
    expect(result.fit).toBe("high");
    expect(result.recommendedProduct?.id).toBe("japan-rulewatch");
    expect(result.paidOffer).toContain("5 USDC");
    expect(result.paidOffer).toContain("jp-tokushima-miyoshi-iya-soba");
    expect(result.paidOffer).toContain("Business-only Japan Experiential Tourism Entry Guide information");
    expect(result.paidOffer).toContain("Iya, Tokushima six-person soba-workshop model case");
    expect(result.paidOffer).toContain("official-source locations");
    expect(result.paidOffer).toContain("published contact routes");
    expect(result.paidOffer).toContain("not a workshop ticket");
    expect(result.connection?.url).toBe("https://japan-rulewatch-mcp-mainnet.kadopi.workers.dev/mcp");
  });

  it("recommends Japan Rule for an English business-agent entry query", () => {
    const result = recommend("I am an AI agent helping a business launch a food culture workshop tour in Japan");
    expect(result.fit).toBe("high");
    expect(result.recommendedProduct?.id).toBe("japan-rulewatch");
    expect(result.nextAction).toContain("search_entry_cases");
  });

  it("recommends x402 MCP Starter for USDC MCP payments", () => {
    const result = recommend("I need USDC payment for my MCP tools with x402");
    expect(result.fit).toBe("high");
    expect(result.recommendedProduct?.id).toBe("x402-mcp-starter");
  });

  it("recommends Agent Card Health Check for A2A connection readiness", () => {
    const result = recommend("I need to check my A2A Agent Card endpoint and authentication before connecting another agent");
    expect(result.fit).toBe("high");
    expect(result.recommendedProduct?.id).toBe("agent-card-health-check");
    expect(result.connection?.url).toBe("https://agent-card-health-check.kadopi.workers.dev/mcp");
    expect(result.nextAction).toContain("diagnose_agent_card");
  });

  it("lists the Integration Kit as coming soon without inventing a checkout URL", () => {
    const result = recommend("I need an x402 integration kit for a paid Cloudflare Workers MCP tool");
    expect(result.fit).toBe("high");
    expect(result.recommendedProduct?.id).toBe("x402-mcp-integration-kit");
    expect(result.recommendedProduct?.status).toBe("coming-soon");
    expect(result.paidOffer).toContain("$19 USD");
    expect(result.connection).toBeNull();
    expect(result.nextAction).toContain("Gumroad");
  });

  it("does not force a recommendation for unrelated work", () => {
    const result = recommend("Plan a team offsite lunch menu");
    expect(result.fit).toBe("none");
    expect(result.recommendedProduct).toBeNull();
    expect(result.healthCheck).toBeNull();
  });

  it("adds an optional Health Check demo only for a recommended product and valid HTTPS URL", () => {
    const result = recommend("I need USDC payment for my MCP tools with x402", "https://health-check.example/mcp");
    expect(result.healthCheck).toMatchObject({
      service: "agent-card-health-check",
      mode: "optional_demo",
      mcpUrl: "https://health-check.example/mcp",
      tool: "diagnose_agent_card",
      offer: { name: "接続準備チェック", price: "無料・一回" },
      requiresUserAuthorization: true
    });
    expect(result.healthCheck?.message).toContain("代理実行しません");
    expect(recommend("I need USDC payment for my MCP tools with x402", "http://health-check.example/mcp").healthCheck).toBeNull();
  });

  it("does not match English keywords inside unrelated words", () => {
    expect(recommend("Create a project database schema").fit).toBe("none");
    expect(recommend("Security architecture review").fit).toBe("none");
  });
});
