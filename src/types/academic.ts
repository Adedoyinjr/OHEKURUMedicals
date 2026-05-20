export type CourseResult = {
  courseCode: string
  title: string
  unit: number
  score: number
  grade: string
  gradePoint: number
  semester: string
}

export type StudentProfile = {
  matricNo: string
  fullName: string
  department: string
  faculty: string
  level: number
  gpa: number
  cgpa: number
}

export type StudentRecord = StudentProfile & {
  firstSemester: {
    paper1: number
    paper2: number
    paper3: number
    ca: number
    exam: number
    totalScore: number
    grade: string
    gradePoint: number
    gpa: number
  }
  secondSemesterStatus: "Awaiting"
}
