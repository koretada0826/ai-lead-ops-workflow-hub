import { cn } from "@/lib/utils";

export interface FlowNodeData {
  step: number;
  title: string;
  tools: string[];
  role: string;
  example: string;
  group: "core" | "notify" | "extend";
}

// カテゴリは「色のアクセント」として残しつつ、カード自体はサイト共通のダーク調に統一
const GROUP_ACCENT: Record<FlowNodeData["group"], string> = {
  core: "from-blue-500 to-cyan-400",
  notify: "from-sky-400 to-blue-500",
  extend: "from-violet-500 to-fuchsia-500",
};

const GROUP_LABEL: Record<FlowNodeData["group"], string> = {
  core: "コア処理",
  notify: "通知・保存",
  extend: "拡張オプション",
};

const GROUP_DOT: Record<FlowNodeData["group"], string> = {
  core: "bg-cyan-400",
  notify: "bg-sky-400",
  extend: "bg-violet-400",
};

export function FlowNode({ node }: { node: FlowNodeData }) {
  return (
    <div className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0b1430] to-[#0a1f44] p-5 shadow-[0_24px_70px_-22px_rgba(2,8,30,0.7)] ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-1.5 hover:ring-cyan-400/50 hover:shadow-[0_38px_95px_-24px_rgba(34,211,238,0.5)]">
      {/* カテゴリ色のグラデ冠 */}
      <span
        className={cn(
          "absolute inset-x-0 top-0 h-1 bg-gradient-to-r",
          GROUP_ACCENT[node.group]
        )}
      />
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white shadow-lg",
            GROUP_ACCENT[node.group]
          )}
        >
          {node.step}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/60">
          <span className={cn("h-1.5 w-1.5 rounded-full", GROUP_DOT[node.group])} />
          {GROUP_LABEL[node.group]}
        </span>
      </div>
      <h3 className="mt-3 text-sm font-semibold text-white">{node.title}</h3>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {node.tools.map((t) => (
          <span
            key={t}
            className="rounded-md border border-white/10 bg-white/10 px-2 py-0.5 text-[11px] font-medium text-cyan-100"
          >
            {t}
          </span>
        ))}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-white/65">
        <span className="font-medium text-white/90">役割: </span>
        {node.role}
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-white/65">
        <span className="font-medium text-white/90">実案件例: </span>
        {node.example}
      </p>
    </div>
  );
}
