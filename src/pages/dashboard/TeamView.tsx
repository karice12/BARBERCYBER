import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  UserPlus,
  MoreHorizontal,
  Award,
  DollarSign,
  Star,
  Loader2,
  AlertCircle,
  RefreshCw,
  Pencil,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { staffApi, StaffMember, ApiError } from '@/lib/api';

const STAFF_COLORS = ['#00D1FF', '#FF8A00', '#00FF85', '#FF00FF', '#7000FF', '#FFD700'];

// ── Staff Form Modal ──────────────────────────────────────────────────────────

interface StaffFormProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  initial?: StaffMember | null;
}

function StaffFormModal({ open, onClose, onSaved, initial }: StaffFormProps) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    specialty: initial?.specialty ?? '',
    commissionRate: String(initial?.commissionRate ?? 40),
    isAvailable: initial?.isAvailable ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setForm({
        name: initial?.name ?? '',
        specialty: initial?.specialty ?? '',
        commissionRate: String(initial?.commissionRate ?? 40),
        isAvailable: initial?.isAvailable ?? true,
      });
      setError('');
    }
  }, [open, initial]);

  const set = (k: keyof typeof form) => (v: string | boolean) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        name: form.name,
        specialty: form.specialty,
        commissionRate: Number(form.commissionRate),
        isAvailable: form.isAvailable,
      };
      if (isEdit && initial) {
        await staffApi.update(initial.id, payload);
      } else {
        await staffApi.create(payload);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro ao salvar barbeiro.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md bg-[#0a0a0a] border-white/10 text-white rounded-2xl p-0 overflow-hidden">
        <div className="bg-amber-500 h-1 w-full" />
        <div className="p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight">
              {isEdit ? 'EDITAR BARBEIRO' : 'RECRUTAR BARBEIRO'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-[#888]">Nome</Label>
              <Input
                required
                value={form.name}
                onChange={(e) => set('name')(e.target.value)}
                placeholder="Ex: Zeca Cyber"
                className="bg-white/[0.03] border-white/10 focus:border-amber-500 rounded-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-[#888]">Especialidade</Label>
              <Input
                required
                value={form.specialty}
                onChange={(e) => set('specialty')(e.target.value)}
                placeholder="Ex: Fade & Beard"
                className="bg-white/[0.03] border-white/10 focus:border-amber-500 rounded-none"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-[#888]">
                Comissão (%)
              </Label>
              <Input
                required
                type="number"
                min="0"
                max="100"
                value={form.commissionRate}
                onChange={(e) => set('commissionRate')(e.target.value)}
                className="bg-white/[0.03] border-white/10 focus:border-amber-500 rounded-none"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/5">
              <div>
                <p className="text-[11px] font-black uppercase text-white">Disponível para agendamentos</p>
              </div>
              <button
                type="button"
                onClick={() => set('isAvailable')(!form.isAvailable)}
                className={cn(
                  'w-10 h-5 rounded-full relative transition-colors',
                  form.isAvailable ? 'bg-amber-500' : 'bg-white/10'
                )}
              >
                <div
                  className={cn(
                    'absolute top-0.5 w-4 h-4 bg-black rounded-full shadow-lg transition-transform',
                    form.isAvailable ? 'translate-x-5' : 'translate-x-0.5'
                  )}
                />
              </button>
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
                {loading ? <Loader2 size={14} className="animate-spin" /> : isEdit ? 'SALVAR' : 'RECRUTAR'}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function TeamView() {
  const [team, setTeam] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<StaffMember | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StaffMember | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadTeam = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await staffApi.list();
      setTeam(data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Erro ao carregar equipe.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadTeam(); }, [loadTeam]);

  function openEdit(s: StaffMember) {
    setEditTarget(s);
    setFormOpen(true);
  }

  function openRecruit() {
    setEditTarget(null);
    setFormOpen(true);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await staffApi.remove(deleteTarget.id);
      setTeam((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      // silencia
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-end flex-wrap gap-4">
        <div>
          <h2 className="text-3xl font-heading font-black uppercase tracking-tight">EQUIPE DE ELITE</h2>
          <p className="text-muted-foreground uppercase text-xs tracking-widest mt-1">
            Gerencie seus profissionais e comissões.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={loadTeam}
            disabled={loading}
            className="text-[#888] hover:text-white"
          >
            <RefreshCw size={16} className={cn(loading && 'animate-spin')} />
          </Button>
          <Button
            onClick={openRecruit}
            className="bg-amber-500 text-black font-black uppercase tracking-tighter h-10 px-6 rounded-none hover:bg-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all"
          >
            <UserPlus size={16} className="mr-2" /> RECRUTAR
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm font-bold">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={36} className="animate-spin text-amber-500" />
        </div>
      ) : team.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-[#555]">
          <UserPlus size={48} />
          <p className="text-sm uppercase font-black tracking-widest">Nenhum barbeiro cadastrado</p>
          <Button
            onClick={openRecruit}
            className="bg-amber-500 text-black font-black uppercase tracking-tighter h-10 px-6 rounded-none hover:bg-amber-400"
          >
            RECRUTAR PRIMEIRO BARBEIRO
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((barber, index) => {
            const color = STAFF_COLORS[index % STAFF_COLORS.length];
            return (
              <motion.div
                key={barber.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07 }}
                className="group relative"
              >
                <div
                  className="absolute -inset-0.5 rounded-2xl blur opacity-20 group-hover:opacity-60 transition duration-700"
                  style={{ background: `linear-gradient(135deg, ${color}33, transparent)` }}
                />
                <div className="relative bg-[#0a0a0a] border border-white/5 rounded-2xl p-6 h-full flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div className="relative">
                      <Avatar className="w-16 h-16 border-2 bg-black" style={{ borderColor: `${color}55` }}>
                        <AvatarFallback
                          className="font-black text-sm"
                          style={{ color, backgroundColor: `${color}15` }}
                        >
                          {barber.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={cn(
                          'absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#0a0a0a]',
                          barber.isAvailable ? 'bg-green-500' : 'bg-zinc-700'
                        )}
                      />
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger className="p-2 text-muted-foreground hover:text-white transition-colors">
                        <MoreHorizontal size={20} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#0f0f0f] border-white/10">
                        <DropdownMenuItem
                          className="text-[10px] uppercase font-black tracking-widest gap-2"
                          onClick={() => openEdit(barber)}
                        >
                          <Pencil size={12} /> Editar Perfil
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-[10px] uppercase font-black tracking-widest text-destructive gap-2"
                          onClick={() => setDeleteTarget(barber)}
                        >
                          <Trash2 size={12} /> Remover
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-bold uppercase tracking-tight mb-1">{barber.name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4" style={{ color }}>
                      {barber.specialty}
                    </p>

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
                          <span className="text-[8px] uppercase font-black tracking-widest">Status</span>
                        </div>
                        <p
                          className="text-sm font-bold"
                          style={{ color: barber.isAvailable ? '#00FF85' : '#888' }}
                        >
                          {barber.isAvailable ? 'Ativo' : 'Inativo'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center gap-2 pt-4 border-t border-white/5">
                    <Badge
                      variant="outline"
                      className="bg-white/5 border-white/10 text-[8px] font-black uppercase tracking-widest rounded-none"
                    >
                      <Award size={10} className="mr-1 text-amber-500" /> PROFISSIONAL
                    </Badge>
                    <div
                      className="ml-auto w-3 h-3 rounded-full"
                      style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}88` }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <StaffFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={loadTeam}
        initial={editTarget}
      />

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(v) => !v && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-[#0a0a0a] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-black uppercase tracking-tight">
              Remover Barbeiro?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#888] text-xs uppercase tracking-widest">
              Esta acao nao pode ser desfeita. Todos os dados de{' '}
              <span className="text-white font-bold">{deleteTarget?.name}</span> serao removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 bg-transparent text-white hover:bg-white/5 uppercase font-black tracking-widest text-[10px] rounded-none">
              CANCELAR
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={deleting}
              onClick={handleDelete}
              className="bg-red-500 text-white font-black uppercase tracking-widest text-[10px] rounded-none hover:bg-red-600"
            >
              {deleting ? <Loader2 size={14} className="animate-spin" /> : 'REMOVER'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
