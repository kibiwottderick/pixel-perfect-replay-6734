import type {
  Competencies,
  CompetencyId,
  Performance,
  Student,
  SubjectId,
  TermNumber,
  TermRef,
} from "@/types/student";

/** Current date context: October 2026, Term 3 in progress. */
export const TERMS: readonly TermRef[] = [2024, 2025, 2026].flatMap((year) =>
  ([1, 2, 3] as TermNumber[]).map((term) => ({
    key: `${year}-T${term}`,
    year,
    term,
    label: `T${term} ${year}`,
    inProgress: year === 2026 && term === 3,
  })),
);

export const YEARS = [2026, 2025, 2024] as const;
export const DEMO_STUDENT_ID = "3f71d058-dee8-41de-8bde-31e8d4009f43";

/** Deterministic pseudo-random (mulberry32). */
function seeded(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STUDENT: Student = {
  id: DEMO_STUDENT_ID,
  firstName: "Amani",
  lastName: "Wanjiru",
  otherName: "Njeri",
  admissionNumber: "ADM/2023/0417",
  upi: "KE-UPI-7Q4M2X",
  gender: "Female",
  dateOfBirth: "2013-03-14",
  grade: 8,
  stream: "East",
  academicYear: 2026,
  yearJoined: 2025,
  currentTerm: 3,
  status: "Active",
  classTeacher: { name: "Mr. Peter Otieno", phone: "+254 712 345 678", email: "p.otieno@school.ac.ke" },
  guardian: {
    name: "Grace Wanjiru",
    relationship: "Mother",
    phone: "+254 722 908 114",
    email: "grace.wanjiru@gmail.com",
    occupation: "Nurse, Kiambu Level 5 Hospital",
    county: "Kiambu",
    emergencyContact: "Joseph Kamau (Uncle) · +254 733 410 552",
  },
  religiousEducation: "CRE",
  clubs: ["Drama Club", "Environmental Club", "Scouts"],
  sports: ["Athletics (400m)", "Netball"],
  house: "Kilimanjaro",
  residence: "Day",
  transportRoute: "Route 3 · Ruaka – Banana",
  healthNotes: "Mild asthma; inhaler kept at the nurse's office. No learning support needs.",
  feeStatus: "Cleared",
  attendance: { presentPct: 96, daysAbsent: 2, lateCount: 3, daysOpen: 48 },
  disciplinaryNotes: 0,
  awards: ["County Music Festival – 1st (Solo verse)", "Term 2 Most Improved in Science", "Inter-house athletics – 400m silver"],
};

/** Hand-shaped trajectories (9 terms: 2024 T1 → 2026 T3). */
const SUBJECT_SCORES: Record<SubjectId, number[]> = {
  english: [62, 64, 66, 65, 68, 70, 69, 72, 74],
  kiswahili: [60, 63, 61, 64, 66, 65, 68, 70, 71],
  math: [58, 61, 63, 62, 66, 68, 70, 72, 66],
  re: [70, 72, 71, 74, 73, 76, 78, 77, 79],
  social: [74, 76, 78, 80, 79, 82, 84, 85, 86],
  science: [50, 52, 55, 54, 58, 61, 64, 70, 76],
  pretech: [55, 57, 60, 59, 62, 63, 65, 64, 67],
  agri: [63, 62, 65, 67, 66, 68, 67, 70, 72],
  creative: [80, 82, 84, 83, 86, 87, 88, 90, 91],
};

const COMMENTS: Record<SubjectId, string> = {
  english: "Reads widely; essays show growing structure and vocabulary.",
  kiswahili: "Anajieleza vizuri; aendelee kuzingatia sarufi katika insha.",
  math: "Dropped on algebra this term; needs regular practice with equations.",
  re: "Applies values from scripture thoughtfully in class discussions.",
  social: "Excellent map work and strong use of historical sources.",
  science: "Remarkable progress; very engaged in practical investigations.",
  pretech: "Neat technical drawings; spreadsheet skills improving.",
  agri: "Keeps reliable crop records for the school garden project.",
  creative: "Outstanding performer and athlete; a natural leader on stage.",
};

const COMPETENCY_SCORES: Record<CompetencyId, number[]> = {
  communication: [62, 64, 66, 68, 68, 72, 75, 78, 80],
  critical: [55, 57, 58, 60, 63, 63, 66, 69, 71],
  selfEfficacy: [60, 61, 64, 66, 69, 72, 71, 75, 77],
  creativity: [72, 75, 78, 80, 82, 85, 86, 89, 91],
  citizenship: [66, 68, 70, 70, 73, 75, 77, 76, 79],
  digital: [45, 48, 50, 53, 55, 58, 58, 62, 65],
  learning: [58, 60, 62, 61, 64, 67, 69, 72, 74],
};

const EVIDENCE: Record<CompetencyId, { evidence: string[]; next: string }> = {
  communication: {
    evidence: [
      "Led her group in presenting the Term 2 science project to Grade 7 learners.",
      "Chaired the class debate on plastic pollution, inviting quieter members to speak.",
      "Wrote a clear, well-structured letter to the county environment office.",
    ],
    next: "Take on peer-feedback roles in English writing workshops.",
  },
  critical: {
    evidence: [
      "Identified a flaw in her group's water-filter design and proposed a fix.",
      "Compared two historical sources on the Mau Mau and explained their bias.",
    ],
    next: "Practise multi-step word problems in Mathematics, explaining each step.",
  },
  selfEfficacy: {
    evidence: [
      "Set her own revision timetable after the Term 1 Mathematics results.",
      "Volunteered to represent the class at the county music festival.",
    ],
    next: "Keep a weekly reflection log of goals and what helped her reach them.",
  },
  creativity: {
    evidence: [
      "Composed an original Kiswahili verse that won 1st at the county music festival.",
      "Designed the stage set for the Grade 8 drama production from recycled materials.",
      "Created a comic strip explaining the water cycle for Integrated Science.",
    ],
    next: "Apply design thinking to a Pre-Technical Studies prototype project.",
  },
  citizenship: {
    evidence: [
      "Organised a tree-planting day with the Environmental Club along the river.",
      "Served as class prefect, mediating fairly in two disputes.",
    ],
    next: "Lead a community service learning project on waste sorting.",
  },
  digital: {
    evidence: [
      "Used a spreadsheet to track plant growth in Agriculture.",
      "Researched safely online and cited sources in her Social Studies project.",
    ],
    next: "Build a simple presentation with charts for the next science fair.",
  },
  learning: {
    evidence: [
      "Uses past papers and marks her own work against the rubric.",
      "Asked for extra algebra worksheets after noticing gaps.",
    ],
    next: "Try spaced revision with flashcards for Kiswahili sarufi.",
  },
};

function cohortFor(subject: SubjectId, scores: number[]): number[] {
  const rnd = seeded(subject.length * 97 + subject.charCodeAt(0));
  return scores.map((_, i) => Math.round((58 + i * 0.6 + rnd() * 8) * 10) / 10);
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/* ---------- Typed data layer (swap for Lovable Cloud later) ---------- */

export function getStudentSync(id: string): Student | null {
  return id === STUDENT.id ? STUDENT : null;
}

export function getPerformanceSync(id: string): Performance | null {
  if (id !== STUDENT.id) return null;
  return {
    studentId: id,
    subjects: (Object.keys(SUBJECT_SCORES) as SubjectId[]).map((subjectId) => ({
      subjectId,
      scores: SUBJECT_SCORES[subjectId],
      cohort: cohortFor(subjectId, SUBJECT_SCORES[subjectId]),
      comments: TERMS.map(() => COMMENTS[subjectId]),
    })),
  };
}

export function getCompetenciesSync(id: string): Competencies | null {
  if (id !== STUDENT.id) return null;
  return {
    studentId: id,
    competencies: (Object.keys(COMPETENCY_SCORES) as CompetencyId[]).map((cid) => ({
      id: cid,
      scores: COMPETENCY_SCORES[cid],
      evidence: EVIDENCE[cid].evidence,
      nextSteps: EVIDENCE[cid].next,
    })),
    values: [
      { value: "Love", rating: 5 },
      { value: "Responsibility", rating: 4 },
      { value: "Respect", rating: 5 },
      { value: "Unity", rating: 4 },
      { value: "Peace", rating: 4 },
      { value: "Patriotism", rating: 3 },
      { value: "Integrity", rating: 5 },
    ],
    pcis: ["Life Skills", "Health Education", "Environmental Education", "Financial Literacy", "Safety & Security"],
  };
}

export async function getStudent(id: string) {
  await delay(250);
  return getStudentSync(id);
}
export async function getPerformance(id: string) {
  await delay(150);
  return getPerformanceSync(id);
}
export async function getCompetencies(id: string) {
  await delay(150);
  return getCompetenciesSync(id);
}

export function listStudents(): Student[] {
  return [STUDENT];
}
