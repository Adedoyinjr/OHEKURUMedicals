import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import {
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  LayoutDashboard,
  Settings,
  Upload,
  Users,
} from "lucide-react"
import { LogoutButton } from "@/components/auth/logout-button"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { cn } from "@/lib/utils"
import { schoolName } from "@/lib/demo-data"

type NavItem = {
  href: string
  label: string
  icon: LucideIcon
}

const adminNav: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/upload", label: "Upload Results", icon: Upload },
  { href: "/admin#students", label: "Students", icon: Users },
  { href: "/admin#courses", label: "Courses", icon: BookOpenCheck },
  { href: "/admin#analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin#ai-reports", label: "AI Reports", icon: BrainCircuit },
  { href: "/admin#settings", label: "Settings", icon: Settings },
]

const studentNav: NavItem[] = [
  { href: "/student", label: "Dashboard", icon: LayoutDashboard },
  { href: "/student#results", label: "Results", icon: BookOpenCheck },
  { href: "/student#analytics", label: "Analytics", icon: BarChart3 },
  { href: "/student#ai-feedback", label: "AI Feedback", icon: BrainCircuit },
]

type PortalShellProps = {
  role: "student" | "admin"
  title: string
  subtitle: string
  children: React.ReactNode
}

export function PortalShell({ role, title, subtitle, children }: PortalShellProps) {
  const navItems = role === "admin" ? adminNav : studentNav

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r bg-card lg:block">
        <div className="flex h-full flex-col">
          <Link href="/" className="flex items-center gap-3 border-b px-5 py-5">
            <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary text-base font-black text-primary-foreground">
              OH
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold leading-tight">{schoolName}</span>
              <span className="text-xs font-medium text-muted-foreground">
                AI Academic Portal
              </span>
            </span>
          </Link>

          <nav className="space-y-1 px-3 py-5">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  index === 0 && "bg-primary/10 text-primary",
                )}
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <div className="min-w-0 lg:pl-72">
        <header className="sticky top-0 z-10 border-b bg-background/95 px-3 py-3 backdrop-blur sm:px-4 md:px-8">
          <div className="mb-3 flex items-center gap-3 lg:hidden">
            <Link
              href="/"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary text-sm font-black text-primary-foreground"
            >
              OH
            </Link>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold leading-tight">{schoolName}</p>
              <p className="text-xs font-medium text-muted-foreground">AI Academic Portal</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase text-primary">{role} portal</p>
              <h1 className="text-xl font-bold tracking-normal sm:text-2xl md:text-3xl">
                {title}
              </h1>
              <p className="mt-1 max-w-3xl text-xs text-muted-foreground sm:text-sm">
                {subtitle}
              </p>
            </div>
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <ThemeToggle className="shrink-0" />
              <LogoutButton role={role} className="flex-1 sm:flex-none" />
            </div>
          </div>

          <nav className="-mx-3 mt-3 flex gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "inline-flex h-10 shrink-0 items-center gap-2 rounded-md border bg-card px-3 text-xs font-semibold text-muted-foreground",
                  index === 0 && "border-primary/30 bg-primary/10 text-primary",
                )}
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="px-3 py-4 sm:px-4 md:px-8 md:py-6">{children}</main>
      </div>
    </div>
  )
}
