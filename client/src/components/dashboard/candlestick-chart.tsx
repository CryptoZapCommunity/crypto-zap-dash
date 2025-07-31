import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface CandlestickData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: number;
}

interface CandlestickChartProps {
  symbol: string;
  data: CandlestickData[] | null;
  isLoading: boolean;
}

type Timeframe = '1H' | '4H' | '1D' | '1W' | '1M';

export function CandlestickChart({ symbol, data, isLoading }: CandlestickChartProps) {
  console.log('🕯️ CandlestickChart rendering:', { symbol, data: data?.length, isLoading });
  
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1D');
  const [isChartLoaded, setIsChartLoaded] = useState(false);

  const timeframes: Timeframe[] = ['1H', '4H', '1D', '1W', '1M'];

  // Generate mock candlestick data
  const generateMockData = (timeframe: Timeframe): CandlestickData[] => {
    const now = Date.now();
    const interval = timeframe === '1H' ? 60 * 60 * 1000 : 
                    timeframe === '4H' ? 4 * 60 * 60 * 1000 :
                    timeframe === '1D' ? 24 * 60 * 60 * 1000 :
                    timeframe === '1W' ? 7 * 24 * 60 * 60 * 1000 :
                    30 * 24 * 60 * 60 * 1000;
    
    const points = timeframe === '1H' ? 24 : 
                   timeframe === '4H' ? 30 : 
                   timeframe === '1D' ? 30 : 
                   timeframe === '1W' ? 52 : 12;
    
    const data: CandlestickData[] = [];
    let basePrice = 45000;
    
    for (let i = points - 1; i >= 0; i--) {
      const time = now - (i * interval);
      const volatility = 0.02; // 2% volatility
      const open = basePrice;
      const close = open + (Math.random() - 0.5) * open * volatility;
      const high = Math.max(open, close) + Math.random() * open * volatility * 0.5;
      const low = Math.min(open, close) - Math.random() * open * volatility * 0.5;
      
      data.push({
        time: Math.floor(time / 1000),
        open,
        high,
        low,
        close,
        volume: Math.random() * 1000000 + 500000
      });
      
      basePrice = close;
    }
    
    return data;
  };

  useEffect(() => {
    if (!chartContainerRef.current || isLoading) return;

    const loadChart = async () => {
      try {
        console.log('📊 Loading candlestick chart...');
        console.log('📊 Chart container:', chartContainerRef.current);
        console.log('📊 Data received:', data);
        console.log('📊 Selected timeframe:', selectedTimeframe);
        
        if (!chartContainerRef.current) {
          console.error('❌ Chart container not found');
          return;
        }
        
        // Test if container has dimensions
        console.log('📊 Container dimensions:', {
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
          offsetWidth: chartContainerRef.current.offsetWidth,
          offsetHeight: chartContainerRef.current.offsetHeight
        });
        
        // If container has no width, wait a bit and try again
        if (chartContainerRef.current.clientWidth === 0) {
          console.log('📊 Container has no width, waiting...');
          setTimeout(() => {
            loadChart();
          }, 100);
          return;
        }
        
        console.log('📊 Importing lightweight-charts...');
        const { createChart } = await import('lightweight-charts');
        console.log('✅ lightweight-charts imported successfully');
        
        // Destroy existing chart
        if (chartRef.current) {
          console.log('📊 Destroying existing chart...');
          chartRef.current.remove();
        }

        console.log('📊 Creating chart with container:', chartContainerRef.current.clientWidth, 'x', 320);
        
        // Create a simple chart first to test
        const chart = createChart(chartContainerRef.current, {
          width: chartContainerRef.current.clientWidth,
          height: 320,
          layout: {
            background: { color: 'transparent' },
            textColor: '#9ca3af',
          },
          grid: {
            vertLines: { color: '#374151' },
            horzLines: { color: '#374151' },
          },
          crosshair: {
            mode: 1,
          },
          rightPriceScale: {
            borderColor: '#374151',
          },
          timeScale: {
            borderColor: '#374151',
            timeVisible: true,
            secondsVisible: false,
          },
        });
        
        console.log('✅ Chart created successfully');

        // Use real data or generate mock data
        const chartData = data || generateMockData(selectedTimeframe);
        
        console.log('📈 Chart data:', { 
          dataLength: data?.length, 
          chartDataLength: chartData.length,
          firstDataPoint: chartData[0],
          lastDataPoint: chartData[chartData.length - 1]
        });
        
        // Try to add a simple area series first (more compatible)
        console.log('📊 Adding line series...');
        try {
          const lineSeries = (chart as any).addLineSeries({
            color: '#10b981',
            lineWidth: 2,
          });
          
          console.log('📊 Setting line data...');
          lineSeries.setData(chartData.map(d => ({
            time: d.time as any,
            value: d.close
          })));
        } catch (seriesError) {
          console.warn('⚠️ Line series failed, trying area series...');
          const areaSeries = (chart as any).addAreaSeries({
            color: '#10b981',
            lineColor: '#10b981',
            lineWidth: 2,
            topColor: 'rgba(16, 185, 129, 0.3)',
            bottomColor: 'rgba(16, 185, 129, 0.0)',
          });
          
          areaSeries.setData(chartData.map(d => ({
            time: d.time as any,
            value: d.close
          })));
        }
        console.log('✅ Line data set');

        // Handle resize
        const handleResize = () => {
          if (chartContainerRef.current) {
            chart.applyOptions({
              width: chartContainerRef.current.clientWidth
            });
          }
        };

        window.addEventListener('resize', handleResize);
        chartRef.current = chart;
        setIsChartLoaded(true);
        console.log('✅ Simple chart loaded successfully');

        return () => {
          window.removeEventListener('resize', handleResize);
          if (chart) {
            chart.remove();
          }
        };
      } catch (error) {
        console.error('❌ Error loading candlestick chart:', error);
        console.error('❌ Error details:', error instanceof Error ? error.message : 'Unknown error');
        console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        
        // Fallback: show error message in container
        if (chartContainerRef.current) {
          chartContainerRef.current.innerHTML = `
            <div class="flex items-center justify-center h-full text-red-500">
              <div class="text-center">
                <p class="font-semibold">Erro ao carregar gráfico</p>
                <p class="text-sm">${error instanceof Error ? error.message : 'Erro desconhecido'}</p>
              </div>
            </div>
          `;
        }
      }
    };

    loadChart();
  }, [data, selectedTimeframe, isLoading]);

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
              {symbol}/USD
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.candlestickChart')}
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
                {timeframe}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          ref={chartContainerRef}
          className="h-80 w-full rounded-lg"
          style={{ minHeight: '320px' }}
        />
      </CardContent>
    </Card>
  );
} 