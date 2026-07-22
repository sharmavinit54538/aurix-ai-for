import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fullName } from "../../utils";
import type { useAssetMutations } from "../../hooks/useAssetMutations";
import type { Asset } from "@/lib/hrms/types";

interface EmployeeLike {
  id?: string;
  first_name: string;
  last_name: string;
  department?: string;
  status?: string;
}

interface TransferAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset | null;
  employees: EmployeeLike[];
  mutations: ReturnType<typeof useAssetMutations>;
}

export function TransferAssetDialog({ open, onOpenChange, asset, employees, mutations }: TransferAssetDialogProps) {
  const [empId, setEmpId] = useState("");
  const [notes, setNotes] = useState("");
  const { transferMutation } = mutations;

  useEffect(() => {
    if (open) {
      setNotes("");
      setEmpId(employees.length > 0 ? fullName(employees[0]) : "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asset || !empId) return;

    const emp = employees.find((x) => fullName(x) === empId) || {
      first_name: empId,
      last_name: "",
      department: "General Operations",
    };

    transferMutation.mutate(
      {
        id: asset.id,
        payload: { employee_name: fullName(emp), department: emp.department, notes },
      },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-display font-bold">Transfer Asset: {asset?.tag}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-lg bg-indigo-500/5 border border-indigo-500/10 p-3 text-xs text-indigo-600 dark:text-indigo-400">
            Transferring asset currently assigned to: <strong>{asset?.assignedTo}</strong>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">New Employee Assignee</Label>
            <Select value={empId} onValueChange={setEmpId}>
              <SelectTrigger className="w-full bg-background/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {employees
                  .filter((emp) => emp.status?.toLowerCase() === "active" && fullName(emp) !== asset?.assignedTo)
                  .map((emp) => (
                    <SelectItem key={emp.id} value={fullName(emp)}>
                      {emp.first_name} {emp.last_name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Transfer Reason / Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
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
            <Button type="submit" className="h-9 bg-indigo-600 text-white hover:bg-indigo-750 cursor-pointer">
              Transfer Asset
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
