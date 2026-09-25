import React, { useEffect, useState } from "react";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  Building2,
  Clock,
  MoreVertical,
  UserCheck,
  UserX,
  Power,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { superAdminApi } from "../superAdminApi";
import { getSingleSuperAdmin } from "@/lib/platform-owner";
import { toast } from "sonner";
import type { SuperAdminUserStats, PlatformUser } from "../types";
import type { AppRole } from "@/lib/roles";

const ROLE_BADGES: Record<
  string,
  { label: string; bg: string; text: string; border: string }
> = {
  super_admin: {
    label: "SUPER ADMIN",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/30",
  },
  hr_admin: {
    label: "HR ADMIN",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
  },
  manager: {
    label: "MANAGER",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/30",
  },
  employee: {
    label: "EMPLOYEE",
    bg: "bg-sky-500/10",
    text: "text-sky-400",
    border: "border-sky-500/30",
  },
  it_admin: {
    label: "IT ADMIN",
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/30",
  },
  executive: {
    label: "EXECUTIVE",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
  },
};

export function SuperAdminUsersPage() {
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [stats, setStats] = useState<SuperAdminUserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // User status toggle modal
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);
  const [actionConfirmOpen, setActionConfirmOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const owner = getSingleSuperAdmin();

  const loadData = async () => {
    setLoading(true);
    try {
      const [u, s] = await Promise.all([
        superAdminApi.getUsers({
          search: searchTerm,
          role: selectedRole,
          status: selectedStatus,
        }),
        superAdminApi.getStats(),
      ]);
      setUsers(u);
      setStats(s);
    } catch {
      toast.error("Failed to load users data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [selectedRole, selectedStatus]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    void loadData();
  };

  const handleOpenStatusModal = (user: PlatformUser) => {
    setSelectedUser(user);
    setActionConfirmOpen(true);
  };

  const handleConfirmToggleStatus = async () => {
    if (!selectedUser) return;
    setActionLoading(true);
    const newStatus = selectedUser.status === "active" ? "inactive" : "active";

    try {
      await superAdminApi.toggleUserStatus(selectedUser.id, newStatus);
      toast.success(
        `User ${selectedUser.name} has been ${newStatus === "active" ? "activated" : "deactivated"}.`,
      );
      setActionConfirmOpen(false);
      setSelectedUser(null);
      void loadData();
    } catch (err: any) {
      toast.error(err.message || "Failed to update user status");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              User Management
            </h1>
            <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
              Platform Registry
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Global directory of all accounts registered across client organizations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="gap-2 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Counters Banner (Requirement 9) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        <div className="rounded-xl border border-border/60 bg-card/60 p-3 shadow-sm text-center">
          <div className="text-[11px] font-medium text-muted-foreground uppercase">Total</div>
          <div className="text-xl font-bold text-foreground mt-0.5">{stats?.totalUsers ?? "—"}</div>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 shadow-sm text-center">
          <div className="text-[11px] font-medium text-emerald-400 uppercase">Active</div>
          <div className="text-xl font-bold text-emerald-400 mt-0.5">{stats?.activeUsers ?? "—"}</div>
        </div>
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 shadow-sm text-center">
          <div className="text-[11px] font-medium text-rose-400 uppercase">Inactive</div>
          <div className="text-xl font-bold text-rose-400 mt-0.5">{stats?.inactiveUsers ?? "—"}</div>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-card/60 p-3 shadow-sm text-center">
          <div className="text-[11px] font-medium text-emerald-400 uppercase">HR Admins</div>
          <div className="text-xl font-bold text-foreground mt-0.5">{stats?.hrAdmins ?? "—"}</div>
        </div>
        <div className="rounded-xl border border-blue-500/20 bg-card/60 p-3 shadow-sm text-center">
          <div className="text-[11px] font-medium text-blue-400 uppercase">Managers</div>
          <div className="text-xl font-bold text-foreground mt-0.5">{stats?.managers ?? "—"}</div>
        </div>
        <div className="rounded-xl border border-sky-500/20 bg-card/60 p-3 shadow-sm text-center">
          <div className="text-[11px] font-medium text-sky-400 uppercase">Employees</div>
          <div className="text-xl font-bold text-foreground mt-0.5">{stats?.employees ?? "—"}</div>
        </div>
        <div className="rounded-xl border border-cyan-500/20 bg-card/60 p-3 shadow-sm text-center">
          <div className="text-[11px] font-medium text-cyan-400 uppercase">IT Admins</div>
          <div className="text-xl font-bold text-foreground mt-0.5">{stats?.itAdmins ?? "—"}</div>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-card/60 p-3 shadow-sm text-center">
          <div className="text-[11px] font-medium text-amber-400 uppercase">Executives</div>
          <div className="text-xl font-bold text-foreground mt-0.5">{stats?.executives ?? "—"}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or organization..."
            className="pl-9 h-9 text-xs"
          />
        </form>

        <div className="flex items-center gap-2">
          {/* Role Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-muted-foreground">Role:</span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="h-9 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="hr_admin">HR Admin</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
              <option value="it_admin">IT Admin</option>
              <option value="executive">Executive</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="text-muted-foreground">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="h-9 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sole Platform Owner Card */}
      <div className="rounded-xl border border-purple-500/30 bg-purple-950/20 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground">{owner.name}</span>
              <Badge className="bg-purple-500/30 text-purple-300 border-purple-500/40 text-[10px]">
                Platform Owner (Single Instance)
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">{owner.email}</div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground text-right hidden sm:block">
          <div>Status: <span className="text-emerald-400 font-semibold">Active</span></div>
          <div className="text-[11px]">Sole Owner — Cannot be deleted or duplicated</div>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-sm backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border/60 bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Organization</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Created At</th>
                <th className="py-3 px-4">Last Login</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground">
                    <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-purple-400" />
                    Loading platform user records...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground">
                    No users match the selected filters.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const roleBadge = ROLE_BADGES[user.role] || {
                    label: user.role.toUpperCase(),
                    bg: "bg-muted",
                    text: "text-foreground",
                    border: "border-border",
                  };
                  const isActive = user.status === "active";

                  return (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4 font-semibold text-foreground">
                        {user.name}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground font-mono">
                        {user.email}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-medium text-foreground">
                          <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          {user.organization}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold border ${roleBadge.bg} ${roleBadge.text} ${roleBadge.border}`}
                        >
                          {roleBadge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                            isActive
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isActive ? "bg-emerald-400" : "bg-rose-400"
                            }`}
                          />
                          {isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {new Date(user.lastLogin).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenStatusModal(user)}
                          className={`h-7 px-2.5 text-[11px] font-semibold gap-1 ${
                            isActive
                              ? "text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border-rose-500/30"
                              : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 border-emerald-500/30"
                          }`}
                        >
                          <Power className="h-3 w-3" />
                          {isActive ? "Deactivate" : "Activate"}
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog for Activate/Deactivate */}
      <Dialog open={actionConfirmOpen} onOpenChange={setActionConfirmOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border/60 backdrop-blur-xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              {selectedUser?.status === "active" ? (
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-rose-500/20 text-rose-400">
                  <UserX className="h-5 w-5" />
                </div>
              ) : (
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <UserCheck className="h-5 w-5" />
                </div>
              )}
              <DialogTitle className="text-base font-bold">
                {selectedUser?.status === "active" ? "Deactivate User Account" : "Activate User Account"}
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              {selectedUser?.status === "active"
                ? `Are you sure you want to deactivate ${selectedUser?.name}? They will immediately lose access to their OFC360 workspace.`
                : `Are you sure you want to activate ${selectedUser?.name}? They will regain access to their organization.`}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="rounded-xl border border-border/50 bg-background/50 p-3 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">User:</span>
                <span className="font-semibold text-foreground">{selectedUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-mono text-muted-foreground">{selectedUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Organization:</span>
                <span className="text-foreground">{selectedUser.organization}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Role:</span>
                <span className="font-semibold uppercase text-foreground">{selectedUser.role}</span>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActionConfirmOpen(false)}
              disabled={actionLoading}
              className="text-xs h-8"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleConfirmToggleStatus}
              disabled={actionLoading}
              className={`text-xs h-8 ${
                selectedUser?.status === "active"
                  ? "bg-rose-600 hover:bg-rose-700 text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
            >
              {actionLoading ? "Processing..." : selectedUser?.status === "active" ? "Confirm Deactivation" : "Confirm Activation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
