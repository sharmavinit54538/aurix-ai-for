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
    const qs = buildStructureQuery(params);
    const res = await api.get(`payroll/salary-structures${qs ? `?${qs}` : ""}`);
    const payload = unwrapPayload(res);
    const items = extractListPayload(res)
      .map(mapSalaryStructure)
      .filter((structure): structure is SalaryStructure => Boolean(structure));

    return {
      items,
      total: readNumber(payload?.total, items.length),
      kpis: mapKPIs(payload?.kpis, items),
    };
  },

  getStructureById: async (id: string): Promise<SalaryStructure> => {
    const res = await api.get(`payroll/salary-structures/${id}`);
    return mapStructureResponse(res);
  },

  createStructure: async (payload: Partial<SalaryStructure>): Promise<SalaryStructure> => {
    const res = await api.post("payroll/salary-structures", payload);
    return mapStructureResponse(res);
  },

  updateStructure: async (id: string, payload: Partial<SalaryStructure>): Promise<SalaryStructure> => {
    const res = await api.put(`payroll/salary-structures/${id}`, payload);
    try {
      return mapStructureResponse(res);
    } catch {
      return salaryStructureApi.getStructureById(id);
    }
  },

  cloneStructure: async (id: string, newName?: string): Promise<SalaryStructure> => {
    const res = await api.post(`payroll/salary-structures/${id}/clone`, {
      name: newName,
    });
    return mapStructureResponse(res);
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
    const res = await api.post(`payroll/salary-structures/${id}/assign`, assignment);
    const payload = unwrapPayload(res) ?? {};
    return {
      success: readBool(payload.success, true),
      totalAssigned: readNumber(payload.totalAssigned ?? payload.total_assigned),
    };
  },

  approveStructure: async (
    id: string,
    role: string,
    decision: "APPROVE" | "REJECT",
    comment?: string,
  ): Promise<SalaryStructure> => {
    const res = await api.post(`payroll/salary-structures/${id}/approve`, {
      role,
      decision,
      comment,
    });
    return mapStructureResponse(res);
  },

  rollbackVersion: async (id: string, versionId: string): Promise<SalaryStructure> => {
    const res = await api.post(`payroll/salary-structures/${id}/rollback`, {
      version_id: versionId,
      versionId,
    });
    return mapStructureResponse(res);
  },

  getAuditLogs: async (): Promise<SalaryStructureAuditLog[]> => {
    const res = await api.get("payroll/salary-structures/audit");
    return extractListPayload(res)
      .map(mapAuditLog)
      .filter((log): log is SalaryStructureAuditLog => Boolean(log));
  },

  getAIInsights: async (): Promise<SalaryStructureAIInsight[]> => {
    const res = await api.get("payroll/salary-structures/ai-insights");
    return extractListPayload(res)
      .map(mapAIInsight)
      .filter((insight): insight is SalaryStructureAIInsight => Boolean(insight));
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
