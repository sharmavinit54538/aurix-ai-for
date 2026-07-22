import React from "react";
import {
  LayoutDashboard,
  ShieldCheck,
  Percent,
  Receipt,
  Building2,
  Scale,
  Award,
  DollarSign,
  MapPin,
  FileSpreadsheet,
  FileCheck,
  Calendar,
  FolderLock,
  History,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type ComplianceTabKey =
  | "overview"
  | "pf"
  | "esi"
  | "pt"
  | "tds"
  | "lwf"
  | "gratuity"
  | "bonus"
  | "minimum_wage"
  | "state"
  | "reports"
  | "filings"
  | "calendar"
  | "docs"
  | "audit";

interface CategoryItem {
  id: ComplianceTabKey;
  label: string;
  subtext: string;
  icon: React.ElementType;
}

const CATEGORIES: CategoryItem[] = [
  { id: "overview", label: "Overview", subtext: "Compliance score & alerts", icon: LayoutDashboard },
  { id: "pf", label: "PF Management", subtext: "UAN, ECR & monthly returns", icon: ShieldCheck },
  { id: "esi", label: "ESI Management", subtext: "IP return & eligibility", icon: Percent },
  { id: "pt", label: "Professional Tax", subtext: "State PT slabs & returns", icon: Receipt },
  { id: "tds", label: "Income Tax (TDS)", subtext: "Challan 281 & Form 24Q", icon: Building2 },
  { id: "lwf", label: "Labour Welfare Fund", subtext: "State LWF rules & filings", icon: Scale },
  { id: "gratuity", label: "Gratuity Act", subtext: "Liability & settlements", icon: Award },
  { id: "bonus", label: "Bonus Compliance", subtext: "Annual bonus Form A/B/C", icon: DollarSign },
  { id: "minimum_wage", label: "Minimum Wage", subtext: "Role & state validation", icon: MapPin },
  { id: "state", label: "State Compliance", subtext: "Multi-state statutory rules", icon: Building2 },
  { id: "reports", label: "Statutory Reports", subtext: "Downloadable filings & data", icon: FileSpreadsheet },
  { id: "filings", label: "Government Filings", subtext: "TRRN & ECR receipts", icon: FileCheck },
  { id: "calendar", label: "Compliance Calendar", subtext: "Filing due date reminders", icon: Calendar },
  { id: "docs", label: "Document Repository", subtext: "Challans, returns & certificates", icon: FolderLock },
  { id: "audit", label: "Audit Logs", subtext: "Compliance action history", icon: History },
];

interface ComplianceSidebarProps {
  activeTab: ComplianceTabKey;
  onSelectTab: (id: ComplianceTabKey) => void;
}

export const ComplianceSidebar: React.FC<ComplianceSidebarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <div className="w-full lg:w-72 flex-shrink-0 p-3 rounded-2xl bg-card/60 border border-border/50 backdrop-blur-md space-y-1 shadow-lg">
      <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/40 mb-1">
        Statutory Modules
      </div>

      <nav className="space-y-0.5 max-h-[75vh] overflow-y-auto pr-1">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectTab(cat.id)}
              className={cn(
                "w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-200 group text-xs",
                isActive
                  ? "bg-gradient-to-r from-emerald-500/15 via-emerald-500/10 to-transparent text-emerald-400 font-semibold border border-emerald-500/30 shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={cn(
                    "h-7 w-7 rounded-lg flex items-center justify-center border transition-colors",
                    isActive
                      ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                      : "bg-muted/40 border-border/40 text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="truncate">
                  <div className="truncate font-medium">{cat.label}</div>
                  <div className="text-[10px] text-muted-foreground/80 truncate font-normal">
                    {cat.subtext}
                  </div>
                </div>
              </div>

              <ChevronRight
                className={cn(
                  "h-3.5 w-3.5 transition-transform opacity-60",
                  isActive ? "text-emerald-400 translate-x-0.5 opacity-100" : "group-hover:translate-x-0.5"
                )}
              />
            </button>
          );
        })}
      </nav>
    </div>
  );
};
