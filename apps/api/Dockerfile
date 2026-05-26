# ─── base — install workspace deps once, cached by manifests ──────────────
FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
RUN apk add --no-cache openssl
WORKDIR /app

# Copy workspace manifests (best cache layer)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/shared/package.json ./packages/shared/

# Install all workspace deps
RUN pnpm install --frozen-lockfile=false

# Copy the rest of the workspace (for prisma schema, source, etc.)
COPY . .

# Generate Prisma client from the schema
RUN pnpm --filter @ai-interview/api exec prisma generate

# ─── dev — hot-reload via volume mounts ───────────────────────────────────
FROM base AS dev
WORKDIR /app/apps/api
EXPOSE 8787
# On boot: sync schema → start Nest in watch mode.
CMD ["sh", "-c", "pnpm exec prisma db push --skip-generate --accept-data-loss && pnpm exec nest start --watch --preserveWatchOutput"]

# ─── build — compile for prod ─────────────────────────────────────────────
FROM base AS builder
WORKDIR /app/apps/api
RUN pnpm build

# ─── prod — slim runtime image ────────────────────────────────────────────
FROM node:20-alpine AS prod
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
RUN apk add --no-cache openssl
WORKDIR /app

# Just what's needed to run
COPY --from=builder /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml* ./
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/packages/shared/package.json ./packages/shared/
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/prisma ./apps/api/prisma
COPY --from=builder /app/packages/shared/src ./packages/shared/src
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules

WORKDIR /app/apps/api
EXPOSE 8787
CMD ["sh", "-c", "pnpm exec prisma migrate deploy && node dist/main.js"]
