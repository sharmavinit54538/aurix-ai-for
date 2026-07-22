import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import "@/features/admin/payroll/components/advances/advances.css";

import { AdvancesHeader } from "@/features/admin/payroll/components/advances/AdvancesHeader";
import { AdvancesKPIs } from "@/features/admin/payroll/components/advances/AdvancesKPIs";
import { AdvancesFilters } from "@/features/admin/payroll/components/advances/AdvancesFilters";
import { AdvancesTable } from "@/features/admin/payroll/components/advances/AdvancesTable";
import { AdvanceDetailsDrawer } from "@/features/admin/payroll/components/advances/AdvanceDetailsDrawer";
import { CreateAdvanceWizardDrawer } from "@/features/admin/payroll/components/advances/CreateAdvanceWizardDrawer";
import { RecoveryPlanModal } from "@/features/admin/payroll/components/advances/RecoveryPlanModal";
import { BankDisbursementModal } from "@/features/admin/payroll/components/advances/BankDisbursementModal";
import { AIAdvanceInsights } from "@/features/admin/payroll/components/advances/AIAdvanceInsights";
import { ApprovalWorkflowTracker } from "@/features/admin/payroll/components/advances/ApprovalWorkflowTracker";
import { RightPolicyPanel } from "@/features/admin/payroll/components/advances/RightPolicyPanel";
import { AdvancesAnalytics } from "@/features/admin/payroll/components/advances/AdvancesAnalytics";

import { advancesApi } from "@/services/advancesApi";
import {
  SalaryAdvanceRequest,
  AdvancesFilters as FilterType,
  AdvancesSummaryKPIs,
  AdvanceAuditLog,
  AdvanceAIInsight,
} from "@/features/admin/payroll/components/advances/advancesTypes";

export const Route = createFileRoute("/dashboard/payroll/advances")({
  head: () => ({ meta: [{ title: "Salary Advances & Recovery Management — Aurix AI" }] }),
  component: AdvancesPage,
});

function AdvancesPage() {
  const [loading, setLoading] = useState(true);
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

  const [selectedAdvanceIds, setSelectedAdvanceIds] = useState<string[]>([]);
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
  const [recoveryModalOpen, setRecoveryModalOpen] = useState(false);
  const [bankModalOpen, setBankModalOpen] = useState(false);
  const [selectedAdvance, setSelectedAdvance] = useState<SalaryAdvanceRequest | null>(null);
  const [activeView, setActiveView] = useState<"ADVANCES" | "AUDIT_LOGS">("ADVANCES");
  const [auditLogs, setAuditLogs] = useState<AdvanceAuditLog[]>([]);
  const [aiInsights, setAiInsights] = useState<AdvanceAIInsight[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await advancesApi.getAdvanceRequests(filters);
      setAdvances(res.items);
      setKpis(res.kpis);

      const logs = await advancesApi.getAuditLogs();
      setAuditLogs(logs);

      const insights = await advancesApi.getAIInsights();
      setAiInsights(insights);
    } catch {
      toast.error("Failed to load advances data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleSelectToggle = (id: string) => {
    if (selectedAdvanceIds.includes(id)) {
      setSelectedAdvanceIds(selectedAdvanceIds.filter((item) => item !== id));
    } else {
      setSelectedAdvanceIds([...selectedAdvanceIds, id]);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAdvanceIds(advances.map((a) => a.id));
    } else {
      setSelectedAdvanceIds([]);
    }
  };

  const handleView = (advance: SalaryAdvanceRequest) => {
    setSelectedAdvance(advance);
    setDetailsDrawerOpen(true);
  };

  const handleEdit = (advance: SalaryAdvanceRequest) => {
    setSelectedAdvance(advance);
    setCreateDrawerOpen(true);
  };

  const handleApprove = async (advance: SalaryAdvanceRequest) => {
    try {
      await advancesApi.approveAdvance(advance.id, "Finance Approval");
      toast.success(`Approved salary advance '${advance.advanceCode}' for ${advance.employeeName}`);
      loadData();
    } catch {
      toast.error("Failed to approve advance.");
    }
  };

  const handleReject = async (advance: SalaryAdvanceRequest) => {
    try {
      await advancesApi.rejectAdvance(advance.id, "Finance Approval", "Exceeds advance limit.");
      toast.success(`Rejected salary advance '${advance.advanceCode}'.`);
      loadData();
    } catch {
      toast.error("Failed to reject advance.");
    }
  };

  const handleDisburse = (advance: SalaryAdvanceRequest) => {
    setSelectedAdvance(advance);
    setBankModalOpen(true);
  };

  const handleGenerateRecoveryPlan = (advance: SalaryAdvanceRequest) => {
    setSelectedAdvance(advance);
    setRecoveryModalOpen(true);
  };

  const handleCloseAdvance = async (advance: SalaryAdvanceRequest) => {
    toast.success(`Closed advance '${advance.advanceCode}' after lump-sum settlement.`);
    loadData();
  };

  const handleSaveAdvance = async (payload: Partial<SalaryAdvanceRequest>) => {
    await advancesApi.createAdvanceRequest(payload);
    loadData();
  };

  const handleConfirmDisbursement = async (bankAccount: string, ref: string) => {
    if (selectedAdvance) {
      await advancesApi.disburseAdvance(selectedAdvance.id, bankAccount, ref);
      loadData();
    }
  };

  const handleConfirmPlan = async (newEmi: number) => {
    if (selectedAdvance) {
      toast.success(`Saved new EMI of ₹${newEmi.toLocaleString("en-IN")}/month.`);
      loadData();
    }
  };

  const handleExport = () => {
    const jsonStr = JSON.stringify(advances, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `salary_advances_export_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    toast.success("Exported salary advance data.");
  };

  return (
    <div className="advances-container p-6 space-y-6">
      {/* Header */}
      <AdvancesHeader
        onCreateClick={() => {
          setSelectedAdvance(null);
          setCreateDrawerOpen(true);
        }}
        onBulkApproveClick={() => {
          if (selectedAdvanceIds.length === 0) {
            toast.error("Select advance requests to bulk approve.");
            return;
          }
          selectedAdvanceIds.forEach((id) => advancesApi.approveAdvance(id, "Finance Approval"));
          toast.success(`Bulk approved ${selectedAdvanceIds.length} salary advance request(s).`);
          setSelectedAdvanceIds([]);
          loadData();
        }}
        onExportClick={handleExport}
        onImportSuccess={loadData}
        onGenerateRecoveryScheduleClick={() => {
          if (advances.length > 0) setSelectedAdvance(advances[0]);
          setRecoveryModalOpen(true);
        }}
        onAuditLogsClick={() => setActiveView(activeView === "ADVANCES" ? "AUDIT_LOGS" : "ADVANCES")}
      />

      {/* KPI Cards */}
      <AdvancesKPIs
        kpis={kpis}
        activeStatusFilter={filters.approvalStatus}
        onFilterStatus={(s) => setFilters((prev) => ({ ...prev, approvalStatus: s }))}
      />

      {/* Recharts Analytics Dashboard */}
      <AdvancesAnalytics advances={advances} />

      {/* AI Advance Insights */}
      <AIAdvanceInsights insights={aiInsights} />

      {/* Main Layout: Filters & Table + Right Policy Rail */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        <div className="flex-1 w-full space-y-4">
          {/* Multi-filter Bar */}
          <AdvancesFilters
            filters={filters}
            onChange={(updated) => setFilters((prev) => ({ ...prev, ...updated }))}
            onReset={() =>
              setFilters({
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
              })
            }
          />

          {/* Workflow Tracker for Selected Advance */}
          {selectedAdvance && (
            <ApprovalWorkflowTracker
              advance={selectedAdvance}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}

          {/* Main Table View */}
          {activeView === "ADVANCES" && (
            <AdvancesTable
              data={advances}
              selectedIds={selectedAdvanceIds}
              onSelectToggle={handleSelectToggle}
              onSelectAll={handleSelectAll}
              onView={handleView}
              onEdit={handleEdit}
              onApprove={handleApprove}
              onReject={handleReject}
              onDisburse={handleDisburse}
              onGenerateRecoveryPlan={handleGenerateRecoveryPlan}
              onCloseAdvance={handleCloseAdvance}
              onViewLogs={() => setActiveView("AUDIT_LOGS")}
            />
          )}

          {/* Audit Logs View */}
          {activeView === "AUDIT_LOGS" && (
            <div className="adv-card p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white">Salary Advances Audit Trail & Compliance Log</h3>
              <div className="adv-table-wrapper">
                <table className="adv-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Advance Code</th>
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
                        <td className="font-mono font-semibold text-cyan-300">{log.advanceCode}</td>
                        <td>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
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

      {/* 4-Step Multi-step Advance Wizard Drawer */}
      <CreateAdvanceWizardDrawer
        open={createDrawerOpen}
        onClose={() => setCreateDrawerOpen(false)}
        onSave={handleSaveAdvance}
      />

      {/* Advance Details Drawer */}
      <AdvanceDetailsDrawer
        open={detailsDrawerOpen}
        onClose={() => setDetailsDrawerOpen(false)}
        advance={selectedAdvance}
        onApprove={handleApprove}
        onReject={handleReject}
        onDisburse={handleDisburse}
        onAdjustPlan={handleGenerateRecoveryPlan}
      />

      {/* Recovery Plan Calculator Modal */}
      <RecoveryPlanModal
        open={recoveryModalOpen}
        onClose={() => setRecoveryModalOpen(false)}
        advance={selectedAdvance}
        onConfirmPlan={handleConfirmPlan}
      />

      {/* Direct Bank Disbursement Gateway Modal */}
      <BankDisbursementModal
        open={bankModalOpen}
        onClose={() => setBankModalOpen(false)}
        advance={selectedAdvance}
        onConfirmDisbursement={handleConfirmDisbursement}
      />
    </div>
  );
}
