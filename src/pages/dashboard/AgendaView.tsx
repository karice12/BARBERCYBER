import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { 
  Barber, 
  Appointment, 
  AppointmentStatus 
} from '@/types';
import { 
  Phone, 
  MoreVertical, 
  User, 
  Clock, 
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

const BARBERS: Barber[] = [
  { id: '1', name: 'Zeca Cyber', specialty: 'Fade & Beard', avatar: 'https://picsum.photos/seed/barber1/200/200', commissionRate: 50, status: 'online', color: '#00D1FF' },
  { id: '2', name: 'Rick Neon', specialty: 'Modern Cuts', avatar: 'https://picsum.photos/seed/barber2/200/200', commissionRate: 45, status: 'online', color: '#FF8A00' },
  { id: '3', name: 'Léo Blade', specialty: 'Classic Scissor', avatar: 'https://picsum.photos/seed/barber3/200/200', commissionRate: 40, status: 'on-break', color: '#00FF85' },
  { id: '4', name: 'Samu Volt', specialty: 'Hair Tattoo', avatar: 'https://picsum.photos/seed/barber4/200/200', commissionRate: 50, status: 'online', color: '#FF00FF' },
  { id: '5', name: 'Davi Gear', specialty: 'Navalha Master', avatar: 'https://picsum.photos/seed/barber5/200/200', commissionRate: 45, status: 'offline', color: '#7000FF' },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  { id: 'a1', clientName: 'Carlos Silva', barberId: '1', startTime: '2026-04-16T09:00:00Z', endTime: '2026-04-16T10:00:00Z', service: 'Degradê Navalhado', price: 60, status: 'completed' },
  { id: 'a2', clientName: 'Roberto Motta', barberId: '1', startTime: '2026-04-16T10:30:00Z', endTime: '2026-04-16T11:30:00Z', service: 'Corte e barba', price: 95, status: 'in-progress' },
  { id: 'a3', clientName: 'Jonas Santos', barberId: '2', startTime: '2026-04-16T09:30:00Z', endTime: '2026-04-16T10:00:00Z', service: 'Corte Moderno', price: 50, status: 'confirmed' },
  { id: 'a4', clientName: 'Felipe Alvos', barberId: '3', startTime: '2026-04-16T11:00:00Z', endTime: '2026-04-16T12:00:00Z', service: 'Tesoura Classic', price: 70, status: 'pending' },
];

const STICKY_HOURS = Array.from({ length: 11 }, (_, i) => `${i + 9}:00`);

const statusStyles: Record<AppointmentStatus, { border: string, bg: string, text: string }> = {
  pending: { border: "#444444", bg: "#0f0f0f", text: "#888888" },
  confirmed: { border: "#00D1FF", bg: "#0f0f0f", text: "#00D1FF" },
  'in-progress': { border: "#FF8A00", bg: "rgba(255, 138, 0, 0.05)", text: "#FF8A00" },
  completed: { border: "#00FF85", bg: "#0f0f0f", text: "#00FF85" },
  cancelled: { border: "#ef4444", bg: "#0f0f0f", text: "#ef4444" },
};

export default function AgendaView() {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [whatsappSimulation, setWhatsappSimulation] = useState<null | string>(null);

  const handleStatusChange = (id: string, newStatus: AppointmentStatus) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  const simulateWhatsApp = (client: string, time: string, service: string) => {
    const msg = `Olá ${client}! Daqui a pouco tem BarberCyber Pro. Seu horário de ${service} está confirmado para às ${time}. O barbeiro te aguarda!`;
    setWhatsappSimulation(msg);
    setTimeout(() => setWhatsappSimulation(null), 5000);
  };

  return (
    <div className="flex flex-col h-full bg-[#050505] p-6 gap-6">
      {/* Action Bar / Stats Row */}
      <div className="flex justify-between items-center bg-transparent">
        <div className="flex items-center gap-4">
          <div className="flex border border-cyber-blue/15 rounded-lg overflow-hidden h-9 bg-white/[0.03]">
            <Button variant="ghost" className="h-full rounded-none px-4 hover:bg-white/5 border-r border-cyber-blue/15 text-xs font-bold uppercase tracking-widest text-[#888888]">HOJE</Button>
            <Button variant="ghost" size="icon" className="h-full rounded-none w-9 hover:bg-white/5 border-r border-cyber-blue/15 text-cyber-blue"><ChevronLeft size={16} /></Button>
            <Button variant="ghost" size="icon" className="h-full rounded-none w-9 hover:bg-white/5 text-cyber-blue"><ChevronRight size={16} /></Button>
          </div>
          <p className="font-sans font-black uppercase text-sm tracking-widest">16 de ABRIL, 2026</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white/[0.03] border border-cyber-blue/15 rounded-xl px-5 py-2 min-w-[140px]">
            <p className="text-[0.7rem] uppercase text-[#888888] tracking-widest mb-1">Receita Prevista</p>
            <p className="text-lg font-bold text-cyber-blue">R$ 2.450,00</p>
          </div>
          <div className="bg-white/[0.03] border border-cyber-blue/15 rounded-xl px-5 py-2 min-w-[140px]">
            <p className="text-[0.7rem] uppercase text-[#888888] tracking-widest mb-1">No-Shows Hoje</p>
            <p className="text-lg font-bold text-cyber-orange">2.4%</p>
          </div>
        </div>
      </div>

      {/* Agenda Grid Container */}
      <div className="flex-1 overflow-auto rounded-2xl bg-white/[0.02] border border-cyber-blue/15 p-4 relative scrollbar-hide">
        <div className="min-w-[1000px] flex flex-col h-full">
          {/* Grid Header */}
          <div className="flex border-b-2 border-cyber-blue/15 pb-2 mb-4 bg-transparent sticky top-0 z-20">
            {/* Time Column Placeholder */}
            <div className="w-16 flex-shrink-0" />
            
            {/* Barber Headers */}
            {BARBERS.map(barber => (
              <div key={barber.id} className="flex-1 text-center">
                <div className="w-10 h-10 rounded-full bg-[#222] border border-cyber-blue mx-auto mb-2 flex items-center justify-center text-[0.8rem] font-bold">
                  {barber.name.substring(0, 2).toUpperCase()}
                </div>
                <p className="text-[0.85rem] font-bold uppercase tracking-tight">{barber.name}</p>
              </div>
            ))}
          </div>

          {/* Grid Body */}
          <div className="flex-1 flex relative">
            {/* Time Indicators */}
            <div className="w-16 flex flex-col pt-2">
              {STICKY_HOURS.map(hour => (
                <div key={hour} className="h-24 text-[0.7rem] font-mono text-[#888888] flex items-start pt-1">
                  {hour}
                </div>
              ))}
            </div>

            {/* Barber Columns */}
            <div className="flex-1 flex gap-3 h-full">
              {BARBERS.map(barber => (
                <div key={barber.id} className="flex-1 flex flex-col gap-3 relative">
                  {/* Appointment Cards */}
                  {appointments
                    .filter(app => app.barberId === barber.id)
                    .map(app => {
                      const startH = new Date(app.startTime).getUTCHours();
                      const startM = new Date(app.startTime).getUTCMinutes();
                      const topPos = (startH - 9) * 96 + (startM / 60) * 96;
                      const style = statusStyles[app.status];
                      
                      return (
                        <motion.div
                          key={app.id}
                          layoutId={app.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={cn(
                            "absolute left-0 right-0 p-3 rounded-lg border-y border-r border-[#ffffff10] flex flex-col justify-between group transition-all h-20 cursor-pointer shadow-lg",
                            app.status === 'completed' && "opacity-60"
                          )}
                          style={{ 
                            top: topPos, 
                            borderLeft: `3px solid ${style.border}`,
                            background: style.bg
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div className="min-w-0">
                              <p className="font-mono text-[0.7rem] text-[#888888] mb-0.5">
                                {new Date(app.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </p>
                              <p className="font-bold text-[0.8rem] truncate leading-tight uppercase tracking-tighter">{app.clientName}</p>
                              <p className="text-[0.7rem] text-[#888888] truncate uppercase tracking-widest leading-none">{app.service}</p>
                            </div>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded hover:bg-white/5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyber-blue">
                                <MoreVertical size={12} />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-[#0f0f0f] border-cyber-blue/15">
                                <DropdownMenuItem onClick={() => handleStatusChange(app.id, 'confirmed')} className="text-[10px] uppercase tracking-widest font-black text-cyber-blue">Confirmar</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(app.id, 'in-progress')} className="text-[10px] uppercase tracking-widest font-black text-cyber-orange">Atendimento</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(app.id, 'completed')} className="text-[10px] uppercase tracking-widest font-black text-green-400">Finalizar</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleStatusChange(app.id, 'cancelled')} className="text-[10px] uppercase tracking-widest font-black text-destructive">Cancelar</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="flex items-center justify-between mt-auto">
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.border }} />
                              <span className="text-[0.65rem] font-bold tracking-widest uppercase opacity-80" style={{ color: style.text }}>
                                {app.status === 'in-progress' ? 'Em Curso' : app.status === 'completed' ? 'Finalizado' : app.status}
                              </span>
                            </div>
                            
                            <Button 
                              variant="ghost" 
                              className="h-5 px-2 bg-[#25D36633] text-[#25D366] text-[0.65rem] font-bold rounded hover:bg-[#25D36655] transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                simulateWhatsApp(app.clientName, "10:30", app.service);
                              }}
                            >
                              WHATS
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Simulation Overlay */}
      <AnimatePresence>
        {whatsappSimulation && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-[#075E54] border border-white/10 shadow-2xl overflow-hidden rounded-2xl">
              <div className="bg-[#128C7E] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"><User size={18} className="text-white" /></div>
                  <span className="text-white text-sm font-bold uppercase tracking-widest truncate">BarberCyber WhatsApp Agent</span>
                </div>
                <Badge variant="outline" className="text-white border-white/40 text-[8px] uppercase tracking-widest">Enviando...</Badge>
              </div>
              <div className="p-6 bg-[#E5DDD5] relative">
                {/* Background Pattern Placeholder */}
                <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://i.pinimg.com/originals/ef/7d/43/ef7d439972338f97e35e91988892ccbc.png')] bg-repeat" />
                <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm relative z-10 max-w-[90%]">
                  <p className="text-black text-sm leading-relaxed">{whatsappSimulation}</p>
                  <div className="text-right mt-1">
                    <span className="text-[9px] text-gray-400">AGORA</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
