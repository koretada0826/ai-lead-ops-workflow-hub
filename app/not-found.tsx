import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <p className="text-sm font-medium uppercase tracking-wider text-ink-600">
        404
      </p>
      <h1 className="mt-3 text-2xl font-semibold text-ink-950">
        ページが見つかりません
      </h1>
      <p className="mt-2 max-w-md text-sm text-ink-600">
        お探しの問い合わせやページは存在しないか、移動した可能性があります。
      </p>
      <div className="mt-6 flex gap-3">
        <ButtonLink href="/">トップへ戻る</ButtonLink>
        <ButtonLink href="/dashboard" variant="secondary">
          ダッシュボード
        </ButtonLink>
      </div>
    </div>
  );
}
