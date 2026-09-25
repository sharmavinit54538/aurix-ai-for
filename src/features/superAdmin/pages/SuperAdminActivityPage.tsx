import { useMemo, useState } from "react";
import { Activity, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOrganizationDirectory, useSuperAdminAuditFeed, useSuperAdminSessions } from "../hooks";
import {
  AccessDeniedState,
  EmptyState,
  ErrorState,
  Panel,
  SkeletonRows,
} from "../components/SuperAdminStates";
import { isAuthorizationError } from "../errors";
import { formatCount, formatDateTime, formatRelativeTime, formatTime, MISSING_VALUE, shortId } from "../formatters";
import type { PlatformAuditEvent } from "../types";

const FEED_PAGE_SIZE = 25;
const AUTO_REFRESH_MS = 30_000;
/** Backend limit of GET /super-admin/security/sessions. */
const SESSION_LIST_LIMIT = 50;

function dayLabel(iso: string | null, now: Date): string {
  if (!iso) return "Unknown date";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "Unknown date";
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const diffDays = Math.round((startOfToday - startOfDate) / (24 * 60 * 60 * 1000));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

function groupByDay(events: PlatformAuditEvent[]): { label: string; events: PlatformAuditEvent[] }[] {
  const now = new Date();
  const groups: { label: string; events: PlatformAuditEvent[] }[] = [];
  for (const event of events) {
    const label = dayLabel(event.timestamp, now);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.events.push(event);
    else groups.push({ label, events: [event] });
  }
  return groups;
}

export function SuperAdminActivityPage() {
  const feed = useSuperAdminAuditFeed(FEED_PAGE_SIZE, false);
  const sessions = useSuperAdminSessions(false);
  const directory = useOrganizationDirectory();

  const events = useMemo(() => feed.data?.pages.flat() ?? [], [feed.data]);
  const groups = useMemo(() => groupByDay(events), [events]);
  const organizationNames = useMemo(
    () => new Map((directory.data ?? []).map((org) => [org.id, org.name] as const)),
    [directory.data],
  );

  if (feed.isError && isAuthorizationError(feed.error)) {
    return <AccessDeniedState error={feed.error} />;
  }

  const organizationLabel = (organizationId: string | null) =>
    organizationId ? organizationNames.get(organizationId) ?? `Tenant ${shortId(organizationId)}` : "Platform-level";

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Event timeline */}
        <Panel className="lg:col-span-2 p-0 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border/40 px-5 py-4">
            <Activity className="h-5 w-5 text-purple-400" />
            <div>
              <h2 className="text-base font-bold text-foreground">Event Timeline</h2>
              <p className="text-xs text-muted-foreground">Newest first · {formatCount(events.length)} loaded</p>
            </div>
          </div>

          {feed.isPending ? (
            <SkeletonRows rows={6} className="p-4" />
          ) : feed.isError ? (
            <ErrorState
              className="m-4"
              title="Unable to load platform activity."
              error={feed.error}
              onRetry={() => void feed.refetch()}
              retrying={feed.isFetching}
            />
          ) : events.length === 0 ? (
            <div className="p-4">
              <EmptyState icon={Activity} title="No activity available" description="No audit events have been recorded yet." />
            </div>
          ) : (
            <div>
              {groups.map((group) => (
                <div key={group.label}>
                  <div className="sticky top-0 bg-muted/60 px-5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur">
                    {group.label}
                  </div>
                  <div className="divide-y divide-border/40">
                    {group.events.map((event) => (
                      <div key={event.id} className="flex items-start justify-between gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="grid h-8 w-8 place-items-center rounded-lg bg-purple-500/10 text-purple-400 mt-0.5 shrink-0">
                            <Activity className="h-4 w-4" />
                          </div>
                          <div className="space-y-1 min-w-0">
                            <div className="text-sm font-semibold text-foreground font-mono break-all">{event.action ?? MISSING_VALUE}</div>
                            {event.details && <div className="text-xs text-muted-foreground break-words">{event.details}</div>}
                            <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-2">
                              <span className="text-foreground font-medium">{event.actorEmail ?? "Actor not recorded"}</span>
                              <span>•</span>
                              <span>{organizationLabel(event.organizationId)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 text-right text-xs text-muted-foreground" title={formatDateTime(event.timestamp)}>
                          <div>{formatTime(event.timestamp)}</div>
                          <div className="text-[10px]">{formatRelativeTime(event.timestamp)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div className="border-t border-border/40 p-4 text-center">
                {feed.hasNextPage ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => void feed.fetchNextPage()}
                    disabled={feed.isFetchingNextPage}
                  >
                    {feed.isFetchingNextPage ? "Loading older events…" : "Load older events"}
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground">Beginning of the recorded audit trail</span>
                )}
              </div>
            </div>
          )}
        </Panel>

        {/* Active sessions */}
        <Panel className="p-0 overflow-hidden h-fit">
          <div className="flex items-center justify-between gap-2 border-b border-border/40 px-5 py-4">
            <div className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-emerald-400" />
              <div>
                <h2 className="text-base font-bold text-foreground">Active Sessions</h2>
                <p className="text-xs text-muted-foreground">Non-expired, non-revoked sign-in sessions</p>
              </div>
            </div>
            {sessions.data && (
              <span className="text-lg font-bold text-foreground">
                {formatCount(sessions.data.length)}
                {sessions.data.length >= SESSION_LIST_LIMIT ? "+" : ""}
              </span>
            )}
          </div>

          {sessions.isPending ? (
            <SkeletonRows rows={4} className="p-4" />
          ) : sessions.isError ? (
            <ErrorState
              className="m-4"
              title="Unable to load active sessions."
              error={sessions.error}
              onRetry={() => void sessions.refetch()}
              retrying={sessions.isFetching}
            />
          ) : sessions.data.length === 0 ? (
            <div className="p-4">
              <EmptyState icon={KeyRound} title="No active sessions" description="No user currently holds a valid sign-in session." />
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {sessions.data.map((session) => (
                <div key={session.id} className="flex items-start justify-between gap-3 px-5 py-3 text-xs">
                  <div className="min-w-0">
                    <div className="font-semibold text-foreground truncate">{session.userName ?? MISSING_VALUE}</div>
                    <div className="font-mono text-[11px] text-muted-foreground truncate">{session.userEmail ?? MISSING_VALUE}</div>
                  </div>
                  <div className="shrink-0 text-right text-muted-foreground" title={formatDateTime(session.startedAt)}>
                    <div className="text-[10px] uppercase tracking-wide">Signed in</div>
                    <div>{formatRelativeTime(session.startedAt)}</div>
                  </div>
                </div>
              ))}
              {sessions.data.length >= SESSION_LIST_LIMIT && (
                <div className="px-5 py-2.5 text-[11px] text-muted-foreground">
                  The API returns the {SESSION_LIST_LIMIT} most recent sessions; more may be active.
                </div>
              )}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

export default SuperAdminActivityPage;
