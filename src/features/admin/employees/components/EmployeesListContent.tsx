import { Loader2, Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Employee } from "../employeesTypes";
import { EmployeesTable } from "./EmployeesTable";

interface EmployeesListContentProps {
  loading: boolean;
  error: string | null;
  employees: Employee[];
  onRetry: () => void;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onResendInvite: (id: string) => void;
  onResetPassword: (id: string) => void;
  onDeactivate: (id: string) => void;
  onActivate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function EmployeesListContent({
  loading,
  error,
  employees,
  onRetry,
  onAdd,
  onEdit,
  onResendInvite,
  onResetPassword,
  onDeactivate,
  onActivate,
  onDelete,
}: EmployeesListContentProps) {
  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading employees...
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-12 bg-muted/30 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-destructive font-medium">Failed to load employees</p>
        <p className="text-sm text-muted-foreground mt-1">Please verify backend connection details.</p>
        <Button onClick={onRetry} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  if (employees.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground">
          <Users className="h-5 w-5" />
        </div>
        <p className="font-medium">No employees found</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Register your first employee or import records to populate your workforce dashboard.
        </p>
        <Button onClick={onAdd} className="mt-4">
          <Plus className="mr-2 h-4 w-4" /> Add employee
        </Button>
      </div>
    );
  }

  return (
    <EmployeesTable
      employees={employees}
      onEdit={onEdit}
      onResendInvite={onResendInvite}
      onResetPassword={onResetPassword}
      onDeactivate={onDeactivate}
      onActivate={onActivate}
      onDelete={onDelete}
    />
  );
}
