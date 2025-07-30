import { storage } from '../storage';
import type { InsertNews } from '@shared/schema';

interface NewsAPIArticle {
  title: string;
  description: string;
  content: string;
  source: { name: string };
  url: string;
  publishedAt: string;
  country?: string;
}

export class NewsService {
  private readonly NEWS_API_KEY = process.env.NEWS_API_KEY || '';
  private readonly CRYPTO_PANIC_API_KEY = process.env.CRYPTO_PANIC_API_KEY || '';

  async updateGeopoliticalNews(): Promise<void> {
    try {
      const keywords = 'finance OR economy OR fed OR central bank OR inflation OR gdp';
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(keywords)}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${this.NEWS_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`NewsAPI error: ${response.status}`);
      }

      const data = await response.json();
      const articles: NewsAPIArticle[] = data.articles || [];

      for (const article of articles) {
        const news: InsertNews = {
          title: article.title,
          summary: article.description || '',
          content: article.content || '',
          source: article.source.name,
          sourceUrl: article.url,
          category: 'geopolitics',
          country: this.extractCountryFromContent(article.title + ' ' + article.description),
          impact: this.determineImpact(article.title + ' ' + article.description),
          sentiment: this.analyzeSentiment(article.title + ' ' + article.description),
          publishedAt: new Date(article.publishedAt),
        };

        await storage.createNews(news);
      }
    } catch (error) {
      console.error('Error updating geopolitical news:', error);
    }
  }

  async updateCryptoNews(): Promise<void> {
    try {
      const response = await fetch(
        `https://cryptopanic.com/api/v1/posts/?auth_token=${this.CRYPTO_PANIC_API_KEY}&kind=news&filter=hot`
      );

      if (!response.ok) {
        throw new Error(`CryptoPanic API error: ${response.status}`);
      }

      const data = await response.json();
      const articles = data.results || [];

      for (const article of articles) {
        const news: InsertNews = {
          title: article.title,
          summary: article.title, // CryptoPanic doesn't provide descriptions
          content: '',
          source: article.source?.title || 'CryptoPanic',
          sourceUrl: article.url,
          category: 'crypto',
          country: null,
          impact: this.mapCryptoPanicVotes(article.votes),
          sentiment: article.kind === 'positive' ? 'positive' : article.kind === 'negative' ? 'negative' : 'neutral',
          publishedAt: new Date(article.published_at),
        };

        await storage.createNews(news);
      }
    } catch (error) {
      console.error('Error updating crypto news:', error);
    }
  }

  async updateMacroeconomicNews(): Promise<void> {
    try {
      const keywords = 'federal reserve OR ECB OR bank of japan OR inflation OR GDP OR unemployment OR CPI OR PPI';
      const response = await fetch(
        `https://newsapi.org/v2/everything?q=${encodeURIComponent(keywords)}&language=en&sortBy=publishedAt&pageSize=15&apiKey=${this.NEWS_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`NewsAPI error: ${response.status}`);
      }

      const data = await response.json();
      const articles: NewsAPIArticle[] = data.articles || [];

      for (const article of articles) {
        const news: InsertNews = {
          title: article.title,
          summary: article.description || '',
          content: article.content || '',
          source: article.source.name,
          sourceUrl: article.url,
          category: 'macro',
          country: this.extractCountryFromContent(article.title + ' ' + article.description),
          impact: this.determineMacroImpact(article.title + ' ' + article.description),
          sentiment: this.analyzeSentiment(article.title + ' ' + article.description),
          publishedAt: new Date(article.publishedAt),
        };

        await storage.createNews(news);
      }
    } catch (error) {
      console.error('Error updating macroeconomic news:', error);
    }
  }

  private extractCountryFromContent(content: string): string | null {
    const lowerContent = content.toLowerCase();
    
    if (lowerContent.includes('fed') || lowerContent.includes('federal reserve') || lowerContent.includes('united states')) {
      return 'US';
    }
    if (lowerContent.includes('ecb') || lowerContent.includes('european central bank') || lowerContent.includes('europe')) {
      return 'EU';
    }
    if (lowerContent.includes('bank of japan') || lowerContent.includes('boj') || lowerContent.includes('japan')) {
      return 'JP';
    }
    if (lowerContent.includes('bank of england') || lowerContent.includes('boe') || lowerContent.includes('uk')) {
      return 'UK';
    }
    if (lowerContent.includes('china') || lowerContent.includes('pboc')) {
      return 'CN';
    }
    
    return null;
  }

  private determineImpact(content: string): string {
    const lowerContent = content.toLowerCase();
    
    const highImpactTerms = ['fed', 'federal reserve', 'interest rate', 'inflation', 'gdp', 'unemployment', 'recession'];
    const mediumImpactTerms = ['earnings', 'revenue', 'profit', 'market', 'economic'];
    
    if (highImpactTerms.some(term => lowerContent.includes(term))) {
      return 'high';
    }
    if (mediumImpactTerms.some(term => lowerContent.includes(term))) {
      return 'medium';
    }
    
    return 'low';
  }

  private determineMacroImpact(content: string): string {
    const lowerContent = content.toLowerCase();
    
    const highImpactTerms = ['federal reserve', 'ecb', 'interest rate', 'inflation target', 'monetary policy', 'quantitative easing'];
    const mediumImpactTerms = ['cpi', 'ppi', 'unemployment', 'gdp', 'retail sales'];
    
    if (highImpactTerms.some(term => lowerContent.includes(term))) {
      return 'high';
    }
    if (mediumImpactTerms.some(term => lowerContent.includes(term))) {
      return 'medium';
    }
    
    return 'low';
  }

  private analyzeSentiment(content: string): string {
    const lowerContent = content.toLowerCase();
    
    const positiveTerms = ['growth', 'increase', 'positive', 'gain', 'boost', 'rise', 'improvement'];
    const negativeTerms = ['decline', 'fall', 'decrease', 'negative', 'drop', 'recession', 'crisis'];
    
    const positiveCount = positiveTerms.filter(term => lowerContent.includes(term)).length;
    const negativeCount = negativeTerms.filter(term => lowerContent.includes(term)).length;
    
    if (positiveCount > negativeCount) {
      return 'positive';
    }
    if (negativeCount > positiveCount) {
      return 'negative';
    }
    
    return 'neutral';
  }

  private mapCryptoPanicVotes(votes: any): string {
    if (!votes) return 'low';
    
    const { negative = 0, positive = 0, important = 0 } = votes;
    const total = negative + positive + important;
    
    if (total >= 20 || important >= 5) {
      return 'high';
    }
    if (total >= 10) {
      return 'medium';
    }
    
    return 'low';
  }
}
