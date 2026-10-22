import { describe, expect, it } from "vitest";

import { deriveIssues } from "@/lib/issues";
import { getCompetenciesSync, getPerformanceSync, getStudentSync } from "@/lib/mockData";
import type { Student } from "@/types/student";

const student = getStudentSync("3f71d058-dee8-41de-8bde-31e8d4009f43") as Student;

describe("deriveIssues", () => {
  it("flags Mathematics' 5+ point drop as a watch issue", () => {
    const issues = deriveIssues(student, getPerformanceSync(student.id), getCompetenciesSync(student.id));
    const mathDrop = issues.find((i) => i.id === "math-drop");
    expect(mathDrop?.severity).toBe("watch");
    expect(mathDrop?.title).toContain("Mathematics");
  });

  it("does not flag improving subjects, clear fees or 96% attendance", () => {
    const issues = deriveIssues(student, getPerformanceSync(student.id), getCompetenciesSync(student.id));
    expect(issues.find((i) => i.id === "creative-drop")).toBeUndefined();
    expect(issues.find((i) => i.id === "fees")).toBeUndefined();
    expect(issues.find((i) => i.id === "attendance")).toBeUndefined();
  });

  it("flags a subject below ME2 (41%) as high severity", () => {
    const perf = getPerformanceSync(student.id)!;
    const withLowSubject = {
      ...perf,
      subjects: perf.subjects.map((s) =>
        s.subjectId === "pretech" ? { ...s, scores: [...s.scores.slice(0, -1), 38] } : s,
      ),
    };
    const issues = deriveIssues(student, withLowSubject, null);
    const low = issues.find((i) => i.id === "pretech-low");
    expect(low?.severity).toBe("high");
    expect(low?.title).toContain("Pre-Technical Studies");
  });
});
