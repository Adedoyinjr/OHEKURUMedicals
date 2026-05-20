import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import CredentialsProvider from "next-auth/providers/credentials"
import type { NextAuthOptions } from "next-auth"
import { prisma } from "@/lib/prisma"
import { normalizeMatricNo } from "@/lib/matric"

export type SessionRole = "student" | "admin"

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hashed: string) {
  return bcrypt.compare(password, hashed)
}

export function generateToken(payload: Record<string, unknown>) {
  return jwt.sign(payload, process.env.NEXTAUTH_SECRET ?? "development-secret", {
    expiresIn: "7d",
  })
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Portal Login",
      credentials: {
        identifier: { label: "Matric number or admin username", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        const password = credentials?.password ?? ""
        const role = (credentials?.role ?? "student") as SessionRole
        const identifier =
          role === "student"
            ? normalizeMatricNo(credentials?.identifier ?? "")
            : credentials?.identifier?.trim()

        if (!identifier) return null

        const account =
          role === "admin"
            ? await prisma.admin.findFirst({
                where: {
                  OR: [{ username: identifier }, { email: identifier }],
                },
              })
            : await prisma.student.findUnique({ where: { matricNo: identifier } })

        if (!account) return null

        const validPassword = await comparePassword(password, account.password)
        if (!validPassword) return null

        return {
          id: account.id,
          email: account.email,
          name: account.fullName,
          role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: SessionRole }).role
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? ""
        session.user.role = token.role as SessionRole
      }

      return session
    },
  },
  pages: {
    signIn: "/login",
  },
}
