// Script para debugar a resposta da API
// Execute no console do navegador

console.log('🔍 Debugando resposta da API...');

// Teste 1: Verificar se a API está acessível
async function testApiResponse() {
  console.log('\n🌐 Testando resposta da API...');
  
  try {
    const response = await fetch('http://localhost:5000/api/market-summary');
    const data = await response.json();
    
    console.log('📡 Resposta bruta da API:', data);
    console.log('📡 Tipo da resposta:', typeof data);
    console.log('📡 Chaves da resposta:', Object.keys(data || {}));
    console.log('📡 Success:', data?.success);
    console.log('📡 Data:', data?.data);
    console.log('📡 Message:', data?.message);
    
    // Verificar se a resposta é válida
    if (!data || typeof data !== 'object') {
      console.error('❌ Resposta inválida: não é um objeto');
      return false;
    }
    
    if (typeof data.success !== 'boolean') {
      console.error('❌ Resposta inválida: success não é boolean');
      return false;
    }
    
    if (!('data' in data)) {
      console.error('❌ Resposta inválida: não tem propriedade data');
      return false;
    }
    
    console.log('✅ Resposta da API é válida');
    return true;
    
  } catch (error) {
    console.error('❌ Erro ao testar API:', error);
    return false;
  }
}

// Teste 2: Simular o que o ApiClient faz
async function testApiClient() {
  console.log('\n🌐 Testando ApiClient...');
  
  try {
    // Simular a chamada do ApiClient
    const url = 'http://localhost:5000/api/market-summary';
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error(`❌ HTTP Error ${response.status}: ${response.statusText}`);
      return false;
    }
    
    const data = await response.json();
    console.log('📡 ApiClient response:', data);
    console.log('📡 Response type:', typeof data);
    console.log('📡 Response keys:', Object.keys(data || {}));
    
    return data;
    
  } catch (error) {
    console.error('❌ Erro no ApiClient:', error);
    return false;
  }
}

// Teste 3: Simular o que o normalizeMarketData faz
function testNormalizeMarketData(response) {
  console.log('\n📊 Testando normalizeMarketData...');
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

// Teste 4: Testar o hook useMarketSummary
async function testUseMarketSummary() {
  console.log('\n🎣 Testando useMarketSummary...');
  
  try {
    // Simular a chamada do hook
    const response = await fetch('http://localhost:5000/api/market-summary');
    const data = await response.json();
    
    console.log('📊 useMarketSummary: Raw response:', data);
    console.log('📊 useMarketSummary: Response type:', typeof data);
    console.log('📊 useMarketSummary: Response keys:', Object.keys(data || {}));
    
    const normalizedData = testNormalizeMarketData(data);
    
    console.log('📊 useMarketSummary: Normalized data:', normalizedData);
    console.log('📊 useMarketSummary: Normalized data type:', typeof normalizedData);
    
    if (normalizedData) {
      console.log('✅ useMarketSummary: Dados normalizados com sucesso');
      return normalizedData;
    } else {
      console.error('❌ useMarketSummary: Falha na normalização');
      return null;
    }
    
  } catch (error) {
    console.error('❌ useMarketSummary: Erro:', error);
    return null;
  }
}

// Executar todos os testes
async function runAllTests() {
  console.log('🚀 Executando todos os testes de debug...');
  
  const apiValid = await testApiResponse();
  const apiClientData = await testApiClient();
  const normalizedData = await testUseMarketSummary();
  
  console.log('\n📋 RESUMO:');
  console.log('- API válida:', apiValid);
  console.log('- ApiClient data:', !!apiClientData);
  console.log('- Normalized data:', !!normalizedData);
  
  if (apiValid && apiClientData && normalizedData) {
    console.log('✅ Todos os testes passaram!');
  } else {
    console.log('❌ Alguns testes falharam');
  }
}

// Executar testes
runAllTests();

// Expor funções para uso manual
window.debugApi = {
  testApiResponse,
  testApiClient,
  testNormalizeMarketData,
  testUseMarketSummary,
  runAllTests
};

console.log('🔧 Funções de debug disponíveis em window.debugApi'); 