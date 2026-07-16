import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Activity, AlertCircle, Archive, Award, Banknote, BarChart3, Bell, BookOpen, Bot, Brain,
  Briefcase, Building2, CalendarDays, CalendarCheck, CheckCircle2, ChevronsLeft, ChevronsRight,
  ChevronDown, ClipboardCheck, Clock, CreditCard, Download, FileCheck, FileText, FilePlus2,
  FileSignature, Folder, FolderOpen, Gauge, Gift, Globe, HandCoins, HeartPulse, History,
  Info, Languages, LayoutDashboard, LineChart as LineChartIcon, Lock, LogOut, Mail, Medal,
  Menu, MessageCircle, MessageSquare, Mic, MinusCircle, Moon, Package, Palmtree, Percent,
  PlayCircle, Plane, Receipt, ScanLine, ScrollText, Search, Settings, ShieldCheck, Sparkles,
  Star, Sun, Target, Timer, TrendingUp, Trophy, UserCheck, UserCog, UserPlus, Users, Video,
  Wallet, Workflow, X, Zap, Clock3, ListTodo, CalendarRange, FileBarChart, Lightbulb,
  ClipboardList, BadgeCheck, Headphones, HelpCircle, TicketCheck, Map, Laptop, Printer,
  Repeat, Wrench, TrendingDown, BrainCircuit, Fingerprint, Coffee, HeartHandshake, GraduationCap,
  BookMarked, PenLine, FileEdit, Landmark, Coins, Building, Hash,
} from "lucide-react";
import { aurix, useAurix, type Role } from "@/lib/aurix-store";
import { useAuthReady } from "@/lib/auth-bootstrap";
import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";
import { hasValidAccessToken, setTokens } from "@/api";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/site/ThemeProvider";

// ── Badge type ─────────────────────────────────────────────────
type BadgeKind = "New" | "AI" | "Beta" | "Hot";

type NavLeaf = {
  to: string;
  label: string;
  icon: any;
  exact?: boolean;
  roles?: string[];
  badge?: BadgeKind;
  count?: number;
};
type NavParent = {
  label: string;
  icon: any;
  basePath: string;
  children: NavLeaf[];
  roles?: string[];
  badge?: BadgeKind;
  count?: number;
};
type NavItem = NavLeaf | NavParent;
type NavSection = { title?: string; items: NavItem[]; roles?: string[] };

const isParent = (i: NavItem): i is NavParent => "children" in i;

// ── Badge color map ────────────────────────────────────────────
const BADGE_STYLES: Record<BadgeKind, string> = {
  New: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
  AI: "bg-violet-500/20 text-violet-400 border border-violet-500/30",
  Beta: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  Hot: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
};

function NavBadge({ kind }: { kind: BadgeKind }) {
  return (
    <span className={`ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${BADGE_STYLES[kind]}`}>
      {kind}
    </span>
  );
}

function NavCount({ count }: { count: number }) {
  return (
    <span className="ml-auto shrink-0 min-w-[18px] rounded-full bg-destructive/80 px-1.5 py-0.5 text-center text-[9px] font-bold text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

// ── All nav sections ───────────────────────────────────────────
const NAV_SECTIONS: NavSection[] = [
  {
    // ── Admin / HR / Manager sections ────────────────────────
    items: [
      { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true, roles: ["admin", "hr"] },
      { to: "/dashboard/manager", label: "Dashboard", icon: UserCog, roles: ["manager"] },
      { to: "/dashboard/ai-insights", label: "AI Insights", icon: Sparkles, roles: ["admin", "hr", "manager"] },
      { to: "/dashboard/employees", label: "Employees", icon: Users, roles: ["admin", "hr", "manager"] },
      { to: "/dashboard/hr", label: "HR Management", icon: UserCog, roles: ["admin", "hr"] },
      { to: "/dashboard/managers", label: "Managers", icon: UserPlus, roles: ["admin", "hr"] },
      { to: "/dashboard/departments", label: "Departments", icon: Building2, roles: ["admin", "hr"] },
      { to: "/dashboard/attendance", label: "Attendance", icon: CalendarDays, roles: ["admin", "hr", "manager"] },
      { to: "/dashboard/timesheets", label: "Timesheets", icon: Timer, roles: ["admin", "hr", "manager"] },
      { to: "/dashboard/leaves", label: "Leaves", icon: FileText, roles: ["admin", "hr", "manager"] },
      {
        label: "Payroll",
        icon: CreditCard,
        basePath: "/dashboard/payroll",
        roles: ["admin", "hr"],
        children: [
          { to: "/dashboard/payroll", label: "Payroll Dashboard", icon: LayoutDashboard, exact: true },
          { to: "/dashboard/payroll/copilot", label: "AI Payroll Copilot", icon: Sparkles },
          { to: "/dashboard/payroll/salary-processing", label: "Salary Processing", icon: PlayCircle },
          { to: "/dashboard/payroll/salary-structure", label: "Salary Structure", icon: LayoutDashboard },
          { to: "/dashboard/payroll/payslips", label: "Payslips", icon: FileText },
          { to: "/dashboard/payroll/reimbursements", label: "Reimbursements", icon: Receipt },
          { to: "/dashboard/payroll/bonuses", label: "Bonuses & Incentives", icon: Gift },
          { to: "/dashboard/payroll/deductions", label: "Deductions", icon: MinusCircle },
          { to: "/dashboard/payroll/advances", label: "Advances & Loans", icon: HandCoins },
          { to: "/dashboard/payroll/overtime", label: "Overtime Payments", icon: Timer },
          { to: "/dashboard/payroll/tax", label: "Tax Management", icon: Percent },
          { to: "/dashboard/payroll/approvals", label: "Payroll Approvals", icon: CheckCircle2 },
          { to: "/dashboard/payroll/reports", label: "Payroll Reports", icon: BarChart3 },
          { to: "/dashboard/payroll/bank-transfers", label: "Bank Transfers", icon: Banknote },
          { to: "/dashboard/payroll/compliance", label: "Compliance", icon: ShieldCheck },
          { to: "/dashboard/payroll/settings", label: "Payroll Settings", icon: Settings },
        ],
      },
      { to: "/dashboard/performance", label: "Performance", icon: Gauge, roles: ["admin", "hr", "manager"] },
      { to: "/dashboard/documents", label: "Documents", icon: Folder, roles: ["admin", "hr", "manager"] },
      { to: "/dashboard/assets", label: "Assets", icon: Package, roles: ["admin", "hr", "manager"] },
      {
        label: "Recruitment",
        icon: Briefcase,
        basePath: "/dashboard/recruitment",
        roles: ["admin", "hr"],
        children: [
          { to: "/dashboard/recruitment", label: "Dashboard", icon: LayoutDashboard, exact: true },
          { to: "/dashboard/recruitment/requisitions", label: "Requisitions", icon: FileSignature },
          { to: "/dashboard/recruitment/jobs", label: "All Jobs", icon: Briefcase },
          { to: "/dashboard/recruitment/jobs/new", label: "Create Job", icon: FilePlus2 },
          { to: "/dashboard/recruitment/candidates", label: "Candidates", icon: Users },
          { to: "/dashboard/recruitment/talent-pool", label: "Talent Pool", icon: UserCheck },
          { to: "/dashboard/recruitment/pipeline", label: "Pipeline", icon: Activity },
          { to: "/dashboard/recruitment/interviews", label: "Interviews", icon: CalendarDays },
          { to: "/dashboard/recruitment/calendar", label: "Interview Calendar", icon: CalendarDays },
          { to: "/dashboard/recruitment/scorecards", label: "Scorecards", icon: ClipboardCheck },
          { to: "/dashboard/recruitment/offers", label: "Offers", icon: FileText },
          { to: "/dashboard/recruitment/onboarding", label: "Onboarding", icon: UserCheck },
          { to: "/dashboard/recruitment/crm", label: "Candidate CRM", icon: MessageSquare },
          { to: "/dashboard/recruitment/resume-intelligence", label: "Resume Intelligence", icon: ScanLine },
          { to: "/dashboard/recruitment/templates", label: "Email Templates", icon: Mail },
          { to: "/dashboard/recruitment/referrals", label: "Referrals", icon: Gift },
          { to: "/dashboard/recruitment/vendors", label: "Vendors", icon: Building2 },
          { to: "/dashboard/recruitment/career-site", label: "Career Site", icon: Globe },
          { to: "/dashboard/recruitment/automation", label: "Automation", icon: Workflow },
          { to: "/dashboard/recruitment/compliance", label: "Compliance", icon: ShieldCheck },
          { to: "/dashboard/recruitment/search", label: "Global Search", icon: Search },
          { to: "/dashboard/recruitment/notifications", label: "Notifications", icon: Bell },
          { to: "/dashboard/recruitment/import-export", label: "Import / Export", icon: Download },
          { to: "/dashboard/recruitment/reports", label: "Hiring Reports", icon: BarChart3 },
          { to: "/dashboard/recruitment/analytics", label: "Analytics", icon: LineChartIcon },
          { to: "/dashboard/recruitment/ai", label: "Recruitment AI", icon: Sparkles },
          { to: "/dashboard/recruitment/copilot", label: "AI Copilot", icon: Bot },
        ],
      },
      { to: "/dashboard/reports", label: "Reports", icon: BarChart3, roles: ["admin", "hr", "manager"] },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // EMPLOYEE-ONLY SECTIONS
  // ══════════════════════════════════════════════════════════════
  {
    roles: ["employee"],
    items: [
      { to: "/dashboard/employee", label: "My Dashboard", icon: LayoutDashboard, exact: true, roles: ["employee"] },
    ],
  },
  {
    title: "Attendance",
    roles: ["employee"],
    items: [
      { to: "/dashboard/attendance", label: "Attendance", icon: CalendarDays, roles: ["employee"] },
    ],
  },
  {
    title: "Timesheets",
    roles: ["employee"],
    items: [
      { to: "/dashboard/timesheets", label: "Timesheets", icon: Timer, roles: ["employee"] },
    ],
  },
  {
    title: "Leaves",
    roles: ["employee"],
    items: [
      { to: "/dashboard/leaves", label: "Leaves", icon: Palmtree, roles: ["employee"] },
    ],
  },
  {
    title: "Payroll",
    roles: ["employee"],
    items: [
      { to: "/dashboard/payroll", label: "Payroll", icon: CreditCard, roles: ["employee"] },
    ],
  },
  {
    title: "Performance",
    roles: ["employee"],
    items: [
      { to: "/dashboard/performance", label: "Performance", icon: Gauge, roles: ["employee"] },
    ],
  },
  {
    title: "Documents",
    roles: ["employee"],
    items: [
      { to: "/dashboard/documents", label: "Documents", icon: Folder, roles: ["employee"] },
    ],
  },
  {
    title: "Assets",
    roles: ["employee"],
    items: [
      { to: "/dashboard/assets", label: "Assets", icon: Package, roles: ["employee"] },
    ],
  },
  {
    title: "Expenses",
    roles: ["employee"],
    items: [
      { to: "/dashboard/expenses", label: "Expenses", icon: Receipt, roles: ["employee"] },
    ],
  },
  {
    title: "Learning",
    roles: ["employee"],
    items: [
      { to: "/dashboard/learning", label: "Learning", icon: GraduationCap, roles: ["employee"] },
    ],
  },
  {
    title: "Career",
    roles: ["employee"],
    items: [
      { to: "/dashboard/career", label: "Career", icon: Map, roles: ["employee"] },
    ],
  },
  {
    title: "Communication",
    roles: ["employee"],
    items: [
      { to: "/dashboard/communication", label: "Communication", icon: MessageCircle, roles: ["employee"] },
    ],
  },
  {
    title: "Calendar",
    roles: ["employee"],
    items: [
      { to: "/dashboard/calendar", label: "Calendar", icon: CalendarDays, roles: ["employee"] },
    ],
  },
  {
    title: "Rewards",
    roles: ["employee"],
    items: [
      { to: "/dashboard/rewards", label: "Rewards", icon: Trophy, roles: ["employee"] },
    ],
  },
  {
    title: "Help Center",
    roles: ["employee"],
    items: [
      { to: "/dashboard/help", label: "Help Center", icon: Headphones, roles: ["employee"] },
    ],
  },
  {
    title: "Exit",
    roles: ["employee"],
    items: [
      { to: "/dashboard/exit", label: "Resignation / Exit", icon: LogOut, roles: ["employee"] },
    ],
  },
  {
    title: "Settings",
    roles: ["employee"],
    items: [
      { to: "/dashboard/settings", label: "Settings", icon: Settings, roles: ["employee"] },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // AI SUPPORT — All Roles
  // ══════════════════════════════════════════════════════════════
  {
    title: "AI Support",
    roles: ["admin", "hr", "manager", "employee"],
    items: [
      { to: "/ai/chat-assistant", label: "AI HR Assistant", icon: Sparkles },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // HR Operations
  // ══════════════════════════════════════════════════════════════
  {
    title: "HR Operations",
    roles: ["admin", "hr", "manager"],
    items: [
      { to: "/dashboard/hr-ops", label: "HR Ops Dashboard", icon: LayoutDashboard, roles: ["admin", "hr"] },
      { to: "/dashboard/timeline", label: "Employee Timeline", icon: Activity, roles: ["admin", "hr"] },
      { to: "/dashboard/assets", label: "Asset Management", icon: Package },
      { to: "/dashboard/visitors", label: "Visitor Management", icon: Users, roles: ["admin", "hr"] },
      { to: "/dashboard/expenses", label: "Expense Claims", icon: Receipt },
      { to: "/dashboard/travel", label: "Travel Requests", icon: Plane },
      { to: "/dashboard/onboarding-checklist", label: "Onboarding Checklist", icon: UserCheck },
      { to: "/dashboard/offboarding", label: "Offboarding", icon: Archive, roles: ["admin", "hr"] },
      { to: "/dashboard/exit", label: "Exit Management", icon: LogOut, roles: ["admin", "hr"] },
    ],
  },

  // ══════════════════════════════════════════════════════════════
  // Administration
  // ══════════════════════════════════════════════════════════════
  {
    title: "Administration",
    roles: ["admin", "hr"],
    items: [
      { to: "/dashboard/roles", label: "Roles & Permissions", icon: ShieldCheck, roles: ["admin"] },
      { to: "/dashboard/audit-logs", label: "Audit Logs", icon: ScrollText, roles: ["admin"] },
      { to: "/dashboard/billing", label: "Billing", icon: CreditCard, roles: ["admin"] },
      { to: "/dashboard/settings", label: "Settings", icon: Settings },
    ],
  },
];

// ── Role-based nav filter ─────────────────────────────────────
function filterNavForRole(sections: NavSection[], role: Role): NavSection[] {
  const allowed = (roles?: string[]) => !roles || roles.includes(role as string);

  return sections
    .filter((s) => allowed(s.roles))
    .map((section) => ({
      ...section,
      items: section.items
        .filter((item) => allowed(item.roles))
        .map((item) => {
          if (isParent(item)) {
            return {
              ...item,
              children: item.children.filter((c) => allowed(c.roles)),
            };
          }
          return item;
        })
        .filter((item) => {
          if (isParent(item)) return item.children.length > 0;
          return true;
        }),
    }))
    .filter((s) => s.items.length > 0);
}

// ── Demo Mode Banner ──────────────────────────────────────────
function DemoBanner({ role, onDismiss }: { role: Role; onDismiss: () => void }) {
  const roleLabel = role === "manager" ? "Manager" : "Employee";
  return (
    <div className="flex items-center justify-between gap-3 border-b border-amber-400/30 bg-amber-500/10 px-4 py-2">
      <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400">
        <Info className="h-3.5 w-3.5 shrink-0" />
        <span>
          <span className="font-semibold">Demo Mode</span> — Viewing Sample Enterprise Data as{" "}
          <span className="font-semibold">{roleLabel}</span>. All data is illustrative only.
        </span>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss demo banner"
        className="shrink-0 rounded-md p-1 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function DashboardShell() {
  const ws = useAurix();
  const authReady = useAuthReady();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [demoDismissed, setDemoDismissed] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { theme, toggle: toggleTheme } = useTheme();

  const role = (ws.user?.role ?? "admin") as string;
  const isDemo = Boolean(ws.isDemoUser) && !demoDismissed;

  // ── Auth & Role guard ────────────────────────────────────────
  useEffect(() => {
    if (!authReady || ws.isRestoring) return;

    if (!ws.user && !hasValidAccessToken()) {
      navigate({ to: "/login" });
      return;
    }
    if (!ws.user) return;
    if (!ws.user.emailVerified) {
      navigate({ to: "/verify-email" });
      return;
    }
    if (!ws.user.onboardingComplete) {
      navigate({ to: "/onboarding" });
      return;
    }

    const isAdminOrHr = role === "admin" || role === "hr";

    // ── Direct access guard & redirection ──
    if (pathname === "/dashboard") {
      if (role === "manager") {
        navigate({ to: "/dashboard/manager" });
        return;
      }
      if (role === "employee") {
        navigate({ to: "/dashboard/employee" });
        return;
      }
    }

    if (pathname === "/dashboard/manager" && role !== "manager") {
      navigate({ to: isAdminOrHr ? "/dashboard" : "/dashboard/employee" });
      return;
    }

    // Employees cannot access Admin/Manager pages
    if (role === "employee") {
      const adminManagerPaths = [
        "/dashboard/employees",
        "/dashboard/hr",
        "/dashboard/managers",
        "/dashboard/departments",
        "/dashboard/recruitment",
        "/dashboard/reports",
        "/dashboard/hr-ops",
        "/dashboard/timeline",
        "/dashboard/visitors",
        "/dashboard/onboarding-checklist",
        "/dashboard/offboarding",
        "/dashboard/roles",
        "/dashboard/audit-logs",
        "/dashboard/billing",
      ];
      const isTryingToAccessAdminManager = adminManagerPaths.some((p) => pathname.startsWith(p)) ||
        (pathname.startsWith("/ai") && pathname !== "/ai/chat-assistant");
      if (isTryingToAccessAdminManager) {
        navigate({ to: "/dashboard/employee" });
      }
    }
  }, [authReady, ws.isRestoring, ws.user, pathname, role, navigate]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const visibleNav = useMemo(() => filterNavForRole(NAV_SECTIONS, role as any), [role]);

  if (!authReady || ws.isRestoring || !ws.user) {
    return <AuthLoadingScreen />;
  }

  function logout() {
    setTokens(null);
    aurix.reset();
    navigate({ to: "/login" });
  }

  const initials = ws.user.fullName?.split(" ").map((p) => p[0]).slice(0, 2).join("") || "A";

  // ── Sidebar home link per role ──────────────────────────────
  const homeLink =
    role === "manager"
      ? "/dashboard/manager"
      : role === "employee"
      ? "/dashboard/employee"
      : "/dashboard";

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-background text-foreground">
      {/* Demo Mode Banner */}
      {isDemo && (
        <DemoBanner
          role={role as Role}
          onDismiss={() => setDemoDismissed(true)}
        />
      )}

      <div className="flex min-w-0 flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-card/60 backdrop-blur-xl transition-all duration-200 lg:static lg:translate-x-0 ${
            collapsed ? "lg:w-[68px]" : "lg:w-64"
          } w-64 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
          style={isDemo ? { top: "36px" } : undefined}
        >
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <Link to={homeLink as any} className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg text-brand-foreground shadow-glow" style={{ background: "var(--gradient-brand)" }}>
                <Sparkles className="h-4 w-4" />
              </span>
              {!collapsed ? <span className="font-display text-lg font-semibold tracking-tight">Aurix</span> : null}
            </Link>
            <button onClick={() => setCollapsed((c) => !c)} className="hidden rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground lg:inline-flex" aria-label="Toggle sidebar">
              {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
            </button>
          </div>

          <nav className="flex-1 space-y-3 overflow-y-auto p-2">
            {visibleNav.map((section, sIdx) => (
              <div key={sIdx} className="space-y-0.5">
                {section.title && !collapsed && role !== "employee" ? (
                  <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    {section.title}
                  </div>
                ) : null}
                {section.title && collapsed && role !== "employee" ? (
                  <div className="mx-2 my-2 border-t border-border" />
                ) : null}
                {section.items.map((item) => {
                  if (isParent(item)) {
                    return (
                      <NavGroup
                        key={item.basePath}
                        item={item}
                        pathname={pathname}
                        collapsed={collapsed}
                      />
                    );
                  }
                  const active = item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + "/");
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to as any}
                      className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                      }`}
                    >
                      {active ? <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-foreground" /> : null}
                      <Icon className="h-4 w-4 shrink-0" />
                      {!collapsed ? (
                        <>
                          <span className="flex-1">{item.label}</span>
                          {item.badge && <NavBadge kind={item.badge} />}
                          {item.count !== undefined && !item.badge && <NavCount count={item.count} />}
                        </>
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          <div className="border-t border-border p-3">
            <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-foreground text-sm font-semibold text-background">{initials}</div>
              {!collapsed ? (
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{ws.user?.fullName}</div>
                  <div className="truncate text-xs capitalize text-muted-foreground">{ws.user?.role}</div>
                </div>
              ) : null}
              {!collapsed ? (
                <button onClick={logout} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive" aria-label="Sign out">
                  <LogOut className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </div>
        </aside>

        {mobileOpen ? <div onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden" /> : null}

        <div className="flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden">
          {/* Topbar */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/70 px-4 backdrop-blur-xl sm:px-6">
            <button onClick={() => setMobileOpen(true)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative max-w-md flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search employees, departments, requests…" className="h-9 pl-9" />
            </div>
            <button
              onClick={toggleTheme}
              className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button className="relative rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
            </button>
            <div className="hidden items-center gap-2 rounded-md border border-border bg-card/40 px-3 py-1.5 text-xs sm:flex">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-medium">{ws.company?.name || "Workspace"}</span>
            </div>
          </header>

          <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}

function NavGroup({ item, pathname, collapsed }: { item: NavParent; pathname: string; collapsed: boolean }) {
  const isActive = pathname === item.basePath || pathname.startsWith(item.basePath + "/");
  const [open, setOpen] = useState(isActive);
  useEffect(() => { if (isActive) setOpen(true); }, [isActive]);
  const Icon = item.icon;

  if (collapsed) {
    return (
      <Link
        to={item.basePath as any}
        className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          isActive ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
        }`}
        aria-label={item.label}
      >
        {isActive ? <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-foreground" /> : null}
        <Icon className="h-4 w-4 shrink-0" />
      </Link>
    );
  }

  return (
    <div>
      <div
        className={`group relative flex w-full items-center rounded-lg text-sm font-medium transition-colors ${
          isActive ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
        }`}
      >
        {isActive ? <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-foreground" /> : null}
        <Link
          to={item.basePath as any}
          onClick={() => setOpen(true)}
          className="flex flex-1 items-center gap-3 rounded-lg px-3 py-2"
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          {item.badge && !item.count && <NavBadge kind={item.badge} />}
          {item.count !== undefined && !item.badge && <NavCount count={item.count} />}
        </Link>
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen((o) => !o); }}
          aria-label={open ? "Collapse" : "Expand"}
          className="mr-1 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      {open ? (
        <div className="ml-4 mt-1 space-y-0.5 border-l border-border pl-2">
          {item.children.map((child) => {
            const childActive = child.exact ? pathname === child.to : pathname === child.to || pathname.startsWith(child.to + "/");
            const ChildIcon = child.icon;
            return (
              <Link
                key={child.to}
                to={child.to as any}
                className={`flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
                  childActive ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                }`}
              >
                <ChildIcon className="h-3.5 w-3.5 shrink-0" />
                <span className="flex-1">{child.label}</span>
                {child.badge && <NavBadge kind={child.badge} />}
                {child.count !== undefined && !child.badge && <NavCount count={child.count} />}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
  return (
    <div className="mb-6 flex min-w-0 flex-wrap items-end justify-between gap-4">
      <div className="min-w-0 flex-1">
        <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function ComingSoon({ title, description, icon: Icon }: { title: string; description: string; icon: any }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
      <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl text-brand-foreground shadow-glow" style={{ background: "var(--gradient-brand)" }}>
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
