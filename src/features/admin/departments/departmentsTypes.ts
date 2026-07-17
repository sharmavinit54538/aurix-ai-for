import type { Department } from "./types";

export type { Department, DepartmentStatus } from "./types";

export interface DepartmentsState {
  departments: Department[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  pages: number;
}
