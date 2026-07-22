import React, { useState, useEffect } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAurix } from "@/lib/aurix-store";
import {
  payslipsApi,
  AdminPayslipItem,
  AdminPayslipsFilterParams,
  PayslipPreviewPayload,
  AuditLogItem,
} from "@/services/payslipsApi";
import { PayslipsHeader } from "@/features/admin/payroll/components/payslips/PayslipsHeader";
import { PayslipsSummaryCards } from "@/features/admin/payroll/components/payslips/PayslipsSummaryCards";
import { PayslipsFilterBar } from "@/features/admin/payroll/components/payslips/PayslipsFilterBar";
import { PayslipsTable } from "@/features/admin/payroll/components/payslips/PayslipsTable";
import { PayslipPreviewDrawer } from "@/features/admin/payroll/components/payslips/PayslipPreviewDrawer";
import { GeneratePayslipModal } from "@/features/admin/payroll/components/payslips/GeneratePayslipModal";
import { BulkEmailModal } from "@/features/admin/payroll/components/payslips/BulkEmailModal";
import { PayslipAuditLogsModal } from "@/features/admin/payroll/components/payslips/PayslipAuditLogsModal";
import { ShieldAlert, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/payroll/payslips")({
  head: () => ({ meta: [{ title: "Payslips Management — Aurix AI" }] }),
  component: AdminPayslipsPage,
});

function AdminPayslipsPage() {
  const { user } = useAurix();
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/dashboard/payroll/payslips" });
  const searchParams = useSearch({ from: "/dashboard/payroll/payslips" }) as Record<string, any>;

  // RBAC Access Verification
  const userRole = (user?.role || "").toLowerCase();
  const isEmployeeOnly = userRole === "employee";
  const canManage = ["admin", "super_admin", "payroll_admin", "hr_manager", "cfo", "ceo"].includes(userRole);
  const canDelete = ["admin", "super_admin", "payroll_admin"].includes(userRole);

  // Filter State initialized from URL Search Params
  const [filters, setFilters] = useState<AdminPayslipsFilterParams>({
    search: (searchParams?.search as string) || "",
    department: (searchParams?.department as string) || "all",
    designation: (searchParams?.designation as string) || "all",
    location: (searchParams?.location as string) || "all",
    month: searchParams?.month ? Number(searchParams.month) : 0,
    year: searchParams?.year ? Number(searchParams.year) : 2026,
    status: (searchParams?.status as string) || "all",
    payment_status: (searchParams?.payment_status as string) || "all",
    employment_type: (searchParams?.employment_type as string) || "all",
    page: searchParams?.page ? Number(searchParams.page) : 1,
    limit: 20,
    sort_by: (searchParams?.sort_by as string) || "created_at",
    sort_dir: (searchParams?.sort_dir as "asc" | "desc") || "desc",
  });

  // Selected row IDs for bulk operations
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals & Drawers state
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [isBulkGenerate, setIsBulkGenerate] = useState(false);
  const [bulkEmailModalOpen, setBulkEmailModalOpen] = useState(false);
  const [previewDrawerOpen, setPreviewDrawerOpen] = useState(false);
  const [selectedPayslipForPreview, setSelectedPayslipForPreview] = useState<AdminPayslipItem | null>(null);
  const [previewPayload, setPreviewPayload] = useState<PayslipPreviewPayload | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  const [auditLogsModalOpen, setAuditLogsModalOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [selectedPayslipForAudit, setSelectedPayslipForAudit] = useState<AdminPayslipItem | null>(null);
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);
  const [isDownloadingBulk, setIsDownloadingBulk] = useState(false);

  // TanStack Query for Payslips
  const { data: payslipsResponse, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["admin-payslips", filters],
    queryFn: () => payslipsApi.getAdminPayslips(filters),
    enabled: !isEmployeeOnly,
    staleTime: 30000,
  });

  // Keep URL Search Params synced with filter state
  useEffect(() => {
    const nextSearch: Record<string, any> = {};
    if (filters.search) nextSearch.search = filters.search;
    if (filters.department && filters.department !== "all") nextSearch.department = filters.department;
    if (filters.designation && filters.designation !== "all") nextSearch.designation = filters.designation;
    if (filters.location && filters.location !== "all") nextSearch.location = filters.location;
    if (filters.month && filters.month > 0) nextSearch.month = filters.month;
    if (filters.year && filters.year > 0) nextSearch.year = filters.year;
    if (filters.status && filters.status !== "all") nextSearch.status = filters.status;
    if (filters.payment_status && filters.payment_status !== "all") nextSearch.payment_status = filters.payment_status;
    if (filters.employment_type && filters.employment_type !== "all") nextSearch.employment_type = filters.employment_type;
    if (filters.page && filters.page > 1) nextSearch.page = filters.page;
    if (filters.sort_by) nextSearch.sort_by = filters.sort_by;
    if (filters.sort_dir) nextSearch.sort_dir = filters.sort_dir;

    navigate({ search: nextSearch as any, replace: true });
  }, [filters, navigate]);

  // Handle filter changes
  const handleFilterChange = (updated: Partial<AdminPayslipsFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      department: "all",
      designation: "all",
      location: "all",
      month: 0,
      year: 2026,
      status: "all",
      payment_status: "all",
      employment_type: "all",
      page: 1,
      limit: 20,
      sort_by: "created_at",
      sort_dir: "desc",
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
  const generateMutation = useMutation({
    mutationFn: (payload: { month: number; year: number; department?: string; employee_ids?: string[] }) =>
      payslipsApi.bulkGeneratePayslips(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-payslips"] });
    },
  });

  const emailMutation = useMutation({
    mutationFn: ({ ids, note }: { ids: string[]; note?: string }) =>
      payslipsApi.bulkEmailPayslips(ids, note),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-payslips"] });
      setSelectedIds([]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => payslipsApi.deletePayslip(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-payslips"] });
    },
  });

  const regenerateMutation = useMutation({
    mutationFn: (id: string) => payslipsApi.regeneratePayslip(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-payslips"] });
    },
  });

  // Action Handlers
  const handleOpenGenerateModal = (isBulk: boolean) => {
    setIsBulkGenerate(isBulk);
    setGenerateModalOpen(true);
  };

  const handleGeneratePayslips = async (data: { month: number; year: number; department?: string }) => {
    await generateMutation.mutateAsync({
      ...data,
      employee_ids: selectedIds.length > 0 ? selectedIds : undefined,
    });
  };

  const handleBulkEmailSend = async (customNote?: string) => {
    const targetIds = selectedIds.length > 0 ? selectedIds : (payslipsResponse?.items.map((i) => i.id) || []);
    if (targetIds.length === 0) return;
    await emailMutation.mutateAsync({ ids: targetIds, note: customNote });
  };

  const handleBulkDownload = async () => {
    const targetIds = selectedIds.length > 0 ? selectedIds : (payslipsResponse?.items.map((i) => i.id) || []);
    if (targetIds.length === 0) return;
    setIsDownloadingBulk(true);
    try {
      const blob = await payslipsApi.bulkDownloadPayslips(targetIds);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `payslips_bundle_${new Date().toISOString().slice(0, 10)}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Bulk download failed:", err);
    } finally {
      setIsDownloadingBulk(false);
    }
  };

  const handlePreviewRow = async (payslip: AdminPayslipItem) => {
    setSelectedPayslipForPreview(payslip);
    setPreviewDrawerOpen(true);
    setIsLoadingPreview(true);
    try {
      const payload = await payslipsApi.getPayslipPreview(payslip.id);
      setPreviewPayload(payload);
    } catch (err) {
      console.error("Failed to load preview:", err);
    } finally {
      setIsLoadingPreview(false);
    }
  };

  const handleDownloadPdfRow = async (payslip: AdminPayslipItem) => {
    try {
      const blob = await payslipsApi.downloadPayslipPdf(payslip.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Payslip_${payslip.payslip_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download PDF failed:", err);
    }
  };

  const handlePrintRow = (payslip: AdminPayslipItem) => {
    handlePreviewRow(payslip);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const handleEmailRow = async (payslip: AdminPayslipItem) => {
    await emailMutation.mutateAsync({ ids: [payslip.id] });
  };

  const handleRegenerateRow = async (payslip: AdminPayslipItem) => {
    await regenerateMutation.mutateAsync(payslip.id);
  };

  const handleViewAuditLogsRow = async (payslip: AdminPayslipItem) => {
    setSelectedPayslipForAudit(payslip);
    setAuditLogsModalOpen(true);
    setIsLoadingAudit(true);
    try {
      const logs = await payslipsApi.getPayslipAuditLogs(payslip.id);
      setAuditLogs(logs);
    } catch (err) {
      console.error("Failed to fetch audit logs:", err);
    } finally {
      setIsLoadingAudit(false);
    }
  };

  const handleDeleteRow = async (payslip: AdminPayslipItem) => {
    if (window.confirm(`Are you sure you want to delete payslip ${payslip.payslip_number}?`)) {
      await deleteMutation.mutateAsync(payslip.id);
    }
  };

  const handleSortChange = (field: string) => {
    setFilters((prev) => ({
      ...prev,
      sort_by: field,
      sort_dir: prev.sort_by === field && prev.sort_dir === "asc" ? "desc" : "asc",
    }));
  };

  const handleExportCsv = () => {
    if (!payslipsResponse?.items || payslipsResponse.items.length === 0) return;
    const headers = ["Payslip Number", "Employee Name", "Employee Code", "Department", "Designation", "Period Month", "Period Year", "Gross Salary", "Deductions", "Net Pay", "Status", "Payment Status"];
    const rows = payslipsResponse.items.map((i) => [
      i.payslip_number,
      i.employee_name,
      i.employee_code,
      i.department,
      i.designation,
      i.period_month,
      i.period_year,
      i.earnings.gross_earnings,
      i.deductions.total_deductions,
      i.net_pay,
      i.status,
      i.payment_status,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `payslips_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // EMPLOYEE ACCESS DENIED GUARD
  if (isEmployeeOnly) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 mb-4">
          <Lock className="h-10 w-10" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Access Restricted — Admin Only</h2>
        <p className="text-sm text-muted-foreground max-w-md mt-2">
          The Admin Payslip Management module is reserved exclusively for Super Admin, Payroll Admin, HR Manager, and Finance roles.
        </p>
        <Button
          className="mt-5 bg-brand text-brand-foreground hover:bg-brand/90"
          onClick={() => window.location.replace("/dashboard/employee")}
        >
          Return to Employee Portal
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-7xl animate-in fade-in duration-300">
      {/* Top Header */}
      <PayslipsHeader
        selectedCount={selectedIds.length}
        onOpenGenerateModal={handleOpenGenerateModal}
        onOpenBulkEmailModal={() => setBulkEmailModalOpen(true)}
        onBulkDownload={handleBulkDownload}
        isDownloadingBulk={isDownloadingBulk}
      />

      {/* Summary KPI Cards */}
      <PayslipsSummaryCards
        summary={payslipsResponse?.summary}
        isLoading={isLoading}
      />

      {/* Filter Bar synced with URL Params */}
      <PayslipsFilterBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        onExportCsv={handleExportCsv}
      />

      {/* Main Payslips Table */}
      <PayslipsTable
        items={payslipsResponse?.items || []}
        total={payslipsResponse?.pagination.total || 0}
        page={filters.page || 1}
        limit={filters.limit || 20}
        totalPages={payslipsResponse?.pagination.totalPages || 1}
        isLoading={isLoading}
        selectedIds={selectedIds}
        onSelectToggle={handleSelectToggle}
        onSelectAllToggle={handleSelectAllToggle}
        onPageChange={(p) => handleFilterChange({ page: p })}
        onPreview={handlePreviewRow}
        onDownloadPdf={handleDownloadPdfRow}
        onPrint={handlePrintRow}
        onEmail={handleEmailRow}
        onRegenerate={handleRegenerateRow}
        onViewAuditLogs={handleViewAuditLogsRow}
        onDelete={handleDeleteRow}
        onSortChange={handleSortChange}
        sortField={filters.sort_by}
        sortDir={filters.sort_dir}
        canDelete={canDelete}
      />

      {/* Drawers & Modals */}
      <PayslipPreviewDrawer
        open={previewDrawerOpen}
        onOpenChange={setPreviewDrawerOpen}
        previewData={previewPayload}
        isLoading={isLoadingPreview}
        onDownloadPdf={() => selectedPayslipForPreview && handleDownloadPdfRow(selectedPayslipForPreview)}
        onPrint={() => selectedPayslipForPreview && handlePrintRow(selectedPayslipForPreview)}
        onEmail={() => selectedPayslipForPreview && handleEmailRow(selectedPayslipForPreview)}
      />

      <GeneratePayslipModal
        open={generateModalOpen}
        onOpenChange={setGenerateModalOpen}
        isBulk={isBulkGenerate}
        onGenerate={handleGeneratePayslips}
      />

      <BulkEmailModal
        open={bulkEmailModalOpen}
        onOpenChange={setBulkEmailModalOpen}
        selectedCount={selectedIds.length > 0 ? selectedIds.length : (payslipsResponse?.items.length || 0)}
        onSendEmail={handleBulkEmailSend}
      />

      <PayslipAuditLogsModal
        open={auditLogsModalOpen}
        onOpenChange={setAuditLogsModalOpen}
        payslipNumber={selectedPayslipForAudit?.payslip_number}
        logs={auditLogs}
        isLoading={isLoadingAudit}
      />
    </div>
  );
}

export default AdminPayslipsPage;
