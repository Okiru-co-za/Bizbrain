# BizBrain (MVP scaffold)

BizBrain is an AI-powered CRM and operations assistant scaffold targeting South African small businesses.

This repo contains the initial project scaffolding, Prisma schema, and a seed script with realistic South African sample data.

Getting started

1. Install dependencies:

```bash
cd bizbrain
npm install
```

2. Create `.env` from `.env.example` and set `DATABASE_URL`.

3. Generate Prisma client and run migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

4. Seed the database (requires `ts-node`):

```bash
npm run seed
```

Notes

- The AI layer is provider-agnostic and supports a dev fallback mode when `AI_API_KEY` is not set.
- Billing is represented as an abstract `Subscription` model; integrate a gateway like PayFast for production.
- All tenant-scoped tables include a `tenantId` field for isolation.

Next steps

- Scaffold Next.js app pages, authentication, and RBAC middleware.
- Implement Assistant UI and AI service adapters.
- Prepare deployment to Railway and CI configuration.
