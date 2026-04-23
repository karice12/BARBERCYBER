import useSWR from 'swr';
import { appointmentsApi, Appointment, CreateAppointmentData, AppointmentStatus } from '@/lib/api';

export function useAppointments(params?: { date?: string; staffId?: string }) {
  const key = params 
    ? `/api/appointments?${new URLSearchParams(params as Record<string, string>).toString()}`
    : '/api/appointments';

  const { data, error, isLoading, mutate } = useSWR<Appointment[]>(
    key,
    async () => {
      const result = await appointmentsApi.list(params);
      if (result.error) throw new Error(result.error);
      return result.data || [];
    }
  );

  const createAppointment = async (appointmentData: CreateAppointmentData) => {
    const result = await appointmentsApi.create(appointmentData);
    if (result.error) {
      return { error: result.error };
    }
    await mutate();
    return { data: result.data };
  };

  const updateStatus = async (id: string, status: AppointmentStatus) => {
    const result = await appointmentsApi.updateStatus(id, status);
    if (result.error) {
      return { error: result.error };
    }
    await mutate();
    return { data: result.data };
  };

  return {
    appointments: data || [],
    isLoading,
    error: error?.message,
    createAppointment,
    updateStatus,
    refresh: mutate,
  };
}
