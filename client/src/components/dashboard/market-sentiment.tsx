import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { t } from '@/lib/i18n';
import { TrendingUp, TrendingDown, Heart, Brain, Users, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SentimentData {
  overall: number; // 0-100
  fear_greed_index: number; // 0-100
  social_mentions: number;
  news_sentiment: number; // 0-100
  whale_activity: 'bullish' | 'bearish' | 'neutral';
  technical_indicators: 'bullish' | 'bearish' | 'neutral';
  updated_at: string;
}

interface MarketSentimentProps {
  sentiment?: SentimentData;
  isLoading?: boolean;
}

// Mock data for demonstration
const mockSentiment: SentimentData = {
  overall: 68,
  fear_greed_index: 72,
  social_mentions: 15420,
  news_sentiment: 65,
  whale_activity: 'bullish',
  technical_indicators: 'neutral',
  updated_at: new Date().toISOString(),
};

function SentimentGauge({ value, label, size = 'md' }: { value: number; label: string; size?: 'sm' | 'md' | 'lg' }) {
  const getColor = (val: number) => {
    if (val >= 80) return 'text-green-500';
    if (val >= 60) return 'text-green-400';
    if (val >= 40) return 'text-yellow-500';
    if (val >= 20) return 'text-orange-500';
    return 'text-red-500';
  };

  const getLabel = (val: number) => {
    if (val >= 80) return 'Extrema Ganância';
    if (val >= 60) return 'Ganância';
    if (val >= 40) return 'Neutro';
    if (val >= 20) return 'Medo';
    return 'Extremo Medo';
  };

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
  };

  const radius = size === 'sm' ? 28 : size === 'md' ? 36 : 44;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="relative">
        <svg className={cn(sizeClasses[size], 'transform -rotate-90')} viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-muted/30"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={cn('transition-all duration-1000 ease-in-out', getColor(value))}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn('font-bold', size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-xl', getColor(value))}>
            {value}
          </span>
        </div>
      </div>
      <div className="text-center">
        <p className={cn('font-medium', size === 'sm' ? 'text-xs' : 'text-sm')}>{label}</p>
        <p className={cn('text-muted-foreground', size === 'sm' ? 'text-xs' : 'text-xs')}>
          {getLabel(value)}
        </p>
      </div>
    </div>
  );
}

function SentimentIndicator({ 
  value, 
  label, 
  icon 
}: { 
  value: string | number; 
  label: string; 
  icon: React.ReactNode;
}) {
  const getStatusColor = (val: string) => {
    switch (val) {
      case 'bullish':
        return 'text-green-500 bg-green-500/20';
      case 'bearish':
        return 'text-red-500 bg-red-500/20';
      case 'neutral':
        return 'text-yellow-500 bg-yellow-500/20';
      default:
        return 'text-gray-500 bg-gray-500/20';
    }
  };

  const formatValue = (val: string | number) => {
    if (typeof val === 'string') {
      return val.charAt(0).toUpperCase() + (typeof val === 'string' ? val.slice(1) : '');
    }
    if (val >= 1000000) {
      return `${(typeof val === 'number' ? (val / 1000000).toFixed(1) : '0.0')}M`;
    }
    if (val >= 1000) {
      return `${(typeof val === 'number' ? (val / 1000).toFixed(1) : '0.0')}K`;
    }
    return val ? val.toString() : '0';
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-full bg-accent/50">
          {icon}
        </div>
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      <Badge 
        variant="outline" 
        className={cn(
          'text-xs px-2 py-1',
          typeof value === 'string' ? getStatusColor(value) : 'text-foreground bg-accent/50'
        )}
      >
        {formatValue(value)}
      </Badge>
    </div>
  );
}

export function MarketSentiment({ sentiment = mockSentiment, isLoading = false }: MarketSentimentProps) {
  if (isLoading) {
    return (
      <Card className="glassmorphism">
        <CardHeader>
          <Skeleton className="w-48 h-6" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center space-y-2">
              <Skeleton className="w-20 h-20 rounded-full" />
              <Skeleton className="w-16 h-4" />
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Skeleton className="w-20 h-20 rounded-full" />
              <Skeleton className="w-20 h-4" />
            </div>
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <Skeleton className="w-24 h-4" />
                </div>
                <Skeleton className="w-16 h-5 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatTimeAgo = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffInMs = now.getTime() - date.getTime();
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      
      if (diffInMinutes < 1) return 'Agora';
      if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
      return `${Math.floor(diffInMinutes / 1440)}d atrás`;
    } catch {
      return 'Recente';
    }
  };

  return (
    <Card className="glassmorphism">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center justify-between">
          <div className="flex items-center">
            <Brain className="w-5 h-5 mr-2 text-purple-500" />
            Sentimento do Mercado
          </div>
          <Badge variant="outline" className="text-xs">
            {formatTimeAgo(sentiment.updated_at)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Sentiment Gauges */}
        <div className="grid grid-cols-2 gap-6">
          <SentimentGauge 
            value={sentiment.overall} 
            label="Sentimento Geral"
          />
          <SentimentGauge 
            value={sentiment.fear_greed_index} 
            label="Índice Medo & Ganância"
          />
        </div>

        {/* Sentiment Indicators */}
        <div className="space-y-3">
          <SentimentIndicator
            value={sentiment.news_sentiment}
            label="Sentimento das Notícias"
            icon={<Heart className="w-4 h-4" />}
          />
          
          <SentimentIndicator
            value={sentiment.social_mentions}
            label="Menções Sociais (24h)"
            icon={<Users className="w-4 h-4" />}
          />
          
          <SentimentIndicator
            value={sentiment.whale_activity}
            label="Atividade de Baleias"
            icon={<TrendingUp className="w-4 h-4" />}
          />
          
          <SentimentIndicator
            value={sentiment.technical_indicators}
            label="Indicadores Técnicos"
            icon={<BarChart3 className="w-4 h-4" />}
          />
        </div>

        {/* Summary */}
        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center space-x-2">
            {sentiment.overall >= 60 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : sentiment.overall >= 40 ? (
              <BarChart3 className="w-4 h-4 text-yellow-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
            <span className="text-sm text-muted-foreground">
              {sentiment.overall >= 60 
                ? 'O mercado demonstra sentimento positivo com sinais de otimismo.' 
                : sentiment.overall >= 40
                ? 'O sentimento do mercado está neutro com tendências mistas.'
                : 'O mercado mostra cautela com sinais de pessimismo.'
              }
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}