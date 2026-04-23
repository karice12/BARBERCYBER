import useSWR from 'swr';
import { staffApi, Staff, CreateStaffData, UpdateStaffData } from '@/lib/api';

const STAFF_KEY = '/api/staff';

export function useStaff() {
  const { data, error, isLoading, mutate } = useSWR<Staff[]>(
    STAFF_KEY,
    async () => {
      const result = await staffApi.list();
      if (result.error) throw new Error(result.error);
      return result.data || [];
    }
  );

  const createStaff = async (staffData: CreateStaffData) => {
    const result = await staffApi.create(staffData);
    if (result.error) {
      return { error: result.error };
    }
    await mutate();
    return { data: result.data };
  };

  const updateStaff = async (id: string, staffData: UpdateStaffData) => {
    const result = await staffApi.update(id, staffData);
    if (result.error) {
      return { error: result.error };
    }
    await mutate();
    return { data: result.data };
  };

  const deleteStaff = async (id: string) => {
    const result = await staffApi.delete(id);
    if (result.error) {
      return { error: result.error };
    }
    await mutate();
    return { success: true };
  };

  return {
    staff: data || [],
    isLoading,
    error: error?.message,
    createStaff,
    updateStaff,
    deleteStaff,
    refresh: mutate,
  };
}
