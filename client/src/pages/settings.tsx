import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Settings, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Key, 
  Monitor,
  Smartphone,
  Mail,
  MessageSquare,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Moon,
  Sun,
  Laptop
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface NotificationSettings {
  priceAlerts: boolean;
  newsAlerts: boolean;
  economicEvents: boolean;
  whaleMovements: boolean;
  portfolioUpdates: boolean;
  email: boolean;
  push: boolean;
  sms: boolean;
}

interface DisplaySettings {
  theme: 'light' | 'dark' | 'system';
  currency: 'USD' | 'EUR' | 'BRL';
  language: 'en' | 'pt' | 'es';
  timezone: string;
  compactMode: boolean;
  animations: boolean;
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  biometric: boolean;
  sessionTimeout: number;
  autoLogout: boolean;
}

export default function SettingsPage() {
  const [notifications, setNotifications] = useState<NotificationSettings>({
    priceAlerts: true,
    newsAlerts: true,
    economicEvents: false,
    whaleMovements: true,
    portfolioUpdates: true,
    email: true,
    push: true,
    sms: false,
  });

  const [display, setDisplay] = useState<DisplaySettings>({
    theme: 'dark',
    currency: 'USD',
    language: 'pt',
    timezone: 'America/Sao_Paulo',
    compactMode: false,
    animations: true,
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorAuth: false,
    biometric: true,
    sessionTimeout: 30,
    autoLogout: true,
  });

  const updateNotification = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const updateDisplay = (key: keyof DisplaySettings, value: any) => {
    setDisplay(prev => ({ ...prev, [key]: value }));
  };

  const updateSecurity = (key: keyof SecuritySettings, value: any) => {
    setSecurity(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Gerencie suas preferências e configurações da conta</p>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="display" className="flex items-center space-x-2">
            <Palette className="w-4 h-4" />
            <span>Exibição</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Segurança</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="flex items-center space-x-2">
            <Key className="w-4 h-4" />
            <span>API</span>
          </TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2 text-blue-500" />
                Alertas de Mercado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span>Alertas de Preço</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações quando preços atingirem suas metas
                    </p>
                  </div>
                  <Switch
                    checked={notifications.priceAlerts}
                    onCheckedChange={(value) => updateNotification('priceAlerts', value)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      <span>Notícias Importantes</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Alertas sobre notícias de alto impacto
                    </p>
                  </div>
                  <Switch
                    checked={notifications.newsAlerts}
                    onCheckedChange={(value) => updateNotification('newsAlerts', value)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-purple-500" />
                      <span>Eventos Econômicos</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Lembrete de eventos econômicos importantes
                    </p>
                  </div>
                  <Switch
                    checked={notifications.economicEvents}
                    onCheckedChange={(value) => updateNotification('economicEvents', value)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-orange-500" />
                      <span>Movimentações de Baleia</span>
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Grandes transações no mercado crypto
                    </p>
                  </div>
                  <Switch
                    checked={notifications.whaleMovements}
                    onCheckedChange={(value) => updateNotification('whaleMovements', value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Métodos de Notificação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receber notificações por email
                  </p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(value) => updateNotification('email', value)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center space-x-2">
                    <Smartphone className="w-4 h-4" />
                    <span>Push Notifications</span>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Notificações diretas no navegador
                  </p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(value) => updateNotification('push', value)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>SMS</span>
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Alertas por mensagem de texto
                  </p>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(value) => updateNotification('sms', value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Tab */}
        <TabsContent value="display" className="space-y-6">
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Palette className="w-5 h-5 mr-2 text-purple-500" />
                Aparência
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Tema</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'light', label: 'Claro', icon: Sun },
                    { value: 'dark', label: 'Escuro', icon: Moon },
                    { value: 'system', label: 'Sistema', icon: Laptop },
                  ].map((theme) => {
                    const Icon = theme.icon;
                    return (
                      <Button
                        key={theme.value}
                        variant={display.theme === theme.value ? 'default' : 'outline'}
                        className="flex items-center space-x-2 h-12"
                        onClick={() => updateDisplay('theme', theme.value)}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{theme.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Moeda Principal</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'USD', label: 'USD ($)', flag: '🇺🇸' },
                    { value: 'EUR', label: 'EUR (€)', flag: '🇪🇺' },
                    { value: 'BRL', label: 'BRL (R$)', flag: '🇧🇷' },
                  ].map((currency) => (
                    <Button
                      key={currency.value}
                      variant={display.currency === currency.value ? 'default' : 'outline'}
                      className="flex items-center space-x-2 h-12"
                      onClick={() => updateDisplay('currency', currency.value)}
                    >
                      <span>{currency.flag}</span>
                      <span>{currency.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Modo Compacto</Label>
                  <p className="text-sm text-muted-foreground">
                    Interface mais densa com menos espaçamento
                  </p>
                </div>
                <Switch
                  checked={display.compactMode}
                  onCheckedChange={(value) => updateDisplay('compactMode', value)}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Animações</Label>
                  <p className="text-sm text-muted-foreground">
                    Ativar animações e transições na interface
                  </p>
                </div>
                <Switch
                  checked={display.animations}
                  onCheckedChange={(value) => updateDisplay('animations', value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-500" />
                Autenticação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Autenticação de Dois Fatores</Label>
                  <p className="text-sm text-muted-foreground">
                    Adicione uma camada extra de segurança à sua conta
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={security.twoFactorAuth}
                    onCheckedChange={(value) => updateSecurity('twoFactorAuth', value)}
                  />
                  {security.twoFactorAuth && (
                    <Badge variant="outline" className="text-green-500">
                      Ativo
                    </Badge>
                  )}
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Autenticação Biométrica</Label>
                  <p className="text-sm text-muted-foreground">
                    Use impressão digital ou reconhecimento facial
                  </p>
                </div>
                <Switch
                  checked={security.biometric}
                  onCheckedChange={(value) => updateSecurity('biometric', value)}
                />
              </div>

              <Separator />

              <div className="space-y-3">
                <Label>Timeout da Sessão (minutos)</Label>
                <Input
                  type="number"
                  value={security.sessionTimeout}
                  onChange={(e) => updateSecurity('sessionTimeout', parseInt(e.target.value))}
                  className="w-32"
                />
                <p className="text-sm text-muted-foreground">
                  Tempo limite antes do logout automático
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Tab */}
        <TabsContent value="api" className="space-y-6">
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="w-5 h-5 mr-2 text-orange-500" />
                Chaves de API
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">CoinGecko API</h4>
                    <Badge variant="outline" className="text-green-500">
                      Conectado
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Dados de preços e informações de mercado
                  </p>
                  <Input
                    type="password"
                    placeholder="Chave da API"
                    className="mb-3"
                  />
                  <Button size="sm" variant="outline">
                    Testar Conexão
                  </Button>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">NewsAPI</h4>
                    <Badge variant="outline" className="text-red-500">
                      Desconectado
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Notícias financeiras e de mercado
                  </p>
                  <Input
                    type="password"
                    placeholder="Chave da API"
                    className="mb-3"
                  />
                  <Button size="sm" variant="outline">
                    Conectar
                  </Button>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 border border-border/50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">Whale Alert</h4>
                    <Badge variant="outline" className="text-yellow-500">
                      Limitado
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Monitoramento de grandes transações
                  </p>
                  <Input
                    type="password"
                    placeholder="Chave da API"
                    className="mb-3"
                  />
                  <Button size="sm" variant="outline">
                    Atualizar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Uso da API</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Requisições hoje</span>
                  <span className="font-semibold">1,247 / 5,000</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }} />
                </div>
                <p className="text-xs text-muted-foreground">
                  Reset diário às 00:00 UTC
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end space-x-4">
        <Button variant="outline">
          Cancelar
        </Button>
        <Button>
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
}