import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearSelectedDepartment, setSelectedDepartment } from "../departmentsSlice";
import type { Department } from "../types";
import {
  fetchDepartments,
  fetchDepartmentById,
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

  const fetchDepartmentsAction = useCallback(
    (params?: any) => dispatch(fetchDepartments(params)),
    [dispatch],
  );

  const fetchDepartmentByIdAction = useCallback(
    (id: string) => dispatch(fetchDepartmentById(id)),
    [dispatch],
  );

  const clearSelectedDepartmentAction = useCallback(
    () => dispatch(clearSelectedDepartment()),
    [dispatch],
  );

  const setSelectedDepartmentAction = useCallback(
    (department: Department | null) => dispatch(setSelectedDepartment(department)),
    [dispatch],
  );

  const createDepartmentAction = useCallback(
    (dept: Partial<Department>) => dispatch(createDepartment(dept)),
    [dispatch],
  );

  const updateDepartmentAction = useCallback(
    (dept: Partial<Department> & { id: string }) => dispatch(updateDepartment(dept)),
    [dispatch],
  );

  const deleteDepartmentAction = useCallback(
    (id: string) => dispatch(deleteDepartment(id)),
    [dispatch],
  );

  const bulkDeleteAction = useCallback(
    (ids: string[]) => dispatch(bulkDeleteDepartments(ids)),
    [dispatch],
  );

  const bulkSetStatusAction = useCallback(
    (ids: string[], status: Department["status"]) =>
      dispatch(bulkSetDepartmentStatus({ ids, status })),
    [dispatch],
  );

  const bulkAssignManagerAction = useCallback(
    (ids: string[], managerId: string, managerName: string) =>
      dispatch(bulkAssignDepartmentManager({ ids, managerId, managerName })),
    [dispatch],
  );

  const importDepartmentsAction = useCallback(
    (depts: Department[]) => dispatch(importDepartments(depts)),
    [dispatch],
  );

  const addEmployeeToDeptAction = useCallback(
    (deptId: string, employeeId: string) =>
      dispatch(addEmployeeToDepartment({ deptId, employeeId })),
    [dispatch],
  );

  const removeEmployeeFromDeptAction = useCallback(
    (deptId: string, employeeId: string) =>
      dispatch(removeEmployeeFromDepartment({ deptId, employeeId })),
    [dispatch],
  );

  const transferEmployeesAction = useCallback(
    (fromDeptId: string, toDeptId: string) =>
      dispatch(transferDepartmentEmployees({ fromDeptId, toDeptId })),
    [dispatch],
  );

  const promoteEmployeeAction = useCallback(
    (_deptId: string, employeeId: string, newRole: string) =>
      dispatch(promoteDepartmentEmployee({ employeeId, newDesignation: newRole })),
    [dispatch],
  );

  return {
    departments: state.departments,
    loading: state.loading,
    error: state.error,
    total: state.total || 0,
    page: state.page || 1,
    limit: state.limit || 20,
    pages: state.pages || 1,
    selectedDepartment: state.selectedDepartment,
    selectedDepartmentLoading: state.selectedDepartmentLoading,
    selectedDepartmentError: state.selectedDepartmentError,
    fetchDepartments: fetchDepartmentsAction,
    fetchDepartmentById: fetchDepartmentByIdAction,
    clearSelectedDepartment: clearSelectedDepartmentAction,
    setSelectedDepartment: setSelectedDepartmentAction,
    createDepartment: createDepartmentAction,
    updateDepartment: updateDepartmentAction,
    deleteDepartment: deleteDepartmentAction,
    bulkDelete: bulkDeleteAction,
    bulkSetStatus: bulkSetStatusAction,
    bulkAssignManager: bulkAssignManagerAction,
    importDepartments: importDepartmentsAction,
    addEmployeeToDept: addEmployeeToDeptAction,
    removeEmployeeFromDept: removeEmployeeFromDeptAction,
    transferEmployees: transferEmployeesAction,
    promoteEmployee: promoteEmployeeAction,
  };
}
