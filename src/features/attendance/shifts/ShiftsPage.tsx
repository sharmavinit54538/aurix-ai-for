"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useCurrentRole } from "@/lib/use-current-role";
import { hasPermission } from "@/lib/permissions";
import { EmployeeShiftsView } from "@/features/portal/employee/components/EmployeeShiftsView";
import { Clock, Plus, Search, Users, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useShiftsQuery, useShiftOptionsQuery, useCreateShift, useUpdateShift, useDeleteShift, useAssignShift, useMyScheduleQuery } from "./hooks/useShifts";
import { ShiftCard } from "./components/ShiftCard";
import { ShiftStats } from "./components/ShiftStats";
import { ShiftFilters } from "./components/ShiftFilters";
import { ShiftFormDialog } from "./components/ShiftFormDialog";
import { AssignShiftDialog } from "./components/AssignShiftDialog";
import { DeleteShiftDialog } from "./components/DeleteShiftDialog";
import { ChangeRequestsPanel } from "./components/ChangeRequestsPanel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { Shift, ShiftCreatePayload, ShiftListResponse } from "@/services/attendance/types";
import { WEEK_DAYS } from "@/lib/datetime";

export function ShiftsPage() {
  const router = useRouterState();
  const currentRole = useCurrentRole();
  const isEmployee = currentRole === "employee";
  const canWrite = hasPermission(currentRole, "attendance:manage") || hasPermission(currentRole, "hr:manage") || hasPermission(currentRole, "workforce:manage");

  // For non-employee roles, show admin page. Employees see their own view.
  if (isEmployee) {
    return <EmployeeShiftsView />;
  }

  // Query params for server-side filtering
  const searchParams = router.location.search as Record<string, any>;
  const [page, setPage] = useState(searchParams?.page ? Number(searchParams.page) : 1);
  const [limit] = useState(20);

  // Client-side state
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "day" | "night">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  // Dialog states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [assignShift, setAssignShift] = useState<Shift | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [shiftToDelete, setShiftToDelete] = useState<Shift | null>(null);

  // Active tab
  const [activeTab, setActiveTab] = useState<"shifts" | "change-requests">("shifts");

  // Queries
  const { data: shiftsData, isLoading, isError, error, refetch } = useShiftsQuery({
    search: search || undefined,
    is_active: statusFilter === "all" ? undefined : statusFilter === "active",
    night_shift: typeFilter === "all" ? undefined : typeFilter === "night",
    page,
    limit,
  });

  const { data: shiftOptions } = useShiftOptionsQuery();

  // Mutations
  const createMutation = useCreateShift({
    onSuccess: () => {
      toast.success("Shift created successfully");
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = useUpdateShift({
    onSuccess: () => {
      toast.success("Shift updated successfully");
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useDeleteShift({
    onSuccess: (result) => {
      if (result.reassigned) {
        toast.success("Shift deleted and employees reassigned");
      } else {
        toast.success("Shift deleted successfully");
      }
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  const assignMutation = useAssignShift({
    onSuccess: (result) => {
      if (result.skipped && result.skipped.length > 0) {
        toast.success(`Assigned ${result.assigned_count} employees. ${result.skipped.length} skipped.`);
      } else {
        toast.success(`Assigned ${result.assigned_count} employees`);
      }
      refetch();
    },
    onError: (error) => toast.error(error.message),
  });

  // Handlers
  const openCreateDialog = useCallback(() => {
    setEditingShift(null);
    setIsFormOpen(true);
  }, []);

  const openEditDialog = useCallback((shift: Shift) => {
    setEditingShift(shift);
    setIsFormOpen(true);
  }, []);

  const handleFormSubmit = useCallback(async (data: ShiftCreatePayload) => {
    if (editingShift) {
      await updateMutation.mutateAsync({ id: editingShift.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
    setEditingShift(null);
  }, [editingShift, createMutation, updateMutation]);

  const openAssignDialog = useCallback((shift: Shift) => {
    setAssignShift(shift);
    setIsAssignOpen(true);
  }, []);

  const handleAssign = useCallback(async (payload: { employeeIds: string[]; effectiveDate: string; notes?: string }) => {
    if (!assignShift) return;
    await assignMutation.mutateAsync({ shiftId: assignShift.id, payload });
  }, [assignShift, assignMutation]);

  const openDeleteDialog = useCallback((shift: Shift) => {
    setShiftToDelete(shift);
    setIsDeleteOpen(true);
  }, []);

  const handleDelete = useCallback(async (reassignTo?: string) => {
    if (!shiftToDelete) return;
    await deleteMutation.mutateAsync({ id: shiftToDelete.id, reassignTo });
    setShiftToDelete(null);
  }, [shiftToDelete, deleteMutation]);

  const shifts = shiftsData?.items ?? [];
  const total = shiftsData?.total ?? 0;

  // Stats from loaded data
  const stats = useMemo(() => {
    const active = shifts.filter((s) => s.is_active).length;
    const night = shifts.filter((s) => s.night_shift).length;
    const assigned = shifts.reduce((sum, s) => sum + (s.assigned_employees_count || 0), 0);
    return { total: shifts.length, active, night, assigned };
  }, [shifts]);

  return (
    <div className="space-y-6 pb-20">
      {/* ── Action Bar ── */}
      {canWrite && (
        <div className="flex justify-end">
          <Button onClick={openCreateDialog} className="h-9 gap-1.5 text-xs bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-600 hover:to-purple-700">
            <Plus className="h-4 w-4" />
            Create Shift
          </Button>
        </div>
      )}

      {/* ── Stats ── */}
      <ShiftStats
        total={total}
        active={stats.active}
        night={stats.night}
        assigned={stats.assigned}
        loading={isLoading}
      />

      {/* ── Tabs ── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-card/60 border border-border p-1">
          <TabsTrigger value="shifts" className="gap-1.5 text-xs">
            <Clock className="h-3.5 w-3.5" /> Shifts ({total})
          </TabsTrigger>
          {canWrite && (
            <TabsTrigger value="change-requests" className="gap-1.5 text-xs">
              <Users className="h-3.5 w-3.5" /> Change Requests
            </TabsTrigger>
          )}
        </TabsList>

        {/* ── Shifts Tab ── */}
        <TabsContent value="shifts" className="space-y-4">
          {/* Filters */}
          <ShiftFilters
            search={search}
            onSearchChange={setSearch}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />

          {/* List */}
          {isLoading && shifts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 border border-border rounded-2xl bg-card/30 gap-3 text-muted-foreground text-sm">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span>Loading shift templates from backend...</span>
            </div>
          ) : shifts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 border border-dashed border-border rounded-2xl bg-card/20 gap-3 text-center">
              <Clock className="h-10 w-10 text-muted-foreground/50" />
              <h3 className="font-semibold text-sm">No Shifts Found</h3>
              <p className="text-xs text-muted-foreground max-w-md">
                {total === 0
                  ? "No work shifts have been created yet."
                  : "No shifts match your search and filter criteria."}
              </p>
              {canWrite && total === 0 && (
                <Button size="sm" onClick={openCreateDialog} className="mt-2 text-xs gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> Create First Shift
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {shifts.map((s) => (
                <ShiftCard
                  key={s.id}
                  shift={s}
                  onEdit={openEditDialog}
                  onAssign={openAssignDialog}
                  onDelete={openDeleteDialog}
                  canEdit={canWrite}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {total > limit && (
            <div className="flex items-center justify-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1 || isLoading}>
                Previous
              </Button>
              <span className="text-xs text-muted-foreground">Page {page} of {Math.ceil(total / limit)}</span>
              <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(Math.ceil(total / limit), p + 1))} disabled={page >= Math.ceil(total / limit) || isLoading}>
                Next
              </Button>
            </div>
          )}
        </TabsContent>

        {/* ── Change Requests Tab ── */}
        {canWrite && (
          <TabsContent value="change-requests" className="space-y-4">
            <ChangeRequestsPanel />
          </TabsContent>
        )}
      </Tabs>

      {/* ── Create / Edit Shift Dialog ── */}
      <ShiftFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSubmit={handleFormSubmit}
        initialData={editingShift ? {
          name: editingShift.name,
          code: editingShift.code,
          startTime: editingShift.start_time,
          endTime: editingShift.end_time,
          gracePeriodMinutes: editingShift.grace_period_minutes,
          breakDurationMinutes: editingShift.break_duration_minutes,
          nightShift: editingShift.night_shift,
          nightPremiumPercent: editingShift.night_premium_percent,
          workingDays: editingShift.working_days,
          description: editingShift.description,
          isActive: editingShift.is_active,
        } : null}
        submitting={createMutation.isPending || updateMutation.isPending}
        isEditing={!!editingShift}
      />

      {/* ── Assign Shift Dialog ── */}
      <AssignShiftDialog
        open={isAssignOpen}
        onOpenChange={setIsAssignOpen}
        shift={assignShift}
        onAssign={handleAssign}
        assigning={assignMutation.isPending}
      />

      {/* ── Delete Confirmation Dialog ── */}
      <DeleteShiftDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        shift={shiftToDelete}
        onConfirm={handleDelete}
        deleting={deleteMutation.isPending}
      />
    </div>
  );
}

export default ShiftsPage;