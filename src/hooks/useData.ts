import useSWR from 'swr';
import {
  getStaff,
  getAppointments,
  getFinanceSummary,
  type StaffMember,
  type Appointment,
  type FinanceSummary,
} from '@/lib/api';

/**
 * Lista todos os barbeiros/profissionais do usuário autenticado.
 */
export function useStaff() {
  const { data, error, isLoading, mutate } = useSWR<StaffMember[]>(
    'staff',
    () => getStaff(),
    { revalidateOnFocus: false }
  );

  return {
    staff: data ?? [],
    isLoading,
    error,
    mutate,
  };
}

/**
 * Lista agendamentos, opcionalmente filtrados por data (YYYY-MM-DD) e staffId.
 */
export function useAppointments(date?: string, staffId?: string) {
  const key = `appointments:${date ?? 'all'}:${staffId ?? 'all'}`;
  const { data, error, isLoading, mutate } = useSWR<Appointment[]>(
    key,
    () => getAppointments(date, staffId),
    { revalidateOnFocus: false }
  );

  return {
    appointments: data ?? [],
    isLoading,
    error,
    mutate,
  };
}

/**
 * Retorna o resumo financeiro para o período informado.
 */
export function useFinanceSummary(startDate: string, endDate: string) {
  const { data, error, isLoading } = useSWR<FinanceSummary>(
    `finance:${startDate}:${endDate}`,
    () => getFinanceSummary(startDate, endDate),
    { revalidateOnFocus: false }
  );

  return {
    summary: data ?? null,
    isLoading,
    error,
  };
}
