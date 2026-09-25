import type { ComponentType, ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, Inbox, Info, Lock, RefreshCw, ShieldAlert, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { classifyError, type ErrorKind } from "../errors";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/auth-bootstrap";
import { formatCount, formatTime } from "../formatters";

type IconComponent = ComponentType<{ className?: string }>;

/** Glass card container matching the Super Admin visual language. */
export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-xl", className)}>
      {children}
    </div>
  );
}

export function RefreshButton({
  onClick,
  refreshing,
  label = "Refresh",
}: {
  onClick: () => void;
  refreshing: boolean;
  label?: string;
}) {
  return (
    <Button variant="outline" size="sm" onClick={onClick} disabled={refreshing} className="gap-2 text-xs">
      <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin")} />
      {refreshing ? "Refreshing…" : label}
    </Button>
  );
}

/** "Updated 14:02:11" from React Query's `dataUpdatedAt` (0 = never loaded). */
export function LastUpdated({ timestamp }: { timestamp: number }) {
  if (!timestamp) return null;
  return (
    <span className="whitespace-nowrap text-[11px] text-muted-foreground">
      Updated {formatTime(new Date(timestamp).toISOString())}
    </span>
  );
}

/** Numeric KPI: skeleton while loading, formatted value when present, em dash when unavailable. */
export function KpiNumber({
  value,
  loading,
  className,
}: {
  value: number | null | undefined;
  loading: boolean;
  className?: string;
}) {
  if (loading) return <Skeleton className="inline-block h-8 w-16 align-middle" />;
  return (
    <span className={className} title={value == null ? "Not provided by the API" : undefined}>
      {formatCount(value)}
    </span>
  );
}

export function SkeletonRows({ rows = 3, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("space-y-3", className)} aria-busy="true" aria-live="polite">
      {Array.from({ length: rows }, (_, index) => (
        <Skeleton key={index} className="h-14 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  className,
}: {
  icon?: IconComponent;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-background/30 px-6 py-10 text-center",
        className,
      )}
    >
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-muted/60 text-muted-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-3 text-sm font-semibold text-foreground">{title}</div>
      {description && <p className="mt-1 max-w-sm text-xs text-muted-foreground">{description}</p>}
    </div>
  );
}

const ERROR_COPY: Record<ErrorKind, { icon: IconComponent; hint: string }> = {
  unauthenticated: { icon: Lock, hint: "Your session is no longer valid. Please sign in again." },
  forbidden: { icon: ShieldAlert, hint: "This data is restricted to the platform Super Admin account." },
  network: { icon: WifiOff, hint: "The OFC360 API could not be reached. Check your connection and try again." },
  failure: { icon: AlertTriangle, hint: "The server returned an error. Please try again." },
};

export function ErrorState({
  error,
  onRetry,
  title,
  retrying = false,
  className,
}: {
  error: unknown;
  onRetry?: () => void;
  title: string;
  retrying?: boolean;
  className?: string;
}) {
  const { kind, status, message } = classifyError(error);
  const { icon: Icon, hint } = ERROR_COPY[kind];

  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/5 px-6 py-8 text-center",
        className,
      )}
    >
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-rose-500/15 text-rose-400">
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-3 text-sm font-semibold text-foreground">{title}</div>
      <p className="mt-1 max-w-md text-xs text-muted-foreground">{hint}</p>
      <p className="mt-2 max-w-md break-words font-mono text-[11px] text-rose-300/80">
        {status ? `HTTP ${status} · ` : ""}
        {message}
      </p>
      <div className="mt-4 flex items-center gap-2">
        {onRetry && kind !== "unauthenticated" && (
          <Button variant="outline" size="sm" onClick={onRetry} disabled={retrying} className="gap-2 text-xs">
            <RefreshCw className={cn("h-3.5 w-3.5", retrying && "animate-spin")} />
            {retrying ? "Retrying…" : "Try again"}
          </Button>
        )}
        {kind === "unauthenticated" && (
          <Button size="sm" className="text-xs" onClick={() => void logout()}>
            Sign in again
          </Button>
        )}
      </div>
    </div>
  );
}

/**
 * Full-page denial.
 * - Without `error`: the frontend role guard blocked a non-super-admin role → link to their own dashboard.
 * - With `error`: the backend rejected the session (401/403) → the only fix is signing in with the
 *   designated Super Admin account, so offer sign-out (a dashboard link would loop back here).
 */
export function AccessDeniedState({ error }: { error?: unknown }) {
  const failure = error !== undefined ? classifyError(error) : null;
  const rejectedByApi = failure !== null;
  const unauthenticated = failure?.kind === "unauthenticated";
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4" role="alert">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-lg">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          {unauthenticated ? <Lock className="h-6 w-6" /> : <ShieldAlert className="h-6 w-6" />}
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {unauthenticated ? "Session expired" : "Access denied"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {unauthenticated
            ? "Your session is no longer valid. Sign in again to continue."
            : rejectedByApi
              ? "The platform API rejected this session for Super Admin access. Sign in with the designated platform Super Admin account to continue."
              : "The Super Admin area is restricted to the platform Super Admin account. HR Admin, Manager, Employee, IT Admin and Executive roles cannot access it."}
        </p>
        <div className="mt-6 flex flex-col gap-2">
          {rejectedByApi ? (
            <button
              type="button"
              onClick={() => void logout()}
              className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {unauthenticated ? "Sign in again" : "Sign out"}
            </button>
          ) : (
            <Link
              to="/dashboard"
              className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Go to my dashboard
            </Link>
          )}
          <Link
            to="/"
            className="inline-flex w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export function InlineNotice({
  tone = "info",
  children,
  className,
}: {
  tone?: "info" | "warning";
  children: ReactNode;
  className?: string;
}) {
  const Icon = tone === "warning" ? AlertTriangle : Info;
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-xl border px-3 py-2.5 text-xs",
        tone === "warning"
          ? "border-amber-500/30 bg-amber-500/5 text-amber-200"
          : "border-blue-500/25 bg-blue-500/5 text-muted-foreground",
        className,
      )}
    >
      <Icon className={cn("mt-0.5 h-3.5 w-3.5 shrink-0", tone === "warning" ? "text-amber-400" : "text-blue-400")} />
      <div>{children}</div>
    </div>
  );
}

export function PaginationBar({
  page,
  hasNextPage,
  onPageChange,
  busy,
  itemCount,
  pageSize,
}: {
  page: number;
  hasNextPage: boolean;
  onPageChange: (page: number) => void;
  busy: boolean;
  itemCount: number;
  pageSize: number;
}) {
  const from = itemCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = (page - 1) * pageSize + itemCount;
  return (
    <div className="flex flex-col gap-2 border-t border-border/40 px-4 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <span>{itemCount === 0 ? `Page ${page}` : `Showing ${formatCount(from)}–${formatCount(to)} · Page ${page}`}</span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          disabled={busy || page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          disabled={busy || !hasNextPage}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
