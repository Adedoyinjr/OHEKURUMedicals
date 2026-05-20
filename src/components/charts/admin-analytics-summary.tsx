import type { CourseResult } from "@/types/academic"

type AdminAnalyticsSummaryProps = {
  gpaTrend: { label: string; gpa: number }[]
  results: CourseResult[]
}

function percent(value: number, maximum: number) {
  if (maximum <= 0) return 0

  return Math.min(100, Math.max(0, (value / maximum) * 100))
}

export function AdminAnalyticsSummary({ gpaTrend, results }: AdminAnalyticsSummaryProps) {
  const gradedResults = results.filter((result) => result.grade)
  const passCount = gradedResults.filter((result) => result.grade !== "F").length
  const failCount = gradedResults.length - passCount
  const totalCount = Math.max(gradedResults.length, 1)
  const passPercent = Math.round((passCount / totalCount) * 100)

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <div className="rounded-lg border bg-card p-5">
        <h2 className="text-base font-semibold">GPA Trend</h2>
        <div className="mt-6 flex h-56 items-end gap-3">
          {gpaTrend.map((point) => (
            <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-40 w-full items-end rounded-md bg-muted">
                <span
                  className="block w-full rounded-md bg-primary"
                  style={{ height: `${percent(point.gpa, 5)}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                {point.label}
              </span>
              <span className="text-sm font-bold">{point.gpa.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border bg-card p-5">
        <h2 className="text-base font-semibold">Semester Performance</h2>
        <div className="mt-6 space-y-4">
          {results.slice(0, 6).map((result) => (
            <div key={result.courseCode} className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold">{result.courseCode}</span>
                <span className="text-muted-foreground">{result.score}</span>
              </div>
              <div className="h-3 rounded-full bg-muted">
                <span
                  className="block h-3 rounded-full bg-accent"
                  style={{ width: `${percent(result.score, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border bg-card p-5">
        <h2 className="text-base font-semibold">Pass/Fail Ratio</h2>
        <div className="mt-6 grid place-items-center gap-5">
          <div
            className="grid h-40 w-40 place-items-center rounded-full"
            style={{
              background: `conic-gradient(hsl(var(--primary)) ${passPercent}%, hsl(var(--destructive)) 0)`,
            }}
          >
            <div className="grid h-28 w-28 place-items-center rounded-full bg-card">
              <span className="text-3xl font-black">{passPercent}%</span>
            </div>
          </div>
          <div className="grid w-full grid-cols-2 gap-3 text-sm">
            <div className="rounded-md border p-3">
              <p className="text-muted-foreground">Passed</p>
              <p className="text-2xl font-bold">{passCount}</p>
            </div>
            <div className="rounded-md border p-3">
              <p className="text-muted-foreground">Failed</p>
              <p className="text-2xl font-bold">{failCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
