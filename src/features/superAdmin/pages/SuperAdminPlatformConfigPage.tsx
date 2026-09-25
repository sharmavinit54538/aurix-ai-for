import type { ReactNode } from "react";
import { Bot, Database, Gauge, Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { usePublicHealth, useReadiness, useSystemHealth } from "../hooks";
import {
  AccessDeniedState,
  ErrorState,
  InlineNotice,
  LastUpdated,
  Panel,
  RefreshButton,
} from "../components/SuperAdminStates";
import { isAuthorizationError } from "../errors";
import { ServiceDot, ServiceStatusBadge, type ServiceBadgeState } from "../components/Badges";
import { formatCount, formatDateTime, formatMilliseconds, MISSING_VALUE } from "../formatters";

function connectivityState(value: string | null | undefined): ServiceBadgeState {
  if (!value) return "unknown";
  const normalized = value.toLowerCase();
  if (normalized === "connected" || normalized === "healthy" || normalized === "online") return "online";
  if (normalized === "degraded") return "degraded";
  return "offline";
}

export function SuperAdminPlatformConfigPage() {
  const systemHealth = useSystemHealth();
  const publicHealth = usePublicHealth();
  const readiness = useReadiness();

  if (systemHealth.isError && isAuthorizationError(systemHealth.error)) {
    return <AccessDeniedState error={systemHealth.error} />;
  }

  const runChecks = () => {
    void systemHealth.refetch();
    void publicHealth.refetch();
    void readiness.refetch();
  };
  const checking = systemHealth.isFetching || publicHealth.isFetching || readiness.isFetching;

  const apiState = connectivityState(publicHealth.data?.status);
  const dbState: ServiceBadgeState = systemHealth.data?.database.status ?? connectivityState(publicHealth.data?.database);
  const llm = readiness.data?.llm ?? null;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Platform Configuration &amp; Infrastructure
            </h1>
            <Badge className="shrink-0 whitespace-nowrap bg-amber-500/20 text-amber-300 border-amber-500/30 text-xs">System Health</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Live results from the backend health, readiness and database probes.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <LastUpdated timestamp={systemHealth.dataUpdatedAt} />
          <RefreshButton onClick={runChecks} refreshing={checking} label="Run Health Check" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          icon={Server}
          iconClass="bg-emerald-500/10 text-emerald-400"
          label="API service"
          loading={publicHealth.isPending}
          failed={publicHealth.isError}
          value={
            <span className={cn("capitalize", apiState === "online" ? "text-emerald-400" : apiState === "degraded" ? "text-amber-400" : "text-rose-400")}>
              {publicHealth.data?.status ?? "Unknown"}
            </span>
          }
          footerLabel="Version"
          footerValue={
            publicHealth.data?.version
              ? `${publicHealth.data.version}${publicHealth.data.environment ? ` · ${publicHealth.data.environment}` : ""}`
              : MISSING_VALUE
          }
        />
        <MetricCard
          icon={Database}
          iconClass="bg-purple-500/10 text-purple-400"
          label="Database ping (server-side)"
          loading={systemHealth.isPending}
          failed={systemHealth.isError}
          value={formatMilliseconds(systemHealth.data?.database.pingMs)}
          footerLabel="Status"
          footerValue={<ServiceStatusBadge state={dbState} />}
        />
        <MetricCard
          icon={Gauge}
          iconClass="bg-blue-500/10 text-blue-400"
          label="API round-trip (this browser)"
          loading={systemHealth.isPending}
          failed={systemHealth.isError}
          value={formatMilliseconds(systemHealth.data?.apiRoundTripMs)}
          footerLabel="Checked"
          footerValue={formatDateTime(systemHealth.data?.checkedAt)}
        />
      </div>

      {systemHealth.isError && (
        <ErrorState
          title="Unable to run the authenticated system health check."
          error={systemHealth.error}
          onRetry={() => void systemHealth.refetch()}
          retrying={systemHealth.isFetching}
        />
      )}
      {publicHealth.isError && (
        <ErrorState
          title="Unable to reach the public API health endpoint."
          error={publicHealth.error}
          onRetry={() => void publicHealth.refetch()}
          retrying={publicHealth.isFetching}
        />
      )}

      <Panel>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-bold text-base text-foreground">Service Dependencies</h3>
          {readiness.data && (
            <ServiceStatusBadge
              state={readiness.data.ready ? "online" : "degraded"}
              label={readiness.data.ready ? "Ready" : `Not ready (HTTP ${readiness.data.httpStatus})`}
            />
          )}
        </div>

        {readiness.isPending && systemHealth.isPending ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ) : (
          <div className="space-y-3">
            <DependencyRow
              state={dbState}
              name="PostgreSQL database"
              detail={
                systemHealth.data?.database.pingMs != null
                  ? `SELECT 1 in ${formatMilliseconds(systemHealth.data.database.pingMs)}`
                  : readiness.data?.database
                    ? `Readiness probe: ${readiness.data.database}`
                    : undefined
              }
            />

            {readiness.isError ? (
              <ErrorState
                title="Unable to load the readiness probe (AI / LLM providers)."
                error={readiness.error}
                onRetry={() => void readiness.refetch()}
                retrying={readiness.isFetching}
              />
            ) : llm === null ? (
              <DependencyRow state="unknown" name="AI / LLM providers" detail="The readiness probe did not report LLM status." />
            ) : llm.providers.length === 0 ? (
              <DependencyRow
                state={llm.healthy === null ? "unknown" : llm.healthy ? "online" : "offline"}
                name="AI / LLM providers"
                detail="No providers reported by the readiness probe."
              />
            ) : (
              llm.providers.map((provider) => (
                <DependencyRow
                  key={provider.name}
                  state={provider.healthy ? "online" : "offline"}
                  name={`AI / LLM provider: ${provider.name}`}
                  detail={
                    llm.totalCount !== null
                      ? `${formatCount(llm.healthyCount)} of ${formatCount(llm.totalCount)} configured providers healthy`
                      : undefined
                  }
                  icon={<Bot className="h-3.5 w-3.5 text-muted-foreground" />}
                />
              ))
            )}
          </div>
        )}

        <InlineNotice className="mt-4">
          Only services that the backend actually probes are listed. CPU, memory, connection-pool and cache metrics are not exposed by
          the API, so they are not shown.
        </InlineNotice>
      </Panel>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  iconClass,
  label,
  loading,
  failed,
  value,
  footerLabel,
  footerValue,
}: {
  icon: typeof Server;
  iconClass: string;
  label: string;
  loading: boolean;
  failed: boolean;
  value: ReactNode;
  footerLabel: string;
  footerValue: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={cn("grid h-10 w-10 place-items-center rounded-xl", iconClass)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-lg font-bold text-foreground">
            {loading ? <Skeleton className="mt-1 h-6 w-20" /> : failed ? <span className="text-rose-400">Unavailable</span> : value}
          </div>
        </div>
      </div>
      <div className="mt-3 text-xs text-muted-foreground border-t border-border/40 pt-2 flex items-center justify-between gap-2">
        <span>{footerLabel}:</span>
        <span className="font-mono text-foreground text-right">{loading || failed ? MISSING_VALUE : footerValue}</span>
      </div>
    </div>
  );
}

function DependencyRow({
  state,
  name,
  detail,
  icon,
}: {
  state: ServiceBadgeState;
  name: string;
  detail?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border/40 bg-background/40">
      <div className="flex items-center gap-2.5 min-w-0">
        <ServiceDot state={state} />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            {icon}
            <span className="truncate">{name}</span>
          </div>
          {detail && <div className="text-[11px] text-muted-foreground">{detail}</div>}
        </div>
      </div>
      <ServiceStatusBadge state={state} />
    </div>
  );
}

export default SuperAdminPlatformConfigPage;
