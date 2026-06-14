import type { AnalysisResult, LeadScore, Urgency } from "../types";

function normLevel(v: unknown): "高" | "中" | "低" {
  const s = String(v ?? "").trim();
  if (s.includes("高") || /high/i.test(s)) return "高";
  if (s.includes("低") || /low/i.test(s)) return "低";
  return "中";
}

function str(v: unknown, fallback = ""): string {
  if (typeof v === "string") return v;
  if (v == null) return fallback;
  return String(v);
}

/**
 * 生のAI出力（JSON）を AnalysisResult に正規化する。
 * フィールド欠落や表記揺れに対して防御的に整形する。
 */
export function coerceAnalysis(raw: unknown): AnalysisResult {
  const o = (raw && typeof raw === "object" ? raw : {}) as Record<
    string,
    unknown
  >;
  const summary = str(o.summary).slice(0, 120);
  return {
    category: str(o.category, "AI業務自動化の一般相談"),
    urgency: normLevel(o.urgency) as Urgency,
    lead_score: normLevel(o.lead_score) as LeadScore,
    summary,
    recommended_action: str(
      o.recommended_action,
      "オンライン相談を提案し、現状の業務フローをヒアリングする。"
    ),
    reply_draft: str(o.reply_draft),
    followup_draft: str(o.followup_draft),
    assigned_role: str(o.assigned_role, "営業・マーケ担当"),
  };
}
