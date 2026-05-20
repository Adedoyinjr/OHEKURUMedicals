# OHEKURU AI Student Portal

AI-powered student management and academic analytics system for OHEKURU Health Educational Center, Rano.

## Stack

- Next.js 15, TypeScript, Tailwind CSS
- Next.js API routes, NextAuth, JWT
- PostgreSQL, Prisma ORM, Supabase-ready
- OpenAI API for academic feedback
- XLSX result uploads
- Chart.js dashboards

## Setup

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

Use `/login` for students and `/admin/login` for admins. The `/student` and
`/admin` dashboards are protected by signed JWT cookies and role checks.

The first demo student login is `UG25/OHEKURU/1001`. A new student's default
password is their matric number until they change it.

Demo admin login:

- Username: `OHEKURUNMEDICALS`
- Password: `OHEKURUNMEDICALS`

## Netlify

Connect the GitHub repository to Netlify and use the included `netlify.toml`.
Add these environment variables in Netlify before deploying:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `OPENAI_API_KEY`
