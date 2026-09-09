export type ObservationAudience = "internal_test_declared" | "external_or_unknown";

const INTERNAL_TEST_HEADER = "x-aegis-observation";

export function observationAudience(request: Request): ObservationAudience {
  return request.headers.get(INTERNAL_TEST_HEADER) === "internal-test"
    ? "internal_test_declared"
    : "external_or_unknown";
}
