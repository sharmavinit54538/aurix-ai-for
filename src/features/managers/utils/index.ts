import type { Manager, ManagerFilters, SortDir, SortField } from "../types";

// ─── Validators ───────────────────────────────────────────────────────────────
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string): boolean {
  return phone.trim().length >= 7;
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateManagerForm(
  draft: Partial<Manager>,
  existingManagers: Manager[],
  isEdit: boolean,
): ValidationResult {
  const errors: Record<string, string> = {};

  if (!draft.firstName?.trim()) errors.firstName = "First name is required";
  if (!draft.lastName?.trim()) errors.lastName = "Last name is required";
  if (!draft.employeeId?.trim()) errors.employeeId = "Employee ID is required";
  if (!draft.email?.trim()) errors.email = "Email is required";
  else if (!validateEmail(draft.email)) errors.email = "Invalid email address";
  if (!draft.phone?.trim()) errors.phone = "Phone is required";
  else if (!validatePhone(draft.phone)) errors.phone = "Invalid phone number";
  if (!draft.department?.trim()) errors.department = "Department is required";
  if (!draft.designation?.trim()) errors.designation = "Designation is required";

  // Duplicate checks
  if (draft.employeeId) {
    const dup = existingManagers.find(
      (m) => m.employeeId === draft.employeeId && (!isEdit || m.id !== draft.id),
    );
    if (dup) errors.employeeId = "Employee ID already exists";
  }
  if (draft.email) {
    const dup = existingManagers.find(
      (m) => m.email.toLowerCase() === draft.email!.toLowerCase() && (!isEdit || m.id !== draft.id),
    );
    if (dup) errors.email = "Email already registered";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

// ─── Filtering & Sorting ──────────────────────────────────────────────────────
export function applyFilters(
  managers: Manager[],
  query: string,
  filters: ManagerFilters,
): Manager[] {
  const q = query.toLowerCase().trim();

  return managers.filter((m) => {
    // Search
    if (q) {
      const match =
        m.fullName.toLowerCase().includes(q) ||
        m.employeeId.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q) ||
        m.department.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Department filter
    if (filters.department !== "all" && m.department !== filters.department) return false;

    // Status filter
    if (filters.status !== "all" && m.status !== filters.status) return false;

    // Employment type filter
    if (filters.employmentType !== "all" && m.employmentType !== filters.employmentType) return false;

    // Office filter
    if (filters.office !== "all" && m.office !== filters.office) return false;

    // Team size filter
    if (filters.teamSize !== "all") {
      const ts = m.teamSize;
      if (filters.teamSize === "1-5" && !(ts >= 1 && ts <= 5)) return false;
      if (filters.teamSize === "6-10" && !(ts >= 6 && ts <= 10)) return false;
      if (filters.teamSize === "11-20" && !(ts >= 11 && ts <= 20)) return false;
      if (filters.teamSize === "20+" && ts <= 20) return false;
    }

    // Joining date range
    if (filters.joiningFrom && m.joiningDate < filters.joiningFrom) return false;
    if (filters.joiningTo && m.joiningDate > filters.joiningTo) return false;

    return true;
  });
}

export function applySorting(
  managers: Manager[],
  field: SortField,
  dir: SortDir,
): Manager[] {
  return [...managers].sort((a, b) => {
    let va: string | number;
    let vb: string | number;

    switch (field) {
      case "fullName": va = a.fullName; vb = b.fullName; break;
      case "department": va = a.department; vb = b.department; break;
      case "teamSize": va = a.teamSize; vb = b.teamSize; break;
      case "joiningDate": va = a.joiningDate; vb = b.joiningDate; break;
      case "lastActive": va = a.lastActive; vb = b.lastActive; break;
      case "status": va = a.status; vb = b.status; break;
      default: va = a.fullName; vb = b.fullName;
    }

    if (typeof va === "number" && typeof vb === "number") {
      return dir === "asc" ? va - vb : vb - va;
    }
    const cmp = String(va).localeCompare(String(vb));
    return dir === "asc" ? cmp : -cmp;
  });
}

// ─── Pagination ───────────────────────────────────────────────────────────────
export function paginate<T>(items: T[], page: number, perPage: number): T[] {
  return items.slice((page - 1) * perPage, page * perPage);
}

// ─── CSV Builder ──────────────────────────────────────────────────────────────
export function buildCSV(managers: Manager[]): string {
  const headers = [
    "Employee ID", "Full Name", "Email", "Phone",
    "Department", "Designation", "Role", "Status",
    "Employment Type", "Office", "Work Location",
    "Team Size", "Joining Date", "Last Active",
  ];
  const rows = managers.map((m) =>
    [
      m.employeeId, m.fullName, m.email, m.phone,
      m.department, m.designation, m.managerRole, m.status,
      m.employmentType, m.office, m.workLocation,
      m.teamSize, m.joiningDate, m.lastActive,
    ]
      .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
      .join(","),
  );
  return [headers.join(","), ...rows].join("\n");
}

// ─── Avatar colour ────────────────────────────────────────────────────────────
export function avatarHue(name: string): number {
  return Array.from(name).reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
}

// ─── Label helpers ────────────────────────────────────────────────────────────
export function labelFor(value: string, options: { value: string; label: string }[]): string {
  return options.find((o) => o.value === value)?.label ?? value;
}

export function fmtDate(iso: string): string {
  if (!iso) return "—";
  const [y, m, d] = iso.split("T")[0].split("-");
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
}

export function fmtRelative(iso: string): string {
  if (!iso) return "—";
  const then = new Date(iso);
  const now = new Date("2026-06-25T18:00:00"); // static to avoid SSR mismatch
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return fmtDate(iso);
}
