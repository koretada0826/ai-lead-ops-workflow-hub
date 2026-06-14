import { cn } from "@/lib/utils";
import type { ReportData, SourceRow, TrendPoint } from "@/lib/reports";
import type { LeadScore } from "@/lib/types";

/** 営業ファネル（横棒・段階的に細くなる） */
export function Funnel({ data }: { data: ReportData["funnel"] }) {
  const max = Math.max(1, data[0]?.count ?? 1);
  return (
    <div className="space-y-2.5">
      {data.map((s, i) => {
        const pct = (s.count / max) * 100;
        const conv =
          i === 0
            ? 100
            : Math.round((s.count / Math.max(1, data[0].count)) * 100);
        return (
          <div key={s.label}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-ink-800">{s.label}</span>
              <span className="tabular-nums text-ink-600">
                {s.count}件 ・ {conv}%
              </span>
            </div>
            <div className="mt-1 h-7 w-full rounded-lg bg-zinc-100">
              <div
                className="flex h-7 items-center rounded-lg bg-gradient-to-r from-ink-950 to-ink-700 px-2 text-[11px] font-medium text-white transition-all"
                style={{ width: `${Math.max(pct, 6)}%` }}
              >
                {s.count}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** 流入元別: 件数バー＋高見込み率 */
export function SourceBars({ rows }: { rows: SourceRow[] }) {
  const max = Math.max(1, ...rows.map((r) => r.total));
  return (
    <div className="space-y-3">
      {rows.map((r) => (
        <div key={r.source}>
          <div className="flex items-center justify-between text-xs">
            <span className="text-ink-700">{r.source}</span>
            <span className="tabular-nums text-ink-600">
              {r.total}件 ・ 高見込み {r.highRate}%
            </span>
          </div>
          <div className="mt-1 flex h-2.5 overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${(r.high / max) * 100}%` }}
              title={`高見込み ${r.high}件`}
            />
            <div
              className="h-full bg-ink-300"
              style={{
                width: `${((r.total - r.high) / max) * 100}%`,
                background: "#cbd5d8",
              }}
            />
          </div>
        </div>
      ))}
      <div className="flex gap-4 pt-1 text-[11px] text-ink-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> 高見込み
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: "#cbd5d8" }}
          />{" "}
          その他
        </span>
      </div>
    </div>
  );
}

/** 見込み度ドーナツ（SVG） */
export function ScoreDonut({
  data,
}: {
  data: Record<LeadScore, number>;
}) {
  const total = data.高 + data.中 + data.低 || 1;
  const segs: { key: LeadScore; value: number; color: string }[] = [
    { key: "高", value: data.高, color: "#059669" },
    { key: "中", value: data.中, color: "#d97706" },
    { key: "低", value: data.低, color: "#a1a1aa" },
  ];
  const r = 52;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 140 140" className="h-36 w-36 -rotate-90">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#f1f1f3" strokeWidth="16" />
        {segs.map((s) => {
          const len = (s.value / total) * c;
          const el = (
            <circle
              key={s.key}
              cx="70"
              cy="70"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="16"
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="space-y-2">
        {segs.map((s) => (
          <div key={s.key} className="flex items-center gap-2 text-sm">
            <span
              className="h-3 w-3 rounded-sm"
              style={{ background: s.color }}
            />
            <span className="text-ink-700">見込み {s.key}</span>
            <span className="font-semibold tabular-nums text-ink-950">
              {s.value}
            </span>
            <span className="text-xs text-ink-500">
              ({Math.round((s.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** 週次トレンド（SVGエリア＋ライン） */
export function TrendArea({ points }: { points: TrendPoint[] }) {
  const w = 520;
  const h = 160;
  const pad = { l: 28, r: 12, t: 14, b: 24 };
  const max = Math.max(1, ...points.map((p) => p.count));
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const x = (i: number) =>
    pad.l + (points.length <= 1 ? 0 : (i / (points.length - 1)) * innerW);
  const y = (v: number) => pad.t + innerH - (v / max) * innerH;

  const line = points.map((p, i) => `${x(i)},${y(p.count)}`).join(" ");
  const area = `${pad.l},${pad.t + innerH} ${line} ${x(points.length - 1)},${pad.t + innerH}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full">
      {[0, 0.5, 1].map((g) => (
        <line
          key={g}
          x1={pad.l}
          x2={w - pad.r}
          y1={pad.t + innerH - g * innerH}
          y2={pad.t + innerH - g * innerH}
          stroke="#eee"
          strokeWidth="1"
        />
      ))}
      <polygon points={area} fill="rgba(10,10,11,0.06)" />
      <polyline
        points={line}
        fill="none"
        stroke="#0a0a0b"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(p.count)} r="3" fill="#0a0a0b" />
          <text
            x={x(i)}
            y={h - 6}
            textAnchor="middle"
            className="fill-ink-600"
            style={{ fontSize: 10 }}
          >
            {p.label}
          </text>
          <text
            x={x(i)}
            y={y(p.count) - 8}
            textAnchor="middle"
            className="fill-ink-900"
            style={{ fontSize: 10, fontWeight: 600 }}
          >
            {p.count}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function CategoryBars({
  rows,
}: {
  rows: { label: string; count: number }[];
}) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="space-y-2.5">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-3">
          <span className="w-40 shrink-0 truncate text-xs text-ink-700" title={r.label}>
            {r.label}
          </span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-zinc-100">
            <div
              className={cn("h-full rounded-full bg-ink-800")}
              style={{ width: `${(r.count / max) * 100}%` }}
            />
          </div>
          <span className="w-6 text-right text-xs font-medium tabular-nums text-ink-950">
            {r.count}
          </span>
        </div>
      ))}
    </div>
  );
}
