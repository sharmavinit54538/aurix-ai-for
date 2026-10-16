import { useState, useEffect, useCallback } from "react";
import { payrollApi } from "@/services/payrollApi";
import type { PayrollPeriod } from "@/services/payroll/types";

interface UsePayrollPeriodsReturn {
  periods: PayrollPeriod[];
  loading: boolean;
  error: string | null;
  selectedPeriodId: string;
  setSelectedPeriodId: (id: string) => void;
  refresh: () => Promise<void>;
}

/**
 * Shared hook for fetching and managing payroll periods.
 * Single source of truth for all payroll period selectors.
 */
export function usePayrollPeriods(initialPeriodId?: string): UsePayrollPeriodsReturn {
  const [periods, setPeriods] = useState<PayrollPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>(initialPeriodId || "");

  const fetchPeriods = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await payrollApi.getPeriods();
      setPeriods(data);
      
      // Auto-select current period if none selected
      if (!selectedPeriodId && data.length > 0) {
        const current = data.find((p) => p.isCurrent) || data[0];
        setSelectedPeriodId(current.id);
      }
    } catch (err: any) {
      if (err?.response?.status !== 404) {
        setError(err?.response?.data?.message || err?.message || "Failed to load payroll periods");
      }
      setPeriods([]);
    } finally {
      setLoading(false);
    }
  }, [selectedPeriodId]);

  useEffect(() => {
    fetchPeriods();
  }, [fetchPeriods]);

  const refresh = useCallback(async () => {
    await fetchPeriods();
  }, [fetchPeriods]);

  return {
    periods,
    loading,
    error,
    selectedPeriodId,
    setSelectedPeriodId,
    refresh,
  };
}