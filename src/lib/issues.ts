import { COMPETENCIES, subjectName } from "@/lib/cbc";
import type { Competencies, Performance, Student } from "@/types/student";

export type IssueSeverity = "high" | "watch";

export interface StudentIssue {
  id: string;
  severity: IssueSeverity;
  title: string;
  detail: string;
}

function latest(scores: number[]): number {
  return scores[scores.length - 1] ?? 0;
}

/**
 * Flags needing attention, derived strictly from the learner's own records:
 * subjects below ME2 (41%), term-on-term drops of 5+ points, competencies
 * under 60, attendance under 90% and outstanding fees.
 */
export function deriveIssues(
  student: Student,
  performance: Performance | null,
  competencies: Competencies | null,
): StudentIssue[] {
  const issues: StudentIssue[] = [];
  if (!performance) return issues;

  for (const record of performance.subjects) {
    const current = latest(record.scores);
    const previous = record.scores[record.scores.length - 2];
    const name = subjectName(record.subjectId, student.religiousEducation);
    if (current < 41) {
      issues.push({
        id: `${record.subjectId}-low`,
        severity: "high",
        title: `${name} below ME2`,
        detail: `Latest score ${Math.round(current)}% sits in the Approaching/Below band. Target 41% (ME2) next.`,
      });
    } else if (previous != null && current - previous <= -5) {
      issues.push({
        id: `${record.subjectId}-drop`,
        severity: "watch",
        title: `${name} dropped this term`,
        detail: `${Math.round(previous)}% → ${Math.round(current)}% (${Math.round(previous - current)} points). Check the strand that slipped.`,
      });
    }
  }

  if (competencies) {
    for (const record of competencies.competencies) {
      const score = latest(record.scores);
      if (score < 60) {
        const def = COMPETENCIES.find((c) => c.id === record.id);
        issues.push({
          id: `${record.id}-competency`,
          severity: "watch",
          title: `${def?.name ?? record.id} needs building`,
          detail: record.nextSteps,
        });
      }
    }
  }

  if (student.attendance.presentPct < 90) {
    issues.push({
      id: "attendance",
      severity: "watch",
      title: "Attendance below 90%",
      detail: `${student.attendance.presentPct}% present — ${student.attendance.daysAbsent} days absent this term.`,
    });
  }

  if (student.feeStatus !== "Cleared") {
    issues.push({
      id: "fees",
      severity: "watch",
      title: `Fees ${student.feeStatus.toLowerCase()}`,
      detail: "Follow up with the guardian on the outstanding balance.",
    });
  }

  return issues;
}
