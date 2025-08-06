import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { useApiStorage } from './use-local-storage';
import { normalizeMarketData, normalizeCryptoAssets, normalizeTrendingCoins, normalizeNews, normalizeEconomicEvents, normalizeWhaleTransactions, normalizeAirdrops, normalizeFedUpdates, normalizeSentimentData } from '@/lib/api-utils';

// Cache configuration constants
const CACHE_CONFIG = {
  MARKET_SUMMARY: { ttl: 5 * 60 * 1000, staleTime: 5 * 60 * 1000, gcTime: 10 * 60 * 1000 },
  CRYPTO_ASSETS: { ttl: 2 * 60 * 1000, staleTime: 2 * 60 * 1000, gcTime: 5 * 60 * 1000 },
  TRENDING_COINS: { ttl: 1 * 60 * 1000, staleTime: 1 * 60 * 1000, gcTime: 3 * 60 * 1000 },
  NEWS: { ttl: 10 * 60 * 1000, staleTime: 10 * 60 * 1000, gcTime: 20 * 60 * 1000 },
  ECONOMIC_CALENDAR: { ttl: 30 * 60 * 1000, staleTime: 30 * 60 * 1000, gcTime: 60 * 60 * 1000 },
  WHALE_TRANSACTIONS: { ttl: 2 * 60 * 1000, staleTime: 2 * 60 * 1000, gcTime: 5 * 60 * 1000 },
  AIRDROPS: { ttl: 60 * 60 * 1000, staleTime: 60 * 60 * 1000, gcTime: 120 * 60 * 1000 },
  FED_UPDATES: { ttl: 30 * 60 * 1000, staleTime: 30 * 60 * 1000, gcTime: 60 * 60 * 1000 },
  MARKET_SENTIMENT: { ttl: 5 * 60 * 1000, staleTime: 5 * 60 * 1000, gcTime: 10 * 60 * 1000 },
  FRED_INDICATORS: { ttl: 30 * 60 * 1000, staleTime: 30 * 60 * 1000, gcTime: 60 * 60 * 1000 },
  CRYPTO_OVERVIEW: { ttl: 5 * 60 * 1000, staleTime: 5 * 60 * 1000, gcTime: 10 * 60 * 1000 },
  MARKET_ANALYSIS: { ttl: 10 * 60 * 1000, staleTime: 10 * 60 * 1000, gcTime: 20 * 60 * 1000 }
} as const;

// Market Summary Hook
export function useMarketSummary() {
  const { data: cachedData, updateData, clearData, isExpired } = useApiStorage(
    'market_summary', null, CACHE_CONFIG.MARKET_SUMMARY.ttl
  );
  const query = useQuery({
    queryKey: ['market-summary'],
    queryFn: async () => {
      if (import.meta.env.DEV) {
        console.log('📊 useMarketSummary: Fetching data...');
      }
      
      try {
        const response = await apiClient.getMarketSummary();
        
        if (import.meta.env.DEV) {
          console.log('📊 useMarketSummary: Raw response:', response);
          console.log('📊 useMarketSummary: Response type:', typeof response);
          console.log('📊 useMarketSummary: Response keys:', Object.keys(response || {}));
        }
        
        const normalizedData = normalizeMarketData(response);
        
        if (import.meta.env.DEV) {
          console.log('📊 useMarketSummary: Normalized data:', normalizedData);
          console.log('📊 useMarketSummary: Normalized data type:', typeof normalizedData);
        }
        
        if (normalizedData) {
          updateData(normalizedData);
          if (import.meta.env.DEV) {
            console.log('📊 useMarketSummary: Data updated in cache');
          }
          return normalizedData;
        } else {
          if (import.meta.env.DEV) {
            console.log('❌ useMarketSummary: No normalized data returned');
          }
          throw new Error('Failed to normalize market data');
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('❌ useMarketSummary: Error fetching data:', error);
        }
        throw error;
      }
    },
    staleTime: CACHE_CONFIG.MARKET_SUMMARY.staleTime,
    gcTime: CACHE_CONFIG.MARKET_SUMMARY.gcTime,
    initialData: cachedData && cachedData !== null ? cachedData : undefined,
    enabled: true, // Sempre habilitado para fazer requisições
    refetchOnWindowFocus: true, // CORRIGIDO: Refetch quando janela ganha foco
    refetchOnMount: true, // CORRIGIDO: Refetch quando componente monta
    retry: (failureCount, error) => {
      if (import.meta.env.DEV) {
        console.log(`🔄 useMarketSummary: Retry attempt ${failureCount + 1}`);
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
  return { ...query, clearCache: clearData };
}

export function useCryptoAssets() {
  const { data: cachedData, updateData, clearData, isExpired } = useApiStorage(
    'crypto_assets', [], CACHE_CONFIG.CRYPTO_ASSETS.ttl
  );
  const query = useQuery({
    queryKey: ['crypto-assets'],
    queryFn: async () => {
      const response = await apiClient.getMarketSummary(); // Usar getMarketSummary como fallback
      const normalizedData = normalizeCryptoAssets(response);
      if (normalizedData.length > 0) {
        updateData(normalizedData);
      }
      return normalizedData;
    },
    staleTime: CACHE_CONFIG.CRYPTO_ASSETS.staleTime,
    gcTime: CACHE_CONFIG.CRYPTO_ASSETS.gcTime,
    initialData: cachedData,
    enabled: !cachedData || isExpired,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
  return { ...query, clearCache: clearData };
}

// Trending Coins Hook
export function useTrendingCoins() {
  const { data: cachedData, updateData, clearData, isExpired } = useApiStorage(
    'trending_coins', { gainers: [], losers: [] }, CACHE_CONFIG.TRENDING_COINS.ttl
  );
  const query = useQuery({
    queryKey: ['trending-coins'],
    queryFn: async () => {
      if (import.meta.env.DEV) {
        console.log('🪙 useTrendingCoins: Fetching data...');
      }
      
      try {
        const response = await apiClient.getTrendingCoins();
        
        if (import.meta.env.DEV) {
          console.log('🪙 useTrendingCoins: Raw response:', response);
        }
        
        const normalizedData = normalizeTrendingCoins(response);
        
        if (import.meta.env.DEV) {
          console.log('🪙 useTrendingCoins: Normalized data:', normalizedData);
        }
        
        if (normalizedData && (normalizedData.gainers.length > 0 || normalizedData.losers.length > 0)) {
          updateData(normalizedData);
          if (import.meta.env.DEV) {
            console.log('🪙 useTrendingCoins: Data updated in cache');
          }
          return normalizedData;
        } else {
          if (import.meta.env.DEV) {
            console.log('❌ useTrendingCoins: No valid trending data');
          }
          throw new Error('Failed to normalize trending data');
        }
      } catch (error) {
        if (import.meta.env.DEV) {
          console.error('❌ useTrendingCoins: Error fetching data:', error);
        }
        throw error;
      }
    },
    staleTime: CACHE_CONFIG.TRENDING_COINS.staleTime,
    gcTime: CACHE_CONFIG.TRENDING_COINS.gcTime,
    initialData: cachedData,
    enabled: true, // Sempre habilitado para fazer requisições
    refetchOnWindowFocus: true, // CORRIGIDO: Refetch quando janela ganha foco
    refetchOnMount: true, // CORRIGIDO: Refetch quando componente monta
    retry: (failureCount, error) => {
      if (import.meta.env.DEV) {
        console.log(`🔄 useTrendingCoins: Retry attempt ${failureCount + 1}`);
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
  return { ...query, clearCache: clearData };
}

// News Hook
export function useNews(category?: string, limit?: number) {
  const cacheKey = `news_${category || 'all'}_${limit || 10}`;
  const { data: cachedData, updateData, clearData, isExpired } = useApiStorage(
    cacheKey, [], CACHE_CONFIG.NEWS.ttl
  );
  const query = useQuery({
    queryKey: ['news', category, limit],
    queryFn: async () => {
      const response = await apiClient.getNews(category, limit);
      const normalizedData = normalizeNews(response);
      if (normalizedData.length > 0) {
        updateData(normalizedData);
      }
      return normalizedData;
    },
    staleTime: CACHE_CONFIG.NEWS.staleTime,
    gcTime: CACHE_CONFIG.NEWS.gcTime,
    initialData: cachedData,
    enabled: !cachedData || isExpired,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
  return { ...query, clearCache: clearData };
}

// Economic Calendar Hook
export function useEconomicCalendar() {
  const { data: cachedData, updateData, clearData, isExpired } = useApiStorage(
    'economic_calendar', [], CACHE_CONFIG.ECONOMIC_CALENDAR.ttl
  );
  const query = useQuery({
    queryKey: ['economic-calendar'],
    queryFn: async () => {
      const response = await apiClient.getEconomicCalendar();
      const normalizedData = normalizeEconomicEvents(response);
      if (normalizedData.length > 0) {
        updateData(normalizedData);
      }
      return normalizedData;
    },
    staleTime: CACHE_CONFIG.ECONOMIC_CALENDAR.staleTime,
    gcTime: CACHE_CONFIG.ECONOMIC_CALENDAR.gcTime,
    initialData: cachedData,
    enabled: !cachedData || isExpired,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
  return { ...query, clearCache: clearData };
}

// Whale Transactions Hook
export function useWhaleTransactions(limit?: number) {
  const cacheKey = `whale_transactions_${limit || 10}`;
  const { data: cachedData, updateData, clearData, isExpired } = useApiStorage(
    cacheKey, [], CACHE_CONFIG.WHALE_TRANSACTIONS.ttl
  );
  const query = useQuery({
    queryKey: ['whale-transactions', limit],
    queryFn: async () => {
      const response = await apiClient.getWhaleMovements(limit); // Usar getWhaleMovements
      const normalizedData = normalizeWhaleTransactions(response);
      if (normalizedData.length > 0) {
        updateData(normalizedData);
      }
      return normalizedData;
    },
    staleTime: CACHE_CONFIG.WHALE_TRANSACTIONS.staleTime,
    gcTime: CACHE_CONFIG.WHALE_TRANSACTIONS.gcTime,
    initialData: cachedData,
    enabled: !cachedData || isExpired,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
  return { ...query, clearCache: clearData };
}

// FRED Indicators Hook
export function useFredIndicators() {
  const { data: cachedData, updateData, clearData, isExpired } = useApiStorage(
    'fed_indicators', [], CACHE_CONFIG.FRED_INDICATORS.ttl
  );
  const query = useQuery({
    queryKey: ['fed-indicators'],
    queryFn: async () => {
      const response = await apiClient.getFedUpdates();
      const normalizedData = normalizeFedUpdates(response);
      if (normalizedData.length > 0) {
        updateData(normalizedData);
      }
      return normalizedData;
    },
    staleTime: CACHE_CONFIG.FRED_INDICATORS.staleTime,
    gcTime: CACHE_CONFIG.FRED_INDICATORS.gcTime,
    initialData: cachedData,
    enabled: !cachedData || isExpired,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
  return { ...query, clearCache: clearData };
}

// Market Sentiment Hook
export function useMarketSentiment() {
  const { data: cachedData, updateData, clearData, isExpired } = useApiStorage(
    'market_sentiment', null, CACHE_CONFIG.MARKET_SENTIMENT.ttl
  );
  const query = useQuery({
    queryKey: ['market-sentiment'],
    queryFn: async () => {
      const response = await apiClient.getMarketSentiment();
      const normalizedData = normalizeSentimentData(response);
      if (normalizedData) {
        updateData(normalizedData);
      }
      return normalizedData;
    },
    staleTime: CACHE_CONFIG.MARKET_SENTIMENT.staleTime,
    gcTime: CACHE_CONFIG.MARKET_SENTIMENT.gcTime,
    initialData: cachedData,
    enabled: !cachedData || isExpired,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
  return { ...query, clearCache: clearData };
}

// Crypto Overview Hook
export function useCryptoOverview() {
  const { data: cachedData, updateData, clearData, isExpired } = useApiStorage(
    'crypto_overview',
    null,
    CACHE_CONFIG.CRYPTO_OVERVIEW.ttl
  );

  const query = useQuery({
    queryKey: ['crypto-overview'],
    queryFn: async () => {
      const response = await apiClient.getCryptoOverview();
      updateData(response);
      return response;
    },
    staleTime: CACHE_CONFIG.CRYPTO_OVERVIEW.staleTime,
    gcTime: CACHE_CONFIG.CRYPTO_OVERVIEW.gcTime,
    initialData: cachedData,
    enabled: !cachedData || isExpired,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    ...query,
    clearCache: clearData
  };
}

// Market Analysis Hook
export function useMarketAnalysis() {
  const { data: cachedData, updateData, clearData, isExpired } = useApiStorage(
    'market_analysis',
    null,
    CACHE_CONFIG.MARKET_ANALYSIS.ttl
  );

  const query = useQuery({
    queryKey: ['market-analysis'],
    queryFn: async () => {
      const response = await apiClient.getMarketAnalysis();
      updateData(response);
      return response;
    },
    staleTime: CACHE_CONFIG.MARKET_ANALYSIS.staleTime,
    gcTime: CACHE_CONFIG.MARKET_ANALYSIS.gcTime,
    initialData: cachedData,
    enabled: !cachedData || isExpired,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    ...query,
    clearCache: clearData
  };
}

// Airdrops Hook
export function useAirdrops(status?: string) {
  const cacheKey = `airdrops_${status || 'all'}`;
  const { data: cachedData, updateData, clearData, isExpired } = useApiStorage(
    cacheKey, [], CACHE_CONFIG.AIRDROPS.ttl
  );
  const query = useQuery({
    queryKey: ['airdrops', status],
    queryFn: async () => {
      const response = await apiClient.getAirdrops(status);
      const normalizedData = normalizeAirdrops(response);
      if (normalizedData.length > 0) {
        updateData(normalizedData);
      }
      return normalizedData;
    },
    staleTime: CACHE_CONFIG.AIRDROPS.staleTime,
    gcTime: CACHE_CONFIG.AIRDROPS.gcTime,
    initialData: cachedData,
    enabled: !cachedData || isExpired,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
  return { ...query, clearCache: clearData };
}

// Chart Data Hook
export function useChartData(symbol: string, timeframe: string = '1D') {
  const cacheKey = `chart_data_${symbol}_${timeframe}`;
  const { data: cachedData, updateData, clearData, isExpired } = useApiStorage(
    cacheKey,
    null,
    5 * 60 * 1000 // 5 minutes for chart data
  );

  const query = useQuery({
    queryKey: ['chart-data', symbol, timeframe],
    queryFn: async () => {
      const response = await apiClient.getChartData(symbol);
      updateData(response);
      return response;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    initialData: cachedData,
    enabled: !cachedData || isExpired,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  return {
    ...query,
    clearCache: clearData
  };
}

// Update Mutations
export function useUpdateCrypto() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiClient.updateCrypto,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['market-summary'] });
      queryClient.invalidateQueries({ queryKey: ['trending-coins'] });
      queryClient.invalidateQueries({ queryKey: ['crypto-overview'] });
    },
    onError: (error) => {
      console.error('Failed to update crypto data:', error);
    }
  });
}

export function useUpdateNews() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiClient.updateNews,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
    },
    onError: (error) => {
      console.error('Failed to update news data:', error);
    }
  });
}

export function useUpdateEconomic() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiClient.updateEconomic,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['economic-calendar'] });
      queryClient.invalidateQueries({ queryKey: ['fed-indicators'] });
    },
    onError: (error) => {
      console.error('Failed to update economic data:', error);
    }
  });
}

export function useUpdateWhale() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: apiClient.updateWhale,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['whale-transactions'] });
    },
    onError: (error) => {
      console.error('Failed to update whale data:', error);
    }
  });
}

// Cache management utilities
export function useCacheManager() {
  const queryClient = useQueryClient();
  
  const clearAllCache = () => {
    queryClient.clear();
    localStorage.clear();
  };
  
  const clearCacheForEndpoint = (endpoint: string) => {
    queryClient.removeQueries({ queryKey: [endpoint] });
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith('crypto_dashboard_api_') && key.includes(endpoint)
    );
    keys.forEach(key => localStorage.removeItem(key));
  };
  
  const clearCacheForPattern = (pattern: string[]) => {
    queryClient.removeQueries({ queryKey: pattern });
  };
  
  return {
    clearAllCache,
    clearCacheForEndpoint,
    clearCacheForPattern
  };
} 