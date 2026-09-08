import { catalog, type Product } from "./catalog";

export type RecommendationInput = { request?: unknown; purpose?: unknown };

export type Recommendation = {
  recommendedProduct: Product | null;
  reason: string;
  fit: "high" | "medium" | "none";
  freeOffer: string | null;
  paidOffer: string | null;
  connection: { type: Product["connectionType"]; url: string; docsUrl: string } | null;
  example: { input: string; output: string } | null;
  nextAction: string;
  alternatives: readonly Product[];
};

export function parseRequest(input: unknown): string | null {
  if (!isRecommendationInput(input)) return null;
  const value = typeof input.request === "string" ? input.request : input.purpose;
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  return normalized.length > 0 && normalized.length <= 2_000 ? normalized : null;
}

export function recommend(request: string): Recommendation {
  const ranked = catalog
    .map((product) => ({ product, score: score(product, request) }))
    .sort((left, right) => right.score - left.score || left.product.id.localeCompare(right.product.id));
  const best = ranked[0];
  if (best.score === 0) return noFit();

  const fit = best.score >= 2 ? "high" : "medium";
  const matched = best.product.keywords.filter((keyword) => keywordMatches(request, keyword));
  return {
    recommendedProduct: best.product,
    reason: `Matched ${matched.join(", ")} against the catalog's stated use cases and keywords.`,
    fit,
    freeOffer: best.product.freeOffer,
    paidOffer: best.product.paidOffer,
    connection: { type: best.product.connectionType, url: best.product.connectionUrl, docsUrl: best.product.docsUrl },
    example: { input: best.product.exampleInput, output: best.product.exampleOutput },
    nextAction: best.product.nextAction,
    alternatives: ranked.filter((item) => item.score > 0 && item.product.id !== best.product.id).map((item) => item.product)
  };
}

function score(product: Product, request: string): number {
  return product.keywords.reduce((total, keyword) => total + (keywordMatches(request, keyword) ? 1 : 0), 0);
}

function isRecommendationInput(input: unknown): input is RecommendationInput {
  return input !== null && typeof input === "object" && !Array.isArray(input);
}

function keywordMatches(request: string, keyword: string): boolean {
  if (!/^[a-z0-9]+$/i.test(keyword)) return request.includes(keyword);
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|[^a-z0-9])${escaped}(?:$|[^a-z0-9])`, "i").test(request);
}

function noFit(): Recommendation {
  return {
    recommendedProduct: null,
    reason: "No catalog keyword matched this request; no product is recommended.",
    fit: "none",
    freeOffer: null,
    paidOffer: null,
    connection: null,
    example: null,
    nextAction: "Review the current catalog at /products.json.",
    alternatives: catalog
  };
}
