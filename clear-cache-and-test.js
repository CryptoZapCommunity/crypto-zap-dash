// Script para limpar cache e testar API
// Execute no console do navegador

console.log('🧹 Limpando cache e testando API...');

// Função para limpar todo o cache
function clearAllCache() {
  console.log('🧹 Limpando localStorage...');
  
  const keys = Object.keys(localStorage);
  const apiKeys = keys.filter(key => key.startsWith('api_'));
  const cryptoKeys = keys.filter(key => key.startsWith('crypto_dashboard_'));
  
  apiKeys.forEach(key => {
    localStorage.removeItem(key);
    console.log(`🗑️ Removido: ${key}`);
  });
  
  cryptoKeys.forEach(key => {
    localStorage.removeItem(key);
    console.log(`🗑️ Removido: ${key}`);
  });
  
  console.log(`✅ Removidos ${apiKeys.length + cryptoKeys.length} itens do cache`);
}

// Função para testar API diretamente
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

// Função para testar normalização
function testNormalization(apiResponse) {
  console.log('\n📊 Testando normalização...');
  
  if (!apiResponse || typeof apiResponse !== 'object') {
    console.error('❌ Resposta inválida para normalização');
    return null;
  }
  
  if (typeof apiResponse.success !== 'boolean') {
    console.error('❌ Success não é boolean');
    return null;
  }
  
  if (!('data' in apiResponse)) {
    console.error('❌ Não tem propriedade data');
    return null;
  }
  
  const marketData = apiResponse.data;
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

// Função para forçar refetch das queries
function forceRefetch() {
  console.log('\n🔄 Forçando refetch das queries...');
  
  // Limpar React Query cache se disponível
  if (window.__REACT_QUERY_DEVTOOLS_GLOBAL__?.queryClient) {
    const queryClient = window.__REACT_QUERY_DEVTOOLS_GLOBAL__.queryClient;
    
    // Invalidar queries específicas
    queryClient.invalidateQueries({ queryKey: ['market-summary'] });
    queryClient.invalidateQueries({ queryKey: ['trending-coins'] });
    queryClient.invalidateQueries({ queryKey: ['crypto-overview'] });
    
    console.log('✅ Queries invalidadas');
  } else {
    console.log('⚠️ React Query DevTools não disponível');
  }
}

// Função principal
async function runTest() {
  console.log('🚀 Iniciando teste completo...');
  
  // 1. Limpar cache
  clearAllCache();
  
  // 2. Testar API diretamente
  const apiResponse = await testApiDirectly();
  
  if (apiResponse) {
    // 3. Testar normalização
    const normalizedData = testNormalization(apiResponse);
    
    if (normalizedData) {
      console.log('✅ Teste completo passou!');
      
      // 4. Forçar refetch
      forceRefetch();
      
      console.log('\n🎯 Próximos passos:');
      console.log('1. Recarregue a página (F5)');
      console.log('2. Verifique se os dados aparecem');
      console.log('3. Se não aparecer, execute este script novamente');
      
    } else {
      console.log('❌ Falha na normalização');
    }
  } else {
    console.log('❌ Falha na API');
  }
}

// Executar teste
runTest();

// Expor funções para uso manual
window.clearCacheAndTest = {
  clearAllCache,
  testApiDirectly,
  testNormalization,
  forceRefetch,
  runTest
};

console.log('🔧 Funções disponíveis em window.clearCacheAndTest'); 