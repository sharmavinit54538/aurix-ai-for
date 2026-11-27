import { useMemo, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  Globe,
  KeyRound,
  Laptop,
  Loader2,
  LogOut,
  Monitor,
  Power,
  RefreshCw,
  Search,
  ShieldAlert,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { forceLocalLogout } from "@/lib/auth-bootstrap";
import { formatSecurityApiError } from "@/lib/security-errors";
import { cn } from "@/lib/utils";
import {
  useSuperAdminSessions,
  useTerminateAllSessions,
  useTerminateSession,
} from "../hooks";
import {
  AccessDeniedState,
  EmptyState,
  ErrorState,
  Panel,
  SkeletonRows,
} from "../components/SuperAdminStates";
import { RoleBadge } from "../components/Badges";
import { isAuthorizationError } from "../errors";
import {
  formatCount,
  formatDateTime,
  formatRelativeTime,
  MISSING_VALUE,
  shortId,
} from "../formatters";
import type { SecuritySessionRecord } from "../types";

const SESSION_LIST_LIMIT = 50;

export function SuperAdminSessionsManager({ compact = false }: { compact?: boolean }) {
  const sessionsQuery = useSuperAdminSessions(false);
  const terminateSessionMutation = useTerminateSession();
  const terminateAllMutation = useTerminateAllSessions();

  const [searchTerm, setSearchTerm] = useState("");
  const [sessionToTerminate, setSessionToTerminate] = useState<SecuritySessionRecord | null>(null);
  const [terminateError, setTerminateError] = useState<string | null>(null);
  const [terminateAllOpen, setTerminateAllOpen] = useState(false);
  const [terminateAllError, setTerminateAllError] = useState<string | null>(null);

  const sessions = useMemo(() => sessionsQuery.data ?? [], [sessionsQuery.data]);

  const filteredSessions = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return sessions;
    return sessions.filter((s) =>
      [s.userName, s.userEmail, s.ipAddress, s.browser, s.os, s.device, s.role, s.id]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q)),
    );
  }, [sessions, searchTerm]);

  const handleConfirmTerminateSingle = async () => {
    if (!sessionToTerminate || terminateSessionMutation.isPending) return;
    setTerminateError(null);
    const target = sessionToTerminate;

    try {
      const message = await terminateSessionMutation.mutateAsync(target.id);
      toast.success(message || "Session terminated successfully.");
      setSessionToTerminate(null);

      if (target.isCurrentSession) {
        toast.info("Your current session was terminated. Please sign in again.");
        await forceLocalLogout();
        return;
      }

      try {
        await sessionsQuery.refetch();
      } catch (refreshErr) {
        const formattedRefresh = formatSecurityApiError(refreshErr);
        if (formattedRefresh.isAuthError) {
          await forceLocalLogout();
        }
      }
    } catch (err) {
      const formatted = formatSecurityApiError(err, "Failed to terminate session.");
      setTerminateError(formatted.message);
      toast.error(formatted.message);
      if (formatted.isAuthError) {
        await forceLocalLogout();
      }
    }
  };

  const handleConfirmTerminateAll = async () => {
    if (terminateAllMutation.isPending) return;
    setTerminateAllError(null);

    try {
      const res = await terminateAllMutation.mutateAsync();
      const message = res?.message || "All platform sessions terminated.";
      toast.success(message);
      setTerminateAllOpen(false);

      // Verify whether current authenticated session was revoked by backend
      const payload = res as Record<string, unknown> | undefined;
      if (payload?.currentSessionRevoked === true || payload?.exceptCurrent === false) {
        await forceLocalLogout();
        return;
      }

      if (payload?.exceptCurrent === true || payload?.currentSessionPreserved === true) {
        await sessionsQuery.refetch().catch(() => null);
        return;
      }

      try {
        const refreshed = await sessionsQuery.refetch();
        // Backend `POST /super-admin/security/sessions/terminate-all` revokes all RefreshTokens in DB,
        // so active sessions list becomes empty and the current user's refresh token is revoked.
        if (!Array.isArray(refreshed) || refreshed.length === 0) {
          toast.info("Your current session has been revoked. Redirecting to login…");
          await forceLocalLogout();
        }
      } catch (refreshErr) {
        const formattedRefresh = formatSecurityApiError(refreshErr);
        if (formattedRefresh.isAuthError || formattedRefresh.isForbidden) {
          await forceLocalLogout();
        }
      }
    } catch (err) {
      const formatted = formatSecurityApiError(err, "Failed to terminate all sessions.");
      setTerminateAllError(formatted.message);
      toast.error(formatted.message);
      if (formatted.isAuthError) {
        await forceLocalLogout();
      }
    }
  };

  if (sessionsQuery.isError && isAuthorizationError(sessionsQuery.error)) {
    return <AccessDeniedState error={sessionsQuery.error} />;
  }

  return (
    <div className="space-y-4">
      <Panel className="p-0 overflow-hidden">
        {/* Header Bar */}
        <div className="flex flex-col gap-3 border-b border-border/50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-500/15 text-emerald-500">
              <KeyRound className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-foreground">Active Platform Sessions</h2>
                <Badge variant="outline" className="text-[11px] font-mono">
                  {formatCount(sessions.length)}
                  {sessions.length >= SESSION_LIST_LIMIT ? "+" : ""}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Non-revoked, non-expired refresh token sessions across OFC360.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void sessionsQuery.refetch()}
              disabled={sessionsQuery.isFetching || terminateAllMutation.isPending}
              className="h-8 gap-1.5 text-xs cursor-pointer"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", sessionsQuery.isFetching && "animate-spin")} />
              Refresh
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => {
                setTerminateAllError(null);
                setTerminateAllOpen(true);
              }}
              disabled={
                sessionsQuery.isPending ||
                sessions.length === 0 ||
                terminateAllMutation.isPending
              }
              className="h-8 gap-1.5 text-xs cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              Terminate All Sessions
            </Button>
          </div>
        </div>

        {/* Search Filter */}
        {!compact && (
          <div className="border-b border-border/40 bg-muted/20 px-5 py-3">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Filter by user, email, IP or session ID…"
                aria-label="Filter active sessions"
                className="h-8 pl-8 pr-8 text-xs"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear session filter"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Body */}
        {sessionsQuery.isPending ? (
          <SkeletonRows rows={compact ? 4 : 6} className="p-5" />
        ) : sessionsQuery.isError ? (
          <ErrorState
            className="m-5"
            title="Unable to load active sessions."
            error={sessionsQuery.error}
            onRetry={() => void sessionsQuery.refetch()}
            retrying={sessionsQuery.isFetching}
          />
        ) : filteredSessions.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={KeyRound}
              title={searchTerm ? "No matching sessions" : "No active sessions"}
              description={
                searchTerm
                  ? "No active sessions match your filter criteria."
                  : "No user currently holds an active non-revoked sign-in session."
              }
            />
          </div>
        ) : compact ? (
          <div className="divide-y divide-border/40">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between gap-3 px-5 py-3 text-xs hover:bg-muted/20 transition-colors"
              >
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground truncate">
                      {session.userName ?? MISSING_VALUE}
                    </span>
                    {session.isCurrentSession && (
                      <Badge variant="outline" className="text-[10px] border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
                        Current
                      </Badge>
                    )}
                  </div>
                  <div className="font-mono text-[11px] text-muted-foreground truncate">
                    {session.userEmail ?? MISSING_VALUE}
                  </div>
                  <div className="text-[11px] text-muted-foreground" title={formatDateTime(session.startedAt)}>
                    Signed in {formatRelativeTime(session.startedAt)}
                    {session.ipAddress ? ` · ${session.ipAddress}` : ""}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setTerminateError(null);
                    setSessionToTerminate(session);
                  }}
                  disabled={terminateSessionMutation.isPending}
                  className="h-7 shrink-0 gap-1 border-rose-500/30 px-2 text-[11px] text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 cursor-pointer"
                >
                  <Power className="h-3 w-3" />
                  Terminate
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border/60 bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Device / Browser / OS</th>
                    <th className="py-3 px-4">IP Address</th>
                    <th className="py-3 px-4">Login Time</th>
                    <th className="py-3 px-4">Last Active</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredSessions.map((session) => {
                    const deviceLabel = [session.device, session.browser, session.os]
                      .filter(Boolean)
                      .join(" · ");
                    return (
                      <tr key={session.id} className="hover:bg-muted/25 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">
                              {session.userName ?? MISSING_VALUE}
                            </span>
                            {session.isCurrentSession && (
                              <Badge
                                variant="outline"
                                className="text-[10px] border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                              >
                                Current Session
                              </Badge>
                            )}
                          </div>
                          <div className="font-mono text-[11px] text-muted-foreground">
                            {session.userEmail ?? MISSING_VALUE}
                          </div>
                          <div className="font-mono text-[10px] text-muted-foreground/75">
                            ID: {shortId(session.id)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {session.role ? <RoleBadge role={session.role} /> : <span className="text-muted-foreground">{MISSING_VALUE}</span>}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Laptop className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            <span>{deviceLabel || MISSING_VALUE}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Globe className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            <span>{session.ipAddress ?? MISSING_VALUE}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground" title={formatDateTime(session.startedAt)}>
                          <div>{formatDateTime(session.startedAt)}</div>
                          <div className="text-[10px]">{formatRelativeTime(session.startedAt)}</div>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {session.lastActivity ? (
                            Number.isNaN(Date.parse(session.lastActivity))
                              ? session.lastActivity
                              : formatRelativeTime(session.lastActivity)
                          ) : (
                            MISSING_VALUE
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            variant="outline"
                            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-[10px] font-semibold"
                          >
                            <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            {session.status ?? "Active"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setTerminateError(null);
                              setSessionToTerminate(session);
                            }}
                            disabled={terminateSessionMutation.isPending}
                            className="h-7 gap-1.5 border-rose-500/30 px-2.5 text-[11px] font-medium text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 cursor-pointer"
                          >
                            <Power className="h-3 w-3" />
                            Terminate Session
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="grid grid-cols-1 gap-3 p-4 md:hidden">
              {filteredSessions.map((session) => (
                <div
                  key={session.id}
                  className="rounded-xl border border-border/60 bg-background/50 p-4 space-y-3 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-semibold text-foreground">
                          {session.userName ?? MISSING_VALUE}
                        </span>
                        {session.isCurrentSession && (
                          <Badge variant="outline" className="text-[10px] border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="font-mono text-[11px] text-muted-foreground truncate">
                        {session.userEmail ?? MISSING_VALUE}
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-emerald-500/30 bg-emerald-500/10 text-emerald-500 text-[10px]"
                    >
                      {session.status ?? "Active"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground border-t border-border/40 pt-2.5">
                    <div>
                      <span className="block text-[10px] uppercase">Device / Browser</span>
                      <span className="text-foreground">
                        {[session.device, session.browser, session.os].filter(Boolean).join(" · ") || MISSING_VALUE}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase">IP Address</span>
                      <span className="font-mono text-foreground">{session.ipAddress ?? MISSING_VALUE}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase">Signed In</span>
                      <span className="text-foreground">{formatRelativeTime(session.startedAt)}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase">Session ID</span>
                      <span className="font-mono text-foreground">{shortId(session.id)}</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTerminateError(null);
                      setSessionToTerminate(session);
                    }}
                    disabled={terminateSessionMutation.isPending}
                    className="w-full h-8 gap-1.5 border-rose-500/30 text-xs text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                  >
                    <Power className="h-3.5 w-3.5" />
                    Terminate Session
                  </Button>
                </div>
              ))}
            </div>
          </>
        )}

        {sessions.length >= SESSION_LIST_LIMIT && (
          <div className="border-t border-border/40 px-5 py-2.5 text-[11px] text-muted-foreground">
            Showing the {SESSION_LIST_LIMIT} most recent active sessions returned by the server.
          </div>
        )}
      </Panel>

      {/* ── Individual Session Termination Confirmation Dialog ─────────────────── */}
      <Dialog
        open={sessionToTerminate !== null}
        onOpenChange={(open) => {
          if (!open && !terminateSessionMutation.isPending) {
            setSessionToTerminate(null);
            setTerminateError(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md bg-card border-border/60 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-destructive">
              <Monitor className="h-4 w-4" />
              Terminate User Session
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              This revokes the selected refresh token immediately. The user will need to sign in again when their access token expires or refreshes.
            </DialogDescription>
          </DialogHeader>

          {sessionToTerminate && (
            <div className="space-y-3 py-1">
              <div className="rounded-xl border border-border/50 bg-background/50 p-3 space-y-1.5 text-xs">
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">User:</span>
                  <span className="font-semibold text-foreground">{sessionToTerminate.userName ?? MISSING_VALUE}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Email:</span>
                  <span className="font-mono text-muted-foreground">{sessionToTerminate.userEmail ?? MISSING_VALUE}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Session ID:</span>
                  <span className="font-mono text-[11px] text-muted-foreground">{shortId(sessionToTerminate.id)}</span>
                </div>
                {sessionToTerminate.ipAddress && (
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">IP Address:</span>
                    <span className="font-mono text-foreground">{sessionToTerminate.ipAddress}</span>
                  </div>
                )}
                <div className="flex justify-between gap-3">
                  <span className="text-muted-foreground">Signed In:</span>
                  <span className="text-foreground">{formatDateTime(sessionToTerminate.startedAt)}</span>
                </div>
              </div>

              {sessionToTerminate.isCurrentSession && (
                <div className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>This is your current active session. Terminating it will sign you out immediately.</span>
                </div>
              )}

              {terminateError && (
                <Alert variant="destructive" className="py-2.5">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">{terminateError}</AlertDescription>
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
                setSessionToTerminate(null);
                setTerminateError(null);
              }}
              disabled={terminateSessionMutation.isPending}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => void handleConfirmTerminateSingle()}
              disabled={terminateSessionMutation.isPending}
              className="h-8 gap-1.5 text-xs cursor-pointer"
            >
              {terminateSessionMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Terminating…
                </>
              ) : (
                <>
                  <Power className="h-3.5 w-3.5" />
                  Confirm Terminate
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Terminate All Sessions Warning Dialog ────────────────────────────── */}
      <Dialog
        open={terminateAllOpen}
        onOpenChange={(open) => {
          if (!open && !terminateAllMutation.isPending) {
            setTerminateAllOpen(false);
            setTerminateAllError(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md bg-card border-border/60 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-destructive">
              <ShieldAlert className="h-4 w-4" />
              Terminate All Active Sessions
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Critical platform-wide security action affecting all active refresh sessions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-1">
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-700 dark:text-rose-300">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <div className="space-y-1.5">
                <p className="font-semibold">Affected Scope &amp; Immediate Impact</p>
                <p className="leading-relaxed">
                  Executing <span className="font-mono">POST /security/sessions/terminate-all</span> revokes{" "}
                  <strong>every non-revoked refresh token in the database</strong>, including your current Super Admin session.
                </p>
                <p className="leading-relaxed">
                  All signed-in users across the platform will be logged out on refresh/expiry, and you will be redirected to the sign-in screen.
                </p>
              </div>
            </div>

            {terminateAllError && (
              <Alert variant="destructive" className="py-2.5">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{terminateAllError}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setTerminateAllOpen(false);
                setTerminateAllError(null);
              }}
              disabled={terminateAllMutation.isPending}
              className="h-8 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => void handleConfirmTerminateAll()}
              disabled={terminateAllMutation.isPending}
              className="h-8 gap-1.5 text-xs cursor-pointer"
            >
              {terminateAllMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Terminating All…
                </>
              ) : (
                <>
                  <LogOut className="h-3.5 w-3.5" />
                  Confirm Terminate All Sessions
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
