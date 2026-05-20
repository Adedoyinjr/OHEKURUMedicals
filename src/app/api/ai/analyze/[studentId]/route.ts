import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/session"
import { analyzeStudentPerformance } from "@/services/ai.service"

type RouteContext = {
  params: Promise<{ studentId: string }>
}

export async function POST(req: Request, context: RouteContext) {
  const authError = requireAdmin(req)
  if (authError) return authError

  try {
    const { studentId } = await context.params
    const report = await analyzeStudentPerformance(studentId)

    return NextResponse.json({ success: true, data: report })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to generate AI report.",
      },
      { status: 400 },
    )
  }
}
