import { a as createSlice, i as createAsyncThunk } from "../_libs/@reduxjs/toolkit+[...].mjs";
import { o as apiInstance } from "./apiInstance-C5A0vaLH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/employeeHierarchySlice-8KeWhm8x.js
/**
* Fetch complete organizational hierarchy tree from backend FastAPI endpoint.
* GET /api/v1/hierarchy
*/
async function fetchEmployeeHierarchyApi() {
	const res = await apiInstance.get("/hierarchy");
	if (res.data && res.data.success && Array.isArray(res.data.data)) return res.data.data;
	if (Array.isArray(res.data)) return res.data;
	return [];
}
/**
* Lazy-load detailed reporting chain surroundings for an employee.
* GET /api/v1/hierarchy/{employee_id}
*/
async function fetchEmployeeReportingDetailsApi(employeeId) {
	const res = await apiInstance.get(`/hierarchy/${employeeId}`);
	if (res.data && res.data.success && res.data.data) return res.data.data;
	return res.data;
}
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
var idCounter = 0;
function genId(prefix) {
	return `${prefix}-${++idCounter}-${Date.now().toString(36)}`;
}
function flattenHierarchyToGraph(trees) {
	const nodes = [];
	const relationships = [];
	const seenDepts = /* @__PURE__ */ new Set();
	const seenSkills = /* @__PURE__ */ new Set();
	const nodeIdMap = /* @__PURE__ */ new Map();
	function processNode(node, parentId) {
		const isManager = node.children && node.children.length > 0;
		const nodeType = isManager ? "manager" : "employee";
		const fullName = `${node.first_name || ""} ${node.last_name || ""}`.trim();
		const empNode = {
			id: `emp-${node.id}`,
			type: nodeType,
			label: fullName || "Unknown Employee",
			subtitle: node.designation || void 0,
			description: node.department || void 0,
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
				directReportsCount: node.children?.length ?? 0
			},
			sourceId: node.id,
			loaded: true
		};
		nodes.push(empNode);
		nodeIdMap.set(node.id, empNode.id);
		if (parentId && nodeIdMap.has(parentId)) relationships.push({
			id: genId("rel"),
			sourceNodeId: empNode.id,
			targetNodeId: nodeIdMap.get(parentId),
			type: "REPORTS_TO",
			label: "Reports To",
			verified: true
		});
		if (parentId && nodeIdMap.has(parentId) && isManager) {}
		if (node.department && !seenDepts.has(node.department)) {
			seenDepts.add(node.department);
			const deptNode = {
				id: `dept-${node.department.replace(/\s+/g, "-").toLowerCase()}`,
				type: "department",
				label: node.department,
				subtitle: "Department",
				metadata: {},
				sourceId: node.department,
				loaded: true
			};
			nodes.push(deptNode);
		}
		if (node.department) {
			const deptId = `dept-${node.department.replace(/\s+/g, "-").toLowerCase()}`;
			relationships.push({
				id: genId("rel"),
				sourceNodeId: empNode.id,
				targetNodeId: deptId,
				type: "MEMBER_OF",
				label: "Member Of",
				verified: true
			});
		}
		if (node.skills && Array.isArray(node.skills)) node.skills.forEach((skill) => {
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
					loaded: true
				});
			}
			relationships.push({
				id: genId("rel"),
				sourceNodeId: empNode.id,
				targetNodeId: `skill-${skillKey.replace(/\s+/g, "-")}`,
				type: "HAS_SKILL",
				label: "Has Skill",
				verified: true
			});
		});
		if (node.children && node.children.length > 0) node.children.forEach((child) => processNode(child, node.id));
	}
	trees.forEach((tree) => processNode(tree));
	return {
		nodes,
		relationships
	};
}
function calculateHealthMetrics(nodes, relationships) {
	const employees = nodes.filter((n) => n.type === "employee" || n.type === "manager");
	const managers = nodes.filter((n) => n.type === "manager");
	const departments = nodes.filter((n) => n.type === "department");
	const projects = nodes.filter((n) => n.type === "project");
	const goals = nodes.filter((n) => n.type === "goal");
	const workflows = nodes.filter((n) => n.type === "workflow");
	const reportsToRels = relationships.filter((r) => r.type === "REPORTS_TO");
	let maxDepth = 0;
	if (employees.length > 0) {
		const parentMap = /* @__PURE__ */ new Map();
		reportsToRels.forEach((r) => {
			parentMap.set(r.sourceNodeId, r.targetNodeId);
		});
		employees.forEach((emp) => {
			let depth = 1;
			let current = emp.id;
			const visited = /* @__PURE__ */ new Set();
			while (parentMap.has(current) && !visited.has(current)) {
				visited.add(current);
				current = parentMap.get(current);
				depth++;
			}
			if (depth > maxDepth) maxDepth = depth;
		});
	}
	const managesRelCounts = /* @__PURE__ */ new Map();
	reportsToRels.forEach((r) => {
		const count = managesRelCounts.get(r.targetNodeId) || 0;
		managesRelCounts.set(r.targetNodeId, count + 1);
	});
	const managerCounts = Array.from(managesRelCounts.values());
	const avgSpanOfControl = managerCounts.length > 0 ? managerCounts.reduce((a, b) => a + b, 0) / managerCounts.length : 0;
	const hasManager = new Set(reportsToRels.map((r) => r.sourceNodeId));
	const unassigned = employees.filter((emp) => {
		if (!hasManager.has(emp.id)) {
			const desig = String(emp.metadata?.designation || "").toLowerCase();
			return !desig.includes("ceo") && !desig.includes("founder") && !desig.includes("chief executive");
		}
		return false;
	});
	const hasDept = new Set(relationships.filter((r) => r.type === "MEMBER_OF").map((r) => r.sourceNodeId));
	const noDept = employees.filter((emp) => !hasDept.has(emp.id));
	const deptMembers = /* @__PURE__ */ new Map();
	relationships.filter((r) => r.type === "MEMBER_OF").forEach((r) => {
		const list = deptMembers.get(r.targetNodeId) || [];
		list.push(r.sourceNodeId);
		deptMembers.set(r.targetNodeId, list);
	});
	const teamsWithoutMgrs = departments.filter((dept) => {
		return !(deptMembers.get(dept.id) || []).some((mId) => nodes.find((n) => n.id === mId && n.type === "manager"));
	});
	const projectAssigned = new Set(relationships.filter((r) => r.type === "ASSIGNED_TO" || r.type === "WORKS_ON").map((r) => r.targetNodeId));
	const emptyProjects = projects.filter((p) => !projectAssigned.has(p.id));
	const goalOwned = new Set(relationships.filter((r) => r.type === "OWNS_GOAL" || r.type === "ASSIGNED_GOAL").map((r) => r.targetNodeId));
	const orphanGoals = goals.filter((g) => !goalOwned.has(g.id));
	const workflowAssigned = new Set(relationships.filter((r) => r.type === "PARTICIPATES_IN" || r.type === "USES_WORKFLOW").map((r) => r.targetNodeId));
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
		sufficientData: employees.length > 0
	};
}
async function fetchOrganizationalGraphApi() {
	idCounter = 0;
	let hierarchyData = [];
	try {
		const res = await apiInstance.get("/hierarchy");
		if (res.data && res.data.success && Array.isArray(res.data.data)) hierarchyData = res.data.data;
		else if (Array.isArray(res.data)) hierarchyData = res.data;
	} catch (err) {
		console.warn("[OrgGraph] Hierarchy API unavailable:", err);
	}
	let departmentsList = [];
	try {
		const deptRes = await apiInstance.get("/departments");
		const deptData = deptRes.data?.data ?? deptRes.data;
		if (Array.isArray(deptData)) departmentsList = deptData;
		else if (deptData?.items && Array.isArray(deptData.items)) departmentsList = deptData.items;
	} catch {}
	const { nodes, relationships } = flattenHierarchyToGraph(hierarchyData);
	if (departmentsList.length > 0) departmentsList.forEach((dept) => {
		const deptName = dept.name || dept.department_name || dept.title || "";
		if (!deptName) return;
		const existingDeptNode = nodes.find((n) => n.type === "department" && n.label.toLowerCase() === deptName.toLowerCase());
		if (existingDeptNode) {
			existingDeptNode.metadata = {
				...existingDeptNode.metadata,
				deptId: dept.id,
				managerName: dept.manager_name || dept.manager_details?.name,
				employeeCount: dept.employee_count || dept.total_employees
			};
			existingDeptNode.sourceId = String(dept.id);
		} else nodes.push({
			id: `dept-${deptName.replace(/\s+/g, "-").toLowerCase()}`,
			type: "department",
			label: deptName,
			subtitle: "Department",
			metadata: {
				deptId: dept.id,
				managerName: dept.manager_name || dept.manager_details?.name,
				employeeCount: dept.employee_count || dept.total_employees
			},
			sourceId: String(dept.id),
			loaded: true
		});
	});
	calculateHealthMetrics(nodes, relationships);
	const countByType = (type) => nodes.filter((n) => n.type === type).length;
	return {
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
			generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
			dataSource: "live_api"
		}
	};
}
var fetchEmployeeHierarchy = createAsyncThunk("employeeHierarchy/fetchHierarchy", async (_, { rejectWithValue }) => {
	try {
		return await fetchEmployeeHierarchyApi();
	} catch (err) {
		return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to load employee hierarchy from backend.");
	}
});
var fetchEmployeeReportingDetails = createAsyncThunk("employeeHierarchy/fetchReportingDetails", async (employeeId, { rejectWithValue }) => {
	try {
		return await fetchEmployeeReportingDetailsApi(employeeId);
	} catch (err) {
		return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to load employee reporting details.");
	}
});
var fetchOrganizationalGraph = createAsyncThunk("employeeHierarchy/fetchOrganizationalGraph", async (_, { rejectWithValue }) => {
	try {
		return await fetchOrganizationalGraphApi();
	} catch (err) {
		return rejectWithValue(err?.response?.data?.message || err?.message || "Failed to load organizational graph data.");
	}
});
var initialFilters = {
	department: "all",
	designation: "all",
	location: "all",
	employmentType: "all",
	reportingManagerId: "all",
	workLocationType: "all"
};
var initialGraphFilters = {
	activeCategories: ["people", "teams"],
	activeRelationshipTypes: [
		"REPORTS_TO",
		"MANAGES",
		"MEMBER_OF",
		"BELONGS_TO"
	],
	searchQuery: "",
	focusedNodeId: null,
	department: "all",
	designation: "all"
};
var initialState = {
	loading: false,
	error: null,
	hierarchy: null,
	selectedEmployeeId: null,
	selectedEmployeeDetails: null,
	loadingDetails: false,
	detailsError: null,
	expandedNodes: {},
	searchKeyword: "",
	filters: initialFilters,
	zoomLevel: 100,
	isFullscreen: false,
	layout: "vertical",
	connectorStyle: "curved",
	showAiInsights: false,
	showAnalyticsPanel: true,
	viewMode: "hierarchy",
	graphData: null,
	graphLoading: false,
	graphError: null,
	graphFilters: initialGraphFilters,
	selectedGraphNode: null,
	graphDetailPanelOpen: false,
	graphAiPanelOpen: false,
	graphAiMessages: [],
	graphAiProcessing: false,
	healthMetrics: null,
	explorerActive: false,
	highlightedPath: [],
	graphSearchResults: []
};
function getAllNodeIds(nodes) {
	const ids = [];
	nodes.forEach((n) => {
		ids.push(n.id);
		if (n.children && n.children.length > 0) ids.push(...getAllNodeIds(n.children));
	});
	return ids;
}
var employeeHierarchySlice = createSlice({
	name: "employeeHierarchy",
	initialState,
	reducers: {
		setSearchKeyword(state, action) {
			state.searchKeyword = action.payload;
			if (action.payload && action.payload.trim().length > 0 && state.hierarchy) getAllNodeIds(state.hierarchy).forEach((id) => {
				state.expandedNodes[id] = true;
			});
		},
		setFilters(state, action) {
			state.filters = {
				...state.filters,
				...action.payload
			};
		},
		resetFilters(state) {
			state.filters = initialFilters;
			state.searchKeyword = "";
		},
		setSelectedEmployee(state, action) {
			state.selectedEmployeeId = action.payload;
			if (!action.payload) {
				state.selectedEmployeeDetails = null;
				state.detailsError = null;
			}
		},
		toggleNodeExpanded(state, action) {
			const id = action.payload;
			state.expandedNodes[id] = state.expandedNodes[id] === void 0 ? false : !state.expandedNodes[id];
		},
		setNodeExpanded(state, action) {
			state.expandedNodes[action.payload.id] = action.payload.expanded;
		},
		expandAllNodes(state) {
			if (state.hierarchy) getAllNodeIds(state.hierarchy).forEach((id) => {
				state.expandedNodes[id] = true;
			});
		},
		collapseAllNodes(state) {
			if (state.hierarchy) {
				const allIds = getAllNodeIds(state.hierarchy);
				const rootIds = new Set(state.hierarchy.map((n) => n.id));
				allIds.forEach((id) => {
					if (!rootIds.has(id)) state.expandedNodes[id] = false;
				});
			}
		},
		setZoomLevel(state, action) {
			state.zoomLevel = Math.max(40, Math.min(200, action.payload));
		},
		zoomIn(state) {
			state.zoomLevel = Math.min(200, state.zoomLevel + 15);
		},
		zoomOut(state) {
			state.zoomLevel = Math.max(40, state.zoomLevel - 15);
		},
		resetZoom(state) {
			state.zoomLevel = 100;
		},
		toggleFullscreen(state) {
			state.isFullscreen = !state.isFullscreen;
		},
		setIsFullscreen(state, action) {
			state.isFullscreen = action.payload;
		},
		setLayout(state, action) {
			state.layout = action.payload;
		},
		setConnectorStyle(state, action) {
			state.connectorStyle = action.payload;
		},
		toggleAiInsights(state) {
			state.showAiInsights = !state.showAiInsights;
		},
		toggleAnalyticsPanel(state) {
			state.showAnalyticsPanel = !state.showAnalyticsPanel;
		},
		setViewMode(state, action) {
			state.viewMode = action.payload;
		},
		setGraphSearchQuery(state, action) {
			const query = action.payload.toLowerCase().trim();
			state.graphFilters.searchQuery = action.payload;
			if (state.graphData && query.length > 0) state.graphSearchResults = state.graphData.nodes.filter((n) => {
				return n.label.toLowerCase().includes(query) || n.subtitle && n.subtitle.toLowerCase().includes(query) || n.description && n.description.toLowerCase().includes(query) || n.type.toLowerCase().includes(query) || n.metadata?.employeeId && String(n.metadata.employeeId).toLowerCase().includes(query);
			}).slice(0, 20).map((n) => ({
				nodeId: n.id,
				type: n.type,
				label: n.label,
				subtitle: n.subtitle
			}));
			else state.graphSearchResults = [];
		},
		toggleGraphFilterCategory(state, action) {
			const cat = action.payload;
			const idx = state.graphFilters.activeCategories.indexOf(cat);
			if (idx >= 0) state.graphFilters.activeCategories.splice(idx, 1);
			else state.graphFilters.activeCategories.push(cat);
		},
		setGraphFilterCategories(state, action) {
			state.graphFilters.activeCategories = action.payload;
		},
		toggleRelationshipTypeFilter(state, action) {
			const rType = action.payload;
			const idx = state.graphFilters.activeRelationshipTypes.indexOf(rType);
			if (idx >= 0) state.graphFilters.activeRelationshipTypes.splice(idx, 1);
			else state.graphFilters.activeRelationshipTypes.push(rType);
		},
		setFocusedNode(state, action) {
			state.graphFilters.focusedNodeId = action.payload;
			if (action.payload && state.graphData) {
				const node = state.graphData.nodes.find((n) => n.id === action.payload);
				if (node) {
					const directRels = state.graphData.relationships.filter((r) => r.sourceNodeId === action.payload || r.targetNodeId === action.payload);
					const connectedIds = new Set(directRels.map((r) => r.sourceNodeId === action.payload ? r.targetNodeId : r.sourceNodeId));
					state.selectedGraphNode = {
						node,
						directConnections: directRels,
						connectedNodes: state.graphData.nodes.filter((n) => connectedIds.has(n.id))
					};
					state.graphDetailPanelOpen = true;
					state.highlightedPath = [action.payload, ...Array.from(connectedIds)];
				}
			} else {
				state.selectedGraphNode = null;
				state.graphDetailPanelOpen = false;
				state.highlightedPath = [];
			}
		},
		closeGraphDetailPanel(state) {
			state.graphDetailPanelOpen = false;
			state.selectedGraphNode = null;
			state.graphFilters.focusedNodeId = null;
			state.highlightedPath = [];
			state.explorerActive = false;
		},
		toggleGraphAiPanel(state) {
			state.graphAiPanelOpen = !state.graphAiPanelOpen;
		},
		addGraphAiMessage(state, action) {
			state.graphAiMessages.push({
				...action.payload,
				timestamp: (/* @__PURE__ */ new Date()).toISOString()
			});
		},
		setGraphAiProcessing(state, action) {
			state.graphAiProcessing = action.payload;
		},
		toggleExplorer(state) {
			state.explorerActive = !state.explorerActive;
		},
		setHighlightedPath(state, action) {
			state.highlightedPath = action.payload;
		},
		resetGraphFilters(state) {
			state.graphFilters = initialGraphFilters;
			state.graphSearchResults = [];
			state.highlightedPath = [];
			state.explorerActive = false;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchEmployeeHierarchy.pending, (state) => {
			state.loading = true;
			state.error = null;
		}).addCase(fetchEmployeeHierarchy.fulfilled, (state, action) => {
			state.loading = false;
			state.hierarchy = action.payload;
			if (action.payload && action.payload.length > 0) {
				const allIds = getAllNodeIds(action.payload);
				const defaultExpanded = {};
				allIds.forEach((id) => {
					defaultExpanded[id] = true;
				});
				state.expandedNodes = defaultExpanded;
			}
		}).addCase(fetchEmployeeHierarchy.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload ?? "Failed to fetch hierarchy from backend";
		}).addCase(fetchEmployeeReportingDetails.pending, (state) => {
			state.loadingDetails = true;
			state.detailsError = null;
		}).addCase(fetchEmployeeReportingDetails.fulfilled, (state, action) => {
			state.loadingDetails = false;
			state.selectedEmployeeDetails = action.payload;
		}).addCase(fetchEmployeeReportingDetails.rejected, (state, action) => {
			state.loadingDetails = false;
			state.detailsError = action.payload ?? "Failed to fetch employee details";
		}).addCase(fetchOrganizationalGraph.pending, (state) => {
			state.graphLoading = true;
			state.graphError = null;
		}).addCase(fetchOrganizationalGraph.fulfilled, (state, action) => {
			state.graphLoading = false;
			state.graphData = action.payload;
			if (action.payload.nodes.length > 0) state.healthMetrics = calculateHealthMetrics(action.payload.nodes, action.payload.relationships);
			else state.healthMetrics = {
				totalWorkforce: 0,
				totalManagers: 0,
				hierarchyDepth: 0,
				avgSpanOfControl: 0,
				unassignedReportingManagers: 0,
				teamsWithoutManagers: 0,
				employeesWithoutDepartment: 0,
				orphanedRelationships: 0,
				projectsWithoutEmployees: 0,
				goalsWithoutOwners: 0,
				workflowsWithoutResponsible: 0,
				sufficientData: false
			};
		}).addCase(fetchOrganizationalGraph.rejected, (state, action) => {
			state.graphLoading = false;
			state.graphError = action.payload ?? "Failed to load organizational graph data.";
		});
	}
});
var { setSearchKeyword, setFilters, resetFilters, setSelectedEmployee, toggleNodeExpanded, setNodeExpanded, expandAllNodes, collapseAllNodes, setZoomLevel, zoomIn, zoomOut, resetZoom, toggleFullscreen, setIsFullscreen, setLayout, setConnectorStyle, toggleAiInsights, toggleAnalyticsPanel, setViewMode, setGraphSearchQuery, toggleGraphFilterCategory, setGraphFilterCategories, toggleRelationshipTypeFilter, setFocusedNode, closeGraphDetailPanel, toggleGraphAiPanel, addGraphAiMessage, setGraphAiProcessing, toggleExplorer, setHighlightedPath, resetGraphFilters } = employeeHierarchySlice.actions;
var employeeHierarchySlice_default = employeeHierarchySlice.reducer;
//#endregion
export { zoomOut as C, zoomIn as S, toggleExplorer as _, expandAllNodes as a, toggleGraphFilterCategory as b, fetchOrganizationalGraph as c, setFilters as d, setFocusedNode as f, setViewMode as g, setSelectedEmployee as h, employeeHierarchySlice_default as i, resetFilters as l, setLayout as m, closeGraphDetailPanel as n, fetchEmployeeHierarchy as o, setGraphAiProcessing as p, collapseAllNodes as r, fetchEmployeeReportingDetails as s, addGraphAiMessage as t, resetZoom as u, toggleFullscreen as v, toggleNodeExpanded as x, toggleGraphAiPanel as y };
