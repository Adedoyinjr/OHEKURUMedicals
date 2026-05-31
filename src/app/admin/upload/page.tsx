import { ResultUploadForm } from "@/components/forms/result-upload-form"
import { PortalShell } from "@/components/layout/portal-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function UploadResultsPage() {
  return (
    <PortalShell
      role="admin"
      title="Result Upload"
      subtitle="Excel columns: MATRIC NO, COURSE CODE, SCORE."
    >
      <div className="space-y-4 sm:space-y-6">
        <ResultUploadForm />

        <Card>
          <CardHeader>
            <CardTitle>Spreadsheet Format</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead className="border-b text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">MATRIC NO</th>
                    <th className="px-4 py-3">COURSE CODE</th>
                    <th className="px-4 py-3">SCORE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-semibold">UG25/OHEKURU/1001</td>
                    <td className="px-4 py-3">CHT201</td>
                    <td className="px-4 py-3">78</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold">UG25/OHEKURU/1002</td>
                    <td className="px-4 py-3">ANA203</td>
                    <td className="px-4 py-3">66</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PortalShell>
  )
}
