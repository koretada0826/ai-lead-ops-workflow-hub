import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-sky-200/70 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-700 shadow-sm backdrop-blur",
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        align === "center" && "mx-auto max-w-2xl text-center",
        className
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="mt-3 text-balance bg-gradient-to-br from-ink-950 via-blue-700 to-cyan-500 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-pretty text-base leading-relaxed text-ink-600">
          {description}
        </p>
      )}
    </div>
  );
}
