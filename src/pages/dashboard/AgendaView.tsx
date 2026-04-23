import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useStaff, useAppointments } from '@/hooks/useData';
import { updateAppointmentStatus, type AppointmentStatus } from '@/lib/api';
import {
  MoreVertical,
  User,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const STICKY_HOURS = Array.from({ length: 11 }, (_, i) => `${String(i + 9).padStart(2, '0')}:00`);

const STATUS_COLORS: Record<AppointmentStatus, string> = {
  PENDING: '#444444',
  COMPLETED: '#00FF85',
  CANCELED: '#ef4444',
  NO_SHOW: '#FF8A00',
};

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  PENDING: 'Pendente',
  COMPLETED: 'Finalizado',
  CANCELED: 'Cancelado',
  NO_SHOW: 'No-Show',
};

const STAFF_COLORS = ['#00D1FF', '#FF8A00', '#00FF85', '#FF00FF', '#7000FF', '#FFD700'];

function toDateString(d: Date) {
  return d.toISOString().split('T')[0];
}

export default function AgendaView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [whatsappMsg, setWhatsappMsg] = useState<string | null>(null);

  const dateStr = toDateString(selectedDate);
  const { staff, isLoading: staffLoading } = useStaff();
  const { appointments, isLoading: apptLoading, mutate } = useAppointments(dateStr);

  const isLoading = staffLoading || apptLoading;

  const prevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d);
  };

  const nextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d);
  };

  const handleStatusChange = async (id: string, status: AppointmentStatus) => {
    await updateAppointmentStatus(id, status);
    mutate();
  };

  const simulateWhatsApp = (client: string, service: string, time: string) => {
    const msg = `Olá ${client}! Seu horário de ${service} está confirmado para às ${time}. O barbeiro te aguarda na BarberCyber!`;
    setWhatsappMsg(msg);
    setTimeout(() => setWhatsappMsg(null), 5000);
  };

  const todayRevenue = appointments
    .filter(a => a.status === 'COMPLETED')
    .reduce((acc, a) => acc + a.price, 0);

  const noShowCount = appointments.filter(a => a.status === 'NO_SHOW').length;

  return (
    <div className="flex flex-col h-full bg-[#050505] p-6 gap-6">
      {/* Action Bar / Stats Row */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="flex border border-cyber-blue/15 rounded-lg overflow-hidden h-9 bg-white/[0.03]">
            <Button
              variant="ghost"
              onClick={() => setSelectedDate(new Date())}
              className="h-full rounded-none px-4 hover:bg-white/5 border-r border-cyber-blue/15 text-xs font-bold uppercase tracking-widest text-[#888888]"
            >
              HOJE
            </Button>
            <Button variant="ghost" size="icon" onClick={prevDay} className="h-full rounded-none w-9 hover:bg-white/5 border-r border-cyber-blue/15 text-cyber-blue">
              <ChevronLeft size={16} />
            </Button>
            <Button variant="ghost" size="icon" onClick={nextDay} className="h-full rounded-none w-9 hover:bg-white/5 text-cyber-blue">
              <ChevronRight size={16} />
            </Button>
          </div>
          <p className="font-sans font-black uppercase text-sm tracking-widest">
            {selectedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="flex gap-4">
          <div className="bg-white/[0.03] border border-cyber-blue/15 rounded-xl px-5 py-2 min-w-[140px]">
            <p className="text-[0.7rem] uppercase text-[#888888] tracking-widest mb-1">Receita Realizada</p>
            <p className="text-lg font-bold text-cyber-blue">
              {todayRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </p>
          </div>
          <div className="bg-white/[0.03] border border-cyber-blue/15 rounded-xl px-5 py-2 min-w-[140px]">
            <p className="text-[0.7rem] uppercase text-[#888888] tracking-widest mb-1">No-Shows</p>
            <p className="text-lg font-bold text-cyber-orange">{noShowCount}</p>
          </div>
        </div>
      </div>

      {/* Loading / Empty States */}
      {isLoading && (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="text-cyber-blue animate-spin" size={32} />
        </div>
      )}

      {!isLoading && staff.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 opacity-40">
          <AlertTriangle size={48} className="text-cyber-orange" />
          <p className="text-sm uppercase tracking-widest font-bold">
            Nenhum profissional cadastrado. Vá em Profissionais e adicione sua equipe.
          </p>
        </div>
      )}

      {/* Agenda Grid */}
      {!isLoading && staff.length > 0 && (
        <div className="flex-1 overflow-auto rounded-2xl bg-white/[0.02] border border-cyber-blue/15 p-4 relative">
          <div className="min-w-[700px] flex flex-col h-full">
            {/* Grid Header */}
            <div className="flex border-b-2 border-cyber-blue/15 pb-2 mb-4 sticky top-0 z-20 bg-[#050505]">
              <div className="w-16 flex-shrink-0" />
              {staff.map((member, idx) => (
                <div key={member.id} className="flex-1 text-center">
                  <div
                    className="w-10 h-10 rounded-full bg-[#222] mx-auto mb-2 flex items-center justify-center text-[0.8rem] font-bold border"
                    style={{ borderColor: STAFF_COLORS[idx % STAFF_COLORS.length] }}
                  >
                    {member.name.substring(0, 2).toUpperCase()}
                  </div>
                  <p className="text-[0.85rem] font-bold uppercase tracking-tight">{member.name}</p>
                  <p className="text-[0.65rem] text-[#888888] uppercase tracking-widest">{member.specialty}</p>
                </div>
              ))}
            </div>

            {/* Grid Body */}
            <div className="flex-1 flex relative">
              {/* Time Column */}
              <div className="w-16 flex flex-col pt-2">
                {STICKY_HOURS.map(hour => (
                  <div key={hour} className="h-24 text-[0.7rem] font-mono text-[#888888] flex items-start pt-1">
                    {hour}
                  </div>
                ))}
              </div>

              {/* Staff Columns */}
              <div className="flex-1 flex gap-3 h-full">
                {staff.map((member, idx) => {
                  const memberColor = STAFF_COLORS[idx % STAFF_COLORS.length];
                  const memberAppts = appointments.filter(a => a.staffId === member.id);

                  return (
                    <div key={member.id} className="flex-1 relative" style={{ minHeight: `${STICKY_HOURS.length * 96}px` }}>
                      {/* Hour grid lines */}
                      {STICKY_HOURS.map((_, hIdx) => (
                        <div
                          key={hIdx}
                          className="absolute left-0 right-0 border-t border-white/[0.03]"
                          style={{ top: hIdx * 96 }}
                        />
                      ))}

                      {memberAppts.map(appt => {
                        const startH = new Date(appt.scheduledAt).getHours();
                        const startM = new Date(appt.scheduledAt).getMinutes();
                        const topPos = (startH - 9) * 96 + (startM / 60) * 96;
                        const color = STATUS_COLORS[appt.status];

                        return (
                          <motion.div
                            key={appt.id}
                            layoutId={appt.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={cn(
                              'absolute left-1 right-1 p-3 rounded-lg border-y border-r border-[#ffffff10] flex flex-col justify-between group cursor-pointer shadow-lg h-20',
                              appt.status === 'COMPLETED' && 'opacity-60'
                            )}
                            style={{
                              top: topPos,
                              borderLeft: `3px solid ${color}`,
                              background: appt.status === 'NO_SHOW' ? 'rgba(255,138,0,0.05)' : '#0f0f0f',
                            }}
                          >
                            <div className="flex justify-between items-start">
                              <div className="min-w-0">
                                <p className="font-mono text-[0.7rem] text-[#888888] mb-0.5">
                                  {new Date(appt.scheduledAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className="font-bold text-[0.8rem] truncate leading-tight uppercase tracking-tighter">
                                  {appt.clientName}
                                </p>
                                <p className="text-[0.7rem] text-[#888888] truncate uppercase tracking-widest leading-none">
                                  {appt.serviceName}
                                </p>
                              </div>

                              <DropdownMenu>
                                <DropdownMenuTrigger className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded hover:bg-white/5 outline-none focus-visible:ring-2 focus-visible:ring-cyber-blue">
                                  <MoreVertical size={12} />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-[#0f0f0f] border-cyber-blue/15">
                                  <DropdownMenuItem onClick={() => handleStatusChange(appt.id, 'COMPLETED')} className="text-[10px] uppercase tracking-widest font-black text-green-400">
                                    Finalizar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(appt.id, 'CANCELED')} className="text-[10px] uppercase tracking-widest font-black text-destructive">
                                    Cancelar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(appt.id, 'NO_SHOW')} className="text-[10px] uppercase tracking-widest font-black text-cyber-orange">
                                    No-Show
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
                                <span className="text-[0.65rem] font-bold tracking-widest uppercase" style={{ color }}>
                                  {STATUS_LABELS[appt.status]}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                className="h-5 px-2 bg-[#25D36633] text-[#25D366] text-[0.65rem] font-bold rounded hover:bg-[#25D36655]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  simulateWhatsApp(
                                    appt.clientName,
                                    appt.serviceName,
                                    new Date(appt.scheduledAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                                  );
                                }}
                              >
                                WHATS
                              </Button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Notification Toast */}
      <AnimatePresence>
        {whatsappMsg && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-[#075E54] border border-white/10 shadow-2xl overflow-hidden rounded-2xl">
              <div className="bg-[#128C7E] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <User size={18} className="text-white" />
                  </div>
                  <span className="text-white text-sm font-bold uppercase tracking-widest">BarberCyber WhatsApp Agent</span>
                </div>
                <Badge variant="outline" className="text-white border-white/40 text-[8px] uppercase tracking-widest">
                  Enviando...
                </Badge>
              </div>
              <div className="p-6 bg-[#E5DDD5]">
                <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[90%]">
                  <p className="text-black text-sm leading-relaxed">{whatsappMsg}</p>
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
