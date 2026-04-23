import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate, Link } from 'react-router-dom';
import { Scissors, Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { signUp, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validações
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      const { error: authError } = await signUp(email, password, name);

      if (authError) {
        if (authError.message.includes('already registered')) {
          setError('Este e-mail já está cadastrado.');
        } else if (authError.message.includes('invalid')) {
          setError('E-mail inválido.');
        } else {
          setError(authError.message);
        }
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setIsLoading(false);
    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyber-blue/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/10 rounded-full blur-[120px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10 text-center"
        >
          <div className="bg-[#0a0a0a] border border-green-500/20 p-8 rounded-3xl">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-500" size={32} />
            </div>
            
            <h1 className="text-2xl font-heading font-black uppercase tracking-tight mb-4">Conta Criada!</h1>
            <p className="text-[#888888] text-sm mb-6 leading-relaxed">
              Enviamos um e-mail de confirmação para <span className="text-white font-bold">{email}</span>. 
              Por favor, verifique sua caixa de entrada e confirme seu e-mail para ativar sua conta.
            </p>

            <Link to="/login">
              <Button className="w-full bg-cyber-blue text-black font-black uppercase tracking-tighter h-12 rounded-xl hover:shadow-[0_0_20px_rgba(0,209,255,0.4)] transition-all">
                <LogIn size={18} className="mr-2" /> Ir para Login
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

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
          <h1 className="text-xl font-heading font-black uppercase tracking-widest text-[#888888]">Criar Conta</h1>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-3xl relative">
          <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-cyber-orange to-transparent" />
          
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

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-[#888888]">Nome Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" size={16} />
                <Input 
                  type="text" 
                  placeholder="Seu nome" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-12 bg-white/[0.03] border-white/10 rounded-xl focus:border-cyber-blue focus:bg-white/[0.05] transition-all"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

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
              <Label className="text-[10px] uppercase font-black tracking-widest text-[#888888]">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" size={16} />
                <Input 
                  type="password" 
                  placeholder="Mínimo 6 caracteres" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 bg-white/[0.03] border-white/10 rounded-xl focus:border-cyber-blue focus:bg-white/[0.05] transition-all"
                  required
                  minLength={6}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-[#888888]">Confirmar Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" size={16} />
                <Input 
                  type="password" 
                  placeholder="Repita a senha" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
              className="w-full bg-cyber-orange text-black font-black uppercase tracking-tighter h-12 rounded-xl hover:shadow-[0_0_20px_rgba(255,138,0,0.4)] transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  CRIANDO CONTA...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  CRIAR CONTA <ArrowRight size={18} />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[10px] uppercase font-bold text-[#666]">Já tem uma conta?</p>
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 mt-3 text-cyber-blue text-sm font-bold uppercase tracking-wider hover:underline"
            >
              <LogIn size={16} /> Fazer Login
            </Link>
          </div>
        </div>

        <p className="text-center mt-8 text-[10px] uppercase font-black tracking-[0.3em] text-[#333]">© 2026 BARBERCYBER PRO // ALPHA BUILD</p>
      </motion.div>
    </div>
  );
}
