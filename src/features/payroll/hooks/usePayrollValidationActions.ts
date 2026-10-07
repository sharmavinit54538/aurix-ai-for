import { useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { payrollApi } from "@/services/payrollApi";
import { toast } from "sonner";

export function usePayrollValidationActions(
  runId: string,
  validationData: any,
  fetchValidationData: () => Promise<void>,
  setRevalidateModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsValidating: React.Dispatch<React.SetStateAction<boolean>>,
  setRecalculateModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setIsRecalculating: React.Dispatch<React.SetStateAction<boolean>>
) {
  const navigate = useNavigate();

  // ── Trigger Revalidation ────────────────────────────────────────────
  const handleTriggerRevalidation = useCallback(async () => {
    if (!runId) return;
    setIsValidating(true);
    try {
      const res = await payrollApi.runPayrollValidation(runId);
      toast.success(res?.message || "Payroll revalidation completed successfully.");
      setRevalidateModalOpen(false);
      await fetchValidationData();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to trigger backend validation.";
      toast.error(msg);
    } finally {
      setIsValidating(false);
    }
  }, [runId, fetchValidationData, setRevalidateModalOpen, setIsValidating]);

  // ── Trigger Recalculate ─────────────────────────────────────────────
  const handleTriggerRecalculate = useCallback(async () => {
    if (!runId) return;
    setIsRecalculating(true);
    try {
      const res = await payrollApi.recalculatePayroll(runId);
      toast.success(res?.message || "Payroll recalculation triggered successfully.");
      setRecalculateModalOpen(false);
      await fetchValidationData();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to trigger recalculation.";
      toast.error(msg);
    } finally {
      setIsRecalculating(false);
    }
  }, [runId, fetchValidationData, setRecalculateModalOpen, setIsRecalculating]);

  return {
    handleTriggerRevalidation,
    handleTriggerRecalculate,
  };
}