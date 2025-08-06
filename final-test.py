#!/usr/bin/env python3
"""
Teste Final - Verificação Completa do Sistema
"""

import requests
import json
from datetime import datetime

def final_test():
    print("🎯 TESTE FINAL - VERIFICAÇÃO COMPLETA")
    print("=" * 60)
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # URLs
    backend_url = "http://localhost:5000"
    frontend_url = "http://localhost:3000"
    
    print("\n🔍 1. Verificando serviços...")
    
    # Teste backend
    try:
        backend_response = requests.get(f"{backend_url}/api/health", timeout=10)
        print(f"✅ Backend: {backend_response.status_code}")
    except Exception as e:
        print(f"❌ Backend: {e}")
        return False
    
    # Teste frontend
    try:
        frontend_response = requests.get(frontend_url, timeout=10)
        print(f"✅ Frontend: {frontend_response.status_code}")
    except Exception as e:
        print(f"❌ Frontend: {e}")
        return False
    
    print("\n🔍 2. Testando endpoints críticos...")
    
    critical_endpoints = [
        "/api/market-summary",
        "/api/trending-coins",
        "/api/crypto-overview"
    ]
    
    all_success = True
    
    for endpoint in critical_endpoints:
        try:
            response = requests.get(f"{backend_url}{endpoint}", timeout=15)
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("data"):
                    print(f"✅ {endpoint}: OK")
                else:
                    print(f"⚠️ {endpoint}: Resposta inválida")
                    all_success = False
            else:
                print(f"❌ {endpoint}: {response.status_code}")
                all_success = False
        except Exception as e:
            print(f"❌ {endpoint}: {e}")
            all_success = False
    
    print("\n🔍 3. Verificando formato dos dados...")
    
    # Teste específico do market-summary
    try:
        response = requests.get(f"{backend_url}/api/market-summary", timeout=10)
        data = response.json()
        market_data = data.get("data", {})
        
        required_fields = ["totalMarketCap", "totalVolume24h", "btcDominance", "marketChange24h"]
        missing_fields = [field for field in required_fields if field not in market_data]
        
        if missing_fields:
            print(f"❌ Market Summary - campos faltando: {missing_fields}")
            all_success = False
        else:
            print("✅ Market Summary - todos os campos presentes")
            
            # Verificar se são strings
            numeric_fields = ["totalMarketCap", "totalVolume24h", "btcDominance", "marketChange24h"]
            string_fields = [field for field in numeric_fields if isinstance(market_data.get(field), str)]
            
            if len(string_fields) == len(numeric_fields):
                print("✅ Market Summary - campos numéricos como string (correto)")
            else:
                print(f"⚠️ Market Summary - alguns campos não são string: {[f for f in numeric_fields if f not in string_fields]}")
                all_success = False
                
    except Exception as e:
        print(f"❌ Erro ao verificar market-summary: {e}")
        all_success = False
    
    # Teste específico do trending-coins
    try:
        response = requests.get(f"{backend_url}/api/trending-coins", timeout=10)
        data = response.json()
        trending_data = data.get("data", {})
        
        if "gainers" in trending_data and "losers" in trending_data:
            print("✅ Trending Coins - estrutura correta")
            
            gainers = trending_data.get("gainers", [])
            losers = trending_data.get("losers", [])
            
            if gainers and losers:
                print(f"✅ Trending Coins - {len(gainers)} gainers, {len(losers)} losers")
                
                # Verificar primeiro gainer
                first_gainer = gainers[0]
                required_coin_fields = ["id", "symbol", "name", "price", "priceChange24h"]
                missing_coin_fields = [field for field in required_coin_fields if field not in first_gainer]
                
                if missing_coin_fields:
                    print(f"⚠️ Trending Coins - campos faltando no gainer: {missing_coin_fields}")
                    all_success = False
                else:
                    print("✅ Trending Coins - todos os campos obrigatórios presentes")
            else:
                print("⚠️ Trending Coins - sem dados suficientes")
                all_success = False
        else:
            print("❌ Trending Coins - estrutura incorreta")
            all_success = False
            
    except Exception as e:
        print(f"❌ Erro ao verificar trending-coins: {e}")
        all_success = False
    
    print("\n" + "=" * 60)
    print("📋 RESULTADO FINAL")
    print("=" * 60)
    
    if all_success:
        print("🎉 SUCESSO! Sistema funcionando corretamente!")
        print("\n✅ Backend: Funcionando")
        print("✅ Frontend: Acessível")
        print("✅ API Endpoints: Respondendo")
        print("✅ Dados: Formato correto")
        print("✅ Estrutura: Campos obrigatórios presentes")
        
        print("\n🎯 PRÓXIMOS PASSOS:")
        print("1. Abrir http://localhost:3000 no navegador")
        print("2. Verificar se os dados estão sendo exibidos")
        print("3. Se ainda houver problemas, executar debug-api-response.js no console")
        
        return True
    else:
        print("❌ FALHA! Alguns testes não passaram")
        print("\n🔧 PRÓXIMOS PASSOS:")
        print("1. Verificar logs dos containers")
        print("2. Executar debug-api-response.js no console do navegador")
        print("3. Verificar se há erros no console")
        
        return False

if __name__ == "__main__":
    success = final_test()
    exit(0 if success else 1) 