import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Activity, AlertCircle, Archive, Award, Banknote, BarChart3, Bell, BookOpen, Bot, Brain,
  Briefcase, Building2, CalendarDays, CalendarCheck, CheckCircle2, ChevronLeft, ChevronsLeft, ChevronsRight,
  ChevronDown, ClipboardCheck, Clock, CreditCard, Download, FileCheck, FileText, FilePlus2,
  FileSignature, Folder, FolderOpen, Gauge, Gift, Globe, HandCoins, HeartPulse, History,
  Info, Languages, LayoutDashboard, LineChart as LineChartIcon, Lock, LogOut, Mail, Medal,
  Menu, MessageCircle, MessageSquare, Mic, MinusCircle, Moon, Package, Palmtree, Percent,
  PlayCircle, Plane, Receipt, ScanLine, ScrollText, Search, Settings, ShieldCheck, Sparkles,
  Star, Sun, Target, Timer, TrendingUp, Trophy, User, UserCheck, UserCog, UserPlus, Users, Video,
  Wallet, Workflow, X, Zap, Clock3, ListTodo, CalendarRange, FileBarChart, Lightbulb,
  ClipboardList, BadgeCheck, Headphones, HelpCircle, TicketCheck, Map, Laptop, Printer,
  Repeat, Wrench, TrendingDown, BrainCircuit, Fingerprint, Coffee, HeartHandshake, GraduationCap,
  BookMarked, PenLine, FileEdit, Landmark, Coins, Building, Hash, Sliders, Shield, Layers, PackageCheck,
} from "lucide-react";
import { aurix, useAurix, type Role } from "@/lib/aurix-store";
import { useAuthReady } from "@/lib/auth-bootstrap";
import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";
import { hasValidAccessToken, setTokens } from "@/api";
import { Input } from "@/components/ui/input";
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
  const authReady = useAuthReady();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [demoDismissed, setDemoDismissed] = useState(false);

  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { theme, toggle: toggleTheme } = useTheme();

  const role = (ws.user?.role ?? "admin") as string;
  const isDemo = Boolean(ws.isDemoUser) && !demoDismissed;

  const userPermissions = useAppSelector(selectUserPermissions);

  // Fetch backend sidebar permissions when auth is ready
  useEffect(() => {
    if (authReady && ws.user) {
      dispatch(fetchSidebarPermissions(role));
    }
  }, [authReady, ws.user, role, dispatch]);

  // Update active route in Redux
  useEffect(() => {
    dispatch(setActiveRoute(pathname));
  }, [pathname, dispatch]);

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
        "/dashboard/workforce/people",
        "/dashboard/workforce/departments",
        "/dashboard/talent",
        "/dashboard/hr-operations",
        "/dashboard/analytics",
        "/dashboard/settings/roles-permissions",
        "/dashboard/settings/company",
        "/dashboard/settings/audit-logs",
        "/dashboard/settings/billing",
        "/dashboard/settings/integrations",
      ];
      const isTryingToAccessAdminManager = adminManagerPaths.some((p) => pathname.startsWith(p));
      if (isTryingToAccessAdminManager) {
        navigate({ to: "/dashboard/employee" });
      }
    }
  }, [authReady, ws.isRestoring, ws.user, pathname, role, navigate]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const visibleNav = useMemo(
    () => filterNavTree(NAV_SECTIONS, role, userPermissions),
    [role, userPermissions]
  );

  if (!authReady || ws.isRestoring || !ws.user) {
    return <AuthLoadingScreen />;
  }

  function logout() {
    setTokens(null);
    aurix.reset();
    navigate({ to: "/login" });
  }

  const initials = ws.user.fullName?.split(" ").map((p) => p[0]).slice(0, 2).join("") || "A";

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

      <div className="relative flex min-w-0 flex-1">
        {/* Sidebar — fixed to viewport; main content scrolls independently */}
        <aside
          className={`fixed left-0 z-40 flex flex-col border-r border-border bg-card/60 backdrop-blur-xl transition-[width,transform] duration-200 ${
            isDemo ? "top-9 bottom-0" : "inset-y-0"
          } ${collapsed ? "w-[68px]" : "w-64"} ${
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
            <Link to={homeLink as any} className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg text-brand-foreground shadow-glow" style={{ background: "var(--gradient-brand)" }}>
                <Sparkles className="h-4 w-4" />
              </span>
              {!collapsed ? <span className="font-display text-lg font-semibold tracking-tight">Aurix</span> : null}
            </Link>
            <button onClick={() => setCollapsed((c) => !c)} className="hidden rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground lg:inline-flex cursor-pointer" aria-label="Toggle sidebar">
              {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
            </button>
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
                  <div className="truncate text-xs capitalize text-muted-foreground">{ws.user?.role}</div>
                </div>
              ) : null}
              {!collapsed ? (
                <button onClick={logout} className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer" aria-label="Sign out">
                  <LogOut className="h-4 w-4" />
                </button>
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
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/70 px-4 backdrop-blur-xl sm:px-6">
            <button onClick={() => setMobileOpen(true)} className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden cursor-pointer" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <div className="relative max-w-md flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search employees, departments, requests…" className="h-9 pl-9" />
            </div>
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
          </header>

          <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
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

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: React.ReactNode }) {
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

  return (
    <div className="mb-6 flex flex-col min-w-0 gap-2 text-left">
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
      {isPayrollSubPage && (
        <div className="mb-1 flex items-center">
          <Link
            to="/dashboard/payroll"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer group/back"
          >
            <ChevronLeft className="h-3.5 w-3.5 transition-transform group-hover/back:-translate-x-0.5" />
            Back to Payroll Hub
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
