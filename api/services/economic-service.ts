import { storage } from '../storage.js';
import type { InsertEconomicEvent, InsertFedUpdate } from '@shared/schema';

interface TradingEconomicsEvent {
  title: string;
  country: string;
  category: string;
  importance: number;
  currency: string;
  forecast: string;
  previous: string;
  actual?: string;
  date: string;
  url?: string;
}

export class EconomicService {
  private readonly TRADING_ECONOMICS_API_KEY = process.env.TRADING_ECONOMICS_API_KEY || '';
  private readonly FRED_API_KEY = process.env.FRED_API_KEY || '';

  async updateEconomicCalendar(): Promise<void> {
    try {
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      const response = await fetch(
        `https://api.tradingeconomics.com/calendar?c=${this.TRADING_ECONOMICS_API_KEY}&from=${today.toISOString().split('T')[0]}&to=${nextWeek.toISOString().split('T')[0]}`
      );

      if (!response.ok) {
        console.warn(`TradingEconomics API error: ${response.status}, using mock data`);
        await this.createMockEconomicEvents();
        return;
      }

      const events: TradingEconomicsEvent[] = await response.json();

      for (const event of events) {
        const economicEvent: InsertEconomicEvent = {
          title: event.title,
          country: this.mapCountryCode(event.country),
          currency: event.currency,
          impact: this.mapImportanceToImpact(event.importance),
          forecast: event.forecast,
          previous: event.previous,
          actual: event.actual || null,
          eventDate: new Date(event.date),
          sourceUrl: event.url || null,
        };

        await storage.createEconomicEvent(economicEvent);
      }
    } catch (error) {
      console.error('Error updating economic calendar:', error);
      // Fallback to mock data
      await this.createMockEconomicEvents();
    }
  }

  async updateFedUpdates(): Promise<void> {
    try {
      console.log('🔄 Starting FED updates...');
      
      // Try to get Federal Reserve data from FRED API
      const response = await fetch(
        `https://api.stlouisfed.org/fred/releases?api_key=${this.FRED_API_KEY}&file_type=json&limit=10`
      );

      if (!response.ok) {
        console.warn(`FRED API error: ${response.status}, using mock data`);
        await this.createMockFedUpdates();
        return;
      }

      const data = await response.json();
      const releases = data.releases || [];

      console.log(`📊 Found ${releases.length} FED releases`);

      for (const release of releases) {
        const fedUpdate: InsertFedUpdate = {
          title: release.name,
          type: this.classifyFedUpdateType(release.name),
          content: release.notes || '',
          interestRate: null,
          speaker: null,
          sourceUrl: release.link || null,
          publishedAt: new Date(release.realtime_start),
        };

        await storage.createFedUpdate(fedUpdate);
        console.log(`✅ Created FED update: ${release.name}`);
      }
      
      console.log('✅ FED updates completed');
    } catch (error) {
      console.error('Error updating FED updates:', error);
      // Fallback to mock data
      await this.createMockFedUpdates();
    }
  }

  private async createMockEconomicEvents(): Promise<void> {
    const mockEvents = [
      {
        title: 'Consumer Price Index (CPI)',
        country: 'US',
        currency: 'USD',
        impact: 'high' as const,
        forecast: '3.2%',
        previous: '3.1%',
        actual: null,
        eventDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
        sourceUrl: 'https://www.bls.gov/cpi/',
      },
      {
        title: 'Gross Domestic Product (GDP)',
        country: 'EU',
        currency: 'EUR',
        impact: 'medium' as const,
        forecast: '0.3%',
        previous: '0.1%',
        actual: null,
        eventDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        sourceUrl: 'https://ec.europa.eu/eurostat',
      },
      {
        title: 'Bank of Japan Interest Rate Decision',
        country: 'JP',
        currency: 'JPY',
        impact: 'high' as const,
        forecast: '-0.1%',
        previous: '-0.1%',
        actual: null,
        eventDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        sourceUrl: 'https://www.boj.or.jp/en/',
      },
    ];

    for (const event of mockEvents) {
      await storage.createEconomicEvent(event);
    }
  }

  private async createMockFedUpdates(): Promise<void> {
    console.log('🔄 Creating mock FED updates...');
    
    const mockUpdates = [
      {
        title: 'Federal Reserve Maintains Interest Rates at 5.25%-5.50%',
        type: 'rate_decision' as const,
        content: 'The Federal Open Market Committee decided to maintain the federal funds rate at the current range of 5.25% to 5.50%.',
        interestRate: '5.375',
        speaker: null,
        sourceUrl: 'https://www.federalreserve.gov/newsevents/pressreleases/monetary20240101a.htm',
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        title: 'Chair Powell Speech on Economic Outlook',
        type: 'speech' as const,
        content: 'Federal Reserve Chair Jerome Powell discusses the current economic outlook and monetary policy stance.',
        interestRate: null,
        speaker: 'Jerome Powell',
        sourceUrl: 'https://www.federalreserve.gov/newsevents/speech/powell20240101a.htm',
        publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      },
      {
        title: 'FOMC Minutes: Economic Recovery Continues',
        type: 'fomc_minutes' as const,
        content: 'The Federal Open Market Committee minutes show continued economic recovery with inflation concerns.',
        interestRate: null,
        speaker: null,
        sourceUrl: 'https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm',
        publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      },
      {
        title: 'Fed Governor Speech on Digital Currency',
        type: 'speech' as const,
        content: 'Federal Reserve Governor discusses the future of digital currency and CBDC development.',
        interestRate: null,
        speaker: 'Federal Reserve Governor',
        sourceUrl: 'https://www.federalreserve.gov/newsevents/speech/',
        publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
    ];

    for (const update of mockUpdates) {
      await storage.createFedUpdate(update);
      console.log(`✅ Created mock FED update: ${update.title}`);
    }
    
    console.log('✅ Mock FED updates completed');
  }

  private mapCountryCode(country: string): string {
    const countryMap: Record<string, string> = {
      'United States': 'US',
      'Euro Area': 'EU',
      'European Union': 'EU',
      'Germany': 'DE',
      'Japan': 'JP',
      'United Kingdom': 'UK',
      'China': 'CN',
      'Canada': 'CA',
      'Australia': 'AU',
    };

    return countryMap[country] || country;
  }

  private mapImportanceToImpact(importance: number): string {
    if (importance >= 3) return 'high';
    if (importance >= 2) return 'medium';
    return 'low';
  }

  private classifyFedUpdateType(title: string): string {
    const lowerTitle = title.toLowerCase();
    
    if (lowerTitle.includes('interest rate') || lowerTitle.includes('federal funds rate')) {
      return 'rate_decision';
    }
    if (lowerTitle.includes('fomc') || lowerTitle.includes('minutes')) {
      return 'fomc_minutes';
    }
    if (lowerTitle.includes('speech') || lowerTitle.includes('remarks')) {
      return 'speech';
    }
    if (lowerTitle.includes('projection') || lowerTitle.includes('forecast')) {
      return 'projection';
    }
    
    return 'rate_decision';
  }
}
