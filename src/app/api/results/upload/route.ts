import { NextResponse } from "next/server"
import { parseExcel } from "@/lib/excel"
import { requireAdmin } from "@/lib/session"
import { uploadResultRows } from "@/services/result.service"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const authError = requireAdmin(req)
  if (authError) return authError

  try {
    const formData = await req.formData()
    const file = formData.get("file")
    const session = String(formData.get("session") ?? "2025/2026")
    const semester = String(formData.get("semester") ?? "First")
    const publish = String(formData.get("publish") ?? "false") === "true"

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "Excel file is required." },
        { status: 400 },
      )
    }

    const rows = await parseExcel(file)
    const result = await uploadResultRows(rows, { session, semester, publish })

    return NextResponse.json({
      success: true,
      imported: result.imported.length,
      skipped: result.skipped,
    })
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to upload results.",
      },
      { status: 400 },
    )
  }
}
