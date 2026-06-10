#!/bin/sh
set -e

# Wait for the database to be ready (best-effort).
python - <<'PY'
import os
import socket
import time
from urllib.parse import urlparse

url = os.environ.get("DATABASE_URL", "")
if url:
    parsed = urlparse(url.replace("+asyncpg", ""))
    host = parsed.hostname or "db"
    port = parsed.port or 5432
    deadline = time.time() + 60
    while time.time() < deadline:
        try:
            with socket.create_connection((host, port), timeout=2):
                break
        except OSError:
            time.sleep(1)
    else:
        print(f"warning: db {host}:{port} not reachable after 60s")
PY

alembic upgrade head

python - <<'PY'
from services.media import ensure_upload_dirs
ensure_upload_dirs()
PY

if [ "${RUN_SEED:-0}" = "1" ]; then
    python -m seeds.initial || true
fi

PORT="${FASTAPI_PORT:-8080}"
HOST="${FASTAPI_HOST:-0.0.0.0}"
RELOAD_FLAG=""
if [ "${UVICORN_RELOAD:-0}" = "1" ]; then
    RELOAD_FLAG="--reload"
fi

exec uvicorn main:app --host "$HOST" --port "$PORT" $RELOAD_FLAG
