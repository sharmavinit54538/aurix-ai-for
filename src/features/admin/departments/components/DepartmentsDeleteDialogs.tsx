import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { Department } from "../types";

interface DepartmentsDeleteDialogsProps {
  deleteAlertOpen: boolean;
  onDeleteAlertOpenChange: (open: boolean) => void;
  deptToDelete: Department | null;
  onConfirmDelete: () => void;
  cannotDeleteAlertOpen: boolean;
  onCannotDeleteAlertOpenChange: (open: boolean) => void;
  // bulkDeleteAlertOpen: boolean;
  // onBulkDeleteAlertOpenChange: (open: boolean) => void;
  // selectedCount: number;
  // onConfirmBulkDelete: () => void;
  // cannotBulkDeleteAlertOpen: boolean;
  // onCannotBulkDeleteAlertOpenChange: (open: boolean) => void;
}

export function DepartmentsDeleteDialogs({
  deleteAlertOpen,
  onDeleteAlertOpenChange,
  deptToDelete,
  onConfirmDelete,
  cannotDeleteAlertOpen,
  onCannotDeleteAlertOpenChange,
  // bulkDeleteAlertOpen,
  // onBulkDeleteAlertOpenChange,
  // selectedCount,
  // onConfirmBulkDelete,
  // cannotBulkDeleteAlertOpen,
  // onCannotBulkDeleteAlertOpenChange,
}: DepartmentsDeleteDialogsProps) {
  return (
    <>
      <AlertDialog open={deleteAlertOpen} onOpenChange={onDeleteAlertOpenChange}>
        <AlertDialogContent className="rounded-2xl border-border bg-card p-6 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-lg">
              Are you sure you want to delete this department?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
              This action is permanent and cannot be undone. This will delete the{" "}
              <span className="font-semibold text-foreground">{deptToDelete?.name}</span> division from
              organizational schemas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex gap-2 justify-end">
            <AlertDialogCancel className="rounded-xl border-border bg-card hover:bg-muted">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmDelete}
              className="rounded-xl bg-rose-500 text-white hover:bg-rose-600 shadow-glow border-none"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={cannotDeleteAlertOpen} onOpenChange={onCannotDeleteAlertOpenChange}>
        <AlertDialogContent className="rounded-2xl border-border bg-card p-6 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-lg text-rose-500">
              Cannot Delete Department
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
              This department contains employees. Please transfer them before deleting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex gap-2 justify-end">
            <Button
              onClick={() => onCannotDeleteAlertOpenChange(false)}
              className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 shadow-glow border-none"
            >
              Acknowledge
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk delete dialogs disabled */}
      {/* <AlertDialog open={bulkDeleteAlertOpen} onOpenChange={onBulkDeleteAlertOpenChange}>
        <AlertDialogContent className="rounded-2xl border-border bg-card p-6 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-lg">Confirm Bulk Delete Departments</AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
              Are you sure you want to delete the{" "}
              <span className="font-semibold text-foreground">{selectedCount}</span> selected departments?
              This action is irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex gap-2 justify-end">
            <AlertDialogCancel className="rounded-xl border-border bg-card hover:bg-muted">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmBulkDelete}
              className="rounded-xl bg-rose-500 text-white hover:bg-rose-600 shadow-glow border-none"
            >
              Delete Selected
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={cannotBulkDeleteAlertOpen} onOpenChange={onCannotBulkDeleteAlertOpenChange}>
        <AlertDialogContent className="rounded-2xl border-border bg-card p-6 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-bold text-lg text-rose-500">
              Cannot Complete Bulk Delete
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground mt-2">
              One or more selected departments contain active employees. Please transfer all employees before
              attempting deletion.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex gap-2 justify-end">
            <Button
              onClick={() => onCannotBulkDeleteAlertOpenChange(false)}
              className="rounded-xl bg-brand text-brand-foreground hover:bg-brand/90 shadow-glow border-none"
            >
              Acknowledge
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </>
  );
}
