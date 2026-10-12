"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { Check, Loader2, Search, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { todayInTz } from "@/lib/datetime";
import { api } from "@/api";
import type { Shift } from "@/services/attendance/types";

interface SimpleEmployee {
  id: string;
  name: string;
  department: string;
  designation?: string;
  email?: string;
  currentShift?: string;
}

interface EmployeesResponse {
  items: SimpleEmployee[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
}

interface AssignShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shift: Shift | null;
  onAssign: (payload: { employeeIds: string[]; effectiveDate: string; notes?: string }) => Promise<void>;
  assigning: boolean;
}

export function AssignShiftDialog({
  open,
  onOpenChange,
  shift,
  onAssign,
  assigning,
}: AssignShiftDialogProps) {
  const [search, setSearch] = useState("");
  const [selectedEmpIds, setSelectedEmpIds] = useState<string[]>([]);
  const [effectiveDate, setEffectiveDate] = useState(todayInTz());
  const [assignNotes, setAssignNotes] = useState("");
  const [selectAllLoaded, setSelectAllLoaded] = useState(false);

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch employees with search and pagination
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, refetch } = useInfiniteQuery({
    queryKey: ["employees", "assign-search", debouncedSearch],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        page: String(pageParam),
        limit: "50",
      });
      if (debouncedSearch) params.set("search", debouncedSearch);

      const res = await api.get(`/employees?${params.toString()}`);
      const data = res as { data?: unknown } | unknown;
      const list = (data as { data?: { items?: unknown[]; total?: number; page?: number; limit?: number } })?.data ?? data;
      const items = (list as { items?: unknown[] })?.items ?? (Array.isArray(list) ? list : []);
      return {
        items: items.map((e: any) => ({
          id: e.id,
          name: e.full_name || `${e.first_name || ""} ${e.last_name || ""}`.trim() || e.name || "Employee",
          department: e.department || "General",
          designation: e.designation || e.role,
          email: e.email,
          currentShift: e.shift || undefined,
        })),
        total: (list as { total?: number }).total ?? items.length,
        page: (list as { page?: number }).page ?? pageParam,
        limit: (list as { limit?: number }).limit ?? 50,
        hasNext: (list as { has_next?: boolean }).has_next ?? false,
      };
    },
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    initialPageParam: 1,
  });

  const employees = data?.pages.flatMap((p) => p.items) ?? [];
  const totalLoaded = data?.pages.reduce((sum, p) => sum + p.items.length, 0) ?? 0;
  const totalAvailable = data?.pages[0]?.total ?? 0;

  const handleToggleEmployee = (id: string) => {
    setSelectedEmpIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSelectAllLoaded = () => {
    if (selectedEmpIds.length === employees.length) {
      setSelectedEmpIds([]);
      setSelectAllLoaded(false);
    } else {
      setSelectedEmpIds(employees.map((e) => e.id));
      setSelectAllLoaded(true);
    }
  };

  const handleSubmit = async () => {
    if (!shift) return;
    if (selectedEmpIds.length === 0) {
      toast.error("Please select at least one employee");
      return;
    }

    try {
      await onAssign({
        employeeIds: selectedEmpIds,
        effectiveDate,
        notes: assignNotes || undefined,
      });
      onOpenChange(false);
      setSelectedEmpIds([]);
      setAssignNotes("");
      setSearch("");
      setDebouncedSearch("");
    } catch (error) {
      // Error handled by caller
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { setSelectedEmpIds([]); setAssignNotes(""); setSearch(""); setDebouncedSearch(""); } onOpenChange(o); }}>
      <DialogContent className="sm:max-w-lg max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Assign Shift to Employees</DialogTitle>
          <DialogDescription>
            Assign <strong className="text-foreground">{shift?.name}</strong> ({shift?.start_time} – {shift?.end_time}) to selected team members.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-left">
          <div>
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Effective Start Date *</Label>
            <Input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className="mt-1 h-9 text-xs"
              min={todayInTz()}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Select Team Members ({selectedEmpIds.length} selected)
              </Label>
              {employees.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSelectAllLoaded}
                  className="text-[11px] font-semibold text-indigo-400 hover:underline"
                >
                  {selectAllLoaded ? "Deselect All" : `Select All (${employees.length} loaded)`}
                </Button>
              )}
            </div>

            <div className="max-h-56 overflow-y-auto rounded-xl border border-border bg-card/40 p-2 space-y-1">
              {isLoading ? (
                <div className="p-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading employees...
                </div>
              ) : employees.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  No employees found matching your search.
                </div>
              ) : (
                <>
                  {employees.map((emp) => {
                    const checked = selectedEmpIds.includes(emp.id);
                    return (
                      <label
                        key={emp.id}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                          checked ? "bg-indigo-500/10 border border-indigo-500/30" : "hover:bg-muted/40"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => handleToggleEmployee(emp.id)}
                            className="h-3.5 w-3.5 rounded"
                          />
                          <div>
                            <div className="text-xs font-medium text-foreground">{emp.name}</div>
                            <div className="text-[10px] text-muted-foreground">
                              {emp.department} {emp.designation ? `· ${emp.designation}` : ""}
                              {emp.currentShift && ` · Current: ${emp.currentShift}`}
                            </div>
                          </div>
                        </div>
                        {checked && <Check className="h-3.5 w-3.5 text-indigo-400" />}
                      </label>
                    );
                  })}
                  {hasNextPage && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 gap-1.5 text-xs"
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                    >
                      {isFetchingNextPage && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      Load more ({totalLoaded} / {totalAvailable})
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Assignment Notes</Label>
            <Textarea
              rows={2}
              placeholder="Optional assignment instructions..."
              value={assignNotes}
              onChange={(e) => setAssignNotes(e.target.value)}
              className="mt-1 resize-none text-xs"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={assigning}>
            Cancel
          </Button>
          <Button size="sm" disabled={assigning || selectedEmpIds.length === 0} onClick={handleSubmit} className="gap-1.5">
            {assigning && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Assign Shift
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}