import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Scissors, Calendar, MessageSquare, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import StripeCheckout from '@/components/checkout/StripeCheckout';

export default function LandingPage() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const handleSubscribe = (productId: string) => {
    setSelectedProduct(productId);
  };

  const handleCheckoutClose = () => {
    setSelectedProduct(null);
  };

  const handleCheckoutSuccess = () => {
    setSelectedProduct(null);
    // Redireciona para o dashboard após sucesso
    window.location.href = '/dashboard?welcome=true';
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Header/Nav */}
      <nav className="fixed top-0 w-full z-50 glass px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-cyber-blue rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.5)]">
            <Scissors className="text-background" size={24} />
          </div>
          <span className="font-heading text-xl font-bold tracking-tighter text-white">BARBERCYBER <span className="text-cyber-blue">PRO</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest text-muted-foreground">
          <a href="#features" className="hover:text-cyber-blue transition-colors">Funcionalidades</a>
          <a href="#pricing" className="hover:text-cyber-blue transition-colors">Preços</a>
          <a href="#about" className="hover:text-cyber-blue transition-colors">Sobre</a>
        </div>
        <div className="flex gap-4">
          <Link to="/login">
            <Button variant="ghost" className="text-white hover:bg-white/5 font-bold tracking-widest text-[10px] h-10 px-6 uppercase border border-white/10">
              LOGIN
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button className="bg-cyber-blue text-background font-bold hover:bg-cyber-blue/90 h-10 px-8 transition-all shadow-[0_0_10px_rgba(0,229,255,0.2)]">
              ENTRAR
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block px-4 py-1.5 rounded-full border border-cyber-blue/20 bg-cyber-blue/5 text-cyber-blue text-[0.7rem] font-bold tracking-[0.2em] mb-8 uppercase"
        >
          O Próximo Nível da Gestão
        </motion.div>
        
        <motion.h1 
          className="text-6xl md:text-8xl font-sans font-black tracking-tighter mb-8 leading-[0.9] uppercase"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          BARBEARIA<br /> DO <span className="text-cyber-blue">FUTURO</span>
        </motion.h1>

        <motion.p 
          className="text-lg md:text-xl text-[#888888] max-w-2xl mb-12 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Agenda multi-profissional, lembretes inteligentes via WhatsApp e gestão financeira em tempo real. Uma estação de comando completa para sua barbearia.
        </motion.p>

        <motion.div 
          className="flex flex-col sm:flex-row gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Button 
            size="lg" 
            onClick={() => handleSubscribe('cyber-essential')}
            className="bg-cyber-blue text-[#050505] font-black text-lg px-12 py-7 rounded-xl hover:bg-cyber-blue/90 transition-all shadow-[0_0_20px_rgba(0,209,255,0.3)] active:scale-95"
          >
            ASSINAR AGORA
          </Button>
          <Button variant="outline" size="lg" className="text-lg px-12 py-7 rounded-xl border-cyber-blue/15 hover:bg-white/5 transition-all text-[#888888] hover:text-white">
            VER DEMO
          </Button>
        </motion.div>

        {/* High Density Grid Background Decor */}
        <div className="absolute inset-0 -z-20 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#00D1FF 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              icon: <Calendar className="text-cyber-blue" size={32} />,
              title: "AGENDA INTELIGENTE",
              desc: "Visão densa e organizada de todos os profissionais. Gestão de status e horários em segundos."
            },
            {
              icon: <MessageSquare className="text-cyber-orange" size={32} />,
              title: "LEMBRETES WHATS",
              desc: "Reduza o no-show enviando convites e lembretes direto para o celular do cliente com IA."
            },
            {
              icon: <TrendingUp className="text-cyber-blue" size={32} />,
              title: "CONTROLE FINANCEIRO",
              desc: "Comissões automáticas e fechamento de caixa simplificado. Saiba seu lucro real todo dia."
            }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5, borderColor: 'rgba(0, 209, 255, 0.3)' }}
              className="p-10 rounded-2xl border border-cyber-blue/10 bg-white/[0.02] backdrop-blur-sm transition-all"
            >
              <div className="mb-8">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-4 tracking-tight uppercase">{feature.title}</h3>
              <p className="text-[#888888] leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6 bg-white/[0.01] border-y border-cyber-blue/10">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-sans font-black mb-6 uppercase tracking-tight">ESCOLHA SEU PLANO</h2>
          <p className="text-[#888888] mb-16 text-lg">Escalabilidade total para barbearias de qualquer tamanho.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Essential Plan */}
            <div className="p-10 rounded-[2rem] border border-cyber-blue/20 bg-[#0f0f0f] relative flex flex-col items-center">
              <div className="text-5xl font-sans font-black mb-4 tracking-tighter text-white">R$ 69<span className="text-xl text-[#888888] font-medium">,90/mês</span></div>
              <p className="text-cyber-blue font-bold tracking-[0.2em] mb-8 uppercase text-xs">CYBER ESSENTIAL</p>
              <ul className="text-left space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3 text-white/80 text-xs font-medium"><ShieldCheck className="text-cyber-blue" size={18} /> Até 5 Funcionários</li>
                <li className="flex items-center gap-3 text-white/80 text-xs font-medium"><ShieldCheck className="text-cyber-blue" size={18} /> Agenda Inteligente</li>
                <li className="flex items-center gap-3 text-white/80 text-xs font-medium"><ShieldCheck className="text-cyber-blue" size={18} /> Finanças Básicas</li>
                <li className="flex items-center gap-3 text-white/80 text-xs font-medium"><ShieldCheck className="text-cyber-blue" size={18} /> Relatórios: 3 / mês</li>
              </ul>
              <Button 
                onClick={() => handleSubscribe('cyber-essential')}
                className="w-full bg-white text-black font-black h-12 rounded-xl text-sm hover:bg-cyber-blue transition-colors"
              >
                ASSINAR AGORA
              </Button>
            </div>

            {/* Extension Plan */}
            <div className="p-10 rounded-[2rem] border border-white/10 bg-[#0f0f0f] relative flex flex-col items-center">
              <div className="text-5xl font-sans font-black mb-4 tracking-tighter text-white">R$ 29<span className="text-xl text-[#888888] font-medium">,90/mês</span></div>
              <p className="text-white/50 font-bold tracking-[0.2em] mb-8 uppercase text-xs">+5 FUNCIONÁRIOS</p>
              <ul className="text-left space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3 text-white/80 text-xs font-medium"><ShieldCheck className="text-white/40" size={18} /> +5 Slots de Funcionários</li>
                <li className="flex items-center gap-3 text-white/80 text-xs font-medium"><ShieldCheck className="text-white/40" size={18} /> Recurso Adicional</li>
                <li className="flex items-center gap-3 text-white/80 text-xs font-medium"><ShieldCheck className="text-white/40" size={18} /> Controle Total</li>
                <li className="flex items-center gap-3 text-white/80 text-xs font-medium"><ShieldCheck className="text-white/40" size={18} /> Sem taxas extras</li>
              </ul>
              <Button 
                onClick={() => handleSubscribe('addon-plus5')}
                className="w-full border border-white/20 text-white font-black h-12 rounded-xl text-sm hover:bg-white hover:text-black transition-all"
              >
                CONTRATAR ADICIONAL
              </Button>
            </div>

            {/* Enterprise Plan */}
            <div className="p-10 rounded-[2rem] border-2 border-cyber-orange bg-[#0f0f0f] relative flex flex-col items-center shadow-[0_0_40px_rgba(255,153,0,0.1)]">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-cyber-orange px-6 py-1.5 rounded-full text-black text-[0.6rem] font-black tracking-widest uppercase">
                RECOMENDADO
              </div>
              <div className="text-5xl font-sans font-black mb-4 tracking-tighter text-white">R$ 149<span className="text-xl text-[#888888] font-medium">,90/mês</span></div>
              <p className="text-cyber-orange font-bold tracking-[0.2em] mb-8 uppercase text-xs">PLANO ENTERPRISE</p>
              <ul className="text-left space-y-4 mb-10 flex-1">
                <li className="flex items-center gap-3 text-white/80 text-xs font-medium"><ShieldCheck className="text-cyber-orange" size={18} /> Funcionários ILIMITADOS</li>
                <li className="flex items-center gap-3 text-white/80 text-xs font-medium"><ShieldCheck className="text-cyber-orange" size={18} /> Suporte Prioritário</li>
                <li className="flex items-center gap-3 text-white/80 text-xs font-medium"><ShieldCheck className="text-cyber-orange" size={18} /> Políticas de Agendamento</li>
                <li className="flex items-center gap-3 text-white/80 text-xs font-medium"><ShieldCheck className="text-cyber-orange" size={18} /> Relatórios Ilimitados</li>
              </ul>
              <Button 
                onClick={() => handleSubscribe('cyber-enterprise')}
                className="w-full bg-cyber-orange text-black font-black h-12 rounded-xl text-sm hover:bg-white transition-colors"
              >
                UPGRADE TOTAL
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 max-w-7xl mx-auto opacity-50 text-sm flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <Scissors size={20} />
          <span className="font-heading font-bold tracking-tighter uppercase">BARBERCYBER PRO © 2026</span>
        </div>
        <div className="flex gap-8 uppercase tracking-widest font-medium">
          <a href="#" className="hover:text-cyber-blue transition-colors">Termos</a>
          <a href="#" className="hover:text-cyber-blue transition-colors">Privacidade</a>
          <a href="#" className="hover:text-cyber-blue transition-colors">Suporte</a>
        </div>
      </footer>

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
