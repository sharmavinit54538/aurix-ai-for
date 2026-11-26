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
  fetchEmployeeById,
  fetchEmployeeStatistics,
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
  const searchParams = useSearch({ strict: false }) as {
    employeeId?: string;
    action?: string;
  };
  const { employees, loading, submitting, error, statistics, statisticsLoading } = useAppSelector(
    (state) => state.employees,
  );
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 300);
  const [dept, setDept] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Employee | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    dispatch(fetchEmployees({ search: debouncedQ, department: dept }));
    dispatch(fetchEmployeeStatistics());
  }, [dispatch, debouncedQ, dept]);

  useEffect(() => {
    if (searchParams?.action === "add") {
      setDraft(createEmptyEmployee());
      setOpen(true);
      navigate({
        search: ((prev: Record<string, unknown>) => {
          const next = { ...prev };
          delete next.action;
          return next;
        }) as any,
        replace: true,
      });
    }
  }, [searchParams?.action, navigate]);

  function handleDialogOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen && searchParams?.action) {
      navigate({
        search: ((prev: Record<string, unknown>) => {
          const next = { ...prev };
          delete next.action;
          return next;
        }) as any,
        replace: true,
      });
    }
  }

  useEffect(() => {
    if (searchParams?.employeeId) {
      dispatch(fetchEmployeeById(searchParams.employeeId));
    }
  }, [searchParams?.employeeId, dispatch]);

  useEffect(() => {
    if (searchParams?.employeeId && !selectedEmployee) {
      const match = employees.find(
        (e) =>
          e.id === searchParams.employeeId ||
          e.employeeId === searchParams.employeeId,
      );
      if (match) {
        setSelectedEmployee(match);
      }
    }
  }, [searchParams?.employeeId, employees, selectedEmployee]);

  const departments = useMemo(
    () =>
      Array.from(new Set(employees.map((e) => e.department).filter(Boolean))),
    [employees],
  );

  function refetch() {
    dispatch(fetchEmployees({ search: q, department: dept }));
    dispatch(fetchEmployeeStatistics());
  }

  const { deleteConfirm, deactivateConfirm, deactivateReason, setDeactivateReason } = useEmployeeConfirmDialogs({
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
      search: ((prev: Record<string, unknown>) => ({
        ...prev,
        employeeId: employee.id || employee.employeeId,
      })) as any,
      replace: true,
    });
  }

  function handleBack() {
    setSelectedEmployee(null);
    navigate({
      search: ((prev: Record<string, unknown>) => {
        const next = { ...prev };
        delete next.employeeId;
        return next;
      }) as any,
      replace: true,
    });
  }

  function openEdit(employee: Employee) {
    setDraft(employee);
    setOpen(true);
  }

  async function save() {
    if (!draft) return;

    const first_name =
      draft.firstName?.trim() ||
      draft.fullName?.trim().split(/\s+/)[0] ||
      "";
    const last_name =
      draft.lastName?.trim() ||
      draft.fullName?.trim().split(/\s+/).slice(1).join(" ") ||
      "";
    const officialEmail = (draft.companyEmail || draft.email || "").trim();
    const personalEmail = (draft.personalEmail || officialEmail).trim();

    if (!first_name || !officialEmail) {
      return toast.error("First name and Official Email are required");
    }

    const isEdit = draft.id !== "";

    if (isEdit) {
      const result = await dispatch(
        updateEmployee({
          id: draft.id,
          payload: {
            first_name,
            last_name: last_name || " ",
            company_email: officialEmail,
            personal_email: personalEmail,
            phone: draft.phone || undefined,
            gender: (draft.gender as "MALE" | "FEMALE" | "OTHER") || "MALE",
            date_of_birth: draft.dateOfBirth || undefined,
            employee_id: draft.employeeId,
            department: draft.department || "Engineering",
            designation: draft.designation || "Senior Software Engineer",
            reporting_manager_id: draft.reportingManagerId || undefined,
            joining_date: draft.joiningDate || undefined,
            employment_type: (draft.employmentType as "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN") || "FULL_TIME",
            work_mode: (draft.workMode as "OFFICE" | "REMOTE" | "HYBRID") || "OFFICE",
            probation_period_months: draft.probationPeriodMonths ?? 3,
            shift: draft.shift || "General Shift (09:30 - 18:30)",
            work_location: draft.workLocation || draft.officeLocation,
            ctc: draft.ctc ? Number(draft.ctc) : undefined,
            salary: draft.salary ? Number(draft.salary) : undefined,
            role: draft.role || "employee",
            send_onboarding_invite: draft.sendOnboardingInvite,
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
            last_name: last_name || " ",
            company_email: officialEmail,
            personal_email: personalEmail,
            phone: draft.phone || "",
            gender: (draft.gender as "MALE" | "FEMALE" | "OTHER") || "MALE",
            date_of_birth: draft.dateOfBirth || undefined,
            employee_id: draft.employeeId || undefined,
            department: draft.department || "Engineering",
            designation: draft.designation || "Senior Software Engineer",
            reporting_manager_id: draft.reportingManagerId || null,
            joining_date: draft.joiningDate || new Date().toISOString().split("T")[0],
            employment_type: (draft.employmentType as "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERN") || "FULL_TIME",
            work_mode: (draft.workMode as "OFFICE" | "REMOTE" | "HYBRID") || "OFFICE",
            probation_period_months: draft.probationPeriodMonths ?? 3,
            shift: draft.shift || "General Shift (09:30 - 18:30)",
            work_location: draft.workLocation || draft.officeLocation,
            ctc: draft.ctc ? Number(draft.ctc) : undefined,
            salary: draft.salary ? Number(draft.salary) : undefined,
            role: draft.role || "employee",
            send_onboarding_invite: draft.sendOnboardingInvite !== false,
          }),
      );

      if (createEmployee.fulfilled.match(result)) {
        toast.success(
          draft.sendOnboardingInvite !== false
            ? `Employee added & onboarding invite sent to ${officialEmail}`
            : "Employee added successfully",
        );
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
          onOpenChange={handleDialogOpenChange}
          draft={draft}
          onDraftChange={setDraft}
          submitting={submitting}
          existingEmployees={employees}
          onSave={async () => {
            await save();
            if (draft) {
              setSelectedEmployee((prev) =>
                prev ? { ...prev, ...draft } : null,
              );
            }
          }}
        />
<EmployeesConfirmDialogs
        deleteConfirm={deleteConfirm}
        deactivateConfirm={deactivateConfirm}
        deactivateReason={deactivateReason}
        setDeactivateReason={setDeactivateReason}
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
            <Button
              variant="outline"
              onClick={() => exportEmployeesCsv(employees)}
              disabled={employees.length === 0}
            >
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
        onOpenChange={handleDialogOpenChange}
        draft={draft}
        onDraftChange={setDraft}
        submitting={submitting}
        existingEmployees={employees}
        onSave={save}
      />
      <EmployeesConfirmDialogs
        deleteConfirm={deleteConfirm}
        deactivateConfirm={deactivateConfirm}
        deactivateReason={deactivateReason}
        setDeactivateReason={setDeactivateReason}
      />
    </>
  );
}