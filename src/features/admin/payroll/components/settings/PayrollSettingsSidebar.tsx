import React, { useState, useMemo } from "react";
import {
  Building2,
  Calendar,
  Layers,
  Receipt,
  Percent,
  Clock,
  Landmark,
  ShieldCheck,
  GitPullRequest,
  Bell,
  FileText,
  Lock,
  Coins,
  ChevronRight,
  ChevronDown,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type SettingsCategoryKey =
  | "general"
  | "cycle"
  | "components"
  | "allowances"
  | "taxes"
  | "overtime"
  | "loans"
  | "banking"
  | "compliance"
  | "approval"
  | "automation"
  | "templates"
  | "security";

interface CategoryItem {
  id: SettingsCategoryKey;
  label: string;
  subtext: string;
  icon: React.ElementType;
  shortcut?: string;
}

interface CategoryGroup {
  title: string;
  items: CategoryItem[];
}

const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    title: "Core Settings",
    items: [
      { id: "general", label: "General Settings", subtext: "Company, currency, payment date", icon: Building2, shortcut: "1" },
      { id: "cycle", label: "Payroll Cycle", subtext: "Frequency, cutoff & grace period", icon: Calendar, shortcut: "2" },
      { id: "components", label: "Salary Components", subtext: "Basic, HRA & allowances breakup", icon: Layers, shortcut: "3" },
      { id: "allowances", label: "Allowances & Deductions", subtext: "Taxable & non-taxable rules", icon: Coins, shortcut: "4" },
    ],
  },
  {
    title: "Compliance & Tax",
    items: [
      { id: "taxes", label: "Taxes & Statutory", subtext: "PF, ESI, PT & Tax Regimes", icon: Percent, shortcut: "5" },
      { id: "overtime", label: "Overtime & Bonuses", subtext: "Multipliers & spot awards", icon: Clock, shortcut: "6" },
      { id: "loans", label: "Encashment & Loans", subtext: "Leave encashment & EMI recovery", icon: Receipt, shortcut: "7" },
      { id: "banking", label: "Banking & Disbursement", subtext: "IFSC, NEFT/RTGS gateway", icon: Landmark, shortcut: "8" },
    ],
  },
  {
    title: "Advanced",
    items: [
      { id: "compliance", label: "Compliance & Statutory", subtext: "LWF, Form 16 & statutory rules", icon: ShieldCheck, shortcut: "9" },
      { id: "approval", label: "Approval Workflows", subtext: "Multi-level sign-off rules", icon: GitPullRequest, shortcut: "0" },
      { id: "automation", label: "Notifications & Automation", subtext: "Auto-payslip & email triggers", icon: Bell },
      { id: "templates", label: "Document Templates", subtext: "Payslip & Form 16 layouts", icon: FileText },
      { id: "security", label: "Security & Audit Logs", subtext: "RBAC & settings change history", icon: Lock },
    ],
  },
];

interface PayrollSettingsSidebarProps {
  activeCategory: SettingsCategoryKey;
  onSelectCategory: (id: SettingsCategoryKey) => void;
}

export const PayrollSettingsSidebar: React.FC<PayrollSettingsSidebarProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  const toggleGroup = (title: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return CATEGORY_GROUPS;
    const q = searchQuery.toLowerCase();
    return CATEGORY_GROUPS.map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          item.label.toLowerCase().includes(q) ||
          item.subtext.toLowerCase().includes(q)
      ),
    })).filter((group) => group.items.length > 0);
  }, [searchQuery]);

  return (
    <div className="settings-sidebar-sticky sticky top-[88px] w-full flex-shrink-0 lg:w-[280px]">
      <div className="config-card overflow-hidden rounded-2xl border border-white/[0.06] bg-[#0d1526]/80 shadow-xl backdrop-blur-xl">
        {/* Sidebar Header */}
        <div className="border-b border-white/[0.05] px-4 pb-3 pt-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500">
              Configuration
            </span>
            <span className="text-[10px] text-slate-600">
              {CATEGORY_GROUPS.reduce((acc, g) => acc + g.items.length, 0)} sections
            </span>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-settings-input h-8 w-full rounded-lg border border-white/[0.06] bg-white/[0.03] pl-9 pr-3 text-xs text-slate-300 placeholder:text-slate-600 focus:outline-none"
            />
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="settings-sidebar-scroll max-h-[calc(100vh-220px)] overflow-y-auto px-2 py-2">
          {filteredGroups.map((group, groupIndex) => {
            const isCollapsed = collapsedGroups.has(group.title);

            return (
              <div key={group.title} className={cn(groupIndex > 0 && "mt-2")}>
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(group.title)}
                  className="group mb-1 flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-left transition-colors hover:bg-white/[0.03]"
                >
                  <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-slate-500 group-hover:text-slate-400">
                    {group.title}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 text-slate-600 transition-transform duration-200",
                      isCollapsed && "-rotate-90"
                    )}
                  />
                </button>

                {/* Group Items */}
                {!isCollapsed && (
                  <div className="space-y-0.5">
                    {group.items.map((cat) => {
                      const Icon = cat.icon;
                      const isActive = activeCategory === cat.id;

                      return (
                        <button
                          key={cat.id}
                          onClick={() => onSelectCategory(cat.id)}
                          className={cn(
                            "group/item relative flex w-full items-center justify-between rounded-xl p-2.5 text-left transition-all duration-200",
                            isActive
                              ? "sidebar-active-glow bg-gradient-to-r from-indigo-500/[0.12] via-indigo-500/[0.06] to-transparent text-indigo-300"
                              : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                          )}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            {/* Icon */}
                            <div
                              className={cn(
                                "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border transition-all duration-200",
                                isActive
                                  ? "border-indigo-500/30 bg-indigo-500/15 text-indigo-400 shadow-sm shadow-indigo-500/10"
                                  : "border-white/[0.06] bg-white/[0.03] text-slate-500 group-hover/item:border-white/[0.1] group-hover/item:text-slate-300"
                              )}
                            >
                              <Icon className="h-4 w-4" />
                            </div>

                            {/* Text */}
                            <div className="min-w-0">
                              <div
                                className={cn(
                                  "truncate text-[13px] font-medium leading-tight",
                                  isActive ? "text-indigo-200" : ""
                                )}
                              >
                                {cat.label}
                              </div>
                              <div className="mt-0.5 truncate text-[10px] font-normal text-slate-500/80">
                                {cat.subtext}
                              </div>
                            </div>
                          </div>

                          {/* Right: Shortcut + Chevron */}
                          <div className="flex items-center gap-1.5">
                            {cat.shortcut && (
                              <span
                                className={cn(
                                  "kbd-badge hidden transition-opacity lg:inline-flex",
                                  isActive ? "opacity-70" : "opacity-0 group-hover/item:opacity-50"
                                )}
                              >
                                {cat.shortcut}
                              </span>
                            )}
                            <ChevronRight
                              className={cn(
                                "h-3 w-3 transition-all duration-200",
                                isActive
                                  ? "translate-x-0.5 text-indigo-400 opacity-100"
                                  : "text-slate-600 opacity-0 group-hover/item:translate-x-0.5 group-hover/item:opacity-60"
                              )}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
