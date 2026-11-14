import type { RootState } from "@/redux/store";

export const selectHierarchyState = (state: RootState) =>
  state.employeeHierarchy;
export const selectEmployeeHierarchyData = (state: RootState) =>
  state.employeeHierarchy.data;
export const selectEmployeeHierarchyLoading = (state: RootState) =>
  state.employeeHierarchy.loading;
export const selectEmployeeHierarchyError = (state: RootState) =>
  state.employeeHierarchy.error;

export const selectFilteredHierarchyTrees = (state: RootState) =>
  state.employeeHierarchy.trees || [];
export const selectMatchingNodeIds = (_state: RootState) => new Set<string>();

export const selectAvailableDepartments = (state: RootState): string[] => {
  const list = state.employeeHierarchy.flatList || [];
  return Array.from(
    new Set(
      list
        .map((e: any) => String(e.department || "").trim())
        .filter(Boolean),
    ),
  );
};

export const selectAvailableDesignations = (state: RootState): string[] => {
  const list = state.employeeHierarchy.flatList || [];
  return Array.from(
    new Set(
      list
        .map((e: any) => String(e.designation || e.role || "").trim())
        .filter(Boolean),
    ),
  );
};

export const selectAvailableLocations = (state: RootState): string[] => {
  const list = state.employeeHierarchy.flatList || [];
  return Array.from(
    new Set(
      list
        .map((e: any) => String(e.location || "").trim())
        .filter(Boolean),
    ),
  );
};

export const selectAvailableManagers = (
  state: RootState,
): Array<{ id: string; name: string }> => {
  const list = state.employeeHierarchy.flatList || [];
  return list
    .filter((e: any) => (e.directReportsCount ?? 0) > 0)
    .map((e: any) => ({
      id: String(e.id),
      name: String(e.name || e.fullName || ""),
    }))
    .filter((m) => m.id && m.name);
};
