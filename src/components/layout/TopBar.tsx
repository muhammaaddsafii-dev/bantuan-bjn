import { Bell, Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface TopBarProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
  showSearch?: boolean;
}

export function TopBar({ title, subtitle, onMenuClick, showSearch = true }: TopBarProps) {
  const { user, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {showSearch && (
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari data..."
              className="w-64 pl-9"
            />
          </div>
        )}

        {isAdmin && (
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              3
            </span>
          </Button>
        )}

        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium">{user?.name || 'Pengguna'}</p>
            <p className="text-xs text-muted-foreground">
              {isAdmin ? 'Administrator' : 'Pengguna Publik'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
