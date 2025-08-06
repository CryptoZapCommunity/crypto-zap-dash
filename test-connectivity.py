#!/usr/bin/env python3
"""
Script para testar conectividade entre frontend e backend
Testa todos os endpoints principais e verifica se estão funcionando
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

# Endpoints para testar
ENDPOINTS = [
    "/health",
    "/test",
    "/cors-test",
    "/market-summary",
    "/trending-coins",
    "/news",
    "/economic-calendar",
    "/whale-transactions",
    "/fed/indicators",
    "/airdrops",
    "/market-sentiment",
    "/crypto-overview"
]

def test_endpoint(endpoint, description=""):
    """Testa um endpoint específico"""
    url = f"{API_BASE_URL}{endpoint}"
    print(f"\n🔍 Testando: {endpoint}")
    print(f"   URL: {url}")
    
    try:
        start_time = time.time()
        response = requests.get(url, timeout=10)
        duration = (time.time() - start_time) * 1000
        
        print(f"   ✅ Status: {response.status_code}")
        print(f"   ⏱️  Tempo: {duration:.2f}ms")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   📊 Success: {data.get('success', 'N/A')}")
            print(f"   📝 Message: {data.get('message', 'N/A')}")
            
            # Verificar se há dados
            if 'data' in data:
                if isinstance(data['data'], dict):
                    print(f"   📦 Data keys: {list(data['data'].keys())}")
                elif isinstance(data['data'], list):
                    print(f"   📦 Data items: {len(data['data'])}")
                else:
                    print(f"   📦 Data type: {type(data['data'])}")
            
            return True, data
        else:
            print(f"   ❌ Erro: {response.status_code} - {response.text}")
            return False, None
            
    except requests.exceptions.ConnectionError:
        print(f"   ❌ Erro: Não foi possível conectar ao backend")
        return False, None
    except requests.exceptions.Timeout:
        print(f"   ❌ Erro: Timeout na requisição")
        return False, None
    except Exception as e:
        print(f"   ❌ Erro: {str(e)}")
        return False, None

def test_backend_health():
    """Testa se o backend está rodando"""
    print("🏥 Testando saúde do backend...")
    
    try:
        response = requests.get(f"{BACKEND_URL}/api/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Backend está saudável!")
            print(f"   Environment: {data.get('data', {}).get('environment', 'N/A')}")
            print(f"   Timestamp: {data.get('data', {}).get('timestamp', 'N/A')}")
            return True
        else:
            print(f"❌ Backend não está respondendo corretamente")
            return False
    except Exception as e:
        print(f"❌ Não foi possível conectar ao backend: {e}")
        return False

def test_frontend_health():
    """Testa se o frontend está rodando"""
    print("\n🌐 Testando saúde do frontend...")
    
    try:
        response = requests.get(FRONTEND_URL, timeout=5)
        if response.status_code == 200:
            print(f"✅ Frontend está rodando em {FRONTEND_URL}")
            return True
        else:
            print(f"❌ Frontend não está respondendo corretamente")
            return False
    except Exception as e:
        print(f"❌ Não foi possível conectar ao frontend: {e}")
        return False

def test_cors():
    """Testa configuração CORS"""
    print("\n🌍 Testando configuração CORS...")
    
    try:
        headers = {
            'Origin': 'http://localhost:3000',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(f"{API_BASE_URL}/cors-test", headers=headers, timeout=5)
        
        if response.status_code == 200:
            print("✅ CORS está configurado corretamente")
            cors_headers = response.headers.get('access-control-allow-origin', '')
            print(f"   CORS Headers: {cors_headers}")
            return True
        else:
            print(f"❌ CORS não está funcionando: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Erro ao testar CORS: {e}")
        return False

def analyze_data_structure(data, endpoint):
    """Analisa a estrutura de dados retornada"""
    if not data or not isinstance(data, dict):
        return
    
    print(f"\n📊 Análise da estrutura de dados para {endpoint}:")
    
    if 'data' in data:
        data_content = data['data']
        
        if isinstance(data_content, dict):
            print(f"   📦 Tipo: Objeto com {len(data_content)} chaves")
            for key, value in data_content.items():
                if isinstance(value, list):
                    print(f"   📋 {key}: Lista com {len(value)} itens")
                elif isinstance(value, dict):
                    print(f"   📋 {key}: Objeto com {len(value)} chaves")
                else:
                    print(f"   📋 {key}: {type(value).__name__} = {value}")
        
        elif isinstance(data_content, list):
            print(f"   📦 Tipo: Lista com {len(data_content)} itens")
            if data_content:
                first_item = data_content[0]
                if isinstance(first_item, dict):
                    print(f"   📋 Primeiro item tem {len(first_item)} chaves")
                    for key, value in first_item.items():
                        print(f"   📋 {key}: {type(value).__name__}")
        
        else:
            print(f"   📦 Tipo: {type(data_content).__name__}")

def main():
    """Função principal"""
    print("🚀 Iniciando testes de conectividade...")
    print(f"📅 {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🔗 Backend URL: {BACKEND_URL}")
    print(f"🌐 Frontend URL: {FRONTEND_URL}")
    
    # Testar saúde do backend
    backend_ok = test_backend_health()
    if not backend_ok:
        print("\n❌ Backend não está disponível. Verifique se está rodando.")
        sys.exit(1)
    
    # Testar saúde do frontend
    frontend_ok = test_frontend_health()
    if not frontend_ok:
        print("\n⚠️  Frontend não está disponível, mas continuando testes...")
    
    # Testar CORS
    cors_ok = test_cors()
    
    # Testar endpoints
    print(f"\n🔍 Testando {len(ENDPOINTS)} endpoints...")
    
    results = {}
    successful_endpoints = 0
    
    for endpoint in ENDPOINTS:
        success, data = test_endpoint(endpoint)
        results[endpoint] = {
            'success': success,
            'data': data
        }
        
        if success:
            successful_endpoints += 1
            analyze_data_structure(data, endpoint)
    
    # Resumo
    print(f"\n📊 RESUMO DOS TESTES")
    print(f"=" * 50)
    print(f"✅ Backend: {'OK' if backend_ok else 'FALHOU'}")
    print(f"🌐 Frontend: {'OK' if frontend_ok else 'FALHOU'}")
    print(f"🌍 CORS: {'OK' if cors_ok else 'FALHOU'}")
    print(f"🔗 Endpoints: {successful_endpoints}/{len(ENDPOINTS)} funcionando")
    
    # Endpoints que falharam
    failed_endpoints = [ep for ep, result in results.items() if not result['success']]
    if failed_endpoints:
        print(f"\n❌ Endpoints que falharam:")
        for endpoint in failed_endpoints:
            print(f"   - {endpoint}")
    
    # Endpoints que funcionaram
    working_endpoints = [ep for ep, result in results.items() if result['success']]
    if working_endpoints:
        print(f"\n✅ Endpoints funcionando:")
        for endpoint in working_endpoints:
            print(f"   - {endpoint}")
    
    print(f"\n🎯 Conclusão:")
    if successful_endpoints == len(ENDPOINTS):
        print("✅ Todos os endpoints estão funcionando corretamente!")
    elif successful_endpoints > len(ENDPOINTS) / 2:
        print("⚠️  A maioria dos endpoints está funcionando, mas alguns precisam de atenção.")
    else:
        print("❌ Muitos endpoints estão falhando. Verifique a configuração do backend.")

if __name__ == "__main__":
    main() 