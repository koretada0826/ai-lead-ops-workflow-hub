import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow, SectionHeading } from "@/components/ui/section";
import { FlowNode, type FlowNodeData } from "@/components/workflow/flow-node";

export const metadata: Metadata = {
  title: "ワークフロー可視化",
  description: "問い合わせ受付からAI分類、保存、通知、レポート化、AIエージェント拡張までの業務フロー全体。",
};

const NODES: FlowNodeData[] = [
  {
    step: 1,
    title: "フォーム送信",
    tools: ["HP / LP", "問い合わせフォーム", "Webhook"],
    role: "HP・LP・広告・資料請求フォームからの問い合わせを起点として受け付ける。",
    example: "既存のContact Form 7やHubSpotフォームからWebhookで連携。",
    group: "core",
  },
  {
    step: 2,
    title: "AI分類",
    tools: ["Claude API", "OpenAI API"],
    role: "問い合わせ内容をカテゴリに分類し、担当が判断しやすい状態にする。",
    example: "「広告/SEOレポート相談」「採用対応」など業種別カテゴリにカスタム。",
    group: "core",
  },
  {
    step: 3,
    title: "見込み度・緊急度判定",
    tools: ["Claude API", "ルールベース"],
    role: "予算・導入時期・課題の具体性からスコアリングする。",
    example: "クライアントの商材に合わせて判定基準（予算レンジ等）を調整。",
    group: "core",
  },
  {
    step: 4,
    title: "要約・推奨アクション",
    tools: ["Claude API"],
    role: "100文字要約と次に取るべきアクションを提示する。",
    example: "「24時間以内にオンライン相談を提案」など初動を明確化。",
    group: "core",
  },
  {
    step: 5,
    title: "返信・追客文案生成",
    tools: ["Claude API"],
    role: "初回返信と3日後の追客文案を自動生成する。",
    example: "クライアントのトーン&マナーに合わせてプロンプトを調整。",
    group: "core",
  },
  {
    step: 6,
    title: "Supabase保存",
    tools: ["Supabase", "PostgreSQL"],
    role: "問い合わせ・AI分析・ステータス・メモを保存する。",
    example: "既存DBやCRMがある場合はそちらに合わせて保存先を変更。",
    group: "core",
  },
  {
    step: 7,
    title: "n8n Webhook起動",
    tools: ["n8n"],
    role: "業務フローの中核として後続処理をオーケストレーションする。",
    example: "IFノードで高見込みリードのみ別ルートに分岐。",
    group: "notify",
  },
  {
    step: 8,
    title: "Google Sheets保存",
    tools: ["Google Sheets", "n8n / GAS"],
    role: "問い合わせ一覧を既存のスプレッドシート運用に追加する。",
    example: "現場が普段見ているシートにそのまま1行追加。",
    group: "notify",
  },
  {
    step: 9,
    title: "Slack / Chatwork通知",
    tools: ["Slack", "Chatwork", "n8n"],
    role: "新規・高見込みリードを即時に通知し初動を早める。",
    example: "高見込みは強調通知、担当者をメンションして振り分け。",
    group: "notify",
  },
  {
    step: 10,
    title: "追客管理",
    tools: ["Supabase", "GAS", "n8n"],
    role: "ステータス管理と追客タイミングを管理する。",
    example: "3日後の追客文案を自動下書き、未対応のリマインド。",
    group: "notify",
  },
  {
    step: 11,
    title: "レポート化",
    tools: ["ダッシュボード", "GAS"],
    role: "流入元・カテゴリ・見込み度別に集計し可視化する。",
    example: "月次で問い合わせ傾向と商談化率をレポート自動生成。",
    group: "notify",
  },
  {
    step: 12,
    title: "Difyナレッジボット拡張",
    tools: ["Dify"],
    role: "社内FAQ・問い合わせ対応ナレッジボットへ拡張する。",
    example: "営業が「この問い合わせにどう返す?」を相談できるAI。",
    group: "extend",
  },
  {
    step: 13,
    title: "Make / Zapier / GAS連携",
    tools: ["Make", "Zapier", "GAS"],
    role: "クライアントが既に使うSaaSと簡易連携する。",
    example: "kintone・Salesforce・Notionなど既存環境に接続。",
    group: "extend",
  },
  {
    step: 14,
    title: "LangGraph / ブラウザ自動化",
    tools: ["LangGraph", "Playwright", "Claude for Chrome"],
    role: "承認フロー付きエージェントやリサーチ自動化へ発展させる。",
    example: "営業リスト収集・競合調査・人間確認を挟む高度処理。",
    group: "extend",
  },
];

export default function WorkflowPage() {
  return (
    <div className="container-wide py-12 sm:py-16">
      <div className="max-w-3xl">
        <Eyebrow>ワークフロー可視化</Eyebrow>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">
          単なる画面ではなく、業務フロー全体を設計・実装する
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink-600">
          問い合わせ受付からAI分類、保存、通知、レポート化、そしてAIエージェント・ブラウザ自動化への拡張まで。各ノードに使用ツール・役割・実案件でのカスタム例を記載しています。
        </p>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-xs text-ink-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-ink-800" /> コア処理（AI分析）
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-blue-500" /> 通知・保存・レポート
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-violet-500" /> 拡張オプション
        </span>
      </div>

      {/* Node grid (connected style) */}
      <div className="relative mt-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {NODES.map((node, i) => (
            <div key={node.step} className="relative">
              <FlowNode node={node} />
              {i < NODES.length - 1 && (
                <span className="pointer-events-none absolute -bottom-3 left-1/2 z-10 hidden -translate-x-1/2 text-ink-600/30 sm:block">
                  ↓
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <SectionHeading
          eyebrow="想定するn8nワークフロー"
          title="高見込みリードを分岐して即時通知する"
        />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            "Webhook Trigger で受信",
            "Set node で項目整形",
            "IF node で lead_score=高 を判定",
            "Google Sheets node で1行追加",
            "Slack node で通知（高見込みは強調）",
            "エラー時は管理者へ通知",
          ].map((s, i) => (
            <div
              key={s}
              className="rounded-xl border border-ink-700/12 bg-white p-4 shadow-sm"
            >
              <span className="text-xs font-bold text-ink-600">
                STEP {i + 1}
              </span>
              <p className="mt-1 text-sm font-medium text-ink-900">{s}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 rounded-3xl border border-ink-700/12 bg-zinc-50 p-8 text-center">
        <h2 className="text-xl font-semibold text-ink-950">
          この一連のフローを、貴社の環境に合わせて実装します
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-ink-600">
          既存のフォーム・スプレッドシート・通知先に合わせて、小さく始められる構成からご提案します。
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/services">料金・受託メニューを見る</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            相談する
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
