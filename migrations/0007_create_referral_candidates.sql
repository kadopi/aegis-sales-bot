CREATE TABLE IF NOT EXISTS referral_candidates (
  agent_card_url TEXT PRIMARY KEY,
  source_task_id TEXT NOT NULL,
  received_at TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'contacted', 'not_qualified')),
  processed_at TEXT
);

CREATE INDEX IF NOT EXISTS idx_referral_candidates_pending
  ON referral_candidates (status, received_at);
