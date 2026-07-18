import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiInstance } from "@/api";
import { tryApi } from "@/api/utils";
import { aurix } from "@/lib/aurix-store";
import type { Department } from "./types";

function mapBackendToFrontend(d: any): Department {
  const openPositions = Number(d.open_positions ?? d.openPositions ?? d.open_positions_count ?? 0);
  const hiringStatus = String(d.hiring_status ?? d.hiringStatus ?? "").toLowerCase();

  return {
    id: d.id,
    name: d.department_name ?? d.name ?? "",
    code: d.department_code ?? d.code ?? "",
    description: d.description ?? "",
    departmentHeadId: d.manager_id ?? d.departmentHeadId ?? null,
    departmentHeadName: d.manager_name ?? d.departmentHeadName ?? (d.manager_details?.name ?? "Unassigned"),
    reportingManagerId: d.reporting_manager_id ?? d.reportingManagerId ?? null,
    reportingManagerName: d.reporting_manager_name ?? d.reportingManagerName ?? "None",
    office: d.location ?? d.office ?? "",
    budget: d.budget ?? 50000,
    costCenter: d.cost_center ?? d.costCenter ?? "",
    employeeCapacity: d.employee_capacity ?? d.employeeCapacity ?? 30,
    currentEmployeeCount: d.employee_count ?? d.currentEmployeeCount ?? 0,
    extensionNumber: "",
    status: ((d.status ?? d.status)?.toLowerCase() === "active" ? "active" : "inactive") as any,
    themeColor: d.theme_color ?? d.themeColor ?? "#3b82f6",
    iconName: d.icon_name ?? d.iconName ?? "Building2",
    parentId: d.parent_department_id ?? d.parentId ?? null,
    parentName: d.parent_department_name ?? d.parentName ?? "None",
    createdDate: d.created_at ? d.created_at.split("T")[0] : (d.createdDate ?? ""),
    employeeIds: [],
    openPositions,
    performanceScore: Number(d.performance_score ?? d.performanceScore ?? 85),
    attendanceScore: Number(d.attendance_score ?? d.attendanceScore ?? 92),
    hiringStatus: ["open", "paused", "closed"].includes(hiringStatus)
      ? (hiringStatus as Department["hiringStatus"])
      : openPositions > 0
        ? "open"
        : "closed",
    recentActivity: Array.isArray(d.recent_activity ?? d.recentActivity)
      ? (d.recent_activity ?? d.recentActivity)
      : [],
    documents: Array.isArray(d.documents) ? d.documents : [],
  };
}

const mapFrontendToBackend = (d: Partial<Department>) => {
  return {
    department_name: d.name?.trim(),
    description: d.description?.trim() || "No description provided",
    manager_id: d.departmentHeadId || null,
    parent_department_id: d.parentId || null,
    branch_id: null,
    location: d.office?.trim() || "Headquarters",
    cost_center: d.costCenter?.trim() || null,
    status: (d.status ?? "active").toUpperCase(),
  };
};

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

export const createDepartment = createAsyncThunk<Department, Partial<Department>, { rejectValue: string }>(
  "departments/createDepartment",
  async (department, { rejectWithValue }) => {
    try {
      const payload = mapFrontendToBackend(department);
      const response = await apiInstance.post("/departments", payload);
      const data = response.data?.data;
      return mapBackendToFrontend(data);
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
      return mapBackendToFrontend(data);
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
