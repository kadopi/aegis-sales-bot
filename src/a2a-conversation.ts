import { DurableObject } from "cloudflare:workers";
import { advanceConversation, type ConversationTurn } from "./conversation-flow";

type OutboundSignal = "interested" | "not_interested" | "unsupported" | null;
type OutboundState = { stage: "hearing_sent" | "proposal_sent"; peerId: string; proposal: string; expiresAt: string };
type OutboundResult = { peerId: string; outcome: Exclude<OutboundSignal, null>; expiresAt: string };
type OutboundTurn = { status: "TASK_STATE_INPUT_REQUIRED" | "TASK_STATE_COMPLETED"; message: string; includeSurvey: boolean };
const OUTBOUND_STATE_KEY = "outbound_state";
const OUTBOUND_RESULT_KEY = "outbound_result";
const OUTBOUND_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export class A2AConversation extends DurableObject<Env> {
  async advance(input: { text: string }): Promise<ConversationTurn> {
    const state = await this.ctx.storage.get<ConversationTurn["nextState"]>("state");
    const turn = advanceConversation(state ?? null, input.text);
    if (turn.nextState) {
      await this.ctx.storage.put("state", turn.nextState);
      await this.ctx.storage.setAlarm(new Date(turn.nextState.expiresAt).getTime());
    } else {
      await this.ctx.storage.delete("state");
      await this.ctx.storage.deleteAlarm();
    }
    return turn;
  }

  async beginOutbound(input: { peerId: string; proposal: string }): Promise<void> {
    const state: OutboundState = {
      stage: "hearing_sent",
      peerId: input.peerId,
      proposal: input.proposal,
      expiresAt: new Date(Date.now() + OUTBOUND_TTL_MS).toISOString()
    };
    await this.ctx.storage.put(OUTBOUND_STATE_KEY, state);
    await this.ctx.storage.setAlarm(new Date(state.expiresAt).getTime());
  }

  async advanceOutbound(signal: OutboundSignal): Promise<OutboundTurn> {
    const state = await this.ctx.storage.get<OutboundState>(OUTBOUND_STATE_KEY);
    if (!state || new Date(state.expiresAt).getTime() <= Date.now()) {
      return { status: "TASK_STATE_COMPLETED", message: "This outreach conversation has expired. You can start a new A2A task when you need service discovery.", includeSurvey: false };
    }
    if (signal === "interested" && state.stage === "hearing_sent") {
      await this.ctx.storage.put(OUTBOUND_STATE_KEY, { ...state, stage: "proposal_sent" });
      return { status: "TASK_STATE_INPUT_REQUIRED", message: `${state.proposal} Does this fit your current task? Reply with interested, not_interested, unsupported, or a consented survey.`, includeSurvey: false };
    }
    if (signal === "interested" || signal === "not_interested" || signal === "unsupported") {
      await this.ctx.storage.delete(OUTBOUND_STATE_KEY);
      await this.ctx.storage.put<OutboundResult>(OUTBOUND_RESULT_KEY, { peerId: typeof state.peerId === "string" ? state.peerId : "unknown", outcome: signal, expiresAt: state.expiresAt });
      await this.ctx.storage.deleteAlarm();
      await this.ctx.storage.setAlarm(new Date(state.expiresAt).getTime());
      return { status: "TASK_STATE_COMPLETED", message: "Thanks for the outcome. Optional product questions are included below.", includeSurvey: true };
    }
    return { status: "TASK_STATE_INPUT_REQUIRED", message: "Please reply with interested, not_interested, unsupported, or an explicitly consented survey so we can continue this A2A conversation.", includeSurvey: false };
  }

  async alarm(): Promise<void> {
    await this.ctx.storage.delete("state");
    await this.ctx.storage.delete(OUTBOUND_STATE_KEY);
    await this.ctx.storage.delete(OUTBOUND_RESULT_KEY);
  }
}
