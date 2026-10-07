import { useState, useCallback } from "react";
import type { PayrollPreviewFiltersState } from "../types/payrollPreview.types";

export function usePayrollPreviewFilters() {
  const [filters, setFilters] = useState<PayrollPreviewFiltersState>({
    searchQuery: "",
    selectedDept: "all",
    selectedValidation: "all",
    currentPage: 1,
    pageSize: 10,
    sortBy: "name",
    sortDir: "asc",
  });

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

  const handleSort = useCallback((field: string) => {
    setFilters((prev) => {
      if (prev.sortBy === field) {
        return { ...prev, sortDir: prev.sortDir === "asc" ? "desc" : "asc" };
      }
      return { ...prev, sortBy: field, sortDir: "asc" };
    });
  }, []);

  return {
    filters,
    setFilters,
    setSearchQuery,
    setSelectedDept,
    setSelectedValidation,
    setCurrentPage,
    setPageSize,
    clearSearch,
    handleSort,
  };
}