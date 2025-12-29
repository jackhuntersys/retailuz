import { Bell, Settings, LogOut } from 'lucide-react';
import { useTelegram } from '@/components/TelegramProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { user, isTelegramWebApp, logout } = useTelegram();

  const getInitials = () => {
    if (!user) return 'U';
    const first = user.first_name?.[0] || '';
    const last = user.last_name?.[0] || '';
    return (first + last).toUpperCase() || 'U';
  };

  const getDisplayName = () => {
    if (!user) return 'User';
    return user.username ? `@${user.username}` : user.first_name;
  };

  return (
    <header className="sticky top-0 z-40 glass border-b border-border/50">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">R</span>
          </div>
          <span className="font-semibold text-foreground">RetailUz</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-secondary rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
          </button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 p-1 hover:bg-secondary rounded-lg transition-colors">
                  <Avatar className="w-7 h-7">
                    <AvatarImage src={user.photo_url} alt={user.first_name} />
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.first_name} {user.last_name}</p>
                  <p className="text-xs text-muted-foreground">{getDisplayName()}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                {!isTelegramWebApp && (
                  <DropdownMenuItem onClick={logout} className="text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
