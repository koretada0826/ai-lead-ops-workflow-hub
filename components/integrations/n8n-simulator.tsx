"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type NodeState = "idle" | "running" | "done";

interface SimNode {
  id: string;
  label: string;
  type: string;
  col: number;
  detail: string;
}

const NODES: SimNode[] = [
  { id: "webhook", label: "Webhook", type: "問い合わせ受信", col: 0, detail: "POST /webhook/ai-lead-ops を受信" },
  { id: "set", label: "Set", type: "項目整形", col: 1, detail: "16項目を後続用に整形・マッピング" },
  { id: "if", label: "IF", type: "lead_score = 高?", col: 2, detail: "見込み度で処理を分岐" },
  { id: "sheets", label: "Google Sheets", type: "1行追加", col: 3, detail: "問い合わせ一覧に追記" },
  { id: "slack", label: "Slack", type: "高見込み通知(強調)", col: 3, detail: ":fire: で担当へメンション通知" },
];

const SAMPLE = {
  company_name: "株式会社サンライズ商事",
  source: "広告",
  category: "営業リスト自動化相談",
  lead_score: "高",
  urgency: "中",
};

function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function N8nSimulator() {
  const [states, setStates] = useState<Record<string, NodeState>>({});
  const [running, setRunning] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  async function run() {
    if (running) return;
    setRunning(true);
    setStates({});
    setLog([]);
    const order: SimNode[] = [
      NODES[0],
      NODES[1],
      NODES[2],
      NODES[3],
      NODES[4],
    ];
    for (const n of order) {
      setStates((s) => ({ ...s, [n.id]: "running" }));
      setLog((l) => [...l, `▶ ${n.label}: ${n.detail}`]);
      await wait(700);
      setStates((s) => ({ ...s, [n.id]: "done" }));
    }
    setLog((l) => [...l, "✓ 実行完了 — 高見込みリードを Sheets 追記 & Slack 強調通知"]);
    setRunning(false);
  }

  function dot(id: string) {
    const st = states[id] ?? "idle";
    return st === "done"
      ? "border-emerald-400 bg-emerald-500/15"
      : st === "running"
        ? "border-amber-400 bg-amber-400/15 animate-pulse"
        : "border-white/15 bg-white/[0.03]";
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-700/15 bg-ink-950 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-white">
            n8n 実行シミュレーション
          </h3>
          <p className="mt-0.5 text-xs text-white/50">
            アプリの Webhook 送信を受けて n8n が処理する流れを再現します。
          </p>
        </div>
        <button
          onClick={run}
          disabled={running}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-ink-950 transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {running ? "実行中…" : "▶ ワークフローを実行"}
        </button>
      </div>

      {/* payload */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {Object.entries(SAMPLE).map(([k, v]) => (
          <span
            key={k}
            className="rounded-md bg-white/[0.06] px-2 py-0.5 font-mono text-[11px] text-white/60"
          >
            {k}: <span className="text-white/85">{v}</span>
          </span>
        ))}
      </div>

      {/* nodes */}
      <div className="mt-5 grid grid-cols-4 gap-x-3 gap-y-3">
        {[0, 1, 2, 3].map((col) => (
          <div key={col} className="space-y-3">
            {NODES.filter((n) => n.col === col).map((n) => (
              <div
                key={n.id}
                className={cn(
                  "rounded-xl border p-3 transition-colors",
                  dot(n.id)
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">
                    {n.label}
                  </span>
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      (states[n.id] ?? "idle") === "done"
                        ? "bg-emerald-400"
                        : (states[n.id] ?? "idle") === "running"
                          ? "bg-amber-400"
                          : "bg-white/20"
                    )}
                  />
                </div>
                <p className="mt-1 text-[11px] leading-tight text-white/50">
                  {n.type}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* log */}
      <div className="scroll-thin mt-4 max-h-32 overflow-auto rounded-lg bg-black/30 p-3 font-mono text-[11.5px] leading-relaxed text-white/70">
        {log.length === 0 ? (
          <span className="text-white/30">
            実行ログがここに表示されます…
          </span>
        ) : (
          log.map((l, i) => <div key={i}>{l}</div>)
        )}
      </div>
    </div>
  );
}
