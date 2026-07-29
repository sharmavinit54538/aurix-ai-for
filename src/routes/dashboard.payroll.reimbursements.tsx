import React, { useState, useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PayrollBackButton } from "@/features/admin/payroll/components/PayrollBackButton";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import "@/features/admin/payroll/components/reimbursements/reimbursements.css";

import { ReimbursementHubHeader } from "@/features/admin/payroll/components/reimbursements/ReimbursementHubHeader";
import { ReimbursementHubCardGrid } from "@/features/admin/payroll/components/reimbursements/ReimbursementHubCardGrid";
import { ReimbursementHubModuleViews } from "@/features/admin/payroll/components/reimbursements/ReimbursementHubModuleViews";
import { ClaimDetailsDrawer } from "@/features/admin/payroll/components/reimbursements/ClaimDetailsDrawer";
import { CreateClaimWizardDrawer } from "@/features/admin/payroll/components/reimbursements/CreateClaimWizardDrawer";
import { PayrollIntegrationModal } from "@/features/admin/payroll/components/reimbursements/PayrollIntegrationModal";

import { reimbursementsApi } from "@/services/reimbursementsApi";
import {
  ReimbursementClaim,
  ReimbursementsFilters as FilterType,
  ReimbursementsSummaryKPIs,
  ReimbursementAuditLog,
  ReimbursementAIInsight,
} from "@/features/admin/payroll/components/reimbursements/reimbursementsTypes";

export const Route = createFileRoute("/dashboard/payroll/reimbursements")({
  head: () => ({ meta: [{ title: "Enterprise Reimbursement Hub — Aurix AI" }] }),
  component: ReimbursementsHubPage,
});

function ReimbursementsHubPage() {
  const navigate = useNavigate({ from: "/dashboard/payroll/reimbursements" });
  const [loading, setLoading] = useState(true);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [claims, setClaims] = useState<ReimbursementClaim[]>([]);
  const [kpis, setKpis] = useState<ReimbursementsSummaryKPIs>({
    totalClaims: 0,
    pendingApproval: 0,
    approved: 0,
    rejected: 0,
    processing: 0,
    paid: 0,
    totalAmount: 0,
    averageClaim: 0,
    monthlyExpense: 0,
    departmentExpense: 0,
  });

  const [selectedClaimIds, setSelectedClaimIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterType>({
    search: "",
    employee: "all",
    employeeId: "all",
    department: "all",
    designation: "all",
    expenseCategory: "all",
    claimStatus: "ALL",
    paymentStatus: "ALL",
    financialYear: "FY26-27",
    month: "all",
    page: 1,
    limit: 10,
    sortBy: "submittedDate",
    sortDir: "desc",
  });

  // Modal State
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [payrollModalOpen, setPayrollModalOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<ReimbursementClaim | null>(null);
  const [auditLogs, setAuditLogs] = useState<ReimbursementAuditLog[]>([]);
  const [aiInsights, setAiInsights] = useState<ReimbursementAIInsight[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await reimbursementsApi.getClaims(filters);
      setClaims(res.items);
      setKpis(res.kpis);

      const logs = await reimbursementsApi.getAuditLogs();
      setAuditLogs(logs);

      const insights = await reimbursementsApi.getAIInsights();
      setAiInsights(insights);
    } catch {
      toast.error("Failed to load reimbursements data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleView = (claim: ReimbursementClaim) => {
    setSelectedClaim(claim);
    setDetailsDrawerOpen(true);
  };

  const handleApprove = async (claim: ReimbursementClaim) => {
    try {
      await reimbursementsApi.approveClaim(claim.id, "Finance Manager");
      toast.success(`Approved claim '${claim.claimNumber}' for ₹${claim.claimAmount.toLocaleString("en-IN")}`);
      loadData();
    } catch {
      toast.error("Failed to approve claim.");
    }
  };

  const handleReject = async (claim: ReimbursementClaim) => {
    try {
      await reimbursementsApi.rejectClaim(claim.id, "Finance Manager", "Out of policy budget.");
      toast.success(`Rejected claim '${claim.claimNumber}'.`);
      loadData();
    } catch {
      toast.error("Failed to reject claim.");
    }
  };

  const handleBulkApprove = async () => {
    const idsToApprove = selectedClaimIds.length > 0 ? selectedClaimIds : claims.map((c) => c.id);
    if (idsToApprove.length === 0) {
      toast.error("No claims selected for bulk approval.");
      return;
    }
    await reimbursementsApi.bulkApprove(idsToApprove);
    toast.success(`Bulk approved ${idsToApprove.length} reimbursement claim(s).`);
    setSelectedClaimIds([]);
    loadData();
  };

  const handleSaveClaim = async (payload: Partial<ReimbursementClaim>) => {
    await reimbursementsApi.createClaim(payload);
    loadData();
  };

  const handleConfirmPayrollIntegration = async (payrollCycle: string, mode: "SALARY_CYCLE" | "STANDALONE") => {
    const ids = selectedClaimIds.length > 0 ? selectedClaimIds : claims.map((c) => c.id);
    if (mode === "SALARY_CYCLE") {
      await reimbursementsApi.addPayrollEntry(ids, payrollCycle);
    } else {
      await reimbursementsApi.processPayment(ids);
    }
    setSelectedClaimIds([]);
    loadData();
  };

  const handleExport = () => {
    const jsonStr = JSON.stringify(claims, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reimbursement_claims_export_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    toast.success("Exported reimbursement claims data.");
  };

  const categoryTabs = ["All", "Core Workflow", "Categories & Policy", "AI & Compliance", "Analytics & Settings"];

  return (
    <div className="space-y-6">
      <PayrollBackButton />

      {activeModuleId ? (
        /* Full-Screen Module View when a Feature Card is Opened */
        <ReimbursementHubModuleViews
          moduleId={activeModuleId}
          onBackToHub={() => setActiveModuleId(null)}
          claims={claims}
          auditLogs={auditLogs}
          aiInsights={aiInsights}
          onOpenCreateDrawer={() => setCreateDrawerOpen(true)}
          onViewClaimDetails={handleView}
          onApproveClaim={handleApprove}
          onRejectClaim={handleReject}
          onProcessPayment={(c) => {
            setSelectedClaimIds([c.id]);
            setPayrollModalOpen(true);
          }}
          onAddPayrollEntry={(c) => {
            setSelectedClaimIds([c.id]);
            setPayrollModalOpen(true);
          }}
        />
      ) : (
        /* Reimbursement Hub Landing Page Architecture */
        <div className="space-y-6">
          {/* Hub Header & High Level Metrics */}
          <ReimbursementHubHeader
            kpis={kpis}
            onCreateClick={() => setCreateDrawerOpen(true)}
            onOcrClick={() => setActiveModuleId("receipt-management")}
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
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/25"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Module Search Bar */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reimbursement modules..."
                className="pl-9 bg-slate-950 border-white/10 text-xs text-white h-9"
              />
            </div>
          </div>

          {/* 20 Enterprise Feature Cards Grid */}
          <ReimbursementHubCardGrid
            onSelectModule={(id) => {
              if (id === "create-claim") {
                setCreateDrawerOpen(true);
              } else {
                setActiveModuleId(id);
              }
            }}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
          />
        </div>
      )}

      {/* 4-Step Multi-step Claim Creation Wizard */}
      <CreateClaimWizardDrawer
        open={createDrawerOpen}
        onClose={() => setCreateDrawerOpen(false)}
        onSave={handleSaveClaim}
      />

      {/* Claim Details View Drawer */}
      <ClaimDetailsDrawer
        open={detailsDrawerOpen}
        onClose={() => setDetailsDrawerOpen(false)}
        claim={selectedClaim}
        onApprove={handleApprove}
        onReject={handleReject}
        onAddPayrollEntry={(c) => {
          setSelectedClaimIds([c.id]);
          setDetailsDrawerOpen(false);
          setPayrollModalOpen(true);
        }}
      />

      {/* Payroll Integration & Direct Disbursal Modal */}
      <PayrollIntegrationModal
        open={payrollModalOpen}
        onClose={() => setPayrollModalOpen(false)}
        selectedClaimIds={selectedClaimIds}
        onConfirmIntegration={handleConfirmPayrollIntegration}
      />
    </div>
  );
}
