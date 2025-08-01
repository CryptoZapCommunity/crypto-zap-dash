import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Search,
  Filter,
  RefreshCw,
  Eye,
  EyeOff,
  Star,
  StarOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { t } from '@/lib/i18n';
import { CryptoIcon } from '@/components/ui/crypto-icon';
import type { CryptoAsset, MarketSummary } from '@/types';

interface CryptoMarketData {
  cryptoAssets: CryptoAsset[];
  marketSummary: MarketSummary;
}

export default function CryptoMarket() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'marketCap' | 'volume' | 'change'>('marketCap');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Helper function to format large numbers
  const formatLargeNumber = (num: number): string => {
    if (num >= 1e12) {
      return (num / 1e12).toFixed(2) + 'T';
    } else if (num >= 1e9) {
      return (num / 1e9).toFixed(2) + 'B';
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(2) + 'M';
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(2) + 'K';
    } else {
      return num.toFixed(2);
    }
  };

  // Fetch crypto market data
  const { data: marketData, isLoading, error } = useQuery({
    queryKey: ['/api/market-summary'],
    queryFn: () => apiClient.getMarketSummary(),
    refetchInterval: false, // WebSocket handles updates
    staleTime: 5 * 60 * 1000,
  });

  const cryptoAssets: CryptoAsset[] = (marketData as any)?.cryptoAssets || [];
  const marketSummary: MarketSummary | null = (marketData as any)?.marketSummary || null;

  // Filter and sort crypto assets
  const filteredAssets = (Array.isArray(cryptoAssets) ? cryptoAssets : [])
    .filter(asset => 
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'marketCap':
          return parseFloat(b.marketCap || '0') - parseFloat(a.marketCap || '0');
        case 'volume':
          return parseFloat(b.volume24h || '0') - parseFloat(a.volume24h || '0');
        case 'change':
          return parseFloat(b.priceChange24h || '0') - parseFloat(a.priceChange24h || '0');
        default:
          return 0;
      }
    });

  const toggleFavorite = (assetId: string) => {
    setFavorites(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const getChangeColor = (change: string) => {
    const changeValue = parseFloat(change);
    return changeValue > 0 ? 'text-green-500' : changeValue < 0 ? 'text-red-500' : 'text-muted-foreground';
  };

  const getChangeIcon = (change: string) => {
    const changeValue = parseFloat(change);
    return changeValue > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-2">
            {t('common.error')}
          </p>
          <p className="text-muted-foreground">
            Failed to load crypto market data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Crypto Market</h1>
          <p className="text-muted-foreground">
            Real-time cryptocurrency prices and market analysis
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFavorites(!showFavorites)}
          >
            {showFavorites ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span className="ml-2">Favorites</span>
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4" />
            <span className="ml-2">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Market Overview Cards */}
      {marketSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Market Cap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(parseFloat(marketSummary.totalMarketCap) / 1e9).toFixed(2)}B
              </div>
              <p className="text-xs text-muted-foreground">
                {marketSummary.marketChange24h && (
                  <span className={getChangeColor(marketSummary.marketChange24h)}>
                    {parseFloat(marketSummary.marketChange24h) > 0 ? '+' : ''}
                    {parseFloat(marketSummary.marketChange24h).toFixed(2)}%
                  </span>
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(parseFloat(marketSummary.totalVolume24h) / 1e6).toFixed(2)}M
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">BTC Dominance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {parseFloat(marketSummary.btcDominance || '0').toFixed(1)}%
              </div>
              <Progress value={parseFloat(marketSummary.btcDominance || '0')} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Fear & Greed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {marketSummary.fearGreedIndex || 'N/A'}
              </div>
              <p className="text-xs text-muted-foreground">
                {marketSummary.fearGreedIndex ? 
                  (marketSummary.fearGreedIndex > 70 ? 'Greed' : 
                   marketSummary.fearGreedIndex < 30 ? 'Fear' : 'Neutral') : 
                  'No Data'}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search cryptocurrencies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="marketCap">Market Cap</SelectItem>
              <SelectItem value="volume">Volume</SelectItem>
              <SelectItem value="change">24h Change</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <BarChart3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <BarChart3 className="w-4 h-4 rotate-90" />
          </Button>
        </div>
      </div>

      {/* Crypto Assets */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-16" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className={cn(
          "grid gap-4",
          viewMode === 'grid' 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
            : "grid-cols-1"
        )}>
                      {(Array.isArray(filteredAssets) ? filteredAssets : []).map((asset) => (
            <Card key={asset.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CryptoIcon symbol={asset.symbol} size="md" />
                    <div>
                      <CardTitle className="text-lg">{asset.symbol}</CardTitle>
                      <CardDescription className="text-sm">{asset.name}</CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(asset.id)}
                  >
                    {favorites.includes(asset.id) ? (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    ) : (
                      <StarOff className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    ${parseFloat(asset.price).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: parseFloat(asset.price) > 1 ? 2 : 6
                    })}
                  </span>
                  <div className={cn("flex items-center space-x-1", getChangeColor(asset.priceChange24h || '0'))}>
                    {getChangeIcon(asset.priceChange24h || '0')}
                    <span className="text-sm font-medium">
                      {parseFloat(asset.priceChange24h || '0').toFixed(2)}%
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Market Cap</span>
                    <p className="font-medium">
                      ${formatLargeNumber(parseFloat(asset.marketCap || '0'))}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Volume 24h</span>
                    <p className="font-medium">
                      ${formatLargeNumber(parseFloat(asset.volume24h || '0'))}
                    </p>
                  </div>
                </div>
                
                {asset.sparklineData && asset.sparklineData.length > 0 && (
                  <div className="h-16 bg-muted rounded-lg p-2">
                    {/* Sparkline chart would go here */}
                    <div className="w-full h-full bg-gradient-to-r from-primary/20 to-green-500/20 rounded" />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredAssets.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No cryptocurrencies found matching your search.</p>
        </div>
      )}
    </div>
  );
} 