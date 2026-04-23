import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Scissors,
  Calendar,
  Users,
  DollarSign,
  Settings,
  LogOut,
  Zap,
  CreditCard,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { icon: Calendar, label: 'Agenda', path: '/dashboard' },
  { icon: Users, label: 'Profissionais', path: '/dashboard/team' },
  { icon: DollarSign, label: 'Financeiro', path: '/dashboard/finance' },
  { icon: Zap, label: 'Integrações', path: '/dashboard/integrations' },
  { icon: CreditCard, label: 'Assinatura', path: '/dashboard/subscription' },
  { icon: Settings, label: 'Ajustes', path: '/dashboard/settings' },
];

const PLAN_LABELS: Record<string, string> = {
  ESSENTIAL: 'ESSENCIAL',
  ENTERPRISE: 'ENTERPRISE',
};

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const planLabel = user ? (PLAN_LABELS[user.planType] ?? user.planType) : '—';
  const isEnterprise = user?.planType === 'ENTERPRISE';

  // Iniciais do nome para o avatar
  const initials = user?.name
    ? user.name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase()
    : '?';

  return (
    <div className="w-[220px] h-screen border-r border-cyber-blue/15 bg-gradient-to-b from-[#0a0a0a] to-[#050505] flex flex-col py-6 px-4">
      {/* Brand */}
      <div className="mb-12 px-2">
        <div className="flex items-center gap-1 group cursor-pointer text-cyber-blue">
          <Scissors size={20} className="mr-1" />
          <span className="font-sans font-extrabold tracking-tighter text-xl">
            BARBER<span className="text-white">CYBER</span>
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-[0.9rem] font-medium transition-all group',
                isActive
                  ? 'bg-white/[0.03] text-cyber-blue border border-cyber-blue/15 shadow-[0_0_15px_rgba(0,209,255,0.05)]'
                  : 'text-[#888888] hover:text-white'
              )}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Plan Badge */}
      <div className="mt-auto p-4 bg-gradient-to-r from-[#111] to-[#222] border border-cyber-blue/15 rounded-xl">
        <p
          className={cn(
            'text-xs font-bold mb-1 uppercase tracking-wider',
            isEnterprise ? 'text-cyber-blue' : 'text-cyber-orange'
          )}
        >
          PLANO {planLabel}
        </p>
        {!isEnterprise && (
          <>
            <p className="text-[10px] text-white/70 mb-2">Capacidade limitada</p>
            <Link
              to="/dashboard/subscription"
              className="text-[9px] text-[#888888] hover:text-cyber-orange transition-colors"
            >
              Upgrade para Enterprise
            </Link>
          </>
        )}
        {isEnterprise && (
          <p className="text-[10px] text-white/50">Acesso completo ativo</p>
        )}
      </div>

      {/* User Info + Logout */}
      <div className="mt-4 px-1">
        <div className="flex items-center gap-3 mb-2 px-2 py-2 rounded-lg bg-white/[0.02] border border-white/5">
          <div className="w-7 h-7 rounded-full bg-cyber-blue/20 border border-cyber-blue/30 flex items-center justify-center shrink-0">
            <span className="text-[9px] font-black text-cyber-blue">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-white truncate">{user?.name ?? '—'}</p>
            <p className="text-[9px] text-[#555] truncate">{user?.email ?? '—'}</p>
          </div>
          <ChevronUp size={12} className="text-[#444] shrink-0" />
        </div>

        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-[#888888] hover:text-red-400 hover:bg-red-500/5 p-2 h-auto text-[10px] tracking-widest uppercase transition-colors"
        >
          <LogOut size={14} className="mr-2" /> SAIR
        </Button>
      </div>
    </div>
  );
}
