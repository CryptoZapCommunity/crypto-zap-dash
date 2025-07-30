import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/use-theme';
import { t, setLanguage, getLanguage } from '@/lib/i18n';
import {
  LayoutDashboard,
  Coins,
  Newspaper,
  Calendar,
  Fish,
  Gift,
  Building2,
  ChevronDown,
  Moon,
  Sun,
  Menu,
  X,
  TrendingUp,
  BarChart3,
  Settings,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  className?: string;
}

const navigationItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    href: '/',
  },
  {
    icon: BarChart3,
    label: 'Análise de Mercado',
    href: '/market-analysis',
  },
  {
    icon: Newspaper,
    label: 'Notícias',
    href: '/news',
  },
  {
    icon: Calendar,
    label: 'Calendário Econômico',
    href: '/economic-calendar',
  },
  {
    icon: Settings,
    label: 'Configurações',
    href: '/settings',
  },
  {
    icon: Coins,
    label: 'Crypto Market',
    href: '/crypto',
  },
  {
    icon: Fish,
    label: 'Whale Tracker',
    href: '/whale',
  },
  {
    icon: Gift,
    label: 'Airdrops',
    href: '/airdrops',
  },
  {
    icon: Building2,
    label: 'FED Monitor',
    href: '/fed',
  },
];

export function Sidebar({ collapsed, onToggle, className }: SidebarProps) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [currentLanguage, setCurrentLanguage] = useState(getLanguage());

  const handleLanguageChange = (lang: 'en' | 'pt') => {
    setLanguage(lang);
    setCurrentLanguage(lang);
    window.location.reload(); // Simple reload to update all translations
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-border bg-card transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-foreground truncate">
                Crypto ZAP DASH
              </h1>
              <p className="text-xs text-muted-foreground truncate">
                Premium Dashboard
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'default' : 'ghost'}
                className={cn(
                  'w-full justify-start h-10',
                  collapsed && 'px-2',
                  isActive && 'bg-primary text-primary-foreground'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <span className="ml-3 truncate">{item.label}</span>
                )}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-border space-y-3">
        {/* Language Toggle */}
        <div className="flex items-center justify-between">
          {!collapsed && (
            <span className="text-sm text-muted-foreground">
              {t('common.language')}
            </span>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size={collapsed ? 'icon' : 'sm'}
                className="flex items-center space-x-2"
              >
                <span>{currentLanguage === 'pt' ? '🇧🇷' : '🇺🇸'}</span>
                {!collapsed && (
                  <>
                    <span className="text-xs font-medium">
                      {currentLanguage === 'pt' ? 'PT' : 'EN'}
                    </span>
                    <ChevronDown className="w-4 h-4" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
                <span className="mr-2">🇺🇸</span>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange('pt')}>
                <span className="mr-2">🇧🇷</span>
                Português
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          {!collapsed && (
            <span className="text-sm text-muted-foreground">
              {t('common.theme')}
            </span>
          )}
          <Button
            variant="outline"
            size={collapsed ? 'icon' : 'sm'}
            onClick={toggleTheme}
            className="flex items-center space-x-2"
          >
            {theme === 'dark' ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
            {!collapsed && (
              <span className="text-xs font-medium">
                {theme === 'dark' ? t('common.dark') : t('common.light')}
              </span>
            )}
          </Button>
        </div>

        {/* Mobile Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={onToggle}
          className="lg:hidden w-full"
        >
          {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </Button>
      </div>
    </aside>
  );
}
