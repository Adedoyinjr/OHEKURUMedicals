import { prisma } from "@/lib/prisma"
import { generateAIReport } from "@/lib/ai"
import { calculateGPA } from "@/lib/grading"

export async function analyzeStudentPerformance(studentId: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      results: {
        where: { published: true },
        include: { course: true },
      },
    },
  })

  if (!student) {
    throw new Error("Student not found")
  }

  const gpa = calculateGPA(student.results)
  const courses = student.results
    .map(
      (result) =>
        `${result.course.courseCode} - ${result.course.title}: ${result.score}% (${result.grade})`,
    )
    .join("\n")

  const prompt = `
You are an academic performance analyst.

Analyze this student's academic performance and generate:

1. Performance Summary
2. Strengths
3. Weaknesses
4. Motivational Feedback
5. Improvement Recommendations

Student Data:

Name: ${student.fullName}
Department: ${student.department}
GPA: ${gpa}
CGPA: ${student.cgpa}

Courses:
${courses || "No published course results yet."}

Rules:
- Keep response under 150 words
- Be encouraging
- Mention strong subjects
- Mention weak subjects professionally
- Avoid harsh language
- Sound academic and supportive
`.trim()

  const reportText = await generateAIReport(prompt)
  const [summary, ...recommendationParts] = reportText.split(/\n{2,}/)

  return prisma.aIReport.create({
    data: {
      studentId: student.id,
      summary: summary.trim(),
      recommendations: (recommendationParts.join("\n\n") || reportText).trim(),
    },
  })
}
