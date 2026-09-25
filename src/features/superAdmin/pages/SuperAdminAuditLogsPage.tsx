import { useMemo, useState, type FormEvent } from "react";
import { FileText, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useOrganizationDirectory, useSuperAdminAuditLogs } from "../hooks";
import {
  AccessDeniedState,
  EmptyState,
  ErrorState,
  PaginationBar,
  SkeletonRows,
} from "../components/SuperAdminStates";
import { isAuthorizationError } from "../errors";
import { formatDateTime, MISSING_VALUE, shortId } from "../formatters";

const PAGE_SIZE = 50;

export function SuperAdminAuditLogsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const logs = useSuperAdminAuditLogs({ page, pageSize: PAGE_SIZE, search: search || undefined });
  const directory = useOrganizationDirectory();

  const organizationNames = useMemo(
    () => new Map((directory.data ?? []).map((org) => [org.id, org.name] as const)),
    [directory.data],
  );

  const applySearch = (event: FormEvent) => {
    event.preventDefault();
    setSearch(searchInput.trim());
    setPage(1);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  if (logs.isError && isAuthorizationError(logs.error)) {
    return <AccessDeniedState error={logs.error} />;
  }

  const rows = logs.data ?? [];

  const organizationLabel = (organizationId: string | null) => {
    if (!organizationId) return "Platform-level";
    return organizationNames.get(organizationId) ?? `Tenant ${shortId(organizationId)}`;
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">

      {/* Search (server-side: action, actor email, details) */}
      <form onSubmit={applySearch} className="flex items-center gap-2" role="search">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by action, actor email, or details…"
            aria-label="Search audit logs"
            className="pl-9 pr-8 h-9 text-xs"
          />
          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <Button type="submit" size="sm" variant="outline" className="h-9 text-xs">
          Search
        </Button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-sm backdrop-blur-xl">
        {logs.isPending ? (
          <SkeletonRows rows={6} className="p-4" />
        ) : logs.isError ? (
          <ErrorState
            className="m-4"
            title="Unable to load audit logs."
            error={logs.error}
            onRetry={() => void logs.refetch()}
            retrying={logs.isFetching}
          />
        ) : rows.length === 0 ? (
          <div className="p-4">
            <EmptyState
              icon={FileText}
              title={search ? "No matching audit events" : "No activity available"}
              description={
                search
                  ? "No audit events match the current search."
                  : page > 1
                    ? "There are no more audit events on this page."
                    : "No audit events have been recorded yet."
              }
            />
          </div>
        ) : (
          <div className={cn("overflow-x-auto transition-opacity", logs.isPlaceholderData && "opacity-60")}>
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Organization</th>
                  <th className="py-3 px-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {rows.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors align-top">
                    <td className="py-3 px-4 text-muted-foreground font-mono whitespace-nowrap">{formatDateTime(log.timestamp)}</td>
                    <td className="py-3 px-4 font-medium text-foreground">
                      {log.actorEmail ?? <span className="text-muted-foreground italic">Not recorded</span>}
                    </td>
                    <td className="py-3 px-4 font-mono font-semibold text-purple-400 break-all">{log.action ?? MISSING_VALUE}</td>
                    <td className="py-3 px-4 text-muted-foreground" title={log.organizationId ?? undefined}>
                      {organizationLabel(log.organizationId)}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground max-w-md">
                      <span className="line-clamp-2" title={log.details ?? undefined}>
                        {log.details ?? MISSING_VALUE}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!logs.isPending && !logs.isError && (
          <PaginationBar
            page={page}
            hasNextPage={rows.length === PAGE_SIZE}
            onPageChange={setPage}
            busy={logs.isFetching}
            itemCount={rows.length}
            pageSize={PAGE_SIZE}
          />
        )}
      </div>
    </div>
  );
}

export default SuperAdminAuditLogsPage;
