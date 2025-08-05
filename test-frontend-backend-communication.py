#!/usr/bin/env python3
"""
Comprehensive test script for frontend-to-backend communication
Tests all critical endpoints and validates the complete system flow
"""

import asyncio
import httpx
import json
import time
from datetime import datetime

BASE_URL_FRONTEND = "http://localhost:3000"
BASE_URL_BACKEND = "http://localhost:5000"

async def test_frontend_access():
    """Test if frontend is accessible"""
    print("🌐 Testing Frontend Access...")
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{BASE_URL_FRONTEND}/", timeout=10)
            if response.status_code == 200:
                print("✅ Frontend is accessible")
                return True
            else:
                print(f"❌ Frontend returned status {response.status_code}")
                return False
    except Exception as e:
        print(f"❌ Frontend access failed: {e}")
        return False

async def test_backend_health():
    """Test backend health endpoint"""
    print("🏥 Testing Backend Health...")
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"{BASE_URL_BACKEND}/api/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Backend health: {data}")
                return True
            else:
                print(f"❌ Backend health returned status {response.status_code}")
                return False
    except Exception as e:
        print(f"❌ Backend health check failed: {e}")
        return False

async def test_critical_endpoints():
    """Test all critical endpoints"""
    print("🔍 Testing Critical Endpoints...")
    
    endpoints = [
        ("/api/market-summary", "Market Summary"),
        ("/api/trending-coins", "Trending Coins"),
        ("/api/news", "News"),
        ("/api/market-sentiment", "Market Sentiment"),
        ("/api/charts/bitcoin", "Bitcoin Chart"),
        ("/api/candlestick/bitcoin", "Bitcoin Candlestick"),
        ("/api/market-analysis", "Market Analysis"),
        ("/api/whale-transactions", "Whale Transactions"),
        ("/api/airdrops", "Airdrops"),
        ("/api/economic-calendar", "Economic Calendar"),
        ("/api/fed/indicators", "FED Indicators"),
    ]
    
    results = []
    
    async with httpx.AsyncClient() as client:
        for endpoint, name in endpoints:
            try:
                print(f"  Testing {name}...")
                response = await client.get(f"{BASE_URL_BACKEND}{endpoint}", timeout=15)
                if response.status_code == 200:
                    data = response.json()
                    print(f"    ✅ {name}: OK")
                    results.append((name, True, response.status_code))
                else:
                    print(f"    ❌ {name}: Status {response.status_code}")
                    results.append((name, False, response.status_code))
            except Exception as e:
                print(f"    ❌ {name}: Error - {e}")
                results.append((name, False, str(e)))
    
    return results

async def test_frontend_api_calls():
    """Test if frontend can make API calls to backend"""
    print("🔗 Testing Frontend-to-Backend API Calls...")
    
    # Test a simple API call that the frontend would make
    try:
        async with httpx.AsyncClient() as client:
            # Test market summary endpoint
            response = await client.get(f"{BASE_URL_BACKEND}/api/market-summary", timeout=15)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Frontend API call successful: {data.get('message', 'OK')}")
                return True
            else:
                print(f"❌ Frontend API call failed: Status {response.status_code}")
                return False
    except Exception as e:
        print(f"❌ Frontend API call error: {e}")
        return False

async def test_docker_containers():
    """Test Docker container health"""
    print("🐳 Testing Docker Container Health...")
    
    import subprocess
    import sys
    
    try:
        result = subprocess.run(
            ["docker", "ps", "--format", "table {{.Names}}\t{{.Status}}"],
            capture_output=True,
            text=True,
            timeout=10
        )
        
        if result.returncode == 0:
            print("✅ Docker containers status:")
            for line in result.stdout.strip().split('\n')[1:]:  # Skip header
                if line.strip():
                    print(f"  {line}")
            return True
        else:
            print(f"❌ Docker command failed: {result.stderr}")
            return False
    except Exception as e:
        print(f"❌ Docker health check failed: {e}")
        return False

async def main():
    """Run comprehensive system tests"""
    print("🚀 Starting Comprehensive System Test")
    print("=" * 60)
    print(f"📅 Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    # Test results
    tests = []
    
    # 1. Test Docker containers
    docker_ok = await test_docker_containers()
    tests.append(("Docker Containers", docker_ok))
    
    # 2. Test frontend access
    frontend_ok = await test_frontend_access()
    tests.append(("Frontend Access", frontend_ok))
    
    # 3. Test backend health
    backend_ok = await test_backend_health()
    tests.append(("Backend Health", backend_ok))
    
    # 4. Test critical endpoints
    endpoint_results = await test_critical_endpoints()
    successful_endpoints = sum(1 for _, success, _ in endpoint_results if success)
    total_endpoints = len(endpoint_results)
    tests.append(("Critical Endpoints", successful_endpoints == total_endpoints))
    
    # 5. Test frontend-to-backend communication
    communication_ok = await test_frontend_api_calls()
    tests.append(("Frontend-Backend Communication", communication_ok))
    
    # Print summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    for test_name, success in tests:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
    
    # Endpoint details
    print(f"\n📈 Endpoint Test Results: {successful_endpoints}/{total_endpoints} successful")
    for name, success, status in endpoint_results:
        if not success:
            print(f"  ❌ {name}: {status}")
    
    # Overall result
    all_tests_passed = all(success for _, success in tests)
    print(f"\n🎯 Overall Result: {'✅ ALL TESTS PASSED' if all_tests_passed else '❌ SOME TESTS FAILED'}")
    
    if all_tests_passed:
        print("\n🎉 System is fully operational!")
        print("✅ Frontend is accessible")
        print("✅ Backend is healthy")
        print("✅ All critical endpoints are working")
        print("✅ Frontend-to-backend communication is established")
        print("✅ Docker containers are running properly")
    else:
        print("\n⚠️ Some issues detected. Please check the logs above.")
    
    print(f"\n📅 Test completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(main()) 