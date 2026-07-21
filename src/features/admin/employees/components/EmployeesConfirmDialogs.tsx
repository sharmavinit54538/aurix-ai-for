import { ConfirmAlertDialog } from "@/components/ui/confirm-alert-dialog";
import type { EmployeeConfirmDialogState } from "../hooks/useEmployeeConfirmDialogs";
import { getEmployeeStatusDetails } from "../utils/employeeStatus";

interface EmployeesConfirmDialogsProps {
  deleteConfirm: EmployeeConfirmDialogState;
  deactivateConfirm: EmployeeConfirmDialogState;
}

export function EmployeesConfirmDialogs({
  deleteConfirm,
  deactivateConfirm,
}: EmployeesConfirmDialogsProps) {
  const isActiveEmployee =
    deactivateConfirm.employee != null &&
    getEmployeeStatusDetails(deactivateConfirm.employee).text === "ACTIVE";

  return (
    <>
      <ConfirmAlertDialog
        open={deleteConfirm.open}
        onOpenChange={deleteConfirm.onOpenChange}
        title="Are you sure you want to remove this employee?"
        description={
          <>
            This action cannot be undone. This will permanently remove{" "}
            <span className="font-semibold text-foreground">
              {deleteConfirm.employee?.fullName ?? "this employee"}
            </span>{" "}
            from the workforce directory.
          </>
        }
        confirmLabel="Remove"
        onConfirm={deleteConfirm.onConfirm}
      />

      <ConfirmAlertDialog
        open={deactivateConfirm.open}
        onOpenChange={deactivateConfirm.onOpenChange}
        title="Are you sure you want to deactivate this employee?"
        description={
          isActiveEmployee ? (
            <>
              This will deactivate{" "}
              <span className="font-semibold text-foreground">
                {deactivateConfirm.employee?.fullName}
              </span>
              . They will lose access to the portal until reactivated.
            </>
          ) : (
            "They will lose access to the portal until reactivated."
          )
        }
        confirmLabel="Deactivate"
        onConfirm={deactivateConfirm.onConfirm}
      />
    </>
  );
}
