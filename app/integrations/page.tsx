import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eyebrow, SectionHeading } from "@/components/ui/section";
import { CodeBlock } from "@/components/integrations/code-block";
import { N8nSimulator } from "@/components/integrations/n8n-simulator";

export const metadata: Metadata = {
  title: "連携・実装サンプル",
  description: "n8n / GAS / LangGraph / Playwright / Make / Zapier の実際にインポート・実行できる実装サンプル。",
};

function readArtifact(file: string): string {
  try {
    return fs.readFileSync(
      path.join(process.cwd(), "public", "integrations", file),
      "utf8"
    );
  } catch {
    return "// ファイルを読み込めませんでした。";
  }
}

interface Artifact {
  id: string;
  tool: string;
  role: string;
  position: string;
  body: string;
  file: string;
  language: string;
  badges: string[];
}

const ARTIFACTS: Omit<Artifact, "body">[] = [
  {
    id: "n8n",
    tool: "n8n",
    role: "ワークフローの中核オーケストレーション",
    position: "アプリ → Webhook → n8n → Sheets / Slack",
    file: "n8n-lead-workflow.json",
    language: "json",
    badges: ["Webhook", "IF分岐", "Google Sheets", "Slack", "エラー通知"],
  },
  {
    id: "gas",
    tool: "Google Apps Script (GAS)",
    role: "Sheets中心の現場業務自動化",
    position: "Sheets追記 / ステータス通知 / 日次ダイジェスト",
    file: "gas-lead-ops.gs",
    language: "javascript",
    badges: ["doPost", "onEdit通知", "日次メール", "トリガー"],
  },
  {
    id: "langgraph",
    tool: "LangGraph",
    role: "承認フロー付きAIエージェント",
    position: "分類→スコア→下書き→[人間承認]→送信→追客",
    file: "langgraph_approval_flow.py",
    language: "python",
    badges: ["StateGraph", "interrupt", "human-in-the-loop", "checkpointer"],
  },
  {
    id: "playwright",
    tool: "Playwright",
    role: "リード獲得・調査の自動化（前段）",
    position: "営業リスト収集 → AIで相性要約 → CSV出力",
    file: "playwright-lead-research.ts",
    language: "typescript",
    badges: ["スクレイピング", "AIエンリッチ", "CSV出力", "レート制御"],
  },
  {
    id: "make",
    tool: "Make / Zapier",
    role: "既存SaaSとのノーコード連携",
    position: "Webhook → ルーター → Sheets / Slack / Chatwork / CRM",
    file: "make-blueprint.json",
    language: "json",
    badges: ["Router", "HubSpot", "Chatwork", "Blueprint/Zap"],
  },
];

export default function IntegrationsPage() {
  const artifacts: Artifact[] = ARTIFACTS.map((a) => ({
    ...a,
    body: readArtifact(a.file),
  }));

  const builtN8n = [
    {
      file: "n8n-lead-workflow.json",
      title: "リード受付フロー（完成版）",
      desc: "問い合わせ受信 → 項目整形 → 見込み度で分岐 → Sheets追記＋Slack通知。失敗時は管理者へ自動通知。",
      nodes: ["Webhook", "Set", "IF", "Google Sheets", "Slack", "Error Trigger"],
      use: "問い合わせ受付の本体フロー",
      shot: "",
    },
    {
      file: "m1-http-demo.json",
      title: "n8nからAIを呼ぶ（HTTP Request）",
      desc: "n8n自身が外部AI（Claude/API）に分析を依頼し、結果を受け取る。",
      nodes: ["Manual Trigger", "HTTP Request"],
      use: "あらゆるAPI / AI連携の基礎",
      shot: "m1.png",
    },
    {
      file: "m2-ai-branch.json",
      title: "AI分析 → 自動分岐",
      desc: "AIの見込み度判定（lead_score）で処理を自動ルーティング。",
      nodes: ["HTTP Request", "IF", "式 {{ }}"],
      use: "高見込みリードだけ特別対応",
      shot: "m2.png",
    },
    {
      file: "m3-filter.json",
      title: "毎朝の要対応リスト抽出",
      desc: "定期実行で一覧取得 → 個別化 → 「高見込み×未対応」だけ抽出。",
      nodes: ["Schedule", "HTTP Request", "Split Out", "Filter"],
      use: "日次ダイジェスト・追客抽出",
      shot: "m3.png",
    },
    {
      file: "m4-approval.json",
      title: "送信前に人間が承認（human-in-the-loop）",
      desc: "AIが下書き → 承認フォームで一時停止 → 人間の承認/却下で送信を制御。",
      nodes: ["HTTP Request", "Wait（承認フォーム）", "IF"],
      use: "士業・採用・不動産の安全運用",
      shot: "m4.png",
    },
  ];

  const useCases = [
    {
      group: "営業・マーケ",
      items: [
        "問い合わせの自動分類・即時通知",
        "広告レポート自動生成＋AIコメント",
        "営業リストの整形・名寄せ",
        "資料請求後の段階フォロー",
        "フォーム→CRM(HubSpot等)自動登録",
      ],
    },
    {
      group: "バックオフィス",
      items: [
        "請求書・領収書のデータ抽出→Sheets",
        "受発注メールの自動仕分け・起票",
        "経費・勤怠の集計と通知",
        "契約・申込フローの自動化",
      ],
    },
    {
      group: "データ・監視",
      items: [
        "競合価格・在庫の定期監視→アラート",
        "検索順位/GA4の定期取得→レポート",
        "Webスクレイピングでリスト収集",
        "異常を検知して担当へ通知",
      ],
    },
    {
      group: "AI・コミュニケーション",
      items: [
        "長文の要約・分類・タグ付け",
        "メール下書きの自動生成",
        "Slack/Chatwork/LINE自動通知",
        "FAQ・社内ナレッジボット(Dify)",
      ],
    },
  ];

  return (
    <div className="container-wide py-12 sm:py-16">
      <div className="max-w-3xl">
        <Eyebrow>連携・実装サンプル</Eyebrow>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">
          「説明」ではなく、インポート・実行できる実物で示す
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink-600">
          このアプリが送信する Webhook を起点に、各ツールがどう連携するか。実際に
          n8n へインポートできるワークフロー、GASスクリプト、LangGraphグラフ、Playwrightスクリプト、Make/Zapierブループリントを、そのまま配布しています。
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs">
          {ARTIFACTS.map((a) => (
            <a
              key={a.id}
              href={`#${a.id}`}
              className="rounded-full border border-ink-700/15 bg-white px-3 py-1.5 font-medium text-ink-700 transition-colors hover:bg-zinc-50"
            >
              {a.tool}
            </a>
          ))}
        </div>
      </div>

      {/* n8n simulator first */}
      <div className="mt-10">
        <N8nSimulator />
      </div>

      {/* 実際に作って動かした n8n ワークフロー */}
      <section className="mt-16">
        <SectionHeading
          eyebrow="n8n 実装力"
          title="実際に構築・実行した n8n ワークフロー"
          description="どれもインポートしてすぐ動く実物。Webhook受信・AI呼び出し・条件分岐・定期実行・人間承認まで、案件で必要なパターンを一通り網羅しています。"
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {builtN8n.map((w) => (
            <Card key={w.file} className="relative overflow-hidden p-6 hover:-translate-y-1 hover:ring-sky-300/60">
              <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500" />
              {w.shot && (
                <a
                  href={`/integrations/screenshots/${w.shot}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mb-4 block overflow-hidden rounded-xl border border-ink-700/10 bg-zinc-50 ring-1 ring-ink-700/5 transition-transform duration-300 group-hover:scale-[1.02]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/integrations/screenshots/${w.shot}`}
                    alt={`${w.title} の実行画面`}
                    className="w-full"
                    loading="lazy"
                  />
                </a>
              )}
              <h3 className="text-base font-semibold text-ink-950">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                {w.desc}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {w.nodes.map((nd) => (
                  <span
                    key={nd}
                    className="rounded-md bg-sky-50 px-2 py-0.5 text-[11px] font-medium text-sky-700"
                  >
                    {nd}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-xs text-ink-600">
                <span className="font-medium text-ink-800">実案件での用途: </span>
                {w.use}
              </p>
              <a
                href={`/integrations/${w.file}`}
                download
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-ink-700/20 bg-white px-3 py-2 text-xs font-medium text-ink-800 transition-colors hover:bg-zinc-50"
              >
                ↓ {w.file} をダウンロード（n8nにインポート）
              </a>
            </Card>
          ))}
        </div>
        <p className="mt-6 text-sm leading-relaxed text-ink-600">
          <span className="font-medium text-ink-800">扱える n8n ノード / パターン：</span>
          Webhook / HTTP Request / IF・Switch / 式(expression) / Schedule / Split Out / Filter / Merge / Wait(human-in-the-loop) / Error Trigger / Code / Google Sheets / Slack / Chatwork / CRM連携 …
        </p>
      </section>

      {/* 対応できる業務自動化（ユースケース幅） */}
      <section className="mt-16">
        <SectionHeading
          eyebrow="対応できる自動化"
          title="同じ部品の組み合わせで、これだけ自動化できる"
          description="上のワークフローは代表サンプル。Webhook・API・条件分岐・定期実行・AI呼び出し・人間承認といった部品を組み替えれば、業務に合わせて作れます。ほんの一例："
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {useCases.map((cat) => (
            <div
              key={cat.group}
              className="rounded-2xl border border-ink-700/10 bg-white/70 p-5 ring-1 ring-ink-700/5 backdrop-blur"
            >
              <h3 className="text-sm font-semibold text-sky-700">
                {cat.group}
              </h3>
              <ul className="mt-3 space-y-2">
                {cat.items.map((it) => (
                  <li key={it} className="flex gap-2 text-sm text-ink-700">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-5 text-sm text-ink-600">
          「うちのこの作業、自動化できる？」——だいたいできます。まずはお気軽にご相談ください。
        </p>
      </section>

      {/* artifacts */}
      <div className="mt-12 space-y-12">
        {artifacts.map((a) => (
          <section key={a.id} id={a.id} className="scroll-mt-20">
            <div className="grid gap-6 lg:grid-cols-5">
              <div className="lg:col-span-2">
                <SectionHeading eyebrow={a.tool} title={a.role} />
                <div className="mt-4 rounded-xl border border-ink-700/12 bg-zinc-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-600">
                    フロー上の位置
                  </p>
                  <p className="mt-1 text-sm font-medium text-ink-900">
                    {a.position}
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {a.badges.map((b) => (
                    <span
                      key={b}
                      className="rounded-md bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-ink-700"
                    >
                      {b}
                    </span>
                  ))}
                </div>
                <a
                  href={`/integrations/${a.file}`}
                  download
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-ink-700/20 bg-white px-3 py-2 text-xs font-medium text-ink-800 transition-colors hover:bg-zinc-50"
                >
                  ↓ {a.file} をダウンロード
                </a>
              </div>
              <div className="lg:col-span-3">
                <CodeBlock
                  code={a.body}
                  language={a.language}
                  filename={a.file}
                  downloadHref={`/integrations/${a.file}`}
                />
              </div>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-14 rounded-3xl border border-ink-700/12 bg-zinc-50 p-8 text-center">
        <h2 className="text-xl font-semibold text-ink-950">
          これらを貴社の環境に合わせて実装・接続します
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-ink-600">
          既存のフォーム・Sheets・通知先・CRMに合わせて、必要なノードだけ組み替えて導入できます。
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/workflow" variant="secondary">
            ワークフロー全体図
          </ButtonLink>
          <ButtonLink href="/contact">実装を相談する</ButtonLink>
        </div>
      </div>
    </div>
  );
}
