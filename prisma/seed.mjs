import bcrypt from "bcryptjs"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

function calculateGrade(score) {
  if (score >= 70) return { grade: "A", point: 5 }
  if (score >= 60) return { grade: "B", point: 4 }
  if (score >= 50) return { grade: "C", point: 3 }
  if (score >= 45) return { grade: "D", point: 2 }
  if (score >= 40) return { grade: "E", point: 1 }

  return { grade: "F", point: 0 }
}

function calculateGPA(results) {
  const totals = results.reduce(
    (accumulator, result) => {
      const unit = result.course?.unit ?? 0

      return {
        units: accumulator.units + unit,
        points: accumulator.points + result.gradePoint * unit,
      }
    },
    { units: 0, points: 0 },
  )

  if (totals.units === 0) return 0

  return Number((totals.points / totals.units).toFixed(2))
}

async function main() {
  const matricNo = "UG25/OHEKURU/1001"
  const adminCredential = "OHEKURUNMEDICALS"
  const studentPassword = await bcrypt.hash(matricNo, 10)
  const adminPassword = await bcrypt.hash(adminCredential, 10)

  const student = await prisma.student.upsert({
    where: { matricNo },
    update: {
      fullName: "Salamatu Bako",
      department: "Health Education",
      faculty: "Health Sciences",
      level: 200,
      cgpa: 3,
      password: studentPassword,
    },
    create: {
      matricNo,
      fullName: "Salamatu Bako",
      email: "salamatu.bako@example.com",
      department: "Health Education",
      faculty: "Health Sciences",
      level: 200,
      cgpa: 3,
      password: studentPassword,
    },
  })

  await prisma.admin.upsert({
    where: { email: "admin@ohekuru.edu" },
    update: {
      username: adminCredential,
      password: adminPassword,
    },
    create: {
      fullName: "Portal Administrator",
      username: adminCredential,
      email: "admin@ohekuru.edu",
      password: adminPassword,
    },
  })

  const courses = [
    { courseCode: "PAPER1", title: "First Semester Paper 1", unit: 0, semester: "First" },
    { courseCode: "PAPER2", title: "First Semester Paper 2", unit: 0, semester: "First" },
    { courseCode: "PAPER3", title: "First Semester Paper 3", unit: 0, semester: "First" },
    { courseCode: "CA", title: "Continuous Assessment", unit: 0, semester: "First" },
    { courseCode: "EXAM", title: "First Semester Examination", unit: 0, semester: "First" },
    { courseCode: "TOTAL", title: "First Semester Total Score", unit: 1, semester: "First" },
  ]

  const createdCourses = await Promise.all(
    courses.map((course) =>
      prisma.course.upsert({
        where: { courseCode: course.courseCode },
        update: course,
        create: course,
      }),
    ),
  )

  const scores = [13, 10, 12, 14, 35, 84]

  await Promise.all(
    createdCourses.map((course, index) => {
      const grade =
        course.courseCode === "TOTAL" ? { grade: "C", point: 3 } : calculateGrade(scores[index])

      return prisma.result.upsert({
        where: {
          studentId_courseId_session_semester: {
            studentId: student.id,
            courseId: course.id,
            session: "2025/2026",
            semester: "First",
          },
        },
        update: {
          score: scores[index],
          grade: grade.grade,
          gradePoint: grade.point,
          published: true,
        },
        create: {
          studentId: student.id,
          courseId: course.id,
          score: scores[index],
          grade: grade.grade,
          gradePoint: grade.point,
          session: "2025/2026",
          semester: "First",
          published: true,
        },
      })
    }),
  )

  const results = await prisma.result.findMany({
    where: { studentId: student.id, published: true },
    include: { course: true },
  })

  await prisma.student.update({
    where: { id: student.id },
    data: { cgpa: calculateGPA(results) },
  })
}

main()
  .finally(async () => {
    await prisma.$disconnect()
  })
