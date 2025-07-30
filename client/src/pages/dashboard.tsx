import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { MarketOverview } from '@/components/dashboard/market-overview';
import { TrendingCoins } from '@/components/dashboard/trending-coins';
import { PriceChart } from '@/components/dashboard/price-chart';
import { NewsSection } from '@/components/dashboard/news-section';
import { EconomicCalendar } from '@/components/dashboard/economic-calendar';
import { WhaleActivity } from '@/components/dashboard/whale-activity';
import { AlertsPanel } from '@/components/dashboard/alerts-panel';
import { MarketSentiment } from '@/components/dashboard/market-sentiment';
import { PortfolioTracker } from '@/components/dashboard/portfolio-tracker';
import { t } from '@/lib/i18n';
import type { CryptoAsset, MarketSummary, TrendingCoins as TrendingCoinsType, News, EconomicEvent, WhaleTransaction } from '@/types';

export default function Dashboard() {
  // Market data queries - DISABLED refetchInterval since WebSocket handles updates
  const { data: marketData, isLoading: marketLoading, error: marketError } = useQuery({
    queryKey: ['/api/market-summary'],
    queryFn: () => apiClient.getMarketSummary(),
    refetchInterval: false, // WebSocket handles real-time updates
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: trendingCoins, isLoading: trendingLoading } = useQuery({
    queryKey: ['/api/trending-coins'],
    queryFn: () => apiClient.getTrendingCoins(),
    refetchInterval: false, // WebSocket handles real-time updates
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: btcChart, isLoading: chartLoading } = useQuery({
    queryKey: ['/api/charts', 'bitcoin'],
    queryFn: () => apiClient.getChartData('bitcoin'),
    refetchInterval: false, // WebSocket handles real-time updates
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // News queries - Less frequent updates
  const { data: latestNews, isLoading: newsLoading } = useQuery({
    queryKey: ['/api/news'],
    queryFn: () => apiClient.getNews(undefined, 10),
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes (was 5)
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Economic calendar query - Much less frequent
  const { data: economicEvents, isLoading: economicLoading } = useQuery({
    queryKey: ['/api/economic-calendar'],
    queryFn: () => {
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return apiClient.getEconomicCalendar(today, nextWeek);
    },
    refetchInterval: 60 * 60 * 1000, // Refetch every hour (unchanged)
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  // Whale activity query - Less frequent
  const { data: whaleTransactions, isLoading: whaleLoading } = useQuery({
    queryKey: ['/api/whale-movements'],
    queryFn: () => apiClient.getWhaleMovements(10),
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes (was 2)
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const cryptoAssets: CryptoAsset[] = (marketData as any)?.cryptoAssets || [];
  const marketSummary: MarketSummary | null = (marketData as any)?.marketSummary || null;
  const trending: TrendingCoinsType | null = trendingCoins as TrendingCoinsType || null;
  const news: News[] = (latestNews as News[]) || [];
  const events: EconomicEvent[] = (economicEvents as EconomicEvent[]) || [];
  const whales: WhaleTransaction[] = (whaleTransactions as WhaleTransaction[]) || [];

  if (marketError) {
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

      {/* Main Dashboard Grid */}
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

          {/* Trending Coins */}
          <section>
            <TrendingCoins
              trendingCoins={trending}
              isLoading={trendingLoading}
            />
          </section>

          {/* Portfolio Tracker */}
          <section>
            <PortfolioTracker />
          </section>
        </div>

        {/* Right Column: News & Events */}
        <div className="space-y-6">
          {/* Alerts Panel */}
          <section>
            <AlertsPanel />
          </section>

          {/* Market Sentiment */}
          <section>
            <MarketSentiment />
          </section>

          {/* Latest News */}
          <section>
            <NewsSection
              news={news}
              isLoading={newsLoading}
            />
          </section>

          {/* Economic Calendar */}
          <section>
            <EconomicCalendar
              events={events}
              isLoading={economicLoading}
            />
          </section>

          {/* Whale Activity */}
          <section>
            <WhaleActivity
              whaleTransactions={whales}
              isLoading={whaleLoading}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
