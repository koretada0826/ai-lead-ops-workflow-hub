import type { Inquiry, LeadScore } from "./types";

export interface SourceRow {
  source: string;
  total: number;
  high: number;
  highRate: number;
}

export interface TrendPoint {
  label: string;
  count: number;
}

export interface ReportData {
  total: number;
  funnel: { label: string; count: number }[];
  bySource: SourceRow[];
  byScore: Record<LeadScore, number>;
  byCategory: { label: string; count: number }[];
  trend: TrendPoint[];
  dealRate: number; // 商談化率(%)
  highUnhandled: number; // 高見込み×未対応
  urgentUnhandled: number; // 緊急×未対応
  avgPerWeek: number;
}

const DAY = 86400000;
const BASE = Date.parse("2026-06-13T01:00:00.000Z");

export function computeReport(inquiries: Inquiry[]): ReportData {
  const total = inquiries.length;

  // ファネル（営業パイプライン）
  const inStage = (statuses: string[]) =>
    inquiries.filter((i) => statuses.includes(i.status)).length;
  const funnel = [
    { label: "受付", count: total },
    { label: "着手", count: inStage(["対応中", "返信済み", "商談化"]) },
    { label: "返信", count: inStage(["返信済み", "商談化"]) },
    { label: "商談化", count: inStage(["商談化"]) },
  ];

  // 流入元別（件数＋高見込み率）
  const srcMap = new Map<string, { total: number; high: number }>();
  for (const i of inquiries) {
    const e = srcMap.get(i.source) ?? { total: 0, high: 0 };
    e.total += 1;
    if (i.lead_score === "高") e.high += 1;
    srcMap.set(i.source, e);
  }
  const bySource: SourceRow[] = [...srcMap.entries()]
    .map(([source, v]) => ({
      source,
      total: v.total,
      high: v.high,
      highRate: v.total ? Math.round((v.high / v.total) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);

  // 見込み度分布
  const byScore: Record<LeadScore, number> = { 高: 0, 中: 0, 低: 0 };
  for (const i of inquiries) byScore[i.lead_score] += 1;

  // カテゴリ別
  const catMap = new Map<string, number>();
  for (const i of inquiries)
    catMap.set(i.category, (catMap.get(i.category) ?? 0) + 1);
  const byCategory = [...catMap.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // 週次トレンド（直近6週・重複しない週バケツ）
  const weeks = 6;
  const trend: TrendPoint[] = [];
  for (let w = weeks - 1; w >= 0; w--) {
    const end = BASE - w * 7 * DAY;
    const start = end - 7 * DAY;
    const count = inquiries.filter((i) => {
      const t = Date.parse(i.created_at);
      return t > start && t <= end;
    }).length;
    trend.push({ label: w === 0 ? "今週" : `${w}週前`, count });
  }

  const dealRate = total
    ? Math.round((inStage(["商談化"]) / total) * 100)
    : 0;
  const highUnhandled = inquiries.filter(
    (i) => i.lead_score === "高" && i.status === "未対応"
  ).length;
  const urgentUnhandled = inquiries.filter(
    (i) => i.urgency === "高" && i.status === "未対応"
  ).length;
  const avgPerWeek = Math.round(
    (trend.reduce((s, t) => s + t.count, 0) / weeks) * 10
  ) / 10;

  return {
    total,
    funnel,
    bySource,
    byScore,
    byCategory,
    trend,
    dealRate,
    highUnhandled,
    urgentUnhandled,
    avgPerWeek,
  };
}
