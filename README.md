# Aegis Sales Bot

外部の決済権を持つAIエージェントに、Aegisの自社サービスを機械可読に発見・利用してもらい、収益向上につなげるCloudflare Workerです。営業bot自身は決済、ウォレット、サービス実行、外部送信を行いません。

## Public HTTP interface

- `GET /health` — 稼働状態と版
- `GET /products.json` — 唯一の中央商品カタログ
- `POST /recommend` — 依頼から商品を推薦
- `POST /a2a` — A2A JSON-RPCの `SendMessage` で用途確認・推薦
- `GET /.well-known/agent-card.json` — Agent Card
- `GET /` — 短いJSON案内

```sh
curl -X POST http://localhost:8787/recommend \
  -H 'content-type: application/json' \
  -d '{"request":"日本向けECの通販広告と返品条件を調べたい"}'
```

`request`（または `purpose`）を送ると、`recommendedProduct`、選定理由、適合度、無料・有料オファー、接続先、次の操作を固定JSONで返します。カタログに適合しない依頼は `fit: "none"` と全商品一覧を返し、無理に推薦しません。

Japan Ruleの有料観光エントリー準備パックは、事業者・委任を受けたAIエージェント向けのBase Mainnet 5 USDC商品です。営業botは接続案内だけを行い、購入条件の確認、決済、配信はJapan Rule側で行います。

Agent Cardは`/a2a`をA2A JSON-RPC endpointとして、`/recommend`を独自HTTP JSON bindingとして宣言します。A2Aは同じ`taskId`で短い用途確認を継続し、商品推薦と接続案内の後に任意の2問の改善アンケートを返します。Durable Objectに保存するのは会話段階と7日間の有効期限だけです。回答は、AIが `params.metadata.survey.consent: true` を付けた場合だけD1へ保存します。会話本文、IP、秘密情報、外部送信は保存・実行しません。

## Add a product

`src/catalog.ts` が唯一の更新元です。`Product` の全必須項目を埋めて1件を追加すると、`/products.json` と推薦ロジックへ同時に反映されます。各サービス側へ商品一覧を複製しません。

## Metrics

`migrations/0001_create_daily_metrics.sql` は日付・イベント名・商品IDごとの合計だけをD1へ保存します。`migrations/0002_create_survey_responses.sql` は同意済みアンケートの回答日時、質問ID、回答、任意の会話IDだけを保存します。`migrations/0003_create_daily_funnel_metrics.sql` は、内部テスト宣言と外部または不明のアクセスを、日次・営業段階・商品別に集計します。`x-aegis-observation: internal-test` を付けたリクエストだけを内部テストとして扱い、流入元は保存・推測しません。依頼本文、IP、秘密情報は保存しません。Worker標準のHTTP/エラー指標と重複する詳細ログは実装していません。

デプロイ前に、承認済みのCloudflareアカウントでD1を作成し、`wrangler.jsonc` の `database_id` を実IDに置き換え、マイグレーションを適用してください。

## Reviewed integration proposals

外部の旅行AIエージェント／MCPへの統合提案は、公開・送信を伴わないレビュー資料として [JAPAN-RULEWATCH-TOURISM-OUTREACH.md](./JAPAN-RULEWATCH-TOURISM-OUTREACH.md) に整理します。候補・公開窓口・相手別文面を確認後、外部送信は対象別の承認を得てから行います。

## OpenClaw

OpenClawの利用者がAegis Sales BotをA2A peerとして追加し、Japan Ruleやx402関連商品をエージェントから発見・評価するための設定例は [OPENCLAW.md](./OPENCLAW.md) にあります。OpenClaw側の認証トークンは利用者自身が管理し、Sales Botへ渡しません。

## Local verification

```sh
npm install
npm run cf-typegen
npm run check
npm test
npm run dev
```

## Deployment status

Worker `aegis-sales-bot` は `https://aegis-sales-bot.kadopi.workers.dev` で公開中です。利用集計用D1 `aegis-sales-bot-metrics` はAPACに配置しています。GitHub公開は初版の対象外です。
