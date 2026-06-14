import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/format";
import type { WorkflowEventStatus, WorkflowLog } from "@/lib/types";

const DOT: Record<WorkflowEventStatus, string> = {
  success: "bg-emerald-500",
  planned: "bg-blue-500",
  skipped: "bg-zinc-400",
  error: "bg-rose-500",
};

const LABEL: Record<WorkflowEventStatus, string> = {
  success: "完了",
  planned: "予定",
  skipped: "スキップ",
  error: "エラー",
};

const TONE: Record<WorkflowEventStatus, string> = {
  success: "text-emerald-700 bg-emerald-50 border-emerald-200",
  planned: "text-blue-700 bg-blue-50 border-blue-200",
  skipped: "text-zinc-500 bg-zinc-100 border-zinc-200",
  error: "text-rose-700 bg-rose-50 border-rose-200",
};

/** 外部連携ログ風のタイムライン表示。 */
export function WorkflowLogTimeline({ logs }: { logs: WorkflowLog[] }) {
  if (logs.length === 0) {
    return <p className="text-sm text-ink-600">ログがありません。</p>;
  }
  return (
    <ol className="relative space-y-4 border-l border-ink-700/12 pl-5">
      {logs.map((log) => (
        <li key={log.id} className="relative">
          <span
            className={cn(
              "absolute -left-[26px] top-1 h-3 w-3 rounded-full ring-4 ring-white",
              DOT[log.status]
            )}
          />
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-ink-900">
              {log.message}
            </span>
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[11px] font-medium",
                TONE[log.status]
              )}
            >
              {LABEL[log.status]}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-ink-600">
            {formatDateTime(log.created_at)}
          </p>
        </li>
      ))}
    </ol>
  );
}
