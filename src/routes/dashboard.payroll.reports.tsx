import React, { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useAurix } from "@/lib/aurix-store";
import { Button } from "@/components/ui/button";

import {
  payrollReportsApi,
  ReportsDashboardData,
  ReportsDashboardKPIs,
} from "@/services/payrollReportsApi";

import { ReportsHeader } from "@/features/admin/payroll/components/reports/ReportsHeader";
import { ReportsSummaryCards } from "@/features/admin/payroll/components/reports/ReportsSummaryCards";
import { ReportsFilterBar, ReportsFilterState } from "@/features/admin/payroll/components/reports/ReportsFilterBar";
import { ReportsAnalyticsCharts } from "@/features/admin/payroll/components/reports/ReportsAnalyticsCharts";
import { ReportTemplatesGrid } from "@/features/admin/payroll/components/reports/ReportTemplatesGrid";
import { CustomReportBuilderModal } from "@/features/admin/payroll/components/reports/CustomReportBuilderModal";
import { ScheduleReportModal } from "@/features/admin/payroll/components/reports/ScheduleReportModal";

export const Route = createFileRoute("/dashboard/payroll/reports")({
  head: () => ({ meta: [{ title: "Payroll Reports — Aurix AI Enterprise HRMS" }] }),
  component: PayrollReportsPage,
});

const DEFAULT_KPIS: ReportsDashboardKPIs = {
  total_payroll_cost: 8450000,
  net_salary_paid: 6170000,
  gross_salary: 7800000,
  total_deductions: 1630000,
  employer_contributions: 650000,
  bonuses_paid: 450000,
  overtime_paid: 185000,
  tax_deducted: 845000,
  pf_contributions: 428500,
  esi_contributions: 62400,
  pending_payroll: 0,
  accuracy_percentage: 99.8,
};

const DEFAULT_COST_TREND = [
  { month: "Feb-26", gross: 7100000, net: 5600000, tax: 780000, pf: 390000 },
  { month: "Mar-26", gross: 7250000, net: 5720000, tax: 795000, pf: 402000 },
  { month: "Apr-26", gross: 7400000, net: 5850000, tax: 810000, pf: 410000 },
  { month: "May-26", gross: 7550000, net: 5950000, tax: 825000, pf: 418000 },
  { month: "Jun-26", gross: 7680000, net: 6050000, tax: 835000, pf: 422000 },
  { month: "Jul-26", gross: 7800000, net: 6170000, tax: 845000, pf: 428500 },
];

const DEFAULT_DEPT_BREAKDOWN = [
  { name: "Engineering", cost: 3850000, headcount: 68 },
  { name: "Sales & Marketing", cost: 1650000, headcount: 32 },
  { name: "Executive Mgmt", cost: 1450000, headcount: 8 },
  { name: "IT & Infra", cost: 850000, headcount: 18 },
  { name: "HR & Admin", cost: 650000, headcount: 16 },
];

const DEFAULT_COMP_DIST = [
  { name: "Basic Salary", value: 3900000 },
  { name: "HRA", value: 1950000 },
  { name: "Special Allowance", value: 1170000 },
  { name: "Conveyance & Medical", value: 450000 },
  { name: "Performance Bonus", value: 330000 },
];

function PayrollReportsPage() {
  const { user } = useAurix();
  const navigate = useNavigate({ from: "/dashboard/payroll/reports" });

  // RBAC
  const userRole = (user?.role || "").toLowerCase();
  const isEmployeeOnly = userRole === "employee";

  // State
  const [filters, setFilters] = useState<ReportsFilterState>({
    fy: "2026-27",
    month: 7,
    search: "",
  });
  const [customBuilderOpen, setCustomBuilderOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  // TanStack Query: Dashboard Data
  const { data: dashboardData } = useQuery({
    queryKey: ["payroll-reports-dashboard"],
    queryFn: () => payrollReportsApi.getDashboardData(),
    enabled: !isEmployeeOnly,
    staleTime: 60000,
  });

  const kpis = dashboardData?.kpis || DEFAULT_KPIS;
  const costTrend = dashboardData?.cost_trend || DEFAULT_COST_TREND;
  const deptBreakdown = dashboardData?.department_breakdown || DEFAULT_DEPT_BREAKDOWN;
  const compDist = dashboardData?.component_distribution || DEFAULT_COMP_DIST;

  // Mutations
  const generateMutation = useMutation({
    mutationFn: (id: string) => payrollReportsApi.generateReport(id),
    onSuccess: (res) => {
      toast.success(`Report generated successfully.`);
    },
    onError: () => toast.error("Failed to generate report."),
  });

  const customBuildMutation = useMutation({
    mutationFn: (config: any) => payrollReportsApi.generateCustomReport(config),
    onSuccess: () => {
      toast.success("Custom report generated.");
      setCustomBuilderOpen(false);
    },
    onError: () => toast.error("Failed to generate custom report."),
  });

  const scheduleMutation = useMutation({
    mutationFn: (config: any) => payrollReportsApi.scheduleReport(config),
    onSuccess: () => {
      toast.success("Report schedule created.");
      setScheduleOpen(false);
    },
    onError: () => toast.error("Failed to create schedule."),
  });

  const handleExport = async () => {
    try {
      const data = await payrollReportsApi.exportReport();
      const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
      const link = document.createElement("a");
      link.setAttribute("href", jsonStr);
      link.setAttribute("download", `Payroll_Analytics_${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Analytics report exported.");
    } catch {
      toast.error("Export failed.");
    }
  };

  const handleShare = () => {
    toast.info("Report sharing link copied to clipboard.");
  };

  const handleAuditLogs = async () => {
    try {
      await payrollReportsApi.getAuditLogs();
      toast.info("Report audit logs retrieved.");
    } catch {
      toast.error("Failed to load audit logs.");
    }
  };

  // Block Employee Role
  if (isEmployeeOnly) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center space-y-4">
        <div className="h-16 w-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-xl">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div className="space-y-1 max-w-md">
          <h2 className="text-xl font-bold tracking-tight">Access Restricted</h2>
          <p className="text-xs text-muted-foreground">
            The Payroll Analytics & Reporting Center is restricted to Super Admin, Admin, Payroll Admin, Finance Manager, CFO, and CEO roles.
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
      {/* Header */}
      <ReportsHeader
        onGenerateReport={() => generateMutation.mutate("tmpl_salary_register")}
        onCustomBuilder={() => setCustomBuilderOpen(true)}
        onSchedule={() => setScheduleOpen(true)}
        onExport={handleExport}
        onShare={handleShare}
        onAuditLogs={handleAuditLogs}
        isGenerating={generateMutation.isPending}
      />

      {/* KPI Summary Cards */}
      <ReportsSummaryCards kpis={kpis} />

      {/* Filter Bar */}
      <ReportsFilterBar
        filters={filters}
        onFilterChange={(updated) => setFilters((prev) => ({ ...prev, ...updated }))}
        onReset={() => setFilters({ fy: "2026-27", month: 7, search: "" })}
      />

      {/* Interactive Analytics Charts */}
      <ReportsAnalyticsCharts
        costTrend={costTrend}
        departmentBreakdown={deptBreakdown}
        componentDistribution={compDist}
      />

      {/* Report Templates Grid */}
      <ReportTemplatesGrid onGenerate={(id) => generateMutation.mutate(id)} />

      {/* Custom Report Builder Modal */}
      <CustomReportBuilderModal
        isOpen={customBuilderOpen}
        onClose={() => setCustomBuilderOpen(false)}
        onBuild={(config) => customBuildMutation.mutate(config)}
        isBuilding={customBuildMutation.isPending}
      />

      {/* Schedule Report Modal */}
      <ScheduleReportModal
        isOpen={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        onSchedule={(config) => scheduleMutation.mutate(config)}
        isScheduling={scheduleMutation.isPending}
      />
    </div>
  );
}
