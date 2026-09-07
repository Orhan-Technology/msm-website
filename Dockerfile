# syntax=docker/dockerfile:1

# Debian slim rather than Alpine: better-sqlite3 publishes glibc prebuilds, so
# the native module drops in without a source build in the common case.
FROM node:22-bookworm-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.18.2 --activate
WORKDIR /app


# ---------- deps ----------
# Full install, including the better-sqlite3 native binding. The toolchain is
# only used if prebuild-install can't find a matching binary for this platform.
FROM base AS deps
RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 make g++ ca-certificates \
    && rm -rf /var/lib/apt/lists/*
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

# Public pages are prerendered here against an empty database, which resolves to
# the defaults bundled in lib/cms/sections. The running server re-renders them
# from the real database as soon as the admin saves (revalidateTag).
RUN pnpm build


# ---------- runner ----------
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Must point at the mounted volume, not the image filesystem.
ENV SQLITE_URL="file:/app/data/msm-cms.db"

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

# Both directories are written at runtime and MUST be mounted as persistent
# volumes in Dokploy:
#   /app/data           -> the CMS SQLite database
#   /app/public/uploads -> images and video uploaded through the media library
# Without them, every redeploy wipes all CMS content and all uploaded media.
RUN mkdir -p /app/data /app/public/uploads \
    && chown -R node:node /app/data /app/public/uploads

# Fail loudly at build time if Next's file tracing missed the native binding,
# instead of at the first database query in production.
RUN node -e "require('better-sqlite3'); console.log('better-sqlite3 binding OK')"

USER node
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/').then(r=>process.exit(r.status<500?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
