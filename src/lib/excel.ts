import * as XLSX from "xlsx"
import { normalizeMatricNo } from "@/lib/matric"

export type RawResultRow = {
  matricNo: string
  courseCode: string
  score: number
}

const matricKeys = ["MATRIC NO", "MATRICNO", "MATRIC_NO", "MATRIC", "matricNo"]
const courseKeys = ["COURSE CODE", "COURSECODE", "COURSE_CODE", "COURSE", "courseCode"]
const scoreKeys = ["SCORE", "score", "Score"]

function findValue(row: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    if (row[key] !== undefined) return row[key]
  }

  return undefined
}

export async function parseExcel(file: File): Promise<RawResultRow[]> {
  const data = await file.arrayBuffer()
  const workbook = XLSX.read(data)
  const worksheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet)

  return rows.map((row) => ({
    matricNo: normalizeMatricNo(String(findValue(row, matricKeys) ?? "")),
    courseCode: String(findValue(row, courseKeys) ?? "").trim().toUpperCase(),
    score: Number(findValue(row, scoreKeys) ?? 0),
  }))
}
