import json
import contextlib
from typing import Any, Optional

from ..config import settings

try:
    import redis.asyncio as redis
except Exception:  # pragma: no cover - redis optional
    redis = None


class AsyncCache:
    """Simple async cache backed by Redis when enabled; no-op otherwise."""

    def __init__(self):
        self._enabled = bool(settings.ENABLE_REDIS and settings.REDIS_URL and redis is not None)
        self._client = redis.from_url(settings.REDIS_URL, decode_responses=True) if self._enabled else None

    async def get_json(self, key: str) -> Optional[Any]:
        if not self._enabled or not self._client:
            return None
        try:
            raw = await self._client.get(key)
            if raw is None:
                return None
            return json.loads(raw)
        except Exception:
            return None

    async def set_json(self, key: str, value: Any, ttl_seconds: int) -> None:
        if not self._enabled or not self._client:
            return
        try:
            await self._client.set(key, json.dumps(value), ex=ttl_seconds)
        except Exception:
            # best-effort cache
            pass


cache = AsyncCache()



