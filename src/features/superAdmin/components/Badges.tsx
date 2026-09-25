import { cn } from "@/lib/utils";
import { formatRoleLabel, MISSING_VALUE } from "../formatters";

const ROLE_TONES: { roles: string[]; className: string }[] = [
  { roles: ["super_admin"], className: "bg-purple-500/10 text-purple-400 border-purple-500/30" },
  { roles: ["hr_admin", "admin", "company_admin", "hr_manager"], className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" },
  { roles: ["manager"], className: "bg-blue-500/10 text-blue-400 border-blue-500/30" },
  { roles: ["employee", "intern"], className: "bg-sky-500/10 text-sky-400 border-sky-500/30" },
  { roles: ["it_admin"], className: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" },
  {
    roles: ["executive", "ceo", "cto", "cfo", "coo", "cmo", "clo", "ciso", "cio"],
    className: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  },
];

export function RoleBadge({ role }: { role: string | null }) {
  const key = role?.trim().toLowerCase() ?? "";
  const tone = ROLE_TONES.find((entry) => entry.roles.includes(key))?.className ?? "bg-muted text-foreground border-border";
  return (
    <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase", tone)}>
      {formatRoleLabel(role)}
    </span>
  );
}

export function AccountStatusBadge({ isActive }: { isActive: boolean | null }) {
  if (isActive === null) {
    return <span className="text-[11px] text-muted-foreground">{MISSING_VALUE}</span>;
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold",
        isActive
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
          : "bg-rose-500/10 text-rose-400 border-rose-500/30",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", isActive ? "bg-emerald-400" : "bg-rose-400")} />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

/** Tenant status as derived by the backend from onboarding + subscription state. */
export function OrganizationStatusBadge({ status }: { status: string | null }) {
  if (!status) {
    return <span className="text-[11px] text-muted-foreground">{MISSING_VALUE}</span>;
  }
  const normalized = status.toLowerCase();
  const tone =
    normalized === "active"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      : normalized === "trial"
        ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
        : "bg-rose-500/10 text-rose-400 border-rose-500/30";
  const dot = normalized === "active" ? "bg-emerald-400" : normalized === "trial" ? "bg-amber-400" : "bg-rose-400";
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize", tone)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
      {normalized}
    </span>
  );
}

export type ServiceBadgeState = "online" | "degraded" | "offline" | "unknown";

export function ServiceStatusBadge({ state, label }: { state: ServiceBadgeState; label?: string }) {
  const tone: Record<ServiceBadgeState, string> = {
    online: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    degraded: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    offline: "text-rose-400 border-rose-500/30 bg-rose-500/10",
    unknown: "text-muted-foreground border-border bg-muted/40",
  };
  const text: Record<ServiceBadgeState, string> = {
    online: "Online",
    degraded: "Degraded",
    offline: "Offline",
    unknown: "Unknown",
  };
  return (
    <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase", tone[state])}>
      {label ?? text[state]}
    </span>
  );
}

export function ServiceDot({ state }: { state: ServiceBadgeState }) {
  const tone: Record<ServiceBadgeState, string> = {
    online: "bg-emerald-500",
    degraded: "bg-amber-500",
    offline: "bg-rose-500",
    unknown: "bg-muted-foreground/50",
  };
  return <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", tone[state])} />;
}
