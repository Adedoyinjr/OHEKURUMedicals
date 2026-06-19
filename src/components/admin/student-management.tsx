"use client"

import { useEffect, useMemo, useState } from "react"
import { Plus, UserRoundPlus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { StudentRecord } from "@/types/academic"

type StudentManagementProps = {
  initialStudents: StudentRecord[]
}

function createBlankStudent({
  fullName,
  matricNo,
  department,
  level,
}: {
  fullName: string
  matricNo: string
  department: string
  level: number
}): StudentRecord {
  return {
    fullName,
    matricNo,
    department,
    faculty: "Health Sciences",
    level,
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

function nextMatric(students: StudentRecord[]) {
  const usedNumbers = students
    .map((student) => Number(student.matricNo.split("/").at(-1)))
    .filter((value) => Number.isFinite(value))

  const nextNumber = Math.max(...usedNumbers, 1000) + 1

  return `UG25/OHEKURU/${nextNumber}`
}

export function StudentManagement({ initialStudents }: StudentManagementProps) {
  const [students, setStudents] = useState(initialStudents)
  const suggestedMatric = useMemo(() => nextMatric(students), [students])
  const [matricNo, setMatricNo] = useState(suggestedMatric)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const savedStudents = window.localStorage.getItem("portalStudents")
    if (!savedStudents) return

    try {
      const parsedStudents = JSON.parse(savedStudents) as StudentRecord[]
      if (Array.isArray(parsedStudents) && parsedStudents.length >= initialStudents.length) {
        setStudents(parsedStudents)
      }
    } catch {
      window.localStorage.removeItem("portalStudents")
    }
  }, [initialStudents.length])

  function registerStudent(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const form = new FormData(event.currentTarget)
    const fullName = String(form.get("fullName") ?? "").trim()
    const department = String(form.get("department") ?? "Health Education").trim()
    const level = Number(form.get("level") ?? 200)
    const normalizedMatric = matricNo.trim().toUpperCase()

    if (!fullName || !normalizedMatric) {
      setMessage("Full name and matric number are required.")
      return
    }

    if (students.some((student) => student.matricNo === normalizedMatric)) {
      setMessage("That matric number is already assigned.")
      return
    }

    const newStudent = createBlankStudent({
      fullName,
      matricNo: normalizedMatric,
      department,
      level,
    })

    const nextStudents = [...students, newStudent]
    setStudents(nextStudents)
    window.localStorage.setItem("portalStudents", JSON.stringify(nextStudents))
    setMatricNo(nextMatric(nextStudents))
    setMessage(`${fullName} has been registered with ${normalizedMatric}.`)
    event.currentTarget.reset()
  }

  return (
    <section id="students" className="grid gap-3 sm:gap-4 xl:grid-cols-[0.85fr_1.35fr]">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
              <UserRoundPlus className="h-5 w-5" aria-hidden="true" />
            </span>
            <CardTitle>Register New Student</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-3 sm:space-y-4" onSubmit={registerStudent}>
            <div className="space-y-2">
              <Label htmlFor="newFullName">Full name</Label>
              <Input id="newFullName" name="fullName" placeholder="Student full name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newMatric">Matric number</Label>
              <Input
                id="newMatric"
                value={matricNo}
                onChange={(event) => setMatricNo(event.target.value.toUpperCase())}
              />
            </div>

            <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newDepartment">Department</Label>
                <Input
                  id="newDepartment"
                  name="department"
                  defaultValue="Health Education"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newLevel">Level</Label>
                <Input id="newLevel" name="level" type="number" defaultValue={200} />
              </div>
            </div>

            {message ? (
              <p className="rounded-md border bg-muted px-3 py-2 text-sm text-muted-foreground">
                {message}
              </p>
            ) : null}

            <Button type="submit" className="w-full">
              <Plus className="h-4 w-4" aria-hidden="true" />
              Register student
            </Button>
          </form>
        </CardContent>
      </Card>

        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:hidden">
              {students.map((student) => (
                <article key={student.matricNo} className="rounded-lg border bg-card p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold">{student.fullName}</p>
                    <Badge
                      variant={student.firstSemester.grade === "A" ? "default" : "secondary"}
                    >
                      {student.firstSemester.grade}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{student.matricNo}</p>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                    <div className="rounded-md border px-2 py-1.5">
                      <p className="text-[11px] font-semibold uppercase text-muted-foreground">Total</p>
                      <p className="mt-0.5 font-semibold">{student.firstSemester.totalScore || "-"}</p>
                    </div>
                    <div className="rounded-md border px-2 py-1.5">
                      <p className="text-[11px] font-semibold uppercase text-muted-foreground">GPA</p>
                      <p className="mt-0.5 font-semibold">{student.firstSemester.gpa.toFixed(2)}</p>
                    </div>
                    <div className="rounded-md border px-2 py-1.5">
                      <p className="text-[11px] font-semibold uppercase text-muted-foreground">2nd Sem</p>
                      <p className="mt-0.5 font-semibold">{student.secondSemesterStatus}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Matric No</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>GPA</TableHead>
                    <TableHead>2nd Sem</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.matricNo}>
                      <TableCell className="font-semibold">{student.fullName}</TableCell>
                      <TableCell className="font-medium">{student.matricNo}</TableCell>
                      <TableCell>{student.firstSemester.totalScore || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={student.firstSemester.grade === "A" ? "default" : "secondary"}
                        >
                          {student.firstSemester.grade}
                        </Badge>
                      </TableCell>
                      <TableCell>{student.firstSemester.gpa.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{student.secondSemesterStatus}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
    </section>
  )
}
