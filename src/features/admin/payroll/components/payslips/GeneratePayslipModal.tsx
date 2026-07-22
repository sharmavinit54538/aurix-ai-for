import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Sparkles, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";

interface GeneratePayslipModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isBulk?: boolean;
  onGenerate: (data: { month: number; year: number; department?: string }) => Promise<void>;
}

export const GeneratePayslipModal: React.FC<GeneratePayslipModalProps> = ({
  open,
  onOpenChange,
  isBulk = false,
  onGenerate,
}) => {
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [department, setDepartment] = useState<string>("all");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<"idle" | "running" | "success" | "error">("idle");
  const [resultMessage, setResultMessage] = useState<string | null>(null);

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setStatus("running");
    setProgress(15);

    try {
      const timer1 = setTimeout(() => setProgress(50), 300);
      const timer2 = setTimeout(() => setProgress(85), 600);

      await onGenerate({
        month,
        year,
        department: department === "all" ? undefined : department,
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      setProgress(100);
      setStatus("success");
      setResultMessage(`Successfully generated ${isBulk ? "bulk" : ""} payslip calculation records.`);

      setTimeout(() => {
        setIsProcessing(false);
        setStatus("idle");
        setProgress(0);
        onOpenChange(false);
      }, 1200);
    } catch (err: any) {
      setStatus("error");
      setIsProcessing(false);
      setResultMessage(err?.message || "Failed to generate payslips. Please check server logs.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            <Sparkles className="h-4 w-4 text-brand" />
            {isBulk ? "Bulk Generate Employee Payslips" : "Generate Payslip Cycle"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2 text-xs">
          <div className="space-y-1.5">
            <Label className="text-xs">Payroll Month</Label>
            <Select value={String(month)} onValueChange={(val) => setMonth(Number(val))}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {months.map((m) => (
                  <SelectItem key={m.value} value={String(m.value)}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Payroll Year</Label>
            <Select value={String(year)} onValueChange={(val) => setYear(Number(val))}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
                <SelectItem value="2027">2027</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Target Department</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments (Entire Company)</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Product">Product</SelectItem>
                <SelectItem value="Human Resources">Human Resources</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Progress / Status feedback */}
          {status !== "idle" && (
            <div className="space-y-2 pt-2 border-t border-border/40">
              <div className="flex justify-between items-center text-[11px] font-medium">
                <span>Generating payslips...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />

              {status === "success" && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-1">
                  <CheckCircle2 className="h-4 w-4" /> {resultMessage}
                </div>
              )}

              {status === "error" && (
                <div className="flex items-center gap-1.5 text-xs text-rose-500 font-medium pt-1">
                  <AlertTriangle className="h-4 w-4" /> {resultMessage}
                </div>
              )}
            </div>
          )}

          <DialogFooter className="pt-3 border-t border-border/40 gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isProcessing}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isProcessing}
              className="gap-2 bg-brand text-brand-foreground hover:bg-brand/90"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" /> Start Generation
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
