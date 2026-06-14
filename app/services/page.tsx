import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eyebrow, SectionHeading } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "料金・受託メニュー",
  description: "問い合わせAI分類フロー構築、返信/追客文案生成、各種連携、月額保守まで。ライト/スタンダード/カスタムの料金プラン。",
};

const MENUS = [
  "問い合わせAI分類フロー構築",
  "返信文案自動生成",
  "追客文案自動生成",
  "Google Sheets連携",
  "Slack / Chatwork通知",
  "営業リスト整形",
  "リードスコアリング",
  "広告レポートAIコメント生成",
  "SEOレポートAIコメント生成",
  "採用応募者対応AI化",
  "Difyチャットボット連携",
  "n8n / GASによる業務自動化",
  "Make / Zapier既存フロー修正",
  "月額保守・改善",
];

const PLANS = [
  {
    name: "ライトプラン",
    price: "5万〜10万円",
    tag: "まず小さく始める",
    items: [
      "問い合わせフォーム連携",
      "AI分類",
      "返信文案生成",
      "Google Sheets保存",
    ],
    featured: false,
  },
  {
    name: "スタンダードプラン",
    price: "15万〜30万円",
    tag: "いちばん人気",
    items: [
      "問い合わせAI分類",
      "見込み度・緊急度判定",
      "Slack / Chatwork通知",
      "Google Sheets保存",
      "管理画面・ステータス管理",
      "追客文案生成",
    ],
    featured: true,
  },
  {
    name: "カスタムプラン",
    price: "30万円〜",
    tag: "本格導入・複数部署",
    items: [
      "既存システム連携",
      "複数部署対応",
      "Dify連携",
      "CRM連携",
      "レポート自動化",
      "独自ワークフロー構築",
    ],
    featured: false,
  },
];

export default function ServicesPage() {
  return (
    <div className="container-wide py-12 sm:py-16">
      <div className="max-w-3xl">
        <Eyebrow>料金・受託メニュー</Eyebrow>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">
          何を頼めるかが、はっきり分かる
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink-600">
          単発のフロー構築から、複数部署対応のカスタム導入、月額保守まで。下請け実装パートナーとしても、エンド企業向けの商品としても対応します。
        </p>
      </div>

      {/* Plans */}
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {PLANS.map((p) => (
          <Card
            key={p.name}
            className={
              p.featured
                ? "relative border-ink-950 ring-1 ring-ink-950"
                : "relative"
            }
          >
            {p.featured && (
              <span className="absolute -top-3 left-6 rounded-full bg-ink-950 px-3 py-1 text-xs font-semibold text-white">
                {p.tag}
              </span>
            )}
            <CardContent className="pt-7">
              {!p.featured && (
                <span className="text-xs font-medium uppercase tracking-wide text-ink-600">
                  {p.tag}
                </span>
              )}
              <h2 className="mt-1 text-lg font-semibold text-ink-950">
                {p.name}
              </h2>
              <p className="mt-2 text-2xl font-semibold tracking-tight text-ink-950">
                {p.price}
              </p>
              <ul className="mt-4 space-y-2">
                {p.items.map((it) => (
                  <li
                    key={it}
                    className="flex items-start gap-2 text-sm text-ink-700"
                  >
                    <span className="mt-0.5 text-emerald-600">✓</span>
                    {it}
                  </li>
                ))}
              </ul>
              <ButtonLink
                href="/contact"
                variant={p.featured ? "primary" : "secondary"}
                className="mt-6 w-full"
              >
                このプランで相談する
              </ButtonLink>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 月額保守 */}
      <Card className="mt-6">
        <CardContent className="flex flex-wrap items-center justify-between gap-6 pt-6">
          <div>
            <h2 className="text-lg font-semibold text-ink-950">月額保守</h2>
            <p className="mt-1 text-2xl font-semibold text-ink-950">
              3万〜10万円
              <span className="ml-1 text-sm font-normal text-ink-600">
                / 月
              </span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "プロンプト改善",
              "項目追加",
              "通知先変更",
              "Sheets修正",
              "n8nフロー修正",
              "エラー対応",
              "月次改善",
              "簡易レポート",
            ].map((it) => (
              <span
                key={it}
                className="rounded-lg border border-ink-700/12 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-ink-700"
              >
                {it}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* メニュー一覧 */}
      <div className="mt-14">
        <SectionHeading
          eyebrow="対応メニュー一覧"
          title="単機能から組み合わせまで"
        />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MENUS.map((m) => (
            <div
              key={m}
              className="flex items-center gap-2 rounded-xl border border-ink-700/12 bg-white px-4 py-3 text-sm text-ink-800 shadow-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-ink-800" />
              {m}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14 hero-dark relative overflow-hidden rounded-3xl px-8 py-12 text-center">
        <div className="bg-dots absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-2xl">
          <h2 className="text-2xl font-semibold text-white">
            下請け実装パートナーとしての発注も歓迎します
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-white/70">
            Web制作会社・広告代理店・AI導入支援会社・営業代行会社の実装フェーズを巻き取ります。既存のフォームやGoogle Sheets運用に合わせて小規模導入が可能です。
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ButtonLink
              href="/contact"
              className="bg-white text-ink-950 hover:bg-zinc-200 border-white"
            >
              問い合わせる
            </ButtonLink>
            <ButtonLink
              href="/case-studies"
              variant="outline"
              className="border-white/30 text-white hover:bg-white hover:text-ink-950"
            >
              導入ケースを見る
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
