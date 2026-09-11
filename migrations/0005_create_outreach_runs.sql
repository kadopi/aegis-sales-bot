CREATE TABLE IF NOT EXISTS outreach_runs (
  id TEXT PRIMARY KEY,
  ran_at TEXT NOT NULL,
  result TEXT NOT NULL,
  registry_candidate_count INTEGER NOT NULL,
  target_id TEXT
);

CREATE INDEX IF NOT EXISTS idx_outreach_runs_ran_at
  ON outreach_runs (ran_at);
