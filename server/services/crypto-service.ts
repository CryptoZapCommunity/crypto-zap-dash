import { storage } from '../storage';
import type { InsertCryptoAsset, InsertMarketSummary } from '@shared/schema';

interface CoinGeckoPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

interface CoinGeckoGlobal {
  data: {
    total_market_cap: { usd: number };
    total_volume: { usd: number };
    market_cap_percentage: { btc: number };
    market_cap_change_percentage_24h_usd: number;
  };
}

interface FearGreedIndex {
  name: string;
  data: Array<{
    value: string;
    value_classification: string;
    timestamp: string;
    time_until_update?: string;
  }>;
  metadata: {
    error: null | string;
  };
}

export class CryptoService {
  private readonly COINGECKO_API = 'https://api.coingecko.com/api/v3';
  private readonly FEAR_GREED_API = 'https://api.alternative.me/fng';
  private readonly API_KEY = process.env.COINGECKO_API_KEY || '';

  async updateCryptoPrices(): Promise<void> {
    try {
      const response = await fetch(
        `${this.COINGECKO_API}/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana&order=market_cap_desc&per_page=100&page=1&sparkline=true&x_cg_demo_api_key=${this.API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const coins: CoinGeckoPrice[] = await response.json();

      for (const coin of coins) {
        const asset: InsertCryptoAsset = {
          id: coin.id,
          symbol: coin.symbol.toUpperCase(),
          name: coin.name,
          price: coin.current_price.toString(),
          priceChange24h: coin.price_change_percentage_24h?.toString() || '0',
          marketCap: coin.market_cap?.toString() || '0',
          volume24h: coin.total_volume?.toString() || '0',
          sparklineData: coin.sparkline_in_7d?.price || [],
        };

        await storage.upsertCryptoAsset(asset);
      }
    } catch (error) {
      console.error('Error updating crypto prices:', error);
      throw error;
    }
  }

  async updateMarketSummary(): Promise<void> {
    try {
      // Get global market data
      const globalResponse = await fetch(
        `${this.COINGECKO_API}/global?x_cg_demo_api_key=${this.API_KEY}`
      );

      if (!globalResponse.ok) {
        throw new Error(`CoinGecko Global API error: ${globalResponse.status}`);
      }

      const globalData: CoinGeckoGlobal = await globalResponse.json();

      // Get Fear & Greed Index
      const fearGreedResponse = await fetch(this.FEAR_GREED_API);
      let fearGreedIndex = 50; // Default neutral value

      if (fearGreedResponse.ok) {
        const fearGreedData: FearGreedIndex = await fearGreedResponse.json();
        if (fearGreedData.data && fearGreedData.data.length > 0) {
          fearGreedIndex = parseInt(fearGreedData.data[0].value);
        }
      }

      const summary: InsertMarketSummary = {
        totalMarketCap: globalData.data.total_market_cap.usd.toString(),
        totalVolume24h: globalData.data.total_volume.usd.toString(),
        btcDominance: globalData.data.market_cap_percentage.btc.toString(),
        fearGreedIndex,
        marketChange24h: globalData.data.market_cap_change_percentage_24h_usd.toString(),
      };

      await storage.updateMarketSummary(summary);
    } catch (error) {
      console.error('Error updating market summary:', error);
      throw error;
    }
  }

  async getTrendingCoins(): Promise<{ gainers: any[], losers: any[] }> {
    try {
      const response = await fetch(
        `${this.COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&price_change_percentage=24h&x_cg_demo_api_key=${this.API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const coins: CoinGeckoPrice[] = await response.json();

      const gainers = coins
        .filter(coin => coin.price_change_percentage_24h > 0)
        .sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))
        .slice(0, 5)
        .map(coin => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          price: coin.current_price,
          change: coin.price_change_percentage_24h,
        }));

      const losers = coins
        .filter(coin => coin.price_change_percentage_24h < 0)
        .sort((a, b) => (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0))
        .slice(0, 5)
        .map(coin => ({
          id: coin.id,
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          price: coin.current_price,
          change: coin.price_change_percentage_24h,
        }));

      return { gainers, losers };
    } catch (error) {
      console.error('Error getting trending coins:', error);
      return { gainers: [], losers: [] };
    }
  }

  async getCryptoIcons(symbols: string[]): Promise<Record<string, string>> {
    try {
      const icons: Record<string, string> = {};
      
      // Map common symbols to CoinGecko IDs
      const symbolToId: Record<string, string> = {
        'BTC': 'bitcoin',
        'ETH': 'ethereum',
        'SOL': 'solana',
        'ADA': 'cardano',
        'DOT': 'polkadot',
        'LINK': 'chainlink',
        'LTC': 'litecoin',
        'BCH': 'bitcoin-cash',
        'XLM': 'stellar',
        'ATOM': 'cosmos',
        'AVAX': 'avalanche-2',
        'MATIC': 'matic-network',
        'UNI': 'uniswap',
        'AAVE': 'aave',
        'COMP': 'compound-governance-token',
        'MKR': 'maker',
        'SNX': 'havven',
        'YFI': 'yearn-finance',
        'CRV': 'curve-dao-token',
        'SUSHI': 'sushi',
        '1INCH': '1inch',
        'ALPHA': 'alpha-finance',
        'BAL': 'balancer',
        'REN': 'republic-protocol',
        'ZRX': '0x',
        'BAND': 'band-protocol',
        'NMR': 'numeraire',
        'UMA': 'uma',
        'KNC': 'kyber-network-crystal',
        'STORJ': 'storj',
        'MANA': 'decentraland',
        'SAND': 'the-sandbox',
        'ENJ': 'enjincoin',
        'CHZ': 'chiliz',
        'HOT': 'holochain',
        'BAT': 'basic-attention-token',
        'ZEN': 'horizen',
        'DASH': 'dash',
        'XMR': 'monero',
        'ZEC': 'zcash',
        'ETC': 'ethereum-classic',
        'XRP': 'ripple',
        'TRX': 'tron',
        'EOS': 'eos',
        'NEO': 'neo',
        'VET': 'vechain',
        'ICX': 'icon',
        'ONT': 'ontology',
        'QTUM': 'qtum',
        'NANO': 'nano',
        'IOTA': 'iota',
        'OMG': 'omisego',
        'ZIL': 'zilliqa',
        'WAVES': 'waves',
        'ALGO': 'algorand',
        'XTZ': 'tezos',
        'FIL': 'filecoin',
        'THETA': 'theta-token',
        'HBAR': 'hedera-hashgraph',
        'NEAR': 'near',
        'FTM': 'fantom',
        'ONE': 'harmony',
        'AR': 'arweave',
        'ICP': 'internet-computer',
        'FLOW': 'flow',
        'KSM': 'kusama',
        'DYDX': 'dydx',
        'IMX': 'immutable-x',
        'OP': 'optimism',
        'ARB': 'arbitrum',
        'SUI': 'sui',
        'APT': 'aptos',
        'SEI': 'sei-network',
        'INJ': 'injective-protocol',
        'TIA': 'celestia',
        'JUP': 'jupiter',
        'PYTH': 'pyth-network',
        'WIF': 'dogwifhat',
        'BONK': 'bonk',
        'PEPE': 'pepe',
        'SHIB': 'shiba-inu',
        'DOGE': 'dogecoin',
      };
      
      for (const symbol of symbols) {
        const coinId = symbolToId[symbol.toUpperCase()] || symbol.toLowerCase();
        const response = await fetch(
          `${this.COINGECKO_API}/coins/${coinId}?x_cg_demo_api_key=${this.API_KEY}`
        );

        if (response.ok) {
          const coinData = await response.json();
          if (coinData.image?.small) {
            icons[symbol.toUpperCase()] = coinData.image.small;
          }
        }
      }

      return icons;
    } catch (error) {
      console.error('Error getting crypto icons:', error);
      return {};
    }
  }

  async getCryptoIcon(symbol: string): Promise<string | null> {
    try {
      console.log('🪙 Fetching icon for:', symbol);
      
      // Map common symbols to CoinGecko IDs
      const symbolToId: Record<string, string> = {
        'BTC': 'bitcoin',
        'ETH': 'ethereum',
        'SOL': 'solana',
        'ADA': 'cardano',
        'DOT': 'polkadot',
        'LINK': 'chainlink',
        'LTC': 'litecoin',
        'BCH': 'bitcoin-cash',
        'XLM': 'stellar',
        'ATOM': 'cosmos',
        'AVAX': 'avalanche-2',
        'MATIC': 'matic-network',
        'UNI': 'uniswap',
        'AAVE': 'aave',
        'COMP': 'compound-governance-token',
        'MKR': 'maker',
        'SNX': 'havven',
        'YFI': 'yearn-finance',
        'CRV': 'curve-dao-token',
        'SUSHI': 'sushi',
        '1INCH': '1inch',
        'ALPHA': 'alpha-finance',
        'BAL': 'balancer',
        'REN': 'republic-protocol',
        'ZRX': '0x',
        'BAND': 'band-protocol',
        'NMR': 'numeraire',
        'UMA': 'uma',
        'KNC': 'kyber-network-crystal',
        'STORJ': 'storj',
        'MANA': 'decentraland',
        'SAND': 'the-sandbox',
        'ENJ': 'enjincoin',
        'CHZ': 'chiliz',
        'HOT': 'holochain',
        'BAT': 'basic-attention-token',
        'ZEN': 'horizen',
        'DASH': 'dash',
        'XMR': 'monero',
        'ZEC': 'zcash',
        'ETC': 'ethereum-classic',
        'XRP': 'ripple',
        'TRX': 'tron',
        'EOS': 'eos',
        'NEO': 'neo',
        'VET': 'vechain',
        'ICX': 'icon',
        'ONT': 'ontology',
        'QTUM': 'qtum',
        'NANO': 'nano',
        'IOTA': 'iota',
        'OMG': 'omisego',
        'ZIL': 'zilliqa',
        'WAVES': 'waves',
        'ALGO': 'algorand',
        'XTZ': 'tezos',
        'FIL': 'filecoin',
        'THETA': 'theta-token',
        'HBAR': 'hedera-hashgraph',
        'NEAR': 'near',
        'FTM': 'fantom',
        'ONE': 'harmony',
        'AR': 'arweave',
        'ICP': 'internet-computer',
        'FLOW': 'flow',
        'KSM': 'kusama',
        'DYDX': 'dydx',
        'IMX': 'immutable-x',
        'OP': 'optimism',
        'ARB': 'arbitrum',
        'SUI': 'sui',
        'APT': 'aptos',
        'SEI': 'sei-network',
        'INJ': 'injective-protocol',
        'TIA': 'celestia',
        'JUP': 'jupiter',
        'PYTH': 'pyth-network',
        'WIF': 'dogwifhat',
        'BONK': 'bonk',
        'PEPE': 'pepe',
        'SHIB': 'shiba-inu',
        'DOGE': 'dogecoin',
      };
      
      const coinId = symbolToId[symbol.toUpperCase()] || symbol.toLowerCase();
      const url = `${this.COINGECKO_API}/coins/${coinId}?x_cg_demo_api_key=${this.API_KEY}`;
      console.log('🌐 Requesting URL:', url.replace(this.API_KEY, '***'));
      
      const response = await fetch(url);
      console.log('📊 Response status:', response.status);

      if (response.ok) {
        const coinData = await response.json();
        const iconUrl = coinData.image?.small || null;
        console.log('✅ Icon found:', iconUrl ? 'Yes' : 'No');
        return iconUrl;
      }

      console.log('❌ Icon not found for:', symbol);
      return null;
    } catch (error) {
      console.error('❌ Error getting crypto icon for', symbol, ':', error);
      return null;
    }
  }
}
