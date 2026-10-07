import { AlertTriangle } from "lucide-react";

export function EmployeeIssuesCard({ issues }: { issues: any[] }) {
  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
      <div className="font-semibold text-amber-900 dark:text-amber-200 mb-2 flex items-center gap-1.5">
        <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
        <span>Employee Validation Findings</span>
      </div>
      <div className="space-y-1.5">
        {issues.map((iss, idx) => (
          <div key={iss.id || idx} className="text-xs text-amber-800 dark:text-amber-300">
            • {iss.message}
          </div>
        ))}
      </div>
    </div>
  );
}