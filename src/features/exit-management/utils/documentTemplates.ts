import type { ExitCase } from "../types";

export function getExitDocumentPreviewText(exit: ExitCase, docName: string): string {
  let text = `OFC360
To whom it may concern,

This is to certify that ${exit.employee} (Employee ID: ${exit.employeeId || "—"})
was employed with OFC360 from ${exit.joiningDate || "—"} to ${exit.lastWorkingDay || "—"}.
During their tenure, they held the designation of ${exit.designation || exit.role || "Employee"} under ${exit.department || "General"} department.

We verify that all clearances have been successfully compiled.

Sincerely,
People Operations
Corporate HR`;

  if (docName.includes("Settlement")) {
    text = `OFC360 — FINAL SETTLEMENT SHEET
Employee: ${exit.employee}
Designation: ${exit.designation}

Pending Salary: $${exit.settlementDetails?.pendingSalary || 0}
Leave Encashment: $${exit.settlementDetails?.leaveEncashment || 0}
Bonus & Incentives: $${(exit.settlementDetails?.bonus || 0) + (exit.settlementDetails?.incentives || 0)}
Deductions: -$${(exit.settlementDetails?.deductions || 0) + (exit.settlementDetails?.assetRecovery || 0)}

Final Settlement Wire Payout: $${exit.settlementDetails?.totalAmount || 0}
Status: ${exit.settlementDetails?.status || "Pending"}

Signed,
Finance Operations Partner`;
  }

  return text;
}
