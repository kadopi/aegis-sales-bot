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
    expect(result.paidOffer).toContain("日本の観光参入ガイド情報の提供");
    expect(result.paidOffer).toContain("第一弾");
    expect(result.connection?.url).toBe("https://japan-rulewatch-mcp-mainnet.kadopi.workers.dev/mcp");
  });

  it("recommends x402 MCP Starter for USDC MCP payments", () => {
    const result = recommend("I need USDC payment for my MCP tools with x402");
    expect(result.fit).toBe("high");
    expect(result.recommendedProduct?.id).toBe("x402-mcp-starter");
  });

  it("does not force a recommendation for unrelated work", () => {
    const result = recommend("Plan a team offsite lunch menu");
    expect(result.fit).toBe("none");
    expect(result.recommendedProduct).toBeNull();
  });

  it("does not match English keywords inside unrelated words", () => {
    expect(recommend("Create a project database schema").fit).toBe("none");
    expect(recommend("Security architecture review").fit).toBe("none");
  });
});
