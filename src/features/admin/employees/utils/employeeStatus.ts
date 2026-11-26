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
  const headers = [
    "Employee Code",
    "Full Name",
    "Official Email",
    "Personal Email",
    "Phone",
    "Gender",
    "DOB",
    "Department",
    "Designation",
    "Reporting Manager",
    "Joining Date",
    "Employment Type",
    "Work Mode",
    "Shift",
    "Office Location",
    "CTC",
    "Role",
  ];
  const rows = employees.map((e) =>
    [
      e.employeeId,
      e.fullName,
      e.companyEmail || e.email,
      e.personalEmail || "",
      e.phone,
      e.gender || "",
      e.dateOfBirth || "",
      e.department,
      e.designation,
      e.managerName || e.reportingManagerName || "",
      e.joiningDate,
      e.employmentType || "",
      e.workMode || "",
      e.shift || "",
      e.officeLocation || e.workLocation || "",
      e.ctc || e.salary || "",
      e.role || "employee",
    ]
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
  const today = new Date().toISOString().split("T")[0];
  return {
    id: "",
    employeeId: "",
    firstName: "",
    lastName: "",
    fullName: "",
    email: "",
    companyEmail: "",
    personalEmail: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    department: "",
    designation: "",
    managerName: "",
    reportingManagerName: "",
    joiningDate: today,
    employmentType: "FULL_TIME",
    workMode: "OFFICE",
    workLocation: "",
    probationPeriodMonths: 3,
    shift: "General Shift (09:30 - 18:30)",
    officeLocation: "",
    ctc: undefined,
    salary: undefined,
    role: "employee",
    sendOnboardingInvite: true,
    status: "INVITED",
  };
}