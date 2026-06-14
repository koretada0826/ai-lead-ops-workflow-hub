import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  LeadScoreBadge,
  StatusBadge,
  UrgencyBadge,
} from "@/components/ui/badge";
import { CopyCard } from "@/components/ui/copy-card";
import { IntegrationStatus } from "@/components/inquiry/integration-status";
import { getInquiry } from "@/lib/repository";
import { formatDateTime } from "@/lib/format";

export const metadata: Metadata = { title: "AI分析結果" };
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

export default async function ResultPage({
  params,
}: {
  params: { id: string };
}) {
  const inquiry = await getInquiry(params.id);
  if (!inquiry) notFound();

  const highlight = inquiry.lead_score === "高";

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-wrap items-center gap-2 text-sm text-ink-600">
          <span>AI分析結果</span>
          <span className="text-ink-600/40">/</span>
          <span className="text-ink-900">{inquiry.company_name}</span>
        </div>

        {/* Header card */}
        <Card
          className={
            highlight
              ? "mt-4 border-emerald-300 ring-1 ring-emerald-200"
              : "mt-4"
          }
        >
          <CardContent className="pt-6">
            {highlight && (
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                ★ 高見込みリード — 優先対応を推奨
              </div>
            )}
            <div className="flex flex-wrap items-start justify-between gap-4">
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

            <div className="mt-5 rounded-xl bg-zinc-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-ink-600">
                AIによる100文字要約
              </p>
              <p className="mt-1 text-base font-medium text-ink-950">
                {inquiry.summary}
              </p>
            </div>

            <div className="mt-4 grid gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-ink-600">
                カテゴリ / 推奨担当者ロール
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-lg border border-ink-700/15 bg-white px-3 py-1.5 text-sm font-medium text-ink-900">
                  {inquiry.category}
                </span>
                <span className="text-ink-600/40">→</span>
                <span className="rounded-lg border border-ink-700/15 bg-white px-3 py-1.5 text-sm text-ink-700">
                  {inquiry.assigned_role}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Left: details */}
          <div className="space-y-6 lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-sm font-semibold text-ink-950">
                  問い合わせ元情報
                </h2>
                <dl className="mt-4 grid grid-cols-2 gap-4">
                  <Field label="メール" value={inquiry.email} />
                  <Field label="電話番号" value={inquiry.phone} />
                  <Field label="流入元" value={inquiry.source} />
                  <Field label="予算感" value={inquiry.budget} />
                  <Field label="希望時期" value={inquiry.desired_timeline} />
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
                <h2 className="text-sm font-semibold text-ink-950">
                  推奨アクション
                </h2>
                <p className="mt-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-relaxed text-blue-900">
                  {inquiry.recommended_action}
                </p>
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
          </div>

          {/* Right: integration + actions */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-sm font-semibold text-ink-950">
                  外部連携ステータス
                </h2>
                <p className="mt-1 text-xs text-ink-600">
                  問い合わせ受付後の自動処理フロー
                </p>
                <div className="mt-3">
                  <IntegrationStatus inquiry={inquiry} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3 pt-6">
                <ButtonLink
                  href={`/dashboard/inquiries/${inquiry.id}`}
                  className="w-full"
                >
                  この結果を管理画面で見る
                </ButtonLink>
                <ButtonLink
                  href="/demo/inquiry"
                  variant="secondary"
                  className="w-full"
                >
                  別の問い合わせで試す
                </ButtonLink>
                <ButtonLink
                  href="/dashboard"
                  variant="ghost"
                  className="w-full"
                >
                  ダッシュボードへ
                </ButtonLink>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
