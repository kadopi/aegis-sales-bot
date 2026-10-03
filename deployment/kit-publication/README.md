# Integration Kit publication — 2026-10-03

Production baseline: Cloudflare Worker `aegis-sales-bot`, version `ba9ca2fa-9ddb-4bd5-86c7-3259474c92d0`.

Production code differs from current main: other products' discovery/payment fields and `/products/{id}` routes are not deployed. This publication intentionally preserves that production behavior. Do not deploy the whole current source tree for this narrow change.

`baseline.mjs` is the existing production JavaScript. `index.mjs` changes only the Integration Kit object (derived from `src/catalog.ts`) and its recommendation eligibility guard (matching `src/recommend.ts`). All other production bytes remain unchanged. This preserves the other four products, all existing routes, outreach behavior, and payment/service configuration. The Kit discovery route remains 404, as before; use `/products.json` and `/recommend` for its public purchase guidance.

Reproduce and verify from repository root:

```sh
node deployment/kit-publication/prepare-kit.mjs . deployment/kit-publication/baseline.mjs /tmp/aegis-kit-index.mjs
cmp /tmp/aegis-kit-index.mjs deployment/kit-publication/index.mjs
node deployment/kit-publication/verify-artifact.mjs deployment/kit-publication/baseline.mjs /tmp/aegis-kit-index.mjs
npm run check
npm test
node_modules/.bin/wrangler deploy deployment/kit-publication/index.mjs --no-bundle --keep-vars --dry-run --outdir /tmp/aegis-kit-dry-run
```

The artifact verification stubs only the Cloudflare DurableObject import for Node execution. It checks public checkout and buyer prerequisites, Starter routing for a general x402 query, Kit routing for explicit `integration` or `kit`, exact equality for other products, and exact equality for existing GET routes. The patch builder also reverses its two edits to prove all remaining production code is byte-identical.

SHA-256:

- Baseline: `429cb54e7cc6a41ab71f781ee6b40f0a5cfe0f9efbc8e3c7d19a016128d220d5`
- Published artifact: `01b50a8678e31b02929db3800ed5be15978338030b5d2c7aab26f99fa21b5161`

Authorized publication command uses existing configuration, bindings and authentication:

```sh
node_modules/.bin/wrangler deploy deployment/kit-publication/index.mjs --no-bundle --keep-vars --tag kit-public-20261003 --message 'Publish existing Integration Kit checkout; preserve production behavior'
```

Rollback, only if needed and authorized: `node_modules/.bin/wrangler rollback ba9ca2fa-9ddb-4bd5-86c7-3259474c92d0`. Alternatively redeploy the saved `baseline.mjs` with `--no-bundle --keep-vars`. No migration, account, secret, price, subscription, purchase or outreach message is changed or created.

The source/test edits already present in the working tree were retained and completed within the approved product scope. `HANDOFF-LATEST.md` was left unchanged and unstaged to preserve the user's existing edit.
