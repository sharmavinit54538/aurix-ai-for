import type { ExitCase } from "../types";
import { toast } from "sonner";

export function exportExitReportCsv(exits: ExitCase[]): void {
  const headers = [
    "Employee ID",
    "Employee Name",
    "Department",
    "Role",
    "Resignation Date",
    "Last Working Day",
    "Exit Stage",
  ];
  const rows = exits.map((e) =>
    [
      e.employeeId || "",
      e.employee,
      e.department || "",
      e.role,
      e.resignedAt,
      e.lastWorkingDay,
      e.stage,
    ]
      .map((v) => `"${v.replace(/"/g, '""')}"`)
      .join(","),
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "HR_Exit_Management_Report.csv";
  link.click();
  URL.revokeObjectURL(url);
  toast.success("Exit report exported as CSV");
}
