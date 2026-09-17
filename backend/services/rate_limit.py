from __future__ import annotations

import time
from collections import defaultdict

from fastapi import HTTPException, Request, status

_hits: dict[str, list[float]] = defaultdict(list)


def _client_key(request: Request, bucket: str) -> str:
    ip = request.client.host if request.client else "unknown"
    return f"{bucket}:{ip}"


def enforce_rate_limit(request: Request, *, bucket: str, limit: int, window_seconds: int) -> None:
    """Raises 429 if more than `limit` calls happened for this client+bucket
    within the last `window_seconds`. In-memory, per-process — fine for a
    single-worker deployment (see entrypoint.sh, no --workers flag)."""
    key = _client_key(request, bucket)
    now = time.monotonic()
    cutoff = now - window_seconds
    hits = [t for t in _hits[key] if t > cutoff]
    if len(hits) >= limit:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Слишком много запросов. Попробуйте позже.",
        )
    hits.append(now)
    _hits[key] = hits
