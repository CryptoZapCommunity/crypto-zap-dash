"""
Rate Limiter Middleware - Transformed from original api/rate-limiter.ts
Implements rate limiting with exact logic
"""

import time
from typing import Dict, List
from fastapi import Request, HTTPException


class RateLimiter:
    """Rate limiter with sliding window - exact port from original"""
    
    def __init__(self, max_requests_per_minute: int = 60, max_requests_per_hour: int = 1000):
        self.requests: Dict[str, List[float]] = {}
        self.max_requests_per_minute = max_requests_per_minute
        self.max_requests_per_hour = max_requests_per_hour
        self.window_minute = 60  # 1 minute in seconds
        self.window_hour = 3600  # 1 hour in seconds
    
    def _get_client_ip(self, request: Request) -> str:
        """Get client IP address"""
        forwarded = request.headers.get("X-Forwarded-For")
        if forwarded:
            return forwarded.split(",")[0].strip()
        return request.client.host if request.client else "unknown"
    
    def _clean_old_requests(self, client_id: str, window_seconds: int) -> List[float]:
        """Remove old requests outside the window - exact logic from original"""
        now = time.time()
        window_start = now - window_seconds
        
        if client_id not in self.requests:
            return []
        
        client_requests = self.requests[client_id]
        valid_requests = [req_time for req_time in client_requests if req_time > window_start]
        self.requests[client_id] = valid_requests
        return valid_requests
    
    def is_rate_limited(self, request: Request) -> bool:
        """Check if request should be rate limited - exact logic from original"""
        client_id = self._get_client_ip(request)
        now = time.time()
        
        # Check minute window
        minute_requests = self._clean_old_requests(client_id, self.window_minute)
        if len(minute_requests) >= self.max_requests_per_minute:
            return True
        
        # Check hour window
        hour_requests = self._clean_old_requests(client_id, self.window_hour)
        if len(hour_requests) >= self.max_requests_per_hour:
            return True
        
        return False
    
    def add_request(self, request: Request):
        """Add a request to the rate limiter"""
        client_id = self._get_client_ip(request)
        now = time.time()
        
        if client_id not in self.requests:
            self.requests[client_id] = []
        
        self.requests[client_id].append(now)


# Global rate limiter instance
rate_limiter = RateLimiter()


async def rate_limit_middleware(request: Request, call_next):
    """Rate limiting middleware"""
    if rate_limiter.is_rate_limited(request):
        raise HTTPException(
            status_code=429,
            detail="Rate limit exceeded. Please try again later."
        )
    
    rate_limiter.add_request(request)
    response = await call_next(request)
    return response