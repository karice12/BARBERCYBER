const TOKEN_KEY = 'barbercyber_token';

class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(path, { ...options, headers });

  if (res.status === 401) {
    // Token inválido ou expirado — limpa o armazenamento
    localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new CustomEvent('auth:logout'));
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error || `Erro ${res.status}`);
  }

  // Respostas 204 não têm corpo
  if (res.status === 204) return undefined as T;

  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authApi = {
  profile: () => request<import('@/contexts/AuthContext').AuthUser>('/api/auth/profile'),

  updateProfile: (data: {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => request<import('@/contexts/AuthContext').AuthUser>('/api/auth/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  getBusinessHours: () =>
    request<BusinessHour[]>('/api/auth/business-hours'),

  upsertBusinessHours: (hours: BusinessHour[]) =>
    request<BusinessHour[]>('/api/auth/business-hours', {
      method: 'PUT',
      body: JSON.stringify({ hours }),
    }),
};

// ── Staff ─────────────────────────────────────────────────────────────────────

export const staffApi = {
  list: () => request<StaffMember[]>('/api/staff'),

  create: (data: { name: string; specialty: string; commissionRate: number }) =>
    request<StaffMember>('/api/staff', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<{ name: string; specialty: string; commissionRate: number }>) =>
    request<StaffMember>(`/api/staff/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  remove: (id: string) =>
    request<void>(`/api/staff/${id}`, { method: 'DELETE' }),
};

// ── Appointments ──────────────────────────────────────────────────────────────

export const appointmentApi = {
  list: (params?: { date?: string; staffId?: string }) => {
    const qs = params
      ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => Boolean(v)) as [string, string][]).toString()
      : '';
    return request<AppointmentRecord[]>(`/api/appointments${qs}`);
  },

  create: (data: {
    clientName: string;
    staffId: string;
    startTime: string;
    endTime: string;
    service: string;
    price: number;
  }) =>
    request<AppointmentRecord>('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateStatus: (id: string, status: string) =>
    request<AppointmentRecord>(`/api/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// ── Finance ───────────────────────────────────────────────────────────────────

export const financeApi = {
  summary: (params?: { startDate?: string; endDate?: string }) => {
    const qs = params
      ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => Boolean(v)) as [string, string][]).toString()
      : '';
    return request<FinanceSummary>(`/api/finance/summary${qs}`);
  },
};

// ── Shared Types ──────────────────────────────────────────────────────────────

export interface StaffMember {
  id: string;
  name: string;
  specialty: string;
  commissionRate: number;
  avatarUrl?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface AppointmentRecord {
  id: string;
  clientName: string;
  staffId: string;
  startTime: string;
  endTime: string;
  service: string;
  price: number;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  staff?: StaffMember;
}

export interface BusinessHour {
  id?: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

export interface FinanceSummary {
  totalRevenue: number;
  totalCommissions: number;
  netProfit: number;
  totalAppointments: number;
  transactions: FinanceTransaction[];
}

export interface FinanceTransaction {
  id: string;
  amount: number;
  commission: number;
  netAmount: number;
  description: string;
  date: string;
  staffId?: string | null;
  staff?: StaffMember | null;
}

export { ApiError };
