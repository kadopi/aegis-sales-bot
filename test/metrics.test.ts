import { describe, expect, it } from "vitest";
import { recordFunnelMetric } from "../src/metrics";

describe("funnel metrics", () => {
  it("stores only the declared audience, stage, and product identifier in the daily aggregate", async () => {
    let statement = "";
    let values: unknown[] = [];
    const db = {
      prepare: (sql: string) => ({
        bind: (...bound: unknown[]) => ({
          run: async () => {
            statement = sql;
            values = bound;
            return {};
          },
        }),
      }),
    } as unknown as D1Database;

    await recordFunnelMetric(db, "internal_test_declared", "a2a_conversation", "japan-rulewatch");

    expect(statement).toContain("daily_funnel_metrics");
    expect(values.slice(1)).toEqual(["internal_test_declared", "a2a_conversation", "japan-rulewatch"]);
  });
});
