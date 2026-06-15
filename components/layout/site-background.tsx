"use client";

import dynamic from "next/dynamic";

// Three.js は重いので遅延ロード（初期/layoutチャンクから分離。SSRなし）
const ThreeHero = dynamic(
  () => import("@/components/ui/three-hero").then((m) => m.ThreeHero),
  { ssr: false }
);

/**
 * サイト全体の共通背景（固定）。
 * 白×水色のグラデ＋漂う光のオーブ＋Three.jsパーティクル波を、
 * 全ページの最背面に1枚だけ常駐させる（ページ遷移でも途切れない）。
 * コンテンツはガラス風カードで上に浮かせるため、可読性は保たれる。
 */
export function SiteBackground() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50 via-sky-100/70 to-white" />
      <div className="absolute -top-40 left-[8%] h-[36rem] w-[36rem] rounded-full bg-cyan-400/45 blur-[130px] animate-[blob_18s_ease-in-out_infinite]" />
      <div className="absolute top-1/4 right-[6%] h-[34rem] w-[34rem] rounded-full bg-blue-500/35 blur-[130px] animate-[blob_24s_ease-in-out_infinite_reverse]" />
      <div className="absolute bottom-[-4rem] left-[40%] h-[32rem] w-[32rem] rounded-full bg-indigo-400/35 blur-[140px] animate-[blob_30s_ease-in-out_infinite]" />
      <div className="absolute top-[55%] left-[2%] h-[26rem] w-[26rem] rounded-full bg-violet-400/30 blur-[140px] animate-[blob_26s_ease-in-out_infinite_reverse]" />
      <ThreeHero className="absolute inset-0 h-full w-full opacity-90" />
      {/* コンテンツ可読性のための軽い白沈め */}
      <div className="absolute inset-0 bg-white/12" />
    </div>
  );
}
