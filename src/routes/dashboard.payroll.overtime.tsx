import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";

import "@/features/admin/payroll/components/overtime/overtime.css";

import { OvertimeHeader } from "@/features/admin/payroll/components/overtime/OvertimeHeader";
import { OvertimeKPIs } from "@/features/admin/payroll/components/overtime/OvertimeKPIs";
import { OvertimeFilters } from "@/features/admin/payroll/components/overtime/OvertimeFilters";
import { OvertimeTable } from "@/features/admin/payroll/components/overtime/OvertimeTable";
import { OvertimeDetailsDrawer } from "@/features/admin/payroll/components/overtime/OvertimeDetailsDrawer";
import { CreateOvertimeWizardDrawer } from "@/features/admin/payroll/components/overtime/CreateOvertimeWizardDrawer";
import { AttendanceTimelineModal } from "@/features/admin/payroll/components/overtime/AttendanceTimelineModal";
import { AIOvertimeInsights } from "@/features/admin/payroll/components/overtime/AIOvertimeInsights";
import { ApprovalWorkflowTracker } from "@/features/admin/payroll/components/overtime/ApprovalWorkflowTracker";
import { RightPolicyPanel } from "@/features/admin/payroll/components/overtime/RightPolicyPanel";
import { OvertimeAnalytics } from "@/features/admin/payroll/components/overtime/OvertimeAnalytics";

import { overtimeApi } from "@/services/overtimeApi";
import {
  OvertimeRecord,
  OvertimeFilters as FilterType,
  OvertimeSummaryKPIs,
  OvertimeAuditLog,
  OvertimeAIInsight,
} from "@/features/admin/payroll/components/overtime/overtimeTypes";

export const Route = createFileRoute("/dashboard/payroll/overtime")({
  head: () => ({ meta: [{ title: "Overtime & Shift Compensation — Aurix AI" }] }),
  component: OvertimePage,
});

function OvertimePage() {
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<OvertimeRecord[]>([]);
  const [kpis, setKpis] = useState<OvertimeSummaryKPIs>({
    totalOvertimeHours: 0,
    approvedHours: 0,
    pendingRequests: 0,
    rejectedRequests: 0,
    totalOvertimeCost: 0,
    averageOtHours: 0,
    weekendOvertimeHours: 0,
    holidayOvertimeHours: 0,
    nightShiftHours: 0,
    complianceAlerts: 0,
  });

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterType>({
    search: "",
    employee: "all",
    employeeId: "all",
    department: "all",
    designation: "all",
    location: "all",
    shift: "all",
    manager: "all",
    payrollCycle: "JULY-2026",
    approvalStatus: "ALL",
    compensationStatus: "ALL",
    overtimeType: "all",
    page: 1,
    limit: 10,
    sortBy: "updatedOn",
    sortDir: "desc",
  });

  // Modal Controllers
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [timelineModalOpen, setTimelineModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<OvertimeRecord | null>(null);
  const [activeView, setActiveView] = useState<"RECORDS" | "AUDIT_LOGS">("RECORDS");
  const [auditLogs, setAuditLogs] = useState<OvertimeAuditLog[]>([]);
  const [aiInsights, setAiInsights] = useState<OvertimeAIInsight[]>([]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await overtimeApi.getOvertimeRecords(filters);
      setRecords(res.items);
      setKpis(res.kpis);

      const logs = await overtimeApi.getAuditLogs();
      setAuditLogs(logs);

      const insights = await overtimeApi.getAIInsights();
      setAiInsights(insights);
    } catch {
      toast.error("Failed to load overtime data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleSelectToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(records.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleView = (record: OvertimeRecord) => {
    setSelectedRecord(record);
    setDetailsDrawerOpen(true);
  };

  const handleEdit = (record: OvertimeRecord) => {
    setSelectedRecord(record);
    setCreateDrawerOpen(true);
  };

  const handleApprove = async (record: OvertimeRecord) => {
    try {
      await overtimeApi.approveOvertime(record.id, "Finance Manager");
      toast.success(`Approved overtime '${record.requestCode}' for ${record.employeeName}`);
      loadData();
    } catch {
      toast.error("Failed to approve overtime.");
    }
  };

  const handleReject = async (record: OvertimeRecord) => {
    try {
      await overtimeApi.rejectOvertime(record.id, "Finance Manager", "Unapproved OT hours.");
      toast.success(`Rejected overtime claim '${record.requestCode}'.`);
      loadData();
    } catch {
      toast.error("Failed to reject overtime.");
    }
  };

  const handleRecalculate = async (record: OvertimeRecord) => {
    toast.success(`Recalculated overtime multiplier for ${record.requestCode}: ₹${record.overtimeAmount.toLocaleString("en-IN")}`);
    loadData();
  };

  const handleAddPayrollEntry = async (record: OvertimeRecord) => {
    await overtimeApi.addPayrollEntries([record.id], "JULY-2026");
    toast.success(`Added OT payout of ₹${record.overtimeAmount.toLocaleString("en-IN")} into July 2026 Pay Run.`);
    loadData();
  };

  const handleSaveOvertime = async (payload: Partial<OvertimeRecord>) => {
    await overtimeApi.createOvertimeRecord(payload);
    loadData();
  };

  const handleSyncAttendance = async () => {
    const res = await overtimeApi.syncAttendance();
    toast.success(`Synced ${res.count} biometric attendance punches into overtime calculation engine.`);
    loadData();
  };

  const handleExport = () => {
    const jsonStr = JSON.stringify(records, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `overtime_records_export_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    toast.success("Exported overtime records.");
  };

  return (
    <div className="overtime-container p-6 space-y-6">
      {/* Header */}
      <OvertimeHeader
        onCreateClick={() => {
          setSelectedRecord(null);
          setCreateDrawerOpen(true);
        }}
        onBulkApproveClick={() => {
          if (selectedIds.length === 0) {
            toast.error("Select overtime records to bulk approve.");
            return;
          }
          selectedIds.forEach((id) => overtimeApi.approveOvertime(id, "Finance Manager"));
          toast.success(`Bulk approved ${selectedIds.length} overtime claim(s).`);
          setSelectedIds([]);
          loadData();
        }}
        onSyncAttendanceClick={handleSyncAttendance}
        onGeneratePayrollEntriesClick={() => {
          if (selectedIds.length === 0) {
            toast.error("Select approved overtime claims to push into payroll.");
            return;
          }
          overtimeApi.addPayrollEntries(selectedIds, "JULY-2026");
          toast.success(`Queued ${selectedIds.length} overtime claim(s) into July 2026 Pay Run.`);
          setSelectedIds([]);
          loadData();
        }}
        onExportClick={handleExport}
        onImportSuccess={loadData}
        onAuditLogsClick={() => setActiveView(activeView === "RECORDS" ? "AUDIT_LOGS" : "RECORDS")}
      />

      {/* KPI Cards */}
      <OvertimeKPIs
        kpis={kpis}
        activeStatusFilter={filters.approvalStatus}
        onFilterStatus={(s) => setFilters((prev) => ({ ...prev, approvalStatus: s }))}
      />

      {/* Recharts Analytics Dashboard */}
      <OvertimeAnalytics records={records} />

      {/* AI Overtime & Burnout Insights */}
      <AIOvertimeInsights insights={aiInsights} />

      {/* Main Layout: Filters & Table + Right Policy Rail */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        <div className="flex-1 w-full space-y-4">
          {/* Multi-filter Bar */}
          <OvertimeFilters
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
                shift: "all",
                manager: "all",
                payrollCycle: "JULY-2026",
                approvalStatus: "ALL",
                compensationStatus: "ALL",
                overtimeType: "all",
                page: 1,
                limit: 10,
                sortBy: "updatedOn",
                sortDir: "desc",
              })
            }
          />

          {/* Workflow Tracker for Selected Record */}
          {selectedRecord && (
            <ApprovalWorkflowTracker
              record={selectedRecord}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}

          {/* Main Table View */}
          {activeView === "RECORDS" && (
            <OvertimeTable
              data={records}
              selectedIds={selectedIds}
              onSelectToggle={handleSelectToggle}
              onSelectAll={handleSelectAll}
              onView={handleView}
              onEdit={handleEdit}
              onApprove={handleApprove}
              onReject={handleReject}
              onRecalculate={handleRecalculate}
              onAddPayrollEntry={handleAddPayrollEntry}
              onViewTimeline={(rec) => {
                setSelectedRecord(rec);
                setTimelineModalOpen(true);
              }}
              onViewLogs={() => setActiveView("AUDIT_LOGS")}
            />
          )}

          {/* Audit Logs View */}
          {activeView === "AUDIT_LOGS" && (
            <div className="ot-card p-5 space-y-4">
              <h3 className="text-sm font-semibold text-white">Overtime Audit Trail & Compliance Log</h3>
              <div className="ot-table-wrapper">
                <table className="ot-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Request Code</th>
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
                        <td className="font-mono font-semibold text-blue-300">{log.requestCode}</td>
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

      {/* 4-Step Multi-step Overtime Wizard Drawer */}
      <CreateOvertimeWizardDrawer
        open={createDrawerOpen}
        onClose={() => setCreateDrawerOpen(false)}
        onSave={handleSaveOvertime}
      />

      {/* Overtime Details Drawer */}
      <OvertimeDetailsDrawer
        open={detailsDrawerOpen}
        onClose={() => setDetailsDrawerOpen(false)}
        record={selectedRecord}
        onApprove={handleApprove}
        onReject={handleReject}
        onAddPayrollEntry={handleAddPayrollEntry}
      />

      {/* Biometric Attendance Punch Timeline Modal */}
      <AttendanceTimelineModal
        open={timelineModalOpen}
        onClose={() => setTimelineModalOpen(false)}
        record={selectedRecord}
      />
    </div>
  );
}
