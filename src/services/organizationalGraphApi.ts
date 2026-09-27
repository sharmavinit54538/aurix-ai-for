/**
 * Organizational Graph API Service
 *
 * Aggregates data from existing backend endpoints to build
 * a multi-entity organizational graph. No mock data.
 *
 * Uses existing endpoints:
 *   GET /api/v1/hierarchy       → employee hierarchy tree
 *   GET /api/v1/hierarchy/:id   → employee reporting details
 *   GET /api/v1/employees       → employee directory
 *   GET /api/v1/departments     → departments list
 *
 * For entity types that don't yet have backend endpoints (projects,
 * skills, goals, policies, workflows), the API returns empty arrays
 * and the UI shows "Relationship not configured" states.
 */

import apiInstance from "@/api/apiInstance";
import type { BackendHierarchyNode } from "@/store/employeeHierarchy/employeeHierarchyTypes";
import type {
  OrgGraphNode,
  OrgGraphRelationship,
  OrganizationalGraphData,
  OrgGraphNodeType,
  OrgRelationshipType,
  OrgHealthMetrics,
} from "@/store/employeeHierarchy/organizationalGraphTypes";

// ── Helper: unique ID generator ─────────────────────────────────────
let idCounter = 0;
function genId(prefix: string): string {
  return `${prefix}-${++idCounter}-${Date.now().toString(36)}`;
}

// ── Convert hierarchy tree to flat node+relationship lists ──────────
function flattenHierarchyToGraph(
  trees: BackendHierarchyNode[]
): { nodes: OrgGraphNode[]; relationships: OrgGraphRelationship[] } {
  const nodes: OrgGraphNode[] = [];
  const relationships: OrgGraphRelationship[] = [];
  const seenDepts = new Set<string>();
  const seenSkills = new Set<string>();
  const nodeIdMap = new Map<string, string>(); // sourceId → graph node id

  function processNode(node: BackendHierarchyNode, parentId?: string) {
    // Create employee node
    const isManager = node.children && node.children.length > 0;
    const nodeType: OrgGraphNodeType = isManager ? "manager" : "employee";
    const fullName = `${node.first_name || ""} ${node.last_name || ""}`.trim();

    const empNode: OrgGraphNode = {
      id: `emp-${node.id}`,
      type: nodeType,
      label: fullName || "Unknown Employee",
      subtitle: node.designation || undefined,
      description: node.department || undefined,
      metadata: {
        employeeId: node.employee_id,
        firstName: node.first_name,
        lastName: node.last_name,
        designation: node.designation,
        department: node.department,
        profilePhotoUrl: node.profile_photo_url,
        role: node.role,
        status: node.status,
        branch: node.branch,
        shift: node.shift,
        employmentType: node.employment_type,
        employmentStatus: node.employment_status,
        joiningDate: node.joining_date,
        dateOfBirth: node.date_of_birth,
        ctc: node.ctc,
        reportingTo: node.reporting_to,
        reportingManagerName: node.reporting_manager_name,
        workLocationType: node.work_location_type,
        skills: node.skills,
        directReportsCount: node.children?.length ?? 0,
      },
      sourceId: node.id,
      loaded: true,
    };
    nodes.push(empNode);
    nodeIdMap.set(node.id, empNode.id);

    // Create REPORTS_TO relationship to parent
    if (parentId && nodeIdMap.has(parentId)) {
      relationships.push({
        id: genId("rel"),
        sourceNodeId: empNode.id,
        targetNodeId: nodeIdMap.get(parentId)!,
        type: "REPORTS_TO",
        label: "Reports To",
        verified: true,
      });
    }

    // Create MANAGES relationship from parent to this node
    if (parentId && nodeIdMap.has(parentId) && isManager) {
      // Parent manages current node's subtree — relationship is already implicit
    }

    // Create department node if new
    if (node.department && !seenDepts.has(node.department)) {
      seenDepts.add(node.department);
      const deptNode: OrgGraphNode = {
        id: `dept-${node.department.replace(/\s+/g, "-").toLowerCase()}`,
        type: "department",
        label: node.department,
        subtitle: "Department",
        metadata: {},
        sourceId: node.department,
        loaded: true,
      };
      nodes.push(deptNode);
    }

    // Create MEMBER_OF relationship to department
    if (node.department) {
      const deptId = `dept-${node.department.replace(/\s+/g, "-").toLowerCase()}`;
      relationships.push({
        id: genId("rel"),
        sourceNodeId: empNode.id,
        targetNodeId: deptId,
        type: "MEMBER_OF",
        label: "Member Of",
        verified: true,
      });
    }

    // Create skill nodes if skills exist
    if (node.skills && Array.isArray(node.skills)) {
      node.skills.forEach((skill) => {
        if (!skill) return;
        const skillKey = skill.trim().toLowerCase();
        if (!seenSkills.has(skillKey)) {
          seenSkills.add(skillKey);
          nodes.push({
            id: `skill-${skillKey.replace(/\s+/g, "-")}`,
            type: "skill",
            label: skill.trim(),
            subtitle: "Skill",
            metadata: {},
            sourceId: skillKey,
            loaded: true,
          });
        }
        relationships.push({
          id: genId("rel"),
          sourceNodeId: empNode.id,
          targetNodeId: `skill-${skillKey.replace(/\s+/g, "-")}`,
          type: "HAS_SKILL",
          label: "Has Skill",
          verified: true,
        });
      });
    }

    // Process children
    if (node.children && node.children.length > 0) {
      node.children.forEach((child) => processNode(child, node.id));
    }
  }

  trees.forEach((tree) => processNode(tree));

  return { nodes, relationships };
}

// ── Calculate health metrics from graph data ─────────────────────────
function calculateHealthMetrics(
  nodes: OrgGraphNode[],
  relationships: OrgGraphRelationship[]
): OrgHealthMetrics {
  const employees = nodes.filter((n) => n.type === "employee" || n.type === "manager");
  const managers = nodes.filter((n) => n.type === "manager");
  const departments = nodes.filter((n) => n.type === "department");
  const projects = nodes.filter((n) => n.type === "project");
  const goals = nodes.filter((n) => n.type === "goal");
  const workflows = nodes.filter((n) => n.type === "workflow");

  // Calculate hierarchy depth
  const reportsToRels = relationships.filter((r) => r.type === "REPORTS_TO");
  let maxDepth = 0;
  if (employees.length > 0) {
    // Build adjacency: who reports to whom
    const parentMap = new Map<string, string>();
    reportsToRels.forEach((r) => {
      parentMap.set(r.sourceNodeId, r.targetNodeId);
    });

    employees.forEach((emp) => {
      let depth = 1;
      let current = emp.id;
      const visited = new Set<string>();
      while (parentMap.has(current) && !visited.has(current)) {
        visited.add(current);
        current = parentMap.get(current)!;
        depth++;
      }
      if (depth > maxDepth) maxDepth = depth;
    });
  }

  // Span of control
  const managesRelCounts = new Map<string, number>();
  reportsToRels.forEach((r) => {
    const count = managesRelCounts.get(r.targetNodeId) || 0;
    managesRelCounts.set(r.targetNodeId, count + 1);
  });
  const managerCounts = Array.from(managesRelCounts.values());
  const avgSpanOfControl =
    managerCounts.length > 0
      ? managerCounts.reduce((a, b) => a + b, 0) / managerCounts.length
      : 0;

  // Unassigned reporting managers (employees without REPORTS_TO)
  const hasManager = new Set(reportsToRels.map((r) => r.sourceNodeId));
  const unassigned = employees.filter((emp) => {
    if (!hasManager.has(emp.id)) {
      // Check if it's a top-level executive (CEO etc.)
      const desig = String(emp.metadata?.designation || "").toLowerCase();
      return !desig.includes("ceo") && !desig.includes("founder") && !desig.includes("chief executive");
    }
    return false;
  });

  // Employees without department
  const hasDept = new Set(
    relationships.filter((r) => r.type === "MEMBER_OF").map((r) => r.sourceNodeId)
  );
  const noDept = employees.filter((emp) => !hasDept.has(emp.id));

  // Teams without managers (departments that have no manager node in MEMBER_OF)
  const deptMembers = new Map<string, string[]>();
  relationships
    .filter((r) => r.type === "MEMBER_OF")
    .forEach((r) => {
      const list = deptMembers.get(r.targetNodeId) || [];
      list.push(r.sourceNodeId);
      deptMembers.set(r.targetNodeId, list);
    });
  const teamsWithoutMgrs = departments.filter((dept) => {
    const members = deptMembers.get(dept.id) || [];
    return !members.some((mId) => nodes.find((n) => n.id === mId && n.type === "manager"));
  });

  // Projects without employees
  const projectAssigned = new Set(
    relationships
      .filter((r) => r.type === "ASSIGNED_TO" || r.type === "WORKS_ON")
      .map((r) => r.targetNodeId)
  );
  const emptyProjects = projects.filter((p) => !projectAssigned.has(p.id));

  // Goals without owners
  const goalOwned = new Set(
    relationships
      .filter((r) => r.type === "OWNS_GOAL" || r.type === "ASSIGNED_GOAL")
      .map((r) => r.targetNodeId)
  );
  const orphanGoals = goals.filter((g) => !goalOwned.has(g.id));

  // Workflows without responsible
  const workflowAssigned = new Set(
    relationships
      .filter((r) => r.type === "PARTICIPATES_IN" || r.type === "USES_WORKFLOW")
      .map((r) => r.targetNodeId)
  );
  const orphanWorkflows = workflows.filter((w) => !workflowAssigned.has(w.id));

  return {
    totalWorkforce: employees.length,
    totalManagers: managers.length,
    hierarchyDepth: maxDepth,
    avgSpanOfControl: Number(avgSpanOfControl.toFixed(1)),
    unassignedReportingManagers: unassigned.length,
    teamsWithoutManagers: teamsWithoutMgrs.length,
    employeesWithoutDepartment: noDept.length,
    orphanedRelationships: 0,
    projectsWithoutEmployees: emptyProjects.length,
    goalsWithoutOwners: orphanGoals.length,
    workflowsWithoutResponsible: orphanWorkflows.length,
    sufficientData: employees.length > 0,
  };
}

// ── Main API: Fetch organizational graph ─────────────────────────────
export async function fetchOrganizationalGraphApi(): Promise<OrganizationalGraphData> {
  // Reset ID counter for deterministic IDs within a fetch
  idCounter = 0;

  // Fetch hierarchy data from the existing endpoint
  let hierarchyData: BackendHierarchyNode[] = [];
  try {
    const res = await apiInstance.get("/hierarchy");
    if (res.data && res.data.success && Array.isArray(res.data.data)) {
      hierarchyData = res.data.data;
    } else if (Array.isArray(res.data)) {
      hierarchyData = res.data;
    }
  } catch (err) {
    // Hierarchy endpoint failed — we'll still try to build what we can
    console.warn("[OrgGraph] Hierarchy API unavailable:", err);
  }

  // Optionally try to fetch additional department data for enrichment
  let departmentsList: Array<{ id: string; name: string; manager_name?: string; employee_count?: number }> = [];
  try {
    const deptRes = await apiInstance.get("/departments");
    const deptData = deptRes.data?.data ?? deptRes.data;
    if (Array.isArray(deptData)) {
      departmentsList = deptData;
    } else if (deptData?.items && Array.isArray(deptData.items)) {
      departmentsList = deptData.items;
    }
  } catch {
    // Departments endpoint may not be available
  }

  // Build graph from hierarchy data
  const { nodes, relationships } = flattenHierarchyToGraph(hierarchyData);

  // Enrich department nodes with additional metadata from departments API
  if (departmentsList.length > 0) {
    departmentsList.forEach((dept) => {
      const deptName = dept.name || (dept as any).department_name || (dept as any).title || "";
      if (!deptName) return;

      const existingDeptNode = nodes.find(
        (n) => n.type === "department" && n.label.toLowerCase() === deptName.toLowerCase()
      );
      if (existingDeptNode) {
        // Enrich existing node
        existingDeptNode.metadata = {
          ...existingDeptNode.metadata,
          deptId: dept.id,
          managerName: dept.manager_name || (dept as any).manager_details?.name,
          employeeCount: dept.employee_count || (dept as any).total_employees,
        };
        existingDeptNode.sourceId = String(dept.id);
      } else {
        // Add department that has no employees in hierarchy
        nodes.push({
          id: `dept-${deptName.replace(/\s+/g, "-").toLowerCase()}`,
          type: "department",
          label: deptName,
          subtitle: "Department",
          metadata: {
            deptId: dept.id,
            managerName: dept.manager_name || (dept as any).manager_details?.name,
            employeeCount: dept.employee_count || (dept as any).total_employees,
          },
          sourceId: String(dept.id),
          loaded: true,
        });
      }
    });
  }

  // Calculate health metrics
  const healthMetrics = calculateHealthMetrics(nodes, relationships);

  // Count node types
  const countByType = (type: OrgGraphNodeType) => nodes.filter((n) => n.type === type).length;

  const graphData: OrganizationalGraphData = {
    nodes,
    relationships,
    metadata: {
      totalEmployees: countByType("employee") + countByType("manager"),
      totalManagers: countByType("manager"),
      totalDepartments: countByType("department"),
      totalTeams: countByType("team"),
      totalProjects: countByType("project"),
      totalSkills: countByType("skill"),
      totalGoals: countByType("goal"),
      totalPolicies: countByType("policy"),
      totalWorkflows: countByType("workflow"),
      generatedAt: new Date().toISOString(),
      dataSource: "live_api",
    },
  };

  return graphData;
}

// ── Export: Health metrics calculator ─────────────────────────────────
export { calculateHealthMetrics };
