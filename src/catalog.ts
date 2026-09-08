export type Product = {
  id: string;
  name: string;
  status: "public" | "local-candidate";
  summary: string;
  useCases: readonly string[];
  keywords: readonly string[];
  limitations: readonly string[];
  freeOffer: string;
  paidOffer: string | null;
  connectionType: "mcp";
  connectionUrl: string;
  docsUrl: string;
  sourceUrl: string;
  exampleInput: string;
  exampleOutput: string;
  nextAction: string;
  updatedAt: string;
};

export const catalog = [
  {
    id: "japan-rulewatch",
    name: "Japan Rule",
    status: "public",
    summary: "日本のEC・観光サービス向けに、公式資料を機械処理しやすい形式で検索します。観光商品では、日本の観光参入ガイド情報を提供します。",
    useCases: ["日本向けECの通販広告表示を確認する", "返品・解約条件の公式資料を調べる", "日本の観光事業へ参入するための公式根拠と相談準備を整理する", "第一弾として祖谷のそば打ち体験を検討する"],
    keywords: ["japan", "japanese", "ec", "ecommerce", "tourism", "travel", "hotel", "ota", "旅行", "観光", "訪日", "ホテル", "祖谷", "そば", "食文化", "体験", "通販", "広告", "表示", "返品", "返金", "解約", "特定商取引法", "rule", "rules"],
    limitations: ["法的助言や個別サイトの適法判定は行いません", "現在の有料ガイドは第一弾の祖谷・食文化体験・英語の固定パックです", "提携可否、許認可、空き状況を保証しません"],
    freeOffer: "公式資料の検索。観光商品では、日本の観光参入ガイドの対象範囲と未確認事項を無料で確認できます。第一弾は祖谷・食文化体験・英語です。",
    paidOffer: "日本の観光参入ガイド情報の提供。第一弾：徳島県三好市祖谷の既存事業者会場を想定した、6名のそば打ち体験の英語エントリー準備パック（pack_id: jp-tokushima-miyoshi-iya-soba）。事業者または委任を受けたAIエージェント向けの5 USDC単発購入です。同一の支払証明・入力条件・保存版は7日間追加課金なしで再取得できます。将来版と無期限保存は含みません。",
    connectionType: "mcp",
    connectionUrl: "https://japan-rulewatch-mcp-mainnet.kadopi.workers.dev/mcp",
    docsUrl: "https://github.com/kadopi/japan-rulewatch-mcp",
    sourceUrl: "https://github.com/kadopi/japan-rulewatch-mcp",
    exampleInput: "祖谷で既存事業者と連携し、6名の英語そば打ち体験を検討している",
    exampleOutput: "無料で対象範囲・未確認事項・購入条件を返し、有料パックでは根拠、相談先、問い合わせ文、次の行動を返します。",
    nextAction: "MCPクライアントへ接続し、search_entry_cases(region_id: jp-tokushima-miyoshi-iya, activity: food_culture_workshop, language: en) を呼び出してください。対象なら get_commercial_terms で購入条件を確認します。",
    updatedAt: "2026-09-08"
  },
  {
    id: "x402-mcp-starter",
    name: "x402 MCP Starter",
    status: "public",
    summary: "MCPツールにUSDCの従量課金を追加するための、無料のセルフホスト用Cloudflare Workersスターターです。",
    useCases: ["MCPツールにUSDC従量課金を追加する", "x402決済を使うMCPの最小実装を始める"],
    keywords: ["x402", "usdc", "payment", "payments", "課金", "決済", "mcp", "monetize", "monetization", "base", "wallet"],
    limitations: ["営業bot自身は決済・ウォレット管理・納品を行いません", "導入先サービスごとに決済と提供を設定する必要があります"],
    freeOffer: "セルフホスト用のスターターコード。",
    paidOffer: null,
    connectionType: "mcp",
    connectionUrl: "https://x402-mcp-starter.kadopi.workers.dev/mcp",
    docsUrl: "https://github.com/kadopi/x402-mcp-starter",
    sourceUrl: "https://github.com/kadopi/x402-mcp-starter",
    exampleInput: "自分のMCPツールをUSDCの呼び出し課金にしたい",
    exampleOutput: "x402 MCP Starterの導入先とセルフホスト手順を返します。",
    nextAction: "GitHub READMEを確認し、導入先Workerで決済設定を行ってください。",
    updatedAt: "2026-09-06"
  },
  {
    id: "guardrail-mcp",
    name: "Guardrail MCP",
    status: "public",
    summary: "AIエージェントの実行前に、決定的なルールで小さなリスク確認を返す読み取り専用MCPです。",
    useCases: ["外部書込みや資金移動を含む操作の事前リスク確認", "秘密情報や指示上書きの確認"],
    keywords: ["guardrail", "risk", "safety", "安全", "リスク", "secret", "secrets", "資金移動", "外部書込み", "prompt injection"],
    limitations: ["実行・外部書込み・入力保存を行いません", "最終的な法務・金融・セキュリティ判断を代替しません"],
    freeOffer: "決定的・読み取り専用の事前リスク確認。",
    paidOffer: null,
    connectionType: "mcp",
    connectionUrl: "https://guardrail-mcp.kadopi.workers.dev/mcp",
    docsUrl: "https://github.com/kadopi/guardrail-mcp",
    sourceUrl: "https://github.com/kadopi/guardrail-mcp",
    exampleInput: "エージェントが外部APIへ書き込む前にリスクを確認したい",
    exampleOutput: "proceed、proceed_with_caution、block のいずれかを返します。",
    nextAction: "MCPクライアントへ接続し、公開されているリスク確認ツールを呼び出してください。",
    updatedAt: "2026-09-06"
  }
] as const satisfies readonly Product[];
