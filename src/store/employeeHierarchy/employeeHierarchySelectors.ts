import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";
import type { BackendHierarchyNode } from "./employeeHierarchyTypes";

export const selectHierarchyState = (state: RootState) =>
  state.employeeHierarchy || {
    loading: false,
    error: null,
    hierarchy: null,
    selectedEmployeeId: null,
    selectedEmployeeDetails: null,
    loadingDetails: false,
    detailsError: null,
    expandedNodes: {},
    searchKeyword: "",
    filters: {
      department: "all",
      designation: "all",
      location: "all",
      employmentType: "all",
      reportingManagerId: "all",
    },
    zoomLevel: 100,
    isFullscreen: false,
  };

export const selectRawHierarchyTrees = createSelector(
  [selectHierarchyState],
  (state) => state.hierarchy
);

export const selectSearchKeyword = createSelector(
  [selectHierarchyState],
  (state) => state.searchKeyword.toLowerCase().trim()
);

export const selectFilters = createSelector(
  [selectHierarchyState],
  (state) => state.filters
);

function flattenNodes(nodes: BackendHierarchyNode[] | null): BackendHierarchyNode[] {
  if (!nodes) return [];
  const list: BackendHierarchyNode[] = [];
  nodes.forEach((node) => {
    list.push(node);
    if (node.children && node.children.length > 0) {
      list.push(...flattenNodes(node.children));
    }
  });
  return list;
}

export const selectFlatEmployeeNodes = createSelector(
  [selectRawHierarchyTrees],
  (trees) => flattenNodes(trees)
);

export const selectAvailableDepartments = createSelector(
  [selectFlatEmployeeNodes],
  (nodes) => Array.from(new Set(nodes.map((n) => n.department).filter(Boolean))).sort()
);

export const selectAvailableDesignations = createSelector(
  [selectFlatEmployeeNodes],
  (nodes) => Array.from(new Set(nodes.map((n) => n.designation).filter(Boolean))).sort()
);

export const selectAvailableLocations = createSelector(
  [selectFlatEmployeeNodes],
  (nodes) => Array.from(new Set(nodes.map((n) => n.branch).filter(Boolean))).sort() as string[]
);

export const selectAvailableManagers = createSelector(
  [selectFlatEmployeeNodes],
  (nodes) =>
    nodes
      .filter((n) => (n.children && n.children.length > 0) || n.reporting_manager_name)
      .map((n) => ({
        id: n.id,
        name: `${n.first_name} ${n.last_name}`,
        designation: n.designation,
      }))
);

function matchesFilterAndSearch(
  node: BackendHierarchyNode,
  search: string,
  filters: any
): boolean {
  const fullName = `${node.first_name} ${node.last_name}`.toLowerCase();
  const matchesSearch =
    !search ||
    fullName.includes(search) ||
    (node.employee_id && node.employee_id.toLowerCase().includes(search)) ||
    (node.department && node.department.toLowerCase().includes(search)) ||
    (node.designation && node.designation.toLowerCase().includes(search));

  const matchesDept = filters.department === "all" || node.department === filters.department;
  const matchesDesig = filters.designation === "all" || node.designation === filters.designation;
  const matchesLoc = filters.location === "all" || node.branch === filters.location;
  const matchesType =
    filters.employmentType === "all" || node.employment_type === filters.employmentType;
  const matchesMgr =
    filters.reportingManagerId === "all" ||
    node.reporting_to === filters.reportingManagerId ||
    node.id === filters.reportingManagerId;

  return matchesSearch && matchesDept && matchesDesig && matchesLoc && matchesType && matchesMgr;
}

function filterNodeTree(
  node: BackendHierarchyNode,
  search: string,
  filters: any
): BackendHierarchyNode | null {
  const isCurrentMatch = matchesFilterAndSearch(node, search, filters);

  const filteredChildren: BackendHierarchyNode[] = [];
  if (node.children && node.children.length > 0) {
    node.children.forEach((c) => {
      const filteredChild = filterNodeTree(c, search, filters);
      if (filteredChild) {
        filteredChildren.push(filteredChild);
      }
    });
  }

  if (isCurrentMatch || filteredChildren.length > 0) {
    return {
      ...node,
      children: filteredChildren,
    };
  }

  return null;
}

export const selectFilteredHierarchyTrees = createSelector(
  [selectRawHierarchyTrees, selectSearchKeyword, selectFilters],
  (trees, search, filters) => {
    if (!trees) return [];
    const filtered: BackendHierarchyNode[] = [];
    trees.forEach((tree) => {
      const f = filterNodeTree(tree, search, filters);
      if (f) filtered.push(f);
    });
    return filtered;
  }
);

export const selectMatchingNodeIds = createSelector(
  [selectFlatEmployeeNodes, selectSearchKeyword, selectFilters],
  (nodes, search, filters) => {
    if (!search && Object.values(filters).every((v) => v === "all")) {
      return new Set<string>();
    }
    const matching = new Set<string>();
    nodes.forEach((n) => {
      if (matchesFilterAndSearch(n, search, filters)) {
        matching.add(n.id);
      }
    });
    return matching;
  }
);
