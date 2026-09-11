import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import "@/features/admin/payroll/components/bonuses/bonuses.css";

import { BonusHubHeader } from "@/features/admin/payroll/components/bonuses/BonusHubHeader";
import { BonusHubCardGrid } from "@/features/admin/payroll/components/bonuses/BonusHubCardGrid";
import { BonusHubModuleViews } from "@/features/admin/payroll/components/bonuses/BonusHubModuleViews";
import { CreateBonusWizardDrawer } from "@/features/admin/payroll/components/bonuses/CreateBonusWizardDrawer";
import { BonusDetailsDrawer } from "@/features/admin/payroll/components/bonuses/BonusDetailsDrawer";

import { bonusesApi } from "@/services/bonusesApi";
import {
  BonusRecord,
  BonusesFilters as FilterType,
  BonusesSummaryKPIs,
} from "@/features/admin/payroll/components/bonuses/bonusesTypes";

export const Route = createFileRoute("/dashboard/payroll/bonuses")({
  head: () => ({ meta: [{ title: "Enterprise Bonus & Incentives Hub — OFC360" }] }),
  component: BonusesPage,
});

function BonusesPage() {
  const [loading, setLoading] = useState(true);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [records, setRecords] = useState<BonusRecord[]>([]);
  const [kpis, setKpis] = useState<BonusesSummaryKPIs>({
    totalBonusAmount: 0,
    approvedBonusAmount: 0,
    paidBonusAmount: 0,
    pendingApprovals: 0,
    totalEligibleEmployees: 0,
    averageBonusAmount: 0,
    topBonusType: "-",
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
    bonusType: "all",
    bonusCategory: "all",
    performancePeriod: "FY2026-Q1",
    approvalStatus: "ALL",
    payrollStatus: "ALL",
    page: 1,
    limit: 10,
    sortBy: "updatedOn",
    sortDir: "desc",
  });

  // Modal Controllers
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<BonusRecord | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await bonusesApi.getBonuses(filters);
      setRecords(res.items);
      setKpis(res.kpis);
    } catch {
      toast.error("Failed to load bonus data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleView = (record: BonusRecord) => {
    setSelectedRecord(record);
    setDetailsDrawerOpen(true);
  };

  const handleApprove = async (record: BonusRecord) => {
    try {
      await bonusesApi.approveBonus(record.id, "Finance Manager");
      toast.success(`Approved bonus allocation '${record.bonusCode}'`);
      loadData();
    } catch {
      toast.error("Failed to approve bonus allocation.");
    }
  };

  const handleReject = async (record: BonusRecord) => {
    try {
      await bonusesApi.rejectBonus(record.id, "Finance Manager", "Exceeds department budget pool.");
      toast.success(`Rejected bonus allocation '${record.bonusCode}'.`);
      loadData();
    } catch {
      toast.error("Failed to reject bonus allocation.");
    }
  };

  const handleBulkApprove = async () => {
    const idsToApprove = selectedIds.length > 0 ? selectedIds : records.map((r) => r.id);
    if (idsToApprove.length === 0) {
      toast.error("No bonus allocations selected for bulk approval.");
      return;
    }
    for (const id of idsToApprove) {
      await bonusesApi.approveBonus(id, "Finance Manager");
    }
    toast.success(`Bulk approved ${idsToApprove.length} bonus allocation(s).`);
    setSelectedIds([]);
    loadData();
  };

  const handleCreateSave = async (payload: Partial<BonusRecord>) => {
    await bonusesApi.createBonusRecord(payload);
    loadData();
  };

  const handleExport = () => {
    const jsonStr = JSON.stringify(records, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bonus_records_export_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    toast.success("Exported bonus and incentive audit records.");
  };

  const categoryTabs = ["All", "Core Workflow", "Performance & Rewards", "Calculations & Budget", "AI & Governance", "Analytics & Settings"];

  return (
    <div className="space-y-6">
      {activeModuleId ? (
        /* Full-Screen Module View when a Feature Card is Opened */
        <BonusHubModuleViews
          moduleId={activeModuleId}
          onBackToHub={() => setActiveModuleId(null)}
          records={records}
          onOpenCreateDrawer={() => setCreateDrawerOpen(true)}
          onViewRecordDetails={handleView}
          onApproveRecord={handleApprove}
          onRejectRecord={handleReject}
          onAddPayrollEntry={async (record) => {
            await bonusesApi.addPayrollEntries([record.id], "JULY-2026");
            toast.success(`Synced bonus ${record.bonusCode} into July payroll cycle.`);
            loadData();
          }}
        />
      ) : (
        /* Bonus Hub Landing Page Architecture */
        <div className="space-y-6">
          {/* Hub Header & High Level Metrics */}
          <BonusHubHeader
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
                placeholder="Search bonus & incentive modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-slate-950/60 border-white/10 text-xs text-white placeholder:text-slate-500 h-9"
              />
            </div>
          </div>

          {/* Feature Card Grid (18 Modules) */}
          <BonusHubCardGrid
            onSelectModule={(modId) => setActiveModuleId(modId)}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
          />
        </div>
      )}

      {/* Drawers */}
      <CreateBonusWizardDrawer
        open={createDrawerOpen}
        onOpenChange={setCreateDrawerOpen}
        onSave={handleCreateSave}
      />

      <BonusDetailsDrawer
        open={detailsDrawerOpen}
        onOpenChange={setDetailsDrawerOpen}
        record={selectedRecord}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
