import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "技術スタック",
  description: "n8n / Dify / GAS / Supabase / Claude API / Make / Zapier / LangGraph / Playwright を案件に合わせて使い分けます。",
};

const TOOLS = [
  {
    name: "n8n",
    role: "ワークフローの中核",
    body: "Webhook、API連携、Google Sheets保存、Slack/Chatwork通知、CRM連携など、業務フローの中核として使用します。",
    uses: ["Webhook受信", "条件分岐", "Sheets追加", "通知", "CRM連携"],
  },
  {
    name: "Dify",
    role: "ナレッジAI・チャットボット",
    body: "社内FAQ、営業支援AI、問い合わせ対応ナレッジボット、サービス資料検索AIとして拡張できます。",
    uses: ["社内FAQ", "営業支援AI", "ナレッジボット", "資料検索"],
  },
  {
    name: "GAS",
    role: "Google現場業務の自動化",
    body: "Google Sheets上でのステータス更新、メール下書き生成、日次集計など、現場向け自動化に使用します。",
    uses: ["Sheets更新", "メール下書き", "日次集計", "定期実行"],
  },
  {
    name: "Supabase",
    role: "データベース・管理基盤",
    body: "問い合わせ履歴、AI分析結果、ステータス、内部メモ、担当者情報を保存するDBとして使用します。",
    uses: ["問い合わせ履歴", "AI結果保存", "ステータス管理", "認証"],
  },
  {
    name: "Claude API / OpenAI API",
    role: "AI分析エンジン",
    body: "問い合わせ分類、要約、見込み度判定、返信文案、追客文案の生成に使用します。最新のClaude Opusを既定に、要件に応じて使い分けます。",
    uses: ["分類", "要約", "見込み度判定", "文面生成"],
  },
  {
    name: "Make / Zapier",
    role: "既存SaaS連携",
    body: "クライアントが既に使っているSaaSとの簡易連携に使用します。ノーコードで素早く接続できます。",
    uses: ["SaaS連携", "ノーコード自動化", "既存フロー修正"],
  },
  {
    name: "LangGraph",
    role: "高度なAIエージェント",
    body: "複数ステップのAIエージェント、承認フロー、人間確認を挟む高度ワークフローに拡張できます。",
    uses: ["マルチステップ", "承認フロー", "人間確認", "状態管理"],
  },
  {
    name: "Playwright / Claude for Chrome",
    role: "ブラウザ自動化・リサーチ",
    body: "営業リスト収集、競合調査、求人媒体調査、管理画面操作、テスト自動化に使用します。",
    uses: ["リスト収集", "競合調査", "管理画面操作", "テスト自動化"],
  },
];

export default function StackPage() {
  return (
    <div className="container-wide py-12 sm:py-16">
      <div className="max-w-3xl">
        <Eyebrow>技術スタック</Eyebrow>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">
          これだけのツールを、案件に合わせて使い分ける
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink-600">
          ノーコード/ローコードからAIエージェント、ブラウザ自動化まで。「とりあえずAI」ではなく、課題と予算に最適な構成を選定して実装します。
        </p>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        {TOOLS.map((t) => (
          <Card key={t.name} className="transition-shadow hover:shadow-card-hover">
            <CardContent className="pt-6">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="text-lg font-semibold text-ink-950">{t.name}</h2>
                <span className="text-xs font-medium uppercase tracking-wide text-ink-600">
                  {t.role}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {t.body}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {t.uses.map((u) => (
                  <span
                    key={u}
                    className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-ink-700"
                  >
                    {u}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 rounded-3xl border border-ink-700/12 bg-zinc-50 p-8 text-center">
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
