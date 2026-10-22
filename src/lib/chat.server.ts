import { convertToModelMessages, type UIMessage } from "ai";

import { COMPETENCIES, scoreToLevel, subjectName } from "@/lib/cbc";
import { getCompetenciesSync, getPerformanceSync, getStudentSync } from "@/lib/mockData";
import { PATHWAYS, pathwayReadiness } from "@/lib/pathways";
import { createResponsesCall } from "@/lib/server/responses";
import type { Student, SubjectId } from "@/types/student";

const GATEWAY_BASE_URL = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";

const SCALE_LINES = [
  "Kenyan CBC 8-point performance scale:",
  "- EE1 Exceeding Expectations 1 (8 pts, 90–100%)",
  "- EE2 Exceeding Expectations 2 (7 pts, 75–89%)",
  "- ME1 Meeting Expectations 1 (6 pts, 58–74%)",
  "- ME2 Meeting Expectations 2 (5 pts, 41–57%)",
  "- AE1 Approaching Expectations 1 (4 pts, 31–40%)",
  "- AE2 Approaching Expectations 2 (3 pts, 21–30%)",
  "- BE1 Below Expectations 1 (2 pts, 11–20%)",
  "- BE2 Below Expectations 2 (1 pt, 0–10%)",
].join("\n");

function latest(scores: number[]): number {
  return scores[scores.length - 1] ?? 0;
}

function buildStudentContext(student: Student): string {
  const performance = getPerformanceSync(student.id);
  const competencies = getCompetenciesSync(student.id);
  const lines: string[] = [];

  lines.push(
    `Learner: ${[student.firstName, student.otherName, student.lastName].filter(Boolean).join(" ")}`,
  );
  lines.push(
    `Grade ${student.grade} (${student.stream} stream), Junior School. Academic year ${student.academicYear}, Term ${student.currentTerm} in progress. Admission ${student.admissionNumber}. Religious Education: ${student.religiousEducation}. Attendance ${student.attendance.presentPct}% (${student.attendance.daysAbsent} days absent, ${student.attendance.lateCount} late). Fees: ${student.feeStatus}. House ${student.house}, ${student.residence} learner.`,
  );
  lines.push(`Clubs: ${student.clubs.join(", ") || "none"}. Sports: ${student.sports.join(", ") || "none"}.`);
  lines.push(`Awards: ${student.awards.join("; ") || "none"}. Health notes: ${student.healthNotes}`);

  if (performance) {
    lines.push("Subject scores (term scores run T1 2024 → T3 2026, latest term in progress):");
    for (const record of performance.subjects) {
      const current = latest(record.scores);
      const previous = record.scores[record.scores.length - 2];
      const level = scoreToLevel(current);
      const drop = previous != null && current - previous <= -5 ? " — notable drop this term" : "";
      lines.push(
        `- ${subjectName(record.subjectId, student.religiousEducation)}: latest ${Math.round(current)}% (${level.label}, ${level.points} pts)${
          previous != null ? `, previous ${Math.round(previous)}%` : ""
        }${drop}. Teacher comment: ${record.comments[record.comments.length - 1]}`,
      );
    }

    const scoreMap = Object.fromEntries(
      performance.subjects.map((s) => [s.subjectId, latest(s.scores)]),
    ) as Record<SubjectId, number>;
    const creativity = competencies?.competencies.find((c) => c.id === "creativity");
    const readiness = PATHWAYS.map((p) => ({
      name: p.name,
      score: pathwayReadiness(p.id, scoreMap, creativity ? latest(creativity.scores) : 0),
    })).sort((a, b) => b.score - a.score);
    lines.push(
      `Pathway readiness (indicative, highest first): ${readiness
        .map((r) => `${r.name} ${Math.round(r.score)}%`)
        .join(", ")}.`,
    );
  }

  if (competencies) {
    lines.push("Core competencies (latest rubric scores out of 100):");
    for (const record of competencies.competencies) {
      const def = COMPETENCIES.find((c) => c.id === record.id);
      lines.push(`- ${def?.name ?? record.id}: ${Math.round(latest(record.scores))}. Next steps: ${record.nextSteps}`);
    }
    lines.push(
      `Core values ratings (out of 5): ${competencies.values.map((v) => `${v.value} ${v.rating}`).join(", ")}.`,
    );
    lines.push(`Pastoral Programme Instruction (PPI) themes: ${competencies.pcis.join(", ")}.`);
  }

  return lines.join("\n");
}

function buildSystemPrompt(student: Student): string {
  return [
    'You are "Ask AI", the teaching assistant inside the CBC Learner Tracker app used by Kenyan junior school teachers.',
    "You answer questions about ONE learner using ONLY the learner data provided below. The current date is October 2026 and Term 3, 2026 is in progress.",
    SCALE_LINES,
    "Guidelines:",
    "- Be concise, warm and practical; structure answers with short paragraphs or bullet lists.",
    "- Reference the learner's actual scores, performance levels, trends, competencies and pathway readiness from the data.",
    "- Suggest specific, CBC-aligned interventions the teacher or guardian can act on.",
    "- Never invent scores, assessments or events that are not in the data; if something is not covered, say so plainly.",
    "- Keep answers under about 250 words unless the teacher asks for more detail.",
    "",
    "LEARNER DATA",
    buildStudentContext(student),
  ].join("\n");
}

export async function handleChat(request: Request): Promise<Response> {
  const apiKey = process.env.LOVABLE_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "AI is not configured on the server." }, { status: 500 });
  }

  const body = (await request.json().catch(() => null)) as
    | { messages?: UIMessage[]; studentId?: unknown }
    | null;
  const messages = body?.messages;
  const student = typeof body?.studentId === "string" ? getStudentSync(body.studentId) : null;

  if (!Array.isArray(messages) || messages.length === 0 || !student) {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const modelMessages = await convertToModelMessages(messages);
  const { response } = createResponsesCall(
    request,
    { baseURL: GATEWAY_BASE_URL, apiKey, model: MODEL },
    modelMessages,
    buildSystemPrompt(student),
  );
  return response();
}
