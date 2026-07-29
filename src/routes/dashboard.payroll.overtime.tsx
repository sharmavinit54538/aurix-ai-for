import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import "@/features/admin/payroll/components/overtime/overtime.css";

import { OvertimeHubHeader } from "@/features/admin/payroll/components/overtime/OvertimeHubHeader";
import { OvertimeHubCardGrid } from "@/features/admin/payroll/components/overtime/OvertimeHubCardGrid";
import { OvertimeHubModuleViews } from "@/features/admin/payroll/components/overtime/OvertimeHubModuleViews";
import { CreateOvertimeWizardDrawer } from "@/features/admin/payroll/components/overtime/CreateOvertimeWizardDrawer";
import { OvertimeDetailsDrawer } from "@/features/admin/payroll/components/overtime/OvertimeDetailsDrawer";

import { overtimeApi } from "@/services/overtimeApi";
import {
  OvertimeRecord,
  OvertimeFilters as FilterType,
  OvertimeSummaryKPIs,
} from "@/features/admin/payroll/components/overtime/overtimeTypes";

export const Route = createFileRoute("/dashboard/payroll/overtime")({
  head: () => ({ meta: [{ title: "Enterprise Overtime Hub — Aurix AI" }] }),
  component: OvertimePage,
});

function OvertimePage() {
  const [loading, setLoading] = useState(true);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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
  const [selectedRecord, setSelectedRecord] = useState<OvertimeRecord | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await overtimeApi.getOvertimeRecords(filters);
      setRecords(res.items);
      setKpis(res.kpis);
    } catch {
      toast.error("Failed to load overtime data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleView = (record: OvertimeRecord) => {
    setSelectedRecord(record);
    setDetailsDrawerOpen(true);
  };

  const handleApprove = async (record: OvertimeRecord) => {
    try {
      await overtimeApi.approveOvertime(record.id, "Finance Manager");
      toast.success(`Approved overtime request '${record.requestCode}'`);
      loadData();
    } catch {
      toast.error("Failed to approve overtime request.");
    }
  };

  const handleReject = async (record: OvertimeRecord) => {
    try {
      await overtimeApi.rejectOvertime(record.id, "Finance Manager", "Exceeds daily OT hours limit.");
      toast.success(`Rejected overtime request '${record.requestCode}'.`);
      loadData();
    } catch {
      toast.error("Failed to reject overtime request.");
    }
  };

  const handleBulkApprove = async () => {
    const idsToApprove = selectedIds.length > 0 ? selectedIds : records.map((r) => r.id);
    if (idsToApprove.length === 0) {
      toast.error("No overtime requests selected for bulk approval.");
      return;
    }
    for (const id of idsToApprove) {
      await overtimeApi.approveOvertime(id, "Finance Manager");
    }
    toast.success(`Bulk approved ${idsToApprove.length} overtime request(s).`);
    setSelectedIds([]);
    loadData();
  };

  const handleCreateSave = async (payload: Partial<OvertimeRecord>) => {
    await overtimeApi.createOvertimeRecord(payload);
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
    toast.success("Exported overtime audit records.");
  };

  const categoryTabs = ["All", "Core Workflow", "Shift & Attendance", "Compensation & Rules", "AI & Compliance", "Analytics & Settings"];

  return (
    <div className="space-y-6">
      {activeModuleId ? (
        /* Full-Screen Module View when a Feature Card is Opened */
        <OvertimeHubModuleViews
          moduleId={activeModuleId}
          onBackToHub={() => setActiveModuleId(null)}
          records={records}
          onOpenCreateDrawer={() => setCreateDrawerOpen(true)}
          onViewRecordDetails={handleView}
          onApproveRecord={handleApprove}
          onRejectRecord={handleReject}
          onAddPayrollEntry={async (record) => {
            await overtimeApi.addPayrollEntries([record.id], "JULY-2026");
            toast.success(`Added OT entry ${record.requestCode} to July payroll cycle.`);
            loadData();
          }}
        />
      ) : (
        /* Overtime Hub Landing Page Architecture */
        <div className="space-y-6">
          {/* Hub Header & High Level Metrics */}
          <OvertimeHubHeader
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
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
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
                placeholder="Search overtime modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-slate-950/60 border-white/10 text-xs text-white placeholder:text-slate-500 h-9"
              />
            </div>
          </div>

          {/* Feature Card Grid (22 Modules) */}
          <OvertimeHubCardGrid
            onSelectModule={(modId) => setActiveModuleId(modId)}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
          />
        </div>
      )}

      {/* Drawers */}
      <CreateOvertimeWizardDrawer
        open={createDrawerOpen}
        onOpenChange={setCreateDrawerOpen}
        onSave={handleCreateSave}
      />

      <OvertimeDetailsDrawer
        open={detailsDrawerOpen}
        onOpenChange={setDetailsDrawerOpen}
        record={selectedRecord}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
