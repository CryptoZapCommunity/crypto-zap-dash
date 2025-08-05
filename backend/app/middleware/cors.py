"""
CORS Middleware - Transformed from original api/middleware/cors.ts
Handles CORS configuration with exact origin logic
"""

from fastapi import Request, Response
from fastapi.middleware.cors import CORSMiddleware
from typing import List


# Exact allowed origins from original
ALLOWED_ORIGINS = [
    "https://cryptozapdash.netlify.app",
    "https://crypto-zap-dash.netlify.app", 
    "https://crypto-zap-dash.vercel.app",
    "https://cryptozapdash.vercel.app",
    "https://cryptozapdash-api.vercel.app",
    "https://crypto-zap-dash-client-a5uo2.vercel.app",
    "http://localhost:3000",
    "http://localhost:5000", 
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5000",
    "http://127.0.0.1:5173"
]


def get_cors_middleware():
    """Get CORS middleware configuration"""
    return CORSMiddleware(
        allow_origins=ALLOWED_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"],
        allow_headers=[
            "Origin", 
            "X-Requested-With", 
            "Content-Type", 
            "Accept", 
            "Authorization", 
            "Cache-Control", 
            "Pragma"
        ],
        max_age=86400  # 24 hours
    )


async def cors_middleware(request: Request, call_next):
    """Custom CORS middleware with exact logic from original"""
    response = await call_next(request)
    
    origin = request.headers.get("origin")
    is_development = True  # Assuming development for now
    
    # Exact logic from original TypeScript
    if origin and origin in ALLOWED_ORIGINS:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
    elif is_development and origin:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
    else:
        # Production fallback - allow all but no credentials
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Credentials"] = "false"
    
    response.headers["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS, HEAD" 
    response.headers["Access-Control-Max-Age"] = "86400"
    
    return response