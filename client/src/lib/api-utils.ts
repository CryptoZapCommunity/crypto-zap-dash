import type { ApiResponse, MarketSummary, CryptoAsset, News, EconomicEvent, WhaleTransaction, TrendingCoins, MarketSentiment, SentimentData, Airdrop, FedUpdate } from '@/types';

// Utility function to convert snake_case to camelCase
export function toCamelCase(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => toCamelCase(item));
  }
  
  if (typeof obj === 'object') {
    const camelCaseObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
        camelCaseObj[camelKey] = toCamelCase(obj[key]);
      }
    }
    
    // Debug log para verificar se a conversão está funcionando
    if (import.meta.env.DEV) {
      console.log('🔄 toCamelCase conversion:', { original: obj, converted: camelCaseObj });
    }
    
    return camelCaseObj;
  }
  
  return obj;
}

export function validateApiResponse<T>(response: any): response is ApiResponse<T> {
  if (import.meta.env.DEV) {
    console.log('🔍 validateApiResponse input:', response);
    console.log('🔍 validateApiResponse type:', typeof response);
    console.log('🔍 validateApiResponse keys:', Object.keys(response || {}));
  }
  
  if (!response || typeof response !== 'object') {
    if (import.meta.env.DEV) {
      console.error('❌ Invalid API response: not an object', response);
    }
    return false;
  }
  
  if (typeof response.success !== 'boolean') {
    if (import.meta.env.DEV) {
      console.error('❌ Invalid API response: missing success property', response);
    }
    return false;
  }
  
  if (!('data' in response)) {
    if (import.meta.env.DEV) {
      console.error('❌ Invalid API response: missing data property', response);
    }
    return false;
  }
  
  if (import.meta.env.DEV) {
    console.log('✅ validateApiResponse: Valid response', response);
  }
  
  return true;
}

export function normalizeMarketData(response: any): MarketSummary | null {
  if (import.meta.env.DEV) {
    console.log('📊 normalizeMarketData input:', response);
    console.log('📊 normalizeMarketData input type:', typeof response);
    console.log('📊 normalizeMarketData input keys:', Object.keys(response || {}));
  }
  
  if (!validateApiResponse(response)) {
    if (import.meta.env.DEV) {
      console.error('❌ normalizeMarketData: Invalid API response');
    }
    return null;
  }
  
  const data = response.data;
  if (!data) {
    if (import.meta.env.DEV) {
      console.error('❌ normalizeMarketData: No data in response');
    }
    return null;
  }
  
  // CORRIGIDO: Não aplicar toCamelCase aqui, pois o backend já retorna em formato correto
  const marketData = data as any;
  
  if (import.meta.env.DEV) {
    console.log('📊 normalizeMarketData marketData:', marketData);
    console.log('📊 normalizeMarketData marketData type:', typeof marketData);
    console.log('📊 normalizeMarketData marketData keys:', Object.keys(marketData || {}));
  }
  
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
  
  if (import.meta.env.DEV) {
    console.log('📊 normalizeMarketData result:', result);
  }
  
  return result;
}

export function normalizeCryptoAssets(response: any): CryptoAsset[] {
  if (!validateApiResponse(response)) return [];
  const data = toCamelCase(response.data as any);
  let assets: any[] = [];
  if (Array.isArray(data)) {
    assets = data;
  } else if (data?.assets && Array.isArray(data.assets)) {
    assets = data.assets;
  } else if (data?.cryptoAssets && Array.isArray(data.cryptoAssets)) {
    assets = data.cryptoAssets;
  } else if (data?.gainers && data?.losers) {
    assets = [...(data.gainers || []), ...(data.losers || [])];
  }
  return assets.map(asset => ({
    id: asset.id || asset.symbol || 'unknown',
    symbol: asset.symbol || 'UNKNOWN',
    name: asset.name || asset.symbol || 'Unknown Asset',
    price: asset.price || '0',
    priceChange24h: asset.priceChange24h || '0',
    marketCap: asset.marketCap || null,
    volume24h: asset.volume24h || null,
    sparklineData: asset.sparklineData || null,
    lastUpdated: asset.lastUpdated || null
  }));
}

export function normalizeTrendingCoins(response: any): TrendingCoins {
  if (import.meta.env.DEV) {
    console.log('📊 normalizeTrendingCoins input:', response);
  }
  
  if (!validateApiResponse(response)) {
    if (import.meta.env.DEV) {
      console.error('❌ normalizeTrendingCoins: Invalid API response');
    }
    return { gainers: [], losers: [] };
  }
  
  const data = response.data;
  if (!data) {
    if (import.meta.env.DEV) {
      console.error('❌ normalizeTrendingCoins: No data in response');
    }
    return { gainers: [], losers: [] };
  }
  
  // CORRIGIDO: Não aplicar toCamelCase aqui, pois o backend já retorna em formato correto
  const trendingData = data as any;
  
  if (import.meta.env.DEV) {
    console.log('📊 normalizeTrendingCoins trendingData:', trendingData);
  }
  
  const normalizeCoin = (coin: any) => ({
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
  
  if (import.meta.env.DEV) {
    console.log('📊 normalizeTrendingCoins result:', result);
  }
  
  return result;
}

export function normalizeNews(response: any): News[] {
  if (!validateApiResponse(response)) return [];
  const data = toCamelCase(response.data as any);
  let news: any[] = [];
  if (Array.isArray(data)) {
    news = data;
  } else if (data?.news && Array.isArray(data.news)) {
    news = data.news;
  } else if (data?.articles && Array.isArray(data.articles)) {
    news = data.articles;
  }
  return news.map(article => ({
    id: article.id || `news-${Date.now()}-${Math.random()}`,
    title: article.title || 'Untitled',
    summary: article.summary || article.description || null,
    content: article.content || null,
    source: article.source || 'Unknown',
    sourceUrl: article.sourceUrl || article.url || null,
    category: article.category || 'general',
    country: article.country || null,
    impact: article.impact || 'low',
    sentiment: article.sentiment || null,
    publishedAt: article.publishedAt || article.published_at || new Date().toISOString(),
    createdAt: article.createdAt || null
  }));
}

export function normalizeEconomicEvents(response: any): EconomicEvent[] {
  if (!validateApiResponse(response)) return [];
  const data = toCamelCase(response.data as any);
  let events: any[] = [];
  if (Array.isArray(data)) {
    events = data;
  } else if (data?.events && Array.isArray(data.events)) {
    events = data.events;
  } else if (data?.calendar && Array.isArray(data.calendar)) {
    events = data.calendar;
  }
  return events.map(event => ({
    id: event.id || `event-${Date.now()}-${Math.random()}`,
    title: event.title || event.event || 'Untitled Event',
    country: event.country || 'Unknown',
    currency: event.currency || null,
    impact: event.impact || 'low',
    forecast: event.forecast || null,
    previous: event.previous || null,
    actual: event.actual || null,
    eventDate: event.eventDate || event.date || new Date().toISOString(),
    sourceUrl: event.sourceUrl || event.url || null,
    createdAt: event.createdAt || null
  }));
}

export function normalizeWhaleTransactions(response: any): WhaleTransaction[] {
  if (!validateApiResponse(response)) return [];
  const data = toCamelCase(response.data as any);
  let transactions: any[] = [];
  if (Array.isArray(data)) {
    transactions = data;
  } else if (data?.transactions && Array.isArray(data.transactions)) {
    transactions = data.transactions;
  } else if (data?.whales && Array.isArray(data.whales)) {
    transactions = data.whales;
  }
  return transactions.map(tx => ({
    id: tx.id || `whale-${Date.now()}-${Math.random()}`,
    transactionHash: tx.transactionHash || tx.hash || 'unknown',
    asset: tx.asset || 'UNKNOWN',
    amount: tx.amount || '0',
    valueUsd: tx.valueUsd || tx.value || null,
    type: tx.type || 'transfer',
    fromAddress: tx.fromAddress || tx.from || null,
    toAddress: tx.toAddress || tx.to || null,
    fromExchange: tx.fromExchange || null,
    toExchange: tx.toExchange || null,
    timestamp: tx.timestamp || tx.time || new Date().toISOString(),
    createdAt: tx.createdAt || null
  }));
}

export function normalizeAirdrops(response: any): Airdrop[] {
  if (!validateApiResponse(response)) return [];
  const data = toCamelCase(response.data as any);
  let airdrops: any[] = [];
  if (Array.isArray(data)) {
    airdrops = data;
  } else if (data?.airdrops && Array.isArray(data.airdrops)) {
    airdrops = data.airdrops;
  } else if (data?.drops && Array.isArray(data.drops)) {
    airdrops = data.drops;
  }
  return airdrops.map(airdrop => ({
    id: airdrop.id || `airdrop-${Date.now()}-${Math.random()}`,
    projectName: airdrop.projectName || airdrop.name || 'Unknown Project',
    tokenSymbol: airdrop.tokenSymbol || airdrop.symbol || null,
    description: airdrop.description || airdrop.summary || null,
    estimatedValue: airdrop.estimatedValue || airdrop.value || null,
    eligibility: airdrop.eligibility || airdrop.requirements || null,
    deadline: airdrop.deadline || airdrop.endDate || null,
    status: airdrop.status || 'active',
    website: airdrop.website || airdrop.url || null,
    createdAt: airdrop.createdAt || null
  }));
}

export function normalizeFedUpdates(response: any): FedUpdate[] {
  if (!validateApiResponse(response)) return [];
  const data = toCamelCase(response.data as any);
  let updates: any[] = [];
  if (Array.isArray(data)) {
    updates = data;
  } else if (data?.updates && Array.isArray(data.updates)) {
    updates = data.updates;
  } else if (data?.fed && Array.isArray(data.fed)) {
    updates = data.fed;
  }
  return updates.map(update => ({
    id: update.id || `fed-${Date.now()}-${Math.random()}`,
    title: update.title || update.headline || 'Untitled Update',
    type: update.type || 'announcement',
    content: update.content || update.summary || null,
    sourceUrl: update.sourceUrl || update.url || null,
    publishedAt: update.publishedAt || update.date || new Date().toISOString(),
    createdAt: update.createdAt || null,
    interestRate: update.interestRate || null,
    speaker: update.speaker || null
  }));
}

export function normalizeMarketSentiment(response: any): MarketSentiment | null {
  if (!validateApiResponse(response)) return null;
  const data = toCamelCase(response.data as any);
  const sentimentData = data?.sentiment || data;
  return {
    fearGreedIndex: sentimentData.fearGreedIndex || sentimentData.index || 50,
    sentiment: sentimentData.sentiment || 'neutral',
    timestamp: sentimentData.timestamp || new Date().toISOString(),
    description: sentimentData.description || 'Market sentiment data'
  };
}

export function normalizeSentimentData(response: any): SentimentData | null {
  if (!validateApiResponse(response)) return null;
  const data = toCamelCase(response.data as any);
  const sentimentData = data?.sentiment || data;
  return {
    overall: sentimentData.overall || 50,
    fear_greed_index: sentimentData.fear_greed_index || sentimentData.fearGreedIndex || 50,
    social_mentions: sentimentData.social_mentions || 0,
    news_sentiment: sentimentData.news_sentiment || 50,
    whale_activity: sentimentData.whale_activity || 'neutral',
    technical_indicators: sentimentData.technical_indicators || 'neutral',
    updated_at: sentimentData.updated_at || sentimentData.timestamp || new Date().toISOString()
  };
}

// Utility function to create a standardized error response
export function createErrorResponse<T>(message: string, error?: string): ApiResponse<T> {
  return {
    success: false,
    data: {} as T,
    message,
    error
  };
}

// Utility function to validate and normalize any API response
export function validateAndNormalize<T>(
  response: any, 
  normalizer: (response: any) => T | null
): { data: T | null; isValid: boolean; error?: string } {
  try {
    if (!validateApiResponse(response)) {
      return { data: null, isValid: false, error: 'Invalid API response format' };
    }
    
    const normalizedData = normalizer(response);
    return { 
      data: normalizedData, 
      isValid: normalizedData !== null,
      error: normalizedData === null ? 'Failed to normalize data' : undefined
    };
  } catch (error) {
    return { 
      data: null, 
      isValid: false, 
      error: error instanceof Error ? error.message : 'Unknown error during normalization'
    };
  }
}