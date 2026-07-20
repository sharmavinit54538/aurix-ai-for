import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { apiInstance } from "@/api";
import { useAppDispatch } from "@/redux/hooks";
import { useAurix } from "@/lib/aurix-store";
import { useManagersList } from "../../managers/hooks/useManagersList";
import { useManagers } from "../../managers/hooks/useManagers";
import { useDepartments } from "./useDepartments";
import {
  createDepartment as createDepartmentThunk,
  updateDepartment as updateDepartmentThunk,
  deleteDepartment as deleteDepartmentThunk,
  fetchDepartmentById,
  // bulkDeleteDepartments,
  importDepartments as importDepartmentsThunk,
  promoteDepartmentEmployee,
  mapBackendToFrontend,
} from "../departmentsThunk";
import type { Department, DepartmentFilters, SortDir, SortField } from "../types";
import { DEFAULT_FILTERS } from "../constants";
import { applySorting } from "../utils";
import {
  exportDepartmentsCSV,
  exportDepartmentsPDF,
  getDepartmentsExportData,
} from "../utils/departmentExport";

function countDepartmentEmployees(
  dept: Department,
  employees: ReturnType<typeof useAurix>["employees"],
) {
  return employees.filter(
    (e) =>
      (e.department && e.department.toLowerCase() === dept.name.toLowerCase()) ||
      dept.employeeIds.includes(e.id),
  ).length;
}

export function useDepartmentsPage() {
  const dispatch = useAppDispatch();
  const ws = useAurix();
  const {
    departments,
    loading,
    fetchDepartments,
    fetchDepartmentById: fetchDepartmentByIdAction,
    clearSelectedDepartment,
    setSelectedDepartment,
    selectedDepartment,
    selectedDepartmentLoading,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    // bulkDelete,
    // bulkSetStatus,
    // bulkAssignManager,
    addEmployeeToDept,
    removeEmployeeFromDept,
    transferEmployees,
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
  // const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [formOpen, setFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileDept, setProfileDept] = useState<Department | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Bulk action state disabled
  // const [bulkAssignManagerOpen, setBulkAssignManagerOpen] = useState(false);
  // const [bulkManagerId, setBulkManagerId] = useState("");
  // const [bulkTransferOpen, setBulkTransferOpen] = useState(false);
  // const [bulkTransferTargetDeptId, setBulkTransferTargetDeptId] = useState("");

  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState<Department | null>(null);
  const [cannotDeleteAlertOpen, setCannotDeleteAlertOpen] = useState(false);
  // const [bulkDeleteAlertOpen, setBulkDeleteAlertOpen] = useState(false);
  // const [cannotBulkDeleteAlertOpen, setCannotBulkDeleteAlertOpen] = useState(false);

  const [allDeptsForStats, setAllDeptsForStats] = useState<Department[]>([]);

  const fetchStatsData = useCallback(async () => {
    try {
      const response = await apiInstance.get("/departments", { params: { limit: 100 } });
      const items = response.data?.data?.items ?? [];
      setAllDeptsForStats(items.map(mapBackendToFrontend));
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  }, []);

  const reloadDepartments = useCallback(() => {
    fetchDepartments({
      search: searchQuery || undefined,
      status: filters.status,
      page: currentPage,
      limit: perPage,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filters.status, currentPage, perPage]);

  const statsLoaded = useRef(false);
  useEffect(() => {
    if (!statsLoaded.current) {
      statsLoaded.current = true;
      fetchStatsData();
      fetchManagersList({ limit: 100 });
    }
  }, [fetchStatsData, fetchManagersList]);

  useEffect(() => {
    reloadDepartments();
  }, [reloadDepartments]);

  const processedDepartments = useMemo(() => {
    let list = departments;

    if (filters.office !== "all") {
      list = list.filter((d) => d.office === filters.office);
    }
    if (filters.managerId !== "all") {
      list = list.filter((d) => d.departmentHeadId === filters.managerId);
    }
    if (filters.employeeCountRange !== "all") {
      list = list.filter((d) => {
        const ec = d.currentEmployeeCount;
        if (filters.employeeCountRange === "0-10") return ec >= 0 && ec <= 10;
        if (filters.employeeCountRange === "11-30") return ec >= 11 && ec <= 30;
        if (filters.employeeCountRange === "31-50") return ec >= 31 && ec <= 50;
        if (filters.employeeCountRange === "50+") return ec > 50;
        return true;
      });
    }
    if (filters.createdDateFrom) {
      list = list.filter((d) => d.createdDate >= filters.createdDateFrom);
    }
    if (filters.createdDateTo) {
      list = list.filter((d) => d.createdDate <= filters.createdDateTo);
    }

    return applySorting(list, sortField, sortDir);
  }, [departments, filters, sortField, sortDir]);

  const paginatedDepartments = processedDepartments;
  const totalPages = Math.max(1, Math.ceil(processedDepartments.length / perPage) || 1);
  const existingDepartments = allDeptsForStats.length > 0 ? allDeptsForStats : departments;

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

  // Bulk select disabled
  // function handleSelectAll(checked: boolean) {
  //   setSelectedIds(checked ? paginatedDepartments.map((d) => d.id) : []);
  // }
  //
  // function handleSelectRow(id: string, checked: boolean) {
  //   setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
  // }

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
    const empCount = countDepartmentEmployees(d, ws.employees);
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
      // setSelectedIds((prev) => prev.filter((id) => id !== deptToDelete.id));
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
        fetchStatsData();
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

  // Bulk actions disabled
  // function handleBulkDeleteClick() {
  //   const hasEmployees = selectedIds.some((id) => {
  //     const dept = departments.find((d) => d.id === id);
  //     return dept ? countDepartmentEmployees(dept, ws.employees) > 0 : false;
  //   });
  //
  //   if (hasEmployees) {
  //     setCannotBulkDeleteAlertOpen(true);
  //   } else {
  //     setBulkDeleteAlertOpen(true);
  //   }
  // }
  //
  // async function handleConfirmBulkDelete() {
  //   const action = await bulkDelete(selectedIds);
  //   if (bulkDeleteDepartments.fulfilled.match(action)) {
  //     toast.success(`${selectedIds.length} Departments Deleted Successfully`);
  //     setSelectedIds([]);
  //     reloadDepartments();
  //   } else {
  //     toast.error(typeof action.payload === "string" ? action.payload : "Failed to bulk delete departments");
  //   }
  //   setBulkDeleteAlertOpen(false);
  // }
  //
  // function handleBulkStatusChange(status: Department["status"]) {
  //   bulkSetStatus(selectedIds, status);
  //   const statusLabels: Record<Department["status"], string> = {
  //     active: "Activated",
  //     inactive: "Deactivated",
  //     hiring: "Hired Status Opened",
  //     growing: "Growing Status Set",
  //   };
  //   toast.success(`${selectedIds.length} Departments ${statusLabels[status]} Successfully`);
  //   setSelectedIds([]);
  // }
  //
  // function handleBulkAssignManagerClick() {
  //   setBulkManagerId(managers[0]?.id || "");
  //   setBulkAssignManagerOpen(true);
  // }
  //
  // function handleConfirmBulkAssignManager() {
  //   const mgr = managers.find((m) => m.id === bulkManagerId);
  //   if (!mgr) return;
  //
  //   bulkAssignManager(selectedIds, mgr.id, mgr.fullName);
  //   toast.success(`Assigned ${mgr.fullName} as Head Manager of ${selectedIds.length} departments`);
  //   setSelectedIds([]);
  //   setBulkAssignManagerOpen(false);
  // }
  //
  // function handleBulkTransferClick() {
  //   const validTargets = departments.filter((d) => !selectedIds.includes(d.id));
  //   setBulkTransferTargetDeptId(validTargets[0]?.id || "");
  //   setBulkTransferOpen(true);
  // }
  //
  // function handleConfirmBulkTransfer() {
  //   const targetDept = departments.find((d) => d.id === bulkTransferTargetDeptId);
  //   if (!targetDept) return;
  //
  //   selectedIds.forEach((fromId) => {
  //     transferEmployees(fromId, targetDept.id);
  //   });
  //   toast.success(`Transferred employees from selected divisions into ${targetDept.name}`);
  //   setSelectedIds([]);
  //   setBulkTransferOpen(false);
  // }

  function handleClearFilters() {
    setSearchQuery("");
    setFilters({ ...DEFAULT_FILTERS });
    resetToFirstPage();
    toast.success("Filters Reset Successfully");
  }

  function getExportData() {
    return getDepartmentsExportData(processedDepartments);
    // return getDepartmentsExportData(departments, processedDepartments, selectedIds);
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
      fetchStatsData();
    } else {
      toast.error(typeof action.payload === "string" ? action.payload : "Failed to import departments");
    }
  }

  function onTransferEmployee(fromId: string, toId: string, empId: string) {
    const fromDept = departments.find((d) => d.id === fromId);
    const toDept = departments.find((d) => d.id === toId);
    if (fromDept && toDept) {
      addEmployeeToDept(toId, empId);
    }
  }

  return {
    activeTab,
    setActiveTab,
    departments,
    loading,
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
    // selectedIds,
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
    // bulkAssignManagerOpen,
    // setBulkAssignManagerOpen,
    // bulkManagerId,
    // setBulkManagerId,
    // bulkTransferOpen,
    // setBulkTransferOpen,
    // bulkTransferTargetDeptId,
    // setBulkTransferTargetDeptId,
    deleteAlertOpen,
    setDeleteAlertOpen,
    deptToDelete,
    cannotDeleteAlertOpen,
    setCannotDeleteAlertOpen,
    // bulkDeleteAlertOpen,
    // setBulkDeleteAlertOpen,
    // cannotBulkDeleteAlertOpen,
    // setCannotBulkDeleteAlertOpen,
    allDeptsForStats,
    addEmployeeToDept,
    removeEmployeeFromDept,
    handleSearchChange,
    handleFiltersChange,
    handlePerPageChange,
    handleSort,
    // handleSelectAll,
    // handleSelectRow,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleConfirmDelete,
    handleViewClick,
    handleSaveDepartment,
    // handleBulkDeleteClick,
    // handleConfirmBulkDelete,
    // handleBulkStatusChange,
    // handleBulkAssignManagerClick,
    // handleConfirmBulkAssignManager,
    // handleBulkTransferClick,
    // handleConfirmBulkTransfer,
    handleClearFilters,
    handleExportCSV,
    handleExportExcel,
    handleExportPDF,
    handlePromoteEmployee,
    handleImportDepartments,
    onTransferEmployee,
  };
}
