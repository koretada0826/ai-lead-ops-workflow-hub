"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/field";
import { BUDGETS, SOURCES, TIMELINES } from "@/lib/constants";

const SAMPLE = {
  company_name: "株式会社グッドリード",
  contact_name: "山田 太郎",
  email: "yamada@goodlead.example.jp",
  phone: "03-1234-5678",
  source: "広告",
  budget: "10万〜30万円",
  desired_timeline: "1週間以内",
  message:
    "広告経由で増えた問い合わせの対応が追いつかず、取りこぼしが発生しています。問い合わせをAIで自動分類し、見込み度の高いリードを即時にSlackへ通知、Google Sheetsに保存する仕組みを作りたいです。現在の運用フローに合わせて小さく始めたいです。",
};

const EMPTY = {
  company_name: "",
  contact_name: "",
  email: "",
  phone: "",
  source: "HP",
  budget: "未定",
  desired_timeline: "情報収集中",
  message: "",
};

export function InquiryForm() {
  const router = useRouter();
  const [form, setForm] = useState({ ...EMPTY });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!form.company_name.trim() || !form.message.trim()) {
      setError("会社名と問い合わせ本文を入力してください。");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "送信に失敗しました。");
      }
      // サーバーレスで保存が別インスタンスに無くても結果を表示できるよう控える
      try {
        if (data.inquiry) {
          sessionStorage.setItem(`inq:${data.id}`, JSON.stringify(data.inquiry));
        }
      } catch {
        /* sessionStorage非対応環境は無視 */
      }
      router.push(`/demo/result/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "送信に失敗しました。");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-ink-600">
          架空の問い合わせを入力してAI分析を実行できます。
        </p>
        <button
          type="button"
          onClick={() => setForm({ ...SAMPLE })}
          className="shrink-0 rounded-lg border border-ink-700/20 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 transition-colors hover:bg-zinc-50"
        >
          サンプルを入力
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="company_name" required>
            会社名
          </Label>
          <Input
            id="company_name"
            value={form.company_name}
            onChange={(e) => set("company_name", e.target.value)}
            placeholder="株式会社サンプル"
          />
        </div>
        <div>
          <Label htmlFor="contact_name">担当者名</Label>
          <Input
            id="contact_name"
            value={form.contact_name}
            onChange={(e) => set("contact_name", e.target.value)}
            placeholder="山田 太郎"
          />
        </div>
        <div>
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="sample@example.com"
          />
        </div>
        <div>
          <Label htmlFor="phone">電話番号</Label>
          <Input
            id="phone"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="03-1234-5678"
          />
        </div>
        <div>
          <Label htmlFor="source">流入元</Label>
          <Select
            id="source"
            value={form.source}
            onChange={(e) => set("source", e.target.value)}
          >
            {SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="budget">予算感</Label>
          <Select
            id="budget"
            value={form.budget}
            onChange={(e) => set("budget", e.target.value)}
          >
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="desired_timeline">希望対応時期</Label>
          <Select
            id="desired_timeline"
            value={form.desired_timeline}
            onChange={(e) => set("desired_timeline", e.target.value)}
          >
            {TIMELINES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="message" required>
          問い合わせ本文
        </Label>
        <Textarea
          id="message"
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          placeholder="課題・要望・問い合わせ内容を入力してください。"
          rows={6}
        />
      </div>

      <div className="flex items-center gap-3 pt-1">
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? "AIが分析中…" : "AI分析を実行する"}
        </Button>
        <button
          type="button"
          onClick={() => setForm({ ...EMPTY })}
          className="text-sm text-ink-600 transition-colors hover:text-ink-950"
        >
          クリア
        </button>
      </div>
    </form>
  );
}
