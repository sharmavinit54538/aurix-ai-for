import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  CheckCheck,
  X,
  AlertTriangle,
  Briefcase,
  IndianRupee,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  Calendar,
  Clock,
  FileText,
  Laptop,
  UserCheck,
  CheckCircle2,
  ShieldAlert,
  Inbox,
  AlertCircle,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useNotifications,
  useUnreadCount,
  useMarkRead,
  useMarkAllRead,
  useArchive,
} from "@/features/notifications";
import type {
  NotificationCategory,
  NotificationPriority,
  NotificationItem,
} from "@/services/notificationsApi";
import {
  isInternalSafeLink,
  formatUnreadBadge,
  formatRelativeTime,
} from "@/lib/notification-utils";

function getCategoryIcon(category?: NotificationCategory, priority?: NotificationPriority) {
  if (priority === "critical") {
    return <AlertTriangle className="h-4 w-4 text-rose-500" />;
  }

  switch (category) {
    case "recruitment":
      return <Briefcase className="h-4 w-4 text-blue-500" />;
    case "payroll":
      return <IndianRupee className="h-4 w-4 text-emerald-500" />;
    case "leave":
      return <Calendar className="h-4 w-4 text-purple-500" />;
    case "attendance":
      return <Clock className="h-4 w-4 text-sky-500" />;
    case "documents":
      return <FileText className="h-4 w-4 text-amber-500" />;
    case "assets":
      return <Laptop className="h-4 w-4 text-cyan-500" />;
    case "onboarding_exit":
      return <UserCheck className="h-4 w-4 text-indigo-500" />;
    case "approvals":
      return <CheckCircle2 className="h-4 w-4 text-teal-500" />;
    case "security":
      return <ShieldAlert className="h-4 w-4 text-rose-500" />;
    case "system":
      return <ShieldCheck className="h-4 w-4 text-slate-500" />;
    case "ai_insights":
      return <Sparkles className="h-4 w-4 text-violet-500" />;
    default:
      return priority === "high" ? (
        <AlertTriangle className="h-4 w-4 text-amber-500" />
      ) : (
        <Bell className="h-4 w-4 text-muted-foreground" />
      );
  }
}

function getCategoryBg(category?: NotificationCategory, priority?: NotificationPriority) {
  if (priority === "critical") {
    return "bg-rose-500/10 border-rose-500/20";
  }
  switch (category) {
    case "recruitment":
      return "bg-blue-500/10 border-blue-500/20";
    case "payroll":
      return "bg-emerald-500/10 border-emerald-500/20";
    case "leave":
      return "bg-purple-500/10 border-purple-500/20";
    case "attendance":
      return "bg-sky-500/10 border-sky-500/20";
    case "documents":
      return "bg-amber-500/10 border-amber-500/20";
    case "assets":
      return "bg-cyan-500/10 border-cyan-500/20";
    case "onboarding_exit":
      return "bg-indigo-500/10 border-indigo-500/20";
    case "approvals":
      return "bg-teal-500/10 border-teal-500/20";
    case "security":
      return "bg-rose-500/10 border-rose-500/20";
    case "system":
      return "bg-slate-500/10 border-slate-500/20";
    case "ai_insights":
      return "bg-violet-500/10 border-violet-500/20";
    default:
      return priority === "high"
        ? "bg-amber-500/10 border-amber-500/20"
        : "bg-muted border-border";
  }
}

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"all" | "unread" | "alerts">("all");
  const [, setTick] = useState(0);

  const navigate = useNavigate();

  // Periodic tick to re-render relative times every 30s
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 30_000);
    return () => clearInterval(timer);
  }, []);

  const { unreadCount } = useUnreadCount();
  const { items, isLoading, isError, refetch } = useNotifications({ limit: 10 });
  const markReadMutation = useMarkRead();
  const markAllReadMutation = useMarkAllRead();
  const archiveMutation = useArchive();

  const badgeText = formatUnreadBadge(unreadCount);

  const filteredItems = items.filter((n) => {
    if (tab === "unread") return !n.readAt;
    if (tab === "alerts") return n.priority === "high" || n.priority === "critical";
    return true;
  });

  const handleItemClick = (item: NotificationItem) => {
    if (!item.readAt) {
      markReadMutation.mutate(item.id);
    }
    if (isInternalSafeLink(item.link)) {
      setOpen(false);
      navigate({ to: item.link });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, item: NotificationItem) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleItemClick(item);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="relative rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
          aria-label={
            unreadCount > 0
              ? `Notifications (${unreadCount} unread)`
              : "Notifications"
          }
          aria-expanded={open}
        >
          <Bell className="h-4 w-4" />
          {badgeText && (
            <span
              id="notification-badge"
              className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-xs"
            >
              {badgeText}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[360px] sm:w-[400px] p-0 rounded-2xl bg-card border border-border shadow-2xl overflow-hidden z-50 text-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-foreground">Notifications</span>
            {badgeText ? (
              <Badge variant="destructive" className="h-5 px-1.5 text-[10px] font-bold">
                {badgeText} new
              </Badge>
            ) : (
              <Badge variant="outline" className="h-5 px-1.5 text-[10px] text-muted-foreground">
                All caught up
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAllReadMutation.mutate(undefined)}
                disabled={markAllReadMutation.isPending}
                className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground cursor-pointer"
                title="Mark all notifications as read"
              >
                <CheckCheck className="h-3.5 w-3.5 mr-1 text-emerald-500" />
                Read all
              </Button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 px-3 py-1.5 border-b border-border/60 bg-muted/15 text-xs">
          <button
            type="button"
            onClick={() => setTab("all")}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              tab === "all"
                ? "bg-accent text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({items.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("unread")}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              tab === "unread"
                ? "bg-accent text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            type="button"
            onClick={() => setTab("alerts")}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              tab === "alerts"
                ? "bg-accent text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Alerts
          </button>
        </div>

        {/* List Content */}
        <ScrollArea className="max-h-[380px] overflow-y-auto">
          {isLoading ? (
            <div className="p-3 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 p-2">
                  <Skeleton className="h-8 w-8 rounded-lg shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3.5 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-destructive/10 text-destructive mb-2">
                <AlertCircle className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-foreground">Failed to load notifications</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Could not retrieve latest updates.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="mt-3 text-xs h-7"
              >
                Retry
              </Button>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20 mb-2">
                <Inbox className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-foreground">No notifications</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 max-w-[240px]">
                {tab === "unread"
                  ? "You have read all pending notifications."
                  : tab === "alerts"
                  ? "No high priority alerts or escalations active."
                  : "Everything is quiet. No notifications found."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {filteredItems.map((notif) => {
                const isUnread = !notif.readAt;
                const hasSafeLink = isInternalSafeLink(notif.link);

                return (
                  <div
                    key={notif.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleItemClick(notif)}
                    onKeyDown={(e) => handleKeyDown(e, notif)}
                    className={`group relative flex items-start gap-3 p-3 transition-colors hover:bg-muted/40 cursor-pointer focus:outline-hidden focus-visible:bg-muted/40 ${
                      isUnread ? "bg-primary/5" : ""
                    }`}
                  >
                    {/* Category Icon */}
                    <span
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border mt-0.5 ${getCategoryBg(
                        notif.category,
                        notif.priority,
                      )}`}
                    >
                      {getCategoryIcon(notif.category, notif.priority)}
                    </span>

                    {/* Body */}
                    <div className="min-w-0 flex-1 pr-6">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-xs truncate block ${
                            isUnread
                              ? "font-semibold text-foreground"
                              : "font-medium text-foreground/85"
                          }`}
                        >
                          {notif.title}
                        </span>
                        {isUnread && (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                        {notif.body}
                      </p>

                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground/75 font-mono">
                          {formatRelativeTime(notif.createdAt)}
                        </span>
                        {hasSafeLink && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-primary">
                            <span>Open</span>
                            <ExternalLink className="h-2.5 w-2.5" />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Dismiss / Archive Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        archiveMutation.mutate(notif.id);
                      }}
                      className="absolute top-2.5 right-2.5 h-6 w-6 grid place-items-center rounded-md text-muted-foreground/60 opacity-0 group-hover:opacity-100 hover:text-foreground hover:bg-accent transition-all cursor-pointer focus:opacity-100"
                      aria-label="Archive notification"
                      title="Archive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="border-t border-border px-3 py-2 bg-muted/20 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>OFC360 Pulse</span>
          <Link
            to="/dashboard/notifications"
            onClick={() => setOpen(false)}
            className="font-medium text-primary hover:underline cursor-pointer"
          >
            View all notifications →
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
