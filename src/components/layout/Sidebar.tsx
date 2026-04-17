import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Scissors, 
  Calendar, 
  Users, 
  DollarSign, 
  Settings, 
  ChevronRight,
  LogOut,
  Zap,
  CreditCard
} from 'lucide-react';

const navItems = [
  { icon: Calendar, label: 'Agenda', path: '/dashboard' },
  { icon: Users, label: 'Profissionais', path: '/dashboard/team' },
  { icon: DollarSign, label: 'Financeiro', path: '/dashboard/finance' },
  { icon: Zap, label: 'Integrações', path: '/dashboard/integrations' },
  { icon: CreditCard, label: 'Assinatura', path: '/dashboard/subscription' },
  { icon: Settings, label: 'Ajustes', path: '/dashboard/settings' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-[220px] h-screen border-r border-cyber-blue/15 bg-gradient-to-b from-[#0a0a0a] to-[#050505] flex flex-col py-6 px-4">
      {/* Brand */}
      <div className="mb-12 px-2">
        <div className="flex items-center gap-1 group cursor-pointer text-cyber-blue">
          <Scissors size={20} className="mr-1" />
          <span className="font-sans font-extrabold tracking-tighter text-xl">BARBER<span className="text-white">CYBER</span></span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-[0.9rem] font-medium transition-all group",
                isActive 
                  ? "bg-white/[0.03] text-cyber-blue border border-cyber-blue/15 shadow-[0_0_15px_rgba(0,209,255,0.05)]" 
                  : "text-[#888888] hover:text-white"
              )}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Plan Badge - High Density Theme Specific */}
      <div className="mt-auto p-4 bg-gradient-to-r from-[#111] to-[#222] border border-cyber-blue/15 rounded-xl">
        <p className="text-cyber-orange text-xs font-bold mb-1 uppercase tracking-wider">PLANO PRO</p>
        <p className="text-[10px] text-white/70 mb-2">5/5 Profissionais Ativos</p>
        <div className="h-1 w-full bg-[#333] rounded-full overflow-hidden mb-2">
          <div className="h-full bg-cyber-orange w-full" />
        </div>
        <p className="text-[9px] text-[#888888] cursor-pointer hover:text-cyber-orange transition-colors">Upgrade para Ilimitado</p>
      </div>

      <div className="mt-4 px-2">
        <Button variant="ghost" className="w-full justify-start text-[#888888] hover:text-white hover:bg-white/5 p-2 h-auto text-[10px] tracking-widest uppercase">
          <LogOut size={14} className="mr-2" /> SAIR
        </Button>
      </div>
    </div>
  );
}

import { Button } from '@/components/ui/button';
