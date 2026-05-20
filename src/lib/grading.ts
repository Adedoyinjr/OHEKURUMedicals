type Grade = {
  grade: "A" | "B" | "C" | "D" | "E" | "F"
  point: number
}

type ResultWithUnit = {
  gradePoint: number
  unit?: number
  course?: {
    unit: number
  }
}

export function calculateGrade(score: number): Grade {
  if (score >= 70) return { grade: "A", point: 5 }
  if (score >= 60) return { grade: "B", point: 4 }
  if (score >= 50) return { grade: "C", point: 3 }
  if (score >= 45) return { grade: "D", point: 2 }
  if (score >= 40) return { grade: "E", point: 1 }

  return { grade: "F", point: 0 }
}

export function calculateGPA(results: ResultWithUnit[]) {
  const totals = results.reduce(
    (accumulator, result) => {
      const unit = result.unit ?? result.course?.unit ?? 0

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

export function classifyPerformance(gpa: number) {
  if (gpa >= 4.5) return "Excellent"
  if (gpa >= 3.5) return "Strong"
  if (gpa >= 2.5) return "Steady"
  if (gpa >= 1.5) return "Needs support"

  return "At risk"
}
