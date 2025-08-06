// Script final para debugar e corrigir o problema
// Execute no console do navegador

console.log('🎯 SCRIPT FINAL DE DEBUG');

// 1. Limpar todo o cache
function clearAllCache() {
  console.log('🧹 Limpando todo o cache...');
  
  const keys = Object.keys(localStorage);
  const apiKeys = keys.filter(key => key.startsWith('api_'));
  const cryptoKeys = keys.filter(key => key.startsWith('crypto_dashboard_'));
  
  [...apiKeys, ...cryptoKeys].forEach(key => {
    localStorage.removeItem(key);
    console.log(`🗑️ Removido: ${key}`);
  });
  
  console.log(`✅ Cache limpo: ${apiKeys.length + cryptoKeys.length} itens removidos`);
}

// 2. Testar API diretamente
async function testApiDirectly() {
  console.log('\n🌐 Testando API diretamente...');
  
  try {
    const response = await fetch('http://localhost:5000/api/market-summary', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error(`❌ HTTP Error ${response.status}: ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    console.log('📡 Resposta da API:', data);
    console.log('📡 Tipo:', typeof data);
    console.log('📡 Chaves:', Object.keys(data || {}));
    console.log('📡 Success:', data?.success);
    console.log('📡 Data:', data?.data);
    
    return data;
    
  } catch (error) {
    console.error('❌ Erro ao testar API:', error);
    return null;
  }
}

// 3. Simular o que o ApiClient faz
async function simulateApiClient() {
  console.log('\n🌐 Simulando ApiClient...');
  
  try {
    const url = 'http://localhost:5000/api/market-summary';
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error(`❌ HTTP Error ${response.status}: ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    console.log('📡 ApiClient response:', data);
    console.log('📡 Response type:', typeof data);
    console.log('📡 Response keys:', Object.keys(data || {}));
    
    return data;
    
  } catch (error) {
    console.error('❌ Erro no ApiClient:', error);
    return null;
  }
}

// 4. Simular o que o normalizeMarketData faz
function simulateNormalizeMarketData(response) {
  console.log('\n📊 Simulando normalizeMarketData...');
  console.log('📊 Input:', response);
  
  // Simular a validação
  if (!response || typeof response !== 'object') {
    console.error('❌ validateApiResponse: não é um objeto', response);
    return null;
  }
  
  if (typeof response.success !== 'boolean') {
    console.error('❌ validateApiResponse: success não é boolean', response);
    return null;
  }
  
  if (!('data' in response)) {
    console.error('❌ validateApiResponse: não tem propriedade data', response);
    return null;
  }
  
  console.log('✅ validateApiResponse: Resposta válida');
  
  const data = response.data;
  if (!data) {
    console.error('❌ normalizeMarketData: No data in response');
    return null;
  }
  
  // Simular a normalização
  const marketData = data;
  const result = {
    id: marketData?.id || 'default',
    totalMarketCap: String(marketData?.totalMarketCap || '0'),
    totalVolume24h: String(marketData?.totalVolume24h || '0'),
    btcDominance: String(marketData?.btcDominance || '0'),
    fearGreedIndex: marketData?.fearGreedIndex || null,
    marketChange24h: String(marketData?.marketChange24h || '0'),
    lastUpdated: marketData?.lastUpdated || new Date().toISOString()
  };
  
  console.log('📊 Resultado normalizado:', result);
  return result;
}

// 5. Forçar refetch das queries
function forceRefetch() {
  console.log('\n🔄 Forçando refetch das queries...');
  
  if (window.__REACT_QUERY_DEVTOOLS_GLOBAL__?.queryClient) {
    const queryClient = window.__REACT_QUERY_DEVTOOLS_GLOBAL__.queryClient;
    
    // Limpar cache do React Query
    queryClient.clear();
    console.log('✅ React Query cache limpo');
    
    // Invalidar queries específicas
    queryClient.invalidateQueries({ queryKey: ['market-summary'] });
    queryClient.invalidateQueries({ queryKey: ['trending-coins'] });
    queryClient.invalidateQueries({ queryKey: ['crypto-overview'] });
    
    console.log('✅ Queries invalidadas');
  } else {
    console.log('⚠️ React Query DevTools não disponível');
  }
}

// 6. Função principal
async function runFinalDebug() {
  console.log('🚀 Iniciando debug final...');
  
  // 1. Limpar cache
  clearAllCache();
  
  // 2. Testar API diretamente
  const apiResponse = await testApiDirectly();
  
  if (apiResponse) {
    console.log('✅ API está funcionando');
    
    // 3. Simular ApiClient
    const apiClientResponse = await simulateApiClient();
    
    if (apiClientResponse) {
      console.log('✅ ApiClient está funcionando');
      
      // 4. Simular normalização
      const normalizedData = simulateNormalizeMarketData(apiClientResponse);
      
      if (normalizedData) {
        console.log('✅ Normalização está funcionando');
        
        // 5. Forçar refetch
        forceRefetch();
        
        console.log('\n🎉 TUDO FUNCIONANDO!');
        console.log('\n🎯 Próximos passos:');
        console.log('1. Recarregue a página (F5)');
        console.log('2. Verifique se os dados aparecem');
        console.log('3. Se não aparecer, execute: window.finalDebug.runFinalDebug()');
        
        return true;
      } else {
        console.log('❌ Falha na normalização');
        return false;
      }
    } else {
      console.log('❌ Falha no ApiClient');
      return false;
    }
  } else {
    console.log('❌ Falha na API');
    return false;
  }
}

// Executar debug
runFinalDebug();

// Expor funções para uso manual
window.finalDebug = {
  clearAllCache,
  testApiDirectly,
  simulateApiClient,
  simulateNormalizeMarketData,
  forceRefetch,
  runFinalDebug
};

console.log('🔧 Funções disponíveis em window.finalDebug'); 