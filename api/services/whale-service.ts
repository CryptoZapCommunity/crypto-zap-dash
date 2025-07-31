import { storage } from '../storage.js';
import type { WhaleTransaction } from '../../shared/schema.js';

interface WhaleAlertTransaction {
  id: string;
  blockchain: string;
  symbol: string;
  amount: number;
  amount_usd: number;
  transaction_type: string;
  hash: string;
  from: {
    address: string;
    owner?: string;
    owner_type?: string;
  };
  to: {
    address: string;
    owner?: string;
    owner_type?: string;
  };
  timestamp: number;
}

export class WhaleService {
  private readonly WHALE_ALERT_API_KEY = process.env.WHALE_ALERT_API_KEY || '';
  private readonly MIN_VALUE = 1000000; // $1M minimum transaction value

  async updateWhaleTransactions(): Promise<void> {
    try {
      const response = await fetch(
        `https://api.whale-alert.io/v1/transactions?api_key=${this.WHALE_ALERT_API_KEY}&min_value=${this.MIN_VALUE}&limit=50`
      );

      if (!response.ok) {
        console.warn(`Whale Alert API error: ${response.status}, using mock data`);
        await this.createMockWhaleTransactions();
        return;
      }

      const data = await response.json() as any;
      const transactions: WhaleAlertTransaction[] = data.transactions || [];

      for (const tx of transactions) {
                 const whaleTransaction: any = {
          transactionHash: tx.hash,
          asset: tx.symbol.toUpperCase(),
          amount: tx.amount.toString(),
          valueUsd: tx.amount_usd.toString(),
          type: this.mapTransactionType(tx),
          fromAddress: tx.from.address,
          toAddress: tx.to.address,
          fromExchange: tx.from.owner_type === 'exchange' ? tx.from.owner || null : null,
          toExchange: tx.to.owner_type === 'exchange' ? tx.to.owner || null : null,
          timestamp: new Date(tx.timestamp * 1000),
        };

        await storage.createWhaleTransaction(whaleTransaction);
      }
    } catch (error) {
      console.error('Error updating whale transactions:', error);
      // Fallback to mock data
      await this.createMockWhaleTransactions();
    }
  }

  private async createMockWhaleTransactions(): Promise<void> {
    const mockTransactions = [
      {
        transactionHash: '0x1234567890abcdef1234567890abcdef12345678',
        asset: 'BTC',
        amount: '847.2',
        valueUsd: '36700000',
        type: 'inflow' as const,
        fromAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
        toAddress: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
        fromExchange: 'Binance',
        toExchange: null,
        timestamp: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
      },
      {
        transactionHash: '0xabcdef1234567890abcdef1234567890abcdef12',
        asset: 'ETH',
        amount: '1250',
        valueUsd: '3300000',
        type: 'outflow' as const,
        fromAddress: '0x742d35Cc6637C0532e6C9b3e33f2B9c4C7d3A3E3',
        toAddress: '0x742d35Cc6637C0532e6C9b3e33f2B9c4C7d3A3E4',
        fromExchange: null,
        toExchange: 'Coinbase',
        timestamp: new Date(Date.now() - 24 * 60 * 1000), // 24 minutes ago
      },
      {
        transactionHash: '0x567890abcdef1234567890abcdef1234567890ab',
        asset: 'USDT',
        amount: '5000000',
        valueUsd: '5000000',
        type: 'transfer' as const,
        fromAddress: '0x5041ed759dd4afc3a72b8192c143f72f4724081a',
        toAddress: '0x876eabf441b2ee5b5b0554fd502a8e0600950cfa',
        fromExchange: 'Binance',
        toExchange: 'Kraken',
        timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      },
    ];

    for (const tx of mockTransactions) {
      await storage.createWhaleTransaction(tx);
    }
  }

  private mapTransactionType(tx: WhaleAlertTransaction): string {
    const fromIsExchange = tx.from.owner_type === 'exchange';
    const toIsExchange = tx.to.owner_type === 'exchange';

    if (!fromIsExchange && toIsExchange) {
      return 'inflow';
    }
    if (fromIsExchange && !toIsExchange) {
      return 'outflow';
    }
    if (fromIsExchange && toIsExchange) {
      return 'transfer';
    }

    return 'transfer';
  }
}
