import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function buildHeaders(extra?: HeadersInit): Promise<Headers> {
  const token = await getAccessToken();
  const headers = new Headers({ 'Content-Type': 'application/json', ...(extra as Record<string, string>) });
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return headers;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = await buildHeaders(options.headers as HeadersInit);
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `Erro HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// =============================================================================
// Types
// =============================================================================

export type AppointmentStatus = 'PENDING' | 'COMPLETED' | 'CANCELED' | 'NO_SHOW';

export interface StaffMember {
  id: string;
  name: string;
  specialty: string;
  commissionRate: number;
  isAvailable: boolean;
  userId: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceName: string;
  price: number;
  scheduledAt: string;
  status: AppointmentStatus;
  staffId: string;
  userId: string;
  createdAt: string;
  staff?: { id: string; name: string; specialty: string };
}

export interface FinanceSummary {
  period: { startDate: string; endDate: string };
  totalAppointments: number;
  totalGross: number;
  totalCommission: number;
  totalNetProfit: number;
}

export interface UserProfile {
  id: string;
  name: string;
  planType: 'ESSENTIAL' | 'ENTERPRISE';
  hasPlus5Addon: boolean;
  createdAt: string;
}

// =============================================================================
// Auth
// =============================================================================

export const getMe = () =>
  request<{ profile: UserProfile }>('/api/auth/me');

export const updateMe = (name: string) =>
  request<{ profile: UserProfile }>('/api/auth/me', {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  });

// =============================================================================
// Staff
// =============================================================================

export const getStaff = () =>
  request<StaffMember[]>('/api/staff');

export const createStaffMember = (data: {
  name: string;
  specialty: string;
  commissionRate: number;
  isAvailable: boolean;
}) =>
  request<StaffMember>('/api/staff', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateStaffMember = (id: string, data: Partial<{
  name: string;
  specialty: string;
  commissionRate: number;
  isAvailable: boolean;
}>) =>
  request<StaffMember>(`/api/staff/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteStaffMember = (id: string) =>
  request<void>(`/api/staff/${id}`, { method: 'DELETE' });

// =============================================================================
// Appointments
// =============================================================================

export const getAppointments = (date?: string, staffId?: string) => {
  const params = new URLSearchParams();
  if (date) params.set('date', date);
  if (staffId) params.set('staffId', staffId);
  const qs = params.toString();
  return request<Appointment[]>(`/api/appointments${qs ? `?${qs}` : ''}`);
};

export const createAppointment = (data: {
  clientName: string;
  clientPhone: string;
  serviceName: string;
  price: number;
  scheduledAt: string;
  staffId: string;
}) =>
  request<Appointment>('/api/appointments', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateAppointmentStatus = (id: string, status: AppointmentStatus) =>
  request<Appointment>(`/api/appointments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

// =============================================================================
// Finance
// =============================================================================

export const getFinanceSummary = (startDate: string, endDate: string) =>
  request<FinanceSummary>(`/api/finance/summary?startDate=${startDate}&endDate=${endDate}`);
