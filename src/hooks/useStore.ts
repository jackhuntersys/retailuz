import { useState, useEffect, useCallback } from 'react';
import { Product, Transaction, DashboardMetrics } from '@/types';

const STORAGE_KEYS = {
  PRODUCTS: 'ledgerai_products',
  TRANSACTIONS: 'ledgerai_transactions',
};

// Demo data for initial state
const demoProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Coffee Beans',
    quantity: 45,
    costPrice: 12.50,
    sellingPrice: 24.99,
    category: 'Beverages',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Organic Green Tea',
    quantity: 8,
    costPrice: 8.00,
    sellingPrice: 15.99,
    category: 'Beverages',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Artisan Chocolate Bar',
    quantity: 32,
    costPrice: 4.50,
    sellingPrice: 9.99,
    category: 'Snacks',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Fresh Honey Jar',
    quantity: 3,
    costPrice: 15.00,
    sellingPrice: 28.99,
    category: 'Food',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const demoTransactions: Transaction[] = [
  {
    id: '1',
    type: 'sale',
    items: [
      { id: '1', productName: 'Premium Coffee Beans', quantity: 5, unitPrice: 24.99, totalPrice: 124.95 },
    ],
    totalAmount: 124.95,
    date: new Date(Date.now() - 86400000),
    createdAt: new Date(Date.now() - 86400000),
  },
  {
    id: '2',
    type: 'purchase',
    items: [
      { id: '2', productName: 'Organic Green Tea', quantity: 20, unitPrice: 8.00, totalPrice: 160.00 },
    ],
    totalAmount: 160.00,
    date: new Date(Date.now() - 172800000),
    createdAt: new Date(Date.now() - 172800000),
  },
  {
    id: '3',
    type: 'sale',
    items: [
      { id: '3', productName: 'Artisan Chocolate Bar', quantity: 8, unitPrice: 9.99, totalPrice: 79.92 },
    ],
    totalAmount: 79.92,
    date: new Date(Date.now() - 259200000),
    createdAt: new Date(Date.now() - 259200000),
  },
  {
    id: '4',
    type: 'expense',
    items: [
      { id: '4', productName: 'Shop Rent', quantity: 1, unitPrice: 500.00, totalPrice: 500.00 },
    ],
    totalAmount: 500.00,
    date: new Date(Date.now() - 345600000),
    createdAt: new Date(Date.now() - 345600000),
  },
];

export function useStore() {
  const [products, setProducts] = useState<Product[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    const storedTransactions = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);

    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(demoProducts);
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(demoProducts));
    }

    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions).map((t: Transaction) => ({
        ...t,
        date: new Date(t.date),
        createdAt: new Date(t.createdAt),
      })));
    } else {
      setTransactions(demoTransactions);
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(demoTransactions));
    }

    setIsLoading(false);
  }, []);

  // Save products to localStorage
  useEffect(() => {
    if (!isLoading && products.length > 0) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    }
  }, [products, isLoading]);

  // Save transactions to localStorage
  useEffect(() => {
    if (!isLoading && transactions.length > 0) {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    }
  }, [transactions, isLoading]);

  const addProduct = useCallback((product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...product,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
    ));
  }, []);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    
    setTransactions(prev => [newTransaction, ...prev]);

    // Update inventory based on transaction type
    if (transaction.type === 'sale') {
      transaction.items.forEach(item => {
        if (item.productId) {
          updateProduct(item.productId, {
            quantity: products.find(p => p.id === item.productId)!.quantity - item.quantity,
          });
        }
      });
    } else if (transaction.type === 'purchase') {
      transaction.items.forEach(item => {
        const existingProduct = products.find(p => 
          p.name.toLowerCase() === item.productName.toLowerCase()
        );
        if (existingProduct) {
          updateProduct(existingProduct.id, {
            quantity: existingProduct.quantity + item.quantity,
          });
        } else {
          addProduct({
            name: item.productName,
            quantity: item.quantity,
            costPrice: item.unitPrice,
            sellingPrice: item.unitPrice * 1.5,
          });
        }
      });
    }

    return newTransaction;
  }, [products, updateProduct, addProduct]);

  const getMetrics = useCallback((): DashboardMetrics => {
    const totalRevenue = transactions
      .filter(t => t.type === 'sale')
      .reduce((sum, t) => sum + t.totalAmount, 0);

    const totalCost = transactions
      .filter(t => t.type === 'purchase')
      .reduce((sum, t) => sum + t.totalAmount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.totalAmount, 0);

    const inventoryValue = products.reduce(
      (sum, p) => sum + p.quantity * p.costPrice,
      0
    );

    const lowStockCount = products.filter(p => p.quantity < 10).length;

    return {
      totalRevenue,
      totalCost,
      totalExpenses,
      profit: totalRevenue - totalCost - totalExpenses,
      inventoryValue,
      totalProducts: products.length,
      lowStockCount,
    };
  }, [products, transactions]);

  return {
    products,
    transactions,
    isLoading,
    addProduct,
    updateProduct,
    addTransaction,
    getMetrics,
  };
}
