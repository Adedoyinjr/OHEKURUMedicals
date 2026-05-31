"use client"

import { useEffect, useState } from "react"
import { Camera, FileCheck2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { StudentRecord } from "@/types/academic"

type StudentBioDataFormProps = {
  student: StudentRecord
}

type OLevelDocument = {
  name: string
  size: number
  type: string
}

type StudentBioData = {
  fullName: string
  matricNo: string
  dateOfBirth: string
  gender: string
  phone: string
  guardian: string
  address: string
  oLevelExamType: string
  oLevelExamYear: string
  oLevelDocument: OLevelDocument | null
}

type StudentBioDataField = Exclude<keyof StudentBioData, "oLevelDocument">

const maxOLevelDocumentSize = 500 * 1024

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

function storageKey(matricNo: string) {
  return `portalBioData:${matricNo}`
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function defaultBioData(student: StudentRecord): StudentBioData {
  return {
    fullName: student.fullName,
    matricNo: student.matricNo,
    dateOfBirth: "",
    gender: "",
    phone: "",
    guardian: "",
    address: "",
    oLevelExamType: "",
    oLevelExamYear: "",
    oLevelDocument: null,
  }
}

export function StudentBioDataForm({ student }: StudentBioDataFormProps) {
  const [photo, setPhoto] = useState("")
  const [bioData, setBioData] = useState<StudentBioData>(() => defaultBioData(student))
  const [oLevelError, setOLevelError] = useState("")
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const savedBioData = window.localStorage.getItem(storageKey(student.matricNo))

    if (!savedBioData) {
      setBioData(defaultBioData(student))
      return
    }

    try {
      setBioData({
        ...defaultBioData(student),
        ...JSON.parse(savedBioData),
        matricNo: student.matricNo,
      })
    } catch {
      setBioData(defaultBioData(student))
    }
  }, [student])

  function updatePhoto(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      setPhoto(String(reader.result))
      setSaved(false)
    }
    reader.readAsDataURL(file)
  }

  function updateBioData(field: StudentBioDataField, value: string) {
    setBioData((current) => ({ ...current, [field]: value }))
    setSaved(false)
  }

  function updateOLevelDocument(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) return

    if (file.size > maxOLevelDocumentSize) {
      setOLevelError("O-level document must be 500 KB or less.")
      event.target.value = ""
      setSaved(false)
      return
    }

    setOLevelError("")
    setBioData((current) => ({
      ...current,
      oLevelDocument: {
        name: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
      },
    }))
    setSaved(false)
  }

  function saveBioData(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (oLevelError) return

    window.localStorage.setItem(
      storageKey(student.matricNo),
      JSON.stringify({
        ...bioData,
        updatedAt: new Date().toISOString(),
      }),
    )
    setSaved(true)
  }

  return (
    <section className="grid gap-3 sm:gap-4 xl:grid-cols-[0.75fr_1.25fr]">
      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-lg border bg-primary/10 text-xl font-black text-primary sm:h-24 sm:w-24 sm:text-2xl">
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={photo}
                  alt={`${student.fullName} profile`}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials(student.fullName)
              )}
            </div>
            <div className="min-w-0">
              <p className="font-semibold leading-tight">{student.fullName}</p>
              <p className="break-words text-sm text-muted-foreground">{student.matricNo}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profilePhoto">Upload photo</Label>
            <Input
              id="profilePhoto"
              type="file"
              accept="image/*"
              onChange={updatePhoto}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bio-data Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-3 sm:gap-4 md:grid-cols-2" onSubmit={saveBioData}>
            <div className="space-y-2">
              <Label htmlFor="studentName">Full name</Label>
              <Input
                id="studentName"
                value={bioData.fullName}
                onChange={(event) => updateBioData("fullName", event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentMatric">Matric number</Label>
              <Input id="studentMatric" value={bioData.matricNo} readOnly />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={bioData.dateOfBirth}
                onChange={(event) => updateBioData("dateOfBirth", event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <select
                id="gender"
                className="flex h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={bioData.gender}
                onChange={(event) => updateBioData("gender", event.target.value)}
              >
                <option value="" disabled>
                  Select gender
                </option>
                <option>Female</option>
                <option>Male</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <Input
                id="phone"
                placeholder="080..."
                value={bioData.phone}
                onChange={(event) => updateBioData("phone", event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guardian">Guardian name</Label>
              <Input
                id="guardian"
                value={bioData.guardian}
                onChange={(event) => updateBioData("guardian", event.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Home address</Label>
              <Input
                id="address"
                value={bioData.address}
                onChange={(event) => updateBioData("address", event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="oLevelExamType">O-level exam type</Label>
              <select
                id="oLevelExamType"
                className="flex h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                value={bioData.oLevelExamType}
                onChange={(event) => updateBioData("oLevelExamType", event.target.value)}
              >
                <option value="" disabled>
                  Select exam type
                </option>
                <option>WAEC</option>
                <option>NECO</option>
                <option>NABTEB</option>
                <option>Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="oLevelExamYear">O-level exam year</Label>
              <Input
                id="oLevelExamYear"
                inputMode="numeric"
                placeholder="2024"
                value={bioData.oLevelExamYear}
                onChange={(event) => updateBioData("oLevelExamYear", event.target.value)}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="oLevelDocument">O-level result document</Label>
              <Input
                id="oLevelDocument"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={updateOLevelDocument}
              />
              <p className="text-xs font-medium text-muted-foreground">
                PDF, JPG, or PNG. Maximum size: 500 KB.
              </p>
              {bioData.oLevelDocument ? (
                <p className="flex items-start gap-2 rounded-md border bg-primary/5 px-3 py-2 text-sm font-medium text-primary sm:items-center">
                  <FileCheck2 className="h-4 w-4" aria-hidden="true" />
                  {bioData.oLevelDocument.name} ({formatFileSize(bioData.oLevelDocument.size)})
                </p>
              ) : null}
              {oLevelError ? (
                <p className="rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm font-medium text-destructive">
                  {oLevelError}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between md:col-span-2">
              <p className="text-sm text-muted-foreground">
                {saved ? "Bio-data saved on this device." : "Complete and save your details."}
              </p>
              <Button type="submit" className="w-full sm:w-auto">
                {saved ? (
                  <Save className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Camera className="h-4 w-4" aria-hidden="true" />
                )}
                Save bio-data
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}
