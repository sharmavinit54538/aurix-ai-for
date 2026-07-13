import { toast } from "sonner";
import type { Manager } from "../types";
import { buildCSV } from "./index";

export function getManagersExportData(
  managers: Manager[],
  processedManagers: Manager[],
  selectedIds: string[],
): Manager[] {
  return selectedIds.length > 0
    ? managers.filter((m) => selectedIds.includes(m.id))
    : processedManagers;
}

export function exportManagersCSV(data: Manager[]) {
  if (data.length === 0) {
    toast.error("No managers available to export");
    return;
  }

  const csvContent = buildCSV(data);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `aurix_managers_export_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  toast.success("CSV Export Completed Successfully");
}

export function exportManagersExcel(data: Manager[]) {
  exportManagersCSV(data);
}

export function exportManagersPDF(data: Manager[]) {
  if (data.length === 0) {
    toast.error("No managers available to export");
    return;
  }

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    toast.error("Popup blocked! Enable popups to export as PDF.");
    return;
  }

  const rowsHTML = data
    .map(
      (m) => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px; font-size: 11px;">${m.employeeId}</td>
        <td style="padding: 10px; font-size: 11px; font-weight: bold;">${m.fullName}</td>
        <td style="padding: 10px; font-size: 11px;">${m.email}</td>
        <td style="padding: 10px; font-size: 11px;">${m.department}</td>
        <td style="padding: 10px; font-size: 11px;">${m.designation}</td>
        <td style="padding: 10px; font-size: 11px;">${m.office}</td>
        <td style="padding: 10px; font-size: 11px;">${m.status.toUpperCase()}</td>
        <td style="padding: 10px; font-size: 11px;">${m.joiningDate}</td>
      </tr>
    `,
    )
    .join("");

  printWindow.document.write(`
    <html>
      <head>
        <title>Managers Directory - Aurix HRMS</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 20px; color: #333; }
          h1 { font-size: 18px; margin-bottom: 5px; }
          p { font-size: 12px; margin-bottom: 20px; color: #666; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { background: #f5f5f5; text-align: left; padding: 10px; font-size: 11px; font-weight: bold; border-bottom: 2px solid #ddd; }
        </style>
      </head>
      <body>
        <h1>Managers Directory</h1>
        <p>Generated on ${new Date().toLocaleDateString()} • Total Records: ${data.length}</p>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Office</th>
              <th>Status</th>
              <th>Joining Date</th>
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
  toast.success("PDF Generation Triggered");
}
