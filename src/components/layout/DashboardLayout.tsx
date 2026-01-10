import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showSearch?: boolean;
}

export function DashboardLayout({ children, title, subtitle, showSearch }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <div className="lg:pl-64 transition-all duration-300">
        <TopBar 
          title={title} 
          subtitle={subtitle}
          showSearch={showSearch}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <main className={cn(
          'p-6 animate-fade-in',
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}
