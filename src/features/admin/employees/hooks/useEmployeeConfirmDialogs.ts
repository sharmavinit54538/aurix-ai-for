import { useCallback } from "react";
import { toast } from "sonner";
import { getRejectMessage } from "@/api/utils";
import { useAppDispatch } from "@/redux/hooks";
import { useConfirmDialog } from "@/hooks/useConfirmDialog";
import { deactivateEmployee, deleteEmployee } from "../employeesThunk";
import type { Employee } from "../employeesTypes";

interface UseEmployeeConfirmDialogsOptions {
  employees: Employee[];
  onChanged?: () => void;
}

export interface EmployeeConfirmDialogState {
  open: boolean;
  employee: Employee | null;
  onOpenChange: (open: boolean) => void;
  onRequest: (id: string) => void;
  onConfirm: () => Promise<void>;
}

export function useEmployeeConfirmDialogs({ employees, onChanged }: UseEmployeeConfirmDialogsOptions) {
  const dispatch = useAppDispatch();
  const {
    open: deleteOpen,
    item: employeeToDelete,
    openWith: openDeleteWith,
    handleOpenChange: onDeleteOpenChange,
    close: closeDelete,
  } = useConfirmDialog<Employee>();
  const {
    open: deactivateOpen,
    item: employeeToDeactivate,
    openWith: openDeactivateWith,
    handleOpenChange: onDeactivateOpenChange,
    close: closeDeactivate,
  } = useConfirmDialog<Employee>();

  const requestRemove = useCallback(
    (id: string) => {
      const employee = employees.find((e) => e.id === id);
      if (employee) openDeleteWith(employee);
    },
    [employees, openDeleteWith],
  );

  const confirmRemove = useCallback(async () => {
    if (!employeeToDelete) return;

    const result = await dispatch(deleteEmployee(employeeToDelete.id));
    if (deleteEmployee.fulfilled.match(result)) {
      toast.success("Employee removed successfully");
      closeDelete();
      onChanged?.();
    } else {
      toast.error(getRejectMessage(result.payload, "Failed to remove employee"));
    }
  }, [closeDelete, dispatch, employeeToDelete, onChanged]);

  const requestDeactivate = useCallback(
    (id: string) => {
      const employee = employees.find((e) => e.id === id);
      if (employee) openDeactivateWith(employee);
    },
    [employees, openDeactivateWith],
  );

  const confirmDeactivate = useCallback(async () => {
    if (!employeeToDeactivate) return;

    const result = await dispatch(deactivateEmployee(employeeToDeactivate.id));
    if (deactivateEmployee.fulfilled.match(result)) {
      toast.success("Employee account deactivated successfully");
      closeDeactivate();
      onChanged?.();
    } else {
      toast.error(getRejectMessage(result.payload, "Failed to deactivate employee"));
    }
  }, [closeDeactivate, dispatch, employeeToDeactivate, onChanged]);

  const deleteConfirm: EmployeeConfirmDialogState = {
    open: deleteOpen,
    employee: employeeToDelete,
    onOpenChange: onDeleteOpenChange,
    onRequest: requestRemove,
    onConfirm: confirmRemove,
  };

  const deactivateConfirm: EmployeeConfirmDialogState = {
    open: deactivateOpen,
    employee: employeeToDeactivate,
    onOpenChange: onDeactivateOpenChange,
    onRequest: requestDeactivate,
    onConfirm: confirmDeactivate,
  };

  return { deleteConfirm, deactivateConfirm };
}
