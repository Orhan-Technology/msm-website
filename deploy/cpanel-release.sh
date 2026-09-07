#!/bin/bash
#
# Publishes a build that GitHub Actions has already produced. Runs on the cPanel
# server (account `msmaf`, /home2/msmaf) through .cpanel.yml.
#
# It deliberately runs no Node tooling. CloudLinux caps every process on this host
# at 4 GB of virtual address space, and Node 22 reserves a large contiguous
# CodeRange on startup, so anything that spawns Node workers — `pnpm install`
# included — dies there with "Failed to reserve virtual memory for CodeRange".
# The build therefore happens in CI and this script only unpacks it.
#
#   ~/msm-src                    git checkout; supplies public/
#   ~/incoming/msm-build.tar.gz  build artifact uploaded by CI
#   ~/msm-app/release            what Passenger serves
#   ~/msm-app/uploads            media from the admin panel  (never touched here)
#   ~/msm-app/data               the CMS SQLite database      (never touched here)

set -euo pipefail

APP_ROOT="${APP_ROOT:-$HOME/msm-app}"
SRC="${SRC:-$HOME/msm-src}"
ARTIFACT="${ARTIFACT:-$HOME/incoming/msm-build.tar.gz}"

# Whatever branch cPanel's Git Version Control has checked out is what goes live,
# so the branch is chosen in one place rather than two.
BRANCH="${DEPLOY_BRANCH:-$(git -C "$SRC" rev-parse --abbrev-ref HEAD)}"
[ "$BRANCH" = "HEAD" ] && BRANCH=main

log() { echo "[release] $*"; }

if [ ! -f "$ARTIFACT" ]; then
  echo "[release] no build at $ARTIFACT — the CI upload step did not run" >&2
  exit 1
fi

log "syncing $SRC to origin/$BRANCH"
cd "$SRC"
git fetch --prune origin
git checkout -B "$BRANCH" "origin/$BRANCH"
git reset --hard "origin/$BRANCH"
git clean -fd
git log -1 --pretty="[release] source at %h %s"

log "unpacking $(du -h "$ARTIFACT" | cut -f1) of build output"
rm -rf "$APP_ROOT/release.new" "$APP_ROOT/release.old"
mkdir -p "$APP_ROOT/release.new"
tar -xzf "$ARTIFACT" -C "$APP_ROOT/release.new"

# public/ is in git, so it never has to travel through CI.
cp -a "$SRC/public" "$APP_ROOT/release.new/public"

# The standalone server chdir()s into its own directory, so the two writable paths
# have to point back out of the release for content to survive a deploy.
mkdir -p "$APP_ROOT/uploads" "$APP_ROOT/data"
rm -rf "$APP_ROOT/release.new/public/uploads"
ln -s "$APP_ROOT/uploads" "$APP_ROOT/release.new/public/uploads"

# better-sqlite3 is a native module. CI builds it against a newer glibc than
# CloudLinux ships, so the traced copy would fail to load; use the one that was
# compiled here instead. Install it with:
#   cPanel > Setup Node.js App > msm.af > Run NPM Install
rm -rf "$APP_ROOT/release.new/node_modules/better-sqlite3"
ln -s "$APP_ROOT/node_modules/better-sqlite3" "$APP_ROOT/release.new/node_modules/better-sqlite3"

[ -d "$APP_ROOT/release" ] && mv "$APP_ROOT/release" "$APP_ROOT/release.old"
mv "$APP_ROOT/release.new" "$APP_ROOT/release"
rm -rf "$APP_ROOT/release.old"
du -sh "$APP_ROOT/release"

log "restarting"
mkdir -p "$APP_ROOT/tmp"
touch "$APP_ROOT/tmp/restart.txt"
log "ok"
