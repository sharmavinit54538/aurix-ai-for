import type { Department, DepartmentFilters } from "../types";

export const OFFICES = [
  "San Francisco HQ",
  "Bengaluru Tech Park",
  "London Office",
  "Singapore Hub",
  "New York Branch",
  "Dubai Office",
  "Remote",
];

export const STATUS_OPTIONS = [
  { value: "active", label: "Active", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20" },
  { value: "inactive", label: "Inactive", color: "text-slate-500 bg-slate-500/10 border-slate-500/20" },
  { value: "hiring", label: "Hiring", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" },
  { value: "growing", label: "Growing", color: "text-blue-500 bg-blue-500/10 border-blue-500/20" },
];

export const HIRING_STATUS_OPTIONS = [
  { value: "open", label: "Open" },
  { value: "paused", label: "Paused" },
  { value: "closed", label: "Closed" },
];

export const THEME_COLORS = [
  { hex: "#3b82f6", label: "Vibrant Blue" },
  { hex: "#10b981", label: "Emerald Green" },
  { hex: "#ec4899", label: "Rose Pink" },
  { hex: "#8b5cf6", label: "Amethyst Violet" },
  { hex: "#f59e0b", label: "Amber Gold" },
  { hex: "#06b6d4", label: "Teal Cyan" },
  { hex: "#f43f5e", label: "Crimson Red" },
  { hex: "#64748b", label: "Slate Gray" },
];

export const DEPARTMENT_ICONS = [
  { name: "Code2", label: "Engineering" },
  { name: "TrendingUp", label: "Product" },
  { name: "Paintbrush", label: "Design" },
  { name: "Briefcase", label: "Sales" },
  { name: "Megaphone", label: "Marketing" },
  { name: "Users", label: "HR" },
  { name: "DollarSign", label: "Finance" },
  { name: "Settings", label: "Operations" },
  { name: "Scale", label: "Legal" },
  { name: "Globe", label: "Global Success" },
  { name: "ShieldCheck", label: "Compliance & Security" },
  { name: "Building2", label: "General Admin" },
];

export const DEFAULT_FILTERS: DepartmentFilters = {
  status: "all",
  office: "all",
  employeeCountRange: "all",
  managerId: "all",
  createdDateFrom: "",
  createdDateTo: "",
};

export const EMPLOYEE_COUNT_RANGES = [
  { value: "all", label: "Any Size" },
  { value: "0-10", label: "Small (0-10)" },
  { value: "11-30", label: "Medium (11-30)" },
  { value: "31-50", label: "Large (31-50)" },
  { value: "50+", label: "Enterprise (50+)" },
];

// Seed Departments (linked with seed managers)
export const SEED_DEPARTMENTS: Department[] = [];
