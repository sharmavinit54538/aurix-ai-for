import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearSelectedManager } from "../managersSlice";
import { createManager, deleteManager, fetchManagerById, fetchManagers, importManagers, updateManager } from "../managersThunk";
import type { SaveManagerResult } from "../managersTypes";
import type { Manager, ManagerFilters, SortDir, SortField } from "../types";
import { DEFAULT_FILTERS } from "../constants";
import {
  applyFilters,
  applySorting,
  getVisiblePages,
  mapApiFieldErrors,
  validateManagerForm,
} from "../utils";
import {
  exportManagersCSV,
  exportManagersExcel,
  exportManagersPDF,
  getManagersExportData,
} from "../utils/managerExport";
import { useManagers } from "./useManagers";

export function useManagersPage() {
  const dispatch = useAppDispatch();
  const {
    managers,
    loading,
    submitting,
    error,
    total,
    totalPages: apiTotalPages,
    selectedManager,
    selectedManagerLoading,
    selectedManagerError,
    fetchManagerById: fetchManagerByIdAction,
    deleteManager: deleteManagerAction,
    createManager: createManagerAction,
    updateManager: updateManagerAction,
    bulkDelete,
    bulkSetStatus,
    importManagers: importManagersAction,
  } = useManagers();

  const managerForm = useAppSelector((state) => state.managers.managerForm);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<ManagerFilters>({ ...DEFAULT_FILTERS });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortField, setSortField] = useState<SortField>("fullName");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [formOpen, setFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);

  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [managerToDelete, setManagerToDelete] = useState<Manager | null>(null);
  const [bulkDeleteAlertOpen, setBulkDeleteAlertOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const refetchManagers = useCallback(() => {
    dispatch(
      fetchManagers({
        search: debouncedSearch.trim() || undefined,
        page: currentPage,
        limit: perPage,
      }),
    );
  }, [dispatch, debouncedSearch, currentPage, perPage]);

  useEffect(() => {
    refetchManagers();
  }, [refetchManagers]);

  const processedManagers = useMemo(() => {
    const filtered = applyFilters(managers, "", filters);
    return applySorting(filtered, sortField, sortDir);
  }, [managers, filters, sortField, sortDir]);

  const paginatedManagers = processedManagers;

  const totalPages = apiTotalPages;
  const visiblePages = useMemo(
    () => getVisiblePages(currentPage, totalPages),
    [currentPage, totalPages],
  );

  function resetToFirstPage() {
    setCurrentPage(1);
  }

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    resetToFirstPage();
  }

  function handleFiltersChange(next: ManagerFilters) {
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

  function handleSelectAll(checked: boolean) {
    setSelectedIds(checked ? paginatedManagers.map((m) => m.id) : []);
  }

  function handleSelectRow(id: string, checked: boolean) {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
  }

  function handleAddClick() {
    dispatch(clearSelectedManager());
    setIsEditMode(false);
    setFormOpen(true);
  }

  async function handleEditClick(manager: Manager) {
    setIsEditMode(true);
    setFormOpen(true);
    const result = await fetchManagerByIdAction(manager.id);
    if (fetchManagerById.rejected.match(result)) {
      toast.error(result.payload ?? "Failed to load manager details");
      setFormOpen(false);
      setIsEditMode(false);
      dispatch(clearSelectedManager());
    }
  }

  function handleDeleteClick(manager: Manager) {
    setManagerToDelete(manager);
    setDeleteAlertOpen(true);
  }

  async function handleConfirmDelete() {
    if (!managerToDelete) return;

    const result = await deleteManagerAction(managerToDelete.id);
    if (deleteManager.fulfilled.match(result)) {
      setSelectedIds((prev) => prev.filter((id) => id !== managerToDelete.id));
      toast.success("Manager Deleted Successfully");
      setDeleteAlertOpen(false);
      setManagerToDelete(null);
      refetchManagers();
    } else {
      toast.error(result.payload?.message ?? "Failed to delete manager");
    }
  }

  async function handleViewClick(manager: Manager) {
    setProfileOpen(true);
    const result = await fetchManagerByIdAction(manager.id);
    if (fetchManagerById.rejected.match(result)) {
      toast.error(result.payload ?? "Failed to load manager details");
      setProfileOpen(false);
      dispatch(clearSelectedManager());
    }
  }

  function handleFormOpenChange(open: boolean) {
    setFormOpen(open);
    if (!open) {
      setIsEditMode(false);
      dispatch(clearSelectedManager());
    }
  }

  function handleProfileOpenChange(open: boolean) {
    setProfileOpen(open);
    if (!open) {
      dispatch(clearSelectedManager());
    }
  }

  async function handleSaveManager(): Promise<SaveManagerResult> {
    const isEdit = isEditMode && !!selectedManager;
    const validation = validateManagerForm(managerForm, managers, isEdit, selectedManager?.id);
    if (!validation.valid) {
      return {
        success: false,
        message: "Please fix the highlighted fields",
        fieldErrors: validation.errors,
      };
    }

    if (isEdit && selectedManager) {
      const result = await updateManagerAction(selectedManager.id, managerForm);
      if (updateManager.fulfilled.match(result)) {
        toast.success("Manager Updated Successfully");
        handleFormOpenChange(false);
        refetchManagers();
        return { success: true };
      }

      const error = result.payload;
      return {
        success: false,
        message: error?.message ?? "Failed to update manager",
        fieldErrors: mapApiFieldErrors(error?.fieldErrors ?? {}),
      };
    }

    const result = await createManagerAction(managerForm);
    if (createManager.fulfilled.match(result)) {
      toast.success("Manager Created Successfully");
      handleFormOpenChange(false);
      refetchManagers();
      return { success: true };
    }

    const error = result.payload;
    return {
      success: false,
      message: error?.message ?? "Failed to create manager",
      fieldErrors: mapApiFieldErrors(error?.fieldErrors ?? {}),
    };
  }

  async function handleConfirmBulkDelete() {
    setSelectedIds([]);
    setBulkDeleteAlertOpen(false);
    toast.info("Bulk delete is currently unavailable.");
  }

  async function handleBulkStatusChange(_status: Manager["status"]) {
    setSelectedIds([]);
    toast.info("Bulk status change is currently unavailable.");
  }

  function handleClearFilters() {
    setSearchQuery("");
    setDebouncedSearch("");
    setFilters({ ...DEFAULT_FILTERS });
    resetToFirstPage();
    toast.success("Filters Reset Successfully");
  }

  async function handleImportManagers(imported: Manager[]) {
    const result = await importManagersAction(imported);
    if (!importManagers.fulfilled.match(result)) {
      toast.error("Failed to import managers");
    }
  }

  function getExportData() {
    return getManagersExportData(managers, processedManagers, selectedIds);
  }

  function handleExportCSV() {
    exportManagersCSV(getExportData());
  }

  function handleExportExcel() {
    exportManagersExcel(getExportData());
  }

  function handleExportPDF() {
    exportManagersPDF(getExportData());
  }

  return {
    managers,
    loading,
    submitting,
    error,
    total,
    refetch: refetchManagers,
    searchQuery,
    filters,
    showAdvancedFilters,
    setShowAdvancedFilters,
    sortField,
    sortDir,
    currentPage,
    setCurrentPage,
    perPage,
    selectedIds,
    processedManagers,
    paginatedManagers,
    totalPages,
    visiblePages,
    formOpen,
    handleFormOpenChange,
    isEditMode,
    selectedManager,
    selectedManagerLoading,
    selectedManagerError,
    profileOpen,
    handleProfileOpenChange,
    importOpen,
    setImportOpen,
    deleteAlertOpen,
    setDeleteAlertOpen,
    managerToDelete,
    bulkDeleteAlertOpen,
    setBulkDeleteAlertOpen,
    handleSearchChange,
    handleFiltersChange,
    handlePerPageChange,
    handleSort,
    handleSelectAll,
    handleSelectRow,
    handleAddClick,
    handleEditClick,
    handleDeleteClick,
    handleConfirmDelete,
    handleViewClick,
    handleSaveManager,
    handleConfirmBulkDelete,
    handleBulkStatusChange,
    handleClearFilters,
    handleImportManagers,
    handleExportCSV,
    handleExportExcel,
    handleExportPDF,
  };
}
