#!/bin/sh
set -e

echo "[entrypoint] waiting for database..."
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
                print(f"[entrypoint] database reachable at {host}:{port}")
                break
        except OSError:
            time.sleep(1)
    else:
        print(f"[entrypoint] warning: db {host}:{port} not reachable after 60s")
PY

echo "[entrypoint] running alembic upgrade head..."
alembic upgrade head
echo "[entrypoint] migrations complete"

python - <<'PY'
from services.media import ensure_upload_dirs
ensure_upload_dirs()
print("[entrypoint] upload directories ready")
PY

if [ "${RUN_SEED:-0}" = "1" ]; then
    echo "[entrypoint] running seed..."
    python -m seeds.initial || echo "[entrypoint] seed finished with warnings"
fi

PORT="${FASTAPI_PORT:-8080}"
HOST="${FASTAPI_HOST:-0.0.0.0}"

echo "[entrypoint] starting uvicorn on ${HOST}:${PORT}..."
exec uvicorn main:app --host "$HOST" --port "$PORT"
