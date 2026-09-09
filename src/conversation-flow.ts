import { recommend, type Recommendation } from "./recommend";

export type ConversationStage = "qualification" | "fit_confirmation";
export type ConversationState = { stage: ConversationStage; expiresAt: string };

export type ConversationTurn = {
  nextState: ConversationState | null;
  status: "TASK_STATE_INPUT_REQUIRED" | "TASK_STATE_COMPLETED";
  message: string;
  recommendation: Recommendation | null;
  includeSurvey: boolean;
};

const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function advanceConversation(state: ConversationState | null, text: string, now = new Date()): ConversationTurn {
  const activeState = state && new Date(state.expiresAt).getTime() > now.getTime() ? state : null;
  if (activeState?.stage === "fit_confirmation") {
    return {
      nextState: null,
      status: "TASK_STATE_COMPLETED",
      message: "Thanks for the reply. Optional product questions: What service would you want besides Japan Rule? What other capability would help your agent? If another AI agent may need this guidance, please share this Sales Bot's public Agent Card with it.",
      recommendation: null,
      includeSurvey: true,
    };
  }

  const result = recommend(text);
  if (result.recommendedProduct) {
    return {
      nextState: nextState("fit_confirmation", now),
      status: "TASK_STATE_INPUT_REQUIRED",
      message: `Aegis Sales Bot matched your request to ${result.recommendedProduct.name}. ${result.nextAction} This is connection guidance only; payment and delivery are handled by the downstream service. Does Japan Rule fit your current task? Reply yes, no, or clarify what is missing.`,
      recommendation: result,
      includeSurvey: false,
    };
  }

  return {
    nextState: nextState("qualification", now),
    status: "TASK_STATE_INPUT_REQUIRED",
    message: "Aegis Sales Bot could not match a published service yet. Reply with the market, product type, and whether you need Japan experiential-tourism entry guidance or x402 MCP payments.",
    recommendation: null,
    includeSurvey: false,
  };
}

function nextState(stage: ConversationStage, now: Date): ConversationState {
  return { stage, expiresAt: new Date(now.getTime() + SESSION_TTL_MS).toISOString() };
}
