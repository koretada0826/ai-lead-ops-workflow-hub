import type { Metadata } from "next";
import { ResultContent } from "@/components/inquiry/result-content";
import { ResultFallback } from "@/components/inquiry/result-fallback";
import { getInquiry } from "@/lib/repository";
import { getRuntimeConfig } from "@/lib/constants";

export const metadata: Metadata = { title: "AI分析結果" };
export const dynamic = "force-dynamic";

export default async function ResultPage({
  params,
}: {
  params: { id: string };
}) {
  const inquiry = await getInquiry(params.id);

  // サーバー側（DB or 同一インスタンスのメモリ）で見つかればそのまま表示
  if (inquiry) {
    const { hasSupabase } = getRuntimeConfig();
    return <ResultContent inquiry={inquiry} hasSupabase={hasSupabase} />;
  }

  // 見つからない場合は sessionStorage から復元（デモ送信直後の404を防ぐ）
  return <ResultFallback id={params.id} />;
}
