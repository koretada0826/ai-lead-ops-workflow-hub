import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eyebrow, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { WebGLBackground } from "@/components/ui/webgl-background";
import { APP_ROLE, AUTHOR_EMAIL, AUTHOR_NAME } from "@/lib/constants";

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
      {/* Hero（背景はサイト共通の SiteBackground が描画） */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.6)_0%,transparent_60%)]" />

        <div className="container-page relative py-28 sm:py-40">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/70 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-sky-700 shadow-sm backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
              制作会社・広告代理店・AI導入支援会社の 下請け実装パートナー
            </span>
            <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight text-ink-950 sm:text-5xl lg:text-[3.75rem] lg:leading-[1.08]">
              問い合わせ対応・営業リード管理の
              <br className="hidden sm:block" />
              <span className="text-gradient-blue">AI自動化を、下請けで実装</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-relaxed text-ink-600 sm:text-lg">
              御社のクライアント向けの「問い合わせ対応・営業リード管理のAI自動化」を、
              <span className="font-medium text-ink-950">
                n8n / Dify / GAS / Claude 等で下請け実装
              </span>
              します。設計から実装・外部連携・運用まで巻き取ります。
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink
                href="/integrations"
                size="lg"
                className="border-transparent bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xl shadow-blue-500/30 hover:from-blue-500 hover:to-cyan-400"
              >
                実装サンプルを見る
              </ButtonLink>
              <ButtonLink
                href="/contact"
                size="lg"
                variant="secondary"
                className="border-sky-200 bg-white/70 text-ink-900 backdrop-blur hover:bg-white"
              >
                下請けの相談をする
              </ButtonLink>
            </div>
            <p className="mt-7 text-sm text-ink-600">
              「作れます」ではなく、
              <span className="font-medium text-ink-950">
                実際に作って動かしたワークフローとコードを公開
              </span>
              しています。
            </p>
            <div className="mt-3">
              <ButtonLink href="/demo/inquiry" variant="ghost" size="sm">
                AIデモを触ってみる →
              </ButtonLink>
            </div>
          </div>

          {/* Inline flow strip */}
          <div className="mx-auto mt-16 flex max-w-5xl flex-wrap items-center justify-center gap-2 text-xs">
            {FLOW.map((step, i) => (
              <span key={step} className="flex items-center gap-2">
                <span className="rounded-full border border-sky-100 bg-white/70 px-3 py-1.5 font-medium text-ink-700 shadow-sm backdrop-blur">
                  {step}
                </span>
                {i < FLOW.length - 1 && (
                  <span className="text-sky-300">→</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 思想 */}
      <section className="container-page py-16">
        <Reveal>
          <div className="gradient-frame spotlight-panel relative overflow-hidden rounded-3xl shadow-[0_40px_120px_-30px_rgba(8,20,60,0.75)]">
            {/* 浮遊する発光オーブ */}
            <span className="animate-floaty pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-cyan-400/25 blur-3xl" />
            <span className="animate-blob pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl" />
            <span className="bg-dots pointer-events-none absolute inset-0 opacity-30" />
            {/* 上端のグラデ冠 */}
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

            <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:items-center">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-200 backdrop-blur">
                  <span className="animate-pulse-glow h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.9)]" />
                  重要な思想
                </span>
                <h2 className="mt-4 text-balance text-2xl font-bold leading-snug tracking-tight text-white sm:text-3xl">
                  これは「問い合わせを増やす」
                  <br className="hidden sm:block" />
                  サービスでは
                  <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                    ありません。
                  </span>
                </h2>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
                  来た問い合わせを
                  <span className="font-semibold text-white">
                    早く・漏れなく・商談化しやすく
                  </span>
                  処理するためのAIリード対応ワークフローです。広告やSEOで獲得したリードの取りこぼしを防ぎ、営業担当がすぐ動ける状態にします。
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {[
                  { k: "初動", v: "即時", d: "高見込みは当日対応" },
                  { k: "取りこぼし", v: "削減", d: "漏れを仕組みで防ぐ" },
                  { k: "商談化", v: "向上", d: "文案まで自動生成" },
                ].map((s, i) => (
                  <Reveal key={s.k} delay={150 + i * 110}>
                    <div className="group/stat relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-center backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-cyan-300/40 hover:bg-white/[0.1]">
                      <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500" />
                      {/* ホバーで光が走る */}
                      <span className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-white/20 opacity-0 blur-md transition-opacity duration-300 group-hover/stat:animate-[sheen_1.1s_ease-out] group-hover/stat:opacity-100" />
                      <p className="relative text-[11px] font-medium text-white/55">
                        {s.k}
                      </p>
                      <p className="relative mt-1 bg-gradient-to-br from-white via-cyan-200 to-sky-300 bg-clip-text text-2xl font-bold text-transparent">
                        {s.v}
                      </p>
                      <p className="relative mt-1.5 text-[10px] leading-tight text-white/55">
                        {s.d}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* できること */}
      <section className="container-page py-12">
        <SectionHeading
          eyebrow="できること"
          title="AIを実務の業務フローに組み込む"
          description="単体のAIツールではなく、問い合わせ受付から通知・保存・レポートまでを一気通貫で実装します。"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((c, i) => (
            <Reveal key={c.title} delay={i * 60} className="h-full">
              <Card className="relative h-full overflow-hidden border-white/10 bg-gradient-to-br from-[#0b1430] to-[#0a1f44] p-6 text-white ring-1 ring-white/10 backdrop-blur-none shadow-[0_24px_70px_-22px_rgba(2,8,30,0.7)] hover:-translate-y-2 hover:ring-cyan-400/50 hover:shadow-[0_40px_100px_-24px_rgba(34,211,238,0.6)]">
                {/* 常時表示のグラデ冠 */}
                <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500" />
                {/* コーナーグロー（常時うっすら→ホバーで強く） */}
                <span className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-cyan-400/40 opacity-50 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                {/* グレア（光沢）スイープ */}
                <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/25 opacity-0 blur-md transition-all duration-700 ease-out group-hover:left-[130%] group-hover:opacity-100" />
                <span className="relative inline-block rounded-md border border-cyan-300/20 bg-white/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-cyan-200">
                  {c.tag}
                </span>
                <h3 className="relative mt-3 text-base font-semibold text-white transition-colors group-hover:text-cyan-300">
                  {c.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-white/70">
                  {c.body}
                </p>
              </Card>
            </Reveal>
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
          {STACK.map((s, i) => (
            <Reveal key={s} delay={i * 35}>
              <span className="group/chip relative inline-flex cursor-default items-center overflow-hidden rounded-xl border border-sky-100 bg-white px-4 py-2 text-sm font-medium text-ink-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/60 hover:text-blue-700 hover:shadow-[0_12px_30px_-12px_rgba(37,99,235,0.5)]">
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-400/0 transition-colors duration-300 group-hover/chip:from-blue-500/[0.08] group-hover/chip:to-cyan-400/[0.12]" />
                <span className="relative">{s}</span>
              </span>
            </Reveal>
          ))}
        </div>
        <div className="mt-6">
          <ButtonLink href="/stack" variant="ghost" size="sm">
            技術スタックの詳細を見る →
          </ButtonLink>
        </div>
      </section>

      {/* 実装サンプル 訴求 */}
      <section className="container-page py-12">
        <div className="grid gap-4">
          <Reveal className="h-full">
          <Card className="relative h-full overflow-hidden hover:-translate-y-1.5 hover:ring-sky-300/60">
            <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500" />
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
          </Reveal>

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
          {PARTNER_RANGE.map((p, i) => (
            <Reveal key={p.title} delay={i * 80} className="h-full">
              <Card className="relative h-full overflow-hidden border-white/10 bg-gradient-to-br from-[#0b1430] to-[#0a1f44] p-6 text-white ring-1 ring-white/10 backdrop-blur-none shadow-[0_24px_70px_-22px_rgba(2,8,30,0.7)] hover:-translate-y-1.5 hover:ring-cyan-400/50 hover:shadow-[0_38px_95px_-24px_rgba(34,211,238,0.5)]">
                <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500" />
                <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/25 opacity-0 blur-md transition-all duration-700 ease-out group-hover:left-[130%] group-hover:opacity-100" />
                <h3 className="relative text-base font-semibold text-white transition-colors group-hover:text-cyan-300">
                  {p.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-white/70">
                  {p.body}
                </p>
              </Card>
            </Reveal>
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
          {INDUSTRIES.map((name, i) => (
            <Reveal key={name} delay={i * 35}>
              <span className="group/chip relative inline-flex cursor-default items-center gap-1.5 rounded-full border border-sky-100 bg-white/80 px-4 py-1.5 text-sm text-ink-700 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/60 hover:bg-white hover:text-blue-700 hover:shadow-[0_10px_26px_-12px_rgba(37,99,235,0.5)]">
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-transform duration-300 group-hover/chip:scale-150" />
                {name}
              </span>
            </Reveal>
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
        <Reveal>
        <Card className="gradient-frame overflow-hidden">
          <span className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-cyan-300/20 blur-3xl" />
          <div className="relative grid gap-8 p-8 sm:p-10 lg:grid-cols-3 lg:items-center">
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
            <div className="spotlight-panel relative overflow-hidden rounded-2xl p-6 shadow-[0_24px_60px_-24px_rgba(8,20,60,0.7)]">
              <span className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500" />
              <span className="animate-floaty pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-400/30 blur-2xl" />
              <p className="relative text-xs font-semibold uppercase tracking-wide text-cyan-200">
                お仕事のご相談
              </p>
              <p className="relative mt-2 text-sm leading-relaxed text-white/75">
                n8n・AIワークフローの受託 / 下請け実装、お気軽にどうぞ。
              </p>
              <a
                href={`mailto:${AUTHOR_EMAIL}`}
                className="relative mt-4 block break-all text-sm font-medium text-cyan-200 underline underline-offset-4 transition-colors hover:text-white"
              >
                {AUTHOR_EMAIL}
              </a>
              <ButtonLink
                href="/contact"
                size="sm"
                className="relative mt-4 w-full border-transparent bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30 hover:from-blue-500 hover:to-cyan-400"
              >
                問い合わせフォームへ
              </ButtonLink>
            </div>
          </div>
        </Card>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="container-page py-16">
        <div className="hero-dark relative overflow-hidden rounded-3xl px-8 py-14 text-center sm:px-12">
          <WebGLBackground className="pointer-events-none absolute inset-0 h-full w-full opacity-80" />
          <div className="bg-dots pointer-events-none absolute inset-0 opacity-25" />
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
