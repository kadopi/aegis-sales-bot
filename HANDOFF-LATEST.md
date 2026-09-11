# Aegis Sales Bot handoff

## 現在地
- v0.1をCloudflare Workersで公開済み。
- 目的は、決済権を持つ外部AIエージェントによる自社サービスの発見・利用を増やし、収益向上につなげること。
- 公開URL: `https://aegis-sales-bot.kadopi.workers.dev`
- GitHub: `https://github.com/kadopi/aegis-sales-bot`（公開、main）
- 中央カタログは `src/catalog.ts` のみ。Japan Rule、x402 MCP Starter、Guardrailを掲載。
- Japan Ruleは日本の観光参入ガイド情報を提供し、第一弾は祖谷・そば打ち体験の事業者向け5-USDC固定パック。本番カタログへ反映済み。
- Japan Ruleの無料版はモデルケース・3つの判断テーマ・有料版で得られる実務情報を返す実行前プレビュー。有料版は公式ソースの所在、公開連絡先、問い合わせ文、優先行動を返す。
- Japan RuleWatchの旅行MCP向け統合提案は、送信前レビュー資料として3候補を整理済み。
- Glama掲載と旅行用途推薦は確認済み。A2Aの用途確認・推薦・任意アンケートAPIを本番デプロイ済み。

## 直近コミット
- `d23dc3f feat: add A2A discovery and survey persistence` を `main` へプッシュ済み。

## 次の作業
- A2A会話数、質問別回答数、自由記述をD1で観測する。
- 外部AIへ開始メッセージを送る場合は、相手のA2A Agent Card、宛先、英文を個別確認してから実行する。
- 外部AIへ開始メッセージを送る場合は、相手のA2A Agent Card、宛先、英文を個別確認してから実行する。

## 確認済み
- D1 `aegis-sales-bot-metrics` をAPACに作成し、`0001_create_daily_metrics.sql` をリモート適用。
- Worker `aegis-sales-bot` をデプロイ。最新Version ID: `74790402-2021-4284-883d-ae1c201a2c1b`。
- `/health`、`/products.json`、`/recommend`、`/.well-known/agent-card.json` が公開URLで200。
- Japan Ruleの依頼は`fit: high`で推薦され、D1にcatalog_view / recommendation / connection_guideが記録。
- Mainnet Japan RuleWatchは健康状態とツール一覧を確認。無料の `search_entry_cases` と `get_commercial_terms`、有料の `get_entry_pack` を公開している。
- 観光依頼は公開環境でJapan Ruleを`fit: high`で推薦し、祖谷・食文化体験・英語の5-USDC固定パック条件と `https://japan-rulewatch-mcp-mainnet.kadopi.workers.dev/mcp` を返すことを確認。
- `npm run cf-typegen`、`npm run check`、`npm test` が成功。最新ローカル検証は `npm run check` と13テスト。
- ローカル変更：`POST /a2a` がA2A JSON-RPC `SendMessage` を受け、決定的に用途を確認し、適合商品または次の質問をTaskとして返す。全会話に任意アンケート「Japan Rule以外に欲しいサービス」「他に欲しい機能」を付ける。会話本文・回答の保存、外部送信、決済はしない。
- A2A変更を本番デプロイ。最新Version ID: `75812469-0054-42df-afaa-9985a8c1d1e5`。公開Agent Cardが `/a2a` と任意アンケートの非保存境界を正しく宣言することを確認。
- AIが `params.metadata.survey.consent: true` を明示し、既知の質問IDへ回答した場合だけD1 `survey_responses` に回答日時・質問ID・回答・任意の会話IDを保存する。会話本文、IP、秘密情報は保存しない。`npm run check` と `npm test` は14件成功。
- `0002_create_survey_responses.sql` を本番D1へ適用し、Workerをデプロイ。最新Version ID: `6d31166c-0111-4bb1-aef5-64f65a730f55`。公開Agent Cardの保存境界と本番テーブルの存在を確認。
- 英語キーワードは単語単位、日本語キーワードは部分一致。null入力は固定JSONの400。
- `JAPAN-RULEWATCH-TOURISM-OUTREACH.md` に、NEWT MCP、Japan Travel MCP、rakuten-mcpの適合度、公開窓口、送信前文面を記録。外部送信なし。
- GlamaにJapan RuleWatchが公開コネクタとして既に掲載され、公開Botの旅行推薦も有効であることを確認。
- `src/catalog.ts` は観光参入ガイド情報と第一弾の祖谷パックを区別。祖谷・そば・食文化・体験の依頼は本番で `fit: high`、正しいMCP接続先と5-USDC条件を返すことを確認。

## 安全境界
- 営業botは決済、ウォレット、サービス実行、外部送信、会話履歴を持たない。
- 同意済みのアンケート回答だけを、商品分析用にD1へ保存する。
- 生の依頼文、IP、秘密情報をD1へ保存しない。
- 各サービスが決済・提供・納品を担当する。

## 関連ファイル
- `src/catalog.ts`: 唯一の中央商品カタログ
- `src/recommend.ts`: 決定的な照合
- `src/index.ts`: HTTP公開面とAgent Card
- `src/a2a.ts`: A2A JSON-RPCの用途確認・推薦応答
- `src/metrics.ts`: 最小日次集計
- `migrations/0001_create_daily_metrics.sql`: D1スキーマ
- `migrations/0002_create_survey_responses.sql`: 同意済み回答のD1スキーマ（本番適用済み）
- `JAPAN-RULEWATCH-TOURISM-OUTREACH.md`: Japan RuleWatchの旅行MCP統合提案のレビュー資料

## 未解決
- 外部AIエージェントからの実利用、接続、課金、継続利用は未確認。
- A2A JSON-RPCと同意済みアンケート保存は公開済み。カスタムドメイン、外部送信は未実施。
- 上記3候補への実送信・返信・統合可否は未確認。
- 未解決の本番デプロイ作業はない。

## 2026-09-10 自律ヒアリング（本番有効）
- `src/outreach.ts` が公開A2A Registryから候補を確認する。
- 事業向け・公開・認証不要・JSON-RPC 1.0・用途適合の候補だけを対象にする。
- 一意な `outreach_attempts.target_id` により、同じ候補への再送を防ぐ。
- 送信はCron実行ごとに初回ヒアリング1件だけ。支払い、登録、注文、追送はしない。
- 返信本文と候補説明は保存しない。D1には宛先、時刻、結果コードだけを保存する。
- 設定ファイルの初期値は `OUTREACH_ENABLED=false`。本番は承認済みのCLI変数で `true` を設定済み。
- `migrations/0004_create_outreach_attempts.sql` と `test/outreach.test.ts` を追加。
- `npm run check`、`npm test`（20 tests）、`wrangler deploy --dry-run` を確認。
- `944e0e4` をpush済み。Remote D1 migration `0004` を適用し、本番Version ID `d30cd21d-7570-4186-9975-d0a6636e323a` を配備済み。
- Cronは毎日 `0 2 * * *` UTC。本番Agent Cardはv0.2.0と自律ヒアリングの保存境界を返すことを確認。

## 2026-09-10 同意済み返信の保存（本番有効）
- 自律ヒアリングの文面に任意の `aegis_survey` JSON形式を追加した。
- 相手が `consent: true` と既知の質問IDを返した場合だけ、既存 `survey_responses` へ保存する。
- 通常の返信本文、同意なしの回答、会話履歴は保存しない。
- `outreach_attempts.status` は同意済み回答を受けた場合に `survey_received` となる。
- `npm run check`、`npm test`（20 tests）、`wrangler deploy --dry-run` を確認。
- `3f11bdd` をpush済み。本番Version ID `cf1dbf78-0cc5-4d0c-88ba-da6b3224abc5` を配備済み。

## 2026-09-11 Integration Kitカタログ（本番有効）
- `$19 USD` の x402 MCP Integration Kit — Beta を `coming-soon` 商品として追加した。
- 公開済みMCPと購入導線型商品を区別するため、`checkout` 接続型とURL未設定を扱えるようにした。
- Gumroad公開URLがない間は購入導線を返さず、公開準備中と明示する。
- 汎用x402依頼は既存の公開Starterを優先し、`integration` または `kit` を明示した依頼だけIntegration Kitを推薦する。
- `npm run check`、`npm test`（21 tests）、`wrangler deploy --dry-run` を確認。
- `ddb773b` をpush済み。本番Version ID `f9735f87-17e7-4b1e-9e9a-d527009d1e71` を配備済み。

## 2026-09-11 自律ヒアリング実行記録（本番有効）
- `outreach_runs` にCron実行時刻、結果、Registry候補数、任意の送信先IDを保存する修正を追加。
- 結果は `sent`、`survey_received`、`rejected`、`no_candidate`、`failed` のいずれか。
- 候補説明、返信本文、秘密情報は保存しない。
- `npm run check`、`npm test`（22 tests）、`wrangler deploy --dry-run` を確認。
- 本番D1 migration `0005` を適用し、上記本番Versionへ配備済み。`outreach_runs` テーブルの存在を確認。

## 2026-09-11 OpenClaw導線（ローカル準備）
- `OPENCLAW.md` に、OpenClaw利用者がSales BotをA2A outbound peerとして追加する設定例、3つの初回タスク、商品別の受取内容、データ保存境界を記載した。
- OpenClaw側のpeer tokenは同利用者の受信保護用であり、Aegisへ送らない。Sales Botは公開no-auth A2A endpointのため、設定例に`outboundToken`は置かない。
- 外部の投稿、掲載、OpenClaw gatewayへの接続、メッセージ送信、デプロイは未実施。公開にはcommit・pushが必要。
