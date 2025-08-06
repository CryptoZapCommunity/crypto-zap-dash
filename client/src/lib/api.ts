import { queryClient } from './queryClient';

export interface ApiResponse<T> {
  success: boolean;
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

// LocalStorage utilities
const STORAGE_PREFIX = 'crypto_dashboard_';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

class LocalStorageManager {
  private getKey(key: string): string {
    return `${STORAGE_PREFIX}${key}`;
  }

  set(key: string, data: any, ttl?: number): void {
    const item = {
      data,
      timestamp: Date.now(),
      ttl: ttl || CACHE_DURATION
    };
    localStorage.setItem(this.getKey(key), JSON.stringify(item));
  }

  get(key: string): any | null {
    const item = localStorage.getItem(this.getKey(key));
    if (!item) return null;

    try {
      const parsed = JSON.parse(item);
      const isExpired = Date.now() - parsed.timestamp > parsed.ttl;
      
      if (isExpired) {
        localStorage.removeItem(this.getKey(key));
        return null;
      }
      
      return parsed.data;
    } catch {
      localStorage.removeItem(this.getKey(key));
      return null;
    }
  }

  remove(key: string): void {
    localStorage.removeItem(this.getKey(key));
  }

  clear(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  }
}

export class ApiClient {
  private baseUrl: string;
  private storage: LocalStorageManager;

  constructor(baseUrl?: string) {
    // Configuração para diferentes ambientes
    this.baseUrl = baseUrl || this.getApiBaseUrl();
    this.storage = new LocalStorageManager();
    
    if (import.meta.env.DEV) {
      console.log('🔧 ApiClient initialized with:', {
        providedBaseUrl: baseUrl,
        finalBaseUrl: this.baseUrl,
        isProduction: import.meta.env.PROD,
        isDevelopment: import.meta.env.DEV,
        envApiUrl: import.meta.env.VITE_API_BASE_URL
      });
    }
    
    // Log da URL base
    this.logBaseUrl();
  }

  private getApiBaseUrl(): string {
    const envUrl = import.meta.env.VITE_API_BASE_URL;
    
    if (import.meta.env.DEV) {
      console.log('🔧 getApiBaseUrl: envUrl:', envUrl);
    }
    
    if (envUrl && envUrl !== 'https://your-api-domain.com/api') {
      if (import.meta.env.DEV) {
        console.log('🔧 getApiBaseUrl: Using envUrl:', envUrl);
      }
      return envUrl;
    }
    
    // Fallback para desenvolvimento
    if (import.meta.env.DEV) {
      const devUrl = 'http://localhost:5000/api';
      console.log('🔧 getApiBaseUrl: Using dev fallback:', devUrl);
      return devUrl;
    }
    
    // Fallback para produção
    return '/api';
  }
  
  // Debug: Log da URL base
  private logBaseUrl() {
    if (import.meta.env.DEV) {
      console.log('🔧 ApiClient baseUrl:', this.baseUrl);
      console.log('🔧 Environment VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
    }
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const cacheKey = `${endpoint}_${JSON.stringify(options || {})}`;
    
    if (import.meta.env.DEV) {
      console.log(`🌐 Making API Request: ${url}`);
      console.log(`🔧 Request options:`, options);
      console.log(`🔧 Full URL: ${url}`);
      console.log(`🔧 Method: ${options?.method || 'GET'}`);
    }
    
    // Tentar buscar do cache primeiro
    const cachedData = this.storage.get(cacheKey);
    if (cachedData && !options?.method) {
      if (import.meta.env.DEV) {
        console.log(`📦 Using cached data for ${endpoint}`);
      }
      return cachedData;
    }
    
    // Debug: Forçar busca fresca para trending-coins e market-summary
    if (import.meta.env.DEV && (endpoint === '/trending-coins' || endpoint === '/market-summary')) {
      console.log(`🔄 Forcing fresh data for ${endpoint}`);
      // Limpar cache para forçar busca fresca
      this.storage.remove(cacheKey);
    }
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (import.meta.env.DEV) {
        console.log(`📡 Response status: ${response.status} ${response.statusText}`);
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error(`❌ HTTP Error ${response.status}:`, errorData);
        throw new ApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status
        );
      }

      const data = await response.json();
      
      if (import.meta.env.DEV) {
        console.log(`📡 Raw API Response for ${endpoint}:`, data);
        console.log(`📡 Response type:`, typeof data);
        console.log(`📡 Response keys:`, Object.keys(data || {}));
        console.log(`📡 Response success:`, (data as any)?.success);
        console.log(`📡 Response data:`, (data as any)?.data);
      }
      
      // Cache successful responses (apenas para GET requests)
      if (!options?.method || options.method === 'GET') {
        this.storage.set(cacheKey, data);
      }
      
      if (import.meta.env.DEV) {
        console.log(`✅ API Response for ${endpoint}:`, data);
      }
      return data;
    } catch (error) {
      console.error(`❌ API Error for ${endpoint}:`, error);
      
      // CORRIGIDO: Lógica de fallback mais restritiva
      const errorMessage = error instanceof Error ? error.message : String(error);
      const shouldUseMock = (
        import.meta.env.VITE_MOCK_API === 'true' ||
        (errorMessage.includes('Failed to fetch') && import.meta.env.DEV) ||
        (errorMessage.includes('NetworkError') && import.meta.env.DEV) ||
        (errorMessage.includes('Connection refused') && import.meta.env.DEV) ||
        (errorMessage.includes('ECONNREFUSED') && import.meta.env.DEV)
      );
      
      if (shouldUseMock) {
        if (import.meta.env.DEV) {
          console.warn(`🔄 API endpoint ${endpoint} not available, using mock data`);
        }
        const mockData = this.getMockData(endpoint);
        // Cache mock data também
        this.storage.set(cacheKey, mockData);
        return mockData as T;
      }
      
      // Se não for para usar mock, vamos tentar uma última vez com um delay
      if (import.meta.env.DEV) {
        console.warn(`🔄 Retrying API request for ${endpoint} in 2 seconds...`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      try {
        const retryResponse = await fetch(url, options);
        if (retryResponse.ok) {
          const retryData = await retryResponse.json();
          if (import.meta.env.DEV) {
            console.log(`✅ Retry successful for ${endpoint}:`, retryData);
          }
          return retryData;
        }
      } catch (retryError) {
        if (import.meta.env.DEV) {
          console.error(`❌ Retry failed for ${endpoint}:`, retryError);
        }
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
        success: true,
        message: 'Market summary retrieved successfully',
        data: {
          id: 'global',
          totalMarketCap: '2500000000000',
          totalVolume24h: '85000000000',
          btcDominance: '52.5',
          fearGreedIndex: 65,
          marketChange24h: '2.3',
          lastUpdated: new Date().toISOString()
        }
      },
      '/trending-coins': {
        success: true,
        message: 'Trending coins retrieved successfully',
        data: {
          gainers: [
            { 
              id: 'bitcoin',
              symbol: 'BTC', 
              name: 'Bitcoin', 
              price: '45000', // ✅ Corrigido: mudado de number para string
              priceChange24h: '2.5', // ✅ Corrigido: mudado de number para string
              marketCap: '850000000000',
              volume24h: '25000000000',
              sparklineData: [42000, 42500, 43000, 43250]
            },
            { 
              id: 'ethereum',
              symbol: 'ETH', 
              name: 'Ethereum', 
              price: '2800', // ✅ Corrigido: mudado de number para string
              priceChange24h: '1.8', // ✅ Corrigido: mudado de number para string
              marketCap: '320000000000',
              volume24h: '15000000000',
              sparklineData: [2600, 2620, 2640, 2650]
            }
          ],
          losers: [
            { 
              id: 'solana',
              symbol: 'SOL', 
              name: 'Solana', 
              price: '120', // ✅ Corrigido: mudado de number para string
              priceChange24h: '-5.2', // ✅ Corrigido: mudado de number para string
              marketCap: '45000000000',
              volume24h: '3000000000',
              sparklineData: [93, 95, 97, 98]
            }
          ]
        }
      },
      '/news': {
        success: true,
        message: 'News retrieved successfully',
        data: [
          {
            id: 'news-1',
            title: 'Bitcoin reaches new highs',
            summary: 'Bitcoin continues its upward trajectory...',
            publishedAt: new Date().toISOString(),
            source: 'CryptoNews',
            url: '#'
          },
          {
            id: 'news-2',
            title: 'Ethereum upgrade successful',
            summary: 'Latest Ethereum upgrade brings improvements...',
            publishedAt: new Date().toISOString(),
            source: 'CoinDesk',
            url: '#'
          }
        ]
      },
      '/economic-calendar': {
        success: true,
        message: 'Economic calendar retrieved successfully',
        data: [
          {
            id: 'event-1',
            event: 'Fed Interest Rate Decision',
            date: new Date().toISOString(),
            impact: 'High',
            currency: 'USD',
            description: 'Federal Reserve interest rate decision'
          }
        ]
      },
      '/whale-transactions': {
        success: true,
        message: 'Whale transactions retrieved successfully',
        data: [
          {
            id: 'whale-001',
            transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
            asset: 'BTC',
            amount: '1000.50000000',
            valueUsd: '45000000.00',
            type: 'transfer',
            fromAddress: '0xabc123...',
            toAddress: '0xdef456...',
            fromExchange: 'Binance',
            toExchange: 'Unknown',
            timestamp: new Date().toISOString()
          }
        ]
      },
      '/airdrops': {
        success: true,
        message: 'Airdrops retrieved successfully',
        data: [
          {
            id: 'airdrop-1',
            projectName: 'New Token Airdrop',
            tokenSymbol: 'NEW',
            description: 'Free token distribution for new users',
            status: 'upcoming',
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            estimatedValue: '$500-$1000',
            eligibility: 'Hold minimum tokens, Complete tasks',
            website: 'https://example.com',
            createdAt: new Date().toISOString()
          }
        ]
      },
      '/fed/indicators': {
        success: true,
        message: 'FRED indicators retrieved successfully',
        data: [
          {
            id: 'fed-001',
            title: 'Federal Funds Rate Decision',
            type: 'rate_decision',
            content: 'The Federal Reserve decided to maintain rates at 5.25%',
            interestRate: 5.25,
            publishedAt: new Date().toISOString()
          }
        ]
      },

    };

    return mockData[endpoint] || { 
      success: false, 
      message: 'Mock data not available for this endpoint',
      data: null 
    };
  }

  // Market endpoints
  async getMarketSummary() {
    if (import.meta.env.DEV) {
      console.log('🌐 ApiClient: Making request to /market-summary');
    }
    const response = await this.request('/market-summary');
    if (import.meta.env.DEV) {
      console.log('🌐 ApiClient: Response from /market-summary:', response);
      console.log('🌐 ApiClient: Response type:', typeof response);
      console.log('🌐 ApiClient: Response keys:', Object.keys(response || {}));
      console.log('🌐 ApiClient: Response success:', (response as any)?.success);
      console.log('🌐 ApiClient: Response data:', (response as any)?.data);
    }
    return response;
  }

  async getTrendingCoins(): Promise<ApiResponse<any>> {
    if (import.meta.env.DEV) {
      console.log('🌐 ApiClient: Making request to /trending-coins');
    }
    const response = await this.request<ApiResponse<any>>('/trending-coins');
    if (import.meta.env.DEV) {
      console.log('🌐 ApiClient: Response from /trending-coins:', response);
    }
    return response;
  }

  async getChartData(symbol: string) {
    return this.request(`/charts/${symbol}`);
  }

  async getMarketSentiment(): Promise<ApiResponse<any>> {
    return this.request<ApiResponse<any>>('/market-sentiment');
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
    return this.request(`/whale-transactions${query}`);
  }

  // Airdrops
  async getAirdrops(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.request(`/airdrops${query}`);
  }

  // FED updates
  async getFedUpdates(limit?: number) {
    const query = limit ? `?limit=${limit}` : '';
    return this.request(`/fed/indicators${query}`);
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
    return this.request('/fed/indicators');
  }

  async getFredRateHistory(months?: number) {
    const query = months ? `?months=${months}` : '';
    return this.request(`/fed/rate-history${query}`);
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
  async getMarketAnalysis(): Promise<ApiResponse<any>> {
    return this.request<ApiResponse<any>>('/market-analysis');
  }

  // Crypto overview
  async getCryptoOverview() {
    return this.request('/crypto-overview');
  }

  // Cache management
  clearCache() {
    this.storage.clear();
  }

  clearCacheForEndpoint(endpoint: string) {
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(STORAGE_PREFIX) && key.includes(endpoint)
    );
    keys.forEach(key => localStorage.removeItem(key));
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