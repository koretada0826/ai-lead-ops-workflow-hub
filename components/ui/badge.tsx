import { cn } from "@/lib/utils";
import { STATUS_TONE } from "@/lib/constants";
import type { InquiryStatus, LeadScore, Urgency } from "@/lib/types";

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        className
      )}
    >
      {children}
    </span>
  );
}

const LEVEL_TONE: Record<"高" | "中" | "低", string> = {
  高: "bg-rose-50 text-rose-700 border-rose-200",
  中: "bg-amber-50 text-amber-700 border-amber-200",
  低: "bg-zinc-100 text-zinc-600 border-zinc-200",
};

const LEAD_TONE: Record<LeadScore, string> = {
  高: "bg-emerald-600 text-white border-emerald-600",
  中: "bg-emerald-50 text-emerald-700 border-emerald-200",
  低: "bg-zinc-100 text-zinc-600 border-zinc-200",
};

export function UrgencyBadge({ value }: { value: Urgency }) {
  return (
    <Badge className={LEVEL_TONE[value]}>
      緊急度 {value}
    </Badge>
  );
}

export function LeadScoreBadge({ value }: { value: LeadScore }) {
  return (
    <Badge className={LEAD_TONE[value]}>
      {value === "高" ? "★ " : ""}見込み {value}
    </Badge>
  );
}

export function StatusBadge({ value }: { value: InquiryStatus }) {
  return <Badge className={STATUS_TONE[value]}>{value}</Badge>;
}
