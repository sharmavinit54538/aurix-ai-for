import { MONTH_NAMES } from "../utils";
import type { PayrollPeriod, PayrollStatus } from "../types";

export function normalizePayrollPeriod(item: unknown): PayrollPeriod {
  if (!item || typeof item !== "object") {
    return {
      id: "",
      name: "",
      startDate: "",
      endDate: "",
    };
  }

  const it = item as Record<string, unknown>;
  const id = String(it.id || it.cycle_id || it.period_id || it._id || "");
  const month = Number(it.period_month ?? it.month ?? 0) || undefined;
  const year = Number(it.period_year ?? it.year ?? 0) || undefined;

  let name = String(it.name || it.period_name || it.title || "");
  if (!name && month && year) {
    name = `${MONTH_NAMES[month] || `Month ${month}`} ${year}`;
  } else if (!name && (it.startDate || it.start_date)) {
    name = String(it.startDate || it.start_date);
  }

  const startDate = String(it.startDate || it.start_date || "");
  const endDate = String(it.endDate || it.end_date || "");
  const payDate = String(it.payDate || it.pay_date || "");
  const rawStatus = (it.status || (it.is_locked ? "Locked" : "Open")) as PayrollStatus;
  const employeeCount = it.employeeCount ?? it.employee_count ?? it.total_employees ?? null;
  const isLocked = Boolean(
    it.is_locked ||
    it.isLocked ||
    String(rawStatus).toLowerCase() === "locked" ||
    String(rawStatus).toLowerCase() === "finalized" ||
    String(rawStatus).toLowerCase() === "closed",
  );
  const isCurrent = Boolean(it.isCurrent || it.is_current);
  const createdAt = String(it.createdAt || it.created_at || "");
  const updatedAt = String(it.updatedAt || it.updated_at || "");
  const remarks = String(it.remarks || it.notes || "");

  return {
    id,
    name: name || "Unnamed Period",
    startDate,
    endDate,
    payDate,
    status: rawStatus,
    employeeCount: employeeCount != null ? Number(employeeCount) : null,
    periodMonth: month,
    periodYear: year,
    isCurrent,
    isLocked,
    createdAt,
    updatedAt,
    remarks,
  };
}