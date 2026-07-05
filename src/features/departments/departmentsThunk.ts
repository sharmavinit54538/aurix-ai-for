import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiInstance } from "@/api";
import { tryApi } from "@/api/utils";
import { aurix } from "@/lib/aurix-store";
import { SEED_DEPARTMENTS } from "./constants";
import type { Department } from "./types";

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

export const fetchDepartments = createAsyncThunk<Department[], void, { rejectValue: string }>(
  "departments/fetchDepartments",
  async () => {
    try {
      const response = await apiInstance.get("/departments");
      const items = response.data?.data?.items ?? response.data?.data ?? response.data ?? [];
      const list = Array.isArray(items) && items.length > 0 ? items : SEED_DEPARTMENTS;
      return syncWithEmployees(list);
    } catch {
      return syncWithEmployees([...SEED_DEPARTMENTS]);
    }
  },
);

export const createDepartment = createAsyncThunk<Department, Department, { rejectValue: string }>(
  "departments/createDepartment",
  async (department) => {
    await tryApi(() => apiInstance.post("/departments", department), undefined);
    return department;
  },
);

export const updateDepartment = createAsyncThunk<Department, Department, { rejectValue: string }>(
  "departments/updateDepartment",
  async (department) => {
    await tryApi(() => apiInstance.put(`/departments/${department.id}`, department), undefined);
    return department;
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
