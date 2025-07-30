import { CryptoIcon, CryptoIcons } from '@/components/ui/crypto-icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CryptoIconsDemo() {
  const popularCoins = ['bitcoin', 'ethereum', 'solana', 'cardano', 'polkadot'];
  const stablecoins = ['tether', 'usd-coin', 'binance-usd', 'dai'];
  const defiTokens = ['uniswap', 'chainlink', 'aave', 'compound'];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Crypto Icons Demo</h1>
        <p className="text-muted-foreground">
          Demonstração dos ícones de criptomoedas carregados dinamicamente da API do CoinGecko
        </p>
      </div>

      {/* Individual Icons */}
      <Card>
        <CardHeader>
          <CardTitle>Ícones Individuais</CardTitle>
          <CardDescription>
            Exemplos de ícones individuais com diferentes tamanhos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <CryptoIcon symbol="bitcoin" size="sm" />
              <span className="text-xs text-muted-foreground">Small</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CryptoIcon symbol="ethereum" size="md" />
              <span className="text-xs text-muted-foreground">Medium</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CryptoIcon symbol="solana" size="lg" />
              <span className="text-xs text-muted-foreground">Large</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Popular Coins */}
      <Card>
        <CardHeader>
          <CardTitle>Moedas Populares</CardTitle>
          <CardDescription>
            Top 5 criptomoedas por capitalização de mercado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            {popularCoins.map((coin) => (
              <div key={coin} className="flex flex-col items-center gap-2">
                <CryptoIcon symbol={coin} size="md" />
                <span className="text-xs font-medium capitalize">
                  {coin.replace('-', ' ')}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stablecoins */}
      <Card>
        <CardHeader>
          <CardTitle>Stablecoins</CardTitle>
          <CardDescription>
            Moedas estáveis com paridade ao dólar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CryptoIcons symbols={stablecoins} size="md" />
        </CardContent>
      </Card>

      {/* DeFi Tokens */}
      <Card>
        <CardHeader>
          <CardTitle>Tokens DeFi</CardTitle>
          <CardDescription>
            Tokens de finanças descentralizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CryptoIcons symbols={defiTokens} size="md" />
        </CardContent>
      </Card>

      {/* Error Handling */}
      <Card>
        <CardHeader>
          <CardTitle>Tratamento de Erros</CardTitle>
          <CardDescription>
            Exemplos de ícones que não existem (fallback)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-2">
              <CryptoIcon symbol="invalid-coin" size="md" />
              <span className="text-xs text-muted-foreground">Invalid Coin</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CryptoIcon symbol="fake-token" size="md" />
              <span className="text-xs text-muted-foreground">Fake Token</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading States */}
      <Card>
        <CardHeader>
          <CardTitle>Estados de Carregamento</CardTitle>
          <CardDescription>
            Skeleton loading enquanto carrega os ícones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <CryptoIcon symbol="bitcoin" size="lg" />
            <CryptoIcon symbol="ethereum" size="lg" />
            <CryptoIcon symbol="solana" size="lg" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 