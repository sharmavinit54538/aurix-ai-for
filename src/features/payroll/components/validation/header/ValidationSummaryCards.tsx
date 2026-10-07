import { StatCard } from "@/components/hrms/Shared";
import { XCircle, Users, Layers, ShieldAlert, ShieldCheck } from "lucide-react";

interface ValidationSummaryCardsProps {
  validationData: any | null;
  statusBadge: { label: string; className: string };
}

export function ValidationSummaryCards({
  validationData,
  statusBadge,
}: ValidationSummaryCardsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard
        label="Total Findings"
        value={validationData?.totalIssues ?? 0}
        hint="Detected validation issues"
        icon={Layers}
        accent="brand"
      />
      <StatCard
        label="Errors / Critical"
        value={validationData?.errorsCount ?? 0}
        hint="Requires remediation"
        icon={XCircle}
        accent="danger"
      />
      <StatCard
        label="Advisory Warnings"
        value={validationData?.warningsCount ?? 0}
        hint="Non-blocking recommendations"
        icon={ShieldAlert}
        accent="warning"
      />
      <StatCard
        label="Employees Affected"
        value={validationData?.affectedEmployeesCount ?? 0}
        hint="Individuals requiring review"
        icon={Users}
        accent="muted"
      />
      <StatCard
        label="Validation Status"
        value={statusBadge?.label ?? "—"}
        hint={
          validationData && validationData.errorsCount > 0
            ? "Remediation required"
            : "Validation cycle completed"
        }
        icon={ShieldCheck}
        accent={validationData && validationData.errorsCount > 0 ? "danger" : "success"}
      />
    </div>
  );
}