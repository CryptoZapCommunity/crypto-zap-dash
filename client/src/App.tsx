import { Switch, Route } from "wouter";
import { useState, useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

import { useIsMobile } from "@/hooks/use-mobile";
import { usePolling } from "@/hooks/use-polling";
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
import CryptoIconsDemo from "@/pages/crypto-icons-demo";
import NotFound from "@/pages/not-found";

// Simple fallback component to ensure something is always rendered
function FallbackComponent() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-foreground mb-4">
          Crypto Zap Dashboard
        </h1>
        <p className="text-muted-foreground">
          Loading application...
        </p>
      </div>
    </div>
  );
}

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

  // Polling for real-time updates (replaces WebSocket)
  const { isConnected, connectionStatus } = usePolling({
    onUpdate: () => {
      if (import.meta.env.DEV) {
        console.log('Polling update triggered');
      }
    },
    onConnect: () => {
      if (import.meta.env.DEV) {
        console.log('Polling started');
      }
    },
    onDisconnect: () => {
      if (import.meta.env.DEV) {
        console.log('Polling stopped');
      }
    },
    onError: (error) => console.error('Polling error:', error),
    interval: 5 * 60 * 1000, // 5 minutes
    queries: [
      '/api/market-summary', 
      '/api/trending-coins',
      '/api/crypto-overview',
      '/api/news',
      '/api/whale-transactions'
    ],
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
        
        {/* Connection Status Indicator - Habilitado novamente */}
        {isConnected && (
          <div className="fixed top-4 right-4 z-50">
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              <span>Live Updates</span>
            </div>
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
      <Route path="/crypto-icons-demo" component={CryptoIconsDemo} />
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
