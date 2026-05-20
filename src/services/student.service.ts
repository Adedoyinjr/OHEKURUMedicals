import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/auth"
import { normalizeMatricNo } from "@/lib/matric"

export type CreateStudentInput = {
  matricNo: string
  fullName: string
  email: string
  department: string
  faculty: string
  level: number
  password?: string
}

export async function createStudent(input: CreateStudentInput) {
  const matricNo = normalizeMatricNo(input.matricNo)

  return prisma.student.create({
    data: {
      ...input,
      matricNo,
      password: await hashPassword(input.password ?? matricNo),
    },
    select: {
      id: true,
      matricNo: true,
      fullName: true,
      email: true,
      department: true,
      faculty: true,
      level: true,
      cgpa: true,
      createdAt: true,
    },
  })
}

export async function getStudents() {
  return prisma.student.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      matricNo: true,
      fullName: true,
      email: true,
      department: true,
      faculty: true,
      level: true,
      cgpa: true,
      createdAt: true,
    },
  })
}

export async function getStudentById(id: string) {
  return prisma.student.findUnique({
    where: { id },
    include: {
      results: {
        include: { course: true },
        orderBy: [{ session: "desc" }, { semester: "asc" }],
      },
      aiReports: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  })
}

export async function updateStudent(
  id: string,
  input: Partial<Omit<CreateStudentInput, "password">> & { password?: string },
) {
  const matricNo = input.matricNo ? normalizeMatricNo(input.matricNo) : undefined

  return prisma.student.update({
    where: { id },
    data: {
      ...input,
      matricNo,
      password: input.password ? await hashPassword(input.password) : undefined,
    },
    select: {
      id: true,
      matricNo: true,
      fullName: true,
      email: true,
      department: true,
      faculty: true,
      level: true,
      cgpa: true,
    },
  })
}

export async function deleteStudent(id: string) {
  return prisma.student.delete({
    where: { id },
    select: { id: true },
  })
}
