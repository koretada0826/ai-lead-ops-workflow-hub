// =====================================================================
// 共通型定義
// =====================================================================

export type Urgency = "高" | "中" | "低";
export type LeadScore = "高" | "中" | "低";

export type InquiryStatus =
  | "未対応"
  | "対応中"
  | "返信済み"
  | "商談化"
  | "失注"
  | "保留";

export type Source =
  | "HP"
  | "LP"
  | "広告"
  | "資料請求"
  | "紹介"
  | "SNS"
  | "メール"
  | "その他";

export type Budget =
  | "未定"
  | "5万円未満"
  | "5万〜10万円"
  | "10万〜30万円"
  | "30万〜50万円"
  | "50万円以上";

export type Timeline =
  | "すぐに相談したい"
  | "1週間以内"
  | "今月中"
  | "3ヶ月以内"
  | "情報収集中";

/** /api/analyze-inquiry への入力 */
export interface AnalyzeInput {
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  source: string;
  budget: string;
  desired_timeline: string;
  message: string;
}

/** AI分析結果（/api/analyze-inquiry の出力） */
export interface AnalysisResult {
  category: string;
  urgency: Urgency;
  lead_score: LeadScore;
  summary: string;
  recommended_action: string;
  reply_draft: string;
  followup_draft: string;
  assigned_role: string;
}

/** AI分析がどのエンジンで行われたか */
export type AnalysisEngine = "claude" | "openai" | "gemini" | "mock";

/** Supabase `inquiries` テーブルに対応するレコード */
export interface Inquiry extends AnalyzeInput, AnalysisResult {
  id: string;
  status: InquiryStatus;
  internal_note: string | null;
  n8n_webhook_sent: boolean;
  n8n_webhook_error: string | null;
  created_at: string;
  updated_at: string;
}

export type WorkflowEventType =
  | "form_submitted"
  | "ai_analyzed"
  | "supabase_saved"
  | "n8n_webhook"
  | "sheets_planned"
  | "slack_planned"
  | "chatwork_planned"
  | "status_changed"
  | "note_updated";

export type WorkflowEventStatus = "success" | "skipped" | "planned" | "error";

/** Supabase `workflow_logs` テーブルに対応するレコード */
export interface WorkflowLog {
  id: string;
  inquiry_id: string;
  event_type: WorkflowEventType;
  status: WorkflowEventStatus;
  message: string;
  created_at: string;
}

/** ダッシュボード集計 */
export interface DashboardStats {
  total: number;
  highLead: number;
  unhandled: number;
  urgent: number;
  thisMonth: number;
  integrated: number;
  bySource: Record<string, number>;
  byCategory: Record<string, number>;
  byLeadScore: Record<LeadScore, number>;
  byStatus: Record<string, number>;
}
