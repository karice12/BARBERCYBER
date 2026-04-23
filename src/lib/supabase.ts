import { createClient } from '@supabase/supabase-js';

// Usar variáveis de ambiente (Vite ou fallback para NEXT_PUBLIC)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 
                    (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) || 
                    '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 
                        (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) || 
                        '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[v0] Supabase não configurado. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');

// Types para autenticação
export interface AuthUser {
  id: string;
  email: string;
  user_metadata: {
    name?: string;
    plan_type?: 'ESSENTIAL' | 'ENTERPRISE';
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}
