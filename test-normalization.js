// Script para testar normalização de dados
// Simula os dados que vêm do backend e testa a normalização

// Dados simulados do backend (como realmente vêm)
const mockBackendData = {
  marketSummary: {
    success: true,
    message: "Market summary retrieved successfully",
    data: {
      id: "global",
      totalMarketCap: "3785267906758.324",
      totalVolume24h: "136233680231.84595",
      btcDominance: "59.89874777425952",
      fearGreedIndex: null,
      marketChange24h: "-0.8506004786134346",
      lastUpdated: "2025-08-06T13:26:06.589083"
    }
  },
  trendingCoins: {
    success: true,
    message: "Trending coins retrieved successfully",
    data: {
      gainers: [
        {
          id: "bitcoin",
          symbol: "BTC",
          name: "Bitcoin",
          price: "43250.5",
          priceChange24h: "2.5",
          marketCap: "850000000000",
          volume24h: "25000000000",
          sparklineData: [42000, 42500, 43000, 43250]
        },
        {
          id: "ethereum",
          symbol: "ETH",
          name: "Ethereum",
          price: "2650.75",
          priceChange24h: "1.8",
          marketCap: "320000000000",
          volume24h: "15000000000",
          sparklineData: [2600, 2620, 2640, 2650]
        }
      ],
      losers: [
        {
          id: "cardano",
          symbol: "ADA",
          name: "Cardano",
          price: "0.45",
          priceChange24h: "-1.2",
          marketCap: "16000000000",
          volume24h: "800000000",
          sparklineData: [0.46, 0.455, 0.452, 0.45]
        }
      ]
    }
  }
};

// Funções de normalização (copiadas do api-utils.ts)
function validateApiResponse(response) {
  if (!response || typeof response !== 'object') {
    console.error('❌ Invalid API response: not an object', response);
    return false;
  }
  
  if (typeof response.success !== 'boolean') {
    console.error('❌ Invalid API response: missing success property', response);
    return false;
  }
  
  if (!('data' in response)) {
    console.error('❌ Invalid API response: missing data property', response);
    return false;
  }
  
  console.log('✅ validateApiResponse: Valid response', response);
  return true;
}

function normalizeMarketData(response) {
  console.log('📊 normalizeMarketData input:', response);
  
  if (!validateApiResponse(response)) {
    console.error('❌ normalizeMarketData: Invalid API response');
    return null;
  }
  
  const data = response.data;
  if (!data) {
    console.error('❌ normalizeMarketData: No data in response');
    return null;
  }
  
  // CORRIGIDO: Não aplicar toCamelCase aqui, pois o backend já retorna em formato correto
  const marketData = data;
  
  console.log('📊 normalizeMarketData marketData:', marketData);
  
  // CORRIGIDO: Garantir que todos os campos são strings conforme esperado pelo frontend
  const result = {
    id: marketData?.id || 'default',
    totalMarketCap: String(marketData?.totalMarketCap || '0'),
    totalVolume24h: String(marketData?.totalVolume24h || '0'),
    btcDominance: String(marketData?.btcDominance || '0'),
    fearGreedIndex: marketData?.fearGreedIndex || null,
    marketChange24h: String(marketData?.marketChange24h || '0'),
    lastUpdated: marketData?.lastUpdated || new Date().toISOString()
  };
  
  console.log('📊 normalizeMarketData result:', result);
  return result;
}

function normalizeTrendingCoins(response) {
  console.log('📊 normalizeTrendingCoins input:', response);
  
  if (!validateApiResponse(response)) {
    console.error('❌ normalizeTrendingCoins: Invalid API response');
    return { gainers: [], losers: [] };
  }
  
  const data = response.data;
  if (!data) {
    console.error('❌ normalizeTrendingCoins: No data in response');
    return { gainers: [], losers: [] };
  }
  
  // CORRIGIDO: Não aplicar toCamelCase aqui, pois o backend já retorna em formato correto
  const trendingData = data;
  
  console.log('📊 normalizeTrendingCoins trendingData:', trendingData);
  
  const normalizeCoin = (coin) => ({
    id: coin?.id || coin?.symbol || 'unknown',
    name: coin?.name || coin?.symbol || 'Unknown',
    symbol: coin?.symbol || 'UNKNOWN',
    price: String(coin?.price || '0'),
    marketCapRank: coin?.marketCapRank,
    image: coin?.image,
    priceChange24h: String(coin?.priceChange24h || '0')
  });
  
  const result = {
    gainers: (trendingData?.gainers || []).map(normalizeCoin),
    losers: (trendingData?.losers || []).map(normalizeCoin)
  };
  
  console.log('📊 normalizeTrendingCoins result:', result);
  return result;
}

// Testar normalização
console.log('🧪 Testando normalização de dados...');

console.log('\n📊 Testando normalizeMarketData:');
const normalizedMarketData = normalizeMarketData(mockBackendData.marketSummary);
console.log('✅ Resultado:', normalizedMarketData);

console.log('\n🪙 Testando normalizeTrendingCoins:');
const normalizedTrendingData = normalizeTrendingCoins(mockBackendData.trendingCoins);
console.log('✅ Resultado:', normalizedTrendingData);

// Verificar se os dados estão no formato esperado pelos componentes
console.log('\n🔍 Verificando formato dos dados:');

// Verificar MarketSummary
if (normalizedMarketData) {
  const requiredMarketFields = ['id', 'totalMarketCap', 'totalVolume24h', 'btcDominance', 'fearGreedIndex', 'marketChange24h', 'lastUpdated'];
  const missingMarketFields = requiredMarketFields.filter(field => !(field in normalizedMarketData));
  
  if (missingMarketFields.length > 0) {
    console.log('❌ MarketSummary campos faltando:', missingMarketFields);
  } else {
    console.log('✅ MarketSummary tem todos os campos necessários');
  }
  
  // Verificar se campos numéricos são strings
  const stringFields = ['totalMarketCap', 'totalVolume24h', 'btcDominance', 'marketChange24h'];
  const nonStringFields = stringFields.filter(field => typeof normalizedMarketData[field] !== 'string');
  
  if (nonStringFields.length > 0) {
    console.log('❌ MarketSummary campos que deveriam ser string:', nonStringFields);
  } else {
    console.log('✅ MarketSummary campos numéricos estão como string');
  }
}

// Verificar TrendingCoins
if (normalizedTrendingData) {
  const requiredCoinFields = ['id', 'symbol', 'name', 'price', 'priceChange24h'];
  
  const allCoins = [...normalizedTrendingData.gainers, ...normalizedTrendingData.losers];
  
  for (const coin of allCoins) {
    const missingFields = requiredCoinFields.filter(field => !(field in coin));
    if (missingFields.length > 0) {
      console.log(`❌ Coin ${coin.id} campos faltando:`, missingFields);
    }
  }
  
  console.log('✅ TrendingCoins verificação completa');
  
  // Verificar se price e priceChange24h são strings
  for (const coin of allCoins) {
    if (typeof coin.price !== 'string') {
      console.log(`❌ Coin ${coin.id} price não é string:`, coin.price);
    }
    if (typeof coin.priceChange24h !== 'string') {
      console.log(`❌ Coin ${coin.id} priceChange24h não é string:`, coin.priceChange24h);
    }
  }
  
  console.log('✅ TrendingCoins campos numéricos estão como string');
}

console.log('\n🎯 Teste de normalização concluído!'); 