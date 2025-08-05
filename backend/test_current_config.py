#!/usr/bin/env python3
"""
Test current backend configuration
"""

import sys
import os

# Add the backend directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.config import settings

def main():
    """Test current configuration"""
    print("🔍 Testing Current Backend Configuration")
    print("=" * 50)
    
    print(f"Environment: {settings.ENVIRONMENT}")
    print(f"Debug Mode: {settings.DEBUG}")
    print(f"Port: {settings.PORT}")
    
    print("\n📊 API Keys Status:")
    api_keys = {
        "COINGECKO_API_KEY": settings.COINGECKO_API_KEY,
        "FRED_API_KEY": settings.FRED_API_KEY,
        "NEWS_API_KEY": settings.NEWS_API_KEY,
        "CRYPTO_PANIC_API_KEY": settings.CRYPTO_PANIC_API_KEY,
        "TRADING_ECONOMICS_API_KEY": settings.TRADING_ECONOMICS_API_KEY,
        "WHALE_ALERT_API_KEY": settings.WHALE_ALERT_API_KEY,
    }
    
    configured_keys = 0
    for key_name, key_value in api_keys.items():
        if key_value and key_value != "demo" and key_value != "":
            configured_keys += 1
            print(f"  ✅ {key_name}: Configured")
        else:
            print(f"  ❌ {key_name}: Not configured")
    
    print(f"\n📈 Summary: {configured_keys}/{len(api_keys)} API keys configured")
    
    if configured_keys == 0:
        print("\n🚨 CRITICAL: No API keys configured!")
        print("💡 The backend will fail all external API calls.")
        print("💡 Configure your API keys in the .env file.")
    elif configured_keys < len(api_keys):
        print(f"\n⚠️ WARNING: {len(api_keys) - configured_keys} API keys missing")
        print("💡 Some features may not work without all API keys.")
    else:
        print("\n✅ All API keys configured!")
        print("💡 Backend should work correctly with external APIs.")
    
    print("\n🔧 Next Steps:")
    if configured_keys == 0:
        print("1. Configure API keys in backend/.env file")
        print("2. Restart the backend server")
    else:
        print("1. Start the backend: python -m uvicorn app.main:app --reload")
        print("2. Test the endpoints")

if __name__ == "__main__":
    main() 