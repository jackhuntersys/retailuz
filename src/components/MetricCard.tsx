import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
  delay?: number;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
  delay = 0,
}: MetricCardProps) {
  const variantStyles = {
    default: 'border-border/50',
    success: 'border-success/30 shadow-success/10',
    warning: 'border-warning/30 shadow-warning/10',
    danger: 'border-destructive/30 shadow-destructive/10',
  };

  const iconVariantStyles = {
    default: 'bg-secondary text-primary',
    success: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
    danger: 'bg-destructive/20 text-destructive',
  };

  return (
    <div
      className={cn(
        'glass p-4 rounded-xl animate-slide-up',
        variantStyles[variant],
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn('p-2.5 rounded-lg', iconVariantStyles[variant])}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span
            className={cn(
              'text-xs font-medium px-2 py-1 rounded-full',
              trend.isPositive
                ? 'bg-success/20 text-success'
                : 'bg-destructive/20 text-destructive'
            )}
          >
            {trend.isPositive ? '+' : ''}
            {trend.value}%
          </span>
        )}
      </div>
      <p className="text-muted-foreground text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      )}
    </div>
  );
}
