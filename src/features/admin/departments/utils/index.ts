import type { Department, DepartmentFilters, SortField, SortDir } from "../types";

// â”€â”€â”€ Validators â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateDepartmentForm(
  draft: Partial<Department>,
  existingDepartments: Department[],
  isEdit: boolean
): ValidationResult {
  const errors: Record<string, string> = {};

  if (!draft.name?.trim()) errors.name = "Department name is required";

  if (!draft.departmentHeadId) {
    errors.departmentHeadId = "Department head is required";
  }

  if (!draft.office?.trim()) errors.office = "Office location is required";

  if (draft.budget !== undefined && draft.budget < 0) {
    errors.budget = "Budget must be a positive number";
  }

  if (draft.employeeCapacity !== undefined && draft.employeeCapacity < 0) {
    errors.employeeCapacity = "Employee capacity cannot be negative";
  }

  // Duplicate checks
  if (draft.name) {
    const dup = existingDepartments.find(
      (d) => d.name.toLowerCase() === draft.name!.toLowerCase() && (!isEdit || d.id !== draft.id)
    );
    if (dup) errors.name = "Department name already exists";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

// â”€â”€â”€ Filtering & Sorting â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function applyFilters(
  departments: Department[],
  query: string,
  filters: DepartmentFilters
): Department[] {
  const q = query.toLowerCase().trim();

  return departments.filter((d) => {
    // Search
    if (q) {
      const match =
        d.name.toLowerCase().includes(q) ||
        d.departmentHeadName.toLowerCase().includes(q) ||
        d.reportingManagerName.toLowerCase().includes(q) ||
        d.office.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Status filter
    if (filters.status !== "all" && d.status !== filters.status) return false;

    // Office filter
    if (filters.office !== "all" && d.office !== filters.office) return false;

    // Manager / Dept Head filter
    if (filters.managerId !== "all" && d.departmentHeadId !== filters.managerId) return false;

    // Employee Count Range
    if (filters.employeeCountRange !== "all") {
      const ec = d.currentEmployeeCount;
      if (filters.employeeCountRange === "0-10" && !(ec >= 0 && ec <= 10)) return false;
      if (filters.employeeCountRange === "11-30" && !(ec >= 11 && ec <= 30)) return false;
      if (filters.employeeCountRange === "31-50" && !(ec >= 31 && ec <= 50)) return false;
      if (filters.employeeCountRange === "50+" && ec <= 50) return false;
    }

    // Created Date Range
    if (filters.createdDateFrom && d.createdDate < filters.createdDateFrom) return false;
    if (filters.createdDateTo && d.createdDate > filters.createdDateTo) return false;

    return true;
  });
}

export function applySorting(
  departments: Department[],
  field: SortField,
  dir: SortDir
): Department[] {
  return [...departments].sort((a, b) => {
    let va: string | number;
    let vb: string | number;

    switch (field) {
      case "name": va = a.name; vb = b.name; break;
      case "departmentHeadName": va = a.departmentHeadName; vb = b.departmentHeadName; break;
      case "currentEmployeeCount": va = a.currentEmployeeCount; vb = b.currentEmployeeCount; break;
      case "openPositions": va = a.openPositions; vb = b.openPositions; break;
      case "budget": va = a.budget; vb = b.budget; break;
      case "createdDate": va = a.createdDate; vb = b.createdDate; break;
      case "status": va = a.status; vb = b.status; break;
      default: va = a.name; vb = b.name;
    }

    if (typeof va === "number" && typeof vb === "number") {
      return dir === "asc" ? va - vb : vb - va;
    }
    const cmp = String(va).localeCompare(String(vb));
    return dir === "asc" ? cmp : -cmp;
  });
}

// â”€â”€â”€ Pagination â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function paginate<T>(items: T[], page: number, perPage: number): T[] {
  return items.slice((page - 1) * perPage, page * perPage);
}

// â”€â”€â”€ CSV Builder â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function buildCSV(departments: Department[]): string {
  const headers = [
    "Department Name", "Code", "Department Head", "Reporting To",
    "Office Location", "Budget", "Cost Center", "Capacity",
    "Employee Count", "Open Positions", "Status", "Created Date",
  ];
  const rows = departments.map((d) =>
    [
      d.name, d.department_code, d.departmentHeadName, d.reportingManagerName,
      d.office, d.budget, d.cost_center, d.employeeCapacity,
      d.currentEmployeeCount, d.openPositions, d.status, d.createdDate,
    ]
      .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
      .join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

// â”€â”€â”€ Formatted Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export function fmtBudget(num: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(num);
}

export function fmtDate(iso: string): string {
  if (!iso) return "â€”";
  const [y, m, d] = iso.split("T")[0].split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
}
