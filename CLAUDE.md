# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Monorepo for **molave.ai** — an intelligence layer for meetings and interviews (Persol Frontier AI Lab, Phase 1 lands June 2026). Three features inside one meeting room: AI Interviewer, AI Meeting Assistant, Room Awareness. Backend is intended to run on AWS Lambda; frontend is Next.js 16. Product spec lives in [docs/ai-interview-project-overview.md](docs/ai-interview-project-overview.md) — read it first when product context matters.

## Layout

pnpm workspaces + Turborepo. Two apps, one shared package:

- `apps/web` — Next.js 16 App Router + React 19 + Tailwind v4 + shadcn-style components
- `apps/api` — NestJS 10 (Lambda-ready)
- `packages/shared` — `@ai-interview/shared` workspace package: TS types + Zod schemas + constants

Workspaces use `workspace:*` (e.g. `"@ai-interview/shared": "workspace:*"`). The shared package is consumed **directly from source** — no build step — via `transpilePackages: ['@ai-interview/shared']` in [apps/web/next.config.ts](apps/web/next.config.ts). Add new shared exports to `packages/shared/src/{types,schemas,constants}/index.ts` and they're immediately importable.

## Commands

Run from the repo root unless noted.

### Native (host)

| Task | Command |
| --- | --- |
| Install | `pnpm install` |
| Dev (both apps in parallel) | `pnpm dev` |
| Dev (web only, `:3000`) | `pnpm dev:web` |
| Dev (api only, `:8787`) | `pnpm dev:api` |
| Build all | `pnpm build` |
| Lint / Typecheck / Test all | `pnpm lint` · `pnpm typecheck` · `pnpm test` |
| Format | `pnpm format` |

To target a single workspace: `pnpm --filter @ai-interview/web <script>` (or `@ai-interview/api`, `@ai-interview/shared`).

Single-test invocations:
- web (Vitest): `pnpm --filter @ai-interview/web test -- <path-or-pattern>`
- api (Jest): `pnpm --filter @ai-interview/api test -- <path-or-pattern>`

### Docker (full stack)

| Task | Command |
| --- | --- |
| Bring everything up (postgres + api + web) | `pnpm docker:up` |
| Rebuild images and up | `pnpm docker:up:build` |
| Tail logs | `pnpm docker:logs` |
| Tear down (keep data) | `pnpm docker:down` |
| Hard reset (drops postgres volume) | `pnpm docker:reset` |

### Database (Prisma)

| Task | Command |
| --- | --- |
| Generate client | `pnpm db:generate` |
| Create + apply a dev migration | `pnpm db:migrate --name <name>` |
| Push schema without migration (fast iteration) | `pnpm db:push` |
| Reset DB and replay migrations | `pnpm db:reset` |
| Prisma Studio (UI) | `pnpm db:studio` |

## Dev server quirks

- The Next.js dev server **detects existing instances and refuses to start a second one** on the same port. If `pnpm dev:web` exits with `address already in use :::3000` or "Another next dev server is already running", a server is already up — use it.
- Compile errors and runtime errors appear in `apps/web/.next/dev/logs/next-development.log` (newline-delimited JSON). When verifying changes, `grep -E "ERROR|Compiled" apps/web/.next/dev/logs/next-development.log | tail` is faster than restarting.
- API health check: `GET http://localhost:8787/health`. CORS is wired to `WEB_ORIGIN` env (default `http://localhost:3000`).

## Frontend architecture

### Atomic design + features

[apps/web/src/components/](apps/web/src/components/) is organized by complexity, not by route:

```
components/
  ui/           # shadcn primitives (Button, Input, ...) — when added
  atoms/        # Logo, Eyebrow, Field, PrimaryButton
  molecules/    # StatTile, RoomRow, EvaluationCard, SectionHeader, InsightTile
  organisms/    # AppSidebar, AppHeader
  templates/    # AuthShell, AppShell
features/       # per-feature modules (landing/, auth/, ...)
```

Route-specific composition lives in `features/`. Templates are page chrome (sidebar + header wiring). Pages compose a template with feature sections.

### Route groups

- `app/(auth)/` — `login`, `register`. No chrome; uses `AuthShell` template.
- `app/(app)/` — authenticated product. `(app)/layout.tsx` wraps every child in `AppShell` (sidebar + header). `(app)/dashboard/page.tsx` is the current dashboard. Add new authenticated pages as `(app)/<route>/page.tsx`.
- `app/page.tsx` — public landing, composed from `features/landing/*`.

### Client components rule

Next.js App Router defaults to server components. **Any page with `onSubmit`, `useState`, `useEffect`, or other client-only props must start with `'use client'`.** The auth pages and the landing `CallToAction` (which has a form) need it. Sidebar uses `usePathname` so it's client. Server components throw a confusing "Event handlers cannot be passed to Client Component props" error if you forget.

### String gotcha

Inline narrative copy in `.tsx` files uses **curly apostrophes** (`’`) inside single-quoted string literals because `'` collides with JS string delimiters and crashes the parser. Don't write `'they\'re'` — write `'they’re'`. The parser error from a single straight apostrophe is opaque ("Expected ',', got 'ident'").

### Path alias

`@/*` → `apps/web/src/*` (configured in [apps/web/tsconfig.json](apps/web/tsconfig.json)). Always use the alias for cross-folder imports.

## Design system

The brand is **warm editorial** — molave hardwood inspired. Type, color, and spacing are tightly controlled. The design tokens are the source of truth, not hardcoded values.

### Tokens — [apps/web/src/app/globals.css](apps/web/src/app/globals.css)

Tailwind v4 uses `@theme { ... }` directly in CSS — there is **no `tailwind.config.js`**. To add a token, add it to the `@theme` block. Existing palette:

- Surfaces: `--color-canvas` (ivory body), `--color-paper` (cream cards/sidebar)
- Ink: `--color-ink` (espresso), `--color-ink-soft`, `--color-muted`
- Rules: `--color-rule`, `--color-rule-strong`
- Accent: `--color-amber`, `--color-amber-deep`, `--color-amber-soft`

Reference with `text-[var(--color-ink)]` or `bg-[var(--color-paper)]` etc. **Don't introduce raw hex/oklch colors in components** — extend the theme.

### Typography

Three families wired via `next/font/google` in [apps/web/src/app/layout.tsx](apps/web/src/app/layout.tsx):

- **Fraunces** (variable serif) → `--font-display`. Axes: `opsz`, `SOFT`, `wght`. Apply via the `.font-display` utility (tuned for hero sizes) or `.font-display-text` (tuned for body italics/captions). Always pair italic+amber for editorial emphasis (`<em className="italic text-[var(--color-amber-deep)]">`).
- **Geist** (sans) → `--font-sans`. Default body font.
- **Geist Mono** → `--font-mono`. Used via `.font-mono` utility for keyboard shortcuts, version strings, and timestamps. Pair with `.num-tabular` for numeric tables.

### Visual motifs

- Eyebrow labels: `text-[10.5px] uppercase tracking-[0.26em] text-[var(--color-muted)]` preceded by a hairline rule `<span className="block h-px w-X bg-[var(--color-rule-strong)]" />`. The `Eyebrow` atom encapsulates this.
- Numbered sections — landing sections use `01 · The room`, `02 · The problem`, etc. matching the doc's structure.
- Hairline-underline inputs (`.field-line` utility), not boxed inputs.
- `.grain` + `.wash` utilities create paper-noise + warm gradient backgrounds on hero/manifesto panels.
- Entrance animations: `.rise` and `.fade` keyframes with `animation-delay` stagger.

## Backend architecture

NestJS modular structure under [apps/api/src/](apps/api/src/): `main.ts` bootstraps and enables CORS to `WEB_ORIGIN`. Feature modules live as `src/<feature>/{<feature>.controller.ts, <feature>.service.ts, <feature>.module.ts, dto/}`. Current modules: `PrismaModule` (global), `HealthModule`.

CORS, port, and env are read from `process.env` via `@nestjs/config` (`ConfigModule.forRoot({ isGlobal: true })`). Don't add a custom config loader — extend the existing one.

### Database — Prisma + Postgres

Schema at [apps/api/prisma/schema.prisma](apps/api/prisma/schema.prisma). The Prisma client is injected via `PrismaService` (extends `PrismaClient`) inside the global `PrismaModule`. Any service can request it: `constructor(private readonly prisma: PrismaService) {}`.

Connection string is `DATABASE_URL`:
- Inside docker compose: `postgresql://molave:molave_local@postgres:5432/molave?schema=public`
- Native (host) dev: `postgresql://molave:molave_local@localhost:5432/molave?schema=public`

The api container on `pnpm docker:up` runs `prisma db push` before booting Nest — schema changes apply automatically in dev. **For schema changes that ship to prod, create a migration with `pnpm db:migrate --name <name>` from the host**, commit the generated `apps/api/prisma/migrations/*` folder. Production uses `prisma migrate deploy` on container boot (see prod stage in `apps/api/Dockerfile`).

`postinstall` script runs `prisma generate` so the client is always available after `pnpm install`.

### Docker layout

[docker-compose.yml](docker-compose.yml) defines three services: `postgres` (data in named volume `postgres_data`), `api` (hot-reload via `apps/api/src` bind mount), `web` (hot-reload via `apps/web/src` bind mount). Anonymous volumes preserve container `node_modules` so the host's missing/stale modules don't shadow them. The api waits for `postgres` healthcheck (`pg_isready`) before booting.

Multi-stage Dockerfiles target `dev` (volume-mounted hot reload) and `prod` (slim runtime image). docker-compose uses `target: dev`.

## Project doc

[docs/ai-interview-project-overview.md](docs/ai-interview-project-overview.md) is the single source of product truth. When tone, copy, naming, or feature intent is ambiguous, that doc decides — not improvisation. The 7 Room Awareness safeguards in particular are hard rules, not guidelines.
