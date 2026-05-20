import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "OHEKURU AI Student Portal",
  description: "Academic results, GPA analytics, and AI performance feedback.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
