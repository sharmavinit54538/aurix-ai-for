import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/api/utils";
import {
  adminOnboardingApi,
  type ListProgressParams,
  type OnboardingDetails,
  type OnboardingProgressItem,
} from "@/services/employeeOnboardingApi";

export interface OnboardingFilters {
  status: string;
  department: string;
  search: string;
  currentStep: string;
  minCompletion: string;
}

export const DEFAULT_ONBOARDING_FILTERS: OnboardingFilters = {
  status: "all",
  department: "all",
  search: "",
  currentStep: "all",
  minCompletion: "",
};

function toListParams(filters: OnboardingFilters): ListProgressParams {
  const params: ListProgressParams = {};
  if (filters.status !== "all") params.status = filters.status;
  if (filters.department !== "all") params.department = filters.department;
  if (filters.search.trim()) params.search = filters.search.trim();
  return params;
}

function applyClientFilters(
  items: OnboardingProgressItem[],
  filters: OnboardingFilters,
): OnboardingProgressItem[] {
  return items.filter((item) => {
    if (filters.currentStep !== "all" && item.current_step !== filters.currentStep) {
      return false;
    }
    if (filters.minCompletion.trim()) {
      const min = Number(filters.minCompletion);
      if (!Number.isNaN(min) && item.completion_percentage < min) return false;
    }
    return true;
  });
}

export function useAdminOnboarding() {
  const [filters, setFilters] = useState<OnboardingFilters>(DEFAULT_ONBOARDING_FILTERS);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [rawEmployees, setRawEmployees] = useState<OnboardingProgressItem[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [details, setDetails] = useState<OnboardingDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [actionDocumentId, setActionDocumentId] = useState<string | null>(null);

  const fetchList = useCallback(async (nextFilters: OnboardingFilters, silent = false) => {
    if (!silent) setListLoading(true);
    setListError(null);
    try {
      const items = await adminOnboardingApi.listProgress(toListParams(nextFilters));
      setRawEmployees(items);
      return items;
    } catch (error) {
      const message = getErrorMessage(error, "Failed to load onboarding progress");
      setListError(message);
      toast.error(message);
      return [];
    } finally {
      if (!silent) setListLoading(false);
    }
  }, []);

  const fetchDetails = useCallback(async (employeeId: string, silent = false) => {
    setDetailsLoading(true);
    setDetailsError(null);
    try {
      const data = await adminOnboardingApi.getDetails(employeeId);
      setDetails(data);
      return data;
    } catch (error) {
      const message = getErrorMessage(error, "Failed to load onboarding details");
      setDetailsError(message);
      if (!silent) toast.error(message);
      return null;
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(filters.search.trim());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [filters.search]);

  const queryFilters = useMemo(
    () => ({ ...filters, search: debouncedSearch }),
    [filters, debouncedSearch],
  );

  const employees = useMemo(
    () => applyClientFilters(rawEmployees, queryFilters),
    [rawEmployees, queryFilters],
  );

  useEffect(() => {
    void fetchList(queryFilters);
  }, [fetchList, queryFilters]);

  useEffect(() => {
    if (!selectedEmployeeId) {
      setDetails(null);
      setDetailsError(null);
      return;
    }
    void fetchDetails(selectedEmployeeId);
  }, [fetchDetails, selectedEmployeeId]);

  useEffect(() => {
    if (employees.length === 0) {
      setSelectedEmployeeId(null);
      return;
    }
    if (!selectedEmployeeId || !employees.some((item) => item.employee_id === selectedEmployeeId)) {
      setSelectedEmployeeId(employees[0].employee_id);
    }
  }, [employees, selectedEmployeeId]);

  const departments = useMemo(
    () =>
      Array.from(new Set(rawEmployees.map((item) => item.department).filter(Boolean))).sort(),
    [rawEmployees],
  );

  const currentSteps = useMemo(
    () =>
      Array.from(new Set(rawEmployees.map((item) => item.current_step).filter(Boolean))).sort(),
    [rawEmployees],
  );

  const selectedEmployee = useMemo(
    () => employees.find((item) => item.employee_id === selectedEmployeeId) ?? null,
    [employees, selectedEmployeeId],
  );

  const stats = useMemo(() => {
    const pendingDocs = employees.reduce(
      (total, item) => total + (item.missing_documents?.length ?? 0),
      0,
    );
    const completed = employees.filter((item) => item.status === "COMPLETED").length;
    const inProgress = employees.filter((item) => item.status === "IN_PROGRESS").length;
    const avgCompletion = employees.length
      ? Math.round(
          employees.reduce((sum, item) => sum + (item.completion_percentage ?? 0), 0) /
            employees.length,
        )
      : 0;
    return {
      total: employees.length,
      completed,
      inProgress,
      pendingDocs,
      avgCompletion,
    };
  }, [employees]);

  const retryList = useCallback(async () => {
    setListLoading(true);
    setListError(null);
    try {
      const items = await adminOnboardingApi.listProgress(toListParams(queryFilters));
      setRawEmployees(items);
      toast.success("Onboarding data loaded successfully");
    } catch (error) {
      const message = getErrorMessage(error, "Failed to load onboarding progress");
      setListError(message);
      toast.error(message);
    } finally {
      setListLoading(false);
    }
  }, [queryFilters]);

  const retryDetails = useCallback(() => {
    if (!selectedEmployeeId) return;
    void fetchDetails(selectedEmployeeId);
  }, [fetchDetails, selectedEmployeeId]);

  const verifyDocument = useCallback(
    async (documentId: string, status: "VERIFIED" | "REJECTED", comment?: string) => {
      if (!selectedEmployeeId) return false;
      setActionDocumentId(documentId);
      try {
        await adminOnboardingApi.verifyDocument(selectedEmployeeId, documentId, status, comment);
        toast.success(status === "VERIFIED" ? "Document verified successfully" : "Document rejected");
        await Promise.all([
          fetchDetails(selectedEmployeeId, true),
          fetchList(queryFilters, true),
        ]);
        return true;
      } catch (error) {
        toast.error(getErrorMessage(error, "Failed to update document status"));
        return false;
      } finally {
        setActionDocumentId(null);
      }
    },
    [fetchDetails, fetchList, queryFilters, selectedEmployeeId],
  );

  return {
    filters,
    setFilters,
    employees,
    listLoading,
    listError,
    selectedEmployeeId,
    setSelectedEmployeeId,
    selectedEmployee,
    details,
    detailsLoading,
    detailsError,
    actionDocumentId,
    departments,
    currentSteps,
    stats,
    retryList,
    retryDetails,
    verifyDocument,
  };
}
