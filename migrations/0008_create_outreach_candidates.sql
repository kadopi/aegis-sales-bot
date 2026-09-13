CREATE TABLE IF NOT EXISTS outreach_candidates (
  agent_card_url TEXT PRIMARY KEY,
  target_id TEXT NOT NULL,
  target_name TEXT NOT NULL,
  endpoint_url TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('global_a2a_registry', 'a2a_directory')),
  discovered_at TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'contacted', 'not_qualified'))
);

CREATE INDEX IF NOT EXISTS idx_outreach_candidates_pending
  ON outreach_candidates (status, discovered_at);
