import { motion } from 'motion/react';
import {
  UserPlus,
  MoreHorizontal,
  Award,
  DollarSign,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Barber } from '@/types';

const TEAM: Barber[] = [
  { id: '1', name: 'Zeca Cyber', specialty: 'Fade & Beard', avatar: 'https://picsum.photos/seed/barber1/200/200', commissionRate: 50, status: 'online', color: '#00D1FF' },
  { id: '2', name: 'Rick Neon', specialty: 'Modern Cuts', avatar: 'https://picsum.photos/seed/barber2/200/200', commissionRate: 45, status: 'online', color: '#FF8A00' },
  { id: '3', name: 'Léo Blade', specialty: 'Classic Scissor', avatar: 'https://picsum.photos/seed/barber3/200/200', commissionRate: 40, status: 'on-break', color: '#00FF85' },
  { id: '4', name: 'Samu Volt', specialty: 'Hair Tattoo', avatar: 'https://picsum.photos/seed/barber4/200/200', commissionRate: 50, status: 'online', color: '#FF00FF' },
  { id: '5', name: 'Davi Gear', specialty: 'Navalha Master', avatar: 'https://picsum.photos/seed/barber5/200/200', commissionRate: 45, status: 'offline', color: '#7000FF' },
];

export default function TeamView() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-heading font-black uppercase tracking-tight">EQUIPE DE ELITE</h2>
          <p className="text-muted-foreground uppercase text-xs tracking-widest mt-1">Gerencie seus profissionais e comissões.</p>
        </div>
        <Button className="bg-cyber-blue text-black font-black uppercase tracking-tighter h-10 px-6 rounded-none hover:shadow-[0_0_20px_rgba(0,209,255,0.4)] transition-all">
          <UserPlus size={16} className="mr-2" /> RECRUTAR
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEAM.map((barber, index) => (
          <motion.div
            key={barber.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-blue/20 to-cyber-orange/20 rounded-2xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

            <div className="relative bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 h-full flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="relative">
                  <Avatar className="w-16 h-16 border-2 border-cyber-blue/30 p-1 bg-black">
                    <AvatarImage src={barber.avatar} />
                    <AvatarFallback>{barber.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      'absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#0a0a0a]',
                      barber.status === 'online'
                        ? 'bg-green-500'
                        : barber.status === 'on-break'
                        ? 'bg-amber-500'
                        : 'bg-zinc-700'
                    )}
                  />
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger className="p-2 text-muted-foreground hover:text-white transition-colors">
                    <MoreHorizontal size={20} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#0f0f0f] border-white/10">
                    <DropdownMenuItem className="text-[10px] uppercase font-black tracking-widest">Editar Perfil</DropdownMenuItem>
                    <DropdownMenuItem className="text-[10px] uppercase font-black tracking-widest">Configurar Agenda</DropdownMenuItem>
                    <DropdownMenuItem className="text-[10px] uppercase font-black tracking-widest text-destructive">Remover</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold uppercase tracking-tight mb-1">{barber.name}</h3>
                <p className="text-cyber-blue text-[10px] font-black uppercase tracking-[0.2em] mb-4">{barber.specialty}</p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                      <DollarSign size={12} />
                      <span className="text-[8px] uppercase font-black tracking-widest">Comissão</span>
                    </div>
                    <p className="text-sm font-bold text-white">{barber.commissionRate}%</p>
                  </div>
                  <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                      <Star size={12} />
                      <span className="text-[8px] uppercase font-black tracking-widest">Avaliação</span>
                    </div>
                    <p className="text-sm font-bold text-cyber-orange">4.9</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-tighter">
                    <span className="text-muted-foreground">Volume Mensal</span>
                    <span className="text-white">R$ 12.400</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '75%' }}
                      className="h-full bg-cyber-blue shadow-[0_0_10px_rgba(0,209,255,0.4)]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2">
                <Badge variant="outline" className="bg-white/5 border-white/10 text-[8px] font-black uppercase tracking-widest rounded-none">
                  <Award size={10} className="mr-1 text-cyber-orange" /> SÊNIOR
                </Badge>
                <div
                  className="ml-auto w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                  style={{ backgroundColor: barber.color }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
