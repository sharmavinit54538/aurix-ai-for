import React from "react";
import { Badge } from "@/components/ui/badge";
import type { HelpdeskStatus, HelpdeskPriority, SlaStatus } from "../types";

export function HelpdeskStatusBadge({ status }: { status: HelpdeskStatus | string }) {
  switch (status) {
    case "open":
      return (
        <Badge variant="outline" className="bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30 font-medium">
          Open
        </Badge>
      );
    case "in_progress":
      return (
        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 font-medium">
          In Progress
        </Badge>
      );
    case "waiting_on_employee":
      return (
        <Badge variant="outline" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30 font-medium">
          Pending / Waiting
        </Badge>
      );
    case "resolved":
      return (
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-medium">
          Resolved
        </Badge>
      );
    case "closed":
      return (
        <Badge variant="outline" className="bg-muted text-muted-foreground border-border font-medium">
          Closed
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="font-medium">
          {status}
        </Badge>
      );
  }
}

export function HelpdeskPriorityBadge({ priority }: { priority: HelpdeskPriority | string }) {
  switch (priority) {
    case "urgent":
      return (
        <Badge variant="outline" className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 font-semibold animate-pulse">
          Urgent
        </Badge>
      );
    case "high":
      return (
        <Badge variant="outline" className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 font-medium">
          High
        </Badge>
      );
    case "medium":
      return (
        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 font-medium">
          Medium
        </Badge>
      );
    case "low":
      return (
        <Badge variant="outline" className="bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30 font-medium">
          Low
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="font-medium">
          {priority}
        </Badge>
      );
  }
}

export function HelpdeskSlaBadge({ slaStatus }: { slaStatus?: SlaStatus | string | null }) {
  if (!slaStatus) return null;

  switch (slaStatus) {
    case "ON_TRACK":
      return (
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs">
          SLA On Track
        </Badge>
      );
    case "AT_RISK":
      return (
        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs font-semibold">
          SLA At Risk
        </Badge>
      );
    case "BREACHED":
      return (
        <Badge variant="outline" className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30 text-xs font-bold">
          SLA Breached
        </Badge>
      );
    case "COMPLETED":
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30 text-xs">
          SLA Met
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className="text-xs">
          {slaStatus}
        </Badge>
      );
  }
}
