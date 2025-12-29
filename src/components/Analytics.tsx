import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { Transaction, DashboardMetrics } from '@/types';
import { cn } from '@/lib/utils';

interface AnalyticsProps {
  metrics: DashboardMetrics;
  transactions: Transaction[];
}

export function Analytics({ metrics, transactions }: AnalyticsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate daily data for the last 7 days
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  };

  const last7Days = getLast7Days();

  const dailyData = last7Days.map(date => {
    const dayTransactions = transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate.toDateString() === date.toDateString();
    });

    const revenue = dayTransactions
      .filter(t => t.type === 'sale')
      .reduce((sum, t) => sum + t.totalAmount, 0);

    const expenses = dayTransactions
      .filter(t => t.type !== 'sale')
      .reduce((sum, t) => sum + t.totalAmount, 0);

    return {
      date,
      revenue,
      expenses,
      profit: revenue - expenses,
    };
  });

  const maxValue = Math.max(...dailyData.map(d => Math.max(d.revenue, d.expenses)), 1);

  const profitMargin = metrics.totalRevenue > 0
    ? ((metrics.profit / metrics.totalRevenue) * 100).toFixed(1)
    : '0';

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Performance insights & trends
        </p>
      </div>

      {/* Profit Summary Card */}
      <div className="glass p-5 rounded-xl animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-muted-foreground text-sm">Net Profit</p>
            <p className={cn(
              'text-3xl font-bold',
              metrics.profit >= 0 ? 'text-success' : 'text-destructive'
            )}>
              {formatCurrency(metrics.profit)}
            </p>
          </div>
          <div className={cn(
            'p-3 rounded-xl',
            metrics.profit >= 0 ? 'bg-success/20' : 'bg-destructive/20'
          )}>
            {metrics.profit >= 0 ? (
              <TrendingUp className="w-6 h-6 text-success" />
            ) : (
              <TrendingDown className="w-6 h-6 text-destructive" />
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Margin</p>
            <p className="text-lg font-semibold text-foreground">{profitMargin}%</p>
          </div>
          <div className="w-px bg-border" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Revenue</p>
            <p className="text-lg font-semibold text-foreground">
              {formatCurrency(metrics.totalRevenue)}
            </p>
          </div>
          <div className="w-px bg-border" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Costs</p>
            <p className="text-lg font-semibold text-foreground">
              {formatCurrency(metrics.totalCost + metrics.totalExpenses)}
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="glass p-4 rounded-xl animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-foreground font-medium">Last 7 Days</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-xs text-muted-foreground">Revenue</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-warning" />
              <span className="text-xs text-muted-foreground">Expenses</span>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="flex items-end justify-between gap-2 h-40">
          {dailyData.map((day, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-end justify-center gap-1 h-32">
                <div
                  className="w-2.5 bg-primary rounded-t transition-all duration-500"
                  style={{
                    height: `${(day.revenue / maxValue) * 100}%`,
                    minHeight: day.revenue > 0 ? '4px' : '0',
                  }}
                />
                <div
                  className="w-2.5 bg-warning rounded-t transition-all duration-500"
                  style={{
                    height: `${(day.expenses / maxValue) * 100}%`,
                    minHeight: day.expenses > 0 ? '4px' : '0',
                  }}
                />
              </div>
              <span className="text-xs text-muted-foreground">
                {new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(day.date).slice(0, 2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2 animate-slide-up" style={{ animationDelay: '150ms' }}>
        <p className="text-foreground font-medium">Breakdown</p>
        
        {[
          { label: 'Sales Revenue', value: metrics.totalRevenue, color: 'bg-success' },
          { label: 'Purchase Costs', value: metrics.totalCost, color: 'bg-primary' },
          { label: 'Other Expenses', value: metrics.totalExpenses, color: 'bg-warning' },
        ].map((item, index) => {
          const percentage = metrics.totalRevenue > 0
            ? ((item.value / metrics.totalRevenue) * 100).toFixed(0)
            : '0';

          return (
            <div key={index} className="glass p-4 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={cn('w-3 h-3 rounded-full', item.color)} />
                  <span className="text-sm text-foreground">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {formatCurrency(item.value)}
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full transition-all duration-500', item.color)}
                  style={{ width: `${Math.min(parseFloat(percentage), 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Inventory Value */}
      <div className="glass p-4 rounded-xl animate-slide-up" style={{ animationDelay: '200ms' }}>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/20 rounded-xl">
            <DollarSign className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-muted-foreground text-sm">Total Inventory Value</p>
            <p className="text-xl font-bold text-foreground">
              {formatCurrency(metrics.inventoryValue)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-xs">Products</p>
            <p className="text-lg font-semibold text-foreground">{metrics.totalProducts}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
