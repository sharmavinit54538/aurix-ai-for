import { useEffect, useMemo, useState } from "react";
import { Download, Plus } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchManagers } from "@/features/admin/managers/managersThunk";
import { useManagersList } from "@/features/admin/managers/hooks/useManagersList";
import {
  activateEmployee,
  createEmployee,
  deactivateEmployee,
  deleteEmployee,
  fetchEmployeeById,
  fetchEmployees,
  resendEmployeeInvite,
  resetEmployeePassword,
  updateEmployee,
} from "../employeesThunk";
import type { EmployeeFormState } from "../employeesTypes";
import type { ParsedError } from "@/api/utils";
import { toast } from "sonner";
import { EmployeesFilters } from "../components/EmployeesFilters";
import { EmployeesListContent } from "../components/EmployeesListContent";
import { EmployeeFormDialog } from "../components/EmployeeFormDialog";
import { exportEmployeesCsv } from "../utils/employeeStatus";
import {
  createEmptyEmployeeForm,
  formToCreatePayload,
  formToUpdatePayload,
  validateEmployeeForm,
} from "../utils/employeeForm";

function getErrorMessage(payload: ParsedError | string | undefined, fallback: string): string {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  return payload.message || fallback;
}

export function EmployeesPage() {
  const dispatch = useAppDispatch();
  const { employees, loading, submitting, error } = useAppSelector((state) => state.employees);
  const managers = useManagersList();
  const [q, setQ] = useState("");
  const [dept, setDept] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [draft, setDraft] = useState<EmployeeFormState | null>(null);

  useEffect(() => {
    dispatch(fetchEmployees({ search: q, department: dept }));
  }, [dispatch, q, dept]);

  useEffect(() => {
    dispatch(fetchManagers({ limit: 200 }));
  }, [dispatch]);

  const departments = useMemo(
    () => Array.from(new Set(employees.map((e) => e.department).filter(Boolean))),
    [employees],
  );

  function refetch() {
    dispatch(fetchEmployees({ search: q, department: dept }));
  }

  async function resendInvite(id: string) {
    const result = await dispatch(resendEmployeeInvite(id));
    if (resendEmployeeInvite.fulfilled.match(result)) {
      toast.success("Invitation email resent successfully");
    } else {
      toast.error(getErrorMessage(result.payload, "Failed to resend invitation"));
    }
  }

  async function deactivateEmployeeAction(id: string) {
    if (!confirm("Are you sure you want to deactivate this employee account? They will lose access to the portal.")) {
      return;
    }
    const result = await dispatch(deactivateEmployee(id));
    if (deactivateEmployee.fulfilled.match(result)) {
      toast.success("Employee account deactivated successfully");
      refetch();
    } else {
      toast.error(getErrorMessage(result.payload, "Failed to deactivate employee"));
    }
  }

  async function activateEmployeeAction(id: string) {
    const result = await dispatch(activateEmployee(id));
    if (activateEmployee.fulfilled.match(result)) {
      toast.success("Employee account activated successfully");
      refetch();
    } else {
      toast.error(getErrorMessage(result.payload, "Failed to activate employee"));
    }
  }

  async function resetPassword(id: string) {
    if (!confirm("Are you sure you want to reset this employee's password? A temporary password will be sent to their email.")) {
      return;
    }
    const result = await dispatch(resetEmployeePassword(id));
    if (resetEmployeePassword.fulfilled.match(result)) {
      toast.success("Employee password reset email sent successfully");
    } else {
      toast.error(getErrorMessage(result.payload, "Failed to reset password"));
    }
  }

  function openNew() {
    setIsEditMode(false);
    setDetailLoading(false);
    setDraft(createEmptyEmployeeForm());
    setOpen(true);
  }

  async function openEdit(id: string) {
    setIsEditMode(true);
    setOpen(true);
    setDraft(null);
    setDetailLoading(true);

    const result = await dispatch(fetchEmployeeById(id));
    setDetailLoading(false);

    if (fetchEmployeeById.fulfilled.match(result)) {
      setDraft(result.payload.formState);
      return;
    }

    toast.error(getErrorMessage(result.payload, "Failed to load employee details"));
    setOpen(false);
    setIsEditMode(false);
    setDraft(null);
  }

  function handleFormOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      setIsEditMode(false);
      setDetailLoading(false);
      setDraft(null);
    }
  }

  async function save() {
    if (!draft) return;

    const validation = validateEmployeeForm(draft);
    if (!validation.valid) {
      toast.error(validation.message ?? "Please fill in all required fields");
      return;
    }

    const isEdit = Boolean(draft.id);

    if (isEdit && draft.id) {
      const result = await dispatch(
        updateEmployee({
          id: draft.id,
          payload: formToUpdatePayload(draft),
        }),
      );
      if (updateEmployee.fulfilled.match(result)) {
        toast.success("Employee updated successfully");
        handleFormOpenChange(false);
        refetch();
      } else {
        toast.error(getErrorMessage(result.payload, "Failed to update employee"));
      }
    } else {
      const result = await dispatch(createEmployee(formToCreatePayload(draft)));
      if (createEmployee.fulfilled.match(result)) {
        toast.success("Employee added successfully");
        handleFormOpenChange(false);
        refetch();
      } else {
        toast.error(getErrorMessage(result.payload, "Failed to add employee"));
      }
    }
  }

  async function remove(id: string) {
    if (!confirm("Are you sure you want to remove this employee?")) return;

    const result = await dispatch(deleteEmployee(id));
    if (deleteEmployee.fulfilled.match(result)) {
      toast.success("Employee removed successfully");
    } else {
      toast.error(getErrorMessage(result.payload, "Failed to remove employee"));
    }
  }

  return (
    <>
      <PageHeader
        title="Employees"
        description={`${employees.length} people across ${departments.length || 0} departments`}
        actions={
          <>
            <Button variant="outline" onClick={() => exportEmployeesCsv(employees)} disabled={employees.length === 0}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button onClick={openNew}>
              <Plus className="mr-2 h-4 w-4" /> Add employee
            </Button>
          </>
        }
      />

      <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl">
        <EmployeesFilters
          search={q}
          department={dept}
          onSearchChange={setQ}
          onDepartmentChange={setDept}
        />

        <EmployeesListContent
          loading={loading}
          error={error}
          employees={employees}
          onRetry={refetch}
          onAdd={openNew}
          onEdit={openEdit}
          onResendInvite={resendInvite}
          onResetPassword={resetPassword}
          onDeactivate={deactivateEmployeeAction}
          onActivate={activateEmployeeAction}
          onDelete={remove}
        />
      </div>

      <EmployeeFormDialog
        open={open}
        onOpenChange={handleFormOpenChange}
        isEdit={isEditMode}
        detailLoading={detailLoading}
        draft={draft}
        onDraftChange={setDraft}
        submitting={submitting}
        onSave={save}
        managers={managers}
      />
    </>
  );
}
