// Debug do frontend - verificar se está fazendo chamadas para a API
const debugFrontend = async () => {
  console.log('🔍 Debugando frontend...\n');

  // Simular as chamadas que o frontend faz
  const endpoints = [
    '/api/health',
    '/api/trending-coins',
    '/api/market-summary',
    '/api/news',
    '/api/economic-calendar',
    '/api/whale-transactions',
    '/api/fed/indicators',
    '/api/alerts',
    '/api/portfolio',
    '/api/market-sentiment'
  ];

  console.log('📡 Testando endpoints do frontend...\n');

  for (const endpoint of endpoints) {
    try {
      console.log(`🔍 Testando: ${endpoint}`);
      
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Origin': 'http://localhost:3000'
        }
      });

      const data = await response.json();
      
      console.log(`  ✅ Status: ${response.status}`);
      console.log(`  📊 Success: ${data.success}`);
      console.log(`  📦 Has Data: ${!!data.data}`);
      console.log(`  📝 Message: ${data.message || 'No message'}`);
      
      if (data.data) {
        console.log(`  🔢 Data Type: ${typeof data.data}`);
        if (Array.isArray(data.data)) {
          console.log(`  📊 Array Length: ${data.data.length}`);
        } else if (typeof data.data === 'object') {
          console.log(`  📊 Object Keys: ${Object.keys(data.data).join(', ')}`);
        }
      }
      
      console.log(''); // Linha em branco
      
    } catch (error) {
      console.log(`  ❌ Erro: ${error.message}`);
      console.log('');
    }
  }

  console.log('🎯 Debug concluído!');
};

// Executar o debug
debugFrontend(); 