import { jwtVerify } from "jose/jwt/verify"
import { NextResponse, type NextRequest } from "next/server"
import type { SessionRole } from "@/lib/auth"

const sessionCookieName = "portal_session"

function getSecret() {
  return new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? "development-secret")
}

async function getSessionRole(token?: string): Promise<SessionRole | null> {
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, getSecret())
    const role = payload.role

    return role === "admin" || role === "student" ? role : null
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const role = await getSessionRole(request.cookies.get(sessionCookieName)?.value)

  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (role !== "admin") {
      const loginUrl = new URL("/admin/login", request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  if (pathname.startsWith("/student")) {
    if (role !== "student") {
      const loginUrl = new URL("/login", request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/student/:path*"],
}
