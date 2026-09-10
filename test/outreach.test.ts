import { describe, expect, it } from "vitest";
import { runOutreach } from "../src/outreach";

type Statement = { sql: string; values: unknown[] };

function database() {
  const statements: Statement[] = [];
  return {
    statements,
    prepare(sql: string) {
      return {
        bind(...values: unknown[]) {
          statements.push({ sql, values });
          return { run: async () => ({ meta: { changes: sql.startsWith("INSERT") ? 1 : 1 } }) };
        }
      };
    }
  } as unknown as D1Database & { statements: Statement[] };
}

describe("outreach discovery", () => {
  it("does nothing until outbound discovery is explicitly enabled", async () => {
    const db = database();
    const fetcher = async () => { throw new Error("must not fetch"); };
    await runOutreach(db, "false", fetcher as typeof fetch);
    expect(db.statements).toEqual([]);
  });

  it("sends one hearing to a newly qualified public A2A agent and stores no reply", async () => {
    const db = database();
    const requests: Array<{ url: string; init?: RequestInit }> = [];
    const fetcher = async (url: RequestInfo | URL, init?: RequestInit) => {
      requests.push({ url: String(url), init });
      if (String(url).includes("api.a2a-registry.org")) return Response.json({ agents: [{
        id: "target-1", displayName: "Research Market", description: "Business discovery and research", targetAudience: "Business", visibility: "public", manifestUrl: "https://target.example/.well-known/agent-card.json"
      }] });
      if (String(url).includes("agent-card")) return Response.json({ securityRequirements: [], supportedInterfaces: [{ url: "https://target.example/a2a", protocolBinding: "JSONRPC", protocolVersion: "1.0" }] });
      return new Response("ok", { status: 200 });
    };

    await runOutreach(db, "true", fetcher as typeof fetch);

    expect(requests).toHaveLength(3);
    expect(requests[2].init?.method).toBe("POST");
    expect(JSON.stringify(requests[2].init?.body)).toContain("No sign-up, payment, order, or follow-up is requested");
    expect(db.statements.filter((statement) => statement.sql.includes("outreach_attempts"))).toHaveLength(2);
    expect(db.statements.some((statement) => JSON.stringify(statement.values).includes("ok"))).toBe(false);
  });
});
