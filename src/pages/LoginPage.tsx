import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Scissors, Lock, Mail, ArrowRight, AlertCircle, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error: authError } = await signIn(email, password);

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setError('E-mail ou senha incorretos.');
        } else if (authError.message.includes('Email not confirmed')) {
          setError('Por favor, confirme seu e-mail antes de fazer login.');
        } else {
          setError(authError.message);
        }
        setIsLoading(false);
        return;
      }

      // Redirecionamento é feito pelo useEffect quando isAuthenticated mudar
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyber-blue/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyber-orange/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-cyber-blue/20 flex items-center justify-center p-2 group-hover:border-cyber-blue transition-all">
              <Scissors className="text-cyber-blue" size={32} />
            </div>
            <span className="font-sans font-black text-3xl tracking-tighter uppercase italic">BARBER<span className="text-cyber-blue">CYBER</span></span>
          </Link>
          <h1 className="text-xl font-heading font-black uppercase tracking-widest text-[#888888]">Acessar Sistema</h1>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-3xl relative">
          <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-cyber-blue to-transparent" />
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
              <p className="text-red-400 text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-[#888888]">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" size={16} />
                <Input 
                  type="email" 
                  placeholder="seu@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-white/[0.03] border-white/10 rounded-xl focus:border-cyber-blue focus:bg-white/[0.05] transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-[10px] uppercase font-black tracking-widest text-[#888888]">Senha</Label>
                <span className="text-[9px] uppercase font-bold text-cyber-blue cursor-pointer hover:underline">Esqueci a Senha</span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" size={16} />
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 bg-white/[0.03] border-white/10 rounded-xl focus:border-cyber-blue focus:bg-white/[0.05] transition-all"
                  required
                  minLength={6}
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-cyber-blue text-black font-black uppercase tracking-tighter h-12 rounded-xl hover:shadow-[0_0_20px_rgba(0,209,255,0.4)] transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  AUTENTICANDO...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  ENTRAR <ArrowRight size={18} />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[10px] uppercase font-bold text-[#666]">Ainda não tem conta?</p>
            <Link 
              to="/register" 
              className="inline-flex items-center gap-2 mt-3 text-cyber-blue text-sm font-bold uppercase tracking-wider hover:underline"
            >
              <UserPlus size={16} /> Criar Conta
            </Link>
          </div>
        </div>

        <p className="text-center mt-8 text-[10px] uppercase font-black tracking-[0.3em] text-[#333]">© 2026 BARBERCYBER PRO // ALPHA BUILD</p>
      </motion.div>
    </div>
  );
}
