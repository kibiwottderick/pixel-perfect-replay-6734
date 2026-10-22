export type TermNumber = 1 | 2 | 3;
export type TermFilter = TermNumber | "all";

export interface TermRef {
  key: string;
  year: number;
  term: TermNumber;
  label: string;
  inProgress: boolean;
}

export type SubjectId =
  | "english"
  | "kiswahili"
  | "math"
  | "re"
  | "social"
  | "science"
  | "pretech"
  | "agri"
  | "creative";

export type ReligiousEducation = "CRE" | "IRE" | "HRE";

export type CompetencyId =
  | "communication"
  | "critical"
  | "selfEfficacy"
  | "creativity"
  | "citizenship"
  | "digital"
  | "learning";

export interface Guardian {
  name: string;
  relationship: string;
  phone: string;
  email: string;
  occupation: string;
  county: string;
  emergencyContact: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  otherName?: string;
  admissionNumber: string;
  upi?: string;
  gender: "Female" | "Male";
  dateOfBirth: string;
  grade: number;
  stream: string;
  academicYear: number;
  yearJoined: number;
  currentTerm: TermNumber;
  status: "Active" | "Inactive";
  classTeacher: { name: string; phone: string; email: string };
  guardian: Guardian;
  religiousEducation: ReligiousEducation;
  clubs: string[];
  sports: string[];
  house: string;
  residence: "Boarding" | "Day";
  transportRoute: string;
  healthNotes: string;
  feeStatus: "Cleared" | "Balance due" | "Overdue";
  attendance: { presentPct: number; daysAbsent: number; lateCount: number; daysOpen: number };
  disciplinaryNotes: number;
  awards: string[];
}

export interface SubjectRecord {
  subjectId: SubjectId;
  /** Aligned with TERMS. */
  scores: number[];
  cohort: number[];
  comments: string[];
}

export interface CompetencyRecord {
  id: CompetencyId;
  /** 0–100 rubric scores aligned with TERMS. */
  scores: number[];
  evidence: string[];
  nextSteps: string;
}

export interface ValueRating {
  value: string;
  rating: 1 | 2 | 3 | 4 | 5;
}

export interface Performance {
  studentId: string;
  subjects: SubjectRecord[];
}

export interface Competencies {
  studentId: string;
  competencies: CompetencyRecord[];
  values: ValueRating[];
  pcis: string[];
}
