import { motion } from 'motion/react';
import { 
  MessageCircle, 
  CreditCard, 
  Globe, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Lock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

export default function IntegrationsView() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-heading font-black uppercase tracking-tight">CENTRAL DE SINAPSES</h2>
          <p className="text-muted-foreground uppercase text-xs tracking-widest mt-1">Conecte o BarberCyber Pro ao mundo exterior.</p>
        </div>
        <Badge variant="outline" className="text-cyber-blue border-cyber-blue/30 text-[10px] uppercase font-black tracking-widest px-4 py-1.5 rounded-none">
          MODO OPERACIONAL: ATIVO
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* WhatsApp Card */}
        <Card className="bg-[#0a0a0a] border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <MessageCircle size={100} className="text-[#25D366]" />
          </div>
          <CardHeader>
            <div className="w-12 h-12 rounded-2xl bg-[#25D366]/10 flex items-center justify-center mb-2">
              <MessageCircle className="text-[#25D366]" size={24} />
            </div>
            <CardTitle className="font-heading font-black text-2xl uppercase">WHATSAPP CLOUD API</CardTitle>
            <CardDescription className="uppercase text-[9px] font-bold tracking-widest text-[#888888]">Lembretes Automáticos & Confirmação Real-Time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-[#25D366]/5 border border-[#25D366]/20 rounded-xl">
              <CheckCircle2 size={16} className="text-[#25D366]" />
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase text-white">Status: Conectado</p>
                <p className="text-[8px] uppercase text-[#25D366] font-bold">Instância respondendo em 140ms</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-[10px] uppercase font-black tracking-widest text-[#888888]">Configurações Rápidas</p>
              <div className="flex items-center justify-between text-[11px] font-bold py-1 border-b border-white/5">
                <span className="text-muted-foreground">Antecedência do Lembrete</span>
                <span className="text-cyber-blue">2 Horas</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-bold py-1 border-b border-white/5">
                <span className="text-muted-foreground">Template de Boas Vindas</span>
                <span className="text-cyber-blue">ON</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="gap-3">
            <Button variant="outline" className="flex-1 border-white/10 text-xs font-black uppercase tracking-tighter hover:bg-white/5 h-11 rounded-none">
              RECONFIGURAR
            </Button>
            <Button className="bg-[#25D366] text-black font-black uppercase tracking-tighter hover:bg-[#25D366]/90 flex-1 h-11 rounded-none">
              TESTAR ENVIO
            </Button>
          </CardFooter>
        </Card>

        {/* Stripe Card */}
        <Card className="bg-[#0a0a0a] border-white/5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <CreditCard size={100} className="text-[#635BFF]" />
          </div>
          <CardHeader>
            <div className="w-12 h-12 rounded-2xl bg-[#635BFF]/10 flex items-center justify-center mb-2">
              <CreditCard className="text-[#635BFF]" size={24} />
            </div>
            <CardTitle className="font-heading font-black text-2xl uppercase">STRIPE PAYMENTS</CardTitle>
            <CardDescription className="uppercase text-[9px] font-bold tracking-widest text-[#888888]">Checkout Seguro & Gestão de recorrência</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-[#635BFF]/5 border border-[#635BFF]/20 rounded-xl">
              <AlertCircle size={16} className="text-cyber-orange" />
              <div className="flex-1">
                <p className="text-[10px] font-black uppercase text-white">Status: Modo Sandbox</p>
                <p className="text-[8px] uppercase text-cyber-orange font-bold">Chave de produção não detectada</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-[10px] uppercase font-black tracking-widest text-[#888888]">Recursos Ativos</p>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={12} className="text-[#635BFF]" />
                <span className="text-[10px] font-bold uppercase text-muted-foreground">Link de Pagamento Automático</span>
              </div>
              <div className="flex items-center gap-2 opacity-30">
                <Lock size={12} className="text-muted-foreground" />
                <span className="text-[10px] font-bold uppercase text-muted-foreground">Divisão de Cashback (Indisponível)</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="gap-3">
             <Button className="bg-[#635BFF] text-white font-black uppercase tracking-tighter hover:bg-[#635BFF]/90 w-full h-11 rounded-none">
              CONECTAR CONTA PRODUCTION <ExternalLink size={14} className="ml-2" />
            </Button>
          </CardFooter>
        </Card>

        {/* Custom Domain / API Card */}
        <Card className="bg-[#0a0a0a] border-white/5 col-span-1 md:col-span-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-blue/5 to-transparent pointer-events-none" />
          <div className="flex flex-col md:flex-row p-6 items-center gap-8">
            <div className="w-16 h-16 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center shrink-0">
               <Globe className="text-cyber-blue" size={32} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-black uppercase tracking-tight mb-2">CUSTOM DOMAIN & WEBHOOKS</h3>
              <p className="text-xs text-[#888888] uppercase tracking-widest leading-relaxed">Aponte seu próprio domínio para o agendamento e receba eventos de sistema via webhooks em seu servidor próprio ou ferramentas como Make/N8N.</p>
            </div>
            <Button variant="outline" className="border-cyber-blue/30 text-cyber-blue font-black uppercase tracking-tighter h-12 px-8 hover:bg-cyber-blue/10 rounded-none shrink-0 group">
              CONFIGURAR AGORA <Zap size={14} className="ml-2 group-hover:animate-pulse" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
