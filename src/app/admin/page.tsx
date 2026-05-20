import {
  AlertTriangle,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  GraduationCap,
} from "lucide-react"
import { AdminAnalyticsSummary } from "@/components/charts/admin-analytics-summary"
import { StudentManagement } from "@/components/admin/student-management"
import { StatCard } from "@/components/cards/stat-card"
import { PortalShell } from "@/components/layout/portal-shell"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  classFirstSemesterResults,
  classStudents,
  departmentPerformance,
  gpaTrend,
} from "@/lib/demo-data"

const averageGpa =
  classStudents.reduce((total, student) => total + student.firstSemester.gpa, 0) /
  classStudents.length
const awaitingSecondSemester = classStudents.filter(
  (student) => student.secondSemesterStatus === "Awaiting",
).length

export default function AdminPage() {
  return (
    <PortalShell
      role="admin"
      title="Academic Operations"
      subtitle="Results, GPA analytics, AI reports, and student records."
    >
      <div className="space-y-6">
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Students"
            value={String(classStudents.length)}
            note="Registered in this class"
            icon={GraduationCap}
            tone="primary"
          />
          <StatCard
            title="Average GPA"
            value={averageGpa.toFixed(2)}
            note="First semester"
            icon={BarChart3}
            tone="accent"
          />
          <StatCard
            title="Published Results"
            value={String(classStudents.length)}
            note="First semester records"
            icon={CheckCircle2}
            tone="secondary"
          />
          <StatCard
            title="Awaiting 2nd Sem"
            value={String(awaitingSecondSemester)}
            note="Results not published yet"
            icon={AlertTriangle}
            tone="danger"
          />
        </section>

        <section id="analytics">
          <AdminAnalyticsSummary gpaTrend={gpaTrend} results={classFirstSemesterResults} />
        </section>

        <StudentManagement initialStudents={classStudents} />

        <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
          <Card id="ai-reports">
            <CardHeader>
              <CardTitle>AI Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {classStudents.map((student, index) => (
                <div key={student.matricNo} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold">{student.fullName}</p>
                    <Badge variant={index === 0 ? "default" : "accent"}>Ready</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    First semester GPA {student.firstSemester.gpa.toFixed(2)} has been
                    analyzed. Second semester result is awaiting publication.
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section id="courses" className="grid gap-4 lg:grid-cols-4">
          {departmentPerformance.map((department) => (
            <Card key={department.label}>
              <CardContent className="p-5">
                <p className="text-sm font-medium text-muted-foreground">{department.label}</p>
                <p className="mt-3 text-3xl font-bold">
                  {department.label.includes("Students") ||
                  department.label.includes("Results")
                    ? department.value
                    : department.value.toFixed(2)}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">Class summary</p>
              </CardContent>
            </Card>
          ))}
        </section>

        <section id="settings" className="rounded-lg border bg-card p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent/10 text-accent">
              <BrainCircuit className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-base font-semibold">AI Analysis</h2>
              <p className="text-sm text-muted-foreground">
                Reports use published results and the school grading scale.
              </p>
            </div>
          </div>
        </section>
      </div>
    </PortalShell>
  )
}
