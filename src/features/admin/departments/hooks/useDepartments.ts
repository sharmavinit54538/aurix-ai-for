import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import type { Department } from "../types";
import {
  addEmployeeToDepartment,
  bulkAssignDepartmentManager,
  bulkDeleteDepartments,
  bulkSetDepartmentStatus,
  createDepartment,
  deleteDepartment,
  fetchDepartments,
  importDepartments,
  promoteDepartmentEmployee,
  removeEmployeeFromDepartment,
  transferDepartmentEmployees,
  updateDepartment,
} from "../departmentsThunk";

export function useDepartments() {
  const dispatch = useAppDispatch();
  const { departments, loading, error } = useAppSelector((state) => state.departments);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  return {
    departments,
    loading,
    error,
    createDepartment: (dept: Department) => dispatch(createDepartment(dept)),
    updateDepartment: (dept: Department) => dispatch(updateDepartment(dept)),
    deleteDepartment: (id: string) => dispatch(deleteDepartment(id)),
    bulkDelete: (ids: string[]) => dispatch(bulkDeleteDepartments(ids)),
    bulkSetStatus: (ids: string[], status: Department["status"]) =>
      dispatch(bulkSetDepartmentStatus({ ids, status })),
    bulkAssignManager: (ids: string[], managerId: string, managerName: string) =>
      dispatch(bulkAssignDepartmentManager({ ids, managerId, managerName })),
    importDepartments: (imported: Department[]) => dispatch(importDepartments(imported)),
    addEmployeeToDept: (deptId: string, employeeId: string) =>
      dispatch(addEmployeeToDepartment({ deptId, employeeId })),
    removeEmployeeFromDept: (deptId: string, employeeId: string) =>
      dispatch(removeEmployeeFromDepartment({ deptId, employeeId })),
    transferEmployees: (fromDeptId: string, toDeptId: string) =>
      dispatch(transferDepartmentEmployees({ fromDeptId, toDeptId })),
    promoteEmployee: (employeeId: string, newDesignation: string) =>
      dispatch(promoteDepartmentEmployee({ employeeId, newDesignation })),
  };
}
