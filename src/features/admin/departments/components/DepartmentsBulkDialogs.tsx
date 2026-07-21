import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Department } from "../types";
import type { useManagersList } from "../../managers/hooks/useManagersList";

interface DepartmentsBulkDialogsProps {
  bulkAssignManagerOpen: boolean;
  onBulkAssignManagerOpenChange: (open: boolean) => void;
  bulkManagerId: string;
  onBulkManagerIdChange: (id: string) => void;
  managers: ReturnType<typeof useManagersList>;
  selectedCount: number;
  onConfirmBulkAssignManager: () => void;
  bulkTransferOpen: boolean;
  onBulkTransferOpenChange: (open: boolean) => void;
  bulkTransferTargetDeptId: string;
  onBulkTransferTargetDeptIdChange: (id: string) => void;
  departments: Department[];
  selectedIds: string[];
  onConfirmBulkTransfer: () => void;
}

export function DepartmentsBulkDialogs({
  bulkAssignManagerOpen,
  onBulkAssignManagerOpenChange,
  bulkManagerId,
  onBulkManagerIdChange,
  managers,
  selectedCount,
  onConfirmBulkAssignManager,
  bulkTransferOpen,
  onBulkTransferOpenChange,
  bulkTransferTargetDeptId,
  onBulkTransferTargetDeptIdChange,
  departments,
  selectedIds,
  onConfirmBulkTransfer,
}: DepartmentsBulkDialogsProps) {
  return (
    <>
      <Dialog open={bulkAssignManagerOpen} onOpenChange={onBulkAssignManagerOpenChange}>
        <DialogContent className="rounded-2xl border-border bg-card p-6 backdrop-blur-xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bold text-lg">Assign Department Head Manager</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <Label htmlFor="bulkMgr">Select Head Manager</Label>
            <Select value={bulkManagerId} onValueChange={onBulkManagerIdChange}>
              <SelectTrigger id="bulkMgr" className="h-10 text-xs bg-background">
                <SelectValue placeholder="Select Manager" />
              </SelectTrigger>
              <SelectContent>
                {managers.map((mgr) => (
                  <SelectItem key={mgr.id} value={mgr.id}>
                    {mgr.fullName} ({mgr.designation})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground mt-2">
              This will assign the chosen manager as the head lead of all {selectedCount} selected divisions.
            </p>
          </div>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => onBulkAssignManagerOpenChange(false)}
              className="rounded-xl border-border bg-card"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirmBulkAssignManager}
              className="rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90"
            >
              Assign Manager
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={bulkTransferOpen} onOpenChange={onBulkTransferOpenChange}>
        <DialogContent className="rounded-2xl border-border bg-card p-6 backdrop-blur-xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bold text-lg">Bulk Transfer Employees</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <Label htmlFor="bulkTransferTarget">Select Target Department</Label>
            <Select value={bulkTransferTargetDeptId} onValueChange={onBulkTransferTargetDeptIdChange}>
              <SelectTrigger id="bulkTransferTarget" className="h-10 text-xs bg-background">
                <SelectValue placeholder="Select Division" />
              </SelectTrigger>
              <SelectContent>
                {departments
                  .filter((d) => !selectedIds.includes(d.id))
                  .map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name} ({d.department_code})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <p className="text-[10px] text-muted-foreground mt-2">
              This will transfer all employees from all selected departments into the chosen target department,
              leaving the source departments empty.
            </p>
          </div>
          <DialogFooter className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => onBulkTransferOpenChange(false)}
              className="rounded-xl border-border bg-card"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirmBulkTransfer}
              className="rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90"
            >
              Transfer Employees
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
