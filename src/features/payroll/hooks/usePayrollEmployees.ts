import { useState, useEffect, useCallback } from "react";
import { useParams } from "@tanstack/react-router";
import {
  payrollApi,
  type PayrollPreviewData,
  type PayrollPreviewEmployee,
} from "@/services/payrollApi";
import { toast } from "sonner";
import type {
  PayrollPreviewFiltersState,
} from "../types/payrollPreview.types";
import { extractDepartments } from "../utils/payrollPreview.utils";

export function usePayrollEmployees(
  runId: string,
  isUnavailable: boolean,
  filters: PayrollPreviewFiltersState,
  setFilters: React.Dispatch<React.SetStateAction<PayrollPreviewFiltersState>>
) {
  const [employees, setEmployees] = useState<PayrollPreviewEmployee[]>([]);
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loadingEmployees, setLoadingEmployees] = useState<boolean>(true);
  const [employeesError, setEmployeesError] = useState<string | null>(null);

  // UI State for employee detail sheet
  const [selectedEmployee, setSelectedEmployee] = useState<PayrollPreviewEmployee | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState<boolean>(false);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);

  // Recalculate Dialog State
  const [recalculateModalOpen, setRecalculateModalOpen] = useState<boolean>(false);
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);

  const fetchEmployeesList = useCallback(async () => {
    if (!runId) return;
    setLoadingEmployees(true);
    setEmployeesError(null);
    try {
      const res = await payrollApi.getRunEmployees(runId, {
        page: filters.currentPage,
        limit: filters.pageSize,
        search: filters.searchQuery.trim() || undefined,
        department: filters.selectedDept !== "all" ? filters.selectedDept : undefined,
        validationStatus:
          filters.selectedValidation !== "all" ? filters.selectedValidation : undefined,
        sortBy: filters.sortBy,
        sortDir: filters.sortDir,
      });

      setEmployees(res.items || []);
      setTotalEmployees(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err: any) {
      setEmployees([]);
      setTotalEmployees(0);
      setTotalPages(1);
      const msg = err?.response?.data?.message || err?.message || "Failed to load employee records.";
      setEmployeesError(msg);
      toast.error(msg);
    } finally {
      setLoadingEmployees(false);
    }
  }, [runId, filters]);

  // Load employees when filters/pagination change
  useEffect(() => {
    if (runId && !isUnavailable) {
      fetchEmployeesList();
    }
  }, [runId, isUnavailable, fetchEmployeesList]);

  // Derived state
  const availableDepartments = extractDepartments(employees);

  return {
    employees,
    totalEmployees,
    totalPages,
    availableDepartments,
    loadingEmployees,
    employeesError,
    fetchEmployeesList,
    selectedEmployee,
    setSelectedEmployee,
    detailSheetOpen,
    setDetailSheetOpen,
    loadingDetail,
    setLoadingDetail,
    recalculateModalOpen,
    setRecalculateModalOpen,
    isRecalculating,
    setIsRecalculating,
  };
}