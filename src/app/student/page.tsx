"use client"

import { useEffect, useMemo, useState } from "react"
import { Award, BrainCircuit, GraduationCap, TrendingUp } from "lucide-react"
import { AcademicCharts } from "@/components/charts/academic-charts"
import { PortalShell } from "@/components/layout/portal-shell"
import { StatCard } from "@/components/cards/stat-card"
import { StudentBioDataForm } from "@/components/forms/student-bio-data-form"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResultsTable } from "@/components/tables/results-table"
import { classStudents, demoStudent, resultsForStudent } from "@/lib/demo-data"
import { classifyPerformance } from "@/lib/grading"
import type { StudentRecord } from "@/types/academic"

function blankStudentFromMatric(matricNo: string): StudentRecord {
  return {
    matricNo,
    fullName: "Registered Student",
    department: "Health Education",
    faculty: "Health Sciences",
    level: 200,
    gpa: 0,
    cgpa: 0,
    firstSemester: {
      paper1: 0,
      paper2: 0,
      paper3: 0,
      ca: 0,
      exam: 0,
      totalScore: 0,
      grade: "Awaiting",
      gradePoint: 0,
      gpa: 0,
    },
    secondSemesterStatus: "Awaiting",
  }
}

function findLocalStudent(matricNo: string) {
  const savedStudents = window.localStorage.getItem("portalStudents")
  if (!savedStudents) return undefined

  try {
    const parsedStudents = JSON.parse(savedStudents) as StudentRecord[]
    return parsedStudents.find((student) => student.matricNo === matricNo)
  } catch {
    window.localStorage.removeItem("portalStudents")
    return undefined
  }
}

export default function StudentPage() {
  const [student, setStudent] = useState(demoStudent)
  const results = useMemo(() => resultsForStudent(student), [student])
  const studentGpaTrend = useMemo(
    () => [{ label: "First Sem", gpa: student.gpa }],
    [student.gpa],
  )
  const performance = classifyPerformance(student.gpa)

  useEffect(() => {
    const userText = window.localStorage.getItem("portalUser")
    if (!userText) return

    try {
      const user = JSON.parse(userText) as { matricNo?: string; fullName?: string }
      if (!user.matricNo) return

      const matchedStudent =
        classStudents.find((record) => record.matricNo === user.matricNo) ??
        findLocalStudent(user.matricNo) ??
        blankStudentFromMatric(user.matricNo)

      setStudent(
        matchedStudent.fullName === "Registered Student" && user.fullName
          ? { ...matchedStudent, fullName: user.fullName }
          : matchedStudent,
      )
    } catch {
      window.localStorage.removeItem("portalUser")
    }
  }, [])

  return (
    <PortalShell
      role="student"
      title={`Welcome, ${student.fullName}`}
      subtitle={`${student.department} - ${student.faculty} - Level ${student.level}`}
    >
      <div className="space-y-4 sm:space-y-6">
        <section className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">
          <Card>
            <CardContent className="min-h-28 p-4 sm:min-h-36 sm:p-5">
              <div className="flex items-start justify-between gap-3 sm:items-center sm:gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">Student Profile</p>
                  <p className="mt-2 break-words text-lg font-bold sm:mt-3 sm:text-xl">
                    {student.matricNo}
                  </p>
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary sm:h-11 sm:w-11">
                  <GraduationCap className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{student.fullName}</p>
            </CardContent>
          </Card>

          <StatCard
            title="Current GPA"
            value={student.gpa.toFixed(2)}
            note="First semester"
            icon={TrendingUp}
            tone="primary"
          />
          <StatCard
            title="CGPA"
            value={student.cgpa.toFixed(2)}
            note="Cumulative"
            icon={Award}
            tone="secondary"
          />
          <Card>
            <CardContent className="min-h-28 p-4 sm:min-h-36 sm:p-5">
              <div className="flex items-start justify-between gap-3 sm:items-center sm:gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted-foreground">AI Performance</p>
                  <p className="mt-2 text-2xl font-bold sm:mt-3">{performance}</p>
                </div>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent sm:h-11 sm:w-11">
                  <BrainCircuit className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>
              <Badge className="mt-4" variant="accent">
                AI reviewed
              </Badge>
            </CardContent>
          </Card>
        </section>

        <StudentBioDataForm student={student} />

        <section id="analytics">
          <AcademicCharts gpaTrend={studentGpaTrend} results={results} />
        </section>

        <section id="results" className="grid gap-3 sm:gap-4 xl:grid-cols-[1.5fr_0.8fr]">
          <Card>
            <CardHeader>
              <CardTitle>First Semester Result</CardTitle>
            </CardHeader>
            <CardContent>
              <ResultsTable results={results} />
            </CardContent>
          </Card>

          <Card id="ai-feedback">
            <CardHeader>
              <CardTitle>AI Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm leading-6 text-muted-foreground">
                {student.fullName} has a first semester total score of{" "}
                {student.firstSemester.totalScore} and GPA of{" "}
                {student.firstSemester.gpa.toFixed(2)}. The second semester result is
                still awaiting publication.
              </p>
              <div className="rounded-lg border bg-muted/60 p-3 sm:p-4">
                <p className="text-sm font-semibold">Recommended focus</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Maintain revision consistency while awaiting second semester results.
                  Extra practice on Paper 2 can lift the next GPA.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </PortalShell>
  )
}
