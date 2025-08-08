from fastapi import Request


async def security_headers_middleware(request: Request, call_next):
    response = await call_next(request)
    # Basic security headers (Nginx should also set these in production)
    response.headers.setdefault("X-Frame-Options", "SAMEORIGIN")
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("Referrer-Policy", "no-referrer-when-downgrade")
    # Minimal CSP allowing inline for dev tools; tune for production as needed
    response.headers.setdefault(
        "Content-Security-Policy",
        "default-src 'self' http: https: data: blob: 'unsafe-inline' 'unsafe-eval'",
    )
    return response



