import { LoginForm } from "@/components/forms/login-form"
import { ThemeToggle } from "@/components/theme/theme-toggle"
import { schoolName } from "@/lib/demo-data"

export default function LoginPage() {
  return (
    <main className="portal-grid relative grid min-h-screen place-items-center px-3 py-6 sm:px-4 sm:py-10">
      <ThemeToggle className="absolute right-4 top-4 sm:right-6 sm:top-6" />
      <div className="w-full max-w-5xl">
        <div className="mb-5 max-w-2xl pr-14 sm:mb-8 sm:pr-0">
          <p className="text-lg font-black uppercase text-primary sm:text-xl md:text-2xl">
            {schoolName}
          </p>
          <h1 className="mt-2 text-2xl font-black tracking-normal text-foreground sm:mt-3 sm:text-3xl md:text-4xl">
            Student Results and Academic Intelligence
          </h1>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
