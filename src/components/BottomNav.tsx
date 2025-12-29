import { LayoutDashboard, Camera, Package, Receipt, BarChart3 } from 'lucide-react';
import { TabType } from '@/types';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { id: TabType; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'inventory', label: 'Stock', icon: Package },
  { id: 'scan', label: 'Scan', icon: Camera },
  { id: 'transactions', label: 'Records', icon: Receipt },
  { id: 'analytics', label: 'Stats', icon: BarChart3 },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="glass border-t border-border/50 px-2 pb-safe">
        <div className="flex items-center justify-around h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isScan = tab.id === 'scan';

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'flex flex-col items-center justify-center transition-all duration-200',
                  isScan ? 'w-14 h-14 -mt-5' : 'w-16 h-full',
                  isScan && 'gradient-primary rounded-full shadow-lg shadow-primary/30'
                )}
              >
                {isScan ? (
                  <Icon className="w-6 h-6 text-primary-foreground" />
                ) : (
                  <>
                    <Icon
                      className={cn(
                        'w-5 h-5 transition-colors',
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      )}
                    />
                    <span
                      className={cn(
                        'text-xs mt-1 transition-colors',
                        isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                      )}
                    >
                      {tab.label}
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
