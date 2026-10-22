import type { SubjectId } from "@/types/student";

export type PathwayId = "stem" | "social" | "arts";

export interface PathwayDef {
  id: PathwayId;
  name: string;
  short: string;
  colorClass: string;
  colorVar: string;
  weights: Partial<Record<SubjectId, number>>;
  tracks: string[];
}

/** Edit these weights to change how readiness is computed. Each pathway's weights sum to 1. */
export const PATHWAY_WEIGHTS: Record<PathwayId, Partial<Record<SubjectId, number>>> = {
  stem: { math: 0.3, science: 0.3, pretech: 0.25, agri: 0.15 },
  arts: { creative: 1 },
  social: { social: 0.3, english: 0.25, kiswahili: 0.25, re: 0.2 },
};

/** Arts & Sports bonus from the Creativity competency (max points added). */
export const ARTS_CREATIVITY_BONUS_MAX = 3;

export const PATHWAYS: readonly PathwayDef[] = [
  {
    id: "stem",
    name: "STEM & Innovation",
    short: "STEM",
    colorClass: "bg-path-stem",
    colorVar: "var(--path-stem)",
    weights: PATHWAY_WEIGHTS.stem,
    tracks: ["Pure Sciences", "Applied Sciences", "Technical and Engineering", "Career and Technology Studies"],
  },
  {
    id: "social",
    name: "Social Sciences & Humanities",
    short: "Social Sciences",
    colorClass: "bg-path-social",
    colorVar: "var(--path-social)",
    weights: PATHWAY_WEIGHTS.social,
    tracks: ["Languages and Literature", "Humanities and Business Studies"],
  },
  {
    id: "arts",
    name: "Arts & Sports Science",
    short: "Arts & Sports",
    colorClass: "bg-path-arts",
    colorVar: "var(--path-arts)",
    weights: PATHWAY_WEIGHTS.arts,
    tracks: ["Sports", "Performing Arts", "Visual Arts"],
  },
];

/** 0–3 bonus scaled from a creativity score of 50 (none) to 100 (max). */
export function creativityBonus(creativityScore: number): number {
  return Math.max(0, Math.min(ARTS_CREATIVITY_BONUS_MAX, ((creativityScore - 50) / 50) * ARTS_CREATIVITY_BONUS_MAX));
}

export function pathwayReadiness(
  id: PathwayId,
  scores: Record<SubjectId, number>,
  creativityScore = 0,
): number {
  const weights = PATHWAY_WEIGHTS[id];
  let total = 0;
  for (const [sid, w] of Object.entries(weights) as [SubjectId, number][]) total += scores[sid] * w;
  if (id === "arts") total += creativityBonus(creativityScore);
  return Math.min(100, total);
}

export function fitLabel(score: number): string {
  if (score >= 75) return "Strong potential";
  if (score >= 58) return "Good potential";
  if (score >= 41) return "Developing";
  return "Needs support";
}
