import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Clock,
  Globe,
  KeyRound,
  Laptop,
  Loader2,
  LogOut,
  Monitor,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAurix } from "@/lib/aurix-store";
import { forceLocalLogout } from "@/lib/auth-bootstrap";
import { useCurrentRole } from "@/lib/use-current-role";
import { cn } from "@/lib/utils";
import {
  formatSecurityApiError,
  pickBoolean,
  pickNumber,
  pickString,
  unwrapApiPayload,
} from "@/lib/security-errors";
import {
  useAppSelector,
  useDeletePayrollSecuritySessionMutation,
  useGetPayrollSecuritySessionsQuery,
  useLogoutAllPayrollSecuritySessionsMutation,
} from "@/redux";
import { selectUserPermissions } from "@/store/sidebar/sidebarSelectors";

const PAGE_SIZE = 10;

export interface NormalizedPayrollSession {
  id: string;
  userId?: string | number;
  userName?: string;
  userEmail?: string;
  ipAddress?: string;
  device?: string;
  browser?: string;
  os?: string;
  userAgent?: string;
  loginAt?: string;
  lastActivityAt?: string;
  isCurrentSession: boolean;
  status: string;
}

export function normalizePayrollSessions(rawResponse: unknown): NormalizedPayrollSession[] {
  let list: unknown[] = [];

  if (Array.isArray(rawResponse)) {
    list = rawResponse;
  } else if (rawResponse && typeof rawResponse === "object") {
    const root = rawResponse as Record<string, unknown>;
    const candidates = [root.data, root.sessions, root.items, root.results];
    for (const candidate of candidates) {
      if (Array.isArray(candidate)) {
        list = candidate;
        break;
      }
      if (candidate && typeof candidate === "object") {
        const nested = candidate as Record<string, unknown>;
        if (Array.isArray(nested.sessions)) {
          list = nested.sessions;
          break;
        }
        if (Array.isArray(nested.items)) {
          list = nested.items;
          break;
        }
      }
    }
  }

  const normalized: NormalizedPayrollSession[] = [];
  for (const entry of list) {
    if (!entry || typeof entry !== "object") continue;
    const item = entry as Record<string, unknown>;
    const strId = pickString(item, "id", "session_id", "sessionId");
    const numId = pickNumber(item, "id", "session_id", "sessionId");
    const id = strId ?? (numId !== undefined ? String(numId) : undefined);
    if (!id) continue;

    normalized.push({
      id,
      userId:
        pickString(item, "userId", "user_id") ??
        pickNumber(item, "userId", "user_id"),
      userName: pickString(item, "userName", "user_name", "name"),
      userEmail: pickString(item, "userEmail", "user_email", "email"),
      ipAddress: pickString(item, "ipAddress", "ip_address", "ip"),
      device: pickString(
        item,
        "device",
        "deviceName",
        "device_name",
        "deviceType",
        "device_type",
      ),
      browser: pickString(item, "browser", "browserName", "browser_name"),
      os: pickString(item, "os", "operatingSystem", "operating_system"),
      userAgent: pickString(item, "userAgent", "user_agent"),
      loginAt: pickString(
        item,
        "loginAt",
        "login_at",
        "createdAt",
        "created_at",
        "startedAt",
        "started_at",
      ),
      lastActivityAt: pickString(
        item,
        "lastActivityAt",
        "last_activity_at",
        "lastActive",
        "last_active",
        "updatedAt",
        "updated_at",
      ),
      isCurrentSession:
        pickBoolean(
          item,
          "isCurrentSession",
          "is_current_session",
          "isCurrent",
          "is_current",
          "current",
        ) ?? false,
      status: pickString(item, "status") ?? "Active",
    });
  }

  return normalized;
}

function formatSessionTimestamp(iso?: string): string {
  if (!iso) return "—";
  const parsed = Date.parse(iso);
  if (Number.isNaN(parsed)) return iso;
  return new Date(parsed).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function DeviceIcon({ device }: { device?: string }) {
  if (device && /mobile|phone|android|ios|iphone/i.test(device)) {
    return <Smartphone className="h-4 w-4 text-primary shrink-0" />;
  }
  return <Laptop className="h-4 w-4 text-primary shrink-0" />;
}

export function PayrollSecuritySessionsPage() {
  const ws = useAurix();
  const currentRole = useCurrentRole();
  const userPermissions = useAppSelector(selectUserPermissions);

  const canManagePayrollSecurity =
    currentRole === "hr_admin" ||
    userPermissions.includes("payroll.view") ||
    userPermissions.includes("payroll.security") ||
    userPermissions.includes("*");

  const {
    data: sessionsRaw,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetPayrollSecuritySessionsQuery(undefined, {
    skip: ws.isRestoring || !canManagePayrollSecurity,
  });

  const [deleteSession, { isLoading: isRevoking }] =
    useDeletePayrollSecuritySessionMutation();
  const [logoutAllSessions, { isLoading: isLoggingOutAll }] =
    useLogoutAllPayrollSecuritySessionsMutation();

  const [searchQuery, setSearchQuery] = useState("");
  const [scopeFilter, setScopeFilter] = useState<"all" | "current" | "other">("all");
  const [page, setPage] = useState(1);

  const [sessionToRevoke, setSessionToRevoke] = useState<NormalizedPayrollSession | null>(null);
  const [revokeError, setRevokeError] = useState<string | null>(null);

  const [logoutAllOpen, setLogoutAllOpen] = useState(false);
  const [exceptCurrent, setExceptCurrent] = useState(false);
  const [logoutAllError, setLogoutAllError] = useState<string | null>(null);

  const sessions = useMemo(() => normalizePayrollSessions(sessionsRaw), [sessionsRaw]);
  const currentSessionsCount = useMemo(
    () => sessions.filter((s) => s.isCurrentSession).length,
    [sessions],
  );
  const otherSessionsCount = Math.max(0, sessions.length - currentSessionsCount);
  const currentSession = useMemo(
    () => sessions.find((s) => s.isCurrentSession) ?? null,
    [sessions],
  );

  const filteredSessions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return sessions.filter((session) => {
      if (scopeFilter === "current" && !session.isCurrentSession) return false;
      if (scopeFilter === "other" && session.isCurrentSession) return false;
      if (!q) return true;
      return [
        session.userName,
        session.userEmail,
        session.ipAddress,
        session.device,
        session.browser,
        session.os,
        session.id,
      ]
        .filter(Boolean)
        .some((val) => String(val).toLowerCase().includes(q));
    });
  }, [sessions, searchQuery, scopeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredSessions.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pagedSessions = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredSessions.slice(start, start + PAGE_SIZE);
  }, [filteredSessions, safePage]);

  const parsedLoadError = useMemo(
    () => (isError ? formatSecurityApiError(error, "Unable to load active payroll sessions.") : null),
    [isError, error],
  );

  const handleConfirmRevoke = async () => {
    if (!sessionToRevoke || isRevoking) return;
    setRevokeError(null);
    const target = sessionToRevoke;

    try {
      const res = await deleteSession(target.id).unwrap();
      const payload = unwrapApiPayload<Record<string, unknown>>(res);
      const msg = (payload && pickString(payload, "message")) || "Session revoked successfully.";
      const serverMarkedCurrent =
        payload ? pickBoolean(payload, "currentSessionTerminated", "current_session_terminated") : undefined;

      toast.success(msg);
      setSessionToRevoke(null);

      if (target.isCurrentSession || serverMarkedCurrent === true) {
        toast.info("Your current session has been revoked. Redirecting to login…");
        await forceLocalLogout();
        return;
      }

      try {
        await refetch().unwrap();
      } catch (refreshErr) {
        const formattedRefresh = formatSecurityApiError(refreshErr);
        if (formattedRefresh.isAuthError) {
          await forceLocalLogout();
        }
      }
    } catch (err) {
      const formatted = formatSecurityApiError(err, "Failed to revoke session.");
      setRevokeError(formatted.message);
      toast.error(formatted.message);
      if (formatted.isAuthError) {
        await forceLocalLogout();
      }
    }
  };

  const handleConfirmLogoutAll = async () => {
    if (isLoggingOutAll) return;
    setLogoutAllError(null);

    try {
      const res = await logoutAllSessions(exceptCurrent ? { exceptCurrent: true } : undefined).unwrap();
      const payload = unwrapApiPayload<Record<string, unknown>>(res);
      const msg = (payload && pickString(payload, "message")) || "Logged out payroll security sessions.";
      const explicitCurrentTerminated = payload
        ? pickBoolean(payload, "currentSessionTerminated", "current_session_terminated", "loggedOutCurrent")
        : undefined;
      const explicitExceptCurrent = payload
        ? pickBoolean(payload, "exceptCurrent", "except_current", "currentSessionPreserved")
        : undefined;

      toast.success(msg);
      setLogoutAllOpen(false);

      if (explicitCurrentTerminated === true) {
        await forceLocalLogout();
        return;
      }

      try {
        const refreshedRaw = await refetch().unwrap();
        const refreshedSessions = normalizePayrollSessions(refreshedRaw);
        const stillHasCurrent = refreshedSessions.some((s) => s.isCurrentSession);

        if (
          explicitExceptCurrent !== true &&
          !exceptCurrent &&
          !stillHasCurrent &&
          refreshedSessions.length === 0
        ) {
          toast.info("All active sessions were logged out. Redirecting to login…");
          await forceLocalLogout();
        }
      } catch (refreshErr) {
        const formattedRefresh = formatSecurityApiError(refreshErr);
        if (formattedRefresh.isAuthError || formattedRefresh.isForbidden) {
          await forceLocalLogout();
        }
      }
    } catch (err) {
      const formatted = formatSecurityApiError(err, "Failed to log out sessions.");
      setLogoutAllError(formatted.message);
      toast.error(formatted.message);
      if (formatted.isAuthError) {
        await forceLocalLogout();
      }
    }
  };

  if (ws.isRestoring) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!canManagePayrollSecurity) {
    return (
      <div className="mx-auto max-w-2xl py-12 px-4">
        <Alert variant="destructive" className="rounded-2xl">
          <ShieldAlert className="h-5 w-5" />
          <AlertTitle className="text-base font-semibold">Access Restricted</AlertTitle>
          <AlertDescription className="mt-2 space-y-3 text-xs">
            <p>
              You do not have payroll security permissions to view or manage active payroll sessions. Contact an HR Administrator if you need access.
            </p>
            <Button asChild variant="outline" size="sm" className="h-8 text-xs">
              <Link to="/dashboard">Return to Dashboard</Link>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <PageHeader
        title="Payroll Security & Active Sessions"
        description="Monitor active payroll-authorized sessions, inspect signed-in devices, and revoke suspicious or stale sessions."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <Link to="/dashboard/settings/security">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Account MFA
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void refetch()}
              disabled={isFetching || isLoggingOutAll}
              className="h-8 gap-1.5 text-xs cursor-pointer"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} />
              Refresh
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                setLogoutAllError(null);
                setLogoutAllOpen(true);
              }}
              disabled={isLoading || sessions.length === 0 || isLoggingOutAll}
              className="h-8 gap-1.5 text-xs cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              Logout All Devices
            </Button>
          </div>
        }
      />

      {/* Security Overview KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Active Sessions</span>
            <KeyRound className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold tabular-nums text-foreground">
            {isLoading ? <Skeleton className="h-8 w-14" /> : sessions.length}
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Active sessions returned by payroll security API
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Current Session</span>
            <Monitor className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 truncate text-base font-semibold text-foreground">
            {isLoading ? (
              <Skeleton className="h-7 w-40" />
            ) : currentSession ? (
              currentSession.device || currentSession.browser || "Current Device"
            ) : (
              "Not flagged in list"
            )}
          </div>
          <p className="mt-1 truncate font-mono text-[11px] text-muted-foreground">
            {currentSession?.ipAddress ? `IP: ${currentSession.ipAddress}` : "Active authenticated client"}
          </p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Other Active Sessions</span>
            <Globe className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tabular-nums text-foreground">
            {isLoading ? <Skeleton className="h-8 w-14" /> : otherSessionsCount}
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Additional browsers or remote device logins
          </p>
        </div>
      </div>

      {/* Filters & Sessions Container */}
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl shadow-xs">
        <div className="flex flex-col gap-3 border-b border-border/60 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search user, IP, device, browser…"
              aria-label="Search payroll sessions"
              className="h-8 pl-8 pr-8 text-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setPage(1);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Select
              value={scopeFilter}
              onValueChange={(value: "all" | "current" | "other") => {
                setScopeFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-8 w-44 text-xs" aria-label="Filter sessions by device">
                <SelectValue placeholder="Filter devices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sessions ({sessions.length})</SelectItem>
                <SelectItem value="current">Current Device ({currentSessionsCount})</SelectItem>
                <SelectItem value="other">Other Devices ({otherSessionsCount})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-3 p-5" aria-busy="true">
            {[1, 2, 3, 4].map((row) => (
              <Skeleton key={row} className="h-14 w-full rounded-xl" />
            ))}
          </div>
        ) : isError && parsedLoadError ? (
          <div className="p-6">
            <Alert variant="destructive" className="rounded-xl">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle className="text-sm font-semibold">{parsedLoadError.title}</AlertTitle>
              <AlertDescription className="mt-2 flex flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between">
                <span>{parsedLoadError.message}</span>
                {parsedLoadError.isAuthError ? (
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => void forceLocalLogout()}
                    className="h-8 shrink-0 text-xs"
                  >
                    Sign in again
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void refetch()}
                    disabled={isFetching}
                    className="h-8 shrink-0 gap-1.5 text-xs cursor-pointer"
                  >
                    <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} />
                    Retry
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          </div>
        ) : pagedSessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-muted text-muted-foreground">
              <KeyRound className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-sm font-semibold text-foreground">
              {searchQuery || scopeFilter !== "all" ? "No matching sessions" : "No active payroll sessions"}
            </h3>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              {searchQuery || scopeFilter !== "all"
                ? "Try clearing your search or device scope filter."
                : "There are currently no active sessions reported for your payroll security scope."}
            </p>
            {(searchQuery || scopeFilter !== "all") && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setScopeFilter("all");
                  setPage(1);
                }}
                className="mt-4 h-8 text-xs cursor-pointer"
              >
                Reset Filters
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Responsive Desktop Session Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border/60 bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="py-3 px-4">Device &amp; Browser</th>
                    <th className="py-3 px-4">Account</th>
                    <th className="py-3 px-4">IP Address</th>
                    <th className="py-3 px-4">Created</th>
                    <th className="py-3 px-4">Last Activity</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {pagedSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-muted/25 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-2.5">
                          <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10">
                            <DeviceIcon device={session.device} />
                          </div>
                          <div className="min-w-0 space-y-0.5">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="font-semibold text-foreground">
                                {session.device || session.browser || "Authenticated Session"}
                              </span>
                              {session.isCurrentSession && (
                                <Badge
                                  variant="outline"
                                  className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]"
                                >
                                  Current Device
                                </Badge>
                              )}
                            </div>
                            <div className="text-[11px] text-muted-foreground">
                              {[session.browser, session.os].filter(Boolean).join(" · ") ||
                                session.userAgent ||
                                "—"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-foreground">{session.userName || "—"}</div>
                        <div className="font-mono text-[11px] text-muted-foreground">
                          {session.userEmail || (session.userId ? `User #${session.userId}` : "—")}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-foreground">
                        {session.ipAddress || "—"}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        {formatSessionTimestamp(session.loginAt)}
                      </td>
                      <td className="py-3.5 px-4 text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3 shrink-0" />
                          {formatSessionTimestamp(session.lastActivityAt)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant="outline"
                          className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px]"
                        >
                          <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          {session.status}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setRevokeError(null);
                            setSessionToRevoke(session);
                          }}
                          disabled={isRevoking || isLoggingOutAll}
                          className="h-7 gap-1 border-rose-500/30 px-2.5 text-[11px] text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 cursor-pointer"
                        >
                          <LogOut className="h-3 w-3" />
                          Revoke Session
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Session Cards */}
            <div className="grid grid-cols-1 gap-3 p-4 md:hidden">
              {pagedSessions.map((session) => (
                <div
                  key={session.id}
                  className="rounded-xl border border-border/60 bg-background/50 p-4 space-y-3 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10">
                        <DeviceIcon device={session.device} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="font-semibold text-foreground">
                            {session.device || session.browser || "Authenticated Session"}
                          </span>
                          {session.isCurrentSession && (
                            <Badge
                              variant="outline"
                              className="border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-[10px]"
                            >
                              Current Device
                            </Badge>
                          )}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate">
                          {session.userEmail || session.userName || "—"}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-[10px]"
                    >
                      {session.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 border-t border-border/40 pt-2.5 text-[11px]">
                    <div>
                      <span className="block text-[10px] uppercase text-muted-foreground">Browser / OS</span>
                      <span className="text-foreground">
                        {[session.browser, session.os].filter(Boolean).join(" · ") || "—"}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase text-muted-foreground">IP Address</span>
                      <span className="font-mono text-foreground">{session.ipAddress || "—"}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase text-muted-foreground">Created</span>
                      <span className="text-foreground">{formatSessionTimestamp(session.loginAt)}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase text-muted-foreground">Last Activity</span>
                      <span className="text-foreground">{formatSessionTimestamp(session.lastActivityAt)}</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setRevokeError(null);
                      setSessionToRevoke(session);
                    }}
                    disabled={isRevoking || isLoggingOutAll}
                    className="w-full h-8 gap-1.5 border-rose-500/30 text-xs text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Logout Device
                  </Button>
                </div>
              ))}
            </div>

            {/* Pagination Footer */}
            {filteredSessions.length > PAGE_SIZE && (
              <div className="flex flex-col gap-2 border-t border-border/60 px-5 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                <span>
                  Showing {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filteredSessions.length)} of{" "}
                  {filteredSessions.length} sessions
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={safePage <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="h-7 text-xs"
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={safePage >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="h-7 text-xs"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Individual Session Revocation Dialog ─────────────────────────────── */}
      <Dialog
        open={sessionToRevoke !== null}
        onOpenChange={(open) => {
          if (!open && !isRevoking) {
            setSessionToRevoke(null);
            setRevokeError(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-semibold text-destructive">
              <LogOut className="h-4 w-4" />
              Revoke Payroll Session
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Immediately ends this authenticated device session. Any unsaved work on that device will be interrupted.
            </DialogDescription>
          </DialogHeader>

          {sessionToRevoke && (
            <div className="space-y-3 py-1">
              <div className="rounded-xl border border-border/60 bg-background/50 p-3 space-y-1.5 text-xs">
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Device / Browser:</span>
                  <span className="font-semibold text-foreground">
                    {[sessionToRevoke.device, sessionToRevoke.browser].filter(Boolean).join(" · ") || "Session"}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Account:</span>
                  <span className="font-mono text-muted-foreground">
                    {sessionToRevoke.userEmail || sessionToRevoke.userName || "—"}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">IP Address:</span>
                  <span className="font-mono text-foreground">{sessionToRevoke.ipAddress || "—"}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Last Activity:</span>
                  <span className="text-foreground">
                    {formatSessionTimestamp(sessionToRevoke.lastActivityAt)}
                  </span>
                </div>
              </div>

              {sessionToRevoke.isCurrentSession && (
                <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    This is your <strong>current active device</strong>. Revoking it will clear your local session and return you to the sign-in screen.
                  </span>
                </div>
              )}

              {revokeError && (
                <Alert variant="destructive" className="py-2.5">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">{revokeError}</AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSessionToRevoke(null);
                setRevokeError(null);
              }}
              disabled={isRevoking}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => void handleConfirmRevoke()}
              disabled={isRevoking}
              className="h-8 gap-1.5 text-xs cursor-pointer"
            >
              {isRevoking ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Revoking…
                </>
              ) : (
                <>
                  <LogOut className="h-3.5 w-3.5" />
                  Confirm Revoke Session
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Logout All Devices Confirmation Dialog ───────────────────────────── */}
      <Dialog
        open={logoutAllOpen}
        onOpenChange={(open) => {
          if (!open && !isLoggingOutAll) {
            setLogoutAllOpen(false);
            setLogoutAllError(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-semibold text-destructive">
              <ShieldAlert className="h-4 w-4" />
              Logout All Devices
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Confirm bulk revocation of active payroll security sessions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-1">
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-700 dark:text-rose-300">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">Security Impact Warning</p>
                <p className="leading-relaxed">
                  All active payroll sessions ({sessions.length} total) will be terminated via{" "}
                  <span className="font-mono">POST /payroll/security/logout-all</span>. If the backend revokes your current session, you will be signed out immediately.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-background/50 px-3 py-2.5">
              <Checkbox
                id="payroll-keep-current"
                checked={exceptCurrent}
                onCheckedChange={(checked) => setExceptCurrent(Boolean(checked))}
                disabled={isLoggingOutAll}
              />
              <Label htmlFor="payroll-keep-current" className="text-xs font-normal cursor-pointer">
                Keep current session active if supported by server
              </Label>
            </div>

            {logoutAllError && (
              <Alert variant="destructive" className="py-2.5">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{logoutAllError}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setLogoutAllOpen(false);
                setLogoutAllError(null);
              }}
              disabled={isLoggingOutAll}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => void handleConfirmLogoutAll()}
              disabled={isLoggingOutAll}
              className="h-8 gap-1.5 text-xs cursor-pointer"
            >
              {isLoggingOutAll ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Logging Out…
                </>
              ) : (
                <>
                  <LogOut className="h-3.5 w-3.5" />
                  Confirm Logout All Devices
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PayrollSecuritySessionsPage;
