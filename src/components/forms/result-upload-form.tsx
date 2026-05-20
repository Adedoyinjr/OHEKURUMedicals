"use client"

import { useRef, useState } from "react"
import { CheckCircle2, Loader2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type UploadState = {
  type: "idle" | "success" | "error"
  message: string
}

export function ResultUploadForm() {
  const formRef = useRef<HTMLFormElement>(null)
  const [loading, setLoading] = useState(false)
  const [state, setState] = useState<UploadState>({
    type: "idle",
    message: "",
  })

  async function uploadResults(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setState({ type: "idle", message: "" })

    const formData = new FormData(event.currentTarget)
    const response = await fetch("/api/results/upload", {
      method: "POST",
      body: formData,
    })

    const payload = await response.json()
    setLoading(false)

    if (!response.ok || !payload.success) {
      setState({ type: "error", message: payload.error ?? "Upload failed." })
      return
    }

    formRef.current?.reset()
    setState({
      type: "success",
      message: `${payload.imported} result rows imported. ${payload.skipped.length} skipped.`,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Results</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} className="grid gap-4 lg:grid-cols-4" onSubmit={uploadResults}>
          <div className="space-y-2 lg:col-span-2">
            <Label htmlFor="file">Excel file</Label>
            <Input id="file" name="file" type="file" accept=".xlsx,.xls,.csv" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="session">Session</Label>
            <Input id="session" name="session" defaultValue="2025/2026" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="semester">Semester</Label>
            <select
              id="semester"
              name="semester"
              className="flex h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              defaultValue="First"
            >
              <option>First</option>
              <option>Second</option>
            </select>
          </div>

          <label className="flex h-10 items-center gap-3 rounded-md border bg-background px-3 text-sm font-medium lg:col-span-2">
            <input name="publish" type="checkbox" value="true" className="h-4 w-4" />
            Publish after import
          </label>

          <div className="lg:col-span-2 lg:flex lg:justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Upload className="h-4 w-4" aria-hidden="true" />
              )}
              Import spreadsheet
            </Button>
          </div>

          {state.message ? (
            <p
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium lg:col-span-4 ${
                state.type === "success"
                  ? "border border-primary/20 bg-primary/10 text-primary"
                  : "border border-destructive/20 bg-destructive/10 text-destructive"
              }`}
            >
              {state.type === "success" ? (
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
              ) : null}
              {state.message}
            </p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  )
}
