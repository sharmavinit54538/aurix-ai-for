import { api } from "@/api";
import {
  SalaryStructure,
  SalaryStructureFilters,
  SalaryStructureSummaryKPIs,
  SalaryStructureAuditLog,
  SalaryStructureAIInsight,
  SalaryComponent,
} from "@/features/admin/payroll/components/salary-structure/salaryStructureTypes";

// Default Initial Salary Component Library
export const INITIAL_SALARY_COMPONENTS: SalaryComponent[] = [
  {
    id: "comp-basic",
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
    description: "Core taxable salary base (minimum 40-50% of total CTC as per Code on Wages).",
  },
  {
    id: "comp-hra",
    code: "HRA",
    name: "House Rent Allowance (HRA)",
    type: "EARNING",
    category: "HRA",
    calculationType: "PERCENTAGE",
    value: 50,
    baseComponentCode: "BASIC",
    formulaExpression: "BASIC * 0.50",
    isTaxable: true,
    isStatutory: true,
    isFlexible: true,
    frequency: "MONTHLY",
    description: "50% of Basic for metro cities, 40% for non-metro cities. Tax exempt u/s 10(13A).",
  },
  {
    id: "comp-special",
    code: "SPECIAL_ALLOWANCE",
    name: "Special Allowance",
    type: "EARNING",
    category: "SPECIAL_ALLOWANCE",
    calculationType: "FORMULA",
    value: 0,
    formulaExpression: "CTC - (BASIC + HRA + MEDICAL + TRAVEL + EMPLOYER_PF)",
    isTaxable: true,
    isStatutory: false,
    isFlexible: true,
    frequency: "MONTHLY",
    description: "Balancing component to ensure full CTC distribution.",
  },
  {
    id: "comp-medical",
    code: "MEDICAL",
    name: "Medical Allowance",
    type: "EARNING",
    category: "MEDICAL",
    calculationType: "FIXED",
    value: 1250,
    isTaxable: true,
    isStatutory: false,
    isFlexible: true,
    frequency: "MONTHLY",
    description: "Fixed monthly allowance for healthcare expenses.",
  },
  {
    id: "comp-travel",
    code: "TRAVEL",
    name: "Conveyance / Travel Allowance",
    type: "EARNING",
    category: "TRAVEL",
    calculationType: "FIXED",
    value: 1600,
    isTaxable: true,
    isStatutory: false,
    isFlexible: true,
    frequency: "MONTHLY",
    description: "Fixed travel & commute allowance.",
  },
  {
    id: "comp-perf",
    code: "PERFORMANCE_BONUS",
    name: "Performance Bonus",
    type: "EARNING",
    category: "PERFORMANCE_BONUS",
    calculationType: "PERCENTAGE",
    value: 10,
    baseComponentCode: "BASIC",
    formulaExpression: "BASIC * 0.10",
    isTaxable: true,
    isStatutory: false,
    isFlexible: false,
    frequency: "ANNUAL",
    description: "Variable bonus tied to quarterly performance goals.",
  },
  {
    id: "comp-pf-emp",
    code: "PF",
    name: "Employee Provident Fund (EPF)",
    type: "DEDUCTION",
    category: "PF",
    calculationType: "FORMULA",
    value: 12,
    baseComponentCode: "BASIC",
    formulaExpression: "MIN(BASIC, 15000) * 0.12",
    isTaxable: false,
    isStatutory: true,
    isFlexible: false,
    frequency: "MONTHLY",
    description: "12% of Basic pay capped at statutory limit ₹15,000 pm or on full Basic.",
  },
  {
    id: "comp-esi-emp",
    code: "ESI",
    name: "Employee State Insurance (ESI)",
    type: "DEDUCTION",
    category: "ESI",
    calculationType: "CONDITIONAL",
    value: 0.75,
    baseComponentCode: "GROSS",
    formulaExpression: "IF(GROSS <= 21000, GROSS * 0.0075, 0)",
    conditionExpression: "GROSS <= 21000",
    isTaxable: false,
    isStatutory: true,
    isFlexible: false,
    frequency: "MONTHLY",
    description: "0.75% of Gross salary applicable if Gross <= ₹21,000 per month.",
  },
  {
    id: "comp-pt",
    code: "PROFESSIONAL_TAX",
    name: "Professional Tax (PT)",
    type: "DEDUCTION",
    category: "PROFESSIONAL_TAX",
    calculationType: "CONDITIONAL",
    value: 200,
    formulaExpression: "IF(GROSS > 15000, 200, IF(GROSS > 10000, 150, 0))",
    isTaxable: false,
    isStatutory: true,
    isFlexible: false,
    frequency: "MONTHLY",
    description: "State-level professional tax deduction based on statutory slab rules.",
  },
  {
    id: "comp-tds",
    code: "INCOME_TAX",
    name: "Tax Deducted at Source (TDS)",
    type: "DEDUCTION",
    category: "INCOME_TAX",
    calculationType: "FORMULA",
    value: 0,
    formulaExpression: "TDS_ESTIMATED_MONTHLY",
    isTaxable: false,
    isStatutory: true,
    isFlexible: false,
    frequency: "MONTHLY",
    description: "Estimated monthly income tax withholding based on Old/New tax regime.",
  },
  {
    id: "comp-pf-er",
    code: "EMPLOYER_PF",
    name: "Employer Provident Fund (ER EPF)",
    type: "EMPLOYER_CONTRIBUTION",
    category: "EMPLOYER_PF",
    calculationType: "FORMULA",
    value: 12,
    baseComponentCode: "BASIC",
    formulaExpression: "MIN(BASIC, 15000) * 0.12",
    isTaxable: false,
    isStatutory: true,
    isFlexible: false,
    frequency: "MONTHLY",
    description: "12% Employer EPF contribution included in CTC.",
  },
  {
    id: "comp-esi-er",
    code: "EMPLOYER_ESI",
    name: "Employer State Insurance (ER ESI)",
    type: "EMPLOYER_CONTRIBUTION",
    category: "EMPLOYER_ESI",
    calculationType: "CONDITIONAL",
    value: 3.25,
    baseComponentCode: "GROSS",
    formulaExpression: "IF(GROSS <= 21000, GROSS * 0.0325, 0)",
    isTaxable: false,
    isStatutory: true,
    isFlexible: false,
    frequency: "MONTHLY",
    description: "3.25% Employer ESI contribution if Gross <= ₹21,000 pm.",
  },
  {
    id: "comp-gratuity",
    code: "GRATUITY",
    name: "Gratuity Provision",
    type: "EMPLOYER_CONTRIBUTION",
    category: "GRATUITY",
    calculationType: "PERCENTAGE",
    value: 4.81,
    baseComponentCode: "BASIC",
    formulaExpression: "BASIC * 0.0481",
    isTaxable: false,
    isStatutory: true,
    isFlexible: false,
    frequency: "MONTHLY",
    description: "4.81% of Basic towards Gratuity accrual (15/26 days per completed year).",
  },
  {
    id: "comp-health-ins",
    code: "HEALTH_INSURANCE",
    name: "Group Mediclaim Insurance",
    type: "BENEFIT",
    category: "HEALTH_INSURANCE",
    calculationType: "FIXED",
    value: 1500,
    isTaxable: false,
    isStatutory: false,
    isFlexible: true,
    frequency: "MONTHLY",
    description: "Employer-paid ₹5,00,000 family health insurance premium.",
  },
];

// Robust Fortune 500 Mock Structures Repository
const INITIAL_STRUCTURES: SalaryStructure[] = [
  {
    id: "str-eng-l5",
    name: "Global Technology & Engineering (Grade L5 - Principal)",
    code: "ENG-L5-GLOBAL",
    description: "Standard executive & principal engineering compensation band for tech leads, software architects, and engineering managers.",
    salaryGrade: "L5 - Principal Architect",
    salaryBand: "Band 4 (Senior Management)",
    department: "Engineering",
    designation: "Principal Software Engineer",
    location: "Global / All India",
    employmentType: "FULL_TIME",
    currency: "INR",
    annualCtc: 3600000,
    monthlyCtc: 300000,
    grossSalaryMonthly: 282000,
    netSalaryMonthly: 236600,
    employerCostMonthly: 18000,
    grossSalaryFormula: "BASIC + HRA + SPECIAL_ALLOWANCE + MEDICAL + TRAVEL",
    netSalaryFormula: "GROSS_SALARY - (PF + PROFESSIONAL_TAX + INCOME_TAX)",
    status: "ACTIVE",
    version: "v2.4",
    versionCount: 4,
    versions: [
      {
        id: "v2.4",
        version: "v2.4",
        effectiveFrom: "2026-04-01",
        changeSummary: "Updated HRA percentage to 50% for metro alignment & adjusted Special Allowance.",
        createdBy: "Ananya Roy (CFO)",
        createdAt: "2026-03-15",
        status: "ACTIVE",
        annualCtc: 3600000,
        componentsCount: 10,
      },
      {
        id: "v2.3",
        version: "v2.3",
        effectiveFrom: "2025-04-01",
        effectiveTo: "2026-03-31",
        changeSummary: "Annual appraisal adjustment & added stock options benefit component.",
        createdBy: "Vikram Malhotra (HR Director)",
        createdAt: "2025-03-20",
        status: "SUPERSEDED",
        annualCtc: 3200000,
        componentsCount: 9,
      },
    ],
    employeesAssigned: 142,
    components: [...INITIAL_SALARY_COMPONENTS],
    approvalStage: "PUBLISHED",
    approvalWorkflow: [
      { role: "HR Manager", name: "Rohan Varma", status: "APPROVED", timestamp: "2026-03-10 10:15 AM", comments: "Structure reviewed & compliant with wage rules." },
      { role: "Payroll Admin", name: "Sunita Menon", status: "APPROVED", timestamp: "2026-03-11 02:45 PM", comments: "Statutory PF/ESI formulas verified." },
      { role: "Finance Manager", name: "Karan Johar", status: "APPROVED", timestamp: "2026-03-12 04:30 PM", comments: "Budget allocation approved within FY27 ceiling." },
      { role: "CFO", name: "Ananya Roy", status: "APPROVED", timestamp: "2026-03-15 11:00 AM", comments: "Approved for publishing company-wide." },
    ],
    effectiveFrom: "2026-04-01",
    createdBy: "Vikram Malhotra",
    createdOn: "2025-01-10",
    updatedBy: "Ananya Roy",
    updatedOn: "2026-03-15",
    complianceWarnings: ["Ensure Basic Pay >= 50% of Total CTC as per New Wage Code 2026 guidelines."],
  },
  {
    id: "str-sales-l3",
    name: "Enterprise Sales & Business Development (Grade L3 - Manager)",
    code: "SALES-L3-MGR",
    description: "Incentive-heavy salary structure for Account Executives, Business Development Managers, and Sales Leads.",
    salaryGrade: "L3 - Senior Manager",
    salaryBand: "Band 3 (Mid Management)",
    department: "Sales & BD",
    designation: "Enterprise Account Executive",
    location: "Bangalore",
    employmentType: "FULL_TIME",
    currency: "INR",
    annualCtc: 2400000,
    monthlyCtc: 200000,
    grossSalaryMonthly: 185000,
    netSalaryMonthly: 154800,
    employerCostMonthly: 15000,
    grossSalaryFormula: "BASIC + HRA + SPECIAL_ALLOWANCE + VARIABLE_PAY",
    netSalaryFormula: "GROSS_SALARY - (PF + PROFESSIONAL_TAX + INCOME_TAX)",
    status: "ACTIVE",
    version: "v1.8",
    versionCount: 3,
    versions: [
      {
        id: "v1.8",
        version: "v1.8",
        effectiveFrom: "2026-04-01",
        changeSummary: "Increased variable commission share to 20% of annual CTC.",
        createdBy: "Priya Nair (Sales VP)",
        createdAt: "2026-03-18",
        status: "ACTIVE",
        annualCtc: 2400000,
        componentsCount: 9,
      },
    ],
    employeesAssigned: 88,
    components: [...INITIAL_SALARY_COMPONENTS],
    approvalStage: "PUBLISHED",
    approvalWorkflow: [
      { role: "HR Manager", name: "Rohan Varma", status: "APPROVED", timestamp: "2026-03-16 09:30 AM", comments: "Target incentives structured correctly." },
      { role: "Payroll Admin", name: "Sunita Menon", status: "APPROVED", timestamp: "2026-03-17 11:20 AM", comments: "Tax calculation formula validated." },
      { role: "Finance Manager", name: "Karan Johar", status: "APPROVED", timestamp: "2026-03-18 01:10 PM", comments: "Quarterly commission payouts synced with finance." },
      { role: "CFO", name: "Ananya Roy", status: "APPROVED", timestamp: "2026-03-18 05:00 PM", comments: "Published." },
    ],
    effectiveFrom: "2026-04-01",
    createdBy: "Priya Nair",
    createdOn: "2025-06-12",
    updatedBy: "Priya Nair",
    updatedOn: "2026-03-18",
    complianceWarnings: [],
  },
  {
    id: "str-ops-l1",
    name: "Operations & Support Services (Grade L1 - Specialist)",
    code: "OPS-L1-SPEC",
    description: "Standard entry-level operational structure with ESI and statutory LWF support.",
    salaryGrade: "L1 - Associate",
    salaryBand: "Band 1 (Junior Level)",
    department: "Operations",
    designation: "Operations Executive",
    location: "Hyderabad",
    employmentType: "FULL_TIME",
    currency: "INR",
    annualCtc: 480000,
    monthlyCtc: 40000,
    grossSalaryMonthly: 37500,
    netSalaryMonthly: 33800,
    employerCostMonthly: 2500,
    grossSalaryFormula: "BASIC + HRA + SPECIAL_ALLOWANCE",
    netSalaryFormula: "GROSS_SALARY - (PF + ESI + PROFESSIONAL_TAX)",
    status: "ACTIVE",
    version: "v1.2",
    versionCount: 2,
    versions: [
      {
        id: "v1.2",
        version: "v1.2",
        effectiveFrom: "2026-01-01",
        changeSummary: "Adjusted basic pay floor to meet state minimum wage requirements.",
        createdBy: "Rohan Varma",
        createdAt: "2025-12-10",
        status: "ACTIVE",
        annualCtc: 480000,
        componentsCount: 7,
      },
    ],
    employeesAssigned: 310,
    components: [...INITIAL_SALARY_COMPONENTS],
    approvalStage: "PUBLISHED",
    approvalWorkflow: [
      { role: "HR Manager", name: "Rohan Varma", status: "APPROVED", timestamp: "2025-12-10" },
      { role: "Payroll Admin", name: "Sunita Menon", status: "APPROVED", timestamp: "2025-12-11" },
      { role: "Finance Manager", name: "Karan Johar", status: "APPROVED", timestamp: "2025-12-12" },
      { role: "CFO", name: "Ananya Roy", status: "APPROVED", timestamp: "2025-12-15" },
    ],
    effectiveFrom: "2026-01-01",
    createdBy: "Rohan Varma",
    createdOn: "2024-11-05",
    updatedBy: "Rohan Varma",
    updatedOn: "2025-12-10",
    complianceWarnings: [],
  },
  {
    id: "str-exec-cfo",
    name: "Executive Compensation & Leadership (Grade E1 - CXO)",
    code: "EXEC-CXO-E1",
    description: "C-suite executive template including retention bonuses, performance stock options, and executive medical benefits.",
    salaryGrade: "E1 - Executive Committee",
    salaryBand: "Band 5 (CXO / VP)",
    department: "Executive Board",
    designation: "Chief Technology Officer / VP",
    location: "Global",
    employmentType: "EXECUTIVE",
    currency: "INR",
    annualCtc: 9600000,
    monthlyCtc: 800000,
    grossSalaryMonthly: 740000,
    netSalaryMonthly: 590000,
    employerCostMonthly: 60000,
    grossSalaryFormula: "BASIC + HRA + SPECIAL_ALLOWANCE + STOCK_OPTIONS",
    netSalaryFormula: "GROSS_SALARY - (PF + HIGH_TDS)",
    status: "PENDING_APPROVAL",
    version: "v3.0-DRAFT",
    versionCount: 5,
    versions: [
      {
        id: "v3.0",
        version: "v3.0-DRAFT",
        effectiveFrom: "2026-07-01",
        changeSummary: "Proposed Executive Stock Options & retention bonus expansion.",
        createdBy: "Vikram Malhotra",
        createdAt: "2026-07-01",
        status: "DRAFT",
        annualCtc: 9600000,
        componentsCount: 12,
      },
    ],
    employeesAssigned: 12,
    components: [...INITIAL_SALARY_COMPONENTS],
    approvalStage: "FINANCE",
    approvalWorkflow: [
      { role: "HR Manager", name: "Rohan Varma", status: "APPROVED", timestamp: "2026-07-05 11:00 AM", comments: "Board resolution aligned." },
      { role: "Payroll Admin", name: "Sunita Menon", status: "APPROVED", timestamp: "2026-07-06 03:20 PM", comments: "Executive tax withholding schedule configured." },
      { role: "Finance Manager", name: "Karan Johar", status: "PENDING", comments: "Awaiting final Q3 board budget authorization." },
      { role: "CFO", name: "Ananya Roy", status: "PENDING" },
    ],
    effectiveFrom: "2026-07-01",
    createdBy: "Vikram Malhotra",
    createdOn: "2024-04-12",
    updatedBy: "Vikram Malhotra",
    updatedOn: "2026-07-05",
    complianceWarnings: ["Stock Options require Form 16 Part B tax schedule filing."],
  },
];

const INITIAL_AUDIT_LOGS: SalaryStructureAuditLog[] = [
  {
    id: "log-1",
    structureId: "str-eng-l5",
    structureName: "Global Technology & Engineering (Grade L5 - Principal)",
    action: "UPDATE",
    actorName: "Ananya Roy",
    actorRole: "CFO",
    timestamp: "2026-03-15 11:00 AM",
    details: "Published version v2.4 updating Metro HRA calculation from 40% to 50%.",
    ipAddress: "192.168.1.104",
  },
  {
    id: "log-2",
    structureId: "str-sales-l3",
    structureName: "Enterprise Sales & Business Development (Grade L3 - Manager)",
    action: "APPROVE",
    actorName: "Karan Johar",
    actorRole: "Finance Manager",
    timestamp: "2026-03-18 01:10 PM",
    details: "Approved quarterly incentive structure for 88 assigned sales professionals.",
    ipAddress: "192.168.1.88",
  },
  {
    id: "log-3",
    structureId: "str-exec-cfo",
    structureName: "Executive Compensation & Leadership (Grade E1 - CXO)",
    action: "CREATE",
    actorName: "Vikram Malhotra",
    actorRole: "HR Director",
    timestamp: "2026-07-01 09:30 AM",
    details: "Created draft version v3.0 with added Stock Option vesting rules.",
    ipAddress: "192.168.1.12",
  },
];

const INITIAL_AI_INSIGHTS: SalaryStructureAIInsight[] = [
  {
    id: "ai-1",
    title: "Code on Wages 2026 Compliance Alert",
    category: "COMPLIANCE",
    severity: "WARNING",
    description: "3 out of 4 active structures have Basic Pay >= 50% of CTC. 'Executive Compensation' has Basic Pay at 42% of CTC.",
    impactMetric: "Potential Statutory Fine Penalty",
    recommendation: "Rebalance Special Allowance into Basic Pay for Executive Compensation to avoid non-compliance.",
  },
  {
    id: "ai-2",
    title: "Pay Equity & Compression Detected",
    category: "COMPRESSION",
    severity: "INFO",
    description: "Grade L3 (Manager) salary range in Sales overlaps by 14% with Grade L4 (Senior Manager) in Engineering.",
    impactMetric: "14% Pay Overlap",
    recommendation: "Review Grade L4 base pay floor during upcoming FY27 compensation revision.",
  },
  {
    id: "ai-3",
    title: "Tax Optimization Opportunity (New Regime)",
    category: "TAX",
    severity: "SUCCESS",
    description: "Converting Non-taxable Meal & Fuel Allowances to Flexible Benefit Plan (FBP) yields average tax savings of ₹28,400/emp/year under Old Tax Regime.",
    impactMetric: "₹28,400 / emp Tax Saving",
    recommendation: "Enable Flexible Benefit Plan (FBP) toggle in Step 5 of Salary Wizard.",
  },
  {
    id: "ai-4",
    title: "FY27 Budget Forecast Shift",
    category: "FORECAST",
    severity: "INFO",
    description: "PF Employer contribution cost is projected to increase by 8.4% YoY due to planned headcount scaling in Engineering.",
    impactMetric: "+₹4.2L / month ER PF",
    recommendation: "Incorporate ER PF increase in Q3 Cash Flow Budget.",
  },
];

// Helper to filter and paginate mock structures in memory
function filterStructuresInMemory(items: SalaryStructure[], params: Partial<SalaryStructureFilters>): SalaryStructure[] {
  return items.filter((item) => {
    if (params.search) {
      const q = params.search.toLowerCase();
      const match =
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        item.salaryGrade.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q) ||
        item.designation.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (params.department && params.department !== "all" && params.department !== "ALL") {
      if (item.department.toLowerCase() !== params.department.toLowerCase() && item.department !== "All") return false;
    }
    if (params.designation && params.designation !== "all" && params.designation !== "ALL") {
      if (item.designation.toLowerCase() !== params.designation.toLowerCase() && item.designation !== "All") return false;
    }
    if (params.location && params.location !== "all" && params.location !== "ALL") {
      if (item.location.toLowerCase() !== params.location.toLowerCase() && item.location !== "Global") return false;
    }
    if (params.status && params.status !== "all" && params.status !== "ALL") {
      if (item.status !== params.status) return false;
    }
    if (params.employmentType && params.employmentType !== "all" && params.employmentType !== "ALL") {
      if (item.employmentType !== params.employmentType && item.employmentType !== "ALL") return false;
    }
    return true;
  });
}

// In-Memory Storage holding real mutation states
let localStructures = [...INITIAL_STRUCTURES];
let localAuditLogs = [...INITIAL_AUDIT_LOGS];

export const salaryStructureApi = {
  // GET all salary structures with optional filters
  getStructures: async (params: Partial<SalaryStructureFilters> = {}): Promise<{
    items: SalaryStructure[];
    total: number;
    kpis: SalaryStructureSummaryKPIs;
  }> => {
    try {
      const query = new URLSearchParams();
      if (params.search) query.append("search", params.search);
      if (params.department) query.append("department", params.department);
      if (params.status) query.append("status", params.status);
      
      const res: any = await api.get(`payroll/salary-structures?${query.toString()}`);
      if (res.data && Array.isArray(res.data?.items)) {
        return {
          items: res.data.items,
          total: res.data.total || res.data.items.length,
          kpis: res.data.kpis || salaryStructureApi.computeKPIs(res.data.items),
        };
      }
    } catch {
      // Graceful local fallback
    }

    const filtered = filterStructuresInMemory(localStructures, params);
    return {
      items: filtered,
      total: filtered.length,
      kpis: salaryStructureApi.computeKPIs(localStructures),
    };
  },

  // GET structure by ID
  getStructureById: async (id: string): Promise<SalaryStructure> => {
    try {
      const res: any = await api.get(`payroll/salary-structures/${id}`);
      if (res.data?.id) return res.data;
    } catch {
      // Local fallback
    }
    const found = localStructures.find((s) => s.id === id);
    if (!found) {
      throw new Error(`Salary structure with ID '${id}' not found.`);
    }
    return found;
  },

  // POST create new salary structure
  createStructure: async (payload: Partial<SalaryStructure>): Promise<SalaryStructure> => {
    const newId = `str-${Date.now()}`;
    const monthlyCtc = payload.annualCtc ? Math.round(payload.annualCtc / 12) : 100000;
    const grossMonthly = Math.round(monthlyCtc * 0.90);
    const netMonthly = Math.round(grossMonthly * 0.82);
    const employerCost = Math.round(monthlyCtc * 0.08);

    const newStructure: SalaryStructure = {
      id: newId,
      name: payload.name || "New Custom Salary Structure",
      code: payload.code || `CUST-${Date.now().toString().slice(-4)}`,
      description: payload.description || "Custom enterprise salary structure template.",
      salaryGrade: payload.salaryGrade || "Grade A",
      salaryBand: payload.salaryBand || "Band 2",
      department: payload.department || "Engineering",
      designation: payload.designation || "Senior Specialist",
      location: payload.location || "Global",
      employmentType: payload.employmentType || "FULL_TIME",
      currency: payload.currency || "INR",
      annualCtc: payload.annualCtc || 1200000,
      monthlyCtc,
      grossSalaryMonthly: grossMonthly,
      netSalaryMonthly: netMonthly,
      employerCostMonthly: employerCost,
      grossSalaryFormula: payload.grossSalaryFormula || "BASIC + HRA + SPECIAL_ALLOWANCE",
      netSalaryFormula: payload.netSalaryFormula || "GROSS_SALARY - (PF + ESI + PT + TDS)",
      status: payload.status || "DRAFT",
      version: payload.version || "v1.0",
      versionCount: 1,
      versions: [
        {
          id: "v1.0",
          version: payload.version || "v1.0",
          effectiveFrom: payload.effectiveFrom || new Date().toISOString().split("T")[0],
          changeSummary: "Initial structure creation.",
          createdBy: "Admin User",
          createdAt: new Date().toISOString().replace("T", " ").slice(0, 16),
          status: "ACTIVE",
          annualCtc: payload.annualCtc || 1200000,
          componentsCount: payload.components?.length || 8,
        },
      ],
      employeesAssigned: payload.employeesAssigned || 0,
      components: payload.components && payload.components.length > 0 ? payload.components : [...INITIAL_SALARY_COMPONENTS],
      approvalStage: "HR",
      approvalWorkflow: [
        { role: "HR Manager", name: "Rohan Varma", status: "APPROVED", timestamp: new Date().toISOString().replace("T", " ").slice(0, 16) },
        { role: "Payroll Admin", name: "Sunita Menon", status: "PENDING" },
        { role: "Finance Manager", name: "Karan Johar", status: "PENDING" },
        { role: "CFO", name: "Ananya Roy", status: "PENDING" },
      ],
      effectiveFrom: payload.effectiveFrom || new Date().toISOString().split("T")[0],
      createdBy: "Admin User",
      createdOn: new Date().toISOString().replace("T", " ").slice(0, 10),
      updatedBy: "Admin User",
      updatedOn: new Date().toISOString().replace("T", " ").slice(0, 10),
      complianceWarnings: [],
    };

    try {
      const res: any = await api.post("payroll/salary-structures", newStructure);
      if (res.data?.id) {
        localStructures.unshift(res.data);
        return res.data;
      }
    } catch {
      // Local fallback execution
    }

    localStructures.unshift(newStructure);
    salaryStructureApi.addAuditLog(newStructure.id, newStructure.name, "CREATE", "Created structure " + newStructure.code);
    return newStructure;
  },

  // PUT update salary structure
  updateStructure: async (id: string, payload: Partial<SalaryStructure>): Promise<SalaryStructure> => {
    const existing = await salaryStructureApi.getStructureById(id);

    const updated: SalaryStructure = {
      ...existing,
      ...payload,
      updatedOn: new Date().toISOString().replace("T", " ").slice(0, 10),
      updatedBy: "Admin User",
    };

    try {
      await api.put(`payroll/salary-structures/${id}`, payload);
    } catch {
      // Local fallback update
    }

    const idx = localStructures.findIndex((s) => s.id === id);
    if (idx !== -1) {
      localStructures[idx] = updated;
    }

    salaryStructureApi.addAuditLog(id, updated.name, "UPDATE", `Updated salary structure configurations.`);
    return updated;
  },

  // POST clone salary structure
  cloneStructure: async (id: string, newName?: string): Promise<SalaryStructure> => {
    const existing = await salaryStructureApi.getStructureById(id);
    const clonedName = newName || `${existing.name} (Copy)`;
    const clonedCode = `${existing.code}-COPY`;

    const cloned = await salaryStructureApi.createStructure({
      ...existing,
      name: clonedName,
      code: clonedCode,
      status: "DRAFT",
      version: "v1.0",
      employeesAssigned: 0,
    });

    salaryStructureApi.addAuditLog(existing.id, existing.name, "CLONE", `Cloned structure into new template ${cloned.code}`);
    return cloned;
  },

  // POST assign structure to departments / employees
  assignStructure: async (
    id: string,
    assignment: { departmentIds: string[]; roleIds: string[]; employeeIds: string[]; locationIds: string[] }
  ): Promise<{ success: boolean; totalAssigned: number }> => {
    const count = (assignment.employeeIds.length || 15) + (assignment.departmentIds.length * 20);
    const existing = await salaryStructureApi.getStructureById(id);

    const updated = {
      ...existing,
      employeesAssigned: existing.employeesAssigned + count,
    };
    const idx = localStructures.findIndex((s) => s.id === id);
    if (idx !== -1) localStructures[idx] = updated;

    salaryStructureApi.addAuditLog(id, existing.name, "ASSIGN", `Bulk assigned structure to ${count} employees.`);
    return { success: true, totalAssigned: count };
  },

  // POST approval step decision
  approveStructure: async (id: string, role: string, decision: "APPROVE" | "REJECT", comment?: string): Promise<SalaryStructure> => {
    const existing = await salaryStructureApi.getStructureById(id);
    const updatedWorkflow = existing.approvalWorkflow.map((step) => {
      if (step.role.toLowerCase().includes(role.toLowerCase())) {
        return {
          ...step,
          status: decision === "APPROVE" ? ("APPROVED" as const) : ("REJECTED" as const),
          timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
          comments: comment || (decision === "APPROVE" ? "Approved by workflow authority." : "Changes requested."),
        };
      }
      return step;
    });

    const allApproved = updatedWorkflow.every((s) => s.status === "APPROVED");
    const updatedStatus = allApproved ? "ACTIVE" : decision === "REJECT" ? "DRAFT" : "PENDING_APPROVAL";

    const updated: SalaryStructure = {
      ...existing,
      approvalWorkflow: updatedWorkflow,
      status: updatedStatus,
      approvalStage: allApproved ? "PUBLISHED" : existing.approvalStage,
    };

    const idx = localStructures.findIndex((s) => s.id === id);
    if (idx !== -1) localStructures[idx] = updated;

    salaryStructureApi.addAuditLog(id, existing.name, "APPROVE", `${decision} decision recorded for role ${role}.`);
    return updated;
  },

  // Rollback structure version
  rollbackVersion: async (id: string, versionId: string): Promise<SalaryStructure> => {
    const existing = await salaryStructureApi.getStructureById(id);
    const targetVer = existing.versions.find((v) => v.id === versionId || v.version === versionId);

    const updated: SalaryStructure = {
      ...existing,
      version: targetVer?.version || versionId,
      updatedOn: new Date().toISOString().replace("T", " ").slice(0, 10),
    };

    const idx = localStructures.findIndex((s) => s.id === id);
    if (idx !== -1) localStructures[idx] = updated;

    salaryStructureApi.addAuditLog(id, existing.name, "ROLLBACK", `Rolled back salary structure to ${targetVer?.version || versionId}`);
    return updated;
  },

  // GET Audit Logs
  getAuditLogs: async (): Promise<SalaryStructureAuditLog[]> => {
    try {
      const res: any = await api.get("payroll/salary-structures/audit");
      if (Array.isArray(res.data?.items)) return res.data.items;
    } catch {
      // Local fallback
    }
    return localAuditLogs;
  },

  // GET AI Insights
  getAIInsights: async (): Promise<SalaryStructureAIInsight[]> => {
    return INITIAL_AI_INSIGHTS;
  },

  // Compute live KPI Aggregates
  computeKPIs: (items: SalaryStructure[]): SalaryStructureSummaryKPIs => {
    const totalStructures = items.length;
    const activeStructures = items.filter((s) => s.status === "ACTIVE").length;
    const draftStructures = items.filter((s) => s.status === "DRAFT").length;
    const archivedStructures = items.filter((s) => s.status === "ARCHIVED").length;
    const pendingApprovals = items.filter((s) => s.status === "PENDING_APPROVAL").length;
    const employeesAssigned = items.reduce((acc, s) => acc + s.employeesAssigned, 0);
    
    const avgCtc = totalStructures > 0 
      ? Math.round(items.reduce((acc, s) => acc + s.annualCtc, 0) / totalStructures) 
      : 0;
      
    const totalEmployerCostMonthly = items.reduce((acc, s) => acc + s.employerCostMonthly * Math.max(1, s.employeesAssigned), 0);

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

  // Add internal audit log record
  addAuditLog: (structureId: string, structureName: string, action: SalaryStructureAuditLog["action"], details: string) => {
    localAuditLogs.unshift({
      id: `log-${Date.now()}`,
      structureId,
      structureName,
      action,
      actorName: "Admin User",
      actorRole: "Payroll Architect",
      timestamp: new Date().toISOString().replace("T", " ").slice(0, 16),
      details,
      ipAddress: "127.0.0.1",
    });
  },
};
