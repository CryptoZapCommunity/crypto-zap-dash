import { Switch, Route } from "wouter";
import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useWebSocket } from "@/hooks/use-websocket";
import { useIsMobile } from "@/hooks/use-mobile";
import { invalidateQueries } from "@/lib/api";
import { cn } from "@/lib/utils";
import Dashboard from "@/pages/dashboard";
import MarketAnalysis from "@/pages/market-analysis";
import News from "@/pages/news";
import EconomicCalendar from "@/pages/economic-calendar";
import SettingsPage from "@/pages/settings";
import CryptoMarket from "@/pages/crypto";
import WhaleTracker from "@/pages/whale";
import Airdrops from "@/pages/airdrops";
import FedMonitor from "@/pages/fed";
import NotFound from "@/pages/not-found";
import type { WebSocketMessage } from "@/types";

function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);

  const handleRefresh = async () => {
    // Invalidate all queries to force refresh
    await queryClient.invalidateQueries();
  };

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case 'CRYPTO_UPDATE':
        // Only invalidate specific queries, not all
        invalidateQueries(['/api/market-summary']);
        invalidateQueries(['/api/trending-coins']);
        break;
      case 'NEWS_UPDATE':
        invalidateQueries(['/api/news']);
        break;
      case 'WHALE_UPDATE':
        invalidateQueries(['/api/whale-movements']);
        break;
      case 'INITIAL_DATA':
        // Don't invalidate all queries - this causes excessive calls!
        // Only invalidate if data is actually stale
        console.log('Received initial WebSocket data');
        break;
    }
  };

  const { isConnected, connectionStatus } = useWebSocket({
    onMessage: handleWebSocketMessage,
    onConnect: () => console.log('WebSocket connected'),
    onDisconnect: () => console.log('WebSocket disconnected'),
    onError: (error) => console.error('WebSocket error:', error),
  });

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        className={cn(
          "transition-transform duration-300",
          isMobile && sidebarCollapsed && "-translate-x-full fixed z-50 h-full"
        )}
      />
      
      <main className="flex-1 overflow-auto">
        <Header
          onSidebarToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onRefresh={handleRefresh}
        />
        
        {/* Connection Status Indicator */}
        {connectionStatus !== 'connected' && (
          <div className={cn(
            "px-4 py-2 text-sm text-center",
            connectionStatus === 'connecting' && "bg-yellow-500/10 text-yellow-600",
            connectionStatus === 'disconnected' && "bg-red-500/10 text-red-600",
            connectionStatus === 'error' && "bg-red-500/10 text-red-600"
          )}>
            {connectionStatus === 'connecting' && 'Connecting to real-time data...'}
            {connectionStatus === 'disconnected' && 'Disconnected from real-time data'}
            {connectionStatus === 'error' && 'Error connecting to real-time data'}
          </div>
        )}
        
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/market-analysis" component={MarketAnalysis} />
      <Route path="/news" component={News} />
      <Route path="/economic-calendar" component={EconomicCalendar} />
      <Route path="/settings" component={SettingsPage} />
      <Route path="/crypto" component={CryptoMarket} />
      <Route path="/whale" component={WhaleTracker} />
      <Route path="/airdrops" component={Airdrops} />
      <Route path="/fed" component={FedMonitor} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <Layout>
            <Router />
          </Layout>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
