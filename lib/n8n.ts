import type { Inquiry } from "./types";

export interface N8nResult {
  sent: boolean;
  skipped: boolean;
  error: string | null;
}

/**
 * n8n Webhook へ問い合わせ＋AI分析結果をPOSTする。
 * N8N_WEBHOOK_URL が未設定の場合は送信せず skipped を返す（デモモード）。
 */
export async function sendToN8n(inquiry: Inquiry): Promise<N8nResult> {
  const url = process.env.N8N_WEBHOOK_URL;
  if (!url) {
    return { sent: false, skipped: true, error: null };
  }

  const payload = {
    company_name: inquiry.company_name,
    contact_name: inquiry.contact_name,
    email: inquiry.email,
    phone: inquiry.phone,
    source: inquiry.source,
    budget: inquiry.budget,
    desired_timeline: inquiry.desired_timeline,
    message: inquiry.message,
    category: inquiry.category,
    urgency: inquiry.urgency,
    lead_score: inquiry.lead_score,
    summary: inquiry.summary,
    recommended_action: inquiry.recommended_action,
    reply_draft: inquiry.reply_draft,
    followup_draft: inquiry.followup_draft,
    assigned_role: inquiry.assigned_role,
    status: inquiry.status,
    created_at: inquiry.created_at,
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      return {
        sent: false,
        skipped: false,
        error: `n8n応答エラー: HTTP ${res.status}`,
      };
    }
    return { sent: true, skipped: false, error: null };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { sent: false, skipped: false, error: `n8n送信失敗: ${msg}` };
  }
}

/** Slack通知文テンプレートを生成（連携想定の表示用）。 */
export function buildSlackMessage(inquiry: Inquiry): string {
  const emphasis = inquiry.lead_score === "高" ? "🔥 *高見込みリード* \n" : "";
  return `${emphasis}新規問い合わせが入りました。

会社名：${inquiry.company_name}
担当者：${inquiry.contact_name}
流入元：${inquiry.source}
カテゴリ：${inquiry.category}
見込み度：${inquiry.lead_score}
緊急度：${inquiry.urgency}
要約：${inquiry.summary}
推奨対応：${inquiry.recommended_action}
返信文案：
${inquiry.reply_draft}`;
}
