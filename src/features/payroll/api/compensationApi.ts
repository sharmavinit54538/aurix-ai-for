/**
 * Salary Structure & Compensation Management API.
 * Handles Pay Component Master, Salary Structure Templates, Employee Compensation,
 * Revisions with Maker-Checker, Salary Structure Assignment, and Bulk Import.
 *
 * Strictly uses verified endpoints from `/openapi.json` and preserves null/missing states
 * rather than fabricating monetary figures, statuses, or employee identifiers.
 */

import apiInstance from "@/api/apiInstance";
import { departmentsApi } from "@/services/departmentsApi";
import { formatINR } from "@/lib/format";
import { generateIdempotencyKey } from "../utils/idempotency";
import { formatPaiseToINR, toPaise } from "../utils/money";
import type {
  BulkCompensationPreviewResult,
  CalculationMethod,
  CompensationMasterEmployee,
  CompensationRevisionRecord,
  CompensationStatus,
  CompensationSummaryMetrics,
  ComponentType,
  EmployeeCompensation,
  EmployeeCompensationComponent,
  EmployeeCompensationListParams,
  EmployeeCompensationListResult,
  PayComponent,
  SalaryStructureTemplate,
  StructureComponentLine,
} from "../types/compensation";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" } as const;
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type RawRecord = Record<string, unknown>;

export interface CreatePayComponentPayload {
  code: string;
  name: string;
  type: ComponentType;
  taxable: boolean;
  statutory: boolean;
  calculationMethod: CalculationMethod;
  defaultPercentage?: number;
  description?: string;
  effectiveDate: string;
}

export interface CreateSalaryStructurePayload {
  code: string;
  name: string;
  description?: string;
  effectiveDate: string;
  components: Array<{
    componentId: string;
    calculationMethod: string;
    percentageOrAmount?: number;
    formula?: string;
    isMandatory?: boolean;
  }>;
}

export interface ProposeRevisionPayload {
  newCtcAnnualPaise: number;
  effectiveDate: string;
  reason: string;
  notes?: string;
  salaryStructureId?: string;
  revisionPercentage?: number;
}

export interface AssignSalaryStructurePayload {
  employeeId?: string;
  employee_id?: string;
  employeeIds?: string[];
  annualCtc?: number;
  effectiveFrom?: string;
  effectiveDate?: string;
}

function isObject(val: unknown): val is RawRecord {
  return Boolean(val) && typeof val === "object" && !Array.isArray(val);
}

function isUuidLike(val: unknown): boolean {
  return typeof val === "string" && UUID_REGEX.test(val.trim());
}

function unwrapEnvelope<T = unknown>(raw: unknown): T {
  let curr: unknown = raw;
  for (let i = 0; i < 3; i++) {
    if (!isObject(curr)) break;
    if ("data" in curr && curr.data !== undefined && curr.data !== null) {
      if (isObject(curr.data) || Array.isArray(curr.data)) {
        // Stop unwrapping when data looks like an already normalized paginated container
        if (isObject(curr.data) && ("items" in curr.data || "entries" in curr.data || "rows" in curr.data)) {
          return curr.data as T;
        }
        curr = curr.data;
        continue;
      }
    }
    break;
  }
  return curr as T;
}

function pickValue(obj: RawRecord | null | undefined, ...keys: string[]): unknown {
  if (!obj) return undefined;
  for (const key of keys) {
    const val = obj[key];
    if (val !== undefined && val !== null) return val;
  }
  return undefined;
}

function pickStr(obj: RawRecord | null | undefined, ...keys: string[]): string | undefined {
  if (!obj) return undefined;
  for (const key of keys) {
    const val = obj[key];
    if (typeof val === "string") {
      const trimmed = val.trim();
      if (trimmed !== "") return trimmed;
    } else if (typeof val === "number" && Number.isFinite(val)) {
      return String(val);
    }
  }
  return undefined;
}

function pickFiniteNumber(obj: RawRecord | null | undefined, ...keys: string[]): number | null {
  if (!obj) return null;
  for (const key of keys) {
    const val = obj[key];
    if (typeof val === "number" && Number.isFinite(val)) return val;
    if (typeof val === "string" && val.trim() !== "") {
      const cleaned = val.replace(/[₹,\s]/g, "");
      const parsed = Number(cleaned);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return null;
}

/**
 * Resolves a backend monetary metric strictly into integer paise without fabricating values.
 * Checks explicit `paiseKeys` first (integer paise), then `rupeeKeys` (converted via `toPaise`).
 * Returns `null` when both key groups are missing.
 */
function resolveMoneyFieldToPaise(
  sources: Array<RawRecord | null | undefined>,
  paiseKeys: string[],
  rupeeKeys: string[]
): number | null {
  for (const src of sources) {
    const paise = pickFiniteNumber(src, ...paiseKeys);
    if (paise !== null) return Math.round(paise);
  }
  for (const src of sources) {
    const rupees = pickFiniteNumber(src, ...rupeeKeys);
    if (rupees !== null) return toPaise(rupees);
  }
  return null;
}

function formatOptionalPaise(paise: number | null | undefined): string {
  if (paise === null || paise === undefined || !Number.isFinite(paise)) return "—";
  return formatPaiseToINR(paise);
}

function normalizeCompensationStatus(
  rawStatus: string | undefined,
  rawObj: RawRecord,
  hasStructureOrPay: boolean
): { status: CompensationStatus; statusRaw: string | null } {
  const statusStr = rawStatus?.trim() || null;
  if (statusStr) {
    const lower = statusStr.toLowerCase().replace(/[\s-]+/g, "_");
    switch (lower) {
      case "active":
        return { status: "active", statusRaw: statusStr };
      case "inactive":
        return { status: "inactive", statusRaw: statusStr };
      case "scheduled":
      case "upcoming":
        return { status: "scheduled", statusRaw: statusStr };
      case "expired":
        return { status: "expired", statusRaw: statusStr };
      case "pending_approval":
      case "pending":
        return { status: "pending_approval", statusRaw: statusStr };
      case "superseded":
        return { status: "superseded", statusRaw: statusStr };
      case "draft":
        return { status: "draft", statusRaw: statusStr };
      case "historical":
        return { status: "historical", statusRaw: statusStr };
      case "not_assigned":
      case "unassigned":
        return { status: "not_assigned", statusRaw: statusStr };
      default:
        return { status: "unknown", statusRaw: statusStr };
    }
  }

  const isActiveFlag = pickValue(rawObj, "is_active", "isActive");
  if (typeof isActiveFlag === "boolean") {
    return {
      status: isActiveFlag ? "active" : "inactive",
      statusRaw: isActiveFlag ? "active" : "inactive",
    };
  }

  // Never synthesize ACTIVE when status is omitted
  return {
    status: hasStructureOrPay ? "unknown" : "not_assigned",
    statusRaw: null,
  };
}

function normalizeComponentType(rawType: unknown): ComponentType {
  const str = String(rawType ?? "earning").toLowerCase().replace(/[\s-]+/g, "_");
  if (str === "deduction") return "deduction";
  if (str === "employer_contribution" || str === "employer") return "employer_contribution";
  return "earning";
}

function normalizePayComponent(raw: unknown, idx = 0): PayComponent {
  const r = isObject(raw) ? raw : {};
  const defaultPct = pickFiniteNumber(
    r,
    "defaultPercentage",
    "default_percentage",
    "percentageOrAmount",
    "percentage_or_amount"
  );
  const rawActive = pickValue(r, "isActive", "is_active");
  return {
    id: pickStr(r, "id", "componentId", "component_id") || `comp-${idx + 1}`,
    code: pickStr(r, "code", "componentCode", "component_code") || "—",
    name: pickStr(r, "name", "componentName", "component_name") || "—",
    type: normalizeComponentType(pickStr(r, "type", "componentType", "component_type")),
    taxable: Boolean(pickValue(r, "taxable", "isTaxable", "is_taxable") ?? true),
    statutory: Boolean(pickValue(r, "statutory", "isStatutory", "is_statutory") ?? false),
    calculationMethod: (
      pickStr(r, "calculationMethod", "calculation_method") || "flat"
    ).toLowerCase() as CalculationMethod,
    formulaDescription: pickStr(r, "formulaDescription", "formula_description", "formula"),
    defaultPercentage: defaultPct ?? undefined,
    isActive: typeof rawActive === "boolean" ? rawActive : true,
    effectiveDate: pickStr(r, "effectiveDate", "effective_date", "effectiveFrom", "effective_from") || "",
    description: pickStr(r, "description"),
  };
}

function normalizeStructureComponentLine(raw: unknown, idx = 0): StructureComponentLine {
  const r = isObject(raw) ? raw : {};
  const pct = pickFiniteNumber(r, "percentageOrAmount", "percentage_or_amount", "percentage", "amount");
  return {
    componentId: pickStr(r, "componentId", "component_id", "id") || `line-${idx + 1}`,
    code: pickStr(r, "code", "componentCode", "component_code") || "—",
    name: pickStr(r, "name", "componentName", "component_name") || "—",
    type: normalizeComponentType(pickStr(r, "type", "componentType", "component_type")),
    calculationMethod: (
      pickStr(r, "calculationMethod", "calculation_method") || "flat"
    ).toLowerCase() as CalculationMethod,
    percentageOrAmount: pct ?? undefined,
    formula: pickStr(r, "formula", "formulaDescription", "formula_description"),
    isMandatory: Boolean(pickValue(r, "isMandatory", "is_mandatory") ?? false),
  };
}

function normalizeSalaryStructure(raw: unknown, idx = 0): SalaryStructureTemplate {
  const r = isObject(raw) ? raw : {};
  const rawComps = pickValue(r, "components", "structureComponents", "structure_components");
  const components = Array.isArray(rawComps)
    ? rawComps.map((c, cIdx) => normalizeStructureComponentLine(c, cIdx))
    : [];
  const rawActive = pickValue(r, "isActive", "is_active");
  const statusStr = pickStr(r, "status");
  const isActive =
    typeof rawActive === "boolean"
      ? rawActive
      : statusStr
        ? statusStr.toLowerCase() === "active"
        : true;
  const assignedCount = pickFiniteNumber(
    r,
    "assignedEmployeesCount",
    "assigned_employees_count",
    "employeeCount",
    "employee_count"
  );

  return {
    id: pickStr(r, "id", "structureId", "structure_id") || `struct-${idx + 1}`,
    code: pickStr(r, "code", "structureCode", "structure_code") || "—",
    name: pickStr(r, "name", "structureName", "structure_name", "title") || "—",
    description: pickStr(r, "description"),
    isActive,
    effectiveDate:
      pickStr(r, "effectiveDate", "effective_date", "effectiveFrom", "effective_from") || "",
    currency: pickStr(r, "currency") || "INR",
    components,
    assignedEmployeesCount: assignedCount ?? undefined,
    createdAt: pickStr(r, "createdAt", "created_at") || "",
    updatedAt: pickStr(r, "updatedAt", "updated_at"),
  };
}

function normalizeEmployeeComponent(raw: unknown, idx = 0): EmployeeCompensationComponent {
  const r = isObject(raw) ? raw : {};
  let monthlyPaise = resolveMoneyFieldToPaise(
    [r],
    ["monthlyAmountPaise", "monthly_amount_paise", "monthlyPaise", "monthly_paise"],
    ["monthlyAmount", "monthly_amount", "monthly", "amount"]
  );
  let annualPaise = resolveMoneyFieldToPaise(
    [r],
    ["annualAmountPaise", "annual_amount_paise", "annualPaise", "annual_paise"],
    ["annualAmount", "annual_amount", "annual"]
  );

  if (monthlyPaise === null && annualPaise !== null) {
    monthlyPaise = Math.round(annualPaise / 12);
  } else if (annualPaise === null && monthlyPaise !== null) {
    annualPaise = monthlyPaise * 12;
  }

  return {
    componentId: pickStr(r, "componentId", "component_id", "id") || `ec-${idx + 1}`,
    code: pickStr(r, "code", "componentCode", "component_code") || "COMP",
    name: pickStr(r, "name", "componentName", "component_name") || "—",
    type: normalizeComponentType(pickStr(r, "type", "componentType", "component_type")),
    calculationMethod: pickStr(r, "calculationMethod", "calculation_method"),
    percentageOrAmount: pickFiniteNumber(r, "percentageOrAmount", "percentage_or_amount"),
    isTaxable:
      typeof pickValue(r, "taxable", "isTaxable", "is_taxable") === "boolean"
        ? Boolean(pickValue(r, "taxable", "isTaxable", "is_taxable"))
        : undefined,
    isStatutory:
      typeof pickValue(r, "statutory", "isStatutory", "is_statutory") === "boolean"
        ? Boolean(pickValue(r, "statutory", "isStatutory", "is_statutory"))
        : undefined,
    monthlyAmountPaise: monthlyPaise,
    annualAmountPaise: annualPaise,
    monthlyFormatted: formatOptionalPaise(monthlyPaise),
    annualFormatted: formatOptionalPaise(annualPaise),
  };
}

function normalizeActor(raw: unknown, fallbackName?: string): { id: string; name: string; email: string } {
  if (isObject(raw)) {
    return {
      id: pickStr(raw, "id", "userId", "user_id") || "",
      name: pickStr(raw, "name", "fullName", "full_name", "email") || fallbackName || "—",
      email: pickStr(raw, "email") || "",
    };
  }
  if (typeof raw === "string" && raw.trim() !== "") {
    return { id: "", name: raw.trim(), email: "" };
  }
  return { id: "", name: fallbackName || "—", email: "" };
}

function normalizeRevisionRecord(raw: unknown, idx = 0): CompensationRevisionRecord {
  const r = isObject(raw) ? raw : {};

  const prevCtcPaise = resolveMoneyFieldToPaise(
    [r],
    ["previousCtcPaise", "previous_ctc_paise", "previousAnnualCtcPaise", "previous_annual_ctc_paise"],
    ["previousCtc", "previous_ctc", "previousAnnualCtc", "previous_annual_ctc"]
  );
  const newCtcPaise = resolveMoneyFieldToPaise(
    [r],
    [
      "newCtcPaise",
      "new_ctc_paise",
      "revisedCtcPaise",
      "revised_ctc_paise",
      "newCtcAnnualPaise",
      "new_ctc_annual_paise",
      "revisedAnnualCtcPaise",
      "revised_annual_ctc_paise",
    ],
    ["newCtc", "new_ctc", "revisedAnnualCtc", "revised_annual_ctc", "newAnnualCtc", "new_annual_ctc"]
  );

  const prevMonthlyGrossPaise = resolveMoneyFieldToPaise(
    [r],
    ["previousMonthlyGrossPaise", "previous_monthly_gross_paise"],
    ["previousMonthlyGross", "previous_monthly_gross"]
  );
  const newMonthlyGrossPaise = resolveMoneyFieldToPaise(
    [r],
    ["newMonthlyGrossPaise", "new_monthly_gross_paise", "revisedMonthlyGrossPaise", "revised_monthly_gross_paise"],
    ["newMonthlyGross", "new_monthly_gross", "revisedMonthlyGross", "revised_monthly_gross"]
  );

  const explicitDiffPaise = resolveMoneyFieldToPaise(
    [r],
    ["revisionAmountPaise", "revision_amount_paise", "differencePaise", "difference_paise"],
    ["revisionAmount", "revision_amount", "difference"]
  );
  const computedDiffPaise =
    explicitDiffPaise !== null
      ? explicitDiffPaise
      : prevCtcPaise !== null && newCtcPaise !== null
        ? newCtcPaise - prevCtcPaise
        : null;

  let changePct = pickFiniteNumber(
    r,
    "changePercentage",
    "change_percentage",
    "revisionPercentage",
    "revision_percentage"
  );
  if (changePct === null && prevCtcPaise !== null && prevCtcPaise > 0 && newCtcPaise !== null) {
    changePct = Number((((newCtcPaise - prevCtcPaise) / prevCtcPaise) * 100).toFixed(2));
  }

  const makerRaw = pickValue(r, "maker", "revisedByUser", "revised_by_user");
  const makerFallback = pickStr(r, "revisedByName", "revised_by_name", "revisedBy", "revised_by", "createdByName", "created_by_name");
  const checkerRaw = pickValue(r, "checker", "approvedByUser", "approved_by_user");
  const checkerFallback = pickStr(r, "approvedByName", "approved_by_name", "approvedBy", "approved_by", "reviewedByName", "reviewed_by_name");

  const statusStr = (pickStr(r, "status", "revisionStatus", "revision_status") || "pending_approval")
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  const effectiveDate =
    pickStr(r, "effectiveDate", "effective_date", "effectiveFrom", "effective_from") || "";

  return {
    id: pickStr(r, "id", "revisionId", "revision_id") || `rev-${idx + 1}`,
    revisionNumber: pickFiniteNumber(r, "revisionNumber", "revision_number") ?? idx + 1,
    effectiveDate,
    revisionDate: pickStr(r, "revisionDate", "revision_date", "createdAt", "created_at") || null,
    previousCtcPaise: prevCtcPaise,
    newCtcPaise,
    previousCtcFormatted: formatOptionalPaise(prevCtcPaise),
    newCtcFormatted: formatOptionalPaise(newCtcPaise),
    previousMonthlyGrossPaise: prevMonthlyGrossPaise,
    newMonthlyGrossPaise,
    previousMonthlyGrossFormatted: formatOptionalPaise(prevMonthlyGrossPaise),
    newMonthlyGrossFormatted: formatOptionalPaise(newMonthlyGrossPaise),
    revisionAmountPaise: computedDiffPaise,
    revisionAmountFormatted:
      computedDiffPaise !== null
        ? `${computedDiffPaise >= 0 ? "+" : "-"}${formatPaiseToINR(Math.abs(computedDiffPaise))}`
        : "—",
    changePercentage: changePct,
    previousStructureName: pickStr(
      r,
      "previousSalaryStructureName",
      "previous_salary_structure_name",
      "previousSalaryStructure",
      "previous_salary_structure",
      "previousStructureName",
      "previous_structure_name"
    ) ?? null,
    newStructureName: pickStr(
      r,
      "revisedSalaryStructureName",
      "revised_salary_structure_name",
      "revisedSalaryStructure",
      "revised_salary_structure",
      "newStructureName",
      "new_structure_name"
    ) ?? null,
    reason: pickStr(r, "reason", "revisionReason", "revision_reason") || "Not Available",
    notes: pickStr(r, "notes", "remarks") ?? null,
    status: statusStr,
    hasArrearsRisk: Boolean(pickValue(r, "hasArrearsRisk", "has_arrears_risk") ?? false),
    arrearsEstimatedMonths:
      pickFiniteNumber(r, "arrearsEstimatedMonths", "arrears_estimated_months") ?? undefined,
    maker: normalizeActor(makerRaw, makerFallback),
    checker: checkerRaw || checkerFallback ? normalizeActor(checkerRaw, checkerFallback) : null,
    reviewedAt: pickStr(r, "reviewedAt", "reviewed_at", "approvedAt", "approved_at") ?? null,
    rejectionReason: pickStr(r, "rejectionReason", "rejection_reason") ?? null,
    createdAt: pickStr(r, "createdAt", "created_at") || "",
  };
}

function normalizeEmployeeCompensation(raw: unknown, idx = 0): EmployeeCompensation {
  const r = isObject(raw) ? raw : {};
  const empObj = isObject(r.employee) ? r.employee : null;
  const deptObj = isObject(r.department) ? r.department : isObject(empObj?.department) ? empObj.department : null;
  const desigObj = isObject(r.designation) ? r.designation : isObject(empObj?.designation) ? empObj.designation : null;
  const structObj =
    isObject(r.salary_structure)
      ? r.salary_structure
      : isObject(r.salaryStructure)
        ? r.salaryStructure
        : isObject(r.structure)
          ? r.structure
          : null;
  const compObj = isObject(r.compensation) ? r.compensation : null;
  const moneySources: Array<RawRecord | null> = [r, compObj];

  const recordId = pickStr(r, "id", "compensationId", "compensation_id") || "";
  const employeeId =
    pickStr(r, "employeeId", "employee_id") ||
    pickStr(empObj, "id", "employee_id", "employeeId") ||
    recordId;

  const rawEmpCodeCandidates = [
    pickStr(r, "employeeCode", "employee_code", "empCode", "emp_code"),
    pickStr(empObj, "employeeCode", "employee_code", "code"),
  ];
  // Never expose an internal UUID as the visible Employee Code
  const validEmpCode = rawEmpCodeCandidates.find((c) => Boolean(c) && !isUuidLike(c));

  const firstLast = [
    pickStr(r, "firstName", "first_name") ?? pickStr(empObj, "firstName", "first_name"),
    pickStr(r, "lastName", "last_name") ?? pickStr(empObj, "lastName", "last_name"),
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  const employeeName =
    pickStr(r, "employeeName", "employee_name", "fullName", "full_name", "name") ||
    pickStr(empObj, "fullName", "full_name", "name", "employeeName", "employee_name") ||
    firstLast ||
    "";

  const profileImage =
    pickStr(r, "profileImage", "profile_image", "profilePhotoUrl", "profile_photo_url", "avatarUrl", "avatar_url") ||
    pickStr(empObj, "profileImage", "profile_image", "profilePhotoUrl", "profile_photo_url", "avatarUrl", "avatar_url");

  const departmentId =
    pickStr(r, "departmentId", "department_id") ||
    pickStr(deptObj, "id", "department_id") ||
    pickStr(empObj, "departmentId", "department_id");

  const departmentName =
    pickStr(r, "departmentName", "department_name", "department") ||
    pickStr(deptObj, "name", "departmentName", "department_name") ||
    pickStr(empObj, "departmentName", "department_name", "department") ||
    "";

  const designation =
    pickStr(r, "designationName", "designation_name", "designation", "jobTitle", "job_title") ||
    pickStr(desigObj, "name", "title") ||
    pickStr(empObj, "designation", "jobTitle", "job_title", "title") ||
    "";

  const employmentType =
    pickStr(r, "employmentType", "employment_type") ||
    pickStr(empObj, "employmentType", "employment_type");

  const joiningDate =
    pickStr(r, "joiningDate", "joining_date", "dateOfJoining", "date_of_joining") ||
    pickStr(empObj, "joiningDate", "joining_date", "dateOfJoining", "date_of_joining");

  const structureId =
    pickStr(r, "salaryStructureId", "salary_structure_id", "structureId", "structure_id") ||
    pickStr(structObj, "id", "structureId", "structure_id") ||
    pickStr(compObj, "salaryStructureId", "salary_structure_id", "structureId", "structure_id") ||
    "";

  const structureCode =
    pickStr(r, "salaryStructureCode", "salary_structure_code", "structureCode", "structure_code") ||
    pickStr(structObj, "code", "structureCode", "structure_code");

  const structureName =
    pickStr(r, "salaryStructureName", "salary_structure_name", "structureName", "structure_name") ||
    pickStr(structObj, "name", "title", "structureName", "structure_name") ||
    pickStr(compObj, "salaryStructureName", "salary_structure_name", "structureName", "structure_name") ||
    "";

  const currency = pickStr(r, "currency") || pickStr(compObj, "currency") || "INR";

  const ctcAnnualPaise = resolveMoneyFieldToPaise(
    moneySources,
    ["ctcAnnualPaise", "ctc_annual_paise", "annualCtcPaise", "annual_ctc_paise"],
    ["annualCtc", "annual_ctc", "ctcAnnual", "ctc_annual", "ctc"]
  );

  const ctcMonthlyPaise = resolveMoneyFieldToPaise(
    moneySources,
    ["ctcMonthlyPaise", "ctc_monthly_paise", "monthlyCtcPaise", "monthly_ctc_paise"],
    ["monthlyCtc", "monthly_ctc", "ctcMonthly", "ctc_monthly"]
  );

  // Monthly Gross and Annual Gross are distinct financial values from CTC.
  // Never divide annual CTC by 12 to fake Monthly Gross.
  const grossMonthlyPaise = resolveMoneyFieldToPaise(
    moneySources,
    ["grossMonthlyPaise", "gross_monthly_paise", "monthlyGrossPaise", "monthly_gross_paise"],
    ["monthlyGross", "monthly_gross", "grossMonthly", "gross_monthly", "monthlyGrossSalary", "monthly_gross_salary"]
  );

  const grossAnnualPaise = resolveMoneyFieldToPaise(
    moneySources,
    ["grossAnnualPaise", "gross_annual_paise", "annualGrossPaise", "annual_gross_paise"],
    ["annualGross", "annual_gross", "grossAnnual", "gross_annual", "annualGrossSalary", "annual_gross_salary"]
  );

  const fixedPayPaise = resolveMoneyFieldToPaise(
    moneySources,
    ["fixedCompensationPaise", "fixed_compensation_paise", "fixedPayPaise", "fixed_pay_paise"],
    ["fixedCompensation", "fixed_compensation", "fixedPay", "fixed_pay"]
  );

  const variablePayPaise = resolveMoneyFieldToPaise(
    moneySources,
    ["variableCompensationPaise", "variable_compensation_paise", "variablePayPaise", "variable_pay_paise"],
    ["variableCompensation", "variable_compensation", "variablePay", "variable_pay"]
  );

  const employerContributionsPaise = resolveMoneyFieldToPaise(
    moneySources,
    ["employerContributionsPaise", "employer_contributions_paise", "employerContributionPaise", "employer_contribution_paise"],
    ["employerContributions", "employer_contributions", "employerContribution", "employer_contribution"]
  );

  const effectiveDate =
    pickStr(
      r,
      "effectiveFrom",
      "effective_from",
      "effectiveDate",
      "effective_date",
      "effectiveFromDate",
      "effective_from_date"
    ) ||
    pickStr(compObj, "effectiveFrom", "effective_from", "effectiveDate", "effective_date") ||
    "";

  const effectiveTo =
    pickStr(r, "effectiveTo", "effective_to", "effectiveToDate", "effective_to_date") ??
    pickStr(compObj, "effectiveTo", "effective_to") ??
    null;

  const lastRevisionDate =
    pickStr(r, "lastRevisionDate", "last_revision_date") ?? null;

  const rawComponents = pickValue(r, "components", "salaryComponents", "salary_components") ??
    pickValue(compObj, "components", "salaryComponents", "salary_components");
  const components = Array.isArray(rawComponents)
    ? rawComponents.map((c, cIdx) => normalizeEmployeeComponent(c, cIdx))
    : [];

  const rawRevisions = pickValue(r, "revisions", "revisionHistory", "revision_history", "history") ??
    pickValue(compObj, "revisions", "revisionHistory", "revision_history");
  const revisions = Array.isArray(rawRevisions)
    ? rawRevisions.map((rev, revIdx) => normalizeRevisionRecord(rev, revIdx))
    : [];

  const rawStatusStr =
    pickStr(r, "status", "compensationStatus", "compensation_status") ??
    pickStr(compObj, "status", "compensationStatus", "compensation_status");

  const hasStructureOrPay = Boolean(
    structureId ||
      structureName ||
      ctcAnnualPaise !== null ||
      grossMonthlyPaise !== null
  );

  const { status, statusRaw } = normalizeCompensationStatus(rawStatusStr, r, hasStructureOrPay);

  return {
    id: recordId || `comp-row-${employeeId || idx + 1}`,
    employeeId,
    employeeCode: validEmpCode || "",
    employeeName,
    profileImage,
    departmentId,
    department: departmentName,
    designation,
    employmentType,
    joiningDate,
    structureId,
    structureCode,
    structureName: structureName || (structureId ? "" : "Not Assigned"),
    currency,
    ctcAnnualPaise,
    ctcMonthlyPaise,
    grossAnnualPaise,
    grossMonthlyPaise,
    fixedPayPaise,
    variablePayPaise,
    employerContributionsPaise,
    ctcAnnualFormatted: formatOptionalPaise(ctcAnnualPaise),
    ctcMonthlyFormatted: formatOptionalPaise(ctcMonthlyPaise),
    grossAnnualFormatted: formatOptionalPaise(grossAnnualPaise),
    grossMonthlyFormatted: formatOptionalPaise(grossMonthlyPaise),
    fixedPayFormatted: formatOptionalPaise(fixedPayPaise),
    variablePayFormatted: formatOptionalPaise(variablePayPaise),
    employerContributionsFormatted: formatOptionalPaise(employerContributionsPaise),
    effectiveDate,
    effectiveTo,
    lastRevisionDate,
    createdAt: pickStr(r, "createdAt", "created_at") ?? null,
    updatedAt: pickStr(r, "updatedAt", "updated_at") ?? null,
    status,
    statusRaw,
    components,
    revisions,
  };
}

function normalizeSummaryMetrics(rawContainer: RawRecord): CompensationSummaryMetrics | null {
  const s = isObject(rawContainer.summary)
    ? rawContainer.summary
    : isObject(rawContainer.totals)
      ? rawContainer.totals
      : isObject(rawContainer.metrics)
        ? rawContainer.metrics
        : null;
  if (!s) return null;

  const totalEmployees = pickFiniteNumber(s, "totalEmployees", "total_employees", "employeeCount", "employee_count");
  const assignedEmployees = pickFiniteNumber(
    s,
    "assignedEmployees",
    "assigned_employees",
    "employeesWithAssignedCompensation",
    "employees_with_assigned_compensation"
  );
  const totalAnnualCtcPaise = resolveMoneyFieldToPaise(
    [s],
    ["totalAnnualCtcPaise", "total_annual_ctc_paise", "totalCtcPaise", "total_ctc_paise"],
    ["totalAnnualCtc", "total_annual_ctc", "totalCtc", "total_ctc"]
  );
  const totalMonthlyGrossPaise = resolveMoneyFieldToPaise(
    [s],
    ["totalMonthlyGrossPaise", "total_monthly_gross_paise"],
    ["totalMonthlyGross", "total_monthly_gross"]
  );
  const averageAnnualCtcPaise = resolveMoneyFieldToPaise(
    [s],
    ["averageAnnualCtcPaise", "average_annual_ctc_paise", "avgAnnualCtcPaise", "avg_annual_ctc_paise"],
    ["averageAnnualCtc", "average_annual_ctc", "avgAnnualCtc", "avg_annual_ctc"]
  );
  const pendingRevisions = pickFiniteNumber(
    s,
    "pendingRevisions",
    "pending_revisions",
    "pendingCtcRevisions",
    "pending_ctc_revisions"
  );
  const unassignedEmployees = pickFiniteNumber(
    s,
    "unassignedEmployees",
    "unassigned_employees",
    "employeesWithoutSalaryStructure",
    "employees_without_salary_structure"
  );
  const structuresInUse = pickFiniteNumber(s, "structuresInUse", "structures_in_use");

  if (
    totalEmployees === null &&
    assignedEmployees === null &&
    totalAnnualCtcPaise === null &&
    totalMonthlyGrossPaise === null &&
    averageAnnualCtcPaise === null &&
    pendingRevisions === null &&
    unassignedEmployees === null
  ) {
    return null;
  }

  return {
    totalEmployees,
    assignedEmployees,
    totalAnnualCtcPaise,
    totalMonthlyGrossPaise,
    averageAnnualCtcPaise,
    pendingRevisions,
    unassignedEmployees,
    structuresInUse,
    source: "backend_summary",
  };
}

function normalizeEmployeeMaster(raw: unknown): CompensationMasterEmployee | null {
  if (!isObject(raw)) return null;
  const id = pickStr(raw, "id", "employee_uuid") || "";
  if (!id) return null;
  const rawCode = pickStr(raw, "employee_code", "employeeCode", "employee_id", "employeeId", "code");
  const first = pickStr(raw, "first_name", "firstName") || "";
  const last = pickStr(raw, "last_name", "lastName") || "";
  const fullName =
    `${first} ${last}`.trim() ||
    pickStr(raw, "full_name", "fullName", "name", "employee_name", "employeeName") ||
    "";
  const deptObj = isObject(raw.department) ? raw.department : null;

  return {
    id,
    employeeCode: rawCode && !isUuidLike(rawCode) ? rawCode : "",
    fullName,
    departmentId: pickStr(raw, "department_id", "departmentId") || pickStr(deptObj, "id"),
    department:
      pickStr(raw, "department_name", "departmentName", "department") ||
      pickStr(deptObj, "name"),
    designation: pickStr(raw, "designation", "designation_name", "title", "job_title"),
    employmentType: pickStr(raw, "employment_type", "employmentType"),
    joiningDate: pickStr(raw, "joining_date", "joiningDate", "date_of_joining", "dateOfJoining"),
    profileImage: pickStr(raw, "profile_photo_url", "avatar_url", "avatar", "profilePhotoUrl", "avatarUrl"),
  };
}

/**
 * Enriches compensation records strictly using verified employee, structure, and
 * department lookups when the `/api/v2/payroll/compensations` payload omits joined metadata.
 * Never fabricates salaries, structures, or statuses.
 */
export function enrichCompensationWithLookups(
  item: EmployeeCompensation,
  lookups?: {
    employeesById?: Map<string, CompensationMasterEmployee>;
    structuresById?: Map<string, SalaryStructureTemplate>;
    departmentsById?: Map<string, string>;
  }
): EmployeeCompensation {
  if (!lookups) return item;
  const emp = lookups.employeesById?.get(item.employeeId);
  const struct = item.structureId ? lookups.structuresById?.get(item.structureId) : undefined;
  const deptById =
    item.departmentId
      ? lookups.departmentsById?.get(item.departmentId)
      : emp?.departmentId
        ? lookups.departmentsById?.get(emp.departmentId)
        : undefined;

  const resolvedName = item.employeeName || emp?.fullName || "";
  const resolvedCode =
    item.employeeCode || (!isUuidLike(emp?.employeeCode) ? emp?.employeeCode : "") || "";
  const resolvedDepartment = item.department || emp?.department || deptById || "";
  const resolvedDesignation = item.designation || emp?.designation || "";
  const resolvedEmploymentType = item.employmentType || emp?.employmentType;
  const resolvedJoiningDate = item.joiningDate || emp?.joiningDate;
  const resolvedImage = item.profileImage || emp?.profileImage;

  const resolvedStructureName =
    item.structureName && item.structureName !== "Not Assigned"
      ? item.structureName
      : struct?.name
        ? struct.name
        : item.structureId
          ? ""
          : "Not Assigned";

  return {
    ...item,
    employeeName: resolvedName,
    employeeCode: resolvedCode,
    department: resolvedDepartment,
    designation: resolvedDesignation,
    employmentType: resolvedEmploymentType,
    joiningDate: resolvedJoiningDate,
    profileImage: resolvedImage,
    structureCode: item.structureCode || struct?.code,
    structureName: resolvedStructureName,
  };
}

export function buildBulkPreviewNormalized(raw: unknown): BulkCompensationPreviewResult {
  const d = isObject(raw) ? raw : {};
  const totalNewCtcPaise = resolveMoneyFieldToPaise(
    [d],
    ["totalNewCtcPaise", "total_new_ctc_paise"],
    ["totalNewCtc", "total_new_ctc"]
  ) ?? 0;
  const rawErrors = pickValue(d, "errors");
  const errors = Array.isArray(rawErrors)
    ? rawErrors.map((err, i) => {
        const e = isObject(err) ? err : {};
        return {
          rowNumber: pickFiniteNumber(e, "rowNumber", "row_number") ?? i + 1,
          employeeCode: pickStr(e, "employeeCode", "employee_code") || "—",
          componentCode: pickStr(e, "componentCode", "component_code") || "—",
          errorCode: pickStr(e, "errorCode", "error_code") || "VALIDATION_ERROR",
          errorMessage: pickStr(e, "errorMessage", "error_message", "message") || "Invalid row",
        };
      })
    : [];

  return {
    previewToken: pickStr(d, "previewToken", "preview_token", "token") || "",
    fileName: pickStr(d, "fileName", "file_name") || "bulk-import.csv",
    totalRows: pickFiniteNumber(d, "totalRows", "total_rows") ?? 0,
    validRows: pickFiniteNumber(d, "validRows", "valid_rows") ?? 0,
    invalidRows: pickFiniteNumber(d, "invalidRows", "invalid_rows") ?? errors.length,
    duplicateRows: pickFiniteNumber(d, "duplicateRows", "duplicate_rows") ?? 0,
    affectedEmployeesCount:
      pickFiniteNumber(d, "affectedEmployeesCount", "affected_employees_count") ?? 0,
    totalNewCtcPaise,
    totalNewCtcFormatted:
      pickStr(d, "totalNewCtcFormatted", "total_new_ctc_formatted") || formatINR(totalNewCtcPaise / 100),
    errors,
  };
}

export const compensationApi = {
  // ── Pay Component Master ──────────────────────────────────────────
  async getPayComponents(): Promise<PayComponent[]> {
    const res = await apiInstance.get("/api/v2/payroll/pay-components", {
      headers: NO_STORE_HEADERS,
    });
    const unwrapped = unwrapEnvelope<unknown>(res.data);
    const arr = Array.isArray(unwrapped)
      ? unwrapped
      : isObject(unwrapped) && Array.isArray(unwrapped.items)
        ? unwrapped.items
        : [];
    return arr.map((item, idx) => normalizePayComponent(item, idx));
  },

  async createPayComponent(payload: CreatePayComponentPayload): Promise<PayComponent> {
    const res = await apiInstance.post("/api/v2/payroll/pay-components", payload, {
      headers: {
        "Idempotency-Key": generateIdempotencyKey(),
        ...NO_STORE_HEADERS,
      },
    });
    return normalizePayComponent(unwrapEnvelope<unknown>(res.data));
  },

  // ── Salary Structure Templates ────────────────────────────────────
  async getSalaryStructures(): Promise<SalaryStructureTemplate[]> {
    const res = await apiInstance.get("/api/v1/payroll/salary-structures", {
      headers: NO_STORE_HEADERS,
    });
    const unwrapped = unwrapEnvelope<unknown>(res.data);
    const arr = Array.isArray(unwrapped)
      ? unwrapped
      : isObject(unwrapped) && Array.isArray(unwrapped.items)
        ? unwrapped.items
        : [];
    return arr.map((item, idx) => normalizeSalaryStructure(item, idx));
  },

  async createSalaryStructure(
    payload: CreateSalaryStructurePayload
  ): Promise<SalaryStructureTemplate> {
    const res = await apiInstance.post("/api/v1/payroll/salary-structures", payload, {
      headers: {
        "Idempotency-Key": generateIdempotencyKey(),
        ...NO_STORE_HEADERS,
      },
    });
    const unwrapped = unwrapEnvelope<unknown>(res.data);
    return normalizeSalaryStructure(Array.isArray(unwrapped) ? unwrapped[0] : unwrapped);
  },

  async getEmployeeSalaryStructure(employeeId: string): Promise<SalaryStructureTemplate | null> {
    if (!employeeId) return null;
    try {
      const res = await apiInstance.get(
        `/api/v1/payroll/employees/${employeeId}/salary-structure`,
        { headers: NO_STORE_HEADERS }
      );
      const unwrapped = unwrapEnvelope<unknown>(res.data);
      if (!unwrapped || (isObject(unwrapped) && Object.keys(unwrapped).length === 0)) {
        return null;
      }
      return normalizeSalaryStructure(unwrapped);
    } catch {
      return null;
    }
  },

  async assignSalaryStructure(
    structureId: string,
    payload: AssignSalaryStructurePayload
  ): Promise<unknown> {
    const res = await apiInstance.post(
      `/api/v1/payroll/salary-structures/${structureId}/assign`,
      payload,
      {
        headers: {
          "Idempotency-Key": generateIdempotencyKey(),
          ...NO_STORE_HEADERS,
        },
      }
    );
    return unwrapEnvelope<unknown>(res.data);
  },

  // ── Master Metadata Lookups (Batch — Avoids N+1) ──────────────────
  async getMasterLookups(): Promise<{
    employees: CompensationMasterEmployee[];
    employeesById: Map<string, CompensationMasterEmployee>;
    structures: SalaryStructureTemplate[];
    structuresById: Map<string, SalaryStructureTemplate>;
    departments: string[];
    departmentsById: Map<string, string>;
    designations: string[];
  }> {
    const [empRes, structRes, deptRes] = await Promise.allSettled([
      apiInstance.get("/api/v1/employees", {
        params: { page: 1, limit: 500 },
        headers: NO_STORE_HEADERS,
      }),
      this.getSalaryStructures(),
      departmentsApi.getDepartments({ limit: 200 }),
    ]);

    const employeesById = new Map<string, CompensationMasterEmployee>();
    const employees: CompensationMasterEmployee[] = [];
    if (empRes.status === "fulfilled") {
      const raw = unwrapEnvelope<unknown>(empRes.value.data);
      const rawItems = Array.isArray(raw)
        ? raw
        : isObject(raw) && Array.isArray(raw.items)
          ? raw.items
          : [];
      for (const entry of rawItems) {
        const mapped = normalizeEmployeeMaster(entry);
        if (mapped) {
          employees.push(mapped);
          employeesById.set(mapped.id, mapped);
          if (mapped.employeeCode) {
            employeesById.set(mapped.employeeCode, mapped);
          }
        }
      }
    }

    const structures = structRes.status === "fulfilled" ? structRes.value : [];
    const structuresById = new Map<string, SalaryStructureTemplate>();
    for (const s of structures) {
      structuresById.set(s.id, s);
    }

    const departmentsById = new Map<string, string>();
    const deptSet = new Set<string>();
    if (deptRes.status === "fulfilled") {
      for (const d of deptRes.value.items) {
        if (d.id && d.name) departmentsById.set(d.id, d.name);
        if (d.name) deptSet.add(d.name);
      }
    }
    const desigSet = new Set<string>();
    for (const e of employees) {
      if (e.department) deptSet.add(e.department);
      if (e.designation) desigSet.add(e.designation);
    }

    return {
      employees,
      employeesById,
      structures,
      structuresById,
      departments: Array.from(deptSet).sort((a, b) => a.localeCompare(b)),
      departmentsById,
      designations: Array.from(desigSet).sort((a, b) => a.localeCompare(b)),
    };
  },

  // ── Employee Compensation & Revisions ─────────────────────────────
  async getEmployeeCompensations(
    params?: EmployeeCompensationListParams
  ): Promise<EmployeeCompensationListResult> {
    const cleanParams: Record<string, unknown> = {};
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null && v !== "" && v !== "all") {
          cleanParams[k] = v;
        }
      }
    }

    const res = await apiInstance.get("/api/v2/payroll/compensations", {
      params: Object.keys(cleanParams).length > 0 ? cleanParams : undefined,
      headers: NO_STORE_HEADERS,
    });

    const unwrapped = unwrapEnvelope<unknown>(res.data);
    let rawItems: unknown[] = [];
    let container: RawRecord = {};

    if (Array.isArray(unwrapped)) {
      rawItems = unwrapped;
    } else if (isObject(unwrapped)) {
      container = unwrapped;
      const listCandidate =
        unwrapped.items ??
        unwrapped.rows ??
        unwrapped.records ??
        unwrapped.compensations ??
        unwrapped.employees;
      if (Array.isArray(listCandidate)) {
        rawItems = listCandidate;
      }
    }

    const items = rawItems.map((item, idx) => normalizeEmployeeCompensation(item, idx));
    const total =
      pickFiniteNumber(container, "total", "totalRecords", "total_records", "count") ??
      items.length;
    const page = pickFiniteNumber(container, "page") ?? params?.page ?? 1;
    const limit = pickFiniteNumber(container, "limit", "page_size") ?? params?.limit ?? 20;
    const summary = normalizeSummaryMetrics(container);

    return {
      items,
      total,
      page,
      limit,
      summary,
    };
  },

  async getEmployeeCompensationDetail(employeeId: string): Promise<EmployeeCompensation> {
    const res = await apiInstance.get(`/api/v2/payroll/employees/${employeeId}/compensation`, {
      headers: NO_STORE_HEADERS,
    });
    const unwrapped = unwrapEnvelope<unknown>(res.data);
    return normalizeEmployeeCompensation(unwrapped);
  },

  async proposeCompensationRevision(
    employeeId: string,
    payload: ProposeRevisionPayload
  ): Promise<CompensationRevisionRecord> {
    const res = await apiInstance.post(
      `/api/v2/payroll/employees/${employeeId}/compensation/revisions`,
      payload,
      {
        headers: {
          "Idempotency-Key": generateIdempotencyKey(),
          ...NO_STORE_HEADERS,
        },
      }
    );
    return normalizeRevisionRecord(unwrapEnvelope<unknown>(res.data));
  },

  async approveCompensationRevision(
    revisionId: string,
    remarks: string
  ): Promise<CompensationRevisionRecord> {
    const res = await apiInstance.post(
      `/api/v2/payroll/compensation/revisions/${revisionId}/approve`,
      { remarks },
      {
        headers: {
          "Idempotency-Key": generateIdempotencyKey(),
          ...NO_STORE_HEADERS,
        },
      }
    );
    return normalizeRevisionRecord(unwrapEnvelope<unknown>(res.data));
  },

  async rejectCompensationRevision(
    revisionId: string,
    reason: string
  ): Promise<CompensationRevisionRecord> {
    const res = await apiInstance.post(
      `/api/v2/payroll/compensation/revisions/${revisionId}/reject`,
      { reason },
      {
        headers: {
          "Idempotency-Key": generateIdempotencyKey(),
          ...NO_STORE_HEADERS,
        },
      }
    );
    return normalizeRevisionRecord(unwrapEnvelope<unknown>(res.data));
  },

  // ── Bulk Compensation Import ──────────────────────────────────────
  async previewBulkCompensation(file: File): Promise<BulkCompensationPreviewResult> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiInstance.post(
      "/api/v2/payroll/compensation/bulk-import/preview",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          ...NO_STORE_HEADERS,
        },
      }
    );
    return buildBulkPreviewNormalized(unwrapEnvelope<unknown>(res.data));
  },

  async applyBulkCompensation(
    previewToken: string
  ): Promise<{ appliedCount: number; message: string }> {
    const res = await apiInstance.post(
      "/api/v2/payroll/compensation/bulk-import/apply",
      { previewToken },
      {
        headers: {
          "Idempotency-Key": generateIdempotencyKey(),
          ...NO_STORE_HEADERS,
        },
      }
    );
    const d = unwrapEnvelope<unknown>(res.data);
    const obj = isObject(d) ? d : {};
    return {
      appliedCount: pickFiniteNumber(obj, "appliedCount", "applied_count") ?? 0,
      message: pickStr(obj, "message") || "Bulk compensation applied",
    };
  },
};
