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
    summary: "Machine-readable entry guidance for businesses and authorized AI agents that want to launch an experiential tour in Japan. A free model-case preview shows what to decide; the paid pack provides the official-source locations, contact routes, inquiry text and action order needed to proceed. It does not provide bookable inventory.",
    useCases: ["Research official sources for Japanese ecommerce advertising, returns, or cancellation terms", "Decide whether a Japan experiential-tourism model case is worth taking to provider or authority checks", "Use the Iya English soba-workshop model case to preview operating decisions before retrieving an execution pack", "日本向けECの通販広告表示を確認する", "日本の体験型ツアー観光への参入で、無料プレビューから実務確認が必要か判断する"],
    keywords: ["japan", "japanese", "ec", "ecommerce", "tourism", "travel", "hotel", "ota", "workshop", "food culture", "旅行", "観光", "訪日", "ホテル", "祖谷", "そば", "食文化", "体験", "通販", "広告", "表示", "返品", "返金", "解約", "特定商取引法", "rule", "rules"],
    limitations: ["No legal advice or site-specific compliance decision", "The paid offer is a fixed English consultation-preparation pack for the Iya food-culture workshop model case", "Venue participation, commercial partnership, permissions, language support, water source, and live availability are unconfirmed"],
    freeOffer: "Start with a free execution preview: the model case, three decision themes, and what the paid preparation pack adds. It does not include source locations, contact routes, inquiry text, or an action plan.",
    paidOffer: "Business-only Japan Experiential Tourism Entry Guide information. First offer: a 5 USDC, single-purchase English consultation-preparation pack for the Iya, Tokushima six-person soba-workshop model case (pack_id: jp-tokushima-miyoshi-iya-soba). It provides source references, contact points, inquiry text, and next actions. An authorized business principal or its delegated AI may retrieve the same saved result for seven days with the same payment proof and normalized input. It is not a workshop ticket, a booking, a permit application, or a guarantee that a tour can launch.",
    connectionType: "mcp",
    connectionUrl: "https://japan-rulewatch-mcp-mainnet.kadopi.workers.dev/mcp",
    docsUrl: "https://github.com/kadopi/japan-rulewatch-mcp",
    sourceUrl: "https://github.com/kadopi/japan-rulewatch-mcp",
    exampleInput: "I am an AI agent acting for a business that wants to launch an experiential tour in Japan. Use the Iya English soba-workshop model case to identify what we need to check first.",
    exampleOutput: "The free MCP call returns a six-person Iya model case, three decision themes, and a paid-delivery preview. The paid pack returns official-source locations, published contact routes, inquiry text, and prioritized next actions after x402 settlement.",
    nextAction: "Connect an MCP client and call search_entry_cases with region_id jp-tokushima-miyoshi-iya, activity food_culture_workshop, and language en. Review the model-case scope and missing facts, then call get_commercial_terms before deciding whether an authorized business should purchase.",
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
