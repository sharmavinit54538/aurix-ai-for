/**
 * Organizational Graph Types
 *
 * These types define the multi-entity organizational graph system.
 * All data must come from real backend APIs — never fabricated.
 */

// ── Node Types ─────────────────────────────────────────────────────
export type OrgGraphNodeType =
  | "employee"
  | "manager"
  | "team"
  | "department"
  | "project"
  | "skill"
  | "goal"
  | "policy"
  | "workflow";

export interface OrgGraphNode {
  id: string;
  type: OrgGraphNodeType;
  label: string;
  subtitle?: string;
  description?: string;
  metadata: Record<string, unknown>;
  /** Source entity ID from the backend (e.g. employee UUID, department ID) */
  sourceId: string;
  /** Whether this node's data was loaded or is still a stub reference */
  loaded: boolean;
}

// ── Relationship Types ─────────────────────────────────────────────
export type OrgRelationshipType =
  | "REPORTS_TO"
  | "MANAGES"
  | "MEMBER_OF"
  | "BELONGS_TO"
  | "ASSIGNED_TO"
  | "WORKS_ON"
  | "HAS_SKILL"
  | "REQUIRES_SKILL"
  | "OWNS_GOAL"
  | "ASSIGNED_GOAL"
  | "GOVERNED_BY"
  | "AFFECTED_BY"
  | "PARTICIPATES_IN"
  | "TRIGGERS"
  | "APPROVES"
  | "USES_WORKFLOW";

export interface OrgGraphRelationship {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  type: OrgRelationshipType;
  label: string;
  /** Whether this relationship is derived from real API data */
  verified: boolean;
}

// ── Graph Data Structure ───────────────────────────────────────────
export interface OrganizationalGraphData {
  nodes: OrgGraphNode[];
  relationships: OrgGraphRelationship[];
  metadata: {
    totalEmployees: number;
    totalManagers: number;
    totalDepartments: number;
    totalTeams: number;
    totalProjects: number;
    totalSkills: number;
    totalGoals: number;
    totalPolicies: number;
    totalWorkflows: number;
    generatedAt: string;
    dataSource: "live_api" | "cached";
  };
}

// ── Filter Categories ──────────────────────────────────────────────
export type OrgGraphFilterCategory =
  | "people"
  | "teams"
  | "projects"
  | "skills"
  | "goals"
  | "policies"
  | "workflows";

export interface OrgGraphFilterState {
  /** Which categories of nodes to display */
  activeCategories: OrgGraphFilterCategory[];
  /** Which relationship types to display */
  activeRelationshipTypes: OrgRelationshipType[];
  /** Search across all entities */
  searchQuery: string;
  /** Focus on a specific node ID */
  focusedNodeId: string | null;
  /** Department filter */
  department: string;
  /** Designation filter */
  designation: string;
}

// ── Graph View Mode ────────────────────────────────────────────────
export type OrgGraphViewMode = "graph" | "hierarchy";

// ── Search Result ──────────────────────────────────────────────────
export interface OrgGraphSearchResult {
  nodeId: string;
  type: OrgGraphNodeType;
  label: string;
  subtitle?: string;
}

// ── Detail Panel ───────────────────────────────────────────────────
export interface OrgGraphNodeDetails {
  node: OrgGraphNode;
  directConnections: OrgGraphRelationship[];
  connectedNodes: OrgGraphNode[];
  /** Second-level connections for the explorer */
  secondLevelConnections?: {
    relationship: OrgGraphRelationship;
    node: OrgGraphNode;
    through: OrgGraphNode;
  }[];
}

// ── AI Intelligence ────────────────────────────────────────────────
export interface OrgAIQuery {
  query: string;
  contextNodeId?: string;
  contextNodeType?: OrgGraphNodeType;
}

export interface OrgAIResponse {
  answer: string;
  relatedNodeIds: string[];
  confidence: "high" | "medium" | "low" | "unavailable";
  dataAvailable: boolean;
}

// ── Organizational Health Metrics ──────────────────────────────────
export interface OrgHealthMetrics {
  totalWorkforce: number;
  totalManagers: number;
  hierarchyDepth: number;
  avgSpanOfControl: number;
  unassignedReportingManagers: number;
  teamsWithoutManagers: number;
  employeesWithoutDepartment: number;
  orphanedRelationships: number;
  projectsWithoutEmployees: number;
  goalsWithoutOwners: number;
  workflowsWithoutResponsible: number;
  /** Whether enough data exists for analysis */
  sufficientData: boolean;
}

// ── Export Format ──────────────────────────────────────────────────
export type OrgGraphExportFormat = "csv" | "json";

// ── Complete Graph State ───────────────────────────────────────────
export interface OrganizationalGraphState {
  /** Current view mode: graph or hierarchy */
  viewMode: OrgGraphViewMode;
  /** Graph data loaded from APIs */
  graphData: OrganizationalGraphData | null;
  /** Whether graph data is loading */
  graphLoading: boolean;
  /** Error message from graph data fetch */
  graphError: string | null;
  /** Filter state */
  filters: OrgGraphFilterState;
  /** Selected node details */
  selectedNodeDetails: OrgGraphNodeDetails | null;
  /** Whether detail panel is open */
  detailPanelOpen: boolean;
  /** Whether AI panel is open */
  aiPanelOpen: boolean;
  /** AI conversation history for this session */
  aiMessages: { role: "user" | "assistant"; content: string; timestamp: string }[];
  /** Whether AI is processing */
  aiProcessing: boolean;
  /** Organizational health metrics */
  healthMetrics: OrgHealthMetrics | null;
  /** Whether the relationship explorer is active */
  explorerActive: boolean;
  /** Highlighted path (list of node IDs for relationship traversal) */
  highlightedPath: string[];
  /** Search results */
  searchResults: OrgGraphSearchResult[];
}
