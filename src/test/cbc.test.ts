import { describe, expect, it } from "vitest";
import { scoreToLevel, levelToPoints } from "@/lib/cbc";
import { pathwayReadiness, fitLabel, PATHWAY_WEIGHTS } from "@/lib/pathways";
import type { SubjectId } from "@/types/student";

describe("CBC levels", () => {
  it("maps 90 to EE1 and 89 to EE2", () => {
    expect(scoreToLevel(90).code).toBe("EE1");
    expect(scoreToLevel(89).code).toBe("EE2");
  });
  it("maps 75 to EE2, 74 to ME1, 58 to ME1, 57 to ME2, 41 to ME2, 40 to AE1", () => {
    expect(scoreToLevel(75).code).toBe("EE2");
    expect(scoreToLevel(74).code).toBe("ME1");
    expect(scoreToLevel(58).code).toBe("ME1");
    expect(scoreToLevel(57).code).toBe("ME2");
    expect(scoreToLevel(41).code).toBe("ME2");
    expect(scoreToLevel(40).code).toBe("AE1");
  });
  it("maps 30 to AE2, 20 to BE1, 10 to BE2", () => {
    expect(scoreToLevel(30).code).toBe("AE2");
    expect(scoreToLevel(20).code).toBe("BE1");
    expect(scoreToLevel(10).code).toBe("BE2");
  });
  it("gives EE1 8 points and BE2 1 point", () => {
    expect(levelToPoints("EE1")).toBe(8);
    expect(levelToPoints("BE2")).toBe(1);
  });
});

describe("Pathway weights", () => {
  const base = { english: 0, kiswahili: 0, math: 0, re: 0, social: 0, science: 0, pretech: 0, agri: 0, creative: 0 } as Record<SubjectId, number>;
  it("STEM = 30% Maths, 30% Science, 25% Pre-Tech, 15% Agriculture", () => {
    expect(PATHWAY_WEIGHTS.stem).toEqual({ math: 0.3, science: 0.3, pretech: 0.25, agri: 0.15 });
    expect(pathwayReadiness("stem", { ...base, math: 100 })).toBeCloseTo(30);
  });
  it("Social = 30% SST, 25% English, 25% Kiswahili, 20% RE", () => {
    expect(pathwayReadiness("social", { ...base, re: 100 })).toBeCloseTo(20);
  });
  it("Arts = Creative Arts 100% plus at most 3 bonus points", () => {
    expect(pathwayReadiness("arts", { ...base, creative: 80 }, 0)).toBe(80);
    expect(pathwayReadiness("arts", { ...base, creative: 80 }, 100)).toBe(83);
  });
  it("fit labels: 75 strong, 58 good, 41 developing, 40 needs support", () => {
    expect(fitLabel(75)).toBe("Strong potential");
    expect(fitLabel(58)).toBe("Good potential");
    expect(fitLabel(41)).toBe("Developing");
    expect(fitLabel(40)).toBe("Needs support");
  });
});
