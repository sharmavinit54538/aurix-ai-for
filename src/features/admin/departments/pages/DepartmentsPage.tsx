import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Trash2,
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  FileText,
  UserCheck,
  ArrowRightLeft,
  Briefcase,
  HelpCircle,
  Building,
  BarChart,
  Network,
} from "lucide-react";
import { useDepartments } from "../hooks/useDepartments";
import { DepartmentStatsCards } from "../components/DepartmentStatsCards";
import { DepartmentsTable } from "../components/DepartmentsTable";
import { DepartmentFormDialog } from "../components/DepartmentFormDialog";
import { DepartmentProfileDrawer } from "../components/DepartmentProfileDrawer";
import { DepartmentHierarchy } from "../components/DepartmentHierarchy";
import { DepartmentAnalytics } from "../components/DepartmentAnalytics";
import { ImportDialog } from "../components/ImportDialog";
import type { Department, DepartmentFilters, SortField, SortDir } from "../types";
import { OFFICES, STATUS_OPTIONS, EMPLOYEE_COUNT_RANGES, DEFAULT_FILTERS } from "../constants";
import { applyFilters, applySorting, paginate, buildCSV } from "../utils";
import { useAurix } from "@/lib/aurix-store";
import { useManagersList } from "../managers/hooks/useManagersList";
import { toast } from "sonner";

export function DepartmentsPage() {
  const ws = useAurix();
  const {
    departments,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    bulkDelete,
    bulkSetStatus,
    bulkAssignManager,
    importDepartments,
    addEmployeeToDept,
    removeEmployeeFromDept,
    transferEmployees,
    promoteEmployee,
  } = useDepartments();

  // Navigation Tabs State
  const [activeTab, setActiveTab] = useState("directory");

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<DepartmentFilters>({ ...DEFAULT_FILTERS });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Sorting State
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Dialog / Drawer States
  const [formOpen, setFormOpen] = useState(false);
  const [activeDept, setActiveDept] = useState<Department | null>(null); // For Add/Edit
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileDept, setProfileDept] = useState<Department | null>(null); // For view details drawer
  const [importOpen, setImportOpen] = useState(false);

  // Modals for Bulk Actions
  const [bulkAssignManagerOpen, setBulkAssignManagerOpen] = useState(false);
  const [bulkManagerId, setBulkManagerId] = useState("");
  const [bulkTransferOpen, setBulkTransferOpen] = useState(false);
  const [bulkTransferTargetDeptId, setBulkTransferTargetDeptId] = useState("");

  // Delete Alert States
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState<Department | null>(null);
  const [cannotDeleteAlertOpen, setCannotDeleteAlertOpen] = useState(false);
  const [bulkDeleteAlertOpen, setBulkDeleteAlertOpen] = useState(false);
  const [cannotBulkDeleteAlertOpen, setCannotBulkDeleteAlertOpen] = useState(false);

  // Get managers for bulk actions
  const managers = useManagersList();

  // Processed departments
  const processedDepartments = useMemo(() => {
    const filtered = applyFilters(departments, searchQuery, filters);
    return applySorting(filtered, sortField, sortDir);
  }, [departments, searchQuery, filters, sortField, sortDir]);

  // Paginated departments
  const paginatedDepartments = useMemo(() => {
    return paginate(processedDepartments, currentPage, perPage);
  }, [processedDepartments, currentPage, perPage]);

  const totalPages = Math.ceil(processedDepartments.length / perPage);

  // Handlers
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedDepartments.map((d) => d.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((x) => x !== id));
    }
  };

  // CRUD Actions
  const handleAddClick = () => {
    setActiveDept(null);
    setFormOpen(true);
  };

  const handleEditClick = (d: Department) => {
    setActiveDept(d);
    setFormOpen(true);
  };

  const handleDeleteClick = (d: Department) => {
    // Check if department has employees assigned (from global store or local list)
    const empCount = ws.employees.filter(
      (e) => (e.department && e.department.toLowerCase() === d.name.toLowerCase()) || d.employeeIds.includes(e.id)
    ).length;

    if (empCount > 0) {
      setDeptToDelete(d);
      setCannotDeleteAlertOpen(true);
    } else {
      setDeptToDelete(d);
      setDeleteAlertOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (deptToDelete) {
      deleteDepartment(deptToDelete.id);
      setSelectedIds((prev) => prev.filter((id) => id !== deptToDelete.id));
      toast.success("Department Deleted Successfully");
      setDeleteAlertOpen(false);
      setDeptToDelete(null);
    }
  };

  const handleViewClick = (d: Department) => {
    setProfileDept(d);
    setProfileOpen(true);
  };

  const handleSaveDepartment = (d: Department) => {
    const exists = departments.some((dept) => dept.id === d.id);
    if (exists) {
      updateDepartment(d);
      // Synchronize changes inside active view drawer if open
      if (profileDept?.id === d.id) {
        setProfileDept(d);
      }
    } else {
      createDepartment(d);
    }
  };

  // Bulk operations
  const handleBulkDeleteClick = () => {
    // Check if any selected department contains employees
    const hasEmployees = selectedIds.some((id) => {
      const dept = departments.find((d) => d.id === id);
      if (!dept) return false;
      const count = ws.employees.filter(
        (e) => (e.department && e.department.toLowerCase() === dept.name.toLowerCase()) || dept.employeeIds.includes(e.id)
      ).length;
      return count > 0;
    });

    if (hasEmployees) {
      setCannotBulkDeleteAlertOpen(true);
    } else {
      setBulkDeleteAlertOpen(true);
    }
  };

  const handleConfirmBulkDelete = () => {
    bulkDelete(selectedIds);
    toast.success(`${selectedIds.length} Departments Deleted Successfully`);
    setSelectedIds([]);
    setBulkDeleteAlertOpen(false);
  };

  const handleBulkStatusChange = (status: Department["status"]) => {
    bulkSetStatus(selectedIds, status);
    const statusLabels: Record<Department["status"], string> = {
      active: "Activated",
      inactive: "Deactivated",
      hiring: "Hired Status Opened",
      growing: "Growing Status Set",
    };
    toast.success(`${selectedIds.length} Departments ${statusLabels[status]} Successfully`);
    setSelectedIds([]);
  };

  const handleBulkAssignManagerClick = () => {
    setBulkManagerId(managers[0]?.id || "");
    setBulkAssignManagerOpen(true);
  };

  const handleConfirmBulkAssignManager = () => {
    const mgr = managers.find((m) => m.id === bulkManagerId);
    if (mgr) {
      bulkAssignManager(selectedIds, mgr.id, mgr.fullName);
      toast.success(`Assigned ${mgr.fullName} as Head Manager of ${selectedIds.length} departments`);
      setSelectedIds([]);
      setBulkAssignManagerOpen(false);
    }
  };

  const handleBulkTransferClick = () => {
    // Must select a target department that isn't in the selected list
    const validTargets = departments.filter((d) => !selectedIds.includes(d.id));
    setBulkTransferTargetDeptId(validTargets[0]?.id || "");
    setBulkTransferOpen(true);
  };

  const handleConfirmBulkTransfer = () => {
    const targetDept = departments.find((d) => d.id === bulkTransferTargetDeptId);
    if (targetDept) {
      selectedIds.forEach((fromId) => {
        transferEmployees(fromId, targetDept.id);
      });
      toast.success(`Transferred employees from selected divisions into ${targetDept.name}`);
      setSelectedIds([]);
      setBulkTransferOpen(false);
    }
  };

  // Reset filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setFilters({ ...DEFAULT_FILTERS });
    setCurrentPage(1);
    toast.success("Filters Reset Successfully");
  };

  // Export handlers
  const handleExportCSV = () => {
    const data = selectedIds.length > 0
      ? departments.filter((d) => selectedIds.includes(d.id))
      : processedDepartments;

    if (data.length === 0) {
      toast.error("No departments available to export");
      return;
    }

    const csvContent = buildCSV(data);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `aurix_departments_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Export Completed Successfully");
  };

  const handleExportExcel = () => {
    handleExportCSV();
  };

  const handleExportPDF = () => {
    const data = selectedIds.length > 0
      ? departments.filter((d) => selectedIds.includes(d.id))
      : processedDepartments;

    if (data.length === 0) {
      toast.error("No departments available to export");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Popup blocked! Enable popups to export as PDF.");
      return;
    }

    const rowsHTML = data.map((d) => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px; font-size: 11px;">${d.code}</td>
        <td style="padding: 10px; font-size: 11px; font-weight: bold;">${d.name}</td>
        <td style="padding: 10px; font-size: 11px;">${d.departmentHeadName}</td>
        <td style="padding: 10px; font-size: 11px;">${d.office}</td>
        <td style="padding: 10px; font-size: 11px;">${d.currentEmployeeCount} / ${d.employeeCapacity}</td>
        <td style="padding: 10px; font-size: 11px;">$${d.budget.toLocaleString()}</td>
        <td style="padding: 10px; font-size: 11px;">${d.status.toUpperCase()}</td>
        <td style="padding: 10px; font-size: 11px;">${d.createdDate}</td>
      </tr>
    `).join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Departments Directory - Aurix HRMS</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 20px; color: #333; }
            h1 { font-size: 18px; margin-bottom: 5px; }
            p { font-size: 12px; margin-bottom: 20px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background: #f5f5f5; text-align: left; padding: 10px; font-size: 11px; font-weight: bold; border-bottom: 2px solid #ddd; }
          </style>
        </head>
        <body>
          <h1>Departments Directory</h1>
          <p>Generated on ${new Date().toLocaleDateString()} • Total Records: ${data.length}</p>
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Department Name</th>
                <th>Head Manager</th>
                <th>Office Location</th>
                <th>Employees / Cap</th>
                <th>Annual Budget</th>
                <th>Status</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHTML}
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    toast.success("PDF Printing Triggered");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader
          title="Departments Manager"
          description="Design division frameworks, allocate corporate budgets, configure hierarchy trees, and balance employee capacities."
        />
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button
            onClick={() => setImportOpen(true)}
            variant="outline"
            className="rounded-xl border-border bg-card/60 hover:bg-muted text-xs font-semibold gap-1.5 h-10 px-4 flex-1 sm:flex-initial"
          >
            <Upload className="h-4 w-4" />
            Import CSV
          </Button>
          <Button
            onClick={handleAddClick}
            className="rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90 text-xs font-semibold gap-1.5 h-10 px-4 flex-1 sm:flex-initial"
          >
            <Plus className="h-4 w-4" />
            Add Department
          </Button>
        </div>
      </div>

      {/* Tabs list to toggle between List, Tree Hierarchy, and Recharts Charts */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/80 pb-2">
          <TabsList className="bg-muted/40 p-1 rounded-xl h-10">
            <TabsTrigger value="directory" className="rounded-lg text-xs font-medium px-4 flex items-center gap-1.5">
              <Building className="h-3.5 w-3.5" />
              List Directory
            </TabsTrigger>
            <TabsTrigger value="hierarchy" className="rounded-lg text-xs font-medium px-4 flex items-center gap-1.5">
              <Network className="h-3.5 w-3.5" />
              Reporting Hierarchy
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg text-xs font-medium px-4 flex items-center gap-1.5">
              <BarChart className="h-3.5 w-3.5" />
              Charts & Analytics
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Directory List */}
        <TabsContent value="directory" className="space-y-6 mt-0">
          {/* Stats Cards Section */}
          <DepartmentStatsCards departments={departments} />

          <div className="rounded-2xl border border-border/60 bg-card/40 p-5 shadow-sm backdrop-blur-xl space-y-4">
            {/* Search, Clear & Actions Header */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
              {/* Search input and advanced filters toggles */}
              <div className="flex flex-1 items-center gap-2 max-w-lg">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by department name, code, head, manager or office..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-9 pr-4 rounded-xl border-border/80 bg-background/50 h-9 text-xs focus-visible:ring-brand"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`rounded-xl border-border/80 h-9 gap-1.5 text-xs font-medium cursor-pointer ${
                    showAdvancedFilters ? "bg-muted text-foreground" : "bg-background/40 hover:bg-muted/40"
                  }`}
                >
                  <Filter className="h-3.5 w-3.5" />
                  Filters
                </Button>
                {(searchQuery || Object.values(filters).some((v) => v && v !== "all")) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="text-xs text-rose-500 hover:bg-rose-500/10 cursor-pointer h-9 px-2 rounded-xl"
                  >
                    Reset
                  </Button>
                )}
              </div>

              {/* Right Export & Bulk Modification actions */}
              <div className="flex items-center gap-2 justify-end">
                {/* Bulk Actions Dropdown */}
                {selectedIds.length > 0 && (
                  <div className="flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                    <span className="text-xs text-muted-foreground mr-1">
                      {selectedIds.length} selected:
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl border-border/80 h-9 text-xs bg-background/40 hover:bg-muted/40 font-semibold cursor-pointer"
                        >
                          Bulk Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl border-border bg-card">
                        <DropdownMenuLabel className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Modify Status</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleBulkStatusChange("active")}
                          className="text-xs flex items-center gap-1.5 cursor-pointer py-1.5"
                        >
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                          Activate Departments
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleBulkStatusChange("inactive")}
                          className="text-xs flex items-center gap-1.5 cursor-pointer py-1.5"
                        >
                          <XCircle className="h-3.5 w-3.5 text-rose-500" />
                          Deactivate Departments
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/60" />
                        <DropdownMenuLabel className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Management Scope</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={handleBulkAssignManagerClick}
                          className="text-xs flex items-center gap-1.5 cursor-pointer py-1.5"
                        >
                          <UserCheck className="h-3.5 w-3.5 text-blue-500" />
                          Assign Head Manager
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={handleBulkTransferClick}
                          className="text-xs flex items-center gap-1.5 cursor-pointer py-1.5"
                        >
                          <ArrowRightLeft className="h-3.5 w-3.5 text-purple-500" />
                          Transfer Employees
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/60" />
                        <DropdownMenuItem
                          onClick={handleBulkDeleteClick}
                          className="text-xs flex items-center gap-1.5 cursor-pointer py-1.5 text-rose-500 hover:bg-rose-500/10 focus:text-rose-500"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete Selected
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}

                {/* Standard Export Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-border/80 h-9 gap-1.5 text-xs bg-background/40 hover:bg-muted/40 font-semibold cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl border-border bg-card">
                    <DropdownMenuLabel className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Download Options</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={handleExportCSV}
                      className="text-xs flex items-center gap-2 cursor-pointer py-2"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-500" />
                      Export CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleExportExcel}
                      className="text-xs flex items-center gap-2 cursor-pointer py-2"
                    >
                      <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                      Export Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleExportPDF}
                      className="text-xs flex items-center gap-2 cursor-pointer py-2"
                    >
                      <FileText className="h-3.5 w-3.5 text-rose-500" />
                      Export PDF / Print
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Advanced Filters Panel */}
            {showAdvancedFilters && (
              <div className="grid grid-cols-1 gap-4 rounded-xl border border-border/40 bg-muted/10 p-4 md:grid-cols-3 lg:grid-cols-5 animate-in fade-in duration-200">
                {/* Status */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Status</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(val) => {
                      setFilters((prev) => ({ ...prev, status: val }));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 rounded-lg text-xs bg-background">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Office Location */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Office Location</Label>
                  <Select
                    value={filters.office}
                    onValueChange={(val) => {
                      setFilters((prev) => ({ ...prev, office: val }));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 rounded-lg text-xs bg-background">
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {OFFICES.map((off) => (
                        <SelectItem key={off} value={off}>{off}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Employee Count Range */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Employee Count</Label>
                  <Select
                    value={filters.employeeCountRange}
                    onValueChange={(val) => {
                      setFilters((prev) => ({ ...prev, employeeCountRange: val }));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 rounded-lg text-xs bg-background">
                      <SelectValue placeholder="Any Size" />
                    </SelectTrigger>
                    <SelectContent>
                      {EMPLOYEE_COUNT_RANGES.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Department Head Manager */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Department Head</Label>
                  <Select
                    value={filters.managerId}
                    onValueChange={(val) => {
                      setFilters((prev) => ({ ...prev, managerId: val }));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 rounded-lg text-xs bg-background">
                      <SelectValue placeholder="All Managers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Managers</SelectItem>
                      {managers.map((mgr) => (
                        <SelectItem key={mgr.id} value={mgr.id}>{mgr.fullName}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Created Date range */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Created Since</Label>
                  <Input
                    type="date"
                    value={filters.createdDateFrom}
                    onChange={(e) => {
                      setFilters((prev) => ({ ...prev, createdDateFrom: e.target.value }));
                      setCurrentPage(1);
                    }}
                    className="h-8 rounded-lg text-xs bg-background px-2 py-0 border-border/80"
                  />
                </div>
              </div>
            )}

            {/* List Table and Empty states */}
            {processedDepartments.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/80 bg-card/10 p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-muted/60 text-muted-foreground shadow-sm">
                  <Building className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-lg text-foreground">No Departments Found</h4>
                <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                  {departments.length === 0
                    ? "Create your first department division to organize your corporate directory hierarchy."
                    : "No corporate divisions match your search query. Try clearing filters."}
                </p>
                <Button
                  onClick={departments.length === 0 ? handleAddClick : handleClearFilters}
                  className="mt-5 rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90 font-semibold text-xs h-9 px-4 cursor-pointer"
                >
                  {departments.length === 0 ? "Create Department" : "Reset Filters"}
                </Button>
              </div>
            ) : (
              <>
                <DepartmentsTable
                  departments={paginatedDepartments}
                  selectedIds={selectedIds}
                  onSelectAll={handleSelectAll}
                  onSelectRow={handleSelectRow}
                  onView={handleViewClick}
                  onEdit={handleEditClick}
                  onDelete={handleDeleteClick}
                  sortField={sortField}
                  sortDir={sortDir}
                  onSort={handleSort}
                />

                {/* Pagination footer */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">
                      Showing {Math.min(processedDepartments.length, (currentPage - 1) * perPage + 1)} to{" "}
                      {Math.min(processedDepartments.length, currentPage * perPage)} of {processedDepartments.length} entries
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">Per Page:</span>
                      <Select
                        value={String(perPage)}
                        onValueChange={(val) => {
                          setPerPage(Number(val));
                          setCurrentPage(1);
                        }}
                      >
                        <SelectTrigger className="h-7 w-[60px] rounded-lg text-xs bg-background px-1 py-0">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="h-8 w-8 rounded-lg border-border/80 bg-background/50 hover:bg-muted disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const pNum = i + 1;
                      return (
                        <Button
                          key={pNum}
                          variant={currentPage === pNum ? "default" : "outline"}
                          size="icon"
                          onClick={() => setCurrentPage(pNum)}
                          className={`h-8 w-8 rounded-lg text-xs font-semibold cursor-pointer ${
                            currentPage === pNum ? "bg-brand text-brand-foreground shadow-glow hover:bg-brand/90" : "border-border/80 bg-background/50 hover:bg-muted"
                          }`}
                        >
                          {pNum}
                        </Button>
                      );
                    })}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 rounded-lg border-border/80 bg-background/50 hover:bg-muted disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </TabsContent>

        {/* Tab 2: Reporting Hierarchy Tree */}
        <TabsContent value="hierarchy" className="mt-0 space-y-6">
          <DepartmentHierarchy departments={departments} onView={handleViewClick} />
        </TabsContent>

        {/* Tab 3: Recharts Analytics Charts */}
        <TabsContent value="analytics" className="mt-0 space-y-6">
          <DepartmentAnalytics departments={departments} />
        </TabsContent>
      </Tabs>

      {/* Add / Edit Dialog */}
      <DepartmentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        department={activeDept}
        existingDepartments={departments}
        onSave={handleSaveDepartment}
      />

      {/* View Details Drawer */}
      <DepartmentProfileDrawer
        open={profileOpen}
        onOpenChange={setProfileOpen}
        department={profileDept}
        departments={departments}
        onAddEmployee={addEmployeeToDept}
        onRemoveEmployee={removeEmployeeFromDept}
        onTransferEmployee={onTransferEmployee}
        onPromoteEmployee={promoteEmployee}
        onUpdateDepartment={handleSaveDepartment}
      />

      {/* CSV Spreadsheet Importer */}
      <ImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        existingDepartments={departments}
        onImport={importDepartments}
      />

      {/* Bulk Assign Manager dialog Modal */}
      <Dialog open={bulkAssignManagerOpen} onOpenChange={setBulkAssignManagerOpen}>
        <DialogContent className="rounded-2xl border-border bg-card p-6 backdrop-blur-xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bold text-lg">Assign Department Head Manager</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <Label htmlFor="bulkMgr">Select Head Manager</Label>
            <Select value={bulkManagerId} onValueChange={setBulkManagerId}>
              <SelectTrigger id="bulkMgr" className="h-10 text-xs bg-background">
                <SelectValue placeholder="Select Manager" />
              </SelectTrigger>
              <SelectContent>
                {managers.map((mgr) => (
                  <SelectItem key={mgr.id} value={mgr.id}>{mgr.fullName} ({mgr.designation})</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground mt-2">
              This will assign the chosen manager as the head lead of all {selectedIds.length} selected divisions.
            </p>
          </div>
          <DialogFooter className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setBulkAssignManagerOpen(false)} className="rounded-xl border-border bg-card">
              Cancel
            </Button>
            <Button onClick={handleConfirmBulkAssignManager} className="rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90">
              Assign Manager
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Transfer Employees dialog Modal */}
      <Dialog open={bulkTransferOpen} onOpenChange={setBulkTransferOpen}>
        <DialogContent className="rounded-2xl border-border bg-card p-6 backdrop-blur-xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bold text-lg">Bulk Transfer Employees</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <Label htmlFor="bulkTransferTarget">Select Target Department</Label>
            <Select value={bulkTransferTargetDeptId} onValueChange={setBulkTransferTargetDeptId}>
              <SelectTrigger id="bulkTransferTarget" className="h-10 text-xs bg-background">
                <SelectValue placeholder="Select Division" />
              </SelectTrigger>
              <SelectContent>
                {departments
                  .filter((d) => !selectedIds.includes(d.id))
                  .map((d) => (
                    <SelectItem key={d.id} value={d.id}>{d.name} ({d.code})</SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground mt-2">
              This will transfer all employees from all selected departments into the chosen target department, leaving the source departments empty.
            </p>
          </div>
          <DialogFooter className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setBulkTransferOpen(false)} className="rounded-xl border-border bg-card">
              Cancel
            </Button>
            <Button onClick={handleConfirmBulkTransfer} className="rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90">
              Transfer Employees
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert 1: Confirm Single Delete */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent className="rounded-2xl border-border bg-card p-6 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-lg">Are you sure you want to delete this department?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
              This action is permanent and cannot be undone. This will delete the{" "}
              <span className="font-semibold text-foreground">{deptToDelete?.name}</span> division from organizational schemas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex gap-2 justify-end">
            <AlertDialogCancel className="rounded-xl border-border bg-card hover:bg-muted">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="rounded-xl bg-rose-500 text-white hover:bg-rose-600 shadow-glow border-none">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert 2: Cannot Delete Single because of employees */}
      <AlertDialog open={cannotDeleteAlertOpen} onOpenChange={setCannotDeleteAlertOpen}>
        <AlertDialogContent className="rounded-2xl border-border bg-card p-6 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-lg text-rose-500">Cannot Delete Department</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
              This department contains employees. Please transfer them before deleting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex gap-2 justify-end">
            <Button onClick={() => setCannotDeleteAlertOpen(false)} className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 shadow-glow border-none">
              Acknowledge
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert 3: Confirm Bulk Delete */}
      <AlertDialog open={bulkDeleteAlertOpen} onOpenChange={setBulkDeleteAlertOpen}>
        <AlertDialogContent className="rounded-2xl border-border bg-card p-6 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-lg">Confirm Bulk Delete Departments</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
              Are you sure you want to delete the <span className="font-semibold text-foreground">{selectedIds.length}</span> selected
              departments? This action is irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex gap-2 justify-end">
            <AlertDialogCancel className="rounded-xl border-border bg-card hover:bg-muted">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmBulkDelete} className="rounded-xl bg-rose-500 text-white hover:bg-rose-600 shadow-glow border-none">
              Delete Selected
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Alert 4: Cannot Bulk Delete because of employees */}
      <AlertDialog open={cannotBulkDeleteAlertOpen} onOpenChange={setCannotBulkDeleteAlertOpen}>
        <AlertDialogContent className="rounded-2xl border-border bg-card p-6 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-lg text-rose-500">Cannot Complete Bulk Delete</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
              One or more selected departments contain active employees. Please transfer all employees before attempting deletion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex gap-2 justify-end">
            <Button onClick={() => setCannotBulkDeleteAlertOpen(false)} className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 shadow-glow border-none">
              Acknowledge
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );

  // Helper transfer logic for drawer integration
  function onTransferEmployee(fromId: string, toId: string, empId: string) {
    // 1. Remove employee from old dept
    // 2. Add employee to new dept
    const fromDept = departments.find((d) => d.id === fromId);
    const toDept = departments.find((d) => d.id === toId);
    if (fromDept && toDept) {
      addEmployeeToDept(toId, empId);
    }
  }
}
