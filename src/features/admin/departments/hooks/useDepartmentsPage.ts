import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks";
import { useManagersList } from "../../managers/hooks/useManagersList";
import { useManagers } from "../../managers/hooks/useManagers";
import { useDepartments } from "./useDepartments";
import {
  createDepartment as createDepartmentThunk,
  updateDepartment as updateDepartmentThunk,
  deleteDepartment as deleteDepartmentThunk,
  fetchDepartmentById,
  importDepartments as importDepartmentsThunk,
  promoteDepartmentEmployee,
} from "../departmentsThunk";
import type { Department, DepartmentFilters, SortDir, SortField } from "../types";
import { DEFAULT_FILTERS } from "../constants";
import { applySorting } from "../utils";
import {
  exportDepartmentsCSV,
  exportDepartmentsPDF,
  getDepartmentsExportData,
} from "../utils/departmentExport";

function countDepartmentEmployees(dept: Department): number {
  return Number(dept.currentEmployeeCount) || (dept.employeeIds ? dept.employeeIds.length : 0);
}

export function useDepartmentsPage() {
  const dispatch = useAppDispatch();
  const {
    departments,
    loading,
    error,
    summary,
    summaryLoading,
    fetchDepartments,
    fetchDepartmentsSummary,
    fetchDepartmentById: fetchDepartmentByIdAction,
    clearSelectedDepartment,
    setSelectedDepartment,
    selectedDepartment,
    selectedDepartmentLoading,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    addEmployeeToDept,
    removeEmployeeFromDept,
  } = useDepartments();

  const managers = useManagersList();
  const { fetchManagers: fetchManagersList } = useManagers();

  const [activeTab, setActiveTab] = useState("directory");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<DepartmentFilters>({ ...DEFAULT_FILTERS });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const [formOpen, setFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileDept, setProfileDept] = useState<Department | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState<Department | null>(null);
  const [cannotDeleteAlertOpen, setCannotDeleteAlertOpen] = useState(false);

  // TODO: Bulk department actions (assign manager, status, delete, transfer) can be enabled once backend bulk endpoints are active.

  const reloadDepartments = useCallback(() => {
    fetchDepartments({
      page: 1,
      limit: 500,
    });
    fetchDepartmentsSummary();
  }, [fetchDepartments, fetchDepartmentsSummary]);

  const initialLoaded = useRef(false);
  useEffect(() => {
    if (!initialLoaded.current) {
      initialLoaded.current = true;
      fetchManagersList({ limit: 100 });
      reloadDepartments();
    }
  }, [fetchManagersList, reloadDepartments]);

  const processedDepartments = useMemo(() => {
    let list = departments;

    // Search query filter
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((d) => {
        const name = (d.name || "").toLowerCase();
        const code = (d.department_code || d.code || "").toLowerCase();
        const head = (d.departmentHeadName || "").toLowerCase();
        const mgr = (d.reportingManagerName || "").toLowerCase();
        const office = (d.office || "").toLowerCase();
        const costCenter = (d.cost_center || d.costCenter || "").toLowerCase();
        return (
          name.includes(q) ||
          code.includes(q) ||
          head.includes(q) ||
          mgr.includes(q) ||
          office.includes(q) ||
          costCenter.includes(q)
        );
      });
    }

    // Status filter
    if (filters.status && filters.status !== "all") {
      const targetStatus = filters.status.toLowerCase();
      list = list.filter((d) => (d.status || "").toLowerCase() === targetStatus);
    }

    // Office Location filter
    if (filters.office && filters.office !== "all") {
      const targetOffice = filters.office.trim().toLowerCase();
      list = list.filter((d) => (d.office || "").trim().toLowerCase().includes(targetOffice));
    }

    // Department Head / Manager filter
    if (filters.managerId && filters.managerId !== "all") {
      const targetMgr = filters.managerId;
      list = list.filter(
        (d) =>
          d.departmentHeadId === targetMgr ||
          d.reportingManagerId === targetMgr ||
          (d.departmentHeadName || "").toLowerCase().includes(targetMgr.toLowerCase())
      );
    }

    // Employee Count Range filter
    if (filters.employeeCountRange && filters.employeeCountRange !== "all") {
      list = list.filter((d) => {
        const ec = d.currentEmployeeCount || 0;
        if (filters.employeeCountRange === "0-10") return ec >= 0 && ec <= 10;
        if (filters.employeeCountRange === "11-30") return ec >= 11 && ec <= 30;
        if (filters.employeeCountRange === "31-50") return ec >= 31 && ec <= 50;
        if (filters.employeeCountRange === "50+") return ec > 50;
        return true;
      });
    }

    // Created Date From filter
    if (filters.createdDateFrom) {
      const fromTime = new Date(filters.createdDateFrom).getTime();
      list = list.filter((d) => {
        if (!d.createdDate) return false;
        const dTime = new Date(d.createdDate).getTime();
        return !isNaN(dTime) && dTime >= fromTime;
      });
    }

    // Created Date To filter
    if (filters.createdDateTo) {
      const toTime = new Date(filters.createdDateTo).getTime() + 86400000;
      list = list.filter((d) => {
        if (!d.createdDate) return false;
        const dTime = new Date(d.createdDate).getTime();
        return !isNaN(dTime) && dTime <= toTime;
      });
    }

    return applySorting(list, sortField, sortDir);
  }, [departments, searchQuery, filters, sortField, sortDir]);

  const start = (currentPage - 1) * perPage;
  const paginatedDepartments = processedDepartments.slice(start, start + perPage);

  const totalPages = Math.max(1, Math.ceil(processedDepartments.length / perPage) || 1);
  const existingDepartments = departments;

  function resetToFirstPage() {
    setCurrentPage(1);
  }

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    resetToFirstPage();
  }

  function handleFiltersChange(next: DepartmentFilters) {
    setFilters(next);
    resetToFirstPage();
  }

  function handlePerPageChange(next: number) {
    setPerPage(next);
    resetToFirstPage();
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    resetToFirstPage();
  }

  function handleAddClick() {
    clearSelectedDepartment();
    setIsEditMode(false);
    setFormOpen(true);
  }

  async function handleEditClick(d: Department) {
    setIsEditMode(true);
    setSelectedDepartment(d);
    setFormOpen(true);
    const result = await fetchDepartmentByIdAction(d.id);
    if (fetchDepartmentById.rejected.match(result)) {
      toast.error(result.payload ?? "Failed to load department details");
      handleFormOpenChange(false);
    }
  }

  function handleFormOpenChange(open: boolean) {
    setFormOpen(open);
    if (!open) {
      setIsEditMode(false);
      clearSelectedDepartment();
    }
  }

  function handleDeleteClick(d: Department) {
    const empCount = countDepartmentEmployees(d);
    setDeptToDelete(d);
    if (empCount > 0) {
      setCannotDeleteAlertOpen(true);
    } else {
      setDeleteAlertOpen(true);
    }
  }

  async function handleConfirmDelete() {
    if (!deptToDelete) return;

    const action = await deleteDepartment(deptToDelete.id);
    if (deleteDepartmentThunk.fulfilled.match(action)) {
      toast.success("Department Deleted Successfully");
      reloadDepartments();
    } else {
      toast.error(typeof action.payload === "string" ? action.payload : "Failed to delete department");
    }
    setDeleteAlertOpen(false);
    setDeptToDelete(null);
  }

  function handleViewClick(d: Department) {
    setProfileDept(d);
    setProfileOpen(true);
  }

  async function handleSaveDepartment(d: Partial<Department>) {
    setIsSaving(true);
    try {
      const exists = departments.some((dept) => dept.id === d.id);
      const action =
        exists && d.id
          ? await updateDepartment(d as Partial<Department> & { id: string })
          : await createDepartment(d);

      if (updateDepartmentThunk.fulfilled.match(action) || createDepartmentThunk.fulfilled.match(action)) {
        toast.success(exists ? "Department Updated Successfully" : "Department Created Successfully");
        handleFormOpenChange(false);
        reloadDepartments();
      } else {
        toast.error(typeof action.payload === "string" ? action.payload : "Failed to save department");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An unexpected error occurred";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }

  function handleClearFilters() {
    setSearchQuery("");
    setFilters({ ...DEFAULT_FILTERS });
    resetToFirstPage();
    toast.success("Filters Reset Successfully");
  }

  function getExportData() {
    return getDepartmentsExportData(processedDepartments);
  }

  function handleExportCSV() {
    exportDepartmentsCSV(getExportData());
  }

  function handleExportExcel() {
    handleExportCSV();
  }

  function handleExportPDF() {
    exportDepartmentsPDF(getExportData());
  }

  function handlePromoteEmployee(empId: string, newDesignation: string) {
    dispatch(promoteDepartmentEmployee({ employeeId: empId, newDesignation }));
  }

  async function handleImportDepartments(imported: Department[]) {
    const action = await dispatch(importDepartmentsThunk(imported));
    if (importDepartmentsThunk.fulfilled.match(action)) {
      toast.success("Departments imported successfully");
      reloadDepartments();
    } else {
      toast.error(typeof action.payload === "string" ? action.payload : "Failed to import departments");
    }
  }

  function onTransferEmployee(_fromId: string, toId: string, empId: string) {
    addEmployeeToDept(toId, empId);
  }

  return {
    activeTab,
    setActiveTab,
    departments,
    loading,
    error,
    summary,
    summaryLoading,
    reloadDepartments,
    managers,
    searchQuery,
    filters,
    showAdvancedFilters,
    setShowAdvancedFilters,
    sortField,
    sortDir,
    currentPage,
    setCurrentPage,
    perPage,
    processedDepartments,
    paginatedDepartments,
    totalPages,
    existingDepartments,
    formOpen,
    handleFormOpenChange,
    isEditMode,
    selectedDepartment,
    selectedDepartmentLoading,
    profileOpen,
    setProfileOpen,
    profileDept,
    importOpen,
    setImportOpen,
    isSaving,
    deleteAlertOpen,
    setDeleteAlertOpen,
    deptToDelete,
    cannotDeleteAlertOpen,
    setCannotDeleteAlertOpen,
    addEmployeeToDept,
    removeEmployeeFromDept,
    handleSearchChange,
    handleFiltersChange,
    handlePerPageChange,
    handleSort,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleConfirmDelete,
    handleViewClick,
    handleSaveDepartment,
    handleClearFilters,
    handleExportCSV,
    handleExportExcel,
    handleExportPDF,
    handlePromoteEmployee,
    handleImportDepartments,
    onTransferEmployee,
  };
}
