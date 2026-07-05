import React, { useState, useMemo } from "react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Search,
  Filter,
  Download,
  Upload,
  Trash2,
  CheckCircle,
  XCircle,
  FileSpreadsheet,
  FileText,
  RefreshCw,
  FolderOpen,
} from "lucide-react";
import { useManagers } from "../hooks/useManagers";
import { ManagerStatsCards } from "../components/ManagerStatsCards";
import { ManagersTable } from "../components/ManagersTable";
import { ManagerFormDialog } from "../components/ManagerFormDialog";
import { ManagerProfileDrawer } from "../components/ManagerProfileDrawer";
import { ImportDialog } from "../components/ImportDialog";
import type { Manager, ManagerFilters, SortField, SortDir } from "../types";
import { DEPARTMENTS, OFFICES, STATUS_OPTIONS, EMPLOYMENT_TYPE_OPTIONS, TEAM_SIZE_FILTER_OPTIONS, DEFAULT_FILTERS } from "../constants";
import { applyFilters, applySorting, paginate, buildCSV } from "../utils";
import { toast } from "sonner";

export function ManagersPage() {
  const {
    managers,
    createManager,
    updateManager,
    deleteManager,
    bulkDelete,
    bulkSetStatus,
    importManagers,
  } = useManagers();

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<ManagerFilters>({ ...DEFAULT_FILTERS });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Sorting State
  const [sortField, setSortField] = useState<SortField>("fullName");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Dialog / Drawer States
  const [formOpen, setFormOpen] = useState(false);
  const [activeManager, setActiveManager] = useState<Manager | null>(null); // For Add/Edit
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileManager, setProfileManager] = useState<Manager | null>(null); // For view drawer
  const [importOpen, setImportOpen] = useState(false);

  // Delete Alert States
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [managerToDelete, setManagerToDelete] = useState<Manager | null>(null);
  const [bulkDeleteAlertOpen, setBulkDeleteAlertOpen] = useState(false);

  // Filtered & Sorted managers
  const processedManagers = useMemo(() => {
    const filtered = applyFilters(managers, searchQuery, filters);
    return applySorting(filtered, sortField, sortDir);
  }, [managers, searchQuery, filters, sortField, sortDir]);

  // Paginated managers
  const paginatedManagers = useMemo(() => {
    return paginate(processedManagers, currentPage, perPage);
  }, [processedManagers, currentPage, perPage]);

  const totalPages = Math.ceil(processedManagers.length / perPage);

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
      setSelectedIds(paginatedManagers.map((m) => m.id));
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
    setActiveManager(null);
    setFormOpen(true);
  };

  const handleEditClick = (m: Manager) => {
    setActiveManager(m);
    setFormOpen(true);
  };

  const handleDeleteClick = (m: Manager) => {
    setManagerToDelete(m);
    setDeleteAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    if (managerToDelete) {
      deleteManager(managerToDelete.id);
      setSelectedIds((prev) => prev.filter((id) => id !== managerToDelete.id));
      toast.success("Manager Deleted Successfully");
      setDeleteAlertOpen(false);
      setManagerToDelete(null);
    }
  };

  const handleViewClick = (m: Manager) => {
    setProfileManager(m);
    setProfileOpen(true);
  };

  const handleSaveManager = (m: Manager) => {
    const exists = managers.some((mgr) => mgr.id === m.id);
    if (exists) {
      updateManager(m);
    } else {
      createManager(m);
    }
  };

  // Bulk operations
  const handleBulkDeleteClick = () => {
    setBulkDeleteAlertOpen(true);
  };

  const handleConfirmBulkDelete = () => {
    bulkDelete(selectedIds);
    toast.success(`${selectedIds.length} Managers Deleted Successfully`);
    setSelectedIds([]);
    setBulkDeleteAlertOpen(false);
  };

  const handleBulkStatusChange = (status: Manager["status"]) => {
    bulkSetStatus(selectedIds, status);
    const statusLabels: Record<Manager["status"], string> = {
      active: "Activated",
      probation: "moved to Probation",
      inactive: "Deactivated",
      on_leave: "moved to On Leave",
    };
    toast.success(`${selectedIds.length} Managers ${statusLabels[status]} Successfully`);
    setSelectedIds([]);
  };

  // Reset filter helpers
  const handleClearFilters = () => {
    setSearchQuery("");
    setFilters({ ...DEFAULT_FILTERS });
    setCurrentPage(1);
    toast.success("Filters Reset Successfully");
  };

  // Exports CSV, Excel, PDF
  const handleExportCSV = () => {
    const data = selectedIds.length > 0
      ? managers.filter((m) => selectedIds.includes(m.id))
      : processedManagers;
    
    if (data.length === 0) {
      toast.error("No managers available to export");
      return;
    }

    const csvContent = buildCSV(data);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `aurix_managers_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV Export Completed Successfully");
  };

  const handleExportExcel = () => {
    // Standard Excel applications open CSV files containing standard formatting natively
    handleExportCSV();
  };

  const handleExportPDF = () => {
    const data = selectedIds.length > 0
      ? managers.filter((m) => selectedIds.includes(m.id))
      : processedManagers;

    if (data.length === 0) {
      toast.error("No managers available to export");
      return;
    }

    // Open clean print window
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Popup blocked! Enable popups to export as PDF.");
      return;
    }

    const rowsHTML = data.map((m) => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px; font-size: 11px;">${m.employeeId}</td>
        <td style="padding: 10px; font-size: 11px; font-weight: bold;">${m.fullName}</td>
        <td style="padding: 10px; font-size: 11px;">${m.email}</td>
        <td style="padding: 10px; font-size: 11px;">${m.department}</td>
        <td style="padding: 10px; font-size: 11px;">${m.designation}</td>
        <td style="padding: 10px; font-size: 11px;">${m.office}</td>
        <td style="padding: 10px; font-size: 11px;">${m.status.toUpperCase()}</td>
        <td style="padding: 10px; font-size: 11px;">${m.joiningDate}</td>
      </tr>
    `).join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Managers Directory - Aurix HRMS</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 20px; color: #333; }
            h1 { font-size: 18px; margin-bottom: 5px; }
            p { font-size: 12px; margin-bottom: 20px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background: #f5f5f5; text-align: left; padding: 10px; font-size: 11px; font-weight: bold; border-bottom: 2px solid #ddd; }
          </style>
        </head>
        <body>
          <h1>Managers Directory</h1>
          <p>Generated on ${new Date().toLocaleDateString()} • Total Records: ${data.length}</p>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Office</th>
                <th>Status</th>
                <th>Joining Date</th>
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
    toast.success("PDF Generation Triggered");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader
          title="Managers Directory"
          description="View, manage, and coordinate your corporate department heads, product leads, and hierarchy rules."
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
            <UserPlus className="h-4 w-4" />
            Add Manager
          </Button>
        </div>
      </div>

      {/* Stats Cards Section */}
      <ManagerStatsCards managers={managers} />

      {/* Main List and Controls */}
      <div className="rounded-2xl border border-border/60 bg-card/40 p-5 shadow-sm backdrop-blur-xl space-y-4">
        
        {/* Search, Clear & Actions Header */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
          {/* Left search controls */}
          <div className="flex flex-1 items-center gap-2 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, employee ID, phone or department..."
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
                Clear
              </Button>
            )}
          </div>

          {/* Right Export / Selection Batch Actions */}
          <div className="flex items-center gap-2 justify-end">
            {/* Bulk actions menu */}
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
                      Activate Managers
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleBulkStatusChange("inactive")}
                      className="text-xs flex items-center gap-1.5 cursor-pointer py-1.5"
                    >
                      <XCircle className="h-3.5 w-3.5 text-rose-500" />
                      Deactivate Managers
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

            {/* Export Dropdown */}
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
                  Export PDF Document
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="grid grid-cols-1 gap-4 rounded-xl border border-border/40 bg-muted/10 p-4 md:grid-cols-3 lg:grid-cols-6 animate-in fade-in duration-200">
            {/* Department */}
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Department</Label>
              <Select
                value={filters.department}
                onValueChange={(val) => {
                  setFilters((prev) => ({ ...prev, department: val }));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-8 rounded-lg text-xs bg-background">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {DEPARTMENTS.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

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

            {/* Employment Type */}
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Employment Type</Label>
              <Select
                value={filters.employmentType}
                onValueChange={(val) => {
                  setFilters((prev) => ({ ...prev, employmentType: val }));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-8 rounded-lg text-xs bg-background">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {EMPLOYMENT_TYPE_OPTIONS.map((opt) => (
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

            {/* Team Size */}
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Team Size</Label>
              <Select
                value={filters.teamSize}
                onValueChange={(val) => {
                  setFilters((prev) => ({ ...prev, teamSize: val }));
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-8 rounded-lg text-xs bg-background">
                  <SelectValue placeholder="Any Size" />
                </SelectTrigger>
                <SelectContent>
                  {TEAM_SIZE_FILTER_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Joining Date From */}
            <div className="space-y-1.5">
              <Label className="text-[10px] uppercase font-bold text-muted-foreground">Joining From</Label>
              <Input
                type="date"
                value={filters.joiningFrom}
                onChange={(e) => {
                  setFilters((prev) => ({ ...prev, joiningFrom: e.target.value }));
                  setCurrentPage(1);
                }}
                className="h-8 rounded-lg text-xs bg-background px-2 py-0 border-border/80"
              />
            </div>
          </div>
        )}

        {/* Table View & Empty States */}
        {processedManagers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/80 bg-card/10 p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-muted/60 text-muted-foreground shadow-sm">
              <FolderOpen className="h-6 w-6" />
            </div>
            <h4 className="font-semibold text-lg text-foreground">No Managers Found</h4>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
              {managers.length === 0
                ? "Start by creating your first manager to seed the directory tree."
                : "No listings match your search criteria. Try modifying your filters."}
            </p>
            <Button
              onClick={managers.length === 0 ? handleAddClick : handleClearFilters}
              className="mt-5 rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90 font-semibold text-xs h-9 px-4 cursor-pointer"
            >
              {managers.length === 0 ? "Add Manager" : "Clear Filters"}
            </Button>
          </div>
        ) : (
          <>
            <ManagersTable
              managers={paginatedManagers}
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

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground">
                  Showing {Math.min(processedManagers.length, (currentPage - 1) * perPage + 1)} to{" "}
                  {Math.min(processedManagers.length, currentPage * perPage)} of {processedManagers.length} entries
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
                      <SelectItem value="50">50</SelectItem>
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

      {/* Add / Edit Manager Dialog */}
      <ManagerFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        manager={activeManager}
        existingManagers={managers}
        onSave={handleSaveManager}
      />

      {/* View Profile Drawer (Sheet) */}
      <ManagerProfileDrawer
        open={profileOpen}
        onOpenChange={setProfileOpen}
        manager={profileManager}
      />

      {/* CSV Import Dialog */}
      <ImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        existingManagers={managers}
        onImport={importManagers}
      />

      {/* Delete Single Manager Alert Confirmation */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent className="rounded-2xl border-border bg-card p-6 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-lg">Are you sure you want to delete this manager?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
              This action cannot be undone. This will permanently remove{" "}
              <span className="font-semibold text-foreground">{managerToDelete?.fullName}</span> and all associated
              attendance metadata from the database store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex gap-2 justify-end">
            <AlertDialogCancel className="rounded-xl border-border bg-card hover:bg-muted">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="rounded-xl bg-rose-500 text-white hover:bg-rose-600 shadow-glow border-none"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Delete Alert Confirmation */}
      <AlertDialog open={bulkDeleteAlertOpen} onOpenChange={setBulkDeleteAlertOpen}>
        <AlertDialogContent className="rounded-2xl border-border bg-card p-6 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-lg">Are you sure you want to delete these managers?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
              This will permanently delete the <span className="font-semibold text-foreground">{selectedIds.length}</span> selected
              managers from the system directory. This action is irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex gap-2 justify-end">
            <AlertDialogCancel className="rounded-xl border-border bg-card hover:bg-muted">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmBulkDelete}
              className="rounded-xl bg-rose-500 text-white hover:bg-rose-600 shadow-glow border-none"
            >
              Delete Selected
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
