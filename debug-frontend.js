// Script para debug do frontend
// Execute no console do navegador

console.log('🔍 Iniciando debug do frontend...');

// Teste 1: Verificar variáveis de ambiente
console.log('📋 Variáveis de ambiente:');
console.log('- VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
console.log('- VITE_DEBUG:', import.meta.env.VITE_DEBUG);
console.log('- VITE_MOCK_API:', import.meta.env.VITE_MOCK_API);

// Teste 2: Verificar se a API está acessível
async function testApiConnectivity() {
  console.log('\n🌐 Testando conectividade da API...');
  
  try {
    const response = await fetch('http://localhost:5000/api/health');
    const data = await response.json();
    console.log('✅ API está acessível:', data);
  } catch (error) {
    console.error('❌ Erro ao conectar com API:', error);
  }
}

// Teste 3: Testar endpoint market-summary
async function testMarketSummary() {
  console.log('\n📊 Testando /market-summary...');
  
  try {
    const response = await fetch('http://localhost:5000/api/market-summary');
    const data = await response.json();
    console.log('✅ Market Summary:', data);
    
    if (data.success && data.data) {
      console.log('📦 Dados do market summary:');
      console.log('- ID:', data.data.id);
      console.log('- Total Market Cap:', data.data.totalMarketCap);
      console.log('- Total Volume 24h:', data.data.totalVolume24h);
      console.log('- BTC Dominance:', data.data.btcDominance);
      console.log('- Fear & Greed Index:', data.data.fearGreedIndex);
      console.log('- Market Change 24h:', data.data.marketChange24h);
      console.log('- Last Updated:', data.data.lastUpdated);
    }
  } catch (error) {
    console.error('❌ Erro ao buscar market summary:', error);
  }
}

// Teste 4: Testar endpoint trending-coins
async function testTrendingCoins() {
  console.log('\n🪙 Testando /trending-coins...');
  
  try {
    const response = await fetch('http://localhost:5000/api/trending-coins');
    const data = await response.json();
    console.log('✅ Trending Coins:', data);
    
    if (data.success && data.data) {
      console.log('📦 Dados do trending coins:');
      console.log('- Gainers:', data.data.gainers?.length || 0, 'items');
      console.log('- Losers:', data.data.losers?.length || 0, 'items');
      
      if (data.data.gainers?.length > 0) {
        console.log('📈 Primeiro gainer:', data.data.gainers[0]);
      }
      
      if (data.data.losers?.length > 0) {
        console.log('📉 Primeiro loser:', data.data.losers[0]);
      }
    }
  } catch (error) {
    console.error('❌ Erro ao buscar trending coins:', error);
  }
}

// Teste 5: Verificar se o React Query está funcionando
function checkReactQuery() {
  console.log('\n🔍 Verificando React Query...');
  
  // Verificar se o queryClient está disponível
  if (window.__REACT_QUERY_DEVTOOLS_GLOBAL__) {
    console.log('✅ React Query DevTools está disponível');
  } else {
    console.log('⚠️ React Query DevTools não encontrado');
  }
  
  // Verificar se há queries ativas
  if (window.__REACT_QUERY_DEVTOOLS_GLOBAL__?.queryClient) {
    const queries = window.__REACT_QUERY_DEVTOOLS_GLOBAL__.queryClient.getQueryCache().getAll();
    console.log('📊 Queries ativas:', queries.length);
    queries.forEach(query => {
      console.log(`- ${query.queryKey}: ${query.state.status}`);
    });
  }
}

// Teste 6: Verificar localStorage
function checkLocalStorage() {
  console.log('\n💾 Verificando localStorage...');
  
  const keys = Object.keys(localStorage);
  const cryptoKeys = keys.filter(key => key.startsWith('crypto_dashboard_'));
  
  console.log('📦 Chaves do crypto dashboard:', cryptoKeys.length);
  cryptoKeys.forEach(key => {
    try {
      const data = JSON.parse(localStorage.getItem(key));
      console.log(`- ${key}:`, data);
    } catch (error) {
      console.log(`- ${key}: Erro ao parsear`);
    }
  });
}

// Teste 7: Verificar se os hooks estão funcionando
function checkHooks() {
  console.log('\n🎣 Verificando hooks...');
  
  // Verificar se os hooks estão disponíveis globalmente
  if (window.useMarketSummary) {
    console.log('✅ useMarketSummary está disponível');
  } else {
    console.log('❌ useMarketSummary não encontrado');
  }
  
  if (window.useTrendingCoins) {
    console.log('✅ useTrendingCoins está disponível');
  } else {
    console.log('❌ useTrendingCoins não encontrado');
  }
}

// Executar todos os testes
async function runAllTests() {
  console.log('🚀 Executando todos os testes...');
  
  await testApiConnectivity();
  await testMarketSummary();
  await testTrendingCoins();
  checkReactQuery();
  checkLocalStorage();
  checkHooks();
  
  console.log('\n🎯 Debug completo!');
}

// Executar testes
runAllTests();

// Função para limpar cache
function clearCache() {
  console.log('🧹 Limpando cache...');
  
  // Limpar localStorage
  const keys = Object.keys(localStorage);
  const cryptoKeys = keys.filter(key => key.startsWith('crypto_dashboard_'));
  cryptoKeys.forEach(key => localStorage.removeItem(key));
  
  console.log(`✅ Removidas ${cryptoKeys.length} chaves do localStorage`);
  
  // Limpar React Query cache se disponível
  if (window.__REACT_QUERY_DEVTOOLS_GLOBAL__?.queryClient) {
    window.__REACT_QUERY_DEVTOOLS_GLOBAL__.queryClient.clear();
    console.log('✅ React Query cache limpo');
  }
}

// Função para forçar refetch
function forceRefetch() {
  console.log('🔄 Forçando refetch...');
  
  // Forçar refetch das queries principais
  if (window.__REACT_QUERY_DEVTOOLS_GLOBAL__?.queryClient) {
    const queryClient = window.__REACT_QUERY_DEVTOOLS_GLOBAL__.queryClient;
    
    queryClient.invalidateQueries({ queryKey: ['market-summary'] });
    queryClient.invalidateQueries({ queryKey: ['trending-coins'] });
    queryClient.invalidateQueries({ queryKey: ['crypto-overview'] });
    
    console.log('✅ Queries invalidadas');
  }
}

// Expor funções para uso manual
window.debugCrypto = {
  runAllTests,
  clearCache,
  forceRefetch,
  testApiConnectivity,
  testMarketSummary,
  testTrendingCoins
};

console.log('🔧 Funções de debug disponíveis em window.debugCrypto'); 