# Aegis Sales Bot handoff

## 現在地
- v0.1をCloudflare Workersで公開済み。
- 目的は、決済権を持つ外部AIエージェントによる自社サービスの発見・利用を増やし、収益向上につなげること。
- 公開URL: `https://aegis-sales-bot.kadopi.workers.dev`
- GitHub: `https://github.com/kadopi/aegis-sales-bot`（公開、main）
- 中央カタログは `src/catalog.ts` のみ。Japan Rule、x402 MCP Starter、Guardrailを掲載。
- Japan Ruleは日本の観光参入ガイド情報を提供し、第一弾は祖谷・そば打ち体験の事業者向け5-USDC固定パック。本番カタログへ反映済み。
- Japan RuleWatchの旅行MCP向け統合提案は、送信前レビュー資料として3候補を整理済み。
- Glama掲載と旅行用途推薦は確認済み。Smitheryの新規公開と旅行MCPへのIssue提案は承認待ち。

## 直近コミット
- `44117cb feat: publish Aegis sales bot catalog` を `main` へプッシュ済み。

## 次の作業
- 利用数、商品別推薦数、接続先案内数を観測する。
- 実際の利用を妨げる箇所だけ改善する。A2A会話APIは需要確認まで追加しない。
- 統合提案を送る場合だけ、相手別に窓口・本文・Japan RuleWatchの現行提供可否を再確認し、個別承認を得る。
- Smithery公開は、アカウント認証と名前空間を確認後、Mainnet MCP URLだけを対象に実行する。

## 確認済み
- D1 `aegis-sales-bot-metrics` をAPACに作成し、`0001_create_daily_metrics.sql` をリモート適用。
- Worker `aegis-sales-bot` をデプロイ。最新Version ID: `74790402-2021-4284-883d-ae1c201a2c1b`。
- `/health`、`/products.json`、`/recommend`、`/.well-known/agent-card.json` が公開URLで200。
- Japan Ruleの依頼は`fit: high`で推薦され、D1にcatalog_view / recommendation / connection_guideが記録。
- Mainnet Japan RuleWatchは健康状態とツール一覧を確認。無料の `search_entry_cases` と `get_commercial_terms`、有料の `get_entry_pack` を公開している。
- 観光依頼は公開環境でJapan Ruleを`fit: high`で推薦し、祖谷・食文化体験・英語の5-USDC固定パック条件と `https://japan-rulewatch-mcp-mainnet.kadopi.workers.dev/mcp` を返すことを確認。
- `npm run cf-typegen`、`npm run check`、`npm test` が成功（10テスト）。
- 英語キーワードは単語単位、日本語キーワードは部分一致。null入力は固定JSONの400。
- `JAPAN-RULEWATCH-TOURISM-OUTREACH.md` に、NEWT MCP、Japan Travel MCP、rakuten-mcpの適合度、公開窓口、送信前文面を記録。外部送信なし。
- GlamaにJapan RuleWatchが公開コネクタとして既に掲載され、公開Botの旅行推薦も有効であることを確認。
- `src/catalog.ts` は観光参入ガイド情報と第一弾の祖谷パックを区別。祖谷・そば・食文化・体験の依頼は本番で `fit: high`、正しいMCP接続先と5-USDC条件を返すことを確認。

## 安全境界
- 営業botは決済、ウォレット、サービス実行、外部送信、会話履歴を持たない。
- 生の依頼文、IP、秘密情報をD1へ保存しない。
- 各サービスが決済・提供・納品を担当する。

## 関連ファイル
- `src/catalog.ts`: 唯一の中央商品カタログ
- `src/recommend.ts`: 決定的な照合
- `src/index.ts`: HTTP公開面とAgent Card
- `src/metrics.ts`: 最小日次集計
- `migrations/0001_create_daily_metrics.sql`: D1スキーマ
- `JAPAN-RULEWATCH-TOURISM-OUTREACH.md`: Japan RuleWatchの旅行MCP統合提案のレビュー資料

## 未解決
- 外部AIエージェントからの実利用、接続、課金、継続利用は未確認。
- カスタムドメイン、外部送信、A2A JSON-RPCは未実装・未承認。
- 上記3候補への実送信・返信・統合可否は未確認。
- 未解決の本番デプロイ作業はない。
