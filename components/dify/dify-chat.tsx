"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { cn } from "@/lib/utils";

interface Msg {
  role: "user" | "bot";
  text: string;
}

const SUGGESTIONS = [
  "この問い合わせにはどう返信すればいい？",
  "見込み度はどう判断する？",
  "導入の料金はいくら？",
];

export function DifyChat() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "bot",
      text: "こんにちは。問い合わせ対応ナレッジボットです。過去の対応履歴やFAQ、サービス資料を参照して、営業対応のご相談にお答えします。下の例文からも試せます。",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"demo" | "live">("demo");
  const scrollRef = useRef<HTMLDivElement>(null);

  async function send(q: string) {
    const query = q.trim();
    if (!query || loading) return;
    setMessages((m) => [...m, { role: "user", text: query }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/dify-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      setMode(data.mode === "live" ? "live" : "demo");
      setMessages((m) => [
        ...m,
        { role: "bot", text: data.answer || "回答を取得できませんでした。" },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "bot", text: "通信エラーが発生しました。" },
      ]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-700/12 bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-ink-700/10 bg-zinc-50 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-ink-950 text-xs font-bold text-white">
            FAQ
          </span>
          <span className="text-sm font-semibold text-ink-950">
            問い合わせ対応ナレッジボット
          </span>
        </div>
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
            mode === "live"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-zinc-200 bg-zinc-100 text-zinc-500"
          )}
        >
          {mode === "live" ? "Dify連携中" : "デモモード"}
        </span>
      </div>

      <div ref={scrollRef} className="max-h-[420px] space-y-3 overflow-y-auto px-5 py-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "flex",
              m.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                m.role === "user"
                  ? "bg-ink-950 text-white"
                  : "bg-zinc-100 text-ink-800"
              )}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-zinc-100 px-4 py-2.5 text-sm text-ink-600">
              ナレッジを参照中…
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-ink-700/10 px-5 py-3">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              disabled={loading}
              className="rounded-full border border-ink-700/15 bg-white px-3 py-1 text-xs text-ink-700 transition-colors hover:bg-zinc-50 disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="質問を入力（例: この問い合わせにどう返す？）"
          />
          <Button type="submit" disabled={loading} size="md">
            送信
          </Button>
        </form>
      </div>
    </div>
  );
}
