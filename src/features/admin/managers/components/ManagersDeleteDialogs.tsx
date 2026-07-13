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
import type { Manager } from "../types";

interface ManagersDeleteDialogsProps {
  deleteOpen: boolean;
  managerToDelete: Manager | null;
  bulkDeleteOpen: boolean;
  selectedCount: number;
  onDeleteOpenChange: (open: boolean) => void;
  onBulkDeleteOpenChange: (open: boolean) => void;
  onConfirmDelete: () => void;
  onConfirmBulkDelete: () => void;
}

export function ManagersDeleteDialogs({
  deleteOpen,
  managerToDelete,
  bulkDeleteOpen,
  selectedCount,
  onDeleteOpenChange,
  onBulkDeleteOpenChange,
  onConfirmDelete,
  onConfirmBulkDelete,
}: ManagersDeleteDialogsProps) {
  return (
    <>
      <AlertDialog open={deleteOpen} onOpenChange={onDeleteOpenChange}>
        <AlertDialogContent className="rounded-2xl border-border bg-card p-6 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold">
              Are you sure you want to delete this manager?
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-sm text-muted-foreground">
              This action cannot be undone. This will permanently remove{" "}
              <span className="font-semibold text-foreground">{managerToDelete?.fullName}</span> and all
              associated attendance metadata from the database store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex justify-end gap-2">
            <AlertDialogCancel className="rounded-xl border-border bg-card hover:bg-muted">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmDelete}
              className="rounded-xl border-none bg-rose-500 text-white shadow-glow hover:bg-rose-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={bulkDeleteOpen} onOpenChange={onBulkDeleteOpenChange}>
        <AlertDialogContent className="rounded-2xl border-border bg-card p-6 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold">
              Are you sure you want to delete these managers?
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-sm text-muted-foreground">
              This will permanently delete the{" "}
              <span className="font-semibold text-foreground">{selectedCount}</span> selected managers from the
              system directory. This action is irreversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex justify-end gap-2">
            <AlertDialogCancel className="rounded-xl border-border bg-card hover:bg-muted">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirmBulkDelete}
              className="rounded-xl border-none bg-rose-500 text-white shadow-glow hover:bg-rose-600"
            >
              Delete Selected
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
