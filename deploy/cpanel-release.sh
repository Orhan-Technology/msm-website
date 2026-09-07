#!/bin/bash
#
# Publishes the latest build of msm.af on the cPanel host. Runs from cron every two
# minutes and does nothing unless GitHub Actions has published a build for a commit
# newer than the one already live.
#
# The server pulls instead of CI pushing, for two reasons:
#
#   * CloudLinux caps every process here at 4 GB of virtual address space, and Node
#     22 reserves a large contiguous CodeRange at startup, so `pnpm install` and
#     `next build` both die with "Failed to reserve virtual memory for CodeRange".
#     The build has to happen in CI.
#   * The panel's API ports sit behind Imunify360 bot protection, which answers
#     automated clients with a JavaScript challenge page instead of JSON, so CI
#     cannot upload the result or trigger anything over them.
#
# Pulling sidesteps both, and needs no credential anywhere: the repository is public
# and so are its release assets.
#
#   ~/msm-src               git checkout; supplies public/ and this script
#   ~/msm-app/release       what the web server runs
#   ~/msm-app/uploads       media from the admin panel  (survives deploys)
#   ~/msm-app/data          the CMS SQLite database     (survives deploys)
#   ~/msm-app/deployed.sha  the commit currently live
#   ~/msm-app/deploy.log    what happened, newest last
#
# Set FORCE=1 to redeploy the current commit.

set -uo pipefail

export PATH="/usr/local/bin:/usr/bin:/bin"

HOME="${HOME:-/home2/msmaf}"
APP_ROOT="${APP_ROOT:-$HOME/msm-app}"
SRC="${SRC:-$HOME/msm-src}"
BRANCH="${DEPLOY_BRANCH:-main}"
REPO="${DEPLOY_REPO:-Orhan-Technology/msm-website}"
LOG="$APP_ROOT/deploy.log"
STAMP="$APP_ROOT/deployed.sha"

mkdir -p "$APP_ROOT"

# Trim before taking the log over, so the open descriptor keeps pointing at the file
# that is actually being written.
if [ -f "$LOG" ] && [ "$(wc -l < "$LOG")" -gt 800 ]; then
  tail -n 300 "$LOG" > "$LOG.trimmed" && mv "$LOG.trimmed" "$LOG"
fi
exec >>"$LOG" 2>&1

log() { echo "[$(date -u '+%F %T')] $*"; }

# cron ticks faster than a release takes; never let two overlap.
exec 9>"$APP_ROOT/.deploy.lock"
flock -n 9 || exit 0

cd "$SRC" 2>/dev/null || { log "no checkout at $SRC"; exit 1; }

if ! git fetch --quiet --prune origin "$BRANCH"; then
  log "git fetch failed"
  exit 1
fi

target="$(git rev-parse "origin/$BRANCH")"
current="$(cat "$STAMP" 2>/dev/null || true)"
if [ "${FORCE:-0}" != "1" ] && [ "$target" = "$current" ]; then
  exit 0
fi

work="$(mktemp -d "$APP_ROOT/.deploy.XXXXXX")"
trap 'rm -rf "$work"' EXIT

# A build is published as a release asset named after the commit it came from. A 404
# just means CI is still building, so leave it for the next tick.
url="https://github.com/$REPO/releases/download/deploy-$target/msm-build.tar.gz"
if ! curl -fsSL --max-time 600 -o "$work/build.tar.gz" "$url"; then
  exit 0
fi

log "deploying $target"
git reset --hard --quiet "origin/$BRANCH"
git clean -fdq

mkdir -p "$work/release"
if ! tar -xzf "$work/build.tar.gz" -C "$work/release"; then
  log "the downloaded build could not be unpacked"
  exit 1
fi

# public/ is in the repository, so it never has to travel through CI.
cp -a "$SRC/public" "$work/release/public"

# The standalone server chdir()s into its own directory, so the two writable paths
# have to point back out of the release for content to survive a deploy.
mkdir -p "$APP_ROOT/uploads" "$APP_ROOT/data"
rm -rf "$work/release/public/uploads"
ln -s "$APP_ROOT/uploads" "$work/release/public/uploads"

# better-sqlite3 is a native module. CI builds it against a newer glibc than
# CloudLinux ships, so the traced copy would not load here; use the one compiled on
# this machine instead. Install it with:
#   cPanel > Setup Node.js App > msm.af > Run NPM Install
rm -rf "$work/release/node_modules/better-sqlite3"
ln -s "$APP_ROOT/node_modules/better-sqlite3" "$work/release/node_modules/better-sqlite3"

# Served as /deploy-status.json, which is how CI confirms the release went live.
printf '{"commit":"%s","deployedAt":"%s"}\n' "$target" "$(date -u '+%FT%TZ')" \
  > "$work/release/public/deploy-status.json"

rm -rf "$APP_ROOT/release.old"
[ -d "$APP_ROOT/release" ] && mv "$APP_ROOT/release" "$APP_ROOT/release.old"
mv "$work/release" "$APP_ROOT/release"
rm -rf "$APP_ROOT/release.old"

mkdir -p "$APP_ROOT/tmp"
touch "$APP_ROOT/tmp/restart.txt"

echo "$target" > "$STAMP"
log "live: $(git log -1 --pretty='%h %s' "$target") ($(du -sh "$APP_ROOT/release" | cut -f1))"
