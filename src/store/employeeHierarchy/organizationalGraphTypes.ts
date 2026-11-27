export type OrgGraphFilterCategory = "people" | "teams" | "projects" | "skills" | "goals" | "policies" | "workflows";
export type OrgGraphNodeType = "employee" | "manager" | "team" | "department" | "project" | "skill" | "goal" | "policy" | "workflow";
export type OrgRelationshipType = "REPORTS_TO" | "MANAGES" | "MEMBER_OF" | "HAS_SKILL" | "ASSIGNED_TO" | "WORKS_ON" | "OWNS_GOAL" | "ASSIGNED_GOAL" | "PARTICIPATES_IN" | "USES_WORKFLOW";

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
  sufficientData: boolean;
}

export interface OrgGraphNode {
  id: string;
  label: string;
  type: OrgGraphNodeType;
  subtitle?: string;
  description?: string;
  metadata: Record<string, unknown>;
  sourceId: string;
  loaded: boolean;
}

export interface OrgGraphRelationship {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  type: OrgRelationshipType;
  label: string;
  verified: boolean;
}

export interface OrgGraphNodeDetails {
  node: OrgGraphNode;
  directConnections: OrgGraphRelationship[];
  connectedNodes: OrgGraphNode[];
}

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
    dataSource: "live_api";
  };
}
