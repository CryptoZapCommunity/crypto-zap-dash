import type { ApiResponse, MarketSummary, CryptoAsset, News, EconomicEvent, WhaleTransaction, TrendingCoins, MarketSentiment, SentimentData, Airdrop, FedUpdate } from '@/types';

export function validateApiResponse<T>(response: any): response is ApiResponse<T> {
  return (
    response &&
    typeof response === 'object' &&
    typeof response.success === 'boolean' &&
    'data' in response
  );
}

export function normalizeMarketData(response: any): MarketSummary | null {
  if (!validateApiResponse(response)) return null;
  
  const data = response.data as any;
  
  // Handle both nested and direct data structures
  const marketData = data?.marketSummary || data;
  
  return {
    id: marketData?.id || 'default',
    totalMarketCap: marketData?.totalMarketCap || '0',
    totalVolume24h: marketData?.totalVolume24h || '0',
    btcDominance: marketData?.btcDominance || '0',
    fearGreedIndex: marketData?.fearGreedIndex || null,
    marketChange24h: marketData?.marketChange24h || '0',
    lastUpdated: marketData?.lastUpdated || new Date().toISOString()
  };
}

export function normalizeCryptoAssets(response: any): CryptoAsset[] {
  if (!validateApiResponse(response)) return [];
  const data = response.data as any;
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
  if (!validateApiResponse(response)) return { gainers: [], losers: [] };
  
  const data = response.data as any;
  
  // Handle both nested and direct data structures
  const trendingData = data?.trendingCoins || data;
  
  const normalizeCoin = (coin: any) => ({
    id: coin?.id || coin?.symbol || 'unknown',
    name: coin?.name || coin?.symbol || 'Unknown',
    symbol: coin?.symbol || 'UNKNOWN',
    price: coin?.price || '0',
    marketCapRank: coin?.marketCapRank,
    image: coin?.image,
    priceChange24h: coin?.priceChange24h || '0'
  });
  
  return {
    gainers: (trendingData?.gainers || []).map(normalizeCoin),
    losers: (trendingData?.losers || []).map(normalizeCoin)
  };
}

export function normalizeNews(response: any): News[] {
  if (!validateApiResponse(response)) return [];
  const data = response.data as any;
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
  const data = response.data as any;
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
  const data = response.data as any;
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
  const data = response.data as any;
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
  const data = response.data as any;
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
  const data = response.data as any;
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
  const data = response.data as any;
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