import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Building2, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  AlertTriangle,
  BarChart3,
  Search,
  RefreshCw,
  ExternalLink,
  Clock,
  Users,
  Target,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { t } from '@/lib/i18n';
import type { FedUpdate } from '@/types';

interface FedData {
  currentRate: number;
  previousRate: number;
  nextMeeting: string;
  lastUpdate: string;
  rateHistory: Array<{
    date: string;
    rate: number;
  }>;
  economicIndicators: {
    inflation: number;
    unemployment: number;
    gdp: number;
  };
}

export default function FedMonitor() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1M' | '3M' | '6M' | '1Y'>('3M');
  const [selectedIndicator, setSelectedIndicator] = useState<'rates' | 'inflation' | 'unemployment' | 'gdp'>('rates');

  // Fetch FED data
  const { data: fedUpdates, isLoading: updatesLoading, error: updatesError } = useQuery({
    queryKey: ['/api/fed-updates'],
    queryFn: () => apiClient.getFedUpdates(20),
    refetchInterval: 60 * 60 * 1000, // 1 hour
    staleTime: 30 * 60 * 1000,
  });

  // Mock FED data (in real implementation, this would come from FRED API)
  const fedData: FedData = {
    currentRate: 5.50,
    previousRate: 5.25,
    nextMeeting: '2024-01-31',
    lastUpdate: '2024-01-15',
    rateHistory: [
      { date: '2024-01-15', rate: 5.50 },
      { date: '2023-12-13', rate: 5.25 },
      { date: '2023-11-01', rate: 5.25 },
      { date: '2023-09-20', rate: 5.50 },
      { date: '2023-07-26', rate: 5.25 },
      { date: '2023-06-14', rate: 5.00 },
      { date: '2023-05-03', rate: 5.00 },
      { date: '2023-03-22', rate: 4.75 },
      { date: '2023-02-01', rate: 4.50 },
      { date: '2022-12-14', rate: 4.25 },
    ],
    economicIndicators: {
      inflation: 3.1,
      unemployment: 3.7,
      gdp: 2.1,
    }
  };

  const updates: FedUpdate[] = (fedUpdates as FedUpdate[]) || [];

  const getRateChange = () => {
    const change = fedData.currentRate - fedData.previousRate;
    return {
      value: change,
      percentage: ((change / fedData.previousRate) * 100).toFixed(2),
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'unchanged'
    };
  };

  const getIndicatorColor = (indicator: string, value: number) => {
    switch (indicator) {
      case 'inflation':
        return value > 3 ? 'text-red-500' : value < 2 ? 'text-green-500' : 'text-yellow-500';
      case 'unemployment':
        return value < 4 ? 'text-green-500' : value > 6 ? 'text-red-500' : 'text-yellow-500';
      case 'gdp':
        return value > 2 ? 'text-green-500' : value < 1 ? 'text-red-500' : 'text-yellow-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getIndicatorIcon = (indicator: string, value: number) => {
    switch (indicator) {
      case 'inflation':
        return value > 3 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
      case 'unemployment':
        return value < 4 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />;
      case 'gdp':
        return value > 2 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getNextMeetingDays = () => {
    const nextMeeting = new Date(fedData.nextMeeting);
    const now = new Date();
    const diffTime = nextMeeting.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (updatesError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground mb-2">
            {t('common.error')}
          </p>
          <p className="text-muted-foreground">
            Failed to load FED data. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const rateChange = getRateChange();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">FED Monitor</h1>
          <p className="text-muted-foreground">
            Track Federal Reserve decisions and economic indicators
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4" />
            <span className="ml-2">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Current Rate Card */}
      <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Current Federal Funds Rate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {fedData.currentRate}%
              </div>
              <p className="text-sm text-muted-foreground">Current Rate</p>
            </div>
            
            <div className="text-center">
              <div className={cn(
                "text-2xl font-bold flex items-center justify-center gap-1",
                rateChange.direction === 'up' ? 'text-red-500' : 
                rateChange.direction === 'down' ? 'text-green-500' : 'text-muted-foreground'
              )}>
                {rateChange.direction === 'up' && <TrendingUp className="w-5 h-5" />}
                {rateChange.direction === 'down' && <TrendingDown className="w-5 h-5" />}
                {rateChange.value > 0 ? '+' : ''}{rateChange.value.toFixed(2)}%
              </div>
              <p className="text-sm text-muted-foreground">vs Previous</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {getNextMeetingDays()}
              </div>
              <p className="text-sm text-muted-foreground">Days to Next Meeting</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Economic Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Inflation Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold flex items-center gap-2", getIndicatorColor('inflation', fedData.economicIndicators.inflation))}>
              {getIndicatorIcon('inflation', fedData.economicIndicators.inflation)}
              {fedData.economicIndicators.inflation}%
            </div>
            <p className="text-xs text-muted-foreground">CPI Year-over-Year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Unemployment Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold flex items-center gap-2", getIndicatorColor('unemployment', fedData.economicIndicators.unemployment))}>
              {getIndicatorIcon('unemployment', fedData.economicIndicators.unemployment)}
              {fedData.economicIndicators.unemployment}%
            </div>
            <p className="text-xs text-muted-foreground">U-3 Rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="w-4 h-4" />
              GDP Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold flex items-center gap-2", getIndicatorColor('gdp', fedData.economicIndicators.gdp))}>
              {getIndicatorIcon('gdp', fedData.economicIndicators.gdp)}
              {fedData.economicIndicators.gdp}%
            </div>
            <p className="text-xs text-muted-foreground">Annual Growth Rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Rate History Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Interest Rate History</CardTitle>
          <CardDescription>Federal Funds Rate over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              {(['1M', '3M', '6M', '1Y'] as const).map((timeframe) => (
                <Button
                  key={timeframe}
                  variant={selectedTimeframe === timeframe ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedTimeframe(timeframe)}
                >
                  {timeframe}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="h-64 bg-muted rounded-lg p-4">
            {/* Chart placeholder - in real implementation, use a charting library */}
            <div className="w-full h-full bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Rate History Chart</p>
                <p className="text-xs text-muted-foreground">Integration with FRED API</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent FED Updates */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent FED Updates</h2>
          <Badge variant="secondary">
            {updates.length} updates
          </Badge>
        </div>

        {updatesLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-8 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {updates.map((update) => (
              <Card key={update.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">{update.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {update.type}
                        </Badge>
                      </div>
                      
                      {update.content && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {update.content}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(update.publishedAt)}</span>
                        </div>
                        {update.speaker && (
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{update.speaker}</span>
                          </div>
                        )}
                        {update.interestRate && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            <span>{update.interestRate}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      {update.sourceUrl && (
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {updates.length === 0 && !updatesLoading && (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No FED updates available.</p>
          </div>
        )}
      </div>

      {/* Market Impact Alert */}
      <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/20">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                Market Impact Alert
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                FED decisions significantly impact cryptocurrency markets. Higher interest rates typically 
                lead to reduced risk appetite, while lower rates may increase crypto adoption. Monitor 
                these updates closely for trading opportunities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 