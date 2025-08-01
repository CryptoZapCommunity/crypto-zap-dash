import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { t } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { createChart, LineSeries, AreaSeries } from 'lightweight-charts';

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

export function CandlestickChart({ symbol, data: propData, isLoading: propIsLoading }: CandlestickChartProps) {
  if (typeof console !== 'undefined' && typeof console.log === 'function') {
    console.log('🕯️ CandlestickChart rendering:', { symbol, data: Array.isArray(propData) ? propData.length : 0, isLoading: propIsLoading });
  }
  
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1D');
  const [isChartLoaded, setIsChartLoaded] = useState(false);
  const [data, setData] = useState<CandlestickData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const timeframes: Timeframe[] = ['1H', '4H', '1D', '1W', '1M'];

  // Fetch candlestick data from API
  useEffect(() => {
    const fetchCandlestickData = async () => {
      if (propData) {
        setData(propData);
        return;
      }

      if (!symbol) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/candlestick/${symbol}?timeframe=${selectedTimeframe}&limit=100`);
        if (response.ok) {
          const result = await response.json();
          setData(Array.isArray(result.data) ? result.data : []);
        } else {
          console.error('Failed to fetch candlestick data');
          setData([]);
        }
      } catch (error) {
        console.error('Error fetching candlestick data:', error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCandlestickData();
  }, [symbol, selectedTimeframe, propData]);

  const displayIsLoading = propIsLoading !== undefined ? propIsLoading : isLoading;



  useEffect(() => {
    if (!chartContainerRef.current || displayIsLoading) return;

    const loadChart = async () => {
      try {
        if (typeof console !== 'undefined' && typeof console.log === 'function') {
          console.log('📊 Loading candlestick chart...');
          console.log('📊 Chart container:', chartContainerRef.current ? 'exists' : 'null');
          console.log('📊 Data received:', data);
          console.log('📊 Selected timeframe:', selectedTimeframe);
        }
        
        if (!chartContainerRef.current) {
          if (typeof console !== 'undefined' && typeof console.error === 'function') {
            console.error('❌ Chart container not found');
          }
          return;
        }
        
        // Test if container has dimensions
                          if (typeof console !== 'undefined' && typeof console.log === 'function') {
          console.log('📊 Container dimensions:', {
            width: chartContainerRef.current && typeof chartContainerRef.current.clientWidth === 'number' ? chartContainerRef.current.clientWidth : 0,
            height: chartContainerRef.current && typeof chartContainerRef.current.clientHeight === 'number' ? chartContainerRef.current.clientHeight : 0,
            offsetWidth: chartContainerRef.current && typeof chartContainerRef.current.offsetWidth === 'number' ? chartContainerRef.current.offsetWidth : 0,
            offsetHeight: chartContainerRef.current && typeof chartContainerRef.current.offsetHeight === 'number' ? chartContainerRef.current.offsetHeight : 0
          });
        }
        
        // If container has no width, wait a bit and try again
                  if (chartContainerRef.current && typeof chartContainerRef.current.clientWidth === 'number' && chartContainerRef.current.clientWidth === 0) {
          if (typeof console !== 'undefined' && typeof console.log === 'function') {
            console.log('📊 Container has no width, waiting...');
          }
          if (typeof setTimeout === 'function') {
            setTimeout(() => {
              loadChart();
            }, 100);
          }
          return;
        }
        
        if (typeof console !== 'undefined' && typeof console.log === 'function') {
          console.log('📊 Importing lightweight-charts...');
        }
        const lightweightCharts = await import('lightweight-charts');
        const { createChart } = lightweightCharts;
        
        if (!createChart || typeof createChart !== 'function') {
          throw new Error('createChart function not available from lightweight-charts');
        }
        
        if (typeof console !== 'undefined' && typeof console.log === 'function') {
          console.log('✅ lightweight-charts imported successfully');
        }
        
        // Destroy existing chart
        if (chartRef.current && typeof chartRef.current.remove === 'function') {
          if (typeof console !== 'undefined' && typeof console.log === 'function') {
            console.log('📊 Destroying existing chart...');
          }
          chartRef.current.remove();
        }

        if (typeof console !== 'undefined' && typeof console.log === 'function') {
          console.log('📊 Creating chart with container:', chartContainerRef.current && typeof chartContainerRef.current.clientWidth === 'number' ? chartContainerRef.current.clientWidth : 0, 'x', 320);
        }
        
        // Create a simple chart first to test
        if (!chartContainerRef.current) {
          throw new Error('Chart container not available');
        }
        const chart = typeof createChart === 'function' ? createChart(chartContainerRef.current, {
          width: chartContainerRef.current && typeof chartContainerRef.current.clientWidth === 'number' ? chartContainerRef.current.clientWidth : 800,
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
        }) : null;
        
        if (!chart) {
          throw new Error('Failed to create chart');
        }
        
        if (typeof console !== 'undefined' && typeof console.log === 'function') {
          console.log('✅ Chart created successfully');
        }

        // Use real data from API
        const chartData = Array.isArray(data) && data.length > 0 ? data : [];
        
                if (typeof console !== 'undefined' && typeof console.log === 'function') {
          console.log('📈 Chart data:', {
            dataLength: Array.isArray(data) ? data.length : 0, 
            chartDataLength: Array.isArray(chartData) ? chartData.length : 0,
            firstDataPoint: Array.isArray(chartData) && chartData.length > 0 ? chartData[0] : null,
            lastDataPoint: Array.isArray(chartData) && chartData.length > 0 ? chartData[chartData.length - 1] : null
          });
        }
        
        // Try to add a simple area series first (mais compatível)
        if (typeof console !== 'undefined' && typeof console.log === 'function') {
          console.log('📊 Adding line/area series...');
        }
        try {
          if (chart && typeof chart.addSeries === 'function') {
            let series;
            try {
              // Tenta linha primeiro
              series = chart.addSeries(LineSeries, {
                color: '#10b981',
                lineWidth: 2,
              });
            } catch (err) {
              // Se falhar, tenta área
              if (typeof console !== 'undefined' && typeof console.warn === 'function') {
                console.warn('⚠️ Line series failed, trying area series...');
              }
              series = chart.addSeries(AreaSeries, {
                lineColor: '#10b981',
                lineWidth: 2,
                topColor: 'rgba(16, 185, 129, 0.3)',
                bottomColor: 'rgba(16, 185, 129, 0.0)',
              });
            }
            if (series && typeof series.setData === 'function') {
              series.setData((Array.isArray(chartData) ? chartData : []).map(d => ({
                time: d.time as any,
                value: d.close
              })));
            } else {
              throw new Error('setData method not available on series');
            }
          } else {
            throw new Error('addSeries method not available');
          }
        } catch (seriesError) {
          if (typeof console !== 'undefined' && typeof console.error === 'function') {
            console.error('❌ Failed to add series:', seriesError);
          }
          throw seriesError;
        }
        if (typeof console !== 'undefined' && typeof console.log === 'function') {
          console.log('✅ Line/area data set');
        }

        // Handle resize
        const handleResize = () => {
          if (chartContainerRef.current && chart && typeof chart.applyOptions === 'function' && typeof chartContainerRef.current.clientWidth === 'number') {
            chart.applyOptions({
              width: chartContainerRef.current.clientWidth
            });
          }
        };

        if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
          window.addEventListener('resize', handleResize);
        }
        if (chart) {
          chartRef.current = chart;
        }
        if (typeof setIsChartLoaded === 'function') {
          setIsChartLoaded(true);
        }
        if (typeof console !== 'undefined' && typeof console.log === 'function') {
          console.log('✅ Simple chart loaded successfully');
        }

        return () => {
          if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
            window.removeEventListener('resize', handleResize);
          }
          if (chart && typeof chart.remove === 'function') {
            chart.remove();
          }
        };
      } catch (error) {
        if (typeof console !== 'undefined' && typeof console.error === 'function') {
          console.error('❌ Error loading candlestick chart:', error);
          console.error('❌ Error details:', error instanceof Error ? error.message : 'Unknown error');
          console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        }
        
        // Fallback: show error message in container
        if (chartContainerRef.current && typeof chartContainerRef.current.innerHTML !== 'undefined') {
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
  }, [data, selectedTimeframe, displayIsLoading]);

  if (displayIsLoading) {
    return (
      <Card className="glassmorphism">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="w-24 h-5" />
              <Skeleton className="w-32 h-4" />
            </div>
            <div className="flex items-center space-x-2">
              {(Array.isArray(timeframes) ? timeframes : []).map((tf) => (
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
              {symbol || 'BTC'}/USD
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {typeof t === 'function' ? t('dashboard.candlestickChart') : 'Candlestick Chart'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {(Array.isArray(timeframes) ? timeframes : []).map((timeframe) => (
              <Button
                key={timeframe}
                variant={selectedTimeframe === timeframe ? 'default' : 'ghost'}
                size="sm"
                onClick={() => typeof setSelectedTimeframe === 'function' && setSelectedTimeframe(timeframe)}
                className={typeof cn === 'function' ? cn(
                  'px-3 py-1 text-xs font-medium',
                  selectedTimeframe === timeframe && 'bg-primary text-primary-foreground'
                ) : 'px-3 py-1 text-xs font-medium'}
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