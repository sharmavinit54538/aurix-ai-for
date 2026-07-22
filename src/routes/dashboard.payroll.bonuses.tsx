import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import "@/features/admin/payroll/components/bonuses/bonuses.css";

import { BonusesHeader } from "@/features/admin/payroll/components/bonuses/BonusesHeader";
import { BonusesKPIs } from "@/features/admin/payroll/components/bonuses/BonusesKPIs";
import { BonusesFilters } from "@/features/admin/payroll/components/bonuses/BonusesFilters";
import { BonusesTable } from "@/features/admin/payroll/components/bonuses/BonusesTable";
import { BonusDetailsDrawer } from "@/features/admin/payroll/components/bonuses/BonusDetailsDrawer";
import { CreateBonusWizardDrawer } from "@/features/admin/payroll/components/bonuses/CreateBonusWizardDrawer";
import { BulkAllocationModal } from "@/features/admin/payroll/components/bonuses/BulkAllocationModal";
import { BonusLetterModal } from "@/features/admin/payroll/components/bonuses/BonusLetterModal";
import { AIBonusInsights } from "@/features/admin/payroll/components/bonuses/AIBonusInsights";
import { ApprovalWorkflowTracker } from "@/features/admin/payroll/components/bonuses/ApprovalWorkflowTracker";
import { RightPolicyPanel } from "@/features/admin/payroll/components/bonuses/RightPolicyPanel";
import { BonusesAnalytics } from "@/features/admin/payroll/components/bonuses/BonusesAnalytics";

import { bonusesApi } from "@/services/bonusesApi";
import {
  BonusAward,
  BonusesFilters as FilterType,
  BonusesSummaryKPIs,
  BonusAuditLog,
  BonusAIInsight,
} from "@/features/admin/payroll/components/bonuses/bonusesTypes";

export const Route = createFileRoute("/dashboard/payroll/bonuses")({
  head: () => ({ meta: [{ title: "Bonus & Variable Compensation Center — Aurix AI" }] }),
  component: BonusesPage,
});

function BonusesPage() {
  const [loading, setLoading] = useState(true);
  const [bonuses, setBonuses] = useState<BonusAward[]>([]);
  const [kpis, setKpis] = useState<BonusesSummaryKPIs>({
    totalBonusBudget: 0,
    allocatedBonus: 0,
    pendingApproval: 0,
    approvedBonuses: 0,
    paidBonuses: 0,
    outstandingBonus: 0,
    averageBonus: 0,
    topRewardedDepartment: "-",
    topRewardedEmployee: "-",
    budgetRemaining: 0,
  });

  const [selectedBonusIds, setSelectedBonusIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterType>({
    search: "",
    employee: "all",
    employeeId: "all",
    department: "all",
    designation: "all",
    location: "all",
    employmentType: "all",
    bonusType: "all",
    bonusCycle: "all",
    financialYear: "FY26-27",
    approvalStatus: "ALL",
    paymentStatus: "ALL",
    performanceRating: "ALL",
    page: 1,
    limit: 10,
    sortBy: "updatedOn",
    sortDir: "desc",
  });

  // Modal Controllers
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [letterModalOpen, setLetterModalOpen] = useState(false);
  const [selectedBonus, setSelectedBonus] = useState<BonusAward | null>(null);
  const [activeView, setActiveView] = useState<"BONUSES" | "AUDIT_LOGS">("BONUSES");
  const [auditLogs, setAuditLogs] = useState<BonusAuditLog[]>([]);
  const [aiInsights, setAiInsights] = useState<BonusAIInsight[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await bonusesApi.getBonuses(filters);
      setBonuses(res.items);
      setKpis(res.kpis);

      const logs = await bonusesApi.getAuditLogs();
      setAuditLogs(logs);

      const insights = await bonusesApi.getAIInsights();
      setAiInsights(insights);
    } catch {
      toast.error("Failed to load bonus data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleSelectToggle = (id: string) => {
    if (selectedBonusIds.includes(id)) {
      setSelectedBonusIds(selectedBonusIds.filter((item) => item !== id));
    } else {
      setSelectedBonusIds([...selectedBonusIds, id]);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedBonusIds(bonuses.map((b) => b.id));
    } else {
      setSelectedBonusIds([]);
    }
  };

  const handleView = (bonus: BonusAward) => {
    setSelectedBonus(bonus);
    setDetailsDrawerOpen(true);
  };

  const handleEdit = (bonus: BonusAward) => {
    setSelectedBonus(bonus);
    setCreateDrawerOpen(true);
  };

  const handleApprove = async (bonus: BonusAward) => {
    try {
      await bonusesApi.approveBonus(bonus.id, "Compensation Manager");
      toast.success(`Approved bonus award '${bonus.bonusCode}' for ${bonus.employeeName}`);
      loadData();
    } catch {
      toast.error("Failed to approve bonus.");
    }
  };

  const handleReject = async (bonus: BonusAward) => {
    try {
      await bonusesApi.rejectBonus(bonus.id, "Compensation Manager", "Budget cap reached.");
      toast.success(`Rejected bonus award '${bonus.bonusCode}'.`);
      loadData();
    } catch {
      toast.error("Failed to reject bonus.");
    }
  };

  const handleRecalculate = async (bonus: BonusAward) => {
    toast.success(`Recalculated bonus formula for ${bonus.employeeName}. Updated net payout.`);
    loadData();
  };

  const handleAddPayrollEntry = async (bonus: BonusAward) => {
    await bonusesApi.addPayrollEntry([bonus.id], "JULY-2026");
    toast.success(`Queued bonus '${bonus.bonusCode}' into July 2026 salary run.`);
    loadData();
  };

  const handleGenerateLetter = (bonus: BonusAward) => {
    setSelectedBonus(bonus);
    setLetterModalOpen(true);
  };

  const handleSaveBonus = async (payload: Partial<BonusAward>) => {
    await bonusesApi.createBonus(payload);
    loadData();
  };

  const handleConfirmBulk = async (allocation: any) => {
    await bonusesApi.bulkAllocateBonuses(allocation);
    loadData();
  };

  const handleExport = () => {
    const jsonStr = JSON.stringify(bonuses, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bonus_awards_export_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    toast.success("Exported bonus & incentive data configuration.");
  };

  return (
    <div className="bonuses-container p-6 space-y-6">
      {/* Header */}
      <BonusesHeader
        onCreateClick={() => {
          setSelectedBonus(null);
          setCreateDrawerOpen(true);
        }}
        onBulkAllocateClick={() => setBulkModalOpen(true)}
        onExportClick={handleExport}
        onImportSuccess={loadData}
        onGeneratePayrollEntriesClick={() => {
          if (selectedBonusIds.length === 0) {
            toast.error("Select bonus awards to generate payroll entries.");
            return;
          }
          bonusesApi.addPayrollEntry(selectedBonusIds, "JULY-2026");
          toast.success(`Queued ${selectedBonusIds.length} bonus(es) into July 2026 payroll.`);
          setSelectedBonusIds([]);
          loadData();
        }}
        onAuditLogsClick={() => setActiveView(activeView === "BONUSES" ? "AUDIT_LOGS" : "BONUSES")}
      />

      {/* KPI Cards */}
      <BonusesKPIs
        kpis={kpis}
        activeStatusFilter={filters.approvalStatus}
        onFilterStatus={(s) => setFilters((prev) => ({ ...prev, approvalStatus: s }))}
      />

      {/* Recharts Analytics Dashboard */}
      <BonusesAnalytics bonuses={bonuses} />

      {/* AI Bonus Insights */}
      <AIBonusInsights insights={aiInsights} />

      {/* Main Layout: Filters & Table + Right Policy Rail */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        <div className="flex-1 w-full space-y-4">
          {/* Multi-filter Bar */}
          <BonusesFilters
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
                bonusType: "all",
                bonusCycle: "all",
                financialYear: "FY26-27",
                approvalStatus: "ALL",
                paymentStatus: "ALL",
                performanceRating: "ALL",
                page: 1,
                limit: 10,
                sortBy: "updatedOn",
                sortDir: "desc",
              })
            }
          />

          {/* Workflow Tracker for Selected Bonus */}
          {selectedBonus && (
            <ApprovalWorkflowTracker
              bonus={selectedBonus}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}

          {/* Main Table View */}
          {activeView === "BONUSES" && (
            <BonusesTable
              data={bonuses}
              selectedIds={selectedBonusIds}
              onSelectToggle={handleSelectToggle}
              onSelectAll={handleSelectAll}
              onView={handleView}
              onEdit={handleEdit}
              onApprove={handleApprove}
              onReject={handleReject}
              onRecalculate={handleRecalculate}
              onAddPayrollEntry={handleAddPayrollEntry}
              onGenerateLetter={handleGenerateLetter}
              onViewLogs={() => setActiveView("AUDIT_LOGS")}
            />
          )}

          {/* Audit Logs View */}
          {activeView === "AUDIT_LOGS" && (
            <div className="bns-card p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white">Bonus Governance Audit Log</h3>
              <div className="bns-table-wrapper">
                <table className="bns-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Bonus Code</th>
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
                        <td className="font-mono font-semibold text-amber-300">{log.bonusCode}</td>
                        <td>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
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

      {/* 5-Step Multi-step Bonus Wizard Drawer */}
      <CreateBonusWizardDrawer
        open={createDrawerOpen}
        onClose={() => setCreateDrawerOpen(false)}
        onSave={handleSaveBonus}
      />

      {/* Bonus Details Drawer */}
      <BonusDetailsDrawer
        open={detailsDrawerOpen}
        onClose={() => setDetailsDrawerOpen(false)}
        bonus={selectedBonus}
        onApprove={handleApprove}
        onReject={handleReject}
        onGenerateLetter={handleGenerateLetter}
        onAddPayrollEntry={handleAddPayrollEntry}
      />

      {/* Bulk Allocation Modal */}
      <BulkAllocationModal
        open={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
        onConfirmBulk={handleConfirmBulk}
      />

      {/* Branded Award Letter Generator Modal */}
      <BonusLetterModal
        open={letterModalOpen}
        onClose={() => setLetterModalOpen(false)}
        bonus={selectedBonus}
      />
    </div>
  );
}
