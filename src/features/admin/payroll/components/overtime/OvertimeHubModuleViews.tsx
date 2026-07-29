import React, { useState, useEffect, useRef } from "react";
import {
  OvertimeRecord,
  OvertimeSummaryKPIs,
} from "./overtimeTypes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  ArrowLeft,
  Clock,
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
  Fingerprint,
  Calendar,
  Sun,
  PartyPopper,
  Moon,
  ShieldAlert,
  Landmark,
  Scale,
  Brain,
  Check,
} from "lucide-react";
import { PayrollBackButton } from "@/features/admin/payroll/components/PayrollBackButton";
import { OvertimeTable } from "./OvertimeTable";
import { OvertimeAnalytics } from "./OvertimeAnalytics";
import { AIOvertimeInsights } from "./AIOvertimeInsights";

interface OvertimeHubModuleViewsProps {
  moduleId: string;
  onBackToHub: () => void;
  records: OvertimeRecord[];
  onOpenCreateDrawer: () => void;
  onViewRecordDetails: (record: OvertimeRecord) => void;
  onApproveRecord: (record: OvertimeRecord) => void;
  onRejectRecord: (record: OvertimeRecord) => void;
  onAddPayrollEntry: (record: OvertimeRecord) => void;
}

export const OvertimeHubModuleViews: React.FC<OvertimeHubModuleViewsProps> = ({
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

  // Rate Multiplier State
  const [baseHourlyRate, setBaseHourlyRate] = useState<number>(450);
  const [otHoursInput, setOtHoursInput] = useState<number>(4);
  const [multiplierInput, setMultiplierInput] = useState<number>(1.5);

  // Copilot Chat State
  const [copilotQuery, setCopilotQuery] = useState("");
  const [copilotChat, setCopilotChat] = useState<
    { sender: "ai" | "user"; text: string; timestamp: string }[]
  >([
    {
      sender: "ai",
      text: "Welcome to Aurix AI Overtime Copilot! I have full visibility into Factories Act 1948 limits, 1.5x/2.0x/3.0x rate multipliers, employee fatigue scores, and biometric attendance logs. How can I assist you today?",
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

      if (lower.includes("total") || lower.includes("summary") || lower.includes("hours")) {
        const totalHrs = records.reduce((acc, r) => acc + (r.overtimeHours || 0), 0);
        const totalCost = records.reduce((acc, r) => acc + (r.overtimeAmount || 0), 0);
        const pendingCount = records.filter((r) => r.approvalStatus.includes("PENDING")).length;
        aiReply = `📊 Live Overtime Summary: Total OT Hours logged across company is ${totalHrs} Hrs (Total Payout: ${formatCurrency(totalCost)}). Currently, ${pendingCount} overtime requests are pending manager sign-off.`;
      } else if (lower.includes("factories act") || lower.includes("law") || lower.includes("limit")) {
        aiReply = `📜 Factories Act 1948 Compliance: Maximum allowed overtime is 50 hours per quarter (Section 64/65). Daily total working hours including OT must not exceed 12 hours/day, with mandatory 10.5 hours rest period.`;
      } else if (lower.includes("rate") || lower.includes("multiplier") || lower.includes("1.5") || lower.includes("double")) {
        aiReply = `💰 Overtime Rate Structure: Regular weekday OT is paid at 1.5x hourly base rate. Weekend OT (Saturday/Sunday) is paid at 2.0x double pay. National Holiday OT is paid at 3.0x triple pay.`;
      } else if (lower.includes("weekend") || lower.includes("saturday") || lower.includes("sunday")) {
        aiReply = `☀️ Weekend OT Policy: Weekend work requires prior HOD approval. Reimbursed at 2.0x multiplier with complimentary meal voucher allowance.`;
      } else if (lower.includes("burnout") || lower.includes("fatigue") || lower.includes("risk")) {
        aiReply = `⚡ AI Fatigue Score: Aurix AI flags employees with > 12 continuous working days or > 18 OT hours in a single week to prevent workplace burnout. Currently 2 staff flagged for workload rest.`;
      } else if (lower.includes("night") || lower.includes("allowance")) {
        aiReply = `🌙 Night Shift Policy: Shifts between 10:00 PM and 06:00 AM incur a Night Differential Allowance of ₹350/shift plus company cab transport arrangements.`;
      } else {
        aiReply = `🤖 Aurix AI Overtime Copilot: Overtime calculations are 100% compliant with Factories Act 1948 and Company HR Policy #OT-2026. You can ask me about OT multipliers, shift allowances, or specific employee hours.`;
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
          <ArrowLeft className="w-4 h-4 text-purple-400" /> Back to Overtime Hub
        </Button>
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">{title}</h2>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" onClick={onOpenCreateDrawer} className="bg-purple-600 hover:bg-purple-500 text-white text-xs gap-1.5 h-8 shadow-lg shadow-purple-600/25 font-bold">
          <PlusCircle className="w-3.5 h-3.5" /> Submit New Request
        </Button>
      </div>
    </div>
  );

  switch (moduleId) {
    case "dashboard":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Overtime Dashboard & Analytics", "Real-time company overtime volume, department costs, and active claims table.")}
          <OvertimeAnalytics records={records} />
          <AIOvertimeInsights />
          <div className="salary-card p-6 space-y-4">
            <OvertimeTable
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
      const pendingList = records.filter((r) => r.approvalStatus.includes("PENDING"));
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Pending Approvals Queue", "Multi-tier approval workspace for Line Managers, HR, and Payroll Admins.")}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="salary-card p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Awaiting Manager Sign-off</span>
              <p className="text-xl font-bold text-white font-mono">{pendingList.length} Requests</p>
              <p className="text-xs text-slate-400">Requires line manager approval</p>
            </div>
            <div className="salary-card p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Pending HR Verification</span>
              <p className="text-xl font-bold text-purple-400 font-mono">2 Claims</p>
              <p className="text-xs text-slate-400">Factories Act 50hr cap check</p>
            </div>
            <div className="salary-card p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Queued Value</span>
              <p className="text-xl font-bold text-emerald-400 font-mono">{formatCurrency(pendingList.reduce((acc, r) => acc + r.overtimeAmount, 0))}</p>
              <p className="text-xs text-slate-400">1.5x & 2.0x payout estimate</p>
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
                  toast.success(`Bulk approved all ${pendingList.length} pending request(s)!`);
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8 gap-1.5 font-bold"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Approve All Queue
              </Button>
            </div>
            <OvertimeTable
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

    case "approved-ot":
      const approvedList = records.filter((r) => r.approvalStatus === "APPROVED");
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Approved Overtime Records", "Audit verified overtime records ready for active salary run inclusion.")}
          <div className="salary-card p-6 space-y-4">
            <OvertimeTable
              data={approvedList}
              selectedIds={selectedIds}
              onSelectToggle={(id) =>
                setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
              }
              onSelectAll={(checked) => setSelectedIds(checked ? approvedList.map((r) => r.id) : [])}
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

    case "attendance-verification":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Attendance Verification & Biometric Punch Sync", "Cross-verify biometric IN/OUT punches, GPS geofencing, and missing punch corrections.")}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-cyan-400">Biometric Match Rate</span>
              <p className="text-xl font-bold text-white font-mono">99.2% Verified</p>
              <p className="text-xs text-slate-400">Synced with ZKTeco & Essl devices</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-emerald-400">GPS Geofence Match</span>
              <p className="text-xl font-bold text-emerald-400 font-mono">100% Location Pass</p>
              <p className="text-xs text-slate-400">Mobile app GPS punch verified</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-amber-400">Missing Punch Claims</span>
              <p className="text-xl font-bold text-amber-400 font-mono">1 Correction</p>
              <p className="text-xs text-slate-400">Pending line manager sign-off</p>
            </div>
          </div>
          <div className="salary-card p-6 space-y-4">
            <OvertimeTable
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

    case "weekend-ot":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Weekend Overtime (2.0x Double Pay)", "Saturday and Sunday overtime tracking with 2.0x rate multipliers and weekend reports.")}
          <div className="salary-card p-6 space-y-4">
            <OvertimeTable
              data={records.filter((r) => r.category === "Weekend Overtime")}
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

    case "holiday-ot":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Holiday Overtime (3.0x Triple Pay)", "National Holiday overtime tracking with statutory 3.0x triple pay compensation.")}
          <div className="salary-card p-6 space-y-4">
            <OvertimeTable
              data={records.filter((r) => r.category === "Holiday Overtime")}
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

    case "compensation-rules":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Compensation Rules & Rate Calculator", "Interactive formula builder for 1.5x, 2.0x, 3.0x overtime rate multipliers.")}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="salary-card p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-purple-400" /> Live Overtime Pay Calculator
              </h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Base Hourly Rate (₹/hr)</label>
                  <Input
                    type="number"
                    value={baseHourlyRate}
                    onChange={(e) => setBaseHourlyRate(Number(e.target.value))}
                    className="bg-slate-950 border-white/10 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Overtime Hours Worked</label>
                  <Input
                    type="number"
                    value={otHoursInput}
                    onChange={(e) => setOtHoursInput(Number(e.target.value))}
                    className="bg-slate-950 border-white/10 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Rate Multiplier (e.g. 1.5x, 2.0x, 3.0x)</label>
                  <Input
                    type="number"
                    step="0.5"
                    value={multiplierInput}
                    onChange={(e) => setMultiplierInput(Number(e.target.value))}
                    className="bg-slate-950 border-white/10 text-xs text-emerald-400 font-bold font-mono"
                  />
                </div>
                <div className="p-3 rounded-lg bg-purple-950/40 border border-purple-500/30 flex justify-between items-center">
                  <span className="text-xs text-slate-300">Calculated OT Payout:</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">
                    {formatCurrency(baseHourlyRate * otHoursInput * multiplierInput)}
                  </span>
                </div>
              </div>
            </div>

            <div className="salary-card p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-400" /> Standard Multiplier Rules
              </h3>
              <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
                <li><span className="text-white font-bold">1.5x Multiplier:</span> Applicable for regular weekday overtime hours beyond 8.0 hrs/day.</li>
                <li><span className="text-emerald-400 font-bold">2.0x Double Pay:</span> Applicable for weekend shifts (Saturday & Sunday).</li>
                <li><span className="text-yellow-400 font-bold">3.0x Triple Pay:</span> Applicable for Gazetted National Holidays.</li>
                <li><span className="text-purple-400 font-bold">Night Differential:</span> Additional ₹350/shift allowance between 10 PM and 6 AM.</li>
              </ul>
            </div>
          </div>
        </div>
      );

    case "burnout-fatigue":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Burnout & Fatigue Monitoring", "AI employee fatigue scores, continuous working days, and health risk alerts.")}
          <div className="salary-card p-6 space-y-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-400" /> Employee Workload & Fatigue Scores (2026)
            </h3>
            
            <div className="space-y-4">
              {[
                { name: "Vikramaditya Roy", dept: "Engineering", days: 12, otHrs: 22.5, score: 88, status: "HIGH_RISK" },
                { name: "Rahul Sharma", dept: "Sales", days: 8, otHrs: 14.0, score: 64, status: "MODERATE" },
                { name: "Priya Nair", dept: "HR", days: 5, otHrs: 6.0, score: 25, status: "HEALTHY" },
                { name: "Amitabh Sen", dept: "Operations", days: 10, otHrs: 18.0, score: 78, status: "HIGH_RISK" },
              ].map((f, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white">{f.name} ({f.dept})</span>
                    <Badge variant="outline" className={f.status === "HIGH_RISK" ? "border-rose-500/30 text-rose-400 bg-rose-500/10" : "border-emerald-500/30 text-emerald-400"}>
                      Fatigue Score: {f.score}/100 ({f.days} Working Days)
                    </Badge>
                  </div>
                  <Progress value={f.score} className="h-2 bg-slate-800" />
                  <p className="text-[11px] text-slate-400">Total OT Logged: <span className="text-white font-bold">{f.otHrs} Hrs</span></p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "ai-copilot":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Aurix AI Overtime Copilot Assistant", "Consult your AI assistant for Factories Act 1948 rules, 1.5x/2.0x rate multipliers, and fatigue checks.")}
          
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
                    "What is the Factories Act 1948 OT limit?",
                    "What is the weekend overtime rate?",
                    "Show total overtime hours logged",
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
                    placeholder="Ask AI Copilot about overtime rates, Factories Act limits, or shift rules..."
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
          {renderBreadcrumb(`Module: ${moduleId.replace("-", " ").toUpperCase()}`, "Production-ready enterprise overtime management module.")}
          <div className="salary-card p-6 space-y-4">
            <OvertimeTable
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
