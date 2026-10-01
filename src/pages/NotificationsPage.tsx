import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  CheckCheck,
  CheckCircle2,
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
  ShieldAlert,
  Inbox,
  RefreshCw,
  MailCheck,
  Mail,
  Archive,
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useNotifications,
  useUnreadCount,
  useMarkRead,
  useMarkUnread,
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
  formatRelativeTime,
} from "@/lib/notification-utils";

const CATEGORIES: { value: NotificationCategory | "all"; label: string }[] = [
  { value: "all", label: "All Categories" },
  { value: "attendance", label: "Attendance" },
  { value: "leave", label: "Leave" },
  { value: "payroll", label: "Payroll" },
  { value: "documents", label: "Documents" },
  { value: "assets", label: "Assets" },
  { value: "recruitment", label: "Recruitment" },
  { value: "onboarding_exit", label: "Onboarding & Exit" },
  { value: "approvals", label: "Approvals" },
  { value: "security", label: "Security" },
  { value: "system", label: "System" },
  { value: "ai_insights", label: "AI Insights" },
];

const PRIORITIES: { value: NotificationPriority | "all"; label: string }[] = [
  { value: "all", label: "All Priorities" },
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "normal", label: "Normal" },
  { value: "low", label: "Low" },
];

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

function getPriorityBadge(priority: NotificationPriority) {
  switch (priority) {
    case "critical":
      return (
        <Badge variant="destructive" className="h-5 px-1.5 text-[10px] uppercase font-bold">
          Critical
        </Badge>
      );
    case "high":
      return (
        <Badge className="h-5 px-1.5 text-[10px] uppercase font-bold bg-amber-500 text-white hover:bg-amber-600">
          High
        </Badge>
      );
    case "normal":
      return (
        <Badge variant="secondary" className="h-5 px-1.5 text-[10px] uppercase font-medium">
          Normal
        </Badge>
      );
    case "low":
      return (
        <Badge variant="outline" className="h-5 px-1.5 text-[10px] uppercase font-medium text-muted-foreground">
          Low
        </Badge>
      );
  }
}

export function NotificationsPage() {
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");

  const navigate = useNavigate();

  const filters = {
    unread: unreadOnly ? true : undefined,
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    priority: selectedPriority !== "all" ? selectedPriority : undefined,
    limit: 20,
  };

  const {
    items,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useNotifications(filters);

  const { unreadCount } = useUnreadCount();
  const markReadMutation = useMarkRead();
  const markUnreadMutation = useMarkUnread();
  const markAllReadMutation = useMarkAllRead();
  const archiveMutation = useArchive();

  const handleItemClick = (item: NotificationItem) => {
    if (!item.readAt) {
      markReadMutation.mutate(item.id);
    }
    if (isInternalSafeLink(item.link)) {
      navigate({ to: item.link });
    }
  };

  return (
    <div className="w-full min-w-0 space-y-6 pb-12">
      <PageHeader
        title="Notifications"
        description="Real-time alerts, operational updates, and system communications."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                markAllReadMutation.mutate(
                  selectedCategory !== "all" ? selectedCategory : undefined,
                )
              }
              disabled={markAllReadMutation.isPending || unreadCount === 0}
              className="cursor-pointer text-xs"
            >
              <CheckCheck className="mr-1.5 h-3.5 w-3.5 text-emerald-500" />
              Mark all as read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              className="cursor-pointer text-xs"
              title="Refresh notifications"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </div>
        }
      />

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Unread Toggle */}
          <Button
            size="sm"
            variant={unreadOnly ? "default" : "outline"}
            onClick={() => setUnreadOnly((prev) => !prev)}
            className="h-8 text-xs cursor-pointer gap-1.5"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Unread only</span>
            {unreadCount > 0 && (
              <Badge
                variant={unreadOnly ? "secondary" : "destructive"}
                className="ml-1 h-4 px-1 text-[9px] font-bold"
              >
                {unreadCount}
              </Badge>
            )}
          </Button>

          {/* Category Filter */}
          <div className="w-[180px]">
            <Select
              value={selectedCategory}
              onValueChange={(val) => setSelectedCategory(val)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value} className="text-xs">
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Priority Filter */}
          <div className="w-[150px]">
            <Select
              value={selectedPriority}
              onValueChange={(val) => setSelectedPriority(val)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p.value} value={p.value} className="text-xs">
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{items.length}</span>{" "}
          notification{items.length === 1 ? "" : "s"}
        </div>
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-2xl border border-border bg-card/60 p-4"
            >
              <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-border bg-card/40">
          <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">
            Failed to load notifications
          </h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            We encountered a problem fetching notifications. Please try again.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="mt-4 text-xs"
          >
            Retry
          </Button>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-border bg-card/40">
          <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
            <Inbox className="h-7 w-7" />
          </div>
          <h3 className="text-base font-semibold text-foreground">All caught up!</h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            {unreadOnly
              ? "No unread notifications match your filters."
              : "No notifications found. Active notifications and system alerts will appear here."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const isUnread = !item.readAt;
            const hasSafeLink = isInternalSafeLink(item.link);

            return (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => handleItemClick(item)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleItemClick(item);
                  }
                }}
                className={`group relative flex items-start gap-4 rounded-2xl border p-4 transition-all duration-200 hover:shadow-md cursor-pointer ${
                  isUnread
                    ? "bg-primary/5 border-primary/30"
                    : "bg-card/70 border-border hover:bg-card"
                }`}
              >
                {/* Category Icon */}
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-muted/70 border border-border/60">
                  {getCategoryIcon(item.category, item.priority)}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1 pr-12">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-sm tracking-tight ${
                        isUnread ? "font-semibold text-foreground" : "font-medium text-foreground/80"
                      }`}
                    >
                      {item.title}
                    </span>
                    {isUnread && (
                      <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                    )}
                    {getPriorityBadge(item.priority)}
                    <Badge variant="outline" className="h-5 px-1.5 text-[10px] capitalize">
                      {item.category.replace(/_/g, " ")}
                    </Badge>
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {item.body}
                  </p>

                  <div className="mt-2.5 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="font-mono">{formatRelativeTime(item.createdAt)}</span>
                    {item.actor?.name && (
                      <span>• By {item.actor.name}</span>
                    )}
                    {hasSafeLink && (
                      <span className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
                        <span>Navigate</span>
                        <ExternalLink className="h-3 w-3" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="absolute top-4 right-4 flex items-center gap-1">
                  {isUnread ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        markReadMutation.mutate(item.id);
                      }}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-emerald-500 cursor-pointer"
                      title="Mark as read"
                    >
                      <MailCheck className="h-3.5 w-3.5" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        markUnreadMutation.mutate(item.id);
                      }}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-primary cursor-pointer"
                      title="Mark as unread"
                    >
                      <Mail className="h-3.5 w-3.5" />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      archiveMutation.mutate(item.id);
                    }}
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive cursor-pointer"
                    title="Archive notification"
                  >
                    <Archive className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}

          {/* Load More Button */}
          {hasNextPage && (
            <div className="pt-4 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="gap-2 text-xs cursor-pointer"
              >
                {isFetchingNextPage && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
                {isFetchingNextPage ? "Loading more..." : "Load more notifications"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationsPage;
