# Verified publication result — 2026-10-03

- Source and tested production artifact commit: `1ceb3d9dc559d0c35454b728fba2b80e922c1f21`, pushed to `origin/main`.
- Cloudflare version: `76a0af48-1f6c-4880-a47a-453cc51ac7a2`, deployed at 100%.
- Deployment: `f977c748-cfd6-46ae-b868-c279c353545a`, created `2026-10-03T08:47:43.200967Z`.
- Downloaded deployed JavaScript is byte-identical to tested `index.mjs`; SHA-256 `01b50a8678e31b02929db3800ed5be15978338030b5d2c7aab26f99fa21b5161`.
- `npm run check` passed; `npm test` passed all 36 tests; artifact-specific verification and Wrangler dry-run passed.
- GitHub has no Actions workflows, check runs or commit status contexts configured for this commit; no CI result is claimed.

Live verification:

- `https://aegis-sales-bot.kadopi.workers.dev/products.json`: Kit `status=public`, Gumroad checkout URL and consistent `paidAccess`; other four products exactly equal their predeployment JSON.
- `POST https://aegis-sales-bot.kadopi.workers.dev/recommend`: `x402 USDC payment for MCP` returns free Starter; appending `integration` or `kit` returns the paid Kit and the same Gumroad checkout URL.
- `/`, `/health`, and `/.well-known/agent-card.json` return 200. Existing routes were preserved. `/products/{id}` remains absent from this production baseline, as documented in README.
- `https://kadoya2.gumroad.com/l/x402-mcp-integration-kit` was verified in the user's Mac Chrome: product title, $19 display in USD, source ZIP, prerequisites, and an enabled `I want this!` link to `https://gumroad.com/checkout?product=ornfww&quantity=1`. No purchase was performed. Display currency was restored afterward.
- Existing Cloudflare bindings, variables, compatibility settings, observability and usage model match predeployment settings.

Wrangler uploaded and activated the code successfully, then returned an error while reapplying Cron schedules: account Workers Free limit of five triggers (Cloudflare code 10072). No upgrade was attempted. A read-only check confirms all three existing Aegis schedules remain `0 5 * * *`, `0 11 * * *`, `0 23 * * *`, with unchanged modification timestamps from 2026-09-16. The catalog is live despite the CLI's nonzero exit. No new resource, subscription, paid API operation, configuration change or additional cash expenditure was initiated.

`HANDOFF-LATEST.md` remains modified and unstaged, preserving the existing user edit. The approved existing catalog/recommendation/test changes were retained and included in the source commit; the publication adds exact artifact records to keep source and production differences reviewable.

Rollback procedure and baseline artifact are retained in README and `baseline.mjs`.
