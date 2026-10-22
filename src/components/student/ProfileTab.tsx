import { Award, CalendarCheck, Mail, Pencil, Phone, ShieldAlert, TrendingUp, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LevelBadge } from "./LevelBadge";
import { cn } from "@/lib/utils";
import type { Student } from "@/types/student";

function ageFrom(dob: string, now = new Date("2026-10-22")) {
  const d = new Date(dob);
  let age = now.getFullYear() - d.getFullYear();
  if (now < new Date(now.getFullYear(), d.getMonth(), d.getDate())) age--;
  return age;
}

function InfoCard({ title, children, className, action }: { title: string; children: ReactNode; className?: string; action?: ReactNode }) {
  return (
    <section className={cn("surface-card p-5 sm:p-6 animate-fade-up", className)}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-foreground break-words">{value}</dd>
    </div>
  );
}

function StatTile({ icon: Icon, label, value, extra }: { icon: LucideIcon; label: string; value: ReactNode; extra?: ReactNode }) {
  return (
    <div className="surface-card flex items-center gap-3 p-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="flex flex-wrap items-center gap-2 text-lg font-semibold tabular-nums">
          {value}
          {extra}
        </div>
      </div>
    </div>
  );
}

export function ProfileTab({ student, currentAverage }: { student: Student; currentAverage: number }) {
  const att = student.attendance;
  const ring = [
    { name: "Present", value: att.presentPct },
    { name: "Absent", value: 100 - att.presentPct },
  ];
  const fee = { Cleared: "bg-level-ee/12 text-level-ee", "Balance due": "bg-level-ae/15 text-level-ae", Overdue: "bg-level-be/12 text-level-be" }[student.feeStatus];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile icon={CalendarCheck} label="Attendance" value={`${att.presentPct}%`} />
        <StatTile icon={TrendingUp} label="Current average" value={`${Math.round(currentAverage)}%`} extra={<LevelBadge score={currentAverage} />} />
        <StatTile icon={ShieldAlert} label="Disciplinary notes" value={student.disciplinaryNotes} />
        <StatTile icon={Award} label="Awards" value={student.awards.length} />
      </div>

      <div className="flex justify-end print-hidden">
        <Button variant="outline" size="sm" className="rounded-full">
          <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit profile
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <InfoCard title="Identity">
          <dl className="grid grid-cols-2 gap-4">
            <Field label="Full name" value={`${student.firstName} ${student.otherName ?? ""} ${student.lastName}`} />
            <Field label="Admission number" value={student.admissionNumber} />
            <Field label="Gender" value={student.gender} />
            <Field label="Date of birth" value={`${new Date(student.dateOfBirth).toLocaleDateString("en-KE", { day: "numeric", month: "long", year: "numeric" })} · ${ageFrom(student.dateOfBirth)} yrs`} />
            <Field label="UPI / Assessment no." value={student.upi ?? "—"} />
          </dl>
        </InfoCard>

        <InfoCard title="Class">
          <dl className="grid grid-cols-2 gap-4">
            <Field label="Class" value={`Grade ${student.grade} (Junior School)`} />
            <Field label="Stream" value={student.stream} />
            <Field label="Academic year" value={student.academicYear} />
            <Field label="Year joined" value={student.yearJoined} />
            <Field label="Current term" value={`Term ${student.currentTerm} (in progress)`} />
          </dl>
          <div className="mt-5 flex items-center gap-3 rounded-xl bg-muted p-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">PO</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">Class teacher</p>
              <p className="truncate text-sm font-medium">{student.classTeacher.name}</p>
            </div>
            <Button asChild size="icon" variant="ghost" aria-label={`Call ${student.classTeacher.name}`}>
              <a href={`tel:${student.classTeacher.phone.replace(/\s/g, "")}`}><Phone className="h-4 w-4" /></a>
            </Button>
            <Button asChild size="icon" variant="ghost" aria-label={`Email ${student.classTeacher.name}`}>
              <a href={`mailto:${student.classTeacher.email}`}><Mail className="h-4 w-4" /></a>
            </Button>
          </div>
        </InfoCard>

        <InfoCard title="Parent / guardian">
          <dl className="grid grid-cols-2 gap-4">
            <Field label="Name" value={student.guardian.name} />
            <Field label="Relationship" value={student.guardian.relationship} />
            <Field label="Phone" value={<a className="text-primary hover:underline" href={`tel:${student.guardian.phone.replace(/\s/g, "")}`}>{student.guardian.phone}</a>} />
            <Field label="Email" value={<a className="text-primary hover:underline" href={`mailto:${student.guardian.email}`}>{student.guardian.email}</a>} />
            <Field label="Occupation" value={student.guardian.occupation} />
            <Field label="Home county" value={student.guardian.county} />
            <div className="col-span-2"><Field label="Emergency contact" value={student.guardian.emergencyContact} /></div>
          </dl>
        </InfoCard>

        <InfoCard title="General information">
          <div className="grid gap-5 sm:grid-cols-[1fr_auto]">
            <dl className="grid grid-cols-2 gap-4">
              <Field label="Religious Education" value={student.religiousEducation} />
              <Field label="House" value={student.house} />
              <Field label="Boarding / day" value={student.residence} />
              <Field label="Transport" value={student.transportRoute} />
              <Field label="Clubs" value={student.clubs.join(", ")} />
              <Field label="Sports" value={student.sports.join(", ")} />
              <Field label="Fee status" value={<span className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", fee)}>{student.feeStatus}</span>} />
              <div className="col-span-2"><Field label="Health & special needs" value={student.healthNotes} /></div>
            </dl>
            <div className="flex flex-col items-center rounded-xl bg-muted p-4">
              <div className="relative h-24 w-24" role="img" aria-label={`Attendance this term ${att.presentPct} percent`}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={ring} dataKey="value" innerRadius={34} outerRadius={46} startAngle={90} endAngle={-270} stroke="none">
                      <Cell fill="var(--primary)" />
                      <Cell fill="var(--border)" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <span className="absolute inset-0 grid place-items-center text-lg font-semibold">{att.presentPct}%</span>
              </div>
              <p className="mt-2 text-xs font-medium">Attendance this term</p>
              <p className="text-xs text-muted-foreground">{att.daysAbsent} absent · {att.lateCount} late</p>
            </div>
          </div>
        </InfoCard>
      </div>

      <InfoCard title="Awards & highlights">
        <ul className="flex flex-wrap gap-2">
          {student.awards.map((a) => (
            <li key={a} className="rounded-full bg-accent px-3 py-1 text-sm text-accent-foreground">🏅 {a}</li>
          ))}
        </ul>
      </InfoCard>
    </div>
  );
}
