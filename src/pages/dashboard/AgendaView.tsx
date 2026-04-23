import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { 
  Phone, 
  MoreVertical, 
  User, 
  ChevronLeft,
  ChevronRight,
  Plus,
  Loader2,
  AlertCircle,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAppointments } from '@/hooks/useAppointments';
import { useStaff } from '@/hooks/useStaff';
import type { Appointment, AppointmentStatus, CreateAppointmentData } from '@/lib/api';
import { format, addDays, subDays, parseISO, setHours, setMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const STICKY_HOURS = Array.from({ length: 11 }, (_, i) => `${String(i + 9).padStart(2, '0')}:00`);

const AVATAR_COLORS = ['#00D1FF', '#FF8A00', '#00FF85', '#FF00FF', '#7000FF'];

const statusStyles: Record<AppointmentStatus, { border: string, bg: string, text: string, label: string }> = {
  PENDING: { border: "#444444", bg: "#0f0f0f", text: "#888888", label: "Pendente" },
  COMPLETED: { border: "#00FF85", bg: "#0f0f0f", text: "#00FF85", label: "Finalizado" },
  CANCELED: { border: "#ef4444", bg: "#0f0f0f", text: "#ef4444", label: "Cancelado" },
  NO_SHOW: { border: "#FF8A00", bg: "rgba(255, 138, 0, 0.05)", text: "#FF8A00", label: "No-Show" },
};

export default function AgendaView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  
  const { appointments, isLoading: loadingAppointments, updateStatus, createAppointment } = useAppointments({ date: dateStr });
  const { staff, isLoading: loadingStaff } = useStaff();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [whatsappSimulation, setWhatsappSimulation] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateAppointmentData>({
    clientName: '',
    clientPhone: '',
    serviceName: '',
    price: 0,
    scheduledAt: '',
    staffId: '',
  });

  const isLoading = loadingAppointments || loadingStaff;

  // Filtrar apenas barbeiros disponíveis
  const availableStaff = useMemo(() => staff.filter(s => s.isAvailable), [staff]);

  const handleStatusChange = async (id: string, newStatus: AppointmentStatus) => {
    await updateStatus(id, newStatus);
  };

  const simulateWhatsApp = (client: string, time: string, service: string) => {
    const msg = `Olá ${client}! Daqui a pouco tem BarberCyber Pro. Seu horário de ${service} está confirmado para às ${time}. O barbeiro te aguarda!`;
    setWhatsappSimulation(msg);
    setTimeout(() => setWhatsappSimulation(null), 5000);
  };

  const handlePrevDay = () => setSelectedDate(prev => subDays(prev, 1));
  const handleNextDay = () => setSelectedDate(prev => addDays(prev, 1));
  const handleToday = () => setSelectedDate(new Date());

  const resetForm = () => {
    setFormData({
      clientName: '',
      clientPhone: '',
      serviceName: '',
      price: 0,
      scheduledAt: '',
      staffId: '',
    });
    setFormError(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);

    // Combinar data selecionada com horário do form
    const [hours, minutes] = formData.scheduledAt.split(':').map(Number);
    const scheduledDateTime = setMinutes(setHours(selectedDate, hours), minutes);

    const result = await createAppointment({
      ...formData,
      scheduledAt: scheduledDateTime.toISOString(),
    });

    if (result.error) {
      setFormError(result.error);
      setIsSubmitting(false);
      return;
    }

    setIsCreateOpen(false);
    resetForm();
    setIsSubmitting(false);
  };

  // Calcular estatísticas
  const stats = useMemo(() => {
    const completed = appointments.filter(a => a.status === 'COMPLETED');
    const totalRevenue = completed.reduce((sum, a) => sum + a.price, 0);
    const noShows = appointments.filter(a => a.status === 'NO_SHOW').length;
    const noShowRate = appointments.length > 0 ? (noShows / appointments.length * 100).toFixed(1) : '0';
    
    return { totalRevenue, noShowRate };
  }, [appointments]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-cyber-blue" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#050505] p-6 gap-6">
      {/* Action Bar / Stats Row */}
      <div className="flex justify-between items-center bg-transparent">
        <div className="flex items-center gap-4">
          <div className="flex border border-cyber-blue/15 rounded-lg overflow-hidden h-9 bg-white/[0.03]">
            <Button 
              variant="ghost" 
              onClick={handleToday}
              className="h-full rounded-none px-4 hover:bg-white/5 border-r border-cyber-blue/15 text-xs font-bold uppercase tracking-widest text-[#888888]"
            >
              HOJE
            </Button>
            <Button variant="ghost" size="icon" onClick={handlePrevDay} className="h-full rounded-none w-9 hover:bg-white/5 border-r border-cyber-blue/15 text-cyber-blue">
              <ChevronLeft size={16} />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleNextDay} className="h-full rounded-none w-9 hover:bg-white/5 text-cyber-blue">
              <ChevronRight size={16} />
            </Button>
          </div>
          <p className="font-sans font-black uppercase text-sm tracking-widest">
            {format(selectedDate, "dd 'de' MMMM, yyyy", { locale: ptBR }).toUpperCase()}
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white/[0.03] border border-cyber-blue/15 rounded-xl px-5 py-2 min-w-[140px]">
            <p className="text-[0.7rem] uppercase text-[#888888] tracking-widest mb-1">Receita do Dia</p>
            <p className="text-lg font-bold text-cyber-blue">R$ {stats.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-white/[0.03] border border-cyber-blue/15 rounded-xl px-5 py-2 min-w-[140px]">
            <p className="text-[0.7rem] uppercase text-[#888888] tracking-widest mb-1">No-Shows</p>
            <p className="text-lg font-bold text-cyber-orange">{stats.noShowRate}%</p>
          </div>
          <Button 
            onClick={() => { resetForm(); setIsCreateOpen(true); }}
            className="bg-cyber-blue text-black font-black uppercase tracking-tighter h-auto px-6 hover:shadow-[0_0_20px_rgba(0,209,255,0.4)]"
          >
            <Plus size={16} className="mr-2" /> AGENDAR
          </Button>
        </div>
      </div>

      {/* Agenda Grid Container */}
      <div className="flex-1 overflow-auto rounded-2xl bg-white/[0.02] border border-cyber-blue/15 p-4 relative scrollbar-hide">
        {availableStaff.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <AlertCircle className="w-12 h-12 text-[#444]" />
            <p className="text-[#888]">Nenhum barbeiro disponível. Adicione barbeiros na aba Equipe.</p>
          </div>
        ) : (
          <div className="min-w-[1000px] flex flex-col h-full">
            {/* Grid Header */}
            <div className="flex border-b-2 border-cyber-blue/15 pb-2 mb-4 bg-transparent sticky top-0 z-20">
              <div className="w-16 flex-shrink-0" />
              
              {availableStaff.map((barber, idx) => (
                <div key={barber.id} className="flex-1 text-center">
                  <Avatar className="w-10 h-10 mx-auto mb-2 border border-cyber-blue">
                    <AvatarFallback style={{ backgroundColor: AVATAR_COLORS[idx % AVATAR_COLORS.length] }} className="text-black font-bold text-xs">
                      {barber.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
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
                {availableStaff.map(barber => (
                  <div key={barber.id} className="flex-1 flex flex-col gap-3 relative">
                    {/* Appointment Cards */}
                    {appointments
                      .filter(app => app.staffId === barber.id)
                      .map(app => {
                        const startDate = parseISO(app.scheduledAt);
                        const startH = startDate.getHours();
                        const startM = startDate.getMinutes();
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
                              app.status === 'COMPLETED' && "opacity-60",
                              app.status === 'CANCELED' && "opacity-40"
                            )}
                            style={{ 
                              top: Math.max(0, topPos), 
                              borderLeft: `3px solid ${style.border}`,
                              background: style.bg
                            }}
                          >
                            <div className="flex justify-between items-start">
                              <div className="min-w-0">
                                <p className="font-mono text-[0.7rem] text-[#888888] mb-0.5">
                                  {format(startDate, 'HH:mm')}
                                </p>
                                <p className="font-bold text-[0.8rem] truncate leading-tight uppercase tracking-tighter">{app.clientName}</p>
                                <p className="text-[0.7rem] text-[#888888] truncate uppercase tracking-widest leading-none">{app.serviceName}</p>
                              </div>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded hover:bg-white/5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-cyber-blue">
                                  <MoreVertical size={12} />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-[#0f0f0f] border-cyber-blue/15">
                                  <DropdownMenuItem onClick={() => handleStatusChange(app.id, 'COMPLETED')} className="text-[10px] uppercase tracking-widest font-black text-green-400">Finalizar</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(app.id, 'NO_SHOW')} className="text-[10px] uppercase tracking-widest font-black text-cyber-orange">No-Show</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(app.id, 'CANCELED')} className="text-[10px] uppercase tracking-widest font-black text-destructive">Cancelar</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.border }} />
                                <span className="text-[0.65rem] font-bold tracking-widest uppercase opacity-80" style={{ color: style.text }}>
                                  {style.label}
                                </span>
                              </div>
                              
                              <Button 
                                variant="ghost" 
                                className="h-5 px-2 bg-[#25D36633] text-[#25D366] text-[0.65rem] font-bold rounded hover:bg-[#25D36655] transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  simulateWhatsApp(app.clientName, format(startDate, 'HH:mm'), app.serviceName);
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
        )}
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

      {/* Modal Criar Agendamento */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="bg-[#0a0a0a] border-white/10 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-black uppercase tracking-tight">Novo Agendamento</DialogTitle>
          </DialogHeader>
          
          {formError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
              <AlertCircle size={16} className="text-red-500" />
              <p className="text-red-400 text-sm">{formError}</p>
            </div>
          )}

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <Label className="text-[10px] uppercase font-black tracking-widest text-[#888]">Cliente</Label>
              <Input 
                value={formData.clientName}
                onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                className="mt-2 bg-white/5 border-white/10"
                placeholder="Nome do cliente"
                required
              />
            </div>
            <div>
              <Label className="text-[10px] uppercase font-black tracking-widest text-[#888]">Telefone</Label>
              <Input 
                value={formData.clientPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                className="mt-2 bg-white/5 border-white/10"
                placeholder="(11) 99999-9999"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[10px] uppercase font-black tracking-widest text-[#888]">Serviço</Label>
                <Input 
                  value={formData.serviceName}
                  onChange={(e) => setFormData(prev => ({ ...prev, serviceName: e.target.value }))}
                  className="mt-2 bg-white/5 border-white/10"
                  placeholder="Corte + Barba"
                  required
                />
              </div>
              <div>
                <Label className="text-[10px] uppercase font-black tracking-widest text-[#888]">Preço (R$)</Label>
                <Input 
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                  className="mt-2 bg-white/5 border-white/10"
                  placeholder="50.00"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[10px] uppercase font-black tracking-widest text-[#888]">Horário</Label>
                <Input 
                  type="time"
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledAt: e.target.value }))}
                  className="mt-2 bg-white/5 border-white/10"
                  required
                />
              </div>
              <div>
                <Label className="text-[10px] uppercase font-black tracking-widest text-[#888]">Barbeiro</Label>
                <select
                  value={formData.staffId}
                  onChange={(e) => setFormData(prev => ({ ...prev, staffId: e.target.value }))}
                  className="mt-2 w-full h-10 bg-white/5 border border-white/10 rounded-md px-3 text-sm"
                  required
                >
                  <option value="">Selecione...</option>
                  {availableStaff.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)} className="border-white/10">
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-cyber-blue text-black font-bold">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Agendar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
