import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eyebrow, SectionHeading } from "@/components/ui/section";
import {
  APP_ROLE,
  APP_SUBTAGLINE,
  APP_TAGLINE,
  AUTHOR_EMAIL,
  AUTHOR_NAME,
} from "@/lib/constants";

const CAPABILITIES = [
  {
    title: "問い合わせAI分類",
    body: "問い合わせ内容をAIがカテゴリ分けし、担当が一目で判断できる状態に整理します。",
    tag: "Claude / OpenAI",
  },
  {
    title: "見込み度・緊急度判定",
    body: "予算・導入時期・課題の具体性から商談見込み度と緊急度をスコアリングします。",
    tag: "リードスコアリング",
  },
  {
    title: "返信文案・追客文案生成",
    body: "初回返信と3日後の追客文案を自動生成。担当はコピーして送るだけです。",
    tag: "文面自動生成",
  },
  {
    title: "Google Sheets保存",
    body: "問い合わせ一覧を既存のスプレッドシート運用にそのまま追加できます。",
    tag: "現場運用に合わせる",
  },
  {
    title: "Slack / Chatwork通知",
    body: "新規・高見込みリードを即時に通知。初動の遅れによる取りこぼしを防ぎます。",
    tag: "即時通知",
  },
  {
    title: "n8n Webhook連携",
    body: "業務フローの中核としてn8nに接続。CRMや既存SaaSへの拡張も容易です。",
    tag: "ワークフロー連携",
  },
  {
    title: "Difyナレッジボット拡張",
    body: "社内FAQ・営業支援AI・問い合わせ対応ナレッジボットへ拡張できます。",
    tag: "拡張オプション",
  },
  {
    title: "GAS / Make / Zapier連携",
    body: "クライアントが既に使っているツールに合わせて、無理なく連携します。",
    tag: "既存環境に合わせる",
  },
  {
    title: "レポート自動化",
    body: "流入元・カテゴリ・見込み度別の集計をダッシュボードとレポートに。",
    tag: "可視化・報告",
  },
];

const STACK = [
  "n8n",
  "Dify",
  "GAS",
  "Supabase",
  "Claude API",
  "OpenAI API",
  "Google Sheets",
  "Slack",
  "Chatwork",
  "Make",
  "Zapier",
  "LangGraph",
  "Playwright",
  "Claude for Chrome",
];

const FLOW = [
  "フォーム送信",
  "AI分類",
  "見込み度・緊急度判定",
  "要約・推奨アクション",
  "返信・追客文案生成",
  "Supabase保存",
  "n8n Webhook起動",
  "Sheets保存 / Slack通知",
  "管理画面・レポート化",
];

const PARTNER_RANGE = [
  {
    title: "Web制作会社の下請け実装",
    body: "HP制作後の問い合わせ対応フローをAI化し、保守・改善メニューとして提供できる形に。",
  },
  {
    title: "広告代理店の下請け実装",
    body: "広告で獲得したリードの即時通知・見込み度判定・追客文案生成で商談化率を改善。",
  },
  {
    title: "AI導入支援会社の実装パートナー",
    body: "提案フェーズの後段、実際に動くワークフローの実装・連携・保守を巻き取ります。",
  },
  {
    title: "営業代行会社の運用基盤",
    body: "リスト整形・問い合わせ分類・追客管理を自動化し、人の稼働を商談に集中させます。",
  },
];

const INDUSTRIES = [
  "Web制作会社",
  "広告代理店",
  "AI導入支援会社",
  "営業代行会社",
  "採用支援会社",
  "士業事務所",
  "スクール・講座運営",
  "不動産会社",
  "BtoBサービス会社",
  "EC / 通販会社",
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-700/10">
        <div className="hero-grid absolute inset-0 opacity-70" />
        <div className="container-page relative py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Eyebrow>{APP_ROLE}</Eyebrow>
            <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-ink-950 sm:text-5xl lg:text-6xl">
              {APP_TAGLINE}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-ink-600 sm:text-lg">
              {APP_SUBTAGLINE}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href="/demo/inquiry" size="lg">
                デモを開始する
              </ButtonLink>
              <ButtonLink href="/dashboard" size="lg" variant="secondary">
                管理画面を見る
              </ButtonLink>
            </div>
            <p className="mt-5 text-sm text-ink-600">
              AIで文章を作るだけではなく、
              <span className="font-medium text-ink-950">
                問い合わせ対応から営業管理、通知、レポート化まで、実務フローとして動く形に実装します。
              </span>
            </p>
          </div>

          {/* Inline flow strip */}
          <div className="mx-auto mt-14 flex max-w-5xl flex-wrap items-center justify-center gap-2 text-xs">
            {FLOW.map((step, i) => (
              <span key={step} className="flex items-center gap-2">
                <span className="rounded-full border border-ink-700/15 bg-white px-3 py-1.5 font-medium text-ink-700 shadow-sm">
                  {step}
                </span>
                {i < FLOW.length - 1 && (
                  <span className="text-ink-600/40">→</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 思想 */}
      <section className="container-page py-16">
        <Card className="overflow-hidden">
          <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-2 lg:items-center">
            <div>
              <Eyebrow>重要な思想</Eyebrow>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink-950">
                これは「問い合わせを増やす」サービスではありません。
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-600">
                来た問い合わせを
                <span className="font-medium text-ink-950">
                  早く・漏れなく・商談化しやすく
                </span>
                処理するためのAIリード対応ワークフローです。広告やSEOで獲得したリードの取りこぼしを防ぎ、営業担当がすぐ動ける状態にします。
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { k: "初動", v: "即時", d: "高見込みは当日対応" },
                { k: "取りこぼし", v: "削減", d: "漏れを仕組みで防ぐ" },
                { k: "商談化", v: "向上", d: "文案まで自動生成" },
              ].map((s) => (
                <div
                  key={s.k}
                  className="rounded-xl border border-ink-700/12 bg-zinc-50 p-4 text-center"
                >
                  <p className="text-xs text-ink-600">{s.k}</p>
                  <p className="mt-1 text-xl font-semibold text-ink-950">
                    {s.v}
                  </p>
                  <p className="mt-1 text-[11px] leading-tight text-ink-600">
                    {s.d}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* できること */}
      <section className="container-page py-12">
        <SectionHeading
          eyebrow="できること"
          title="AIを実務の業務フローに組み込む"
          description="単体のAIツールではなく、問い合わせ受付から通知・保存・レポートまでを一気通貫で実装します。"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((c) => (
            <Card key={c.title} className="p-6 transition-shadow hover:shadow-card-hover">
              <span className="text-[11px] font-medium uppercase tracking-wider text-ink-600">
                {c.tag}
              </span>
              <h3 className="mt-2 text-base font-semibold text-ink-950">
                {c.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {c.body}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* 技術スタック */}
      <section className="container-page py-12">
        <SectionHeading
          eyebrow="技術スタック"
          title="案件に合わせて使い分けられる"
          description="ノーコード/ローコードからAIエージェント、ブラウザ自動化まで。要件に応じて最適な組み合わせで実装します。"
        />
        <div className="mt-8 flex flex-wrap gap-2.5">
          {STACK.map((s) => (
            <span
              key={s}
              className="rounded-xl border border-ink-700/15 bg-white px-4 py-2 text-sm font-medium text-ink-800 shadow-sm"
            >
              {s}
            </span>
          ))}
        </div>
        <div className="mt-6">
          <ButtonLink href="/stack" variant="ghost" size="sm">
            技術スタックの詳細を見る →
          </ButtonLink>
        </div>
      </section>

      {/* 実装サンプル / レポート 訴求 */}
      <section className="container-page py-12">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="overflow-hidden">
            <div className="p-7">
              <Eyebrow>連携・実装サンプル</Eyebrow>
              <h3 className="mt-3 text-xl font-semibold text-ink-950">
                「説明」ではなく、動く実物で示す
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                n8nにそのままインポートできるワークフローJSON、GAS・LangGraph・Playwrightのコード、Make/Zapierのブループリントを配布。n8n実行シミュレータも用意しています。
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["n8n JSON", "GAS", "LangGraph", "Playwright", "Make/Zapier"].map(
                  (t) => (
                    <span
                      key={t}
                      className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-ink-700"
                    >
                      {t}
                    </span>
                  )
                )}
              </div>
              <div className="mt-5">
                <ButtonLink href="/integrations" size="sm">
                  実装サンプルを見る →
                </ButtonLink>
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <div className="p-7">
              <Eyebrow>レポート自動化</Eyebrow>
              <h3 className="mt-3 text-xl font-semibold text-ink-950">
                蓄積データを商談化レポートに
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                商談化ファネル、流入元別の高見込み率、見込み度分布、週次トレンドを自動集計。月次報告やクライアント共有にそのまま使えます。
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["ファネル", "流入元ROI", "見込み度分布", "週次トレンド", "AIコメント"].map(
                  (t) => (
                    <span
                      key={t}
                      className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-ink-700"
                    >
                      {t}
                    </span>
                  )
                )}
              </div>
              <div className="mt-5">
                <ButtonLink href="/reports" size="sm" variant="secondary">
                  レポートを見る →
                </ButtonLink>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 下請けパートナー範囲 */}
      <section className="container-page py-12">
        <SectionHeading
          eyebrow="下請け実装パートナー"
          title="制作会社・代理店・支援会社の実装を巻き取る"
          description="提案や獲得はそのまま、実際に動くワークフローの実装・連携・保守を担当します。"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {PARTNER_RANGE.map((p) => (
            <Card key={p.title} className="p-6">
              <h3 className="text-base font-semibold text-ink-950">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {p.body}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* 導入対象業界 */}
      <section className="container-page py-12">
        <SectionHeading
          eyebrow="導入対象業界"
          title="問い合わせ・反響対応がある業種に広く適用"
        />
        <div className="mt-8 flex flex-wrap gap-2.5">
          {INDUSTRIES.map((i) => (
            <span
              key={i}
              className="rounded-full border border-ink-700/15 bg-zinc-50 px-4 py-1.5 text-sm text-ink-700"
            >
              {i}
            </span>
          ))}
        </div>
        <div className="mt-6">
          <ButtonLink href="/case-studies" variant="ghost" size="sm">
            業界別の導入ケースを見る →
          </ButtonLink>
        </div>
      </section>

      {/* About the maker */}
      <section className="container-page py-12">
        <Card className="overflow-hidden">
          <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-3 lg:items-center">
            <div className="lg:col-span-2">
              <Eyebrow>このサイトについて</Eyebrow>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink-950">
                このサイト自体が、私の実装サンプルです
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-600">
                {APP_ROLE}の <span className="font-medium text-ink-950">{AUTHOR_NAME}</span> です。
                問い合わせ対応・営業リード管理のAI自動化を、要件定義から実装・外部連携・運用まで一気通貫で対応します。
                Web制作会社・広告代理店・AI導入支援会社の
                <span className="font-medium text-ink-950">下請け実装パートナー</span>
                としてもご依頼いただけます。
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "n8n",
                  "Dify",
                  "GAS",
                  "Supabase",
                  "Claude / OpenAI API",
                  "Make / Zapier",
                  "LangGraph",
                  "Playwright",
                ].map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-ink-700/12 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-ink-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-ink-700/12 bg-zinc-50 p-6">
              <p className="text-xs font-medium uppercase tracking-wide text-ink-600">
                お仕事のご相談
              </p>
              <p className="mt-2 text-sm leading-relaxed text-ink-800">
                n8n・AIワークフローの受託 / 下請け実装、お気軽にどうぞ。
              </p>
              <a
                href={`mailto:${AUTHOR_EMAIL}`}
                className="mt-4 block break-all text-sm font-medium text-ink-950 underline underline-offset-4 hover:text-ink-600"
              >
                {AUTHOR_EMAIL}
              </a>
              <ButtonLink href="/contact" size="sm" className="mt-4 w-full">
                問い合わせフォームへ
              </ButtonLink>
            </div>
          </div>
        </Card>
      </section>

      {/* CTA */}
      <section className="container-page py-16">
        <div className="hero-dark relative overflow-hidden rounded-3xl px-8 py-14 text-center sm:px-12">
          <div className="bg-dots absolute inset-0 opacity-40" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-white">
              まずはデモで、AIが問い合わせをどう整理するか試してください
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70">
              架空の問い合わせを入力すると、AIが分類・見込み度判定・返信文案生成までを実行します。APIキー未設定でもデモモードで動作します。
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink
                href="/demo/inquiry"
                size="lg"
                className="bg-white text-ink-950 hover:bg-zinc-200 border-white"
              >
                デモを試す
              </ButtonLink>
              <ButtonLink
                href="/services"
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white hover:text-ink-950"
              >
                料金・受託メニュー
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
