import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || '/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const { data: { session } } = await supabase.auth.getSession();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (session?.access_token) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }
  
  return headers;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const headers = await getAuthHeaders();
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { error: errorData.error || `Erro ${response.status}` };
    }

    if (response.status === 204) {
      return { data: undefined as T };
    }

    const data = await response.json();
    return { data };
  } catch (err) {
    console.error('[v0] API Request Error:', err);
    return { error: 'Erro de conexão com o servidor.' };
  }
}

// ===== STAFF API =====

export interface Staff {
  id: string;
  name: string;
  specialty: string;
  commissionRate: number;
  isAvailable: boolean;
  userId: string;
  createdAt: string;
}

export interface CreateStaffData {
  name: string;
  specialty: string;
  commissionRate?: number;
  isAvailable: boolean;
}

export interface UpdateStaffData {
  name?: string;
  specialty?: string;
  commissionRate?: number;
  isAvailable?: boolean;
}

export const staffApi = {
  list: () => apiRequest<Staff[]>('/staff'),
  
  getOne: (id: string) => apiRequest<Staff>(`/staff/${id}`),
  
  create: (data: CreateStaffData) => 
    apiRequest<Staff>('/staff', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: UpdateStaffData) => 
    apiRequest<Staff>(`/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) => 
    apiRequest<void>(`/staff/${id}`, {
      method: 'DELETE',
    }),
};

// ===== APPOINTMENTS API =====

export type AppointmentStatus = 'PENDING' | 'COMPLETED' | 'CANCELED' | 'NO_SHOW';

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
  staff?: {
    id: string;
    name: string;
    specialty: string;
  };
}

export interface CreateAppointmentData {
  clientName: string;
  clientPhone: string;
  serviceName: string;
  price: number;
  scheduledAt: string;
  staffId: string;
}

export const appointmentsApi = {
  list: (params?: { date?: string; staffId?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.date) searchParams.set('date', params.date);
    if (params?.staffId) searchParams.set('staffId', params.staffId);
    const query = searchParams.toString();
    return apiRequest<Appointment[]>(`/appointments${query ? `?${query}` : ''}`);
  },
  
  create: (data: CreateAppointmentData) => 
    apiRequest<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  updateStatus: (id: string, status: AppointmentStatus) => 
    apiRequest<Appointment>(`/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// ===== FINANCE API =====

export interface FinanceSummary {
  period: { startDate: string; endDate: string };
  totalAppointments: number;
  totalGross: number;
  totalCommission: number;
  totalNetProfit: number;
}

export const financeApi = {
  summary: (startDate: string, endDate: string) => 
    apiRequest<FinanceSummary>(`/finance/summary?startDate=${startDate}&endDate=${endDate}`),
};

// ===== REPORTS API =====

export interface DailyReport {
  date: string;
  totalRevenue: number;
  totalServices: number;
  byBarber: Array<{
    barberId: string;
    barberName: string;
    services: number;
    revenue: number;
    commission: number;
  }>;
}

export const reportsApi = {
  daily: (date: string) => apiRequest<DailyReport>(`/reports/daily?date=${date}`),
};
