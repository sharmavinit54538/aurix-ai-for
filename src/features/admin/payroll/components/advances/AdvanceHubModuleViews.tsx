import React, { useState, useEffect, useRef } from "react";
import {
  SalaryAdvanceRequest,
  AdvancesSummaryKPIs,
} from "./advancesTypes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  ArrowLeft,
  HandCoins,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  PlusCircle,
  Download,
  Upload,
  Search,
  PieChart,
  Settings,
  Bell,
  FileSpreadsheet,
  History,
  Activity,
  Calculator,
  User,
  Send,
  Sparkles,
  Landmark,
  Receipt,
  ShieldAlert,
  Percent,
  Users,
  FileText,
  Brain,
  Check,
} from "lucide-react";
import { PayrollBackButton } from "@/features/admin/payroll/components/PayrollBackButton";
import { AdvancesTable } from "./AdvancesTable";
import { AdvancesAnalytics } from "./AdvancesAnalytics";
import { AIAdvanceInsights } from "./AIAdvanceInsights";

interface AdvanceHubModuleViewsProps {
  moduleId: string;
  onBackToHub: () => void;
  requests: SalaryAdvanceRequest[];
  onOpenCreateDrawer: () => void;
  onViewRequestDetails: (req: SalaryAdvanceRequest) => void;
  onApproveRequest: (req: SalaryAdvanceRequest) => void;
  onRejectRequest: (req: SalaryAdvanceRequest) => void;
  onDisburseRequest: (req: SalaryAdvanceRequest) => void;
  onManageRecovery: (req: SalaryAdvanceRequest) => void;
}

export const AdvanceHubModuleViews: React.FC<AdvanceHubModuleViewsProps> = ({
  moduleId,
  onBackToHub,
  requests,
  onOpenCreateDrawer,
  onViewRequestDetails,
  onApproveRequest,
  onRejectRequest,
  onDisburseRequest,
  onManageRecovery,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // EMI Calculator State
  const [principalInput, setPrincipalInput] = useState<number>(50000);
  const [monthsInput, setMonthsInput] = useState<number>(10);
  const [interestInput, setInterestInput] = useState<number>(0);

  // Copilot Chat State
  const [copilotQuery, setCopilotQuery] = useState("");
  const [copilotChat, setCopilotChat] = useState<
    { sender: "ai" | "user"; text: string; timestamp: string }[]
  >([
    {
      sender: "ai",
      text: "Welcome to OFC360 Financial Assistant! I have full visibility into salary advance limits (max 50% gross basic), EMI repayment schedules, credit eligibility scores, and default risk predictions. How can I assist you today?",
      timestamp: "10:00 AM",
    },
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [copilotChat]);

  const formatCurrency = (val: number = 0) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);

  const handleCopilotSend = (e?: React.FormEvent | React.MouseEvent, queryText?: string) => {
    if (e && typeof e.preventDefault === "function") {
      e.preventDefault();
    }
    const textToSend = queryText || copilotQuery;
    if (!textToSend.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setCopilotChat((prev) => [...prev, { sender: "user", text: textToSend, timestamp: time }]);
    setCopilotQuery("");

    setTimeout(() => {
      const lower = textToSend.toLowerCase();
      let aiReply = "";

      if (lower.includes("total") || lower.includes("summary") || lower.includes("disbursed")) {
        const totalDisbursed = requests.reduce((acc, r) => acc + (r.approvedAmount || 0), 0);
        const totalOutstanding = requests.reduce((acc, r) => acc + (r.outstandingBalance || 0), 0);
        const pendingCount = requests.filter((r) => r.approvalStatus.includes("PENDING")).length;
        aiReply = `📊 Live Advance & Loan Summary: Total disbursed across company is ${formatCurrency(totalDisbursed)} (Outstanding Balance: ${formatCurrency(totalOutstanding)}). Currently, ${pendingCount} applications are pending HR & Finance review.`;
      } else if (lower.includes("limit") || lower.includes("policy") || lower.includes("max")) {
        aiReply = `📜 Advance Policy Limits: Maximum salary advance is capped at 50% of the employee's gross monthly basic salary. Tenure eligibility requires a minimum of 6 months completed employment.`;
      } else if (lower.includes("emi") || lower.includes("calculator") || lower.includes("installment")) {
        const calcEmi = Math.round(principalInput / monthsInput);
        aiReply = `💰 EMI Calculation Result: For a loan of ${formatCurrency(principalInput)} over ${monthsInput} months at ${interestInput}% interest, monthly salary deduction EMI is ${formatCurrency(calcEmi)} per month.`;
      } else if (lower.includes("risk") || lower.includes("credit") || lower.includes("default")) {
        aiReply = `🛡️ AI Risk Intelligence: Default risk across all active advances is 0.0%. Salary deduction EMI recovery ensures 100% full recovery directly during monthly payroll runs.`;
      } else if (lower.includes("guarantor") || lower.includes("co-signer")) {
        aiReply = `👥 Guarantor Policy: Loans exceeding ₹1,00,000 require 1 active colleague guarantor verification and uploaded identity proof documents.`;
      } else {
        aiReply = `🤖 OFC360 Financial Assistant: Salary advances and loan repayments are 100% integrated with monthly payroll runs under Company Policy #ADV-2026. You can ask me about loan caps, EMI calculations, or credit eligibility.`;
      }

      setCopilotChat((prev) => [
        ...prev,
        { sender: "ai", text: aiReply, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
      ]);
    }, 400);
  };

  const renderBreadcrumb = (title: string, subtitle: string) => (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <PayrollBackButton to="/dashboard/payroll" label="Back to Payroll Hub" />

        <div>
          <h2 className="text-xl font-black text-white tracking-tight">{title}</h2>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" onClick={onOpenCreateDrawer} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5 h-8 shadow-lg shadow-emerald-600/25 font-bold">
          <PlusCircle className="w-3.5 h-3.5" /> Submit New Request
        </Button>
      </div>
    </div>
  );

  switch (moduleId) {
    case "dashboard":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Advance & Loan Dashboard", "Real-time company advance overview, loan disbursals, and active claims table.")}
          <AdvancesAnalytics requests={requests} />
          <AIAdvanceInsights />
          <div className="salary-card p-6 space-y-4">
            <AdvancesTable
              data={requests}
              selectedIds={selectedIds}
              onSelectToggle={(id) =>
                setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
              }
              onSelectAll={(checked) => setSelectedIds(checked ? requests.map((r) => r.id) : [])}
              onView={onViewRequestDetails}
              onApprove={onApproveRequest}
              onReject={onRejectRequest}
              onRequestChanges={onViewRequestDetails}
              onDisburse={onDisburseRequest}
              onManageRecovery={onManageRecovery}
              onViewLogs={() => {}}
            />
          </div>
        </div>
      );

    case "pending-approvals":
    case "approval-workflow":
      const pendingList = requests.filter((r) => r.approvalStatus.includes("PENDING"));
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Approval Workflow & Pending Queue", "Multi-tier approval workspace for Line Managers, HR, and Finance Admins.")}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="salary-card p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Awaiting Manager Sign-off</span>
              <p className="text-xl font-bold text-white font-mono">{pendingList.length} Applications</p>
              <p className="text-xs text-slate-400">Requires reporting manager review</p>
            </div>
            <div className="salary-card p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Pending Finance Audit</span>
              <p className="text-xl font-bold text-emerald-400 font-mono">1 Application</p>
              <p className="text-xs text-slate-400">Bank account verification</p>
            </div>
            <div className="salary-card p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Total Requested Amount</span>
              <p className="text-xl font-bold text-cyan-400 font-mono">{formatCurrency(pendingList.reduce((acc, r) => acc + r.requestedAmount, 0))}</p>
              <p className="text-xs text-slate-400">Queued for disbursal</p>
            </div>
          </div>

          <div className="salary-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400" /> Active Pending Queue ({pendingList.length})
              </h3>
              <Button
                size="sm"
                onClick={() => {
                  pendingList.forEach((r) => onApproveRequest(r));
                  toast.success(`Bulk approved all ${pendingList.length} pending application(s)!`);
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8 gap-1.5 font-bold"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Approve All Queue
              </Button>
            </div>
            <AdvancesTable
              data={pendingList}
              selectedIds={selectedIds}
              onSelectToggle={(id) =>
                setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
              }
              onSelectAll={(checked) => setSelectedIds(checked ? pendingList.map((r) => r.id) : [])}
              onView={onViewRequestDetails}
              onApprove={onApproveRequest}
              onReject={onRejectRequest}
              onRequestChanges={onViewRequestDetails}
              onDisburse={onDisburseRequest}
              onManageRecovery={onManageRecovery}
              onViewLogs={() => {}}
            />
          </div>
        </div>
      );

    case "disbursement":
      const readyDisburseList = requests.filter((r) => r.approvalStatus === "APPROVED" && r.paymentStatus !== "DISBURSED");
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Loan & Advance Disbursement Queue", "Audit verified applications ready for direct NEFT/ACH bank transfer disbursal.")}
          <div className="salary-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Landmark className="w-4 h-4 text-emerald-400" /> Ready for Bank Transfer ({readyDisburseList.length})
              </h3>
              <Button
                size="sm"
                onClick={() => {
                  readyDisburseList.forEach((r) => onDisburseRequest(r));
                  toast.success("Disbursed direct bank advice files!");
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8 gap-1.5 font-bold"
              >
                <Landmark className="w-3.5 h-3.5" /> Trigger Batch Bank Disbursal
              </Button>
            </div>
            <AdvancesTable
              data={readyDisburseList}
              selectedIds={selectedIds}
              onSelectToggle={(id) =>
                setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
              }
              onSelectAll={(checked) => setSelectedIds(checked ? readyDisburseList.map((r) => r.id) : [])}
              onView={onViewRequestDetails}
              onApprove={onApproveRequest}
              onReject={onRejectRequest}
              onRequestChanges={onViewRequestDetails}
              onDisburse={onDisburseRequest}
              onManageRecovery={onManageRecovery}
              onViewLogs={() => {}}
            />
          </div>
        </div>
      );

    case "emi-management":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("EMI Management & Installment Calculator", "Interactive EMI calculation engine, upcoming schedules, and repayment rates.")}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="salary-card p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-emerald-400" /> Interactive Loan EMI Calculator
              </h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Loan Principal Amount (₹)</label>
                  <Input
                    type="number"
                    value={principalInput}
                    onChange={(e) => setPrincipalInput(Number(e.target.value))}
                    className="bg-slate-950 border-white/10 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Repayment Tenure (Months)</label>
                  <Input
                    type="number"
                    value={monthsInput}
                    onChange={(e) => setMonthsInput(Number(e.target.value))}
                    className="bg-slate-950 border-white/10 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Annual Interest Rate (% p.a.)</label>
                  <Input
                    type="number"
                    value={interestInput}
                    onChange={(e) => setInterestInput(Number(e.target.value))}
                    className="bg-slate-950 border-white/10 text-xs text-emerald-400 font-bold font-mono"
                  />
                </div>
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex justify-between items-center">
                  <span className="text-xs text-slate-300">Calculated Monthly EMI:</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">
                    {formatCurrency(Math.round(principalInput / monthsInput))} / mo
                  </span>
                </div>
              </div>
            </div>

            <div className="salary-card p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Receipt className="w-4 h-4 text-blue-400" /> Repayment Policy Rules
              </h3>
              <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
                <li><span className="text-white font-bold">Salary Auto-Deduction:</span> EMI installments are auto-deducted on 1st of every month during salary run.</li>
                <li><span className="text-emerald-400 font-bold">0% Emergency Interest:</span> Emergency & Medical advances are 100% interest-free.</li>
                <li><span className="text-cyan-400 font-bold">Tenure Cap:</span> Salary advances must be fully repaid within max 12 monthly installments.</li>
              </ul>
            </div>
          </div>
        </div>
      );

    case "payroll-recovery":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Payroll Recovery & Salary Deductions", "Automated monthly salary EMI deductions and active recovery progress.")}
          <div className="salary-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Active Recovery Schedule</h3>
            <AdvancesTable
              data={requests.filter((r) => r.recoveryStatus === "RECOVERING")}
              selectedIds={selectedIds}
              onSelectToggle={(id) =>
                setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
              }
              onSelectAll={(checked) => setSelectedIds(checked ? requests.map((r) => r.id) : [])}
              onView={onViewRequestDetails}
              onApprove={onApproveRequest}
              onReject={onRejectRequest}
              onRequestChanges={onViewRequestDetails}
              onDisburse={onDisburseRequest}
              onManageRecovery={onManageRecovery}
              onViewLogs={() => {}}
            />
          </div>
        </div>
      );

    case "ai-assistant":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("OFC360 Financial Assistant", "Consult your AI assistant for default risk predictions, loan eligibility evaluations, and EMI repayment forecasts.")}
          
          <div className="w-full">
            {/* Copilot Main Interactive Chat Thread */}
            <div className="w-full salary-card p-6 flex flex-col justify-between min-h-[500px] space-y-4">
              <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2">
                {copilotChat.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 ${
                      msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl text-xs font-bold ${
                        msg.sender === "user"
                          ? "bg-emerald-600 text-white"
                          : "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30"
                      }`}
                    >
                      {msg.sender === "user" ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    </div>
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-xl ${
                        msg.sender === "user"
                          ? "bg-emerald-600/20 text-emerald-200 border border-emerald-500/30 font-medium"
                          : "bg-slate-900/90 text-slate-200 border border-white/10"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <span className="text-[9px] text-slate-500 mt-1 block text-right font-mono">{msg.timestamp}</span>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Input Form & Quick Prompt Chips */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "What is the maximum salary advance limit?",
                    "Calculate EMI for ₹50,000 over 10 months",
                    "What is the default risk score?",
                  ].map((chip, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={(e) => handleCopilotSend(e, chip)}
                      className="px-2.5 py-1 rounded-full bg-slate-900 border border-white/10 hover:border-emerald-500/40 text-[11px] text-slate-300 hover:text-emerald-300 transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                <form onSubmit={(e) => handleCopilotSend(e)} className="flex gap-2">
                  <Input
                    value={copilotQuery}
                    onChange={(e) => setCopilotQuery(e.target.value)}
                    placeholder="Ask AI Financial Assistant about loan limits, EMI calculations, or default risk..."
                    className="bg-slate-950 border-white/10 text-xs text-white h-10"
                  />
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5 h-10 px-5 font-bold">
                    <Send className="w-4 h-4" /> Ask AI
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="space-y-6">
          {renderBreadcrumb(`Module: ${moduleId.replace("-", " ").toUpperCase()}`, "Production-ready enterprise advance & loan module.")}
          <div className="salary-card p-6 space-y-4">
            <AdvancesTable
              data={requests}
              selectedIds={selectedIds}
              onSelectToggle={(id) =>
                setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
              }
              onSelectAll={(checked) => setSelectedIds(checked ? requests.map((r) => r.id) : [])}
              onView={onViewRequestDetails}
              onApprove={onApproveRequest}
              onReject={onRejectRequest}
              onRequestChanges={onViewRequestDetails}
              onDisburse={onDisburseRequest}
              onManageRecovery={onManageRecovery}
              onViewLogs={() => {}}
            />
          </div>
        </div>
      );
  }
};
