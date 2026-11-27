import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Download, Plus, Upload, FileCheck, FileText, Mail, UserCheck, User, CheckCircle2, Layers, CalendarDays } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { getRejectMessage } from "@/api/utils";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  activateEmployee,
  approveEmployee,
  createEmployee,
  exportEmployees,
  fetchEmployees,
  fetchEmployeeById,
  fetchEmployeeOnboardingStatus,
  fetchEmployeeStatistics,
  importEmployees,
  rejectEmployee,
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
import { createEmptyEmployee } from "../utils/employeeStatus";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export function EmployeesPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as {
    employeeId?: string;
    action?: string;
  };
  const { employees, loading, submitting, error, statistics, statisticsLoading, onboardingStatus, onboardingStatusLoading } = useAppSelector(
    (state) => state.employees,
  );
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 300);
  const [dept, setDept] = useState<string>("all");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Employee | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState<number | null>(null);
  const [importResult, setImportResult] = useState<{ success: number; failed: number; errors?: Array<{ row: number; field: string; message: string }> } | null>(null);
  const [approveId, setApproveId] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [onboardingStatusModal, setOnboardingStatusModal] = useState<string | null>(null);

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

  async function handleImport() {
    if (!importFile) return;
    setImportProgress(0);
    setImportResult(null);
    const result = await dispatch(importEmployees(importFile));
    if (importEmployees.fulfilled.match(result)) {
      const data = result.payload;
      setImportProgress(100);
      setImportResult({ success: data.imported, failed: data.failed, errors: data.errors });
      if (data.imported > 0) {
        toast.success(`${data.imported} employees imported successfully`);
        if (data.failed > 0) {
          toast.warning(`${data.failed} records failed to import`);
        }
        refetch();
      } else if (data.failed > 0) {
        toast.error(`Import failed: ${data.failed} records had errors`);
      }
    } else {
      toast.error(getRejectMessage(result.payload, "Failed to import employees"));
    }
    setImportProgress(null);
  }

  async function handleExport() {
    const result = await dispatch(exportEmployees({ search: q, department: dept }));
    if (exportEmployees.fulfilled.match(result)) {
      const blob = result.payload;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `employees-export-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Employees exported successfully");
    } else {
      toast.error(getRejectMessage(result.payload, "Failed to export employees"));
    }
  }

  async function handleApprove(id: string) {
    setApproveId(id);
    const result = await dispatch(approveEmployee(id));
    if (approveEmployee.fulfilled.match(result)) {
      toast.success("Employee approved successfully");
      refetch();
    } else {
      toast.error(getRejectMessage(result.payload, "Failed to approve employee"));
    }
    setApproveId(null);
  }

  async function handleReject(id: string) {
    if (!rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    setRejectId(id);
    const result = await dispatch(rejectEmployee({ id, reason: rejectReason }));
    if (rejectEmployee.fulfilled.match(result)) {
      toast.success("Employee rejected");
      refetch();
      setRejectReason("");
      setRejectId(null);
    } else {
      toast.error(getRejectMessage(result.payload, "Failed to reject employee"));
    }
    setRejectId(null);
  }

  async function handleOnboardingStatus(id: string) {
    setOnboardingStatusModal(id);
    await dispatch(fetchEmployeeOnboardingStatus(id));
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

    const payload: Record<string, unknown> = {
      first_name,
      last_name: last_name || " ",
      company_email: officialEmail,
      personal_email: personalEmail,
      phone: draft.phone || undefined,
      gender: draft.gender || undefined,
      date_of_birth: draft.dateOfBirth || undefined,
      employee_id: draft.employeeId || undefined,
      department: draft.department || undefined,
      designation: draft.designation || undefined,
      reporting_manager_id: draft.reportingManagerId || undefined,
      joining_date: draft.joiningDate || undefined,
      employment_type: draft.employmentType || undefined,
      work_mode: draft.workMode || undefined,
      probation_period_months: draft.probationPeriodMonths ?? 3,
      shift: draft.shift || undefined,
      work_location: draft.workLocation || draft.officeLocation || undefined,
      ctc: draft.ctc ? Number(draft.ctc) : undefined,
      salary: draft.salary ? Number(draft.salary) : undefined,
      role: draft.role || "employee",
      send_onboarding_invite: draft.sendOnboardingInvite !== false,
    };

    // Remove undefined values to avoid sending unnecessary defaults
    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined) {
        delete payload[key];
      }
    });

    const result = await dispatch(
      isEdit
        ? updateEmployee({ id: draft.id, payload: payload as any })
        : createEmployee(payload as any),
    );

    if ((isEdit ? updateEmployee.fulfilled : createEmployee.fulfilled).match(result)) {
      toast.success(
        isEdit
          ? "Employee updated successfully"
          : draft.sendOnboardingInvite !== false
            ? `Employee added & onboarding invite sent to ${officialEmail}`
            : "Employee added successfully",
      );
      setOpen(false);
      refetch();
    } else {
      toast.error(getRejectMessage(result.payload, isEdit ? "Failed to update employee" : "Failed to add employee"));
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
          onboardingStatus={onboardingStatus}
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

        {/* Import Dialog */}
        <Dialog open={importOpen} onOpenChange={setImportOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Import Employees</DialogTitle>
              <DialogDescription>
                Upload a CSV or Excel file to bulk import employees. Download the template for the correct format.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center">
                <Input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="import-file"
                  disabled={importProgress !== null}
                />
                <Label htmlFor="import-file" className="cursor-pointer flex flex-col items-center gap-2 text-sm text-muted-foreground">
                  <FileCheck className="h-8 w-8 text-primary" />
                  <span>Drag & drop or click to select file</span>
                  <span className="text-xs">CSV, XLSX, XLS (max 10MB)</span>
                </Label>
                {importFile && (
                  <div className="flex items-center justify-center gap-2 text-sm text-foreground mt-2">
                    <span className="truncate max-w-[200px]">{importFile.name}</span>
                    <span className="text-muted-foreground">({(importFile.size / 1024).toFixed(1)} KB)</span>
                  </div>
                )}
              </div>
              {importProgress !== null && (
                <div className="space-y-2">
                  <Progress value={importProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-center">
                    {importProgress < 100 ? "Uploading and processing..." : "Import complete"}
                  </p>
                </div>
              )}
              {importResult && (
                <div className="rounded-lg border bg-muted p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant={importResult.success > 0 ? "default" : "destructive"}>
                      {importResult.success} imported
                    </Badge>
                    {importResult.failed > 0 && (
                      <Badge variant="destructive">{importResult.failed} failed</Badge>
                    )}
                  </div>
                  {importResult.errors && importResult.errors.length > 0 && (
                    <details className="text-xs text-muted-foreground">
                      <summary className="cursor-pointer">View errors ({importResult.errors.length})</summary>
                      <ul className="mt-2 space-y-1 list-disc pl-4 max-h-40 overflow-y-auto">
                        {importResult.errors.slice(0, 10).map((err, idx) => (
                          <li key={idx}>Row {err.row}: {err.field} - {err.message}</li>
                        ))}
                        {importResult.errors.length > 10 && (
                          <li>... and {importResult.errors.length - 10} more errors</li>
                        )}
                      </ul>
                    </details>
                  )}
                </div>
              )}
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => { setImportOpen(false); setImportFile(null); setImportResult(null); setImportProgress(null); }}>
                Cancel
              </Button>
              <Button
                onClick={handleImport}
                disabled={!importFile || importProgress !== null}
              >
                {importProgress !== null ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <FileCheck className="mr-2 h-4 w-4" />
                    Import Employees
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Approve Confirmation Dialog */}
        <Dialog open={approveId !== null} onOpenChange={() => setApproveId(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Approve Employee</DialogTitle>
              <DialogDescription>
                Are you sure you want to approve this employee? This will activate their onboarding and send credentials.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setApproveId(null)}>Cancel</Button>
              <Button onClick={() => handleApprove(approveId!)} disabled={approveId === null}>
                Approve
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={rejectId !== null} onOpenChange={() => { setRejectId(null); setRejectReason(""); }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reject Employee</DialogTitle>
              <DialogDescription>
                This will reject the employee's onboarding. Please provide a reason.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="reject-reason">Rejection Reason *</Label>
                <Input
                  id="reject-reason"
                  type="text"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. Incomplete documents, duplicate application"
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setRejectId(null); setRejectReason(""); }}>Cancel</Button>
              <Button variant="destructive" onClick={() => handleReject(rejectId!)} disabled={!rejectReason.trim() || rejectId === null}>
                Reject
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Onboarding Status Dialog */}
        <Dialog open={onboardingStatusModal !== null} onOpenChange={() => setOnboardingStatusModal(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Onboarding Status</DialogTitle>
              <DialogDescription>
                Detailed onboarding progress for the selected employee.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {onboardingStatus && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <OnboardingStatusItem
                      label="Overall Status"
                      value={onboardingStatus.status}
                      icon={<FileText className="h-4 w-4" />}
                    />
                    <OnboardingStatusItem
                      label="Invitation"
                      value={onboardingStatus.invitation_status || "—"}
                      icon={<Mail className="h-4 w-4" />}
                    />
                    <OnboardingStatusItem
                      label="Account Activation"
                      value={onboardingStatus.account_activation || "—"}
                      icon={<UserCheck className="h-4 w-4" />}
                    />
                    <OnboardingStatusItem
                      label="Profile Completion"
                      value={onboardingStatus.profile_completion !== undefined ? `${onboardingStatus.profile_completion}%` : "—"}
                      icon={<User className="h-4 w-4" />}
                    />
                    <OnboardingStatusItem
                      label="Document Verification"
                      value={onboardingStatus.document_verification || "—"}
                      icon={<FileText className="h-4 w-4" />}
                    />
                    <OnboardingStatusItem
                      label="Approval Status"
                      value={onboardingStatus.approval_status || "—"}
                      icon={<CheckCircle2 className="h-4 w-4" />}
                    />
                    <OnboardingStatusItem
                      label="Steps Completed"
                      value={`${onboardingStatus.steps_completed} / ${onboardingStatus.total_steps}`}
                      icon={<Layers className="h-4 w-4" />}
                    />
                    {onboardingStatus.completed_at && (
                      <OnboardingStatusItem
                        label="Completed At"
                        value={onboardingStatus.completed_at}
                        icon={<CalendarDays className="h-4 w-4" />}
                      />
                    )}
                  </div>
                  {onboardingStatus.pending_documents && onboardingStatus.pending_documents.length > 0 && (
                    <div className="p-3 rounded-lg border bg-amber-50 dark:bg-amber-900/20">
                      <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-2">Pending Documents</p>
                      <ul className="list-disc pl-4 text-xs text-amber-600 dark:text-amber-400 space-y-1">
                        {onboardingStatus.pending_documents.map((doc, idx) => (
                          <li key={idx}>{doc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {!onboardingStatus && !onboardingStatusLoading && (
                <p className="text-center text-muted-foreground">No onboarding data available</p>
              )}
              {onboardingStatusLoading && (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOnboardingStatusModal(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
            <Button variant="outline" onClick={() => setImportOpen(true)} disabled={loading}>
              <Upload className="mr-2 h-4 w-4" /> Import
            </Button>
            <Button variant="outline" onClick={handleExport} disabled={loading || employees.length === 0}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button onClick={openNew}>
              <Plus className="mr-2 h-4 w-4" /> Add employee
            </Button>
          </>
        }
      />
      <div className="rounded-xl border border-border bg-card shadow-xs">
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
          onApprove={handleApprove}
          onReject={() => { setRejectId(employees.find(e => e.id === approveId)?.id || ""); }}
          onOnboardingStatus={handleOnboardingStatus}
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

function OnboardingStatusItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  const getStatusColor = (val: string) => {
    const v = val.toLowerCase();
    if (v.includes("completed") || v.includes("verified") || v.includes("approved") || v.includes("accepted")) {
      return "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20";
    }
    if (v.includes("pending") || v.includes("in_progress") || v.includes("viewed")) {
      return "text-amber-600 bg-amber-50 dark:bg-amber-900/20";
    }
    if (v.includes("failed") || v.includes("rejected") || v.includes("expired")) {
      return "text-rose-600 bg-rose-50 dark:bg-rose-900/20";
    }
    return "text-foreground bg-muted";
  };

  return (
    <div className="p-4 rounded-xl border border-border/60 bg-card">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <p className={`font-semibold text-sm ${getStatusColor(value)}`}>{value}</p>
    </div>
  );
}