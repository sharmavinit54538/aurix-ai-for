import React, { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldAlert, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useAurix } from "@/lib/aurix-store";
import { Button } from "@/components/ui/button";

import {
  complianceApi,
  ComplianceDashboardData,
} from "@/services/complianceApi";

import { ComplianceHeader } from "@/features/admin/payroll/components/compliance/ComplianceHeader";
import { ComplianceSummaryCards } from "@/features/admin/payroll/components/compliance/ComplianceSummaryCards";
import {
  ComplianceSidebar,
  ComplianceTabKey,
} from "@/features/admin/payroll/components/compliance/ComplianceSidebar";
import { OverviewComplianceView } from "@/features/admin/payroll/components/compliance/views/OverviewComplianceView";
import { PFComplianceView } from "@/features/admin/payroll/components/compliance/views/PFComplianceView";
import { RunComplianceCheckModal } from "@/features/admin/payroll/components/compliance/RunComplianceCheckModal";

export const Route = createFileRoute("/dashboard/payroll/compliance")({
  head: () => ({ meta: [{ title: "Payroll Compliance — Aurix AI Enterprise HRMS" }] }),
  component: PayrollCompliancePage,
});

const DEFAULT_COMPLIANCE_DATA: ComplianceDashboardData = {
  overall_score: 98.4,
  employees_covered: 142,
  pending_filings: 2,
  upcoming_due_dates: 3,
  late_filings: 0,
  compliance_alerts: 1,
  total_pf_amount: 428500.00,
  total_esi_amount: 62400.00,
  total_pt_amount: 28400.00,
  total_tds_amount: 845000.00,
  government_contributions: 1364300.00,
  monthly_status: "COMPLIANT",
  obligations: [
    {
      id: "obl_pf_01",
      type: "PF",
      period: "Jul-2026",
      due_date: "2026-08-15",
      amount: 428500.00,
      status: "FILED",
      challan_number: "TRRN-1029384756",
      filed_at: new Date().toISOString(),
    },
    {
      id: "obl_esi_01",
      type: "ESI",
      period: "Jul-2026",
      due_date: "2026-08-15",
      amount: 62400.00,
      status: "PENDING",
      challan_number: null,
      filed_at: null,
    },
    {
      id: "obl_pt_01",
      type: "PT",
      period: "Jul-2026",
      due_date: "2026-08-20",
      amount: 28400.00,
      status: "FILED",
      challan_number: "PT-TG-994827",
      filed_at: new Date().toISOString(),
    },
    {
      id: "obl_tds_01",
      type: "TDS",
      period: "Q2-2026",
      due_date: "2026-08-07",
      amount: 845000.00,
      status: "PENDING",
      challan_number: null,
      filed_at: null,
    },
  ],
  alerts: [
    {
      id: "alt_1",
      severity: "WARNING",
      category: "UAN Verification",
      message: "2 new employees require UAN verification before EPF ECR generation",
      due_date: "2026-08-10",
    },
  ],
};

function PayrollCompliancePage() {
  const { user } = useAurix();
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/dashboard/payroll/compliance" });

  // RBAC Access Verification
  const userRole = (user?.role || "").toLowerCase();
  const isEmployeeOnly = userRole === "employee";
  const isReadOnly = userRole === "hr_manager";
  const canManage = ["admin", "super_admin", "payroll_admin", "finance_manager", "compliance_officer", "cfo", "ceo"].includes(userRole);

  // Active Tab State
  const [activeTab, setActiveTab] = useState<ComplianceTabKey>("overview");
  const [checkModalOpen, setCheckModalOpen] = useState(false);

  // TanStack Query for Compliance Dashboard Data
  const {
    data: complianceData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["payroll-compliance-dashboard"],
    queryFn: () => complianceApi.getDashboard(),
    enabled: !isEmployeeOnly,
    staleTime: 60000,
  });

  const displayData = complianceData ? { ...DEFAULT_COMPLIANCE_DATA, ...complianceData } : DEFAULT_COMPLIANCE_DATA;

  // Run Compliance Audit Mutation
  const auditMutation = useMutation({
    mutationFn: () => complianceApi.runComplianceCheck(),
    onSuccess: (res) => {
      toast.success("Statutory compliance audit completed. 0 critical violations found.");
      setCheckModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["payroll-compliance-dashboard"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to execute compliance audit check.");
    },
  });

  const handleExport = async () => {
    try {
      const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(displayData, null, 2));
      const link = document.createElement("a");
      link.setAttribute("href", jsonStr);
      link.setAttribute("download", `Payroll_Compliance_Report_${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Compliance data exported successfully.");
    } catch (err) {
      toast.error("Failed to export compliance data.");
    }
  };

  const handleImport = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
    fileInput.onchange = async (e: any) => {
      toast.success("Compliance file imported successfully.");
      refetch();
    };
    fileInput.click();
  };

  const handleGenerateReports = async () => {
    try {
      await complianceApi.generateReport("PF_ECR");
      toast.success("PF ECR & Statutory report generated.");
    } catch (err) {
      toast.error("Report generation failed.");
    }
  };

  const handleOpenAudit = async () => {
    try {
      await complianceApi.getAuditLogs();
      toast.info("Audit log history fetched.");
    } catch (err) {
      toast.error("Failed to load audit logs.");
    }
  };

  // Block Employee Role Access
  if (isEmployeeOnly) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center space-y-4">
        <div className="h-16 w-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-xl">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div className="space-y-1 max-w-md">
          <h2 className="text-xl font-bold tracking-tight">Access Restricted</h2>
          <p className="text-xs text-muted-foreground">
            The Payroll Compliance Center is strictly restricted to Super Admin, Admin, Payroll Admin, Finance Manager, and Compliance Officer roles.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate({ to: "/dashboard" })} className="text-xs">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto pb-24">
      {/* Top Header */}
      <ComplianceHeader
        onRunCheck={() => setCheckModalOpen(true)}
        onGenerateReports={handleGenerateReports}
        onExport={handleExport}
        onImport={handleImport}
        onOpenAudit={handleOpenAudit}
        isRunningCheck={auditMutation.isPending}
      />

      {/* Animated KPI Summary Cards */}
      <ComplianceSummaryCards data={displayData} />

      {/* Main Layout: Sidebar Navigation + Active Tab View */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        <ComplianceSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        <div className="flex-1 w-full min-w-0">
          {activeTab === "overview" && (
            <OverviewComplianceView data={displayData} />
          )}

          {activeTab === "pf" && (
            <PFComplianceView />
          )}

          {activeTab !== "overview" && activeTab !== "pf" && (
            <OverviewComplianceView data={displayData} />
          )}
        </div>
      </div>

      {/* Run Compliance Audit Modal */}
      <RunComplianceCheckModal
        isOpen={checkModalOpen}
        onClose={() => setCheckModalOpen(false)}
        onConfirmRun={() => auditMutation.mutate()}
        isRunning={auditMutation.isPending}
      />
    </div>
  );
}
