import { DurableObject } from "cloudflare:workers";
import { advanceConversation, type ConversationTurn } from "./conversation-flow";

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

  async alarm(): Promise<void> {
    await this.ctx.storage.delete("state");
  }
}
