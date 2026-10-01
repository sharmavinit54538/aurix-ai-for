import type { Department, DepartmentsSummary } from "./types";

export type { Department, DepartmentStatus, DepartmentsSummary } from "./types";

export interface DepartmentsState {
  departments: Department[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  pages: number;
  summary: DepartmentsSummary | null;
  summaryLoading: boolean;
  summaryError: string | null;
  selectedDepartment: Department | null;
  selectedDepartmentLoading: boolean;
  selectedDepartmentError: string | null;
}
