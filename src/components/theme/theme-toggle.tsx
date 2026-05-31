"use client"

import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Theme = "light" | "dark"

const themeStorageKey = "ohekuru-theme"

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark")
  document.documentElement.dataset.theme = theme
}

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark")
  const isDark = theme === "dark"

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light")
  }, [])

  function toggleTheme() {
    const nextTheme = isDark ? "light" : "dark"
    setTheme(nextTheme)
    applyTheme(nextTheme)
    try {
      window.localStorage.setItem(themeStorageKey, nextTheme)
    } catch {
      // The visual switch should still work if storage is unavailable.
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn("bg-card", className)}
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4" aria-hidden="true" />
      )}
      <span className="sr-only">{isDark ? "Light mode" : "Dark mode"}</span>
    </Button>
  )
}
