#!/usr/bin/env python3
"""
Teste de Integração Completa Frontend-Backend
Simula as chamadas que o frontend faz e verifica se os dados estão corretos
"""

import requests
import json
import time
from datetime import datetime

def test_complete_integration():
    print("🚀 Teste de Integração Completa Frontend-Backend")
    print("=" * 60)
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # URLs
    backend_url = "http://localhost:5000"
    frontend_url = "http://localhost:3000"
    
    # Teste 1: Verificar se ambos estão rodando
    print("\n🔍 Teste 1: Verificando se os serviços estão rodando...")
    
    try:
        backend_response = requests.get(f"{backend_url}/api/health", timeout=10)
        print(f"✅ Backend: {backend_response.status_code}")
    except Exception as e:
        print(f"❌ Backend: {e}")
        return
    
    try:
        frontend_response = requests.get(frontend_url, timeout=10)
        print(f"✅ Frontend: {frontend_response.status_code}")
    except Exception as e:
        print(f"❌ Frontend: {e}")
        return
    
    # Teste 2: Simular chamadas do frontend
    print("\n🔍 Teste 2: Simulando chamadas do frontend...")
    
    endpoints_to_test = [
        "/api/market-summary",
        "/api/trending-coins", 
        "/api/crypto-overview",
        "/api/news",
        "/api/economic-calendar",
        "/api/whale-transactions",
        "/api/airdrops"
    ]
    
    results = {}
    
    for endpoint in endpoints_to_test:
        try:
            print(f"\n📊 Testando {endpoint}...")
            response = requests.get(f"{backend_url}{endpoint}", timeout=15)
            
            if response.status_code == 200:
                data = response.json()
                results[endpoint] = {
                    "status": "success",
                    "status_code": response.status_code,
                    "success": data.get("success", False),
                    "has_data": bool(data.get("data")),
                    "data_type": type(data.get("data")).__name__,
                    "message": data.get("message", "")
                }
                
                print(f"✅ {endpoint}: {response.status_code}")
                print(f"   Success: {data.get('success')}")
                print(f"   Has Data: {bool(data.get('data'))}")
                print(f"   Message: {data.get('message', '')}")
                
                # Verificar estrutura específica para endpoints importantes
                if endpoint == "/api/market-summary" and data.get("data"):
                    market_data = data["data"]
                    print(f"   📊 Market Data:")
                    print(f"      - Total Market Cap: {market_data.get('totalMarketCap', 'N/A')}")
                    print(f"      - BTC Dominance: {market_data.get('btcDominance', 'N/A')}")
                    print(f"      - Market Change 24h: {market_data.get('marketChange24h', 'N/A')}")
                
                elif endpoint == "/api/trending-coins" and data.get("data"):
                    trending_data = data["data"]
                    gainers = trending_data.get("gainers", [])
                    losers = trending_data.get("losers", [])
                    print(f"   🪙 Trending Data:")
                    print(f"      - Gainers: {len(gainers)} items")
                    print(f"      - Losers: {len(losers)} items")
                    
                    if gainers:
                        first_gainer = gainers[0]
                        print(f"      - First Gainer: {first_gainer.get('symbol', 'N/A')} - {first_gainer.get('priceChange24h', 'N/A')}%")
                    
                    if losers:
                        first_loser = losers[0]
                        print(f"      - First Loser: {first_loser.get('symbol', 'N/A')} - {first_loser.get('priceChange24h', 'N/A')}%")
                
                elif endpoint == "/api/crypto-overview" and data.get("data"):
                    overview_data = data["data"]
                    assets = overview_data.get("assets", [])
                    market_summary = overview_data.get("marketSummary", {})
                    print(f"   📈 Overview Data:")
                    print(f"      - Assets: {len(assets)} items")
                    print(f"      - Has Market Summary: {bool(market_summary)}")
                    
                    if assets:
                        first_asset = assets[0]
                        print(f"      - First Asset: {first_asset.get('symbol', 'N/A')} - {first_asset.get('price', 'N/A')}")
                
            else:
                results[endpoint] = {
                    "status": "error",
                    "status_code": response.status_code,
                    "error": f"HTTP {response.status_code}"
                }
                print(f"❌ {endpoint}: {response.status_code}")
                
        except Exception as e:
            results[endpoint] = {
                "status": "error",
                "error": str(e)
            }
            print(f"❌ {endpoint}: {e}")
    
    # Teste 3: Verificar se os dados estão no formato esperado pelo frontend
    print("\n🔍 Teste 3: Verificando formato dos dados...")
    
    # Verificar market-summary
    if "/api/market-summary" in results and results["/api/market-summary"]["status"] == "success":
        try:
            response = requests.get(f"{backend_url}/api/market-summary", timeout=10)
            data = response.json()
            market_data = data.get("data", {})
            
            required_fields = ["totalMarketCap", "totalVolume24h", "btcDominance", "marketChange24h"]
            missing_fields = [field for field in required_fields if field not in market_data]
            
            if missing_fields:
                print(f"⚠️ Market Summary - campos faltando: {missing_fields}")
            else:
                print("✅ Market Summary - todos os campos obrigatórios presentes")
                
                # Verificar se os campos são strings (como esperado pelo frontend)
                numeric_fields = ["totalMarketCap", "totalVolume24h", "btcDominance", "marketChange24h"]
                string_fields = [field for field in numeric_fields if isinstance(market_data.get(field), str)]
                
                if len(string_fields) == len(numeric_fields):
                    print("✅ Market Summary - todos os campos numéricos estão como string (correto)")
                else:
                    print(f"⚠️ Market Summary - alguns campos não estão como string: {[f for f in numeric_fields if f not in string_fields]}")
                    
        except Exception as e:
            print(f"❌ Erro ao verificar market-summary: {e}")
    
    # Verificar trending-coins
    if "/api/trending-coins" in results and results["/api/trending-coins"]["status"] == "success":
        try:
            response = requests.get(f"{backend_url}/api/trending-coins", timeout=10)
            data = response.json()
            trending_data = data.get("data", {})
            
            if "gainers" in trending_data and "losers" in trending_data:
                print("✅ Trending Coins - estrutura correta (gainers/losers)")
                
                # Verificar se os coins têm os campos obrigatórios
                if trending_data["gainers"]:
                    first_gainer = trending_data["gainers"][0]
                    required_coin_fields = ["id", "symbol", "name", "price", "priceChange24h"]
                    missing_coin_fields = [field for field in required_coin_fields if field not in first_gainer]
                    
                    if missing_coin_fields:
                        print(f"⚠️ Trending Coins - campos faltando no primeiro gainer: {missing_coin_fields}")
                    else:
                        print("✅ Trending Coins - todos os campos obrigatórios presentes")
                        
                        # Verificar se os campos numéricos são strings
                        numeric_coin_fields = ["price", "priceChange24h", "marketCap", "volume24h"]
                        string_coin_fields = [field for field in numeric_coin_fields if isinstance(first_gainer.get(field), str)]
                        
                        if len(string_coin_fields) == len(numeric_coin_fields):
                            print("✅ Trending Coins - todos os campos numéricos estão como string (correto)")
                        else:
                            print(f"⚠️ Trending Coins - alguns campos não estão como string: {[f for f in numeric_coin_fields if f not in string_coin_fields]}")
            else:
                print("⚠️ Trending Coins - estrutura incorreta (faltando gainers/losers)")
                
        except Exception as e:
            print(f"❌ Erro ao verificar trending-coins: {e}")
    
    # Resumo final
    print("\n" + "=" * 60)
    print("📋 RESUMO FINAL")
    print("=" * 60)
    
    successful_endpoints = [ep for ep, result in results.items() if result["status"] == "success"]
    failed_endpoints = [ep for ep, result in results.items() if result["status"] == "error"]
    
    print(f"✅ Endpoints funcionando: {len(successful_endpoints)}/{len(endpoints_to_test)}")
    print(f"❌ Endpoints com erro: {len(failed_endpoints)}/{len(endpoints_to_test)}")
    
    if successful_endpoints:
        print("\n✅ Endpoints funcionando:")
        for endpoint in successful_endpoints:
            result = results[endpoint]
            print(f"   - {endpoint}: {result['status_code']} - {result['message']}")
    
    if failed_endpoints:
        print("\n❌ Endpoints com erro:")
        for endpoint in failed_endpoints:
            result = results[endpoint]
            error_msg = result.get("error", "Unknown error")
            print(f"   - {endpoint}: {error_msg}")
    
    print("\n🎯 PRÓXIMOS PASSOS:")
    print("1. Abrir http://localhost:3000 no navegador")
    print("2. Abrir DevTools (F12) e verificar console")
    print("3. Executar o script debug-frontend.js no console")
    print("4. Verificar se os dados estão sendo exibidos corretamente")
    
    return len(successful_endpoints) == len(endpoints_to_test)

if __name__ == "__main__":
    success = test_complete_integration()
    exit(0 if success else 1) 