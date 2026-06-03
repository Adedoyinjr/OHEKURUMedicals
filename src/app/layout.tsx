import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

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
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Script id="theme-init" strategy="beforeInteractive">
          {`(() => {
  try {
    const storedTheme = window.localStorage.getItem("ohekuru-theme")
    const theme = storedTheme === "light" || storedTheme === "dark" ? storedTheme : "dark"
    document.documentElement.classList.toggle("dark", theme === "dark")
    document.documentElement.dataset.theme = theme
  } catch {
    document.documentElement.classList.add("dark")
    document.documentElement.dataset.theme = "dark"
  }
})()`}
        </Script>
        {children}
      </body>
    </html>
  )
}
