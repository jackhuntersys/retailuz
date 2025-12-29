import { DollarSign, TrendingUp, Package, AlertTriangle, ShoppingCart, Wallet } from 'lucide-react';
import { MetricCard } from './MetricCard';
import { DashboardMetrics, Transaction } from '@/types';
import { cn } from '@/lib/utils';

interface DashboardProps {
  metrics: DashboardMetrics;
  recentTransactions: Transaction[];
}

export function Dashboard({ metrics, recentTransactions }: DashboardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };

  const transactionTypeConfig = {
    sale: {
      icon: TrendingUp,
      color: 'text-success',
      bg: 'bg-success/20',
      label: 'Sale',
    },
    purchase: {
      icon: ShoppingCart,
      color: 'text-primary',
      bg: 'bg-primary/20',
      label: 'Purchase',
    },
    expense: {
      icon: Wallet,
      color: 'text-warning',
      bg: 'bg-warning/20',
      label: 'Expense',
    },
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Your business at a glance
        </p>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          title="Total Profit"
          value={formatCurrency(metrics.profit)}
          icon={DollarSign}
          variant={metrics.profit >= 0 ? 'success' : 'danger'}
          trend={{ value: 12.5, isPositive: true }}
          delay={100}
        />
        <MetricCard
          title="Revenue"
          value={formatCurrency(metrics.totalRevenue)}
          icon={TrendingUp}
          trend={{ value: 8.2, isPositive: true }}
          delay={150}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          title="Inventory Value"
          value={formatCurrency(metrics.inventoryValue)}
          subtitle={`${metrics.totalProducts} products`}
          icon={Package}
          delay={200}
        />
        <MetricCard
          title="Low Stock Alert"
          value={metrics.lowStockCount}
          subtitle="items need restock"
          icon={AlertTriangle}
          variant={metrics.lowStockCount > 0 ? 'warning' : 'default'}
          delay={250}
        />
      </div>

      {/* Quick Stats Bar */}
      <div className="glass p-4 rounded-xl animate-slide-up" style={{ animationDelay: '300ms' }}>
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <p className="text-xs text-muted-foreground">Purchases</p>
            <p className="text-lg font-semibold text-foreground">
              {formatCurrency(metrics.totalCost)}
            </p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center flex-1">
            <p className="text-xs text-muted-foreground">Expenses</p>
            <p className="text-lg font-semibold text-foreground">
              {formatCurrency(metrics.totalExpenses)}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="animate-slide-up" style={{ animationDelay: '350ms' }}>
        <h2 className="text-lg font-semibold text-foreground mb-3">
          Recent Activity
        </h2>
        <div className="space-y-2">
          {recentTransactions.slice(0, 5).map((transaction, index) => {
            const config = transactionTypeConfig[transaction.type];
            const Icon = config.icon;

            return (
              <div
                key={transaction.id}
                className="glass p-3 rounded-xl flex items-center gap-3 animate-fade-in"
                style={{ animationDelay: `${400 + index * 50}ms` }}
              >
                <div className={cn('p-2 rounded-lg', config.bg)}>
                  <Icon className={cn('w-4 h-4', config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {transaction.items[0]?.productName || config.label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(transaction.date)} • {transaction.items.length} item
                    {transaction.items.length > 1 ? 's' : ''}
                  </p>
                </div>
                <p
                  className={cn(
                    'text-sm font-semibold',
                    transaction.type === 'sale' ? 'text-success' : 'text-foreground'
                  )}
                >
                  {transaction.type === 'sale' ? '+' : '-'}
                  {formatCurrency(transaction.totalAmount)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
