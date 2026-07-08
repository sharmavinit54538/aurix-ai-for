import type { Employee } from "../employeesTypes";

export type EmployeeStatusDetails = {
  text: string;
  variant: "default" | "secondary" | "destructive";
  isExpired: boolean;
};

export function getEmployeeStatusDetails(emp: Employee): EmployeeStatusDetails {
  const status = emp.status?.toUpperCase() || "INVITED";
  if ((status === "INVITED" || status === "CREATED") && emp.activationTokenExpiresAt) {
    const expires = new Date(emp.activationTokenExpiresAt);
    if (new Date() > expires) {
      return { text: "EXPIRED", variant: "destructive", isExpired: true };
    }
  }

  switch (status) {
    case "ACTIVE":
      return { text: "ACTIVE", variant: "default", isExpired: false };
    case "PENDING":
      return { text: "PENDING", variant: "secondary", isExpired: false };
    case "DISABLED":
    case "INACTIVE":
      return { text: "DISABLED", variant: "destructive", isExpired: false };
    case "INVITED":
    case "CREATED":
    default:
      return { text: "INVITED", variant: "secondary", isExpired: false };
  }
}

export function exportEmployeesCsv(employees: Employee[]) {
  const headers = ["Employee ID", "Full Name", "Email", "Phone", "Department", "Designation", "Joining Date", "Shift"];
  const rows = employees.map((e) =>
    [e.employeeId, e.fullName, e.email, e.phone, e.department, e.designation, e.joiningDate, e.shift]
      .map((v) => `"${(v ?? "").toString().replace(/"/g, '""')}"`)
      .join(","),
  );
  const csv = [headers.join(","), ...rows].join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "employees.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export function createEmptyEmployee(): Employee {
  return {
    id: "",
    employeeId: "",
    fullName: "",
    email: "",
    phone: "",
    department: "",
    designation: "",
    joiningDate: "",
    managerName: "",
    shift: "General",
  };
}
