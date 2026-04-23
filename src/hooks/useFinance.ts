import useSWR from 'swr';
import { financeApi, FinanceSummary } from '@/lib/api';

export function useFinanceSummary(startDate: string, endDate: string) {
  const key = `/api/finance/summary?startDate=${startDate}&endDate=${endDate}`;

  const { data, error, isLoading, mutate } = useSWR<FinanceSummary>(
    key,
    async () => {
      const result = await financeApi.summary(startDate, endDate);
      if (result.error) throw new Error(result.error);
      return result.data!;
    }
  );

  return {
    summary: data,
    isLoading,
    error: error?.message,
    refresh: mutate,
  };
}
