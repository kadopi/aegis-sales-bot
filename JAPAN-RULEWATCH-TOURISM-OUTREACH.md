# Japan RuleWatch: tourism MCP integration prospects

Status: review-only. Updated: 2026-09-08 JST.

## Purpose and boundary

Prepare a small set of public, technically compatible travel-MCP operators for a proposed Japan RuleWatch addition. This file is not a contact queue and must not trigger email, issue creation, posting, or product changes.

- Japan RuleWatch supplies Japan tourism entry guidance with structured official-source discovery and paid packs. The Sales Bot only recommends and connects it. Japan RuleWatch does not make bookings, operate the partner's agent, or give individual legal conclusions.
- The existing Japan RuleWatch Mainnet MCP connection, travel recommendation, and B2B 5-USDC Iya-soba entry pack remain unchanged.
- Do not ask a partner to copy Japan RuleWatch data. The proposal is an optional second MCP connection.

## Discovery registry status

- Glama: Japan RuleWatch is already listed as the public connector `dev.workers.kadopi.japan-rulewatch-mcp`. No duplicate registration is needed.
- Sales Bot: the public catalog recommends Japan RuleWatch for `tourism` / `travel` / `hotel` / `OTA` requests and returns the Mainnet MCP URL. It describes Japan tourism entry guidance as the product, with `jp-tokushima-miyoshi-iya-soba` as the first currently available paid pack.
- Mainnet: verified on 2026-09-08. The endpoint is healthy and exposes `search_entry_cases`, `get_commercial_terms`, and `get_entry_pack`. The free lookup returns a 6-person, English, source-backed consultation-preparation sample for an existing provider's venue in Iya; it excludes transport and lodging.
- Smithery: no existing public listing was confirmed. Publishing target, if approved: `https://japan-rulewatch-mcp-mainnet.kadopi.workers.dev/mcp`. Smithery requires account authentication and a publisher namespace before a new public listing can be created.

## Prioritized prospects

### 1. Japan Travel MCP by KJ Sunada — high

- Evidence: 18言語の観光情報、約2万の宿泊施設、MCPとHTTP運用を公開し、GitHub Issuesを有効化しています。
- Integration point: the agent can add Japan RuleWatch as a tourism-entry guidance MCP. The first usable flow is the free `search_entry_cases` call for `jp-tokushima-miyoshi-iya` / `food_culture_workshop` / `en`; its result states scope and unknowns before any purchase. A business principal can then choose the first 5-USDC fixed pack.
- Public proposal route: GitHub Issues, <https://github.com/ookami0210/japan-travel-mcp/issues>.
- Source: <https://github.com/ookami0210/japan-travel-mcp>

Draft:

> japan-travel-mcpに、日本の観光参入ガイド情報を提供する任意の追加MCPとしてJapan RuleWatchをつなぐ提案です。第一弾は `search_entry_cases(jp-tokushima-miyoshi-iya, food_culture_workshop, en)` で、既存事業者会場を想定した6名の英語そば打ち体験について、公式根拠の範囲と未確認事項を無料で返します。対象の事業者または委任を受けたAIエージェントだけが、5 USDCの固定パックを選べます。パックは根拠、相談先、問い合わせ文、未確定事項を返し、予約・決済代行・個別の法的判断は行いません。接続例としてご検討いただけますか。

### 2. NEWT MCP by Reiwa Travel — medium

- Evidence: hosted MCP exposes hotel, tour, destination, and airport search; supports `en-US`, Korean, and Chinese variants; its README explicitly describes inbound travel planners.
- Integration point: Japan RuleWatch could add a narrow Iya experience-entry check after a destination search. External-MCP composition has not been confirmed from the public documentation.
- Public proposal route: Reiwa Travel contact form, <https://www.reiwatravel.co.jp/contact>. The repository does not present GitHub Issues as a proposal route.
- Source: <https://github.com/reiwa-travel/newt-mcp-server>

Draft:

> NEWT MCPの訪日旅行案内に、日本の観光参入ガイド情報を提供する任意の追加MCPをつなぐ提案です。第一弾として、祖谷での6名の英語そば打ち体験を想定した固定事例について、無料で範囲と未確認事項を返します。事業者用途なら5 USDCで根拠、相談先、問い合わせ文を含む固定パックを取得できます。NEWTの検索、予約、決済導線は変更しません。外部MCPの組合せ可否を含め、接続例の確認をご相談できますか。

### 3. rakuten-mcp by mrslbt — medium

- Evidence: Rakuten Travelの空室、料金、ホテル詳細、地域検索を含む読み取り専用MCPを公開しています。英日ツール説明があり、GitHub Issuesが有効です。
- Integration point: a future Iya destination flow could expose the free entry-case lookup. The public repository does not establish external-MCP composition or x402 support.
- Public proposal route: GitHub Issues, <https://github.com/mrslbt/rakuten-mcp/issues>.
- Source: <https://github.com/mrslbt/rakuten-mcp>

Draft:

> rakuten-mcpの祖谷周辺の宿泊検索後に、日本の観光参入ガイド情報を提供する任意の追加MCPとしてJapan RuleWatchを案内する提案です。第一弾は既存会場を想定した6名の英語そば打ち体験で、無料呼出しは範囲・未確認事項を返します。事業者用途では、5 USDCの固定パックから根拠、相談先、問い合わせ文を取得できます。Rakuten Travelの検索・予約・決済導線には変更を加えません。外部MCPを併用できる場合だけ、接続例をご検討いただけますか。

## Pre-send review checklist

1. 接続先、利用規約、公開窓口、外部MCP併用の可否を当日に確認する。
2. Japan RuleWatchのMCP URL、無料検索、`jp-tokushima-miyoshi-iya-soba`の購入条件を現行環境で確認する。
3. 相手の公開規約に沿う窓口を一つだけ選び、上の相手別文面を製品状況に合わせて短く更新する。
4. 送信・投稿は対象と本文を個別に承認後に行う。

## Exact external actions awaiting approval

1. Publish the Mainnet endpoint on Smithery under the account's confirmed namespace.
2. Create one GitHub Issue in `ookami0210/japan-travel-mcp` using the draft in prospect 2. Do not cross-post the same proposal.
