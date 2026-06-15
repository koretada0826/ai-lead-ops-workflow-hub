import Link from "next/link";
import {
  APP_NAME,
  APP_NAME_EN,
  APP_ROLE,
  AUTHOR_EMAIL,
  AUTHOR_NAME,
} from "@/lib/constants";

const COLS = [
  {
    title: "プロダクト",
    links: [
      { href: "/demo/inquiry", label: "問い合わせデモ" },
      { href: "/dashboard", label: "管理ダッシュボード" },
      { href: "/workflow", label: "ワークフロー可視化" },
      { href: "/integrations", label: "連携・実装サンプル" },
      { href: "/dify-demo", label: "Dify連携デモ" },
    ],
  },
  {
    title: "営業・導入",
    links: [
      { href: "/services", label: "料金・受託メニュー" },
      { href: "/case-studies", label: "業界別導入ケース" },
      { href: "/stack", label: "技術スタック" },
      { href: "/contact", label: "お問い合わせ" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-ink-700/10 bg-white">
      <div className="container-wide grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-950 text-sm font-bold text-white">
              AI
            </span>
            <span className="text-sm font-semibold text-ink-950">
              {APP_NAME}
            </span>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-600">
            {APP_NAME_EN}。問い合わせ対応から営業リード管理、通知、レポート化まで、AIを実務フローに組み込んで自動化します。
          </p>
          <p className="mt-4 text-xs font-medium uppercase tracking-wider text-ink-600">
            {APP_ROLE}
          </p>
          <p className="mt-3 text-sm text-ink-700">
            作者: <span className="font-medium text-ink-950">{AUTHOR_NAME}</span>
          </p>
          <a
            href={`mailto:${AUTHOR_EMAIL}`}
            className="text-sm text-ink-600 underline underline-offset-4 transition-colors hover:text-ink-950"
          >
            {AUTHOR_EMAIL}
          </a>
        </div>

        {COLS.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-semibold text-ink-950">{col.title}</h4>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-ink-600 transition-colors hover:text-ink-950"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-ink-700/10">
        <div className="container-wide flex flex-col items-start justify-between gap-2 py-6 text-xs text-ink-600 sm:flex-row sm:items-center">
          <p>© {APP_NAME} — Built by {AUTHOR_NAME}</p>
          <p>Next.js / TypeScript / Tailwind / Supabase / Claude API / n8n</p>
        </div>
      </div>
    </footer>
  );
}
