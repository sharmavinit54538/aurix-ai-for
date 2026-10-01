// ─── Department Types ─────────────────────────────────────────────────────────

export type DepartmentStatus = "active" | "inactive";
export type HiringStatus = "open" | "paused" | "closed";

export interface DepartmentActivity {
  id: string;
  action: string;
  timestamp: string;
}

export interface DepartmentDocument {
  name: string;
  size: string;
  date: string;
}

export interface DepartmentsSummary {
  totalDepartments?: number;
  activeDepartments?: number;
  inactiveDepartments?: number;
  totalEmployees?: number;
  totalManagers?: number;
  avgTeamSize?: number;
  openPositions?: number;
  hiringDepartments?: number;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  department_code: string;
  code?: string;
  cost_center: string;
  costCenter?: string;
  departmentHeadId: string | null;
  departmentHeadName: string;
  reportingManagerId: string | null;
  reportingManagerName: string;
  office: string;
  budget: number;
  employeeCapacity: number | null;
  currentEmployeeCount: number;
  extensionNumber: string;
  status: DepartmentStatus;
  themeColor: string; // hex color code
  iconName: string; // Lucide icon identifier
  parentId: string | null; // For reporting hierarchy
  parentName: string;
  createdDate: string;
  employeeIds: string[]; // Assigned employee IDs from backend
  openPositions: number;
  performanceScore: number | null; // 0 - 100, null if not provided
  attendanceScore: number | null; // 0 - 100, null if not provided
  hiringStatus: HiringStatus;
  recentActivity: DepartmentActivity[];
  documents: DepartmentDocument[];
}

export interface DepartmentFilters {
  status: string;
  office: string;
  employeeCountRange: string; // 'all' | '0-10' | '11-50' | '50+'
  managerId: string; // Department head manager ID
  createdDateFrom: string;
  createdDateTo: string;
}

export type SortField = "name" | "code" | "departmentHeadName" | "currentEmployeeCount" | "openPositions" | "budget" | "createdDate" | "status";
export type SortDir = "asc" | "desc";

export interface HierarchyNode {
  id: string;
  name: string;
  department_code: string;
  headName: string;
  themeColor: string;
  iconName: string;
  children: HierarchyNode[];
}

export interface ImportDepartmentRow {
  name: string;
  code: string;
  description?: string;
  departmentHeadName?: string;
  office?: string;
  budget?: string;
  employeeCapacity?: string;
  status?: string;
  parentId?: string;
}
