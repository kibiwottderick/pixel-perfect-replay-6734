import {
  BookOpen,
  Languages,
  Calculator,
  Church,
  Globe2,
  FlaskConical,
  Wrench,
  Sprout,
  Palette,
  MessagesSquare,
  Brain,
  ShieldCheck,
  Lightbulb,
  Landmark,
  MonitorSmartphone,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import type { CompetencyId, ReligiousEducation, SubjectId } from "@/types/student";

/* ---------- KNEC performance levels (8-point scale) ---------- */

export type Band = "EE" | "ME" | "AE" | "BE";
export type LevelCode = "EE1" | "EE2" | "ME1" | "ME2" | "AE1" | "AE2" | "BE1" | "BE2";

export interface Level {
  code: LevelCode;
  band: Band;
  label: string;
  min: number;
  max: number;
  points: number;
}

export const LEVELS: readonly Level[] = [
  { code: "EE1", band: "EE", label: "Exceeding Expectations 1", min: 90, max: 100, points: 8 },
  { code: "EE2", band: "EE", label: "Exceeding Expectations 2", min: 75, max: 89, points: 7 },
  { code: "ME1", band: "ME", label: "Meeting Expectations 1", min: 58, max: 74, points: 6 },
  { code: "ME2", band: "ME", label: "Meeting Expectations 2", min: 41, max: 57, points: 5 },
  { code: "AE1", band: "AE", label: "Approaching Expectations 1", min: 31, max: 40, points: 4 },
  { code: "AE2", band: "AE", label: "Approaching Expectations 2", min: 21, max: 30, points: 3 },
  { code: "BE1", band: "BE", label: "Below Expectations 1", min: 11, max: 20, points: 2 },
  { code: "BE2", band: "BE", label: "Below Expectations 2", min: 0, max: 10, points: 1 },
];

export function scoreToLevel(score: number): Level {
  const s = Math.max(0, Math.min(100, Math.round(score)));
  return LEVELS.find((l) => s >= l.min) ?? (LEVELS[LEVELS.length - 1] as Level);
}

export function levelToPoints(code: LevelCode): number {
  return LEVELS.find((l) => l.code === code)?.points ?? 0;
}

export const BAND_ORDER: readonly Band[] = ["BE", "AE", "ME", "EE"];

export const BAND_META: Record<Band, { label: string; badge: string; fill: string; text: string }> = {
  EE: { label: "Exceeding Expectations", badge: "bg-level-ee/12 text-level-ee border-level-ee/30", fill: "bg-level-ee", text: "text-level-ee" },
  ME: { label: "Meeting Expectations", badge: "bg-level-me/12 text-level-me border-level-me/30", fill: "bg-level-me", text: "text-level-me" },
  AE: { label: "Approaching Expectations", badge: "bg-level-ae/15 text-level-ae border-level-ae/35", fill: "bg-level-ae", text: "text-level-ae" },
  BE: { label: "Below Expectations", badge: "bg-level-be/12 text-level-be border-level-be/30", fill: "bg-level-be", text: "text-level-be" },
};

export const THRESHOLDS = [
  { value: 41, label: "ME2" },
  { value: 58, label: "ME1" },
  { value: 75, label: "EE2" },
  { value: 90, label: "EE1" },
] as const;

/* ---------- Junior School learning areas ---------- */

export interface SubjectDef {
  id: SubjectId;
  name: string;
  short: string;
  icon: LucideIcon;
  strands: string[];
}

export const SUBJECTS: readonly SubjectDef[] = [
  { id: "english", name: "English", short: "ENG", icon: BookOpen, strands: ["Reading comprehension (inferential)", "Grammar in use: tenses and clauses", "Creative and functional writing"] },
  { id: "kiswahili", name: "Kiswahili", short: "KIS", icon: Languages, strands: ["Sarufi: ngeli na upatanisho", "Kusoma kwa ufahamu", "Uandishi wa insha"] },
  { id: "math", name: "Mathematics", short: "MAT", icon: Calculator, strands: ["Algebra: linear equations", "Geometry: constructions and angles", "Data handling and probability"] },
  { id: "re", name: "Religious Education", short: "RE", icon: Church, strands: ["Sacred texts and their application", "Moral and ethical decision making", "Community and worship practices"] },
  { id: "social", name: "Social Studies", short: "SST", icon: Globe2, strands: ["Map reading and scale", "Historical sources and evidence", "Life skills: decision making"] },
  { id: "science", name: "Integrated Science", short: "ISC", icon: FlaskConical, strands: ["Mixtures and separation methods", "Electrical circuits", "Human body systems"] },
  { id: "pretech", name: "Pre-Technical Studies", short: "PTS", icon: Wrench, strands: ["Technical drawing", "Business studies: book-keeping basics", "Computer studies: spreadsheets"] },
  { id: "agri", name: "Agriculture", short: "AGR", icon: Sprout, strands: ["Soil conservation practices", "Crop production records", "Small livestock care"] },
  { id: "creative", name: "Creative Arts & Sports", short: "CAS", icon: Palette, strands: ["Music: rhythm and notation", "Visual arts: perspective drawing", "Athletics technique"] },
];

export function subjectName(id: SubjectId, re: ReligiousEducation): string {
  if (id === "re") return re === "CRE" ? "C.R.E" : re === "IRE" ? "I.R.E" : "H.R.E";
  return SUBJECTS.find((s) => s.id === id)?.name ?? id;
}

export function getSubject(id: SubjectId): SubjectDef {
  const s = SUBJECTS.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown subject ${id}`);
  return s;
}

/* ---------- Seven core competencies (KICD) ---------- */

export interface CompetencyDef {
  id: CompetencyId;
  name: string;
  description: string;
  icon: LucideIcon;
}

export const COMPETENCIES: readonly CompetencyDef[] = [
  { id: "communication", name: "Communication and Collaboration", description: "Listening, speaking and working with others to share ideas and achieve common goals.", icon: MessagesSquare },
  { id: "critical", name: "Critical Thinking and Problem Solving", description: "Analysing information, reasoning logically and finding workable solutions.", icon: Brain },
  { id: "selfEfficacy", name: "Self-Efficacy", description: "Believing in one's ability to plan, persevere and succeed in tasks.", icon: ShieldCheck },
  { id: "creativity", name: "Creativity and Imagination", description: "Generating original ideas and expressing them in new and useful ways.", icon: Lightbulb },
  { id: "citizenship", name: "Citizenship", description: "Taking responsibility as a member of the school, community and nation.", icon: Landmark },
  { id: "digital", name: "Digital Literacy", description: "Using technology confidently and responsibly to learn, create and communicate.", icon: MonitorSmartphone },
  { id: "learning", name: "Learning to Learn", description: "Organising one's own learning, reflecting and seeking new knowledge independently.", icon: GraduationCap },
];

export const CORE_VALUES = ["Love", "Responsibility", "Respect", "Unity", "Peace", "Patriotism", "Integrity"] as const;

export function formatScore(score: number): string {
  return `${Math.round(score)}%`;
}

export function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}
