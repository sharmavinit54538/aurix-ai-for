import { api } from "@/api";
import { ApiError } from "@/api/client";
import {
  ApprovalStep,
  SalaryComponent,
  SalaryStructure,
  SalaryStructureAIInsight,
  SalaryStructureAuditLog,
  SalaryStructureFilters,
  SalaryStructureSummaryKPIs,
  StructureVersion,
} from "@/features/admin/payroll/components/salary-structure/salaryStructureTypes";

export const DEFAULT_SEED_STRUCTURES: SalaryStructure[] = [
  {
    id: "str_exec_01",
    name: "Executive Leadership Compensation Band",
    code: "STR-EXEC-L7",
    description: "Executive band structure for CXOs, VPs, and Department Directors with performance retainers.",
    salaryGrade: "L7 - Executive",
    salaryBand: "Band 7",
    department: "Executive Management",
    designation: "Chief Officer / Vice President",
    location: "Global / HQ",
    employmentType: "EXECUTIVE",
    currency: "INR",
    annualCtc: 3600000,
    monthlyCtc: 300000,
    grossSalaryMonthly: 270000,
    netSalaryMonthly: 215000,
    employerCostMonthly: 30000,
    grossSalaryFormula: "BASIC + HRA + SPECIAL_ALLOWANCE + RETAINER",
    netSalaryFormula: "GROSS - (PF + PT + TDS)",
    status: "ACTIVE",
    version: "v2.1",
    versionCount: 3,
    versions: [
      {
        id: "ver_exec_21",
        version: "v2.1",
        effectiveFrom: "2026-04-01",
        changeSummary: "Updated L7 executive performance retainer and enhanced medical insurance coverage.",
        createdBy: "Radhika Sharma (CHRO)",
        createdAt: "2026-03-25T10:00:00Z",
        status: "ACTIVE",
        annualCtc: 3600000,
        componentsCount: 8,
      },
      {
        id: "ver_exec_20",
        version: "v2.0",
        effectiveFrom: "2025-04-01",
        changeSummary: "Implemented Code on Wages 2026 50% Basic salary compliance.",
        createdBy: "System Admin",
        createdAt: "2025-03-20T14:30:00Z",
        status: "SUPERSEDED",
        annualCtc: 3200000,
        componentsCount: 7,
      },
    ],
    employeesAssigned: 4,
    components: [
      {
        id: "cmp_exec_1",
        code: "BASIC",
        name: "Basic Pay",
        type: "EARNING",
        category: "BASIC",
        calculationType: "PERCENTAGE",
        value: 50,
        baseComponentCode: "CTC",
        formulaExpression: "CTC * 0.50",
        isTaxable: true,
        isStatutory: true,
        isFlexible: false,
        frequency: "MONTHLY",
        description: "Core basic salary constituting 50% of annual CTC.",
      },
      {
        id: "cmp_exec_2",
        code: "HRA",
        name: "House Rent Allowance",
        type: "EARNING",
        category: "HRA",
        calculationType: "PERCENTAGE",
        value: 40,
        baseComponentCode: "BASIC",
        formulaExpression: "BASIC * 0.40",
        isTaxable: true,
        isStatutory: false,
        isFlexible: true,
        frequency: "MONTHLY",
        description: "40% of Basic Pay as housing allowance.",
      },
      {
        id: "cmp_exec_3",
        code: "SPECIAL_ALLOWANCE",
        name: "Executive Special Allowance",
        type: "EARNING",
        category: "SPECIAL_ALLOWANCE",
        calculationType: "FIXED",
        value: 40000,
        isTaxable: true,
        isStatutory: false,
        isFlexible: true,
        frequency: "MONTHLY",
        description: "Balancing component for executive CTC.",
      },
      {
        id: "cmp_exec_4",
        code: "PERFORMANCE_BONUS",
        name: "Variable Performance Pay",
        type: "EARNING",
        category: "PERFORMANCE_BONUS",
        calculationType: "FIXED",
        value: 20000,
        isTaxable: true,
        isStatutory: false,
        isFlexible: true,
        frequency: "MONTHLY",
        description: "Quarterly performance bonus payout component.",
      },
      {
        id: "cmp_exec_5",
        code: "PF",
        name: "Provident Fund (Employee)",
        type: "DEDUCTION",
        category: "PF",
        calculationType: "FIXED",
        value: 1800,
        isTaxable: false,
        isStatutory: true,
        isFlexible: false,
        frequency: "MONTHLY",
        description: "Statutory EPF deduction (Capped at Rs. 1,800).",
      },
      {
        id: "cmp_exec_6",
        code: "PROFESSIONAL_TAX",
        name: "Professional Tax (PT)",
        type: "DEDUCTION",
        category: "PROFESSIONAL_TAX",
        calculationType: "FIXED",
        value: 200,
        isTaxable: false,
        isStatutory: true,
        isFlexible: false,
        frequency: "MONTHLY",
        description: "State professional tax slab.",
      },
      {
        id: "cmp_exec_7",
        code: "TDS",
        name: "Income Tax (TDS)",
        type: "DEDUCTION",
        category: "INCOME_TAX",
        calculationType: "FORMULA",
        value: 53000,
        formulaExpression: "TAX_SLAB_CALC(GROSS)",
        isTaxable: false,
        isStatutory: true,
        isFlexible: false,
        frequency: "MONTHLY",
        description: "New Tax Regime monthly TDS deduction.",
      },
      {
        id: "cmp_exec_8",
        code: "EMPLOYER_PF",
        name: "Employer EPF Contribution",
        type: "EMPLOYER_CONTRIBUTION",
        category: "EMPLOYER_PF",
        calculationType: "FIXED",
        value: 1800,
        isTaxable: false,
        isStatutory: true,
        isFlexible: false,
        frequency: "MONTHLY",
        description: "Employer 12% statutory PF match.",
      },
    ],
    approvalStage: "PUBLISHED",
    approvalWorkflow: [
      { role: "HR Manager", name: "Radhika Sharma", status: "APPROVED", timestamp: "2026-03-24T11:00:00Z", comments: "Validated structure against Code on Wages." },
      { role: "Payroll Admin", name: "Vikram Malhotra", status: "APPROVED", timestamp: "2026-03-24T14:20:00Z", comments: "TDS rules synced with FY26-27 tax slabs." },
      { role: "Finance Manager", name: "Ananya Iyer", status: "APPROVED", timestamp: "2026-03-25T09:15:00Z", comments: "Budget allocated." },
      { role: "CFO", name: "Suresh Menon", status: "APPROVED", timestamp: "2026-03-25T10:00:00Z", comments: "Approved Executive Band." },
    ],
    effectiveFrom: "2026-04-01",
    createdBy: "Radhika Sharma",
    createdOn: "2026-03-24T11:00:00Z",
    updatedBy: "Suresh Menon",
    updatedOn: "2026-03-25T10:00:00Z",
    complianceWarnings: [],
    isLocked: true,
  },
  {
    id: "str_eng_04",
    name: "Senior Software Engineering Grade 4",
    code: "STR-ENG-L4",
    description: "Standard structure for Tech Leads, Senior Software Engineers, and Solution Architects.",
    salaryGrade: "L4 - Senior Specialist",
    salaryBand: "Band 4",
    department: "Engineering",
    designation: "Senior Engineer / Tech Lead",
    location: "Bangalore / Noida",
    employmentType: "FULL_TIME",
    currency: "INR",
    annualCtc: 1800000,
    monthlyCtc: 150000,
    grossSalaryMonthly: 140000,
    netSalaryMonthly: 122000,
    employerCostMonthly: 10000,
    grossSalaryFormula: "BASIC + HRA + CONVEYANCE + SPECIAL_ALLOWANCE",
    netSalaryFormula: "GROSS - (PF + PT + TDS)",
    status: "ACTIVE",
    version: "v1.4",
    versionCount: 2,
    versions: [
      {
        id: "ver_eng_14",
        version: "v1.4",
        effectiveFrom: "2026-04-01",
        changeSummary: "Added flexi-benefit meal allowance and revised HRA.",
        createdBy: "Priya Nair (HR Manager)",
        createdAt: "2026-03-10T12:00:00Z",
        status: "ACTIVE",
        annualCtc: 1800000,
        componentsCount: 7,
      },
    ],
    employeesAssigned: 12,
    components: [
      {
        id: "cmp_eng_1",
        code: "BASIC",
        name: "Basic Pay",
        type: "EARNING",
        category: "BASIC",
        calculationType: "PERCENTAGE",
        value: 50,
        baseComponentCode: "CTC",
        formulaExpression: "CTC * 0.50",
        isTaxable: true,
        isStatutory: true,
        isFlexible: false,
        frequency: "MONTHLY",
        description: "50% of CTC basic salary.",
      },
      {
        id: "cmp_eng_2",
        code: "HRA",
        name: "House Rent Allowance",
        type: "EARNING",
        category: "HRA",
        calculationType: "PERCENTAGE",
        value: 40,
        baseComponentCode: "BASIC",
        formulaExpression: "BASIC * 0.40",
        isTaxable: true,
        isStatutory: false,
        isFlexible: true,
        frequency: "MONTHLY",
        description: "40% of Basic Pay.",
      },
      {
        id: "cmp_eng_3",
        code: "CONVEYANCE",
        name: "Conveyance Allowance",
        type: "EARNING",
        category: "TRAVEL",
        calculationType: "FIXED",
        value: 1600,
        isTaxable: false,
        isStatutory: false,
        isFlexible: false,
        frequency: "MONTHLY",
        description: "Tax-free conveyance up to Rs. 1,600/month.",
      },
      {
        id: "cmp_eng_4",
        code: "SPECIAL_ALLOWANCE",
        name: "Special Allowance",
        type: "EARNING",
        category: "SPECIAL_ALLOWANCE",
        calculationType: "FIXED",
        value: 33400,
        isTaxable: true,
        isStatutory: false,
        isFlexible: true,
        frequency: "MONTHLY",
        description: "Flexible special allowance.",
      },
      {
        id: "cmp_eng_5",
        code: "PF",
        name: "Provident Fund (Employee)",
        type: "DEDUCTION",
        category: "PF",
        calculationType: "FIXED",
        value: 1800,
        isTaxable: false,
        isStatutory: true,
        isFlexible: false,
        frequency: "MONTHLY",
        description: "Statutory EPF deduction.",
      },
      {
        id: "cmp_eng_6",
        code: "PROFESSIONAL_TAX",
        name: "Professional Tax (PT)",
        type: "DEDUCTION",
        category: "PROFESSIONAL_TAX",
        calculationType: "FIXED",
        value: 200,
        isTaxable: false,
        isStatutory: true,
        isFlexible: false,
        frequency: "MONTHLY",
        description: "Monthly PT deduction.",
      },
      {
        id: "cmp_eng_7",
        code: "TDS",
        name: "Income Tax (TDS)",
        type: "DEDUCTION",
        category: "INCOME_TAX",
        calculationType: "FIXED",
        value: 16000,
        isTaxable: false,
        isStatutory: true,
        isFlexible: false,
        frequency: "MONTHLY",
        description: "Estimated monthly TDS.",
      },
    ],
    approvalStage: "PUBLISHED",
    approvalWorkflow: [
      { role: "HR Manager", name: "Priya Nair", status: "APPROVED", timestamp: "2026-03-10T12:00:00Z" },
      { role: "Payroll Admin", name: "Vikram Malhotra", status: "APPROVED", timestamp: "2026-03-10T15:00:00Z" },
      { role: "Finance Manager", name: "Ananya Iyer", status: "APPROVED", timestamp: "2026-03-11T10:00:00Z" },
    ],
    effectiveFrom: "2026-04-01",
    createdBy: "Priya Nair",
    createdOn: "2026-03-10T12:00:00Z",
    updatedBy: "Ananya Iyer",
    updatedOn: "2026-03-11T10:00:00Z",
    complianceWarnings: [],
  },
  {
    id: "str_sales_02",
    name: "Sales & Business Development Level 2",
    code: "STR-SALES-L2",
    description: "Compensation structure for Account Managers, BD Executives, and Field Operations.",
    salaryGrade: "L2 - Associate Specialist",
    salaryBand: "Band 2",
    department: "Sales&Marketing",
    designation: "Sales Executive / Account Manager",
    location: "Mumbai / All India",
    employmentType: "FULL_TIME",
    currency: "INR",
    annualCtc: 960000,
    monthlyCtc: 80000,
    grossSalaryMonthly: 74000,
    netSalaryMonthly: 67800,
    employerCostMonthly: 6000,
    grossSalaryFormula: "BASIC + HRA + TRAVEL_ALLOWANCE + SHIFT_ALLOWANCE",
    netSalaryFormula: "GROSS - (PF + PT + TDS)",
    status: "ACTIVE",
    version: "v1.0",
    versionCount: 1,
    versions: [
      {
        id: "ver_sales_10",
        version: "v1.0",
        effectiveFrom: "2026-01-01",
        changeSummary: "Initial creation of Sales Level 2 template.",
        createdBy: "Priya Nair",
        createdAt: "2025-12-15T09:00:00Z",
        status: "ACTIVE",
        annualCtc: 960000,
        componentsCount: 6,
      },
    ],
    employeesAssigned: 8,
    components: [
      {
        id: "cmp_sales_1",
        code: "BASIC",
        name: "Basic Pay",
        type: "EARNING",
        category: "BASIC",
        calculationType: "FIXED",
        value: 40000,
        isTaxable: true,
        isStatutory: true,
        isFlexible: false,
        frequency: "MONTHLY",
        description: "Basic pay.",
      },
      {
        id: "cmp_sales_2",
        code: "HRA",
        name: "House Rent Allowance",
        type: "EARNING",
        category: "HRA",
        calculationType: "FIXED",
        value: 16000,
        isTaxable: true,
        isStatutory: false,
        isFlexible: true,
        frequency: "MONTHLY",
        description: "HRA 40%.",
      },
      {
        id: "cmp_sales_3",
        code: "TRAVEL",
        name: "Field Travel Allowance",
        type: "EARNING",
        category: "TRAVEL",
        calculationType: "FIXED",
        value: 8000,
        isTaxable: false,
        isStatutory: false,
        isFlexible: true,
        frequency: "MONTHLY",
        description: "Client travel reimbursement allowance.",
      },
      {
        id: "cmp_sales_4",
        code: "SPECIAL_ALLOWANCE",
        name: "Special Allowance",
        type: "EARNING",
        category: "SPECIAL_ALLOWANCE",
        calculationType: "FIXED",
        value: 10000,
        isTaxable: true,
        isStatutory: false,
        isFlexible: true,
        frequency: "MONTHLY",
        description: "Special allowance.",
      },
      {
        id: "cmp_sales_5",
        code: "PF",
        name: "Provident Fund (Employee)",
        type: "DEDUCTION",
        category: "PF",
        calculationType: "FIXED",
        value: 1800,
        isTaxable: false,
        isStatutory: true,
        isFlexible: false,
        frequency: "MONTHLY",
        description: "EPF.",
      },
      {
        id: "cmp_sales_6",
        code: "PT",
        name: "Professional Tax",
        type: "DEDUCTION",
        category: "PROFESSIONAL_TAX",
        calculationType: "FIXED",
        value: 200,
        isTaxable: false,
        isStatutory: true,
        isFlexible: false,
        frequency: "MONTHLY",
        description: "PT.",
      },
    ],
    approvalStage: "PUBLISHED",
    approvalWorkflow: [
      { role: "HR Manager", name: "Priya Nair", status: "APPROVED", timestamp: "2025-12-15T09:00:00Z" },
      { role: "Payroll Admin", name: "Vikram Malhotra", status: "APPROVED", timestamp: "2025-12-15T11:00:00Z" },
    ],
    effectiveFrom: "2026-01-01",
    createdBy: "Priya Nair",
    createdOn: "2025-12-15T09:00:00Z",
    updatedBy: "Vikram Malhotra",
    updatedOn: "2025-12-15T11:00:00Z",
    complianceWarnings: [],
  },
  {
    id: "str_ops_01",
    name: "Operations & Support Standard Structure",
    code: "STR-OPS-L1",
    description: "Entry-level structure for operations associates and support representatives.",
    salaryGrade: "L1 - Entry Level",
    salaryBand: "Band 1",
    department: "Operations",
    designation: "Support Associate",
    location: "Noida / Remote",
    employmentType: "FULL_TIME",
    currency: "INR",
    annualCtc: 600000,
    monthlyCtc: 50000,
    grossSalaryMonthly: 46800,
    netSalaryMonthly: 42425,
    employerCostMonthly: 3200,
    grossSalaryFormula: "BASIC + HRA + FOOD_ALLOWANCE + SPECIAL_ALLOWANCE",
    netSalaryFormula: "GROSS - (PF + ESI + PT)",
    status: "DRAFT",
    version: "v1.0",
    versionCount: 1,
    versions: [
      {
        id: "ver_ops_10",
        version: "v1.0",
        effectiveFrom: "2026-05-01",
        changeSummary: "Draft operations template for upcoming intake.",
        createdBy: "Priya Nair",
        createdAt: "2026-04-01T10:00:00Z",
        status: "DRAFT",
        annualCtc: 600000,
        componentsCount: 6,
      },
    ],
    employeesAssigned: 5,
    components: [
      {
        id: "cmp_ops_1",
        code: "BASIC",
        name: "Basic Pay",
        type: "EARNING",
        category: "BASIC",
        calculationType: "FIXED",
        value: 25000,
        isTaxable: true,
        isStatutory: true,
        isFlexible: false,
        frequency: "MONTHLY",
        description: "Basic salary.",
      },
      {
        id: "cmp_ops_2",
        code: "HRA",
        name: "House Rent Allowance",
        type: "EARNING",
        category: "HRA",
        calculationType: "FIXED",
        value: 10000,
        isTaxable: true,
        isStatutory: false,
        isFlexible: true,
        frequency: "MONTHLY",
        description: "HRA.",
      },
      {
        id: "cmp_ops_3",
        code: "FOOD",
        name: "Meal Card Allowance",
        type: "EARNING",
        category: "FOOD",
        calculationType: "FIXED",
        value: 3000,
        isTaxable: false,
        isStatutory: false,
        isFlexible: true,
        frequency: "MONTHLY",
        description: "Tax-free meal coupons.",
      },
      {
        id: "cmp_ops_4",
        code: "SPECIAL_ALLOWANCE",
        name: "Special Allowance",
        type: "EARNING",
        category: "SPECIAL_ALLOWANCE",
        calculationType: "FIXED",
        value: 8800,
        isTaxable: true,
        isStatutory: false,
        isFlexible: true,
        frequency: "MONTHLY",
        description: "Balancing component.",
      },
      {
        id: "cmp_ops_5",
        code: "PF",
        name: "Provident Fund (Employee)",
        type: "DEDUCTION",
        category: "PF",
        calculationType: "FIXED",
        value: 1800,
        isTaxable: false,
        isStatutory: true,
        isFlexible: false,
        frequency: "MONTHLY",
        description: "EPF.",
      },
      {
        id: "cmp_ops_6",
        code: "ESI",
        name: "ESI (Employee)",
        type: "DEDUCTION",
        category: "ESI",
        calculationType: "PERCENTAGE",
        value: 0.75,
        baseComponentCode: "GROSS",
        isTaxable: false,
        isStatutory: true,
        isFlexible: false,
        frequency: "MONTHLY",
        description: "0.75% ESI employee contribution.",
      },
    ],
    approvalStage: "HR",
    approvalWorkflow: [
      { role: "HR Manager", name: "Priya Nair", status: "PENDING" },
      { role: "Payroll Admin", name: "Vikram Malhotra", status: "PENDING" },
    ],
    effectiveFrom: "2026-05-01",
    createdBy: "Priya Nair",
    createdOn: "2026-04-01T10:00:00Z",
    updatedBy: "Priya Nair",
    updatedOn: "2026-04-01T10:00:00Z",
    complianceWarnings: ["ESI applicable as Gross Pay is under Rs. 21,000 ceiling threshold."],
  },
];

function readString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function readNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function readBool(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function unwrapPayload(res: unknown): Record<string, unknown> | null {
  if (!res || typeof res !== "object") return null;
  const root = res as Record<string, unknown>;
  const nested = root.data;
  if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    return nested as Record<string, unknown>;
  }
  return root;
}

function extractListPayload(res: unknown): unknown[] {
  if (Array.isArray(res)) return res;
  if (!res || typeof res !== "object") return [];

  const root = res as Record<string, unknown>;
  const nested = root.data;

  if (Array.isArray(nested)) return nested;
  if (nested && typeof nested === "object") {
    const dataObj = nested as Record<string, unknown>;
    for (const key of ["items", "records", "rows", "structures", "results", "logs", "insights"]) {
      if (Array.isArray(dataObj[key])) return dataObj[key] as unknown[];
    }
  }

  for (const key of ["items", "records", "rows", "structures", "results", "logs", "insights"]) {
    if (Array.isArray(root[key])) return root[key] as unknown[];
  }

  return [];
}

function buildStructureQuery(params: Partial<SalaryStructureFilters>): string {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.department && params.department !== "all") query.set("department", params.department);
  if (params.designation && params.designation !== "all") query.set("designation", params.designation);
  if (params.location && params.location !== "all") query.set("location", params.location);
  if (params.employmentType && params.employmentType !== "all") query.set("employment_type", params.employmentType);
  if (params.salaryGrade && params.salaryGrade !== "all") query.set("salary_grade", params.salaryGrade);
  if (params.salaryBand && params.salaryBand !== "all") query.set("salary_band", params.salaryBand);
  if (params.financialYear) query.set("financial_year", params.financialYear);
  if (params.status && params.status !== "ALL" && params.status !== "all") query.set("status", params.status);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.sortBy) query.set("sort_by", params.sortBy);
  if (params.sortDir) query.set("sort_dir", params.sortDir);
  return query.toString();
}

function mapSalaryComponent(raw: unknown): SalaryComponent | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const id = readString(item.id ?? item.component_id);
  const code = readString(item.code ?? item.component_code);
  if (!id && !code) return null;

  return {
    id: id || code,
    code,
    name: readString(item.name ?? item.component_name, code),
    type: readString(item.type ?? item.component_type, "EARNING") as SalaryComponent["type"],
    category: readString(item.category ?? item.component_category, "CUSTOM") as SalaryComponent["category"],
    calculationType: readString(
      item.calculationType ?? item.calculation_type,
      "FIXED",
    ) as SalaryComponent["calculationType"],
    value: readNumber(item.value),
    baseComponentCode: readString(item.baseComponentCode ?? item.base_component_code) || undefined,
    formulaExpression: readString(item.formulaExpression ?? item.formula_expression) || undefined,
    conditionExpression: readString(item.conditionExpression ?? item.condition_expression) || undefined,
    isTaxable: readBool(item.isTaxable ?? item.is_taxable, true),
    isStatutory: readBool(item.isStatutory ?? item.is_statutory, false),
    isFlexible: readBool(item.isFlexible ?? item.is_flexible, false),
    frequency: (readString(item.frequency, "MONTHLY") as SalaryComponent["frequency"]) || "MONTHLY",
    description: readString(item.description) || undefined,
    minAmount: readNumber(item.minAmount ?? item.min_amount) || undefined,
    maxAmount: readNumber(item.maxAmount ?? item.max_amount) || undefined,
  };
}

function mapApprovalStep(raw: unknown): ApprovalStep | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const role = readString(item.role);
  if (!role) return null;

  return {
    role: role as ApprovalStep["role"],
    name: readString(item.name ?? item.approver_name, "Approver"),
    avatar: readString(item.avatar ?? item.avatar_url) || undefined,
    status: readString(item.status, "PENDING") as ApprovalStep["status"],
    timestamp: readString(item.timestamp ?? item.approved_at) || undefined,
    comments: readString(item.comments ?? item.comment) || undefined,
  };
}

function mapStructureVersion(raw: unknown): StructureVersion | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const id = readString(item.id ?? item.version_id ?? item.version);
  if (!id) return null;

  return {
    id,
    version: readString(item.version, id),
    effectiveFrom: readString(item.effectiveFrom ?? item.effective_from),
    effectiveTo: readString(item.effectiveTo ?? item.effective_to) || null,
    changeSummary: readString(item.changeSummary ?? item.change_summary),
    createdBy: readString(item.createdBy ?? item.created_by),
    createdAt: readString(item.createdAt ?? item.created_at),
    status: readString(item.status, "ACTIVE") as StructureVersion["status"],
    annualCtc: readNumber(item.annualCtc ?? item.annual_ctc) || undefined,
    componentsCount: readNumber(item.componentsCount ?? item.components_count) || undefined,
  };
}

function mapSalaryStructure(raw: unknown): SalaryStructure | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const id = readString(item.id ?? item.structure_id);
  if (!id) return null;

  const components = (Array.isArray(item.components) ? item.components : [])
    .map(mapSalaryComponent)
    .filter((component): component is SalaryComponent => Boolean(component));

  const versions = (Array.isArray(item.versions) ? item.versions : [])
    .map(mapStructureVersion)
    .filter((version): version is StructureVersion => Boolean(version));

  const rawWorkflow = (item.approvalWorkflow ?? item.approval_workflow) as unknown[] | undefined;
  const approvalWorkflow = (Array.isArray(rawWorkflow) ? rawWorkflow : [])
    .map(mapApprovalStep)
    .filter((step: unknown): step is ApprovalStep => Boolean(step));

  const complianceWarnings = Array.isArray(item.complianceWarnings ?? item.compliance_warnings)
    ? ((item.complianceWarnings ?? item.compliance_warnings) as unknown[]).map((warning) => readString(warning)).filter(Boolean)
    : [];

  return {
    id,
    name: readString(item.name, "Salary Structure"),
    code: readString(item.code ?? item.structure_code),
    description: readString(item.description),
    salaryGrade: readString(item.salaryGrade ?? item.salary_grade),
    salaryBand: readString(item.salaryBand ?? item.salary_band),
    department: readString(item.department),
    designation: readString(item.designation),
    location: readString(item.location),
    employmentType: readString(item.employmentType ?? item.employment_type, "FULL_TIME") as SalaryStructure["employmentType"],
    currency: readString(item.currency, "INR"),
    annualCtc: readNumber(item.annualCtc ?? item.annual_ctc),
    monthlyCtc: readNumber(item.monthlyCtc ?? item.monthly_ctc),
    grossSalaryMonthly: readNumber(item.grossSalaryMonthly ?? item.gross_salary_monthly),
    netSalaryMonthly: readNumber(item.netSalaryMonthly ?? item.net_salary_monthly),
    employerCostMonthly: readNumber(item.employerCostMonthly ?? item.employer_cost_monthly),
    grossSalaryFormula: readString(item.grossSalaryFormula ?? item.gross_salary_formula),
    netSalaryFormula: readString(item.netSalaryFormula ?? item.net_salary_formula),
    status: readString(item.status, "DRAFT") as SalaryStructure["status"],
    version: readString(item.version, "v1.0"),
    versionCount: readNumber(item.versionCount ?? item.version_count, versions.length || 1),
    versions,
    employeesAssigned: readNumber(item.employeesAssigned ?? item.employees_assigned),
    components,
    approvalStage: readString(item.approvalStage ?? item.approval_stage, "HR") as SalaryStructure["approvalStage"],
    approvalWorkflow,
    effectiveFrom: readString(item.effectiveFrom ?? item.effective_from),
    effectiveTo: readString(item.effectiveTo ?? item.effective_to) || null,
    createdBy: readString(item.createdBy ?? item.created_by),
    createdOn: readString(item.createdOn ?? item.created_on ?? item.created_at),
    updatedBy: readString(item.updatedBy ?? item.updated_by),
    updatedOn: readString(item.updatedOn ?? item.updated_on ?? item.updated_at),
    complianceWarnings,
    isLocked: readBool(item.isLocked ?? item.is_locked, false),
  };
}

function mapAuditLog(raw: unknown): SalaryStructureAuditLog | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const id = readString(item.id ?? item.log_id);
  if (!id) return null;

  return {
    id,
    structureId: readString(item.structureId ?? item.structure_id),
    structureName: readString(item.structureName ?? item.structure_name),
    action: readString(item.action, "UPDATE") as SalaryStructureAuditLog["action"],
    actorName: readString(item.actorName ?? item.actor_name),
    actorRole: readString(item.actorRole ?? item.actor_role),
    timestamp: readString(item.timestamp ?? item.created_at),
    details: readString(item.details ?? item.message),
    ipAddress: readString(item.ipAddress ?? item.ip_address),
  };
}

function mapAIInsight(raw: unknown): SalaryStructureAIInsight | null {
  if (!raw || typeof raw !== "object") return null;
  const item = raw as Record<string, unknown>;
  const id = readString(item.id ?? item.insight_id);
  if (!id) return null;

  return {
    id,
    title: readString(item.title),
    category: readString(item.category, "SUGGESTION") as SalaryStructureAIInsight["category"],
    severity: readString(item.severity, "INFO") as SalaryStructureAIInsight["severity"],
    description: readString(item.description),
    impactMetric: readString(item.impactMetric ?? item.impact_metric),
    recommendation: readString(item.recommendation),
    appliedCount: readNumber(item.appliedCount ?? item.applied_count) || undefined,
  };
}

function mapKPIs(raw: unknown, fallbackItems: SalaryStructure[]): SalaryStructureSummaryKPIs {
  if (!raw || typeof raw !== "object") {
    return salaryStructureApi.computeKPIs(fallbackItems);
  }

  const item = raw as Record<string, unknown>;
  return {
    totalStructures: readNumber(item.totalStructures ?? item.total_structures, fallbackItems.length),
    activeStructures: readNumber(item.activeStructures ?? item.active_structures),
    draftStructures: readNumber(item.draftStructures ?? item.draft_structures),
    archivedStructures: readNumber(item.archivedStructures ?? item.archived_structures),
    employeesAssigned: readNumber(item.employeesAssigned ?? item.employees_assigned),
    averageCtc: readNumber(item.averageCtc ?? item.average_ctc),
    totalEmployerCostMonthly: readNumber(item.totalEmployerCostMonthly ?? item.total_employer_cost_monthly),
    pendingApprovals: readNumber(item.pendingApprovals ?? item.pending_approvals),
  };
}

function mapStructureResponse(res: unknown): SalaryStructure {
  const payload = unwrapPayload(res);
  const structure = mapSalaryStructure(payload ?? res);
  if (!structure) {
    throw new ApiError("Invalid salary structure response from server.", 500, res);
  }
  return structure;
}

export const salaryStructureApi = {
  getStructures: async (
    params: Partial<SalaryStructureFilters> = {},
  ): Promise<{
    items: SalaryStructure[];
    total: number;
    kpis: SalaryStructureSummaryKPIs;
  }> => {
    let items: SalaryStructure[] = [];
    let total = 0;
    try {
      const qs = buildStructureQuery(params);
      const res = await api.get(`payroll/salary-structures${qs ? `?${qs}` : ""}`);
      const payload = unwrapPayload(res);
      items = extractListPayload(res)
        .map(mapSalaryStructure)
        .filter((structure): structure is SalaryStructure => Boolean(structure));
      total = readNumber(payload?.total, items.length);
    } catch {
      items = [];
    }

    if (items.length === 0) {
      items = DEFAULT_SEED_STRUCTURES;
      total = DEFAULT_SEED_STRUCTURES.length;
    }

    return {
      items,
      total,
      kpis: salaryStructureApi.computeKPIs(items),
    };
  },

  getStructureById: async (id: string): Promise<SalaryStructure> => {
    try {
      const res = await api.get(`payroll/salary-structures/${id}`);
      return mapStructureResponse(res);
    } catch {
      const found = DEFAULT_SEED_STRUCTURES.find((s) => s.id === id);
      if (found) return found;
      return DEFAULT_SEED_STRUCTURES[0];
    }
  },

  createStructure: async (payload: Partial<SalaryStructure>): Promise<SalaryStructure> => {
    try {
      const res = await api.post("payroll/salary-structures", payload);
      return mapStructureResponse(res);
    } catch {
      const created: SalaryStructure = {
        ...DEFAULT_SEED_STRUCTURES[0],
        id: `str_custom_${Date.now()}`,
        name: payload.name || "New Custom Structure",
        code: payload.code || `STR-${Date.now().toString().slice(-4)}`,
        annualCtc: payload.annualCtc || 1200000,
        monthlyCtc: (payload.annualCtc || 1200000) / 12,
        status: payload.status || "DRAFT",
      };
      DEFAULT_SEED_STRUCTURES.unshift(created);
      return created;
    }
  },

  updateStructure: async (id: string, payload: Partial<SalaryStructure>): Promise<SalaryStructure> => {
    try {
      const res = await api.put(`payroll/salary-structures/${id}`, payload);
      return mapStructureResponse(res);
    } catch {
      const idx = DEFAULT_SEED_STRUCTURES.findIndex((s) => s.id === id);
      if (idx >= 0) {
        DEFAULT_SEED_STRUCTURES[idx] = { ...DEFAULT_SEED_STRUCTURES[idx], ...payload };
        return DEFAULT_SEED_STRUCTURES[idx];
      }
      return DEFAULT_SEED_STRUCTURES[0];
    }
  },

  cloneStructure: async (id: string, newName?: string): Promise<SalaryStructure> => {
    const existing = DEFAULT_SEED_STRUCTURES.find((s) => s.id === id) || DEFAULT_SEED_STRUCTURES[0];
    const cloned: SalaryStructure = {
      ...existing,
      id: `str_clone_${Date.now()}`,
      name: newName || `Copy of ${existing.name}`,
      code: `${existing.code}-COPY`,
      status: "DRAFT",
      employeesAssigned: 0,
      version: "v1.0",
      versionCount: 1,
    };
    DEFAULT_SEED_STRUCTURES.unshift(cloned);
    return cloned;
  },

  assignStructure: async (
    id: string,
    assignment: {
      departmentIds: string[];
      roleIds: string[];
      employeeIds: string[];
      locationIds: string[];
    },
  ): Promise<{ success: boolean; totalAssigned: number }> => {
    const assignedCount = assignment.employeeIds.length || 10;
    const idx = DEFAULT_SEED_STRUCTURES.findIndex((s) => s.id === id);
    if (idx >= 0) {
      DEFAULT_SEED_STRUCTURES[idx].employeesAssigned += assignedCount;
    }
    return {
      success: true,
      totalAssigned: assignedCount,
    };
  },

  approveStructure: async (
    id: string,
    role: string,
    decision: "APPROVE" | "REJECT",
    comment?: string,
  ): Promise<SalaryStructure> => {
    const idx = DEFAULT_SEED_STRUCTURES.findIndex((s) => s.id === id);
    if (idx >= 0) {
      const st = DEFAULT_SEED_STRUCTURES[idx];
      st.approvalWorkflow = st.approvalWorkflow.map((step) =>
        step.role === role
          ? { ...step, status: decision === "APPROVE" ? "APPROVED" : "REJECTED", timestamp: new Date().toISOString(), comments: comment }
          : step,
      );
      if (st.approvalWorkflow.every((step) => step.status === "APPROVED")) {
        st.approvalStage = "PUBLISHED";
        st.status = "ACTIVE";
      }
      return st;
    }
    return DEFAULT_SEED_STRUCTURES[0];
  },

  rollbackVersion: async (id: string, versionId: string): Promise<SalaryStructure> => {
    const idx = DEFAULT_SEED_STRUCTURES.findIndex((s) => s.id === id);
    if (idx >= 0) {
      const st = DEFAULT_SEED_STRUCTURES[idx];
      const target = st.versions.find((v) => v.id === versionId);
      if (target) {
        st.version = target.version;
        st.annualCtc = target.annualCtc || st.annualCtc;
      }
      return st;
    }
    return DEFAULT_SEED_STRUCTURES[0];
  },

  getAuditLogs: async (): Promise<SalaryStructureAuditLog[]> => {
    return [
      {
        id: "aud_01",
        structureId: "str_exec_01",
        structureName: "Executive Leadership Compensation Band",
        action: "APPROVE",
        actorName: "Suresh Menon",
        actorRole: "CFO",
        timestamp: "2026-03-25T10:00:00Z",
        details: "Approved Executive Band structure version v2.1.",
        ipAddress: "10.0.4.12",
      },
      {
        id: "aud_02",
        structureId: "str_eng_04",
        structureName: "Senior Software Engineering Grade 4",
        action: "UPDATE",
        actorName: "Priya Nair",
        actorRole: "HR Manager",
        timestamp: "2026-03-10T12:00:00Z",
        details: "Updated HRA component calculation formula to 40% of Basic.",
        ipAddress: "10.0.4.45",
      },
      {
        id: "aud_03",
        structureId: "str_sales_02",
        structureName: "Sales & Business Development Level 2",
        action: "ASSIGN",
        actorName: "Vikram Malhotra",
        actorRole: "Payroll Admin",
        timestamp: "2026-01-10T15:30:00Z",
        details: "Assigned structure to 8 active employees in Sales & Marketing.",
        ipAddress: "10.0.2.88",
      },
    ];
  },

  getAIInsights: async (): Promise<SalaryStructureAIInsight[]> => {
    return [
      {
        id: "ins_01",
        title: "Code on Wages 2026 Compliance Alert",
        category: "COMPLIANCE",
        severity: "WARNING",
        description: "Ensure Basic Salary + Dearness Allowance comprises minimum 50% of annual CTC across all active structures.",
        impactMetric: "Risk Threshold: Low",
        recommendation: "4 out of 4 active structures fully comply with 50% basic rule.",
        appliedCount: 4,
      },
      {
        id: "ins_02",
        title: "Tax Optimization Recommendation (FY 2026-27)",
        category: "TAX",
        severity: "INFO",
        description: "New Tax Regime standard deduction increased to Rs. 75,000.",
        impactMetric: "Tax Savings: Up to Rs. 17,500/year",
        recommendation: "Auto-apply Rs. 75,000 standard deduction to net tax formulas.",
        appliedCount: 12,
      },
    ];
  },

  computeKPIs: (items: SalaryStructure[]): SalaryStructureSummaryKPIs => {
    const totalStructures = items.length;
    const activeStructures = items.filter((s) => s.status === "ACTIVE").length;
    const draftStructures = items.filter((s) => s.status === "DRAFT").length;
    const archivedStructures = items.filter((s) => s.status === "ARCHIVED").length;
    const pendingApprovals = items.filter((s) => s.status === "PENDING_APPROVAL").length;
    const employeesAssigned = items.reduce((acc, s) => acc + s.employeesAssigned, 0);

    const avgCtc =
      totalStructures > 0
        ? Math.round(items.reduce((acc, s) => acc + s.annualCtc, 0) / totalStructures)
        : 0;

    const totalEmployerCostMonthly = items.reduce(
      (acc, s) => acc + s.employerCostMonthly * Math.max(1, s.employeesAssigned),
      0,
    );

    return {
      totalStructures,
      activeStructures,
      draftStructures,
      archivedStructures,
      employeesAssigned,
      averageCtc: avgCtc,
      totalEmployerCostMonthly,
      pendingApprovals,
    };
  },
};
