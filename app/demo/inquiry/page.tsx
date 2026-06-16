import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/section";
import { InquiryForm } from "@/components/inquiry/inquiry-form";
import { getRuntimeConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "問い合わせデモ",
  description: "架空の問い合わせを入力し、AIによる分類・見込み度判定・返信文案生成を試せます。",
};

const STEPS = [
  { n: "1", t: "問い合わせ入力", d: "会社・流入元・本文などを入力" },
  { n: "2", t: "AI分析", d: "分類・見込み度・要約・文案を生成" },
  { n: "3", t: "保存・連携", d: "DB保存 → n8n → 通知（想定）" },
  { n: "4", t: "結果確認", d: "営業がすぐ動ける形で表示" },
];

export default function DemoInquiryPage() {
  const cfg = getRuntimeConfig();
  const engineLabel =
    cfg.aiEngine === "claude"
      ? "Claude API"
      : cfg.aiEngine === "gemini"
        ? "Gemini API"
        : cfg.aiEngine === "openai"
          ? "OpenAI API"
          : "デモモード（モックAI）";

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Eyebrow>問い合わせデモ</Eyebrow>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">
          AIが問い合わせをどう整理するか試す
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink-600">
          入力された問い合わせをAIが分類し、見込み度・緊急度判定、100文字要約、推奨アクション、初回返信文案、追客文案までを生成します。
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full border border-ink-700/15 bg-white px-3 py-1.5 font-medium text-ink-700">
            AIエンジン: {engineLabel}
          </span>
          <span className="rounded-full border border-ink-700/15 bg-white px-3 py-1.5 font-medium text-ink-700">
            保存先: {cfg.hasSupabase ? "Supabase" : "インメモリ（デモ）"}
          </span>
          <span className="rounded-full border border-ink-700/15 bg-white px-3 py-1.5 font-medium text-ink-700">
            n8n: {cfg.hasN8n ? "連携あり" : "デモモード"}
          </span>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="rounded-xl border border-ink-700/12 bg-white p-4 shadow-sm"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-950 text-xs font-bold text-white">
                {s.n}
              </span>
              <p className="mt-2 text-sm font-semibold text-ink-950">{s.t}</p>
              <p className="mt-0.5 text-xs leading-tight text-ink-600">{s.d}</p>
            </div>
          ))}
        </div>

        <Card className="mt-8">
          <CardContent className="pt-6">
            <InquiryForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
