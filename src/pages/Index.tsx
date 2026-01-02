import { useState } from 'react';
import { TabType, TransactionItem } from '@/types';
import { useStore } from '@/hooks/useStore';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { Dashboard } from '@/components/Dashboard';
import { ScanUpload } from '@/components/ScanUpload';
import { Inventory } from '@/components/Inventory';
import { Transactions } from '@/components/Transactions';
import { Analytics } from '@/components/Analytics';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { useTelegram } from "@/components/TelegramProvider";
import { ChatWidget } from '@/components/ChatWidget';
import { useTelegramAuth } from '@/hooks/useTelegramAuth';


const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const { products, transactions, isLoading, addTransaction, getMetrics } = useStore();
  const { toast } = useToast();

  // const { user, token, loading } = useTelegram();
 

  const handleScanComplete = (items: TransactionItem[], type: 'purchase' | 'sale') => {
    const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
    
    addTransaction({
      type,
      items,
      totalAmount,
      date: new Date(),
    });

    toast({
      title: 'Transaction Recorded',
      description: `${type === 'sale' ? 'Sale' : 'Purchase'} of $${totalAmount.toFixed(2)} has been saved.`,
    });

    setActiveTab('transactions');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center animate-pulse">
          <div className="w-12 h-12 mx-auto mb-4 gradient-primary rounded-xl flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">L</span>
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const metrics = getMetrics();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="px-4 py-4">
        {activeTab === 'dashboard' && (
          <Dashboard metrics={metrics} recentTransactions={transactions} />
        )}
        {activeTab === 'scan' && (
          <ScanUpload onComplete={handleScanComplete} />
        )}
        {activeTab === 'inventory' && (
          <Inventory products={products} />
        )}
        {activeTab === 'transactions' && (
          <Transactions transactions={transactions} />
        )}
        {activeTab === 'analytics' && (
          <Analytics metrics={metrics} transactions={transactions} />
        )}
      </main>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

       {/* AI CHAT — GLOBAL OVERLAY */}
        {activeTab !== "scan" && (
        <div className="fixed bottom-32 right-4 z-[2147483647]">
        <ChatWidget />
         </div>
        )}
     
      <Toaster />
    </div>
  );
};

export default Index;
