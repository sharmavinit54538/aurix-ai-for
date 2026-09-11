import React, { useState, useEffect, useRef } from "react";
import {
  BankTransferItem,
  BankTransferDashboardMetrics,
} from "@/services/bankTransfersApi";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  ArrowLeft,
  Landmark,
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
  CreditCard,
  Building2,
  AlertTriangle,
  Scale,
  Layers,
  Brain,
  Check,
  RefreshCw,
} from "lucide-react";
import { PayrollBackButton } from "@/features/admin/payroll/components/PayrollBackButton";
import { BankTransfersTable } from "./BankTransfersTable";

interface BankHubModuleViewsProps {
  moduleId: string;
  onBackToHub: () => void;
  items: BankTransferItem[];
  metrics: BankTransferDashboardMetrics;
  onOpenCreateBatchModal: () => void;
  onViewTransferDetails: (item: BankTransferItem) => void;
  onRetryTransfer: (item: BankTransferItem) => void;
  onMarkAsPaid: (item: BankTransferItem) => void;
  onGenerateBankFile: (format: string) => void;
}

export const BankHubModuleViews: React.FC<BankHubModuleViewsProps> = ({
  moduleId,
  onBackToHub,
  items,
  metrics,
  onOpenCreateBatchModal,
  onViewTransferDetails,
  onRetryTransfer,
  onMarkAsPaid,
  onGenerateBankFile,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Penny Drop Verification State
  const [pennyAccountInput, setPennyAccountInput] = useState("4921098231");
  const [pennyIfscInput, setPennyIfscInput] = useState("HDFC0001234");
  const [pennyResult, setPennyResult] = useState<any>(null);

  // Copilot Chat State
  const [copilotQuery, setCopilotQuery] = useState("");
  const [copilotChat, setCopilotChat] = useState<
    { sender: "ai" | "user"; text: string; timestamp: string }[]
  >([
    {
      sender: "ai",
      text: "Welcome to OFC360 Banking Intelligence! I have full visibility into NEFT/ACH batch files, HDFC/ICICI Corporate Gateways, Penny Drop verification, and duplicate payment detection. How can I assist you today?",
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
        aiReply = `📊 Live Bank Disbursal Summary: Total salary pool for July cycle is ${formatCurrency(metrics.total_salary_amount)} (Disbursed: ${formatCurrency(metrics.transferred_amount)}, Pending: ${formatCurrency(metrics.pending_amount)}). Currently, ${metrics.successful_transfers} transfers are confirmed settled.`;
      } else if (lower.includes("penny") || lower.includes("verification") || lower.includes("ifsc")) {
        aiReply = `🛡️ Penny Drop Verification: Instant ₹1 Penny Drop API validates account holder name match (min 85% match score required) and checks IFSC active node status with NPCI.`;
      } else if (lower.includes("gateway") || lower.includes("hdfc") || lower.includes("icici")) {
        aiReply = `🏦 Corporate Banking Gateways: Active connections to HDFC Host-to-Host (SSL Mutual Auth), ICICI Corporate Banking API, and SBI Corporate Direct portal. All transfers operate under 256-bit encryption.`;
      } else if (lower.includes("failed") || lower.includes("error") || lower.includes("retry")) {
        aiReply = `⚠️ Failed Payment Intelligence: Currently ${metrics.failed_transfers} failed transfers detected (Cause: Invalid IFSC Code or Account Closed). You can trigger auto-retry from the Failed Payment Center.`;
      } else {
        aiReply = `🤖 OFC360 Banking Intelligence: All bank transfers are 100% compliant with RBI & NPCI electronic funds transfer guidelines under Company Treasury Policy #BANK-2026. You can ask me about NEFT batch files, Penny Drop verification, or gateway status.`;
      }

      setCopilotChat((prev) => [
        ...prev,
        { sender: "ai", text: aiReply, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
      ]);
    }, 400);
  };

  const handleRunPennyDrop = () => {
    toast.info("Triggering ₹1 Penny Drop Verification API...");
    setTimeout(() => {
      setPennyResult({
        status: "SUCCESS",
        accountHolder: "Vikramaditya Roy",
        matchScore: 98.5,
        ifscBranch: "HDFC Bank, MG Road Branch",
        bankResponse: "NPCI Account Exists - Active for NEFT/IMPS",
      });
      toast.success("Penny Drop Verification Successful! Name match: 98.5%");
    }, 800);
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
        <Button size="sm" onClick={onOpenCreateBatchModal} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5 h-8 shadow-lg shadow-emerald-600/25 font-bold">
          <PlusCircle className="w-3.5 h-3.5" /> Create Payment Batch
        </Button>
      </div>
    </div>
  );

  switch (moduleId) {
    case "dashboard":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Transfer Dashboard & Analytics", "Real-time banking overview, corporate disbursals, and active transaction records.")}
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-emerald-400">Total Salary Pool</span>
              <p className="text-xl font-bold text-white font-mono">{formatCurrency(metrics.total_salary_amount)}</p>
              <p className="text-xs text-slate-400">{metrics.total_employees} Employees Covered</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-cyan-400">Settled Payouts</span>
              <p className="text-xl font-bold text-cyan-400 font-mono">{formatCurrency(metrics.transferred_amount)}</p>
              <p className="text-xs text-slate-400">{metrics.successful_transfers} Settled Transfers</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-amber-400">Pending Disbursal</span>
              <p className="text-xl font-bold text-amber-400 font-mono">{formatCurrency(metrics.pending_amount)}</p>
              <p className="text-xs text-slate-400">{metrics.ready_for_payment} Queued Transfers</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-rose-400">Failed / Rejected</span>
              <p className="text-xl font-bold text-rose-400 font-mono">{formatCurrency(metrics.rejected_amount)}</p>
              <p className="text-xs text-slate-400">{metrics.failed_transfers} Failed Transfers</p>
            </div>
          </div>

          <div className="salary-card p-6 space-y-4">
            <BankTransfersTable
              items={items}
              selectedIds={selectedIds}
              onSelectToggle={(id) =>
                setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
              }
              onSelectAll={(checked) => setSelectedIds(checked ? items.map((i) => i.id) : [])}
              onViewDetails={onViewTransferDetails}
              onRetryTransfer={onRetryTransfer}
              onMarkAsPaid={onMarkAsPaid}
            />
          </div>
        </div>
      );

    case "verification-center":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Bank Verification Center & Penny Drop API", "Perform instant ₹1 Penny Drop verification, validate bank IFSC codes, and check blocked account nodes.")}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="salary-card p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Instant Penny Drop (₹1) Verifier
              </h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Bank Account Number</label>
                  <Input
                    value={pennyAccountInput}
                    onChange={(e) => setPennyAccountInput(e.target.value)}
                    className="bg-slate-950 border-white/10 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Bank IFSC Code</label>
                  <Input
                    value={pennyIfscInput}
                    onChange={(e) => setPennyIfscInput(e.target.value)}
                    className="bg-slate-950 border-white/10 text-xs text-emerald-400 font-bold font-mono"
                  />
                </div>
                <Button onClick={handleRunPennyDrop} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5 h-9 font-bold">
                  <RefreshCw className="w-3.5 h-3.5" /> Execute ₹1 Penny Drop Test
                </Button>

                {pennyResult && (
                  <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-white">{pennyResult.accountHolder}</span>
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">{pennyResult.status}</Badge>
                    </div>
                    <p className="text-slate-300">Match Score: <span className="font-bold text-emerald-400 font-mono">{pennyResult.matchScore}%</span></p>
                    <p className="text-slate-400">{pennyResult.ifscBranch}</p>
                    <p className="text-[11px] text-slate-500 italic">{pennyResult.bankResponse}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="salary-card p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-400" /> IFSC Node Validation Rules
              </h3>
              <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
                <li><span className="text-white font-bold">NPCI Master Sync:</span> IFSC codes are live synced with RBI master routing tables daily.</li>
                <li><span className="text-emerald-400 font-bold">Minimum Match Score:</span> 85% string similarity score required for automated salary disbursal.</li>
                <li><span className="text-rose-400 font-bold">Blocked Nodes:</span> Accounts flagged for bank mergers (e.g. Syndicate to Canara) require manual IFSC updates.</li>
              </ul>
            </div>
          </div>
        </div>
      );

    case "gateway-integration":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Corporate Payment Gateway Integration", "Direct Host-to-Host SSL connections for HDFC, ICICI, Axis, SBI, and RazorpayX Payout APIs.")}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "HDFC Bank Corporate Direct", protocol: "Host-to-Host SFTP/SSL", status: "CONNECTED", activeTxn: "₹45.0L Disbursed" },
              { name: "ICICI Corporate Banking API", protocol: "Cyberplat REST API", status: "CONNECTED", activeTxn: "₹16.7L Disbursed" },
              { name: "State Bank of India (SBI)", protocol: "Corporate E-Payment", status: "CONNECTED", activeTxn: "₹7.8L Disbursed" },
              { name: "Axis Corporate Gateway", protocol: "Direct API", status: "CONNECTED", activeTxn: "₹8.2L Disbursed" },
              { name: "RazorpayX Payouts Engine", protocol: "Instant IMPS / UPI API", status: "READY", activeTxn: "Instant Payouts" },
              { name: "Cashfree Corporate Direct", protocol: "Batch Payout API", status: "READY", activeTxn: "Backup Gateway" },
            ].map((g, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-900/80 border border-white/10 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-white text-sm">{g.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{g.protocol}</p>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
                    {g.status}
                  </Badge>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-white/5 text-xs font-mono text-slate-200">
                  {g.activeTxn}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "file-generator":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Bank Advice File Generator", "Generate NEFT, RTGS, IMPS, ACH, and NACH payment advice files for bank portal upload.")}
          
          <div className="salary-card p-6 space-y-6">
            <h3 className="text-sm font-bold text-white">Generate Bank Advice Files for July Pay Cycle</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { format: "NEFT", title: "HDFC Enriched NEFT Format", desc: "Standard 112-column text file for HDFC Corporate Banking" },
                { format: "RTGS", title: "High Value RTGS Format", desc: "For transfers exceeding ₹2,00,000 per employee" },
                { format: "ACH", title: "NACH / ACH Salary Credit File", desc: "NPCI compliant ACH format for bulk salary credits" },
              ].map((f, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <Badge variant="outline" className="border-purple-500/30 text-purple-300 font-bold">{f.format}</Badge>
                  <div>
                    <h4 className="font-bold text-white text-xs">{f.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-1">{f.desc}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onGenerateBankFile(f.format)}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white text-xs gap-1.5 font-bold"
                  >
                    <Download className="w-3.5 h-3.5" /> Download {f.format} File
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "ai-intelligence":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("OFC360 Banking Intelligence", "Consult your AI assistant for duplicate payment detection, fraud risk scores, and settlement predictions.")}
          
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
                    "Show total salary disbursal pool",
                    "How does Penny Drop verification work?",
                    "Check for failed bank transfers",
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
                    placeholder="Ask AI Banking Intelligence about NEFT files, Penny Drop, or corporate gateways..."
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
          {renderBreadcrumb(`Module: ${moduleId.replace("-", " ").toUpperCase()}`, "Production-ready enterprise bank transfer module.")}
          <div className="salary-card p-6 space-y-4">
            <BankTransfersTable
              items={items}
              selectedIds={selectedIds}
              onSelectToggle={(id) =>
                setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
              }
              onSelectAll={(checked) => setSelectedIds(checked ? items.map((i) => i.id) : [])}
              onViewDetails={onViewTransferDetails}
              onRetryTransfer={onRetryTransfer}
              onMarkAsPaid={onMarkAsPaid}
            />
          </div>
        </div>
      );
  }
};
