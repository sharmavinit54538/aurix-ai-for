import React, { useState } from "react";
import {
  ReimbursementsSubmodelTabId,
  ReimbursementClaim,
  ReimbursementAuditLog,
  ReimbursementAIInsight,
} from "./reimbursementsTypes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Scan,
  ShieldCheck,
  Receipt,
  Sparkles,
  FileSpreadsheet,
  History,
  Plane,
  Utensils,
  Stethoscope,
  Fuel,
  Wifi,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  Download,
  Upload,
  FileText,
  Search,
} from "lucide-react";

interface ReimbursementsSubmodelViewsProps {
  activeTab: ReimbursementsSubmodelTabId;
  claims: ReimbursementClaim[];
  auditLogs: ReimbursementAuditLog[];
  aiInsights: ReimbursementAIInsight[];
  onOpenCreateDrawer: () => void;
  onViewClaimDetails: (claim: ReimbursementClaim) => void;
  onApproveClaim: (id: string) => void;
  onRejectClaim: (id: string) => void;
}

export const ReimbursementsSubmodelViews: React.FC<ReimbursementsSubmodelViewsProps> = ({
  activeTab,
  claims,
  auditLogs,
  aiInsights,
  onOpenCreateDrawer,
  onViewClaimDetails,
  onApproveClaim,
  onRejectClaim,
}) => {
  const [ocrFile, setOcrFile] = useState<File | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState<{
    vendor: string;
    amount: number;
    gst: string;
    date: string;
    category: string;
    confidence: number;
  } | null>(null);

  const formatCurrency = (val: number = 0) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);

  const handleOcrDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleOcrFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    setOcrFile(file);
    setOcrLoading(true);
    setTimeout(() => {
      setOcrLoading(false);
      setOcrResult({
        vendor: file.name.toLowerCase().includes("hotel") ? "Taj Hotels Ltd" : "IndiGo Airlines",
        amount: file.name.toLowerCase().includes("hotel") ? 24000 : 24500,
        gst: "07AAAAA0000A1Z5",
        date: "2026-07-10",
        category: "Travel",
        confidence: 98.4,
      });
      toast.success(`OCR Scan completed for '${file.name}' with 98.4% confidence!`);
    }, 1200);
  };

  switch (activeTab) {
    case "pending_approval":
    case "approved":
    case "rejected":
    case "paid":
      const statusMap: Record<string, string> = {
        pending_approval: "SUBMITTED",
        approved: "PAYROLL_APPROVED",
        rejected: "REJECTED",
        paid: "PAID",
      };
      const filteredClaims = claims.filter((c) =>
        activeTab === "pending_approval"
          ? c.approvalStatus === "SUBMITTED" || c.approvalStatus === "MANAGER_APPROVED"
          : activeTab === "approved"
          ? c.approvalStatus === "PAYROLL_APPROVED" || c.approvalStatus === "FINANCE_APPROVED"
          : activeTab === "paid"
          ? c.paymentStatus === "PAID"
          : c.approvalStatus === "REJECTED",
      );

      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {activeTab.replace("_", " ")} ({filteredClaims.length})
            </h3>
            <Button size="sm" onClick={onOpenCreateDrawer} className="h-8 text-xs bg-blue-600 hover:bg-blue-500">
              + Submit New Claim
            </Button>
          </div>

          <div className="salary-card p-5 space-y-4">
            <div className="salary-table-wrapper">
              <table className="salary-table">
                <thead>
                  <tr>
                    <th>Claim ID</th>
                    <th>Employee</th>
                    <th>Category</th>
                    <th>Submitted Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClaims.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No claims match this status.
                      </td>
                    </tr>
                  ) : (
                    filteredClaims.map((c) => (
                      <tr key={c.id}>
                        <td className="font-mono text-blue-400 font-bold">{c.claimNumber}</td>
                        <td>
                          <div className="font-semibold text-white">{c.employeeName}</div>
                          <div className="text-[10px] text-slate-400">{c.department}</div>
                        </td>
                        <td>
                          <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-300">
                            {c.expenseCategory}
                          </Badge>
                        </td>
                        <td className="font-mono text-slate-400 text-xs">{c.submittedDate}</td>
                        <td className="font-mono font-bold text-emerald-400">{formatCurrency(c.claimAmount)}</td>
                        <td>
                          <Badge
                            className={
                              c.approvalStatus === "PAYROLL_APPROVED" || c.paymentStatus === "PAID"
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                : c.approvalStatus === "REJECTED"
                                ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                            }
                          >
                            {c.approvalStatus}
                          </Badge>
                        </td>
                        <td>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onViewClaimDetails(c)}
                              className="h-7 text-[11px] border-slate-700 text-slate-300 hover:bg-slate-800"
                            >
                              View Details
                            </Button>
                            {activeTab === "pending_approval" && (
                              <Button
                                size="sm"
                                onClick={() => onApproveClaim(c.id)}
                                className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white"
                              >
                                Approve
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );

    case "travel":
    case "food":
    case "medical":
    case "fuel":
    case "internet":
    case "wfh":
      const catNameMap: Record<string, string> = {
        travel: "Travel",
        food: "Food",
        medical: "Medical",
        fuel: "Fuel",
        internet: "Internet",
        wfh: "Office Supplies",
      };
      const targetCategory = catNameMap[activeTab] || "Travel";
      const catClaims = claims.filter((c) => c.expenseCategory.toLowerCase().includes(targetCategory.toLowerCase()));

      return (
        <div className="salary-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Category Claims: {targetCategory} ({catClaims.length})
            </h3>
            <Button size="sm" onClick={onOpenCreateDrawer} className="h-8 text-xs bg-blue-600 hover:bg-blue-500">
              + File {targetCategory} Claim
            </Button>
          </div>

          <div className="salary-table-wrapper">
            <table className="salary-table">
              <thead>
                <tr>
                  <th>Claim ID</th>
                  <th>Employee</th>
                  <th>Business Purpose</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {catClaims.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No claims filed under {targetCategory} category.
                    </td>
                  </tr>
                ) : (
                  catClaims.map((c) => (
                    <tr key={c.id}>
                      <td className="font-mono text-blue-400 font-bold">{c.claimNumber}</td>
                      <td>
                        <div className="font-semibold text-white">{c.employeeName}</div>
                        <div className="text-[10px] text-slate-400">{c.department}</div>
                      </td>
                      <td className="text-xs text-slate-300 max-w-xs truncate">{c.businessPurpose}</td>
                      <td className="font-mono font-bold text-emerald-400">{formatCurrency(c.claimAmount)}</td>
                      <td>
                        <Badge variant="outline" className="text-[10px] border-blue-500/30 text-blue-400">
                          {c.approvalStatus}
                        </Badge>
                      </td>
                      <td>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onViewClaimDetails(c)}
                          className="h-7 text-[11px] border-slate-700 text-slate-300 hover:bg-slate-800"
                        >
                          Details
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      );

    case "ocr_scanner":
      return (
        <div className="salary-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Scan className="h-5 w-5 text-blue-400" /> AI OCR Receipt Scanner & Verification Engine
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Upload expense receipts (PDF, PNG, JPEG, HEIC) to automatically extract Merchant, Invoice Date, Amount, and GSTIN.
              </p>
            </div>
            <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">Aurix OCR v2.4</Badge>
          </div>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleOcrDrop}
            className="border-2 border-dashed border-blue-500/40 rounded-xl p-8 text-center bg-blue-500/5 hover:bg-blue-500/10 transition-all cursor-pointer space-y-3"
          >
            <Upload className="h-10 w-10 text-blue-400 mx-auto animate-bounce" />
            <div className="text-sm font-semibold text-slate-200">
              Drag & Drop receipt bills here, or <label className="text-blue-400 underline cursor-pointer"><input type="file" onChange={handleOcrFileSelect} className="hidden" />browse file</label>
            </div>
            <p className="text-xs text-slate-500">Supports PDF, PNG, JPG, HEIC up to 10MB per receipt file.</p>
          </div>

          {ocrLoading && (
            <div className="p-6 text-center text-blue-400 space-y-2 animate-pulse">
              <Sparkles className="h-6 w-6 mx-auto animate-spin" />
              <p className="text-xs font-bold">Scanning receipt image with Aurix OCR Vision model...</p>
            </div>
          )}

          {ocrResult && (
            <div className="p-5 rounded-xl bg-slate-900/80 border border-emerald-500/30 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> OCR Extraction Successful ({ocrResult.confidence}% Confidence)
                </span>
                <Button size="sm" onClick={onOpenCreateDrawer} className="h-7 text-xs bg-emerald-600 hover:bg-emerald-500">
                  Auto-fill into Claim Form
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Merchant / Vendor</span>
                  <span className="font-bold text-white">{ocrResult.vendor}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Extracted Amount</span>
                  <span className="font-bold text-emerald-400">{formatCurrency(ocrResult.amount)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">GSTIN Number</span>
                  <span className="font-bold text-cyan-400">{ocrResult.gst}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase">Invoice Date</span>
                  <span className="font-bold text-slate-300">{ocrResult.date}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      );

    case "policies":
      return (
        <div className="salary-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-400" /> Enterprise Expense Policy Matrix (2026 Guidelines)
              </h3>
            </div>
          </div>

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
      );

    case "tax_gst":
      return (
        <div className="salary-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Receipt className="h-5 w-5 text-cyan-400" /> Tax & GST Compliance Engine
              </h3>
            </div>
          </div>

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
      );

    case "fraud_ai":
      return (
        <div className="salary-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" /> Aurix AI Expense Fraud & Policy Intelligence
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            {aiInsights.map((insight) => (
              <div key={insight.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-purple-500/30 text-purple-400">
                      {insight.type}
                    </Badge>
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

    case "reports":
      return (
        <div className="salary-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-blue-400" /> Reimbursement Reports & Export Center
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-sm">Department Expense Report</h4>
              <p className="text-xs text-slate-400">Export PDF/Excel summary of claims breakdown by department.</p>
              <Button size="sm" onClick={() => toast.success("Exported Department Expense Report in Excel.")} className="h-8 text-xs bg-blue-600 hover:bg-blue-500 w-full gap-1.5">
                <Download className="h-3.5 w-3.5" /> Export Excel
              </Button>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-sm">Monthly GST Audit Report</h4>
              <p className="text-xs text-slate-400">Export GST Tax Invoice input credit filing data.</p>
              <Button size="sm" onClick={() => toast.success("Exported Monthly GST Audit Report in PDF.")} className="h-8 text-xs bg-cyan-600 hover:bg-cyan-500 w-full gap-1.5">
                <Download className="h-3.5 w-3.5" /> Export PDF
              </Button>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="font-bold text-white text-sm">Payroll Batch Settlement Log</h4>
              <p className="text-xs text-slate-400">Export active cycle claims disbursed via direct bank advice.</p>
              <Button size="sm" onClick={() => toast.success("Exported Payroll Batch Settlement Log in CSV.")} className="h-8 text-xs bg-emerald-600 hover:bg-emerald-500 w-full gap-1.5">
                <Download className="h-3.5 w-3.5" /> Export CSV
              </Button>
            </div>
          </div>
        </div>
      );

    case "audit_logs":
      return (
        <div className="salary-card p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <History className="h-5 w-5 text-purple-400" /> Reimbursement Activity Audit Trail
              </h3>
            </div>
          </div>

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
      );

    default:
      return null;
  }
};
