import { describe, expect, it } from "vitest";
import worker from "../src/index";

const db = { prepare: () => ({ bind: () => ({ run: async () => ({}) }) }) } as unknown as D1Database;
const env = { DB: db } as Env;
const ctx = { waitUntil: (promise: Promise<unknown>) => void promise } as ExecutionContext;
const incomingRequest = (input: RequestInfo, init?: RequestInit): Parameters<typeof worker.fetch>[0] => new Request(input, init) as Parameters<typeof worker.fetch>[0];

describe("public HTTP routes", () => {
  it("serves the catalog", async () => {
    const response = await worker.fetch(incomingRequest("https://example.test/products.json"), env, ctx);
    expect(response.status).toBe(200);
    expect((await response.json() as { products: unknown[] }).products).toHaveLength(3);
  });

  it("returns a JSON recommendation", async () => {
    const response = await worker.fetch(incomingRequest("https://example.test/recommend", { method: "POST", body: JSON.stringify({ request: "x402 USDC payment for MCP" }) }), env, ctx);
    expect(response.status).toBe(200);
    expect((await response.json() as { recommendedProduct: { id: string } }).recommendedProduct.id).toBe("x402-mcp-starter");
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
      skills: Array<{ tags: string[] }>;
    };
    expect(card.supportedInterfaces[0]).toEqual({ url: "https://example.test/recommend", protocolBinding: "urn:kadopi:aegis-sales-bot:recommend:1", protocolVersion: "1.0" });
    expect(card.defaultInputModes).toEqual(["application/json"]);
    expect(card.defaultOutputModes).toEqual(["application/json"]);
    expect(card.skills[0].tags).toContain("product-discovery");
  });
});
