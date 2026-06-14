"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/** コード表示（コピー＋ダウンロード）。ダーク基調のコードサーフェス。 */
export function CodeBlock({
  code,
  language,
  filename,
  downloadHref,
  maxHeight = 360,
}: {
  code: string;
  language: string;
  filename: string;
  downloadHref: string;
  maxHeight?: number;
}) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* noop */
    }
  }

  const lines = code.split("\n").length;

  return (
    <div className="overflow-hidden rounded-xl border border-ink-700/15 bg-ink-950">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          </span>
          <span className="ml-1 font-mono text-xs text-white/70">{filename}</span>
          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium uppercase text-white/50">
            {language}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={copy}
            className="rounded-md border border-white/15 px-2.5 py-1 text-xs font-medium text-white/80 transition-colors hover:bg-white/10"
          >
            {copied ? "コピー済" : "コピー"}
          </button>
          <a
            href={downloadHref}
            download
            className="rounded-md border border-white/15 px-2.5 py-1 text-xs font-medium text-white/80 transition-colors hover:bg-white/10"
          >
            ↓ DL
          </a>
        </div>
      </div>
      <div
        className="scroll-thin overflow-auto"
        style={{ maxHeight: open ? "none" : maxHeight }}
      >
        <pre className="px-4 py-3 font-mono text-[12.5px] leading-relaxed text-white/85">
          <code>{code}</code>
        </pre>
      </div>
      {lines > 18 && (
        <button
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "w-full border-t border-white/10 py-2 text-xs font-medium text-white/60 transition-colors hover:bg-white/5"
          )}
        >
          {open ? "折りたたむ" : `すべて表示（${lines}行）`}
        </button>
      )}
    </div>
  );
}
