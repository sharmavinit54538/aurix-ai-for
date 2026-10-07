import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";

export function ProvisionalPayrollNotice() {
  return (
    <Alert className="border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200">
      <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5" />
      <div className="ml-2">
        <AlertTitle className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200">
          Provisional Payroll Results
        </AlertTitle>
        <AlertDescription className="mt-1 text-xs leading-relaxed text-amber-800 dark:text-amber-300">
          These payroll results are for <strong>review and audit purposes only</strong> and have not been finalized.
          {" "}<strong>Payroll is not finalized, final payslips have not been generated, and employee payment has not been initiated.</strong>
        </AlertDescription>
      </div>
    </Alert>
  );
}