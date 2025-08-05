"""
Configuration management for Crypto Dashboard API
Maps all environment variables from the original Node.js backend
"""

from pydantic_settings import BaseSettings
from typing import List, Optional
import os


class Settings(BaseSettings):
    """Application settings with automatic environment variable mapping"""
    
    # Database - Mapped from original DATABASE_URL
    DATABASE_URL: str = "postgresql://user:password@localhost/crypto_dash"
    
    # API Keys - Exact mapping from original + new ones for real services
    COINGECKO_API_KEY: str = "demo"
    FRED_API_KEY: str = ""
    NEWS_API_KEY: str = ""
    CRYPTO_PANIC_API_KEY: str = ""
    TRADING_ECONOMICS_API_KEY: str = ""
    WHALE_ALERT_API_KEY: str = ""
    
    # New API keys for real services
    ETHERSCAN_API_KEY: str = ""
    BLOCKCHAIN_INFO_API_KEY: str = ""
    ALPHA_VANTAGE_API_KEY: str = ""
    ECONOMIC_CALENDAR_API_KEY: str = ""
    AIRDROP_API_KEY: str = ""
    
    # Server Configuration - Mapped from NODE_ENV/PORT
    PORT: int = 5000
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    # CORS Settings - Enhanced for Python backend
    ALLOWED_ORIGINS: str = "http://localhost:5173,http://localhost:3000,http://localhost:5000,http://frontend:3000,http://localhost:8080,http://127.0.0.1:3000,http://127.0.0.1:5173,http://127.0.0.1:5000"
    
    # Redis (optional for production)
    REDIS_URL: Optional[str] = None
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_PER_HOUR: int = 1000
    
    # Monitoring
    ENABLE_MONITORING: bool = True
    LOG_LEVEL: str = "INFO"
    
    # External Services
    ENABLE_WEBSOCKET: bool = False
    ENABLE_SSE: bool = False
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
        
        @classmethod
        def parse_env_var(cls, field_name: str, raw_val: str):
            """Custom parser for environment variables"""
            if field_name == "ALLOWED_ORIGINS":
                if not raw_val or raw_val.strip() == "":
                    # Return default if empty
                    return [
                        "http://localhost:5173",
                        "http://localhost:3000", 
                        "http://localhost:5000",
                        "http://frontend:3000",
                        "http://localhost:8080"
                    ]
                # Split by comma if provided as string
                return [origin.strip() for origin in raw_val.split(",") if origin.strip()]
            return raw_val


# Global settings instance
settings = Settings()

# Debug: Print API keys status (without showing the actual keys)
if settings.DEBUG:
    print(f"Configuration loaded for {settings.ENVIRONMENT} environment")
    print(f"Database: {settings.DATABASE_URL.split('@')[-1] if '@' in settings.DATABASE_URL else 'Not configured'}")
    print(f"CORS Origins: {len(settings.ALLOWED_ORIGINS.split(','))} origins configured")
    
    # Check API keys status
    api_keys = {
        "COINGECKO_API_KEY": settings.COINGECKO_API_KEY,
        "FRED_API_KEY": settings.FRED_API_KEY,
        "NEWS_API_KEY": settings.NEWS_API_KEY,
        "CRYPTO_PANIC_API_KEY": settings.CRYPTO_PANIC_API_KEY,
        "TRADING_ECONOMICS_API_KEY": settings.TRADING_ECONOMICS_API_KEY,
        "WHALE_ALERT_API_KEY": settings.WHALE_ALERT_API_KEY,
        "ETHERSCAN_API_KEY": settings.ETHERSCAN_API_KEY,
        "BLOCKCHAIN_INFO_API_KEY": settings.BLOCKCHAIN_INFO_API_KEY,
        "ALPHA_VANTAGE_API_KEY": settings.ALPHA_VANTAGE_API_KEY,
        "ECONOMIC_CALENDAR_API_KEY": settings.ECONOMIC_CALENDAR_API_KEY,
        "AIRDROP_API_KEY": settings.AIRDROP_API_KEY,
    }
    
    configured_keys = 0
    for key_name, key_value in api_keys.items():
        if key_value and key_value != "demo" and key_value != "":
            configured_keys += 1
            print(f"✅ {key_name}: Configured")
        else:
            print(f"⚠️ {key_name}: Not configured")
    
    print(f"📊 API Keys Status: {configured_keys}/{len(api_keys)} configured")
    print(f"🔧 Debug Mode: {'Enabled' if settings.DEBUG else 'Disabled'}")
    print(f"🌐 Server Port: {settings.PORT}")
    print(f"🚀 Environment: {settings.ENVIRONMENT}")
    print("=" * 50)

# Validation
if settings.ENVIRONMENT == "production" and settings.SECRET_KEY == "your-secret-key-change-in-production":
    raise ValueError("SECRET_KEY must be changed in production!")