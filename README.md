# molave.ai — ai-interview-v2

Monorepo for the molave.ai platform. Web (Next.js 16) and API (NestJS 10) live in the same repo, with a shared types package between them.

## Stack

- **Monorepo**: pnpm workspaces + Turborepo
- **Web** (`apps/web`): Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + shadcn/ui + TanStack Query + next-intl + NextAuth
- **API** (`apps/api`): NestJS 10 + TypeScript (AWS Lambda ready)
- **Shared** (`packages/shared`): TypeScript types + Zod schemas

## Structure

```
ai-interview-v2/
├── apps/
│   ├── web/                  # Next.js 16 frontend
│   └── api/                  # NestJS 10 backend
├── packages/
│   └── shared/               # shared types + zod schemas
├── docs/                     # project documentation
├── scripts/                  # dev / CI scripts
├── package.json              # workspace root + turbo scripts
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
└── .env.example
```

## Prerequisites

- Node.js `>=20` (see `.nvmrc`)
- pnpm `>=9`

## Setup

```bash
pnpm install
cp .env.example .env.local
```

## Develop

Run web + api together:

```bash
pnpm dev
```

Or individually:

```bash
pnpm dev:web    # http://localhost:3000
pnpm dev:api    # http://localhost:8787
```

## Common scripts

| Command            | What it does                                |
| ------------------ | ------------------------------------------- |
| `pnpm dev`         | run all apps in parallel via turbo          |
| `pnpm build`       | build all packages and apps                 |
| `pnpm lint`        | lint everything                             |
| `pnpm typecheck`   | type-check everything                       |
| `pnpm test`        | run all tests                               |
| `pnpm format`      | prettier write across the repo              |

## Next steps

UI work begins in `apps/web/src/app` — see `docs/ai-interview-project-overview.md` for the product spec.
