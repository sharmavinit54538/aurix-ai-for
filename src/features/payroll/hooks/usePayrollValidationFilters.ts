import { useState, useCallback, useEffect } from "react";
import type { SeverityOption, CategoryOption, DepartmentOption, StatusOption, BlockingOption } from "../types/payrollValidation.types";

interface ValidationFiltersState {
  searchQuery: string;
  selectedSeverity: "all" | "error" | "warning" | "info";
  selectedCategory: string;
  selectedDepartment: string;
  selectedStatus: "all" | "open" | "resolved";
  selectedBlocking: "all" | "blocking" | "non_blocking";
  currentPage: number;
  pageSize: number;
}

export function usePayrollValidationFilters() {
  const [filters, setFilters] = useState<ValidationFiltersState>({
    searchQuery: "",
    selectedSeverity: "all",
    selectedCategory: "all",
    selectedDepartment: "all",
    selectedStatus: "all",
    selectedBlocking: "all",
    currentPage: 1,
    pageSize: 10,
  });

  // Modal states
  const [revalidateModalOpen, setRevalidateModalOpen] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [recalculateModalOpen, setRecalculateModalOpen] = useState<boolean>(false);
  const [isRecalculating, setIsRecalculating] = useState<boolean>(false);

  // Selected Issue Detail Sheet
  const [selectedIssue, setSelectedIssue] = useState<any>(null);
  const [issueSheetOpen, setIssueSheetOpen] = useState<boolean>(false);

  // Filter handlers
  const setSearchQuery = useCallback((query: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: query, currentPage: 1 }));
  }, []);

  const setSelectedSeverity = useCallback((severity: "all" | "error" | "warning" | "info") => {
    setFilters((prev) => ({ ...prev, selectedSeverity: severity, currentPage: 1 }));
  }, []);

  const setSelectedCategory = useCallback((category: string) => {
    setFilters((prev) => ({ ...prev, selectedCategory: category, currentPage: 1 }));
  }, []);

  const setSelectedDepartment = useCallback((department: string) => {
    setFilters((prev) => ({ ...prev, selectedDepartment: department, currentPage: 1 }));
  }, []);

  const setSelectedStatus = useCallback((status: "all" | "open" | "resolved") => {
    setFilters((prev) => ({ ...prev, selectedStatus: status, currentPage: 1 }));
  }, []);

  const setSelectedBlocking = useCallback((blocking: "all" | "blocking" | "non_blocking") => {
    setFilters((prev) => ({ ...prev, selectedBlocking: blocking, currentPage: 1 }));
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

  const clearAllFilters = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: "",
      selectedSeverity: "all",
      selectedCategory: "all",
      selectedDepartment: "all",
      selectedStatus: "all",
      selectedBlocking: "all",
      currentPage: 1,
    }));
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setFilters((prev) => ({ ...prev, currentPage: 1 }));
  }, [
    filters.searchQuery,
    filters.selectedSeverity,
    filters.selectedCategory,
    filters.selectedDepartment,
    filters.selectedStatus,
    filters.selectedBlocking,
  ]);

  return {
    filters,
    setSearchQuery,
    setSelectedSeverity,
    setSelectedCategory,
    setSelectedDepartment,
    setSelectedStatus,
    setSelectedBlocking,
    setCurrentPage,
    setPageSize,
    clearSearch,
    clearAllFilters,
    revalidateModalOpen,
    setRevalidateModalOpen,
    isValidating,
    setIsValidating,
    recalculateModalOpen,
    setRecalculateModalOpen,
    isRecalculating,
    setIsRecalculating,
    selectedIssue,
    setSelectedIssue,
    issueSheetOpen,
    setIssueSheetOpen,
  };
}