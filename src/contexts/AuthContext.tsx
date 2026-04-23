import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type PlanType = 'ESSENTIAL' | 'ENTERPRISE';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  planType: PlanType;
  hasPlus5Addon: boolean;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  createdAt: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const TOKEN_KEY = 'barbercyber_token';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem(TOKEN_KEY),
    isLoading: true,
  });

  const setToken = useCallback((token: string | null) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    setState((prev) => ({ ...prev, token }));
  }, []);

  // Busca o perfil do usuário usando o token armazenado
  const fetchProfile = useCallback(async (token: string): Promise<AuthUser | null> => {
    try {
      const res = await fetch('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }, []);

  // Inicializa: se há token salvo, valida e carrega o perfil
  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) {
      setState((prev) => ({ ...prev, isLoading: false }));
      return;
    }
    fetchProfile(stored).then((user) => {
      if (user) {
        setState({ user, token: stored, isLoading: false });
      } else {
        localStorage.removeItem(TOKEN_KEY);
        setState({ user: null, token: null, isLoading: false });
      }
    });
  }, [fetchProfile]);

  // Reage a tokens expirados/inválidos detectados pelo cliente HTTP
  useEffect(() => {
    const handleForceLogout = () => {
      setState({ user: null, token: null, isLoading: false });
    };
    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Credenciais inválidas.');
    }

    const { token } = await res.json();
    setToken(token);

    const user = await fetchProfile(token);
    if (!user) throw new Error('Falha ao carregar perfil após login.');

    setState({ user, token, isLoading: false });
  }, [setToken, fetchProfile]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Erro ao criar conta.');
    }

    const { token } = await res.json();
    setToken(token);

    const user = await fetchProfile(token);
    if (!user) throw new Error('Falha ao carregar perfil após registro.');

    setState({ user, token, isLoading: false });
  }, [setToken, fetchProfile]);

  const logout = useCallback(() => {
    setToken(null);
    setState({ user: null, token: null, isLoading: false });
  }, [setToken]);

  const refreshUser = useCallback(async () => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (!stored) return;
    const user = await fetchProfile(stored);
    if (user) {
      setState((prev) => ({ ...prev, user }));
    }
  }, [fetchProfile]);

  const value: AuthContextValue = {
    ...state,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: !!state.user && !!state.token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>.');
  return ctx;
}
