import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"
import type { SessionRole } from "@/lib/auth"

type PortalSession = {
  sub: string
  email?: string
  role: SessionRole
}

const sessionCookieName = "portal_session"

function getCookie(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return null

  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))

  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : null
}

function getToken(req: Request) {
  const bearerToken = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
  return bearerToken || getCookie(req.headers.get("cookie"), sessionCookieName)
}

export function getPortalSession(req: Request): PortalSession | null {
  const token = getToken(req)
  if (!token) return null

  try {
    const payload = jwt.verify(
      token,
      process.env.NEXTAUTH_SECRET ?? "development-secret",
    )

    if (typeof payload === "string") return null
    if (payload.role !== "admin" && payload.role !== "student") return null
    if (typeof payload.sub !== "string") return null

    return {
      sub: payload.sub,
      email: typeof payload.email === "string" ? payload.email : undefined,
      role: payload.role,
    }
  } catch {
    return null
  }
}

export function requireRole(req: Request, allowedRoles: SessionRole[]) {
  const session = getPortalSession(req)

  if (!session || !allowedRoles.includes(session.role)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized portal access." },
      { status: 401 },
    )
  }

  return null
}

export function requireAdmin(req: Request) {
  return requireRole(req, ["admin"])
}
