import { describe, expect, it } from "vitest";
import { runOutreach } from "../src/outreach";

type Statement = { sql: string; values: unknown[] };

function database() {
  const statements: Statement[] = [];
  return {
    statements,
    batch: async () => [],
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

  it("stores only an explicitly consented structured survey from a newly qualified public A2A agent", async () => {
    const db = database();
    const requests: Array<{ url: string; init?: RequestInit }> = [];
    const fetcher = async (url: RequestInfo | URL, init?: RequestInit) => {
      requests.push({ url: String(url), init });
      if (String(url).includes("api.a2a-registry.org")) return Response.json({ agents: [{
        id: "target-1", displayName: "Research Market", description: "Business discovery and research", targetAudience: "Business", visibility: "public", manifestUrl: "https://target.example/.well-known/agent-card.json"
      }] });
      if (String(url).includes("agent-card")) return Response.json({ securityRequirements: [], supportedInterfaces: [{ url: "https://target.example/a2a", protocolBinding: "JSONRPC", protocolVersion: "1.0" }] });
      return Response.json({ result: { message: { parts: [{ data: { aegis_survey: { consent: true, answers: [
        { questionId: "desired_service", answer: "Official source map" },
        { questionId: "desired_capability", answer: "Partner discovery" }
      ] } } }] } } });
    };

    await runOutreach(db, "true", fetcher as typeof fetch);

    expect(requests).toHaveLength(3);
    expect(requests[2].init?.method).toBe("POST");
    expect(JSON.stringify(requests[2].init?.body)).toContain("aegis_survey");
    expect(db.statements.filter((statement) => statement.sql.includes("outreach_attempts"))).toHaveLength(2);
    expect(db.statements.filter((statement) => statement.sql.includes("survey_responses"))).toHaveLength(2);
    expect(db.statements.some((statement) => JSON.stringify(statement.values).includes("Official source map"))).toBe(true);
    expect(db.statements.some((statement) => statement.sql.includes("outreach_runs") && JSON.stringify(statement.values).includes("survey_received"))).toBe(true);
  });

  it("records a no-candidate run without sending an A2A message", async () => {
    const db = database();
    const fetcher = async () => Response.json({ agents: [] });

    await runOutreach(db, "true", fetcher as typeof fetch);

    expect(db.statements).toHaveLength(1);
    expect(db.statements[0].sql).toContain("outreach_runs");
    expect(JSON.stringify(db.statements[0].values)).toContain("no_candidate");
  });
});
