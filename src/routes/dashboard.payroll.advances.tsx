import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import "@/features/admin/payroll/components/advances/advances.css";

import { AdvanceHubHeader } from "@/features/admin/payroll/components/advances/AdvanceHubHeader";
import { AdvanceHubCardGrid } from "@/features/admin/payroll/components/advances/AdvanceHubCardGrid";
import { AdvanceHubModuleViews } from "@/features/admin/payroll/components/advances/AdvanceHubModuleViews";
import { CreateAdvanceWizardDrawer } from "@/features/admin/payroll/components/advances/CreateAdvanceWizardDrawer";
import { AdvanceDetailsDrawer } from "@/features/admin/payroll/components/advances/AdvanceDetailsDrawer";

import { advancesApi } from "@/services/advancesApi";
import {
  SalaryAdvanceRequest,
  AdvancesFilters as FilterType,
  AdvancesSummaryKPIs,
} from "@/features/admin/payroll/components/advances/advancesTypes";

export const Route = createFileRoute("/dashboard/payroll/advances")({
  head: () => ({ meta: [{ title: "Enterprise Advance & Loan Hub — Aurix AI" }] }),
  component: AdvancesPage,
});

function AdvancesPage() {
  const [loading, setLoading] = useState(true);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [advances, setAdvances] = useState<SalaryAdvanceRequest[]>([]);
  const [kpis, setKpis] = useState<AdvancesSummaryKPIs>({
    totalRequests: 0,
    pendingApproval: 0,
    approved: 0,
    rejected: 0,
    disbursed: 0,
    recovered: 0,
    outstandingBalance: 0,
    monthlyRecovery: 0,
    averageAdvance: 0,
    recoveryRate: 0,
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterType>({
    search: "",
    employee: "all",
    employeeId: "all",
    department: "all",
    designation: "all",
    location: "all",
    employmentType: "all",
    advanceType: "all",
    approvalStatus: "ALL",
    recoveryStatus: "ALL",
    financialYear: "FY26-27",
    page: 1,
    limit: 10,
    sortBy: "updatedOn",
    sortDir: "desc",
  });

  // Modal Controllers
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [selectedAdvance, setSelectedAdvance] = useState<SalaryAdvanceRequest | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await advancesApi.getAdvanceRequests(filters);
      setAdvances(res.items);
      setKpis(res.kpis);
    } catch {
      toast.error("Failed to load advances data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleView = (req: SalaryAdvanceRequest) => {
    setSelectedAdvance(req);
    setDetailsDrawerOpen(true);
  };

  const handleApprove = async (req: SalaryAdvanceRequest) => {
    try {
      await advancesApi.approveAdvance(req.id, "Finance Manager");
      toast.success(`Approved advance request '${req.advanceCode}'`);
      loadData();
    } catch {
      toast.error("Failed to approve advance request.");
    }
  };

  const handleReject = async (req: SalaryAdvanceRequest) => {
    try {
      await advancesApi.rejectAdvance(req.id, "Finance Manager", "Exceeds max 50% salary cap.");
      toast.success(`Rejected advance request '${req.advanceCode}'.`);
      loadData();
    } catch {
      toast.error("Failed to reject advance request.");
    }
  };

  const handleDisburse = async (req: SalaryAdvanceRequest) => {
    try {
      await advancesApi.disbursePayment([req.id], "HDFC Bank Corporate Transfer");
      toast.success(`Disbursed ₹${req.approvedAmount.toLocaleString("en-IN")} to ${req.employeeName}`);
      loadData();
    } catch {
      toast.error("Failed to disburse advance payment.");
    }
  };

  const handleBulkApprove = async () => {
    const idsToApprove = selectedIds.length > 0 ? selectedIds : advances.map((r) => r.id);
    if (idsToApprove.length === 0) {
      toast.error("No advance requests selected for bulk approval.");
      return;
    }
    for (const id of idsToApprove) {
      await advancesApi.approveAdvance(id, "Finance Manager");
    }
    toast.success(`Bulk approved ${idsToApprove.length} advance request(s).`);
    setSelectedIds([]);
    loadData();
  };

  const handleCreateSave = async (payload: Partial<SalaryAdvanceRequest>) => {
    await advancesApi.createAdvanceRequest(payload);
    loadData();
  };

  const handleExport = () => {
    const jsonStr = JSON.stringify(advances, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `advance_records_export_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    toast.success("Exported advance and loan audit records.");
  };

  const categoryTabs = ["All", "Core Workflow", "Loans & Recovery", "Policies & Credit", "AI & Compliance", "Analytics & Settings"];

  return (
    <div className="space-y-6">
      {activeModuleId ? (
        /* Full-Screen Module View when a Feature Card is Opened */
        <AdvanceHubModuleViews
          moduleId={activeModuleId}
          onBackToHub={() => setActiveModuleId(null)}
          requests={advances}
          onOpenCreateDrawer={() => setCreateDrawerOpen(true)}
          onViewRequestDetails={handleView}
          onApproveRequest={handleApprove}
          onRejectRequest={handleReject}
          onDisburseRequest={handleDisburse}
          onManageRecovery={(req) => {
            setSelectedAdvance(req);
            toast.info(`Managing payroll EMI recovery for ${req.advanceCode}`);
          }}
        />
      ) : (
        /* Advance Hub Landing Page Architecture */
        <div className="space-y-6">
          {/* Hub Header & High Level Metrics */}
          <AdvanceHubHeader
            kpis={kpis}
            onCreateClick={() => setCreateDrawerOpen(true)}
            onBulkApproveClick={handleBulkApprove}
            onExportClick={handleExport}
          />

          {/* Module Search & Category Filter Navigation */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/60 border border-white/5">
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {categoryTabs.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Hub Search Box */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search advance & loan modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-slate-950/60 border-white/10 text-xs text-white placeholder:text-slate-500 h-9"
              />
            </div>
          </div>

          {/* Feature Card Grid (18 Modules) */}
          <AdvanceHubCardGrid
            onSelectModule={(modId) => setActiveModuleId(modId)}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
          />
        </div>
      )}

      {/* Drawers */}
      <CreateAdvanceWizardDrawer
        open={createDrawerOpen}
        onOpenChange={setCreateDrawerOpen}
        onSave={handleCreateSave}
      />

      <AdvanceDetailsDrawer
        open={detailsDrawerOpen}
        onOpenChange={setDetailsDrawerOpen}
        request={selectedAdvance}
        onApprove={handleApprove}
        onReject={handleReject}
        onDisburse={handleDisburse}
      />
    </div>
  );
}
