import { Card, CardContent } from "@/components/ui/card";

/** 件数の内訳を横棒で表示する集計カード。 */
export function Distribution({
  title,
  data,
}: {
  title: string;
  data: Record<string, number>;
}) {
  const entries = Object.entries(data).sort((a, b) => b[1] - a[1]);
  const max = Math.max(1, ...entries.map(([, v]) => v));

  return (
    <Card>
      <CardContent className="pt-5">
        <h3 className="text-sm font-semibold text-ink-950">{title}</h3>
        <div className="mt-4 space-y-3">
          {entries.length === 0 && (
            <p className="text-sm text-ink-600">データがありません。</p>
          )}
          {entries.map(([label, value]) => (
            <div key={label}>
              <div className="flex items-center justify-between text-xs">
                <span className="text-ink-700">{label}</span>
                <span className="font-medium tabular-nums text-ink-950">
                  {value}
                </span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-zinc-100">
                <div
                  className="h-full rounded-full bg-ink-800"
                  style={{ width: `${(value / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
