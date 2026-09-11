import React, { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PayrollBackButton } from "@/features/admin/payroll/components/PayrollBackButton";
import { ShieldAlert, Receipt, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useAurix } from "@/lib/aurix-store";
import { Button } from "@/components/ui/button";

import {
  taxApi,
  AdminTaxItem,
  AdminTaxFilterParams,
  EmployeeTaxProfileResponse,
  TaxAuditLogItem,
} from "@/services/taxApi";

import { TaxHeader } from "@/features/admin/payroll/components/tax/TaxHeader";
import { TaxSummaryCards } from "@/features/admin/payroll/components/tax/TaxSummaryCards";
import { TaxFilterBar } from "@/features/admin/payroll/components/tax/TaxFilterBar";
import { TaxAnalyticsCharts } from "@/features/admin/payroll/components/tax/TaxAnalyticsCharts";
import { TaxTable } from "@/features/admin/payroll/components/tax/TaxTable";
import { EmployeeTaxProfileDrawer } from "@/features/admin/payroll/components/tax/EmployeeTaxProfileDrawer";
import { YearEndProcessingModal } from "@/features/admin/payroll/components/tax/YearEndProcessingModal";
import { TaxAuditLogsModal } from "@/features/admin/payroll/components/tax/TaxAuditLogsModal";

export const Route = createFileRoute("/dashboard/payroll/tax")({
  head: () => ({ meta: [{ title: "Tax Management — OFC360 Enterprise HRMS" }] }),
  component: AdminTaxManagementPage,
});

function AdminTaxManagementPage() {
  const { user } = useAurix();
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/dashboard/payroll/tax" });
  const searchParams = useSearch({ from: "/dashboard/payroll/tax" }) as Record<string, any>;

  // RBAC Access Verification
  const userRole = (user?.role || "").toLowerCase();
  const isEmployeeOnly = userRole === "employee";

  // Filter State initialized from URL Search Params
  const [filters, setFilters] = useState<AdminTaxFilterParams>({
    search: (searchParams?.search as string) || "",
    department: (searchParams?.department as string) || "all",
    designation: (searchParams?.designation as string) || "all",
    location: (searchParams?.location as string) || "all",
    financial_year: (searchParams?.financial_year as string) || "2026-2027",
    tax_regime: (searchParams?.tax_regime as string) || "all",
    status: (searchParams?.status as string) || "all",
    page: searchParams?.page ? Number(searchParams.page) : 1,
    limit: 20,
    sort_by: (searchParams?.sort_by as string) || "name",
    sort_dir: (searchParams?.sort_dir as "asc" | "desc") || "asc",
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals & Drawers state
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<EmployeeTaxProfileResponse | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const [yearEndModalOpen, setYearEndModalOpen] = useState(false);
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState<TaxAuditLogItem[]>([]);
  const [selectedAuditEmpName, setSelectedAuditEmpName] = useState<string>("");
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);

  // TanStack Query for Admin Tax Dashboard (Direct backend API fetch)
  const {
    data: taxDashboardData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin-tax-dashboard", filters],
    queryFn: () => taxApi.getAdminTaxDashboard(filters),
    enabled: !isEmployeeOnly,
    staleTime: 30000,
    retry: 1,
  });

  // Keep URL Search Params synced with filter state
  useEffect(() => {
    const nextSearch: Record<string, any> = {};
    if (filters.search) nextSearch.search = filters.search;
    if (filters.department && filters.department !== "all") nextSearch.department = filters.department;
    if (filters.designation && filters.designation !== "all") nextSearch.designation = filters.designation;
    if (filters.location && filters.location !== "all") nextSearch.location = filters.location;
    if (filters.financial_year) nextSearch.financial_year = filters.financial_year;
    if (filters.tax_regime && filters.tax_regime !== "all") nextSearch.tax_regime = filters.tax_regime;
    if (filters.status && filters.status !== "all") nextSearch.status = filters.status;
    if (filters.page && filters.page > 1) nextSearch.page = filters.page;

    navigate({ search: nextSearch as any, replace: true });
  }, [filters, navigate]);

  // Handle filter changes
  const handleFilterChange = (updated: Partial<AdminTaxFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      department: "all",
      designation: "all",
      location: "all",
      financial_year: "2026-2027",
      tax_regime: "all",
      status: "all",
      page: 1,
      limit: 20,
      sort_by: "name",
      sort_dir: "asc",
    });
    setSelectedIds([]);
  };

  // Selection handlers
  const handleSelectToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAllToggle = (allIds: string[]) => {
    const allSelected = allIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !allIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...allIds])));
    }
  };

  // Mutations
  const taxCalcMutation = useMutation({
    mutationFn: () =>
      taxApi.runTaxCalculation({
        financial_year: filters.financial_year || "2026-2027",
        employee_ids: selectedIds.length > 0 ? selectedIds : undefined,
      }),
    onSuccess: (data) => {
      toast.success(data?.message || "Tax calculation completed successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin-tax-dashboard"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.detail || "Tax calculation failed.");
    },
  });

  const approveMutation = useMutation({
    mutationFn: (declarationId: string) => taxApi.approveDeclaration(declarationId),
    onSuccess: () => {
      toast.success("Tax declaration approved successfully.");
      queryClient.invalidateQueries({ queryKey: ["admin-tax-dashboard"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.detail || "Approval failed.");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      taxApi.rejectDeclaration(id, reason),
    onSuccess: () => {
      toast.success("Tax declaration rejected.");
      queryClient.invalidateQueries({ queryKey: ["admin-tax-dashboard"] });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.detail || "Rejection failed.");
    },
  });

  // Action Handlers
  const handleViewProfile = async (item: AdminTaxItem) => {
    setSelectedEmployeeId(item.employee_id);
    setProfileDrawerOpen(true);
    setIsLoadingProfile(true);
    try {
      const data = await taxApi.getEmployeeTaxProfile(
        item.employee_id,
        filters.financial_year || "2026-2027"
      );
      setProfileData(data);
    } catch (err: any) {
      toast.error("Failed to load employee tax profile.");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleApprove = async (item: AdminTaxItem) => {
    if (!item.declaration_id) {
      toast.error("No declaration submission found for this employee.");
      return;
    }
    await approveMutation.mutateAsync(item.declaration_id);
  };

  const handleReject = async (item: AdminTaxItem) => {
    if (!item.declaration_id) {
      toast.error("No declaration submission found for this employee.");
      return;
    }
    const reason = prompt("Enter reason for declaration rejection:", "Incomplete investment proof submitted.") || "";
    if (!reason.trim()) return;
    await rejectMutation.mutateAsync({ id: item.declaration_id, reason });
  };

  const handleViewAuditLogs = async (item: AdminTaxItem) => {
    setSelectedAuditEmpName(item.employee_name);
    setAuditModalOpen(true);
    setIsLoadingAudit(true);
    try {
      const logs = await taxApi.getTaxAuditLogs(item.employee_id);
      setAuditLogs(logs);
    } catch (err) {
      toast.error("Failed to load audit logs.");
    } finally {
      setIsLoadingAudit(false);
    }
  };

  const handleExportCsv = () => {
    const items = taxDashboardData?.items || [];
    if (items.length === 0) {
      toast.error("No tax records to export.");
      return;
    }

    const headers = [
      "Employee ID",
      "Name",
      "Email",
      "Department",
      "Designation",
      "Financial Year",
      "Tax Regime",
      "Gross Salary",
      "Taxable Income",
      "Deductions",
      "Monthly TDS",
      "Net Tax",
      "Status",
    ];

    const csvRows = items.map((i) => [
      `"${i.employee_code}"`,
      `"${i.employee_name}"`,
      `"${i.email}"`,
      `"${i.department}"`,
      `"${i.designation}"`,
      `"${i.financial_year}"`,
      `"${i.tax_regime}"`,
      i.gross_salary,
      i.taxable_income,
      i.deductions,
      i.tds,
      i.net_tax,
      `"${i.declaration_status}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...csvRows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Tax_Report_${filters.financial_year || "2026-2027"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Tax Report exported successfully.");
  };

  // Block Employee Role Access
  if (isEmployeeOnly) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center space-y-4">
        <div className="h-16 w-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-xl">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div className="space-y-1 max-w-md">
          <h2 className="text-xl font-bold tracking-tight">Access Restricted</h2>
          <p className="text-xs text-muted-foreground">
            The Admin Tax Management module is strictly restricted to Super Admin, Admin, Payroll Admin, and Finance Manager roles.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate({ to: "/dashboard" })} className="text-xs">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PayrollBackButton />
      
      {/* Top Header */}
      <TaxHeader
        onImport={() => toast.info("Import Tax Data modal opened.")}
        onExportCsv={handleExportCsv}
        onExportPdf={() => toast.info("PDF Summary export started.")}
        onRunTaxCalc={() => taxCalcMutation.mutate()}
        onYearEndProcess={() => setYearEndModalOpen(true)}
        isCalculating={taxCalcMutation.isPending}
      />

      {/* API Error Handling Banner */}
      {isError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex flex-wrap items-center justify-between gap-3 text-rose-300 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
            <div>
              <span className="font-semibold text-rose-200">Unable to load payroll tax data</span>
              <p className="text-[11px] opacity-80 mt-0.5">
                {(error as any)?.response?.data?.detail || (error as any)?.message || "A network or server error occurred. Please try again."}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-8 px-3 text-xs border-rose-500/40 text-rose-300 hover:bg-rose-500/20 gap-1.5"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry Connection
          </Button>
        </div>
      )}

      {/* Summary KPI Cards (Powered strictly by backend) */}
      <TaxSummaryCards summary={taxDashboardData?.summary} isLoading={isLoading} />

      {/* Filter Control Bar */}
      <TaxFilterBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Tax Analytics & Adoption Charts (Backend data driven) */}
      <TaxAnalyticsCharts
        summary={taxDashboardData?.summary}
        items={taxDashboardData?.items}
        isLoading={isLoading}
      />

      {/* Main Enterprise Tax Table */}
      <TaxTable
        items={taxDashboardData?.items || []}
        isLoading={isLoading}
        selectedIds={selectedIds}
        onSelectToggle={handleSelectToggle}
        onSelectAllToggle={handleSelectAllToggle}
        onViewProfile={handleViewProfile}
        onApprove={handleApprove}
        onReject={handleReject}
        onViewAuditLogs={handleViewAuditLogs}
        page={filters.page || 1}
        totalPages={taxDashboardData?.pagination?.pages || 1}
        onPageChange={(p) => handleFilterChange({ page: p })}
        sortBy={filters.sort_by}
        sortDir={filters.sort_dir}
        onSortChange={(field) =>
          handleFilterChange({
            sort_by: field,
            sort_dir: filters.sort_by === field && filters.sort_dir === "asc" ? "desc" : "asc",
          })
        }
        onRunTaxCalc={() => taxCalcMutation.mutate()}
      />

      {/* Employee Tax Profile Drawer */}
      <EmployeeTaxProfileDrawer
        isOpen={profileDrawerOpen}
        onClose={() => setProfileDrawerOpen(false)}
        profileData={profileData}
        isLoading={isLoadingProfile}
        onApprove={(declId) => declId && approveMutation.mutate(declId)}
        onReject={(declId) => {
          if (!declId) return;
          const reason = prompt("Enter rejection reason:", "Incomplete proof") || "";
          if (reason) rejectMutation.mutate({ id: declId, reason });
        }}
      />

      {/* Year End Processing Modal */}
      <YearEndProcessingModal
        isOpen={yearEndModalOpen}
        onClose={() => setYearEndModalOpen(false)}
        onConfirm={async (fy) => {
          await taxApi.runYearEndProcess(fy);
          queryClient.invalidateQueries({ queryKey: ["admin-tax-dashboard"] });
        }}
      />

      {/* Compliance Audit Trail Modal */}
      <TaxAuditLogsModal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
        employeeName={selectedAuditEmpName}
        logs={auditLogs}
        isLoading={isLoadingAudit}
      />
    </div>
  );
}
