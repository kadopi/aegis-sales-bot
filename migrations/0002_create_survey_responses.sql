CREATE TABLE IF NOT EXISTS survey_responses (
  id TEXT PRIMARY KEY,
  received_at TEXT NOT NULL,
  task_id TEXT NOT NULL DEFAULT '',
  question_id TEXT NOT NULL,
  answer TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_survey_responses_question_received
  ON survey_responses (question_id, received_at);
