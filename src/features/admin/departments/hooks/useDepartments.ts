import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { Department } from "../types";
import {
  fetchDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  bulkDeleteDepartments,
  bulkSetDepartmentStatus,
  bulkAssignDepartmentManager,
  importDepartments,
  addEmployeeToDepartment,
  removeEmployeeFromDepartment,
  transferDepartmentEmployees,
  promoteDepartmentEmployee,
} from "../departmentsThunk";

export function useDepartments() {
  const dispatch = useAppDispatch();
  const state = useAppSelector((state) => state.departments);

  return {
    departments: state.departments,
    loading: state.loading,
    error: state.error,
    total: state.total || 0,
    page: state.page || 1,
    limit: state.limit || 20,
    pages: state.pages || 1,
    fetchDepartments: (params?: any) => dispatch(fetchDepartments(params)),
    createDepartment: (dept: Partial<Department>) => dispatch(createDepartment(dept)),
    updateDepartment: (dept: Partial<Department> & { id: string }) => dispatch(updateDepartment(dept)),
    deleteDepartment: (id: string) => dispatch(deleteDepartment(id)),
    bulkDelete: (ids: string[]) => dispatch(bulkDeleteDepartments(ids)),
    bulkSetStatus: (ids: string[], status: Department["status"]) =>
      dispatch(bulkSetDepartmentStatus({ ids, status })),
    bulkAssignManager: (ids: string[], managerId: string, managerName: string) =>
      dispatch(bulkAssignDepartmentManager({ ids, managerId, managerName })),
    importDepartments: (depts: Department[]) => dispatch(importDepartments(depts)),
    addEmployeeToDept: (deptId: string, employeeId: string) =>
      dispatch(addEmployeeToDepartment({ deptId, employeeId })),
    removeEmployeeFromDept: (deptId: string, employeeId: string) =>
      dispatch(removeEmployeeFromDepartment({ deptId, employeeId })),
    transferEmployees: (fromDeptId: string, toDeptId: string) =>
      dispatch(transferDepartmentEmployees({ fromDeptId, toDeptId })),
    promoteEmployee: (_deptId: string, employeeId: string, newRole: string) =>
      dispatch(promoteDepartmentEmployee({ employeeId, newDesignation: newRole })),
  };
}
