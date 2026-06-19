import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { CourseResult } from "@/types/academic"

type ResultsTableProps = {
  results: CourseResult[]
}

function gradeTone(grade: string) {
  if (grade === "A") return "default"
  if (grade === "B") return "accent"
  if (grade === "F") return "danger"
  if (!grade) return "outline"

  return "secondary"
}

export function ResultsTable({ results }: ResultsTableProps) {
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:hidden">
        {results.map((result) => (
          <article key={result.courseCode} className="rounded-lg border bg-card p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">{result.courseCode}</p>
              <Badge variant={gradeTone(result.grade)}>{result.grade || "Recorded"}</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{result.title}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-md border px-2 py-1.5">
                <p className="text-[11px] font-semibold uppercase text-muted-foreground">Score</p>
                <p className="mt-0.5 font-semibold">{result.score}</p>
              </div>
              <div className="rounded-md border px-2 py-1.5">
                <p className="text-[11px] font-semibold uppercase text-muted-foreground">Point</p>
                <p className="mt-0.5 font-semibold">{result.gradePoint || "-"}</p>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Assessment</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Point</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((result) => (
              <TableRow key={result.courseCode}>
                <TableCell className="font-semibold">{result.courseCode}</TableCell>
                <TableCell className="text-muted-foreground">{result.title}</TableCell>
                <TableCell>{result.score}</TableCell>
                <TableCell>
                  <Badge variant={gradeTone(result.grade)}>{result.grade || "Recorded"}</Badge>
                </TableCell>
                <TableCell>{result.gradePoint || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
