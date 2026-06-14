"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/** 返信文案・追客文案などをコピーしやすく表示するカード。 */
export function CopyCard({
  title,
  text,
  badge,
  className,
}: {
  title: string;
  text: string;
  badge?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // クリップボード非対応環境では選択用にフォールバック
      setCopied(false);
    }
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-ink-700/12 bg-white shadow-card",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-ink-700/10 px-5 py-3">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-ink-950">{title}</h4>
          {badge && (
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-ink-600">
              {badge}
            </span>
          )}
        </div>
        <button
          onClick={copy}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
            copied
              ? "border-emerald-300 bg-emerald-50 text-emerald-700"
              : "border-ink-700/20 bg-white text-ink-700 hover:bg-zinc-50"
          )}
        >
          {copied ? "コピーしました" : "コピー"}
        </button>
      </div>
      <pre className="whitespace-pre-wrap px-5 py-4 font-sans text-sm leading-relaxed text-ink-800">
        {text}
      </pre>
    </div>
  );
}
