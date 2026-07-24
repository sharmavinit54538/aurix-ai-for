import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Plus, ShieldCheck, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectPermissions, selectRoles, selectSettingsLoading } from "@/store/settings/settingsSelectors";
import { createRole, deleteRole, fetchPermissions, fetchRoles, updateRole } from "@/store/settings/settingsThunk";
import type { Role } from "@/store/settings/settingsTypes";

export const Route = createFileRoute("/dashboard/settings/roles-permissions")({
  head: () => ({ meta: [{ title: "Roles & Permissions — Aurix" }] }),
  component: RolesPermissionsPage,
});

function RolesPermissionsPage() {
  const dispatch = useAppDispatch();
  const roles = useAppSelector(selectRoles);
  const permissions = useAppSelector(selectPermissions);
  const loading = useAppSelector(selectSettingsLoading);

  const [openAdd, setOpenAdd] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const [roleForm, setRoleForm] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  });

  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchPermissions());
  }, [dispatch]);

  useEffect(() => {
    if (roles.length > 0 && !selectedRole) {
      setSelectedRole(roles[0]);
    }
  }, [roles, selectedRole]);

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleForm.name.trim()) return;
    try {
      await dispatch(createRole(roleForm)).unwrap();
      toast.success("New role created successfully!");
      setOpenAdd(false);
      setRoleForm({ name: "", description: "", permissions: [] });
    } catch {
      toast.error("Failed to create role");
    }
  };

  const handleTogglePermission = async (permId: string) => {
    if (!selectedRole) return;
    const currentPerms = selectedRole.permissions || [];
    const newPerms = currentPerms.includes(permId)
      ? currentPerms.filter((p) => p !== permId)
      : [...currentPerms, permId];

    try {
      const updated = await dispatch(
        updateRole({
          id: selectedRole.id,
          name: selectedRole.name,
          description: selectedRole.description,
          permissions: newPerms,
        }),
      ).unwrap();
      setSelectedRole(updated);
      toast.success(`Permissions updated for ${selectedRole.name}`);
    } catch {
      toast.error("Failed to update permission");
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      await dispatch(deleteRole(roleId)).unwrap();
      toast.success("Role removed");
      if (selectedRole?.id === roleId) {
        setSelectedRole(roles.find((r) => r.id !== roleId) || null);
      }
    } catch {
      toast.error("Failed to delete role");
    }
  };

  if (loading && roles.length === 0) {
    return (
      <div className="space-y-4 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-72 rounded-xl lg:col-span-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Roles & Permissions Management</h2>
          <p className="text-xs text-muted-foreground">Define access control roles and fine-tune module permissions across your enterprise.</p>
        </div>
        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" /> Create Custom Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateRole} className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs">Role Name</Label>
                <Input
                  value={roleForm.name}
                  onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                  placeholder="e.g. Payroll Specialist"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Description</Label>
                <Input
                  value={roleForm.description}
                  onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                  placeholder="Brief summary of responsibilities"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setOpenAdd(false)}>Cancel</Button>
                <Button type="submit">Create Role</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
        {/* Roles List */}
        <div className="space-y-2 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Configured Roles</div>
          {roles.map((r) => {
            const active = selectedRole?.id === r.id;
            return (
              <div
                key={r.id}
                onClick={() => setSelectedRole(r)}
                className={`group flex cursor-pointer items-center justify-between rounded-xl p-3 text-sm transition-all ${active ? "bg-accent text-foreground shadow-xs" : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"}`}
              >
                <div>
                  <div className="font-medium text-foreground">{r.name}</div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" /> {r.userCount || 0} members
                  </div>
                </div>
                {r.isSystem ? (
                  <Badge variant="secondary" className="text-[10px]">System</Badge>
                ) : (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 opacity-0 group-hover:opacity-100 hover:bg-rose-500/15 hover:text-rose-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRole(r.id);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {/* Permission Matrix */}
        <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
          {selectedRole ? (
            <div>
              <div className="mb-6 flex items-center justify-between border-b border-border/60 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <h3 className="text-base font-semibold">{selectedRole.name} Permissions</h3>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{selectedRole.description}</p>
                </div>
                <Badge variant="outline">{selectedRole.permissions?.length || 0} Enabled</Badge>
              </div>

              <div className="space-y-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Access Permissions Matrix</div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {permissions.map((p) => {
                    const isChecked = selectedRole.permissions?.includes(p.id) || selectedRole.permissions?.includes("all");
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleTogglePermission(p.id)}
                        className={`flex cursor-pointer items-center justify-between rounded-xl border p-3 text-xs transition-all ${isChecked ? "border-primary/40 bg-primary/5" : "border-border/60 bg-background/40"}`}
                      >
                        <div>
                          <div className="font-medium text-foreground">{p.name}</div>
                          <div className="text-[10px] text-muted-foreground">{p.category} · {p.id}</div>
                        </div>
                        <Checkbox checked={isChecked} onCheckedChange={() => handleTogglePermission(p.id)} />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-muted-foreground">Select a role to configure permissions.</div>
          )}
        </div>
      </div>
    </div>
  );
}
