import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bell,
  CheckCheck,
  X,
  AlertTriangle,
  Briefcase,
  IndianRupee,
  ShieldCheck,
  Users,
  ExternalLink,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useNotifications,
  type AppNotification,
  type NotificationCategory,
} from "@/lib/notifications";

function getCategoryIcon(category: NotificationCategory, severity: string) {
  switch (category) {
    case "recruitment":
      return <Briefcase className="h-4 w-4 text-blue-400" />;
    case "payroll":
      return <IndianRupee className="h-4 w-4 text-amber-400" />;
    case "approval":
      return <Users className="h-4 w-4 text-emerald-400" />;
    case "system":
      return <ShieldCheck className="h-4 w-4 text-cyan-400" />;
    case "alert":
    default:
      return severity === "critical" ? (
        <AlertTriangle className="h-4 w-4 text-rose-400" />
      ) : (
        <Bell className="h-4 w-4 text-amber-400" />
      );
  }
}

function getCategoryBg(category: NotificationCategory) {
  switch (category) {
    case "recruitment":
      return "bg-blue-500/10 border-blue-500/20";
    case "payroll":
      return "bg-amber-500/10 border-amber-500/20";
    case "approval":
      return "bg-emerald-500/10 border-emerald-500/20";
    case "system":
      return "bg-cyan-500/10 border-cyan-500/20";
    case "alert":
    default:
      return "bg-rose-500/10 border-rose-500/20";
  }
}

export function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"all" | "unread" | "alerts">("all");

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    clearAll,
    resetToDefaults,
  } = useNotifications();

  const filteredNotifications = notifications.filter((n) => {
    if (tab === "unread") return !n.read;
    if (tab === "alerts") return n.category === "alert" || n.severity === "warning" || n.severity === "critical";
    return true;
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="relative rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer transition-colors"
          aria-label="Open notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[360px] sm:w-[390px] p-0 rounded-2xl bg-card border border-border shadow-2xl overflow-hidden z-50 text-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-foreground">Notifications</span>
            {unreadCount > 0 ? (
              <Badge variant="destructive" className="h-5 px-1.5 text-[10px] font-bold">
                {unreadCount} new
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
                onClick={markAllAsRead}
                className="h-7 text-xs px-2 text-muted-foreground hover:text-foreground cursor-pointer"
                title="Mark all notifications as read"
              >
                <CheckCheck className="h-3.5 w-3.5 mr-1 text-emerald-500" />
                Read all
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="h-7 text-xs px-2 text-muted-foreground hover:text-destructive cursor-pointer"
                title="Clear all notifications"
              >
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        {notifications.length > 0 && (
          <div className="flex items-center gap-1 px-3 py-1.5 border-b border-border/60 bg-muted/15 text-xs">
            <button
              onClick={() => setTab("all")}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                tab === "all"
                  ? "bg-accent text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
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
        )}

        {/* Notifications List */}
        <ScrollArea className="max-h-[360px] overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20 mb-2">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold text-foreground">No notifications</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 max-w-[240px]">
                {tab === "unread"
                  ? "You have read all pending notifications."
                  : "Everything is quiet. No active alerts at the moment."}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={resetToDefaults}
                className="mt-3 text-xs h-7 gap-1.5 cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" /> Load Sample Notifications
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`group relative flex items-start gap-3 p-3 transition-colors hover:bg-muted/40 cursor-pointer ${
                    !notif.read ? "bg-primary/5" : ""
                  }`}
                >
                  {/* Category Icon */}
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border mt-0.5 ${getCategoryBg(
                      notif.category
                    )}`}
                  >
                    {getCategoryIcon(notif.category, notif.severity)}
                  </span>

                  {/* Body */}
                  <div className="min-w-0 flex-1 pr-6">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-xs truncate block ${
                          !notif.read ? "font-semibold text-foreground" : "font-medium text-foreground/85"
                        }`}
                      >
                        {notif.title}
                      </span>
                      {!notif.read && (
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="mt-1.5 flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground/75 font-mono">
                        {notif.time}
                      </span>
                      {notif.link && (
                        <Link
                          to={notif.link as any}
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notif.id);
                            setOpen(false);
                          }}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary hover:underline"
                        >
                          <span>{notif.actionText || "View"}</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Dismiss Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dismissNotification(notif.id);
                    }}
                    className="absolute top-2.5 right-2.5 h-6 w-6 grid place-items-center rounded-md text-muted-foreground/60 opacity-0 group-hover:opacity-100 hover:text-foreground hover:bg-accent transition-all cursor-pointer"
                    aria-label="Dismiss notification"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-border px-3 py-2 bg-muted/20 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>OFC360 Enterprise Pulse</span>
            <Button
              variant="link"
              size="sm"
              onClick={resetToDefaults}
              className="h-auto p-0 text-[11px] text-muted-foreground hover:text-primary cursor-pointer"
            >
              Reset list
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
