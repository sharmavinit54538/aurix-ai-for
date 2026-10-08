import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Asset } from "../../types";

interface AssignAssetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  targetAsset: Asset | null;
  assignEmpId: string;
  setAssignEmpId: (id: string) => void;
  assignReturnDate: string;
  setAssignReturnDate: (date: string) => void;
  assignNotes: string;
  setAssignNotes: (notes: string) => void;
  employees: { id: string; fullName: string; employeeId?: string }[];
}

export function AssignAssetModal({
  open,
  onOpenChange,
  onSubmit,
  targetAsset,
  assignEmpId,
  setAssignEmpId,
  assignReturnDate,
  setAssignReturnDate,
  assignNotes,
  setAssignNotes,
  employees,
}: AssignAssetModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-display font-bold">
            Assign Asset: {targetAsset?.tag}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Employee Assignee</Label>
            <Select value={assignEmpId} onValueChange={setAssignEmpId}>
              <SelectTrigger className="w-full bg-background/50 border-border">
                <SelectValue placeholder="Select an employee..." />
              </SelectTrigger>
              <SelectContent>
                {employees.map(emp => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.fullName} ({emp.employeeId || emp.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Expected Return Date (Optional)</Label>
            <Input
              type="date"
              value={assignReturnDate}
              onChange={e => setAssignReturnDate(e.target.value)}
              className="bg-background/50 border-border text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Assignment Notes</Label>
            <Textarea
              value={assignNotes}
              onChange={e => setAssignNotes(e.target.value)}
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
            <Button type="submit" className="h-9 cursor-pointer">
              Assign Asset
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
