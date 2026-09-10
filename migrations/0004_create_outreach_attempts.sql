CREATE TABLE IF NOT EXISTS outreach_attempts (
  target_id TEXT PRIMARY KEY,
  target_name TEXT NOT NULL,
  agent_card_url TEXT NOT NULL,
  endpoint_url TEXT,
  selected_at TEXT NOT NULL,
  sent_at TEXT,
  status TEXT NOT NULL,
  http_status INTEGER
);
