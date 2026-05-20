"use client"

import { useRouter } from "next/navigation"

type LogoutButtonProps = {
  role: "student" | "admin"
}

export function LogoutButton({ role }: LogoutButtonProps) {
  const router = useRouter()

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => null)
    window.localStorage.removeItem("portalToken")
    window.localStorage.removeItem("portalUser")
    router.push(role === "admin" ? "/admin/login" : "/login")
    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="inline-flex h-10 items-center justify-center rounded-md border bg-card px-4 text-sm font-semibold hover:bg-muted"
    >
      Log out
    </button>
  )
}
