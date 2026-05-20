import { NextResponse } from "next/server"
import { requireRole } from "@/lib/session"
import { getStudentResults } from "@/services/result.service"

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(req: Request, context: RouteContext) {
  const authError = requireRole(req, ["admin", "student"])
  if (authError) return authError

  try {
    const { id } = await context.params
    const data = await getStudentResults(id)

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to fetch results.",
      },
      { status: 500 },
    )
  }
}
