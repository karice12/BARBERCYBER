import { motion } from 'motion/react';
import { 
  CreditCard, 
  Zap, 
  ShieldCheck, 
  ExternalLink,
  Crown,
  Check
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function SubscriptionView() {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue text-[10px] font-black uppercase tracking-[0.2em] mb-4"
        >
          <Crown size={12} /> STATUS: PLANO ATIVO
        </motion.div>
        <h2 className="text-4xl font-heading font-black uppercase tracking-tight mb-2">GESTÃO DE ASSINATURA SAAS</h2>
        <p className="text-muted-foreground uppercase text-xs tracking-widest">Controle seus recursos e pagamentos via Stripe.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Current Plan Card */}
        <Card className="bg-white/[0.03] border-white/10 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-cyber-blue/5 to-transparent pointer-events-none" />
          <CardHeader>
            <CardTitle className="font-heading font-black text-2xl uppercase italic text-cyber-blue">CYBER ESSENTIAL</CardTitle>
            <CardDescription className="text-xs uppercase tracking-widest font-bold">Assinatura Mensal Ativa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-end border-b border-white/5 pb-2">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Valor Mensal</span>
                <span className="text-xl font-black">R$ 149,00</span>
              </div>
              <div className="flex justify-between items-end border-b border-white/5 pb-2">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Próximo Vencimento</span>
                <span className="text-xs font-black uppercase">12 de Maio, 2026</span>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Uso de Recursos</p>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter">
                  <span>Profissionais ativos</span>
                  <span>5/5</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-cyber-blue w-full shadow-[0_0_10px_rgba(0,229,255,0.5)]" />
                </div>
                <p className="text-[8px] text-cyber-orange uppercase font-black italic">Você atingiu o limite do seu plano.</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-white text-black font-black uppercase tracking-tighter h-12 hover:bg-cyber-blue transition-colors rounded-none">
              GERENCIAR NO STRIPE <ExternalLink size={14} className="ml-2" />
            </Button>
          </CardFooter>
        </Card>

        {/* Upgrade Card */}
        <Card className="bg-black border-2 border-dashed border-white/10 relative group hover:border-cyber-orange transition-colors">
          <CardHeader>
            <CardTitle className="font-heading font-black text-2xl uppercase italic text-muted-foreground group-hover:text-cyber-orange transition-colors">PLANO ENTERPRISE</CardTitle>
            <CardDescription className="text-xs uppercase tracking-widest font-bold">Expanda suas fronteiras</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-4">
              {[
                "Profissionais Ilimitados",
                "Gestão de Franquias",
                "Relatórios Customizados IA",
                "Domínio Próprio de Agendamento",
                "Suporte 24h Prioritário",
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-cyber-orange/20 flex items-center justify-center">
                    <Check size={12} className="text-cyber-orange" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
            
            <div className="pt-4">
              <span className="text-3xl font-black">R$ 399</span>
              <span className="text-xs text-muted-foreground uppercase ml-2">/mês</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full border-white/10 text-muted-foreground font-black uppercase tracking-tighter h-12 hover:bg-cyber-orange hover:text-black hover:border-cyber-orange transition-all rounded-none">
              FAZER UPGRADE <Zap size={14} className="ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Security notice */}
      <div className="flex items-center justify-center gap-4 py-6 border-t border-white/5 opacity-50">
        <ShieldCheck size={20} />
        <span className="text-[10px] uppercase font-bold tracking-[0.3em]">Ambiente criptografado e operado por Stripe Secure Gateway</span>
      </div>
    </div>
  );
}
