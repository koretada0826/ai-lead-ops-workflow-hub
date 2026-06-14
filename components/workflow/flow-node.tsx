import { cn } from "@/lib/utils";

export interface FlowNodeData {
  step: number;
  title: string;
  tools: string[];
  role: string;
  example: string;
  group: "core" | "notify" | "extend";
}

const GROUP_STYLE: Record<FlowNodeData["group"], string> = {
  core: "border-ink-700/15 bg-white",
  notify: "border-blue-200 bg-blue-50/40",
  extend: "border-violet-200 bg-violet-50/30",
};

const GROUP_LABEL: Record<FlowNodeData["group"], string> = {
  core: "コア処理",
  notify: "通知・保存",
  extend: "拡張オプション",
};

const GROUP_DOT: Record<FlowNodeData["group"], string> = {
  core: "bg-ink-800",
  notify: "bg-blue-500",
  extend: "bg-violet-500",
};

export function FlowNode({ node }: { node: FlowNodeData }) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border p-5 shadow-card transition-shadow hover:shadow-card-hover",
        GROUP_STYLE[node.group]
      )}
    >
      <div className="flex items-center justify-between">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-950 text-xs font-bold text-white">
          {node.step}
        </span>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-ink-600">
          <span className={cn("h-1.5 w-1.5 rounded-full", GROUP_DOT[node.group])} />
          {GROUP_LABEL[node.group]}
        </span>
      </div>
      <h3 className="mt-3 text-sm font-semibold text-ink-950">{node.title}</h3>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {node.tools.map((t) => (
          <span
            key={t}
            className="rounded-md border border-ink-700/12 bg-white px-2 py-0.5 text-[11px] font-medium text-ink-700"
          >
            {t}
          </span>
        ))}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-ink-600">
        <span className="font-medium text-ink-800">役割: </span>
        {node.role}
      </p>
      <p className="mt-1.5 text-xs leading-relaxed text-ink-600">
        <span className="font-medium text-ink-800">実案件例: </span>
        {node.example}
      </p>
    </div>
  );
}
