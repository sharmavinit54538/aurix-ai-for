import React from "react";
import {
  LayoutDashboard,
  Layers,
  TrendingUp,
  Coins,
  MinusCircle,
  Building,
  HeartHandshake,
  Receipt,
  ShieldCheck,
  History,
  Users,
  CheckSquare,
  FileSpreadsheet,
} from "lucide-react";
import { SidebarTabId } from "./salaryStructureTypes";

interface SalaryStructureSidebarTabsProps {
  activeTab: SidebarTabId;
  onTabChange: (tab: SidebarTabId) => void;
  counts?: Partial<Record<SidebarTabId, number>>;
}

export const SalaryStructureSidebarTabs: React.FC<SalaryStructureSidebarTabsProps> = ({
  activeTab,
  onTabChange,
  counts = {},
}) => {
  const navItems: { id: SidebarTabId; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "templates", label: "Salary Templates", icon: Layers, badge: "4" },
    { id: "earnings", label: "Earnings", icon: TrendingUp },
    { id: "allowances", label: "Allowances", icon: Coins },
    { id: "deductions", label: "Deductions", icon: MinusCircle },
    { id: "employer_contributions", label: "Employer Contributions", icon: Building },
    { id: "benefits", label: "Benefits & Perks", icon: HeartHandshake },
    { id: "tax_components", label: "Tax Components", icon: Receipt },
    { id: "compliance_rules", label: "Compliance Rules", icon: ShieldCheck, badge: "New" },
    { id: "version_history", label: "Version History", icon: History },
    { id: "assignments", label: "Assignments", icon: Users },
    { id: "approval_workflow", label: "Approval Workflow", icon: CheckSquare },
    { id: "audit_logs", label: "Audit Logs", icon: FileSpreadsheet },
  ];

  return (
    <div className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-1.5 p-3 rounded-xl bg-slate-900/60 border border-white/5 h-fit">
      <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
        Structure Sections
      </div>

      <div className="flex flex-col gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`sidebar-tab-button ${isActive ? "active" : ""}`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
              <span className="flex-1 truncate text-left">{item.label}</span>
              {item.badge && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-400 border border-white/10"
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
