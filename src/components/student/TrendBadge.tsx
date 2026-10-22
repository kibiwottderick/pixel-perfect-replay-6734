import { cn } from "@/lib/utils";

export function TrendBadge({ change, className, suffix }: { change: number | null; className?: string; suffix?: string }) {
  if (change == null) {
    return <span className={cn("inline-flex rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground", className)}>New</span>;
  }
  const flat = Math.abs(change) < 0.05;
  const up = change > 0;
  const label = flat ? "– 0%" : `${up ? "▲" : "▼"} ${Math.abs(change).toFixed(1)}%`;
  return (
    <span
      aria-label={flat ? "No change" : `${up ? "Up" : "Down"} ${Math.abs(change).toFixed(1)} percent${suffix ? ` ${suffix}` : ""}`}
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums whitespace-nowrap",
        flat ? "bg-muted text-muted-foreground" : up ? "bg-trend-up/12 text-trend-up" : "bg-trend-down/12 text-trend-down",
        className,
      )}
    >
      {label}
      {suffix && <span className="ml-1 font-normal opacity-80">{suffix}</span>}
    </span>
  );
}
