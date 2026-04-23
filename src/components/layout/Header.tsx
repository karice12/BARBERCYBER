import { Bell, Search, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function Header({ title }: { title: string }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário';
  const userInitials = userName.slice(0, 2).toUpperCase();

  return (
    <header className="h-20 border-b border-cyber-blue/15 px-8 flex items-center justify-between sticky top-0 bg-[#050505]/80 backdrop-blur-md z-30">
      <div>
        <h1 className="font-sans text-xl font-bold uppercase tracking-tight text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden lg:block w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#888888]" size={16} />
          <Input 
            placeholder="Buscar..." 
            className="pl-10 bg-white/[0.03] border-cyber-blue/15 rounded-lg h-10 text-xs tracking-widest placeholder:text-[#888888]/50 focus:bg-white/[0.05] transition-all"
          />
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-[#888888] relative hover:bg-white/5">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-cyber-orange rounded-full shadow-[0_0_10px_rgba(255,138,0,0.5)]" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors outline-none">
              <Avatar className="w-9 h-9 border border-cyber-blue/30">
                <AvatarFallback className="bg-cyber-blue text-black font-bold text-xs">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold tracking-tight">{userName}</p>
                <p className="text-[9px] uppercase tracking-widest text-cyber-blue font-black">
                  {user?.user_metadata?.plan_type || 'ESSENTIAL'}
                </p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#0f0f0f] border-white/10 min-w-[200px]">
              <div className="px-3 py-2 border-b border-white/5">
                <p className="text-xs font-bold">{userName}</p>
                <p className="text-[10px] text-[#888] truncate">{user?.email}</p>
              </div>
              <DropdownMenuItem className="text-[10px] uppercase font-black tracking-widest">
                <User size={14} className="mr-2" /> Meu Perfil
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="text-[10px] uppercase font-black tracking-widest text-red-400 focus:text-red-400"
              >
                <LogOut size={14} className="mr-2" /> Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
