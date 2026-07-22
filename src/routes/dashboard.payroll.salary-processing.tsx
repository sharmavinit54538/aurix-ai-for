import React, { useState, useMemo } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
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

export const Route = createFileRoute("/dashboard/payroll/salary-processing")({
  head: () => ({ meta: [{ title: "Salary Processing Command Center — Aurix AI" }] }),
  component: SalaryProcessingPage,
});

// Mock Initial Salary Processing Dataset
const MOCK_SALARY_DATA: EmployeeSalaryDetail[] = [
  {
    id: "sp-1",
    employeeCode: "EMP-101",
    name: "Vikramaditya Roy",
    designation: "Principal Architect",
    department: "Engineering",
    location: "Hyderabad",
    ctc: 3600000,
    grossSalary: 300000,
    basic: 150000,
    hra: 75000,
    specialAllowance: 60000,
    otherAllowances: 15000,
    bonus: 25000,
    overtimePay: 12000,
    pfDeduction: 18000,
    esiDeduction: 0,
    ptDeduction: 200,
    tdsDeduction: 42000,
    otherDeductions: 0,
    totalDeductions: 60200,
    netSalary: 276800,
    workingDays: 22,
    paidDays: 22,
    lopDays: 0,
    overtimeHours: 16,
    prevMonthNet: 265000,
    bankName: "HDFC Bank",
    accountNumber: "50100239481029",
    ifscCode: "HDFC0000240",
    panNumber: "ABCDE1234F",
    status: "VALIDATED",
  },
  {
    id: "sp-2",
    employeeCode: "EMP-104",
    name: "Rahul Sharma",
    designation: "Senior DevOps Lead",
    department: "Engineering",
    location: "Bangalore",
    ctc: 2400000,
    grossSalary: 200000,
    basic: 100000,
    hra: 50000,
    specialAllowance: 40000,
    otherAllowances: 10000,
    bonus: 15000,
    overtimePay: 18000,
    pfDeduction: 12000,
    esiDeduction: 0,
    ptDeduction: 200,
    tdsDeduction: 28000,
    otherDeductions: 0,
    totalDeductions: 40200,
    netSalary: 192800,
    workingDays: 22,
    paidDays: 22,
    lopDays: 0,
    overtimeHours: 24,
    prevMonthNet: 185000,
    bankName: "ICICI Bank",
    accountNumber: "00040158932011",
    ifscCode: "ICIC0000004",
    panNumber: "BCDEF2345G",
    status: "CALCULATED",
  },
  {
    id: "sp-3",
    employeeCode: "EMP-189",
    name: "Priya Verma",
    designation: "Lead UI/UX Designer",
    department: "Design",
    location: "Mumbai",
    ctc: 2100000,
    grossSalary: 175000,
    basic: 87500,
    hra: 43750,
    specialAllowance: 35000,
    otherAllowances: 8750,
    bonus: 10000,
    overtimePay: 0,
    pfDeduction: 10500,
    esiDeduction: 0,
    ptDeduction: 200,
    tdsDeduction: 22000,
    otherDeductions: 0,
    totalDeductions: 32700,
    netSalary: 152300,
    workingDays: 22,
    paidDays: 22,
    lopDays: 0,
    overtimeHours: 0,
    prevMonthNet: 152300,
    bankName: "Axis Bank",
    accountNumber: "91802004819203",
    ifscCode: "UTIB0000129",
    panNumber: "CDEFG3456H",
    status: "HOLD",
  },
  {
    id: "sp-4",
    employeeCode: "EMP-072",
    name: "Karan Patel",
    designation: "VP of Enterprise Sales",
    department: "Sales",
    location: "Delhi NCR",
    ctc: 4500000,
    grossSalary: 375000,
    basic: 187500,
    hra: 93750,
    specialAllowance: 75000,
    otherAllowances: 18750,
    bonus: 50000,
    overtimePay: 0,
    pfDeduction: 15000,
    esiDeduction: 0,
    ptDeduction: 200,
    tdsDeduction: 68000,
    otherDeductions: 0,
    totalDeductions: 83200,
    netSalary: 341800,
    workingDays: 22,
    paidDays: 19,
    lopDays: 3,
    overtimeHours: 0,
    prevMonthNet: 360000,
    bankName: "Kotak Bank",
    accountNumber: "20194810294819",
    ifscCode: "KKBK0000451",
    panNumber: "DEFGH4567I",
    status: "VALIDATED",
  },
  {
    id: "sp-5",
    employeeCode: "EMP-215",
    name: "Ananya Roy",
    designation: "Senior Product Manager",
    department: "Product",
    location: "Bangalore",
    ctc: 2800000,
    grossSalary: 233333,
    basic: 116666,
    hra: 58333,
    specialAllowance: 46667,
    otherAllowances: 11667,
    bonus: 20000,
    overtimePay: 0,
    pfDeduction: 14000,
    esiDeduction: 0,
    ptDeduction: 200,
    tdsDeduction: 34000,
    otherDeductions: 0,
    totalDeductions: 48200,
    netSalary: 205133,
    workingDays: 22,
    paidDays: 22,
    lopDays: 0,
    overtimeHours: 0,
    prevMonthNet: 200000,
    bankName: "HDFC Bank",
    accountNumber: "50100492810293",
    ifscCode: "HDFC0000240",
    panNumber: "EFGHI5678J",
    status: "CALCULATED",
  },
  {
    id: "sp-6",
    employeeCode: "EMP-308",
    name: "Siddharth Malhotra",
    designation: "Operations Lead",
    department: "Operations",
    location: "Pune",
    ctc: 1500000,
    grossSalary: 125000,
    basic: 62500,
    hra: 31250,
    specialAllowance: 25000,
    otherAllowances: 6250,
    bonus: 5000,
    overtimePay: 4000,
    pfDeduction: 7500,
    esiDeduction: 0,
    ptDeduction: 200,
    tdsDeduction: 12000,
    otherDeductions: 0,
    totalDeductions: 19700,
    netSalary: 114300,
    workingDays: 22,
    paidDays: 22,
    lopDays: 0,
    overtimeHours: 8,
    prevMonthNet: 110000,
    bankName: "SBI",
    accountNumber: "301948201948",
    ifscCode: "SBIN0001820",
    panNumber: "FGHIJ6789K",
    status: "VALIDATED",
  },
  {
    id: "sp-7",
    employeeCode: "EMP-412",
    name: "Meera Krishnan",
    designation: "Frontend Engineer",
    department: "Engineering",
    location: "Chennai",
    ctc: 1800000,
    grossSalary: 150000,
    basic: 75000,
    hra: 37500,
    specialAllowance: 30000,
    otherAllowances: 7500,
    bonus: 8000,
    overtimePay: 6000,
    pfDeduction: 9000,
    esiDeduction: 0,
    ptDeduction: 200,
    tdsDeduction: 16000,
    otherDeductions: 0,
    totalDeductions: 25200,
    netSalary: 138800,
    workingDays: 22,
    paidDays: 22,
    lopDays: 0,
    overtimeHours: 10,
    prevMonthNet: 135000,
    bankName: "ICICI Bank",
    accountNumber: "00040194820192",
    ifscCode: "ICIC0000004",
    panNumber: "GHIJK7890L",
    status: "CALCULATED",
  },
  {
    id: "sp-8",
    employeeCode: "EMP-501",
    name: "Aditya Nair",
    designation: "Account Executive",
    department: "Sales",
    location: "Mumbai",
    ctc: 1400000,
    grossSalary: 116666,
    basic: 58333,
    hra: 29166,
    specialAllowance: 23333,
    otherAllowances: 5834,
    bonus: 12000,
    overtimePay: 0,
    pfDeduction: 7000,
    esiDeduction: 0,
    ptDeduction: 200,
    tdsDeduction: 9500,
    otherDeductions: 0,
    totalDeductions: 16700,
    netSalary: 111966,
    workingDays: 22,
    paidDays: 22,
    lopDays: 0,
    overtimeHours: 0,
    prevMonthNet: 105000,
    bankName: "Axis Bank",
    accountNumber: "91802005928102",
    ifscCode: "UTIB0000129",
    panNumber: "HIJKL8901M",
    status: "VALIDATED",
  },
];

function SalaryProcessingPage() {
  const navigate = useNavigate();

  // Active Stage State
  const [currentStage, setCurrentStage] = useState<PayrollStageId>("finance_review");
  const [isProcessing, setIsProcessing] = useState(false);

  // Selected Employees State for Bulk Actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeSalaryDetail | null>(null);

  // Table Data State
  const [salaryData, setSalaryData] = useState<EmployeeSalaryDetail[]>(MOCK_SALARY_DATA);

  // Computed Totals
  const totalCost = salaryData.reduce((acc, emp) => acc + emp.grossSalary, 0) * 14.2; // Extrapolated to org total
  const netPayrollTotal = salaryData.reduce((acc, emp) => acc + emp.netSalary, 0) * 13.1;
  const employerCostTotal = totalCost - netPayrollTotal;

  const totalSelectedCost = useMemo(() => {
    return salaryData
      .filter((emp) => selectedIds.includes(emp.id))
      .reduce((acc, emp) => acc + emp.netSalary, 0);
  }, [salaryData, selectedIds]);

  // Handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === salaryData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(salaryData.map((d) => d.id));
    }
  };

  const handleRunPayroll = () => {
    setIsProcessing(true);
    toast.info("Executing automated salary recalculations...");
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStage("finance_review");
      toast.success("July 2026 Payroll Calculation complete with 99.8% accuracy.");
    }, 1500);
  };

  const handleApprovePayroll = () => {
    toast.success("Finance sign-off recorded. Escalating to CFO for final lock.");
    setCurrentStage("approval");
  };

  const handleRollback = () => {
    toast.warning("Payroll calculations rolled back to Draft state.");
    setCurrentStage("draft");
  };

  const handleRecalculateRow = (id: string) => {
    toast.success("Recalculated salary components for selected employee.");
  };

  return (
    <div className="sp-command-center min-h-screen bg-[#070b17] text-slate-100 p-4 lg:p-6 space-y-6 pb-28">
      {/* 1. Header & Actions */}
      <SalaryProcessingHeader
        currentCycle="July 2026"
        payrollStatus="FINANCE REVIEW"
        financialYear="FY 2026-27"
        onRunPayroll={handleRunPayroll}
        onPreviewPayroll={() => toast.info("Opening full draft payroll preview report...")}
        onApprovePayroll={handleApprovePayroll}
        onRollbackPayroll={handleRollback}
        onGeneratePayslips={() => toast.success("Queued 248 payslips for automated PDF generation.")}
        onInitiateBankTransfer={() => toast.info("Generated HDFC Corporate NEFT advice batch file.")}
        onExport={() => toast.success("Exported July 2026 Payroll Summary (XLSX).")}
        onOpenAuditLogs={() => toast.info("Opening immutable audit log viewer...")}
        onBack={() => navigate({ to: "/dashboard/payroll" })}
        isProcessing={isProcessing}
      />

      {/* 2. Hero Card for Current Run */}
      <CurrentCycleHeroCard
        month="July"
        year={2026}
        status="In Calculation & Audit Review"
        progressPercent={88}
        totalEmployees={248}
        pendingEmployees={12}
        totalCost={4280000}
        expectedPaymentDate="31st July 2026"
        approvalStage="Finance Review"
      />

      {/* 3. Payroll Health KPI Dashboard */}
      <PayrollHealthKPIs
        accuracy={99.8}
        completedPercent={88}
        pendingCount={12}
        errorCount={2}
        warningCount={5}
        blockedCount={1}
        salaryVariance="+2.4%"
        netPayroll={3620000}
        employerCost={660000}
      />

      {/* 4. Processing Lifecycle Stepper */}
      <ProcessingTimeline
        currentStageId={currentStage}
        onSelectStage={(id) => setCurrentStage(id)}
      />

      {/* 5. Executive Approval Workflow Tracker */}
      <ApprovalWorkflowTracker />

      {/* 6. AI Insights & Anomaly Detector */}
      <AIPayrollInsights
        onActionClick={(item) => toast.info(`Investigating ${item.title}...`)}
      />

      {/* 7. Exception Validation Panel */}
      <ValidationPanel
        onResolve={(id) => {
          toast.success(`Resolved validation exception item.`);
        }}
        onRunAutoFix={() => {
          toast.success("Auto-reconciled attendance & tax exemption records.");
        }}
      />

      {/* 8. Financial Recharts Analytics */}
      <SalaryProcessingAnalytics />

      {/* 9. Enterprise Data Grid Table */}
      <SalaryProcessingTable
        data={salaryData}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onToggleSelectAll={handleToggleSelectAll}
        onViewDetail={(emp) => setSelectedEmployee(emp)}
        onRecalculateRow={handleRecalculateRow}
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
        onProcessSelected={() => {
          toast.success(`Processing payout for ${selectedIds.length} selected employees.`);
          setSelectedIds([]);
        }}
        onApproveSelected={() => {
          toast.success(`Approved salary runs for ${selectedIds.length} selected employees.`);
          setSelectedIds([]);
        }}
        onRecalculateSelected={() => {
          toast.info(`Recalculating batch of ${selectedIds.length} employees...`);
        }}
        onClearSelection={() => setSelectedIds([])}
      />
    </div>
  );
}
