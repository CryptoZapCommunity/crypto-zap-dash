#!/usr/bin/env python3
"""
Test script to verify backend connectivity and API endpoints
"""

import asyncio
import sys
import os
import httpx
from datetime import datetime

# Add the backend directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.config import settings


async def test_backend_health():
    """Test if backend is running and healthy"""
    print("\n🏥 Testing Backend Health...")
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Test health endpoint
            response = await client.get("http://localhost:5000/api/health")
            
            if response.status_code == 200:
                data = response.json()
                print(f"  ✅ Backend is running")
                print(f"  📊 Status: {data.get('status', 'unknown')}")
                print(f"  🔧 Environment: {data.get('environment', 'unknown')}")
                print(f"  🕐 Timestamp: {data.get('timestamp', 'unknown')}")
                return True
            else:
                print(f"  ❌ Backend health check failed: {response.status_code}")
                return False
                
    except Exception as e:
        print(f"  ❌ Cannot connect to backend: {e}")
        return False


async def test_market_summary_endpoint():
    """Test market summary endpoint"""
    print("\n📊 Testing Market Summary Endpoint...")
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get("http://localhost:5000/api/market-summary")
            
            if response.status_code == 200:
                data = response.json()
                print(f"  ✅ Market summary endpoint working")
                print(f"  📈 Success: {data.get('success', False)}")
                print(f"  💬 Message: {data.get('message', 'No message')}")
                
                # Check data structure
                market_data = data.get('data', {})
                if market_data:
                    print(f"  💰 Market Cap: ${market_data.get('totalMarketCap', '0')}")
                    print(f"  📊 Volume: ${market_data.get('totalVolume24h', '0')}")
                    print(f"  🪙 BTC Dominance: {market_data.get('btcDominance', '0')}%")
                else:
                    print(f"  ⚠️ No market data in response")
                
                return True
            else:
                print(f"  ❌ Market summary failed: {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"  💬 Error: {error_data.get('detail', 'Unknown error')}")
                except:
                    print(f"  💬 Error: {response.text}")
                return False
                
    except Exception as e:
        print(f"  ❌ Market summary error: {e}")
        return False


async def test_trending_coins_endpoint():
    """Test trending coins endpoint"""
    print("\n📈 Testing Trending Coins Endpoint...")
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get("http://localhost:5000/api/trending-coins")
            
            if response.status_code == 200:
                data = response.json()
                print(f"  ✅ Trending coins endpoint working")
                print(f"  📈 Success: {data.get('success', False)}")
                print(f"  💬 Message: {data.get('message', 'No message')}")
                
                # Check data structure
                trending_data = data.get('data', {})
                gainers = trending_data.get('gainers', [])
                losers = trending_data.get('losers', [])
                
                print(f"  📈 Gainers: {len(gainers)}")
                print(f"  📉 Losers: {len(losers)}")
                
                if gainers:
                    print(f"  🥇 Top Gainer: {gainers[0].get('name', 'Unknown')} ({gainers[0].get('symbol', 'Unknown')})")
                if losers:
                    print(f"  🥉 Top Loser: {losers[0].get('name', 'Unknown')} ({losers[0].get('symbol', 'Unknown')})")
                
                return True
            else:
                print(f"  ❌ Trending coins failed: {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"  💬 Error: {error_data.get('detail', 'Unknown error')}")
                except:
                    print(f"  💬 Error: {response.text}")
                return False
                
    except Exception as e:
        print(f"  ❌ Trending coins error: {e}")
        return False


async def test_news_endpoint():
    """Test news endpoint"""
    print("\n📰 Testing News Endpoint...")
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get("http://localhost:5000/api/news?limit=3")
            
            if response.status_code == 200:
                data = response.json()
                print(f"  ✅ News endpoint working")
                print(f"  📈 Success: {data.get('success', False)}")
                print(f"  💬 Message: {data.get('message', 'No message')}")
                
                # Check data structure
                news_data = data.get('data', [])
                print(f"  📰 Articles: {len(news_data)}")
                
                if news_data:
                    print(f"  📰 First article: {news_data[0].get('title', 'No title')[:50]}...")
                
                return True
            else:
                print(f"  ❌ News endpoint failed: {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"  💬 Error: {error_data.get('detail', 'Unknown error')}")
                except:
                    print(f"  💬 Error: {response.text}")
                return False
                
    except Exception as e:
        print(f"  ❌ News endpoint error: {e}")
        return False


async def test_api_keys_status():
    """Test API keys configuration"""
    print("\n🔑 Testing API Keys Status...")
    
    keys = {
        "COINGECKO_API_KEY": settings.COINGECKO_API_KEY,
        "NEWS_API_KEY": settings.NEWS_API_KEY,
        "CRYPTO_PANIC_API_KEY": settings.CRYPTO_PANIC_API_KEY,
        "TRADING_ECONOMICS_API_KEY": settings.TRADING_ECONOMICS_API_KEY,
        "WHALE_ALERT_API_KEY": settings.WHALE_ALERT_API_KEY,
        "FRED_API_KEY": settings.FRED_API_KEY,
    }
    
    configured_keys = 0
    total_keys = len(keys)
    
    for key_name, key_value in keys.items():
        if key_value and key_value != "demo" and key_value != "":
            print(f"  ✅ {key_name}: Configured")
            configured_keys += 1
        else:
            print(f"  ⚠️ {key_name}: Not configured")
    
    print(f"\n  📊 API Keys Status: {configured_keys}/{total_keys} configured")
    
    if configured_keys == 0:
        print("  🚨 WARNING: No API keys configured! Backend will fail all external API calls.")
        return False
    elif configured_keys < total_keys:
        print("  ⚠️ WARNING: Some API keys are missing. Some features may not work.")
        return False
    else:
        print("  ✅ All API keys are configured!")
        return True


async def main():
    """Run all connectivity tests"""
    print("🚀 Starting Backend Connectivity Tests...")
    print(f"🔧 Environment: {settings.ENVIRONMENT}")
    print(f"🐛 Debug Mode: {settings.DEBUG}")
    print(f"🌐 Backend URL: http://localhost:5000")
    
    # Test API keys first
    keys_ok = await test_api_keys_status()
    
    # Test backend health
    health_ok = await test_backend_health()
    
    if not health_ok:
        print("\n❌ Backend is not running or not accessible!")
        print("💡 Start the backend with: cd backend && python -m uvicorn app.main:app --reload")
        return
    
    # Test endpoints
    market_ok = await test_market_summary_endpoint()
    trending_ok = await test_trending_coins_endpoint()
    news_ok = await test_news_endpoint()
    
    # Summary
    print("\n📊 Test Summary:")
    print(f"  🔑 API Keys: {'✅' if keys_ok else '❌'}")
    print(f"  🏥 Backend Health: {'✅' if health_ok else '❌'}")
    print(f"  📊 Market Summary: {'✅' if market_ok else '❌'}")
    print(f"  📈 Trending Coins: {'✅' if trending_ok else '❌'}")
    print(f"  📰 News: {'✅' if news_ok else '❌'}")
    
    if all([keys_ok, health_ok, market_ok, trending_ok, news_ok]):
        print("\n✅ All tests passed! Backend is working correctly.")
    else:
        print("\n❌ Some tests failed. Check the issues above.")
        
        if not keys_ok:
            print("\n💡 Solution: Configure API keys in backend/.env file")
        if not health_ok:
            print("\n💡 Solution: Start the backend server")
        if not market_ok or not trending_ok:
            print("\n💡 Solution: Check API keys and external API connectivity")


if __name__ == "__main__":
    asyncio.run(main()) 