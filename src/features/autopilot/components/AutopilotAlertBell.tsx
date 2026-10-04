import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  BellRing,
  Bot,
  ExternalLink,
  Flame,
  TrendingDown,
  UserX,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useProactiveAlerts } from "../hooks/useProactiveAlerts";

export function AutopilotAlertBell() {
  const { alerts, activeCount, backendUnavailable } = useProactiveAlerts();
  const [open, setOpen] = useState(false);

  // If backend is unavailable and no alerts, we can still render the bell icon cleanly
  const activeAlerts = alerts.filter((a) => a.status === "active").slice(0, 4);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Autopilot HR Alerts"
          className="relative rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer transition-colors"
        >
          <BellRing className="h-4 w-4" />
          {activeCount > 0 && !backendUnavailable && (
            <span className="absolute top-1 right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
              {activeCount > 9 ? "9+" : activeCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-80 p-0 rounded-2xl border-border bg-card/95 backdrop-blur-xl shadow-xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-3.5 border-b border-border/60 bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-lg bg-primary/10 text-primary">
              <Bot className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-semibold text-foreground">
              Autopilot Alerts
            </span>
          </div>
          {activeCount > 0 && (
            <Badge variant="secondary" className="text-[10px] bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20">
              {activeCount} active
            </Badge>
          )}
        </div>

        <div className="p-2 space-y-1.5 max-h-72 overflow-y-auto">
          {backendUnavailable ? (
            <div className="p-4 text-center text-xs text-muted-foreground">
              Proactive alerts backend pending deployment.
            </div>
          ) : activeAlerts.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">
              No active proactive alerts. Systems normal.
            </div>
          ) : (
            activeAlerts.map((al) => (
              <Link
                key={al.id}
                to="/dashboard/autopilot/alerts"
                onClick={() => setOpen(false)}
                className="block p-2.5 rounded-xl hover:bg-accent/70 transition-colors border border-transparent hover:border-border/60 text-xs text-left"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="font-semibold text-foreground truncate max-w-[190px]">
                    {al.title}
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-[9px] uppercase font-mono px-1 py-0 ${
                      al.severity === "critical"
                        ? "text-rose-600 border-rose-500/30"
                        : "text-amber-600 border-amber-500/30"
                    }`}
                  >
                    {al.severity}
                  </Badge>
                </div>
                <div className="text-[11px] text-muted-foreground line-clamp-2">
                  {al.description}
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="p-2 border-t border-border/40 bg-background/50">
          <Link
            to="/dashboard/autopilot/alerts"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-1.5 w-full py-1.5 text-xs font-medium text-primary hover:underline"
          >
            <span>Open Alerts Center</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
