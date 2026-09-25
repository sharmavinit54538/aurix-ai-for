import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { memo, Suspense, useEffect, useMemo, useState } from "react";
import { PageSkeleton } from "@/components/common/PageSkeleton";
import { BackButton } from "@/components/common/BackButton";
// Executive Dashboards Navigation Enabled
import {
  Activity,
  Banknote,
  BarChart3,
  Bell,
  Bot,
  Brain,
  Briefcase,
  Building,
  Building2,
  CalendarClock,
  CalendarDays,
  ClipboardCheck,
  Clock,
  Compass,
  FileCheck,
  FileSearch,
  FileSignature,
  FileText,
  Folder,
  Globe,
  HandCoins,
  Home,
  Laptop,
  LayoutDashboard,
  LineChart as LineChartIcon,
  Lock,
  Menu,
  Moon,
  Package,
  PanelLeft,
  Receipt,
  Rocket,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  Timer,
  TrendingUp,
  User,
  UserCheck,
  Users,
  Video,
  Wrench,
} from "lucide-react";
import { useAurix } from "@/lib/aurix-store";
import { useAuthReady } from "@/lib/auth-bootstrap";
import { getRoleDefaultHome } from "@/lib/route-guards";
import { normalizeRole, useCurrentRole } from "@/lib/roles";
import { UserProfileMenu } from "./UserProfileMenu";
import { GeminiIcon } from "@/components/icons/GeminiIcon";
import { hasValidAccessToken } from "@/api";
import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";
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
import {
  selectExpandedSections,
  selectUserPermissions,
  filterNavTree,
} from "@/store/sidebar/sidebarSelectors";
import {
  fetchSidebarPermissions,
  setSectionExpand,
  toggleSectionExpand,
} from "@/store/sidebar/sidebarSlice";
import type {
  BadgeKind,
  SidebarNavItem,
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
  Live: "bg-red-500/20 text-red-400 border border-red-500/30",
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
      },
      {
        to: "/dashboard/workforce",
        label: "Workforce",
        icon: Users,
      },
      {
        to: "/dashboard/attendance",
        label: "Attendance",
        icon: Clock,
        roles: ["superadmin", "hr_admin", "manager"],
      },
      {
        to: "/dashboard/leaves",
        label: "Leaves",
        icon: CalendarDays,
        roles: ["superadmin", "hr_admin", "manager"],
      },
      {
        to: "/dashboard/talent",
        label: "Talent Management",
        icon: Briefcase,
        roles: ["superadmin", "hr_admin", "manager"],
      },
      {
        to: "/dashboard/hr-operations",
        label: "HR Operations",
        icon: Activity,
        roles: ["superadmin", "hr_admin"],
      },
      {
        to: "/dashboard/resources",
        label: "Resources",
        icon: Folder,
      },
      {
        to: "/dashboard/payroll",
        label: "Payroll",
        icon: Banknote,
        roles: ["superadmin", "hr_admin"],
      },
      {
        to: "/dashboard/analytics",
        label: "Analytics",
        icon: BarChart3,
        roles: ["superadmin", "hr_admin", "manager"],
      },
      {
        to: "/dashboard/ai-hub",
        label: "AI Hub",
        icon: GeminiIcon,
      },
      {
        to: "/dashboard/settings",
        label: "Settings",
        icon: Settings,
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
        to: "/dashboard/recruitment/hiring-manager",
        label: "Hiring Manager Hub",
        icon: UserCheck,
        badge: "Hot",
      },
      {
        to: "/dashboard/recruitment/requisitions",
        label: "Team Requisitions",
        icon: FileSignature,
      },
      {
        to: "/dashboard/recruitment/interviews",
        label: "Interviews",
        icon: CalendarClock,
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

// TODO: Merging separate executive (CEO/CTO/CIO) nav sections into a single unified navigation structure is a product decision. Preserved unified executive navigation for 'executive' role.
const EXECUTIVE_NAV_SECTIONS: SidebarNavSection[] = [
  {
    title: "EXECUTIVE DASHBOARD",
    items: [
      { to: "/dashboard/executive", label: "Overview", icon: Home, exact: true },
      { to: "/dashboard/executive/ceo/business", label: "Business", icon: TrendingUp },
      { to: "/dashboard/executive/ceo/finance", label: "Finance", icon: HandCoins },
      { to: "/dashboard/executive/ceo/organization", label: "Organization", icon: Users },
      { to: "/dashboard/executive/ceo/reports", label: "Reports", icon: LineChartIcon },
      { to: "/dashboard/executive/cio/it-operations", label: "Technology Operations", icon: Laptop },
      { to: "/dashboard/executive/cto/engineering", label: "Engineering", icon: Wrench },
      { to: "/dashboard/executive/cto/security", label: "Security", icon: Lock },
    ],
  },
];

const IT_ADMIN_NAV_SECTIONS: SidebarNavSection[] = [
  {
    title: "IT ADMINISTRATION",
    items: [
      { to: "/dashboard", label: "System Overview", icon: LayoutDashboard, exact: true },
      { to: "/dashboard/admin", label: "System Controls", icon: ShieldCheck },
      { to: "/dashboard/assets", label: "Assets", icon: Package },
      { to: "/dashboard/settings", label: "Settings", icon: Settings },
    ],
  },
];


export function DashboardShell() {
  const ws = useAurix();
  const currentRole = useCurrentRole();
  const navigate = useNavigate();
  const authReady = useAuthReady();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const dispatch = useAppDispatch();
  const userPermissions = useAppSelector(selectUserPermissions);
  const { theme, toggle: toggleTheme } = useTheme();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);


  useEffect(() => {
    if (authReady && ws.user) {
      dispatch(fetchSidebarPermissions(currentRole));
    }
  }, [dispatch, authReady, ws.user, currentRole]);

  // ── Auth & Role guard ────────────────────────────────────────
  useEffect(() => {
    if (!authReady || ws.isRestoring) return;

    if (!ws.user) {
      // Backup client guard: Redirect to login if user is not restored and has no valid token.
      // (Primary protection is enforced via beforeLoad in routes/dashboard.tsx).
      if (!hasValidAccessToken()) {
        navigate({ to: "/login", replace: true });
      }
      return;
    }

    if (pathname === "/dashboard/employee" && currentRole !== "employee") {
      if (currentRole === "manager") {
        navigate({ to: "/dashboard/manager" });
        return;
      }
      navigate({ to: getRoleDefaultHome(currentRole) });
      return;
    }

    if (pathname === "/onboarding") {
      if (currentRole === "employee") {
        navigate({ to: "/dashboard/employee" });
        return;
      }
    }
  }, [authReady, ws.isRestoring, ws.user, pathname, currentRole, navigate]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const visibleNav = useMemo(() => {
    const isEmployeePortalPath = pathname === "/dashboard/employee" || pathname.startsWith("/dashboard/employee/");
    const isManagerPortalPath = pathname === "/dashboard/manager" || pathname.startsWith("/dashboard/manager/");
    const isExecutivePortalPath = pathname === "/dashboard/executive" || pathname.startsWith("/dashboard/executive/");

    if (currentRole === "executive" || isExecutivePortalPath) {
      return filterNavTree(EXECUTIVE_NAV_SECTIONS, currentRole || undefined, userPermissions);
    }
    if (currentRole === "it_admin") {
      return filterNavTree(IT_ADMIN_NAV_SECTIONS, currentRole || undefined, userPermissions);
    }
    if (currentRole === "employee" || isEmployeePortalPath) {
      return filterNavTree(EMPLOYEE_NAV_SECTIONS, currentRole || undefined, userPermissions);
    }
    if (currentRole === "manager" || isManagerPortalPath) {
      return filterNavTree(MANAGER_NAV_SECTIONS, currentRole || undefined, userPermissions);
    }
    const computed = filterNavTree(NAV_SECTIONS, currentRole || undefined, userPermissions);
    return computed && computed.length > 0 ? computed : NAV_SECTIONS;
  }, [currentRole, pathname, userPermissions]);

  if (!authReady || ws.isRestoring) {
    return <AuthLoadingScreen />;
  }

  if (!ws.user) {
    return null;
  }

  const homeLink = getRoleDefaultHome(currentRole);

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-hidden bg-background text-foreground">

      <div className="relative flex min-w-0 flex-1">
        {/* Sidebar — fixed to viewport; main content scrolls independently */}
        <aside
          className={`fixed left-0 z-40 flex flex-col border-r border-border bg-card/60 backdrop-blur-xl transition-[width,transform] duration-200 ${
            "inset-y-0"
          } ${collapsed ? "w-[60px]" : "w-[200px]"} ${
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className={`flex h-16 shrink-0 items-center border-b border-border px-2.5 ${collapsed ? "justify-center" : "justify-between"}`}>
            {!collapsed ? (
              <>
                <Link to={homeLink} className="flex items-center gap-2 min-w-0">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-brand-foreground shadow-glow" style={{ background: "var(--gradient-brand)" }}>
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                  <span className="font-display text-base font-semibold tracking-tight truncate">OFC360</span>
                </Link>
                <div className="flex items-center gap-0.5 shrink-0">
                  <button
                    onClick={() => setSearchOpen(true)}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer transition-colors"
                    aria-label="Search"
                    title="Search (Ctrl+K)"
                  >
                    <Search className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setCollapsed(true)}
                    className="hidden rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground lg:inline-flex cursor-pointer transition-colors"
                    aria-label="Collapse sidebar"
                    title="Collapse sidebar"
                  >
                    <PanelLeft className="h-3.5 w-3.5" />
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

          <nav className="flex-1 space-y-1.5 overflow-y-auto overflow-x-hidden p-2">
            {(visibleNav.length > 0 ? visibleNav : NAV_SECTIONS).map((section, sIdx) => (
              <div key={section.id || sIdx} className="space-y-0.5">
                {section.title && !collapsed ? (
                  <div className="px-2 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 truncate">
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
                      to={item.to as string}
                      title={collapsed ? item.label : undefined}
                      className={`group relative flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors ${
                        active ? "bg-accent text-foreground font-semibold" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                      } ${collapsed ? "justify-center px-0" : ""}`}
                    >
                      {active ? <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-foreground" /> : null}
                      <Icon className="h-4 w-4 shrink-0" />
                      {!collapsed ? (
                        <>
                          <span className="flex-1 truncate whitespace-nowrap text-[13px]">{item.label}</span>
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
        </aside>

        {mobileOpen ? <div onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden" /> : null}

        <div
          className={`flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden transition-[margin] duration-200 ${
            collapsed ? "lg:ml-[60px]" : "lg:ml-[200px]"
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
              <UserProfileMenu variant="topbar" />
            </div>
          </header>

          <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">
            <BackButton className="mb-4" />
            <Suspense fallback={<PageSkeleton />}>
              <Outlet />
            </Suspense>
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
                navigate({ to: "/dashboard" });
                setSearchOpen(false);
              }}
              className="cursor-pointer"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Overview</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                navigate({ to: "/dashboard/people" });
                setSearchOpen(false);
              }}
              className="cursor-pointer"
            >
              <Users className="mr-2 h-4 w-4" />
              <span>Workforce & Employees</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                navigate({ to: "/dashboard/leaves" });
                setSearchOpen(false);
              }}
              className="cursor-pointer"
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              <span>Leaves & Attendance</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                navigate({ to: "/dashboard/payroll" });
                setSearchOpen(false);
              }}
              className="cursor-pointer"
            >
              <Banknote className="mr-2 h-4 w-4" />
              <span>Payroll Dashboard</span>
            </CommandItem>
            <CommandItem
              onSelect={() => {
                navigate({ to: "/dashboard/payroll/periods" });
                setSearchOpen(false);
              }}
              className="cursor-pointer"
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              <span>Payroll Periods</span>
            </CommandItem>
            <CommandItem
              value="AI Hub Gemini Assistant Artificial Intelligence"
              onSelect={() => {
                navigate({ to: "/dashboard/ai-hub" });
                setSearchOpen(false);
              }}
              className="cursor-pointer group"
            >
              <GeminiIcon gradient className="mr-2 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
              <span>AI Hub</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}

const NavGroup = memo(function NavGroup({
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
        to={item.basePath as string}
        className={`group relative flex items-center justify-center rounded-lg py-1.5 text-sm font-medium transition-colors ${
          isActive ? "bg-accent text-foreground font-semibold" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
        }`}
        title={item.label}
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
          to={item.basePath as string}
          onClick={() => {
            dispatch(toggleSectionExpand(item.id));
          }}
          className="flex flex-1 items-center gap-2.5 rounded-lg px-2.5 py-1.5 min-w-0"
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left truncate whitespace-nowrap text-[13px]">{item.label}</span>
          {item.badge && !item.count && <NavBadge kind={item.badge} />}
          {item.count !== undefined && !item.badge && <NavCount count={item.count} />}
        </Link>
      </div>
      {isExpanded ? (
        <div className="ml-3 mt-0.5 space-y-0.5 border-l border-border pl-2 transition-all duration-200">
          {item.children.map((child) => {
            const childActive = child.exact ? pathname === child.to : pathname === child.to || pathname.startsWith(child.to + "/");
            const ChildIcon = child.icon;
            return (
              <Link
                key={child.to}
                to={child.to as string}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors min-w-0 ${
                  childActive ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                }`}
              >
                <ChildIcon className="h-3.5 w-3.5 shrink-0" />
                <span className="flex-1 truncate whitespace-nowrap">{child.label}</span>
                {child.badge && <NavBadge kind={child.badge} />}
                {child.count !== undefined && !child.badge && <NavCount count={child.count} />}
              </Link>
            );
          })}
        </div>
      ) : null}
    </div>
  );
});

export function PageHeader({
  title,
  description,
  actions,
  showBack: _showBack,
  backLink: _backLink,
  backText: _backText,
  onBack: _onBack,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  showBack?: boolean;
  backLink?: string;
  backText?: string;
  onBack?: () => void;
}) {
  return (
    <div className="mb-6 flex flex-col min-w-0 gap-2 text-left">
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

export function ComingSoon({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
}) {
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
