#!/usr/bin/env bash
# Air cloud startup script for js-random-sum.
# - Installs npm dependencies (Jest, Babel, ts-jest) from package-lock.json.
# - Serves index.html (the random-sum page) on port 3000 in the background.
# - In WARMUP mode, blocks on `healthcheck` so the snapshot contains a working setup.
set -euo pipefail

if [ "${AIR_STARTUP_MODE:-}" = warmup ]; then WARMUP=1; else WARMUP=; fi

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
PORT=3000
SERVER_LOG=/tmp/js-random-sum-http.log
cd "$REPO_DIR"

echo "[startup] node $(node -v), npm $(npm -v), mode=${AIR_STARTUP_MODE:-unset}"

# Dependencies: npm ci for a clean, lockfile-exact install; skip if already in sync.
if [ -d node_modules ] && [ node_modules/.package-lock.json -nt package-lock.json ]; then
  echo "[startup] node_modules up to date, skipping npm ci"
else
  echo "[startup] running npm ci..."
  npm ci --no-audit --no-fund
  echo "[startup] npm ci done"
fi

# Static server for index.html (+ src/app.js). Binds 0.0.0.0 and accepts any Host header.
if curl -fsS -o /dev/null "http://127.0.0.1:${PORT}/index.html" 2>/dev/null; then
  echo "[startup] static server already answering on :${PORT}"
else
  echo "[startup] starting static server on 0.0.0.0:${PORT} (log: ${SERVER_LOG})"
  nohup python3 -m http.server "$PORT" --bind 0.0.0.0 --directory "$REPO_DIR" \
    >"$SERVER_LOG" 2>&1 </dev/null &
fi

healthcheck() {
  # Jest toolchain smoke: run suites that are expected to pass (Babel JS + TS via ts-jest).
  # The repo intentionally contains always-failing tests (alwaysFail, sum, filter), so they are excluded.
  echo "[healthcheck] running jest smoke suites..."
  npx jest --ci test/jest/exc.test.js test/jest/regex.test.js \
    test/jest/nested/doSomething.test.js src/tests/doSomething.spec.ts
  echo "[healthcheck] jest smoke passed"

  echo "[healthcheck] waiting for page on :${PORT}..."
  local n=0
  until body="$(curl -fsS -H 'Host: preview.example.com' "http://127.0.0.1:${PORT}/index.html" 2>/dev/null)" \
      && grep -q 'id="sum"' <<<"$body" \
      && curl -fsS -o /dev/null "http://127.0.0.1:${PORT}/src/app.js"; do
    n=$((n + 1))
    if [ $((n % 10)) -eq 0 ]; then
      echo "[healthcheck] still waiting for :${PORT}; server log tail:"
      tail -n 5 "$SERVER_LOG" 2>/dev/null || true
    fi
    sleep 1
  done
  echo "[healthcheck] page served on :${PORT}"
}

if [ -n "${WARMUP:-}" ]; then healthcheck; fi
echo "[startup] done"
