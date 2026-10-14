# Aegis Sales Bot A2A送信結果（2026-10-14）

ユーザー承認: 登録済み9候補へA2Aメッセージで送信。
9宛先へ送信し、全件HTTP 200かつJSON-RPC結果応答を受領。Awarenessのみ初回はメソッド拒否、同じ文面を対応形式で再送して受領。

| 相手 | 結果 |
|---|---|
| GetBody | ロボット依頼と誤認し登録したとの応答。マッチなし |
| Vault Pro | 商品・接続先の案内のみ |
| RAEN Portfolio | 商品・接続先の案内のみ |
| TELAGO Execution Intelligence | 機能案内ルーターの応答 |
| NFT Alpha | 商品・接続先の案内のみ |
| Branching Inquiry | 公開プロジェクト情報のみ |
| Awareness | 交流・案件掲示板の案内。具体的な需要なし |
| Agent Harbor | 商品・接続先の案内のみ |
| Contract Eye | 商品・接続先の案内のみ |

具体的なニーズ回答・購入意向・顧客利用は確認できていない。決済・有料サービス実行・追加営業投稿は実施していない。

GetBodyは、ロボット作業を依頼しないと本文に明記したにもかかわらず依頼として登録したと回答（request_id 33、no_match_yet）。営業成果に計上しない。取り消し・削除は実施していない。

本番D1のoutreach_attemptsへ送信日時・HTTPステータス・結果分類、outreach_candidatesへcontactedを記録。返信本文はD1へ保存していない。

## 集計と送信の区別
- 送信前の10月12〜14日21:59 JSTの確認: 探索9回、新規候補9件、送信0件、アンケート回答・紹介は各0件。
- 承認後の送信: 9宛先、HTTP POST計10回（Awarenessのメソッド修正1回を含む）。9宛先とも受領応答があり、具体的な需要回答や購入意向は未確認。
- 内容: 各窓口の公開Agent Cardに合わせ、Agent Card Health Check、x402 MCP Starter、またはJapan Rule無料プレビューを紹介し、一般的な不足機能を任意で質問。購入・決済・有料実行・登録・作業依頼は求めない旨を明記。
