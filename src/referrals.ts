import { referralAgentCardUrl, type SurveySubmission } from "./a2a";

export type ReferralCandidate = { agentCardUrl: string; sourceTaskId: string };

export function recordReferralCandidate(db: D1Database, submission: SurveySubmission): Promise<void> {
  const agentCardUrl = referralAgentCardUrl(submission);
  if (!agentCardUrl) return Promise.resolve();
  return db.prepare(
    "INSERT INTO referral_candidates (agent_card_url, source_task_id, received_at, status) VALUES (?, ?, ?, 'pending') ON CONFLICT(agent_card_url) DO NOTHING"
  ).bind(agentCardUrl, submission.taskId, new Date().toISOString()).run().then(() => undefined).catch(() => {
    console.error(JSON.stringify({ event: "referral_candidate_write_failed" }));
  });
}

export async function nextReferralCandidate(db: D1Database): Promise<ReferralCandidate | null> {
  const row = await db.prepare(
    "SELECT agent_card_url AS agentCardUrl, source_task_id AS sourceTaskId FROM referral_candidates WHERE status = 'pending' ORDER BY received_at ASC LIMIT 1"
  ).first<ReferralCandidate>();
  return row && typeof row.agentCardUrl === "string" && typeof row.sourceTaskId === "string" ? row : null;
}

export function markReferralCandidate(db: D1Database, agentCardUrl: string, status: "contacted" | "not_qualified"): Promise<void> {
  return db.prepare("UPDATE referral_candidates SET status = ?, processed_at = ? WHERE agent_card_url = ?")
    .bind(status, new Date().toISOString(), agentCardUrl).run().then(() => undefined);
}
