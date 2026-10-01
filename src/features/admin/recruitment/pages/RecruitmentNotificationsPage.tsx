import React from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  CheckCheck,
  Briefcase,
  ExternalLink,
  Sparkles,
  Inbox,
  AlertTriangle,
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useNotifications,
  useMarkRead,
  useMarkAllRead,
} from "@/features/notifications";
import {
  isInternalSafeLink,
  formatRelativeTime,
} from "@/lib/notification-utils";

export function RecruitmentNotificationsPage() {
  const navigate = useNavigate();

  const {
    items,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useNotifications({ module: "recruitment" });

  const markReadMutation = useMarkRead();
  const markAllReadMutation = useMarkAllRead();

  const unreadCount = items.filter((n) => !n.readAt).length;

  const handleItemClick = (n: (typeof items)[number]) => {
    if (!n.readAt) {
      markReadMutation.mutate(n.id);
    }
    if (isInternalSafeLink(n.link)) {
      navigate({ to: n.link as any });
    }
  };

  return (
    <>
      <PageHeader
        title="Recruitment Notification Center"
        description="Candidate applications, interview schedules, SLA alerts, and hiring manager updates."
        actions={
          <Button
            variant="outline"
            onClick={() => markAllReadMutation.mutate("recruitment")}
            disabled={unreadCount === 0 || markAllReadMutation.isPending}
            className="cursor-pointer text-xs"
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all read
          </Button>
        }
      />

      <div className="mb-4 flex items-center justify-between">
        <Badge variant="secondary" className="px-2.5 py-0.5 text-xs">
          {unreadCount} unread
        </Badge>
        <span className="text-xs text-muted-foreground">
          {items.length} total alert{items.length === 1 ? "" : "s"}
        </span>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-xl border border-border p-3"
            >
              <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-2xl bg-card/40">
          <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <p className="font-medium text-sm">Failed to load recruitment notifications</p>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-3 text-xs">
            Retry
          </Button>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-2xl bg-card/40">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground">
            <Inbox className="h-5 w-5" />
          </div>
          <p className="font-medium">No recruitment notifications</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            You're all caught up! Candidate applications, interview updates, and mentions will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((n) => {
            const isUnread = !n.readAt;
            const hasSafeLink = isInternalSafeLink(n.link);

            return (
              <div
                key={n.id}
                role="button"
                tabIndex={0}
                onClick={() => handleItemClick(n)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleItemClick(n);
                  }
                }}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3 transition-colors ${
                  isUnread ? "bg-accent/30 font-medium" : "bg-card/40"
                }`}
              >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent text-primary">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{n.title}</span>
                    {isUnread && (
                      <span className="h-1.5 w-1.5 rounded-full bg-violet-500 shrink-0" />
                    )}
                    {n.priority === "high" || n.priority === "critical" ? (
                      <Badge variant="destructive" className="h-4 px-1 text-[9px] uppercase font-bold">
                        {n.priority}
                      </Badge>
                    ) : null}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{n.body}</div>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="font-mono">{formatRelativeTime(n.createdAt)}</span>
                    {hasSafeLink && (
                      <span className="inline-flex items-center gap-0.5 font-semibold text-primary">
                        <span>View</span>
                        <ExternalLink className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {hasNextPage && (
            <div className="pt-3 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="text-xs"
              >
                {isFetchingNextPage ? "Loading..." : "Load more"}
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default RecruitmentNotificationsPage;
