import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { lazy, memo, Suspense, useEffect, useMemo, useState } from "react";
import { listenForCrossTabLogout, forceLocalLogout } from "@/lib/auth-bootstrap";
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
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  Clock,
  Compass,
  CreditCard,
  FileCheck,
  FileSearch,
  FileSignature,
  FileText,
  Folder,
  Globe,
  HandCoins,
  Home,
  Laptop,
  Layers,
  LayoutDashboard,
  LifeBuoy,
  LineChart as LineChartIcon,
  Lock,
  LogOut,
  Megaphone,
  Menu,
  MessageSquare,
  Moon,
  Package,
  PanelLeft,
  PhoneCall,
  Receipt,
  Rocket,
  ScrollText,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  Target,
  Ticket,
  Timer,
  TrendingUp,
  User,
  UserCheck,
  Users,
  Video,
  Wrench,
} from "lucide-react";
import { aurix, useAurix } from "@/lib/aurix-store";
import { useAuthReady } from "@/lib/auth-bootstrap";
import { getDefaultDashboardPath } from "@/lib/role-routing";
import { normalizeRole } from "@/lib/roles";
import { useCurrentRole } from "@/lib/use-current-role";
import { UserProfileMenu } from "./UserProfileMenu";
import { NotificationDropdown } from "./NotificationDropdown";
import { GeminiIcon } from "@/components/icons/GeminiIcon";
import { hasValidAccessToken } from "@/api/token-utils";
import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";
import { DocumentVerificationGuard } from "@/features/document-verification/components/DocumentVerificationGuard";
import { RealtimeCallProvider } from "@/features/connect/providers/RealtimeCallProvider";
import { GlobalCallOverlay } from "@/features/connect/components/GlobalCallOverlay";

const QuickSearchDialog = lazy(() => import("./QuickSearchDialog"));
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
  SidebarNavLeaf,
  SidebarNavParent,
  SidebarNavSection,
} from "@/store/sidebar/sidebarTypes";

const isParent = (i: SidebarNavItem): i is SidebarNavParent => "children" in i;

// ── Badge color map ────────────────────────────────────────────
const BADGE_STYLES: Record<BadgeKind, string> = {
  New: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25",
  AI: "bg-primary/10 text-primary border border-primary/25",
  Beta: "bg-amber-500/12 text-amber-700 dark:text-amber-300 border border-amber-500/25",
  Hot: "bg-rose-500/12 text-rose-700 dark:text-rose-300 border border-rose-500/25",
  Live: "bg-rose-500/12 text-rose-700 dark:text-rose-300 border border-rose-500/25",
};

function NavBadge({ kind }: { kind: BadgeKind }) {
  return (
    <span className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${BADGE_STYLES[kind]}`}>
      {kind}
    </span>
  );
}

function NavCount({ count }: { count: number }) {
  return (
    <span className="ml-auto shrink-0 min-w-[20px] rounded-full bg-destructive px-1.5 py-0.5 text-center text-xs font-semibold text-destructive-foreground">
      {count > 99 ? "99+" : count}
    </span>
  );
}

// ── Helpdesk Nav Item ──────────────────────────────────────────
const HELP_NAV_ITEM: SidebarNavLeaf = {
  to: "/dashboard/helpdesk",
  label: "Helpdesk",
  icon: LifeBuoy,
};

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
        to: "/dashboard/announcements",
        label: "Announcements",
        icon: Megaphone,
        permission: "announcements.view",
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
        roles: ["super_admin", "hr_admin", "manager"],
      },
      {
        to: "/dashboard/hr-operations",
        label: "HR Operations",
        icon: Activity,
        permission: "hrops.view",
        roles: ["super_admin", "hr_admin"],
      },
      {
        to: "/dashboard/resources",
        label: "Resources",
        icon: Folder,
        permission: "resources.view",
      },
      {
        to: "/dashboard/payroll",
        label: "Payroll",
        icon: Banknote,
        permission: "payroll.view",
        roles: ["super_admin", "hr_admin"],
      },
      {
        to: "/dashboard/analytics",
        label: "Analytics",
        icon: BarChart3,
        permission: "analytics.view",
        roles: ["super_admin", "hr_admin", "executive", "manager"],
        matchPrefixes: ["/dashboard/recruitment/analytics"],
      },
      {
        to: "/dashboard/autopilot",
        label: "OneHR",
        icon: Layers,
        permission: "autopilot.view",
        roles: ["super_admin", "hr_admin", "manager"],
      },
      {
        to: "/dashboard/ai-hub",
        label: "AI Hub",
        icon: GeminiIcon,
        permission: "ai.view",
      },
      HELP_NAV_ITEM,
      {
        to: "/dashboard/billing",
        label: "Billing & Plans",
        icon: CreditCard,
        roles: ["super_admin", "hr_admin"],
        matchPrefixes: ["/dashboard/settings/billing"],
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
        to: "/dashboard/announcements",
        label: "Announcements",
        icon: Megaphone,
      },
      {
        to: "/dashboard/attendance",
        label: "Attendance",
        icon: CalendarCheck,
      },
      {
        to: "/dashboard/timesheets",
        label: "Timesheets",
        icon: Timer,
      },
      {
        to: "/dashboard/resources/expenses",
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
        to: "/dashboard/exit",
        label: "Exit & Resignation",
        icon: LogOut,
      },
      {
        to: "/dashboard/autopilot/agent",
        label: "HR Agent",
        icon: Layers,
      },
      HELP_NAV_ITEM,
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
        to: "/dashboard/announcements",
        label: "Announcements",
        icon: Megaphone,
      },
      {
        to: "/dashboard/workforce",
        label: "My Team",
        icon: Users,
      },
      {
        to: "/dashboard/timesheets",
        label: "Timesheets",
        icon: Timer,
      },
      {
        to: "/dashboard/resources/expenses",
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
        to: "/dashboard/autopilot",
        label: "OneHR",
        icon: Layers,
      },
      {
        to: "/dashboard/ai-hub",
        label: "AI Assistant",
        icon: Brain,
      },
      HELP_NAV_ITEM,
      {
        to: "/dashboard/settings",
        label: "Settings",
        icon: Settings,
      },
    ],
  },
];

const SUPER_ADMIN_NAV_SECTIONS: SidebarNavSection[] = [
  {
    roles: ["super_admin"],
    items: [
      {
        to: "/dashboard/super-admin",
        label: "Overview",
        icon: LayoutDashboard,
        exact: true,
        permission: "platform.overview",
        roles: ["super_admin"],
      },
      {
        to: "/dashboard/super-admin/users",
        label: "Users",
        icon: Users,
        permission: "platform.users",
        roles: ["super_admin"],
      },
      {
        to: "/dashboard/super-admin/organizations",
        label: "Organizations",
        icon: Building2,
        permission: "platform.organizations",
        roles: ["super_admin"],
      },
      {
        to: "/dashboard/super-admin/analytics",
        label: "Usage & Analytics",
        icon: BarChart3,
        permission: "platform.analytics",
        roles: ["super_admin"],
      },
      {
        to: "/dashboard/super-admin/activity",
        label: "System Activity",
        icon: Activity,
        permission: "platform.activity",
        roles: ["super_admin"],
      },
      {
        to: "/dashboard/super-admin/security",
        label: "Security & Sessions",
        icon: Lock,
        permission: "platform.activity",
        roles: ["super_admin"],
        matchPrefixes: ["/dashboard/super-admin/security/sessions"],
      },
      {
        to: "/dashboard/super-admin/audit-logs",
        label: "Audit Logs",
        icon: FileText,
        permission: "platform.audit_logs",
        roles: ["super_admin"],
      },
      {
        to: "/dashboard/super-admin/settings",
        label: "System Settings",
        icon: Settings,
        permission: "platform.settings",
        roles: ["super_admin"],
      },
      {
        to: "/dashboard/super-admin/platform-config",
        label: "Platform Configuration",
        icon: ShieldCheck,
        permission: "platform.config",
        roles: ["super_admin"],
      },
    ],
  },
];

// F-08: Consolidated executive navigation pointing to real role command centers wired to executiveApi
const EXECUTIVE_NAV_SECTIONS: SidebarNavSection[] = [
  {
    items: [
      { to: "/dashboard/executive", label: "Executive Overview", icon: Home, exact: true },
      { to: "/dashboard/executive/cto", label: "CTO Technology", icon: Wrench },
      { to: "/dashboard/announcements", label: "Announcements", icon: Megaphone },
      { to: "/dashboard/reports", label: "Company Reports", icon: LineChartIcon },
      { to: "/dashboard/analytics", label: "Analytics Hub", icon: BarChart3 },
      HELP_NAV_ITEM,
      { to: "/dashboard/settings", label: "Settings", icon: Settings },
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
      HELP_NAV_ITEM,
      { to: "/dashboard/settings", label: "Settings", icon: Settings },
    ],
  },
];

const RECRUITER_NAV_SECTIONS: SidebarNavSection[] = [
  {
    items: [
      {
        to: "/dashboard/recruitment",
        label: "Recruitment Hub",
        icon: Briefcase,
        exact: true,
      },
      {
        to: "/dashboard/recruitment/jobs",
        label: "Jobs & Requisitions",
        icon: Briefcase,
      },
      {
        to: "/dashboard/recruitment/candidates",
        label: "Candidates",
        icon: Users,
      },
      {
        to: "/dashboard/recruitment/pipeline",
        label: "Pipeline",
        icon: LayoutDashboard,
      },
      {
        to: "/dashboard/recruitment/interviews",
        label: "Interviews",
        icon: CalendarClock,
      },
      {
        to: "/dashboard/recruitment/talent-pool",
        label: "Talent Pool",
        icon: UserCheck,
      },
      {
        to: "/dashboard/recruitment/reports",
        label: "Reports",
        icon: BarChart3,
      },
      {
        to: "/dashboard/ai-hub",
        label: "AI Assistant",
        icon: GeminiIcon,
      },
      HELP_NAV_ITEM,
      {
        to: "/dashboard/settings/profile",
        label: "My Settings",
        icon: Settings,
      },
    ],
  },
];


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
  const location = useRouterState({ select: (s) => s.location });
  const currentPathname = location.pathname;
  const search = (location.search || {}) as Record<string, any>;
  const expandedSections = useAppSelector(selectExpandedSections);
  const sectionKey = item.id ?? "";
  const isExpanded = Boolean(expandedSections[sectionKey]);

  const isChildActive = (child: SidebarNavLeaf) => {
    const targetPath = child.to ?? "";
    const [pathOnly, searchStr] = targetPath.split("?");
    const pathMatches = child.exact
      ? currentPathname === pathOnly
      : currentPathname === pathOnly || currentPathname.startsWith(pathOnly + "/");

    if (!pathMatches) return false;

    if (searchStr) {
      const childParams = new URLSearchParams(searchStr);
      for (const [key, val] of childParams.entries()) {
        if (String(search[key] ?? "") !== val) {
          return false;
        }
      }
      return true;
    }

    if (child.exact && (search.dept || search.category)) {
      return false;
    }

    return true;
  };

  const hasActiveChild = item.children.some((child) => isChildActive(child));
  const basePath = item.basePath ?? "";
  const isActive = hasActiveChild || currentPathname === basePath || currentPathname.startsWith(basePath + "/");

  useEffect(() => {
    if (isActive && !isExpanded) {
      dispatch(setSectionExpand({ sectionKey, expanded: true }));
    }
  }, [isActive, sectionKey, isExpanded, dispatch]);

  const Icon = item.icon;

  if (collapsed) {
    return (
      <Link
        to={basePath as any}
        aria-current={isActive ? "page" : undefined}
        className={`group relative flex items-center justify-center rounded-lg py-2 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          isActive
            ? "bg-primary/10 text-primary font-semibold"
            : "font-medium text-muted-foreground hover:bg-accent/70 hover:text-foreground"
        }`}
        title={item.label}
        aria-label={item.label}
      >
        {isActive ? <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-primary" /> : null}
        <Icon className="h-4 w-4 shrink-0" />
      </Link>
    );
  }

  return (
    <div>
      <div
        className={`group relative flex w-full items-center rounded-lg text-[13px] transition-colors ${
          isActive
            ? "bg-primary/10 text-primary font-semibold"
            : "font-medium text-muted-foreground hover:bg-accent/70 hover:text-foreground"
        }`}
      >
        {isActive ? <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-primary" /> : null}
        <button
          type="button"
          aria-expanded={isExpanded}
          onClick={() => {
            dispatch(toggleSectionExpand(sectionKey));
          }}
          className="flex flex-1 items-center gap-2.5 rounded-lg px-2.5 py-2 min-w-0 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Icon className="h-4 w-4 shrink-0" />
          <span className="flex-1 truncate whitespace-nowrap text-[13px]">{item.label}</span>
          {item.badge && !item.count && <NavBadge kind={item.badge} />}
          {item.count !== undefined && !item.badge && <NavCount count={item.count} />}
          <ChevronDown
            className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {isExpanded ? (
        <div className="ml-3 mt-1 space-y-0.5 border-l border-border pl-2.5 transition-all duration-200">
          {item.children.map((child) => {
            const childActive = isChildActive(child);
            const ChildIcon = child.icon;
            const targetPath = child.to ?? "";
            const [pathOnly, searchStr] = targetPath.split("?");
            const searchObj = searchStr ? Object.fromEntries(new URLSearchParams(searchStr)) : undefined;

            return (
              <Link
                key={targetPath}
                to={pathOnly as any}
                search={searchObj as any}
                aria-current={childActive ? "page" : undefined}
                className={`flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] transition-colors min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  childActive
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:bg-accent/70 hover:text-foreground"
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

  const userId = ws.user?.id;
  useEffect(() => {
    if (authReady && userId) {
      dispatch(fetchSidebarPermissions(currentRole ?? undefined));
    }
  }, [dispatch, authReady, userId, currentRole]);

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

    if (!ws.user.emailVerified) {
      navigate({ to: "/verify-email", replace: true });
      return;
    }

    if (pathname === "/dashboard/employee" && currentRole !== "employee") {
      if (currentRole === "manager") {
        navigate({ to: "/dashboard/manager" });
        return;
      }
      navigate({ to: getDefaultDashboardPath(ws.user) });
      return;
    }

    if (pathname === "/onboarding") {
      if (currentRole === "employee") {
        navigate({ to: "/dashboard/employee" });
        return;
      }
    }

    if ((currentRole === "hr_admin" || ws.user.role === "hr_admin") && ws.user.onboardingComplete === false) {
      if (pathname.startsWith("/dashboard")) {
        navigate({ to: "/onboarding", replace: true });
        return;
      }
    }
  }, [authReady, ws.isRestoring, ws.user, pathname, currentRole, navigate]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Cross-tab logout synchronization
  useEffect(() => {
    return listenForCrossTabLogout(() => {
      forceLocalLogout();
    });
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const visibleNav = useMemo(() => {
    const isSuperAdminPortalPath = pathname === "/dashboard/super-admin" || pathname.startsWith("/dashboard/super-admin/");
    const isEmployeePortalPath = pathname === "/dashboard/employee" || pathname.startsWith("/dashboard/employee/");
    const isManagerPortalPath = pathname === "/dashboard/manager" || pathname.startsWith("/dashboard/manager/");
    const isExecutivePortalPath = pathname === "/dashboard/executive" || pathname.startsWith("/dashboard/executive/");

    if (currentRole === "super_admin" || isSuperAdminPortalPath) {
      return filterNavTree(SUPER_ADMIN_NAV_SECTIONS, currentRole || undefined, userPermissions);
    }
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
    if (currentRole === "recruiter") {
      return filterNavTree(RECRUITER_NAV_SECTIONS, currentRole || undefined, userPermissions);
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

  const homeLink = getDefaultDashboardPath(ws.user);
  const navSections = visibleNav.length > 0 ? visibleNav : NAV_SECTIONS;

  const activeSectionLabel = useMemo(() => {
    for (const section of navSections) {
      for (const item of section.items) {
        if (isParent(item)) {
          const matchedChild = item.children.find((child) => {
            const targetPath = child.to ?? "";
            const [pathOnly] = targetPath.split("?");
            return child.exact
              ? pathname === pathOnly
              : pathname === pathOnly || pathname.startsWith(pathOnly + "/");
          });
          if (matchedChild) return matchedChild.label;
          if (pathname === item.basePath || pathname.startsWith(item.basePath + "/")) {
            return item.label;
          }
        } else {
          const targetPath = item.to ?? "";
          const matches = item.exact
            ? pathname === targetPath
            : pathname === targetPath ||
              pathname.startsWith(targetPath + "/") ||
              (item.matchPrefixes?.some((prefix) => pathname === prefix || pathname.startsWith(prefix + "/")) ?? false);
          if (matches) return item.label;
        }
      }
    }
    const segments = pathname.split("/").filter(Boolean);
    const last = segments[segments.length - 1];
    if (!last || last === "dashboard") return "Overview";
    return last
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }, [navSections, pathname]);

  return (
    <DocumentVerificationGuard>
      <RealtimeCallProvider>
        <div className="flex min-h-screen w-full flex-col overflow-x-clip bg-background text-foreground">

      <div className="relative flex min-w-0 flex-1">
        {/* Sidebar — fixed to viewport; main content scrolls independently */}
        <aside
          aria-label="Sidebar navigation"
          className={`fixed left-0 z-40 flex flex-col border-r border-border bg-card transition-[width,transform] duration-200 ${
            "inset-y-0"
          } ${collapsed ? "w-[64px]" : "w-[228px]"} ${
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div className={`flex h-16 shrink-0 items-center border-b border-border px-3 ${collapsed ? "justify-center" : "justify-between"}`}>
            {!collapsed ? (
              <>
                <Link
                  to={homeLink}
                  className="flex items-center gap-2.5 min-w-0 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-xs">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                  <span className="font-display text-base font-semibold tracking-tight truncate text-foreground">OFC360</span>
                </Link>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSearchOpen(true)}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Search"
                    title="Search (Ctrl+K)"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCollapsed(true)}
                    className="hidden rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground lg:inline-flex cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="Collapse sidebar"
                    title="Collapse sidebar"
                  >
                    <PanelLeft className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setCollapsed(false)}
                className="rounded-md p-1.5 hover:bg-accent cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Expand sidebar"
                title="OFC360 - Expand sidebar"
              >
                <span
                  role="img"
                  aria-label="OFC360 logo"
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground shadow-xs"
                >
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </button>
            )}
          </div>

          <nav className="flex-1 space-y-2 overflow-y-auto overflow-x-hidden p-2.5">
            {navSections.map((section, sIdx) => (
              <div key={section.id || sIdx} className="space-y-1">
                {section.title && !collapsed ? (
                  <div className="px-2.5 pb-1 pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">
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
                  const active = item.exact
                      ? pathname === item.to
                      : pathname === item.to ||
                        pathname.startsWith(item.to + "/") ||
                        (item.matchPrefixes?.some((prefix) => pathname === prefix || pathname.startsWith(prefix + "/")) ?? false);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.to}
                      to={item.to as string}
                      title={collapsed ? item.label : undefined}
                      aria-current={active ? "page" : undefined}
                      className={`group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        active
                          ? "bg-primary/10 text-primary font-semibold"
                          : "font-medium text-muted-foreground hover:bg-accent/70 hover:text-foreground"
                        } ${collapsed ? "justify-center px-0" : ""}`}
                    >
                      {active ? <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-primary" /> : null}
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
          className={`flex min-h-screen min-w-0 flex-1 flex-col overflow-x-clip transition-[margin] duration-200 ${
            collapsed ? "lg:ml-[64px]" : "lg:ml-[228px]"
          }`}
        >
          {/* Topbar */}
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/95 px-4 backdrop-blur-sm sm:px-6">
            <div className="flex min-w-0 items-center gap-2.5">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <span className="truncate text-sm font-semibold text-foreground lg:hidden">
                {activeSectionLabel}
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[13px] text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer transition-colors shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                title="Search (Ctrl+K)"
                aria-label="Open quick search"
              >
                <Search className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Search</span>
                <kbd className="hidden rounded bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground sm:inline-block">
                  ⌘K
                </kbd>
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <NotificationDropdown />
              <div className="hidden items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-[13px] sm:flex">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="max-w-[160px] truncate font-medium text-foreground">{ws.company?.name || "Workspace"}</span>
              </div>
              <UserProfileMenu variant="topbar" />
            </div>
          </header>

          <main className="min-w-0 flex-1 overflow-x-clip p-4 sm:p-6 lg:p-8">
            <BackButton className="mb-4" />
            <Suspense fallback={<PageSkeleton />}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>

      {/* Global Native WebRTC Call Overlay */}
      <GlobalCallOverlay />

      {/* ChatGPT-style Quick Search Modal */}
      {searchOpen ? (
        <Suspense fallback={null}>
          <QuickSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
        </Suspense>
      ) : null}
      </div>
    </RealtimeCallProvider>
    </DocumentVerificationGuard>
  );
}

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
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-[26px]">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
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
    <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
      <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <h2 className="font-display text-lg font-semibold tracking-tight text-foreground">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
