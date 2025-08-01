import fetch from 'node-fetch';
import type { CryptoAsset } from '@shared/schema.js';

interface TrendingCoin {
  id: string;
  symbol: string;
  name: string;
  price: number;
  marketCapRank: number;
  image: string;
  priceChange24h: number;
}

export class CryptoService {
  private baseUrl = 'https://api.coingecko.com/api/v3';
  private apiKey = process.env.COINGECKO_API_KEY || 'demo';
  private coinsCache: Map<string, string> = new Map(); // symbol -> id
  private cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours
  private lastCacheUpdate = 0;

  async getTrendingCoins(): Promise<{ gainers: TrendingCoin[], losers: TrendingCoin[] }> {
    try {
      console.log('🪙 Returning mock trending coins...');
      
      const mockCoins: TrendingCoin[] = [
        {
          id: 'bitcoin',
          symbol: 'BTC',
          name: 'Bitcoin',
          price: 43250.50,
          marketCapRank: 1,
          image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
          priceChange24h: 2.5
        },
        {
          id: 'ethereum',
          symbol: 'ETH',
          name: 'Ethereum',
          price: 2650.75,
          marketCapRank: 2,
          image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
          priceChange24h: 1.8
        },
        {
          id: 'solana',
          symbol: 'SOL',
          name: 'Solana',
          price: 98.25,
          marketCapRank: 5,
          image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
          priceChange24h: 5.2
        },
        {
          id: 'cardano',
          symbol: 'ADA',
          name: 'Cardano',
          price: 0.45,
          marketCapRank: 8,
          image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
          priceChange24h: -1.2
        },
        {
          id: 'polkadot',
          symbol: 'DOT',
          name: 'Polkadot',
          price: 6.85,
          marketCapRank: 12,
          image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot_new_logo.png',
          priceChange24h: -0.8
        }
      ];

      // Split into gainers and losers
      const gainers = mockCoins.filter(coin => coin.priceChange24h > 0);
      const losers = mockCoins.filter(coin => coin.priceChange24h < 0);

      console.log(`✅ Mock data: ${gainers.length} gainers, ${losers.length} losers`);
      return { gainers, losers };
    } catch (error) {
      console.error('Error with mock trending coins:', error);
      return { gainers: [], losers: [] };
    }
  }

  async getCryptoIcon(symbol: string): Promise<string | null> {
    try {
      // Return mock icons for common cryptocurrencies
      const mockIcons: Record<string, string> = {
        'BTC': 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
        'ETH': 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
        'SOL': 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
        'ADA': 'https://assets.coingecko.com/coins/images/975/large/cardano.png',
        'DOT': 'https://assets.coingecko.com/coins/images/12171/large/polkadot_new_logo.png',
        'LINK': 'https://assets.coingecko.com/coins/images/877/large/chainlink.png',
        'UNI': 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png',
        'BCH': 'https://assets.coingecko.com/coins/images/780/large/bitcoin-cash-circle.png',
        'LTC': 'https://assets.coingecko.com/coins/images/2/large/litecoin.png',
        'XRP': 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png'
      };

      const iconUrl = mockIcons[symbol.toUpperCase()];
      if (iconUrl) {
        console.log(`✅ Mock icon found for: ${symbol}`);
        return iconUrl;
      } else {
        console.log(`❌ No mock icon for: ${symbol}`);
        return null;
      }
    } catch (error) {
      console.error(`Error fetching icon for ${symbol}:`, error);
      return null;
    }
  }

  async getCryptoIcons(symbols: string[]): Promise<Record<string, string>> {
    try {
      console.log(`🪙 Fetching icons for: ${symbols.join(', ')}`);
      const icons: Record<string, string> = {};

      // Fetch icons in parallel with rate limiting
      const promises = symbols.map(async (symbol, index) => {
        // Add small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, index * 100));
        const icon = await this.getCryptoIcon(symbol);
        if (icon) {
          icons[symbol.toUpperCase()] = icon;
        }
      });

      await Promise.all(promises);
      console.log(`✅ Found ${Object.keys(icons).length} icons`);
      return icons;
    } catch (error) {
      console.error('Error fetching crypto icons:', error);
      return {};
    }
  }

  private async getCoinId(symbol: string): Promise<string | null> {
    // Check cache first
    if (this.coinsCache.has(symbol.toUpperCase())) {
      return this.coinsCache.get(symbol.toUpperCase()) || null;
    }

    // Update cache if expired
    if (Date.now() - this.lastCacheUpdate > this.cacheExpiry) {
      await this.updateCoinsCache();
    }

    // Try to find in cache again
    if (this.coinsCache.has(symbol.toUpperCase())) {
      return this.coinsCache.get(symbol.toUpperCase()) || null;
    }

    // If still not found, try fuzzy matching
    return this.findCoinByFuzzyMatch(symbol);
  }

  private async updateCoinsCache(): Promise<void> {
    try {
      console.log('🔄 Updating coins cache...');
      const response = await fetch(
        `${this.baseUrl}/coins/list?include_platform=false&x_cg_demo_api_key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch coins list: ${response.status}`);
      }

      const coins = await response.json() as any[];
      
      // Clear existing cache
      this.coinsCache.clear();
      
      // Build new cache
      coins.forEach((coin: any) => {
        if (coin.symbol) {
          this.coinsCache.set(coin.symbol.toUpperCase(), coin.id);
        }
      });

      this.lastCacheUpdate = Date.now();
      console.log(`✅ Updated coins cache with ${this.coinsCache.size} coins`);
    } catch (error) {
      console.error('Error updating coins cache:', error);
    }
  }

  private findCoinByFuzzyMatch(symbol: string): string | null {
    const upperSymbol = symbol.toUpperCase();
    
    // Try exact match first
    if (this.coinsCache.has(upperSymbol)) {
      return this.coinsCache.get(upperSymbol) || null;
    }

    // Try common variations
    const variations = [
      upperSymbol,
      upperSymbol.replace('-', ''),
      upperSymbol.replace('_', ''),
      upperSymbol.replace('USD', ''),
      upperSymbol.replace('USDT', ''),
      upperSymbol.replace('USDC', ''),
    ];

    for (const variation of variations) {
      if (this.coinsCache.has(variation)) {
        return this.coinsCache.get(variation) || null;
      }
    }

    // Try partial matches for popular coins
    const popularCoins: Record<string, string> = {
      'BTC': 'bitcoin',
      'ETH': 'ethereum',
      'SOL': 'solana',
      'ADA': 'cardano',
      'DOT': 'polkadot',
      'LINK': 'chainlink',
      'UNI': 'uniswap',
      'MATIC': 'matic-network',
      'AVAX': 'avalanche-2',
      'ATOM': 'cosmos',
      'FTM': 'fantom',
      'NEAR': 'near',
      'ALGO': 'algorand',
      'VET': 'vechain',
      'ICP': 'internet-computer',
      'FIL': 'filecoin',
      'TRX': 'tron',
      'XLM': 'stellar',
      'XMR': 'monero',
      'LTC': 'litecoin',
      'BCH': 'bitcoin-cash',
      'ETC': 'ethereum-classic',
      'XRP': 'ripple',
      'DOGE': 'dogecoin',
      'SHIB': 'shiba-inu',
      'LUNC': 'terra-luna-2',
      'APT': 'aptos',
      'SUI': 'sui',
      'TIA': 'celestia',
      'JUP': 'jupiter',
      'PYTH': 'pyth-network',
      'BONK': 'bonk',
      'WIF': 'dogwifhat',
      'PEPE': 'pepe',
      'FLOKI': 'floki',
      'BABYDOGE': 'babydoge-coin',
    };

    if (popularCoins[upperSymbol]) {
      return popularCoins[upperSymbol];
    }

    return null;
  }

  async updateCryptoPrices(): Promise<void> {
    try {
      console.log('🔄 Updating crypto prices...');
      
      // Fetch top cryptocurrencies from CoinGecko with sparkline data
      const response = await fetch(
        `${this.baseUrl}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true&price_change_percentage=24h&x_cg_demo_api_key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const coins = await response.json() as any[];
      
      // Import storage here to avoid circular dependency
      const { storage } = await import('../storage');
      
      // Save each coin to storage
      console.log(`📊 Saving ${coins.length} coins to storage...`);
      for (const coin of coins) {
        try {
          const asset = await storage.upsertCryptoAsset({
            id: coin.id,
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
            price: coin.current_price.toString(),
            priceChange24h: coin.price_change_percentage_24h?.toString() || null,
            marketCap: coin.market_cap?.toString() || null,
            volume24h: coin.total_volume?.toString() || null,
                         sparklineData: coin.sparkline_in_7d?.price || null,
          });
          console.log(`✅ Saved: ${asset.symbol} - $${asset.price} - Sparkline: ${asset.sparklineData?.length || 0} points`);
        } catch (error) {
          console.error(`❌ Error saving ${coin.symbol}:`, error);
        }
      }

      console.log(`✅ Updated ${coins.length} crypto prices`);
    } catch (error) {
      console.error('Error updating crypto prices:', error);
    }
  }

  async updateMarketSummary(): Promise<void> {
    try {
      console.log('🔄 Updating market summary...');
      
      // Fetch global market data
      const response = await fetch(
        `${this.baseUrl}/global?x_cg_demo_api_key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const data = await response.json() as any;
      const globalData = data.data;

      // Import storage here to avoid circular dependency
      const { storage } = await import('../storage');
      
      // Update market summary
      await storage.updateMarketSummary({
        totalMarketCap: globalData.total_market_cap.usd.toString(),
        totalVolume24h: globalData.total_volume.usd.toString(),
        btcDominance: globalData.market_cap_percentage.btc.toString(),
        fearGreedIndex: null, // Would need separate API
                 marketChange24h: globalData.market_cap_change_percentage_24h_usd?.toString() || null,
      });

      console.log('✅ Market summary updated');
    } catch (error) {
      console.error('Error updating market summary:', error);
    }
  }
}
