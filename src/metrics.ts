import type { SurveySubmission } from "./a2a";

export type MetricEvent = "catalog_view" | "recommendation" | "connection_guide" | "a2a_conversation" | "survey_response" | "error";

export function recordMetric(db: D1Database, metricEvent: MetricEvent, productId = ""): Promise<void> {
  const date = new Date().toISOString().slice(0, 10);
  return db.prepare(
    "INSERT INTO daily_metrics (event_date, event_name, product_id, total) VALUES (?, ?, ?, 1) ON CONFLICT(event_date, event_name, product_id) DO UPDATE SET total = total + 1"
  ).bind(date, metricEvent, productId).run().then(() => undefined).catch(() => {
    console.error(JSON.stringify({ event: "metric_write_failed", metricEvent, productId }));
  });
}

export function recordSurveyResponses(db: D1Database, submission: SurveySubmission): Promise<void> {
  const receivedAt = new Date().toISOString();
  return db.batch(submission.answers.map((answer) => db.prepare(
    "INSERT INTO survey_responses (id, received_at, task_id, question_id, answer) VALUES (?, ?, ?, ?, ?)"
  ).bind(crypto.randomUUID(), receivedAt, submission.taskId, answer.questionId, answer.answer))).then(() => undefined).catch(() => {
    console.error(JSON.stringify({ event: "survey_write_failed", answerCount: submission.answers.length }));
  });
}
