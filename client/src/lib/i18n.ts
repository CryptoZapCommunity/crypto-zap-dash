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
      noData: 'No data available',
      errorMessage: 'An error occurred while loading data.',
      networkError: 'Network error. Please check your connection.',
      notFound: 'The requested data was not found.',
      serverError: 'Server error. Please try again later.',
      apiError: 'API Error',
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
    pages: {
      news: {
        title: 'Crypto News',
        subtitle: 'Latest cryptocurrency and financial news',
      },
      crypto: {
        title: 'Crypto Market',
        subtitle: 'Real-time cryptocurrency market data and analysis',
      },
      whale: {
        title: 'Whale Tracker',
        subtitle: 'Track large cryptocurrency transactions',
      },
      airdrops: {
        title: 'Airdrops',
        subtitle: 'Discover and track cryptocurrency airdrops',
      },
      fed: {
        title: 'FED Monitor',
        subtitle: 'Monitor Federal Reserve activities and indicators',
      },
      economicCalendar: {
        title: 'Economic Calendar',
        subtitle: 'Track important economic events and indicators',
      },
      marketAnalysis: {
        title: 'Market Analysis',
        subtitle: 'Advanced market analysis and technical indicators',
      },
      settings: {
        title: 'Settings',
        subtitle: 'Configure your dashboard preferences',
      },
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
      noData: 'Nenhum dado disponível',
      errorMessage: 'Ocorreu um erro ao carregar os dados.',
      networkError: 'Erro de rede. Por favor, verifique sua conexão.',
      notFound: 'Os dados solicitados não foram encontrados.',
      serverError: 'Erro de servidor. Por favor, tente novamente mais tarde.',
      apiError: 'Erro da API',
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
    pages: {
      news: {
        title: 'Notícias Crypto',
        subtitle: 'Últimas notícias sobre criptomoedas e finanças',
      },
      crypto: {
        title: 'Mercado Crypto',
        subtitle: 'Dados de mercado de criptomoedas em tempo real',
      },
      whale: {
        title: 'Rastreador de Baleias',
        subtitle: 'Acompanhe grandes transações de criptomoedas',
      },
      airdrops: {
        title: 'Airdrops',
        subtitle: 'Descubra e acompanhe airdrops de criptomoedas',
      },
      fed: {
        title: 'Monitor FED',
        subtitle: 'Monitore atividades e indicadores do Federal Reserve',
      },
      economicCalendar: {
        title: 'Calendário Econômico',
        subtitle: 'Acompanhe eventos econômicos importantes e indicadores',
      },
      marketAnalysis: {
        title: 'Análise de Mercado',
        subtitle: 'Análise avançada de mercado e indicadores técnicos',
      },
      settings: {
        title: 'Configurações',
        subtitle: 'Configure suas preferências do dashboard',
      },
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
