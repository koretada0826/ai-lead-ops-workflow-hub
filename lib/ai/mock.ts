import type { AnalysisResult, AnalyzeInput, LeadScore, Urgency } from "../types";

// =====================================================================
// モックAI: APIキーが無くても実務っぽいAI分析結果を返す。
// 問い合わせ本文のキーワードでカテゴリを推定し、
// 予算・希望時期・緊急表現から見込み度/緊急度をスコアリングする。
// =====================================================================

interface CategoryRule {
  keywords: string[];
  category: string;
  role: string;
  /** カテゴリ固有の文案テンプレート断片 */
  topic: string;
  action: (name: string) => string;
}

const CATEGORY_RULES: CategoryRule[] = [
  {
    keywords: ["営業リスト", "リスト", "テレアポ", "アポ", "新規開拓", "架電"],
    category: "営業リスト自動化相談",
    role: "営業・マーケ担当",
    topic: "営業リスト作成・新規開拓の自動化",
    action: () =>
      "24時間以内にオンライン相談を提案し、現在のリスト作成フローと利用ツール（スプレッドシート/CRM）をヒアリングする。",
  },
  {
    keywords: ["広告", "リスティング", "GA4", "コンバージョン", "CV", "ROAS", "媒体レポート"],
    category: "広告レポート自動化相談",
    role: "広告運用・マーケ担当",
    topic: "広告レポートのAIコメント生成・自動化",
    action: () =>
      "媒体（Google/Meta等）と現在のレポート作成手順を確認し、AIコメント自動生成のサンプルを提示する。",
  },
  {
    keywords: ["SEO", "検索順位", "Search Console", "サチコ", "コンテンツ", "流入"],
    category: "SEOレポート自動化相談",
    role: "SEO・マーケ担当",
    topic: "SEOレポートのAIコメント生成・自動化",
    action: () =>
      "Search Console連携とレポート頻度を確認し、順位変動のAI要約サンプルを提示する。",
  },
  {
    keywords: ["採用", "応募者", "面談", "面接", "求人", "スカウト", "ATS"],
    category: "採用対応自動化相談",
    role: "採用・人事担当（要・個人情報配慮）",
    topic: "応募者対応・採用フローの自動化",
    action: () =>
      "応募〜面談調整の現状フローを確認し、個人情報の取り扱いに配慮した自動返信・スコアリング案を提示する。",
  },
  {
    keywords: ["チャットボット", "FAQ", "社内ナレッジ", "ナレッジ", "問い合わせ対応", "Dify", "ボット"],
    category: "Difyチャットボット相談",
    role: "カスタマーサポート・情シス担当",
    topic: "社内FAQ・問い合わせ対応ナレッジボットの構築",
    action: () =>
      "想定する質問範囲とナレッジソース（資料/Sheets/Notion）を確認し、Difyでのナレッジボット構成案を提示する。",
  },
  {
    keywords: ["不動産", "内見", "物件", "反響", "賃貸", "売買", "問い合わせ反響"],
    category: "不動産反響対応相談",
    role: "反響対応・営業担当（要・個人情報配慮）",
    topic: "不動産反響（問い合わせ）への即時一次対応自動化",
    action: () =>
      "反響流入元と現在の初動対応時間を確認し、即時一次返信＋担当割り当ての自動化案を提示する（重要事項は担当者確認前提）。",
  },
  {
    keywords: ["士業", "相続", "補助金", "会社設立", "税理士", "行政書士", "社労士", "顧問"],
    category: "士業問い合わせ対応相談",
    role: "士業事務所担当（要・法務/個人情報配慮）",
    topic: "士業事務所の問い合わせ一次対応の自動化",
    action: () =>
      "問い合わせ種別の分類軸を確認し、断定を避けた一次返信文案と有資格者への振り分けルールを提示する。",
  },
  {
    keywords: ["スクール", "講座", "受講", "資料請求", "説明会", "体験", "セミナー"],
    category: "スクール資料請求対応相談",
    role: "インサイドセールス・運営担当",
    topic: "資料請求・説明会リードへの追客自動化",
    action: () =>
      "資料請求後の歩留まりを確認し、説明会誘導・段階的な追客文面の自動生成案を提示する。",
  },
  {
    keywords: ["研修", "内製", "実装", "勉強会", "AI導入", "PoC", "伴走"],
    category: "AI研修後の実装相談",
    role: "AI導入コンサル・実装担当",
    topic: "研修後の実装・内製化の伴走支援",
    action: () =>
      "現在の内製状況と詰まっている工程を確認し、小さく動く実装テーマを1つ決めて伴走提案する。",
  },
];

const GENERAL_RULE: CategoryRule = {
  keywords: [],
  category: "AI業務自動化の一般相談",
  role: "営業・マーケ担当",
  topic: "業務フローのAI自動化",
  action: () =>
    "問い合わせ内容を確認のうえ、オンライン相談を提案し、現状の業務フローと優先課題をヒアリングする。",
};

function detectRule(message: string): CategoryRule {
  const text = message || "";
  let best: { rule: CategoryRule; hits: number } | null = null;
  for (const rule of CATEGORY_RULES) {
    const hits = rule.keywords.filter((k) => text.includes(k)).length;
    if (hits > 0 && (!best || hits > best.hits)) best = { rule, hits };
  }
  return best?.rule ?? GENERAL_RULE;
}

const URGENT_WORDS = [
  "至急", "急ぎ", "すぐ", "今すぐ", "本日", "今日中", "明日", "今週中",
  "緊急", "早急", "間に合わ", "締め切り", "納期",
];

function scoreLead(input: AnalyzeInput): LeadScore {
  let score = 0;
  const b = input.budget;
  if (b === "50万円以上") score += 3;
  else if (b === "30万〜50万円") score += 2;
  else if (b === "10万〜30万円") score += 2;
  else if (b === "5万〜10万円") score += 1;
  else if (b === "5万円未満") score += 0;

  const t = input.desired_timeline;
  if (t === "すぐに相談したい") score += 3;
  else if (t === "1週間以内") score += 2;
  else if (t === "今月中") score += 2;
  else if (t === "3ヶ月以内") score += 1;
  else if (t === "情報収集中") score -= 1;

  // 具体的な課題が書かれている＝本文が長い/数字や固有名詞を含む
  const msg = input.message || "";
  if (msg.length >= 120) score += 2;
  else if (msg.length >= 50) score += 1;
  if (/\d/.test(msg)) score += 1;
  if (/(課題|困って|手作業|工数|時間がかか|属人|ミス|漏れ)/.test(msg)) score += 1;
  if (/(情報収集|とりあえず|なんとなく|検討段階|まだ具体)/.test(msg)) score -= 2;

  if (input.source === "紹介") score += 1;

  if (score >= 5) return "高";
  if (score >= 2) return "中";
  return "低";
}

function scoreUrgency(input: AnalyzeInput): Urgency {
  const msg = input.message || "";
  const hasUrgentWord = URGENT_WORDS.some((w) => msg.includes(w));
  if (input.desired_timeline === "すぐに相談したい" || hasUrgentWord) return "高";
  if (input.desired_timeline === "1週間以内" || input.desired_timeline === "今月中")
    return "中";
  return "低";
}

function honorific(name: string): string {
  const n = (name || "").trim();
  return n ? `${n}様` : "ご担当者様";
}

function buildSummary(input: AnalyzeInput, rule: CategoryRule): string {
  const company = input.company_name ? `${input.company_name}より、` : "";
  const base = `${company}${rule.topic}に関する問い合わせ。`;
  const ctx: string[] = [];
  if (input.budget && input.budget !== "未定") ctx.push(`予算${input.budget}`);
  if (input.desired_timeline) ctx.push(input.desired_timeline);
  const tail = ctx.length ? `（${ctx.join("・")}）` : "";
  const s = `${base}${tail}`;
  return s.length > 100 ? s.slice(0, 99) + "…" : s;
}

function buildReply(input: AnalyzeInput, rule: CategoryRule): string {
  return `${honorific(input.contact_name)}
お問い合わせいただきありがとうございます。${rule.topic}について、ご相談を承れます。
いただいた内容を拝見し、まずは現在の運用フローや課題を伺ったうえで、Google Sheetsやn8n、AIを活用した効率化案を具体的にご提案いたします。
過度に大きな仕組みからではなく、効果の出やすい部分から小さく始める形もご提案可能です。
まずは30分ほどオンラインでお話しできれば幸いです。ご都合のよい候補日を2〜3いただけますでしょうか。`;
}

function buildFollowup(input: AnalyzeInput, rule: CategoryRule): string {
  return `${honorific(input.contact_name)}
先日はお問い合わせいただきありがとうございました。${rule.topic}について、その後ご検討状況はいかがでしょうか。
もし社内でのご確認やご検討が進んでいれば、現在の運用を簡単に伺えれば、どの部分から小さく自動化できるかを整理してご提案いたします。
「まず何から手をつけるか」だけでも、15分ほどで整理のお手伝いができればと思います。お気軽にご返信ください。`;
}

/** モックAI分析。決定的（同じ入力なら同じ出力）。 */
export function mockAnalyze(input: AnalyzeInput): AnalysisResult {
  const rule = detectRule(input.message || "");
  return {
    category: rule.category,
    urgency: scoreUrgency(input),
    lead_score: scoreLead(input),
    summary: buildSummary(input, rule),
    recommended_action: rule.action(input.contact_name),
    reply_draft: buildReply(input, rule),
    followup_draft: buildFollowup(input, rule),
    assigned_role: rule.role,
  };
}
