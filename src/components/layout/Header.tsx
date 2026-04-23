import { useState } from 'react';
import { Bell, Search, Plus, Calendar as CalendarIcon, Clock, User, Scissors, Phone, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { useStaff } from '@/hooks/useData';
import { createAppointment } from '@/lib/api';

export function Header({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { staff } = useStaff();

  const [form, setForm] = useState({
    clientName: '',
    clientPhone: '',
    serviceName: '',
    price: '',
    date: '',
    time: '',
    staffId: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.staffId) { setError('Selecione um profissional.'); return; }
    if (!form.date || !form.time) { setError('Informe data e horário.'); return; }

    setIsSubmitting(true);
    try {
      const scheduledAt = new Date(`${form.date}T${form.time}:00`).toISOString();
      await createAppointment({
        clientName: form.clientName,
        clientPhone: form.clientPhone,
        serviceName: form.serviceName,
        price: parseFloat(form.price),
        scheduledAt,
        staffId: form.staffId,
      });
      setOpen(false);
      setForm({ clientName: '', clientPhone: '', serviceName: '', price: '', date: '', time: '', staffId: '' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao criar agendamento.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-[#888888] relative hover:bg-white/5">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-cyber-orange rounded-full shadow-[0_0_10px_rgba(255,138,0,0.5)]" />
          </Button>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={
              <Button className="bg-cyber-blue text-[#050505] font-black uppercase tracking-tighter shadow-[0_0_15px_rgba(0,209,255,0.2)] hover:bg-cyber-blue/90 h-10 px-6 rounded-lg transition-all active:scale-95 group">
                <Plus size={18} className="mr-2 group-hover:rotate-90 transition-transform" /> NOVO
              </Button>
            } />
            <DialogContent className="bg-[#0f0f0f] border-cyber-blue/20 text-white max-w-md p-0 overflow-hidden rounded-2xl">
              <div className="bg-gradient-to-r from-cyber-blue/20 to-transparent p-6 border-b border-white/5">
                <DialogTitle className="font-sans font-black text-2xl uppercase tracking-tighter mb-1">
                  NOVO AGENDAMENTO
                </DialogTitle>
                <DialogDescription className="text-[10px] uppercase tracking-[0.2em] font-bold text-cyber-blue">
                  Injetando dados no sistema central
                </DialogDescription>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                  {error && (
                    <p className="text-red-400 text-xs p-3 bg-red-500/10 border border-red-500/20 rounded-lg">{error}</p>
                  )}

                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-[#888888]">Nome do Cliente</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" size={14} />
                      <Input name="clientName" value={form.clientName} onChange={handleChange} placeholder="Nome completo" className="pl-10 bg-white/[0.03] border-white/10 rounded-lg focus:border-cyber-blue" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-[#888888]">Telefone</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" size={14} />
                      <Input name="clientPhone" value={form.clientPhone} onChange={handleChange} placeholder="(11) 99999-9999" className="pl-10 bg-white/[0.03] border-white/10 rounded-lg focus:border-cyber-blue" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-[#888888]">Serviço</Label>
                      <div className="relative">
                        <Scissors className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" size={14} />
                        <Input name="serviceName" value={form.serviceName} onChange={handleChange} placeholder="Degradê" className="pl-10 bg-white/[0.03] border-white/10 rounded-lg focus:border-cyber-blue" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-[#888888]">Valor (R$)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" size={14} />
                        <Input name="price" value={form.price} onChange={handleChange} type="number" min="0" step="0.01" placeholder="60.00" className="pl-10 bg-white/[0.03] border-white/10 rounded-lg focus:border-cyber-blue" required />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-[#888888]">Data</Label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" size={14} />
                        <Input name="date" value={form.date} onChange={handleChange} type="date" className="pl-10 bg-white/[0.03] border-white/10 rounded-lg focus:border-cyber-blue" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase font-black tracking-widest text-[#888888]">Horário</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" size={14} />
                        <Input name="time" value={form.time} onChange={handleChange} type="time" className="pl-10 bg-white/[0.03] border-white/10 rounded-lg focus:border-cyber-blue" required />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase font-black tracking-widest text-[#888888]">Profissional</Label>
                    <select
                      name="staffId"
                      value={form.staffId}
                      onChange={handleChange}
                      className="w-full h-10 px-3 bg-white/[0.03] border border-white/10 rounded-lg text-sm text-white focus:border-cyber-blue focus:outline-none"
                      required
                    >
                      <option value="" disabled className="bg-[#0f0f0f]">Selecione o barbeiro</option>
                      {staff.map(s => (
                        <option key={s.id} value={s.id} className="bg-[#0f0f0f]">{s.name} — {s.specialty}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <DialogFooter className="p-6 bg-[#0a0a0a] border-t border-white/5">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-cyber-blue text-black font-black uppercase tracking-tighter h-12 hover:shadow-[0_0_20px_rgba(0,209,255,0.4)] transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? 'REGISTRANDO...' : 'CONFIRMAR REGISTRO'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </header>
  );
}
