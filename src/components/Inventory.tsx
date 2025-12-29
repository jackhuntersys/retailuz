import { useState } from 'react';
import { Package, Search, AlertTriangle, TrendingUp, Filter } from 'lucide-react';
import { Product } from '@/types';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface InventoryProps {
  products: Product[];
}

export function Inventory({ products }: InventoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'low' | 'high'>('all');

  const filteredProducts = products
    .filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(product => {
      if (filter === 'low') return product.quantity < 10;
      if (filter === 'high') return product.quantity >= 10;
      return true;
    })
    .sort((a, b) => a.quantity - b.quantity);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStockStatus = (quantity: number) => {
    if (quantity < 5) return { label: 'Critical', color: 'text-destructive', bg: 'bg-destructive/20' };
    if (quantity < 10) return { label: 'Low', color: 'text-warning', bg: 'bg-warning/20' };
    return { label: 'Good', color: 'text-success', bg: 'bg-success/20' };
  };

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground">Inventory</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {products.length} products tracked
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative animate-slide-up">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-card border border-border rounded-xl pl-11 pr-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Filter Chips */}
      <div className="flex gap-2 animate-slide-up" style={{ animationDelay: '50ms' }}>
        {[
          { key: 'all', label: 'All Items' },
          { key: 'low', label: 'Low Stock' },
          { key: 'high', label: 'In Stock' },
        ].map(({ key, label }) => (
          <Button
            key={key}
            variant={filter === key ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setFilter(key as typeof filter)}
            className="rounded-full"
          >
            {key === 'low' && <AlertTriangle className="w-3 h-3 mr-1" />}
            {label}
          </Button>
        ))}
      </div>

      {/* Products List */}
      <div className="space-y-2">
        {filteredProducts.map((product, index) => {
          const status = getStockStatus(product.quantity);
          const profit = product.sellingPrice - product.costPrice;
          const margin = ((profit / product.costPrice) * 100).toFixed(0);

          return (
            <div
              key={product.id}
              className="glass p-4 rounded-xl animate-slide-up"
              style={{ animationDelay: `${100 + index * 30}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-secondary rounded-lg">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-foreground font-medium">{product.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={cn('text-xs px-2 py-0.5 rounded-full', status.bg, status.color)}>
                        {status.label}
                      </span>
                      {product.category && (
                        <span className="text-xs text-muted-foreground">
                          {product.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">{product.quantity}</p>
                  <p className="text-xs text-muted-foreground">in stock</p>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-border/50 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-muted-foreground">Cost</p>
                  <p className="text-sm font-medium text-foreground">
                    {formatCurrency(product.costPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Sell</p>
                  <p className="text-sm font-medium text-foreground">
                    {formatCurrency(product.sellingPrice)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Margin</p>
                  <p className="text-sm font-medium text-success flex items-center justify-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {margin}%
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="glass p-8 rounded-xl text-center animate-fade-in">
          <Package className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-foreground font-medium">No products found</p>
          <p className="text-sm text-muted-foreground mt-1">
            {searchQuery ? 'Try a different search' : 'Start by scanning a purchase'}
          </p>
        </div>
      )}
    </div>
  );
}
