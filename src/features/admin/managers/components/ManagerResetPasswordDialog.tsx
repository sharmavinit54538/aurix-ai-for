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
import { Loader2 } from "lucide-react";
import type { Manager } from "../types";

interface ManagerResetPasswordDialogProps {
  open: boolean;
  manager: Manager | null;
  loading: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function ManagerResetPasswordDialog({
  open,
  manager,
  loading,
  onOpenChange,
  onConfirm,
}: ManagerResetPasswordDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl border-border bg-card p-6 backdrop-blur-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold flex items-center gap-2">
            Reset Password
          </AlertDialogTitle>
          <AlertDialogDescription className="mt-2 text-sm text-muted-foreground">
            This will reset the password for <span className="font-semibold text-foreground">{manager?.fullName}</span>
            {manager?.email && ` (${manager.email})`}.
            A password reset link will be sent to their registered email address.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 flex justify-end gap-2">
          <AlertDialogCancel className="rounded-xl border-border bg-card hover:bg-muted">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl border-none bg-amber-500 text-white shadow-glow hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}