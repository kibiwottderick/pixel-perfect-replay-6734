import { BAND_META, scoreToLevel, type LevelCode, LEVELS } from "@/lib/cbc";
import { cn } from "@/lib/utils";

interface Props {
  score?: number;
  level?: LevelCode;
  showScore?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function LevelBadge({ score, level, showScore = false, size = "sm", className }: Props) {
  const lvl = level ? LEVELS.find((l) => l.code === level)! : scoreToLevel(score ?? 0);
  const meta = BAND_META[lvl.band];
  return (
    <span
      title={`${lvl.label} (${lvl.points} points)`}
      aria-label={`${showScore && score != null ? `${Math.round(score)} percent, ` : ""}${lvl.label}`}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-semibold tabular-nums whitespace-nowrap",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        meta.badge,
        className,
      )}
    >
      {showScore && score != null && <span>{Math.round(score)}% ·</span>}
      {lvl.code}
    </span>
  );
}
