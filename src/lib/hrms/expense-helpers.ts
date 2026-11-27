import type { Expense, ExpenseCategory, ExpenseStatus } from "./types";

const VALID_CATEGORIES = new Set<ExpenseCategory>([
  "travel",
  "meals",
  "lodging",
  "supplies",
  "training",
  "client",
  "other",
]);

const VALID_STATUSES = new Set<ExpenseStatus>([
  "pending",
  "approved",
  "changes-requested",
  "rejected",
  "paid",
]);

export function mapExpenseFromBackend(raw: any): Expense {
  const rawCategory = String(raw?.category || "other").trim().toLowerCase() as ExpenseCategory;
  const category: ExpenseCategory = VALID_CATEGORIES.has(rawCategory) ? rawCategory : "other";

  const rawStatus = String(raw?.status || "pending")
    .trim()
    .toLowerCase()
    .replace(/_/g, "-") as ExpenseStatus;
  const status: ExpenseStatus = VALID_STATUSES.has(rawStatus) ? rawStatus : "pending";

  const employeeObj =
    raw?.employee && typeof raw.employee === "object" ? raw.employee : null;
  const employeeDisplay =
    employeeObj?.name ||
    employeeObj?.full_name ||
    (!employeeObj ? raw?.employee : undefined) ||
    raw?.employee_name ||
    raw?.employeeName ||
    raw?.submitter_name ||
    "Employee";

  const employeeIdRaw = raw?.employee_id ?? raw?.employeeId ?? employeeObj?.id;
  const employeeCodeRaw = employeeObj?.employee_code ?? raw?.employee_code ?? raw?.employeeCode;

  return {
    id: String(raw?.id || ""),
    employee: String(employeeDisplay),
    employeeId: employeeIdRaw ? String(employeeIdRaw) : undefined,
    employeeCode: employeeCodeRaw ? String(employeeCodeRaw) : undefined,
    category,
    amount: Number(raw?.amount ?? 0),
    currency: String(raw?.currency || "INR"),
    date: String(
      raw?.date ||
        raw?.expense_date ||
        raw?.submittedAt ||
        raw?.submitted_at ||
        new Date().toISOString().slice(0, 10),
    ),
    description: String(raw?.description || raw?.title || raw?.name || "Expense claim"),
    receiptName: raw?.receiptName || raw?.receipt_name || undefined,
    status,
    managerNote:
      raw?.managerNote ||
      raw?.manager_note ||
      raw?.rejection_reason ||
      raw?.note ||
      undefined,
    paidAt: raw?.paidAt || raw?.paid_at || undefined,
    submittedAt: String(
      raw?.submittedAt ||
        raw?.submitted_at ||
        raw?.created_at ||
        raw?.date ||
        raw?.expense_date ||
        new Date().toISOString(),
    ),
  };
}

export function filterExpensesForEmployee(expenses: Expense[], employeeName?: string | null): Expense[] {
  const normalizedTarget = String(employeeName || "").trim().toLowerCase();
  if (!normalizedTarget) return [];
  return expenses.filter(
    (exp) => String(exp.employee || "").trim().toLowerCase() === normalizedTarget,
  );
}

export function filterExpensesByEmployeeId(expenses: Expense[], employeeId?: string | null): Expense[] {
  const targetId = String(employeeId || "").trim();
  if (!targetId) return [];
  return expenses.filter((exp) => String(exp.employeeId || "").trim() === targetId);
}
