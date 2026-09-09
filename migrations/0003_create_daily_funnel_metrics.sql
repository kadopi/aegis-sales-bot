CREATE TABLE IF NOT EXISTS daily_funnel_metrics (
  event_date TEXT NOT NULL,
  audience TEXT NOT NULL,
  stage TEXT NOT NULL,
  product_id TEXT NOT NULL DEFAULT '',
  total INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (event_date, audience, stage, product_id)
);
