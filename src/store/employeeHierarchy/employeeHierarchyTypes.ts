export interface BackendHierarchyNode {
  id: string; // UUID
  employee_id: string;
  first_name: string;
  last_name: string;
  designation: string;
  department: string;
  profile_photo_url: string | null;
  role: string;
  status: string;
  branch: string | null; // Work location
  shift: string | null;
  employment_type: string | null;
  employment_status: string | null;
  joining_date: string | null;
  date_of_birth: string | null;
  ctc?: number | null;
  reporting_to: string | null;
  reporting_manager_name: string | null;
  children: BackendHierarchyNode[];
  work_location_type?: "remote" | "hybrid" | "office" | string | null;
  skills?: string[];
}

export interface ReportingChainDetails {
  employee: BackendHierarchyNode;
  manager: BackendHierarchyNode | null;
  peers: BackendHierarchyNode[];
  direct_reports: BackendHierarchyNode[];
  reporting_chain: BackendHierarchyNode[];
  organization_level: number;
}

export interface HierarchyFilterState {
  department: string;
  designation: string;
  location: string;
  employmentType: string;
  reportingManagerId: string;
  workLocationType?: string;
}

export type HierarchyLayoutType = "vertical" | "horizontal" | "radial" | "compact";
export type ConnectorStyleType = "curved" | "orthogonal" | "straight";

export interface EmployeeHierarchyState {
  loading: boolean;
  error: string | null;
  hierarchy: BackendHierarchyNode[] | null;
  selectedEmployeeId: string | null;
  selectedEmployeeDetails: ReportingChainDetails | null;
  loadingDetails: boolean;
  detailsError: string | null;
  expandedNodes: Record<string, boolean>;
  searchKeyword: string;
  filters: HierarchyFilterState;
  zoomLevel: number;
  isFullscreen: boolean;
  layout: HierarchyLayoutType;
  connectorStyle: ConnectorStyleType;
  showAiInsights: boolean;
  showAnalyticsPanel: boolean;
}
