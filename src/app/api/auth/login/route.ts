import { NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { comparePassword, generateToken, type SessionRole } from "@/lib/auth"
import { classStudents } from "@/lib/demo-data"
import { isValidMatricNo, normalizeMatricNo } from "@/lib/matric"

const loginSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
  role: z.enum(["student", "admin"]).default("student"),
})

type LoginAccount = {
  id: string
  fullName: string
  email: string
  matricNo?: string
  role: SessionRole
}

const sessionCookieName = "portal_session"
const sessionMaxAge = 60 * 60 * 24 * 7
const adminCredential = "OHEKURUNMEDICALS"

function loginResponse(account: LoginAccount) {
  const token = generateToken({
    sub: account.id,
    email: account.email,
    role: account.role,
  })

  const response = NextResponse.json({
    success: true,
    token,
    user: {
      id: account.id,
      fullName: account.fullName,
      email: account.email,
      matricNo: account.matricNo,
      role: account.role,
    },
  })

  response.cookies.set(sessionCookieName, token, {
    httpOnly: true,
    maxAge: sessionMaxAge,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  })

  return response
}

function demoLogin(role: SessionRole, identifier: string, password: string) {
  if (role === "student" && isValidMatricNo(identifier) && password === identifier) {
    const student = classStudents.find((record) => record.matricNo === identifier)

    return loginResponse({
      id: `demo-${identifier.split("/").at(-1)}`,
      fullName: student?.fullName ?? "Registered Student",
      email: `${identifier.split("/").at(-1)}@ohekuru.local`,
      matricNo: identifier,
      role,
    })
  }

  if (
    role === "admin" &&
    identifier.toUpperCase() === adminCredential &&
    password === adminCredential
  ) {
    return loginResponse({
      id: "demo-admin",
      fullName: "Portal Administrator",
      email: "admin@ohekuru.edu",
      role,
    })
  }

  return NextResponse.json(
    { success: false, error: "Invalid login credentials." },
    { status: 401 },
  )
}

export async function POST(req: Request) {
  try {
    const credentials = loginSchema.parse(await req.json())
    const role = credentials.role as SessionRole
    const identifier =
      role === "student"
        ? normalizeMatricNo(credentials.identifier)
        : credentials.identifier.trim().includes("@")
          ? credentials.identifier.trim()
          : credentials.identifier.trim().toUpperCase()

    if (!process.env.DATABASE_URL) {
      return demoLogin(role, identifier, credentials.password)
    }

    const account =
      role === "admin"
        ? await prisma.admin.findFirst({
            where: {
              OR: [{ username: identifier }, { email: identifier }],
            },
          })
        : await prisma.student.findUnique({ where: { matricNo: identifier } })

    if (!account) {
      return NextResponse.json(
        { success: false, error: "Invalid login credentials." },
        { status: 401 },
      )
    }

    const validPassword = await comparePassword(credentials.password, account.password)

    if (!validPassword) {
      return NextResponse.json(
        { success: false, error: "Invalid login credentials." },
        { status: 401 },
      )
    }

    return loginResponse({
      id: account.id,
      fullName: account.fullName,
      email: account.email,
      matricNo: "matricNo" in account ? account.matricNo : undefined,
      role,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid login request." },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: "Unable to sign in right now. Please check the portal setup.",
      },
      { status: 400 },
    )
  }
}
