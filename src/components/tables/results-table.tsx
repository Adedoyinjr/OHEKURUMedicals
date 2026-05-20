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
            <TableCell className="min-w-56 text-muted-foreground">{result.title}</TableCell>
            <TableCell>{result.score}</TableCell>
            <TableCell>
              <Badge variant={gradeTone(result.grade)}>{result.grade || "Recorded"}</Badge>
            </TableCell>
            <TableCell>{result.gradePoint || "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
