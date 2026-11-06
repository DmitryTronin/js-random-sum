#!/usr/bin/env bash
# Air cloud startup script for js-random-sum.
# - Installs npm dependencies (Jest + Babel/TS toolchain, jsdom).
# - Serves index.html (the "random sum" page) on port 3000 for preview.
# - In warmup mode, blocks on `healthcheck` (Jest smoke + HTTP check).
set -euo pipefail

if [ "${AIR_STARTUP_MODE:-}" = warmup ]; then WARMUP=1; else WARMUP=; fi

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$REPO_DIR"
PORT=3000

log() { echo "[startup] $*"; }

log "mode=${AIR_STARTUP_MODE:-unset} repo=$REPO_DIR node=$(node -v) npm=$(npm -v)"

# Dependencies (node_modules is persisted in the warmup snapshot).
if [ -d node_modules ] && cmp -s package-lock.json node_modules/.package-lock.json 2>/dev/null; then
  log "node_modules up to date, skipping npm ci"
else
  log "running npm ci..."
  npm ci --no-audit --no-fund
  log "npm ci done"
fi

# Static preview server for index.html (and src/app.js) on 0.0.0.0:$PORT.
if curl -fsS -o /dev/null "http://localhost:$PORT/index.html" 2>/dev/null; then
  log "static server already running on port $PORT"
else
  log "starting static server on port $PORT (log: /tmp/static-server.log)"
  nohup python3 -m http.server "$PORT" --bind 0.0.0.0 --directory "$REPO_DIR" \
    > /tmp/static-server.log 2>&1 < /dev/null &
fi

healthcheck() {
  # Jest smoke: run suites that are expected to pass. The repo intentionally
  # contains failing suites (alwaysFail, sum, filter), so the full run is red by design.
  log "healthcheck: running Jest smoke suites..."
  npx jest --ci test/jest/exc.test.js test/jest/regex.test.js \
    test/jest/nested/doSomething.test.js src/tests/doSomething.spec.ts
  log "healthcheck: Jest smoke passed"

  log "healthcheck: waiting for static server on port $PORT..."
  local n=0
  until curl -fsS -H "Host: preview.example" "http://localhost:$PORT/index.html" 2>/dev/null \
      | grep -q '<title>Random Sum</title>'; do
    n=$((n + 1))
    if [ $((n % 10)) -eq 0 ]; then
      log "healthcheck: still waiting for port $PORT; server log tail:"
      tail -n 5 /tmp/static-server.log || true
    fi
    sleep 1
  done
  log "healthcheck: index.html served on port $PORT"
}

if [ -n "${WARMUP:-}" ]; then healthcheck; fi
log "startup complete"
