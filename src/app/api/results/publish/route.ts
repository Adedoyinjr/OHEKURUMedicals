import { NextResponse } from "next/server"
import { z } from "zod"
import { requireAdmin } from "@/lib/session"
import { publishResults } from "@/services/result.service"

const publishSchema = z.object({
  session: z.string().optional(),
  semester: z.string().optional(),
})

export async function POST(req: Request) {
  const authError = requireAdmin(req)
  if (authError) return authError

  try {
    const input = publishSchema.parse(await req.json().catch(() => ({})))
    const result = await publishResults(input.session, input.semester)

    return NextResponse.json({ success: true, published: result.count })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to publish results.",
      },
      { status: 400 },
    )
  }
}
