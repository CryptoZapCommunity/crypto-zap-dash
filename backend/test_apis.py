#!/usr/bin/env python3
"""
Test script to verify all APIs are working correctly
"""

import asyncio
import sys
import os

# Add the backend directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.config import settings
from app.services.crypto_service import CryptoService
from app.services.news_service import NewsService
from app.services.economic_service import EconomicService
from app.services.whale_service import WhaleService
from app.services.fred_service import FredService
from app.services.airdrop_service import AirdropService


async def test_crypto_service():
    """Test CryptoService APIs"""
    print("\n🪙 Testing CryptoService...")
    
    service = CryptoService()
    
    # Test trending coins
    print("  📈 Testing trending coins...")
    try:
        trending = await service.get_trending_coins()
        gainers = trending.get("gainers", [])
        losers = trending.get("losers", [])
        print(f"    ✅ Found {len(gainers)} gainers, {len(losers)} losers")
    except Exception as e:
        print(f"    ❌ Error: {e}")
    
    # Test market summary
    print("  📊 Testing market summary...")
    try:
        summary = await service.update_market_summary()
        if summary:
            print(f"    ✅ Market Cap: ${summary.get('totalMarketCap', '0')}")
            print(f"    ✅ Volume: ${summary.get('totalVolume24h', '0')}")
        else:
            print("    ⚠️ No market summary data")
    except Exception as e:
        print(f"    ❌ Error: {e}")
    
    # Test chart data
    print("  📈 Testing chart data...")
    try:
        chart = await service.get_chart_data("bitcoin")
        if chart and chart.get("prices"):
            print(f"    ✅ Chart data: {len(chart['prices'])} price points")
        else:
            print("    ⚠️ No chart data")
    except Exception as e:
        print(f"    ❌ Error: {e}")


async def test_news_service():
    """Test NewsService APIs"""
    print("\n📰 Testing NewsService...")
    
    service = NewsService()
    
    # Test general news
    print("  📰 Testing general news...")
    try:
        news = await service.get_news(limit=5)
        print(f"    ✅ Found {len(news)} news articles")
        for article in news[:2]:
            print(f"      - {article.get('title', 'No title')[:50]}...")
    except Exception as e:
        print(f"    ❌ Error: {e}")


async def test_economic_service():
    """Test EconomicService APIs"""
    print("\n📅 Testing EconomicService...")
    
    service = EconomicService()
    
    # Test economic events
    print("  📅 Testing economic events...")
    try:
        events = await service.get_economic_events(days=7)
        print(f"    ✅ Found {len(events)} economic events")
        for event in events[:2]:
            print(f"      - {event.get('title', 'No title')[:50]}...")
    except Exception as e:
        print(f"    ❌ Error: {e}")


async def test_whale_service():
    """Test WhaleService APIs"""
    print("\n🐋 Testing WhaleService...")
    
    service = WhaleService()
    
    # Test whale transactions
    print("  🐋 Testing whale transactions...")
    try:
        transactions = await service.update_whale_transactions()
        print(f"    ✅ Found {len(transactions)} whale transactions")
        for tx in transactions[:2]:
            print(f"      - {tx.get('asset', 'Unknown')}: ${tx.get('valueUsd', '0')}")
    except Exception as e:
        print(f"    ❌ Error: {e}")


async def test_fred_service():
    """Test FredService APIs"""
    print("\n🏦 Testing FredService...")
    
    service = FredService()
    
    # Test Federal Funds Rate
    print("  🏦 Testing Federal Funds Rate...")
    try:
        rate = await service.get_federal_funds_rate()
        if rate:
            print(f"    ✅ Federal Funds Rate: {rate.get('rate', 'Unknown')}%")
        else:
            print("    ⚠️ No rate data")
    except Exception as e:
        print(f"    ❌ Error: {e}")
    
    # Test indicators
    print("  📈 Testing FRED indicators...")
    try:
        indicators = await service.get_all_indicators()
        print(f"    ✅ Found {len(indicators)} indicators")
        for indicator in indicators[:2]:
            print(f"      - {indicator.get('title', 'No title')[:50]}...")
    except Exception as e:
        print(f"    ❌ Error: {e}")


async def test_airdrop_service():
    """Test AirdropService APIs"""
    print("\n🎁 Testing AirdropService...")
    
    service = AirdropService()
    
    # Test airdrops
    print("  🎁 Testing airdrops...")
    try:
        airdrops = await service.get_airdrops()
        print(f"    ✅ Found {len(airdrops)} airdrops")
        for airdrop in airdrops[:2]:
            print(f"      - {airdrop.get('projectName', 'Unknown')}")
    except Exception as e:
        print(f"    ❌ Error: {e}")


async def test_api_keys():
    """Test if API keys are configured"""
    print("\n🔑 Testing API Keys Configuration...")
    
    keys = {
        "COINGECKO_API_KEY": settings.COINGECKO_API_KEY,
        "NEWS_API_KEY": settings.NEWS_API_KEY,
        "CRYPTO_PANIC_API_KEY": settings.CRYPTO_PANIC_API_KEY,
        "TRADING_ECONOMICS_API_KEY": settings.TRADING_ECONOMICS_API_KEY,
        "WHALE_ALERT_API_KEY": settings.WHALE_ALERT_API_KEY,
        "FRED_API_KEY": settings.FRED_API_KEY,
    }
    
    for key_name, key_value in keys.items():
        if key_value and key_value != "demo" and key_value != "":
            print(f"  ✅ {key_name}: Configured")
        else:
            print(f"  ⚠️ {key_name}: Not configured (will use mock data)")


async def main():
    """Run all API tests"""
    print("🚀 Starting API Tests...")
    print(f"🔧 Environment: {settings.ENVIRONMENT}")
    print(f"🐛 Debug Mode: {settings.DEBUG}")
    
    # Test API keys first
    await test_api_keys()
    
    # Test all services
    await test_crypto_service()
    await test_news_service()
    await test_economic_service()
    await test_whale_service()
    await test_fred_service()
    await test_airdrop_service()
    
    print("\n✅ API Tests Completed!")


if __name__ == "__main__":
    asyncio.run(main()) 