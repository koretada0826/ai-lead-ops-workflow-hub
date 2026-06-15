import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteBackground } from "@/components/layout/site-background";

export const metadata: Metadata = {
  title: {
    default: "AIリード対応ワークフロー | AI Lead Ops Workflow Hub",
    template: "%s | AIリード対応ワークフロー",
  },
  description:
    "問い合わせ対応・営業リード管理をAIで自動化。HP・LP・広告・資料請求フォームから届いた問い合わせをAIが自動で分類し、見込み度判定・返信文案生成・Slack通知・Google Sheets保存まで一気通貫で実装します。",
  metadataBase: new URL("https://ai-lead-ops.example.com"),
  openGraph: {
    title: "AIリード対応ワークフロー | AI Lead Ops Workflow Hub",
    description:
      "問い合わせ対応から営業管理、通知、レポート化まで、実務フローとして動く形に実装するAIワークフロー。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen antialiased">
        <SiteBackground />
        <SiteHeader />
        <main className="min-h-[60vh]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
