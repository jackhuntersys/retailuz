import { useState } from 'react';
import { TrendingUp, ShoppingCart, Wallet, ChevronRight, Calendar } from 'lucide-react';
import { Transaction } from '@/types';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface TransactionsProps {
  transactions: Transaction[];
}

export function Transactions({ transactions }: TransactionsProps) {
  const [filter, setFilter] = useState<'all' | 'sale' | 'purchase' | 'expense'>('all');

  const filteredTransactions = transactions.filter(
    t => filter === 'all' || t.type === filter
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(d);
  };

  const transactionConfig = {
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

  // Group transactions by date
  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = formatDate(transaction.date);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, Transaction[]>);

  const totals = {
    sale: transactions.filter(t => t.type === 'sale').reduce((sum, t) => sum + t.totalAmount, 0),
    purchase: transactions.filter(t => t.type === 'purchase').reduce((sum, t) => sum + t.totalAmount, 0),
    expense: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.totalAmount, 0),
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {transactions.length} total records
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-2 animate-slide-up">
        {Object.entries(transactionConfig).map(([type, config]) => {
          const Icon = config.icon;
          return (
            <div
              key={type}
              className={cn(
                'glass p-3 rounded-xl cursor-pointer transition-all',
                filter === type && 'ring-2 ring-primary'
              )}
              onClick={() => setFilter(type as typeof filter)}
            >
              <div className={cn('p-2 rounded-lg w-fit mb-2', config.bg)}>
                <Icon className={cn('w-4 h-4', config.color)} />
              </div>
              <p className="text-xs text-muted-foreground">{config.label}s</p>
              <p className="text-sm font-semibold text-foreground">
                {formatCurrency(totals[type as keyof typeof totals])}
              </p>
            </div>
          );
        })}
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 animate-slide-up" style={{ animationDelay: '50ms' }}>
        {['all', 'sale', 'purchase', 'expense'].map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setFilter(f as typeof filter)}
            className="rounded-full whitespace-nowrap"
          >
            {f === 'all' ? 'All' : transactionConfig[f as keyof typeof transactionConfig].label + 's'}
          </Button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {Object.entries(groupedTransactions).map(([date, dateTransactions], groupIndex) => (
          <div key={date} className="animate-slide-up" style={{ animationDelay: `${100 + groupIndex * 50}ms` }}>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">{date}</span>
            </div>
            <div className="space-y-2">
              {dateTransactions.map((transaction) => {
                const config = transactionConfig[transaction.type];
                const Icon = config.icon;

                return (
                  <div
                    key={transaction.id}
                    className="glass p-4 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn('p-2.5 rounded-lg', config.bg)}>
                        <Icon className={cn('w-5 h-5', config.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-foreground font-medium truncate">
                            {transaction.items[0]?.productName}
                            {transaction.items.length > 1 && (
                              <span className="text-muted-foreground ml-1">
                                +{transaction.items.length - 1}
                              </span>
                            )}
                          </p>
                          <p className={cn(
                            'font-semibold ml-2',
                            transaction.type === 'sale' ? 'text-success' : 'text-foreground'
                          )}>
                            {transaction.type === 'sale' ? '+' : '-'}
                            {formatCurrency(transaction.totalAmount)}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {transaction.items.length} item{transaction.items.length > 1 ? 's' : ''}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <div className="glass p-8 rounded-xl text-center animate-fade-in">
          <Wallet className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-foreground font-medium">No transactions yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Scan a document to add your first record
          </p>
        </div>
      )}
    </div>
  );
}
