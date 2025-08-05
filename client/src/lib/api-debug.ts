// Debug utility para testar chamadas da API
import { apiClient } from './api';

export async function debugApiCalls() {
  console.log('🔍 Iniciando debug das chamadas da API...');
  
  try {
    // Teste 1: Market Summary
    console.log('📊 Testando market-summary...');
    const marketSummary = await apiClient.getMarketSummary();
    console.log('✅ Market Summary:', marketSummary);
    
    // Teste 2: Trending Coins
    console.log('📈 Testando trending-coins...');
    const trendingCoins = await apiClient.getTrendingCoins();
    console.log('✅ Trending Coins:', trendingCoins);
    
    // Teste 3: News
    console.log('📰 Testando news...');
    const news = await apiClient.getNews(undefined, 5);
    console.log('✅ News:', news);
    
    // Teste 4: Whale Transactions
    console.log('🐋 Testando whale-transactions...');
    const whales = await apiClient.getWhaleMovements(5);
    console.log('✅ Whale Transactions:', whales);
    
    console.log('🎉 Todos os testes da API passaram!');
    
  } catch (error) {
    console.error('❌ Erro no debug da API:', error);
  }
}

// Função para testar a URL base
export function debugApiConfig() {
  console.log('🔧 Configuração da API:');
  console.log('- VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
  console.log('- DEV:', import.meta.env.DEV);
  console.log('- PROD:', import.meta.env.PROD);
  console.log('- Base URL final:', apiClient['baseUrl']);
} 