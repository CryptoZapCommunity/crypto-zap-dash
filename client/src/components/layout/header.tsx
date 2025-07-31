import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/ui/logo';
import { t } from '@/lib/i18n';
import {
  Search,
  RefreshCw,
  Bell,
  Menu,
} from 'lucide-react';

interface HeaderProps {
  onSidebarToggle: () => void;
  onRefresh?: () => void;
}

export function Header({ onSidebarToggle, onRefresh }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Logo width={120} height={72} className="hidden sm:block" />
            <div className="sm:hidden">
              <Logo width={80} height={48} />
            </div>
          </div>
          
          <div className="hidden md:block">
            <h2 className="text-xl font-bold text-foreground">
              {t('dashboard.title')}
            </h2>
            <p className="text-sm text-muted-foreground">
              {t('dashboard.subtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('common.search')}
              className="pl-10 pr-4 py-2 w-64"
            />
          </div>

          {/* Refresh Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onRefresh}
            className="hover:bg-muted"
          >
            <RefreshCw className="w-5 h-5" />
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-muted"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </Button>
        </div>
      </div>
    </header>
  );
}
