import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

const NAV = [
  { href: "/integrations", label: "連携・実装" },
  { href: "/workflow", label: "ワークフロー" },
  { href: "/stack", label: "技術スタック" },
  { href: "/case-studies", label: "導入ケース" },
  { href: "/reports", label: "レポート" },
  { href: "/services", label: "料金" },
  { href: "/dashboard", label: "管理画面" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-700/10 bg-white/80 backdrop-blur-md">
      <div className="container-wide flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-950 text-sm font-bold text-white">
            AI
          </span>
          <span className="hidden text-sm font-semibold tracking-tight text-ink-950 sm:block">
            {APP_NAME}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-600 transition-colors hover:bg-zinc-100 hover:text-ink-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="/demo/inquiry" size="sm" variant="primary">
            デモを試す
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
