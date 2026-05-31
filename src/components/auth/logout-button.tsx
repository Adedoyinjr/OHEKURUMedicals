"use client"

import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

type LogoutButtonProps = {
  role: "student" | "admin"
  className?: string
}

export function LogoutButton({ role, className }: LogoutButtonProps) {
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
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md border bg-card px-4 text-sm font-semibold hover:bg-muted",
        className,
      )}
    >
      Log out
    </button>
  )
}
