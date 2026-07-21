import type { ReactNode } from "react";
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
import { cn } from "@/lib/utils";

export interface ConfirmAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  cancelLabel?: string;
  destructive?: boolean;
}

export function ConfirmAlertDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  onConfirm,
  cancelLabel = "Cancel",
  destructive = true,
}: ConfirmAlertDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-2xl border-border bg-card p-6 backdrop-blur-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-bold">{title}</AlertDialogTitle>
          <AlertDialogDescription className="mt-2 text-sm text-muted-foreground">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 flex justify-end gap-2">
          <AlertDialogCancel className="rounded-xl border-border bg-card hover:bg-muted">
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={cn(
              "rounded-xl border-none shadow-glow",
              destructive
                ? "bg-rose-500 text-white hover:bg-rose-600"
                : "bg-brand text-brand-foreground hover:bg-brand/90",
            )}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
