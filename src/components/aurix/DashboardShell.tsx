import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
// Executive Dashboards Navigation Enabled
import {
  Activity, AlertCircle, Archive, Award, Banknote, BarChart3, Bell, BookOpen, Bot, Brain,
  Briefcase, Building2, CalendarDays, CalendarCheck, CheckCircle2, ChevronLeft, PanelLeft,
  ChevronDown, ClipboardCheck, Clock, CreditCard, Crown, Download, FileCheck, FileText, FilePlus2,
  FileSignature, Folder, FolderOpen, Gauge, Gift, Globe, HandCoins, HeartPulse, History,
  Info, Languages, LayoutDashboard, LineChart as LineChartIcon, Lock, Mail, Medal,
  Menu, MessageCircle, MessageSquare, Mic, MinusCircle, Moon, Package, Palmtree, Percent,
  PlayCircle, Plane, Receipt, ScanLine, ScrollText, Search, Settings, ShieldCheck, Sparkles,
  Star, Sun, Target, Timer, TrendingUp, Trophy, User, UserCheck, UserCog, UserPlus, Users, Video,
  Wallet, Workflow, X, Zap, Clock3, ListTodo, CalendarRange, FileBarChart, Lightbulb,
  ClipboardList, BadgeCheck, Headphones, HelpCircle, TicketCheck, Map, Laptop, Printer,
  Repeat, Wrench, TrendingDown, BrainCircuit, Fingerprint, Coffee, HeartHandshake, GraduationCap,
  BookMarked, PenLine, FileEdit, Landmark, Coins, Building, Hash, Sliders, Shield, Layers, PackageCheck,
  GitPullRequest, Send, ShieldAlert, Scale, Cpu, Home, Rocket,
} from "lucide-react";
import { useAurix, type Role } from "@/lib/aurix-store";
import { useAuthReady } from "@/lib/auth-bootstrap";
import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";
import { Input } from "@/components/ui/input";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useTheme } from "@/components/site/ThemeProvider";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchSidebarPermissions } from "@/store/sidebar/sidebarActions";
import {
  selectExpandedSections,
  selectUserPermissions,
  filterNavTree,
} from "@/store/sidebar/sidebarSelectors";
import {
  setActiveRoute,
  setSectionExpand,
  toggleSectionExpand,
} from "@/store/sidebar/sidebarSlice";
import type {
  BadgeKind,
  SidebarNavItem,
  SidebarNavLeaf,
  SidebarNavParent,
  SidebarNavSection,
} from "@/store/sidebar/sidebarTypes";

const isParent = (i: SidebarNavItem): i is SidebarNavParent => "children" in i;

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

// ── Enterprise HRMS Nav Sections ────────────────────────────────
const NAV_SECTIONS: SidebarNavSection[] = [
  {
    items: [
      {
        to: "/dashboard",
        label: "Overview",
        icon: LayoutDashboard,
        exact: true,
        permission: "overview.view",
      },
      {
        to: "/dashboard/workforce",
        label: "Workforce",
        icon: Users,
        permission: "workforce.view",
      },
      {
        to: "/dashboard/talent",
        label: "Talent Management",
        icon: Briefcase,
        permission: "talent.view",
        roles: ["admin", "hr", "manager"],
      },
      {
        to: "/dashboard/payroll",
        label: "Payroll",
        icon: CreditCard,
        permission: "payroll.view",
      },
      {
        to: "/dashboard/hr-operations",
        label: "HR Operations",
        icon: Activity,
        permission: "hrops.view",
        roles: ["admin", "hr", "manager"],
      },
      {
        to: "/dashboard/resources",
        label: "Resources",
        icon: Folder,
        permission: "resources.view",
      },
      {
        to: "/dashboard/analytics",
        label: "Analytics",
        icon: BarChart3,
        permission: "analytics.view",
        roles: ["admin", "hr", "manager"],
      },
      {
        to: "/dashboard/ai-hub",
        label: "AI Hub",
        icon: Brain,
        permission: "ai.view",
      },
      {
        to: "/dashboard/settings",
        label: "Settings",
        icon: Settings,
        permission: "settings.view",
      },
    ],
  },
];

const EMPLOYEE_NAV_SECTIONS: SidebarNavSection[] = [
  {
    items: [
      {
        to: "/dashboard/employee",
        label: "My Portal",
        icon: User,
        exact: true,
      },
      {
        to: "/dashboard/attendance",
        label: "Attendance",
        icon: Clock,
      },
      {
        to: "/dashboard/leaves",
        label: "Leaves",
        icon: CalendarDays,
      },
      {
        to: "/dashboard/timesheets",
        label: "Timesheets",
        icon: Timer,
      },
      {
        to: "/dashboard/expenses",
        label: "Expense Claims",
        icon: Receipt,
      },
      {
        to: "/dashboard/payroll",
        label: "Payslips & Salary",
        icon: Wallet,
      },
      {
        to: "/dashboard/documents",
        label: "My Documents",
        icon: FileText,
      },
      {
        to: "/dashboard/assets",
        label: "My Assets",
        icon: Package,
      },
      {
        to: "/dashboard/performance",
        label: "Performance",
        icon: Target,
      },
      {
        to: "/dashboard/settings/profile",
        label: "My Settings",
        icon: Settings,
      },
    ],
  },
];

const MANAGER_NAV_SECTIONS: SidebarNavSection[] = [
  {
    items: [
      {
        to: "/dashboard/manager",
        label: "Manager Portal",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        to: "/dashboard/workforce",
        label: "My Team",
        icon: Users,
      },
      {
        to: "/dashboard/attendance",
        label: "Attendance",
        icon: Clock,
      },
      {
        to: "/dashboard/leaves",
        label: "Leave Approvals",
        icon: CalendarDays,
      },
      {
        to: "/dashboard/timesheets",
        label: "Timesheets",
        icon: Timer,
      },
      {
        to: "/dashboard/expenses",
        label: "Expense Claims",
        icon: Receipt,
      },
      {
        to: "/dashboard/talent",
        label: "Recruitment",
        icon: Briefcase,
      },
      {
        to: "/dashboard/performance",
        label: "Performance",
        icon: Target,
      },
      {
        to: "/dashboard/reports",
        label: "Reports",
        icon: BarChart3,
      },
      {
        to: "/dashboard/ai-hub",
        label: "AI Assistant",
        icon: Brain,
      },
      {
        to: "/dashboard/settings",
        label: "Settings",
        icon: Settings,
      },
    ],
  },
];

const CIO_NAV_SECTIONS: SidebarNavSection[] = [
  {
    title: "CIO PORTAL",
    items: [
      { to: "/dashboard/executive/cio", label: "Overview", icon: Home, exact: true },
      { to: "/dashboard/executive/cio/it-operations", label: "IT Operations", icon: Laptop },
      { to: "/dashboard/executive/cio/infrastructure", label: "Infrastructure", icon: Building },
      { to: "/dashboard/executive/cio/cyber-security", label: "Cyber Security", icon: ShieldCheck },
      { to: "/dashboard/executive/cio/cloud-network", label: "Cloud & Network", icon: Globe },
      { to: "/dashboard/executive/cio/it-governance", label: "IT Governance", icon: FileCheck },
      { to: "/dashboard/executive/cio/digital-transformation", label: "Digital Transformation", icon: Sparkles },
      { to: "/dashboard/executive/cio/analytics", label: "Analytics", icon: BarChart3 },
      { to: "/dashboard/executive/cio/settings", label: "Settings", icon: Settings },
    ],
  },
];

const CEO_NAV_SECTIONS: SidebarNavSection[] = [
  {
    title: "CEO PORTAL",
    items: [
      { to: "/dashboard/executive/ceo", label: "Overview", icon: Home, exact: true },
      { to: "/dashboard/executive/ceo/business", label: "Business", icon: TrendingUp },
      { to: "/dashboard/executive/ceo/finance", label: "Finance", icon: HandCoins },
      { to: "/dashboard/executive/ceo/sales", label: "Sales", icon: BarChart3 },
      { to: "/dashboard/executive/ceo/organization", label: "Organization", icon: Users },
      { to: "/dashboard/executive/ceo/operations", label: "Operations", icon: ClipboardCheck },
      { to: "/dashboard/executive/ceo/reports", label: "Reports", icon: LineChartIcon },
      { to: "/dashboard/executive/ceo/ai-insights", label: "AI Insights", icon: Bot },
      { to: "/dashboard/executive/ceo/settings", label: "Settings", icon: Settings },
    ],
  },
];

const CTO_NAV_SECTIONS: SidebarNavSection[] = [
  {
    title: "CTO PORTAL",
    items: [
      { to: "/dashboard/executive/cto", label: "Overview", icon: Home, exact: true },
      { to: "/dashboard/executive/cto/engineering", label: "Engineering", icon: Wrench },
      { to: "/dashboard/executive/cto/projects", label: "Projects", icon: Folder },
      { to: "/dashboard/executive/cto/developers", label: "Developers", icon: UserCheck },
      { to: "/dashboard/executive/cto/devops", label: "DevOps", icon: Rocket },
      { to: "/dashboard/executive/cto/analytics", label: "Analytics", icon: BarChart3 },
      { to: "/dashboard/executive/cto/ai", label: "AI Platform", icon: Bot },
      { to: "/dashboard/executive/cto/security", label: "Security", icon: Lock },
      { to: "/dashboard/executive/cto/settings", label: "Settings", icon: Settings },
    ],
  },
];

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
        className="shrink-0 rounded-md p-1 text-amber-600 hover:bg-amber-500/20 dark:text-amber-400 cursor-pointer"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function DashboardShell() {
  const ws = useAurix();
  const role = ws.user?.role;
  const navigate = useNavigate();
  const authReady = useAuthReady();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const dispatch = useAppDispatch();
  const userPermissions = useAppSelector(selectUserPermissions);
  const { theme, toggle: toggleTheme } = useTheme();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [demoDismissed, setDemoDismissed] = useState(false);

  const isDemo = false;

  useEffect(() => {
    dispatch(fetchSidebarPermissions());
  }, [dispatch]);

  // ── Auth & Role guard ────────────────────────────────────────
  useEffect(() => {
    if (!authReady || ws.isRestoring || !ws.user) return;

    const normalizedRole = (role || "").toLowerCase();
    const isExecutive = normalizedRole === "cto" || normalizedRole === "ceo" || normalizedRole === "cio";
    const isAdminOrHr =
      normalizedRole === "admin" ||
      normalizedRole === "hr" ||
      normalizedRole === "super_admin" ||
      normalizedRole === "superadmin";

    if (pathname === "/dashboard/employee" && normalizedRole !== "employee") {
      if (normalizedRole === "cio") {
        navigate({ to: "/dashboard/executive/cio" });
        return;
      }
      if (normalizedRole === "cto") {
        navigate({ to: "/dashboard/executive/cto" });
        return;
      }
      if (normalizedRole === "ceo") {
        navigate({ to: "/dashboard/executive/ceo" });
        return;
      }
      if (normalizedRole === "manager") {
        navigate({ to: "/dashboard/manager" });
        return;
      }
      if (isAdminOrHr) {
        navigate({ to: "/dashboard" });
        return;
      }
    }

    if (pathname === "/onboarding") {
      if (normalizedRole === "cio") {
        navigate({ to: "/dashboard/executive/cio" });
        return;
      }
      if (normalizedRole === "cto") {
        navigate({ to: "/dashboard/executive/cto" });
        return;
      }
      if (normalizedRole === "ceo") {
        navigate({ to: "/dashboard/executive/ceo" });
        return;
      }
      if (normalizedRole === "employee") {
        navigate({ to: "/dashboard/employee" });
        return;
      }
    }

    if (normalizedRole === "cio" && (pathname === "/dashboard/employee" || pathname.startsWith("/dashboard/employee/"))) {
      navigate({ to: "/dashboard/executive/cio" });
      return;
    }
    if (normalizedRole === "cto" && (pathname === "/dashboard/employee" || pathname.startsWith("/dashboard/employee/"))) {
      navigate({ to: "/dashboard/executive/cto" });
      return;
    }

    if (normalizedRole === "ceo" && (pathname === "/dashboard/employee" || pathname.startsWith("/dashboard/employee/"))) {
      navigate({ to: "/dashboard/executive/ceo" });
      return;
    }
  }, [authReady, ws.isRestoring, ws.user, pathname, role, navigate]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const visibleNav = useMemo(() => {
    const normalizedRole = (role || "").toLowerCase();

    const isEmployeePortalPath = pathname === "/dashboard/employee" || pathname.startsWith("/dashboard/employee/");
    const isManagerPortalPath = pathname === "/dashboard/manager" || pathname.startsWith("/dashboard/manager/");
    const isCtoPortalPath = pathname === "/dashboard/executive/cto" || pathname.startsWith("/dashboard/executive/cto");
    const isCeoPortalPath = pathname === "/dashboard/executive/ceo" || pathname.startsWith("/dashboard/executive/ceo");
    const isCioPortalPath = pathname === "/dashboard/executive/cio" || pathname.startsWith("/dashboard/executive/cio");

    if (normalizedRole === "cio" || isCioPortalPath) {
      return filterNavTree(CIO_NAV_SECTIONS, role, userPermissions);
    }
    if (normalizedRole === "ceo" || isCeoPortalPath) {
      return filterNavTree(CEO_NAV_SECTIONS, role, userPermissions);
    }
    if (normalizedRole === "cto" || isCtoPortalPath) {
      return filterNavTree(CTO_NAV_SECTIONS, role, userPermissions);
    }
    if (normalizedRole === "employee" || isEmployeePortalPath) {
      return filterNavTree(EMPLOYEE_NAV_SECTIONS, role, userPermissions);
    }
    if (normalizedRole === "manager" || isManagerPortalPath) {
      return filterNavTree(MANAGER_NAV_SECTIONS, role, userPermissions);
    }
    return filterNavTree(NAV_SECTIONS, role, userPermissions);
  }, [role, pathname, userPermissions]);

  if (!authReady || ws.isRestoring || !ws.user) {
    return <AuthLoadingScreen />;
  }

  const initials = ws.user.fullName?.split(" ").map((p) => p[0]).slice(0, 2).join("") || "A";

  const isCeoMode = (role || "").toLowerCase() === "ceo" || (ws.user?.email || "").toLowerCase() === "siddhubunny09@gmail.com" || pathname.startsWith("/dashboard/executive/ceo");
  const isCioMode = (role || "").toLowerCase() === "cio" || pathname.startsWith("/dashboard/executive/cio");
  const isCtoMode = (role || "").toLowerCase() === "cto" || pathname.startsWith("/dashboard/executive/cto");

  const homeLink =
    isCeoMode
      ? "/dashboard/executive/ceo"
      : isCioMode
      ? "/dashboard/executive/cio"
      : isCtoMode
      ? "/dashboard/executive/cto"
      : role === "manager"
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

      <div className="relative flex min-w-0 flex-1">
        {/* Sidebar — fixed to viewport; main content scrolls independently */}
        <aside
          className={`fixed left-0 z-40 flex flex-col border-r border-border bg-card/60 backdrop-blur-xl transition-[width,transform] duration-200 ${
            isDemo ? "top-9 bottom-0" : "inset-y-0"
          } ${collapsed ? "w-[68px]" : "w-64"} ${
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className={`flex h-16 shrink-0 items-center border-b border-border px-3 ${collapsed ? "justify-center" : "justify-between"}`}>
            {!collapsed ? (
              <>
                <Link to={homeLink as any} className="flex items-center gap-2 min-w-0">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-brand-foreground shadow-glow" style={{ background: "var(--gradient-brand)" }}>
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <span className="font-display text-lg font-semibold tracking-tight truncate">OFC HR</span>
                </Link>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer transition-colors"
                    aria-label="Search"
                    title="Search (Ctrl+K)"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setCollapsed(true)}
                    className="hidden rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground lg:inline-flex cursor-pointer transition-colors"
                    aria-label="Collapse sidebar"
                    title="Collapse sidebar"
                  >
                    <PanelLeft className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={() => setCollapsed(false)}
                className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer transition-colors"
                aria-label="Expand sidebar"
                title="Expand sidebar"
              >
                <PanelLeft className="h-4 w-4" />
              </button>
            )}
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto p-2">
            {visibleNav.map((section, sIdx) => (
              <div key={section.id || sIdx} className="space-y-0.5">
                {section.title && !collapsed ? (
                  <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    {section.title}
                  </div>
                ) : null}
                {section.title && collapsed ? (
                  <div className="mx-2 my-2 border-t border-border" />
                ) : null}
                {section.items.map((item) => {
                  if (isParent(item)) {
                    return (
                      <NavGroup
                        key={item.id}
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
                        active ? "bg-accent text-foreground font-semibold" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
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

          <div className="shrink-0 border-t border-border p-3">
            <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-foreground text-sm font-semibold text-background">{initials}</div>
              {!collapsed ? (
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{ws.user?.fullName}</div>
                  <div className="truncate text-xs capitalize text-muted-foreground">
                    {isCeoMode ? "Chief Executive Officer" : isCioMode ? "Chief Information Officer" : isCtoMode ? "Chief Technology Officer" : ws.user?.role}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </aside>

        {mobileOpen ? <div onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden" /> : null}

        <div
          className={`flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden transition-[margin] duration-200 ${
            collapsed ? "lg:ml-[68px]" : "lg:ml-64"
          }`}
        >
          {/* Topbar */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/70 px-4 backdrop-blur-xl sm:px-6">
            <div className="flex items-center gap-2">
              <button onClick={() => setMobileOpen(true)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden cursor-pointer" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-border/80 bg-card/60 px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer transition-all shadow-sm"
                title="Search (Ctrl+K)"
              >
                <Search className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Search...</span>
                <kbd className="hidden rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground sm:inline-block">
                  ⌘K
                </kbd>
              </button>
              <button
                onClick={toggleTheme}
                className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button className="relative rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer" aria-label="Notifications">
                <Bell className="h-4 w-4" />
                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
              </button>
              <div className="hidden items-center gap-2 rounded-md border border-border bg-card/40 px-3 py-1.5 text-xs sm:flex">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-medium">{ws.company?.name || "Workspace"}</span>
              </div>
            </div>
          </header>

          <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>

      {/* ChatGPT-style Quick Search Modal */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search employees, departments, requests, pages..." />
        <CommandList className="max-h-[350px] overflow-y-auto p-2">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Navigation">
            <CommandItem
              onSelect={() => {
                navigate({ to: "/dashboard" as any });
                setSearchOpen(false);
              }}
              className="cursor-pointer"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Overview</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                navigate({ to: "/dashboard/people" as any });
                setSearchOpen(false);
              }}
              className="cursor-pointer"
            >
              <Users className="mr-2 h-4 w-4" />
              <span>Workforce & Employees</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                navigate({ to: "/dashboard/payroll" as any });
                setSearchOpen(false);
              }}
              className="cursor-pointer"
            >
              <Banknote className="mr-2 h-4 w-4" />
              <span>Payroll</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                navigate({ to: "/dashboard/leaves" as any });
                setSearchOpen(false);
              }}
              className="cursor-pointer"
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              <span>Leaves & Attendance</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                navigate({ to: "/dashboard/ai" as any });
                setSearchOpen(false);
              }}
              className="cursor-pointer"
            >
              <Bot className="mr-2 h-4 w-4" />
              <span>AI Hub</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}

function NavGroup({
  item,
  pathname,
  collapsed,
}: {
  item: SidebarNavParent;
  pathname: string;
  collapsed: boolean;
}) {
  const dispatch = useAppDispatch();
  const expandedSections = useAppSelector(selectExpandedSections);
  const isExpanded = Boolean(expandedSections[item.id]);

  const isActive = pathname === item.basePath || pathname.startsWith(item.basePath + "/");

  useEffect(() => {
    if (isActive && !isExpanded) {
      dispatch(setSectionExpand({ sectionKey: item.id, expanded: true }));
    }
  }, [isActive, item.id, isExpanded, dispatch]);

  const Icon = item.icon;

  if (collapsed) {
    return (
      <Link
        to={item.basePath as any}
        className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          isActive ? "bg-accent text-foreground font-semibold" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
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
          isActive ? "bg-accent text-foreground font-semibold" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
        }`}
      >
        {isActive ? <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-foreground" /> : null}
        <Link
          to={item.basePath as any}
          onClick={() => {
            dispatch(toggleSectionExpand(item.id));
          }}
          className="flex flex-1 items-center gap-3 rounded-lg px-3 py-2"
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          {item.badge && !item.count && <NavBadge kind={item.badge} />}
          {item.count !== undefined && !item.badge && <NavCount count={item.count} />}
        </Link>
      </div>
      {isExpanded ? (
        <div className="ml-4 mt-1 space-y-0.5 border-l border-border pl-2 transition-all duration-200">
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

export function PageHeader({
  title,
  description,
  actions,
  showBack,
  backLink,
  backText,
  onBack,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  showBack?: boolean;
  backLink?: string;
  backText?: string;
  onBack?: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isRecruitmentSubPage =
    pathname.startsWith("/dashboard/recruitment/") &&
    pathname !== "/dashboard/recruitment" &&
    pathname !== "/dashboard/recruitment/";
  const isPayrollSubPage =
    pathname.startsWith("/dashboard/payroll/") &&
    pathname !== "/dashboard/payroll" &&
    pathname !== "/dashboard/payroll/";
  const isAttendanceSubPage =
    pathname.startsWith("/dashboard/attendance/") &&
    pathname !== "/dashboard/attendance" &&
    pathname !== "/dashboard/attendance/";
  const isPeopleSubPage =
    pathname.startsWith("/dashboard/employees") ||
    pathname.startsWith("/dashboard/managers");

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (window.history.length > 1) {
      window.history.back();
    }
  };

  return (
    <div className="mb-6 flex flex-col min-w-0 gap-2 text-left">
      {(showBack || backLink || onBack) && (
        <div className="mb-1 flex items-center">
          {backLink ? (
            <Link
              to={backLink as any}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer group/back"
            >
              <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover/back:-translate-x-0.5" />
              {backText || "Back"}
            </Link>
          ) : (
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer group/back"
            >
              <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover/back:-translate-x-0.5" />
              {backText || "Back"}
            </button>
          )}
        </div>
      )}
      {isRecruitmentSubPage && (
        <div className="mb-1 flex items-center">
          <Link
            to="/dashboard/recruitment"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer group/back"
          >
            <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover/back:-translate-x-0.5" />
            Back to Recruitment Hub
          </Link>
        </div>
      )}

      {isAttendanceSubPage && (
        <div className="mb-1 flex items-center">
          <Link
            to="/dashboard/attendance"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer group/back"
          >
            <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover/back:-translate-x-0.5" />
            Back to Attendance Hub
          </Link>
        </div>
      )}
      {isPeopleSubPage && (
        <div className="mb-1 flex items-center">
          <Link
            to="/dashboard/people"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer group/back"
          >
            <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover/back:-translate-x-0.5" />
            Back to People Hub
          </Link>
        </div>
      )}
      <div className="flex min-w-0 flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-semibold tracking-tight">{title}</h1>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
      </div>
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
