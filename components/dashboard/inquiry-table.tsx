"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  LeadScoreBadge,
  StatusBadge,
  UrgencyBadge,
} from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/field";
import { LEAD_SCORES, SOURCES, STATUSES, URGENCIES } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import type { Inquiry } from "@/lib/types";

export function InquiryTable({ inquiries }: { inquiries: Inquiry[] }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [lead, setLead] = useState("");
  const [urgency, setUrgency] = useState("");
  const [source, setSource] = useState("");

  const filtered = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return inquiries.filter((i) => {
      if (status && i.status !== status) return false;
      if (lead && i.lead_score !== lead) return false;
      if (urgency && i.urgency !== urgency) return false;
      if (source && i.source !== source) return false;
      if (kw) {
        const hay = `${i.company_name} ${i.contact_name} ${i.email} ${i.category} ${i.summary} ${i.message}`.toLowerCase();
        if (!hay.includes(kw)) return false;
      }
      return true;
    });
  }, [inquiries, q, status, lead, urgency, source]);

  function reset() {
    setQ("");
    setStatus("");
    setLead("");
    setUrgency("");
    setSource("");
  }

  return (
    <div>
      {/* Filters */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <Input
            placeholder="会社名・担当・本文で検索"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">ステータス: 全て</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <Select value={lead} onChange={(e) => setLead(e.target.value)}>
          <option value="">見込み度: 全て</option>
          {LEAD_SCORES.map((s) => (
            <option key={s} value={s}>
              見込み {s}
            </option>
          ))}
        </Select>
        <Select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
          <option value="">緊急度: 全て</option>
          {URGENCIES.map((s) => (
            <option key={s} value={s}>
              緊急度 {s}
            </option>
          ))}
        </Select>
        <Select value={source} onChange={(e) => setSource(e.target.value)}>
          <option value="">流入元: 全て</option>
          {SOURCES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-ink-600">
        <span>
          {filtered.length}件 / 全{inquiries.length}件
        </span>
        <button
          onClick={reset}
          className="rounded-lg px-2 py-1 font-medium text-ink-600 transition-colors hover:bg-zinc-100 hover:text-ink-950"
        >
          フィルターをリセット
        </button>
      </div>

      {/* Table */}
      <div className="scroll-thin mt-3 overflow-x-auto rounded-2xl border border-ink-700/12 bg-white shadow-card">
        <table className="w-full min-w-[920px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-ink-700/10 bg-zinc-50 text-left text-xs uppercase tracking-wide text-ink-600">
              <th className="px-4 py-3 font-medium">作成日時</th>
              <th className="px-4 py-3 font-medium">会社 / 担当</th>
              <th className="px-4 py-3 font-medium">流入元</th>
              <th className="px-4 py-3 font-medium">カテゴリ</th>
              <th className="px-4 py-3 font-medium">見込み</th>
              <th className="px-4 py-3 font-medium">緊急</th>
              <th className="px-4 py-3 font-medium">ステータス</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((i) => (
              <tr
                key={i.id}
                className="border-b border-ink-700/8 transition-colors last:border-0 hover:bg-zinc-50/70"
              >
                <td className="whitespace-nowrap px-4 py-3 text-xs text-ink-600">
                  {formatDateTime(i.created_at)}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-ink-950">
                    {i.company_name}
                  </div>
                  <div className="text-xs text-ink-600">{i.contact_name}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs text-ink-700">
                    {i.source}
                  </span>
                </td>
                <td className="px-4 py-3 text-ink-800">{i.category}</td>
                <td className="px-4 py-3">
                  <LeadScoreBadge value={i.lead_score} />
                </td>
                <td className="px-4 py-3">
                  <UrgencyBadge value={i.urgency} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge value={i.status} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/dashboard/inquiries/${i.id}`}
                    className="rounded-lg border border-ink-700/15 px-3 py-1.5 text-xs font-medium text-ink-700 transition-colors hover:bg-ink-950 hover:text-white"
                  >
                    詳細
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-12 text-center text-sm text-ink-600"
                >
                  条件に一致する問い合わせがありません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
