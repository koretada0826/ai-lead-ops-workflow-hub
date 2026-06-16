import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "技術スタック",
  description:
    "実際に作って動かした技術（n8n / Claude API / Supabase / GAS / Next.js等）と、案件に応じて対応できる技術を分けて掲載。",
};

// ✅ 実証済み: このアプリ本体 or 公開サンプルで実際に構築・実行したもの
const PROVEN = [
  {
    name: "Next.js / TypeScript / Tailwind",
    role: "フロントエンド実装",
    body: "このサイト自体を Next.js(App Router) + TypeScript + Tailwind で構築。Three.js(WebGL)背景・レスポンシブ・スクロール演出・管理画面UIまで実装しています（＝この画面が制作物）。",
    uses: ["App Router", "型安全", "レスポンシブ", "WebGL背景", "管理画面UI"],
  },
  {
    name: "n8n",
    role: "ワークフローの中核",
    body: "Webhook受信・AI呼び出し・条件分岐・定期実行・人間承認まで、実際に複数のワークフローを構築・実行しました（インポート可能なJSONを公開）。",
    uses: ["Webhook", "HTTP/AI連携", "IF分岐", "定期実行", "人間承認"],
  },
  {
    name: "Claude API / OpenAI API",
    role: "AI分析エンジン",
    body: "本アプリの問い合わせ分類・要約・見込み度判定・返信/追客文案の生成に使用。プロバイダ切替＋失敗時フォールバックも実装。",
    uses: ["分類", "要約", "見込み度判定", "文面生成"],
  },
  {
    name: "Supabase / PostgreSQL",
    role: "DB・管理基盤",
    body: "問い合わせ履歴・AI分析・ステータス・メモを保存するDBとして実装（スキーマSQL・接続/フォールバック分岐込み）。",
    uses: ["問い合わせ履歴", "AI結果保存", "ステータス管理", "スキーマ設計"],
  },
  {
    name: "GAS（Google Apps Script）",
    role: "Google現場業務の自動化",
    body: "Sheets追記・ステータス通知・日次ダイジェストメールのスクリプトを実装（公開サンプルあり）。",
    uses: ["Sheets追記", "メール通知", "日次集計", "定期トリガー"],
  },
  {
    name: "Google Sheets / Slack / Chatwork",
    role: "保存・通知連携",
    body: "n8n / GAS 経由での一覧追記・即時通知の連携フローを構築（高見込みの強調通知まで）。",
    uses: ["1行追記", "即時通知", "高見込み強調", "担当振り分け"],
  },
];

// 🔶 対応可能: 設計・サンプルはあり、案件に応じて実装するもの
const SUPPORTED = [
  {
    name: "Dify",
    role: "ナレッジAI・チャットボット",
    body: "社内FAQ・問い合わせ対応ナレッジボットに拡張可能。デモUIとAPI連携設計を用意（実運用は案件に応じて）。",
    uses: ["社内FAQ", "営業支援AI", "ナレッジボット"],
  },
  {
    name: "Make / Zapier",
    role: "既存SaaSとのノーコード連携",
    body: "クライアントが既に使うSaaSとの簡易連携に対応。ルーター分岐＋CRM連携のブループリントを用意。",
    uses: ["SaaS連携", "ノーコード", "既存フロー修正"],
  },
  {
    name: "LangGraph",
    role: "高度なAIエージェント",
    body: "承認フローや人間確認を挟む複数ステップのエージェントに対応。設計サンプルあり（案件に応じて構築）。",
    uses: ["マルチステップ", "承認フロー", "状態管理"],
  },
  {
    name: "Playwright / Claude for Chrome",
    role: "ブラウザ自動化・リサーチ",
    body: "営業リスト収集・競合調査・テスト自動化に対応。スクリプト雛形あり（案件に応じて構築）。",
    uses: ["リスト収集", "競合調査", "テスト自動化"],
  },
];

function ToolCard({
  t,
  proven,
}: {
  t: { name: string; role: string; body: string; uses: string[] };
  proven: boolean;
}) {
  return (
    <Card className="relative overflow-hidden hover:-translate-y-1 hover:ring-sky-300/60">
      <span
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${
          proven ? "from-emerald-500 to-cyan-400" : "from-amber-400 to-orange-400"
        }`}
      />
      <CardContent className="pt-6">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-lg font-semibold text-ink-950">{t.name}</h2>
          <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-ink-600">
            {t.role}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">{t.body}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {t.uses.map((u) => (
            <span
              key={u}
              className="rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700"
            >
              {u}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function StackPage() {
  return (
    <div className="container-wide py-12 sm:py-16">
      <div className="max-w-3xl">
        <Eyebrow>技術スタック</Eyebrow>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">
          「実際に作ったもの」と「対応できるもの」を分けて掲載
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink-600">
          盛らずに正直に。下の<span className="font-medium text-ink-950">緑＝実証済み</span>は本アプリ・公開サンプルで実際に構築・実行したもの。
          <span className="font-medium text-ink-950">オレンジ＝対応可能</span>は設計・サンプルがあり、案件に応じて実装するものです。
        </p>
      </div>

      {/* 実証済み */}
      <div className="mt-10">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          <h2 className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            実証済み（実際に作って動かした）
          </h2>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {PROVEN.map((t) => (
            <ToolCard key={t.name} t={t} proven />
          ))}
        </div>
      </div>

      {/* 対応可能 */}
      <div className="mt-12">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-700">
            対応可能（サンプルあり・案件に応じて）
          </h2>
        </div>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          {SUPPORTED.map((t) => (
            <ToolCard key={t.name} t={t} proven={false} />
          ))}
        </div>
      </div>

      <div className="mt-12 rounded-3xl border border-ink-700/12 bg-white/70 p-8 text-center ring-1 ring-ink-700/5 backdrop-blur">
        <h2 className="text-xl font-semibold text-ink-950">
          要件に合わせた構成提案からお任せいただけます
        </h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/workflow" variant="secondary">
            ワークフローを見る
          </ButtonLink>
          <ButtonLink href="/contact">構成を相談する</ButtonLink>
        </div>
      </div>
    </div>
  );
}
