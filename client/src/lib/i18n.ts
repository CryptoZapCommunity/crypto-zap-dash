export interface Translation {
  [key: string]: string | Translation;
}

export const translations = {
  en: {
    common: {
      loading: 'Loading...',
      error: 'Error',
      retry: 'Retry',
      viewAll: 'View All',
      refresh: 'Refresh',
      search: 'Search assets, news...',
      language: 'Language',
      theme: 'Theme',
      dark: 'Dark',
      light: 'Light',
    },
    nav: {
      dashboard: 'Dashboard',
      cryptoMarket: 'Crypto Market',
      news: 'News',
      economicCalendar: 'Economic Calendar',
      whaleTracker: 'Whale Tracker',
      airdrops: 'Airdrops',
      fedMonitor: 'FED Monitor',
    },
    dashboard: {
      title: 'Crypto ZAP DASH',
      subtitle: 'Real-time market monitoring',
      marketOverview: 'Market Overview',
      latestNews: 'Latest News',
      economicCalendar: 'Economic Calendar',
      whaleActivity: 'Whale Activity',
      topGainers: 'Top Gainers',
      topLosers: 'Top Losers',
      priceChart: 'Price Chart',
      fearGreed: 'Fear & Greed',
      candlestickChart: 'Candlestick Chart',
      portfolioTracker: 'Portfolio Tracker',
      portfolioTrackerSubtitle: 'Track your crypto investments',
      candlestickChartSubtitle: 'Real-time price analysis',
      marketAnalysis: 'Market Analysis',
      marketAnalysisSubtitle: 'Technical indicators and sentiment',
    },
    market: {
      marketCap: 'Market Cap',
      volume24h: '24h Volume',
      dominance: 'Dominance',
      total: 'Total',
      prev: 'Prev',
      forecast: 'Forecast',
      actual: 'Actual',
    },
    impact: {
      high: 'High',
      medium: 'Medium',
      low: 'Low',
    },
    sentiment: {
      positive: 'Positive',
      negative: 'Negative',
      neutral: 'Neutral',
    },
    whale: {
      inflow: 'Inflow',
      outflow: 'Outflow',
      transfer: 'Transfer',
      minutes: 'min',
      hours: 'h',
      days: 'd',
    },
    timeframes: {
      '1D': '1D',
      '7D': '7D',
      '1M': '1M',
      '1Y': '1Y',
    },
    alerts: {
      title: 'Market Alerts',
      noAlerts: 'No active alerts at the moment',
      noAlertsSubtitle: 'Your alert settings are working normally',
      markAllRead: 'Mark all as read',
      critical: 'Critical',
      criticals: 'Criticals',
      new: 'New',
      news: 'New',
      now: 'Now',
      recent: 'Recent',
      types: {
        price_target: 'Price Target',
        volume_spike: 'Volume Spike',
        whale_movement: 'Whale Movement',
        news_sentiment: 'News Sentiment',
        technical_indicator: 'Technical Indicator',
      },
      messages: {
        priceTargetReached: 'reached price target',
        whaleMovementDetected: 'Whale movement detected',
        unusualVolumeSpike: 'registered unusual volume spike',
        marketSentimentPositive: 'Market sentiment analysis indicates positive sentiment',
        technicalIndicatorSignal: 'Technical indicator signal',
      },
    },
  },
  pt: {
    common: {
      loading: 'Carregando...',
      error: 'Erro',
      retry: 'Tentar novamente',
      viewAll: 'Ver todos',
      refresh: 'Atualizar',
      search: 'Buscar ativos, notícias...',
      language: 'Idioma',
      theme: 'Tema',
      dark: 'Escuro',
      light: 'Claro',
    },
    nav: {
      dashboard: 'Dashboard',
      cryptoMarket: 'Mercado Crypto',
      news: 'Notícias',
      economicCalendar: 'Calendário Econômico',
      whaleTracker: 'Rastreador de Baleias',
      airdrops: 'Airdrops',
      fedMonitor: 'Monitor FED',
    },
    dashboard: {
      title: 'Crypto ZAP DASH',
      subtitle: 'Monitoramento em tempo real dos mercados',
      marketOverview: 'Visão Geral do Mercado',
      latestNews: 'Últimas Notícias',
      candlestickChart: 'Gráfico de Candlestick',
      economicCalendar: 'Calendário Econômico',
      whaleActivity: 'Atividade das Baleias',
      topGainers: 'Maiores Altas',
      topLosers: 'Maiores Baixas',
      priceChart: 'Gráfico de Preços',
      fearGreed: 'Medo e Ganância',
      portfolioTracker: 'Rastreador de Portfolio',
      portfolioTrackerSubtitle: 'Acompanhe seus investimentos em criptomoedas',
      candlestickChartSubtitle: 'Análise de preço em tempo real',
      marketAnalysis: 'Análise de Mercado',
      marketAnalysisSubtitle: 'Indicadores técnicos e sentimento',
    },
    market: {
      marketCap: 'Cap. de Mercado',
      volume24h: 'Volume 24h',
      dominance: 'Dominância',
      total: 'Total',
      prev: 'Ant',
      forecast: 'Previsão',
      actual: 'Real',
    },
    impact: {
      high: 'Alto',
      medium: 'Médio',
      low: 'Baixo',
    },
    sentiment: {
      positive: 'Positivo',
      negative: 'Negativo',
      neutral: 'Neutro',
    },
    whale: {
      inflow: 'Entrada',
      outflow: 'Saída',
      transfer: 'Transferência',
      minutes: 'min',
      hours: 'h',
      days: 'd',
    },
    timeframes: {
      '1D': '1D',
      '7D': '7D',
      '1M': '1M',
      '1Y': '1A',
    },
    alerts: {
      title: 'Alertas de Mercado',
      noAlerts: 'Nenhum alerta ativo no momento',
      noAlertsSubtitle: 'Suas configurações de alerta estão funcionando normalmente',
      markAllRead: 'Marcar todos como lidos',
      critical: 'Crítico',
      criticals: 'Críticos',
      new: 'Novo',
      news: 'Novos',
      now: 'Agora',
      recent: 'Recente',
      types: {
        price_target: 'Meta de Preço',
        volume_spike: 'Pico de Volume',
        whale_movement: 'Movimentação de Baleia',
        news_sentiment: 'Sentimento de Notícias',
        technical_indicator: 'Indicador Técnico',
      },
      messages: {
        priceTargetReached: 'alcançou meta de preço',
        whaleMovementDetected: 'Movimentação de baleia detectada',
        unusualVolumeSpike: 'registrou pico de volume incomum',
        marketSentimentPositive: 'Análise de sentimento de mercado indica sentimento positivo',
        technicalIndicatorSignal: 'Sinal de indicador técnico',
      },
    },
  },
} as const;

export type Language = keyof typeof translations;

let currentLanguage: Language = 'en';

export function setLanguage(lang: Language): void {
  currentLanguage = lang;
  localStorage.setItem('language', lang);
}

export function getLanguage(): Language {
  if (typeof window !== 'undefined') {
    const savedLang = localStorage.getItem('language') as Language;
    if (savedLang && translations[savedLang]) {
      currentLanguage = savedLang;
      return savedLang;
    }
    
    // Detect browser language
    const browserLang = navigator.language.split('-')[0] as Language;
    if (translations[browserLang]) {
      currentLanguage = browserLang;
      return browserLang;
    }
  }
  
  return currentLanguage;
}

export function t(key: string): string {
  const keys = key.split('.');
  let value: any = translations[currentLanguage];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English if key not found
      value = translations.en;
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return key; // Return key if not found in fallback
        }
      }
      break;
    }
  }
  
  return typeof value === 'string' ? value : key;
}

// Initialize language on module load
if (typeof window !== 'undefined') {
  currentLanguage = getLanguage();
}
