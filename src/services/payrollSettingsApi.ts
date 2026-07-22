import { api } from "@/api";

export interface PTSlab {
  upto: number | null;
  amount: number;
}

export interface PayrollSettingsData {
  id?: string;
  company_id?: string | null;
  company_name: string;
  currency: string;
  country: string;
  timezone: string;
  financial_year_start: string;
  payroll_start_day: number;
  payroll_end_day: number;
  salary_payment_date: number;
  auto_lock_payroll: boolean;
  enable_draft_payroll: boolean;
  enable_retro_payroll: boolean;

  pay_cycle_type: "MONTHLY" | "BI_WEEKLY" | "WEEKLY" | "CUSTOM";
  grace_period_days: number;
  cutoff_date: number;
  preview_days: number;

  pf_enabled: boolean;
  employee_pf_rate: number;
  employer_pf_rate: number;
  pf_wage_ceiling: number;
  pf_on_full_basic: boolean;

  esi_enabled: boolean;
  employee_esi_rate: number;
  employer_esi_rate: number;
  esi_wage_ceiling: number;

  pt_state: string;
  pt_slabs: PTSlab[];
  default_tax_regime: "OLD" | "NEW";
  lop_basis: "CALENDAR_DAYS" | "FIXED_30";

  overtime_enabled: boolean;
  overtime_multiplier_holiday: number;
  overtime_multiplier_weekend: number;
  overtime_multiplier_night: number;

  bank_name: string;
  bank_ifsc: string;
  salary_transfer_format: "NEFT" | "RTGS" | "ACH" | "CSV";
  auto_email_payslips: boolean;
  auto_backup_payroll: boolean;

  settings_data?: Record<string, any>;
  effective_from?: string;
  is_active?: boolean;
}

export interface SettingsAuditHistoryItem {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  category: string;
  old_value: string;
  new_value: string;
  ip_address: string;
}

export const payrollSettingsApi = {
  // Fetch active settings
  getSettings: async (): Promise<PayrollSettingsData> => {
    const res: any = await api.get("payroll/settings");
    return res.data?.data || res.data;
  },

  // Update settings
  updateSettings: async (payload: Partial<PayrollSettingsData>): Promise<PayrollSettingsData> => {
    const res: any = await api.put("payroll/settings", payload);
    return res.data?.data || res.data;
  },

  // Fetch settings change audit history
  getHistory: async (): Promise<SettingsAuditHistoryItem[]> => {
    const res: any = await api.get("payroll/settings/history");
    return res.data?.data?.items || res.data?.items || [];
  },

  // Import settings payload
  importSettings: async (configData: any) => {
    const res: any = await api.post("payroll/settings/import", configData);
    return res.data?.data || res.data;
  },

  // Export settings configuration payload
  exportSettings: async (): Promise<PayrollSettingsData> => {
    const res: any = await api.get("payroll/settings/export");
    return res.data?.data || res.data;
  },

  // Reset to default statutory compliance presets
  resetSettings: async () => {
    const res: any = await api.post("payroll/settings/reset", {});
    return res.data?.data || res.data;
  },
};
