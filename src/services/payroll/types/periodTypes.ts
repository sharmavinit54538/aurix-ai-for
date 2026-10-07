import type { PayrollStatus } from "./runTypes";

export interface PayrollPeriod {
  id: string;
  name: string; // e.g., "April 2026", "March 2026"
  startDate: string;
  endDate: string;
  payDate?: string;
  status?: PayrollStatus;
  employeeCount?: number | null;
  periodMonth?: number;
  periodYear?: number;
  isCurrent?: boolean;
  isLocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  remarks?: string;
  [key: string]: unknown;
}

export interface GetPeriodsParams {
  page?: number;
  limit?: number;
  status?: string;
  year?: number;
  month?: number;
  search?: string;
  company_id?: string;
}

export interface GetPeriodsResponse {
  items: PayrollPeriod[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreatePeriodPayload {
  name: string;
  startDate: string;
  endDate: string;
  payDate: string;
  periodMonth?: number;
  periodYear?: number;
  remarks?: string;
  companyId?: string;
}