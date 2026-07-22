import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import "@/features/admin/payroll/components/deductions/deductions.css";

import { DeductionsHeader } from "@/features/admin/payroll/components/deductions/DeductionsHeader";
import { DeductionsKPIs } from "@/features/admin/payroll/components/deductions/DeductionsKPIs";
import { DeductionsFilters } from "@/features/admin/payroll/components/deductions/DeductionsFilters";
import { DeductionsTable } from "@/features/admin/payroll/components/deductions/DeductionsTable";
import { DeductionDetailsDrawer } from "@/features/admin/payroll/components/deductions/DeductionDetailsDrawer";
import { CreateDeductionWizardDrawer } from "@/features/admin/payroll/components/deductions/CreateDeductionWizardDrawer";
import { EmployeeAssignmentDrawer } from "@/features/admin/payroll/components/deductions/EmployeeAssignmentDrawer";
import { PayrollImpactWaterfall } from "@/features/admin/payroll/components/deductions/PayrollImpactWaterfall";
import { AIDeductionInsights } from "@/features/admin/payroll/components/deductions/AIDeductionInsights";
import { ApprovalWorkflowTracker } from "@/features/admin/payroll/components/deductions/ApprovalWorkflowTracker";
import { RightPolicyPanel } from "@/features/admin/payroll/components/deductions/RightPolicyPanel";
import { DeductionsAnalytics } from "@/features/admin/payroll/components/deductions/DeductionsAnalytics";

import { deductionsApi } from "@/services/deductionsApi";
import {
  DeductionRule,
  DeductionsFilters as FilterType,
  DeductionsSummaryKPIs,
  DeductionAuditLog,
  DeductionAIInsight,
} from "@/features/admin/payroll/components/deductions/deductionsTypes";

export const Route = createFileRoute("/dashboard/payroll/deductions")({
  head: () => ({ meta: [{ title: "Payroll Deductions & Recovery Management — Aurix AI" }] }),
  component: DeductionsPage,
});

function DeductionsPage() {
  const [loading, setLoading] = useState(true);
  const [deductions, setDeductions] = useState<DeductionRule[]>([]);
  const [kpis, setKpis] = useState<DeductionsSummaryKPIs>({
    totalDeductionRules: 0,
    activeRules: 0,
    inactiveRules: 0,
    statutoryDeductions: 0,
    customDeductions: 0,
    loanRecoveries: 0,
    advanceRecoveries: 0,
    monthlyDeductionAmount: 0,
    annualDeductionAmount: 0,
    complianceScore: 0,
  });

  const [selectedDeductionIds, setSelectedDeductionIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterType>({
    search: "",
    employee: "all",
    department: "all",
    designation: "all",
    location: "all",
    employmentType: "all",
    deductionType: "all",
    categoryGroup: "all",
    payrollCycle: "JULY-2026",
    status: "ALL",
    financialYear: "FY26-27",
    page: 1,
    limit: 10,
    sortBy: "updatedOn",
    sortDir: "desc",
  });

  // Modal Controllers
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [assignDrawerOpen, setAssignDrawerOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<DeductionRule | null>(null);
  const [showImpactWaterfall, setShowImpactWaterfall] = useState(true);
  const [activeView, setActiveView] = useState<"DEDUCTIONS" | "AUDIT_LOGS">("DEDUCTIONS");
  const [auditLogs, setAuditLogs] = useState<DeductionAuditLog[]>([]);
  const [aiInsights, setAiInsights] = useState<DeductionAIInsight[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await deductionsApi.getDeductionRules(filters);
      setDeductions(res.items);
      setKpis(res.kpis);

      const logs = await deductionsApi.getAuditLogs();
      setAuditLogs(logs);

      const insights = await deductionsApi.getAIInsights();
      setAiInsights(insights);
    } catch {
      toast.error("Failed to load deductions data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleSelectToggle = (id: string) => {
    if (selectedDeductionIds.includes(id)) {
      setSelectedDeductionIds(selectedDeductionIds.filter((item) => item !== id));
    } else {
      setSelectedDeductionIds([...selectedDeductionIds, id]);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDeductionIds(deductions.map((d) => d.id));
    } else {
      setSelectedDeductionIds([]);
    }
  };

  const handleView = (rule: DeductionRule) => {
    setSelectedRule(rule);
    setDetailsDrawerOpen(true);
  };

  const handleEdit = (rule: DeductionRule) => {
    setSelectedRule(rule);
    setCreateDrawerOpen(true);
  };

  const handleAssignEmployees = (rule: DeductionRule) => {
    setSelectedRule(rule);
    setAssignDrawerOpen(true);
  };

  const handlePreviewImpact = (rule: DeductionRule) => {
    setSelectedRule(rule);
    setShowImpactWaterfall(true);
    toast.success(`Generated before & after payroll impact waterfall for '${rule.name}'`);
  };

  const handleToggleStatus = async (rule: DeductionRule) => {
    try {
      await deductionsApi.toggleStatus(rule.id);
      toast.success(`Toggled status for rule '${rule.name}'.`);
      loadData();
    } catch {
      toast.error("Failed to toggle rule status.");
    }
  };

  const handleSaveRule = async (payload: Partial<DeductionRule>) => {
    await deductionsApi.createDeductionRule(payload);
    loadData();
  };

  const handleConfirmAssign = async (department: string, deductionId: string) => {
    await deductionsApi.bulkAssignDeductions({ department, deductionId });
    loadData();
  };

  const handleExport = () => {
    const jsonStr = JSON.stringify(deductions, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `payroll_deductions_export_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    toast.success("Exported payroll deduction rules configuration.");
  };

  return (
    <div className="deductions-container p-6 space-y-6">
      {/* Header */}
      <DeductionsHeader
        onCreateClick={() => {
          setSelectedRule(null);
          setCreateDrawerOpen(true);
        }}
        onBulkAssignClick={() => {
          if (deductions.length > 0) setSelectedRule(deductions[0]);
          setAssignDrawerOpen(true);
        }}
        onExportClick={handleExport}
        onImportSuccess={loadData}
        onGenerateImpactClick={() => {
          setShowImpactWaterfall(!showImpactWaterfall);
          toast.info(showImpactWaterfall ? "Hidden Payroll Impact Waterfall" : "Displayed Payroll Impact Waterfall");
        }}
        onAuditLogsClick={() => setActiveView(activeView === "DEDUCTIONS" ? "AUDIT_LOGS" : "DEDUCTIONS")}
      />

      {/* KPI Cards */}
      <DeductionsKPIs
        kpis={kpis}
        activeStatusFilter={filters.status}
        onFilterStatus={(s) => setFilters((prev) => ({ ...prev, status: s }))}
      />

      {/* Recharts Analytics Dashboard */}
      <DeductionsAnalytics deductions={deductions} />

      {/* Interactive Payroll Impact Waterfall */}
      {showImpactWaterfall && (
        <PayrollImpactWaterfall
          grossSalary={85000}
          allowances={25000}
          pfDeduction={1800}
          ptDeduction={200}
          loanEmiDeduction={12500}
          insuranceDeduction={1500}
        />
      )}

      {/* AI Deduction Insights */}
      <AIDeductionInsights insights={aiInsights} />

      {/* Main Layout: Filters & Table + Right Policy Rail */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        <div className="flex-1 w-full space-y-4">
          {/* Multi-filter Bar */}
          <DeductionsFilters
            filters={filters}
            onChange={(updated) => setFilters((prev) => ({ ...prev, ...updated }))}
            onReset={() =>
              setFilters({
                search: "",
                employee: "all",
                department: "all",
                designation: "all",
                location: "all",
                employmentType: "all",
                deductionType: "all",
                categoryGroup: "all",
                payrollCycle: "JULY-2026",
                status: "ALL",
                financialYear: "FY26-27",
                page: 1,
                limit: 10,
                sortBy: "updatedOn",
                sortDir: "desc",
              })
            }
          />

          {/* Workflow Tracker for Selected Rule */}
          {selectedRule && (
            <ApprovalWorkflowTracker
              rule={selectedRule}
              onToggleStatus={handleToggleStatus}
            />
          )}

          {/* Main Table View */}
          {activeView === "DEDUCTIONS" && (
            <DeductionsTable
              data={deductions}
              selectedIds={selectedDeductionIds}
              onSelectToggle={handleSelectToggle}
              onSelectAll={handleSelectAll}
              onView={handleView}
              onEdit={handleEdit}
              onAssignEmployees={handleAssignEmployees}
              onPreviewImpact={handlePreviewImpact}
              onToggleStatus={handleToggleStatus}
              onArchive={handleToggleStatus}
              onViewLogs={() => setActiveView("AUDIT_LOGS")}
            />
          )}

          {/* Audit Logs View */}
          {activeView === "AUDIT_LOGS" && (
            <div className="ded-card p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white">Payroll Deductions Audit Trail & Compliance Log</h3>
              <div className="ded-table-wrapper">
                <table className="ded-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Rule Code</th>
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
                        <td className="font-mono font-semibold text-rose-300">{log.deductionCode}</td>
                        <td>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
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

      {/* 5-Step Multi-step Deduction Wizard Drawer */}
      <CreateDeductionWizardDrawer
        open={createDrawerOpen}
        onClose={() => setCreateDrawerOpen(false)}
        onSave={handleSaveRule}
      />

      {/* Deduction Details Drawer */}
      <DeductionDetailsDrawer
        open={detailsDrawerOpen}
        onClose={() => setDetailsDrawerOpen(false)}
        rule={selectedRule}
        onAssignEmployees={handleAssignEmployees}
        onPreviewImpact={handlePreviewImpact}
        onToggleStatus={handleToggleStatus}
      />

      {/* Bulk Employee Assignment Drawer */}
      <EmployeeAssignmentDrawer
        open={assignDrawerOpen}
        onClose={() => setAssignDrawerOpen(false)}
        rule={selectedRule}
        onConfirmAssign={handleConfirmAssign}
      />
    </div>
  );
}
