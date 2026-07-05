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
  Target,
  Trophy,
  Sparkles,
  HelpCircle,
  Activity,
  Award,
  BookOpen,
} from "lucide-react";
import { usePerformance } from "../hooks/usePerformance";
import { PerformanceStatsCards } from "../components/PerformanceStatsCards";
import { PerformanceTable } from "../components/PerformanceTable";
import { PerformanceFormDialog } from "../components/PerformanceFormDialog";
import { EmployeePerformanceProfile } from "../components/EmployeePerformanceProfile";
import { AIInsightsPanel } from "../components/AIInsightsPanel";
import { PerformanceCharts } from "../components/PerformanceCharts";
import { ImportDialog } from "../components/ImportDialog";
import type { PerformanceReview, Goal, Reward, Feedback360, TrainingCourse } from "../types";
import { REVIEW_STATUS_OPTIONS, DEFAULT_FILTERS } from "../constants";
import { applyFilters, applySorting, paginate, buildCSV } from "../utils";
import { useAurix } from "@/lib/aurix-store";
import { toast } from "sonner";

export function PerformancePage() {
  const ws = useAurix();
  const {
    reviews,
    goals,
    feedback360,
    rewards,
    courses,
    createReview,
    updateReview,
    deleteReview,
    bulkDeleteReviews,
    bulkSetReviewStatus,
    importReviews,
    assignGoal,
    completeGoal,
    updateGoal,
    assignTraining,
    updateTrainingStatus,
    addReward,
  } = usePerformance();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState("directory");

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ ...DEFAULT_FILTERS });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Sorting state
  const [sortField, setSortField] = useState<any>("employeeName");
  const [sortDir, setSortDir] = useState<any>("asc");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Dialog/Drawer states
  const [formOpen, setFormOpen] = useState(false);
  const [activeReview, setActiveReview] = useState<PerformanceReview | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileReview, setProfileReview] = useState<PerformanceReview | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  // Modals for bulk actions
  const [bulkGoalOpen, setBulkGoalOpen] = useState(false);
  const [bulkGoalTitle, setBulkGoalTitle] = useState("");
  const [bulkGoalDesc, setBulkGoalDesc] = useState("");
  const [bulkGoalPriority, setBulkGoalPriority] = useState<Goal["priority"]>("medium");
  const [bulkGoalDueDate, setBulkGoalDueDate] = useState("");

  // Delete Alert States
  const [deleteAlertOpen, setDeleteAlertOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<PerformanceReview | null>(null);
  const [bulkDeleteAlertOpen, setBulkDeleteAlertOpen] = useState(false);

  // List of unique departments for filters
  const departments = useMemo(() => {
    return Array.from(new Set(reviews.map((r) => r.department)));
  }, [reviews]);

  // List of unique managers for filters
  const managersList = useMemo(() => {
    return Array.from(new Set(reviews.map((r) => r.managerName)));
  }, [reviews]);

  // Filtered & sorted reviews
  const processedReviews = useMemo(() => {
    const filtered = applyFilters(reviews, searchQuery, filters);
    return applySorting(filtered, sortField, sortDir);
  }, [reviews, searchQuery, filters, sortField, sortDir]);

  // Paginated reviews
  const paginatedReviews = useMemo(() => {
    return paginate(processedReviews, currentPage, perPage);
  }, [processedReviews, currentPage, perPage]);

  const totalPages = Math.ceil(processedReviews.length / perPage);

  // Handlers
  const handleSort = (field: any) => {
    if (sortField === field) {
      setSortDir((d: any) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setCurrentPage(1);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedReviews.map((r) => r.id));
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
    if (ws.employees.length === 0) {
      toast.warning("Cannot create reviews: No employees exist in your directory.");
      return;
    }
    setActiveReview(null);
    setFormOpen(true);
  };

  const handleEditClick = (r: PerformanceReview) => {
    setActiveReview(r);
    setFormOpen(true);
  };

  const handleDeleteClick = (r: PerformanceReview) => {
    setReviewToDelete(r);
    setDeleteAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    if (reviewToDelete) {
      deleteReview(reviewToDelete.id);
      setSelectedIds((prev) => prev.filter((id) => id !== reviewToDelete.id));
      toast.success("Review Deleted Successfully");
      setDeleteAlertOpen(false);
      setReviewToDelete(null);
    }
  };

  const handleViewClick = (r: PerformanceReview) => {
    setProfileReview(r);
    setProfileOpen(true);
  };

  const handleSaveReview = (r: PerformanceReview) => {
    const exists = reviews.some((rev) => rev.id === r.id);
    if (exists) {
      updateReview(r);
      if (profileReview?.id === r.id) {
        setProfileReview(r);
      }
    } else {
      createReview(r);
    }
  };

  // Bulk actions
  const handleConfirmBulkDelete = () => {
    bulkDeleteReviews(selectedIds);
    toast.success(`${selectedIds.length} Reviews Deleted Successfully`);
    setSelectedIds([]);
    setBulkDeleteAlertOpen(false);
  };

  const handleBulkStatusChange = (status: PerformanceReview["reviewStatus"]) => {
    bulkSetReviewStatus(selectedIds, status);
    const statusLabels: Record<PerformanceReview["reviewStatus"], string> = {
      draft: "moved to Draft",
      in_review: "moved to In Review",
      approved: "Approved",
      completed: "Completed",
    };
    toast.success(`${selectedIds.length} Reviews ${statusLabels[status]} Successfully`);
    setSelectedIds([]);
  };

  const handleBulkAssignGoalClick = () => {
    setBulkGoalTitle("");
    setBulkGoalDesc("");
    setBulkGoalPriority("medium");
    setBulkGoalDueDate("");
    setBulkGoalOpen(true);
  };

  const handleConfirmBulkAssignGoal = () => {
    if (!bulkGoalTitle.trim() || !bulkGoalDueDate) {
      toast.error("Goal Title and Due Date are required");
      return;
    }

    selectedIds.forEach((id) => {
      const rev = reviews.find((r) => r.id === id);
      if (rev) {
        assignGoal(rev.employeeId, bulkGoalTitle.trim(), bulkGoalDesc.trim(), bulkGoalPriority, bulkGoalDueDate);
      }
    });

    toast.success(`Assigned goal "${bulkGoalTitle.trim()}" to ${selectedIds.length} employees`);
    setSelectedIds([]);
    setBulkGoalOpen(false);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilters({ ...DEFAULT_FILTERS });
    setCurrentPage(1);
    toast.success("Filters Reset Successfully");
  };

  // Export handlers
  const handleExportCSV = () => {
    const data = selectedIds.length > 0
      ? reviews.filter((r) => selectedIds.includes(r.id))
      : processedReviews;

    if (data.length === 0) {
      toast.error("No performance reviews available to export");
      return;
    }

    const csvContent = buildCSV(data);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `aurix_performance_export_${Date.now()}.csv`);
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
      ? reviews.filter((r) => selectedIds.includes(r.id))
      : processedReviews;

    if (data.length === 0) {
      toast.error("No reviews available to export");
      return;
    }

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Popup blocked! Enable popups to export as PDF.");
      return;
    }

    const rowsHTML = data.map((r) => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px; font-size: 11px;">${r.employeeIdCode}</td>
        <td style="padding: 10px; font-size: 11px; font-weight: bold;">${r.employeeName}</td>
        <td style="padding: 10px; font-size: 11px;">${r.department}</td>
        <td style="padding: 10px; font-size: 11px;">${r.managerName}</td>
        <td style="padding: 10px; font-size: 11px;">${r.overallRating} ★</td>
        <td style="padding: 10px; font-size: 11px;">${r.goalProgress}%</td>
        <td style="padding: 10px; font-size: 11px;">${r.kpiScore}%</td>
        <td style="padding: 10px; font-size: 11px;">${r.reviewStatus.toUpperCase()}</td>
        <td style="padding: 10px; font-size: 11px;">${r.reviewDate}</td>
      </tr>
    `).join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Performance Reviews Pool - Aurix HRMS</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 20px; color: #333; }
            h1 { font-size: 18px; margin-bottom: 5px; }
            p { font-size: 12px; margin-bottom: 20px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background: #f5f5f5; text-align: left; padding: 10px; font-size: 11px; font-weight: bold; border-bottom: 2px solid #ddd; }
          </style>
        </head>
        <body>
          <h1>Performance evaluations Directory</h1>
          <p>Generated on ${new Date().toLocaleDateString()} • Total Records: ${data.length}</p>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Reporting Manager</th>
                <th>Rating</th>
                <th>Goal Progress</th>
                <th>KPI Index</th>
                <th>Status</th>
                <th>Review Date</th>
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
    toast.success("PDF Print Layout Triggered");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <PageHeader
          title="Performance Management"
          description="Evaluate employee metrics, track strategic OKRs targets, conduct 360 feedback reviews, and trigger promotion recommendations."
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
            New Review
          </Button>
        </div>
      </div>

      {/* Tabs navigation list to switch between List, Charts, and AI analysis */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/80 pb-2">
          <TabsList className="bg-muted/40 p-1 rounded-xl h-10">
            <TabsTrigger value="directory" className="rounded-lg text-xs font-medium px-4 flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5" />
              Evaluations Directory
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-lg text-xs font-medium px-4 flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5" />
              Visual Analytics
            </TabsTrigger>
            <TabsTrigger value="ai_insights" className="rounded-lg text-xs font-medium px-4 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-brand animate-pulse" />
              AI Talent Insights
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Directory list */}
        <TabsContent value="directory" className="space-y-6 mt-0">
          {/* Stats Cards Section */}
          <PerformanceStatsCards reviews={reviews} goals={goals} />

          <div className="rounded-2xl border border-border/60 bg-card/40 p-5 shadow-sm backdrop-blur-xl space-y-4">
            {/* Search, Clear & Actions Header */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
              <div className="flex flex-1 items-center gap-2 max-w-lg">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, employee ID, department, manager or email..."
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
                          onClick={() => handleBulkStatusChange("completed")}
                          className="text-xs flex items-center gap-1.5 cursor-pointer py-1.5"
                        >
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                          Approve reviews
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleBulkStatusChange("draft")}
                          className="text-xs flex items-center gap-1.5 cursor-pointer py-1.5"
                        >
                          <XCircle className="h-3.5 w-3.5 text-rose-500" />
                          Reject reviews
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/60" />
                        <DropdownMenuLabel className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Objective Tasks</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={handleBulkAssignGoalClick}
                          className="text-xs flex items-center gap-1.5 cursor-pointer py-1.5"
                        >
                          <Target className="h-3.5 w-3.5 text-blue-500" />
                          Assign Target Goal
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/60" />
                        <DropdownMenuItem
                          onClick={() => setBulkDeleteAlertOpen(true)}
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
                      Export PDF / Print
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
                      {departments.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Manager */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Manager</Label>
                  <Select
                    value={filters.manager}
                    onValueChange={(val) => {
                      setFilters((prev) => ({ ...prev, manager: val }));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 rounded-lg text-xs bg-background">
                      <SelectValue placeholder="All Managers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Managers</SelectItem>
                      {managersList.map((m) => (
                        <SelectItem key={m} value={m}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Rating category */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Rating Category</Label>
                  <Select
                    value={filters.rating}
                    onValueChange={(val) => {
                      setFilters((prev) => ({ ...prev, rating: val }));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 rounded-lg text-xs bg-background">
                      <SelectValue placeholder="All Ratings" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ratings</SelectItem>
                      <SelectItem value="excellent">5 ★ Excellent</SelectItem>
                      <SelectItem value="good">4 ★ Good</SelectItem>
                      <SelectItem value="average">3 ★ Average</SelectItem>
                      <SelectItem value="needs_improvement">2 ★ Needs Improvement</SelectItem>
                      <SelectItem value="poor">1 ★ Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Review status */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Review Status</Label>
                  <Select
                    value={filters.reviewStatus}
                    onValueChange={(val) => {
                      setFilters((prev) => ({ ...prev, reviewStatus: val }));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 rounded-lg text-xs bg-background">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      {REVIEW_STATUS_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Promotion eligible */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Promotion Eligible</Label>
                  <Select
                    value={filters.promotionEligible}
                    onValueChange={(val) => {
                      setFilters((prev) => ({ ...prev, promotionEligible: val }));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="h-8 rounded-lg text-xs bg-background">
                      <SelectValue placeholder="All Candidates" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Candidates</SelectItem>
                      <SelectItem value="true">Eligible Candidates</SelectItem>
                      <SelectItem value="false">Regular Pipeline</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Review date since */}
                <div className="space-y-1.5">
                  <Label className="text-[10px] uppercase font-bold text-muted-foreground">Reviewed Since</Label>
                  <Input
                    type="date"
                    value={filters.reviewDateFrom}
                    onChange={(e) => {
                      setFilters((prev) => ({ ...prev, reviewDateFrom: e.target.value }));
                      setCurrentPage(1);
                    }}
                    className="h-8 rounded-lg text-xs bg-background px-2 py-0 border-border/80"
                  />
                </div>
              </div>
            )}

            {/* List Table & Empty state */}
            {processedReviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border/80 bg-card/10 p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-muted/60 text-muted-foreground shadow-sm">
                  <Award className="h-6 w-6" />
                </div>
                <h4 className="font-semibold text-lg text-foreground">No Performance Reviews Found</h4>
                <p className="mt-1 text-sm text-muted-foreground max-w-sm">
                  {reviews.length === 0
                    ? "Start by creating your first employee performance review cycles to evaluate company OKRs."
                    : "No evaluations match your search query. Try clearing filters."}
                </p>
                <Button
                  onClick={reviews.length === 0 ? handleAddClick : handleClearFilters}
                  className="mt-5 rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90 font-semibold text-xs h-9 px-4 cursor-pointer"
                >
                  {reviews.length === 0 ? "Create Review" : "Reset Filters"}
                </Button>
              </div>
            ) : (
              <>
                <PerformanceTable
                  reviews={paginatedReviews}
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
                      Showing {Math.min(processedReviews.length, (currentPage - 1) * perPage + 1)} to{" "}
                      {Math.min(processedReviews.length, currentPage * perPage)} of {processedReviews.length} entries
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

        {/* Tab 2: Analytics dashboard charts */}
        <TabsContent value="analytics" className="mt-0 space-y-6">
          <PerformanceCharts reviews={reviews} goals={goals} />
        </TabsContent>

        {/* Tab 3: AI insights analysis panel */}
        <TabsContent value="ai_insights" className="mt-0 space-y-6">
          <AIInsightsPanel reviews={reviews} goals={goals} />
        </TabsContent>
      </Tabs>

      {/* Add / Edit Form Dialog */}
      <PerformanceFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        review={activeReview}
        existingReviews={reviews}
        onSave={handleSaveReview}
      />

      {/* View employee detail profile drawer */}
      <EmployeePerformanceProfile
        open={profileOpen}
        onOpenChange={setProfileOpen}
        review={profileReview}
        goals={goals}
        feedbackList={feedback360}
        rewards={rewards}
        courses={courses}
        onAssignGoal={assignGoal}
        onCompleteGoal={completeGoal}
        onAssignTraining={assignTraining}
        onUpdateTrainingStatus={updateTrainingStatus}
        onAddReward={addReward}
      />

      {/* CSV Spreadsheet importer */}
      <ImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        existingReviews={reviews}
        onImport={importReviews}
      />

      {/* Bulk Assign Goal Dialog modal */}
      <Dialog open={bulkGoalOpen} onOpenChange={setBulkGoalOpen}>
        <DialogContent className="rounded-2xl border-border bg-card p-6 backdrop-blur-xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bold text-lg">Bulk Assign OKR Objective Goal</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="space-y-1">
              <Label htmlFor="bgTitle" className="text-xs font-semibold">Goal Objective Title</Label>
              <Input id="bgTitle" value={bulkGoalTitle} onChange={(e) => setGoalTitle(e.target.value)} placeholder="e.g. Optimize platform indexing latencies" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="bgDesc" className="text-xs font-semibold">Objective description</Label>
              <Input id="bgDesc" value={bulkGoalDesc} onChange={(e) => setGoalDesc(e.target.value)} placeholder="e.g. Add indexes, replicate databases..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Priority</Label>
                <Select value={bulkGoalPriority} onValueChange={(val) => setGoalPriority(val as Goal["priority"])}>
                  <SelectTrigger className="h-10 text-xs bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="bgDue" className="text-xs font-semibold">Due Date</Label>
                <Input id="bgDue" type="date" value={bulkGoalDueDate} onChange={(e) => setGoalDueDate(e.target.value)} className="h-10 px-2 bg-background" />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2">
              This will assign the target objective goal to all {selectedIds.length} selected employee profiles.
            </p>
          </div>
          <DialogFooter className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setBulkGoalOpen(false)} className="rounded-xl border-border bg-card">Cancel</Button>
            <Button onClick={handleConfirmBulkAssignGoal} className="rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90">Assign Goal</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alert 1: Confirm Single Delete */}
      <AlertDialog open={deleteAlertOpen} onOpenChange={setDeleteAlertOpen}>
        <AlertDialogContent className="rounded-2xl border-border bg-card p-6 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-lg">Are you sure you want to delete this performance review?</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
              This action is permanent and cannot be undone. This will delete the evaluation records of{" "}
              <span className="font-semibold text-foreground">{reviewToDelete?.employeeName}</span> on{" "}
              <span className="font-semibold text-foreground">{reviewToDelete?.reviewDate}</span> from the systems database.
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

      {/* Alert 2: Confirm Bulk Delete */}
      <AlertDialog open={bulkDeleteAlertOpen} onOpenChange={setBulkDeleteAlertOpen}>
        <AlertDialogContent className="rounded-2xl border-border bg-card p-6 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-lg">Confirm Bulk Delete Reviews</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
              Are you sure you want to delete the <span className="font-semibold text-foreground">{selectedIds.length}</span> selected
              performance reviews? This action is irreversible.
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
    </div>
  );

  // Transfer helpers from form
  function setGoalTitle(val: string) { setBulkGoalTitle(val); }
  function setGoalDesc(val: string) { setBulkGoalDesc(val); }
  function setGoalPriority(val: Goal["priority"]) { setBulkGoalPriority(val); }
  function setGoalDueDate(val: string) { setBulkGoalDueDate(val); }
}
