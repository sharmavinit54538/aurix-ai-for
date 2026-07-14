import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  buildIssueBreakdown,
  buildDepartmentPayroll,
  buildPayrollDistribution,
  buildSalaryComponents,
  computeSummaryMetrics,
  type PayrollEmployeeRow,
  type ValidationIssue,
} from "../data/salaryProcessingData";
import {
  ENTERPRISE_EMPLOYEE_COUNT,
  applyApprovedStatuses,
  applyLockedStatuses,
  applyValidatedStatuses,
  buildCycleKey,
  buildCycleLabel,
  computeCompletedSteps,
  deriveCurrentStep,
  derivePayrollStatusLabel,
  exportRowsToCsv,
  getActiveIssues,
  loadDraft,
  resolveIssueForEmployee,
  saveDraft,
  simulateRevalidation,
  simulateSalaryRunGeneration,
  type CycleStatus,
  type PayrollRunSnapshot,
} from "../services/salaryProcessingService";

export function useSalaryProcessing() {
  const [month, setMonthState] = useState("July");
  const [year, setYearState] = useState("2026");
  const [payrollType, setPayrollTypeState] = useState("Regular Monthly");

  const [rows, setRows] = useState<PayrollEmployeeRow[]>([]);
  const [resolvedIssueIds, setResolvedIssueIds] = useState<Set<string>>(new Set());
  const [cycleStatus, setCycleStatus] = useState<CycleStatus>("idle");
  const [generateProgress, setGenerateProgress] = useState({ processed: 0, total: ENTERPRISE_EMPLOYEE_COUNT });
  const [isRevalidating, setIsRevalidating] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [periodChangePending, setPeriodChangePending] = useState<{
    month: string;
    year: string;
    payrollType: string;
  } | null>(null);

  const cycleKey = buildCycleKey(month, year, payrollType);
  const cycleLabel = buildCycleLabel(month, year, payrollType);
  const hasRun = rows.length > 0;
  const isGenerating = cycleStatus === "generating";
  const isLocked = cycleStatus === "locked" || cycleStatus === "pending_approval" || cycleStatus === "approved";

  const issues = useMemo(
    () => getActiveIssues(rows, resolvedIssueIds),
    [rows, resolvedIssueIds],
  );

  const errorCount = useMemo(
    () => rows.filter((row) => row.validationStatus === "error").length,
    [rows],
  );

  const completedSteps = useMemo(
    () => computeCompletedSteps(cycleStatus, hasRun, errorCount),
    [cycleStatus, hasRun, errorCount],
  );

  const currentStep = useMemo(
    () => deriveCurrentStep(cycleStatus, hasRun, errorCount),
    [cycleStatus, hasRun, errorCount],
  );

  const summary = useMemo(() => {
    const base = hasRun
      ? computeSummaryMetrics(rows)
      : {
          totalEmployees: ENTERPRISE_EMPLOYEE_COUNT,
          employeesProcessed: 0,
          grossPayroll: 0,
          netPayroll: 0,
          totalDeductions: 0,
          validationErrors: 0,
          pendingReviews: 0,
          payrollStatus: "Draft" as const,
          bonusTotal: 0,
          employerContribution: 0,
          averageSalary: 0,
        };

    if (isGenerating) {
      return {
        ...base,
        employeesProcessed: generateProgress.processed,
        payrollStatus: "Validating" as const,
      };
    }

    const statusMap: Record<CycleStatus, typeof base.payrollStatus> = {
      idle: "Draft",
      generating: "Validating",
      draft: "Draft",
      validating: "Validating",
      in_review: "In Review",
      locked: "Ready to Lock",
      pending_approval: "In Review",
      approved: "Ready to Lock",
    };

    return {
      ...base,
      payrollStatus: statusMap[cycleStatus],
    };
  }, [rows, hasRun, isGenerating, generateProgress.processed, cycleStatus]);

  const deptChartData = useMemo(() => buildDepartmentPayroll(rows), [rows]);
  const componentChartData = useMemo(() => buildSalaryComponents(rows), [rows]);
  const distributionData = useMemo(() => buildPayrollDistribution(rows), [rows]);
  const issueChartData = useMemo(() => buildIssueBreakdown(issues), [issues]);

  const loadedCycleRef = useRef<string | null>(null);

  const resetRunState = useCallback(() => {
    setRows([]);
    setResolvedIssueIds(new Set());
    setCycleStatus("idle");
    setGenerateProgress({ processed: 0, total: ENTERPRISE_EMPLOYEE_COUNT });
    setHasUnsavedChanges(false);
    setLastSavedAt(null);
  }, []);

  const applySnapshot = useCallback((snapshot: PayrollRunSnapshot) => {
    setRows(snapshot.rows);
    setResolvedIssueIds(new Set(snapshot.resolvedIssueIds));
    setCycleStatus(snapshot.cycleStatus);
    setLastSavedAt(snapshot.savedAt);
    setHasUnsavedChanges(false);
  }, []);

  useEffect(() => {
    if (loadedCycleRef.current === cycleKey) return;
    loadedCycleRef.current = cycleKey;

    const draft = loadDraft(cycleKey);
    if (draft) {
      applySnapshot(draft);
      toast.info(`Loaded saved draft for ${buildCycleLabel(draft.month, draft.year, draft.payrollType)}`);
    } else {
      resetRunState();
    }
  }, [cycleKey, applySnapshot, resetRunState]);

  useEffect(() => {
    if (hasRun && errorCount === 0 && cycleStatus === "validating") {
      setCycleStatus("in_review");
    }
  }, [hasRun, errorCount, cycleStatus]);

  const requestPeriodChange = useCallback(
    (next: { month?: string; year?: string; payrollType?: string }) => {
      const nextMonth = next.month ?? month;
      const nextYear = next.year ?? year;
      const nextType = next.payrollType ?? payrollType;
      const nextKey = buildCycleKey(nextMonth, nextYear, nextType);

      if (nextKey === cycleKey) return;

      if (hasRun && hasUnsavedChanges) {
        setPeriodChangePending({ month: nextMonth, year: nextYear, payrollType: nextType });
        return;
      }

      loadedCycleRef.current = null;
      setMonthState(nextMonth);
      setYearState(nextYear);
      setPayrollTypeState(nextType);
    },
    [month, year, payrollType, cycleKey, hasRun, hasUnsavedChanges],
  );

  const confirmPeriodChange = useCallback(() => {
    if (!periodChangePending) return;
    loadedCycleRef.current = null;
    setMonthState(periodChangePending.month);
    setYearState(periodChangePending.year);
    setPayrollTypeState(periodChangePending.payrollType);
    setPeriodChangePending(null);
  }, [periodChangePending]);

  const cancelPeriodChange = useCallback(() => {
    setPeriodChangePending(null);
  }, []);

  const markDirty = useCallback(() => setHasUnsavedChanges(true), []);

  const generateSalaryRun = useCallback(async () => {
    if (isGenerating) return;

    if (isLocked) {
      toast.error("Payroll is locked. Reopen the cycle before generating a new run.");
      return;
    }

    setCycleStatus("generating");
    setGenerateProgress({ processed: 0, total: ENTERPRISE_EMPLOYEE_COUNT });
    setResolvedIssueIds(new Set());

    try {
      const generated = await simulateSalaryRunGeneration(cycleKey, (processed, total) => {
        setGenerateProgress({ processed, total });
      });

      setRows(generated);
      setCycleStatus("validating");
      setHasUnsavedChanges(true);
      toast.success(`Salary run generated for ${cycleLabel}`, {
        description: `Processed ${ENTERPRISE_EMPLOYEE_COUNT.toLocaleString()} employees. Review validation results.`,
      });
    } catch {
      setCycleStatus("idle");
      toast.error("Failed to generate salary run. Please try again.");
    }
  }, [cycleKey, cycleLabel, isGenerating, isLocked]);

  const revalidate = useCallback(async () => {
    if (!hasRun || isRevalidating || isLocked) return;

    setIsRevalidating(true);
    setCycleStatus("validating");
    toast.message("Revalidating payroll…");

    try {
      await simulateRevalidation();
      let updatedErrors = 0;
      setRows((prev) => {
        const updated = applyValidatedStatuses(prev);
        updatedErrors = updated.filter((row) => row.validationStatus === "error").length;
        return updated;
      });

      if (updatedErrors === 0) {
        setCycleStatus("in_review");
        toast.success("Validation complete", { description: "All checks passed. Ready for review." });
      } else {
        setCycleStatus("validating");
        toast.warning(`${updatedErrors} validation error(s) remain`, {
          description: "Resolve issues before locking payroll.",
        });
      }
      markDirty();
    } finally {
      setIsRevalidating(false);
    }
  }, [hasRun, isRevalidating, isLocked, markDirty]);

  const resolveIssue = useCallback(
    (issue: ValidationIssue) => {
      if (isLocked) {
        toast.error("Cannot resolve issues on a locked payroll cycle.");
        return;
      }

      setRows((prev) => resolveIssueForEmployee(prev, issue));
      setResolvedIssueIds((prev) => new Set(prev).add(issue.id));
      markDirty();
      toast.success(`Resolved: ${issue.type}`, { description: issue.employeeName });
    },
    [isLocked, markDirty],
  );

  const saveDraftToStorage = useCallback(() => {
    if (!hasRun) {
      toast.message("Nothing to save", { description: "Generate a salary run first." });
      return;
    }

    const savedAt = new Date().toISOString();
    const snapshot: PayrollRunSnapshot = {
      cycleKey,
      month,
      year,
      payrollType,
      rows,
      resolvedIssueIds: [...resolvedIssueIds],
      currentStep,
      completedSteps,
      cycleStatus,
      savedAt,
    };

    saveDraft(snapshot);
    setLastSavedAt(savedAt);
    setHasUnsavedChanges(false);
    toast.success("Draft saved", {
      description: `${cycleLabel} · ${rows.length} employee records`,
    });
  }, [
    hasRun,
    cycleKey,
    month,
    year,
    payrollType,
    rows,
    resolvedIssueIds,
    currentStep,
    completedSteps,
    cycleStatus,
    cycleLabel,
  ]);

  const lockPayroll = useCallback(() => {
    if (!hasRun) return;

    if (errorCount > 0) {
      toast.error("Cannot lock payroll", {
        description: `${errorCount} validation error(s) must be resolved first.`,
      });
      return;
    }

    if (cycleStatus !== "in_review" && cycleStatus !== "validating") {
      toast.error("Complete validation and review before locking.");
      return;
    }

    setRows((prev) => applyLockedStatuses(prev));
    setCycleStatus("locked");
    markDirty();
    toast.success("Payroll locked", {
      description: "Salary figures are now immutable for this cycle.",
    });
  }, [hasRun, errorCount, cycleStatus, markDirty]);

  const sendForApproval = useCallback(() => {
    if (cycleStatus !== "locked") {
      toast.error("Lock payroll before sending for approval.");
      return;
    }

    setCycleStatus("pending_approval");
    markDirty();
    toast.success("Sent for approval", {
      description: "Finance approvers have been notified.",
    });
  }, [cycleStatus, markDirty]);

  const completeApproval = useCallback(() => {
    if (cycleStatus !== "pending_approval") return;

    setRows((prev) => applyApprovedStatuses(prev));
    setCycleStatus("approved");
    markDirty();
    toast.success("Payroll approved", {
      description: "Proceed to bank transfer and payslip generation.",
    });
  }, [cycleStatus, markDirty]);

  const exportExcel = useCallback(() => {
    if (!hasRun) {
      toast.message("Nothing to export");
      return;
    }
    exportRowsToCsv(rows, `payroll-${cycleKey.replace(/\s+/g, "-").toLowerCase()}.csv`);
    toast.success("Export started", { description: "Payroll CSV downloaded." });
  }, [hasRun, rows, cycleKey]);

  return {
    month,
    year,
    payrollType,
    setMonth: (value: string) => requestPeriodChange({ month: value }),
    setYear: (value: string) => requestPeriodChange({ year: value }),
    setPayrollType: (value: string) => requestPeriodChange({ payrollType: value }),

    rows,
    issues,
    summary,
    deptChartData,
    componentChartData,
    distributionData,
    issueChartData,

    cycleLabel,
    cycleStatus,
    cycleStatusLabel: derivePayrollStatusLabel(cycleStatus),
    currentStep,
    completedSteps,
    hasRun,
    isGenerating,
    isRevalidating,
    isLocked,
    generateProgress,
    errorCount,
    hasUnsavedChanges,
    lastSavedAt,

    periodChangePending,
    confirmPeriodChange,
    cancelPeriodChange,

    generateSalaryRun,
    revalidate,
    resolveIssue,
    saveDraftToStorage,
    lockPayroll,
    sendForApproval,
    completeApproval,
    exportExcel,
  };
}
