import { NextResponse } from "next/server";
import { analyzeInquiry } from "@/lib/ai";
import { addLog, createInquiry, listInquiries, updateInquiry } from "@/lib/repository";
import { sendToN8n } from "@/lib/n8n";
import { rateLimit } from "@/lib/rate-limit";
import type { AnalyzeInput } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toInput(body: Record<string, unknown>): AnalyzeInput {
  const s = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : String(v));
  return {
    company_name: s(body.company_name),
    contact_name: s(body.contact_name),
    email: s(body.email),
    phone: s(body.phone),
    source: s(body.source),
    budget: s(body.budget),
    desired_timeline: s(body.desired_timeline),
    message: s(body.message),
  };
}

/** 一覧取得 */
export async function GET() {
  try {
    const inquiries = await listInquiries();
    return NextResponse.json({ inquiries });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/**
 * 新規問い合わせ受付フルパイプライン:
 * 1) AI分析  2) Supabase保存  3) n8n Webhook送信  4) workflow_logs記録
 */
export async function POST(req: Request) {
  // レート制限：公開デモでのAI API濫用（課金暴走）を防ぐ保険。
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = rateLimit(`inquiry:${ip}`);
  if (!rl.ok) {
    return NextResponse.json(
      { error: `リクエストが多すぎます。${rl.retryAfter}秒後に再度お試しください。` },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSONが不正です。" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { error: "リクエストボディはオブジェクトである必要があります。" },
      { status: 400 }
    );
  }

  const input = toInput(body);
  if (!input.company_name.trim() || !input.message.trim()) {
    return NextResponse.json(
      { error: "会社名と問い合わせ本文は必須です。" },
      { status: 400 }
    );
  }

  try {
    // 1) AI分析
    const { result, engine, fallbackNote } = await analyzeInquiry(input);

    // 2) Supabase保存（未設定時はインメモリ）
    const inquiry = await createInquiry({ ...input, ...result });
    await addLog(inquiry.id, "form_submitted", "success", "問い合わせフォームから受信");
    await addLog(
      inquiry.id,
      "ai_analyzed",
      engine === "mock" ? "skipped" : "success",
      `AI分析完了（エンジン: ${engine} / カテゴリ: ${result.category}）${fallbackNote ? ` ※${fallbackNote}` : ""}`
    );
    await addLog(inquiry.id, "supabase_saved", "success", "問い合わせとAI分析結果を保存しました");

    // 3) n8n Webhook送信
    const n8n = await sendToN8n(inquiry);
    if (n8n.sent) {
      await updateInquiry(inquiry.id, { n8n_webhook_sent: true, n8n_webhook_error: null });
      await addLog(inquiry.id, "n8n_webhook", "success", "n8n Webhookに送信しました");
      await addLog(inquiry.id, "sheets_planned", "planned", "Google Sheetsへの追加予定");
      await addLog(inquiry.id, "slack_planned", "planned", "Slack通知予定");
    } else if (n8n.skipped) {
      await addLog(inquiry.id, "n8n_webhook", "skipped", "デモモード: N8N_WEBHOOK_URL未設定のためスキップ");
    } else {
      await updateInquiry(inquiry.id, { n8n_webhook_error: n8n.error });
      await addLog(inquiry.id, "n8n_webhook", "error", n8n.error ?? "n8n送信エラー");
    }

    return NextResponse.json({
      id: inquiry.id,
      inquiry: { ...inquiry, n8n_webhook_sent: n8n.sent },
      engine,
      fallbackNote: fallbackNote ?? null,
      n8n: { sent: n8n.sent, skipped: n8n.skipped, error: n8n.error },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `保存処理に失敗しました: ${msg}` },
      { status: 500 }
    );
  }
}
