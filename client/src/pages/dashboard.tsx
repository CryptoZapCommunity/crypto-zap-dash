import { useMarketSummary, useTrendingCoins, useNews, useEconomicCalendar, useWhaleTransactions, useFredIndicators, useAirdrops, useCryptoOverview, useMarketSentiment } from '@/hooks/use-market-data';
import { MarketOverview } from '@/components/dashboard/market-overview';
import { TrendingCoins as TrendingCoinsComponent } from '@/components/dashboard/trending-coins';
import { PriceChart } from '@/components/dashboard/price-chart';
import { NewsSection } from '@/components/dashboard/news-section';
import { EconomicCalendar } from '@/components/dashboard/economic-calendar';
import { WhaleActivity } from '@/components/dashboard/whale-activity';
import { AlertsPanel } from '@/components/dashboard/alerts-panel';
import { MarketSentiment } from '@/components/dashboard/market-sentiment';
import { PortfolioTracker } from '@/components/dashboard/portfolio-tracker';
import { t } from '@/lib/i18n';
import type { CryptoAsset, MarketSummary, TrendingCoins, News, EconomicEvent, WhaleTransaction, PortfolioAsset, Alert, SentimentData } from '@/types';
import { normalizeMarketData, normalizeTrendingCoins, normalizeNews, normalizeEconomicEvents, normalizeWhaleTransactions, normalizeSentimentData, normalizeCryptoAssets } from '@/lib/api-utils';
import { debugApiCalls, debugApiConfig } from '@/lib/api-debug';

export default function Dashboard() {
  if (import.meta.env.DEV) {
    console.log('🚀 Dashboard component rendering...');
  }

  // Market data queries - usando hooks personalizados com localStorage
  const { 
    data: marketData, 
    isLoading: marketLoading, 
    error: marketError,
    refetch: refetchMarket,
    clearCache: clearMarketCache
  } = useMarketSummary();

  const { 
    data: trendingCoins, 
    isLoading: trendingLoading,
    error: trendingError,
    refetch: refetchTrending,
    clearCache: clearTrendingCache
  } = useTrendingCoins();

  const { 
    data: latestNews, 
    isLoading: newsLoading,
    error: newsError,
    refetch: refetchNews,
    clearCache: clearNewsCache
  } = useNews(undefined, 5);

  const { 
    data: economicEvents, 
    isLoading: economicLoading,
    error: economicError,
    refetch: refetchEconomic,
    clearCache: clearEconomicCache
  } = useEconomicCalendar();

  const { 
    data: whaleTransactions, 
    isLoading: whaleLoading,
    error: whaleError,
    refetch: refetchWhale,
    clearCache: clearWhaleCache
  } = useWhaleTransactions(5);

  const { 
    data: fedIndicators, 
    isLoading: fedLoading,
    error: fedError,
    refetch: refetchFed,
    clearCache: clearFedCache
  } = useFredIndicators();

  const { 
    data: airdrops, 
    isLoading: airdropsLoading,
    error: airdropsError,
    refetch: refetchAirdrops,
    clearCache: clearAirdropsCache
  } = useAirdrops('active');

  const { 
    data: cryptoOverview, 
    isLoading: overviewLoading,
    error: overviewError,
    refetch: refetchOverview,
    clearCache: clearOverviewCache
  } = useCryptoOverview();

  const { 
    data: marketSentiment, 
    isLoading: sentimentLoading,
    error: sentimentError,
    refetch: refetchSentiment,
    clearCache: clearSentimentCache
  } = useMarketSentiment();

  // Data processing usando normalizadores com fallbacks
  const marketSummary: MarketSummary | null = normalizeMarketData(marketData);
  const trending: TrendingCoins = normalizeTrendingCoins(trendingCoins);
  const news: News[] = normalizeNews(latestNews) || [];
  const events: EconomicEvent[] = normalizeEconomicEvents(economicEvents) || [];
  const whales: WhaleTransaction[] = normalizeWhaleTransactions(whaleTransactions) || [];
  const cryptoAssets: CryptoAsset[] = normalizeCryptoAssets(cryptoOverview) || [];
  const sentiment: SentimentData | undefined = normalizeSentimentData(marketSentiment) || undefined;

  // Mock portfolio assets baseado em cryptoAssets
  const portfolioAssets: PortfolioAsset[] = cryptoAssets.slice(0, 5).map(asset => ({
    id: asset.id || asset.symbol,
    symbol: asset.symbol,
    name: asset.name,
    amount: 1,
    avgPrice: parseFloat(asset.price || '0'),
    currentPrice: parseFloat(asset.price || '0'),
    value: parseFloat(asset.price || '0'),
    change24h: parseFloat(asset.priceChange24h || '0'),
    isWatching: true
  }));

  const alerts: Alert[] = [];

  if (import.meta.env.DEV) {
    console.log('🔍 Processed data:', { 
      marketSummary: !!marketSummary, 
      trending: !!trending,
      news: news.length,
      events: events.length,
      whales: whales.length,
      cryptoAssets: cryptoAssets.length
    });
  }

  // Simplified error handling - only show error for critical data
  if (marketError && trendingError) {
    console.error('❌ Critical dashboard errors:', { 
      marketError, 
      trendingError
    });
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-2">
            {t('common.error')}
          </p>
          <p className="text-muted-foreground">
            Failed to load critical dashboard data. Please try again later.
          </p>
          <button 
            onClick={() => {
              refetchMarket();
              refetchTrending();
            }}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (import.meta.env.DEV) {
    console.log('✅ Rendering dashboard...');
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t('dashboard.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('dashboard.subtitle')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              refetchMarket();
              refetchTrending();
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            {t('common.refresh')}
          </button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Market Overview & Trending */}
        <div className="lg:col-span-2 space-y-6">
          <MarketOverview 
            cryptoAssets={cryptoAssets}
            marketSummary={marketSummary}
            isLoading={marketLoading}
          />
          
          <TrendingCoinsComponent 
            trendingCoins={trending}
            isLoading={trendingLoading}
          />

          {/* Price Chart Section */}
          <div className="glassmorphism rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {t('dashboard.priceChart')}
              </h3>
              <div className="flex space-x-2">
                {['1D', '7D', '1M', '1Y'].map((period) => (
                  <button
                    key={period}
                    className="px-3 py-1 text-sm rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">
                Chart component will be implemented
              </p>
            </div>
          </div>

          {/* News Section */}
          {news.length > 0 && (
            <NewsSection 
              news={news}
              isLoading={newsLoading}
            />
          )}

          {/* Economic Calendar */}
          {events.length > 0 && (
            <EconomicCalendar 
              events={events}
              isLoading={economicLoading}
            />
          )}
        </div>

        {/* Right Column - Sidebar Components */}
        <div className="space-y-6">
          {/* Market Sentiment */}
          {sentiment && (
            <MarketSentiment 
              sentiment={sentiment}
              isLoading={sentimentLoading}
            />
          )}

          {/* Whale Activity */}
          {whales.length > 0 && (
            <WhaleActivity 
              whaleTransactions={whales}
              isLoading={whaleLoading}
            />
          )}

          {/* Portfolio Tracker */}
          <div className="glassmorphism rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {t('dashboard.portfolioTracker')}
              </h3>
              <button className="text-sm text-primary hover:underline">
                {t('common.viewAll')}
              </button>
            </div>
            <div className="space-y-3">
              {portfolioAssets.slice(0, 3).map((asset) => (
                <div key={asset.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {asset.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{asset.symbol}</p>
                      <p className="text-xs text-muted-foreground">{asset.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">${asset.currentPrice.toFixed(2)}</p>
                    <p className={`text-xs ${asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alerts Panel */}
          <div className="glassmorphism rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {t('alerts.title')}
              </h3>
              <button className="text-sm text-primary hover:underline">
                {t('alerts.markAllRead')}
              </button>
            </div>
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔔</span>
              </div>
              <p className="text-muted-foreground text-sm">
                {t('alerts.noAlerts')}
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                {t('alerts.noAlertsSubtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Additional Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Fear & Greed Index */}
        <div className="glassmorphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            {t('dashboard.fearGreed')}
          </h3>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="w-full h-3 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ 
                    width: '4px',
                    marginLeft: `${Math.max(0, Math.min(100, sentiment?.fear_greed_index || 50))}%`,
                    transform: 'translateX(-50%)'
                  }}
                />
              </div>
            </div>
            <span className="ml-4 text-2xl font-bold">
              {sentiment?.fear_greed_index || 50}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Market sentiment indicator
          </p>
        </div>

        {/* Quick Stats */}
        <div className="glassmorphism rounded-xl p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Quick Stats
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {cryptoAssets.length}
              </p>
              <p className="text-xs text-muted-foreground">Assets</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {news.length}
              </p>
              <p className="text-xs text-muted-foreground">News</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {events.length}
              </p>
              <p className="text-xs text-muted-foreground">Events</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {whales.length}
              </p>
              <p className="text-xs text-muted-foreground">Whales</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
