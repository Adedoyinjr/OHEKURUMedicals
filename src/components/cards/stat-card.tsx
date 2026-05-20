import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

type StatCardProps = {
  title: string
  value: string
  note: string
  icon: LucideIcon
  tone?: "primary" | "secondary" | "accent" | "danger"
}

const tones = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/20 text-secondary-foreground",
  accent: "bg-accent/10 text-accent",
  danger: "bg-destructive/10 text-destructive",
}

export function StatCard({
  title,
  value,
  note,
  icon: Icon,
  tone = "primary",
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex min-h-36 items-start justify-between gap-4 p-5">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-normal">{value}</p>
          <p className="mt-2 text-sm text-muted-foreground">{note}</p>
        </div>
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg ${tones[tone]}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </CardContent>
    </Card>
  )
}
