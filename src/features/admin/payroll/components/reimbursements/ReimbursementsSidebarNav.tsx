import React from "react";
import {
  LayoutDashboard,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  CreditCard,
  Plane,
  Utensils,
  Stethoscope,
  Fuel,
  Wifi,
  Laptop,
  ShieldCheck,
  Receipt,
  Scan,
  Sparkles,
  FileSpreadsheet,
  History,
} from "lucide-react";
import { ReimbursementsSubmodelTabId } from "./reimbursementsTypes";

interface ReimbursementsSidebarNavProps {
  activeTab: ReimbursementsSubmodelTabId;
  onTabChange: (tab: ReimbursementsSubmodelTabId) => void;
  counts?: Partial<Record<string, number>>;
}

export const ReimbursementsSidebarNav: React.FC<ReimbursementsSidebarNavProps> = ({
  activeTab,
  onTabChange,
  counts = {},
}) => {
  const mainNav: { id: ReimbursementsSubmodelTabId; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "create_claim", label: "Create Claim", icon: PlusCircle },
    { id: "pending_approval", label: "Pending Approval", icon: Clock, badge: counts.pending ? String(counts.pending) : "3" },
    { id: "approved", label: "Approved Claims", icon: CheckCircle2, badge: counts.approved ? String(counts.approved) : "2" },
    { id: "rejected", label: "Rejected Claims", icon: XCircle },
    { id: "paid", label: "Paid Claims", icon: CreditCard },
  ];

  const categoryNav: { id: ReimbursementsSubmodelTabId; label: string; icon: React.ElementType }[] = [
    { id: "travel", label: "Travel & Flight", icon: Plane },
    { id: "food", label: "Food & Meals", icon: Utensils },
    { id: "medical", label: "Medical & Health", icon: Stethoscope },
    { id: "fuel", label: "Fuel & Mileage", icon: Fuel },
    { id: "internet", label: "Internet & Phone", icon: Wifi },
    { id: "wfh", label: "WFH Equipment", icon: Laptop },
  ];

  const toolsNav: { id: ReimbursementsSubmodelTabId; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: "policies", label: "Expense Policy Rules", icon: ShieldCheck },
    { id: "tax_gst", label: "Tax & GST Rules", icon: Receipt },
    { id: "ocr_scanner", label: "OCR Receipt Scanner", icon: Scan, badge: "AI" },
    { id: "fraud_ai", label: "Fraud & Risk Hub", icon: Sparkles, badge: "Alerts" },
    { id: "reports", label: "Reports & Analytics", icon: FileSpreadsheet },
    { id: "audit_logs", label: "Audit Logs", icon: History },
  ];

  const renderNavSection = (
    title: string,
    items: { id: ReimbursementsSubmodelTabId; label: string; icon: React.ElementType; badge?: string }[],
  ) => (
    <div className="space-y-1">
      <div className="px-3 py-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
        {title}
      </div>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left ${
              isActive
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
            }`}
          >
            <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
            <span className="flex-1 truncate">{item.label}</span>
            {item.badge && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-400 border border-white/10"
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-4 p-3 rounded-xl bg-slate-900/60 border border-white/5 h-fit">
      {renderNavSection("Main Workflow", mainNav)}
      {renderNavSection("Expense Categories", categoryNav)}
      {renderNavSection("Policy & Intelligence", toolsNav)}
    </div>
  );
};
