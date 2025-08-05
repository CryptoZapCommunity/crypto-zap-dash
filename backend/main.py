#!/usr/bin/env python3
"""
Entry point for Crypto Dashboard API
Migrated from api/index.ts with exact startup logic
"""

import uvicorn
from app.config import settings

if __name__ == "__main__":
    print("🚀 Crypto Dashboard API - Python Backend")
    print("=" * 50)
    print(f"🔧 Environment: {settings.ENVIRONMENT}")
    print(f"📊 Port: {settings.PORT}")
    print(f"🐛 Debug: {settings.DEBUG}")
    print(f"🌐 CORS Origins: {len(settings.ALLOWED_ORIGINS)}")
    print("=" * 50)
    print(f"🏥 Health: http://localhost:{settings.PORT}/api/health")
    print(f"📚 Docs: http://localhost:{settings.PORT}/docs")
    print(f"🔍 ReDoc: http://localhost:{settings.PORT}/redoc")
    print("=" * 50)
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="debug" if settings.DEBUG else "info"
    )