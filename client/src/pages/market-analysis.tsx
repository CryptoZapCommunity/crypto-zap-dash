import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { CryptoIcon } from '@/components/ui/crypto-icon';
import { TrendingUp, TrendingDown, BarChart3, Target, Zap, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'buy' | 'sell' | 'neutral';
  strength: number;
}

interface MarketAnalysis {
  asset: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  technicalIndicators: TechnicalIndicator[];
  supportLevels: number[];
  resistanceLevels: number[];
  sentiment: number;
  riskScore: number;
}

// Mock data for demonstration
const mockAnalysis: MarketAnalysis[] = [
  {
    asset: 'BTC',
    price: 102547,
    change24h: 2.34,
    volume24h: 28500000000,
    marketCap: 2050000000000,
    technicalIndicators: [
      { name: 'RSI', value: 68, signal: 'neutral', strength: 75 },
      { name: 'MACD', value: 1200, signal: 'buy', strength: 85 },
      { name: 'SMA 50', value: 98500, signal: 'buy', strength: 70 },
      { name: 'Bollinger', value: 0.85, signal: 'neutral', strength: 60 },
    ],
    supportLevels: [98000, 95500, 92000],
    resistanceLevels: [105000, 108500, 112000],
    sentiment: 72,
    riskScore: 45,
  },
  {
    asset: 'ETH',
    price: 3847,
    change24h: 4.12,
    volume24h: 15200000000,
    marketCap: 462000000000,
    technicalIndicators: [
      { name: 'RSI', value: 72, signal: 'buy', strength: 80 },
      { name: 'MACD', value: 45, signal: 'buy', strength: 90 },
      { name: 'SMA 50', value: 3650, signal: 'buy', strength: 85 },
      { name: 'Bollinger', value: 0.92, signal: 'buy', strength: 75 },
    ],
    supportLevels: [3650, 3400, 3200],
    resistanceLevels: [4000, 4200, 4500],
    sentiment: 78,
    riskScore: 38,
  },
];

function TechnicalIndicatorCard({ indicator }: { indicator: TechnicalIndicator }) {
  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'buy': return 'text-green-500 bg-green-500/20';
      case 'sell': return 'text-red-500 bg-red-500/20';
      default: return 'text-yellow-500 bg-yellow-500/20';
    }
  };

  return (
    <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm">{indicator.name}</h4>
        <Badge className={cn('text-xs px-2', getSignalColor(indicator.signal))}>
          {indicator.signal.toUpperCase()}
        </Badge>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Valor:</span>
          <span className="font-medium">{indicator.value.toLocaleString()}</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Força:</span>
            <span>{indicator.strength}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
              style={{ width: `${indicator.strength}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PriceLevelsCard({ 
  title, 
  levels, 
  currentPrice, 
  type 
}: { 
  title: string; 
  levels: number[]; 
  currentPrice: number; 
  type: 'support' | 'resistance';
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center">
          <Target className={cn('w-4 h-4 mr-2', type === 'support' ? 'text-green-500' : 'text-red-500')} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {levels.map((level, index) => {
          const distance = Math.abs((level - currentPrice) / currentPrice * 100);
          return (
            <div key={index} className="flex items-center justify-between p-2 rounded bg-muted/30">
              <span className="font-medium text-sm">
                ${level.toLocaleString()}
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">
                  {distance.toFixed(1)}%
                </span>
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  type === 'support' ? 'bg-green-500' : 'bg-red-500'
                )} />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function AssetAnalysisCard({ analysis }: { analysis: MarketAnalysis }) {
  const formatVolume = (volume: number) => {
    if (volume >= 1e9) return `$${(volume / 1e9).toFixed(1)}B`;
    if (volume >= 1e6) return `$${(volume / 1e6).toFixed(1)}M`;
    return `$${volume.toLocaleString()}`;
  };

  const getSentimentColor = (sentiment: number) => {
    if (sentiment >= 70) return 'text-green-500';
    if (sentiment >= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 30) return 'text-green-500';
    if (risk <= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Asset Header */}
      <Card className="glassmorphism">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <CryptoIcon symbol={analysis.asset} size="lg" />
              <div>
                <h2 className="text-2xl font-bold">{analysis.asset}</h2>
                <p className="text-muted-foreground">Análise Técnica Completa</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">${analysis.price.toLocaleString()}</p>
              <p className={cn(
                'text-sm font-medium flex items-center',
                analysis.change24h >= 0 ? 'text-green-500' : 'text-red-500'
              )}>
                {analysis.change24h >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                {analysis.change24h >= 0 ? '+' : ''}{analysis.change24h.toFixed(2)}%
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Volume 24h</p>
              <p className="font-semibold">{formatVolume(analysis.volume24h)}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Market Cap</p>
              <p className="font-semibold">{formatVolume(analysis.marketCap)}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Sentimento</p>
              <p className={cn('font-semibold', getSentimentColor(analysis.sentiment))}>
                {analysis.sentiment}%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">Risco</p>
              <p className={cn('font-semibold', getRiskColor(analysis.riskScore))}>
                {analysis.riskScore}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technical Indicators */}
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-blue-500" />
            Indicadores Técnicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.technicalIndicators.map((indicator, index) => (
              <TechnicalIndicatorCard key={index} indicator={indicator} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Support and Resistance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PriceLevelsCard
          title="Níveis de Suporte"
          levels={analysis.supportLevels}
          currentPrice={analysis.price}
          type="support"
        />
        <PriceLevelsCard
          title="Níveis de Resistência"
          levels={analysis.resistanceLevels}
          currentPrice={analysis.price}
          type="resistance"
        />
      </div>
    </div>
  );
}

export default function MarketAnalysisPage() {
  const { data: analysisData, isLoading } = useQuery({
    queryKey: ['/api/market-analysis'],
    select: () => mockAnalysis,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="w-48 h-8" />
          <Skeleton className="w-32 h-10" />
        </div>
        <Skeleton className="w-full h-96" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Análise de Mercado</h1>
          <p className="text-muted-foreground">Análise técnica completa dos principais ativos</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Zap className="w-4 h-4" />
          <span>Atualizar Análise</span>
        </Button>
      </div>

      <Tabs defaultValue="BTC" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-4">
          {analysisData?.map((analysis) => (
            <TabsTrigger key={analysis.asset} value={analysis.asset} className="flex items-center space-x-2">
              <CryptoIcon symbol={analysis.asset} size="sm" />
              <span>{analysis.asset}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {analysisData?.map((analysis) => (
          <TabsContent key={analysis.asset} value={analysis.asset}>
            <AssetAnalysisCard analysis={analysis} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}