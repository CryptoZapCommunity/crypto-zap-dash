import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface ChartData {
  symbol: string;
  name: string;
  price: string;
  sparklineData: number[];
}

interface PriceChartProps {
  chartData: ChartData | null;
  isLoading: boolean;
}

type Timeframe = '1D' | '7D' | '1M' | '1Y';

export function PriceChart({ chartData, isLoading }: PriceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1D');
  const [chartInstance, setChartInstance] = useState<any>(null);

  const timeframes: Timeframe[] = ['1D', '7D', '1M', '1Y'];

  // Generate mock data for different timeframes
  const generateChartData = (timeframe: Timeframe, baseData: number[]) => {
    if (!baseData || baseData.length === 0) {
      // Generate sample data if no real data available
      const points = timeframe === '1D' ? 24 : timeframe === '7D' ? 7 : timeframe === '1M' ? 30 : 365;
      const startPrice = 43000;
      const data = [];
      for (let i = 0; i < points; i++) {
        const variation = (Math.random() - 0.5) * 2000;
        data.push(startPrice + variation + (i * 10));
      }
      return data;
    }

    // Use real data but adjust for timeframe
    switch (timeframe) {
      case '1D':
        return (Array.isArray(baseData) ? baseData : []).slice(-24);
      case '7D':
        return (Array.isArray(baseData) ? baseData : []).slice(-7);
      case '1M':
        return (Array.isArray(baseData) ? baseData : []).slice(-30);
      case '1Y':
        return Array.isArray(baseData) ? baseData : []; // Use all available data
      default:
        return Array.isArray(baseData) ? baseData : [];
    }
  };

  const generateLabels = (timeframe: Timeframe) => {
    const now = new Date();
    const labels = [];

    switch (timeframe) {
      case '1D':
        for (let i = 23; i >= 0; i--) {
          const time = new Date(now.getTime() - i * 60 * 60 * 1000);
          labels.push(time.toLocaleTimeString('en-US', { hour: 'numeric' }));
        }
        break;
      case '7D':
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
          labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        }
        break;
      case '1M':
        for (let i = 29; i >= 0; i--) {
          const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
          labels.push(date.getDate().toString());
        }
        break;
      case '1Y':
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          labels.push(date.toLocaleDateString('en-US', { month: 'short' }));
        }
        break;
    }

    return labels;
  };

  useEffect(() => {
    if (!canvasRef.current || !chartData || isLoading) return;

    const loadChart = async () => {
      // Dynamically import Chart.js to avoid SSR issues
      const { Chart, registerables } = await import('chart.js');
      Chart.register(...registerables);

      const ctx = canvasRef.current?.getContext('2d');
      if (!ctx) return;

      // Destroy existing chart
      if (chartInstance) {
        chartInstance.destroy();
      }

      const chartDataPoints = generateChartData(selectedTimeframe, chartData.sparklineData);
      const labels = generateLabels(selectedTimeframe);
      
      // Determine if price is going up or down
      const isPositive = chartDataPoints.length > 1 && 
        chartDataPoints[chartDataPoints.length - 1] > chartDataPoints[0];

      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: (Array.isArray(labels) ? labels : []).slice(0, chartDataPoints.length),
          datasets: [{
            label: `${chartData.symbol} Price`,
            data: chartDataPoints,
            borderColor: isPositive ? 'hsl(152, 100%, 39%)' : 'hsl(0, 84%, 63%)',
            backgroundColor: isPositive ? 
              'rgba(0, 200, 150, 0.1)' : 
              'rgba(255, 71, 71, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 6,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: 'index',
          },
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              backgroundColor: 'hsl(230, 35%, 11%)',
              titleColor: 'hsl(0, 0%, 98%)',
              bodyColor: 'hsl(0, 0%, 98%)',
              borderColor: 'hsl(230, 30%, 14%)',
              borderWidth: 1,
              displayColors: false,
              callbacks: {
                label: function(context) {
                  return `$${context.parsed.y.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}`;
                }
              }
            }
          },
          scales: {
            x: {
              grid: {
                color: 'hsl(230, 30%, 14%)',
              },
              ticks: {
                color: 'hsl(240, 5%, 64.9%)',
                maxTicksLimit: 8,
              }
            },
            y: {
              grid: {
                color: 'hsl(230, 30%, 14%)',
              },
              ticks: {
                color: 'hsl(240, 5%, 64.9%)',
                callback: function(value) {
                  return '$' + Number(value).toLocaleString();
                }
              }
            }
          },
          elements: {
            point: {
              radius: 0,
              hoverRadius: 6,
            }
          }
        }
      });

      setChartInstance(chart);
    };

    loadChart();

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [chartData, selectedTimeframe, isLoading]);

  if (isLoading) {
    return (
      <Card className="glassmorphism">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="w-24 h-5" />
              <Skeleton className="w-32 h-4" />
            </div>
            <div className="flex items-center space-x-2">
              {timeframes.map((tf) => (
                <Skeleton key={tf} className="w-10 h-6 rounded-lg" />
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-80 rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glassmorphism">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              {chartData?.symbol || 'BTC'}/USD
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.priceChart')}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {timeframes.map((timeframe) => (
              <Button
                key={timeframe}
                variant={selectedTimeframe === timeframe ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedTimeframe(timeframe)}
                className={cn(
                  'px-3 py-1 text-xs font-medium',
                  selectedTimeframe === timeframe && 'bg-primary text-primary-foreground'
                )}
              >
                {t(`timeframes.${timeframe}`)}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80 chart-container">
          <canvas
            ref={canvasRef}
            className="w-full h-full rounded-lg"
          />
        </div>
      </CardContent>
    </Card>
  );
}
