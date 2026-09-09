import { describe, expect, it } from "vitest";
import { advanceConversation } from "../src/conversation-flow";

describe("A2A conversation flow", () => {
  it("keeps only a stage and expiry while waiting for fit confirmation", () => {
    const turn = advanceConversation(null, "I am an AI agent helping a business launch a food culture workshop tour in Japan", new Date("2026-09-09T00:00:00.000Z"));

    expect(turn.status).toBe("TASK_STATE_INPUT_REQUIRED");
    expect(turn.nextState).toEqual({ stage: "fit_confirmation", expiresAt: "2026-09-16T00:00:00.000Z" });
    expect(JSON.stringify(turn.nextState)).not.toContain("food culture");
    expect(turn.includeSurvey).toBe(false);
  });

  it("clears the conversation state and returns the consented survey prompt after a reply", () => {
    const turn = advanceConversation({ stage: "fit_confirmation", expiresAt: "2026-09-16T00:00:00.000Z" }, "Yes", new Date("2026-09-10T00:00:00.000Z"));

    expect(turn.status).toBe("TASK_STATE_COMPLETED");
    expect(turn.nextState).toBeNull();
    expect(turn.includeSurvey).toBe(true);
  });
});
