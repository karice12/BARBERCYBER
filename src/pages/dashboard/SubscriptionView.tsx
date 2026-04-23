import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Zap, 
  ShieldCheck, 
  Crown,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import StripeCheckout from '@/components/checkout/StripeCheckout';

export default function SubscriptionView() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCanceled, setShowCanceled] = useState(false);

  // Verifica query params para mensagens de sucesso/cancelamento
  useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      setShowSuccess(true);
      window.history.replaceState({}, '', window.location.pathname);
    }
    if (params.get('canceled') === 'true') {
      setShowCanceled(true);
      window.history.replaceState({}, '', window.location.pathname);
    }
  });

  const PLANS = [
    {
      id: 'cyber-essential',
      name: 'CYBER ESSENTIAL',
      price: '69,90',
      description: 'O núcleo do seu negócio digital.',
      features: ['Até 5 Funcionários', 'Agenda Inteligente', 'Finanças Básicas', 'Relatórios: 3 / mês'],
      color: 'text-cyber-blue',
      borderColor: 'border-cyber-blue/20',
      icon: <Zap size={18} className="text-cyber-blue" />
    },
    {
      id: 'addon-plus5',
      name: '+5 FUNCIONÁRIOS',
      price: '29,90',
      description: 'Aumente sua força de trabalho.',
      features: ['+5 Slots de Funcionários', 'Recurso Adicional', 'Controle Total', 'Sem taxas extras'],
      color: 'text-white',
      borderColor: 'border-white/10',
      icon: <Crown size={18} className="text-white" />
    },
    {
      id: 'cyber-enterprise',
      name: 'PLANO ENTERPRISE',
      price: '149,90',
      description: 'Potência máxima ilimitada.',
      features: ['Funcionários ILIMITADOS', 'Suporte Prioritário', 'Políticas de Agendamento'],
      color: 'text-cyber-orange',
      borderColor: 'border-cyber-orange/30',
      icon: <Zap size={18} className="text-cyber-orange" />,
      isPremium: true
    }
  ];

  const handleSubscribe = (productId: string) => {
    setSelectedProduct(productId);
  };

  const handleCheckoutClose = () => {
    setSelectedProduct(null);
  };

  const handleCheckoutSuccess = () => {
    setShowSuccess(true);
    setSelectedProduct(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Mensagem de Sucesso */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center gap-3"
        >
          <CheckCircle className="text-green-500" size={24} />
          <div>
            <p className="text-green-500 font-bold">Assinatura realizada com sucesso!</p>
            <p className="text-green-500/70 text-sm">Seus recursos já estão disponíveis.</p>
          </div>
          <button 
            onClick={() => setShowSuccess(false)}
            className="ml-auto text-green-500/50 hover:text-green-500"
          >
            <XCircle size={20} />
          </button>
        </motion.div>
      )}

      {/* Mensagem de Cancelamento */}
      {showCanceled && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-center gap-3"
        >
          <XCircle className="text-yellow-500" size={24} />
          <div>
            <p className="text-yellow-500 font-bold">Checkout cancelado</p>
            <p className="text-yellow-500/70 text-sm">Você pode tentar novamente quando quiser.</p>
          </div>
          <button 
            onClick={() => setShowCanceled(false)}
            className="ml-auto text-yellow-500/50 hover:text-yellow-500"
          >
            <XCircle size={20} />
          </button>
        </motion.div>
      )}

      <div className="text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue text-[10px] font-black uppercase tracking-[0.2em] mb-4"
        >
          <Zap size={12} /> UPGRADE DE CAPACIDADE
        </motion.div>
        <h2 className="text-4xl font-heading font-black uppercase tracking-tight mb-2">MÓDULOS DE ASSINATURA</h2>
        <p className="text-muted-foreground uppercase text-xs tracking-widest">Escolha a escala de processamento do seu BarberCyber.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan, idx) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className={cn(
              "h-full bg-[#0a0a0a] border-2 relative overflow-hidden flex flex-col group transition-all duration-500 hover:border-cyber-blue/50",
              plan.borderColor,
              plan.isPremium ? "hover:border-cyber-orange/50" : ""
            )}>
              {plan.isPremium && (
                <div className="absolute top-0 right-0">
                  <Badge className="rounded-none bg-cyber-orange text-black font-black text-[8px] tracking-widest px-3 py-1 uppercase">RECOMENDADO</Badge>
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className={cn("p-2 bg-white/5 rounded-lg", plan.color)}>
                    {plan.icon}
                  </div>
                  {plan.name === '+5 FUNCIONÁRIOS' && (
                    <Badge variant="outline" className="border-white/20 text-[8px] font-black uppercase text-white/50">EXTENSÃO</Badge>
                  )}
                </div>
                <CardTitle className={cn("font-heading font-black text-xl uppercase italic", plan.color)}>
                  {plan.name}
                </CardTitle>
                <CardDescription className="text-[10px] uppercase font-bold tracking-widest text-[#888888] pt-1">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="flex-1 space-y-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-[10px] font-bold text-[#888888] uppercase">R$</span>
                  <span className="text-4xl font-black tracking-tighter text-white">{plan.price.split(',')[0]}</span>
                  <span className="text-xl font-black text-[#555555]">,{plan.price.split(',')[1]}</span>
                  <span className="text-[10px] text-[#888888] font-bold uppercase ml-1">/mês</span>
                </div>

                <div className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={cn("w-1.5 h-1.5 rounded-full", plan.isPremium ? "bg-cyber-orange" : "bg-cyber-blue")} />
                      <span className="text-[10px] font-black uppercase tracking-wide text-[#aaaaaa]">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {plan.name === '+5 FUNCIONÁRIOS' && (
                  <p className="text-[9px] text-cyber-blue font-bold uppercase leading-tight mt-4 italic">
                    * Requer plano Essencial ativo. Cancele este módulo quando desejar.
                  </p>
                )}
              </CardContent>

              <CardFooter className="pt-4 border-t border-white/5">
                <Button 
                  onClick={() => handleSubscribe(plan.id)}
                  className={cn(
                    "w-full font-black uppercase tracking-widest text-[11px] h-11 rounded-none transition-all duration-300",
                    plan.isPremium 
                      ? "bg-cyber-orange text-black hover:bg-white" 
                      : "bg-white text-black hover:bg-cyber-blue"
                  )}
                >
                  FAZER UPGRADE <Zap size={14} className="ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Dynamic Billing Disclaimer */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="bg-white/[0.02] border border-white/5 p-6 rounded-lg text-center"
      >
        <p className="text-[10px] uppercase font-black tracking-[0.2em] text-[#888888] mb-2">Regras de Faturamento Combinado</p>
        <p className="text-xs font-bold text-[#aaaaaa] max-w-2xl mx-auto leading-relaxed">
          Ao contratar o <span className="text-cyber-blue">CYBER ESSENTIAL (R$ 69,90)</span> + o módulo <span className="text-white">ADDON +5 (R$ 29,90)</span>, seu faturamento mensal será consolidado em <span className="text-white underline">R$ 98,80</span>. 
          O cancelamento da extensão de funcionários pode ser feito a <span className="text-cyber-orange italic">qualquer momento</span> de forma independente.
        </p>
      </motion.div>

      {/* Security notice */}
      <div className="flex flex-col items-center gap-4 py-10 border-t border-white/5">
        <div className="flex items-center gap-4 text-[#555555] group hover:text-white transition-colors">
          <ShieldCheck size={20} />
          <span className="text-[10px] uppercase font-bold tracking-[0.3em]">Ambiente criptografado - Stripe Secure Gateway</span>
        </div>
        <p className="text-[8px] text-[#666666] text-center max-w-sm uppercase tracking-[0.2em] font-bold leading-relaxed">
          Sua transação é processada em infraestrutura de nível bancário. 
          A ativação dos recursos é imediata após a compensação.
        </p>
      </div>

      {/* Stripe Checkout Modal */}
      {selectedProduct && (
        <StripeCheckout
          productId={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={handleCheckoutClose}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </div>
  );
}
