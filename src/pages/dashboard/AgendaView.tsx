import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import {
  MoreVertical,
  User,
  ChevronLeft,
  ChevronRight,
  Plus,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  appointmentApi,
  staffApi,
  AppointmentRecord,
  StaffMember,
  ApiError,
} from '@/lib/api';

const STAFF_COLORS = [
  '#00D1FF',
  '#FF8A00',
  '#00FF85',
  '#FF00FF',
  '#7000FF',
  '#FFD700',
];

const STICKY_HOURS = Array.from({ length: 11 }, (_, i) => `${String(i + 9).padStart(2, '0')}:00`);

const STATUS_STYLES: Record<
  AppointmentRecord['status'],
  { border: string; bg: string; text: string; label: string }
> = {
  PENDING:     { border: '#444444', bg: '#0f0f0f',                      text: '#888888', label: 'Pendente'    },
  CONFIRMED:   { border: '#00D1FF', bg: '#0f0f0f',                      text: '#00D1FF', label: 'Confirmado'  },
  IN_PROGRESS: { border: '#FF8A00', bg: 'rgba(255,138,0,0.05)',          text: '#FF8A00', label: 'Em Curso'    },
  COMPLETED:   { border: '#00FF85', bg: '#0f0f0f',                      text: '#00FF85', label: 'Finalizado'  },
  CANCELLED:   { border: '#ef4444', bg: '#0f0f0f',                      text: '#ef4444', label: 'Cancelado'   },
};

function formatDateParam(d: Date) {
  return d.toISOString().split('T')[0];
}

function formatDisplayDate(d: Date) {
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function appointmentTopPx(scheduledAt: string): number {
  const d = new Date(scheduledAt);
  const h = d.getUTCHours();
  const m = d.getUTCMinutes();
  return (h - 9) * 96 + (m / 60) * 96;
}

// ── Modal: Novo Agendamento ────────────────────────────────────────────────────

interface NewApptModalProps {
  open: boolean;
  onClose: () => void;
  staff: StaffMember[];
  selectedDate: Date;
  onCreated: () => void;
}

function NewAppointmentModal({ open, onClose, staff, selectedDate, onCreated }: NewApptModalProps) {
  const [form, setForm] = useState({
    clientName: '',
    clientPhone: '',
    serviceName: '',
    price: '',
    staffId: '',
    time: '09:00',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k: keyof typeof form) => (v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.staffId) { setError('Selecione um barbeiro.'); return; }
    setLoading(true);
    setError('');
    try {
      const [h, min] = form.time.split(':').map(Number);
      const scheduledAt = new Date(selectedDate);
      scheduledAt.setUTCHours(h, min, 0, 0);

      await appointmentApi.create({
        clientName: form.clientName,
        clientPhone: form.clientPhone,
        serviceName: form.serviceName,
        price: parseFloat(form.price),
        scheduledAt: scheduledAt.toISOString(),
        staffId: form.staffId,
      });
      onCreated();
      onClose();
      setForm({ clientName: '', clientPhone: '', serviceName: '', price: '', staffId: '', time: '09:00' });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro ao criar agendamento.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg bg-[#0a0a0a] border-white/10 text-white rounded-2xl p-0 overflow-hidden">
        <div className="bg-amber-500 h-1 w-full" />
        <div className="p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight">NOVO AGENDAMENTO</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-[#888]">Cliente</Label>
                <Input
                  required
                  value={form.clientName}
                  onChange={(e) => set('clientName')(e.target.value)}
                  placeholder="Nome do cliente"
                  className="bg-white/[0.03] border-white/10 focus:border-amber-500 rounded-none"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-[#888]">WhatsApp</Label>
                <Input
                  required
                  value={form.clientPhone}
                  onChange={(e) => set('clientPhone')(e.target.value)}
                  placeholder="+55 11 99999-0000"
                  className="bg-white/[0.03] border-white/10 focus:border-amber-500 rounded-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-[#888]">Serviço</Label>
                <Input
                  required
                  value={form.serviceName}
                  onChange={(e) => set('serviceName')(e.target.value)}
                  placeholder="Ex: Degradê + Barba"
                  className="bg-white/[0.03] border-white/10 focus:border-amber-500 rounded-none"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-[#888]">Valor (R$)</Label>
                <Input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => set('price')(e.target.value)}
                  placeholder="0,00"
                  className="bg-white/[0.03] border-white/10 focus:border-amber-500 rounded-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-[#888]">Barbeiro</Label>
                <Select value={form.staffId} onValueChange={set('staffId')}>
                  <SelectTrigger className="bg-white/[0.03] border-white/10 rounded-none focus:border-amber-500">
                    <SelectValue placeholder="Selecionar..." />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f0f0f] border-white/10">
                    {staff.map((s) => (
                      <SelectItem key={s.id} value={s.id} className="text-white focus:bg-white/10">
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black tracking-widest text-[#888]">Horário</Label>
                <Input
                  required
                  type="time"
                  value={form.time}
                  onChange={(e) => set('time')(e.target.value)}
                  className="bg-white/[0.03] border-white/10 focus:border-amber-500 rounded-none"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-xs font-bold">
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <DialogFooter className="pt-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-white/10 uppercase font-black tracking-widest text-[10px] rounded-none hover:bg-white/5"
              >
                CANCELAR
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-amber-500 text-black font-black uppercase tracking-widest text-[10px] rounded-none hover:bg-amber-400"
              >
                {loading ? <Loader2 size={14} className="animate-spin" /> : 'AGENDAR'}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AgendaView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<AppointmentRecord[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newApptOpen, setNewApptOpen] = useState(false);
  const [whatsappMsg, setWhatsappMsg] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [appts, staffList] = await Promise.all([
        appointmentApi.list({ date: formatDateParam(selectedDate) }),
        staffApi.list(),
      ]);
      setAppointments(appts);
      setStaff(staffList);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro ao carregar agenda.');
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => { loadData(); }, [loadData]);

  function navigate(delta: number) {
    setSelectedDate((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() + delta);
      return next;
    });
  }

  async function handleStatusChange(id: string, status: AppointmentRecord['status']) {
    setUpdatingId(id);
    try {
      const updated = await appointmentApi.updateStatus(id, status);
      setAppointments((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } catch {
      // silencia — o estado local não é alterado se falhar
    } finally {
      setUpdatingId(null);
    }
  }

  function triggerWhatsApp(clientName: string, serviceName: string, scheduledAt: string) {
    const time = new Date(scheduledAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const msg = `Olá ${clientName}! Daqui a pouco tem BarberCyber Pro. Seu horário de ${serviceName} está confirmado para às ${time}. O barbeiro te aguarda!`;
    setWhatsappMsg(msg);
    setTimeout(() => setWhatsappMsg(null), 5000);
  }

  const totalRevenue = appointments
    .filter((a) => a.status === 'COMPLETED')
    .reduce((sum, a) => sum + a.price, 0);

  const noShows = appointments.filter((a) => a.status === 'CANCELLED').length;

  return (
    <div className="flex flex-col h-full bg-[#050505] p-6 gap-6">
      {/* Action Bar */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="flex border border-amber-500/20 rounded-lg overflow-hidden h-9 bg-white/[0.03]">
            <Button
              variant="ghost"
              className="h-full rounded-none px-4 hover:bg-white/5 border-r border-amber-500/20 text-xs font-black uppercase tracking-widest text-[#888]"
              onClick={() => setSelectedDate(new Date())}
            >
              HOJE
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-full rounded-none w-9 hover:bg-white/5 border-r border-amber-500/20 text-amber-500"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-full rounded-none w-9 hover:bg-white/5 text-amber-500"
              onClick={() => navigate(1)}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
          <p className="font-sans font-black uppercase text-sm tracking-widest">
            {formatDisplayDate(selectedDate)}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-white/[0.03] border border-amber-500/20 rounded-xl px-5 py-2 min-w-[140px]">
            <p className="text-[0.7rem] uppercase text-[#888] tracking-widest mb-1">Receita do Dia</p>
            <p className="text-lg font-bold text-amber-500">
              {loading ? '—' : `R$ ${totalRevenue.toFixed(2).replace('.', ',')}`}
            </p>
          </div>
          <div className="bg-white/[0.03] border border-amber-500/20 rounded-xl px-5 py-2 min-w-[140px]">
            <p className="text-[0.7rem] uppercase text-[#888] tracking-widest mb-1">Cancelamentos</p>
            <p className="text-lg font-bold text-red-400">{loading ? '—' : noShows}</p>
          </div>
          <Button
            onClick={() => setNewApptOpen(true)}
            className="bg-amber-500 text-black font-black uppercase tracking-widest text-[11px] h-9 px-5 rounded-lg hover:bg-amber-400 transition-colors"
          >
            <Plus size={15} className="mr-1.5" /> NOVO
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={loadData}
            disabled={loading}
            className="text-[#888] hover:text-white"
          >
            <RefreshCw size={16} className={cn(loading && 'animate-spin')} />
          </Button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm font-bold">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Agenda Grid */}
      <div className="flex-1 overflow-auto rounded-2xl bg-white/[0.02] border border-amber-500/15 p-4 relative">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 size={32} className="animate-spin text-amber-500" />
          </div>
        ) : (
          <div className="min-w-[900px] flex flex-col h-full">
            {/* Grid Header */}
            <div className="flex border-b-2 border-amber-500/15 pb-3 mb-4 sticky top-0 z-20 bg-[#050505]">
              <div className="w-16 flex-shrink-0" />
              {staff.map((s, i) => (
                <div key={s.id} className="flex-1 text-center">
                  <div
                    className="w-10 h-10 rounded-full border-2 mx-auto mb-2 flex items-center justify-center text-[0.75rem] font-black bg-black"
                    style={{ borderColor: STAFF_COLORS[i % STAFF_COLORS.length] }}
                  >
                    {s.name.substring(0, 2).toUpperCase()}
                  </div>
                  <p className="text-[0.8rem] font-black uppercase tracking-tight truncate px-1">{s.name}</p>
                  <p className="text-[0.65rem] text-[#555] uppercase tracking-widest truncate px-1">{s.specialty}</p>
                </div>
              ))}
              {staff.length === 0 && (
                <div className="flex-1 flex items-center justify-center text-[#555] text-xs uppercase tracking-widest">
                  Nenhum barbeiro cadastrado
                </div>
              )}
            </div>

            {/* Grid Body */}
            <div className="flex flex-1 relative">
              {/* Time column */}
              <div className="w-16 flex-shrink-0 flex flex-col pt-2">
                {STICKY_HOURS.map((h) => (
                  <div key={h} className="h-24 text-[0.7rem] font-mono text-[#555] flex items-start pt-1">
                    {h}
                  </div>
                ))}
              </div>

              {/* Barber columns */}
              <div className="flex-1 flex gap-2">
                {staff.map((s, i) => {
                  const color = STAFF_COLORS[i % STAFF_COLORS.length];
                  const staffAppts = appointments.filter((a) => a.staffId === s.id);
                  return (
                    <div key={s.id} className="flex-1 relative" style={{ minHeight: `${11 * 96}px` }}>
                      {/* Hour lines */}
                      {STICKY_HOURS.map((_, hi) => (
                        <div
                          key={hi}
                          className="absolute left-0 right-0 border-t border-white/[0.04]"
                          style={{ top: hi * 96 }}
                        />
                      ))}

                      {staffAppts.map((appt) => {
                        const style = STATUS_STYLES[appt.status];
                        const topPx = appointmentTopPx(appt.scheduledAt);
                        const isUpdating = updatingId === appt.id;
                        return (
                          <motion.div
                            key={appt.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={cn(
                              'absolute left-0 right-1 p-2.5 rounded-lg border-y border-r border-white/10 flex flex-col justify-between group cursor-pointer shadow-lg min-h-[76px]',
                              appt.status === 'COMPLETED' && 'opacity-60',
                              isUpdating && 'opacity-50 pointer-events-none'
                            )}
                            style={{
                              top: topPx,
                              borderLeft: `3px solid ${style.border}`,
                              background: style.bg,
                            }}
                          >
                            <div className="flex justify-between items-start">
                              <div className="min-w-0 flex-1">
                                <p className="font-mono text-[0.65rem] text-[#888] mb-0.5">
                                  {new Date(appt.scheduledAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                                <p className="font-black text-[0.78rem] truncate uppercase tracking-tighter leading-tight">
                                  {appt.clientName}
                                </p>
                                <p className="text-[0.65rem] text-[#888] truncate uppercase tracking-widest leading-none">
                                  {appt.serviceName}
                                </p>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded hover:bg-white/5 outline-none focus-visible:ring-2 focus-visible:ring-amber-500 flex-shrink-0">
                                  <MoreVertical size={11} />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-[#0f0f0f] border-white/10">
                                  <DropdownMenuItem onClick={() => handleStatusChange(appt.id, 'CONFIRMED')} className="text-[10px] uppercase tracking-widest font-black text-[#00D1FF]">Confirmar</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(appt.id, 'IN_PROGRESS')} className="text-[10px] uppercase tracking-widest font-black text-amber-500">Em Atendimento</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(appt.id, 'COMPLETED')} className="text-[10px] uppercase tracking-widest font-black text-green-400">Finalizar</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleStatusChange(appt.id, 'CANCELLED')} className="text-[10px] uppercase tracking-widest font-black text-destructive">Cancelar</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            <div className="flex items-center justify-between mt-auto">
                              <div className="flex items-center gap-1">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: style.border }} />
                                <span className="text-[0.6rem] font-black tracking-widest uppercase" style={{ color: style.text }}>
                                  {style.label}
                                </span>
                              </div>
                              <button
                                className="h-5 px-2 bg-[#25D36633] text-[#25D366] text-[0.6rem] font-black rounded hover:bg-[#25D36655] transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  triggerWhatsApp(appt.clientName, appt.serviceName, appt.scheduledAt);
                                }}
                              >
                                WHATS
                              </button>
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
        )}
      </div>

      {/* WhatsApp Toast */}
      <AnimatePresence>
        {whatsappMsg && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-10 left-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-[#075E54] border border-white/10 shadow-2xl overflow-hidden rounded-2xl">
              <div className="bg-[#128C7E] px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <User size={18} className="text-white" />
                  </div>
                  <span className="text-white text-sm font-black uppercase tracking-widest truncate">
                    BarberCyber WhatsApp Agent
                  </span>
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

      <NewAppointmentModal
        open={newApptOpen}
        onClose={() => setNewApptOpen(false)}
        staff={staff}
        selectedDate={selectedDate}
        onCreated={loadData}
      />
    </div>
  );
}
