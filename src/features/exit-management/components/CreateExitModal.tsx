import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateExitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empName: string;
  setEmpName: (name: string) => void;
  employees: Array<{ id: string; fullName: string; employeeId: string }>;
  resignDate: string;
  setResignDate: (date: string) => void;
  noticeDays: number;
  setNoticeDays: (days: number) => void;
  resignReason: string;
  setResignReason: (reason: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function CreateExitModal({
  open,
  onOpenChange,
  empName,
  setEmpName,
  employees,
  resignDate,
  setResignDate,
  noticeDays,
  setNoticeDays,
  resignReason,
  setResignReason,
  onSubmit,
}: CreateExitModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background border-border shadow-2xl">
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-lg">
            Submit Resignation Request
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">Select Employee</Label>
            <Select value={empName} onValueChange={setEmpName}>
              <SelectTrigger className="w-full bg-background/50 border-border text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.fullName}>
                    {emp.fullName} ({emp.employeeId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Resignation Date
              </Label>
              <Input
                type="date"
                value={resignDate}
                onChange={(e) => setResignDate(e.target.value)}
                className="bg-background/50 border-border text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground">
                Notice Period (Days)
              </Label>
              <Input
                type="number"
                value={noticeDays}
                onChange={(e) => setNoticeDays(parseInt(e.target.value) || 30)}
                className="bg-background/50 border-border text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground">
              Reason for Leaving
            </Label>
            <Textarea
              value={resignReason}
              onChange={(e) => setResignReason(e.target.value)}
              placeholder="State resignation reasons..."
              className="min-h-[100px] bg-background/50 border-border text-xs"
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
            <Button
              type="submit"
              className="h-9 bg-primary text-brand-foreground hover:opacity-90 cursor-pointer"
            >
              Create Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
