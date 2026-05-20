import { prisma } from "@/lib/prisma"
import { calculateGPA, calculateGrade } from "@/lib/grading"
import type { RawResultRow } from "@/lib/excel"

type UploadOptions = {
  session: string
  semester: string
  publish?: boolean
}

export async function uploadResultRows(rows: RawResultRow[], options: UploadOptions) {
  const imported = []
  const skipped = []

  for (const row of rows) {
    if (!row.matricNo || !row.courseCode || Number.isNaN(row.score)) {
      skipped.push({ ...row, reason: "Missing matric number, course code, or score." })
      continue
    }

    const student = await prisma.student.findUnique({
      where: { matricNo: row.matricNo },
    })

    if (!student) {
      skipped.push({ ...row, reason: "Student was not found." })
      continue
    }

    const course = await prisma.course.upsert({
      where: { courseCode: row.courseCode },
      update: {},
      create: {
        courseCode: row.courseCode,
        title: row.courseCode,
        unit: 3,
        semester: options.semester,
      },
    })

    const grade = calculateGrade(row.score)

    const result = await prisma.result.upsert({
      where: {
        studentId_courseId_session_semester: {
          studentId: student.id,
          courseId: course.id,
          session: options.session,
          semester: options.semester,
        },
      },
      update: {
        score: row.score,
        grade: grade.grade,
        gradePoint: grade.point,
        published: options.publish ?? false,
      },
      create: {
        studentId: student.id,
        courseId: course.id,
        score: row.score,
        grade: grade.grade,
        gradePoint: grade.point,
        session: options.session,
        semester: options.semester,
        published: options.publish ?? false,
      },
      include: { course: true, student: true },
    })

    imported.push(result)
  }

  const affectedStudentIds = [...new Set(imported.map((result) => result.studentId))]

  await Promise.all(
    affectedStudentIds.map(async (studentId) => {
      const publishedResults = await prisma.result.findMany({
        where: { studentId, published: true },
        include: { course: true },
      })

      await prisma.student.update({
        where: { id: studentId },
        data: { cgpa: calculateGPA(publishedResults) },
      })
    }),
  )

  return { imported, skipped }
}

export async function getStudentResults(studentId: string) {
  const results = await prisma.result.findMany({
    where: { studentId, published: true },
    include: { course: true },
    orderBy: [{ session: "desc" }, { semester: "asc" }, { course: { courseCode: "asc" } }],
  })

  return {
    results,
    gpa: calculateGPA(results),
  }
}

export async function publishResults(session?: string, semester?: string) {
  const where = {
    ...(session ? { session } : {}),
    ...(semester ? { semester } : {}),
  }

  const updated = await prisma.result.updateMany({
    where,
    data: { published: true },
  })

  const studentIds = await prisma.result.findMany({
    where,
    select: { studentId: true },
    distinct: ["studentId"],
  })

  await Promise.all(
    studentIds.map(async ({ studentId }) => {
      const results = await prisma.result.findMany({
        where: { studentId, published: true },
        include: { course: true },
      })

      await prisma.student.update({
        where: { id: studentId },
        data: { cgpa: calculateGPA(results) },
      })
    }),
  )

  return updated
}
