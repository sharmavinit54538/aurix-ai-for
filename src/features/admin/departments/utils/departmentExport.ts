import type { Department } from "../types";
import { buildCSV } from "./index";
import { toast } from "sonner";

export function getDepartmentsExportData(processedDepartments: Department[]): Department[] {
  return processedDepartments;
  // Bulk export by selection disabled
  // export function getDepartmentsExportData(
  //   departments: Department[],
  //   processedDepartments: Department[],
  //   selectedIds: string[],
  // ): Department[] {
  //   return selectedIds.length > 0
  //     ? departments.filter((d) => selectedIds.includes(d.id))
  //     : processedDepartments;
}

export function exportDepartmentsCSV(data: Department[]) {
  if (data.length === 0) {
    toast.error("No departments available to export");
    return;
  }

  const csvContent = buildCSV(data);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `aurix_departments_export_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast.success("CSV Export Completed Successfully");
}

export function exportDepartmentsPDF(data: Department[]) {
  if (data.length === 0) {
    toast.error("No departments available to export");
    return;
  }

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    toast.error("Popup blocked! Enable popups to export as PDF.");
    return;
  }

  const rowsHTML = data
    .map(
      (d) => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px; font-size: 11px;">${d.department_code}</td>
        <td style="padding: 10px; font-size: 11px; font-weight: bold;">${d.name}</td>
        <td style="padding: 10px; font-size: 11px;">${d.departmentHeadName}</td>
        <td style="padding: 10px; font-size: 11px;">${d.office}</td>
        <td style="padding: 10px; font-size: 11px;">${d.currentEmployeeCount} / ${d.employeeCapacity}</td>
        <td style="padding: 10px; font-size: 11px;">$${d.budget.toLocaleString()}</td>
        <td style="padding: 10px; font-size: 11px;">${d.status.toUpperCase()}</td>
        <td style="padding: 10px; font-size: 11px;">${d.createdDate}</td>
      </tr>
    `,
    )
    .join("");

  printWindow.document.write(`
    <html>
      <head>
        <title>Departments Directory - Aurix HRMS</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 20px; color: #333; }
          h1 { font-size: 18px; margin-bottom: 5px; }
          p { font-size: 12px; margin-bottom: 20px; color: #666; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { background: #f5f5f5; text-align: left; padding: 10px; font-size: 11px; font-weight: bold; border-bottom: 2px solid #ddd; }
        </style>
      </head>
      <body>
        <h1>Departments Directory</h1>
        <p>Generated on ${new Date().toLocaleDateString()} | Total Records: ${data.length}</p>
        <table>
          <thead>
            <tr>
              <th>Code</th>
              <th>Department Name</th>
              <th>Head Manager</th>
              <th>Office Location</th>
              <th>Employees / Cap</th>
              <th>Annual Budget</th>
              <th>Status</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHTML}
          </tbody>
        </table>
        <script>
          window.onload = function() {
            window.print();
            window.close();
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
  toast.success("PDF Printing Triggered");
}
