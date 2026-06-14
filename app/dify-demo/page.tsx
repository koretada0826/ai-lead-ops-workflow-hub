import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/section";
import { DifyChat } from "@/components/dify/dify-chat";

export const metadata: Metadata = {
  title: "Dify連携デモ",
  description: "Difyを使った社内FAQ・営業支援AI・問い合わせ対応ナレッジボットへの拡張デモ。",
};

const USES = [
  { title: "問い合わせ対応ナレッジボット", body: "過去対応とFAQを参照し、返信方針を提案。" },
  { title: "営業ロープレAI", body: "想定問答でトークを磨く練習相手に。" },
  { title: "社内FAQ", body: "規程・手順・よくある質問に即時回答。" },
  { title: "サービス資料検索AI", body: "資料・料金・事例を横断検索して回答。" },
  { title: "過去対応履歴の検索AI", body: "似た問い合わせの対応例をすぐ引き出す。" },
];

const ENV_VARS = [
  { key: "DIFY_API_KEY", desc: "DifyアプリのAPIキー" },
  { key: "DIFY_APP_ID", desc: "対象アプリのID" },
  { key: "DIFY_API_URL", desc: "Dify APIのベースURL（既定: https://api.dify.ai/v1）" },
];

export default function DifyDemoPage() {
  return (
    <div className="container-wide py-12 sm:py-16">
      <div className="max-w-3xl">
        <Eyebrow>Dify連携デモ</Eyebrow>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">
          社内FAQ・営業支援AIまで拡張できる
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink-600">
          Difyを使えば、問い合わせ対応のナレッジボットや営業支援AIへ発展できます。営業担当が「この問い合わせにどう返せばいい？」とその場で相談できる想定です。APIキー未設定時はデモモードでモック回答します。
        </p>
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <DifyChat />
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-sm font-semibold text-ink-950">活用例</h2>
              <ul className="mt-3 space-y-3">
                {USES.map((u) => (
                  <li key={u.title}>
                    <p className="text-sm font-medium text-ink-900">
                      {u.title}
                    </p>
                    <p className="text-xs text-ink-600">{u.body}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-sm font-semibold text-ink-950">
                連携用の環境変数
              </h2>
              <p className="mt-1 text-xs text-ink-600">
                以下を設定すると実際のDifyアプリに接続します。
              </p>
              <div className="mt-3 space-y-2">
                {ENV_VARS.map((e) => (
                  <div
                    key={e.key}
                    className="rounded-lg border border-ink-700/10 bg-zinc-50 px-3 py-2"
                  >
                    <code className="text-xs font-semibold text-ink-900">
                      {e.key}
                    </code>
                    <p className="mt-0.5 text-[11px] text-ink-600">{e.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
