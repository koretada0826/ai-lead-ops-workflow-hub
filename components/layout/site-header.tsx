"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

const NAV = [
  { href: "/integrations", label: "連携・実装" },
  { href: "/workflow", label: "ワークフロー" },
  { href: "/stack", label: "技術スタック" },
  { href: "/case-studies", label: "導入ケース" },
  { href: "/services", label: "料金" },
  { href: "/dashboard", label: "管理画面" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // ページ遷移したらメニューを閉じる
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

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
          <ButtonLink
            href="/demo/inquiry"
            size="sm"
            variant="primary"
            className="hidden sm:inline-flex"
          >
            デモを試す
          </ButtonLink>
          {/* モバイル: ハンバーガー */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="メニューを開閉"
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-ink-700/15 text-ink-800 transition-colors hover:bg-zinc-100 lg:hidden"
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-current transition-transform duration-300 ${
                  open ? "top-1.5 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-0.5 w-5 bg-current transition-opacity duration-300 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-5 bg-current transition-transform duration-300 ${
                  open ? "top-1.5 -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* モバイルメニュー（ドロワー） */}
      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-ink-700/10 bg-white/95 backdrop-blur-md lg:hidden"
        >
          <div className="container-wide flex flex-col py-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-3 text-sm font-medium text-ink-700 transition-colors hover:bg-zinc-100 hover:text-ink-950"
              >
                {item.label}
              </Link>
            ))}
            <ButtonLink href="/demo/inquiry" size="md" className="mt-2 w-full">
              デモを試す
            </ButtonLink>
          </div>
        </nav>
      )}
    </header>
  );
}
