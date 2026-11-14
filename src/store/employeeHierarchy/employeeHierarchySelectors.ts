import type { RootState } from "@/redux/store";

export const selectHierarchyState = (state: RootState) => state.employeeHierarchy;
export const selectEmployeeHierarchyData = (state: RootState) => state.employeeHierarchy.data;
export const selectEmployeeHierarchyLoading = (state: RootState) => state.employeeHierarchy.loading;
export const selectEmployeeHierarchyError = (state: RootState) => state.employeeHierarchy.error;

export const selectFilteredHierarchyTrees = (state: RootState) => state.employeeHierarchy.trees || [];
export const selectMatchingNodeIds = (_state: RootState) => new Set<string>();
export const selectAvailableDepartments = (_state: RootState) => ["Engineering", "Product", "Design", "HR", "Finance", "Operations"];
export const selectAvailableDesignations = (_state: RootState) => ["VP", "Director", "Engineering Manager", "Senior Engineer", "Product Manager"];
export const selectAvailableLocations = (_state: RootState) => ["San Francisco", "New York", "Remote", "London", "Bengaluru"];
export const selectAvailableManagers = (_state: RootState) => [
  { id: "emp-1", name: "Alex Vance" },
  { id: "emp-2", name: "Sarah Chen" },
];
