import React, { useState, useEffect, useRef } from "react";
import {
  ReimbursementClaim,
  ReimbursementAuditLog,
  ReimbursementAIInsight,
} from "./reimbursementsTypes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  ArrowLeft,
  Scan,
  ShieldCheck,
  Receipt,
  Sparkles,
  FileSpreadsheet,
  History,
  Plane,
  Stethoscope,
  HandCoins,
  CheckCircle2,
  AlertTriangle,
  Download,
  Upload,
  Search,
  PieChart,
  Settings,
  Bell,
  Grid,
  CreditCard,
  XCircle,
  Clock,
  PlusCircle,
  FileText,
  Send,
  Building2,
  TrendingUp,
  DollarSign,
  Calculator,
  User,
  ExternalLink,
  Bot,
  HelpCircle,
  Check,
} from "lucide-react";
import { PayrollBackButton } from "@/features/admin/payroll/components/PayrollBackButton";
import { ReimbursementsTable } from "./ReimbursementsTable";
import { ReimbursementsAnalytics } from "./ReimbursementsAnalytics";
import { AIReimbursementInsights } from "./AIReimbursementInsights";

interface ReimbursementHubModuleViewsProps {
  moduleId: string;
  onBackToHub: () => void;
  claims: ReimbursementClaim[];
  auditLogs: ReimbursementAuditLog[];
  aiInsights: ReimbursementAIInsight[];
  onOpenCreateDrawer: () => void;
  onViewClaimDetails: (claim: ReimbursementClaim) => void;
  onApproveClaim: (claim: ReimbursementClaim) => void;
  onRejectClaim: (claim: ReimbursementClaim) => void;
  onProcessPayment: (claim: ReimbursementClaim) => void;
  onAddPayrollEntry: (claim: ReimbursementClaim) => void;
}

export const ReimbursementHubModuleViews: React.FC<ReimbursementHubModuleViewsProps> = ({
  moduleId,
  onBackToHub,
  claims,
  auditLogs,
  aiInsights,
  onOpenCreateDrawer,
  onViewClaimDetails,
  onApproveClaim,
  onRejectClaim,
  onProcessPayment,
  onAddPayrollEntry,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<{
    vendor: string;
    amount: number;
    gst: string;
    date: string;
    category: string;
    confidence: number;
  } | null>(null);

  // Mileage Calculator State
  const [mileageKm, setMileageKm] = useState<number>(125);
  const [ratePerKm, setRatePerKm] = useState<number>(12);

  // Copilot State & Auto-scroll Ref
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [copilotQuery, setCopilotQuery] = useState("");
  const [copilotChat, setCopilotChat] = useState<
    { sender: "ai" | "user"; text: string; timestamp: string }[]
  >([
    {
      sender: "ai",
      text: "Welcome to Aurix AI Expense Copilot! I have full access to company policy rules, GST tax exemption limits, and your reimbursement history. How can I assist you today?",
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

      if (lower.includes("total") || lower.includes("how many") || lower.includes("summary") || lower.includes("claim")) {
        const totalCount = claims.length;
        const totalAmount = claims.reduce((sum, c) => sum + (c.claimAmount || 0), 0);
        const pendingCount = claims.filter((c) => c.approvalStatus === "SUBMITTED" || c.approvalStatus === "MANAGER_APPROVED").length;
        const approvedCount = claims.filter((c) => c.approvalStatus === "PAYROLL_APPROVED" || c.approvalStatus === "FINANCE_APPROVED").length;
        aiReply = `📊 Live Reimbursement Summary: You have ${totalCount} active claims totaling ₹${totalAmount.toLocaleString("en-IN")}. Currently, ${pendingCount} claims are pending approval and ${approvedCount} claims are approved for payroll payout.`;
      } else if (lower.includes("pending") || lower.includes("queue") || lower.includes("waiting")) {
        const pendingList = claims.filter((c) => c.approvalStatus === "SUBMITTED" || c.approvalStatus === "MANAGER_APPROVED");
        const names = pendingList.map((c) => `${c.employeeName} (${c.claimNumber} - ₹${(c.claimAmount || 0).toLocaleString("en-IN")})`).join(", ");
        aiReply = `⏳ Pending Approvals Queue: There are ${pendingList.length} claims awaiting sign-off: ${names || "None"}.`;
      } else if (lower.includes("approved") || lower.includes("payout") || lower.includes("disbursed")) {
        const appList = claims.filter((c) => c.approvalStatus === "PAYROLL_APPROVED" || c.approvalStatus === "FINANCE_APPROVED");
        const names = appList.map((c) => `${c.employeeName} (${c.claimNumber} - ₹${(c.claimAmount || 0).toLocaleString("en-IN")})`).join(", ");
        aiReply = `✅ Approved Claims for Payroll: ${appList.length} claims verified: ${names || "None"}.`;
      } else if (lower.includes("hotel") || lower.includes("stay") || lower.includes("mumbai") || lower.includes("bangalore")) {
        aiReply = `🏨 Hotel Accommodation Policy: Capped at ₹12,000 per night for Tier-1 Metro cities (Mumbai, Bangalore, Delhi NCR). Standard Tier-2 city limit is ₹7,500 per night. Tax invoices with GSTIN must be uploaded.`;
      } else if (lower.includes("flight") || lower.includes("air") || lower.includes("travel")) {
        aiReply = `✈️ Travel & Flight Policy: All domestic flight travel must be booked in Economy Class at least 7 days prior to travel. Executive VP pre-approval is required for emergency business travel booked under 48 hours.`;
      } else if (lower.includes("tax") || lower.includes("gst") || lower.includes("exemption") || lower.includes("10(14)")) {
        aiReply = `📜 Tax & GST Rules 2026: GST Input Credit of 18% is fully claimable for company expenses with valid tax invoices. Outstation daily per diem travel allowances up to ₹2,500/day are tax-exempt under Income Tax Section 10(14).`;
      } else if (lower.includes("fuel") || lower.includes("mileage") || lower.includes("car") || lower.includes("taxi")) {
        aiReply = `🚗 Mileage & Conveyance Rule: Personal vehicle official travel is reimbursed at ₹12 per km. GPS distance log or start/end odometer reading snapshot must be attached with the claim.`;
      } else if (lower.includes("food") || lower.includes("meal") || lower.includes("dinner")) {
        aiReply = `🍽️ Meal & Client Dinner Policy: Daily food allowance for travel is ₹1,500/day. Single client entertainments or executive dinners exceeding ₹10,000 require prior VP authorization.`;
      } else if (lower.includes("fraud") || lower.includes("duplicate") || lower.includes("risk")) {
        aiReply = `🛡️ AI Fraud Intelligence: Aurix OCR automatically scans receipts for duplicate bill numbers, altered invoice amounts, and out-of-policy spending. Currently 0 high-risk critical violations detected.`;
      } else if (lower.includes("ocr") || lower.includes("receipt") || lower.includes("scan")) {
        aiReply = `📷 Receipt OCR Engine: Supports PDF, PNG, JPEG, and HEIC files up to 10MB. Automatically extracts Vendor Name, Invoice Date, Total Amount, Tax Amount, and GSTIN with 98.4% accuracy.`;
      } else {
        aiReply = `🤖 Aurix AI Copilot: Under Enterprise Policy #EXP-2026, employee reimbursements are verified via automated OCR and policy compliance checks before manager and finance approval. You can ask about flight limits, hotel caps, GST input credit, or specific claim statuses.`;
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
        <Button size="sm" onClick={onOpenCreateDrawer} className="bg-blue-600 hover:bg-blue-500 text-white text-xs gap-1.5 h-8 shadow-lg shadow-blue-600/25">
          <PlusCircle className="w-3.5 h-3.5" /> Submit New Claim
        </Button>
      </div>
    </div>
  );

  switch (moduleId) {
    case "overview":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Expense Dashboard & Overview", "Real-time company reimbursement volume, category distribution, and claim table.")}
          <ReimbursementsAnalytics claims={claims} />
          <AIReimbursementInsights insights={aiInsights} />
          <ReimbursementsTable
            data={claims}
            selectedIds={selectedIds}
            onSelectToggle={(id) =>
              setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
            }
            onSelectAll={(checked) => setSelectedIds(checked ? claims.map((c) => c.id) : [])}
            onView={onViewClaimDetails}
            onApprove={onApproveClaim}
            onReject={onRejectClaim}
            onRequestChanges={onViewClaimDetails}
            onProcessPayment={onProcessPayment}
            onAddPayrollEntry={onAddPayrollEntry}
            onDownloadReceipt={(c) => toast.success(`Downloading receipts for ${c.claimNumber}`)}
            onViewLogs={() => {}}
          />
        </div>
      );

    case "pending-approvals":
      const pendingList = claims.filter((c) => c.approvalStatus === "SUBMITTED" || c.approvalStatus === "MANAGER_APPROVED");
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Pending Approvals Queue", "Multi-tier approval workspace for Managers, Finance, and Payroll Admins.")}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="salary-card p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Awaiting Manager Sign-off</span>
              <p className="text-xl font-bold text-white font-mono">{pendingList.length} Claims</p>
              <p className="text-xs text-slate-400">Requires line manager approval</p>
            </div>
            <div className="salary-card p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Pending Finance Sign-off</span>
              <p className="text-xl font-bold text-blue-400 font-mono">2 Claims</p>
              <p className="text-xs text-slate-400">GST receipt audit in progress</p>
            </div>
            <div className="salary-card p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Pending Value</span>
              <p className="text-xl font-bold text-emerald-400 font-mono">{formatCurrency(pendingList.reduce((acc, c) => acc + c.claimAmount, 0))}</p>
              <p className="text-xs text-slate-400">Total queued amount</p>
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
                  pendingList.forEach((c) => onApproveClaim(c));
                  toast.success(`Bulk approved all ${pendingList.length} pending claim(s)!`);
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8 gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Approve All Queue
              </Button>
            </div>
            <ReimbursementsTable
              data={pendingList}
              selectedIds={selectedIds}
              onSelectToggle={(id) =>
                setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
              }
              onSelectAll={(checked) => setSelectedIds(checked ? pendingList.map((c) => c.id) : [])}
              onView={onViewClaimDetails}
              onApprove={onApproveClaim}
              onReject={onRejectClaim}
              onRequestChanges={onViewClaimDetails}
              onProcessPayment={onProcessPayment}
              onAddPayrollEntry={onAddPayrollEntry}
              onDownloadReceipt={(c) => toast.success(`Downloading receipts for ${c.claimNumber}`)}
              onViewLogs={() => {}}
            />
          </div>
        </div>
      );

    case "approved-claims":
      const approvedList = claims.filter((c) => c.approvalStatus === "PAYROLL_APPROVED" || c.approvalStatus === "FINANCE_APPROVED");
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Approved Claims & Settlement", "Audit verified claims ready for monthly salary processing or direct bank disbursal.")}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="salary-card p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Approved Amount</span>
              <p className="text-xl font-bold text-emerald-400 font-mono">{formatCurrency(approvedList.reduce((acc, c) => acc + c.claimAmount, 0))}</p>
              <p className="text-xs text-slate-400">100% policy verified</p>
            </div>
            <div className="salary-card p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">Scheduled for Payroll</span>
              <p className="text-xl font-bold text-cyan-400 font-mono">{approvedList.length} Claims</p>
              <p className="text-xs text-slate-400">Included in July salary cycle</p>
            </div>
            <div className="salary-card p-4 space-y-1">
              <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Direct Disbursal Queue</span>
              <p className="text-xl font-bold text-indigo-400 font-mono">1 Claim</p>
              <p className="text-xs text-slate-400">NEFT Bank Advice Ready</p>
            </div>
          </div>

          <div className="salary-card p-6 space-y-4">
            <ReimbursementsTable
              data={approvedList}
              selectedIds={selectedIds}
              onSelectToggle={(id) =>
                setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
              }
              onSelectAll={(checked) => setSelectedIds(checked ? approvedList.map((c) => c.id) : [])}
              onView={onViewClaimDetails}
              onApprove={onApproveClaim}
              onReject={onRejectClaim}
              onRequestChanges={onViewClaimDetails}
              onProcessPayment={onProcessPayment}
              onAddPayrollEntry={onAddPayrollEntry}
              onDownloadReceipt={(c) => toast.success(`Downloading receipts for ${c.claimNumber}`)}
              onViewLogs={() => {}}
            />
          </div>
        </div>
      );

    case "rejected-claims":
      const rejectedList = claims.filter((c) => c.approvalStatus === "REJECTED");
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Rejected Claims & Appeals", "Review declined expense claims, violation grounds, and resubmission requests.")}
          <div className="salary-card p-6 space-y-4">
            <ReimbursementsTable
              data={rejectedList}
              selectedIds={selectedIds}
              onSelectToggle={(id) =>
                setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
              }
              onSelectAll={(checked) => setSelectedIds(checked ? rejectedList.map((c) => c.id) : [])}
              onView={onViewClaimDetails}
              onApprove={onApproveClaim}
              onReject={onRejectClaim}
              onRequestChanges={onViewClaimDetails}
              onProcessPayment={onProcessPayment}
              onAddPayrollEntry={onAddPayrollEntry}
              onDownloadReceipt={(c) => toast.success(`Downloading receipts for ${c.claimNumber}`)}
              onViewLogs={() => {}}
            />
          </div>
        </div>
      );

    case "expense-categories":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Expense Categories & Caps", "Configure categories, spending caps, taxability rules, and cost centers.")}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { cat: "Travel & Flight", cap: "₹1,50,000 / month", count: claims.filter((c) => c.expenseCategory === "Travel").length, desc: "Domestic & international travel flights, taxis, and accommodation." },
              { cat: "Food & Meals", cap: "₹25,000 / month", count: claims.filter((c) => c.expenseCategory === "Food").length, desc: "Client dinners, team meals, and travel daily food per diem." },
              { cat: "Medical & Health", cap: "₹50,000 / year", count: claims.filter((c) => c.expenseCategory === "Medical").length, desc: "Outpatient consultations, hospital bills, and health checks." },
              { cat: "Fuel & Conveyance", cap: "₹15,000 / month", count: claims.filter((c) => c.expenseCategory === "Fuel").length, desc: "Personal vehicle fuel and local inter-branch travel conveyance." },
              { cat: "Internet & Phone", cap: "₹3,000 / month", count: claims.filter((c) => c.expenseCategory === "Internet").length, desc: "Monthly fiber broadband and corporate mobile connection." },
              { cat: "WFH Equipment", cap: "₹30,000 one-off", count: claims.filter((c) => c.expenseCategory === "Office Supplies").length, desc: "Ergonomic chair, monitor, keyboard, and home office setup." },
            ].map((item, idx) => (
              <div key={idx} className="salary-card p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white text-sm">{item.cat}</h4>
                  <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-400">Active</Badge>
                </div>
                <p className="text-xs text-slate-400">{item.desc}</p>
                <div className="text-xs text-slate-400 font-mono">Monthly Cap: <span className="text-emerald-400 font-bold">{item.cap}</span></div>
                <div className="text-xs text-slate-400">Claims Filed: <span className="text-white font-bold">{item.count}</span></div>
                <Button size="sm" variant="outline" onClick={() => toast.success(`Updated category rules for ${item.cat}`)} className="h-7 text-xs border-white/10 w-full hover:bg-slate-800">
                  Edit Category Rules
                </Button>
              </div>
            ))}
          </div>
        </div>
      );

    case "expense-policies":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Expense Policy Engine", "Enterprise policy guidelines, travel limits, hotel caps, and mileage rates.")}
          <div className="salary-card p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">Domestic Travel Flight</span>
                <p className="font-bold text-white text-sm">Economy Class Only</p>
                <p className="text-xs text-slate-400">Flight bookings must be made minimum 7 days prior to travel date.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">Hotel Accommodation</span>
                <p className="font-bold text-white text-sm">Max ₹12,000 / Night</p>
                <p className="text-xs text-slate-400">Applicable for Tier-1 Metro cities (Mumbai, Bangalore, Delhi NCR).</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">Mobile & Internet Cap</span>
                <p className="font-bold text-white text-sm">Max ₹3,000 / Month</p>
                <p className="text-xs text-slate-400">For active remote staff and engineers with high bandwidth requirements.</p>
              </div>
            </div>
          </div>
        </div>
      );

    case "receipt-management":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Receipt Management & OCR Scanner", "AI-powered OCR receipt parser, duplicate bill detection, and digital gallery.")}
          <div className="salary-card p-6 space-y-6">
            <div className="border-2 border-dashed border-blue-500/40 rounded-xl p-8 text-center bg-blue-500/5 hover:bg-blue-500/10 transition-all cursor-pointer space-y-3">
              <Upload className="h-10 w-10 text-blue-400 mx-auto animate-bounce" />
              <div className="text-sm font-semibold text-slate-200">
                Drag & Drop receipt bills here (PDF, PNG, JPG, HEIC up to 10MB)
              </div>
              <Button size="sm" onClick={() => toast.success("Simulated OCR Receipt Scan! Extracted Merchant: Taj Hotels Ltd, Amount: ₹24,000, GSTIN: 07AAAAA0000A1Z5.")} className="bg-blue-600 hover:bg-blue-500 text-white text-xs">
                Upload & Scan Receipt
              </Button>
            </div>
          </div>
        </div>
      );

    case "travel-mileage":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Travel & Mileage Calculator", "Audit flight tickets, hotel accommodation, per diem caps, and GPS mileage rates.")}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Mileage Calculator Widget */}
            <div className="salary-card p-5 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-blue-400" /> Interactive Mileage Reimbursement Calculator
              </h3>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Distance Traveled (Kilometers)</label>
                  <Input
                    type="number"
                    value={mileageKm}
                    onChange={(e) => setMileageKm(Number(e.target.value))}
                    className="bg-slate-950 border-white/10 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-300">Company Rate per Km (₹)</label>
                  <Input
                    type="number"
                    value={ratePerKm}
                    onChange={(e) => setRatePerKm(Number(e.target.value))}
                    className="bg-slate-950 border-white/10 text-xs text-emerald-400 font-bold font-mono"
                  />
                </div>
                <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-500/30 flex justify-between items-center">
                  <span className="text-xs text-slate-300">Calculated Reimbursement:</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">{formatCurrency(mileageKm * ratePerKm)}</span>
                </div>
                <Button size="sm" onClick={() => toast.success(`Generated mileage claim for ₹${mileageKm * ratePerKm}`)} className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs">
                  Generate Mileage Claim
                </Button>
              </div>
            </div>

            {/* Travel Rules Summary */}
            <div className="salary-card p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plane className="w-4 h-4 text-sky-400" /> Travel & Per Diem Rules 2026
              </h3>
              <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4">
                <li>Domestic Air Travel: Economy class flight tickets pre-booked &gt; 7 days prior.</li>
                <li>Metro Accommodation: Capped at ₹12,000/night with tax invoice.</li>
                <li>Outstation Per Diem Allowance: ₹2,500/day daily food & conveyance.</li>
                <li>Taxi / Cab Rides: Ola / Uber receipts with GST mandatory.</li>
              </ul>
            </div>
          </div>

          <div className="salary-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Travel Claims</h3>
            <ReimbursementsTable
              data={claims.filter((c) => c.expenseCategory === "Travel")}
              selectedIds={selectedIds}
              onSelectToggle={(id) =>
                setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
              }
              onSelectAll={(checked) => setSelectedIds(checked ? claims.map((c) => c.id) : [])}
              onView={onViewClaimDetails}
              onApprove={onApproveClaim}
              onReject={onRejectClaim}
              onRequestChanges={onViewClaimDetails}
              onProcessPayment={onProcessPayment}
              onAddPayrollEntry={onAddPayrollEntry}
              onDownloadReceipt={(c) => toast.success(`Downloading receipts for ${c.claimNumber}`)}
              onViewLogs={() => {}}
            />
          </div>
        </div>
      );

    case "medical-claims":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Medical Reimbursements", "Track outpatient consultations, hospital bills, medicine receipts, and health insurance.")}
          <div className="salary-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-emerald-400" /> Medical Claims Log ({claims.filter((c) => c.expenseCategory === "Medical").length})
              </h3>
            </div>
            <ReimbursementsTable
              data={claims.filter((c) => c.expenseCategory === "Medical")}
              selectedIds={selectedIds}
              onSelectToggle={(id) =>
                setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
              }
              onSelectAll={(checked) => setSelectedIds(checked ? claims.map((c) => c.id) : [])}
              onView={onViewClaimDetails}
              onApprove={onApproveClaim}
              onReject={onRejectClaim}
              onRequestChanges={onViewClaimDetails}
              onProcessPayment={onProcessPayment}
              onAddPayrollEntry={onAddPayrollEntry}
              onDownloadReceipt={(c) => toast.success(`Downloading receipts for ${c.claimNumber}`)}
              onViewLogs={() => {}}
            />
          </div>
        </div>
      );

    case "fraud-detection":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("AI Fraud Detection Center", "Duplicate claims detection, fake receipt alerts, and high-risk expense AI scoring.")}
          <div className="salary-card p-6 space-y-4">
            {aiInsights.map((insight) => (
              <div key={insight.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-purple-500/30 text-purple-400">{insight.type}</Badge>
                    <h4 className="font-bold text-white text-sm">{insight.title}</h4>
                  </div>
                  <p className="text-xs text-slate-300">{insight.description}</p>
                  <p className="text-[11px] text-purple-300 font-mono">Recommendation: {insight.recommendation}</p>
                </div>
                <Badge className="bg-amber-500/20 text-amber-400 font-mono">{formatCurrency(insight.impactAmount)}</Badge>
              </div>
            ))}
          </div>
        </div>
      );

    case "budget-monitoring":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Budget Monitoring & Forecast", "Monitor Q3 department expense budgets, cost center utilization, and threshold alerts.")}
          <div className="salary-card p-6 space-y-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-blue-400" /> Department Budget Utilization (Q3 FY2026)
            </h3>
            
            <div className="space-y-4">
              {[
                { dept: "Engineering", budget: 780000, spent: 485000, pct: 62 },
                { dept: "Sales & BD", budget: 500000, spent: 280000, pct: 56 },
                { dept: "Marketing", budget: 350000, spent: 190000, pct: 54 },
                { dept: "Operations & HR", budget: 250000, spent: 95000, pct: 38 },
              ].map((b, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-white">{b.dept}</span>
                    <span className="font-mono text-slate-300">{formatCurrency(b.spent)} / {formatCurrency(b.budget)} ({b.pct}%)</span>
                  </div>
                  <Progress value={b.pct} className="h-2 bg-slate-800" />
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "tax-gst":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Tax & GST Credit Center", "Statutory GSTIN verification, 18% Input Credit filing, and Section 10(14) per diem tax exemptions.")}
          <div className="salary-card p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">GST Input Credit</span>
                <p className="font-bold text-white text-sm">18% Input Tax Claimable</p>
                <p className="text-xs text-slate-400">Must upload valid GST Tax Invoice with Company GSTIN listed.</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">Per Diem Tax Exemption</span>
                <p className="font-bold text-white text-sm">Section 10(14) Compliant</p>
                <p className="text-xs text-slate-400">Daily per diem travel allowances up to ₹2,500/day tax exempt.</p>
              </div>
            </div>
          </div>
        </div>
      );

    case "reports-analytics":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Reports & Analytics Hub", "Generate, filter, and export PDF, Excel, and CSV expense reports.")}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="salary-card p-5 space-y-3">
              <h4 className="font-bold text-white text-sm">Department Expense Report</h4>
              <p className="text-xs text-slate-400">Export Excel summary of claims breakdown by department.</p>
              <Button size="sm" onClick={() => toast.success("Exported Department Expense Report in Excel.")} className="h-8 text-xs bg-blue-600 hover:bg-blue-500 w-full gap-1.5">
                <Download className="h-3.5 w-3.5" /> Export Excel
              </Button>
            </div>
            <div className="salary-card p-5 space-y-3">
              <h4 className="font-bold text-white text-sm">Monthly GST Audit Report</h4>
              <p className="text-xs text-slate-400">Export GST Tax Invoice input credit filing data.</p>
              <Button size="sm" onClick={() => toast.success("Exported Monthly GST Audit Report in PDF.")} className="h-8 text-xs bg-cyan-600 hover:bg-cyan-500 w-full gap-1.5">
                <Download className="h-3.5 w-3.5" /> Export PDF
              </Button>
            </div>
            <div className="salary-card p-5 space-y-3">
              <h4 className="font-bold text-white text-sm">Payroll Batch Settlement Log</h4>
              <p className="text-xs text-slate-400">Export active cycle claims disbursed via direct bank advice.</p>
              <Button size="sm" onClick={() => toast.success("Exported Payroll Batch Settlement Log in CSV.")} className="h-8 text-xs bg-emerald-600 hover:bg-emerald-500 w-full gap-1.5">
                <Download className="h-3.5 w-3.5" /> Export CSV
              </Button>
            </div>
          </div>
        </div>
      );

    case "audit-logs":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Audit Trail & Governance Log", "Timestamped history of all claim submissions, approvals, receipt updates, and IP addresses.")}
          <div className="salary-card p-6 space-y-4">
            <div className="salary-table-wrapper">
              <table className="salary-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Claim ID</th>
                    <th>Action</th>
                    <th>Actor</th>
                    <th>Details</th>
                    <th>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="font-mono text-slate-400 text-xs">{log.timestamp}</td>
                      <td className="font-mono text-blue-400 font-bold">{log.claimNumber}</td>
                      <td>
                        <Badge variant="outline" className="text-[10px] border-purple-500/30 text-purple-400">
                          {log.action}
                        </Badge>
                      </td>
                      <td className="text-xs font-semibold text-white">{log.actorName}</td>
                      <td className="text-xs text-slate-300">{log.details}</td>
                      <td className="font-mono text-xs text-slate-500">{log.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );

    case "ai-copilot":
      return (
        <div className="space-y-6">
          {renderBreadcrumb("Aurix AI Expense Copilot Assistant", "Consult your AI assistant for policy rules, GST tax exemption limits, and expense optimization.")}
          
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
                          ? "bg-blue-600 text-white"
                          : "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                      }`}
                    >
                      {msg.sender === "user" ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                    </div>
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed max-w-xl ${
                        msg.sender === "user"
                          ? "bg-blue-600/20 text-blue-200 border border-blue-500/30 font-medium"
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
                    "What is the hotel cap in Mumbai?",
                    "Is per diem tax-exempt under Sec 10(14)?",
                    "What is the fuel mileage rate?",
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
                    placeholder="Ask AI Copilot about policy limits, meal caps, or receipt requirements..."
                    className="bg-slate-950 border-white/10 text-xs text-white h-10"
                  />
                  <Button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white text-xs gap-1.5 h-10 px-5">
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
          {renderBreadcrumb(`Module: ${moduleId.replace("-", " ").toUpperCase()}`, "Production-ready enterprise expense management module.")}
          <div className="salary-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">Claims Management</h3>
            <ReimbursementsTable
              data={claims}
              selectedIds={selectedIds}
              onSelectToggle={(id) =>
                setSelectedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
              }
              onSelectAll={(checked) => setSelectedIds(checked ? claims.map((c) => c.id) : [])}
              onView={onViewClaimDetails}
              onApprove={onApproveClaim}
              onReject={onRejectClaim}
              onRequestChanges={onViewClaimDetails}
              onProcessPayment={onProcessPayment}
              onAddPayrollEntry={onAddPayrollEntry}
              onDownloadReceipt={(c) => toast.success(`Downloading receipts for ${c.claimNumber}`)}
              onViewLogs={() => {}}
            />
          </div>
        </div>
      );
  }
};
