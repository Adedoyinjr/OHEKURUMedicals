import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/session"
import { getStudents } from "@/services/student.service"

export async function GET(req: Request) {
  const authError = requireAdmin(req)
  if (authError) return authError

  try {
    const students = await getStudents()

    return NextResponse.json({ success: true, data: students })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to fetch students.",
      },
      { status: 500 },
    )
  }
}
