import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import "@/features/admin/payroll/components/reimbursements/reimbursements.css";

import { ReimbursementsHeader } from "@/features/admin/payroll/components/reimbursements/ReimbursementsHeader";
import { ReimbursementsKPIs } from "@/features/admin/payroll/components/reimbursements/ReimbursementsKPIs";
import { ReimbursementsFilters } from "@/features/admin/payroll/components/reimbursements/ReimbursementsFilters";
import { ReimbursementsTable } from "@/features/admin/payroll/components/reimbursements/ReimbursementsTable";
import { ClaimDetailsDrawer } from "@/features/admin/payroll/components/reimbursements/ClaimDetailsDrawer";
import { CreateClaimWizardDrawer } from "@/features/admin/payroll/components/reimbursements/CreateClaimWizardDrawer";
import { AIReimbursementInsights } from "@/features/admin/payroll/components/reimbursements/AIReimbursementInsights";
import { ApprovalWorkflowTracker } from "@/features/admin/payroll/components/reimbursements/ApprovalWorkflowTracker";
import { PayrollIntegrationModal } from "@/features/admin/payroll/components/reimbursements/PayrollIntegrationModal";
import { RightPolicyPanel } from "@/features/admin/payroll/components/reimbursements/RightPolicyPanel";
import { ReimbursementsAnalytics } from "@/features/admin/payroll/components/reimbursements/ReimbursementsAnalytics";

import { reimbursementsApi } from "@/services/reimbursementsApi";
import {
  ReimbursementClaim,
  ReimbursementsFilters as FilterType,
  ReimbursementsSummaryKPIs,
  ReimbursementAuditLog,
  ReimbursementAIInsight,
} from "@/features/admin/payroll/components/reimbursements/reimbursementsTypes";

export const Route = createFileRoute("/dashboard/payroll/reimbursements")({
  head: () => ({ meta: [{ title: "Reimbursements & Expense Management Center — Aurix AI" }] }),
  component: ReimbursementsPage,
});

function ReimbursementsPage() {
  const [loading, setLoading] = useState(true);
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
  const [activeView, setActiveView] = useState<"CLAIMS" | "AUDIT_LOGS">("CLAIMS");
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
  }, [filters]);

  const handleSelectToggle = (id: string) => {
    if (selectedClaimIds.includes(id)) {
      setSelectedClaimIds(selectedClaimIds.filter((item) => item !== id));
    } else {
      setSelectedClaimIds([...selectedClaimIds, id]);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedClaimIds(claims.map((c) => c.id));
    } else {
      setSelectedClaimIds([]);
    }
  };

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

  return (
    <div className="reimbursements-container p-6 space-y-6">
      {/* Header */}
      <ReimbursementsHeader
        onCreateClick={() => setCreateDrawerOpen(true)}
        onBulkApproveClick={handleBulkApprove}
        onExportClick={handleExport}
        onImportSuccess={loadData}
        onGeneratePayrollEntriesClick={() => setPayrollModalOpen(true)}
        onAuditLogsClick={() => setActiveView(activeView === "CLAIMS" ? "AUDIT_LOGS" : "CLAIMS")}
      />

      {/* KPI Cards */}
      <ReimbursementsKPIs
        kpis={kpis}
        activeStatusFilter={filters.claimStatus}
        onFilterStatus={(s) => setFilters((prev) => ({ ...prev, claimStatus: s }))}
      />

      {/* Recharts Analytics Dashboard */}
      <ReimbursementsAnalytics claims={claims} />

      {/* AI Reimbursement Insights */}
      <AIReimbursementInsights insights={aiInsights} />

      {/* Main Layout: Filters & Table + Right Policy Rail */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        <div className="flex-1 w-full space-y-4">
          {/* Multi-filter Bar */}
          <ReimbursementsFilters
            filters={filters}
            onChange={(updated) => setFilters((prev) => ({ ...prev, ...updated }))}
            onReset={() =>
              setFilters({
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
              })
            }
          />

          {/* Workflow Tracker for Selected Claim */}
          {selectedClaim && (
            <ApprovalWorkflowTracker
              claim={selectedClaim}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}

          {/* Main Table View */}
          {activeView === "CLAIMS" && (
            <ReimbursementsTable
              data={claims}
              selectedIds={selectedClaimIds}
              onSelectToggle={handleSelectToggle}
              onSelectAll={handleSelectAll}
              onView={handleView}
              onApprove={handleApprove}
              onReject={handleReject}
              onRequestChanges={handleView}
              onProcessPayment={(c) => {
                setSelectedClaimIds([c.id]);
                setPayrollModalOpen(true);
              }}
              onAddPayrollEntry={(c) => {
                setSelectedClaimIds([c.id]);
                setPayrollModalOpen(true);
              }}
              onDownloadReceipt={(c) => toast.success(`Downloading receipts for claim ${c.claimNumber}`)}
              onViewLogs={() => setActiveView("AUDIT_LOGS")}
            />
          )}

          {/* Audit Logs View */}
          {activeView === "AUDIT_LOGS" && (
            <div className="reimb-card p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white">Reimbursement Audit Trail & Governance Log</h3>
              <div className="reimb-table-wrapper">
                <table className="reimb-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Claim Number</th>
                      <th>Action</th>
                      <th>Actor</th>
                      <th>Details</th>
                      <th>IP Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="font-mono text-slate-400">{log.timestamp}</td>
                        <td className="font-mono font-semibold text-blue-300">{log.claimNumber}</td>
                        <td>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                            {log.action}
                          </span>
                        </td>
                        <td>
                          {log.actorName} ({log.actorRole})
                        </td>
                        <td className="text-slate-300">{log.details}</td>
                        <td className="font-mono text-slate-500">{log.ipAddress}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Policy & Copilot Rail */}
        <RightPolicyPanel />
      </div>

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
