import { NextResponse } from "next/server"
import { z } from "zod"
import { requireAdmin } from "@/lib/session"
import { createStudent } from "@/services/student.service"
import { matricNumberPattern } from "@/lib/matric"

const createStudentSchema = z.object({
  matricNo: z
    .string()
    .regex(matricNumberPattern, "Use the matric format UG25/OHEKURU/1001."),
  fullName: z.string().min(2),
  email: z.string().email(),
  department: z.string().min(2),
  faculty: z.string().min(2),
  level: z.coerce.number().int().positive(),
  password: z.string().min(8).optional(),
})

export async function POST(req: Request) {
  const authError = requireAdmin(req)
  if (authError) return authError

  try {
    const input = createStudentSchema.parse(await req.json())
    const student = await createStudent(input)

    return NextResponse.json({ success: true, data: student }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to create student.",
      },
      { status: 400 },
    )
  }
}
