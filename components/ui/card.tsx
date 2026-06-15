import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-white/80 bg-white/90 shadow-[0_16px_48px_-14px_rgba(37,99,235,0.24)] ring-1 ring-sky-100 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_32px_72px_-20px_rgba(37,99,235,0.42)] hover:ring-sky-300/70",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-5 pt-5 pb-3 sm:px-6 sm:pt-6", className)}>
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-base font-semibold text-ink-950", className)}>
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("mt-1 text-sm text-ink-600", className)}>{children}</p>
  );
}

export function CardContent({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-5 pb-5 sm:px-6 sm:pb-6", className)}>{children}</div>
  );
}
