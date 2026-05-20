import { NextResponse } from "next/server"
import { z } from "zod"
import { requireAdmin } from "@/lib/session"
import {
  deleteStudent,
  getStudentById,
  updateStudent,
} from "@/services/student.service"
import { matricNumberPattern } from "@/lib/matric"

const updateStudentSchema = z.object({
  matricNo: z
    .string()
    .regex(matricNumberPattern, "Use the matric format UG25/OHEKURU/1001.")
    .optional(),
  fullName: z.string().min(2).optional(),
  email: z.string().email().optional(),
  department: z.string().min(2).optional(),
  faculty: z.string().min(2).optional(),
  level: z.coerce.number().int().positive().optional(),
  password: z.string().min(8).optional(),
})

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(_req: Request, context: RouteContext) {
  const authError = requireAdmin(_req)
  if (authError) return authError

  try {
    const { id } = await context.params
    const student = await getStudentById(id)

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Student not found." },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, data: student })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to fetch student.",
      },
      { status: 500 },
    )
  }
}

export async function PUT(req: Request, context: RouteContext) {
  const authError = requireAdmin(req)
  if (authError) return authError

  try {
    const { id } = await context.params
    const input = updateStudentSchema.parse(await req.json())
    const student = await updateStudent(id, input)

    return NextResponse.json({ success: true, data: student })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to update student.",
      },
      { status: 400 },
    )
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  const authError = requireAdmin(_req)
  if (authError) return authError

  try {
    const { id } = await context.params
    await deleteStudent(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to delete student.",
      },
      { status: 400 },
    )
  }
}
