import { mean } from "@/lib/cbc";
import { TERMS } from "@/lib/mockData";
import type { SubjectId, SubjectRecord, TermFilter } from "@/types/student";

export interface Period {
  year: number;
  term: TermFilter;
}

/** Last two academic years = last 6 terms shown on trend charts. */
export const TREND_START = TERMS.length - 6;

export function periodIndices({ year, term }: Period): number[] {
  return TERMS.flatMap((t, i) => (t.year === year && (term === "all" || t.term === term) ? [i] : []));
}

export function previousPeriod(p: Period): Period | null {
  const minYear = TERMS[0].year;
  if (p.term === "all") return p.year - 1 >= minYear ? { year: p.year - 1, term: "all" } : null;
  if (p.term > 1) return { year: p.year, term: (p.term - 1) as 1 | 2 };
  return p.year - 1 >= minYear ? { year: p.year - 1, term: 3 } : null;
}

export function periodLabel(p: Period): string {
  return p.term === "all" ? `All terms ${p.year}` : `T${p.term} ${p.year}`;
}

export function scoreIn(series: number[], p: Period): number | null {
  const idx = periodIndices(p);
  if (idx.length === 0) return null;
  return mean(idx.map((i) => series[i]));
}

export function pctChange(curr: number | null, prev: number | null): number | null {
  if (curr == null || prev == null || prev === 0) return null;
  return ((curr - prev) / prev) * 100;
}

export interface SubjectSnapshot {
  subjectId: SubjectId;
  score: number;
  prev: number | null;
  change: number | null;
  record: SubjectRecord;
}

export function snapshot(subjects: SubjectRecord[], p: Period): SubjectSnapshot[] {
  const prevP = previousPeriod(p);
  return subjects.map((record) => {
    const score = scoreIn(record.scores, p) ?? 0;
    const prev = prevP ? scoreIn(record.scores, prevP) : null;
    return { subjectId: record.subjectId, score, prev, change: pctChange(score, prev), record };
  });
}

export function averageSeries(subjects: SubjectRecord[], key: "scores" | "cohort"): number[] {
  return TERMS.map((_, i) => mean(subjects.map((s) => s[key][i])));
}
