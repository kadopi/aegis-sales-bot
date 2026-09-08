export type MetricEvent = "catalog_view" | "recommendation" | "connection_guide" | "error";

export function recordMetric(db: D1Database, metricEvent: MetricEvent, productId = ""): Promise<void> {
  const date = new Date().toISOString().slice(0, 10);
  return db.prepare(
    "INSERT INTO daily_metrics (event_date, event_name, product_id, total) VALUES (?, ?, ?, 1) ON CONFLICT(event_date, event_name, product_id) DO UPDATE SET total = total + 1"
  ).bind(date, metricEvent, productId).run().then(() => undefined).catch(() => {
    console.error(JSON.stringify({ event: "metric_write_failed", metricEvent, productId }));
  });
}
