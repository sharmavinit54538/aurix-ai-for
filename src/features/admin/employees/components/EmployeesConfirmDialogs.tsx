import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { EmployeeConfirmDialogState } from "../hooks/useEmployeeConfirmDialogs";
import { getEmployeeStatusDetails } from "../utils/employeeStatus";

interface EmployeesConfirmDialogsProps {
  deleteConfirm: EmployeeConfirmDialogState;
  deactivateConfirm: EmployeeConfirmDialogState;
  deactivateReason: string;
  setDeactivateReason: (reason: string) => void;
}

export function EmployeesConfirmDialogs({
  deleteConfirm,
  deactivateConfirm,
  deactivateReason,
  setDeactivateReason,
}: EmployeesConfirmDialogsProps) {
  const isActiveEmployee =
    deactivateConfirm.employee != null &&
    getEmployeeStatusDetails(deactivateConfirm.employee).text === "ACTIVE";

  return (
    <>
      <AlertDialog
        open={deleteConfirm.open}
        onOpenChange={deleteConfirm.onOpenChange}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to remove this employee?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove{" "}
              <span className="font-semibold text-foreground">
                {deleteConfirm.employee?.fullName ?? "this employee"}
              </span>{" "}
              from the workforce directory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteConfirm.onConfirm} className="bg-destructive hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={deactivateConfirm.open}
        onOpenChange={deactivateConfirm.onOpenChange}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to deactivate this employee?</AlertDialogTitle>
            <AlertDialogDescription>
              {isActiveEmployee ? (
                <>
                  This will deactivate{" "}
                  <span className="font-semibold text-foreground">
                    {deactivateConfirm.employee?.fullName}
                  </span>
                  . They will lose access to the portal until reactivated.
                </>
              ) : (
                "They will lose access to the portal until reactivated."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-2">
              <Label htmlFor="deactivate-reason" className="text-sm font-medium">
                Reason for deactivation <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="deactivate-reason"
                value={deactivateReason}
                onChange={(e) => setDeactivateReason(e.target.value)}
                placeholder="e.g. Employment ended, Resignation, Contract completion..."
                rows={3}
                className="w-full text-sm"
                aria-describedby="deactivate-reason-hint"
                required
              />
              <p id="deactivate-reason-hint" className="text-xs text-muted-foreground">
                Required before confirming deactivation.
              </p>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={deactivateConfirm.onConfirm}
              disabled={!deactivateReason.trim()}
              className="bg-destructive hover:bg-destructive/90"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}