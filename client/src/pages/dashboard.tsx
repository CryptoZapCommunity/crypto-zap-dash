import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { MarketOverview } from '@/components/dashboard/market-overview';
import { TrendingCoins as TrendingCoinsComponent } from '@/components/dashboard/trending-coins';
import { PriceChart } from '@/components/dashboard/price-chart';
import { CandlestickChart } from '@/components/dashboard/candlestick-chart';
import { NewsSection } from '@/components/dashboard/news-section';
import { EconomicCalendar } from '@/components/dashboard/economic-calendar';
import { WhaleActivity } from '@/components/dashboard/whale-activity';
import { AlertsPanel } from '@/components/dashboard/alerts-panel';
import { MarketSentiment } from '@/components/dashboard/market-sentiment';
import { PortfolioTracker } from '@/components/dashboard/portfolio-tracker';
import { t } from '@/lib/i18n';
import type { CryptoAsset, MarketSummary, TrendingCoins, News, EconomicEvent, WhaleTransaction } from '@/types';

export default function Dashboard() {
  console.log('🚀 Dashboard component rendering...');

  // Market data queries - OPTIMIZED for performance
  const { data: marketData, isLoading: marketLoading, error: marketError } = useQuery({
    queryKey: ['/api/market-summary'],
    queryFn: () => apiClient.getMarketSummary(),
    refetchInterval: 5 * 60 * 1000, // Poll every 5 minutes
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes garbage collection
  });

  console.log('📊 Market data:', { marketData, marketLoading, marketError });

  const { data: trendingCoins, isLoading: trendingLoading } = useQuery({
    queryKey: ['/api/trending-coins'],
    queryFn: () => apiClient.getTrendingCoins(),
    refetchInterval: 5 * 60 * 1000, // Poll every 5 minutes
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes garbage collection
  });

  console.log('📈 Trending coins:', { trendingCoins, trendingLoading });

  const { data: btcChart, isLoading: chartLoading } = useQuery({
    queryKey: ['/api/charts', 'bitcoin'],
    queryFn: () => apiClient.getChartData('bitcoin'),
    refetchInterval: 5 * 60 * 1000, // Poll every 5 minutes
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes garbage collection
  });

  // Candlestick data query
  const { data: candlestickData, isLoading: candlestickLoading } = useQuery({
    queryKey: ['/api/candlestick', 'bitcoin'],
    queryFn: () => apiClient.getCandlestickData('bitcoin', '1D', 100),
    refetchInterval: 5 * 60 * 1000, // Poll every 5 minutes
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes garbage collection
  }) as { data: { data: any[] } | undefined, isLoading: boolean };

  // News queries - Much less frequent updates
  const { data: latestNews, isLoading: newsLoading } = useQuery({
    queryKey: ['/api/news'],
    queryFn: () => apiClient.getNews(undefined, 5), // Reduced from 10 to 5
    refetchInterval: 10 * 60 * 1000, // Poll every 10 minutes
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour garbage collection
  });

  // Economic calendar query - Very infrequent
  const { data: economicEvents, isLoading: economicLoading } = useQuery({
    queryKey: ['/api/economic-calendar'],
    queryFn: () => {
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return apiClient.getEconomicCalendar(today, nextWeek);
    },
    refetchInterval: 2 * 60 * 60 * 1000, // Refetch every 2 hours (increased)
    staleTime: 60 * 60 * 1000, // 1 hour (increased)
    gcTime: 2 * 60 * 60 * 1000, // 2 hours garbage collection
  });

  // Whale activity query - Much less frequent
  const { data: whaleTransactions, isLoading: whaleLoading } = useQuery({
    queryKey: ['/api/whale-movements'],
    queryFn: () => apiClient.getWhaleMovements(5), // Reduced from 10 to 5
    refetchInterval: 15 * 60 * 1000, // Poll every 15 minutes
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes garbage collection
  });

  const cryptoAssets: CryptoAsset[] = (marketData as any)?.cryptoAssets || [];
  const marketSummary: MarketSummary | null = (marketData as any)?.marketSummary || null;
  const trending: TrendingCoins | null = trendingCoins as TrendingCoins || null;
  const news: News[] = (latestNews as News[]) || [];
  const events: EconomicEvent[] = (economicEvents as EconomicEvent[]) || [];
  const whales: WhaleTransaction[] = (whaleTransactions as WhaleTransaction[]) || [];

  console.log('🔍 Processed data:', { 
    cryptoAssets: cryptoAssets.length, 
    marketSummary: !!marketSummary, 
    trending: !!trending,
    news: news.length,
    events: events.length,
    whales: whales.length
  });

  if (marketError) {
    console.error('❌ Market error:', marketError);
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-2">
            {t('common.error')}
          </p>
          <p className="text-muted-foreground">
            Failed to load market data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  console.log('✅ Rendering dashboard...');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Market Overview Cards */}
      <section>
        <MarketOverview
          cryptoAssets={cryptoAssets}
          marketSummary={marketSummary}
          isLoading={marketLoading}
        />
      </section>

      {/* Main Dashboard Grid - OPTIMIZED */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Charts & Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* Price Chart */}
          <section>
            <PriceChart
              chartData={btcChart as any}
              isLoading={chartLoading}
            />
          </section>

          {/* Candlestick Chart */}
          <section>
            <CandlestickChart
              symbol="BTC"
              data={candlestickData?.data || null}
              isLoading={candlestickLoading}
            />
          </section>

          {/* Trending Coins */}
          <section>
            <TrendingCoinsComponent
              trendingCoins={trending}
              isLoading={trendingLoading}
            />
          </section>
        </div>

        {/* Right Column: News & Events - REDUCED */}
        <div className="space-y-6">
          {/* Alerts Panel */}
          <section>
            <AlertsPanel />
          </section>

          {/* Latest News - REDUCED */}
          <section>
            <NewsSection
              news={news.slice(0, 3)} // Reduced from 5 to 3
              isLoading={newsLoading}
            />
          </section>

          {/* Whale Activity - REDUCED */}
          <section>
            <WhaleActivity
              whaleTransactions={whales.slice(0, 3)} // Reduced from 5 to 3
              isLoading={whaleLoading}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
