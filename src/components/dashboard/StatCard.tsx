import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  delay?: number;
}

const variantStyles = {
  default: 'bg-card',
  primary: 'gradient-primary text-primary-foreground',
  secondary: 'gradient-secondary text-secondary-foreground',
  accent: 'bg-accent text-accent-foreground',
};

export function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  variant = 'default',
  delay = 0 
}: StatCardProps) {
  const isPrimary = variant !== 'default';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn(
        'stat-card relative overflow-hidden',
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className={cn(
            'text-sm font-medium',
            isPrimary ? 'text-current opacity-80' : 'text-muted-foreground'
          )}>
            {title}
          </p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className={cn(
              'text-sm',
              isPrimary ? 'text-current opacity-70' : 'text-muted-foreground'
            )}>
              {subtitle}
            </p>
          )}
          {trend && (
            <div className={cn(
              'flex items-center gap-1 text-sm font-medium',
              trend.isPositive ? 'text-accent' : 'text-destructive'
            )}>
              <span>{trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
              <span className="text-xs opacity-70">dari tahun lalu</span>
            </div>
          )}
        </div>
        <div className={cn(
          'rounded-xl p-3',
          isPrimary ? 'bg-white/20' : 'bg-primary/10'
        )}>
          <Icon className={cn(
            'h-6 w-6',
            isPrimary ? 'text-current' : 'text-primary'
          )} />
        </div>
      </div>

      {/* Decorative element */}
      <div className={cn(
        'absolute -bottom-4 -right-4 h-24 w-24 rounded-full opacity-10',
        isPrimary ? 'bg-white' : 'bg-primary'
      )} />
    </motion.div>
  );
}
