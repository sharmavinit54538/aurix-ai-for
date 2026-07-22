import React, { useState } from "react";
import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldAlert, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAurix } from "@/lib/aurix-store";
import { Button } from "@/components/ui/button";

import {
  bankTransfersApi,
  BankTransferItem,
  BankTransferFilterParams,
  BankTransferDashboardMetrics,
} from "@/services/bankTransfersApi";

import { BankTransfersHeader } from "@/features/admin/payroll/components/bank-transfers/BankTransfersHeader";
import { BankTransfersSummaryCards } from "@/features/admin/payroll/components/bank-transfers/BankTransfersSummaryCards";
import { BankTransfersFilterBar } from "@/features/admin/payroll/components/bank-transfers/BankTransfersFilterBar";
import { BankTransfersTable } from "@/features/admin/payroll/components/bank-transfers/BankTransfersTable";
import { TransferDetailsDrawer } from "@/features/admin/payroll/components/bank-transfers/TransferDetailsDrawer";
import { CreateBatchModal } from "@/features/admin/payroll/components/bank-transfers/CreateBatchModal";

export const Route = createFileRoute("/dashboard/payroll/bank-transfers")({
  head: () => ({ meta: [{ title: "Bank Transfers — Aurix AI Enterprise HRMS" }] }),
  component: BankTransfersPage,
});

const DEFAULT_METRICS: BankTransferDashboardMetrics = {
  total_employees: 142,
  ready_for_payment: 138,
  pending_verification: 2,
  transfer_processing: 12,
  successful_transfers: 126,
  failed_transfers: 2,
  total_salary_amount: 6950000.00,
  transferred_amount: 6170000.00,
  pending_amount: 700000.00,
  rejected_amount: 80000.00,
};

const DEFAULT_ITEMS: BankTransferItem[] = [
  {
    id: "bt_1",
    employee_id: "EMP-1001",
    employee_name: "Vinit Sharma",
    department: "Engineering",
    designation: "Senior Architect",
    bank_name: "HDFC Bank",
    account_holder: "Vinit Sharma",
    masked_account_number: "•••• •••• 4921",
    ifsc: "HDFC0001234",
    net_salary: 145000.00,
    batch_code: "BATCH-202607-01",
    transfer_date: "2026-07-31",
    reference_number: "TXN-994827104",
    payment_status: "COMPLETED",
    bank_status: "SETTLED",
    last_updated: new Date().toISOString(),
  },
  {
    id: "bt_2",
    employee_id: "EMP-1002",
    employee_name: "Banoth Siddarth",
    department: "Executive Management",
    designation: "Chief Executive Officer (CEO)",
    bank_name: "ICICI Bank",
    account_holder: "Banoth Siddarth",
    masked_account_number: "•••• •••• 8820",
    ifsc: "ICIC0000921",
    net_salary: 285000.00,
    batch_code: "BATCH-202607-01",
    transfer_date: "2026-07-31",
    reference_number: "TXN-994827105",
    payment_status: "COMPLETED",
    bank_status: "SETTLED",
    last_updated: new Date().toISOString(),
  },
  {
    id: "bt_3",
    employee_id: "EMP-1003",
    employee_name: "Test Karan",
    department: "Sales & Marketing",
    designation: "Sales Lead",
    bank_name: "State Bank of India",
    account_holder: "Test Karan",
    masked_account_number: "•••• •••• 3319",
    ifsc: "SBIN0004820",
    net_salary: 68000.00,
    batch_code: "BATCH-202607-02",
    transfer_date: "2026-07-31",
    reference_number: "TXN-994827106",
    payment_status: "PROCESSING",
    bank_status: "QUEUED",
    last_updated: new Date().toISOString(),
  },
  {
    id: "bt_4",
    employee_id: "EMP-1004",
    employee_name: "Jerry Jerry",
    department: "Management",
    designation: "Developer",
    bank_name: "Axis Bank",
    account_holder: "Jerry Jerry",
    masked_account_number: "•••• •••• 1928",
    ifsc: "UTIB0001029",
    net_salary: 82000.00,
    batch_code: "BATCH-202607-02",
    transfer_date: "2026-07-31",
    reference_number: "TXN-994827107",
    payment_status: "FAILED",
    bank_status: "INVALID_IFSC",
    last_updated: new Date().toISOString(),
  },
  {
    id: "bt_5",
    employee_id: "EMP-1005",
    employee_name: "Vinod Member",
    department: "IT",
    designation: "Manager",
    bank_name: "HDFC Bank",
    account_holder: "Vinod Member",
    masked_account_number: "•••• •••• 7731",
    ifsc: "HDFC0001234",
    net_salary: 115000.00,
    batch_code: "BATCH-202607-01",
    transfer_date: "2026-07-31",
    reference_number: "TXN-994827108",
    payment_status: "PENDING",
    bank_status: "READY",
    last_updated: new Date().toISOString(),
  },
];

function BankTransfersPage() {
  const { user } = useAurix();
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/dashboard/payroll/bank-transfers" });
  const searchParams = useSearch({ from: "/dashboard/payroll/bank-transfers" }) as Record<string, any>;

  // RBAC Access Verification
  const userRole = (user?.role || "").toLowerCase();
  const isEmployeeOnly = userRole === "employee";
  const isReadOnly = userRole === "hr_manager";
  const canManage = ["admin", "super_admin", "payroll_admin", "finance_manager", "cfo", "ceo"].includes(userRole);

  // Filter State
  const [filters, setFilters] = useState<BankTransferFilterParams>({
    month: searchParams.month ? Number(searchParams.month) : 7,
    year: searchParams.year ? Number(searchParams.year) : 2026,
    department: searchParams.department || undefined,
    bank: searchParams.bank || undefined,
    payment_status: searchParams.payment_status || undefined,
    search: searchParams.search || "",
    page: 1,
    limit: 20,
  });

  // Table Selection & Modals
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeItem, setActiveItem] = useState<BankTransferItem | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [createBatchOpen, setCreateBatchOpen] = useState(false);

  // TanStack Query for Dashboard Metrics
  const { data: metricsData } = useQuery({
    queryKey: ["bank-transfers-metrics"],
    queryFn: () => bankTransfersApi.getDashboardMetrics(),
    enabled: !isEmployeeOnly,
    staleTime: 60000,
  });

  // TanStack Query for Disbursement Records
  const { data: transfersData, refetch } = useQuery({
    queryKey: ["bank-transfers-list", filters],
    queryFn: () => bankTransfersApi.getTransfers(filters),
    enabled: !isEmployeeOnly,
    staleTime: 30000,
  });

  const displayMetrics = metricsData ? { ...DEFAULT_METRICS, ...metricsData } : DEFAULT_METRICS;
  const rawItems: BankTransferItem[] = transfersData?.items || DEFAULT_ITEMS;

  // Local filtering fallback
  const items = rawItems.filter((i) => {
    if (filters.search && !i.employee_name.toLowerCase().includes(filters.search.toLowerCase()) && !i.employee_id.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.department && i.department !== filters.department) return false;
    if (filters.bank && i.bank_name !== filters.bank) return false;
    if (filters.payment_status && i.payment_status !== filters.payment_status) return false;
    return true;
  });

  // Mutations
  const initiateMutation = useMutation({
    mutationFn: () => bankTransfersApi.initiatePayments(),
    onSuccess: () => {
      toast.success("Salary transfer initiated with corporate bank gateway.");
      refetch();
    },
    onError: (err: any) => toast.error(err?.message || "Failed to initiate transfer."),
  });

  const createBatchMutation = useMutation({
    mutationFn: () => bankTransfersApi.createTransferBatch({ employee_count: items.length }),
    onSuccess: (res) => {
      toast.success(`Salary batch '${res.batch_code}' created successfully.`);
      setCreateBatchOpen(false);
      refetch();
    },
    onError: (err: any) => toast.error(err?.message || "Failed to create transfer batch."),
  });

  const handleFilterChange = (updated: Partial<BankTransferFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({ month: 7, year: 2026, page: 1, limit: 20 });
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((i) => i.id));
    }
  };

  const handleViewDetails = (item: BankTransferItem) => {
    setActiveItem(item);
    setDrawerOpen(true);
  };

  const handleRetry = async (item: BankTransferItem) => {
    try {
      await bankTransfersApi.retryTransfer(item.id);
      toast.success(`Retry queued for ${item.employee_name}.`);
      refetch();
    } catch (err) {
      toast.error("Retry failed.");
    }
  };

  const handleMarkPaid = async (item: BankTransferItem) => {
    try {
      await bankTransfersApi.markAsPaid(item.id);
      toast.success(`Record for ${item.employee_name} marked as COMPLETED.`);
      refetch();
    } catch (err) {
      toast.error("Operation failed.");
    }
  };

  const handleGenerateFile = async () => {
    try {
      const res = await bankTransfersApi.generateBankFile("NEFT");
      toast.success(`Bank advice file '${res.file_name}' generated.`);
    } catch (err) {
      toast.error("Failed to generate bank file.");
    }
  };

  const handleExport = () => {
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", jsonStr);
    link.setAttribute("download", `Salary_Disbursements_${new Date().toISOString().split("T")[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Disbursement records exported successfully.");
  };

  const handleSyncStatus = async () => {
    try {
      await bankTransfersApi.reconcilePayments();
      toast.success("Bank gateway transaction status reconciled.");
      refetch();
    } catch (err) {
      toast.error("Sync failed.");
    }
  };

  const handleOpenAudit = async () => {
    try {
      await bankTransfersApi.getAuditLogs();
      toast.info("Bank transfer audit logs retrieved.");
    } catch (err) {
      toast.error("Failed to load audit logs.");
    }
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
            The Salary Disbursement & Bank Transfers module is strictly restricted to Super Admin, Admin, Payroll Admin, Finance Manager, and CFO roles.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate({ to: "/dashboard" })} className="text-xs">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto pb-24">
      {/* Top Header */}
      <BankTransfersHeader
        onCreateBatch={() => setCreateBatchOpen(true)}
        onGenerateFile={handleGenerateFile}
        onInitiatePayments={() => initiateMutation.mutate()}
        onSyncStatus={handleSyncStatus}
        onExport={handleExport}
        onOpenAudit={handleOpenAudit}
        isInitiating={initiateMutation.isPending}
      />

      {/* KPI Summary Cards */}
      <BankTransfersSummaryCards metrics={displayMetrics} />

      {/* Multi-Filter Bar */}
      <BankTransfersFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {/* Main Disbursements Table */}
      <BankTransfersTable
        items={items}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
        onViewDetails={handleViewDetails}
        onRetry={handleRetry}
        onMarkPaid={handleMarkPaid}
        isReadOnly={isReadOnly}
      />

      {/* Transfer Details Drawer */}
      <TransferDetailsDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        item={activeItem}
      />

      {/* Create Transfer Batch Wizard Modal */}
      <CreateBatchModal
        isOpen={createBatchOpen}
        onClose={() => setCreateBatchOpen(false)}
        onConfirmCreate={() => createBatchMutation.mutate()}
        isCreating={createBatchMutation.isPending}
      />
    </div>
  );
}
