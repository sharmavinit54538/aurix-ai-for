import { createSlice } from "@reduxjs/toolkit";
import type { DepartmentsState } from "./departmentsTypes";
import {
  addEmployeeToDepartment,
  bulkAssignDepartmentManager,
  bulkDeleteDepartments,
  bulkSetDepartmentStatus,
  createDepartment,
  deleteDepartment,
  fetchDepartments,
  importDepartments,
  removeEmployeeFromDepartment,
  transferDepartmentEmployees,
  updateDepartment,
} from "./departmentsThunk";
import type { Department } from "./types";

const initialState: DepartmentsState = {
  departments: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 20,
  pages: 1,
};

function updateEmployeeIds(
  departments: Department[],
  deptId: string,
  updater: (ids: string[]) => string[],
): Department[] {
  return departments.map((d) => {
    if (d.id !== deptId) return d;
    const employeeIds = updater(d.employeeIds);
    return { ...d, employeeIds, currentEmployeeCount: employeeIds.length };
  });
}

const departmentsSlice = createSlice({
  name: "departments",
  initialState,
  reducers: {
    clearDepartments(state) {
      state.departments = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.pages = action.payload.pages;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load departments";
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.departments = [action.payload, ...state.departments];
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.departments = state.departments.map((d) =>
          d.id === action.payload.id ? action.payload : d,
        );
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.departments = state.departments.filter((d) => d.id !== action.payload);
      })
      .addCase(bulkDeleteDepartments.fulfilled, (state, action) => {
        state.departments = state.departments.filter((d) => !action.payload.includes(d.id));
      })
      .addCase(bulkSetDepartmentStatus.fulfilled, (state, action) => {
        const { ids, status } = action.payload;
        state.departments = state.departments.map((d) =>
          ids.includes(d.id) ? { ...d, status } : d,
        );
      })
      .addCase(bulkAssignDepartmentManager.fulfilled, (state, action) => {
        const { ids, managerId, managerName } = action.payload;
        state.departments = state.departments.map((d) =>
          ids.includes(d.id)
            ? { ...d, departmentHeadId: managerId, departmentHeadName: managerName }
            : d,
        );
      })
      .addCase(importDepartments.fulfilled, (state, action) => {
        state.departments = [...action.payload, ...state.departments];
      })
      .addCase(addEmployeeToDepartment.fulfilled, (state, action) => {
        const { deptId, employeeId } = action.payload;
        state.departments = state.departments.map((d) => {
          if (d.id === deptId) {
            const ids = d.employeeIds.includes(employeeId)
              ? d.employeeIds
              : [...d.employeeIds, employeeId];
            return { ...d, employeeIds: ids, currentEmployeeCount: ids.length };
          }
          if (d.id !== deptId && d.employeeIds.includes(employeeId)) {
            const ids = d.employeeIds.filter((id) => id !== employeeId);
            return { ...d, employeeIds: ids, currentEmployeeCount: ids.length };
          }
          return d;
        });
      })
      .addCase(removeEmployeeFromDepartment.fulfilled, (state, action) => {
        const { deptId, employeeId } = action.payload;
        state.departments = updateEmployeeIds(state.departments, deptId, (ids) =>
          ids.filter((id) => id !== employeeId),
        );
      })
      .addCase(transferDepartmentEmployees.fulfilled, (state, action) => {
        const { fromDeptId, toDeptId } = action.payload;
        const fromDept = state.departments.find((d) => d.id === fromDeptId);
        if (!fromDept) return;

        const idsToTransfer = fromDept.employeeIds;
        state.departments = state.departments.map((d) => {
          if (d.id === fromDeptId) {
            return { ...d, employeeIds: [], currentEmployeeCount: 0 };
          }
          if (d.id === toDeptId) {
            const newIds = [...new Set([...d.employeeIds, ...idsToTransfer])];
            return { ...d, employeeIds: newIds, currentEmployeeCount: newIds.length };
          }
          return d;
        });
      });
  },
});

export const { clearDepartments } = departmentsSlice.actions;
export default departmentsSlice.reducer;
