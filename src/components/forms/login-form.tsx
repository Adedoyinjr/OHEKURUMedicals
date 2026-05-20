"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { BrainCircuit, Loader2, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { normalizeMatricNo } from "@/lib/matric"

export function LoginForm() {
  const router = useRouter()
  const [matricNo, setMatricNo] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function submitLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError("")

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: normalizeMatricNo(matricNo),
        password,
        role: "student",
      }),
    })

    const payload = await response.json()
    setLoading(false)

    if (!response.ok || !payload.success) {
      setError(payload.error ?? "Login failed.")
      return
    }

    window.localStorage.setItem("portalToken", payload.token)
    window.localStorage.setItem("portalUser", JSON.stringify(payload.user))
    router.push("/student")
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="mb-3 grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary">
          <BrainCircuit className="h-6 w-6" aria-hidden="true" />
        </div>
        <CardTitle className="text-2xl">Student Portal</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={submitLogin}>
          <div className="space-y-2">
            <Label htmlFor="matricNo">Matric number</Label>
            <Input
              id="matricNo"
              value={matricNo}
              onChange={(event) => setMatricNo(normalizeMatricNo(event.target.value))}
              autoComplete="username"
              placeholder="UG25/OHEKURU/1001"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="Default password is your matric number"
              required
            />
          </div>

          {error ? (
            <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
              {error}
            </p>
          ) : null}

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <LogIn className="h-4 w-4" aria-hidden="true" />
            )}
            Sign in
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
