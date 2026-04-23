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
    localStorage.removeItem(TOKEN_KEY);
    window.dispatchEvent(new CustomEvent('auth:logout'));
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.error || `Erro ${res.status}`);
  }

  if (res.status === 204) return undefined as T;

  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authApi = {
  profile: () =>
    request<import('@/contexts/AuthContext').AuthUser>('/api/auth/profile'),

  updateProfile: (data: {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }) =>
    request<import('@/contexts/AuthContext').AuthUser>('/api/auth/profile', {
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

// ── Subscription / Stripe ─────────────────────────────────────────────────────

export const subscriptionApi = {
  createCheckout: (plan: 'ENTERPRISE' | 'PLUS5') =>
    request<{ url: string }>('/api/subscription/checkout', {
      method: 'POST',
      body: JSON.stringify({ plan }),
    }),

  cancelSubscription: () =>
    request<void>('/api/subscription/cancel', { method: 'POST' }),
};

// ── Staff ─────────────────────────────────────────────────────────────────────

export const staffApi = {
  list: () => request<StaffMember[]>('/api/staff'),

  create: (data: {
    name: string;
    specialty: string;
    commissionRate: number;
    isAvailable: boolean;
  }) =>
    request<StaffMember>('/api/staff', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (
    id: string,
    data: Partial<{
      name: string;
      specialty: string;
      commissionRate: number;
      isAvailable: boolean;
    }>
  ) =>
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
      ? '?' +
        new URLSearchParams(
          Object.entries(params).filter(([, v]) => Boolean(v)) as [
            string,
            string,
          ][]
        ).toString()
      : '';
    return request<AppointmentRecord[]>(`/api/appointments${qs}`);
  },

  create: (data: {
    clientName: string;
    clientPhone: string;
    serviceName: string;
    price: number;
    scheduledAt: string;
    staffId: string;
  }) =>
    request<AppointmentRecord>('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateStatus: (id: string, status: AppointmentRecord['status']) =>
    request<AppointmentRecord>(`/api/appointments/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// ── Finance ───────────────────────────────────────────────────────────────────

export const financeApi = {
  summary: (params?: { startDate?: string; endDate?: string }) => {
    const qs = params
      ? '?' +
        new URLSearchParams(
          Object.entries(params).filter(([, v]) => Boolean(v)) as [
            string,
            string,
          ][]
        ).toString()
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
  isAvailable: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface AppointmentRecord {
  id: string;
  clientName: string;
  clientPhone: string;
  serviceName: string;
  price: number;
  scheduledAt: string;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  staffId: string;
  createdAt: string;
  staff?: Pick<StaffMember, 'id' | 'name' | 'specialty'> | null;
}

export interface BusinessHour {
  id?: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

export interface FinanceSummary {
  period: { startDate: string; endDate: string };
  totalAppointments: number;
  totalGross: number;
  totalCommission: number;
  totalNetProfit: number;
}

export { ApiError };
