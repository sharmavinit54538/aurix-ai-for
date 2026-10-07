import { useState, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  payrollApi,
  type PayrollPreviewData,
  type PayrollPreviewEmployee,
} from "@/services/payrollApi";
import { toast } from "sonner";

export function usePayrollPreviewActions(
  runId: string,
  previewData: PayrollPreviewData | null,
  setSelectedEmployee: React.Dispatch<React.SetStateAction<PayrollPreviewEmployee | null>>,
  setDetailSheetOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setLoadingDetail: React.Dispatch<React.SetStateAction<boolean>>,
  setRecalculateModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsRecalculating: React.Dispatch<React.SetStateAction<boolean>>
) {
  const navigate = useNavigate();

  // ── 3. Open Employee Detail Drawer ──────────────────────────────────
  const handleViewEmployeeDetail = useCallback(async (emp: PayrollPreviewEmployee) => {
    setSelectedEmployee(emp);
    setDetailSheetOpen(true);
    setLoadingDetail(true);

    try {
      const detail = await payrollApi.getRunEmployeeDetail(runId, emp.employeeId || emp.id);
      if (detail) {
        setSelectedEmployee(detail);
      }
    } catch {
      // Retain the row data if detail endpoint fails
    } finally {
      setLoadingDetail(false);
    }
  }, [runId, setSelectedEmployee, setDetailSheetOpen, setLoadingDetail]);

  // ── 4. Recalculate Payroll Handler ──────────────────────────────────
  const handleConfirmRecalculate = useCallback(async () => {
    if (!runId) return;
    setIsRecalculating(true);
    try {
      const res = await payrollApi.recalculatePayroll(runId);
      toast.success(res?.message || "Payroll recalculation initiated successfully.");
      setRecalculateModalOpen(false);
      navigate({ to: `/dashboard/payroll/runs/${runId}/processing` as any });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        
        "Failed to trigger payroll recalculation on the backend.";
      toast.error(msg);
    } finally {
      setIsRecalculating(false);
    }
  }, [runId, setRecalculateModalOpen, setIsRecalculating, navigate]);

  // ── Sorting Click Handler ───────────────────────────────────────────
  const handleSort = useCallback((field: string) => {
    // This will be handled by the filters hook
  }, []);

  return {
    handleViewEmployeeDetail,
    handleConfirmRecalculate,
    handleSort,
  };
}