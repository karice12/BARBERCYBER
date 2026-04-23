import { useState } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import {
  UserPlus,
  MoreHorizontal,
  DollarSign,
  Star,
  Award,
  Loader2,
  AlertTriangle,
  Check,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { useStaff } from '@/hooks/useData';
import { createStaffMember, updateStaffMember, deleteStaffMember } from '@/lib/api';

const STAFF_COLORS = ['#00D1FF', '#FF8A00', '#00FF85', '#FF00FF', '#7000FF', '#FFD700'];

export default function TeamView() {
  const { staff, isLoading, error, mutate } = useStaff();

  const [addOpen, setAddOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    specialty: '',
    commissionRate: '40',
    isAvailable: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setIsSubmitting(true);
    try {
      await createStaffMember({
        name: form.name,
        specialty: form.specialty,
        commissionRate: parseFloat(form.commissionRate) / 100,
        isAvailable: form.isAvailable,
      });
      mutate();
      setAddOpen(false);
      setForm({ name: '', specialty: '', commissionRate: '40', isAvailable: true });
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Erro ao criar profissional.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleAvailability = async (id: string, current: boolean) => {
    await updateStaffMember(id, { isAvailable: !current });
    mutate();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este profissional?')) return;
    await deleteStaffMember(id);
    mutate();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-sans font-black uppercase tracking-tight">EQUIPE DE ELITE</h2>
          <p className="text-muted-foreground uppercase text-xs tracking-widest mt-1">
            Gerencie seus profissionais e comissões.
          </p>
        </div>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger render={
            <Button className="bg-cyber-blue text-black font-black uppercase tracking-tighter h-10 px-6 rounded-none hover:shadow-[0_0_20px_rgba(0,209,255,0.4)] transition-all">
              <UserPlus size={16} className="mr-2" /> RECRUTAR
            </Button>
          } />
          <DialogContent className="bg-[#0f0f0f] border-cyber-blue/20 text-white max-w-md rounded-2xl p-0 overflow-hidden">
            <div className="bg-gradient-to-r from-cyber-blue/20 to-transparent p-6 border-b border-white/5">
              <DialogTitle className="font-sans font-black text-2xl uppercase tracking-tighter">NOVO PROFISSIONAL</DialogTitle>
              <DialogDescription className="text-[10px] uppercase tracking-widest text-cyber-blue mt-1">Recrutando novo operador</DialogDescription>
            </div>

            <form onSubmit={handleAdd}>
              <div className="p-6 space-y-4">
                {formError && (
                  <p className="text-red-400 text-xs p-3 bg-red-500/10 border border-red-500/20 rounded-lg">{formError}</p>
                )}

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-[#888888]">Nome</Label>
                  <Input name="name" value={form.name} onChange={handleChange} placeholder="Nome do barbeiro" className="bg-white/[0.03] border-white/10 rounded-lg focus:border-cyber-blue" required />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-[#888888]">Especialidade</Label>
                  <Input name="specialty" value={form.specialty} onChange={handleChange} placeholder="Fade & Beard" className="bg-white/[0.03] border-white/10 rounded-lg focus:border-cyber-blue" required />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black tracking-widest text-[#888888]">Comissão (%)</Label>
                  <Input name="commissionRate" value={form.commissionRate} onChange={handleChange} type="number" min="0" max="100" className="bg-white/[0.03] border-white/10 rounded-lg focus:border-cyber-blue" required />
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    className={cn(
                      'w-10 h-5 rounded-full relative transition-colors',
                      form.isAvailable ? 'bg-cyber-blue' : 'bg-white/10'
                    )}
                    onClick={() => setForm(prev => ({ ...prev, isAvailable: !prev.isAvailable }))}
                  >
                    <div className={cn(
                      'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all',
                      form.isAvailable ? 'left-5' : 'left-0.5'
                    )} />
                  </div>
                  <span className="text-[10px] uppercase font-black tracking-widest text-[#888888]">
                    {form.isAvailable ? 'Disponível' : 'Indisponível'}
                  </span>
                </label>
              </div>

              <DialogFooter className="p-6 border-t border-white/5 bg-[#0a0a0a]">
                <Button type="submit" disabled={isSubmitting} className="w-full bg-cyber-blue text-black font-black uppercase tracking-tighter h-12 disabled:opacity-50">
                  {isSubmitting ? 'REGISTRANDO...' : 'CONFIRMAR RECRUTAMENTO'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader2 className="text-cyber-blue animate-spin" size={32} />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <AlertTriangle size={16} className="text-red-400" />
          <p className="text-red-400 text-sm">Erro ao carregar equipe. Verifique a conexão com o backend.</p>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && staff.length === 0 && (
        <div className="text-center py-20 opacity-30">
          <p className="text-6xl font-black uppercase tracking-tighter mb-2">VAZIO</p>
          <p className="text-sm uppercase tracking-widest">Nenhum profissional cadastrado. Clique em RECRUTAR.</p>
        </div>
      )}

      {/* Grid */}
      {!isLoading && staff.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map((member, index) => {
            const color = STAFF_COLORS[index % STAFF_COLORS.length];
            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07 }}
                className="group relative"
              >
                <div className="absolute -inset-0.5 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-700"
                  style={{ background: `linear-gradient(135deg, ${color}33, transparent)` }}
                />
                <div className="relative bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="relative">
                      <Avatar className="w-16 h-16 border-2 p-1 bg-black" style={{ borderColor: color }}>
                        <AvatarFallback className="bg-black text-white font-bold">
                          {member.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        'absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#0a0a0a]',
                        member.isAvailable ? 'bg-green-500' : 'bg-zinc-700'
                      )} />
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-2 text-muted-foreground hover:text-white transition-colors outline-none">
                        <MoreHorizontal size={20} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#0f0f0f] border-white/10">
                        <DropdownMenuItem
                          onClick={() => toggleAvailability(member.id, member.isAvailable)}
                          className="text-[10px] uppercase font-black tracking-widest"
                        >
                          {member.isAvailable ? (
                            <><X size={12} className="mr-2 text-red-400" /> Marcar Indisponível</>
                          ) : (
                            <><Check size={12} className="mr-2 text-green-400" /> Marcar Disponível</>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(member.id)}
                          className="text-[10px] uppercase font-black tracking-widest text-destructive"
                        >
                          Remover
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold uppercase tracking-tight mb-1">{member.name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4" style={{ color }}>
                      {member.specialty}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                          <DollarSign size={12} />
                          <span className="text-[8px] uppercase font-black tracking-widest">Comissão</span>
                        </div>
                        <p className="text-sm font-bold text-white">
                          {(member.commissionRate * 100).toFixed(0)}%
                        </p>
                      </div>
                      <div className="bg-white/[0.03] border border-white/5 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                          <Star size={12} />
                          <span className="text-[8px] uppercase font-black tracking-widest">Status</span>
                        </div>
                        <p className={cn(
                          'text-sm font-bold',
                          member.isAvailable ? 'text-green-400' : 'text-zinc-500'
                        )}>
                          {member.isAvailable ? 'Online' : 'Off'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <Badge variant="outline" className="bg-white/5 border-white/10 text-[8px] font-black uppercase tracking-widest rounded-none">
                      <Award size={10} className="mr-1 text-cyber-orange" /> PROFISSIONAL
                    </Badge>
                    <div className="ml-auto w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]" style={{ backgroundColor: color }} />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
