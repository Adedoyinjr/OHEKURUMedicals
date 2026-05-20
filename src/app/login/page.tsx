import { LoginForm } from "@/components/forms/login-form"
import { schoolName } from "@/lib/demo-data"

export default function LoginPage() {
  return (
    <main className="portal-grid grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-5xl">
        <div className="mb-8 max-w-2xl">
          <p className="text-xl font-black uppercase text-primary md:text-2xl">
            {schoolName}
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-normal text-foreground md:text-4xl">
            Student Results and Academic Intelligence
          </h1>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
