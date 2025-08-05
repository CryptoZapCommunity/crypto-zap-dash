#!/usr/bin/env python3
"""
Test script for API health and CORS
Equivalent to the original test-api-health.js
"""

import asyncio
import httpx
import json
from datetime import datetime


BASE_URL = "http://localhost:5000"


async def test_endpoint(client: httpx.AsyncClient, endpoint: str):
    """Test a single endpoint and return results"""
    try:
        print(f"🔍 Testing {endpoint}...")
        response = await client.get(f"{BASE_URL}{endpoint}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ {endpoint}: {response.status_code}")
            print(f"   Data: {json.dumps(data, indent=2)[:200]}...")
            
            # Check CORS headers
            cors_headers = {
                'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
                'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
                'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
            }
            print(f"   CORS Headers: {cors_headers}")
            
            return True
        else:
            print(f"❌ {endpoint}: {response.status_code}")
            print(f"   Error: {response.text}")
            return False
            
    except Exception as error:
        print(f"❌ Error testing {endpoint}: {error}")
        return False


async def run_tests():
    """Run all health and CORS tests"""
    print("🧪 Testing API Health and CORS...")
    print("=" * 50)
    
    async with httpx.AsyncClient() as client:
        # Test health endpoint
        await test_endpoint(client, "/api/health")
        
        # Test CORS endpoint  
        await test_endpoint(client, "/api/cors-test")
        
        # Test simple endpoint
        await test_endpoint(client, "/api/test")
        
        # Test OPTIONS request for CORS
        try:
            print("🔍 Testing OPTIONS request for CORS...")
            response = await client.options(f"{BASE_URL}/api/cors-test")
            print(f"✅ OPTIONS request: {response.status_code}")
            print(f"   CORS Headers: {dict(response.headers)}")
        except Exception as error:
            print(f"❌ OPTIONS request failed: {error}")
    
    print("=" * 50)
    print("🏁 Health and CORS tests completed!")


if __name__ == "__main__":
    asyncio.run(run_tests())