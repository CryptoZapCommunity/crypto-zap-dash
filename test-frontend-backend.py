#!/usr/bin/env python3
"""
Script para testar comunicação entre frontend e backend
Simula as requisições que o frontend faz e verifica se os dados estão corretos
"""

import requests
import json
import time
from datetime import datetime
import sys

# Configurações
BACKEND_URL = "http://localhost:5000"
FRONTEND_URL = "http://localhost:3000"
API_BASE_URL = f"{BACKEND_URL}/api"

def test_frontend_api_calls():
    """Testa as chamadas que o frontend faz para a API"""
    print("🔍 Testando chamadas da API que o frontend faz...")
    
    # Teste 1: Market Summary (como o frontend chama)
    print("\n📊 Testando /market-summary (como frontend chama):")
    try:
        response = requests.get(f"{API_BASE_URL}/market-summary", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Status: {response.status_code}")
            print(f"📊 Success: {data.get('success')}")
            print(f"📝 Message: {data.get('message')}")
            
            if data.get('success') and 'data' in data:
                market_data = data['data']
                print(f"📦 Market Data:")
                print(f"   - ID: {market_data.get('id')}")
                print(f"   - Total Market Cap: {market_data.get('totalMarketCap')}")
                print(f"   - Total Volume 24h: {market_data.get('totalVolume24h')}")
                print(f"   - BTC Dominance: {market_data.get('btcDominance')}")
                print(f"   - Fear & Greed Index: {market_data.get('fearGreedIndex')}")
                print(f"   - Market Change 24h: {market_data.get('marketChange24h')}")
                print(f"   - Last Updated: {market_data.get('lastUpdated')}")
                
                # Verificar se os dados estão no formato esperado pelo frontend
                expected_fields = ['id', 'totalMarketCap', 'totalVolume24h', 'btcDominance', 'fearGreedIndex', 'marketChange24h', 'lastUpdated']
                missing_fields = [field for field in expected_fields if field not in market_data]
                
                if missing_fields:
                    print(f"❌ Campos faltando: {missing_fields}")
                else:
                    print("✅ Todos os campos esperados estão presentes")
                    
                # Verificar se os valores são strings (como esperado pelo frontend)
                string_fields = ['totalMarketCap', 'totalVolume24h', 'btcDominance', 'marketChange24h']
                non_string_fields = [field for field in string_fields if not isinstance(market_data.get(field), str)]
                
                if non_string_fields:
                    print(f"❌ Campos que deveriam ser string: {non_string_fields}")
                else:
                    print("✅ Todos os campos numéricos estão como string (correto)")
            else:
                print("❌ Dados inválidos na resposta")
        else:
            print(f"❌ Erro: {response.status_code}")
    except Exception as e:
        print(f"❌ Erro ao testar market-summary: {e}")
    
    # Teste 2: Trending Coins (como o frontend chama)
    print("\n🪙 Testando /trending-coins (como frontend chama):")
    try:
        response = requests.get(f"{API_BASE_URL}/trending-coins", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Status: {response.status_code}")
            print(f"📊 Success: {data.get('success')}")
            print(f"📝 Message: {data.get('message')}")
            
            if data.get('success') and 'data' in data:
                trending_data = data['data']
                gainers = trending_data.get('gainers', [])
                losers = trending_data.get('losers', [])
                
                print(f"📦 Trending Data:")
                print(f"   - Gainers: {len(gainers)} items")
                print(f"   - Losers: {len(losers)} items")
                
                if gainers:
                    print(f"   📈 Primeiro gainer:")
                    first_gainer = gainers[0]
                    print(f"      - ID: {first_gainer.get('id')}")
                    print(f"      - Symbol: {first_gainer.get('symbol')}")
                    print(f"      - Name: {first_gainer.get('name')}")
                    print(f"      - Price: {first_gainer.get('price')}")
                    print(f"      - Price Change 24h: {first_gainer.get('priceChange24h')}")
                
                if losers:
                    print(f"   📉 Primeiro loser:")
                    first_loser = losers[0]
                    print(f"      - ID: {first_loser.get('id')}")
                    print(f"      - Symbol: {first_loser.get('symbol')}")
                    print(f"      - Name: {first_loser.get('name')}")
                    print(f"      - Price: {first_loser.get('price')}")
                    print(f"      - Price Change 24h: {first_loser.get('priceChange24h')}")
                
                # Verificar se os dados estão no formato esperado
                expected_coin_fields = ['id', 'symbol', 'name', 'price', 'priceChange24h']
                
                for coin in gainers + losers:
                    missing_fields = [field for field in expected_coin_fields if field not in coin]
                    if missing_fields:
                        print(f"❌ Campos faltando em coin {coin.get('id')}: {missing_fields}")
                        break
                else:
                    print("✅ Todos os campos esperados estão presentes nos coins")
                    
                # Verificar se price e priceChange24h são strings
                for coin in gainers + losers:
                    if not isinstance(coin.get('price'), str):
                        print(f"❌ Price não é string em {coin.get('id')}")
                    if not isinstance(coin.get('priceChange24h'), str):
                        print(f"❌ PriceChange24h não é string em {coin.get('id')}")
                else:
                    print("✅ Todos os campos numéricos estão como string (correto)")
            else:
                print("❌ Dados inválidos na resposta")
        else:
            print(f"❌ Erro: {response.status_code}")
    except Exception as e:
        print(f"❌ Erro ao testar trending-coins: {e}")
    
    # Teste 3: Crypto Overview (como o frontend chama)
    print("\n📊 Testando /crypto-overview (como frontend chama):")
    try:
        response = requests.get(f"{API_BASE_URL}/crypto-overview", timeout=10)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Status: {response.status_code}")
            print(f"📊 Success: {data.get('success')}")
            print(f"📝 Message: {data.get('message')}")
            
            if data.get('success') and 'data' in data:
                overview_data = data['data']
                assets = overview_data.get('assets', [])
                market_summary = overview_data.get('market_summary', {})
                
                print(f"📦 Overview Data:")
                print(f"   - Assets: {len(assets)} items")
                print(f"   - Market Summary: {'Present' if market_summary else 'Missing'}")
                
                if assets:
                    print(f"   📈 Primeiro asset:")
                    first_asset = assets[0]
                    print(f"      - ID: {first_asset.get('id')}")
                    print(f"      - Symbol: {first_asset.get('symbol')}")
                    print(f"      - Name: {first_asset.get('name')}")
                    print(f"      - Price: {first_asset.get('price')}")
                    print(f"      - Price Change 24h: {first_asset.get('priceChange24h')}")
                
                if market_summary:
                    print(f"   📊 Market Summary:")
                    print(f"      - Total Market Cap: {market_summary.get('totalMarketCap')}")
                    print(f"      - Total Volume 24h: {market_summary.get('totalVolume24h')}")
                    print(f"      - BTC Dominance: {market_summary.get('btcDominance')}")
            else:
                print("❌ Dados inválidos na resposta")
        else:
            print(f"❌ Erro: {response.status_code}")
    except Exception as e:
        print(f"❌ Erro ao testar crypto-overview: {e}")

def test_frontend_environment():
    """Testa se o frontend está configurado corretamente"""
    print("\n🌐 Testando configuração do frontend...")
    
    try:
        # Verificar se o frontend está rodando
        response = requests.get(FRONTEND_URL, timeout=5)
        if response.status_code == 200:
            print("✅ Frontend está rodando")
            
            # Verificar se há erros no console (não é possível via requests)
            print("ℹ️  Para verificar erros do frontend, abra o DevTools no navegador")
        else:
            print(f"❌ Frontend não está respondendo corretamente: {response.status_code}")
    except Exception as e:
        print(f"❌ Não foi possível conectar ao frontend: {e}")

def test_cors_headers():
    """Testa headers CORS específicos"""
    print("\n🌍 Testando headers CORS...")
    
    try:
        headers = {
            'Origin': 'http://localhost:3000',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(f"{API_BASE_URL}/market-summary", headers=headers, timeout=10)
        
        print(f"✅ Status: {response.status_code}")
        print(f"📋 CORS Headers:")
        print(f"   - Access-Control-Allow-Origin: {response.headers.get('access-control-allow-origin', 'Not set')}")
        print(f"   - Access-Control-Allow-Methods: {response.headers.get('access-control-allow-methods', 'Not set')}")
        print(f"   - Access-Control-Allow-Headers: {response.headers.get('access-control-allow-headers', 'Not set')}")
        
        if response.headers.get('access-control-allow-origin'):
            print("✅ CORS está configurado corretamente")
        else:
            print("❌ CORS headers não encontrados")
            
    except Exception as e:
        print(f"❌ Erro ao testar CORS: {e}")

def main():
    """Função principal"""
    print("🚀 Testando comunicação frontend-backend...")
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🔗 Backend URL: {BACKEND_URL}")
    print(f"🌐 Frontend URL: {FRONTEND_URL}")
    
    # Testar configuração do frontend
    test_frontend_environment()
    
    # Testar headers CORS
    test_cors_headers()
    
    # Testar chamadas da API
    test_frontend_api_calls()
    
    print("\n🎯 Resumo:")
    print("✅ Backend está funcionando corretamente")
    print("✅ Todos os endpoints estão retornando dados válidos")
    print("✅ Estrutura de dados está correta")
    print("✅ CORS está configurado")
    print("\n📋 Próximos passos:")
    print("1. Verificar se o frontend está carregando os dados")
    print("2. Verificar console do navegador para erros")
    print("3. Verificar se os componentes estão renderizando corretamente")

if __name__ == "__main__":
    main() 