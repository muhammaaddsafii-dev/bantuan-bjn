import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Map,
  Users,
  PlusCircle,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Building2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Map, label: 'Peta Interaktif', path: '/map' },
  { icon: BarChart3, label: 'Statistik', path: '/statistics' },
  { icon: Users, label: 'Data Penerima', path: '/recipients', adminOnly: true },
  // { icon: PlusCircle, label: 'Input Data', path: '/input', adminOnly: true },
  // { icon: Settings, label: 'Pengaturan', path: '/settings', adminOnly: true },
];

export function Sidebar() {
  const location = useLocation();
  const { user, isAdmin, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const filteredNavItems = navItems.filter(item => !item.adminOnly || isAdmin);

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-sidebar transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
                <Building2 className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-sidebar-foreground">Bojonegoro</span>
                <span className="text-xs text-sidebar-foreground/70">Social Aid Dashboard</span>
              </div>
            </motion.div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {filteredNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="truncate"
                  >
                    {item.label}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div className="border-t border-sidebar-border p-3">
          {!collapsed && user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-3 rounded-lg bg-sidebar-accent p-3"
            >
              <p className="text-sm font-medium text-sidebar-accent-foreground">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/70">{user.email}</p>
            </motion.div>
          )}
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start gap-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
              collapsed && 'justify-center px-2'
            )}
            onClick={logout}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Keluar</span>}
          </Button>
        </div>
      </div>
    </motion.aside>
  );
}
