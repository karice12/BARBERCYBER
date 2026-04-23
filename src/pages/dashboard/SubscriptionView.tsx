import { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, ShieldCheck, Crown, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { subscriptionApi, ApiError } from '@/lib/api';
import { useSearchParams } from 'react-router-dom';

type Plan = 'ESSENTIAL' | 'ENTERPRISE' | 'PLUS5';

interface PlanConfig {
  id: Plan;
  name: string;
  price: string;
  description: string;
  features: string[];
  color: string;
  borderColor: string;
  borderHover: string;
  icon: React.ReactNode;
  isPremium?: boolean;
  isAddon?: boolean;
  checkoutPlan?: 'ENTERPRISE' | 'PLUS5';
}

export default function SubscriptionView() {
  const { user, refreshUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState('');

  const justSuccess = searchParams.get('success') === '1';
  const justCancelled = searchParams.get('cancelled') === '1';

  const PLANS: PlanConfig[] = [
    {
      id: 'ESSENTIAL',
      name: 'CYBER ESSENTIAL',
      price: '69,90',
      description: 'O nucleo do seu negocio digital.',
      features: ['Ate 5 Funcionarios', 'Agenda Inteligente', 'Financas Basicas', 'Relatorios: 3 / mes'],
      color: 'text-[#00D1FF]',
      borderColor: 'border-[#00D1FF]/20',
      borderHover: 'hover:border-[#00D1FF]/50',
      icon: <Zap size={18} className="text-[#00D1FF]" />,
    },
    {
      id: 'PLUS5',
      name: '+5 FUNCIONARIOS',
      price: '29,90',
      description: 'Aumente sua forca de trabalho.',
      features: ['+5 Slots de Funcionarios', 'Controle Total', 'Sem taxas extras'],
      color: 'text-white',
      borderColor: 'border-white/10',
      borderHover: 'hover:border-white/30',
      icon: <Crown size={18} className="text-white" />,
      isAddon: true,
      checkoutPlan: 'PLUS5',
    },
    {
      id: 'ENTERPRISE',
      name: 'PLANO ENTERPRISE',
      price: '149,90',
      description: 'Potencia maxima ilimitada.',
      features: ['Funcionarios ILIMITADOS', 'Suporte Prioritario', 'Politicas de Agendamento'],
      color: 'text-amber-500',
      borderColor: 'border-amber-500/30',
      borderHover: 'hover:border-amber-500/60',
      icon: <Zap size={18} className="text-amber-500" />,
      isPremium: true,
      checkoutPlan: 'ENTERPRISE',
    },
  ];

  const currentPlan: Plan = user?.planType ?? 'ESSENTIAL';
  const hasAddon = user?.hasPlus5Addon ?? false;

  function isCurrentPlan(plan: PlanConfig) {
    if (plan.id === 'PLUS5') return hasAddon;
    return plan.id === currentPlan;
  }

  async function handleUpgrade(plan: PlanConfig) {
    if (!plan.checkoutPlan) return;
    setLoadingPlan(plan.id);
    setCheckoutError('');
    try {
      const { url } = await subscriptionApi.createCheckout(plan.checkoutPlan);
      if (url) window.location.href = url;
    } catch (err) {
      setCheckoutError(err instanceof ApiError ? err.message : 'Erro ao iniciar checkout.');
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Success / Cancel feedback */}
      {justSuccess && (
        <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-green-400 text-sm font-bold">
          <CheckCircle2 size={16} /> Plano ativado com sucesso. Bem-vindo ao novo nivel!
        </div>
      )}
      {justCancelled && (
        <div className="flex items-center gap-3 bg-[#888]/10 border border-[#888]/20 rounded-xl px-4 py-3 text-[#888] text-sm font-bold">
          <AlertCircle size={16} /> Checkout cancelado. Seu plano atual continua ativo.
        </div>
      )}
      {checkoutError && (
        <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm font-bold">
          <AlertCircle size={16} /> {checkoutError}
        </div>
      )}

      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4"
        >
          <Zap size={12} /> UPGRADE DE CAPACIDADE
        </motion.div>
        <h2 className="text-4xl font-heading font-black uppercase tracking-tight mb-2">
          MODULOS DE ASSINATURA
        </h2>
        <p className="text-muted-foreground uppercase text-xs tracking-widest">
          Escolha a escala de processamento do seu BarberCyber.
        </p>
        {user && (
          <p className="mt-2 text-[10px] uppercase tracking-widest font-bold">
            Plano atual:{' '}
            <span className="text-amber-500">{currentPlan}{hasAddon ? ' + ADDON +5' : ''}</span>
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan, idx) => {
          const active = isCurrentPlan(plan);
          return (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card
                className={cn(
                  'h-full bg-[#0a0a0a] border-2 relative overflow-hidden flex flex-col group transition-all duration-500',
                  plan.borderColor,
                  plan.borderHover,
                  active && 'ring-1 ring-amber-500/40'
                )}
              >
                {active && (
                  <div className="absolute top-0 right-0">
                    <Badge className="rounded-none bg-amber-500 text-black font-black text-[8px] tracking-widest px-3 py-1 uppercase">
                      PLANO ATUAL
                    </Badge>
                  </div>
                )}
                {plan.isPremium && !active && (
                  <div className="absolute top-0 right-0">
                    <Badge className="rounded-none bg-amber-500/20 text-amber-500 border border-amber-500/30 font-black text-[8px] tracking-widest px-3 py-1 uppercase">
                      RECOMENDADO
                    </Badge>
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className={cn('p-2 bg-white/5 rounded-lg', plan.color)}>
                      {plan.icon}
                    </div>
                    {plan.isAddon && (
                      <Badge variant="outline" className="border-white/20 text-[8px] font-black uppercase text-white/50">
                        EXTENSAO
                      </Badge>
                    )}
                  </div>
                  <CardTitle className={cn('font-heading font-black text-xl uppercase italic', plan.color)}>
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-[#888] pt-1">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 space-y-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[10px] font-bold text-[#888] uppercase">R$</span>
                    <span className="text-4xl font-black tracking-tighter text-white">
                      {plan.price.split(',')[0]}
                    </span>
                    <span className="text-xl font-black text-[#555]">,{plan.price.split(',')[1]}</span>
                    <span className="text-[10px] text-[#888] font-bold uppercase ml-1">/mes</span>
                  </div>

                  <div className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div
                          className={cn(
                            'w-1.5 h-1.5 rounded-full',
                            plan.isPremium ? 'bg-amber-500' : plan.id === 'ESSENTIAL' ? 'bg-[#00D1FF]' : 'bg-white'
                          )}
                        />
                        <span className="text-[10px] font-black uppercase tracking-wide text-[#aaa]">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="pt-4 border-t border-white/5">
                  {active ? (
                    <Button
                      disabled
                      className="w-full font-black uppercase tracking-widest text-[11px] h-11 rounded-none bg-white/5 text-[#888] cursor-not-allowed border border-white/10"
                    >
                      PLANO ATIVO
                    </Button>
                  ) : plan.id === 'ESSENTIAL' ? (
                    <Button
                      disabled
                      className="w-full font-black uppercase tracking-widest text-[11px] h-11 rounded-none bg-white/5 text-[#888] cursor-not-allowed border border-white/10"
                    >
                      PLANO BASE
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleUpgrade(plan)}
                      disabled={loadingPlan === plan.id}
                      className={cn(
                        'w-full font-black uppercase tracking-widest text-[11px] h-11 rounded-none transition-all duration-300',
                        plan.isPremium
                          ? 'bg-amber-500 text-black hover:bg-white'
                          : 'bg-white text-black hover:bg-amber-500'
                      )}
                    >
                      {loadingPlan === plan.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <>FAZER UPGRADE <Zap size={14} className="ml-2" /></>
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="bg-white/[0.02] border border-white/5 p-6 rounded-lg text-center"
      >
        <p className="text-[10px] uppercase font-black tracking-[0.2em] text-[#888] mb-2">
          Regras de Faturamento Combinado
        </p>
        <p className="text-xs font-bold text-[#aaa] max-w-2xl mx-auto leading-relaxed">
          Ao contratar o{' '}
          <span className="text-[#00D1FF]">CYBER ESSENTIAL (R$ 69,90)</span> + o modulo{' '}
          <span className="text-white">ADDON +5 (R$ 29,90)</span>, seu faturamento mensal sera
          consolidado em <span className="text-white underline">R$ 98,80</span>. O cancelamento da
          extensao pode ser feito a{' '}
          <span className="text-amber-500 italic">qualquer momento</span> de forma independente.
        </p>
      </motion.div>

      <div className="flex flex-col items-center gap-4 py-10 border-t border-white/5">
        <div className="flex items-center gap-4 text-[#555] hover:text-white transition-colors">
          <ShieldCheck size={20} />
          <span className="text-[10px] uppercase font-bold tracking-[0.3em]">
            Ambiente criptografado — Stripe Secure Gateway
          </span>
        </div>
        <p className="text-[8px] text-[#666] text-center max-w-sm uppercase tracking-[0.2em] font-bold leading-relaxed">
          Sua transacao e processada em infraestrutura de nivel bancario. A ativacao dos recursos e
          imediata apos a compensacao.
        </p>
      </div>
    </div>
  );
}
