import { cn } from "@/lib/utils";
import type { Inquiry } from "@/lib/types";

type Tone = "success" | "planned" | "skipped" | "error";

const TONE: Record<Tone, string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  planned: "bg-blue-50 text-blue-700 border-blue-200",
  skipped: "bg-zinc-100 text-zinc-500 border-zinc-200",
  error: "bg-rose-50 text-rose-700 border-rose-200",
};

const DOT: Record<Tone, string> = {
  success: "bg-emerald-500",
  planned: "bg-blue-500",
  skipped: "bg-zinc-400",
  error: "bg-rose-500",
};

function Row({
  label,
  tone,
  status,
}: {
  label: string;
  tone: Tone;
  status: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <div className="flex items-center gap-2.5">
        <span className={cn("h-2 w-2 rounded-full", DOT[tone])} />
        <span className="text-sm font-medium text-ink-800">{label}</span>
      </div>
      <span
        className={cn(
          "rounded-full border px-2.5 py-0.5 text-xs font-medium",
          TONE[tone]
        )}
      >
        {status}
      </span>
    </div>
  );
}

/** 外部連携ステータス（ログ風）の表示。 */
export function IntegrationStatus({
  inquiry,
  hasSupabase = false,
}: {
  inquiry: Inquiry;
  hasSupabase?: boolean;
}) {
  const n8nTone: Tone = inquiry.n8n_webhook_error
    ? "error"
    : inquiry.n8n_webhook_sent
      ? "success"
      : "skipped";
  const n8nStatus = inquiry.n8n_webhook_error
    ? "エラー"
    : inquiry.n8n_webhook_sent
      ? "送信済み"
      : "デモモード";
  const downstreamTone: Tone = inquiry.n8n_webhook_sent ? "planned" : "skipped";
  const downstreamStatus = inquiry.n8n_webhook_sent ? "追加予定" : "未連携";

  return (
    <div className="divide-y divide-ink-700/8">
      <Row
        label="データ保存"
        tone={hasSupabase ? "success" : "skipped"}
        status={hasSupabase ? "Supabase保存済み" : "インメモリ（デモ）"}
      />
      <Row label="n8n Webhook 送信" tone={n8nTone} status={n8nStatus} />
      <Row
        label="Google Sheets 追加"
        tone={downstreamTone}
        status={downstreamStatus}
      />
      <Row label="Slack 通知" tone={downstreamTone} status={downstreamStatus} />
      <Row
        label="Chatwork 通知"
        tone={downstreamTone}
        status={downstreamStatus}
      />
      {inquiry.n8n_webhook_error && (
        <p className="pt-2 text-xs text-rose-600">
          {inquiry.n8n_webhook_error}
        </p>
      )}
    </div>
  );
}
