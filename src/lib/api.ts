import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

/**
 * Recupera o token de acesso atual da sessão do Supabase Auth.
 * Este token é enviado automaticamente em todas as requisições ao backend.
 */
async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

/**
 * Monta os headers padrão para todas as requisições.
 * O header "Authorization: Bearer <token>" é o que o authMiddleware do
 * Express lê e valida usando o SUPABASE_JWT_SECRET.
 */
async function buildHeaders(extra?: HeadersInit): Promise<Headers> {
  const token = await getAccessToken();
  const headers = new Headers({ 'Content-Type': 'application/json', ...extra });

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return headers;
}

/**
 * Cliente HTTP genérico.
 * Lança um Error com a mensagem de erro retornada pelo backend em caso de falha.
 */
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = await buildHeaders(options.headers as HeadersInit);

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      (body as { error?: string }).error ?? `Erro HTTP ${res.status}`
    );
  }

  return res.json() as Promise<T>;
}

// =============================================================================
// Endpoints do backend Express
// =============================================================================

/** Retorna o perfil do usuário autenticado. */
export const getMe = () => request<{ profile: UserProfile }>('/api/auth/me');

/** Atualiza o nome do usuário autenticado. */
export const updateMe = (name: string) =>
  request<{ profile: UserProfile }>('/api/auth/me', {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  });

/** Lista os colaboradores do usuário autenticado. */
export const getStaff = () => request<{ staff: unknown[] }>('/api/staff');

/** Lista os agendamentos do usuário autenticado. */
export const getAppointments = () =>
  request<{ appointments: unknown[] }>('/api/appointments');

/** Retorna o resumo financeiro. */
export const getFinance = () =>
  request<{ transactions: unknown[] }>('/api/finance');

// =============================================================================
// Tipos locais
// =============================================================================

export interface UserProfile {
  id: string;
  name: string;
  planType: 'ESSENTIAL' | 'ENTERPRISE';
  hasPlus5Addon: boolean;
  createdAt: string;
}
