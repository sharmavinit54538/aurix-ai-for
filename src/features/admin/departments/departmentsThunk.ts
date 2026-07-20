import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiInstance } from "@/api";
import { tryApi } from "@/api/utils";
import { aurix } from "@/lib/aurix-store";
import type { Department } from "./types";
import {
  mergeDepartmentRecord,
  normalizeIconName,
  normalizeThemeColor,
  unwrapDepartmentApiRecord,
} from "./utils/departmentTheme";

function readScalar(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}

export function mapBackendToFrontend(d: any): Department {
  const data = unwrapDepartmentApiRecord(d);
  const manager = data.manager_details ?? data.manager ?? data.department_head;
  let departmentHeadId =
    data.manager_id != null
      ? String(data.manager_id)
      : data.departmentHeadId != null
        ? String(data.departmentHeadId)
        : null;
  let departmentHeadName =
    readScalar(data.manager_name ?? data.departmentHeadName) ||
    readScalar((manager as Record<string, unknown> | undefined)?.name) ||
    readScalar((manager as Record<string, unknown> | undefined)?.full_name) ||
    "Unassigned";

  if (manager && typeof manager === "object") {
    const mgr = manager as Record<string, unknown>;
    if (mgr.id != null) departmentHeadId = String(mgr.id);
    const mgrName = readScalar(mgr.full_name ?? mgr.fullName ?? mgr.name);
    if (mgrName) departmentHeadName = mgrName;
  }

  const openPositions = Number(data.open_positions ?? data.openPositions ?? data.open_positions_count ?? 0);
  const hiringStatus = String(data.hiring_status ?? data.hiringStatus ?? "").toLowerCase();
  const rawStatus = String(data.status ?? "active").toLowerCase();

  return {
    id: String(data.id ?? ""),
    name: readScalar(data.department_name ?? data.dept_name ?? data.title ?? data.name),
    description: readScalar(data.description),
    department_code: readScalar(data.department_code ?? data.code),
    cost_center: readScalar(data.cost_center ?? data.costCenter),
    departmentHeadId,
    departmentHeadName,
    reportingManagerId:
      data.reporting_manager_id != null
        ? String(data.reporting_manager_id)
        : data.reportingManagerId != null
          ? String(data.reportingManagerId)
          : null,
    reportingManagerName: readScalar(data.reporting_manager_name ?? data.reportingManagerName) || "None",
    office: readScalar(data.location ?? data.office),
    budget: Number(data.budget ?? 0),
    employeeCapacity: Number(data.employee_capacity ?? data.employeeCapacity ?? 30),
    currentEmployeeCount: Number(data.employee_count ?? data.currentEmployeeCount ?? 0),
    extensionNumber: readScalar(data.extension_number ?? data.extensionNumber),
    status: (rawStatus === "active" ? "active" : "inactive") as Department["status"],
    themeColor: normalizeThemeColor(readScalar(data.theme_color ?? data.themeColor) || undefined),
    iconName: normalizeIconName(readScalar(data.icon_name ?? data.iconName) || undefined),
    parentId:
      data.parent_department_id != null
        ? String(data.parent_department_id)
        : data.parentId != null
          ? String(data.parentId)
          : null,
    parentName: readScalar(data.parent_department_name ?? data.parentName) || "None",
    createdDate: data.created_at ? String(data.created_at).split("T")[0] : readScalar(data.createdDate),
    employeeIds: Array.isArray(data.employee_ids ?? data.employeeIds)
      ? ((data.employee_ids ?? data.employeeIds) as unknown[]).map(String)
      : [],
    openPositions,
    performanceScore: Number(data.performance_score ?? data.performanceScore ?? 85),
    attendanceScore: Number(data.attendance_score ?? data.attendanceScore ?? 92),
    hiringStatus: ["open", "paused", "closed"].includes(hiringStatus)
      ? (hiringStatus as Department["hiringStatus"])
      : openPositions > 0
        ? "open"
        : "closed",
    recentActivity: Array.isArray(data.recent_activity ?? data.recentActivity)
      ? ((data.recent_activity ?? data.recentActivity) as Department["recentActivity"])
      : [],
    documents: Array.isArray(data.documents) ? data.documents : [],
  };
}

export function mapFrontendToBackend(department: Partial<Department>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  if (department.name != null) payload.department_name = department.name;
  if (department.description != null) payload.description = department.description;
  if (department.department_code != null) payload.department_code = department.department_code;
  if (department.cost_center != null) payload.cost_center = department.cost_center;
  if (department.departmentHeadId != null) payload.manager_id = department.departmentHeadId;
  if (department.reportingManagerId != null) payload.reporting_manager_id = department.reportingManagerId;
  if (department.office != null) payload.location = department.office;
  if (department.budget != null) payload.budget = department.budget;
  if (department.employeeCapacity != null) payload.employee_capacity = department.employeeCapacity;
  if (department.extensionNumber != null) payload.extension_number = department.extensionNumber;
  if (department.status != null) payload.status = department.status.toUpperCase();
  if (department.themeColor != null) payload.theme_color = department.themeColor;
  if (department.iconName != null) payload.icon_name = department.iconName;
  if (department.parentId != null) payload.parent_department_id = department.parentId;

  return payload;
}

function syncWithEmployees(departments: Department[]): Department[] {
  const workspace = aurix.get();
  if (workspace.employees.length === 0) return departments;

  return departments.map((d) => {
    const matches = workspace.employees.filter(
      (e) => e.department && e.department.toLowerCase() === d.name.toLowerCase(),
    );
    const matchIds = matches.map((m) => m.id);
    return {
      ...d,
      employeeIds: matchIds,
      currentEmployeeCount: matches.length > 0 ? matches.length : d.currentEmployeeCount,
    };
  });
}

export const fetchDepartments = createAsyncThunk<
  { items: Department[]; total: number; page: number; limit: number; pages: number },
  { search?: string; status?: string; page?: number; limit?: number } | void,
  { rejectValue: string }
>(
  "departments/fetchDepartments",
  async (params, { rejectWithValue }) => {
    try {
      const queryParams: any = {};
      if (params) {
        if (params.search) queryParams.search = params.search;
        if (params.status && params.status !== "all") {
          queryParams.status = params.status.toUpperCase();
        }
        if (params.page) queryParams.page = params.page;
        if (params.limit) queryParams.limit = params.limit;
      }
      
      const response = await apiInstance.get("/departments", { params: queryParams });
      const data = response.data?.data;
      if (!data) {
        throw new Error("No data received from backend");
      }
      
      const items = data.items ?? [];
      const mappedItems = items.map((item: any) => mapBackendToFrontend(item));

      return {
        items: syncWithEmployees(mappedItems),
        total: data.total ?? 0,
        page: data.page ?? 1,
        limit: data.limit ?? 20,
        pages: data.pages ?? 1,
      };
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || "Failed to load departments";
      return rejectWithValue(msg);
    }
  },
);

export const fetchDepartmentById = createAsyncThunk<Department, string, { rejectValue: string }>(
  "departments/fetchDepartmentById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiInstance.get(`/departments/${id}`);
      const body = response.data?.data ?? response.data;
      const raw = unwrapDepartmentApiRecord(body);
      const mapped = mapBackendToFrontend(raw);
      const [synced] = syncWithEmployees([mapped]);
      return synced;
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || "Failed to load department details";
      return rejectWithValue(msg);
    }
  },
);

export const createDepartment = createAsyncThunk<Department, Partial<Department>, { rejectValue: string }>(
  "departments/createDepartment",
  async (department, { rejectWithValue }) => {
    try {
      const payload = mapFrontendToBackend(department);
      const response = await apiInstance.post("/departments", payload);
      const data = response.data?.data;
      const mapped = mapBackendToFrontend(data);
      return {
        ...mapped,
        themeColor: normalizeThemeColor(department.themeColor ?? mapped.themeColor),
        iconName: normalizeIconName(department.iconName ?? mapped.iconName),
      };
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || "Failed to create department";
      return rejectWithValue(msg);
    }
  },
);

export const updateDepartment = createAsyncThunk<Department, Partial<Department> & { id: string }, { rejectValue: string }>(
  "departments/updateDepartment",
  async (department, { rejectWithValue }) => {
    try {
      const payload = mapFrontendToBackend(department);
      const response = await apiInstance.put(`/departments/${department.id}`, payload);
      const data = response.data?.data;
      const mapped = mapBackendToFrontend(data);
      return {
        ...mapped,
        themeColor: normalizeThemeColor(department.themeColor ?? mapped.themeColor),
        iconName: normalizeIconName(department.iconName ?? mapped.iconName),
      };
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message || "Failed to update department";
      return rejectWithValue(msg);
    }
  },
);

export const deleteDepartment = createAsyncThunk<string, string, { rejectValue: string }>(
  "departments/deleteDepartment",
  async (id) => {
    await tryApi(() => apiInstance.delete(`/departments/${id}`), undefined);
    return id;
  },
);

export const bulkDeleteDepartments = createAsyncThunk<string[], string[], { rejectValue: string }>(
  "departments/bulkDeleteDepartments",
  async (ids) => {
    await tryApi(() => apiInstance.post("/departments/bulk-delete", { ids }), undefined);
    return ids;
  },
);

export const bulkSetDepartmentStatus = createAsyncThunk<
  { ids: string[]; status: Department["status"] },
  { ids: string[]; status: Department["status"] },
  { rejectValue: string }
>("departments/bulkSetDepartmentStatus", async ({ ids, status }) => {
  await tryApi(() => apiInstance.patch("/departments/bulk-status", { ids, status }), undefined);
  return { ids, status };
});

export const bulkAssignDepartmentManager = createAsyncThunk<
  { ids: string[]; managerId: string; managerName: string },
  { ids: string[]; managerId: string; managerName: string },
  { rejectValue: string }
>("departments/bulkAssignDepartmentManager", async (payload) => {
  await tryApi(() => apiInstance.patch("/departments/bulk-assign-manager", payload), undefined);
  return payload;
});

export const importDepartments = createAsyncThunk<Department[], Department[], { rejectValue: string }>(
  "departments/importDepartments",
  async (departments) => {
    await tryApi(() => apiInstance.post("/departments/import", { departments }), undefined);
    return departments;
  },
);

export const addEmployeeToDepartment = createAsyncThunk<
  { deptId: string; employeeId: string },
  { deptId: string; employeeId: string },
  { rejectValue: string }
>("departments/addEmployeeToDepartment", async ({ deptId, employeeId }, { getState }) => {
  const workspace = aurix.get();
  const state = getState() as { departments: { departments: Department[] } };
  const dept = state.departments.departments.find((d) => d.id === deptId);
  const emp = workspace.employees.find((e) => e.id === employeeId);

  if (emp && dept) {
    const updatedEmployees = workspace.employees.map((e) =>
      e.id === employeeId
        ? { ...e, department: dept.name, managerName: dept.departmentHeadName }
        : e,
    );
    aurix.set({ employees: updatedEmployees });
  }

  await tryApi(
    () => apiInstance.post(`/departments/${deptId}/employees`, { employeeId }),
    undefined,
  );
  return { deptId, employeeId };
});

export const removeEmployeeFromDepartment = createAsyncThunk<
  { deptId: string; employeeId: string },
  { deptId: string; employeeId: string },
  { rejectValue: string }
>("departments/removeEmployeeFromDepartment", async ({ deptId, employeeId }) => {
  const workspace = aurix.get();
  const emp = workspace.employees.find((e) => e.id === employeeId);

  if (emp) {
    const updatedEmployees = workspace.employees.map((e) =>
      e.id === employeeId ? { ...e, department: "", managerName: "" } : e,
    );
    aurix.set({ employees: updatedEmployees });
  }

  await tryApi(
    () => apiInstance.delete(`/departments/${deptId}/employees/${employeeId}`),
    undefined,
  );
  return { deptId, employeeId };
});

export const transferDepartmentEmployees = createAsyncThunk<
  { fromDeptId: string; toDeptId: string },
  { fromDeptId: string; toDeptId: string },
  { rejectValue: string }
>("departments/transferDepartmentEmployees", async ({ fromDeptId, toDeptId }, { getState }) => {
  const state = getState() as { departments: { departments: Department[] } };
  const fromDept = state.departments.departments.find((d) => d.id === fromDeptId);
  const toDept = state.departments.departments.find((d) => d.id === toDeptId);

  if (fromDept && toDept) {
    const idsToTransfer = fromDept.employeeIds;
    const workspace = aurix.get();
    const updatedEmployees = workspace.employees.map((e) =>
      idsToTransfer.includes(e.id)
        ? { ...e, department: toDept.name, managerName: toDept.departmentHeadName }
        : e,
    );
    aurix.set({ employees: updatedEmployees });
  }

  await tryApi(
    () => apiInstance.post("/departments/transfer-employees", { fromDeptId, toDeptId }),
    undefined,
  );
  return { fromDeptId, toDeptId };
});

export const promoteDepartmentEmployee = createAsyncThunk<
  { employeeId: string; newDesignation: string },
  { employeeId: string; newDesignation: string },
  { rejectValue: string }
>("departments/promoteDepartmentEmployee", async ({ employeeId, newDesignation }) => {
  const workspace = aurix.get();
  const emp = workspace.employees.find((e) => e.id === employeeId);
  if (emp) {
    const updatedEmployees = workspace.employees.map((e) =>
      e.id === employeeId ? { ...e, designation: newDesignation } : e,
    );
    aurix.set({ employees: updatedEmployees });
  }

  await tryApi(
    () => apiInstance.patch(`/employees/${employeeId}/promote`, { designation: newDesignation }),
    undefined,
  );
  return { employeeId, newDesignation };
});
