import type {
  Budget,
  InquiryStatus,
  LeadScore,
  Source,
  Timeline,
  Urgency,
} from "./types";

export const SOURCES: Source[] = [
  "HP",
  "LP",
  "広告",
  "資料請求",
  "紹介",
  "SNS",
  "メール",
  "その他",
];

export const BUDGETS: Budget[] = [
  "未定",
  "5万円未満",
  "5万〜10万円",
  "10万〜30万円",
  "30万〜50万円",
  "50万円以上",
];

export const TIMELINES: Timeline[] = [
  "すぐに相談したい",
  "1週間以内",
  "今月中",
  "3ヶ月以内",
  "情報収集中",
];

export const STATUSES: InquiryStatus[] = [
  "未対応",
  "対応中",
  "返信済み",
  "商談化",
  "失注",
  "保留",
];

export const LEAD_SCORES: LeadScore[] = ["高", "中", "低"];
export const URGENCIES: Urgency[] = ["高", "中", "低"];

/** ステータスごとの表示トーン */
export const STATUS_TONE: Record<InquiryStatus, string> = {
  未対応: "bg-amber-50 text-amber-700 border-amber-200",
  対応中: "bg-blue-50 text-blue-700 border-blue-200",
  返信済み: "bg-sky-50 text-sky-700 border-sky-200",
  商談化: "bg-emerald-50 text-emerald-700 border-emerald-200",
  失注: "bg-zinc-100 text-zinc-500 border-zinc-200",
  保留: "bg-violet-50 text-violet-700 border-violet-200",
};

/** アプリの環境設定状況（サーバ側で評価） */
export function getRuntimeConfig() {
  const hasSupabase =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const provider = (process.env.AI_PROVIDER || "mock").toLowerCase();
  const hasClaude = !!process.env.ANTHROPIC_API_KEY;
  const hasOpenAI = !!process.env.OPENAI_API_KEY;
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const hasN8n = !!process.env.N8N_WEBHOOK_URL;
  const hasDify = !!process.env.DIFY_API_KEY;

  let aiEngine: "claude" | "openai" | "gemini" | "mock" = "mock";
  if (provider === "claude" && hasClaude) aiEngine = "claude";
  else if (provider === "openai" && hasOpenAI) aiEngine = "openai";
  else if (provider === "gemini" && hasGemini) aiEngine = "gemini";
  else if (provider === "mock") aiEngine = "mock";
  // プロバイダ未指定でもキーがあれば自動採用（無料のGeminiを優先）
  else if (hasGemini) aiEngine = "gemini";
  else if (hasClaude) aiEngine = "claude";
  else if (hasOpenAI) aiEngine = "openai";

  return { hasSupabase, hasN8n, hasDify, hasGemini, aiEngine, provider };
}

export const AUTHOR_NAME = "koretada.i";
export const AUTHOR_EMAIL = "koretada.i@gmail.com";
// GitHub等の公開リンクが決まったらここに入れる（空なら非表示）
export const AUTHOR_GITHUB = "";

export const APP_NAME = "AIリード対応ワークフロー";
export const APP_NAME_EN = "AI Lead Ops Workflow Hub";
export const APP_ROLE = "営業・マーケ特化 AIワークフローエンジニア";
export const APP_TAGLINE = "問い合わせ対応・営業リード管理をAIで自動化";
export const APP_SUBTAGLINE =
  "HP・LP・広告・資料請求フォームから届いた問い合わせをAIが自動で分類し、見込み度判定・返信文案生成・Slack通知・Google Sheets保存まで一気通貫で実装します。";
