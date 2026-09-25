import { useState, useEffect, type FormEvent } from "react";
import { Building2, Power, Search, UserCheck, UserX, Users, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAurix } from "@/lib/aurix-store";
import { cn } from "@/lib/utils";
import { useSetUserActive, useSuperAdminStatistics, useSuperAdminUsers } from "../hooks";
import {
  AccessDeniedState,
  EmptyState,
  ErrorState,
  InlineNotice,
  KpiNumber,
  PaginationBar,
  SkeletonRows,
} from "../components/SuperAdminStates";
import { isAuthorizationError } from "../errors";
import { AccountStatusBadge, RoleBadge } from "../components/Badges";
import {
  formatCount,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatRoleLabel,
  MISSING_VALUE,
  ROLE_FILTER_GROUPS,
  shortId,
} from "../formatters";
import type { PlatformUser, UserStatusFilter } from "../types";

const PAGE_SIZE = 25;

const COUNTERS = [
  { key: "total", label: "Total", card: "border-border/60 bg-card/60", text: "text-muted-foreground", value: "text-foreground" },
  { key: "active", label: "Active", card: "border-emerald-500/20 bg-emerald-500/5", text: "text-emerald-400", value: "text-emerald-400" },
  { key: "inactive", label: "Inactive", card: "border-rose-500/20 bg-rose-500/5", text: "text-rose-400", value: "text-rose-400" },
  { key: "hrAdmins", label: "HR Admins", card: "border-emerald-500/20 bg-card/60", text: "text-emerald-400", value: "text-foreground" },
  { key: "managers", label: "Managers", card: "border-blue-500/20 bg-card/60", text: "text-blue-400", value: "text-foreground" },
  { key: "employees", label: "Employees", card: "border-sky-500/20 bg-card/60", text: "text-sky-400", value: "text-foreground" },
  { key: "itAdmins", label: "IT Admins", card: "border-cyan-500/20 bg-card/60", text: "text-cyan-400", value: "text-foreground" },
  { key: "executives", label: "Executives", card: "border-amber-500/20 bg-card/60", text: "text-amber-400", value: "text-foreground" },
] as const;

export function SuperAdminUsersPage() {
  const ws = useAurix();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("ALL");
  const [status, setStatus] = useState<"ALL" | UserStatusFilter>("ALL");
  const [page, setPage] = useState(1);

  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);

  const params = {
    page,
    pageSize: PAGE_SIZE,
    search: search || undefined,
    role: role === "ALL" ? undefined : role,
    status: status === "ALL" ? undefined : status,
  };
  const users = useSuperAdminUsers(params);
  const statistics = useSuperAdminStatistics();
  const setUserActive = useSetUserActive();

  const filtersActive = Boolean(params.search || params.role || params.status);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

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

  const canChangeStatus = (user: PlatformUser) =>
    user.isActive !== null && user.role?.toLowerCase() !== "super_admin" && user.id !== ws.user?.id;

  const confirmStatusChange = async () => {
    if (!selectedUser || selectedUser.isActive === null) return;
    const activate = !selectedUser.isActive;
    try {
      const message = await setUserActive.mutateAsync({ userId: selectedUser.id, active: activate });
      toast.success(message ?? `User ${activate ? "activated" : "deactivated"}.`);
      setSelectedUser(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update user status.");
    }
  };

  if (users.isError && isAuthorizationError(users.error)) {
    return <AccessDeniedState error={users.error} />;
  }

  const stats = statistics.data?.users;
  const rows = users.data ?? [];
  const totalUsers = stats?.total ?? null;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* KPI counters */}
      {statistics.isError ? (
        <ErrorState
          title="Unable to load user statistics."
          error={statistics.error}
          onRetry={() => void statistics.refetch()}
          retrying={statistics.isFetching}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {COUNTERS.map((counter) => (
            <div key={counter.key} className={cn("rounded-xl border p-3 shadow-sm text-center", counter.card)}>
              <div className={cn("text-[11px] font-medium uppercase", counter.text)}>{counter.label}</div>
              <div className={cn("text-xl font-bold mt-0.5", counter.value)}>
                <KpiNumber value={stats?.[counter.key] ?? null} loading={statistics.isPending} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        <form onSubmit={applySearch} className="flex flex-1 items-center max-w-md" role="search">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by name, email or phone…"
              aria-label="Search users"
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
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-1 text-xs">
            <span className="text-muted-foreground">Role:</span>
            <select
              value={role}
              onChange={(event) => {
                setRole(event.target.value);
                setPage(1);
              }}
              className="h-9 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              {ROLE_FILTER_GROUPS.map((group) => (
                <optgroup key={group.label} label={group.label}>
                  {group.roles.map((value) => (
                    <option key={value} value={value}>
                      {formatRoleLabel(value)}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-1 text-xs">
            <span className="text-muted-foreground">Status:</span>
            <select
              value={status}
              onChange={(event) => {
                setStatus(event.target.value as "ALL" | UserStatusFilter);
                setPage(1);
              }}
              className="h-9 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-sm backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-border/40 px-4 py-2.5 text-[11px] text-muted-foreground">
          <span>Sorted by registration date, newest first</span>
          {users.isFetching && !users.isPending && <span className="text-purple-400">Loading…</span>}
        </div>

        {users.isPending ? (
          <SkeletonRows rows={6} className="p-4" />
        ) : users.isError ? (
          <ErrorState
            className="m-4"
            title="Unable to load users."
            error={users.error}
            onRetry={() => void users.refetch()}
            retrying={users.isFetching}
          />
        ) : rows.length === 0 ? (
          <div className="p-4 space-y-3">
            <EmptyState
              icon={Users}
              title="No users found"
              description={
                filtersActive
                  ? "No accounts match the current search and filters."
                  : page > 1
                    ? "There are no more users on this page."
                    : "No accounts have been registered on the platform yet."
              }
            />
            {!filtersActive && page === 1 && (totalUsers ?? 0) > 0 && (
              <InlineNotice tone="warning">
                Platform statistics report {formatCount(totalUsers)} users, but the user list came back empty. The server may have
                failed to load user records — try refreshing.
              </InlineNotice>
            )}
          </div>
        ) : (
          <div className={cn("overflow-x-auto transition-opacity", users.isPlaceholderData && "opacity-60")}>
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border/60 bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Organization</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Registered</th>
                  <th className="py-3 px-4">Last Sign-in</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {rows.map((user) => {
                  const editable = canChangeStatus(user);
                  return (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-semibold text-foreground">{user.name ?? MISSING_VALUE}</td>
                      <td className="py-3 px-4 text-muted-foreground font-mono">{user.email ?? MISSING_VALUE}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-foreground">
                          <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          {user.organizationName ??
                            (user.organizationId ? (
                              shortId(user.organizationId)
                            ) : (
                              <span className="text-muted-foreground">
                                {user.role?.toLowerCase() === "super_admin" ? "Platform" : "No organization"}
                              </span>
                            ))}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="py-3 px-4">
                        <AccountStatusBadge isActive={user.isActive} />
                      </td>
                      <td className="py-3 px-4 text-muted-foreground" title={formatDateTime(user.createdAt)}>
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground" title={formatDateTime(user.lastLoginAt)}>
                        {user.lastLoginAt ? formatRelativeTime(user.lastLoginAt) : "Never"}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {editable ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                            className={cn(
                              "h-7 px-2.5 text-[11px] font-semibold gap-1",
                              user.isActive
                                ? "text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border-rose-500/30"
                                : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 border-emerald-500/30",
                            )}
                          >
                            <Power className="h-3 w-3" />
                            {user.isActive ? "Deactivate" : "Activate"}
                          </Button>
                        ) : (
                          <span className="text-[11px] text-muted-foreground" title="Status changes are disabled for Super Admin accounts">
                            Protected
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!users.isPending && !users.isError && (
          <PaginationBar
            page={page}
            hasNextPage={rows.length === PAGE_SIZE}
            onPageChange={setPage}
            busy={users.isFetching}
            itemCount={rows.length}
            pageSize={PAGE_SIZE}
          />
        )}
      </div>

      {/* Confirmation Dialog for Activate/Deactivate */}
      <Dialog open={selectedUser !== null} onOpenChange={(open) => !open && !setUserActive.isPending && setSelectedUser(null)}>
        <DialogContent className="sm:max-w-md bg-card border-border/60 backdrop-blur-xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              {selectedUser?.isActive ? (
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-rose-500/20 text-rose-400">
                  <UserX className="h-5 w-5" />
                </div>
              ) : (
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <UserCheck className="h-5 w-5" />
                </div>
              )}
              <DialogTitle className="text-base font-bold">
                {selectedUser?.isActive ? "Deactivate User Account" : "Activate User Account"}
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              {selectedUser?.isActive
                ? `Deactivate ${selectedUser?.name ?? selectedUser?.email ?? "this user"}? They will lose access to their OFC360 workspace.`
                : `Activate ${selectedUser?.name ?? selectedUser?.email ?? "this user"}? They will regain access to their organization.`}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="rounded-xl border border-border/50 bg-background/50 p-3 space-y-1.5 text-xs">
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">User:</span>
                <span className="font-semibold text-foreground">{selectedUser.name ?? MISSING_VALUE}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-mono text-muted-foreground">{selectedUser.email ?? MISSING_VALUE}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Organization:</span>
                <span className="text-foreground">{selectedUser.organizationName ?? "No organization"}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-muted-foreground">Role:</span>
                <span className="font-semibold text-foreground">{formatRoleLabel(selectedUser.role)}</span>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelectedUser(null)}
              disabled={setUserActive.isPending}
              className="text-xs h-8"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => void confirmStatusChange()}
              disabled={setUserActive.isPending}
              className={cn(
                "text-xs h-8 text-white",
                selectedUser?.isActive ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700",
              )}
            >
              {setUserActive.isPending
                ? "Processing…"
                : selectedUser?.isActive
                  ? "Confirm Deactivation"
                  : "Confirm Activation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SuperAdminUsersPage;
