import { useMemo, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Banknote,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Download,
  Eye,
  FileSpreadsheet,
  Loader2,
  Lock,
  Minus,
  PlayCircle,
  RefreshCw,
  Save,
  Search,
  Send,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  MONTHS,
  PAYROLL_TYPES,
  WORKFLOW_STEPS,
  type PayrollEmployeeRow,
  type PayrollRowStatus,
  type ValidationIssue,
  type ValidationStatus,
  type WorkflowStepId,
} from "../data/salaryProcessingData";
import { useSalaryProcessing } from "../hooks/useSalaryProcessing";
import { ENTERPRISE_EMPLOYEE_COUNT } from "../services/salaryProcessingService";
import { formatCurrency } from "../utils/formatCurrency";

const PAGE_SIZE = 10;
const CHART_COLORS = [
  "oklch(0.55 0.04 264)",
  "oklch(0.62 0.06 240)",
  "oklch(0.68 0.05 220)",
  "oklch(0.72 0.04 200)",
  "oklch(0.58 0.03 280)",
  "oklch(0.50 0.04 260)",
];

type SortKey = keyof Pick<
  PayrollEmployeeRow,
  | "employeeId"
  | "fullName"
  | "department"
  | "grossSalary"
  | "netSalary"
  | "deductions"
  | "bonus"
>;

export function PayrollSalaryProcessingPage() {
  const payroll = useSalaryProcessing();

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [employeeFilter, setEmployeeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("employeeId");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [issuesOpen, setIssuesOpen] = useState(true);
  const [lockModalOpen, setLockModalOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [detailEmployee, setDetailEmployee] = useState<PayrollEmployeeRow | null>(null);

  const departments = useMemo(
    () => [...new Set(payroll.rows.map((row) => row.department))].sort(),
    [payroll.rows],
  );

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return payroll.rows
      .filter((row) => {
        if (departmentFilter !== "all" && row.department !== departmentFilter) return false;
        if (statusFilter !== "all" && row.validationStatus !== statusFilter) return false;
        if (employeeFilter !== "all" && row.id !== employeeFilter) return false;
        if (!query) return true;
        return (
          row.fullName.toLowerCase().includes(query) ||
          row.employeeId.toLowerCase().includes(query) ||
          row.department.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        const cmp =
          typeof av === "string" && typeof bv === "string"
            ? av.localeCompare(bv)
            : Number(av) - Number(bv);
        return sortDir === "asc" ? cmp : -cmp;
      });
  }, [payroll.rows, departmentFilter, employeeFilter, search, sortDir, sortKey, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const pageRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(new Set(pageRows.map((row) => row.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleSelectRow = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const handleLockConfirm = () => {
    payroll.lockPayroll();
    setLockModalOpen(false);
  };

  const generateProgressPct = payroll.isGenerating
    ? Math.round((payroll.generateProgress.processed / payroll.generateProgress.total) * 100)
    : 0;

  return (
    <div className="pb-28">
      <PageHeader
        title="Salary Processing"
        description="Generate, validate, review, and finalize monthly payroll."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Select value={payroll.month} onValueChange={payroll.setMonth} disabled={payroll.isGenerating}>
              <SelectTrigger className="h-9 w-[130px] bg-background">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={payroll.year} onValueChange={payroll.setYear} disabled={payroll.isGenerating}>
              <SelectTrigger className="h-9 w-[100px] bg-background">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {["2024", "2025", "2026"].map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={payroll.payrollType} onValueChange={payroll.setPayrollType} disabled={payroll.isGenerating}>
              <SelectTrigger className="h-9 w-[160px] bg-background">
                <SelectValue placeholder="Payroll type" />
              </SelectTrigger>
              <SelectContent>
                {PAYROLL_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => void payroll.generateSalaryRun()}
              disabled={payroll.isGenerating || payroll.isLocked}
              className="shadow-sm"
            >
              {payroll.isGenerating ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <PlayCircle className="mr-2 h-4 w-4" />
              )}
              {payroll.isGenerating ? "Generating…" : payroll.hasRun ? "Regenerate Run" : "Generate Salary Run"}
            </Button>
          </div>
        }
      />

      {payroll.isGenerating ? (
        <div className="mb-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Generating salary run…</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Processing {payroll.generateProgress.processed.toLocaleString()} of{" "}
                {payroll.generateProgress.total.toLocaleString()} employees
              </p>
            </div>
            <span className="text-sm font-semibold tabular-nums text-blue-700 dark:text-blue-400">
              {generateProgressPct}%
            </span>
          </div>
          <Progress value={generateProgressPct} className="mt-3 h-2" />
        </div>
      ) : null}

      <StatusSummaryCards summary={payroll.summary} isGenerating={payroll.isGenerating} />

      <PayrollWorkflow
        currentStep={payroll.currentStep}
        completedSteps={payroll.completedSteps}
        cycleLabel={payroll.cycleLabel}
      />

      <div className="mt-6 flex gap-4">
        <div className="min-w-0 flex-1 space-y-4">
          <EmployeeTableCard
            rows={pageRows}
            filteredCount={filteredRows.length}
            totalCount={payroll.hasRun ? ENTERPRISE_EMPLOYEE_COUNT : 0}
            hasRun={payroll.hasRun}
            isGenerating={payroll.isGenerating}
            search={search}
            onSearchChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            departmentFilter={departmentFilter}
            onDepartmentFilterChange={(v) => {
              setDepartmentFilter(v);
              setPage(1);
            }}
            statusFilter={statusFilter}
            onStatusFilterChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
            employeeFilter={employeeFilter}
            onEmployeeFilterChange={(v) => {
              setEmployeeFilter(v);
              setPage(1);
            }}
            departments={departments}
            allRows={payroll.rows}
            selectedIds={selectedIds}
            onToggleSelectAll={toggleSelectAll}
            onToggleSelectRow={toggleSelectRow}
            sortKey={sortKey}
            sortDir={sortDir}
            onToggleSort={toggleSort}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            onExport={payroll.exportExcel}
            onViewDetails={setDetailEmployee}
            onGenerate={() => void payroll.generateSalaryRun()}
            isLocked={payroll.isLocked}
          />

          {payroll.hasRun ? (
            <PayrollSummarySection
              summary={payroll.summary}
              deptChartData={payroll.deptChartData}
              componentChartData={payroll.componentChartData}
              distributionData={payroll.distributionData}
              issueChartData={payroll.issueChartData}
            />
          ) : null}
        </div>

        <ValidationIssuesPanel
          open={issuesOpen}
          onOpenChange={setIssuesOpen}
          issues={payroll.issues}
          onResolve={payroll.resolveIssue}
          isRevalidating={payroll.isRevalidating}
          hasRun={payroll.hasRun}
          isLocked={payroll.isLocked}
        />
      </div>

      <StickyActionBar
        cycleLabel={payroll.cycleLabel}
        cycleStatusLabel={payroll.cycleStatusLabel}
        selectedCount={selectedIds.size}
        hasRun={payroll.hasRun}
        isGenerating={payroll.isGenerating}
        isRevalidating={payroll.isRevalidating}
        isLocked={payroll.isLocked}
        cycleStatus={payroll.cycleStatus}
        errorCount={payroll.errorCount}
        hasUnsavedChanges={payroll.hasUnsavedChanges}
        onSaveDraft={payroll.saveDraftToStorage}
        onRevalidate={() => void payroll.revalidate()}
        onPreview={() => setPreviewOpen(true)}
        onExport={payroll.exportExcel}
        onLock={() => setLockModalOpen(true)}
        onSendForApproval={payroll.sendForApproval}
        onCompleteApproval={payroll.completeApproval}
      />

      <LockPayrollDialog
        open={lockModalOpen}
        onOpenChange={setLockModalOpen}
        onConfirm={handleLockConfirm}
        errorCount={payroll.errorCount}
      />

      <PeriodChangeDialog
        open={!!payroll.periodChangePending}
        onConfirm={payroll.confirmPeriodChange}
        onCancel={payroll.cancelPeriodChange}
      />

      <PreviewPayrollDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        summary={payroll.summary}
        cycleLabel={payroll.cycleLabel}
        rowCount={payroll.rows.length}
      />

      <EmployeeDetailSheet
        employee={detailEmployee}
        onClose={() => setDetailEmployee(null)}
      />
    </div>
  );
}

function StatusSummaryCards({
  summary,
  isGenerating,
}: {
  summary: {
    totalEmployees: number;
    employeesProcessed: number;
    grossPayroll: number;
    netPayroll: number;
    totalDeductions: number;
    validationErrors: number;
    pendingReviews: number;
    payrollStatus: string;
  };
  isGenerating?: boolean;
}) {
  const cards = [
    {
      label: "Total Employees",
      value: summary.totalEmployees.toLocaleString(),
      description: isGenerating ? "Processing in progress" : "Active headcount in cycle",
      icon: Users,
      trend: "+2.1%",
      trendUp: true,
    },
    {
      label: "Employees Processed",
      value: `${summary.employeesProcessed} / ${summary.totalEmployees.toLocaleString()}`,
      description: `${Math.round((summary.employeesProcessed / summary.totalEmployees) * 100)}% completion`,
      icon: ClipboardCheck,
      trend: "+12 today",
      trendUp: true,
    },
    {
      label: "Gross Payroll",
      value: formatCurrency(summary.grossPayroll),
      description: "Before deductions",
      icon: CircleDollarSign,
      trend: "+3.4%",
      trendUp: true,
    },
    {
      label: "Net Payroll",
      value: formatCurrency(summary.netPayroll),
      description: "Disbursement amount",
      icon: Banknote,
      trend: "+2.8%",
      trendUp: true,
    },
    {
      label: "Total Deductions",
      value: formatCurrency(summary.totalDeductions),
      description: "Tax, PF, and other",
      icon: Minus,
      trend: "+1.2%",
      trendUp: false,
    },
    {
      label: "Validation Errors",
      value: String(summary.validationErrors),
      description: "Requires resolution",
      icon: ShieldAlert,
      trend: summary.validationErrors > 0 ? "Action needed" : "All clear",
      trendUp: false,
      alert: summary.validationErrors > 0,
    },
    {
      label: "Pending Reviews",
      value: String(summary.pendingReviews),
      description: "Awaiting HR review",
      icon: AlertCircle,
      trend: "8 flagged",
      trendUp: false,
    },
    {
      label: "Payroll Status",
      value: summary.payrollStatus,
      description: "Current cycle state",
      icon: CheckCircle2,
      trend: "On track",
      trendUp: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-8">
      {cards.map((card) => (
        <div
          key={card.label}
          className="group rounded-xl border border-border/80 bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-2">
            <div
              className={cn(
                "grid h-9 w-9 shrink-0 place-items-center rounded-lg",
                card.alert
                  ? "bg-destructive/10 text-destructive"
                  : "bg-muted/60 text-muted-foreground",
              )}
            >
              <card.icon className="h-4 w-4" />
            </div>
            <span
              className={cn(
                "flex items-center gap-0.5 text-[10px] font-medium",
                card.trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
              )}
            >
              {card.trendUp ? (
                <TrendingUp className="h-3 w-3" />
              ) : card.alert ? (
                <AlertTriangle className="h-3 w-3 text-destructive" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {card.trend}
            </span>
          </div>
          <div className="mt-3 font-display text-lg font-semibold tracking-tight">{card.value}</div>
          <div className="mt-0.5 text-xs font-medium text-foreground/80">{card.label}</div>
          <div className="mt-1 text-[11px] text-muted-foreground">{card.description}</div>
        </div>
      ))}
    </div>
  );
}

function PayrollWorkflow({
  currentStep,
  completedSteps,
  cycleLabel,
}: {
  currentStep: WorkflowStepId;
  completedSteps: WorkflowStepId[];
  cycleLabel: string;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-tight">Payroll Workflow</h2>
        <span className="text-xs text-muted-foreground">Cycle: {cycleLabel}</span>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        {WORKFLOW_STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = step.id === currentStep;
          const isPending = !isCompleted && !isCurrent;

          return (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                  isCompleted && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
                  isCurrent && "bg-blue-500/10 text-blue-700 ring-1 ring-blue-500/30 dark:text-blue-400",
                  isPending && "bg-muted/50 text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold",
                    isCompleted && "bg-emerald-600 text-white",
                    isCurrent && "bg-blue-600 text-white",
                    isPending && "bg-muted-foreground/20 text-muted-foreground",
                  )}
                >
                  {isCompleted ? "✓" : index + 1}
                </span>
                {step.label}
              </div>
              {index < WORKFLOW_STEPS.length - 1 ? (
                <ChevronRight className="mx-1 h-4 w-4 shrink-0 text-muted-foreground/40" />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EmployeeTableCard({
  rows,
  filteredCount,
  totalCount,
  hasRun,
  isGenerating,
  search,
  onSearchChange,
  departmentFilter,
  onDepartmentFilterChange,
  statusFilter,
  onStatusFilterChange,
  employeeFilter,
  onEmployeeFilterChange,
  departments,
  allRows,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectRow,
  sortKey,
  sortDir,
  onToggleSort,
  page,
  totalPages,
  onPageChange,
  onExport,
  onViewDetails,
  onGenerate,
  isLocked,
}: {
  rows: PayrollEmployeeRow[];
  filteredCount: number;
  totalCount: number;
  hasRun: boolean;
  isGenerating: boolean;
  search: string;
  onSearchChange: (v: string) => void;
  departmentFilter: string;
  onDepartmentFilterChange: (v: string) => void;
  statusFilter: string;
  onStatusFilterChange: (v: string) => void;
  employeeFilter: string;
  onEmployeeFilterChange: (v: string) => void;
  departments: string[];
  allRows: PayrollEmployeeRow[];
  selectedIds: Set<string>;
  onToggleSelectAll: (checked: boolean) => void;
  onToggleSelectRow: (id: string, checked: boolean) => void;
  sortKey: SortKey;
  sortDir: "asc" | "desc";
  onToggleSort: (key: SortKey) => void;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onExport: () => void;
  onViewDetails: (row: PayrollEmployeeRow) => void;
  onGenerate: () => void;
  isLocked: boolean;
}) {
  const allPageSelected = rows.length > 0 && rows.every((row) => selectedIds.has(row.id));

  return (
    <div className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
      <div className="border-b border-border/80 px-4 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-medium tracking-tight">Employee Payroll</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {hasRun
                ? `Showing ${filteredCount} sample records · ${totalCount.toLocaleString()} employees in run`
                : "No payroll run for this cycle yet"}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onExport} disabled={!hasRun || isGenerating}>
            <Download className="mr-2 h-3.5 w-3.5" />
            Export
          </Button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, or department…"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-9 pl-8 bg-background"
              disabled={!hasRun || isGenerating}
            />
          </div>
          <Select value={departmentFilter} onValueChange={onDepartmentFilterChange} disabled={!hasRun || isGenerating}>
            <SelectTrigger className="h-9 w-[150px] bg-background">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={onStatusFilterChange} disabled={!hasRun || isGenerating}>
            <SelectTrigger className="h-9 w-[140px] bg-background">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="valid">Valid</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
          <Select value={employeeFilter} onValueChange={onEmployeeFilterChange} disabled={!hasRun || isGenerating}>
            <SelectTrigger className="h-9 w-[180px] bg-background">
              <SelectValue placeholder="Employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All employees</SelectItem>
              {allRows.slice(0, 20).map((row) => (
                <SelectItem key={row.id} value={row.id}>
                  {row.fullName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!hasRun ? (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
          <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-muted/60">
            <PlayCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium">No salary run generated</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Select a payroll period and generate a salary run to calculate compensation for{" "}
            {ENTERPRISE_EMPLOYEE_COUNT.toLocaleString()} employees.
          </p>
          <Button className="mt-4" onClick={onGenerate} disabled={isGenerating || isLocked}>
            <PlayCircle className="mr-2 h-4 w-4" />
            Generate Salary Run
          </Button>
        </div>
      ) : (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30">
              <TableHead className="w-10 px-3">
                <Checkbox
                  checked={allPageSelected}
                  onCheckedChange={(v) => onToggleSelectAll(v === true)}
                  aria-label="Select all on page"
                />
              </TableHead>
              <SortableHead label="Employee ID" sortKey="employeeId" active={sortKey} dir={sortDir} onSort={onToggleSort} />
              <SortableHead label="Employee Name" sortKey="fullName" active={sortKey} dir={sortDir} onSort={onToggleSort} />
              <SortableHead label="Department" sortKey="department" active={sortKey} dir={sortDir} onSort={onToggleSort} />
              <TableHead className="whitespace-nowrap px-3">Designation</TableHead>
              <TableHead className="whitespace-nowrap px-3 text-right">Working Days</TableHead>
              <TableHead className="whitespace-nowrap px-3 text-right">Present Days</TableHead>
              <TableHead className="whitespace-nowrap px-3 text-right">OT Hours</TableHead>
              <SortableHead label="Bonus" sortKey="bonus" active={sortKey} dir={sortDir} onSort={onToggleSort} align="right" />
              <SortableHead label="Deductions" sortKey="deductions" active={sortKey} dir={sortDir} onSort={onToggleSort} align="right" />
              <SortableHead label="Gross Salary" sortKey="grossSalary" active={sortKey} dir={sortDir} onSort={onToggleSort} align="right" />
              <SortableHead label="Net Salary" sortKey="netSalary" active={sortKey} dir={sortDir} onSort={onToggleSort} align="right" />
              <TableHead className="whitespace-nowrap px-3">Validation</TableHead>
              <TableHead className="whitespace-nowrap px-3">Payroll Status</TableHead>
              <TableHead className="whitespace-nowrap px-3 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="text-xs">
                <TableCell className="px-3">
                  <Checkbox
                    checked={selectedIds.has(row.id)}
                    onCheckedChange={(v) => onToggleSelectRow(row.id, v === true)}
                    aria-label={`Select ${row.fullName}`}
                  />
                </TableCell>
                <TableCell className="whitespace-nowrap px-3 font-mono text-[11px]">{row.employeeId}</TableCell>
                <TableCell className="whitespace-nowrap px-3 font-medium">{row.fullName}</TableCell>
                <TableCell className="whitespace-nowrap px-3 text-muted-foreground">{row.department}</TableCell>
                <TableCell className="whitespace-nowrap px-3 text-muted-foreground">{row.designation}</TableCell>
                <TableCell className="px-3 text-right tabular-nums">{row.workingDays}</TableCell>
                <TableCell className="px-3 text-right tabular-nums">{row.presentDays}</TableCell>
                <TableCell className="px-3 text-right tabular-nums">{row.overtimeHours}</TableCell>
                <TableCell className="px-3 text-right tabular-nums">{formatCurrency(row.bonus)}</TableCell>
                <TableCell className="px-3 text-right tabular-nums">{formatCurrency(row.deductions)}</TableCell>
                <TableCell className="px-3 text-right tabular-nums font-medium">{formatCurrency(row.grossSalary)}</TableCell>
                <TableCell className="px-3 text-right tabular-nums font-medium">{formatCurrency(row.netSalary)}</TableCell>
                <TableCell className="px-3">
                  <ValidationBadge status={row.validationStatus} />
                </TableCell>
                <TableCell className="px-3">
                  <PayrollStatusBadge status={row.payrollStatus} />
                </TableCell>
                <TableCell className="px-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs"
                    onClick={() => onViewDetails(row)}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      )}

      {hasRun ? (
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/80 px-4 py-3">
        <p className="text-xs text-muted-foreground">
          Page {page} of {totalPages} · {filteredCount} records
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            const pageNum = i + 1;
            return (
              <Button
                key={pageNum}
                variant={page === pageNum ? "default" : "outline"}
                size="sm"
                className="min-w-8"
                onClick={() => onPageChange(pageNum)}
              >
                {pageNum}
              </Button>
            );
          })}
          {totalPages > 5 ? <span className="px-1 text-xs text-muted-foreground">…</span> : null}
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      ) : null}
    </div>
  );
}

function SortableHead({
  label,
  sortKey,
  active,
  dir,
  onSort,
  align = "left",
}: {
  label: string;
  sortKey: SortKey;
  active: SortKey;
  dir: "asc" | "desc";
  onSort: (key: SortKey) => void;
  align?: "left" | "right";
}) {
  const isActive = active === sortKey;
  return (
    <TableHead
      className={cn(
        "whitespace-nowrap px-3 cursor-pointer select-none hover:text-foreground",
        align === "right" && "text-right",
      )}
      onClick={() => onSort(sortKey)}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {isActive ? (
          dir === "asc" ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )
        ) : (
          <ArrowUpDown className="h-3 w-3 opacity-40" />
        )}
      </span>
    </TableHead>
  );
}

function ValidationBadge({ status }: { status: ValidationStatus }) {
  const config = {
    valid: { label: "Valid", className: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400" },
    warning: { label: "Warning", className: "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400" },
    error: { label: "Error", className: "bg-destructive/10 text-destructive border-destructive/20" },
  }[status];

  const icon = status === "valid" ? "✅" : status === "warning" ? "⚠" : "❌";

  return (
    <Badge variant="outline" className={cn("gap-1 font-normal", config.className)}>
      <span>{icon}</span>
      {config.label}
    </Badge>
  );
}

function PayrollStatusBadge({ status }: { status: PayrollRowStatus }) {
  const config = {
    draft: "secondary",
    validated: "outline",
    locked: "default",
    approved: "default",
  } as const;

  const labels = {
    draft: "Draft",
    validated: "Validated",
    locked: "Locked",
    approved: "Approved",
  };

  return (
    <Badge variant={config[status]} className="font-normal capitalize">
      {labels[status]}
    </Badge>
  );
}

function ValidationIssuesPanel({
  open,
  onOpenChange,
  issues,
  onResolve,
  isRevalidating,
  hasRun,
  isLocked,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  issues: ValidationIssue[];
  onResolve: (issue: ValidationIssue) => void;
  isRevalidating: boolean;
  hasRun: boolean;
  isLocked: boolean;
}) {
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => onOpenChange(true)}
        className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 rounded-l-xl border border-r-0 border-border bg-card px-2 py-6 text-xs font-medium text-muted-foreground shadow-md transition-colors hover:text-foreground xl:block"
      >
        <span className="[writing-mode:vertical-rl] rotate-180">Validation Issues ({issues.length})</span>
      </button>
    );
  }

  return (
    <aside className="hidden w-[320px] shrink-0 xl:block">
      <div className="sticky top-4 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
        <div className="flex items-center justify-between border-b border-border/80 px-4 py-3">
          <div>
            <h3 className="text-sm font-semibold">Validation Issues</h3>
            <p className="text-[11px] text-muted-foreground">{issues.length} items need attention</p>
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-280px)]">
          <div className="space-y-2 p-3">
            {!hasRun ? (
              <p className="py-8 text-center text-xs text-muted-foreground">
                Generate a salary run to see validation issues.
              </p>
            ) : isRevalidating ? (
              <div className="flex items-center justify-center gap-2 py-8 text-xs text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Revalidating payroll…
              </div>
            ) : issues.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center">
                <CheckCircle2 className="mb-2 h-8 w-8 text-emerald-500" />
                <p className="text-xs font-medium">All validations passed</p>
                <p className="mt-1 text-[11px] text-muted-foreground">No issues require attention.</p>
              </div>
            ) : (
            issues.map((issue) => (
              <div
                key={issue.id}
                className="rounded-xl border border-border/60 bg-muted/20 p-3 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-xs font-medium">{issue.employeeName}</p>
                    <p className="text-[11px] text-muted-foreground">{issue.type}</p>
                  </div>
                  <SeverityBadge severity={issue.severity} />
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{issue.description}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 h-7 w-full text-xs"
                  onClick={() => onResolve(issue)}
                  disabled={isLocked}
                >
                  Resolve
                </Button>
              </div>
            ))
            )}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
}

function SeverityBadge({ severity }: { severity: ValidationIssue["severity"] }) {
  const styles = {
    critical: "bg-destructive/10 text-destructive border-destructive/20",
    warning: "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400",
    info: "bg-muted text-muted-foreground border-border",
  };
  return (
    <Badge variant="outline" className={cn("shrink-0 text-[10px] capitalize", styles[severity])}>
      {severity}
    </Badge>
  );
}

function PayrollSummarySection({
  summary,
  deptChartData,
  componentChartData,
  distributionData,
  issueChartData,
}: {
  summary: {
    grossPayroll: number;
    bonusTotal: number;
    totalDeductions: number;
    employerContribution: number;
    netPayroll: number;
    averageSalary: number;
    totalEmployees: number;
  };
  deptChartData: ReturnType<typeof import("../data/salaryProcessingData").buildDepartmentPayroll>;
  componentChartData: ReturnType<typeof import("../data/salaryProcessingData").buildSalaryComponents>;
  distributionData: ReturnType<typeof import("../data/salaryProcessingData").buildPayrollDistribution>;
  issueChartData: ReturnType<typeof import("../data/salaryProcessingData").buildIssueBreakdown>;
}) {
  const tooltipStyle = {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    fontSize: 12,
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold tracking-tight">Payroll Summary</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          <SummaryStat label="Gross Salary" value={formatCurrency(summary.grossPayroll)} />
          <SummaryStat label="Bonus" value={formatCurrency(summary.bonusTotal)} />
          <SummaryStat label="Deductions" value={formatCurrency(summary.totalDeductions)} />
          <SummaryStat label="Employer Contribution" value={formatCurrency(summary.employerContribution)} />
          <SummaryStat label="Net Salary" value={formatCurrency(summary.netPayroll)} highlight />
          <SummaryStat label="Avg. Salary" value={formatCurrency(summary.averageSalary)} />
          <SummaryStat label="Total Employees" value={summary.totalEmployees.toLocaleString()} />
          <SummaryStat label="Departments" value={String(deptChartData.length)} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Payroll Distribution">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={distributionData}>
              <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.12)" vertical={false} />
              <XAxis dataKey="range" tickLine={false} axisLine={false} className="text-[10px]" />
              <YAxis tickLine={false} axisLine={false} className="text-[10px]" />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill={CHART_COLORS[0]} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Salary Components">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={componentChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
              >
                {componentChartData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Department-wise Payroll">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deptChartData} layout="vertical">
              <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.12)" horizontal={false} />
              <XAxis type="number" tickLine={false} axisLine={false} className="text-[10px]" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
              <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={90} className="text-[10px]" />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
              <Bar dataKey="amount" fill={CHART_COLORS[1]} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Validation Issue Breakdown">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={issueChartData}>
              <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.12)" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} className="text-[10px]" interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis tickLine={false} axisLine={false} className="text-[10px]" allowDecimals={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" fill={CHART_COLORS[3]} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function SummaryStat({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={cn("rounded-xl border border-border/60 p-3", highlight && "border-blue-500/30 bg-blue-500/5")}>
      <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("mt-1 text-sm font-semibold tabular-nums", highlight && "text-blue-700 dark:text-blue-400")}>
        {value}
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h3>
      {children}
    </div>
  );
}

function StickyActionBar({
  cycleLabel,
  cycleStatusLabel,
  selectedCount,
  hasRun,
  isGenerating,
  isRevalidating,
  isLocked,
  cycleStatus,
  errorCount,
  hasUnsavedChanges,
  onSaveDraft,
  onRevalidate,
  onPreview,
  onExport,
  onLock,
  onSendForApproval,
  onCompleteApproval,
}: {
  cycleLabel: string;
  cycleStatusLabel: string;
  selectedCount: number;
  hasRun: boolean;
  isGenerating: boolean;
  isRevalidating: boolean;
  isLocked: boolean;
  cycleStatus: string;
  errorCount: number;
  hasUnsavedChanges: boolean;
  onSaveDraft: () => void;
  onRevalidate: () => void;
  onPreview: () => void;
  onExport: () => void;
  onLock: () => void;
  onSendForApproval: () => void;
  onCompleteApproval: () => void;
}) {
  const canLock = hasRun && !isLocked && errorCount === 0 && (cycleStatus === "in_review" || cycleStatus === "validating");
  const canSend = cycleStatus === "locked";
  const canApprove = cycleStatus === "pending_approval";

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/80 bg-background/95 px-4 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          {selectedCount > 0 ? `${selectedCount} employee(s) selected · ` : null}
          {cycleLabel} · {cycleStatusLabel}
          {hasUnsavedChanges ? " · Unsaved changes" : null}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={onSaveDraft} disabled={!hasRun || isGenerating}>
            <Save className="mr-2 h-3.5 w-3.5" />
            Save Draft
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRevalidate}
            disabled={!hasRun || isGenerating || isRevalidating || isLocked}
          >
            {isRevalidating ? (
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-3.5 w-3.5" />
            )}
            Revalidate
          </Button>
          <Button variant="outline" size="sm" onClick={onPreview} disabled={!hasRun || isGenerating}>
            <Eye className="mr-2 h-3.5 w-3.5" />
            Preview Payroll
          </Button>
          <Button variant="outline" size="sm" onClick={onExport} disabled={!hasRun || isGenerating}>
            <FileSpreadsheet className="mr-2 h-3.5 w-3.5" />
            Export Excel
          </Button>
          <Button size="sm" onClick={onLock} disabled={!canLock} className="shadow-sm">
            <Lock className="mr-2 h-3.5 w-3.5" />
            Lock Payroll
          </Button>
          {canApprove ? (
            <Button size="sm" onClick={onCompleteApproval} className="shadow-sm">
              <CheckCircle2 className="mr-2 h-3.5 w-3.5" />
              Mark Approved
            </Button>
          ) : (
            <Button variant="secondary" size="sm" onClick={onSendForApproval} disabled={!canSend}>
              <Send className="mr-2 h-3.5 w-3.5" />
              Send for Approval
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function LockPayrollDialog({
  open,
  onOpenChange,
  onConfirm,
  errorCount,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  errorCount: number;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-muted-foreground" />
            Lock Payroll
          </DialogTitle>
          <DialogDescription className="pt-2 text-sm leading-relaxed">
            Once payroll is locked, salary figures cannot be modified unless the payroll cycle is
            reopened by an authorized administrator.
            {errorCount > 0 ? (
              <span className="mt-2 block font-medium text-destructive">
                {errorCount} validation error(s) must be resolved before locking.
              </span>
            ) : null}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={errorCount > 0}>
            <Lock className="mr-2 h-4 w-4" />
            Lock Payroll
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PeriodChangeDialog({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change payroll period?</DialogTitle>
          <DialogDescription>
            You have unsaved changes in the current cycle. Switching periods will discard them unless
            you save a draft first.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onCancel}>
            Stay on current period
          </Button>
          <Button onClick={onConfirm}>Switch period</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PreviewPayrollDialog({
  open,
  onOpenChange,
  summary,
  cycleLabel,
  rowCount,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  summary: {
    grossPayroll: number;
    netPayroll: number;
    totalDeductions: number;
    bonusTotal: number;
    employerContribution: number;
    totalEmployees: number;
    validationErrors: number;
  };
  cycleLabel: string;
  rowCount: number;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Payroll Preview</DialogTitle>
          <DialogDescription>{cycleLabel}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 py-2">
          <SummaryStat label="Total Employees" value={summary.totalEmployees.toLocaleString()} />
          <SummaryStat label="Sample Records" value={String(rowCount)} />
          <SummaryStat label="Gross Payroll" value={formatCurrency(summary.grossPayroll)} />
          <SummaryStat label="Net Payroll" value={formatCurrency(summary.netPayroll)} highlight />
          <SummaryStat label="Deductions" value={formatCurrency(summary.totalDeductions)} />
          <SummaryStat label="Bonus" value={formatCurrency(summary.bonusTotal)} />
          <SummaryStat label="Employer Contribution" value={formatCurrency(summary.employerContribution)} />
          <SummaryStat label="Validation Errors" value={String(summary.validationErrors)} />
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EmployeeDetailSheet({
  employee,
  onClose,
}: {
  employee: PayrollEmployeeRow | null;
  onClose: () => void;
}) {
  return (
    <Sheet open={!!employee} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md">
        {employee ? (
          <>
            <SheetHeader>
              <SheetTitle>{employee.fullName}</SheetTitle>
              <SheetDescription>
                {employee.employeeId} · {employee.department}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <DetailRow label="Designation" value={employee.designation} />
              <DetailRow label="Working Days" value={String(employee.workingDays)} />
              <DetailRow label="Present Days" value={String(employee.presentDays)} />
              <DetailRow label="Overtime Hours" value={String(employee.overtimeHours)} />
              <DetailRow label="Bonus" value={formatCurrency(employee.bonus)} />
              <DetailRow label="Deductions" value={formatCurrency(employee.deductions)} />
              <DetailRow label="Gross Salary" value={formatCurrency(employee.grossSalary)} />
              <DetailRow label="Net Salary" value={formatCurrency(employee.netSalary)} highlight />
              <div className="flex gap-2 pt-2">
                <ValidationBadge status={employee.validationStatus} />
                <PayrollStatusBadge status={employee.payrollStatus} />
              </div>
            </div>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function DetailRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn("text-sm font-medium tabular-nums", highlight && "text-blue-700 dark:text-blue-400")}>
        {value}
      </span>
    </div>
  );
}
