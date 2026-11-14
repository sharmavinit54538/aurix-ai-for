export type HierarchyLayoutType = "tree" | "graph" | "compact" | "horizontal";

export interface BackendHierarchyNode {
  id: string;
  name: string;
  role: string;
  title?: string;
  department: string;
  email: string;
  avatar?: string;
  managerId?: string | null;
  directReportsCount?: number;
  reports?: BackendHierarchyNode[];
  status?: string;
  location?: string;
  joinDate?: string;
}

export interface EmployeeHierarchyState {
  nodes: BackendHierarchyNode[];
  selectedNode: BackendHierarchyNode | null;
  layout: HierarchyLayoutType;
  loading: boolean;
  error: string | null;
  reportingDetails: any | null;
}
