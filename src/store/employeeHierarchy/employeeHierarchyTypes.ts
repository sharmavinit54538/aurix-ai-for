import type { OrgGraphFilterCategory, OrgGraphNodeDetails, OrganizationalGraphData, OrgHealthMetrics } from "./organizationalGraphTypes";

export type HierarchyLayoutType = "vertical" | "compact" | "horizontal";
export type ConnectorStyleType = "curved" | "orthogonal" | "straight";

export interface BackendHierarchyNode {
  id: string;
  employee_id?: string | null;
  first_name: string;
  last_name: string;
  designation?: string | null;
  department?: string | null;
  email?: string | null;
  role?: string | null;
  profile_photo_url?: string | null;
  reporting_to?: string | null;
  reporting_manager_name?: string | null;
  status?: string | null;
  branch?: string | null;
  shift?: string | null;
  employment_type?: string | null;
  employment_status?: string | null;
  joining_date?: string | null;
  date_of_birth?: string | null;
  ctc?: string | number | null;
  work_location_type?: string | null;
  skills: string[];
  children: BackendHierarchyNode[];
}

export interface ReportingChainDetails {
  employee: BackendHierarchyNode;
  manager: BackendHierarchyNode | null;
  direct_reports: BackendHierarchyNode[];
  reporting_chain: BackendHierarchyNode[];
  organization_level: number | null;
}

export interface HierarchyFilters {
  department: string;
  designation: string;
  location: string;
  status: string;
  employmentType: string;
  reportingManagerId: string;
}

export interface EmployeeHierarchyState {
  data: BackendHierarchyNode[] | null;
  trees: BackendHierarchyNode[];
  flatList: BackendHierarchyNode[];
  loading: boolean;
  error: string | null;
  selectedEmployeeId: string | null;
  selectedEmployeeDetails: ReportingChainDetails | null;
  loadingDetails: boolean;
  detailsError: string | null;
  detailsRequestId: string | null;
  expandedNodes: Record<string, boolean>;
  searchKeyword: string;
  filters: HierarchyFilters;
  zoomLevel: number;
  isFullscreen: boolean;
  layout: HierarchyLayoutType;
  connectorStyle: ConnectorStyleType;
  showAiInsights: boolean;
  showAnalyticsPanel: boolean;
  viewMode: "hierarchy" | "graph";
  graphData: OrganizationalGraphData | null;
  graphLoading: boolean;
  graphError: string | null;
  graphFilters: { activeCategories: OrgGraphFilterCategory[]; searchQuery: string; focusedNodeId: string | null };
  selectedGraphNode: OrgGraphNodeDetails | null;
  graphDetailPanelOpen: boolean;
  graphAiPanelOpen: boolean;
  graphAiMessages: { role: "user" | "assistant"; content: string; timestamp: string }[];
  graphAiProcessing: boolean;
  healthMetrics: OrgHealthMetrics | null;
  explorerActive: boolean;
  highlightedPath: string[];
  graphSearchResults: { nodeId: string; label: string; subtitle?: string; type: string }[];
}
