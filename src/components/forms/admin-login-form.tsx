"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, LogIn, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function AdminLoginForm() {
  const router = useRouter()
  const [username, setUsername] = useState("")
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
        identifier: username.trim(),
        password,
        role: "admin",
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
    router.push("/admin")
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="mb-3 grid h-12 w-12 place-items-center rounded-lg bg-accent/10 text-accent">
          <ShieldCheck className="h-6 w-6" aria-hidden="true" />
        </div>
        <CardTitle className="text-2xl">Admin Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={submitLogin}>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminPassword">Password</Label>
            <Input
              id="adminPassword"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
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
