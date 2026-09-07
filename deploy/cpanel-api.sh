#!/bin/bash
#
# Calls one cPanel UAPI endpoint from CI and fails loudly.
#
#   deploy/cpanel-api.sh <Module/function> [extra curl arguments...]
#
# Needs CPANEL_HOST, CPANEL_USER, CPANEL_API_TOKEN and CPANEL_PIN in the
# environment. The response body goes to stdout on success.
#
# Every failure also prints a GitHub Actions ::error:: annotation. Annotations show
# up in the run summary and in the checks API, so a broken deploy can be diagnosed
# without downloading the log — which matters because the log needs a token that
# whoever is debugging may not have.

set -uo pipefail

endpoint="${1:?usage: cpanel-api.sh <Module/function> [curl args...]}"
shift

body="$(mktemp)"
trap 'rm -f "$body"' EXIT

# Annotations go to stderr, not stdout: callers redirect stdout to capture the
# response body, and a diagnostic that lands in /dev/null helps nobody. The runner
# reads workflow commands from both streams.
fail() {
  echo "::error::cPanel ${endpoint}: $*" >&2
  exit 1
}

# The panel's certificate is self-signed and long expired, so it cannot be checked
# against a CA. Pinning its public key still rules out an impostor, which matters
# because an unrestricted API token travels over this connection.
code="$(curl -sS \
  --insecure --pinnedpubkey "sha256//${CPANEL_PIN}" \
  --max-time "${CPANEL_TIMEOUT:-900}" \
  -o "$body" -w '%{http_code}' \
  -H "Authorization: cpanel ${CPANEL_USER}:${CPANEL_API_TOKEN}" \
  -H "X-Requested-With: XMLHttpRequest" \
  "$@" \
  "https://${CPANEL_HOST}:2083/execute/${endpoint}")"
curl_status=$?

if [ "$curl_status" -ne 0 ]; then
  fail "curl exited ${curl_status} — $(head -c 200 "$body" | tr -d '\r\n')"
fi

if [ "$code" != "200" ]; then
  fail "HTTP ${code} — $(head -c 300 "$body" | tr -d '\r\n')"
fi

python3 - "$body" "$endpoint" <<'PY' || exit 1
import json, sys

path, endpoint = sys.argv[1], sys.argv[2]
raw = open(path, encoding="utf-8", errors="replace").read()

def fail(message):
    print("::error::cPanel %s: %s" % (endpoint, message), file=sys.stderr)
    raise SystemExit(1)

try:
    doc = json.loads(raw)
except ValueError:
    fail("response was not JSON — %s" % raw[:300].replace("\n", " "))

if not doc.get("status"):
    fail("returned errors: %s" % (doc.get("errors") or doc.get("message") or raw[:300]))

data = doc.get("data") or {}
if isinstance(data, dict) and data.get("failed"):
    fail("reported %s failed upload(s): %s" % (data["failed"], json.dumps(data)[:300]))

# Progress goes to stderr so callers can parse the raw body off stdout.
print(json.dumps(doc)[:600], file=sys.stderr)
PY

cat "$body"
