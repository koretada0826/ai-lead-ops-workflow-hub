import { cn } from "@/lib/utils";
import { Card } from "./card";

export function Stat({
  label,
  value,
  sub,
  accent,
  className,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  accent?: "default" | "emerald" | "rose" | "amber" | "blue";
  className?: string;
}) {
  const accentTone =
    accent === "emerald"
      ? "text-emerald-600"
      : accent === "rose"
        ? "text-rose-600"
        : accent === "amber"
          ? "text-amber-600"
          : accent === "blue"
            ? "text-blue-600"
            : "text-ink-950";
  return (
    <Card className={cn("p-5", className)}>
      <p className="text-xs font-medium uppercase tracking-wide text-ink-600">
        {label}
      </p>
      <p className={cn("mt-2 text-3xl font-semibold tabular-nums", accentTone)}>
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-ink-600">{sub}</p>}
    </Card>
  );
}
