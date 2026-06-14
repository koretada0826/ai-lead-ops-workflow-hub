import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Stat } from "@/components/ui/stat";
import { Eyebrow } from "@/components/ui/section";
import { Distribution } from "@/components/dashboard/distribution";
import { InquiryTable } from "@/components/dashboard/inquiry-table";
import { computeStats, listInquiries } from "@/lib/repository";
import { getRuntimeConfig } from "@/lib/constants";

export const metadata: Metadata = { title: "管理ダッシュボード" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const inquiries = await listInquiries();
  const stats = computeStats(inquiries);
  const cfg = getRuntimeConfig();

  return (
    <div className="container-wide py-10 sm:py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>管理ダッシュボード</Eyebrow>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink-950">
            問い合わせ・営業対応状況
          </h1>
          <p className="mt-2 text-sm text-ink-600">
            流入したリードの状態を一覧で管理し、営業担当がすぐ対応できる状態を保ちます。
            {!cfg.hasSupabase && "（現在はデモデータを表示しています）"}
          </p>
        </div>
        <ButtonLink href="/demo/inquiry">新規問い合わせを追加</ButtonLink>
      </div>

      {/* Summary cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Stat label="総問い合わせ数" value={stats.total} />
        <Stat
          label="高見込みリード"
          value={stats.highLead}
          accent="emerald"
          sub="見込み度=高"
        />
        <Stat
          label="未対応件数"
          value={stats.unhandled}
          accent="amber"
          sub="要・初動対応"
        />
        <Stat
          label="緊急対応件数"
          value={stats.urgent}
          accent="rose"
          sub="緊急度=高"
        />
        <Stat label="今月の問い合わせ" value={stats.thisMonth} accent="blue" />
        <Stat
          label="Slack/Sheets連携済"
          value={stats.integrated}
          sub="n8n送信済み"
        />
      </div>

      {/* Aggregations */}
      <div className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <Distribution title="流入元別" data={stats.bySource} />
        <Distribution title="カテゴリ別" data={stats.byCategory} />
        <Distribution title="見込み度別" data={stats.byLeadScore} />
        <Distribution title="ステータス別" data={stats.byStatus} />
      </div>

      {/* Table */}
      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-ink-950">
          問い合わせ一覧
        </h2>
        <InquiryTable inquiries={inquiries} />
      </div>
    </div>
  );
}
