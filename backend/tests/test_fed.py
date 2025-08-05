#!/usr/bin/env python3
"""
Test script for Federal Reserve (FED) APIs
Equivalent to the original test-fed.js
"""

import asyncio
import httpx
import json
from datetime import datetime


BASE_URL = "http://localhost:5000"


async def test_fed_apis():
    """Test FED APIs"""
    print("🧪 Testing FED APIs...\n")

    async with httpx.AsyncClient() as client:
        try:
            # Test health endpoint
            print("🔍 Testing health endpoint...")
            health_response = await client.get(f"{BASE_URL}/api/health")
            health_data = health_response.json()
            print("✅ Health:", health_data)
            print("")

            # Test FED indicators
            print("🔍 Testing FRED indicators...")
            fred_response = await client.get(f"{BASE_URL}/api/fed/indicators")
            fred_data = fred_response.json()
            print("✅ FRED indicators:", fred_data)
            print("")

            # Test FRED rate
            print("🔍 Testing FRED rate...")
            rate_response = await client.get(f"{BASE_URL}/api/fed/rate")
            rate_data = rate_response.json()
            print("✅ FRED rate:", rate_data)
            print("")

            # Test FRED rate history
            print("🔍 Testing FRED rate history...")
            history_response = await client.get(f"{BASE_URL}/api/fed/rate-history")
            history_data = history_response.json()
            print("✅ FRED rate history:", history_data)
            print("")

            # Test whale transactions
            print("🔍 Testing whale transactions...")
            whale_response = await client.get(f"{BASE_URL}/api/whale-transactions")
            whale_data = whale_response.json()
            print("✅ Whale transactions:", whale_data)
            print(f"📊 Found {len(whale_data.get('data', []))} whale transactions")
            print("")

            # Test update whale transactions
            print("🔄 Testing update whale transactions...")
            update_whale_response = await client.post(f"{BASE_URL}/api/update/whale")
            update_whale_data = update_whale_response.json()
            print("✅ Update whale transactions:", update_whale_data)
            print("")

        except Exception as error:
            print(f"❌ Error in FED API tests: {error}")

    print("🏁 FED API Tests Completed!")


if __name__ == "__main__":
    asyncio.run(test_fed_apis())