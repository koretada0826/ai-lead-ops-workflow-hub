"use client";

import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { ResultContent } from "@/components/inquiry/result-content";
import type { Inquiry } from "@/lib/types";

/**
 * サーバー側でidが見つからなかった場合のフォールバック。
 * デモ送信時に sessionStorage('inq:<id>') へ保存した結果を読み出して表示する。
 * （Vercelサーバーレスでインメモリ保存が別インスタンスに無くても、画面は壊れない）
 */
export function ResultFallback({ id }: { id: string }) {
  const [inquiry, setInquiry] = useState<Inquiry | null | undefined>(undefined);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`inq:${id}`);
      if (raw) {
        setInquiry(JSON.parse(raw) as Inquiry);
        return;
      }
    } catch {
      /* noop */
    }
    // 念のためAPIも試す（同一インスタンスに在れば取れる）
    fetch(`/api/inquiries/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setInquiry((d && d.inquiry) || null))
      .catch(() => setInquiry(null));
  }, [id]);

  if (inquiry === undefined) {
    return (
      <div className="container-page py-24 text-center text-sm text-ink-600">
        読み込み中…
      </div>
    );
  }

  if (!inquiry) {
    return (
      <div className="container-page flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-semibold text-ink-950">
          結果が見つかりませんでした
        </h1>
        <p className="mt-2 max-w-md text-sm text-ink-600">
          デモ環境のため、この結果は保持されていない可能性があります。お手数ですが、もう一度お試しください。
        </p>
        <ButtonLink href="/demo/inquiry" className="mt-6">
          問い合わせデモをやり直す
        </ButtonLink>
      </div>
    );
  }

  return <ResultContent inquiry={inquiry} hasSupabase={false} />;
}
