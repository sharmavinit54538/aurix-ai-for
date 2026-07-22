import React, { useState, useEffect, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import "@/features/admin/payroll/components/salary-structure/salary-structure.css";

import { SalaryStructureHeader } from "@/features/admin/payroll/components/salary-structure/SalaryStructureHeader";
import { SalaryStructureKPIs } from "@/features/admin/payroll/components/salary-structure/SalaryStructureKPIs";
import { SalaryStructureSidebarTabs } from "@/features/admin/payroll/components/salary-structure/SalaryStructureSidebarTabs";
import { SalaryStructureFilters } from "@/features/admin/payroll/components/salary-structure/SalaryStructureFilters";
import { SalaryStructureTable } from "@/features/admin/payroll/components/salary-structure/SalaryStructureTable";
import { SalaryBreakdownFlow } from "@/features/admin/payroll/components/salary-structure/SalaryBreakdownFlow";
import { SalaryStructureWizardDrawer } from "@/features/admin/payroll/components/salary-structure/SalaryStructureWizardDrawer";
import { AICompensationInsights } from "@/features/admin/payroll/components/salary-structure/AICompensationInsights";
import { VersionCompareModal } from "@/features/admin/payroll/components/salary-structure/VersionCompareModal";
import { AssignmentDrawer } from "@/features/admin/payroll/components/salary-structure/AssignmentDrawer";
import { ApprovalWorkflowTracker } from "@/features/admin/payroll/components/salary-structure/ApprovalWorkflowTracker";
import { RightContextPanel } from "@/features/admin/payroll/components/salary-structure/RightContextPanel";
import { SalaryStructureAnalytics } from "@/features/admin/payroll/components/salary-structure/SalaryStructureAnalytics";

import { salaryStructureApi } from "@/services/salaryStructureApi";
import {
  SalaryStructure,
  SalaryStructureFilters as FilterType,
  SalaryStructureSummaryKPIs,
  SidebarTabId,
  SalaryStructureAuditLog,
  SalaryStructureAIInsight,
} from "@/features/admin/payroll/components/salary-structure/salaryStructureTypes";

export const Route = createFileRoute("/dashboard/payroll/salary-structure")({
  head: () => ({ meta: [{ title: "Enterprise Salary Structure & Compensation Management — Aurix AI" }] }),
  component: SalaryStructurePage,
});

function SalaryStructurePage() {
  const [loading, setLoading] = useState(true);
  const [structures, setStructures] = useState<SalaryStructure[]>([]);
  const [kpis, setKpis] = useState<SalaryStructureSummaryKPIs>({
    totalStructures: 0,
    activeStructures: 0,
    draftStructures: 0,
    archivedStructures: 0,
    employeesAssigned: 0,
    averageCtc: 0,
    totalEmployerCostMonthly: 0,
    pendingApprovals: 0,
  });

  const [activeTab, setActiveTab] = useState<SidebarTabId>("overview");
  const [filters, setFilters] = useState<FilterType>({
    search: "",
    department: "all",
    designation: "all",
    location: "all",
    employmentType: "all",
    salaryGrade: "all",
    salaryBand: "all",
    financialYear: "FY26-27",
    status: "ALL",
    page: 1,
    limit: 10,
    sortBy: "updatedOn",
    sortDir: "desc",
  });

  // Modal / Drawer Controllers
  const [wizardOpen, setWizardOpen] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState<SalaryStructure | null>(null);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [assignDrawerOpen, setAssignDrawerOpen] = useState(false);
  const [auditLogs, setAuditLogs] = useState<SalaryStructureAuditLog[]>([]);
  const [aiInsights, setAiInsights] = useState<SalaryStructureAIInsight[]>([]);

  // Load Data
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await salaryStructureApi.getStructures(filters);
      setStructures(res.items);
      setKpis(res.kpis);

      const logs = await salaryStructureApi.getAuditLogs();
      setAuditLogs(logs);

      const insights = await salaryStructureApi.getAIInsights();
      setAiInsights(insights);
    } catch {
      toast.error("Failed to load salary structure data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  // Actions
  const handleCreateNew = () => {
    setSelectedStructure(null);
    setWizardOpen(true);
  };

  const handleEdit = (item: SalaryStructure) => {
    setSelectedStructure(item);
    setWizardOpen(true);
  };

  const handleView = (item: SalaryStructure) => {
    setSelectedStructure(item);
    setActiveTab("overview");
  };

  const handleClone = async (item: SalaryStructure) => {
    try {
      const cloned = await salaryStructureApi.cloneStructure(item.id);
      toast.success(`Cloned '${item.name}' into draft template '${cloned.code}'`);
      loadData();
    } catch {
      toast.error("Failed to clone structure.");
    }
  };

  const handleCompare = (item?: SalaryStructure) => {
    setSelectedStructure(item || structures[0] || null);
    setCompareModalOpen(true);
  };

  const handleAssign = (item: SalaryStructure) => {
    setSelectedStructure(item);
    setAssignDrawerOpen(true);
  };

  const handleToggleStatus = async (item: SalaryStructure) => {
    const newStatus = item.status === "ACTIVE" ? "DRAFT" : "ACTIVE";
    try {
      await salaryStructureApi.updateStructure(item.id, { status: newStatus });
      toast.success(`Structure '${item.name}' status set to ${newStatus}`);
      loadData();
    } catch {
      toast.error("Failed to change status.");
    }
  };

  const handleArchive = async (item: SalaryStructure) => {
    try {
      await salaryStructureApi.updateStructure(item.id, { status: "ARCHIVED" });
      toast.success(`Structure '${item.name}' archived.`);
      loadData();
    } catch {
      toast.error("Failed to archive structure.");
    }
  };

  const handleSaveWizard = async (payload: Partial<SalaryStructure>) => {
    if (selectedStructure) {
      await salaryStructureApi.updateStructure(selectedStructure.id, payload);
    } else {
      await salaryStructureApi.createStructure(payload);
    }
    loadData();
  };

  const handleAssignSubmit = async (structureId: string, assignment: any) => {
    await salaryStructureApi.assignStructure(structureId, assignment);
    loadData();
  };

  const handleRollback = async (structureId: string, versionId: string) => {
    await salaryStructureApi.rollbackVersion(structureId, versionId);
    loadData();
  };

  const handleApprovalDecision = async (id: string, role: string, decision: "APPROVE" | "REJECT") => {
    await salaryStructureApi.approveStructure(id, role, decision);
    toast.success(`Recorded ${decision} for role ${role}`);
    loadData();
  };

  const handleExport = () => {
    const jsonStr = JSON.stringify(structures, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `salary_structures_export_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    toast.success("Exported salary structure configuration file.");
  };

  const handleImportSuccess = (importedData: any) => {
    toast.success("Imported new salary structure template!");
    loadData();
  };

  return (
    <div className="salary-structure-container p-6 space-y-6">
      {/* Header */}
      <SalaryStructureHeader
        onCreateClick={handleCreateNew}
        onCompareClick={() => handleCompare()}
        onAuditLogsClick={() => setActiveTab("audit_logs")}
        onExportClick={handleExport}
        onImportSuccess={handleImportSuccess}
        onCloneClick={() => handleClone(structures[0])}
      />

      {/* KPI Cards */}
      <SalaryStructureKPIs
        kpis={kpis}
        activeStatusFilter={filters.status}
        onFilterStatus={(s) => setFilters((prev) => ({ ...prev, status: s }))}
      />

      {/* Analytics Dashboard */}
      <SalaryStructureAnalytics structures={structures} />

      {/* AI Insights Bar */}
      <AICompensationInsights insights={aiInsights} />

      {/* Main Content Layout: Sidebar Nav + Middle Content + Right Context Rail */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Left Sidebar Navigation */}
        <SalaryStructureSidebarTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Middle Main Content Area */}
        <div className="flex-1 w-full space-y-4">
          {/* Multi-Filter Bar */}
          <SalaryStructureFilters
            filters={filters}
            onChange={(updated) => setFilters((prev) => ({ ...prev, ...updated }))}
            onReset={() =>
              setFilters({
                search: "",
                department: "all",
                designation: "all",
                location: "all",
                employmentType: "all",
                salaryGrade: "all",
                salaryBand: "all",
                financialYear: "FY26-27",
                status: "ALL",
                page: 1,
                limit: 10,
                sortBy: "updatedOn",
                sortDir: "desc",
              })
            }
          />

          {/* Interactive Compensation Waterfall View */}
          {selectedStructure && (
            <SalaryBreakdownFlow structure={selectedStructure} />
          )}

          {/* Tab View 1: Overview & All Templates Table */}
          {(activeTab === "overview" || activeTab === "templates") && (
            <SalaryStructureTable
              data={structures}
              onView={handleView}
              onEdit={handleEdit}
              onClone={handleClone}
              onCompare={handleCompare}
              onAssign={handleAssign}
              onToggleStatus={handleToggleStatus}
              onArchive={handleArchive}
              onViewLogs={() => setActiveTab("audit_logs")}
            />
          )}

          {/* Tab View 2: Approval Workflow */}
          {activeTab === "approval_workflow" && (
            <ApprovalWorkflowTracker
              structure={selectedStructure || structures[0] || ({} as any)}
              onApproveDecision={handleApprovalDecision}
            />
          )}

          {/* Tab View 3: Audit Logs Table */}
          {activeTab === "audit_logs" && (
            <div className="salary-card p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white">System Salary Structure Audit Trail</h3>
              <div className="salary-table-wrapper">
                <table className="salary-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Structure</th>
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
                        <td className="font-semibold text-blue-300">{log.structureName}</td>
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

        {/* Right Context Rail */}
        <RightContextPanel />
      </div>

      {/* Multi-step Create/Edit Wizard Drawer */}
      <SalaryStructureWizardDrawer
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        structure={selectedStructure}
        onSave={handleSaveWizard}
      />

      {/* Side-by-Side Version Comparison Modal */}
      <VersionCompareModal
        open={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        structure={selectedStructure || structures[0] || null}
        onRollback={handleRollback}
      />

      {/* Bulk Assignment Drawer */}
      <AssignmentDrawer
        open={assignDrawerOpen}
        onClose={() => setAssignDrawerOpen(false)}
        structure={selectedStructure || structures[0] || null}
        onAssignSubmit={handleAssignSubmit}
      />
    </div>
  );
}
