import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import "@/features/admin/payroll/components/bank-transfers/bank-transfers.css";

import { BankHubHeader } from "@/features/admin/payroll/components/bank-transfers/BankHubHeader";
import { BankHubCardGrid } from "@/features/admin/payroll/components/bank-transfers/BankHubCardGrid";
import { BankHubModuleViews } from "@/features/admin/payroll/components/bank-transfers/BankHubModuleViews";
import { CreateBatchModal } from "@/features/admin/payroll/components/bank-transfers/CreateBatchModal";
import { TransferDetailsDrawer } from "@/features/admin/payroll/components/bank-transfers/TransferDetailsDrawer";

import {
  bankTransfersApi,
  BankTransferItem,
  BankTransferDashboardMetrics,
} from "@/services/bankTransfersApi";

export const Route = createFileRoute("/dashboard/payroll/bank-transfers")({
  head: () => ({ meta: [{ title: "Enterprise Bank Transfer Hub — OFC360" }] }),
  component: BankTransfersPage,
});

function BankTransfersPage() {
  const [loading, setLoading] = useState(true);
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [items, setItems] = useState<BankTransferItem[]>([]);
  const [metrics, setMetrics] = useState<BankTransferDashboardMetrics>({
    total_employees: 142,
    ready_for_payment: 138,
    pending_verification: 2,
    transfer_processing: 12,
    successful_transfers: 126,
    failed_transfers: 2,
    total_salary_amount: 6950000.0,
    transferred_amount: 6170000.0,
    pending_amount: 700000.0,
    rejected_amount: 80000.0,
  });

  // Modal Controllers
  const [createBatchModalOpen, setCreateBatchModalOpen] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BankTransferItem | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await bankTransfersApi.getTransfers();
      setItems(data || []);

      const m = await bankTransfersApi.getDashboardMetrics();
      if (m && m.total_salary_amount) setMetrics(m);
    } catch {
      toast.error("Failed to load bank transfers data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleViewDetails = (item: BankTransferItem) => {
    setSelectedItem(item);
    setDetailsDrawerOpen(true);
  };

  const handleRetryTransfer = async (item: BankTransferItem) => {
    try {
      await bankTransfersApi.retryTransfer(item.id);
      toast.success(`Retried payment transfer for ${item.employee_name}`);
      loadData();
    } catch {
      toast.error("Failed to retry bank transfer.");
    }
  };

  const handleMarkAsPaid = async (item: BankTransferItem) => {
    try {
      await bankTransfersApi.markAsPaid(item.id);
      toast.success(`Marked transfer as paid for ${item.employee_name}`);
      loadData();
    } catch {
      toast.error("Failed to mark transfer as paid.");
    }
  };

  const handleGenerateFile = async (format: string) => {
    try {
      const res = await bankTransfersApi.generateBankFile(format);
      toast.success(`Generated ${format} bank advice file: ${res.file_name || "SALARY_NEFT.txt"}`);
    } catch {
      toast.error("Failed to generate bank file.");
    }
  };

  const handleInitiatePayments = async () => {
    try {
      await bankTransfersApi.initiatePayments();
      toast.success("Initiated corporate bank gateway disbursal batch.");
      loadData();
    } catch {
      toast.error("Failed to initiate bank payments.");
    }
  };

  const handleExport = () => {
    const jsonStr = JSON.stringify(items, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bank_transfers_audit_export_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    toast.success("Exported bank transfer audit records.");
  };

  const categoryTabs = ["All", "Core Banking", "Disbursal & Verification", "Gateways & Files", "AI & Compliance", "Analytics & Settings"];

  return (
    <div className="space-y-6">
      {activeModuleId ? (
        /* Full-Screen Module View when a Feature Card is Opened */
        <BankHubModuleViews
          moduleId={activeModuleId}
          onBackToHub={() => setActiveModuleId(null)}
          items={items}
          metrics={metrics}
          onOpenCreateBatchModal={() => setCreateBatchModalOpen(true)}
          onViewTransferDetails={handleViewDetails}
          onRetryTransfer={handleRetryTransfer}
          onMarkAsPaid={handleMarkAsPaid}
          onGenerateBankFile={handleGenerateFile}
        />
      ) : (
        /* Bank Transfer Hub Landing Page Architecture */
        <div className="space-y-6">
          {/* Hub Header & High Level Metrics */}
          <BankHubHeader
            metrics={metrics}
            onCreateBatchClick={() => setCreateBatchModalOpen(true)}
            onInitiatePaymentsClick={handleInitiatePayments}
            onGenerateFileClick={() => handleGenerateFile("NEFT")}
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
                placeholder="Search banking modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-slate-950/60 border-white/10 text-xs text-white placeholder:text-slate-500 h-9"
              />
            </div>
          </div>

          {/* Feature Card Grid (16 Modules) */}
          <BankHubCardGrid
            onSelectModule={(modId) => setActiveModuleId(modId)}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
          />
        </div>
      )}

      {/* Drawers & Modals */}
      <CreateBatchModal
        open={createBatchModalOpen}
        onOpenChange={setCreateBatchModalOpen}
        onBatchCreated={() => {
          loadData();
          setCreateBatchModalOpen(false);
        }}
      />

      <TransferDetailsDrawer
        open={detailsDrawerOpen}
        onOpenChange={setDetailsDrawerOpen}
        item={selectedItem}
        onRetry={handleRetryTransfer}
        onMarkAsPaid={handleMarkAsPaid}
      />
    </div>
  );
}
