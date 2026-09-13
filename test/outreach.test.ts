import { describe, expect, it } from "vitest";
import { hearingTextFor, runDiscovery, runOutreach } from "../src/outreach";

type Statement = { sql: string; values: unknown[] };

function database(referral: unknown = null) {
  const statements: Statement[] = [];
  return {
    statements,
    batch: async () => [],
    prepare(sql: string) {
      return {
        first: async () => referral,
        bind(...values: unknown[]) {
          statements.push({ sql, values });
          return { run: async () => ({ meta: { changes: sql.startsWith("INSERT") ? 1 : 1 } }), first: async () => null };
        }
      };
    }
  } as unknown as D1Database & { statements: Statement[] };
}

function conversations() {
  const events: Array<{ method: string; proposal?: string; signal?: string | null }> = [];
  return {
    events,
    getByName() {
      return {
        beginOutbound: async ({ proposal }: { peerId: string; proposal: string }) => { events.push({ method: "begin", proposal }); },
        advanceOutbound: async (signal: string | null) => {
          events.push({ method: "advance", signal });
          return { status: "TASK_STATE_INPUT_REQUIRED" as const, message: "Personalized proposal", includeSurvey: false };
        }
      };
    }
  };
}

describe("outreach discovery", () => {
  it("selects a relevant opening from the target's public Agent Card description", () => {
    expect(hearingTextFor("Travel Agent", "Hotel booking and tourism planning")).toContain("Japan Rule MCP");
    expect(hearingTextFor("Commerce Agent", "Marketplace payments and procurement")).toContain("x402-compatible");
    expect(hearingTextFor("Developer Agent", "MCP workflow automation")).toContain("A2A connection readiness");
    expect(hearingTextFor("Research Agent", "General business intelligence")).toContain("discovery interview");
  });

  it("does nothing until outbound discovery is explicitly enabled", async () => {
    const db = database();
    const outbound = conversations();
    const fetcher = async () => { throw new Error("must not fetch"); };
    await runOutreach(db, "false", outbound, fetcher as typeof fetch);
    expect(db.statements).toEqual([]);
  });

  it("stores only an explicitly consented structured survey from a newly qualified public A2A agent", async () => {
    const db = database();
    const outbound = conversations();
    const requests: Array<{ url: string; init?: RequestInit }> = [];
    const fetcher = async (url: RequestInfo | URL, init?: RequestInit) => {
      requests.push({ url: String(url), init });
      if (String(url).includes("api.a2a-registry.org")) return Response.json({ agents: [{
        id: "target-1", displayName: "Workflow Helper", description: "Workflow automation for commercial teams", targetAudience: "Business", visibility: "public", manifestUrl: "https://target.example/.well-known/agent-card.json"
      }] });
      if (String(url).includes("agent-card")) return Response.json({ securityRequirements: [], supportedInterfaces: [{ url: "https://target.example/a2a", protocolBinding: "JSONRPC", protocolVersion: "1.0" }] });
      return Response.json({ result: { message: { parts: [{ data: { aegis_outreach_status: { outcome: "interested" }, aegis_survey: { consent: true, answers: [
        { questionId: "desired_service", answer: "Official source map" },
        { questionId: "desired_capability", answer: "Partner discovery" },
        { questionId: "referral_domain", answer: "Travel workflow agents" }
      ] } } }] } } });
    };

    await runOutreach(db, "true", outbound, fetcher as typeof fetch);

    expect(requests).toHaveLength(4);
    expect(requests[2].init?.method).toBe("POST");
    expect(JSON.stringify(requests[2].init?.body)).toContain("aegis_survey");
    expect(JSON.stringify(requests[2].init?.body)).toContain("referral_agent_card_url");
    expect(JSON.stringify(requests[2].init?.body)).toContain("A2A connection readiness");
    expect(JSON.stringify(requests[3].init?.body)).toContain("Personalized proposal");
    expect(outbound.events).toEqual([{ method: "begin", proposal: expect.stringContaining("Agent Card Health Check") }, { method: "advance", signal: "interested" }]);
    expect(db.statements.filter((statement) => statement.sql.includes("outreach_attempts"))).toHaveLength(2);
    expect(db.statements.filter((statement) => statement.sql.includes("survey_responses"))).toHaveLength(3);
    expect(db.statements.some((statement) => JSON.stringify(statement.values).includes("Official source map"))).toBe(true);
    expect(db.statements.some((statement) => statement.sql.includes("response_signal") && JSON.stringify(statement.values).includes("interested"))).toBe(true);
    expect(db.statements.some((statement) => statement.sql.includes("outreach_runs") && JSON.stringify(statement.values).includes("survey_received"))).toBe(true);
  });

  it("uses a healthy commercial candidate from the secondary directory after the Business registry has no candidate", async () => {
    const db = database();
    const outbound = conversations();
    const requests: Array<{ url: string; init?: RequestInit }> = [];
    const fetcher = async (url: RequestInfo | URL, init?: RequestInit) => {
      requests.push({ url: String(url), init });
      if (String(url).includes("api.a2a-registry.org")) return Response.json({ agents: [] });
      if (String(url).includes("a2aregistry.org/api/agents")) return Response.json({ agents: [{
        id: "directory-1", name: "Commercial Workflow Agent", description: "Marketplace payments for business teams", wellKnownURI: "https://directory-target.example/.well-known/agent-card.json", is_healthy: true,
        skills: [{ tags: ["commerce", "payment"] }], pricing: null
      }] });
      if (String(url).includes("directory-target.example/.well-known")) return Response.json({ securityRequirements: [], supportedInterfaces: [{ url: "https://directory-target.example/a2a", protocolBinding: "JSONRPC", protocolVersion: "1.0" }] });
      return Response.json({ result: {} });
    };

    await runOutreach(db, "true", outbound, fetcher as typeof fetch);

    expect(requests.map((request) => request.url)).toEqual([
      expect.stringContaining("api.a2a-registry.org"),
      expect.stringContaining("a2aregistry.org/api/agents"),
      "https://directory-target.example/.well-known/agent-card.json",
      "https://directory-target.example/a2a"
    ]);
    expect(db.statements.some((statement) => JSON.stringify(statement.values).includes("directory:directory-1"))).toBe(true);
  });

  it("records a qualified commercial directory candidate without sending an A2A message", async () => {
    const db = database();
    const requests: Array<{ url: string; init?: RequestInit }> = [];
    const fetcher = async (url: RequestInfo | URL, init?: RequestInit) => {
      requests.push({ url: String(url), init });
      if (String(url).includes("api.a2a-registry.org")) return Response.json({ agents: [] });
      if (String(url).includes("a2aregistry.org/api/agents")) return Response.json({ agents: [{
        id: "directory-1", name: "Commercial Workflow Agent", description: "Marketplace payments for business teams", wellKnownURI: "https://directory-target.example/.well-known/agent-card.json", is_healthy: true,
        skills: [{ tags: ["commerce", "payment"] }], pricing: null
      }] });
      return Response.json({ securityRequirements: [], supportedInterfaces: [{ url: "https://directory-target.example/a2a", protocolBinding: "JSONRPC", protocolVersion: "1.0" }] });
    };

    await runDiscovery(db, "true", fetcher as typeof fetch);

    expect(requests).toHaveLength(3);
    expect(requests.some((request) => request.init?.method === "POST")).toBe(false);
    expect(db.statements.some((statement) => statement.sql.includes("outreach_candidates") && JSON.stringify(statement.values).includes("a2a_directory"))).toBe(true);
    expect(db.statements.some((statement) => JSON.stringify(statement.values).includes("x402-mcp-starter"))).toBe(true);
    expect(db.statements.some((statement) => JSON.stringify(statement.values).includes("programmatic USDC payment route"))).toBe(true);
    expect(db.statements.some((statement) => statement.sql.includes("outreach_runs") && JSON.stringify(statement.values).includes("candidate_found"))).toBe(true);
  });

  it("does not queue a public business agent whose published purpose does not match a product", async () => {
    const db = database();
    const fetcher = async (url: RequestInfo | URL) => {
      if (String(url).includes("api.a2a-registry.org")) return Response.json({ agents: [{
        id: "general-1", displayName: "General Business Agent", description: "General office assistance", targetAudience: "Business", visibility: "public", manifestUrl: "https://general.example/.well-known/agent-card.json"
      }] });
      if (String(url).includes("general.example")) return Response.json({ securityRequirements: [], supportedInterfaces: [{ url: "https://general.example/a2a", protocolBinding: "JSONRPC", protocolVersion: "1.0" }] });
      return Response.json({ agents: [] });
    };

    await runDiscovery(db, "true", fetcher as typeof fetch);

    expect(db.statements.some((statement) => statement.sql.includes("outreach_candidates"))).toBe(false);
    expect(db.statements.some((statement) => JSON.stringify(statement.values).includes("no_candidate"))).toBe(true);
  });

  it("records a no-candidate run without sending an A2A message", async () => {
    const db = database();
    const outbound = conversations();
    const fetcher = async () => Response.json({ agents: [] });

    await runOutreach(db, "true", outbound, fetcher as typeof fetch);

    expect(db.statements).toHaveLength(1);
    expect(db.statements[0].sql).toContain("outreach_runs");
    expect(JSON.stringify(db.statements[0].values)).toContain("no_candidate");
  });

  it("prioritizes a referred public Agent Card before registry discovery", async () => {
    const db = database({ agentCardUrl: "https://referred.example/.well-known/agent-card.json", sourceTaskId: "referral-task" });
    const outbound = conversations();
    const requests: string[] = [];
    const fetcher = async (url: RequestInfo | URL) => {
      requests.push(String(url));
      if (String(url).includes("agent-card")) return Response.json({ name: "Referred Agent", description: "Travel planning", securityRequirements: [], supportedInterfaces: [{ url: "https://referred.example/a2a", protocolBinding: "JSONRPC", protocolVersion: "1.0" }] });
      return Response.json({ result: {} });
    };

    await runOutreach(db, "true", outbound, fetcher as typeof fetch);

    expect(requests).toEqual(["https://referred.example/.well-known/agent-card.json", "https://referred.example/a2a"]);
    expect(db.statements.some((statement) => statement.sql.includes("referral_candidates") && JSON.stringify(statement.values).includes("contacted"))).toBe(true);
    expect(db.statements.some((statement) => statement.sql.includes("outreach_attempts") && JSON.stringify(statement.values).includes("referral:https://referred.example/.well-known/agent-card.json"))).toBe(true);
  });
});
