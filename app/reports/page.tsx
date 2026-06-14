import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { Eyebrow } from "@/components/ui/section";
import {
  CategoryBars,
  Funnel,
  ScoreDonut,
  SourceBars,
  TrendArea,
} from "@/components/reports/charts";
import { listInquiries } from "@/lib/repository";
import { computeReport } from "@/lib/reports";

export const metadata: Metadata = {
  title: "レポート",
  description: "問い合わせデータから商談化ファネル・流入元別・見込み度分布・週次トレンドを自動レポート化。",
};
export const dynamic = "force-dynamic";

function Panel({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-sm font-semibold text-ink-950">{title}</h2>
        {desc && <p className="mt-0.5 text-xs text-ink-600">{desc}</p>}
        <div className="mt-4">{children}</div>
      </CardContent>
    </Card>
  );
}

export default async function ReportsPage() {
  const inquiries = await listInquiries();
  const r = computeReport(inquiries);

  return (
    <div className="container-wide py-10 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>レポート</Eyebrow>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink-950">
            問い合わせ・商談化レポート
          </h1>
          <p className="mt-2 text-sm text-ink-600">
            蓄積した問い合わせデータを自動で集計・可視化します。月次報告やクライアント共有にそのまま使える形です。
          </p>
        </div>
        <ButtonLink href="/dashboard" variant="secondary">
          ダッシュボードへ
        </ButtonLink>
      </div>

      {/* KPI */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="商談化率" value={`${r.dealRate}%`} accent="emerald" sub={`全${r.total}件中`} />
        <Stat
          label="高見込み×未対応"
          value={r.highUnhandled}
          accent="rose"
          sub="取りこぼしリスク"
        />
        <Stat
          label="緊急×未対応"
          value={r.urgentUnhandled}
          accent="amber"
          sub="即時対応が必要"
        />
        <Stat label="週平均 問い合わせ" value={r.avgPerWeek} accent="blue" />
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel title="商談化ファネル" desc="受付 → 着手 → 返信 → 商談化">
          <Funnel data={r.funnel} />
        </Panel>
        <Panel title="週次トレンド" desc="直近6週の問い合わせ件数">
          <TrendArea points={r.trend} />
        </Panel>
        <Panel title="流入元別 件数・高見込み率" desc="どのチャネルが商談につながるか">
          <SourceBars rows={r.bySource} />
        </Panel>
        <Panel title="見込み度分布">
          <ScoreDonut data={r.byScore} />
        </Panel>
        <Panel title="カテゴリ別 問い合わせ" desc="相談内容の傾向（上位8件）">
          <CategoryBars rows={r.byCategory} />
        </Panel>
        <Card className="bg-ink-950 text-white">
          <CardContent className="flex h-full flex-col justify-between pt-6">
            <div>
              <h2 className="text-sm font-semibold">AIによる示唆（例）</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/75">
                {r.highUnhandled > 0
                  ? `高見込みリードのうち ${r.highUnhandled}件 が未対応です。初動を早めることで商談化率の改善余地があります。`
                  : "高見込みリードはすべて着手済みです。良好な初動が保たれています。"}
                {r.bySource[0] &&
                  ` 流入元では「${r.bySource[0].source}」が最多（${r.bySource[0].total}件）で、高見込み率は ${r.bySource[0].highRate}% です。`}
              </p>
            </div>
            <p className="mt-4 text-xs text-white/45">
              ※ 実運用では Claude にレポートデータを渡し、月次コメントを自動生成できます（広告/SEOレポートのAIコメント生成と同じ仕組み）。
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
