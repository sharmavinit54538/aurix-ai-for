import type {
  EmployeeDocument,
  DocumentCategory,
  SalarySlipRecord,
  ProvisionSlip,
} from "@/services/myDocumentsApi";

export type {
  EmployeeDocument,
  DocumentCategory,
  SalarySlipRecord,
  ProvisionSlip,
};

export type ActiveTab =
  | "all"
  | "employment"
  | "salary-slips"
  | "provision-slips"
  | "pending"
  | "verified"
  | "rejected";

export interface SummaryMetrics {
  total: number;
  verified: number;
  pending: number;
  rejected: number;
  expiring: number;
}
