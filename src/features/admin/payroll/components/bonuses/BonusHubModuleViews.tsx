import React, { useState, useEffect, useRef } from "react";
import {
  BonusRecord,
  BonusesSummaryKPIs,
} from "./bonusesTypes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  ArrowLeft,
  Gift,
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
  Award,
  PartyPopper,
  Trophy,
  Scale,
  Receipt,
  Crown,
  Brain,
  Check,
  UserCheck,
} from "lucide-react";
import { PayrollBackButton } from "@/features/admin/payroll/components/PayrollBackButton";
import { BonusesTable } from "./BonusesTable";
import { BonusesAnalytics } from "./BonusesAnalytics";
import { AIBonusInsights } from "./AIBonusInsights";

interface BonusHubModuleViewsProps {
  moduleId: string;
  onBackToHub: () => void;
  records: BonusRecord[];
  onOpenCreateDrawer: () => void;
  onViewRecordDetails: (record: BonusRecord) => void;
  onApproveRecord: (record: BonusRecord) => void;
  onRejectRecord: (record: BonusRecord) => void;
  onAddPayrollEntry: (record: BonusRecord) => void;
}

export const BonusHubModuleViews: React.FC<BonusHubModuleViewsProps> = ({
  moduleId,
  onBackToHub,
  records,
  onOpenCreateDrawer,
  onViewRecordDetails,
  onApproveRecord,
  onRejectRecord,
  onAddPayrollEntry,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Formula Calculator State
  const [baseSalary, setBaseSalary] = useState<number>(100000);
  const [ratingInput, setRatingInput] = useState<number>(4.5);
  const [pctInput, setPctInput] = useState<number>(15);

  // Copilot Chat State
  const [copilotQuery, setCopilotQuery] = useState("");
  const [copilotChat, setCopilotChat] = useState<
    { sender: "ai" | "user"; text: string; timestamp: string }[]
  >([
    {
      sender: "ai",
      text: "Welcome to Aurix AI Bonus Intelligence! I have full visibility into performance rating multipliers, festival bonus allocations, TDS tax calculations, and corporate budget caps. How can I assist you today?",
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

      if (lower.includes("total") || lower.includes("summary") || lower.includes("pool")) {
        const totalAmount = records.reduce((acc, r) => acc + (r.finalBonusAmount || 0), 0);
        const paidAmount = records.filter((r) => r.payrollStatus === "PAID").reduce((acc, r) => acc + (r.finalBonusAmount || 0), 0);
        const pendingCount = records.filter((r) => r.approvalStatus.includes("PENDING")).length;
        aiReply = `📊 Live Bonus Summary: Total allocated bonus pool across company is ${formatCurrency(totalAmount)} (Total Disbursed: ${formatCurrency(paidAmount)}). Currently, ${pendingCount} bonus allocations are pending manager sign-off.`;
      } else if (lower.includes("tax") || lower.includes("tds") || lower.includes("deduction")) {
        aiReply = `📜 Bonus TDS Tax Policy: Bonus payouts are treated as taxable salary earnings under IT Act Section 192. Tax is deducted based on the employee's applicable slab rate (Old vs New Regime).`;
      } else if (lower.includes("formula") || lower.includes("calculator") || lower.includes("performance")) {
        const calcBonus = Math.round((baseSalary * pctInput) / 100);
        aiReply = `💰 Performance Formula Result: For a base salary of ${formatCurrency(baseSalary)} with a rating of ${ratingInput}/5.0 (${pctInput}% multiplier), the recommended bonus payout is ${formatCurrency(calcBonus)}.`;
      } else if (lower.includes("festival") || lower.includes("diwali") || lower.includes("christmas")) {
        aiReply = `🎉 Festival Bonus Policy: Annual Diwali & Festive bonuses are disbursed in October salary run. Standard allocation is 1 month basic salary for eligible staff.`;
      } else if (lower.includes("executive") || lower.includes("c-suite") || lower.includes("ceo")) {
        aiReply = `👑 Executive Compensation: C-Suite bonuses require Board Remuneration Committee sign-off and are tied to Annual EBITDA growth targets.`;
      } else {
        aiReply = `🤖 Aurix AI Bonus Intelligence: All bonus allocations are 100% integrated with monthly payroll runs under Company Compensation Policy #BON-2026. You can ask me about KPI multipliers, TDS tax rates, or budget limits.`;
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
        <Button
          variant="outline"
          size="sm"
          onClick={onBackToHub}
          className="border-white/10 bg-slate-900 text-slate-300 hover:text-white text-xs gap-1.5 h-8 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-purple-400" /> Back to Bonus Hub
        </Button>
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">{title}</h2>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" onClick={onOpenCreateDrawer} className="bg-purple-600 hover:bg-purple-500 text-white text-xs gap-1.5 h-8 shadow-lg shadow-purple-600/25 font-bold">
          <PlusCircle className="w-3.5 h-3.5" /> Submit New Allocation
        </Button>
      </div>
    </div>
  );

  switch (moduleId) {
    case "dashboard":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Bonus Dashboard & Analytics", "Real-time company bonus pool overview, department distribution, and active claims table.")}
          <BonusesAnalytics records={records} />
          <AIBonusInsights />
          <div className="salary-card p-6 space-y-4">
            <BonusesTable
              data={records}
              selectedIds={selectedIds}
              onSelectToggle={(id) =>
                setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
              }
              onSelectAll={(checked) => setSelectedIds(checked ? records.map((r) => r.id) : [])}
              onView={onViewRecordDetails}
              onApprove={onApproveRecord}
              onReject={onRejectRecord}
              onRequestChanges={onViewRecordDetails}
              onAddPayrollEntry={onAddPayrollEntry}
              onViewTimeline={onViewRecordDetails}
            />
          </div>
        </div>
      );

    case "pending-approvals":
    case "approval-workflow":
      const pendingList = records.filter((r) => r.approvalStatus.includes("PENDING"));
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Approval Workflow & Pending Queue", "Multi-tier approval workspace for Line Managers, HR, and Finance Admins.")}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="salary-card p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Awaiting Manager Sign-off</span>
              <p className="text-xl font-bold text-white font-mono">{pendingList.length} Allocations</p>
              <p className="text-xs text-slate-400">Requires reporting manager review</p>
            </div>
            <div className="salary-card p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Pending Finance Audit</span>
              <p className="text-xl font-bold text-purple-400 font-mono">1 Allocation</p>
              <p className="text-xs text-slate-400">Budget cap verification</p>
            </div>
            <div className="salary-card p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Queued Value</span>
              <p className="text-xl font-bold text-emerald-400 font-mono">{formatCurrency(pendingList.reduce((acc, r) => acc + r.finalBonusAmount, 0))}</p>
              <p className="text-xs text-slate-400">Ready for salary sync</p>
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
                  pendingList.forEach((r) => onApproveRecord(r));
                  toast.success(`Bulk approved all ${pendingList.length} pending allocation(s)!`);
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8 gap-1.5 font-bold"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Approve All Queue
              </Button>
            </div>
            <BonusesTable
              data={pendingList}
              selectedIds={selectedIds}
              onSelectToggle={(id) =>
                setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
              }
              onSelectAll={(checked) => setSelectedIds(checked ? pendingList.map((r) => r.id) : [])}
              onView={onViewRecordDetails}
              onApprove={onApproveRecord}
              onReject={onRejectRecord}
              onRequestChanges={onViewRecordDetails}
              onAddPayrollEntry={onAddPayrollEntry}
              onViewTimeline={onViewRecordDetails}
            />
          </div>
        </div>
      );

    case "performance-bonus":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Performance Bonus & KPI Achievement", "Individual KPI ratings, goal achievement percentages, and department performance rankings.")}
          <div className="salary-card p-6 space-y-4">
            <BonusesTable
              data={records.filter((r) => r.bonusCategory === "Performance Bonus")}
              selectedIds={selectedIds}
              onSelectToggle={(id) =>
                setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
              }
              onSelectAll={(checked) => setSelectedIds(checked ? records.map((r) => r.id) : [])}
              onView={onViewRecordDetails}
              onApprove={onApproveRecord}
              onReject={onRejectRecord}
              onRequestChanges={onViewRecordDetails}
              onAddPayrollEntry={onAddPayrollEntry}
              onViewTimeline={onViewRecordDetails}
            />
          </div>
        </div>
      );

    case "festival-bonus":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Festival Bonus Disbursals", "Diwali, Christmas, New Year, and custom regional festival bonus allocations.")}
          <div className="salary-card p-6 space-y-4">
            <BonusesTable
              data={records.filter((r) => r.bonusCategory === "Festival Bonus")}
              selectedIds={selectedIds}
              onSelectToggle={(id) =>
                setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
              }
              onSelectAll={(checked) => setSelectedIds(checked ? records.map((r) => r.id) : [])}
              onView={onViewRecordDetails}
              onApprove={onApproveRecord}
              onReject={onRejectRecord}
              onRequestChanges={onViewRecordDetails}
              onAddPayrollEntry={onAddPayrollEntry}
              onViewTimeline={onViewRecordDetails}
            />
          </div>
        </div>
      );

    case "calculation-engine":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Bonus Calculation Engine", "Interactive formula builder for performance multipliers, revenue shares, and fixed bonuses.")}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="salary-card p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-purple-400" /> Interactive Bonus Formula Calculator
              </h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Base Monthly Basic Salary (₹)</label>
                  <Input
                    type="number"
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(Number(e.target.value))}
                    className="bg-slate-950 border-white/10 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Performance Rating (Out of 5.0)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={ratingInput}
                    onChange={(e) => setRatingInput(Number(e.target.value))}
                    className="bg-slate-950 border-white/10 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Bonus Percentage Multiplier (%)</label>
                  <Input
                    type="number"
                    value={pctInput}
                    onChange={(e) => setPctInput(Number(e.target.value))}
                    className="bg-slate-950 border-white/10 text-xs text-emerald-400 font-bold font-mono"
                  />
                </div>
                <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-500/30 flex justify-between items-center">
                  <span className="text-xs text-slate-300">Calculated Bonus Payout:</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">
                    {formatCurrency(Math.round((baseSalary * pctInput) / 100))}
                  </span>
                </div>
              </div>
            </div>

            <div className="salary-card p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-400" /> Formula Multiplier Guidelines
              </h3>
              <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
                <li><span className="text-emerald-400 font-bold">5.0 Star Rating:</span> 20% to 25% of annual basic salary.</li>
                <li><span className="text-blue-400 font-bold">4.0 - 4.5 Rating:</span> 12% to 15% of annual basic salary.</li>
                <li><span className="text-purple-400 font-bold">Sales Target Bonus:</span> 2.5% of net target revenue achieved beyond 100%.</li>
              </ul>
            </div>
          </div>
        </div>
      );

    case "reward-recognition":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Reward & Recognition Wall of Fame", "Employee of the Month awards, digital recognition badges, and certificates.")}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Employee of the Month", winner: "Vikramaditya Roy", dept: "Engineering", award: "₹50,000 Spot Award", badge: "Star Architect" },
              { title: "Top Sales Rep", winner: "Rahul Sharma", dept: "Sales", award: "₹75,000 Target Bonus", badge: "Revenue Champion" },
              { title: "Innovation Star", winner: "Priya Nair", dept: "Product", award: "₹35,000 AI Award", badge: "Innovation Leader" },
            ].map((w, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-purple-950/30 border border-purple-500/30 space-y-3 text-center">
                <div className="w-12 h-12 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center mx-auto border border-purple-500/40">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <Badge variant="outline" className="border-purple-500/30 text-purple-300 text-[10px] uppercase font-bold">
                    {w.title}
                  </Badge>
                  <h4 className="text-base font-extrabold text-white mt-1">{w.winner}</h4>
                  <p className="text-xs text-slate-400">{w.dept}</p>
                </div>
                <div className="p-2 rounded-lg bg-slate-950 border border-white/10 text-xs font-bold text-emerald-400 font-mono">
                  {w.award}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "ai-intelligence":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Aurix AI Bonus Intelligence", "Consult your AI assistant for performance rating predictions, TDS tax estimates, and budget optimization.")}
          
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
                          ? "bg-purple-600 text-white"
                          : "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                      }`}
                    >
                      {msg.sender === "user" ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    </div>
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-xl ${
                        msg.sender === "user"
                          ? "bg-purple-600/20 text-purple-200 border border-purple-500/30 font-medium"
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
                    "Show total bonus pool summary",
                    "What is the bonus TDS tax rate?",
                    "Calculate performance bonus for rating 4.5",
                  ].map((chip, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={(e) => handleCopilotSend(e, chip)}
                      className="px-2.5 py-1 rounded-full bg-slate-900 border border-white/10 hover:border-purple-500/40 text-[11px] text-slate-300 hover:text-purple-300 transition-colors"
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                <form onSubmit={(e) => handleCopilotSend(e)} className="flex gap-2">
                  <Input
                    value={copilotQuery}
                    onChange={(e) => setCopilotQuery(e.target.value)}
                    placeholder="Ask AI Bonus Intelligence about formulas, TDS tax, or performance multipliers..."
                    className="bg-slate-950 border-white/10 text-xs text-white h-10"
                  />
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white text-xs gap-1.5 h-10 px-5 font-bold">
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
          {renderBreadcrumb(`Module: ${moduleId.replace("-", " ").toUpperCase()}`, "Production-ready enterprise bonus & incentive module.")}
          <div className="salary-card p-6 space-y-4">
            <BonusesTable
              data={records}
              selectedIds={selectedIds}
              onSelectToggle={(id) =>
                setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
              }
              onSelectAll={(checked) => setSelectedIds(checked ? records.map((r) => r.id) : [])}
              onView={onViewRecordDetails}
              onApprove={onApproveRecord}
              onReject={onRejectRecord}
              onRequestChanges={onViewRecordDetails}
              onAddPayrollEntry={onAddPayrollEntry}
              onViewTimeline={onViewRecordDetails}
            />
          </div>
        </div>
      );
  }
};
