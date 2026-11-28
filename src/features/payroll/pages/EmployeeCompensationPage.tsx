/**
 * OFC360 — Employee Compensation Management Page
 * Route: /dashboard/payroll/compensation
 *
 * Complete backend-integrated compensation ledger with:
 * - Full-dataset summary KPI cards (showing "—" on failure, never synthetic 0)
 * - Master lookup enrichment (employees, salary structures, departments) avoiding N+1
 * - View Compensation Details drawer, immutable Revision History, Maker-Checker Revise CTC
 * - Multi-facet search, filters, sorting, pagination, CSV formula-safe export
 * - Strict tenant isolation (blocks super_admin and unauthorized roles)
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  CheckCircle as ApproveIcon,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Filter,
  History,
  Layers,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldAlert,
  TrendingUp,
  Upload,
  UserCheck,
  Users,
  Wallet,
  XCircle as RejectIcon,
} from "lucide-react";
import { GlassCard, StatCard } from "@/components/hrms/Shared";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { EmployeeAvatar } from "@/features/admin/employees/components/EmployeeAvatar";
import { useAurix } from "@/lib/aurix-store";
import { formatCount, formatDate } from "@/lib/format";
import { checkRouteAccess } from "@/lib/route-guards";
import { useCurrentRole } from "@/lib/use-current-role";
import { toast } from "sonner";
import {
  compensationApi,
  enrichCompensationWithLookups,
} from "../api/compensationApi";
import {
  CompensationHistoryDialog,
  CompensationRevisionDialog,
  CompensationViewDrawer,
  formatCompensationStatusLabel,
  getCompensationStatusBadgeClass,
} from "../components/CompensationDialogs";
import type {
  BulkCompensationPreviewResult,
  CompensationMasterEmployee,
  CompensationRevisionRecord,
  CompensationSummaryMetrics,
  EmployeeCompensation,
  SalaryStructureTemplate,
} from "../types/compensation";
import { buildSafeCsv } from "../utils/csvProtection";
import { formatPaiseToINR } from "../utils/money";

interface FilterState {
  search: string;
  department: string;
  designation: string;
  employmentType: string;
  structureId: string;
  status: string;
  effectiveFrom: string;
  effectiveTo: string;
  minAnnualCtc: string;
  maxAnnualCtc: string;
  minMonthlyGross: string;
  maxMonthlyGross: string;
}

const EMPTY_FILTERS: FilterState = {
  search: "",
  department: "",
  designation: "",
  employmentType: "",
  structureId: "",
  status: "",
  effectiveFrom: "",
  effectiveTo: "",
  minAnnualCtc: "",
  maxAnnualCtc: "",
  minMonthlyGross: "",
  maxMonthlyGross: "",
};

type SortKey =
  | "employeeName"
  | "department"
  | "ctcAnnualPaise"
  | "grossMonthlyPaise"
  | "effectiveDate"
  | "status";

interface MasterLookupsState {
  employees: CompensationMasterEmployee[];
  employeesById: Map<string, CompensationMasterEmployee>;
  structures: SalaryStructureTemplate[];
  structuresById: Map<string, SalaryStructureTemplate>;
  departments: string[];
  departmentsById: Map<string, string>;
  designations: string[];
}

function getHttpStatus(err: unknown): number | undefined {
  if (err && typeof err === "object" && "response" in err) {
    const resp = (err as { response?: { status?: number } }).response;
    return resp?.status;
  }
  return undefined;
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "response" in err) {
    const data = (err as { response?: { data?: { message?: string; detail?: string } } })
      .response?.data;
    if (typeof data?.message === "string" && data.message.trim()) return data.message;
    if (typeof data?.detail === "string" && data.detail.trim()) return data.detail;
  }
  return err instanceof Error && err.message ? err.message : fallback;
}

export default function EmployeeCompensationPage() {
  const { user } = useAurix();
  const roleFromHook = useCurrentRole();
  const effectiveRole = roleFromHook ?? user?.role ?? null;
  const routeCheck = checkRouteAccess("/dashboard/payroll/compensation", effectiveRole);
  const isAuthorized = routeCheck.allowed && effectiveRole !== "super_admin";

  // ── Core List & Summary State ───────────────────────────────────────
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [backendUnavailable, setBackendUnavailable] = useState(false);
  const [rawItems, setRawItems] = useState<EmployeeCompensation[]>([]);
  const [backendTotal, setBackendTotal] = useState<number>(0);
  const [backendSummary, setBackendSummary] = useState<CompensationSummaryMetrics | null>(null);
  const [companyDataset, setCompanyDataset] = useState<EmployeeCompensation[] | null>(null);
  const [lookups, setLookups] = useState<MasterLookupsState | null>(null);

  // ── Search / Filter / Sort / Pagination State ──────────────────────
  const [draftFilters, setDraftFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>("employeeName");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  // ── View / History / Revise / Assign / Approve / Reject State ──────
  const [selectedEmp, setSelectedEmp] = useState<EmployeeCompensation | null>(null);
  const [viewDrawerOpen, setViewDrawerOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [submittingRevision, setSubmittingRevision] = useState(false);

  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignEmp, setAssignEmp] = useState<EmployeeCompensation | null>(null);
  const [assignStructureId, setAssignStructureId] = useState("");
  const [assignCtcRupees, setAssignCtcRupees] = useState("");
  const [assignEffectiveDate, setAssignEffectiveDate] = useState("");
  const [submittingAssign, setSubmittingAssign] = useState(false);

  const [selectedRevision, setSelectedRevision] = useState<CompensationRevisionRecord | null>(null);
  const [approveRevisionModalOpen, setApproveRevisionModalOpen] = useState(false);
  const [approvalRemarks, setApprovalRemarks] = useState("");
  const [rejectRevisionModalOpen, setRejectRevisionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [approvingRevision, setApprovingRevision] = useState(false);
  const [rejectingRevision, setRejectingRevision] = useState(false);

  // ── Bulk Import State ───────────────────────────────────────────────
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const [bulkPreview, setBulkPreview] = useState<BulkCompensationPreviewResult | null>(null);
  const [parsingBulk, setParsingBulk] = useState(false);
  const [applyingBulk, setApplyingBulk] = useState(false);

  const lookupsLoadedRef = useRef(false);

  const loadMasterData = useCallback(async () => {
    if (!isAuthorized) return;
    try {
      const data = await compensationApi.getMasterLookups();
      setLookups(data);
      lookupsLoadedRef.current = true;
    } catch {
      // Master enrichment is best-effort alongside primary compensation API
    }
  }, [isAuthorized]);

  const loadCompensations = useCallback(async () => {
    if (!isAuthorized) return;
    setLoading(true);
    setLoadError(null);
    setBackendUnavailable(false);
    try {
      const res = await compensationApi.getEmployeeCompensations({
        page,
        limit,
        search: appliedFilters.search.trim() || undefined,
        department: appliedFilters.department || undefined,
        designation: appliedFilters.designation || undefined,
        employmentType: appliedFilters.employmentType || undefined,
        structureId: appliedFilters.structureId || undefined,
        status: appliedFilters.status || undefined,
        effectiveFrom: appliedFilters.effectiveFrom || undefined,
        effectiveTo: appliedFilters.effectiveTo || undefined,
        minAnnualCtc: appliedFilters.minAnnualCtc
          ? Number(appliedFilters.minAnnualCtc)
          : undefined,
        maxAnnualCtc: appliedFilters.maxAnnualCtc
          ? Number(appliedFilters.maxAnnualCtc)
          : undefined,
        minMonthlyGross: appliedFilters.minMonthlyGross
          ? Number(appliedFilters.minMonthlyGross)
          : undefined,
        maxMonthlyGross: appliedFilters.maxMonthlyGross
          ? Number(appliedFilters.maxMonthlyGross)
          : undefined,
        sortBy,
        sortDir,
      });

      const items = res?.items || [];
      setRawItems(items);
      setBackendTotal(res?.total ?? items.length);
      setBackendSummary(res?.summary ?? null);

      const hasActiveFilters = Object.values(appliedFilters).some((v) => v.trim() !== "");
      if (!res?.summary && !hasActiveFilters && items.length >= (res?.total ?? items.length)) {
        // Full dataset already received on this page cleanly
        setCompanyDataset(items);
      } else if (!res?.summary && (res?.total ?? 0) > items.length && (res?.total ?? 0) <= 500) {
        // Retrieve full dataset once so summary KPIs never reflect only 1 paginated slice
        void compensationApi
          .getEmployeeCompensations({ page: 1, limit: 500 })
          .then((fullRes) => {
            if (Array.isArray(fullRes?.items)) setCompanyDataset(fullRes.items);
          })
          .catch(() => {
            setCompanyDataset(null);
          });
      }
    } catch (err: unknown) {
      const status = getHttpStatus(err);
      if (status === 404 || status === 501) {
        setBackendUnavailable(true);
        setLoadError("Compensation API endpoint is not deployed yet.");
      } else if (status === 401 || status === 403) {
        setLoadError("You do not have permission to view employee compensation records.");
      } else {
        setLoadError(getErrorMessage(err, "Unable to Load Compensation"));
      }
      setRawItems([]);
      setBackendSummary(null);
    } finally {
      setLoading(false);
    }
  }, [isAuthorized, page, limit, appliedFilters, sortBy, sortDir]);

  useEffect(() => {
    if (!isAuthorized) return;
    if (!lookupsLoadedRef.current) {
      void loadMasterData();
    }
    void loadCompensations();
  }, [isAuthorized, loadMasterData, loadCompensations]);

  // Hydrate table items with batch master lookups when compensation response omits joined fields
  const enrichedItems = useMemo(
    () => rawItems.map((item) => enrichCompensationWithLookups(item, lookups ?? undefined)),
    [rawItems, lookups]
  );

  // Client-side consistency guard for filters & sorting when backend ignores optional params
  const filteredAndSortedItems = useMemo(() => {
    const q = appliedFilters.search.trim().toLowerCase();
    const minCtcPaise = appliedFilters.minAnnualCtc
      ? Number(appliedFilters.minAnnualCtc) * 100
      : null;
    const maxCtcPaise = appliedFilters.maxAnnualCtc
      ? Number(appliedFilters.maxAnnualCtc) * 100
      : null;
    const minGrossPaise = appliedFilters.minMonthlyGross
      ? Number(appliedFilters.minMonthlyGross) * 100
      : null;
    const maxGrossPaise = appliedFilters.maxMonthlyGross
      ? Number(appliedFilters.maxMonthlyGross) * 100
      : null;

    const filtered = enrichedItems.filter((item) => {
      if (q) {
        const hay = `${item.employeeName} ${item.employeeCode} ${item.department} ${item.structureName} ${item.designation}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (
        appliedFilters.department &&
        item.department.toLowerCase() !== appliedFilters.department.toLowerCase()
      ) {
        return false;
      }
      if (
        appliedFilters.designation &&
        item.designation.toLowerCase() !== appliedFilters.designation.toLowerCase()
      ) {
        return false;
      }
      if (
        appliedFilters.employmentType &&
        (item.employmentType || "").toLowerCase() !== appliedFilters.employmentType.toLowerCase()
      ) {
        return false;
      }
      if (appliedFilters.structureId && item.structureId !== appliedFilters.structureId) {
        return false;
      }
      if (appliedFilters.status && item.status !== appliedFilters.status) {
        return false;
      }
      if (appliedFilters.effectiveFrom && item.effectiveDate < appliedFilters.effectiveFrom) {
        return false;
      }
      if (
        appliedFilters.effectiveTo &&
        (!item.effectiveDate || item.effectiveDate > appliedFilters.effectiveTo)
      ) {
        return false;
      }
      if (minCtcPaise !== null && Number.isFinite(minCtcPaise)) {
        if (item.ctcAnnualPaise === null || item.ctcAnnualPaise < minCtcPaise) return false;
      }
      if (maxCtcPaise !== null && Number.isFinite(maxCtcPaise)) {
        if (item.ctcAnnualPaise === null || item.ctcAnnualPaise > maxCtcPaise) return false;
      }
      if (minGrossPaise !== null && Number.isFinite(minGrossPaise)) {
        if (item.grossMonthlyPaise === null || item.grossMonthlyPaise < minGrossPaise) return false;
      }
      if (maxGrossPaise !== null && Number.isFinite(maxGrossPaise)) {
        if (item.grossMonthlyPaise === null || item.grossMonthlyPaise > maxGrossPaise) return false;
      }
      return true;
    });

    const sorted = [...filtered].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      switch (sortBy) {
        case "ctcAnnualPaise":
          return ((a.ctcAnnualPaise ?? -1) - (b.ctcAnnualPaise ?? -1)) * dir;
        case "grossMonthlyPaise":
          return ((a.grossMonthlyPaise ?? -1) - (b.grossMonthlyPaise ?? -1)) * dir;
        case "effectiveDate":
          return (a.effectiveDate || "").localeCompare(b.effectiveDate || "") * dir;
        case "department":
          return (a.department || "").localeCompare(b.department || "") * dir;
        case "status":
          return (a.status || "").localeCompare(b.status || "") * dir;
        case "employeeName":
        default:
          return (a.employeeName || "").localeCompare(b.employeeName || "") * dir;
      }
    });

    return sorted;
  }, [enrichedItems, appliedFilters, sortBy, sortDir]);

  // ── Full-Dataset Summary KPI Computation (Never fakes 0 on failure) ──
  const summaryKpis = useMemo(() => {
    if (loadError) return null;

    if (backendSummary) {
      return backendSummary;
    }

    const baseList = companyDataset
      ? companyDataset.map((c) => enrichCompensationWithLookups(c, lookups ?? undefined))
      : !Object.values(appliedFilters).some((v) => v.trim() !== "") && backendTotal <= rawItems.length
        ? enrichedItems
        : null;

    if (!baseList) {
      const employeeMasterTotal = lookups?.employees?.length ?? null;
      return {
        totalEmployees: employeeMasterTotal ?? (backendTotal > 0 ? backendTotal : null),
        assignedEmployees: null,
        totalAnnualCtcPaise: null,
        totalMonthlyGrossPaise: null,
        averageAnnualCtcPaise: null,
        pendingRevisions: null,
        unassignedEmployees: null,
        structuresInUse: null,
        source: "unavailable" as const,
      };
    }

    const withCtc = baseList.filter((i) => i.ctcAnnualPaise !== null);
    const assignedCount = baseList.filter(
      (i) => i.status !== "not_assigned" && (i.structureId !== "" || i.ctcAnnualPaise !== null)
    ).length;
    const unassignedCount = baseList.length - assignedCount;
    const totalAnnualCtcPaise = withCtc.reduce((sum, i) => sum + (i.ctcAnnualPaise ?? 0), 0);

    const withGross = baseList.filter((i) => i.grossMonthlyPaise !== null);
    const totalMonthlyGrossPaise =
      withGross.length > 0
        ? withGross.reduce((sum, i) => sum + (i.grossMonthlyPaise ?? 0), 0)
        : null;

    const avgAnnualCtcPaise =
      withCtc.length > 0 ? Math.round(totalAnnualCtcPaise / withCtc.length) : null;

    const pendingCount = baseList.filter((i) => i.status === "pending_approval").length;
    const totalEmployees =
      lookups?.employees && lookups.employees.length > baseList.length
        ? lookups.employees.length
        : Math.max(baseList.length, backendTotal);

    return {
      totalEmployees,
      assignedEmployees: assignedCount,
      totalAnnualCtcPaise: withCtc.length > 0 ? totalAnnualCtcPaise : null,
      totalMonthlyGrossPaise,
      averageAnnualCtcPaise: avgAnnualCtcPaise,
      pendingRevisions: pendingCount,
      unassignedEmployees: Math.max(unassignedCount, totalEmployees - assignedCount),
      structuresInUse: new Set(baseList.map((i) => i.structureId).filter(Boolean)).size,
      source: "dataset_computed" as const,
    };
  }, [
    loadError,
    backendSummary,
    companyDataset,
    lookups,
    appliedFilters,
    backendTotal,
    rawItems.length,
    enrichedItems,
  ]);

  // ── Filter Options Derived Strictly from Lookups & Loaded Rows ──────
  const filterOptions = useMemo(() => {
    const depts = new Set<string>(lookups?.departments || []);
    const desigs = new Set<string>(lookups?.designations || []);
    for (const row of enrichedItems) {
      if (row.department) depts.add(row.department);
      if (row.designation) desigs.add(row.designation);
    }
    return {
      departments: Array.from(depts).sort((a, b) => a.localeCompare(b)),
      designations: Array.from(desigs).sort((a, b) => a.localeCompare(b)),
      structures: lookups?.structures || [],
    };
  }, [lookups, enrichedItems]);

  // ── Row Detail Hydration Helper (View / History / Revise) ───────────
  const fetchEnrichedEmployeeDetail = async (
    emp: EmployeeCompensation
  ): Promise<EmployeeCompensation> => {
    const detail = await compensationApi.getEmployeeCompensationDetail(emp.employeeId);
    const merged: EmployeeCompensation = {
      ...emp,
      ...detail,
      employeeName: detail.employeeName || emp.employeeName,
      employeeCode: detail.employeeCode || emp.employeeCode,
      department: detail.department || emp.department,
      designation: detail.designation || emp.designation,
      employmentType: detail.employmentType || emp.employmentType,
      joiningDate: detail.joiningDate || emp.joiningDate,
      profileImage: detail.profileImage || emp.profileImage,
      structureId: detail.structureId || emp.structureId,
      structureName:
        detail.structureName && detail.structureName !== "Not Assigned"
          ? detail.structureName
          : emp.structureName,
      ctcAnnualPaise: detail.ctcAnnualPaise ?? emp.ctcAnnualPaise,
      ctcAnnualFormatted:
        detail.ctcAnnualFormatted !== "—" ? detail.ctcAnnualFormatted : emp.ctcAnnualFormatted,
      grossMonthlyPaise: detail.grossMonthlyPaise ?? emp.grossMonthlyPaise,
      grossMonthlyFormatted:
        detail.grossMonthlyFormatted !== "—"
          ? detail.grossMonthlyFormatted
          : emp.grossMonthlyFormatted,
      effectiveDate: detail.effectiveDate || emp.effectiveDate,
    };

    if (!merged.structureId || merged.structureName === "Not Assigned") {
      const assignedStruct = await compensationApi.getEmployeeSalaryStructure(emp.employeeId);
      if (assignedStruct) {
        merged.structureId = assignedStruct.id;
        merged.structureName = assignedStruct.name;
        merged.structureCode = assignedStruct.code;
      }
    }

    return enrichCompensationWithLookups(merged, lookups ?? undefined);
  };

  const handleOpenView = async (emp: EmployeeCompensation) => {
    if (!emp.employeeId) {
      toast.error("Cannot open compensation details: missing Employee ID.");
      return;
    }
    setSelectedEmp(emp);
    setViewDrawerOpen(true);
    setDetailLoading(true);
    try {
      const hydrated = await fetchEnrichedEmployeeDetail(emp);
      setSelectedEmp(hydrated);
    } catch {
      // Keep row snapshot when detail call fails cleanly
    } finally {
      setDetailLoading(false);
    }
  };

  const handleOpenHistory = async (emp: EmployeeCompensation) => {
    if (!emp.employeeId) {
      toast.error("Cannot load history: missing Employee ID.");
      return;
    }
    setSelectedEmp(emp);
    setHistoryModalOpen(true);
    setHistoryLoading(true);
    setHistoryError(null);
    try {
      const hydrated = await fetchEnrichedEmployeeDetail(emp);
      setSelectedEmp(hydrated);
    } catch (err: unknown) {
      const status = getHttpStatus(err);
      if (status !== 404) {
        setHistoryError(getErrorMessage(err, "Unable to fetch full revision history."));
      }
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleOpenRevise = async (emp: EmployeeCompensation) => {
    if (!emp.employeeId) {
      toast.error("Cannot propose CTC revision: missing Employee ID.");
      return;
    }
    setSelectedEmp(emp);
    setRevisionModalOpen(true);
    try {
      const hydrated = await fetchEnrichedEmployeeDetail(emp);
      setSelectedEmp(hydrated);
    } catch {
      // Keep baseline row data cleanly
    }
  };

  const handleProposeRevision = async (payload: {
    newCtcAnnualPaise: number;
    salaryStructureId?: string;
    revisionPercentage?: number;
    effectiveDate: string;
    reason: string;
    notes?: string;
  }) => {
    if (!selectedEmp) return;
    setSubmittingRevision(true);
    try {
      await compensationApi.proposeCompensationRevision(selectedEmp.employeeId, payload);
      toast.success("Compensation revision proposed for approval.");
      setRevisionModalOpen(false);
      await loadCompensations();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to propose compensation revision"));
    } finally {
      setSubmittingRevision(false);
    }
  };

  const handleOpenAssign = (emp: EmployeeCompensation) => {
    setAssignEmp(emp);
    setAssignStructureId(emp.structureId || "");
    setAssignCtcRupees(emp.ctcAnnualPaise ? String(emp.ctcAnnualPaise / 100) : "");
    setAssignEffectiveDate(emp.effectiveDate || "");
    setAssignModalOpen(true);
  };

  const handleAssignStructure = async () => {
    if (!assignEmp?.employeeId || !assignStructureId) {
      toast.error("Select a salary structure template.");
      return;
    }
    setSubmittingAssign(true);
    try {
      await compensationApi.assignSalaryStructure(assignStructureId, {
        employeeId: assignEmp.employeeId,
        employee_id: assignEmp.employeeId,
        employeeIds: [assignEmp.employeeId],
        annualCtc: assignCtcRupees ? Number(assignCtcRupees) : undefined,
        effectiveFrom: assignEffectiveDate || undefined,
        effectiveDate: assignEffectiveDate || undefined,
      });
      toast.success("Salary structure assigned cleanly.");
      setAssignModalOpen(false);
      await loadCompensations();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to assign salary structure"));
    } finally {
      setSubmittingAssign(false);
    }
  };

  const handleApproveRevision = async () => {
    if (!selectedRevision || approvalRemarks.trim().length < 5) {
      toast.error("Approval remarks must be at least 5 characters.");
      return;
    }
    setApprovingRevision(true);
    try {
      await compensationApi.approveCompensationRevision(
        selectedRevision.id,
        approvalRemarks.trim()
      );
      toast.success("Compensation revision approved.");
      setApproveRevisionModalOpen(false);
      setApprovalRemarks("");
      await loadCompensations();
      if (selectedEmp && historyModalOpen) {
        const refreshed = await fetchEnrichedEmployeeDetail(selectedEmp);
        setSelectedEmp(refreshed);
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to approve compensation revision"));
    } finally {
      setApprovingRevision(false);
    }
  };

  const handleRejectRevision = async () => {
    if (!selectedRevision || rejectionReason.trim().length < 5) {
      toast.error("Rejection reason must be at least 5 characters.");
      return;
    }
    setRejectingRevision(true);
    try {
      await compensationApi.rejectCompensationRevision(
        selectedRevision.id,
        rejectionReason.trim()
      );
      toast.warning("Compensation revision rejected.");
      setRejectRevisionModalOpen(false);
      setRejectionReason("");
      await loadCompensations();
      if (selectedEmp && historyModalOpen) {
        const refreshed = await fetchEnrichedEmployeeDetail(selectedEmp);
        setSelectedEmp(refreshed);
      }
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to reject compensation revision"));
    } finally {
      setRejectingRevision(false);
    }
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBulkFile(file);
    setParsingBulk(true);
    try {
      const preview = await compensationApi.previewBulkCompensation(file);
      setBulkPreview(preview);
      toast.info(
        `Bulk template validated: ${preview.validRows} valid rows, ${preview.invalidRows} errors.`
      );
    } catch (err: unknown) {
      const status = getHttpStatus(err);
      if (status === 404 || status === 501) {
        toast.error("Bulk compensation service unavailable — backend pending");
      } else {
        toast.error(getErrorMessage(err, "Failed to validate bulk compensation CSV"));
      }
    } finally {
      setParsingBulk(false);
    }
  };

  const handleApplyBulk = async () => {
    if (!bulkPreview || applyingBulk) return;
    setApplyingBulk(true);
    try {
      const res = await compensationApi.applyBulkCompensation(bulkPreview.previewToken);
      toast.success(`Bulk compensation updated: ${res.appliedCount} records updated.`);
      setBulkModalOpen(false);
      setBulkPreview(null);
      setBulkFile(null);
      await loadCompensations();
    } catch (err: unknown) {
      toast.error(getErrorMessage(err, "Failed to apply bulk compensation updates"));
    } finally {
      setApplyingBulk(false);
    }
  };

  const handleExportCsv = () => {
    if (filteredAndSortedItems.length === 0) {
      toast.info("No compensation records available to export.");
      return;
    }
    const headers = [
      "Employee Code",
      "Employee Name",
      "Department",
      "Designation",
      "Salary Structure",
      "Annual CTC",
      "Monthly Gross",
      "Effective Date",
      "Status",
    ];
    const rows = filteredAndSortedItems.map((emp) => [
      emp.employeeCode || "Not Available",
      emp.employeeName || "Not Available",
      emp.department || "Not Available",
      emp.designation || "Not Available",
      emp.structureName || "Not Assigned",
      emp.ctcAnnualFormatted,
      emp.grossMonthlyFormatted,
      emp.effectiveDate ? formatDate(emp.effectiveDate) : "Not Configured",
      formatCompensationStatusLabel(emp.status, emp.statusRaw),
    ]);
    const csv = buildSafeCsv(headers, rows);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ofc360-compensation-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    toast.success("Compensation register exported.");
  };

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(key);
      setSortDir("asc");
    }
    setPage(1);
  };

  const applyFilters = () => {
    setPage(1);
    setAppliedFilters(draftFilters);
  };

  const resetFilters = () => {
    setPage(1);
    setDraftFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
  };

  // ── RBAC / Tenant Isolation Guard View ─────────────────────────────
  if (!isAuthorized) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <GlassCard className="border-rose-500/30 bg-rose-500/5 p-6">
          <div className="flex items-start gap-3">
            <ShieldAlert className="h-6 w-6 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <h1 className="text-base font-bold text-foreground">
                Access Denied — Company Compensation Isolation
              </h1>
              <p className="mt-1 text-xs text-muted-foreground">
                {effectiveRole === "super_admin"
                  ? "Super Admin platform accounts are strictly isolated from tenant employee compensation and salary structures."
                  : routeCheck.reason || "You do not have permission to view or revise employee compensation."}
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil((backendTotal || filteredAndSortedItems.length) / limit));

  const renderSortIcon = (key: SortKey) => {
    if (sortBy !== key) return <ArrowUpDown className="h-3 w-3 opacity-50" />;
    return sortDir === "asc" ? <ArrowUp className="h-3 w-3 text-primary" /> : <ArrowDown className="h-3 w-3 text-primary" />;
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 p-4 sm:p-6 lg:p-8">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
              Employee Compensation & Revisions
            </h1>
            <Badge
              variant="outline"
              className="text-xs font-semibold border-primary/30 bg-primary/10 text-primary"
            >
              CTC Management
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Authoritative salary structure assignments, gross & CTC ledger, revision history, and maker-checker governance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              void loadMasterData();
              void loadCompensations();
            }}
            className="h-8 gap-1.5 text-xs rounded-xl"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            disabled={filteredAndSortedItems.length === 0}
            className="h-8 gap-1.5 text-xs rounded-xl"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setBulkModalOpen(true)}
            className="h-8 gap-1.5 text-xs rounded-xl"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Bulk CSV Import</span>
          </Button>
        </div>
      </div>

      {/* ── API Error / Backend Unavailable Alerts ─────────────────── */}
      {backendUnavailable && (
        <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="font-semibold text-sm">
            Compensation Service Unavailable
          </AlertTitle>
          <AlertDescription className="text-xs mt-1">
            <code>GET /api/v2/payroll/compensations</code> returned 404/501. No synthetic compensation records are displayed.
          </AlertDescription>
        </Alert>
      )}

      {loadError && !backendUnavailable && (
        <Alert variant="destructive" className="rounded-2xl text-xs">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-xs font-semibold">Unable to Load Compensation</AlertTitle>
          <AlertDescription className="mt-1 flex items-center justify-between gap-2">
            <span>{loadError}</span>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => void loadCompensations()}
              className="h-7 rounded-lg text-xs"
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* ── Compensation Summary KPI Cards ─────────────────────────── */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
        <StatCard
          label="Total Employees"
          value={
            loading && !summaryKpis
              ? "—"
              : summaryKpis?.totalEmployees !== null && summaryKpis?.totalEmployees !== undefined
                ? formatCount(summaryKpis.totalEmployees)
                : "—"
          }
          hint="Authorized company roster"
          icon={Users}
          accent="brand"
        />
        <StatCard
          label="Assigned Comp."
          value={
            summaryKpis?.assignedEmployees !== null && summaryKpis?.assignedEmployees !== undefined
              ? formatCount(summaryKpis.assignedEmployees)
              : "—"
          }
          hint="With active/configured pay"
          icon={UserCheck}
          accent="success"
        />
        <StatCard
          label="Total Annual CTC"
          value={
            summaryKpis?.totalAnnualCtcPaise !== null && summaryKpis?.totalAnnualCtcPaise !== undefined
              ? formatPaiseToINR(summaryKpis.totalAnnualCtcPaise)
              : "—"
          }
          hint="Full dataset annual CTC"
          icon={Wallet}
          accent="brand"
        />
        <StatCard
          label="Total Monthly Gross"
          value={
            summaryKpis?.totalMonthlyGrossPaise !== null && summaryKpis?.totalMonthlyGrossPaise !== undefined
              ? formatPaiseToINR(summaryKpis.totalMonthlyGrossPaise)
              : "—"
          }
          hint="Actual monthly gross"
          icon={TrendingUp}
          accent="success"
        />
        <StatCard
          label="Average Annual CTC"
          value={
            summaryKpis?.averageAnnualCtcPaise !== null && summaryKpis?.averageAnnualCtcPaise !== undefined
              ? formatPaiseToINR(summaryKpis.averageAnnualCtcPaise)
              : "—"
          }
          hint="Mean assigned CTC"
          icon={Layers}
          accent="muted"
        />
        <StatCard
          label="Pending Revisions"
          value={
            summaryKpis?.pendingRevisions !== null && summaryKpis?.pendingRevisions !== undefined
              ? formatCount(summaryKpis.pendingRevisions)
              : "—"
          }
          hint="Awaiting checker approval"
          icon={History}
          accent="warning"
        />
        <StatCard
          label="Without Structure"
          value={
            summaryKpis?.unassignedEmployees !== null && summaryKpis?.unassignedEmployees !== undefined
              ? formatCount(summaryKpis.unassignedEmployees)
              : "—"
          }
          hint="Needs structure assignment"
          icon={AlertCircle}
          accent="danger"
        />
      </div>

      {/* ── Search & Multi-Dimensional Filters ─────────────────────── */}
      <GlassCard className="p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              id="emp-comp-search-input"
              type="search"
              placeholder="Search employee name, code, department, or salary structure..."
              value={draftFilters.search}
              onChange={(e) => setDraftFilters((prev) => ({ ...prev, search: e.target.value }))}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyFilters();
              }}
              className="pl-8 h-9 rounded-xl text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowFilters((prev) => !prev)}
              className="h-9 gap-1.5 rounded-xl text-xs"
            >
              <Filter className="h-3.5 w-3.5" />
              <span>{showFilters ? "Hide Filters" : "More Filters"}</span>
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={applyFilters}
              className="h-9 rounded-xl px-4 text-xs"
            >
              Apply Filters
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-9 gap-1 rounded-xl text-xs text-muted-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 border-t border-border/60 pt-3 text-xs">
            <div>
              <label className="text-[11px] font-medium text-muted-foreground">Department</label>
              <select
                aria-label="Filter by Department"
                value={draftFilters.department}
                onChange={(e) =>
                  setDraftFilters((prev) => ({ ...prev, department: e.target.value }))
                }
                className="mt-1 h-8 w-full rounded-lg border border-input bg-background px-2 text-xs"
              >
                <option value="">All Departments</option>
                {filterOptions.departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground">Designation</label>
              <select
                aria-label="Filter by Designation"
                value={draftFilters.designation}
                onChange={(e) =>
                  setDraftFilters((prev) => ({ ...prev, designation: e.target.value }))
                }
                className="mt-1 h-8 w-full rounded-lg border border-input bg-background px-2 text-xs"
              >
                <option value="">All Designations</option>
                {filterOptions.designations.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground">Employment Type</label>
              <select
                aria-label="Filter by Employment Type"
                value={draftFilters.employmentType}
                onChange={(e) =>
                  setDraftFilters((prev) => ({ ...prev, employmentType: e.target.value }))
                }
                className="mt-1 h-8 w-full rounded-lg border border-input bg-background px-2 text-xs"
              >
                <option value="">All Types</option>
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="intern">Intern</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground">Salary Structure</label>
              <select
                aria-label="Filter by Salary Structure"
                value={draftFilters.structureId}
                onChange={(e) =>
                  setDraftFilters((prev) => ({ ...prev, structureId: e.target.value }))
                }
                className="mt-1 h-8 w-full rounded-lg border border-input bg-background px-2 text-xs"
              >
                <option value="">All Structures</option>
                {filterOptions.structures.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground">Compensation Status</label>
              <select
                aria-label="Filter by Status"
                value={draftFilters.status}
                onChange={(e) => setDraftFilters((prev) => ({ ...prev, status: e.target.value }))}
                className="mt-1 h-8 w-full rounded-lg border border-input bg-background px-2 text-xs"
              >
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="scheduled">Scheduled</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="expired">Expired</option>
                <option value="superseded">Superseded</option>
                <option value="not_assigned">Not Assigned</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground">Effective From</label>
              <Input
                type="date"
                value={draftFilters.effectiveFrom}
                onChange={(e) =>
                  setDraftFilters((prev) => ({ ...prev, effectiveFrom: e.target.value }))
                }
                className="mt-1 h-8 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-muted-foreground">Effective To</label>
              <Input
                type="date"
                value={draftFilters.effectiveTo}
                onChange={(e) =>
                  setDraftFilters((prev) => ({ ...prev, effectiveTo: e.target.value }))
                }
                className="mt-1 h-8 rounded-lg text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <div>
                <label className="text-[11px] font-medium text-muted-foreground">Min CTC (₹)</label>
                <Input
                  type="number"
                  placeholder="Min"
                  value={draftFilters.minAnnualCtc}
                  onChange={(e) =>
                    setDraftFilters((prev) => ({ ...prev, minAnnualCtc: e.target.value }))
                  }
                  className="mt-1 h-8 rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] font-medium text-muted-foreground">Max CTC (₹)</label>
                <Input
                  type="number"
                  placeholder="Max"
                  value={draftFilters.maxAnnualCtc}
                  onChange={(e) =>
                    setDraftFilters((prev) => ({ ...prev, maxAnnualCtc: e.target.value }))
                  }
                  className="mt-1 h-8 rounded-lg text-xs font-mono"
                />
              </div>
            </div>
          </div>
        )}
      </GlassCard>

      {/* ── Compensation Ledger Table ──────────────────────────────── */}
      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground border-b border-border/70 uppercase tracking-wider text-[11px] font-semibold">
              <tr>
                <th className="px-4 py-3.5">
                  <button
                    type="button"
                    onClick={() => toggleSort("employeeName")}
                    className="inline-flex items-center gap-1 hover:text-foreground"
                  >
                    Employee {renderSortIcon("employeeName")}
                  </button>
                </th>
                <th className="px-4 py-3.5">
                  <button
                    type="button"
                    onClick={() => toggleSort("department")}
                    className="inline-flex items-center gap-1 hover:text-foreground"
                  >
                    Department {renderSortIcon("department")}
                  </button>
                </th>
                <th className="px-4 py-3.5">Salary Structure</th>
                <th className="px-4 py-3.5 text-right font-mono">
                  <button
                    type="button"
                    onClick={() => toggleSort("ctcAnnualPaise")}
                    className="inline-flex items-center gap-1 hover:text-foreground ml-auto"
                  >
                    Annual CTC {renderSortIcon("ctcAnnualPaise")}
                  </button>
                </th>
                <th className="px-4 py-3.5 text-right font-mono">
                  <button
                    type="button"
                    onClick={() => toggleSort("grossMonthlyPaise")}
                    className="inline-flex items-center gap-1 hover:text-foreground ml-auto"
                  >
                    Monthly Gross {renderSortIcon("grossMonthlyPaise")}
                  </button>
                </th>
                <th className="px-4 py-3.5">
                  <button
                    type="button"
                    onClick={() => toggleSort("effectiveDate")}
                    className="inline-flex items-center gap-1 hover:text-foreground"
                  >
                    Effective Date {renderSortIcon("effectiveDate")}
                  </button>
                </th>
                <th className="px-4 py-3.5">
                  <button
                    type="button"
                    onClick={() => toggleSort("status")}
                    className="inline-flex items-center gap-1 hover:text-foreground"
                  >
                    Status {renderSortIcon("status")}
                  </button>
                </th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`skeleton-${i}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-3.5 w-32" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Skeleton className="h-3.5 w-24" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-3.5 w-36" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-3.5 w-24 ml-auto" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-3.5 w-20 ml-auto" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-3.5 w-20" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-5 w-16 rounded-full" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-7 w-40 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredAndSortedItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                    <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground/60" />
                    <p className="font-semibold text-foreground text-sm">
                      {loadError ? "Unable to Load Compensation" : "No Compensation Records Found"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {loadError
                        ? loadError
                        : backendUnavailable
                          ? "Compensation API pending backend deployment."
                          : "Adjust your search/filters or assign salary structures to employees."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredAndSortedItems.map((emp) => {
                  const hasValidEmpId = Boolean(emp.employeeId);
                  const isUnassigned = !emp.structureId && emp.structureName === "Not Assigned";
                  const missingReason = !hasValidEmpId
                    ? "Unavailable: missing Employee ID from backend record"
                    : undefined;

                  return (
                    <tr key={emp.id} className="hover:bg-muted/40 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <EmployeeAvatar
                            src={emp.profileImage}
                            name={emp.employeeName || emp.employeeCode || "Employee"}
                            className="h-8 w-8 rounded-full object-cover shrink-0 border border-border/70"
                            fallbackClassName="h-8 w-8 rounded-full inline-flex items-center justify-center bg-primary/10 font-semibold text-primary text-[11px] shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-foreground truncate">
                              {emp.employeeName || "Not Available"}
                            </div>
                            <div className="text-[11px] text-muted-foreground font-mono truncate">
                              {emp.employeeCode || "Code Not Available"}
                              {emp.designation ? ` • ${emp.designation}` : ""}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-foreground">
                        {emp.department || (
                          <span className="text-muted-foreground">Not Available</span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {isUnassigned ? (
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] text-muted-foreground">
                              Not Assigned
                            </Badge>
                            {hasValidEmpId && filterOptions.structures.length > 0 && (
                              <button
                                type="button"
                                onClick={() => handleOpenAssign(emp)}
                                className="text-[11px] font-medium text-primary hover:underline"
                              >
                                Assign
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="font-medium text-primary">
                            {emp.structureName || "Not Configured"}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 font-mono font-semibold text-right text-foreground tabular-nums">
                        {emp.ctcAnnualFormatted !== "—" ? (
                          emp.ctcAnnualFormatted
                        ) : (
                          <span className="font-sans font-normal text-muted-foreground">Not Configured</span>
                        )}
                      </td>

                      <td className="px-4 py-3 font-mono text-right text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums">
                        {emp.grossMonthlyFormatted !== "—" ? (
                          emp.grossMonthlyFormatted
                        ) : (
                          <span className="font-sans font-normal text-muted-foreground">Not Available</span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {emp.effectiveDate ? formatDate(emp.effectiveDate) : "Not Configured"}
                      </td>

                      <td className="px-4 py-3">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-medium whitespace-nowrap ${getCompensationStatusBadgeClass(emp.status)}`}
                        >
                          {formatCompensationStatusLabel(emp.status, emp.statusRaw)}
                        </Badge>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            disabled={!hasValidEmpId}
                            title={missingReason || "View Compensation Details"}
                            onClick={() => void handleOpenView(emp)}
                            className="h-7 text-xs rounded-lg gap-1 px-2"
                          >
                            <Eye className="h-3 w-3" />
                            <span>View</span>
                          </Button>

                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={!hasValidEmpId}
                            title={missingReason || "View Revision History"}
                            onClick={() => void handleOpenHistory(emp)}
                            className="h-7 text-xs rounded-lg gap-1 px-2"
                          >
                            <History className="h-3 w-3" />
                            <span>History</span>
                          </Button>

                          <Button
                            type="button"
                            size="sm"
                            disabled={!hasValidEmpId}
                            title={missingReason || "Propose CTC Revision"}
                            onClick={() => void handleOpenRevise(emp)}
                            className="h-7 text-xs rounded-lg gap-1 px-2.5"
                          >
                            <TrendingUp className="h-3 w-3" />
                            <span>Revise CTC</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Server / Dataset Pagination Footer ───────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 px-4 py-3 text-xs text-muted-foreground">
          <div>
            Showing{" "}
            <strong className="text-foreground">
              {filteredAndSortedItems.length > 0 ? (page - 1) * limit + 1 : 0}–
              {(page - 1) * limit + filteredAndSortedItems.length}
            </strong>{" "}
            of <strong className="text-foreground">{formatCount(backendTotal || filteredAndSortedItems.length)}</strong> records
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5">
              <span>Rows:</span>
              <select
                aria-label="Rows per page"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="h-7 rounded-lg border border-input bg-background px-2 text-xs text-foreground"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </label>

            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-7 px-2 rounded-lg text-xs gap-1"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Prev
              </Button>
              <span className="px-2 tabular-nums">
                Page {page} / {totalPages}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="h-7 px-2 rounded-lg text-xs gap-1"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* ── View Compensation Details Drawer ───────────────────────── */}
      <CompensationViewDrawer
        open={viewDrawerOpen}
        onOpenChange={setViewDrawerOpen}
        employee={selectedEmp}
        loading={detailLoading}
        onOpenHistory={(emp) => void handleOpenHistory(emp)}
        onOpenRevise={(emp) => void handleOpenRevise(emp)}
      />

      {/* ── Revision History Modal ─────────────────────────────────── */}
      <CompensationHistoryDialog
        open={historyModalOpen}
        onOpenChange={setHistoryModalOpen}
        employee={selectedEmp}
        loading={historyLoading}
        error={historyError}
        canApprove={effectiveRole === "hr_admin"}
        onApproveClick={(rev) => {
          setSelectedRevision(rev);
          setApproveRevisionModalOpen(true);
        }}
        onRejectClick={(rev) => {
          setSelectedRevision(rev);
          setRejectRevisionModalOpen(true);
        }}
      />

      {/* ── Revise CTC Dialog ──────────────────────────────────────── */}
      <CompensationRevisionDialog
        open={revisionModalOpen}
        onOpenChange={setRevisionModalOpen}
        employee={selectedEmp}
        structures={filterOptions.structures}
        submitting={submittingRevision}
        onSubmitRevision={handleProposeRevision}
      />

      {/* ── Assign Salary Structure Dialog ─────────────────────────── */}
      <Dialog open={assignModalOpen} onOpenChange={setAssignModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Assign Salary Structure</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Assign a configured salary structure template to{" "}
              <strong className="text-foreground">{assignEmp?.employeeName || "Employee"}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div>
              <label className="font-semibold text-foreground">Salary Structure *</label>
              <select
                value={assignStructureId}
                onChange={(e) => setAssignStructureId(e.target.value)}
                className="mt-1 h-8 w-full rounded-lg border border-input bg-background px-2 text-xs"
              >
                <option value="">Select Structure</option>
                {filterOptions.structures.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-semibold text-foreground">Annual CTC (INR)</label>
              <Input
                type="number"
                placeholder="e.g. 1200000"
                value={assignCtcRupees}
                onChange={(e) => setAssignCtcRupees(e.target.value)}
                className="mt-1 h-8 rounded-lg text-xs font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-foreground">Effective From Date</label>
              <Input
                type="date"
                value={assignEffectiveDate}
                onChange={(e) => setAssignEffectiveDate(e.target.value)}
                className="mt-1 h-8 rounded-lg text-xs"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAssignModalOpen(false)}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={submittingAssign || !assignStructureId}
              onClick={() => void handleAssignStructure()}
              className="rounded-xl text-xs"
            >
              {submittingAssign ? "Assigning..." : "Assign Structure"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Bulk Import Modal ──────────────────────────────────────── */}
      <Dialog open={bulkModalOpen} onOpenChange={setBulkModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Bulk Compensation Update (CSV)</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Upload a batch spreadsheet to update employee CTC figures across your organization.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="rounded-xl border border-dashed border-border/80 p-6 text-center space-y-2">
              <Upload className="h-6 w-6 mx-auto text-primary" />
              <div>
                <label className="font-semibold cursor-pointer text-primary hover:underline">
                  {parsingBulk ? "Validating CSV..." : "Select Bulk Compensation CSV"}
                  <input
                    id="bulk-comp-input"
                    type="file"
                    accept=".csv"
                    onChange={(e) => void handleBulkUpload(e)}
                    className="hidden"
                  />
                </label>
                {bulkFile && (
                  <p className="text-[11px] font-mono text-foreground mt-1">{bulkFile.name}</p>
                )}
                <p className="text-[10px] text-muted-foreground mt-1">
                  Required columns: EmployeeCode, ComponentCode, Amount, EffectiveDate
                </p>
              </div>
            </div>

            {bulkPreview && (
              <div className="space-y-3 pt-2 border-t border-border/60">
                <div className="flex items-center justify-between font-semibold text-foreground">
                  <span>Validation Preview</span>
                  <span>{bulkPreview.affectedEmployeesCount} Employees Affected</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                    <span className="font-bold">{bulkPreview.validRows}</span> Valid Rows
                  </div>
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-700 dark:text-rose-300">
                    <span className="font-bold">{bulkPreview.invalidRows}</span> Errors
                  </div>
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300">
                    <span className="font-bold">{bulkPreview.duplicateRows}</span> Duplicates
                  </div>
                </div>

                {bulkPreview.errors.length > 0 && (
                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-3 space-y-1">
                    <span className="font-semibold text-rose-600">Row Errors (Will be skipped)</span>
                    <ul className="list-disc pl-4 text-[10px] text-muted-foreground space-y-0.5">
                      {bulkPreview.errors.slice(0, 3).map((err, i) => (
                        <li key={i}>
                          Row {err.rowNumber} ({err.employeeCode}): {err.errorMessage}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setBulkModalOpen(false);
                setBulkPreview(null);
              }}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={!bulkPreview || bulkPreview.validRows === 0 || applyingBulk}
              onClick={() => void handleApplyBulk()}
              className="rounded-xl text-xs"
            >
              {applyingBulk ? "Applying..." : `Apply ${bulkPreview?.validRows || 0} Records`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Approve Revision Modal ─────────────────────────────────── */}
      <Dialog open={approveRevisionModalOpen} onOpenChange={setApproveRevisionModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-base">
              <ApproveIcon className="h-4 w-4 text-primary" />
              Approve Compensation Revision
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Review and approve the proposed compensation revision.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="rounded-xl border border-border/50 p-3">
              <p className="font-medium text-foreground">
                Proposed By: {selectedRevision?.maker?.name || "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                Revision #{selectedRevision?.revisionNumber ?? "—"} •{" "}
                {selectedRevision?.effectiveDate
                  ? formatDate(selectedRevision.effectiveDate)
                  : "Not Available"}
              </p>
              <p className="text-xs mt-1">
                <span className="text-muted-foreground">Previous: </span>
                <span className="font-mono">{selectedRevision?.previousCtcFormatted || "—"}</span>
                <span className="mx-2 text-muted-foreground">→</span>
                <span className="font-mono font-bold text-foreground">
                  {selectedRevision?.newCtcFormatted || "—"}
                </span>
              </p>
              <p className="text-xs mt-1 text-muted-foreground">"{selectedRevision?.reason || "—"}"</p>
            </div>

            <div>
              <label className="font-semibold text-foreground">Approval Remarks *</label>
              <Textarea
                id="approve-revision-remarks"
                placeholder="e.g. Approved per annual appraisal cycle."
                value={approvalRemarks}
                onChange={(e) => setApprovalRemarks(e.target.value)}
                rows={3}
                className="mt-1 rounded-lg text-xs"
              />
              <span className="text-[10px] text-muted-foreground">Minimum 5 characters required.</span>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setApproveRevisionModalOpen(false);
                setApprovalRemarks("");
              }}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              disabled={approvingRevision}
              onClick={() => void handleApproveRevision()}
              className="rounded-xl text-xs"
            >
              {approvingRevision ? "Approving..." : "Approve Revision"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Reject Revision Modal ──────────────────────────────────── */}
      <Dialog open={rejectRevisionModalOpen} onOpenChange={setRejectRevisionModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display text-base text-destructive">
              <RejectIcon className="h-4 w-4" />
              Reject Compensation Revision
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Reject the proposed compensation revision with a mandatory audit reason.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="rounded-xl border border-border/50 p-3">
              <p className="font-medium text-foreground">
                Proposed By: {selectedRevision?.maker?.name || "—"}
              </p>
              <p className="text-xs text-muted-foreground">
                Revision #{selectedRevision?.revisionNumber ?? "—"} •{" "}
                {selectedRevision?.effectiveDate
                  ? formatDate(selectedRevision.effectiveDate)
                  : "Not Available"}
              </p>
              <p className="text-xs mt-1">
                <span className="text-muted-foreground">Previous: </span>
                <span className="font-mono">{selectedRevision?.previousCtcFormatted || "—"}</span>
                <span className="mx-2 text-muted-foreground">→</span>
                <span className="font-mono font-bold text-foreground">
                  {selectedRevision?.newCtcFormatted || "—"}
                </span>
              </p>
              <p className="text-xs mt-1 text-muted-foreground">"{selectedRevision?.reason || "—"}"</p>
            </div>

            <div>
              <label className="font-semibold text-foreground">Rejection Reason *</label>
              <Textarea
                id="reject-revision-reason"
                placeholder="e.g. CTC increase exceeds budget allocation."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="mt-1 rounded-lg text-xs"
              />
              <span className="text-[10px] text-muted-foreground">Minimum 5 characters required.</span>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setRejectRevisionModalOpen(false);
                setRejectionReason("");
              }}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              disabled={rejectingRevision}
              onClick={() => void handleRejectRevision()}
              className="rounded-xl text-xs"
            >
              {rejectingRevision ? "Rejecting..." : "Confirm Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
