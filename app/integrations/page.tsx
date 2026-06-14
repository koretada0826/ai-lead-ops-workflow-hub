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
