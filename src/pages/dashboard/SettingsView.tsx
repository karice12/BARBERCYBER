import { useState, useEffect } from 'react';
import {
  Building2,
  Clock,
  Shield,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { authApi, BusinessHour, ApiError } from '@/lib/api';

const DAY_NAMES = ['Domingo', 'Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta', 'Sabado'];

const DEFAULT_HOURS: BusinessHour[] = DAY_NAMES.map((_, i) => ({
  dayOfWeek: i,
  openTime: '09:00',
  closeTime: '19:00',
  isOpen: i !== 0, // fechado no domingo por padrao
}));

// ── Tab Geral ─────────────────────────────────────────────────────────────────

function GeneralTab() {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    if (user) { setName(user.name); setEmail(user.email); }
  }, [user]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      setFeedback({ type: 'error', msg: 'As senhas nao conferem.' });
      return;
    }
    setSaving(true);
    setFeedback(null);
    try {
      await authApi.updateProfile({
        name: name !== user?.name ? name : undefined,
        email: email !== user?.email ? email : undefined,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });
      await refreshUser();
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setFeedback({ type: 'success', msg: 'Perfil atualizado com sucesso.' });
    } catch (err) {
      setFeedback({ type: 'error', msg: err instanceof ApiError ? err.message : 'Erro ao salvar.' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <Card className="bg-[#0a0a0a] border-white/5 rounded-none">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Building2 size={20} className="text-amber-500" />
            <CardTitle className="font-heading font-black uppercase text-xl">Perfil da Conta</CardTitle>
          </div>
          <CardDescription className="text-[10px] uppercase font-bold tracking-widest">
            Dados principais da sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-[#888]">Nome</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/[0.03] border-white/10 rounded-none focus:border-amber-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-[#888]">E-mail</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/[0.03] border-white/10 rounded-none focus:border-amber-500 transition-all"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#0a0a0a] border-white/5 rounded-none">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Shield size={20} className="text-amber-500" />
            <CardTitle className="font-heading font-black uppercase text-xl">Seguranca</CardTitle>
          </div>
          <CardDescription className="text-[10px] uppercase font-bold tracking-widest">
            Atualize sua senha. Deixe em branco para manter a atual.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase font-black tracking-widest text-[#888]">
              Senha Atual
            </Label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-white/[0.03] border-white/10 rounded-none focus:border-amber-500 transition-all"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-[#888]">
                Nova Senha
              </Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white/[0.03] border-white/10 rounded-none focus:border-amber-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-[#888]">
                Confirmar Nova Senha
              </Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-white/[0.03] border-white/10 rounded-none focus:border-amber-500 transition-all"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {feedback && (
        <div
          className={cn(
            'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold',
            feedback.type === 'success'
              ? 'bg-green-500/10 border border-green-500/30 text-green-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          )}
        >
          {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {feedback.msg}
        </div>
      )}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={saving}
          className="bg-white text-black font-black uppercase tracking-tighter h-10 px-8 rounded-none hover:bg-amber-500 transition-colors"
        >
          {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
          SALVAR ALTERACOES
        </Button>
      </div>
    </form>
  );
}

// ── Tab Horários ──────────────────────────────────────────────────────────────

function HoursTab() {
  const [hours, setHours] = useState<BusinessHour[]>(DEFAULT_HOURS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    authApi.getBusinessHours().then((data) => {
      if (data && data.length > 0) {
        // Preenche os 7 dias mesclando com os valores da API
        const merged = DEFAULT_HOURS.map((def) => {
          const saved = data.find((d) => d.dayOfWeek === def.dayOfWeek);
          return saved ? { ...saved } : def;
        });
        setHours(merged);
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  function updateHour(day: number, field: keyof BusinessHour, value: string | boolean) {
    setHours((prev) =>
      prev.map((h) => (h.dayOfWeek === day ? { ...h, [field]: value } : h))
    );
  }

  async function handleSave() {
    setSaving(true);
    setFeedback(null);
    try {
      await authApi.upsertBusinessHours(hours);
      setFeedback({ type: 'success', msg: 'Horarios salvos com sucesso.' });
    } catch (err) {
      setFeedback({ type: 'error', msg: err instanceof ApiError ? err.message : 'Erro ao salvar horarios.' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={28} className="animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-[#0a0a0a] border-white/5 rounded-none">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Clock size={20} className="text-amber-500" />
            <CardTitle className="font-heading font-black uppercase text-xl">Horario de Funcionamento</CardTitle>
          </div>
          <CardDescription className="text-[10px] uppercase font-bold tracking-widest">
            Configure os horarios de abertura e fechamento por dia da semana.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {hours.map((h) => (
            <div
              key={h.dayOfWeek}
              className={cn(
                'flex items-center gap-4 p-3 border transition-colors',
                h.isOpen ? 'border-white/5 bg-white/[0.02]' : 'border-white/[0.03] bg-transparent opacity-50'
              )}
            >
              {/* Toggle */}
              <button
                type="button"
                onClick={() => updateHour(h.dayOfWeek, 'isOpen', !h.isOpen)}
                className={cn(
                  'w-10 h-5 rounded-full relative transition-colors flex-shrink-0',
                  h.isOpen ? 'bg-amber-500' : 'bg-white/10'
                )}
              >
                <div
                  className={cn(
                    'absolute top-0.5 w-4 h-4 bg-black rounded-full shadow-lg transition-transform',
                    h.isOpen ? 'translate-x-5' : 'translate-x-0.5'
                  )}
                />
              </button>

              <span className="w-20 text-[10px] font-black uppercase tracking-widest text-[#888] flex-shrink-0">
                {DAY_NAMES[h.dayOfWeek]}
              </span>

              <div className="flex items-center gap-3 flex-1">
                <Input
                  type="time"
                  value={h.openTime}
                  disabled={!h.isOpen}
                  onChange={(e) => updateHour(h.dayOfWeek, 'openTime', e.target.value)}
                  className="bg-white/[0.03] border-white/10 rounded-none focus:border-amber-500 h-8 text-xs w-32"
                />
                <span className="text-[#555] text-xs font-bold uppercase">ate</span>
                <Input
                  type="time"
                  value={h.closeTime}
                  disabled={!h.isOpen}
                  onChange={(e) => updateHour(h.dayOfWeek, 'closeTime', e.target.value)}
                  className="bg-white/[0.03] border-white/10 rounded-none focus:border-amber-500 h-8 text-xs w-32"
                />
              </div>

              <span
                className={cn(
                  'text-[8px] font-black uppercase tracking-widest flex-shrink-0',
                  h.isOpen ? 'text-amber-500' : 'text-[#555]'
                )}
              >
                {h.isOpen ? 'ABERTO' : 'FECHADO'}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>

      {feedback && (
        <div
          className={cn(
            'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold',
            feedback.type === 'success'
              ? 'bg-green-500/10 border border-green-500/30 text-green-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          )}
        >
          {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {feedback.msg}
        </div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-white text-black font-black uppercase tracking-tighter h-10 px-8 rounded-none hover:bg-amber-500 transition-colors"
        >
          {saving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
          SALVAR HORARIOS
        </Button>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function SettingsView() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div>
        <h2 className="text-3xl font-heading font-black uppercase tracking-tight">AJUSTES DO NUCLEO</h2>
        <p className="text-muted-foreground uppercase text-xs tracking-widest mt-1">
          Configure o DNA da sua barbearia.
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-white/[0.03] border border-white/5 rounded-none p-1 mb-8">
          <TabsTrigger
            value="general"
            className="rounded-none data-[state=active]:bg-amber-500 data-[state=active]:text-black font-black uppercase text-[10px] px-6 py-2 tracking-widest"
          >
            Geral
          </TabsTrigger>
          <TabsTrigger
            value="hours"
            className="rounded-none data-[state=active]:bg-amber-500 data-[state=active]:text-black font-black uppercase text-[10px] px-6 py-2 tracking-widest"
          >
            Horarios
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralTab />
        </TabsContent>

        <TabsContent value="hours">
          <HoursTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
