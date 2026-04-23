import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Scissors, Lock, Mail, User, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setIsLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyber-blue/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyber-orange/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-cyber-blue/20 flex items-center justify-center p-2 group-hover:border-cyber-blue transition-all">
              <Scissors className="text-cyber-blue" size={32} />
            </div>
            <span className="font-sans font-black text-3xl tracking-tighter uppercase italic">
              BARBER<span className="text-cyber-blue">CYBER</span>
            </span>
          </div>
          <h1 className="text-xl font-heading font-black uppercase tracking-widest text-[#888888]">
            Criar Nova Conta
          </h1>
        </div>

        <div className="bg-[#0a0a0a] border border-white/5 p-8 rounded-3xl relative">
          <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-32 h-[1px] bg-gradient-to-r from-transparent via-cyber-orange to-transparent" />

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-[#888888]">
                Nome da Barbearia / Proprietário
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" size={16} />
                <Input
                  type="text"
                  placeholder="Barbearia do João"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-12 bg-white/[0.03] border-white/10 rounded-xl focus:border-cyber-orange focus:bg-white/[0.05] transition-all"
                  required
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-[#888888]">
                E-mail
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" size={16} />
                <Input
                  type="email"
                  placeholder="contato@barbearia.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-white/[0.03] border-white/10 rounded-xl focus:border-cyber-orange focus:bg-white/[0.05] transition-all"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-[#888888]">
                Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" size={16} />
                <Input
                  type="password"
                  placeholder="mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 bg-white/[0.03] border-white/10 rounded-xl focus:border-cyber-orange focus:bg-white/[0.05] transition-all"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-black tracking-widest text-[#888888]">
                Confirmar Senha
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" size={16} />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="pl-10 h-12 bg-white/[0.03] border-white/10 rounded-xl focus:border-cyber-orange focus:bg-white/[0.05] transition-all"
                  required
                  autoComplete="new-password"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs font-bold"
              >
                <AlertCircle size={14} className="shrink-0" />
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyber-orange text-black font-black uppercase tracking-tighter h-12 rounded-xl hover:shadow-[0_0_20px_rgba(255,138,0,0.4)] transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  INICIALIZANDO CONTA...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  INICIAR NO SISTEMA <ArrowRight size={18} />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-[10px] uppercase font-bold text-[#444]">
              Já tem acesso?{' '}
              <Link to="/login" className="text-cyber-blue hover:underline">
                Entrar
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-8 text-[10px] uppercase font-black tracking-[0.3em] text-[#333]">
          © 2026 BARBERCYBER PRO // ALPHA BUILD
        </p>
      </motion.div>
    </div>
  );
}
