import { useState, type FormEvent } from "react";
import { Briefcase, Building2, Search, UserCog, Users, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSuperAdminOrganizations, useSuperAdminStatistics } from "../hooks";
import {
  AccessDeniedState,
  EmptyState,
  ErrorState,
  InlineNotice,
  KpiNumber,
  LastUpdated,
  PaginationBar,
  RefreshButton,
  SkeletonRows,
} from "../components/SuperAdminStates";
import { isAuthorizationError } from "../errors";
import { OrganizationStatusBadge } from "../components/Badges";
import { formatCount, formatDate, formatDateTime, shortId } from "../formatters";
import type { OrganizationOnboardingFilter } from "../types";

const PAGE_SIZE = 24;

const COUNTERS = [
  { key: "total", label: "Total", tone: "text-foreground" },
  { key: "onboarded", label: "Onboarded", tone: "text-emerald-400" },
  { key: "trial", label: "Trial", tone: "text-amber-400" },
  { key: "suspended", label: "Suspended", tone: "text-rose-400" },
  { key: "paid", label: "Paid", tone: "text-blue-400" },
  { key: "complimentary", label: "Complimentary", tone: "text-purple-400" },
  { key: "withoutSubscription", label: "No subscription", tone: "text-muted-foreground" },
] as const;

export function SuperAdminOrganizationsPage() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [onboarding, setOnboarding] = useState<"ALL" | OrganizationOnboardingFilter>("ALL");
  const [page, setPage] = useState(1);

  const organizations = useSuperAdminOrganizations({
    page,
    pageSize: PAGE_SIZE,
    search: search || undefined,
    onboarding: onboarding === "ALL" ? undefined : onboarding,
  });
  const statistics = useSuperAdminStatistics();

  const filtersActive = Boolean(search) || onboarding !== "ALL";
  const refreshing = organizations.isFetching || statistics.isFetching;

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

  if (organizations.isError && isAuthorizationError(organizations.error)) {
    return <AccessDeniedState error={organizations.error} />;
  }

  const counts = statistics.data?.organizations;
  const rows = organizations.data ?? [];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Organizations &amp; Company Accounts
            </h1>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">Multi-Tenant</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Platform-level management of all customer companies hosted on OFC360.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <LastUpdated timestamp={organizations.dataUpdatedAt} />
          <RefreshButton
            onClick={() => {
              void organizations.refetch();
              void statistics.refetch();
            }}
            refreshing={refreshing}
          />
        </div>
      </div>

      {/* Tenant & subscription counters */}
      {statistics.isError ? (
        <ErrorState
          title="Unable to load organization statistics."
          error={statistics.error}
          onRetry={() => void statistics.refetch()}
          retrying={statistics.isFetching}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {COUNTERS.map((counter) => (
            <div key={counter.key} className="rounded-xl border border-border/60 bg-card/60 p-3 text-center shadow-sm">
              <div className="text-[11px] font-medium uppercase text-muted-foreground">{counter.label}</div>
              <div className={cn("mt-0.5 text-xl font-bold", counter.tone)}>
                <KpiNumber value={counts?.[counter.key] ?? null} loading={statistics.isPending} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Search & filter */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <form onSubmit={applySearch} className="flex flex-1 items-center gap-2" role="search">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by company name, domain, or HR admin name/email…"
              aria-label="Search organizations"
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
        <label className="flex items-center gap-1 text-xs">
          <span className="text-muted-foreground">Onboarding:</span>
          <select
            value={onboarding}
            onChange={(event) => {
              setOnboarding(event.target.value as "ALL" | OrganizationOnboardingFilter);
              setPage(1);
            }}
            className="h-9 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
          >
            <option value="ALL">All</option>
            <option value="complete">Completed</option>
            <option value="pending">Not completed</option>
          </select>
        </label>
      </div>

      {organizations.isPending ? (
        <SkeletonRows rows={4} />
      ) : organizations.isError ? (
        <ErrorState
          title="Unable to load organizations."
          error={organizations.error}
          onRetry={() => void organizations.refetch()}
          retrying={organizations.isFetching}
        />
      ) : rows.length === 0 ? (
        <div className="space-y-3">
          <EmptyState
            icon={Building2}
            title="No organizations found"
            description={
              filtersActive
                ? "No organizations match the current search and filters."
                : page > 1
                  ? "There are no more organizations on this page."
                  : "No tenant companies have been created on the platform yet."
            }
          />
          {!filtersActive && page === 1 && (counts?.total ?? 0) > 0 && (
            <InlineNotice tone="warning">
              Platform statistics report {formatCount(counts?.total)} organizations, but the organization list came back empty.
              The server may have failed to load tenant records — try refreshing.
            </InlineNotice>
          )}
        </div>
      ) : (
        <div className={cn("grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 transition-opacity", organizations.isPlaceholderData && "opacity-60")}>
          {rows.map((org) => (
            <div
              key={org.id}
              className="rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-xl hover:border-blue-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wider",
                      org.plan ? "text-blue-400 border-blue-500/30" : "text-muted-foreground border-border",
                    )}
                  >
                    {org.plan ?? "No plan"}
                  </Badge>
                </div>

                <div className="mt-3">
                  <h3 className="font-bold text-base text-foreground break-words">{org.name ?? shortId(org.id)}</h3>
                  {org.domain && <div className="text-xs text-muted-foreground font-mono mt-0.5">{org.domain}</div>}
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-xs border-y border-border/40 py-3">
                  <div>
                    <div className="text-muted-foreground text-[11px] flex items-center gap-1">
                      <Users className="h-3 w-3" /> User accounts
                    </div>
                    <div className="font-bold text-foreground mt-0.5">{formatCount(org.userCount)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-[11px] flex items-center gap-1">
                      <Briefcase className="h-3 w-3" /> Active employees
                    </div>
                    <div className="font-bold text-emerald-400 mt-0.5">{formatCount(org.employeeCount)}</div>
                  </div>
                  <div className="mt-2 min-w-0">
                    <div className="text-muted-foreground text-[11px] flex items-center gap-1">
                      <UserCog className="h-3 w-3" /> Primary HR admin
                    </div>
                    {org.primaryHrAdmin ? (
                      <div className="mt-0.5 min-w-0">
                        <div className="font-medium text-foreground truncate">{org.primaryHrAdmin.name ?? "Unnamed"}</div>
                        {org.primaryHrAdmin.email && (
                          <div className="text-[10px] font-mono text-muted-foreground truncate">{org.primaryHrAdmin.email}</div>
                        )}
                      </div>
                    ) : (
                      <div className="font-medium text-muted-foreground mt-0.5">Not assigned</div>
                    )}
                  </div>
                  <div className="mt-2">
                    <div className="text-muted-foreground text-[11px]">Tenant status</div>
                    <div className="mt-1">
                      <OrganizationStatusBadge status={org.status} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                <span title={formatDateTime(org.createdAt)}>Created: {formatDate(org.createdAt)}</span>
                <span className="text-[11px] text-blue-400 font-medium font-mono" title={org.id}>
                  ID {shortId(org.id)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {!organizations.isPending && !organizations.isError && (
        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/60">
          <PaginationBar
            page={page}
            hasNextPage={rows.length === PAGE_SIZE}
            onPageChange={setPage}
            busy={organizations.isFetching}
            itemCount={rows.length}
            pageSize={PAGE_SIZE}
          />
        </div>
      )}
    </div>
  );
}

export default SuperAdminOrganizationsPage;
