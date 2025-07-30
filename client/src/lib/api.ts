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

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error occurred'
      );
    }
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
