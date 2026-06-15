import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import {
  LeadScoreBadge,
  StatusBadge,
  UrgencyBadge,
} from "@/components/ui/badge";
import { CopyCard } from "@/components/ui/copy-card";
import { IntegrationStatus } from "@/components/inquiry/integration-status";
import { getRuntimeConfig } from "@/lib/constants";
import { ManagePanel } from "@/components/dashboard/manage-panel";
import { WorkflowLogTimeline } from "@/components/dashboard/workflow-log";
import { getInquiry, listLogs } from "@/lib/repository";
import { buildSlackMessage } from "@/lib/n8n";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "問い合わせ詳細" };
export const dynamic = "force-dynamic";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-ink-600">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-ink-900">{value || "—"}</dd>
    </div>
  );
}

export default async function InquiryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const inquiry = await getInquiry(params.id);
  if (!inquiry) notFound();
  const logs = await listLogs(inquiry.id);

  return (
    <div className="container-wide py-10">
      <div className="flex flex-wrap items-center gap-2 text-sm text-ink-600">
        <Link href="/dashboard" className="hover:text-ink-950">
          ダッシュボード
        </Link>
        <span className="text-ink-600/40">/</span>
        <span className="text-ink-900">{inquiry.company_name}</span>
      </div>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-ink-950">
            {inquiry.company_name}
          </h1>
          <p className="mt-1 text-sm text-ink-600">
            {inquiry.contact_name || "担当者名なし"} ・ 受信:{" "}
            {formatDateTime(inquiry.created_at)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <LeadScoreBadge value={inquiry.lead_score} />
          <UrgencyBadge value={inquiry.urgency} />
          <StatusBadge value={inquiry.status} />
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Main */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-sm font-semibold text-ink-950">基本情報</h2>
              <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <Field label="メール" value={inquiry.email} />
                <Field label="電話番号" value={inquiry.phone} />
                <Field label="流入元" value={inquiry.source} />
                <Field label="予算感" value={inquiry.budget} />
                <Field label="希望時期" value={inquiry.desired_timeline} />
                <Field label="推奨担当者" value={inquiry.assigned_role} />
              </dl>
              <div className="mt-5">
                <p className="text-xs font-medium uppercase tracking-wide text-ink-600">
                  問い合わせ本文
                </p>
                <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-ink-800">
                  {inquiry.message}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-sm font-semibold text-ink-950">AI分析結果</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-zinc-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-600">
                    カテゴリ
                  </p>
                  <p className="mt-1 text-sm font-medium text-ink-950">
                    {inquiry.category}
                  </p>
                </div>
                <div className="rounded-xl bg-zinc-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-600">
                    100文字要約
                  </p>
                  <p className="mt-1 text-sm text-ink-900">{inquiry.summary}</p>
                </div>
              </div>
              <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-blue-700">
                  推奨アクション
                </p>
                <p className="mt-1 text-sm leading-relaxed text-blue-900">
                  {inquiry.recommended_action}
                </p>
              </div>
            </CardContent>
          </Card>

          <CopyCard
            title="初回返信文案"
            badge="そのまま送信できます"
            text={inquiry.reply_draft}
          />
          <CopyCard
            title="3日後の追客文案"
            badge="フォローアップ用"
            text={inquiry.followup_draft}
          />
          <CopyCard
            title="Slack通知文（想定）"
            badge="通知連携プレビュー"
            text={buildSlackMessage(inquiry)}
          />
        </div>

        {/* Side */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-sm font-semibold text-ink-950">対応管理</h2>
              <div className="mt-4">
                <ManagePanel inquiry={inquiry} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-sm font-semibold text-ink-950">
                外部連携ステータス
              </h2>
              <div className="mt-3">
                <IntegrationStatus
                  inquiry={inquiry}
                  hasSupabase={getRuntimeConfig().hasSupabase}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-sm font-semibold text-ink-950">
                ワークフローログ
              </h2>
              <p className="mt-1 text-xs text-ink-600">
                受付からの自動処理の履歴
              </p>
              <div className="mt-4">
                <WorkflowLogTimeline logs={logs} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
