import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Asset } from "../../types";

interface TransferAssetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  targetAsset: Asset | null;
  transferEmpId: string;
  setTransferEmpId: (id: string) => void;
  transferNotes: string;
  setTransferNotes: (notes: string) => void;
  employees: { id: string; fullName: string; employeeId?: string }[];
}

export function TransferAssetModal({
  open,
  onOpenChange,
  onSubmit,
  targetAsset,
  transferEmpId,
  setTransferEmpId,
  transferNotes,
  setTransferNotes,
  employees,
}: TransferAssetModalProps) {
  const assignedId = (targetAsset as any)?.assignedToId || (targetAsset as any)?.employeeId || (targetAsset as any)?.employee_id;
  const eligibleEmployees = employees.filter(emp =>
    assignedId
      ? emp.id !== assignedId && emp.employeeId !== assignedId
      : emp.fullName !== targetAsset?.assignedTo
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-display font-bold">
            Transfer Asset: {targetAsset?.tag}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="rounded-lg bg-muted border border-border p-3 text-xs text-muted-foreground">
            Transferring asset currently assigned to: <strong>{targetAsset?.assignedTo}</strong>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">New Employee Assignee</Label>
            <Select value={transferEmpId} onValueChange={setTransferEmpId}>
              <SelectTrigger className="w-full bg-background/50 border-border">
                <SelectValue placeholder="Select an employee..." />
              </SelectTrigger>
              <SelectContent>
                {eligibleEmployees.map(emp => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.fullName} ({emp.employeeId || emp.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Transfer Reason / Notes</Label>
            <Textarea
              value={transferNotes}
              onChange={e => setTransferNotes(e.target.value)}
              placeholder="State justification or ticket reference..."
              className="min-h-[70px] bg-background/50 border-border text-xs"
            />
          </div>

          <DialogFooter className="pt-2 border-t border-border">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer"
            >
              Cancel
            </Button>
            <Button type="submit" className="h-9 cursor-pointer">
              Transfer Asset
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
