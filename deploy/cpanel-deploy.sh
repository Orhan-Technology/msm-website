#!/bin/bash
#
# Deploys msm.af onto the cPanel account `msmaf` (CloudLinux Node.js selector +
# Phusion Passenger). Runs on the server, never locally.
#
#   ~/msm-src            git checkout of this repository; the build happens here
#   ~/msm-app            Passenger application root
#   ~/msm-app/release    the built standalone server Passenger runs
#   ~/msm-app/uploads    media uploaded through the admin panel  (survives deploys)
#   ~/msm-app/data       the CMS SQLite database                 (survives deploys)
#
# Each stage is exposed as an npm script in ~/msm-app/package.json so it can be run
# from cPanel > Setup Node.js App, and by CI through cPanel's Git deployment.
#
# Usage: bash cpanel-deploy.sh [source|deps|build|release|restart|all]

set -euo pipefail

APP_ROOT="${APP_ROOT:-$HOME/msm-app}"
SRC="${SRC:-$HOME/msm-src}"
# Whatever branch cPanel's Git Version Control has checked out is what goes live,
# so the branch is chosen in one place (cPanel > Git Version Control) instead of two.
BRANCH="${DEPLOY_BRANCH:-$(git -C "$SRC" rev-parse --abbrev-ref HEAD)}"
[ "$BRANCH" = "HEAD" ] && BRANCH=main  # detached checkout: fall back to the default branch

# NEXT_PUBLIC_* values are inlined into the client bundle at build time, so this has
# to be set here rather than only as a runtime variable.
export NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://msm.af}"
export NEXT_TELEMETRY_DISABLED=1
export PNPM_VERSION="10.18.2"

log() { echo "[deploy] $*"; }

stage_source() {
  log "syncing $SRC to origin/$BRANCH"
  cd "$SRC"
  git fetch --prune origin
  git checkout -B "$BRANCH" "origin/$BRANCH"
  git reset --hard "origin/$BRANCH"
  git clean -fd
  git log -1 --pretty="[deploy] now at %h %s"
}

stage_deps() {
  cd "$SRC"
  if ! command -v pnpm >/dev/null 2>&1; then
    log "installing pnpm@$PNPM_VERSION"
    npm install -g "pnpm@$PNPM_VERSION" --loglevel=error
  fi
  log "installing dependencies"
  pnpm install --frozen-lockfile --reporter=append-only
}

stage_build() {
  log "building"
  cd "$SRC"
  pnpm build
}

stage_release() {
  log "publishing release"
  rm -rf "$APP_ROOT/release.new" "$APP_ROOT/release.old"
  cp -a "$SRC/.next/standalone" "$APP_ROOT/release.new"
  cp -a "$SRC/.next/static"     "$APP_ROOT/release.new/.next/static"
  cp -a "$SRC/public"           "$APP_ROOT/release.new/public"

  # The standalone server chdir()s into its own directory, so the two writable
  # paths have to point back out of the release for content to survive a deploy.
  mkdir -p "$APP_ROOT/uploads" "$APP_ROOT/data"
  rm -rf "$APP_ROOT/release.new/public/uploads"
  ln -s "$APP_ROOT/uploads" "$APP_ROOT/release.new/public/uploads"

  [ -d "$APP_ROOT/release" ] && mv "$APP_ROOT/release" "$APP_ROOT/release.old"
  mv "$APP_ROOT/release.new" "$APP_ROOT/release"
  rm -rf "$APP_ROOT/release.old"
  du -sh "$APP_ROOT/release"
}

stage_restart() {
  log "restarting"
  mkdir -p "$APP_ROOT/tmp"
  touch "$APP_ROOT/tmp/restart.txt"
}

case "${1:-all}" in
  source)  stage_source ;;
  deps)    stage_deps ;;
  build)   stage_build ;;
  release) stage_release ;;
  restart) stage_restart ;;
  all)     stage_source; stage_deps; stage_build; stage_release; stage_restart ;;
  *) echo "unknown stage: ${1}" >&2; exit 2 ;;
esac

log "ok"
