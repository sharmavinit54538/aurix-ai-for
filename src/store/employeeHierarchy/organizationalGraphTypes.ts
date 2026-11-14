export type OrgGraphFilterCategory = "all" | "department" | "location" | "level";

export interface OrgHealthMetrics {
  spanOfControlAvg?: number;
  maxDepth?: number;
  unassignedCount?: number;
  healthScore?: number;
}

export interface OrganizationalGraphNode {
  id: string;
  label: string;
  type?: string;
  department?: string;
  role?: string;
}

export interface OrganizationalGraphEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface OrganizationalGraphData {
  nodes: OrganizationalGraphNode[];
  edges: OrganizationalGraphEdge[];
  metrics?: OrgHealthMetrics;
}
