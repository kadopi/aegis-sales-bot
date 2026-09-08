CREATE TABLE IF NOT EXISTS daily_metrics (
  event_date TEXT NOT NULL,
  event_name TEXT NOT NULL,
  product_id TEXT NOT NULL DEFAULT '',
  total INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (event_date, event_name, product_id)
);
