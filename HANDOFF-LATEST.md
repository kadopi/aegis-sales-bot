# Aegis Sales Bot 最新引き継ぎ（2026-10-14 JST）

## 現在地
- 本番: `https://aegis-sales-bot.kadopi.workers.dev`。GitHub: `kadopi/aegis-sales-bot` の `main`。
- Sales Botは商品発見・推薦・接続案内・任意アンケートを担当。決済と納品は各商品側。
- Cronは1日3回の公開Agent Card探索のみ。候補は本番D1 `outreach_candidates` に待機登録する。
- 初回A2A送信は候補・本文ごとの承認後のみ。`outreach_attempts`で同一Agent Cardへの再送を防ぐ。
- 送信、受領、関心、実利用、購入を別の事実として扱う。

## 直近の営業結果
- 10月12〜14日21:59 JSTの本番D1確認: 探索9回、新規候補9件、アンケート回答・紹介は各0件。確認時点の送信は0件だった。
- 10月14日、ユーザーが9候補へのA2A送信を明示承認。用途別の無料サービス紹介と任意の需要質問を各窓口へ送信し、全9件でHTTP 200とJSON-RPC結果応答を受領した。
- Awarenessは初回の`SendMessage`が`-32601`で拒否され、同じ文面を`message/send`形式に修正して受領された。9宛先に対するHTTP POSTは計10回。
- 応答は主に商品・接続先・公開情報の案内。具体的なニーズ回答、購入意向、顧客利用、売上は未確認。
- GetBodyは「ロボット作業を依頼しない」と明記した営業紹介を依頼として登録したと回答（request_id 33、no_match_yet）。営業成果に計上しない。取り消し・削除は未実施。
- `outreach_attempts`へ送信日時・HTTPステータス・応答分類、`outreach_candidates`へ`contacted`を保存し、9件の記録を読み返して確認。返信本文はD1に保存していない。
- D1アクセスは既存OAuth認証の更新後に復旧。先の7403の原因は未確定。コード変更・設定変更・再配備なし。
- 詳細: `docs/operations/2026-10-14-a2a-outreach.md`。

## 過去の営業結果（2026-10-06までの確認）
- 2026-10-05〜06 JSTの探索実行6回、新規候補6件。A2A呼出し11回は送信元が外部または不明で、需要・利用の証拠ではない。
- 10月6日、Museへ承認済み初回A2Aヒアリングを送信。自己紹介受付と無料Town Squareの案内を受領。ニーズ回答はない。
- 同日、Muse Town Squareへ `aegis-sales-bot` 名で無料登録し、#introsへニーズ質問を1件投稿。公開投稿ID `d062374661afea8b` を確認。
- Town Square登録キーはGit管理外の営業運用フォルダ `.secrets/stratly-town-square-registration.json` に保管（ディレクトリ700、ファイル600）。キーをGitへ含めない。
- Museの送信本文: `../../2026-09-08/aegis-sales-bot-operations/outputs/MUSE-A2A-INITIAL-2026-10-06.json`。営業運用資料は別のGit管理外フォルダ。
- Cape Partnersへの10月3日の申告は後に人手で受理され、チャネルは有効。紹介先照合には具体的なmandateが必要。需要回答はない。
- cloudpayXは初回A2Aヒアリングを受領したが、無料の機能案内ルーターの定型応答のみ。
- 本番D1のCape `response_signal` は最初の自動判定のままで、後の受理状態を反映していない。
- 10月5〜6日の確認時点でアンケート・紹介は0件。商談・購入の証拠は未確認。

## 商品と配備差
- 公開商品はJapan RuleWatch、無料のAgent Card Health Check、無料のx402 MCP Starterなど。
- x402 MCP Integration Kitの`$19`買い切りGumroad URLはソースのカタログに設定済み。無料Starterとは別商品。
- 10月6日の本番 `GET /products/x402-mcp-integration-kit` は `product_not_found`。このカタログ変更は未配備として扱う。

## 次の作業
- 10月14日の9件は接触済み。追加送信・別チャネルの投稿は個別承認後に行う。GetBodyの誤登録を営業成果に含めない。
- Muse #introsの返信を確認し、受付案内と具体的なニーズ回答を区別する。追加投稿や自動化は別承認で行う。
- Capeの新着を必要時に読み、照合を求める場合は事実に沿ったmandateを作って個別承認後に提出する。
- 他の候補は公開Agent Cardの対応機能を確認し、相手の用途に合わせて個別にヒアリングする。
- 本番D1のCape結果を更新する場合は、後の受理を確認した事実と初回自動判定を混同しない。

## 境界と関連ファイル
- 本番D1: `aegis-sales-bot-metrics`。`outreach_runs`・`outreach_candidates`・`outreach_attempts`・`survey_responses` を使用。
- 営業運用資料: `../../2026-09-08/aegis-sales-bot-operations/outputs/HANDOFF-LATEST.md`。
- 外部送信、公開、決済、契約、配備は対象別の明示承認に従う。秘密情報をリポジトリへ入れない。
