#!/usr/bin/env python3
"""
Script to check .env configuration
"""

import os
import sys
from pathlib import Path

def check_env_file():
    """Check if .env file exists and has required keys"""
    print("🔍 Checking .env configuration...")
    
    # Check if .env file exists
    env_path = Path("backend/.env")
    if not env_path.exists():
        print("❌ .env file not found in backend directory")
        print("💡 Create .env file with your API keys:")
        print("   cp backend/env.example backend/.env")
        print("   # Then edit backend/.env with your API keys")
        return False
    
    print("✅ .env file found")
    
    # Read .env file
    try:
        with open(env_path, 'r') as f:
            env_content = f.read()
        
        # Check for required API keys
        required_keys = [
            "COINGECKO_API_KEY",
            "NEWS_API_KEY", 
            "CRYPTO_PANIC_API_KEY",
            "TRADING_ECONOMICS_API_KEY",
            "WHALE_ALERT_API_KEY",
            "FRED_API_KEY"
        ]
        
        missing_keys = []
        configured_keys = []
        
        for key in required_keys:
            if f"{key}=" in env_content:
                # Check if it's not empty or demo
                lines = env_content.split('\n')
                for line in lines:
                    if line.startswith(f"{key}="):
                        value = line.split('=', 1)[1].strip()
                        if value and value != "demo" and value != '""' and value != "''":
                            configured_keys.append(key)
                            print(f"  ✅ {key}: Configured")
                        else:
                            missing_keys.append(key)
                            print(f"  ⚠️ {key}: Not configured (empty or demo)")
                        break
                else:
                    missing_keys.append(key)
                    print(f"  ❌ {key}: Missing")
            else:
                missing_keys.append(key)
                print(f"  ❌ {key}: Missing")
        
        print(f"\n📊 Configuration Summary:")
        print(f"  ✅ Configured: {len(configured_keys)}/{len(required_keys)}")
        print(f"  ❌ Missing: {len(missing_keys)}")
        
        if len(configured_keys) == 0:
            print("\n🚨 CRITICAL: No API keys configured!")
            print("💡 You need to configure at least one API key to use the backend.")
            print("💡 Get free API keys from:")
            print("   - CoinGecko: https://www.coingecko.com/en/api")
            print("   - NewsAPI: https://newsapi.org/")
            print("   - FRED: https://fred.stlouisfed.org/docs/api/api_key.html")
            return False
        elif len(missing_keys) > 0:
            print(f"\n⚠️ WARNING: {len(missing_keys)} API keys missing")
            print("💡 Some features may not work without all API keys")
            return True
        else:
            print("\n✅ All API keys configured!")
            return True
            
    except Exception as e:
        print(f"❌ Error reading .env file: {e}")
        return False

def main():
    """Main function"""
    print("🚀 .env Configuration Check")
    print("=" * 40)
    
    # Change to backend directory
    backend_dir = Path("backend")
    if backend_dir.exists():
        os.chdir(backend_dir)
        print(f"📁 Working directory: {os.getcwd()}")
    else:
        print("❌ Backend directory not found")
        return
    
    # Check .env configuration
    config_ok = check_env_file()
    
    if config_ok:
        print("\n✅ .env configuration is ready!")
        print("💡 You can now start the backend")
    else:
        print("\n❌ .env configuration needs attention")
        print("💡 Configure your API keys before starting the backend")

if __name__ == "__main__":
    main() 