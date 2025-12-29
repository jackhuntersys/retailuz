export interface Product {
  id: string;
  name: string;
  quantity: number;
  costPrice: number;
  sellingPrice: number;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  type: 'purchase' | 'sale' | 'expense';
  items: TransactionItem[];
  totalAmount: number;
  date: Date;
  notes?: string;
  imageUrl?: string;
  ocrConfidence?: number;
  createdAt: Date;
}

export interface TransactionItem {
  id: string;
  productName: string;
  productId?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OCRResult {
  items: ExtractedItem[];
  confidence: number;
  rawText: string;
}

export interface ExtractedItem {
  name: string;
  quantity: number;
  price: number;
  confidence: number;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalCost: number;
  totalExpenses: number;
  profit: number;
  inventoryValue: number;
  totalProducts: number;
  lowStockCount: number;
}

export type TabType = 'dashboard' | 'scan' | 'inventory' | 'transactions' | 'analytics';
