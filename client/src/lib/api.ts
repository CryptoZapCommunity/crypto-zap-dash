import { queryClient } from './queryClient';

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export class ApiError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    // Use environment variable for production API URL, fallback to /api for development
    this.baseUrl = baseUrl || import.meta.env.VITE_API_URL || '/api';
    
    // Debug logging for API URL
    console.log('🔧 ApiClient initialized with:', {
      providedBaseUrl: baseUrl,
      envApiUrl: import.meta.env.VITE_API_URL,
      finalBaseUrl: this.baseUrl,
      isProduction: import.meta.env.PROD,
      isDevelopment: import.meta.env.DEV
    });
    
    // Warning if using /api in production
    if (import.meta.env.PROD && this.baseUrl === '/api') {
      console.warn('⚠️  WARNING: Using /api in production!');
      console.warn('   This will cause API calls to fail.');
      console.warn('   Please set VITE_API_URL environment variable in Netlify.');
    }
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    console.log(`🌐 API Request: ${url}`);
    console.log(`🔧 Request options:`, options);
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      console.log(`📡 Response status: ${response.status} ${response.statusText}`);
      console.log(`📡 Response headers:`, Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`❌ HTTP Error ${response.status}:`, errorData);
        throw new ApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();
      console.log(`✅ API Response for ${endpoint}:`, data);
      return data;
    } catch (error) {
      console.error(`❌ API Error for ${endpoint}:`, error);
      console.error(`❌ Error type:`, error instanceof Error ? error.constructor.name : typeof error);
      console.error(`❌ Error message:`, error instanceof Error ? error.message : String(error));
      
      // Enhanced error detection for mock data fallback
      const errorMessage = error instanceof Error ? error.message : String(error);
      const shouldUseMock = (
        errorMessage.includes('Failed to fetch') ||
        errorMessage.includes('NetworkError') ||
        errorMessage.includes('404') ||
        errorMessage.includes('CORS') ||
        errorMessage.includes('fetch') ||
        errorMessage.includes('ERR_NETWORK') ||
        errorMessage.includes('ERR_INTERNET_DISCONNECTED') ||
        errorMessage.includes('TypeError') ||
        errorMessage.includes('Network request failed') ||
        errorMessage.includes('Connection refused') ||
        errorMessage.includes('ENOTFOUND') ||
        errorMessage.includes('ECONNREFUSED') ||
        errorMessage.includes('timeout') ||
        errorMessage.includes('aborted') ||
        errorMessage.includes('cancelled') ||
        errorMessage.includes('blocked') ||
        errorMessage.includes('forbidden') ||
        errorMessage.includes('unauthorized') ||
        errorMessage.includes('not found') ||
        errorMessage.includes('server error') ||
        errorMessage.includes('internal server error')
      );
      
      if (shouldUseMock) {
        console.warn(`🔄 API endpoint ${endpoint} not available, using mock data`);
        console.warn(`🔄 Error that triggered mock: ${errorMessage}`);
        const mockData = this.getMockData(endpoint);
        console.log(`✅ Mock data for ${endpoint}:`, mockData);
        return mockData as T;
      }
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error occurred'
      );
    }
  }

  private getMockData(endpoint: string): any {
    // Mock data for when API is not available
    const mockData: Record<string, any> = {
      '/market-summary': {
        data: {
          totalMarketCap: 2500000000000,
          totalVolume24h: 85000000000,
          btcDominance: 48.5,
          ethDominance: 18.2,
          marketChange24h: 2.3
        }
      },
      '/trending-coins': {
        data: [
          { symbol: 'BTC', name: 'Bitcoin', price: 45000, change24h: 2.5 },
          { symbol: 'ETH', name: 'Ethereum', price: 2800, change24h: 1.8 },
          { symbol: 'SOL', name: 'Solana', price: 120, change24h: 5.2 },
          { symbol: 'ADA', name: 'Cardano', price: 0.45, change24h: -1.2 },
          { symbol: 'DOT', name: 'Polkadot', price: 6.8, change24h: 3.1 }
        ]
      },
      '/market-sentiment': {
        data: {
          fearGreedIndex: 65,
          sentiment: 'Greed',
          confidence: 0.75
        }
      },
      '/news': {
        data: [
          {
            title: 'Bitcoin reaches new highs',
            summary: 'Bitcoin continues its upward trajectory...',
            publishedAt: new Date().toISOString(),
            source: 'CryptoNews'
          },
          {
            title: 'Ethereum upgrade successful',
            summary: 'Latest Ethereum upgrade brings improvements...',
            publishedAt: new Date().toISOString(),
            source: 'CoinDesk'
          }
        ]
      },
      '/economic-calendar': {
        data: [
          {
            event: 'Fed Interest Rate Decision',
            date: new Date().toISOString(),
            impact: 'High',
            currency: 'USD'
          }
        ]
      },
      '/whale-movements': {
        data: [
          {
            symbol: 'BTC',
            amount: 1000,
            value: 45000000,
            type: 'transfer',
            timestamp: new Date().toISOString()
          }
        ]
      },
      '/airdrops': {
        data: [
          {
            name: 'New Token Airdrop',
            status: 'active',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      '/fed-updates': {
        data: [
          {
            title: 'Fed maintains current rates',
            summary: 'Federal Reserve keeps interest rates unchanged...',
            date: new Date().toISOString()
          }
        ]
      },
      '/market-analysis': {
        data: {
          trend: 'bullish',
          confidence: 0.8,
          keyLevels: {
            support: 44000,
            resistance: 46000
          }
        }
      }
    };

    return mockData[endpoint] || { data: null, message: 'Mock data not available for this endpoint' };
  }

  // Market endpoints
  async getMarketSummary() {
    return this.request('/market-summary');
  }

  async getTrendingCoins() {
    return this.request('/trending-coins');
  }

  async getChartData(symbol: string) {
    return this.request(`/charts/${symbol}`);
  }

  async getMarketSentiment() {
    return this.request('/market-sentiment');
  }

  // News endpoints
  async getNews(category?: string, limit?: number) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (limit) params.append('limit', limit.toString());
    
    const query = params.toString() ? `?${params}` : '';
    return this.request(`/news${query}`);
  }

  async getGeopoliticalNews(limit?: number) {
    const query = limit ? `?limit=${limit}` : '';
    return this.request(`/news/geopolitics${query}`);
  }

  async getMacroNews(limit?: number) {
    const query = limit ? `?limit=${limit}` : '';
    return this.request(`/news/macro${query}`);
  }

  // Economic calendar
  async getEconomicCalendar(startDate?: Date, endDate?: Date) {
    const params = new URLSearchParams();
    if (startDate) params.append('start', startDate.toISOString());
    if (endDate) params.append('end', endDate.toISOString());
    
    const query = params.toString() ? `?${params}` : '';
    return this.request(`/economic-calendar${query}`);
  }

  // Whale tracking
  async getWhaleMovements(limit?: number) {
    const query = limit ? `?limit=${limit}` : '';
    return this.request(`/whale-movements${query}`);
  }

  // Airdrops
  async getAirdrops(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.request(`/airdrops${query}`);
  }

  // FED updates
  async getFedUpdates(limit?: number) {
    const query = limit ? `?limit=${limit}` : '';
    return this.request(`/fed-updates${query}`);
  }

  // Manual update endpoints
  async updateCrypto() {
    return this.request('/update/crypto', { method: 'POST' });
  }

  async updateNews() {
    return this.request('/update/news', { method: 'POST' });
  }

  async updateEconomic() {
    return this.request('/update/economic', { method: 'POST' });
  }

  async updateWhale() {
    return this.request('/update/whale', { method: 'POST' });
  }

  // Crypto icons
  async getCryptoIcons(symbols: string[]) {
    const query = `?symbols=${symbols.join(',')}`;
    return this.request(`/crypto-icons${query}`);
  }

  async getCryptoIcon(symbol: string) {
    return this.request(`/crypto-icons/${symbol}`);
  }

  // FRED economic indicators
  async getFredIndicators() {
    return this.request('/fred/indicators');
  }

  async getFredRateHistory(months?: number) {
    const query = months ? `?months=${months}` : '';
    return this.request(`/fred/rate-history${query}`);
  }

  // Candlestick data
  async getCandlestickData(symbol: string, timeframe?: string, limit?: number) {
    const params = new URLSearchParams();
    if (timeframe) params.append('timeframe', timeframe);
    if (limit) params.append('limit', limit.toString());
    
    const query = params.toString() ? `?${params}` : '';
    return this.request(`/candlestick/${symbol}${query}`);
  }

  // Market analysis
  async getMarketAnalysis() {
    return this.request('/market-analysis');
  }
}

export const apiClient = new ApiClient();

// React Query helpers
export function invalidateQueries(pattern: string[]) {
  queryClient.invalidateQueries({ queryKey: pattern });
}

export function prefetchQuery<T>(queryKey: string[], queryFn: () => Promise<T>) {
  return queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
