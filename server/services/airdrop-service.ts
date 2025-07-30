import fetch from 'node-fetch';
import type { Airdrop } from '@/types';

export class AirdropService {
  private baseUrl = 'https://api.coingecko.com/api/v3';

  async getAirdrops(): Promise<Airdrop[]> {
    try {
      console.log('🪂 Fetching airdrops from external APIs...');
      
      // Try multiple sources for airdrop data
      const [coinGeckoAirdrops, defiLlamaAirdrops] = await Promise.allSettled([
        this.getCoinGeckoAirdrops(),
        this.getDefiLlamaAirdrops(),
      ]);

      let allAirdrops: Airdrop[] = [];

      // Process CoinGecko airdrops
      if (coinGeckoAirdrops.status === 'fulfilled') {
        allAirdrops = [...allAirdrops, ...coinGeckoAirdrops.value];
      }

      // Process DeFi Llama airdrops
      if (defiLlamaAirdrops.status === 'fulfilled') {
        allAirdrops = [...allAirdrops, ...defiLlamaAirdrops.value];
      }

      console.log(`✅ Found ${allAirdrops.length} airdrops from external APIs`);
      return allAirdrops;
    } catch (error) {
      console.error('Error fetching airdrops from external APIs:', error);
      return [];
    }
  }

  private async getCoinGeckoAirdrops(): Promise<Airdrop[]> {
    try {
      // CoinGecko doesn't have a direct airdrop API, but we can get trending coins
      // that might have airdrops
      const response = await fetch(
        `${this.baseUrl}/search/trending?x_cg_demo_api_key=${process.env.COINGECKO_API_KEY || 'demo'}`
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json();
      const coins = data.coins || [];

      return coins.slice(0, 10).map((coin: any, index: number) => ({
        id: `cg-${coin.item.id}`,
        projectName: coin.item.name,
        tokenSymbol: coin.item.symbol?.toUpperCase(),
        description: `Trending ${coin.item.name} with potential airdrop opportunities`,
        estimatedValue: '$50-500',
        eligibility: 'Hold tokens, use platform',
        deadline: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'upcoming' as const,
        website: `https://coingecko.com/en/coins/${coin.item.id}`,
        createdAt: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error fetching CoinGecko airdrops:', error);
      return [];
    }
  }

  private async getDefiLlamaAirdrops(): Promise<Airdrop[]> {
    try {
      // DeFi Llama has some airdrop data
      const response = await fetch('https://api.llama.fi/airdrops');

      if (!response.ok) {
        throw new Error(`DeFi Llama API error: ${response.status}`);
      }

      const data = await response.json();
      const airdrops = data.airdrops || [];

      return airdrops.slice(0, 10).map((airdrop: any) => ({
        id: `llama-${airdrop.id || airdrop.name}`,
        projectName: airdrop.name || 'Unknown Project',
        tokenSymbol: airdrop.symbol?.toUpperCase(),
        description: airdrop.description || 'DeFi protocol airdrop',
        estimatedValue: airdrop.estimatedValue || '$100-1000',
        eligibility: airdrop.eligibility || 'Use platform, hold tokens',
        deadline: airdrop.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: this.determineStatus(airdrop.deadline),
        website: airdrop.website || null,
        createdAt: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error fetching DeFi Llama airdrops:', error);
      return [];
    }
  }

  private determineStatus(deadline: string | null): 'upcoming' | 'ongoing' | 'ended' {
    if (!deadline) return 'upcoming';
    
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    
    if (diff < 0) return 'ended';
    if (diff < 7 * 24 * 60 * 60 * 1000) return 'ongoing'; // Less than 7 days
    return 'upcoming';
  }
} 