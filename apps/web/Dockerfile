# ─── base — install workspace deps once, cached by manifests ──────────────
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

# Workspace manifests first for layer caching
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/

RUN pnpm install --frozen-lockfile=false

# Copy the rest of the workspace
COPY . .

# ─── dev — Turbopack hot-reload via volume mounts ─────────────────────────
FROM base AS dev
WORKDIR /app/apps/web
EXPOSE 3000
# Bind to 0.0.0.0 so the host can reach the container
CMD ["pnpm", "exec", "next", "dev", "--hostname", "0.0.0.0", "--port", "3000"]

# ─── build — produce a Next.js production build ───────────────────────────
FROM base AS builder
WORKDIR /app/apps/web
RUN pnpm build

# ─── prod — slim runtime image ────────────────────────────────────────────
FROM node:20-alpine AS prod
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

COPY --from=builder /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml* ./
COPY --from=builder /app/apps/web/package.json ./apps/web/
COPY --from=builder /app/packages/shared/package.json ./packages/shared/
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/packages/shared/src ./packages/shared/src
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/node_modules ./apps/web/node_modules

WORKDIR /app/apps/web
EXPOSE 3000
CMD ["pnpm", "exec", "next", "start", "--hostname", "0.0.0.0", "--port", "3000"]
