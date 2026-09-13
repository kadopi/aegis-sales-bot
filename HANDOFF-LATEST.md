## 2026-09-13 探索と送信の分離（ローカル実装）
- Cronは外部A2Aメッセージを送らず、公開Business候補を`outreach_candidates`へ最大1件ずつ蓄積する。
- 探索順はGlobal A2A RegistryのBusiness候補、次に稼働中かつ商用関連スキルを持つ第2 A2A Directory候補。
- 候補は公開HTTPS、認証不要、JSON-RPC 1.0を満たすものだけで、Agent Card URL単位の重複を防ぐ。
- 送信は候補を確認した後の対象別承認が必要。migration `0008`を本番適用し、本番Version ID `7f9b0767-9c18-4bc8-bd10-91c97fd095bd`へ配備済み。

## 2026-09-13 継続的な営業候補探索（ローカル実装）
- 既存の1日3回Cronで、従来のGlobal A2A Registryに該当候補がない場合、稼働状態を公開する第2のA2A Directoryも探索する。
- 第2探索元は、稼働中かつ商用・決済・マーケットプレイス・旅行・金融などの公開スキルを持つ候補だけを扱う。Generalな雑談・案内用途は営業候補にしない。
- Agent Cardは公開HTTPS、認証不要、JSON-RPC 1.0である場合だけ送信する。Agent Card URL単位で再送を防ぐ。
- ローカル実装のみ。テストと配備は未実施。

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
- `OUTREACH_ENABLED=true` は設定ファイルと本番Workerの両方で有効。将来の再配備で送信を停止しない。
- `migrations/0004_create_outreach_attempts.sql` と `test/outreach.test.ts` を追加。
- `npm run check`、`npm test`（20 tests）、`wrangler deploy --dry-run` を確認。
- `944e0e4` をpush済み。Remote D1 migration `0004` を適用し、本番Version ID `d30cd21d-7570-4186-9975-d0a6636e323a` を配備済み。
- Cronは毎日 `0 23 * * *`、`0 5 * * *`、`0 11 * * *` UTC（8:00／14:00／20:00 JST）。各実行は初回ヒアリング1件だけ。

## 2026-09-11 自律ヒアリング頻度（本番有効）
- 承認により、初回ヒアリングを1日1件から1日3件へ変更した。対象は既存どおり公開・認証不要・用途適合の外部A2A候補だけで、同一候補への再送はしない。
- `npm run check`、`npm test`（22 tests）、`wrangler deploy --dry-run` が成功。
- 本番Version ID `b3a9d720-f2d9-447b-b7ab-6848fe559ca1`。Cron 3件と`OUTREACH_ENABLED=true`を`wrangler versions view`で確認。

## 2026-09-13 相手別A2Aヒアリング（ローカル実装）
- 公開Agent Cardの説明から、旅行・観光、商取引・調達、MCP・開発、一般ヒアリングの4種類の導入文を選ぶ。
- Japan Rule、x402対応サービス、Agent Card Health Checkを相手の用途に応じて1つだけ仮説として提示する。
- 公開・認証不要・Business・JSON-RPC 1.0、1実行1件、同一候補の再送禁止、同意済み回答だけの保存は維持する。
- 本番Version ID `99801c74-df87-4fd9-b0ff-c2ccb5e19bdd`へ配備済み。Cron 3件、`OUTREACH_ENABLED=true`、`/health`を確認。

## 2026-09-13 継続A2A商談（ローカル実装）
- 初回ヒアリングに同一Task IDを含め、相手が`interested`を明示した場合だけ同じTaskで個別提案を送る。
- Durable Objectには会話段階、個別提案文、7日間の期限だけを保存し、本文・認証情報・相手の応答本文は保存しない。
- 相手がSales Botの`/a2a`へ同じTask IDで返答した場合も、`interested`、`not_interested`、`unsupported`または単純なyes/noを処理して提案または任意アンケートへ進める。
- 本番Version ID `e79443e7-d881-4a49-bd80-47f804b82d68`へ配備済み。`/health`、Durable Object/D1/3件のCronバインドを確認。外部宛の手動送信はしていない。

## 2026-09-13 成約導線の機械可読化（ローカル実装）
- 個別提案は`aegis_connection_action`としてMCP接続URLと初回ツール呼び出しを返す。Japan Ruleは無料`search_entry_cases`、`get_commercial_terms`、下流x402の`PAYMENT-REQUIRED`順を明示する。
- 無料のx402 Starter、Guardrail、Agent Card Health Checkにも接続先と最初の読み取りツールを定義した。Health Checkは所有または明示許可された対象だけを扱う。
- Sales Botは購入案内と任意アンケートだけを記録し、購入完了は下流MCPのx402決済・納品記録を正とする。ウォレット操作・支払い実行・成約確定はしない。
- 本番Version ID `0f8b2eec-b134-4893-8c44-09712080ee88`へ配備済み。`/health`とJapan Ruleの`/recommend`応答で`connectionAction`（無料プレビュー、利用条件、下流x402導線）を確認。外部宛の手動送信はしていない。

## 2026-09-13 Sales Botの役割縮小（ローカル実装）
- 成約導線の機械可読化は取り下げ、個別案内は公開商品を1つ、接続先URLと最初のMCPツール呼び出しを本文で案内して終了する。
- Durable Objectの短いA2A会話は維持する。保存は相手ID、段階、期限、最終結果だけで、会話本文・決済・納品・成約判定は持たない。
- 最終結果は`interested`、`not_interested`、`unsupported`。任意アンケートは既存の明示同意条件でのみ保存する。未配備。
- 本番Version ID `b063641b-0288-4d57-987b-75e4d7f8ab84`へ配備済み。`/health`を確認。外部宛の手動送信はしていない。

## 2026-09-13 適合候補の自律発見（ローカル実装）
- Cronは公開Agent Cardの発見・適合判定・候補保存だけを行い、A2Aメッセージは送らない。候補ごとの外部送信は明示承認後だけにする。
- 旅行・日本参入はJapan Rule、調達・決済はx402 MCP Starter、MCP/A2A連携はAgent Card Health Checkへ、公開用途から1商品・1価値仮説だけを対応付ける。不適合なBusiness候補は保存しない。
- `outreach_candidates`には公開URL、相手ID、接続先、発見元、候補商品、価値仮説、待機状態を保存する。外部返信本文・秘密情報・決済・成約状態は保存しない。
- 本番D1へmigration `0009`を適用し、`product_id`と`value_hypothesis`列を確認。本番Version ID `2a80f000-781b-4f46-8999-5adb80b84bc7`へ配備済み。`/health`を確認。外部宛の手動送信はしていない。

## 2026-09-13 紹介型ヒアリング（ローカル実装）
- 任意アンケートに`referral_domain`と公開`referral_agent_card_url`を追加。明示的なアンケート保存同意があるURLだけをD1へ保存する。
- 次の営業Cronは保留中の紹介候補を通常のレジストリ候補より優先する。公開HTTPS、認証不要、JSON-RPC 1.0、重複なしを確認できた場合だけ1件のヒアリングを送る。不適格候補は送信しない。
- Cronから先に送るヒアリングにも紹介URLの任意入力例を含め、通常のA2A会話と同じ紹介経路を使えるようにした。
- 成果報酬、代理販売、決済、納品、会話本文の保存は実装しない。
- 本番D1 migration `0007`を適用し、本番Version ID `b321b899-6701-4e37-b8b6-b014a28b1b21`へ配備済み。`/health`と`referral_candidates`テーブルの存在を確認。紹介候補はまだなく、手動営業送信はしていない。

## 2026-09-11 営業停止設定の監査
- 本番Workerの`OUTREACH_ENABLED=true`、Cron 3件、`scheduled` handlerを確認。営業を一律停止する不要なフラグはない。
- 送信先の公開・認証不要・Business・JSON-RPC 1.0条件、および同一候補の再送禁止は現在も有効。用途語フィルタは広いニーズ探索のため撤去し、用途にかかわらず公開Business A2A候補を聞く。
- `outreach_runs`は存在するが現時点の保存件数は0件、`outreach_attempts`は1件。新しいCron実行後に実行記録が入るか観測する。
- 本番Version ID `8df49023-aa7f-4bfd-8547-bb09226ab2d3`へ配備済み。Cron 3件と`OUTREACH_ENABLED=true`、`/health`を確認。
- 任意の `aegis_outreach_status.outcome`（`interested` / `not_interested` / `unsupported`）だけを`outreach_attempts.response_signal`へ保存する。返信本文、自由記述、会話履歴は保存しない。
- 本番D1 migration `0006` を適用し、本番Version ID `0189dc25-be19-4169-b1c8-bb1017057a5d`へ配備済み。Cron 3件と`OUTREACH_ENABLED=true`、`/health`を確認。

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

## 2026-09-11 ClawHub skill（公開試行）
- `openclaw-skill/aegis-japan-tourism-entry/SKILL.md` を追加。無料のJapan Ruleプレビューから始める指示、A2A/HTTP/MCPの接続先、購入・予約・申請を独断実行しない境界を含む。
- 依存スクリプト、秘密情報、実行コードを含まない最小スキル。ClawHub公開には別途ログインとpublish承認が必要。
- GitHubへは `478b28b feat: add OpenClaw tourism entry skill` としてpush済み。ClawHub CLI dry-runは `would-publish`、slug `aegis-japan-tourism-entry`、version `1.0.0`、1ファイルで成功。
- ClawHub Webで`@kadopi`としてGitHub連携を完了。MIT-0を受諾し、公開要求を送信した。
- ClawHubは`Review selected`と公開で`Server Error Called by client`が断続的に発生したが、新しいChromeタブで再実行して成功した。
- `Aegis Japan Tourism Entry` をClawHubへ公開済み: `https://clawhub.ai/kadopi/aegis-japan-tourism-entry`。カテゴリはIntegrations / Research / Lifestyle、トピックはjapan-tourism / travel-business / a2a / mcp。
- ClawHubへ障害報告をGitHub Issue [#3666](https://github.com/openclaw/clawhub/issues/3666) として送信済み。失敗時の再現手順に加え、同一環境での断続的な成功も追記した。

## 2026-09-13 接続準備チェックの任意デモ導線（ローカル実装）
- `AGENT_CARD_HEALTH_CHECK_URL` が有効なHTTPS MCP URLの時だけ、`POST /recommend` が `healthCheck` を追加する。
- 表示名は「接続準備チェック（無料・一回）」。接続可否・認証要否・設定違いを事前確認できると説明する。
- `mode: optional_demo` を明示し、営業Botの紹介・A2A・D1・アウトリーチとは独立した任意導線とする。
- 営業BotはHealth Checkを呼び出さず、Agent Card・認証情報・診断結果・接続先応答を受信・保存しない。
- URL未設定・HTTP・不正URL・推薦なしでは案内を返さない。設定を外せば導線も消える。
- `npm run check`、`npm test`（24 tests）、`wrangler deploy --dry-run` を確認。配備・公開・外部診断は未実施。
- `wrangler dev --var AGENT_CARD_HEALTH_CHECK_URL:...` のローカル `/recommend` で `healthCheck.mode=optional_demo` を確認。ローカルD1には既存metrics migrationがないため、非同期の既存metric書き込みだけは失敗ログとなるが、推薦応答とデモ導線は200で返った。
- 本番公開: Health Checkを `https://agent-card-health-check.kadopi.workers.dev/mcp` に公開し、`AGENT_CARD_HEALTH_CHECK_URL` を営業Botへ設定して再配備。営業Bot Version ID `a31b195f-7466-4162-910b-3b8b286633d9`。本番 `/recommend` で `healthCheck.mode=optional_demo` とMCP URLを確認。実在エージェントの診断、顧客利用、売上は未確認。

## 2026-09-13 Agent Card Health Checkカタログ追加（本番有効）
- 公開・無料・保存なしの `Agent Card Health Check` を中央カタログへ追加。MCP URLは `https://agent-card-health-check.kadopi.workers.dev/mcp`。
- Sales Botは接続案内だけを返し、診断を実行せず、Agent Card、認証情報、入力、診断結果、相手の応答を保存しない。
- Agent Card、A2A、接続先、認証設定の依頼で推薦し、対象の所有または明示的な接続許可を要求する。
- 本番Version ID `3824bb80-936f-4982-891c-eada0c8adff6`へ配備済み。`/products.json`の5商品と、A2A Agent Card接続依頼での`fit: high`推薦を確認。
## 2026-09-13 商品別AI発見ページ
- `GET /products/{productId}` を追加し、商品を接続前に単体で判断できる固定JSONを返す。
- 公開対象はJapan Rule、x402 MCP Starter、Agent Card Health Check。
- 各ページは利用場面、MCP接続URL、最初のツール、無料結果、有料条件、制限、資料URL、次の操作を含む。
- Japan Ruleは`search_entry_cases`から開始。5 USDCの条件と決済先は、下流MCPの`get_commercial_terms`から最新情報を確認する。
- x402 MCP Starterは`validate_x402_config`から開始する無料セルフホスト用スターター。
- Agent Card Health Checkは`diagnose_agent_card`から開始する無料・保存なしの接続準備確認。
- `npm run check`と`npm test`が成功（33テスト）。
- 本番配備後に3 URLの200応答と主要フィールドを確認する。
