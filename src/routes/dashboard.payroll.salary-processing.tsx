import React, { useState, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import "@/features/admin/payroll/components/salary-processing/salary-processing.css";

import { SalaryProcessingHeader } from "@/features/admin/payroll/components/salary-processing/SalaryProcessingHeader";
import { CurrentCycleHeroCard } from "@/features/admin/payroll/components/salary-processing/CurrentCycleHeroCard";
import { PayrollHealthKPIs } from "@/features/admin/payroll/components/salary-processing/PayrollHealthKPIs";
import {
  ProcessingTimeline,
  PayrollStageId,
} from "@/features/admin/payroll/components/salary-processing/ProcessingTimeline";
import { ApprovalWorkflowTracker } from "@/features/admin/payroll/components/salary-processing/ApprovalWorkflowTracker";
import { AIPayrollInsights } from "@/features/admin/payroll/components/salary-processing/AIPayrollInsights";
import { ValidationPanel } from "@/features/admin/payroll/components/salary-processing/ValidationPanel";
import { SalaryProcessingAnalytics } from "@/features/admin/payroll/components/salary-processing/SalaryProcessingAnalytics";
import {
  SalaryDetailDrawer,
  EmployeeSalaryDetail,
} from "@/features/admin/payroll/components/salary-processing/SalaryDetailDrawer";
import { SalaryProcessingTable } from "@/features/admin/payroll/components/salary-processing/SalaryProcessingTable";
import { SalaryProcessingSaveBar } from "@/features/admin/payroll/components/salary-processing/SalaryProcessingSaveBar";
import { salaryProcessingApi } from "@/services/salaryProcessingApi";

export const Route = createFileRoute("/dashboard/payroll/salary-processing")({
  head: () => ({ meta: [{ title: "Salary Processing Command Center — Aurix AI" }] }),
  component: SalaryProcessingPage,
});

function SalaryProcessingPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Active Stage State
  const [currentStage, setCurrentStage] = useState<PayrollStageId>("finance_review");

  // Selection States
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeSalaryDetail | null>(null);

  // ── 1. Real API Queries ──
  const { data: salaryData = [], isLoading: isLoadingSalaryData } = useQuery({
    queryKey: ["salaryProcessingRecords"],
    queryFn: () => salaryProcessingApi.getSalaryRecords(),
  });

  const salaryRecords = Array.isArray(salaryData) ? salaryData : [];
  const { data: heroMetrics } = useQuery({
    queryKey: ["salaryHeroMetrics"],
    queryFn: () => salaryProcessingApi.getHeroMetrics(),
  });

  const { data: healthKPIs } = useQuery({
    queryKey: ["salaryHealthKPIs"],
    queryFn: () => salaryProcessingApi.getHealthKPIs(),
  });

  const { data: approvalWorkflow = [] } = useQuery({
    queryKey: ["approvalWorkflow"],
    queryFn: () => salaryProcessingApi.getApprovalWorkflow(),
  });

  const { data: aiInsights = [] } = useQuery({
    queryKey: ["aiPayrollInsights"],
    queryFn: () => salaryProcessingApi.getAIPayrollInsights(),
  });

  const { data: validationExceptions = [] } = useQuery({
    queryKey: ["validationExceptions"],
    queryFn: () => salaryProcessingApi.getValidationExceptions(),
  });

  const { data: analyticsData } = useQuery({
    queryKey: ["salaryAnalyticsData"],
    queryFn: () => salaryProcessingApi.getAnalyticsData(),
  });

  // ── 2. Real API Mutations ──
  const runMutation = useMutation({
    mutationFn: () => salaryProcessingApi.runCalculation(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salaryProcessingRecords"] });
      queryClient.invalidateQueries({ queryKey: ["salaryHeroMetrics"] });
      queryClient.invalidateQueries({ queryKey: ["salaryHealthKPIs"] });
      setCurrentStage("finance_review");
      toast.success("July 2026 Payroll Calculation complete with statutory accuracy.");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to execute salary calculation.");
    },
  });

  const approveMutation = useMutation({
    mutationFn: () => salaryProcessingApi.approveCycle(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["approvalWorkflow"] });
      queryClient.invalidateQueries({ queryKey: ["salaryHeroMetrics"] });
      setCurrentStage("approval");
      toast.success("Finance sign-off recorded. Escalating to CFO for final lock.");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to approve payroll cycle.");
    },
  });

  const rollbackMutation = useMutation({
    mutationFn: () => salaryProcessingApi.rollbackCycle(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salaryProcessingRecords"] });
      setCurrentStage("draft");
      toast.warning("Payroll calculations rolled back to Draft state.");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to rollback payroll cycle.");
    },
  });

  const recalculateRowMutation = useMutation({
    mutationFn: (id: string) => salaryProcessingApi.recalculateRow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salaryProcessingRecords"] });
      toast.success("Recalculated salary components for selected employee.");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to recalculate employee salary.");
    },
  });

  const resolveExceptionMutation = useMutation({
    mutationFn: (id: string) => salaryProcessingApi.resolveException(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["validationExceptions"] });
      toast.success("Resolved validation exception item.");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to resolve exception.");
    },
  });

  const autoFixMutation = useMutation({
    mutationFn: () => salaryProcessingApi.autoFixExceptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["validationExceptions"] });
      queryClient.invalidateQueries({ queryKey: ["salaryProcessingRecords"] });
      toast.success("Auto-reconciled attendance & tax exemption records.");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to auto-fix exceptions.");
    },
  });

  const batchPayoutMutation = useMutation({
    mutationFn: (ids: string[]) => salaryProcessingApi.processBatchPayout(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salaryProcessingRecords"] });
      toast.success(`Processing payout for ${selectedIds.length} selected employees.`);
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed batch payout process.");
    },
  });

  const batchApproveMutation = useMutation({
    mutationFn: (ids: string[]) => salaryProcessingApi.approveBatchSalary(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salaryProcessingRecords"] });
      toast.success(`Approved salary runs for ${selectedIds.length} selected employees.`);
      setSelectedIds([]);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed batch approval.");
    },
  });

  const batchRecalculateMutation = useMutation({
    mutationFn: (ids: string[]) => salaryProcessingApi.recalculateBatch(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salaryProcessingRecords"] });
      toast.info(`Recalculated batch of ${selectedIds.length} employees.`);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed batch recalculation.");
    },
  });

  // Computed Totals for Selection Bar
  const totalSelectedCost = useMemo(() => {
    return salaryRecords
      .filter((emp) => selectedIds.includes(emp.id))
      .reduce((acc, emp) => acc + emp.netSalary, 0);
  }, [salaryRecords, selectedIds]);

  // Handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === salaryRecords.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(salaryRecords.map((d) => d.id));
    }
  };

  return (
    <div className="sp-command-center min-h-screen bg-[#070b17] text-slate-100 p-4 lg:p-6 space-y-6 pb-28">
      {/* 1. Header & Actions */}
      <SalaryProcessingHeader
        currentCycle={heroMetrics?.month ? `${heroMetrics.month} ${heroMetrics.year}` : "July 2026"}
        payrollStatus={heroMetrics?.approvalStage ? heroMetrics.approvalStage.toUpperCase() : "FINANCE REVIEW"}
        financialYear={`FY ${heroMetrics?.year || 2026}-${(heroMetrics?.year || 2026) + 1 - 2000}`}
        onRunPayroll={() => runMutation.mutate()}
        onPreviewPayroll={() => toast.info("Opening draft payroll preview report...")}
        onApprovePayroll={() => approveMutation.mutate()}
        onRollbackPayroll={() => rollbackMutation.mutate()}
        onGeneratePayslips={() => {
          salaryProcessingApi.generatePayslips();
          toast.success("Queued payslips for automated PDF generation.");
        }}
        onInitiateBankTransfer={() => {
          salaryProcessingApi.initiateBankTransferBatch();
          toast.info("Generated bank transfer advice batch file.");
        }}
        onExport={() => {
          salaryProcessingApi.exportPayrollSummary();
          toast.success("Exported Payroll Summary (XLSX).");
        }}
        onOpenAuditLogs={() => toast.info("Opening audit log viewer...")}
        onBack={() => navigate({ to: "/dashboard/payroll" })}
        isProcessing={runMutation.isPending}
      />

      {/* 2. Hero Card for Current Run */}
      <CurrentCycleHeroCard
        month={heroMetrics?.month || "July"}
        year={heroMetrics?.year || 2026}
        status={heroMetrics?.status || "In Calculation & Audit Review"}
        progressPercent={heroMetrics?.progressPercent || 0}
        totalEmployees={heroMetrics?.totalEmployees || 0}
        pendingEmployees={heroMetrics?.pendingEmployees || 0}
        totalCost={heroMetrics?.totalCost || 0}
        expectedPaymentDate={heroMetrics?.expectedPaymentDate || "31st July 2026"}
        approvalStage={heroMetrics?.approvalStage || "Finance Review"}
      />

      {/* 3. Payroll Health KPI Dashboard */}
      <PayrollHealthKPIs
        accuracy={healthKPIs?.accuracy || 0}
        completedPercent={healthKPIs?.completedPercent || 0}
        pendingCount={healthKPIs?.pendingCount || 0}
        errorCount={healthKPIs?.errorCount || 0}
        warningCount={healthKPIs?.warningCount || 0}
        blockedCount={healthKPIs?.blockedCount || 0}
        salaryVariance={healthKPIs?.salaryVariance || "0%"}
        netPayroll={healthKPIs?.netPayroll || 0}
        employerCost={healthKPIs?.employerCost || 0}
      />

      {/* 4. Processing Lifecycle Stepper */}
      <ProcessingTimeline
        currentStageId={currentStage}
        onSelectStage={(id) => setCurrentStage(id)}
      />

      {/* 5. Executive Approval Workflow Tracker */}
      <ApprovalWorkflowTracker workflow={approvalWorkflow} />

      {/* 6. AI Insights & Anomaly Detector */}
      <AIPayrollInsights
        insights={aiInsights}
        onActionClick={(item) => toast.info(`Investigating ${item.title}...`)}
      />

      {/* 7. Exception Validation Panel */}
      <ValidationPanel
        errors={validationExceptions}
        onResolve={(id) => resolveExceptionMutation.mutate(id)}
        onRunAutoFix={() => autoFixMutation.mutate()}
      />

      {/* 8. Financial Recharts Analytics */}
      <SalaryProcessingAnalytics analyticsData={analyticsData} />

      {/* 9. Enterprise Data Grid Table */}
      <SalaryProcessingTable
        data={salaryRecords}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
        onViewDetail={(emp) => setSelectedEmployee(emp)}
        onRecalculateRow={(id) => recalculateRowMutation.mutate(id)}
      />

      {/* 10. Detail Drawer Side Panel */}
      <SalaryDetailDrawer
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        employee={selectedEmployee}
      />

      {/* 11. Floating Sticky Bottom Bar for Selection */}
      <SalaryProcessingSaveBar
        selectedCount={selectedIds.length}
        totalSelectedCost={totalSelectedCost}
        onProcessSelected={() => batchPayoutMutation.mutate(selectedIds)}
        onApproveSelected={() => batchApproveMutation.mutate(selectedIds)}
        onRecalculateSelected={() => batchRecalculateMutation.mutate(selectedIds)}
        onClearSelection={() => setSelectedIds([])}
      />
    </div>
  );
}
