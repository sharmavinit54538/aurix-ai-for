import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

import { Download, Plus } from "lucide-react";

import { PageHeader } from "@/components/aurix/DashboardShell";

import { Button } from "@/components/ui/button";

import { getRejectMessage } from "@/api/utils";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import {

  activateEmployee,

  createEmployee,

  fetchEmployees,

  resendEmployeeInvite,

  resetEmployeePassword,

  updateEmployee,

} from "../employeesThunk";

import type { Employee } from "../employeesTypes";

import { toast } from "sonner";

import { EmployeesFilters } from "../components/EmployeesFilters";

import { EmployeesListContent } from "../components/EmployeesListContent";

import { EmployeeFormDialog } from "../components/EmployeeFormDialog";

import { useNavigate, useSearch } from "@tanstack/react-router";

import { EmployeesConfirmDialogs } from "../components/EmployeesConfirmDialogs";

import { EmployeeDetailPage } from "../components/EmployeeDetailPage";

import { useEmployeeConfirmDialogs } from "../hooks/useEmployeeConfirmDialogs";

import { createEmptyEmployee, exportEmployeesCsv } from "../utils/employeeStatus";



export function EmployeesPage() {

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const searchParams = useSearch({ strict: false }) as { employeeId?: string };

  const { employees, loading, submitting, error } = useAppSelector((state) => state.employees);

  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 300);

  const [dept, setDept] = useState<string>("all");

  const [open, setOpen] = useState(false);

  const [draft, setDraft] = useState<Employee | null>(null);

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);



  useEffect(() => {

    dispatch(fetchEmployees({ search: debouncedQ, department: dept }));

  }, [dispatch, debouncedQ, dept]);



  // If employeeId is passed via URL search parameters, sync full page view
  useEffect(() => {
    if (searchParams?.employeeId && employees.length > 0) {
      const match = employees.find(
        (e) => e.id === searchParams.employeeId || e.employeeId === searchParams.employeeId,
      );
      if (match) {
        setSelectedEmployee(match);
      }
    }
  }, [searchParams?.employeeId, employees]);



  const departments = useMemo(

    () => Array.from(new Set(employees.map((e) => e.department).filter(Boolean))),

    [employees],

  );



  function refetch() {

    dispatch(fetchEmployees({ search: q, department: dept }));

  }



  const { deleteConfirm, deactivateConfirm } = useEmployeeConfirmDialogs({

    employees,

    onChanged: refetch,

  });



  async function resendInvite(id: string) {

    const result = await dispatch(resendEmployeeInvite(id));

    if (resendEmployeeInvite.fulfilled.match(result)) {

      toast.success("Invitation email resent successfully");

    } else {

      toast.error(getRejectMessage(result.payload, "Failed to resend invitation"));

    }

  }



  async function activateEmployeeAction(id: string) {

    const result = await dispatch(activateEmployee(id));

    if (activateEmployee.fulfilled.match(result)) {

      toast.success("Employee account activated successfully");

      refetch();

    } else {

      toast.error(getRejectMessage(result.payload, "Failed to activate employee"));

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

      toast.error(getRejectMessage(result.payload, "Failed to reset password"));

    }

  }



  function openNew() {

    setDraft(createEmptyEmployee());

    setOpen(true);

  }



  function openView(employee: Employee) {
    setSelectedEmployee(employee);
    navigate({
      search: (prev: Record<string, unknown>) => ({ ...prev, employeeId: employee.id || employee.employeeId }),
      replace: true,
    });
  }

  function handleBack() {
    setSelectedEmployee(null);
    navigate({
      search: (prev: Record<string, unknown>) => {
        const next = { ...prev };
        delete next.employeeId;
        return next;
      },
      replace: true,
    });
  }

  function openEdit(employee: Employee) {

    setDraft(employee);

    setOpen(true);

  }



  async function save() {

    if (!draft) return;

    if (!draft.fullName || !draft.email) return toast.error("Name and email required");



    const names = draft.fullName.trim().split(/\s+/);

    const first_name = names[0] || "";

    const last_name = names.slice(1).join(" ") || " ";

    const isEdit = draft.id !== "";



    if (isEdit) {

      const result = await dispatch(

        updateEmployee({

          id: draft.id,

          payload: {

            first_name,

            last_name,

            personal_email: draft.email,

            phone: draft.phone || undefined,

            department: draft.department,

            designation: draft.designation,

            joining_date: draft.joiningDate || undefined,

            shift: draft.shift,

          },

        }),

      );

      if (updateEmployee.fulfilled.match(result)) {

        toast.success("Employee updated successfully");

        setOpen(false);

        refetch();

      } else {

        toast.error(getRejectMessage(result.payload, "Failed to update employee"));

      }

    } else {

      const result = await dispatch(

        createEmployee({

          first_name,

          last_name,

          personal_email: draft.email,

          company_email: draft.email,

          phone: draft.phone || "",

          department: draft.department || "Engineering",

          designation: draft.designation || "Engineer",

          joining_date: draft.joiningDate,

          employee_id: draft.employeeId || `EMP-${Math.floor(100000 + Math.random() * 900000)}`,

          employment_type: "FULL_TIME",

          employment_status: "PROBATION",

          role: "employee",

          shift: draft.shift || "General",

        }),

      );

      if (createEmployee.fulfilled.match(result)) {

        toast.success("Employee added successfully");

        setOpen(false);

        refetch();

      } else {

        toast.error(getRejectMessage(result.payload, "Failed to add employee"));

      }

    }

  }

  if (selectedEmployee) {
    return (
      <div className="w-full">
        <EmployeeDetailPage
          employee={selectedEmployee}
          onBack={handleBack}
          onEdit={(emp) => openEdit(emp)}
          onResendInvite={resendInvite}
          onResetPassword={resetPassword}
          onDeactivate={deactivateConfirm.onRequest}
          onActivate={activateEmployeeAction}
        />
        <EmployeeFormDialog
          open={open}
          onOpenChange={setOpen}
          draft={draft}
          onDraftChange={setDraft}
          submitting={submitting}
          onSave={async () => {
            await save();
            if (draft) {
              setSelectedEmployee((prev) => (prev ? { ...prev, ...draft } : null));
            }
          }}
        />
        <EmployeesConfirmDialogs
          deleteConfirm={deleteConfirm}
          deactivateConfirm={deactivateConfirm}
        />
      </div>
    );
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
          onView={openView}
          onEdit={openEdit}
          onResendInvite={resendInvite}
          onResetPassword={resetPassword}
          onDeactivate={deactivateConfirm.onRequest}
          onActivate={activateEmployeeAction}
          onDelete={deleteConfirm.onRequest}
        />
      </div>
      <EmployeeFormDialog
        open={open}
        onOpenChange={setOpen}
        draft={draft}
        onDraftChange={setDraft}
        submitting={submitting}
        onSave={save}
      />
      <EmployeesConfirmDialogs
        deleteConfirm={deleteConfirm}
        deactivateConfirm={deactivateConfirm}
      />
    </>
  );
}


