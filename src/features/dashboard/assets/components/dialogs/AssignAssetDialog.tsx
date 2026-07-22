import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { fullName } from "../../utils";
import type { useAssetMutations } from "../../hooks/useAssetsMutations";
import type { Asset } from "@/lib/hrms/types";

interface EmployeeLike {
  id?: string;
  first_name: string;
  last_name: string;
  department?: string;
  status?: string;
}

interface AssignAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset: Asset | null;
  employees: EmployeeLike[];
  employeesLoading: boolean;
  mutations: ReturnType<typeof useAssetMutations>;
  /** Called with the updated asset right after a successful assignment — used to auto-open the QR sticker. */
  onAssigned?: (asset: Asset) => void;
}

export function AssignAssetDialog({
  open,
  onOpenChange,
  asset,
  employees,
  employeesLoading,
  mutations,
  onAssigned,
}: AssignAssetDialogProps) {
  const [empId, setEmpId] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [notes, setNotes] = useState("");
  const { assignMutation } = mutations;

  useEffect(() => {
    if (open) {
      setNotes("");
      setReturnDate("");
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

    assignMutation.mutate(
      {
        id: asset.id,
        payload: {
          employee_name: fullName(emp),
          department: emp.department,
          expected_return_date: returnDate || null,
          notes,
        },
      },
      {
        onSuccess: (res: any) => {
          onOpenChange(false);
          onAssigned?.(res?.data ?? asset);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-display font-bold">Assign Asset: {asset?.tag}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Employee Assignee</Label>
            <Select value={empId} onValueChange={setEmpId}>
              <SelectTrigger className="w-full bg-background/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {employeesLoading ? (
                  <SelectItem value="loading" disabled>
                    Loading employees...
                  </SelectItem>
                ) : (
                  employees
                    .filter((emp) => emp.status?.toLowerCase() === "active")
                    .map((emp) => (
                      <SelectItem key={emp.id} value={fullName(emp)}>
                        {emp.first_name} {emp.last_name}
                      </SelectItem>
                    ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Expected Return Date (Optional)</Label>
            <Input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="bg-background/50 border-border text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Assignment Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="State check-in parameters, initial hardware checklist checks..."
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
              Assign Asset
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
