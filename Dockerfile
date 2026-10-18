# syntax=docker/dockerfile:1

# Production image, deployed by Dokploy on the Hetzner server. The CMS lives in
# Postgres (DATABASE_URL); uploaded media is written to /app/uploads, which MUST
# be a persistent volume in Dokploy or every redeploy wipes the media library.
FROM node:22-bookworm-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.18.2 --activate
WORKDIR /app


# ---------- deps ----------
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile


# ---------- builder ----------
FROM base AS builder

# NEXT_PUBLIC_* values are inlined into the client bundle during `next build`,
# so this has to be a build arg. Setting it only as a runtime env var in Dokploy
# will NOT change the canonical URL in metadata, sitemap or structured data.
ARG NEXT_PUBLIC_SITE_URL=https://msm.af
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Public pages are prerendered here without a database, which resolves to the
# defaults bundled in lib/cms/sections. The running server re-renders them from
# the real database as soon as the admin saves (revalidateTag).
RUN pnpm build


# ---------- runner ----------
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV UPLOAD_DIR=/app/uploads

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

# Created owned by `node` so a fresh volume mounted here inherits that owner.
RUN mkdir -p /app/uploads && chown node:node /app/uploads

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/').then(r=>process.exit(r.status<500?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
