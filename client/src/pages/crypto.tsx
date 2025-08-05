import { useState } from 'react';
import { useMarketSummary } from '@/hooks/use-market-data';
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
import { normalizeMarketData, normalizeCryptoAssets } from '@/lib/api-utils';

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

  // Fetch crypto market data - usando hook personalizado
  const { 
    data: marketData, 
    isLoading, 
    error,
    refetch: refetchMarket,
    clearCache: clearMarketCache
  } = useMarketSummary();

  // Data processing com normalizadores
  const marketSummary: MarketSummary | null = normalizeMarketData(marketData);
  const cryptoAssets: CryptoAsset[] = normalizeCryptoAssets(marketData);

  // Filter and sort crypto assets
  const filteredAssets = (Array.isArray(cryptoAssets) ? cryptoAssets : [])
    .filter(asset => 
      asset.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.symbol?.toLowerCase().includes(searchTerm.toLowerCase())
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
    return changeValue > 0 ? <TrendingUp className="w-4 h-4" /> : changeValue < 0 ? <TrendingDown className="w-4 h-4" /> : null;
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
          <button 
            onClick={() => refetchMarket()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {t('pages.crypto.title') || 'Crypto Market'}
          </h1>
          <p className="text-muted-foreground">
            {t('pages.crypto.subtitle') || 'Real-time cryptocurrency market data and analysis'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetchMarket()}
            disabled={isLoading}
          >
            <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => clearMarketCache()}
          >
            Clear Cache
          </Button>
        </div>
      </div>
      {/* Market Summary */}
      {marketSummary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glassmorphism">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Market Cap</p>
                  <p className="text-lg font-semibold">
                    ${formatLargeNumber(parseFloat(marketSummary.totalMarketCap))}
                  </p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="glassmorphism">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">24h Volume</p>
                  <p className="text-lg font-semibold">
                    ${formatLargeNumber(parseFloat(marketSummary.totalVolume24h))}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="glassmorphism">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">BTC Dominance</p>
                  <p className="text-lg font-semibold">
                    {parseFloat(marketSummary.btcDominance || '0').toFixed(1)}%
                  </p>
                </div>
                <CryptoIcon symbol="BTC" size="md" />
              </div>
            </CardContent>
          </Card>
          <Card className="glassmorphism">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Market Change</p>
                  <p className={cn(
                    "text-lg font-semibold",
                    parseFloat(marketSummary.marketChange24h || '0') > 0 ? "text-green-500" : "text-red-500"
                  )}>
                    {parseFloat(marketSummary.marketChange24h || '0') > 0 ? '+' : ''}{parseFloat(marketSummary.marketChange24h || '0').toFixed(2)}%
                  </p>
                </div>
                {getChangeIcon(marketSummary.marketChange24h || '0')}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder={t('common.search') || 'Search cryptocurrencies...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="marketCap">Market Cap</SelectItem>
              <SelectItem value="volume">Volume</SelectItem>
              <SelectItem value="change">Change</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <EyeOff className="w-4 h-4" />
          </Button>
          <Button
            variant={showFavorites ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowFavorites(!showFavorites)}
          >
            <Star className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {/* Crypto Assets Grid/List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="glassmorphism">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div>
                      <Skeleton className="w-20 h-4 mb-2" />
                      <Skeleton className="w-16 h-3" />
                    </div>
                  </div>
                  <Skeleton className="w-8 h-8 rounded-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-24 h-4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className={cn(
          "gap-6",
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
            : "space-y-4"
        )}>
          {filteredAssets.map((asset) => (
            <Card key={asset.id} className="glassmorphism hover:scale-105 transition-transform duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <CryptoIcon symbol={asset.symbol} size="md" />
                    <div>
                      <h3 className="font-semibold text-foreground">{asset.name}</h3>
                      <p className="text-sm text-muted-foreground">{asset.symbol.toUpperCase()}</p>
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
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Price</span>
                    <span className="font-semibold">
                      ${parseFloat(asset.price).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 6,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Market Cap</span>
                    <span className="font-medium">
                      ${formatLargeNumber(parseFloat(asset.marketCap || '0'))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">24h Change</span>
                    <div className="flex items-center space-x-1">
                      {getChangeIcon(asset.priceChange24h || '0')}
                      <span className={cn("font-medium", getChangeColor(asset.priceChange24h || '0'))}>
                        {parseFloat(asset.priceChange24h || '0').toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Volume (24h)</span>
                    <span className="font-medium">
                      ${formatLargeNumber(parseFloat(asset.volume24h || '0'))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {!isLoading && filteredAssets.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchTerm ? 'No cryptocurrencies found matching your search.' : 'No cryptocurrencies available.'}
          </p>
        </div>
      )}
    </div>
  );
} 