import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useAurix } from "@/lib/aurix-store";
import { useCurrentRole } from "@/lib/roles";
import { useAppSelector } from "@/redux/hooks";
import { selectUserPermissions } from "@/store/sidebar/sidebarSelectors";
import {
  payrollApi,
  type PayrollPreviewData,
  type PayrollPreviewEmployee,
} from "@/services/payrollApi";
import { toast } from "sonner";
import type {
  PayrollPreviewFiltersState,
  StatusTone,
} from "../types/payrollPreview.types";
import {
  extractDepartments,
  computePagination,
  getStatusTone,
} from "../utils/payrollPreview.utils";

export function usePayrollPreview() {
  const params = useParams({ strict: false }) as { runId?: string };
  const runId = params?.runId?.trim() || "";
  const navigate = useNavigate();

  const ws = useAurix();
  const userPermissions = useAppSelector(selectUserPermissions);
  const currentRole = useCurrentRole();
  const isHr = currentRole === "hr_admin";

  const canViewPayroll =
    isHr ||
    userPermissions.includes("payroll.view") ||
    userPermissions.includes("*");

  const canRunPayroll =
    isHr ||
    userPermissions.includes("payroll.process") ||
    userPermissions.includes("*");

  // State: Preview Data & Status
  const [previewData, setPreviewData] = useState<PayrollPreviewData | null>(null);
  const [employees, setEmployees] = useState<PayrollPreviewEmployee[]>([]);
  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Table Filters & Pagination
  const [filters, setFilters] = useState<PayrollPreviewFiltersState>({
    searchQuery: "",
    selectedDept: "all",
    selectedValidation: "all",
    currentPage: 1,
    pageSize: 10,
    sortBy: "name",
    sortDir: "asc",
  });

  // Selected Employee Detail (Slide-over Sheet)
  const [selectedEmployee, setSelectedEmployee] = useState<PayrollPreviewEmployee | null>(null);
  const [detailSheetOpen, setDetailSheetOpen] = useState<boolean>(false);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);

  // Loading & Error States
  const [loadingPreview, setLoadingPreview] = useState<boolean>(true);
  const [loadingEmployees, setLoadingEmployees] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [employeesError, setEmployeesError] = useState<string | null>(null);
  const [isUnavailable, setIsUnavailable] = useState<boolean>(false);

  // Recalculate Dialog State
  const [recalculateModalOpen, setRecalculateModalOpen] = useState<boolean>(false);
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);

  // ── 1. Fetch Preview Summary & Metadata ─────────────────────────────
  const fetchPreviewSummary = useCallback(async () => {
    if (!runId) return;
    setLoadingPreview(true);
    try {
      const data = await payrollApi.getPayrollPreview(runId);
      setPreviewData(data);
      setIsUnavailable(false);
      setApiError(null);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404) {
        setIsUnavailable(true);
        setApiError(
          "Payroll preview data is currently unavailable on the backend server or pending calculation (404 Not Found)."
        );
      } else if (status === 401 || status === 403) {
        setApiError("You are not authorized to view this payroll preview.");
      } else {
        setApiError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load payroll preview from the server."
        );
      }
      setPreviewData(null);
    } finally {
      setLoadingPreview(false);
    }
  }, [runId]);

  // ── 2. Fetch Employee Payroll Records (Server-side paginated/filtered)
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

  // Initial load
  useEffect(() => {
    if (!runId) {
      setLoadingPreview(false);
      setLoadingEmployees(false);
      return;
    }
    fetchPreviewSummary();
  }, [runId, fetchPreviewSummary]);

  // Load employees when filters/pagination change
  useEffect(() => {
    if (runId && !isUnavailable) {
      fetchEmployeesList();
    }
  }, [runId, isUnavailable, fetchEmployeesList]);

  // Full Refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchPreviewSummary(), fetchEmployeesList()]);
    setIsRefreshing(false);
  };

  // ── 3. Open Employee Detail Drawer ──────────────────────────────────
  const handleViewEmployeeDetail = async (emp: PayrollPreviewEmployee) => {
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
  };

  // ── 4. Recalculate Payroll Handler ──────────────────────────────────
  const handleConfirmRecalculate = async () => {
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
  };

  // ── Sorting Click Handler ───────────────────────────────────────────
  const handleSort = useCallback((field: string) => {
    setFilters((prev) => {
      if (prev.sortBy === field) {
        return { ...prev, sortDir: prev.sortDir === "asc" ? "desc" : "asc" };
      }
      return { ...prev, sortBy: field, sortDir: "asc" };
    });
  }, []);

  // Derived state
  const availableDepartments = useMemo(
    () => extractDepartments(employees),
    [employees]
  );

  const statusTone = getStatusTone(previewData?.status);

  // Filter handlers
  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query, currentPage: 1 }));
  }, []);

  const setSelectedDept = useCallback((dept: string) => {
    setFilters((prev) => ({ ...prev, selectedDept: dept, currentPage: 1 }));
  }, []);

  const setSelectedValidation = useCallback((validation: string) => {
    setFilters((prev) => ({ ...prev, selectedValidation: validation, currentPage: 1 }));
  }, []);

  const setCurrentPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, currentPage: page }));
  }, []);

  const setPageSize = useCallback((size: number) => {
    setFilters((prev) => ({ ...prev, pageSize: size, currentPage: 1 }));
  }, []);

  const clearSearch = useCallback(() => {
    setFilters((prev) => ({ ...prev, searchQuery: "", currentPage: 1 }));
  }, []);

  const onRetry = useCallback(() => {
    fetchEmployeesList();
  }, [fetchEmployeesList]);

  return {
    // Run context
    runId,
    navigate,
    ws,
    canViewPayroll,
    canRunPayroll,
    isHr,

    // Preview data
    previewData,
    statusTone,

    // Employees
    employees,
    totalEmployees,
    totalPages,
    availableDepartments,

    // Filters & pagination
    filters,

    // UI State
    loadingPreview,
    loadingEmployees,
    isRefreshing,
    apiError,
    employeesError,
    isUnavailable,
    selectedEmployee,
    detailSheetOpen,
    loadingDetail,
    recalculateModalOpen,
    isRecalculating,

    // Actions
    fetchPreviewSummary,
    fetchEmployeesList,
    handleRefresh,
    handleViewEmployeeDetail,
    handleConfirmRecalculate,
    handleSort,
    setSearchQuery,
    setSelectedDept,
    setSelectedValidation,
    setCurrentPage,
    setPageSize,
    clearSearch,
    setDetailSheetOpen,
    setRecalculateModalOpen,
    onRetry,
  };
}