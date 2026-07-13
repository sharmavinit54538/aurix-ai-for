import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiInstance } from "@/api";
import { parseApiError, tryApi, type ParsedError } from "@/api/utils";
import { DEFAULT_PERMISSIONS, GENDER_OPTIONS } from "./constants";
import type { EmploymentType, Gender, Manager, ManagerRole, ManagerStatus } from "./types";
import type { FetchManagersParams, FetchManagersResult, ManagerApiPayload, ManagerFormState } from "./managersTypes";
import { apiManagerToFormState, readApiScalar, resolveGenderValue, unwrapManagerApiRecord } from "./utils";

function fromApiGender(value: unknown): Gender {
  const resolved = resolveGenderValue(readApiScalar(value));
  if (GENDER_OPTIONS.some((opt) => opt.value === resolved)) {
    return resolved as Gender;
  }
  return "prefer_not_to_say";
}

function fromApiEmploymentType(value: unknown): EmploymentType {
  const normalized = String(value ?? "FULL_TIME").toUpperCase();
  const map: Record<string, EmploymentType> = {
    FULL_TIME: "full_time",
    PART_TIME: "part_time",
    CONTRACT: "contract",
    INTERN: "intern",
  };
  return map[normalized] ?? "full_time";
}

function fromApiEmploymentStatus(value: unknown): ManagerStatus {
  const normalized = String(value ?? "PROBATION").toUpperCase();
  const map: Record<string, ManagerStatus> = {
    PROBATION: "PROBATION",
    CONFIRMED: "CONFIRMED",
    NOTICE_PERIOD: "NOTICE_PERIOD",
  };
  return map[normalized] ?? "PROBATION";
}

function fromApiWorkLocation(value: unknown): Manager["workLocation"] {
  const normalized = readApiScalar(value).toLowerCase().replace(/[\s-]+/g, "_");
  if (normalized === "remote" || normalized === "wfh" || normalized === "work_from_home") {
    return "remote";
  }
  if (normalized === "hybrid") return "hybrid";
  if (normalized === "on_site" || normalized === "onsite") return "on_site";
  return "on_site";
}

function resolveReportingManager(raw: Record<string, unknown>): {
  id: string | null;
  code: string;
  name: string;
} {
  const data = unwrapManagerApiRecord(raw);
  const reportingTo =
    data.reporting_to ??
    data.reportingTo ??
    data.reporting_manager ??
    data.reportingManager;

  let id: string | null = null;
  let name = readApiScalar(data.reporting_manager_name ?? data.reportingManagerName);

  if (reportingTo && typeof reportingTo === "object") {
    const obj = reportingTo as Record<string, unknown>;
    const firstName = readApiScalar(obj.first_name ?? obj.firstName);
    const lastName = readApiScalar(obj.last_name ?? obj.lastName);
    name =
      readApiScalar(obj.full_name ?? obj.fullName ?? obj.name) ||
      `${firstName} ${lastName}`.trim() ||
      name;
    const idRaw = obj.id ?? obj.user_id ?? obj.employee_id;
    id = idRaw != null ? String(idRaw) : null;
  } else if (reportingTo != null && reportingTo !== "") {
    id = String(reportingTo);
  } else if (data.reporting_manager_id != null) {
    id = String(data.reporting_manager_id);
  }

  return {
    id,
    code: readApiScalar(data.reportingManagerId),
    name,
  };
}

function mapPermissions(raw: unknown): Manager["permissions"] {
  if (!raw || typeof raw !== "object") return DEFAULT_PERMISSIONS;
  const p = raw as Record<string, unknown>;
  return {
    canApproveLeave: Boolean(p.can_approve_leave ?? p.canApproveLeave),
    canApproveAttendance: Boolean(p.can_approve_attendance ?? p.canApproveAttendance),
    canManageEmployees: Boolean(p.can_manage_employees ?? p.canManageEmployees),
    canViewPayroll: Boolean(p.can_view_payroll ?? p.canViewPayroll),
    canEditDepartments: Boolean(p.can_edit_departments ?? p.canEditDepartments),
    canInviteUsers: Boolean(p.can_invite_users ?? p.canInviteUsers),
    canManageRecruitment: Boolean(p.can_manage_recruitment ?? p.canManageRecruitment),
    canManagePerformance: Boolean(p.can_manage_performance ?? p.canManagePerformance),
  };
}

function mapManager(raw: Record<string, unknown>): Manager {
  const data = unwrapManagerApiRecord(raw);
  const firstName = readApiScalar(data.first_name ?? data.firstName);
  const lastName = readApiScalar(data.last_name ?? data.lastName);
  const fullName =
    readApiScalar(data.full_name ?? data.fullName ?? data.name) ||
    `${firstName} ${lastName}`.trim() ||
    "Unknown Manager";

  const reportingManager = resolveReportingManager(data);
  const permissions = mapPermissions(data.permissions);

  const attendance = (data.attendance_summary ?? data.attendanceSummary) as
    | Partial<Manager["attendanceSummary"]>
    | undefined;
  const leaveBalance = (data.leave_balance ?? data.leaveBalance) as
    | Partial<Manager["leaveBalance"]>
    | undefined;
  const recentActivity = (data.recent_activity ?? data.recentActivity) as
    | Manager["recentActivity"]
    | undefined;

  return {
    id: readApiScalar(data.id),
    managerId: readApiScalar(data.manager_id ?? data.managerId),
    employeeId:
      readApiScalar(data.employee_id ?? data.employeeId) ||
      readApiScalar(data.manager_id ?? data.managerId) ||
      readApiScalar(data.id),
    firstName: firstName || fullName.split(" ")[0] || "Manager",
    lastName: lastName || fullName.split(" ").slice(1).join(" "),
    fullName,
    email: readApiScalar(data.personal_email ?? data.company_email ?? data.email),
    phone: readApiScalar(data.phone),
    dob: readApiScalar(data.dob ?? data.date_of_birth),
    gender: fromApiGender(data.gender),
    profileImage:
      readApiScalar(data.profile_photo_url ?? data.profile_image ?? data.profileImage) || undefined,
    department: readApiScalar(data.department ?? data.department_name ?? data.departmentName),
    designation: readApiScalar(data.designation),
    managerRole: (readApiScalar(data.manager_role ?? data.managerRole) || "team_lead") as ManagerRole,
    reportingManagerId: reportingManager.id,
    reportingManagerCode: reportingManager.code,
    reportingManagerName: reportingManager.name,
    office: readApiScalar(data.branch ?? data.office ?? data.office_location),
    workLocation: fromApiWorkLocation(data.work_location ?? data.workLocation),
    joiningDate: readApiScalar(data.joining_date ?? data.joiningDate),
    employmentType: fromApiEmploymentType(data.employment_type ?? data.employmentType),
    shift: readApiScalar(data.shift) || "General",
    salary: data.ctc != null ? Number(data.ctc) : data.salary != null ? Number(data.salary) : undefined,
    status: fromApiEmploymentStatus(data.employment_status ?? data.status),
    teamSize: Number(data.team_size ?? data.teamSize ?? 0),
    teamIds: Array.isArray(data.team_ids)
      ? data.team_ids.map(String)
      : Array.isArray(data.teamIds)
        ? data.teamIds.map(String)
        : [],
    permissions,
    lastActive: readApiScalar(data.last_active ?? data.lastActive) || new Date().toISOString(),
    attendanceSummary: {
      present: Number(attendance?.present ?? 0),
      absent: Number(attendance?.absent ?? 0),
      late: Number(attendance?.late ?? 0),
      leave: Number(attendance?.leave ?? 0),
    },
    leaveBalance: {
      annual: Number(leaveBalance?.annual ?? 0),
      sick: Number(leaveBalance?.sick ?? 0),
      casual: Number(leaveBalance?.casual ?? 0),
    },
    bloodGroup: readApiScalar(data.blood_group ?? data.bloodGroup),
    maritalStatus: readApiScalar(data.marital_status ?? data.maritalStatus),
    performanceScore: Number(data.performance_score ?? data.performanceScore ?? 0),
    recentActivity: Array.isArray(recentActivity) ? recentActivity : [],
  };
}

export interface ManagerDetailPayload {
  manager: Manager;
  formState: ManagerFormState;
}

export const fetchManagerById = createAsyncThunk<
  ManagerDetailPayload,
  string,
  { rejectValue: string }
>("managers/fetchManagerById", async (id, thunkAPI) => {
  try {
    const response = await apiInstance.get(`/managers/${id}`);
    const raw = unwrapManagerApiRecord(
      (response.data?.data ?? response.data) as Record<string, unknown>,
    );
    return {
      manager: mapManager(raw),
      formState: apiManagerToFormState(raw),
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(
      parseApiError(error, "Failed to load manager details").message,
    );
  }
});

export const fetchManagers = createAsyncThunk<
  FetchManagersResult,
  FetchManagersParams | void,
  { rejectValue: string }
>("managers/fetchManagers", async (params, thunkAPI) => {
  try {
    const page = params?.page ?? 1;
    const limit = params?.limit ?? 20;
    const searchParams = new URLSearchParams();
    searchParams.set("page", String(page));
    searchParams.set("limit", String(limit));
    if (params?.search?.trim()) {
      searchParams.set("search", params.search.trim());
    }

    const response = await apiInstance.get(`/managers?${searchParams.toString()}`);
    const payload = response.data?.data ?? response.data ?? {};
    const items =
      payload.items ??
      payload.managers ??
      payload.results ??
      (Array.isArray(payload) ? payload : []);
    const mapped = Array.isArray(items)
      ? items.map((item: Record<string, unknown>) => mapManager(item))
      : [];
    const total = Number(payload.total ?? payload.total_count ?? payload.count ?? mapped.length);
    const resolvedLimit = Number(payload.limit ?? limit);
    const resolvedPage = Number(payload.page ?? page);
    const totalPages = Math.max(
      1,
      Number(
        payload.total_pages ??
          payload.totalPages ??
          payload.pages ??
          Math.ceil(total / Math.max(resolvedLimit, 1)),
      ),
    );

    return {
      items: mapped,
      total,
      page: resolvedPage,
      limit: resolvedLimit,
      totalPages,
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(parseApiError(error, "Failed to load managers").message);
  }
});

export const createManager = createAsyncThunk<
  Manager,
  ManagerApiPayload,
  { rejectValue: ParsedError }
>("managers/createManager", async (payload, thunkAPI) => {
  try {
    const response = await apiInstance.post("/managers", payload);
    const raw = response.data?.data ?? response.data;
    return mapManager(raw as Record<string, unknown>);
  } catch (error) {
    return thunkAPI.rejectWithValue(parseApiError(error, "Failed to create manager"));
  }
});

export const updateManager = createAsyncThunk<
  Manager,
  { id: string; payload: ManagerApiPayload },
  { rejectValue: ParsedError }
>("managers/updateManager", async ({ id, payload }, thunkAPI) => {
  try {
    const response = await apiInstance.put(`/managers/${id}`, payload);
    const raw = response.data?.data ?? response.data;
    return mapManager(raw as Record<string, unknown>);
  } catch (error) {
    return thunkAPI.rejectWithValue(parseApiError(error, "Failed to update manager"));
  }
});

export const deleteManager = createAsyncThunk<string, string, { rejectValue: ParsedError }>(
  "managers/deleteManager",
  async (id, thunkAPI) => {
    try {
      await apiInstance.delete(`/managers/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(parseApiError(error, "Failed to delete manager"));
    }
  },
);

/*
export const bulkDeleteManagers = createAsyncThunk<string[], string[], { rejectValue: string }>(
  "managers/bulkDeleteManagers",
  async (ids) => {
    await tryApi(() => apiInstance.post("/managers/bulk-delete", { ids }), undefined);
    return ids;
  },
);

export const bulkSetManagerStatus = createAsyncThunk<
  { ids: string[]; status: Manager["status"] },
  { ids: string[]; status: Manager["status"] },
  { rejectValue: string }
>("managers/bulkSetManagerStatus", async ({ ids, status }) => {
  await tryApi(() => apiInstance.patch("/managers/bulk-status", { ids, status }), undefined);
  return { ids, status };
});
*/

export const importManagers = createAsyncThunk<Manager[], Manager[], { rejectValue: string }>(
  "managers/importManagers",
  async (managers) => {
    await tryApi(() => apiInstance.post("/managers/import", { managers }), undefined);
    return managers;
  },
);
