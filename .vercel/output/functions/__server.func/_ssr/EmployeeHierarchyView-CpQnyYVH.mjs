import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { At as Network, Bt as MapPin, Dn as GitBranch, Dr as ChevronRight, H as Sparkles, Jr as Briefcase, K as Shield, Kr as Building, P as Target, Pn as FolderKanban, Pt as Minimize2, Q as Send, Rn as FileSpreadsheet, T as TriangleAlert, Yr as Brain, Zt as ListFilter, a as X, an as Layers, h as User, kr as ChevronDown, lt as RefreshCw, n as ZoomOut, on as Laptop, p as Users, q as ShieldCheck, qn as FileBraces, qr as Building2, qt as LoaderCircle, r as ZoomIn, rn as LayoutGrid, rr as Crown, s as Workflow, st as RotateCcw, tn as Lightbulb, tr as DollarSign, wn as GitFork, x as UserCheck, zt as Maximize2 } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { s as createSelector } from "../_libs/@reduxjs/toolkit+[...].mjs";
import { n as useAppSelector, t as useAppDispatch } from "./hooks-BpVIWXzj.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { C as zoomOut, S as zoomIn, _ as toggleExplorer, a as expandAllNodes, b as toggleGraphFilterCategory, c as fetchOrganizationalGraph, d as setFilters, f as setFocusedNode, g as setViewMode, h as setSelectedEmployee, l as resetFilters, m as setLayout, n as closeGraphDetailPanel, o as fetchEmployeeHierarchy, p as setGraphAiProcessing, r as collapseAllNodes, s as fetchEmployeeReportingDetails, t as addGraphAiMessage, u as resetZoom, v as toggleFullscreen, x as toggleNodeExpanded, y as toggleGraphAiPanel } from "./employeeHierarchySlice-8KeWhm8x.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/EmployeeHierarchyView-CpQnyYVH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var selectHierarchyState = (state) => state.employeeHierarchy || {
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
		workLocationType: "all"
	},
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
	graphFilters: {
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
	},
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
var selectRawHierarchyTrees = createSelector([selectHierarchyState], (state) => state.hierarchy);
var selectSearchKeyword = createSelector([selectHierarchyState], (state) => state.searchKeyword.toLowerCase().trim());
var selectFilters = createSelector([selectHierarchyState], (state) => state.filters);
function flattenNodes(nodes) {
	if (!nodes) return [];
	const list = [];
	nodes.forEach((node) => {
		list.push(node);
		if (node.children && node.children.length > 0) list.push(...flattenNodes(node.children));
	});
	return list;
}
var selectFlatEmployeeNodes = createSelector([selectRawHierarchyTrees], (trees) => flattenNodes(trees));
var selectAvailableDepartments = createSelector([selectFlatEmployeeNodes], (nodes) => Array.from(new Set(nodes.map((n) => n.department).filter(Boolean))).sort());
var selectAvailableDesignations = createSelector([selectFlatEmployeeNodes], (nodes) => Array.from(new Set(nodes.map((n) => n.designation).filter(Boolean))).sort());
var selectAvailableLocations = createSelector([selectFlatEmployeeNodes], (nodes) => Array.from(new Set(nodes.map((n) => n.branch).filter(Boolean))).sort());
var selectAvailableManagers = createSelector([selectFlatEmployeeNodes], (nodes) => nodes.filter((n) => n.children && n.children.length > 0 || n.reporting_manager_name).map((n) => ({
	id: n.id,
	name: `${n.first_name} ${n.last_name}`,
	designation: n.designation
})));
function norm(str) {
	return (str || "").trim().toLowerCase();
}
function normType(str) {
	return (str || "").trim().toLowerCase().replace(/[-_]/g, " ");
}
function matchesFilterAndSearch(node, search, filters) {
	const fullName = `${node.first_name || ""} ${node.last_name || ""}`.trim().toLowerCase();
	const searchLower = norm(search);
	const empId = norm(node.employee_id);
	const dept = norm(node.department);
	const desig = norm(node.designation);
	const email = norm(node.email);
	const role = norm(node.role);
	const branch = norm(node.branch || node.location);
	const matchesSearch = !searchLower || fullName.includes(searchLower) || empId.includes(searchLower) || dept.includes(searchLower) || desig.includes(searchLower) || email.includes(searchLower) || role.includes(searchLower) || branch.includes(searchLower);
	const matchesDept = !filters.department || filters.department === "all" || norm(node.department) === norm(filters.department);
	const matchesDesig = !filters.designation || filters.designation === "all" || norm(node.designation) === norm(filters.designation);
	const nodeLoc = norm(node.branch || node.location);
	const filterLoc = norm(filters.location);
	const matchesLoc = !filters.location || filters.location === "all" || nodeLoc === filterLoc;
	const matchesType = !filters.employmentType || filters.employmentType === "all" || normType(node.employment_type) === normType(filters.employmentType);
	const matchesMgr = !filters.reportingManagerId || filters.reportingManagerId === "all" || node.reporting_to === filters.reportingManagerId || node.id === filters.reportingManagerId || norm(node.reporting_manager_name) === norm(filters.reportingManagerId);
	return Boolean(matchesSearch && matchesDept && matchesDesig && matchesLoc && matchesType && matchesMgr);
}
function filterNodeTree(node, search, filters) {
	const isCurrentMatch = matchesFilterAndSearch(node, search, filters);
	const filteredChildren = [];
	if (node.children && node.children.length > 0) node.children.forEach((c) => {
		const filteredChild = filterNodeTree(c, search, filters);
		if (filteredChild) filteredChildren.push(filteredChild);
	});
	if (isCurrentMatch || filteredChildren.length > 0) return {
		...node,
		children: filteredChildren
	};
	return null;
}
var selectFilteredHierarchyTrees = createSelector([
	selectRawHierarchyTrees,
	selectSearchKeyword,
	selectFilters
], (trees, search, filters) => {
	if (!trees) return [];
	const filtered = [];
	trees.forEach((tree) => {
		const f = filterNodeTree(tree, search, filters);
		if (f) filtered.push(f);
	});
	return filtered;
});
var selectMatchingNodeIds = createSelector([
	selectFlatEmployeeNodes,
	selectSearchKeyword,
	selectFilters
], (nodes, search, filters) => {
	if (!search && Object.values(filters).every((v) => v === "all")) return /* @__PURE__ */ new Set();
	const matching = /* @__PURE__ */ new Set();
	nodes.forEach((n) => {
		if (matchesFilterAndSearch(n, search, filters)) matching.add(n.id);
	});
	return matching;
});
function getRoleBadge(designation = "", role = "") {
	const d = designation.toLowerCase();
	const r = role.toLowerCase();
	if (d.includes("ceo") || d.includes("chief executive") || d.includes("founder")) return {
		label: "CEO / Founder",
		bg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
		icon: Crown
	};
	if (d.includes("vice president") || d.includes("vp") || d.includes("director")) return {
		label: "Executive / VP",
		bg: "bg-purple-500/20 text-purple-300 border-purple-500/40",
		icon: Shield
	};
	if (d.includes("manager") || d.includes("lead") || d.includes("head")) return {
		label: "Team Leader",
		bg: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
		icon: UserCheck
	};
	if (r.includes("hr") || d.includes("hr")) return {
		label: "HR Admin",
		bg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
		icon: Briefcase
	};
	if (d.includes("contractor") || d.includes("freelance")) return {
		label: "Contractor",
		bg: "bg-sky-500/20 text-sky-300 border-sky-500/40",
		icon: Laptop
	};
	if (d.includes("intern")) return {
		label: "Intern",
		bg: "bg-rose-500/20 text-rose-300 border-rose-500/40",
		icon: Building
	};
	return null;
}
function getStatusInfo(status = "") {
	const s = status.toLowerCase();
	if (s === "on_leave" || s === "leave") return {
		label: "On Leave",
		color: "bg-amber-500",
		text: "text-amber-400"
	};
	if (s === "inactive" || s === "offline") return {
		label: "Offline",
		color: "bg-slate-400",
		text: "text-slate-400"
	};
	return {
		label: "Online",
		color: "bg-emerald-500",
		text: "text-emerald-400"
	};
}
var OrgChartNodeCard = import_react.memo(function OrgChartNodeCard({ node, isExpanded, isSelected, isMatched, onToggleExpand, onSelect, layout = "vertical" }) {
	const hasChildren = node.children && node.children.length > 0;
	const directReportsCount = node.children ? node.children.length : 0;
	const statusInfo = getStatusInfo(node.status || node.employment_status || "active");
	const roleBadge = getRoleBadge(node.designation, node.role);
	const fullName = `${node.first_name} ${node.last_name}`.trim();
	const initials = fullName ? fullName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() : "EX";
	const isOverloadedManager = directReportsCount >= 5;
	const isMissingManager = !node.reporting_to && !node.designation?.toLowerCase().includes("ceo");
	const hasAiWarning = isOverloadedManager || isMissingManager;
	const isHorizontal = layout === "horizontal";
	const isCompact = layout === "compact";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `relative group/node flex ${isHorizontal ? "flex-row items-center" : "flex-col items-center"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
			whileHover: {
				y: -3,
				scale: 1.02
			},
			transition: { duration: .15 },
			id: `node-${node.id}`,
			onClick: () => onSelect(node),
			className: `relative ${isCompact ? "w-[240px] p-3" : "w-[280px] p-4"} cursor-pointer rounded-2xl border bg-card/85 shadow-lg backdrop-blur-xl transition-all duration-200 hover:shadow-2xl text-left ${isSelected ? "border-primary ring-2 ring-primary/50 shadow-glow bg-card/95" : isMatched ? "border-brand-accent ring-2 ring-brand-accent/60 shadow-brand-accent/20 animate-pulse" : "border-border/80 hover:border-foreground/40"}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-1.5 border-b border-border/50 pb-2 mb-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono text-[10px] font-semibold text-muted-foreground uppercase tracking-wider bg-accent/60 px-2 py-0.5 rounded",
							children: node.employee_id || "EMP"
						}), roleBadge && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${roleBadge.bg}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(roleBadge.icon, { className: "h-2.5 w-2.5" }), roleBadge.label]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [hasAiWarning && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-5 w-5 place-items-center rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30",
							title: isOverloadedManager ? "AI Alert: Overloaded Manager" : "AI Alert: Unassigned Manager",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 animate-pulse" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1 text-[10px] font-medium text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2 w-2 rounded-full ${statusInfo.color}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: statusInfo.label
							})]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative shrink-0",
						children: [node.profile_photo_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: node.profile_photo_url,
							alt: fullName,
							className: "h-12 w-12 rounded-xl object-cover ring-2 ring-border/80"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-sm font-bold text-brand-foreground shadow-sm",
							children: initials
						}), directReportsCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow",
							title: `${directReportsCount} Direct Reports`,
							children: directReportsCount
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-display text-sm font-bold tracking-tight text-foreground truncate group-hover/node:text-primary transition-colors",
								children: fullName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-muted-foreground truncate",
								children: node.designation || "Staff"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground/80 truncate",
								children: node.department || "General"
							})
						]
					})]
				}),
				!isCompact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 grid grid-cols-2 gap-2 border-t border-border/50 pt-2 text-left text-[11px] text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "truncate",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] uppercase font-semibold text-muted-foreground/60 block",
							children: "Manager"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium text-foreground truncate block",
							children: node.reporting_manager_name || "Executive Board"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "truncate",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] uppercase font-semibold text-muted-foreground/60 block",
							children: "Location"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-medium text-foreground truncate inline-flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-2.5 w-2.5 text-muted-foreground shrink-0" }), node.branch || "Headquarters"]
						})]
					})]
				})
			]
		}), hasChildren && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: (e) => onToggleExpand(node.id, e),
			className: `relative z-10 grid h-7 w-7 place-items-center rounded-full border border-border bg-card text-foreground shadow-md transition-transform duration-200 hover:scale-110 hover:border-primary hover:bg-accent cursor-pointer ${isHorizontal ? "ml-2" : "mt-2"}`,
			title: isExpanded ? "Collapse Direct Reports" : "Expand Direct Reports",
			children: isExpanded ? isHorizontal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 text-primary" }) : isHorizontal ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-muted-foreground" })
		})]
	});
});
var TreeNode = import_react.memo(function TreeNode({ node, expandedNodes, selectedEmployeeId, matchingNodeIds, layout, connectorStyle, onToggleExpand, onSelectNode }) {
	const isExpanded = expandedNodes[node.id] !== false;
	const isSelected = selectedEmployeeId === node.id;
	const isMatched = matchingNodeIds.has(node.id);
	const hasChildren = node.children && node.children.length > 0 && isExpanded;
	const isHorizontal = layout === "horizontal";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex ${isHorizontal ? "flex-row items-center" : "flex-col items-center"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrgChartNodeCard, {
			node,
			isExpanded,
			isSelected,
			isMatched,
			onToggleExpand,
			onSelect: onSelectNode,
			layout
		}), hasChildren && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `flex ${isHorizontal ? "flex-row items-center" : "flex-col items-center"} w-full`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: isHorizontal ? "w-8 h-0.5 bg-border/80" : "h-6 w-0.5 bg-border/80" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `relative flex ${isHorizontal ? "flex-col justify-center gap-6 pl-2" : "justify-center gap-8 pt-2"}`,
				children: [node.children.length > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute bg-border/80 ${isHorizontal ? "left-0 w-0.5 top-[calc(50px)] bottom-[calc(50px)]" : "top-0 h-0.5 left-[calc(140px+16px)] right-[calc(140px+16px)]"}` }), node.children.map((child) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `relative flex ${isHorizontal ? "flex-row items-center" : "flex-col items-center"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `bg-border/80 ${isHorizontal ? "w-4 h-0.5 -ml-2 mr-2" : "h-4 w-0.5 -mt-2 mb-2"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TreeNode, {
						node: child,
						expandedNodes,
						selectedEmployeeId,
						matchingNodeIds,
						layout,
						connectorStyle,
						onToggleExpand,
						onSelectNode
					})]
				}, child.id))]
			})]
		})]
	});
});
function OrgChartCanvas({ trees, expandedNodes, selectedEmployeeId, matchingNodeIds, zoomLevel, layout, connectorStyle, onToggleExpand, onSelectNode }) {
	const scale = (0, import_react.useMemo)(() => zoomLevel / 100, [zoomLevel]);
	const containerRef = (0, import_react.useRef)(null);
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const [position, setPosition] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const [dragStart, setDragStart] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const handleMouseDown = (e) => {
		if (e.button !== 0) return;
		setIsDragging(true);
		setDragStart({
			x: e.clientX - position.x,
			y: e.clientY - position.y
		});
	};
	const handleMouseMove = (e) => {
		if (!isDragging) return;
		setPosition({
			x: e.clientX - dragStart.x,
			y: e.clientY - dragStart.y
		});
	};
	const handleMouseUp = () => {
		setIsDragging(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: containerRef,
		onMouseDown: handleMouseDown,
		onMouseMove: handleMouseMove,
		onMouseUp: handleMouseUp,
		onMouseLeave: handleMouseUp,
		className: `relative w-full overflow-hidden rounded-2xl border border-border bg-card/40 backdrop-blur-xl min-h-[650px] flex justify-center items-center ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none opacity-40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "transition-transform duration-200 origin-center flex justify-center gap-16 py-12 px-12",
			style: { transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` },
			children: trees.map((tree) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TreeNode, {
				node: tree,
				expandedNodes,
				selectedEmployeeId,
				matchingNodeIds,
				layout,
				connectorStyle,
				onToggleExpand,
				onSelectNode
			}, tree.id))
		})]
	});
}
var MobileNode = import_react.memo(function MobileNode({ node, depth, expandedNodes, selectedEmployeeId, matchingNodeIds, onToggleExpand, onSelectNode }) {
	const isExpanded = expandedNodes[node.id] !== false;
	const isSelected = selectedEmployeeId === node.id;
	const isMatched = matchingNodeIds.has(node.id);
	const hasChildren = node.children && node.children.length > 0;
	const fullName = `${node.first_name} ${node.last_name}`.trim();
	const initials = fullName ? fullName.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() : "EX";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2 text-left",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			onClick: () => onSelectNode(node),
			className: `flex items-center justify-between gap-3 rounded-xl border p-3 bg-card/60 backdrop-blur-md transition-all ${isSelected ? "border-primary ring-2 ring-primary/30" : isMatched ? "border-brand-accent ring-2 ring-brand-accent/40" : "border-border/80 hover:bg-accent/60"}`,
			style: { marginLeft: `${depth * 14}px` },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 min-w-0 flex-1",
				children: [
					hasChildren ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: (e) => onToggleExpand(node.id, e),
						className: "grid h-6 w-6 shrink-0 place-items-center rounded-lg border border-border bg-accent/60 text-foreground",
						children: isExpanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5" })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "w-6 shrink-0" }),
					node.profile_photo_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: node.profile_photo_url,
						alt: fullName,
						className: "h-8 w-8 rounded-lg object-cover shrink-0"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-brand text-xs font-bold text-brand-foreground",
						children: initials
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-sm font-semibold truncate",
								children: fullName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-[10px] text-muted-foreground bg-accent px-1.5 py-0.5 rounded",
								children: node.employee_id || "EMP"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground truncate",
							children: [
								node.designation,
								" • ",
								node.department
							]
						})]
					})
				]
			}), hasChildren && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "shrink-0 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-muted-foreground",
				children: [node.children.length, " reports"]
			})]
		}), hasChildren && isExpanded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2 border-l border-border/60 pl-2",
			children: node.children.map((child) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileNode, {
				node: child,
				depth: depth + 1,
				expandedNodes,
				selectedEmployeeId,
				matchingNodeIds,
				onToggleExpand,
				onSelectNode
			}, child.id))
		})]
	});
});
function OrgChartMobileTree({ trees, expandedNodes, selectedEmployeeId, matchingNodeIds, onToggleExpand, onSelectNode }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-2xl border border-border bg-card/40 p-4 backdrop-blur-xl space-y-2",
		children: trees.map((tree) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileNode, {
			node: tree,
			depth: 0,
			expandedNodes,
			selectedEmployeeId,
			matchingNodeIds,
			onToggleExpand,
			onSelectNode
		}, tree.id))
	});
}
function calculateHierarchyMetrics(trees) {
	let totalEmployees = 0;
	let totalManagers = 0;
	const departments = /* @__PURE__ */ new Set();
	let maxDepth = 0;
	let maxTeamSize = 0;
	let largestTeamManager = "";
	function traverse(node, depth) {
		totalEmployees += 1;
		if (node.department) departments.add(node.department);
		if (depth > maxDepth) maxDepth = depth;
		const directCount = node.children ? node.children.length : 0;
		if (directCount > 0) {
			totalManagers += 1;
			if (directCount > maxTeamSize) {
				maxTeamSize = directCount;
				largestTeamManager = `${node.first_name} ${node.last_name}`;
			}
		}
		if (node.children) node.children.forEach((child) => traverse(child, depth + 1));
	}
	trees.forEach((t) => traverse(t, 1));
	const avgSpanOfControl = totalManagers > 0 ? (totalEmployees / totalManagers).toFixed(1) : "0.0";
	return {
		totalEmployees,
		totalManagers,
		totalDepartments: departments.size,
		maxDepth,
		maxTeamSize,
		largestTeamManager,
		avgSpanOfControl
	};
}
function HierarchyAnalyticsPanel({ trees }) {
	const metrics = calculateHierarchyMetrics(trees);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3",
			children: [
				{
					label: "Total Workforce",
					value: metrics.totalEmployees.toString(),
					sub: "Active Employees in Database",
					icon: Users,
					color: "text-blue-400",
					bg: "bg-blue-500/10 border-blue-500/20"
				},
				{
					label: "Leadership & Managers",
					value: metrics.totalManagers.toString(),
					sub: "Active Reporting Managers",
					icon: UserCheck,
					color: "text-indigo-400",
					bg: "bg-indigo-500/10 border-indigo-500/20"
				},
				{
					label: "Org Depth",
					value: `${metrics.maxDepth} Levels`,
					sub: "Max Hierarchy Chain Depth",
					icon: Layers,
					color: "text-purple-400",
					bg: "bg-purple-500/10 border-purple-500/20"
				},
				{
					label: "Span of Control",
					value: `${metrics.avgSpanOfControl} Reports`,
					sub: "Average Reports / Manager",
					icon: GitFork,
					color: "text-emerald-400",
					bg: "bg-emerald-500/10 border-emerald-500/20"
				}
			].map((kpi, idx) => {
				const Icon = kpi.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 10
					},
					animate: {
						opacity: 1,
						y: 0
					},
					transition: {
						duration: .2,
						delay: idx * .05
					},
					className: `rounded-xl border ${kpi.bg} bg-card/60 p-3.5 backdrop-blur-md text-left shadow-sm`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: kpi.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `p-2 rounded-lg ${kpi.bg} ${kpi.color}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-xl font-bold mt-1 text-foreground",
							children: kpi.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-muted-foreground mt-0.5",
							children: kpi.sub
						})
					]
				}, kpi.label);
			})
		})
	});
}
var nodeTypeConfig$1 = {
	employee: {
		icon: User,
		color: "text-primary",
		bg: "bg-primary/10",
		ringColor: "ring-primary/30"
	},
	manager: {
		icon: Crown,
		color: "text-primary",
		bg: "bg-primary/15",
		ringColor: "ring-primary/40"
	},
	team: {
		icon: Users,
		color: "text-foreground",
		bg: "bg-muted",
		ringColor: "ring-border"
	},
	department: {
		icon: Building2,
		color: "text-primary",
		bg: "bg-primary/10",
		ringColor: "ring-primary/30"
	},
	project: {
		icon: FolderKanban,
		color: "text-foreground",
		bg: "bg-muted",
		ringColor: "ring-border"
	},
	skill: {
		icon: Lightbulb,
		color: "text-muted-foreground",
		bg: "bg-muted",
		ringColor: "ring-border"
	},
	goal: {
		icon: Target,
		color: "text-primary",
		bg: "bg-primary/10",
		ringColor: "ring-primary/30"
	},
	policy: {
		icon: Shield,
		color: "text-muted-foreground",
		bg: "bg-muted",
		ringColor: "ring-border"
	},
	workflow: {
		icon: Workflow,
		color: "text-foreground",
		bg: "bg-muted",
		ringColor: "ring-border"
	}
};
var categoryNodeTypes = {
	people: ["employee", "manager"],
	teams: ["team", "department"],
	projects: ["project"],
	skills: ["skill"],
	goals: ["goal"],
	policies: ["policy"],
	workflows: ["workflow"]
};
var GraphNodeCard = import_react.memo(function GraphNodeCard({ node, isSelected, isHighlighted, isConnected, isDimmed, connectionCount, onClick }) {
	const config = nodeTypeConfig$1[node.type];
	const Icon = config.icon;
	const isEmployee = node.type === "employee" || node.type === "manager";
	const meta = node.metadata || {};
	const initials = node.label ? node.label.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() : "?";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
		layout: true,
		whileHover: {
			scale: 1.04,
			y: -2
		},
		transition: { duration: .15 },
		onClick,
		className: `relative cursor-pointer rounded-xl border bg-card shadow-sm transition-all duration-200 p-3 w-[220px] text-left group ${isSelected ? `border-primary ring-2 ring-primary/50 shadow-md bg-card` : isHighlighted ? `border-primary ring-2 ${config.ringColor} shadow-md` : isConnected ? `border-border ring-1 ${config.ringColor}` : isDimmed ? "border-border/40 opacity-40 hover:opacity-70" : "border-border hover:border-foreground/40 hover:shadow-md"}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative shrink-0",
					children: [isEmployee && meta.profilePhotoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: String(meta.profilePhotoUrl),
						alt: node.label,
						className: "h-9 w-9 rounded-lg object-cover ring-1 ring-border/60"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `grid h-9 w-9 place-items-center rounded-lg ${config.bg} ${config.color} text-xs font-bold shadow-sm`,
						children: isEmployee ? initials : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
					}), connectionCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground shadow",
						title: `${connectionCount} connections`,
						children: connectionCount > 9 ? "9+" : connectionCount
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors leading-tight",
						children: node.label
					}), node.subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] text-muted-foreground truncate leading-tight mt-0.5",
						children: node.subtitle
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mt-2 pt-1.5 border-t border-border/30",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: `inline-flex items-center gap-1 text-[8px] font-bold px-1.5 py-0.5 rounded-full ${config.bg} ${config.color}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-2 w-2" }), node.type.charAt(0).toUpperCase() + node.type.slice(1)]
					}),
					isEmployee && Boolean(meta.department) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[9px] text-muted-foreground truncate max-w-[100px]",
						children: String(meta.department)
					}),
					node.type === "department" && meta.employeeCount != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[9px] text-muted-foreground",
						children: [String(meta.employeeCount), " members"]
					})
				]
			})]
		})
	});
});
function OrganizationalGraphCanvas({ nodes, relationships, activeCategories, focusedNodeId, highlightedPath, zoomLevel, onSelectNode }) {
	const scale = (0, import_react.useMemo)(() => zoomLevel / 100, [zoomLevel]);
	const containerRef = (0, import_react.useRef)(null);
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const [position, setPosition] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const [dragStart, setDragStart] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const visibleNodeTypes = (0, import_react.useMemo)(() => {
		const types = /* @__PURE__ */ new Set();
		activeCategories.forEach((cat) => {
			categoryNodeTypes[cat].forEach((t) => types.add(t));
		});
		return types;
	}, [activeCategories]);
	const filteredNodes = (0, import_react.useMemo)(() => nodes.filter((n) => visibleNodeTypes.has(n.type)), [nodes, visibleNodeTypes]);
	const filteredNodeIds = (0, import_react.useMemo)(() => new Set(filteredNodes.map((n) => n.id)), [filteredNodes]);
	const connectionCounts = (0, import_react.useMemo)(() => {
		const counts = /* @__PURE__ */ new Map();
		relationships.forEach((r) => {
			if (filteredNodeIds.has(r.sourceNodeId) && filteredNodeIds.has(r.targetNodeId)) {
				counts.set(r.sourceNodeId, (counts.get(r.sourceNodeId) || 0) + 1);
				counts.set(r.targetNodeId, (counts.get(r.targetNodeId) || 0) + 1);
			}
		});
		return counts;
	}, [relationships, filteredNodeIds]);
	const highlightedSet = (0, import_react.useMemo)(() => new Set(highlightedPath), [highlightedPath]);
	const focusedConnections = (0, import_react.useMemo)(() => {
		if (!focusedNodeId) return /* @__PURE__ */ new Set();
		const connected = /* @__PURE__ */ new Set();
		relationships.forEach((r) => {
			if (r.sourceNodeId === focusedNodeId) connected.add(r.targetNodeId);
			if (r.targetNodeId === focusedNodeId) connected.add(r.sourceNodeId);
		});
		return connected;
	}, [focusedNodeId, relationships]);
	const groupedNodes = (0, import_react.useMemo)(() => {
		const groups = /* @__PURE__ */ new Map();
		filteredNodes.forEach((n) => {
			const list = groups.get(n.type) || [];
			list.push(n);
			groups.set(n.type, list);
		});
		return groups;
	}, [filteredNodes]);
	const handleMouseDown = (e) => {
		if (e.button !== 0) return;
		setIsDragging(true);
		setDragStart({
			x: e.clientX - position.x,
			y: e.clientY - position.y
		});
	};
	const handleMouseMove = (e) => {
		if (!isDragging) return;
		setPosition({
			x: e.clientX - dragStart.x,
			y: e.clientY - dragStart.y
		});
	};
	const handleMouseUp = () => setIsDragging(false);
	const handleWheel = (0, import_react.useCallback)((e) => {
		e.preventDefault();
	}, []);
	(0, import_react.useEffect)(() => {
		const el = containerRef.current;
		if (el) {
			el.addEventListener("wheel", handleWheel, { passive: false });
			return () => el.removeEventListener("wheel", handleWheel);
		}
	}, [handleWheel]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: containerRef,
		onMouseDown: handleMouseDown,
		onMouseMove: handleMouseMove,
		onMouseUp: handleMouseUp,
		onMouseLeave: handleMouseUp,
		className: `relative w-full overflow-hidden rounded-2xl border border-border bg-card min-h-[650px] ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "transition-transform duration-150 origin-center py-8 px-8",
			style: { transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` },
			children: filteredNodes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center min-h-[400px] text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, { className: "h-12 w-12 text-muted-foreground/30 mb-3" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-semibold text-muted-foreground",
						children: "No nodes match current filters"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground/70 mt-1",
						children: "Adjust the category filters above to show organizational entities."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-8",
				children: [
					"manager",
					"employee",
					"department",
					"team",
					"project",
					"skill",
					"goal",
					"policy",
					"workflow"
				].map((nodeType) => {
					const group = groupedNodes.get(nodeType);
					if (!group || group.length === 0) return null;
					const config = nodeTypeConfig$1[nodeType];
					const Icon = config.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `grid h-6 w-6 place-items-center rounded-lg ${config.bg} ${config.color}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
									children: [
										nodeType === "employee" || nodeType === "manager" ? `${nodeType}s` : `${nodeType}s`,
										" ",
										"(",
										group.length,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex-1 h-px bg-border" })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-3",
							children: group.map((node) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraphNodeCard, {
								node,
								isSelected: focusedNodeId === node.id,
								isHighlighted: highlightedSet.has(node.id),
								isConnected: focusedConnections.has(node.id),
								isDimmed: focusedNodeId !== null && focusedNodeId !== node.id && !focusedConnections.has(node.id) && !highlightedSet.has(node.id),
								connectionCount: connectionCounts.get(node.id) || 0,
								onClick: () => onSelectNode(node.id)
							}, node.id))
						})]
					}, nodeType);
				})
			})
		})]
	});
}
var nodeTypeConfig = {
	employee: {
		icon: User,
		color: "text-blue-400",
		bg: "bg-blue-500/15",
		label: "Employee"
	},
	manager: {
		icon: Crown,
		color: "text-amber-400",
		bg: "bg-amber-500/15",
		label: "Manager"
	},
	team: {
		icon: Users,
		color: "text-cyan-400",
		bg: "bg-cyan-500/15",
		label: "Team"
	},
	department: {
		icon: Building2,
		color: "text-violet-400",
		bg: "bg-violet-500/15",
		label: "Department"
	},
	project: {
		icon: FolderKanban,
		color: "text-emerald-400",
		bg: "bg-emerald-500/15",
		label: "Project"
	},
	skill: {
		icon: Lightbulb,
		color: "text-yellow-400",
		bg: "bg-yellow-500/15",
		label: "Skill"
	},
	goal: {
		icon: Target,
		color: "text-rose-400",
		bg: "bg-rose-500/15",
		label: "Goal"
	},
	policy: {
		icon: Shield,
		color: "text-indigo-400",
		bg: "bg-indigo-500/15",
		label: "Policy"
	},
	workflow: {
		icon: Workflow,
		color: "text-teal-400",
		bg: "bg-teal-500/15",
		label: "Workflow"
	}
};
function NodeTypeBadge({ type }) {
	const config = nodeTypeConfig[type];
	const Icon = config.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border ${config.bg} ${config.color} border-current/20`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-2.5 w-2.5" }), config.label]
	});
}
function ConnectionCard({ rel, connectedNode, onFocus }) {
	const config = nodeTypeConfig[connectedNode.type];
	const Icon = config.icon;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.button, {
		type: "button",
		whileHover: { x: 3 },
		onClick: onFocus,
		className: "flex items-center justify-between gap-2 w-full rounded-lg border border-border/60 bg-card/80 p-2 hover:border-primary/50 cursor-pointer transition-colors text-left group",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 min-w-0 flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `grid h-7 w-7 place-items-center rounded-lg ${config.bg} ${config.color} shrink-0`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium text-foreground truncate",
					children: connectedNode.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[10px] text-muted-foreground truncate",
					children: [
						rel.label,
						" — ",
						connectedNode.subtitle || config.label
					]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3 text-muted-foreground group-hover:text-primary shrink-0" })]
	});
}
function GraphDetailPanel({ details, onClose, onFocusNode, onExplore, explorerActive }) {
	const { node, directConnections, connectedNodes } = details;
	const config = nodeTypeConfig[node.type];
	const Icon = config.icon;
	const groupedConnections = /* @__PURE__ */ new Map();
	directConnections.forEach((rel) => {
		const connectedId = rel.sourceNodeId === node.id ? rel.targetNodeId : rel.sourceNodeId;
		const connNode = connectedNodes.find((n) => n.id === connectedId);
		if (!connNode) return;
		const group = groupedConnections.get(rel.type) || [];
		group.push({
			rel,
			node: connNode
		});
		groupedConnections.set(rel.type, group);
	});
	const isEmployee = node.type === "employee" || node.type === "manager";
	const meta = node.metadata || {};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			x: 20,
			opacity: 0
		},
		animate: {
			x: 0,
			opacity: 1
		},
		exit: {
			x: 20,
			opacity: 0
		},
		transition: { duration: .2 },
		className: "fixed bottom-6 right-6 z-40 max-w-md w-full rounded-2xl border border-border bg-card/95 shadow-2xl backdrop-blur-xl text-left animate-in slide-in-from-right duration-200 max-h-[85vh] flex flex-col",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between gap-3 p-4 pb-3 border-b border-border shrink-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `grid h-10 w-10 place-items-center rounded-xl ${config.bg} ${config.color} shrink-0`,
					children: isEmployee && meta.profilePhotoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: String(meta.profilePhotoUrl),
						alt: node.label,
						className: "h-10 w-10 rounded-xl object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-sm font-bold text-foreground truncate",
						children: node.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 mt-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NodeTypeBadge, { type: node.type }), node.subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted-foreground truncate",
							children: node.subtitle
						})]
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onClose,
				className: "text-muted-foreground hover:text-foreground cursor-pointer shrink-0 mt-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 overflow-auto p-4 space-y-4 text-xs",
			children: [
				isEmployee && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-2 rounded-xl border border-border bg-accent/20 p-3",
					children: [
						Boolean(meta.employeeId) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] uppercase font-semibold text-muted-foreground/60 block",
							children: "Employee ID"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono font-medium text-foreground",
							children: String(meta.employeeId)
						})] }),
						Boolean(meta.department) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] uppercase font-semibold text-muted-foreground/60 block",
							children: "Department"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium text-foreground",
							children: String(meta.department)
						})] }),
						Boolean(meta.designation) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] uppercase font-semibold text-muted-foreground/60 block",
							children: "Designation"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium text-foreground",
							children: String(meta.designation)
						})] }),
						Boolean(meta.reportingManagerName) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] uppercase font-semibold text-muted-foreground/60 block",
							children: "Manager"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium text-foreground",
							children: String(meta.reportingManagerName)
						})] }),
						Boolean(meta.branch) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] uppercase font-semibold text-muted-foreground/60 block",
							children: "Location"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-medium text-foreground flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-2.5 w-2.5 text-muted-foreground" }), String(meta.branch)]
						})] }),
						Boolean(meta.employmentType) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] uppercase font-semibold text-muted-foreground/60 block",
							children: "Employment"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium text-foreground capitalize",
							children: String(meta.employmentType).replace(/_/g, " ")
						})] }),
						meta.directReportsCount != null && Number(meta.directReportsCount) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] uppercase font-semibold text-muted-foreground/60 block",
							children: "Direct Reports"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium text-foreground",
							children: String(meta.directReportsCount)
						})] }),
						Boolean(meta.joiningDate) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] uppercase font-semibold text-muted-foreground/60 block",
							children: "Joined"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium text-foreground",
							children: String(meta.joiningDate)
						})] })
					]
				}),
				node.type === "department" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-accent/20 p-3 space-y-1",
					children: [Boolean(meta.managerName) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] uppercase font-semibold text-muted-foreground/60 block",
						children: "Department Head"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium text-foreground",
						children: String(meta.managerName)
					})] }), meta.employeeCount != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] uppercase font-semibold text-muted-foreground/60 block",
						children: "Team Size"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-medium text-foreground",
						children: [String(meta.employeeCount), " members"]
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-wider",
							children: [
								"Connected Relationships (",
								directConnections.length,
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: onExplore,
							className: `text-[10px] h-6 px-2 gap-1 cursor-pointer ${explorerActive ? "text-brand" : "text-muted-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, { className: "h-3 w-3" }), explorerActive ? "Close Explorer" : "Explore Connections"]
						})]
					}), directConnections.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-lg border border-dashed border-border bg-muted/10 p-3 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground",
							children: "No relationships configured for this node."
						})
					}) : Array.from(groupedConnections.entries()).map(([relType, items]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider block",
							children: [
								relType.replace(/_/g, " "),
								" (",
								items.length,
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-1",
							children: items.map(({ rel, node: connNode }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConnectionCard, {
								rel,
								connectedNode: connNode,
								onFocus: () => onFocusNode(connNode.id)
							}, rel.id))
						})]
					}, relType))]
				})
			]
		})]
	}) });
}
function queryGraphData(query, graphData) {
	if (!graphData || graphData.nodes.length === 0) return "Organizational graph data is not available. Please ensure employees and organizational data exist in the system.";
	const q = query.toLowerCase().trim();
	const nodes = graphData.nodes;
	const rels = graphData.relationships;
	const reportsToMatch = q.match(/who\s+reports?\s+to\s+(.+?)[\?]?$/);
	if (reportsToMatch) {
		const name = reportsToMatch[1].trim().toLowerCase();
		const manager = nodes.find((n) => (n.type === "employee" || n.type === "manager") && n.label.toLowerCase().includes(name));
		if (!manager) return `No employee matching "${reportsToMatch[1].trim()}" found in the organizational data.`;
		const reportRels = rels.filter((r) => r.type === "REPORTS_TO" && r.targetNodeId === manager.id);
		if (reportRels.length === 0) return `No direct reports found for ${manager.label}.`;
		const reporters = reportRels.map((r) => nodes.find((n) => n.id === r.sourceNodeId)).filter(Boolean);
		return `${manager.label} has ${reporters.length} direct report(s):\n\n${reporters.map((r) => `• ${r.label} — ${r.subtitle || r.type}`).join("\n")}`;
	}
	const projectMatch = q.match(/(?:which|what)\s+projects?\s+(?:are|is)\s+(?:connected|assigned|related)\s+to\s+(.+?)[\?]?$/);
	if (projectMatch) {
		const name = projectMatch[1].trim().toLowerCase();
		const emp = nodes.find((n) => (n.type === "employee" || n.type === "manager") && n.label.toLowerCase().includes(name));
		if (!emp) return `No employee matching "${projectMatch[1].trim()}" found.`;
		const projectRels = rels.filter((r) => (r.type === "ASSIGNED_TO" || r.type === "WORKS_ON") && (r.sourceNodeId === emp.id || r.targetNodeId === emp.id));
		if (projectRels.length === 0) return `No project relationships configured for ${emp.label}. Relationship data is not available.`;
		const projects = projectRels.map((r) => {
			const id = r.sourceNodeId === emp.id ? r.targetNodeId : r.sourceNodeId;
			return nodes.find((n) => n.id === id);
		}).filter(Boolean);
		return `Projects connected to ${emp.label}:\n\n${projects.map((p) => `• ${p.label}`).join("\n")}`;
	}
	const skillsMatch = q.match(/(?:which|what)\s+skills?\s+(?:are|is)\s+(?:available|present)\s+(?:in|for)\s+(.+?)[\?]?$/);
	if (skillsMatch) {
		const name = skillsMatch[1].trim().toLowerCase();
		const dept = nodes.find((n) => n.type === "department" && n.label.toLowerCase().includes(name));
		if (!dept) return `No department matching "${skillsMatch[1].trim()}" found.`;
		const memberRels = rels.filter((r) => r.type === "MEMBER_OF" && r.targetNodeId === dept.id);
		const memberIds = new Set(memberRels.map((r) => r.sourceNodeId));
		const skillRels = rels.filter((r) => r.type === "HAS_SKILL" && memberIds.has(r.sourceNodeId));
		if (skillRels.length === 0) return `No skill data available for ${dept.label} team members.`;
		const skills = new Set(skillRels.map((r) => nodes.find((n) => n.id === r.targetNodeId)).filter(Boolean).map((n) => n.label));
		return `Skills available in ${dept.label} (${memberIds.size} members):\n\n${Array.from(skills).map((s) => `• ${s}`).join("\n")}`;
	}
	if (q.includes("how many employees") || q.includes("total workforce") || q.includes("total employees")) return `Organizational Overview:\n\n• Total Workforce: ${nodes.filter((n) => n.type === "employee" || n.type === "manager").length} employees\n• Managers: ${nodes.filter((n) => n.type === "manager").length}\n• Departments: ${nodes.filter((n) => n.type === "department").length}\n• Skills tracked: ${nodes.filter((n) => n.type === "skill").length}\n• Total relationships: ${rels.length}`;
	if (q.includes("department") && (q.includes("show") || q.includes("list") || q.includes("which"))) {
		const depts = nodes.filter((n) => n.type === "department");
		if (depts.length === 0) return "No departments found in the organizational data.";
		return `Departments (${depts.length}):\n\n${depts.map((d) => `• ${d.label}`).join("\n")}`;
	}
	const whoIsMatch = q.match(/(?:who\s+is|find|search|show)\s+(.+?)[\?]?$/);
	if (whoIsMatch) {
		const name = whoIsMatch[1].trim().toLowerCase();
		const found = nodes.filter((n) => n.label.toLowerCase().includes(name) || n.metadata?.employeeId && String(n.metadata.employeeId).toLowerCase().includes(name));
		if (found.length === 0) return `No matching entity found for "${whoIsMatch[1].trim()}" in the organizational data.`;
		return found.slice(0, 5).map((n) => {
			const info = [`**${n.label}** (${n.type})`];
			if (n.subtitle) info.push(`Designation: ${n.subtitle}`);
			if (n.description) info.push(`Department: ${n.description}`);
			if (n.metadata?.employeeId) info.push(`ID: ${n.metadata.employeeId}`);
			const nodeRels = rels.filter((r) => r.sourceNodeId === n.id || r.targetNodeId === n.id);
			info.push(`Connections: ${nodeRels.length} relationship(s)`);
			return info.join("\n");
		}).join("\n\n---\n\n");
	}
	return `I can help you explore the organizational graph. Try questions like:\n\n• "Who reports to [manager name]?"\n• "How many employees?"\n• "Which skills are available in [department]?"\n• "Who is [employee name]?"\n• "Show departments"\n\nNote: I can only answer questions based on available organizational data. If a relationship has not been configured, I will indicate that the data is not available.`;
}
function GraphAIPanel({ graphData, messages, processing, onSendMessage, onClose }) {
	const [input, setInput] = (0, import_react.useState)("");
	const scrollRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
	}, [messages]);
	const handleSend = (directMessage) => {
		const msg = (directMessage || input).trim();
		if (!msg) return;
		setInput("");
		onSendMessage(msg);
		setTimeout(() => {
			onSendMessage(`__AI_RESPONSE__${queryGraphData(msg, graphData)}`);
		}, 400);
	};
	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			y: 20,
			opacity: 0
		},
		animate: {
			y: 0,
			opacity: 1
		},
		exit: {
			y: 20,
			opacity: 0
		},
		className: "fixed bottom-6 left-6 z-40 w-[400px] max-w-[calc(100vw-48px)] rounded-2xl border border-brand/30 bg-card/95 shadow-2xl backdrop-blur-xl flex flex-col max-h-[70vh]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 p-3 pb-2 border-b border-border shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-8 w-8 place-items-center rounded-lg bg-brand/15 text-brand",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-xs font-bold text-foreground",
						children: "Organizational Intelligence"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] text-muted-foreground",
						children: "Read-only analysis • Real data only"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					className: "text-muted-foreground hover:text-foreground cursor-pointer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				ref: scrollRef,
				className: "flex-1 overflow-auto p-3 space-y-3 min-h-[200px]",
				children: [
					messages.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center py-4 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-8 w-8 mx-auto text-brand/50" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: "Ask questions about your organizational structure. I analyze only real data — never inventing relationships."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5 justify-center",
								children: [
									"How many employees?",
									"Show departments",
									"Who reports to the CEO?"
								].map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => handleSend(q),
									className: "text-[10px] px-2.5 py-1 rounded-full border border-brand/20 bg-brand/5 text-brand hover:bg-brand/10 cursor-pointer transition-colors",
									children: q
								}, q))
							})
						]
					}),
					messages.map((msg, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
						initial: {
							opacity: 0,
							y: 5
						},
						animate: {
							opacity: 1,
							y: 0
						},
						className: `flex ${msg.role === "user" ? "justify-end" : "justify-start"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `max-w-[85%] rounded-xl px-3 py-2 text-[11px] leading-relaxed ${msg.role === "user" ? "bg-brand/15 text-foreground border border-brand/20" : "bg-accent/40 text-foreground border border-border/50"}`,
							children: [msg.role === "assistant" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 text-[9px] text-brand font-semibold mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-2.5 w-2.5" }), "AI Analysis"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "whitespace-pre-wrap",
								children: msg.content
							})]
						})
					}, idx)),
					processing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-start",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl px-3 py-2 bg-accent/40 border border-border/50",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin text-brand" })
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border p-3 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: input,
						onChange: (e) => setInput(e.target.value),
						onKeyDown: handleKeyDown,
						placeholder: "Ask about organizational relationships...",
						className: "text-xs h-8 bg-muted/20 border-border/60"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "default",
						size: "icon",
						onClick: () => handleSend(),
						disabled: !input.trim() || processing,
						className: "h-8 w-8 shrink-0 cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 mt-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-2.5 w-2.5 text-amber-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[9px] text-muted-foreground",
						children: "Read-only analysis. Cannot modify data. Respects RBAC boundaries."
					})]
				})]
			})
		]
	}) });
}
var filterCategories = [
	{
		id: "people",
		label: "People",
		icon: Users,
		color: "text-blue-400"
	},
	{
		id: "teams",
		label: "Teams",
		icon: Building2,
		color: "text-violet-400"
	},
	{
		id: "projects",
		label: "Projects",
		icon: FolderKanban,
		color: "text-emerald-400"
	},
	{
		id: "skills",
		label: "Skills",
		icon: Lightbulb,
		color: "text-yellow-400"
	},
	{
		id: "goals",
		label: "Goals",
		icon: Target,
		color: "text-rose-400"
	},
	{
		id: "policies",
		label: "Policies",
		icon: Shield,
		color: "text-indigo-400"
	},
	{
		id: "workflows",
		label: "Workflows",
		icon: Workflow,
		color: "text-teal-400"
	}
];
function EmployeeHierarchyView() {
	const dispatch = useAppDispatch();
	const { loading, error, selectedEmployeeId, selectedEmployeeDetails, loadingDetails, detailsError, expandedNodes, searchKeyword, filters, zoomLevel, isFullscreen, layout, connectorStyle, showAiInsights, showAnalyticsPanel, viewMode, graphData, graphLoading, graphError, graphFilters, selectedGraphNode, graphDetailPanelOpen, graphAiPanelOpen, graphAiMessages, graphAiProcessing, healthMetrics, explorerActive, highlightedPath, graphSearchResults } = useAppSelector(selectHierarchyState);
	const userRole = useAppSelector((s) => s.sidebar?.userRole) || "admin";
	const filteredTrees = useAppSelector(selectFilteredHierarchyTrees);
	const matchingNodeIds = useAppSelector(selectMatchingNodeIds);
	const availableDepartments = useAppSelector(selectAvailableDepartments);
	const availableDesignations = useAppSelector(selectAvailableDesignations);
	const availableLocations = useAppSelector(selectAvailableLocations);
	const availableManagers = useAppSelector(selectAvailableManagers);
	(0, import_react.useEffect)(() => {
		if (viewMode === "hierarchy") dispatch(fetchEmployeeHierarchy());
		else dispatch(fetchOrganizationalGraph());
	}, [dispatch, viewMode]);
	const handleToggleExpand = (0, import_react.useCallback)((id, e) => {
		e.stopPropagation();
		dispatch(toggleNodeExpanded(id));
	}, [dispatch]);
	const handleSelectNode = (0, import_react.useCallback)((node) => {
		dispatch(setSelectedEmployee(node.id));
		dispatch(fetchEmployeeReportingDetails(node.id));
		const el = document.getElementById(`node-${node.id}`);
		if (el) el.scrollIntoView({
			behavior: "smooth",
			block: "center",
			inline: "center"
		});
	}, [dispatch]);
	const handleGraphNodeSelect = (0, import_react.useCallback)((nodeId) => {
		dispatch(setFocusedNode(nodeId));
	}, [dispatch]);
	const handleExportCSV = (0, import_react.useCallback)(() => {
		if (viewMode === "graph" && graphData) {
			const rows = ["Node ID,Type,Label,Subtitle,Description"];
			graphData.nodes.forEach((n) => {
				rows.push(`"${n.id}","${n.type}","${n.label}","${n.subtitle || ""}","${n.description || ""}"`);
			});
			rows.push("");
			rows.push("Source,Target,Relationship Type,Label");
			graphData.relationships.forEach((r) => {
				rows.push(`"${r.sourceNodeId}","${r.targetNodeId}","${r.type}","${r.label}"`);
			});
			const blob = new Blob([rows.join("\n")], { type: "text/csv" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `org-graph-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
			a.click();
			URL.revokeObjectURL(url);
			toast.success("Organizational graph exported as CSV");
		} else toast.info("Export available in graph view mode");
	}, [viewMode, graphData]);
	const handleExportJSON = (0, import_react.useCallback)(() => {
		if (viewMode === "graph" && graphData) {
			const blob = new Blob([JSON.stringify(graphData, null, 2)], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `org-graph-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
			a.click();
			URL.revokeObjectURL(url);
			toast.success("Organizational graph exported as JSON");
		} else toast.info("Export available in graph view mode");
	}, [viewMode, graphData]);
	const handleAiMessage = (0, import_react.useCallback)((message) => {
		if (message.startsWith("__AI_RESPONSE__")) {
			dispatch(addGraphAiMessage({
				role: "assistant",
				content: message.replace("__AI_RESPONSE__", "")
			}));
			dispatch(setGraphAiProcessing(false));
		} else {
			dispatch(addGraphAiMessage({
				role: "user",
				content: message
			}));
			dispatch(setGraphAiProcessing(true));
		}
	}, [dispatch]);
	const isEmpDetailsAllowed = userRole === "admin" || userRole === "hr" || userRole === "hr_manager";
	const isGraphMode = viewMode === "graph";
	const isLoading = isGraphMode ? graphLoading : loading;
	const currentError = isGraphMode ? graphError : error;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `space-y-5 ${isFullscreen ? "fixed inset-0 z-50 overflow-auto bg-background p-6" : ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap items-center justify-end gap-2 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl text-left shadow-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center rounded-lg border border-border bg-accent/30 p-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => dispatch(setViewMode("hierarchy")),
								className: `flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${!isGraphMode ? "bg-brand text-brand-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`,
								title: "Hierarchy View",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitBranch, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Hierarchy"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => dispatch(setViewMode("graph")),
								className: `flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${isGraphMode ? "bg-brand text-brand-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`,
								title: "Organizational Graph View",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Graph"
								})]
							})]
						}),
						!isGraphMode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center rounded-lg border border-border bg-accent/30 p-0.5",
							children: [
								{
									id: "vertical",
									label: "Vertical",
									icon: GitBranch
								},
								{
									id: "horizontal",
									label: "Horizontal",
									icon: LayoutGrid
								},
								{
									id: "compact",
									label: "Compact",
									icon: ListFilter
								}
							].map((l) => {
								const Icon = l.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => dispatch(setLayout(l.id)),
									className: `flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${layout === l.id ? "bg-brand text-brand-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`,
									title: `${l.label} Tree Layout`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: l.label
									})]
								}, l.id);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center rounded-lg border border-border bg-accent/30 p-0.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onClick: () => dispatch(zoomOut()),
									title: "Zoom Out",
									className: "h-8 w-8 cursor-pointer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomOut, { className: "h-3.5 w-3.5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "px-2 font-mono text-xs font-semibold text-muted-foreground min-w-[42px] text-center",
									children: [zoomLevel, "%"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onClick: () => dispatch(zoomIn()),
									title: "Zoom In",
									className: "h-8 w-8 cursor-pointer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomIn, { className: "h-3.5 w-3.5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onClick: () => dispatch(resetZoom()),
									title: "Reset View",
									className: "h-8 w-8 cursor-pointer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" })
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => dispatch(expandAllNodes()),
							className: "text-xs h-8 cursor-pointer",
							children: "Expand All"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => dispatch(collapseAllNodes()),
							className: "text-xs h-8 cursor-pointer",
							children: "Collapse All"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center rounded-lg border border-border bg-accent/30 p-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: handleExportCSV,
								className: "text-xs h-8 gap-1 cursor-pointer",
								title: "Export CSV",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden lg:inline",
									children: "CSV"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: handleExportJSON,
								className: "text-xs h-8 gap-1 cursor-pointer",
								title: "Export JSON",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileBraces, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden lg:inline",
									children: "JSON"
								})]
							})]
						}),
						isGraphMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: graphAiPanelOpen ? "default" : "outline",
							size: "sm",
							onClick: () => dispatch(toggleGraphAiPanel()),
							className: "text-xs h-8 gap-1.5 cursor-pointer",
							title: "Organizational Intelligence",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brain, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden lg:inline",
								children: "AI"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => dispatch(toggleFullscreen()),
							className: "text-xs h-8 gap-1.5 cursor-pointer",
							children: isFullscreen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minimize2, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "h-3.5 w-3.5" })
						})
					]
				})
			}),
			isGraphMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card/40 px-4 py-2.5 backdrop-blur-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-2",
					children: "Filters"
				}), filterCategories.map((cat) => {
					const Icon = cat.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => dispatch(toggleGraphFilterCategory(cat.id)),
						className: `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${graphFilters.activeCategories.includes(cat.id) ? `${cat.color} bg-card border-current/20 shadow-sm` : "text-muted-foreground border-transparent hover:text-foreground hover:border-border/50"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" }), cat.label]
					}, cat.id);
				})]
			}),
			isGraphMode && graphSearchResults.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-brand-accent/30 bg-card/80 backdrop-blur-md shadow-lg overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-4 py-2 border-b border-border/50",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-[11px] font-semibold text-muted-foreground",
						children: [
							"Found ",
							graphSearchResults.length,
							" results"
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-[200px] overflow-auto",
					children: graphSearchResults.map((result) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => dispatch(setFocusedNode(result.nodeId)),
						className: "flex items-center justify-between w-full px-4 py-2 text-left hover:bg-accent/40 cursor-pointer transition-colors border-b border-border/20 last:border-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium text-foreground truncate",
								children: result.label
							}), result.subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-muted-foreground truncate",
								children: ["— ", result.subtitle]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] font-bold uppercase tracking-wider text-muted-foreground bg-accent/60 px-1.5 py-0.5 rounded shrink-0 ml-2",
							children: result.type
						})]
					}, result.nodeId))
				})]
			}),
			!isGraphMode && filteredTrees && filteredTrees.length > 0 && showAnalyticsPanel && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HierarchyAnalyticsPanel, { trees: filteredTrees }),
			isGraphMode && healthMetrics && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HealthMetricsPanel, { metrics: healthMetrics }),
			!isGraphMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 text-left",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-[11px] font-semibold text-muted-foreground",
						children: "Department"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: filters.department,
						onChange: (e) => dispatch(setFilters({ department: e.target.value })),
						className: "mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "All Departments"
						}), availableDepartments.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: d,
							children: d
						}, d))]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-[11px] font-semibold text-muted-foreground",
						children: "Designation"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: filters.designation,
						onChange: (e) => dispatch(setFilters({ designation: e.target.value })),
						className: "mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "All Designations"
						}), availableDesignations.map((des) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: des,
							children: des
						}, des))]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-[11px] font-semibold text-muted-foreground",
						children: "Location / Branch"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: filters.location,
						onChange: (e) => dispatch(setFilters({ location: e.target.value })),
						className: "mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "All Locations"
						}), availableLocations.map((loc) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: loc,
							children: loc
						}, loc))]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-[11px] font-semibold text-muted-foreground",
						children: "Employment Type"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: filters.employmentType,
						onChange: (e) => dispatch(setFilters({ employmentType: e.target.value })),
						className: "mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All Types"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "full_time",
								children: "Full-Time"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "part_time",
								children: "Part-Time"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "contractor",
								children: "Contractor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "intern",
								children: "Intern"
							})
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						className: "text-[11px] font-semibold text-muted-foreground",
						children: "Reporting Manager"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: filters.reportingManagerId,
						onChange: (e) => dispatch(setFilters({ reportingManagerId: e.target.value })),
						className: "mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "All Managers"
						}), availableManagers.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: m.id,
							children: [
								m.name,
								" (",
								m.designation,
								")"
							]
						}, m.id))]
					})] })
				]
			}),
			!isGraphMode && matchingNodeIds.size > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between rounded-xl border border-brand-accent/30 bg-brand-accent/10 px-4 py-2 text-xs font-semibold text-brand-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"Found ",
					matchingNodeIds.size,
					" matching node(s) in organization tree"
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => dispatch(resetFilters()),
					className: "text-xs text-brand-foreground underline hover:opacity-80 cursor-pointer",
					children: "Clear Filters"
				})]
			}),
			isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/40 p-12 text-center space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-32 w-64 rounded-2xl" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-center gap-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-32 w-64 rounded-2xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-32 w-64 rounded-2xl" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Loading organizational data from backend..."
					})
				]
			}),
			!isLoading && currentError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-destructive/40 bg-destructive/10 p-8 text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-6 w-6 text-destructive shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-base font-semibold text-foreground",
						children: isGraphMode ? "Graph API Error" : "Hierarchy API Error"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-0.5",
						children: currentError
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => isGraphMode ? dispatch(fetchOrganizationalGraph()) : dispatch(fetchEmployeeHierarchy()),
						className: "gap-1.5 text-xs cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " Retry Connection"]
					})
				})]
			}),
			!isLoading && !currentError && isGraphMode && graphData && graphData.nodes.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Network, { className: "mx-auto h-10 w-10 text-muted-foreground/60 mb-3" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-base font-semibold text-foreground",
						children: "No Organizational Data Available"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "No employees found. Add employees and organizational data in the system first."
					})
				]
			}),
			!isLoading && !currentError && isGraphMode && graphData && graphData.nodes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [graphData.metadata.totalProjects === 0 && graphData.metadata.totalGoals === 0 && graphData.metadata.totalPolicies === 0 && graphData.metadata.totalWorkflows === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-2 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5 text-amber-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "Employees found, but project, goal, policy, and workflow relationships are not configured. Only employee hierarchy and department relationships are available."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrganizationalGraphCanvas, {
					nodes: graphData.nodes,
					relationships: graphData.relationships,
					activeCategories: graphFilters.activeCategories,
					focusedNodeId: graphFilters.focusedNodeId,
					highlightedPath,
					zoomLevel,
					onSelectNode: handleGraphNodeSelect
				})]
			}),
			!isGraphMode && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [!loading && !error && (!filteredTrees || filteredTrees.length === 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mx-auto h-10 w-10 text-muted-foreground/60 mb-3" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-base font-semibold text-foreground",
						children: "No Employee Hierarchy Available"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "No active reporting structures match the selected filters in the database."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => dispatch(resetFilters()),
						className: "mt-4 text-xs cursor-pointer",
						children: "Reset Filters"
					})
				]
			}), !loading && !error && filteredTrees && filteredTrees.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden sm:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrgChartCanvas, {
					trees: filteredTrees,
					expandedNodes,
					selectedEmployeeId,
					matchingNodeIds,
					zoomLevel,
					layout,
					connectorStyle,
					onToggleExpand: handleToggleExpand,
					onSelectNode: handleSelectNode
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "block sm:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrgChartMobileTree, {
					trees: filteredTrees,
					expandedNodes,
					selectedEmployeeId,
					matchingNodeIds,
					onToggleExpand: handleToggleExpand,
					onSelectNode: handleSelectNode
				})
			})] })] }),
			!isGraphMode && selectedEmployeeId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed bottom-6 right-6 z-40 max-w-md w-full rounded-2xl border border-border bg-card/95 p-5 shadow-2xl backdrop-blur-xl text-left animate-in slide-in-from-bottom duration-200",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3 pb-3 border-b border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-display text-sm font-bold text-foreground flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-brand" }), "Employee Hierarchy Intelligence"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => dispatch(setSelectedEmployee(null)),
							className: "text-muted-foreground hover:text-foreground cursor-pointer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						})]
					}),
					loadingDetails && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-6 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-full rounded-xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 w-full rounded-xl" })]
					}),
					!loadingDetails && detailsError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "py-4 text-xs text-destructive flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: detailsError })]
					}),
					!loadingDetails && selectedEmployeeDetails && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 space-y-4 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [selectedEmployeeDetails.employee.profile_photo_url ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: selectedEmployeeDetails.employee.profile_photo_url,
									alt: selectedEmployeeDetails.employee.first_name,
									className: "h-12 w-12 rounded-xl object-cover ring-2 ring-primary/30"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-sm font-bold text-brand-foreground",
									children: [selectedEmployeeDetails.employee.first_name?.[0], selectedEmployeeDetails.employee.last_name?.[0]]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
										className: "font-display text-sm font-bold text-foreground",
										children: [
											selectedEmployeeDetails.employee.first_name,
											" ",
											selectedEmployeeDetails.employee.last_name
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: selectedEmployeeDetails.employee.designation
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground/80",
										children: selectedEmployeeDetails.employee.department
									})
								] })]
							}),
							selectedEmployeeDetails.reporting_chain && selectedEmployeeDetails.reporting_chain.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-accent/30 p-2.5 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block",
									children: "Reporting Chain Path"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap items-center gap-1 text-[11px]",
									children: selectedEmployeeDetails.reporting_chain.map((ancestor, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-medium text-foreground",
										children: [
											ancestor.first_name,
											" ",
											ancestor.last_name
										]
									}), idx < selectedEmployeeDetails.reporting_chain.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3 text-muted-foreground" })] }, ancestor.id))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-2 rounded-xl border border-border bg-accent/20 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] uppercase font-semibold text-muted-foreground/60 block",
										children: "Org Level"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-medium text-foreground",
										children: ["Level ", selectedEmployeeDetails.organization_level]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] uppercase font-semibold text-muted-foreground/60 block",
										children: "Direct Reports"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-medium text-foreground",
										children: [selectedEmployeeDetails.direct_reports.length, " Employees"]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] uppercase font-semibold text-muted-foreground/60 block",
										children: "Reporting Manager"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium text-foreground",
										children: selectedEmployeeDetails.manager ? `${selectedEmployeeDetails.manager.first_name} ${selectedEmployeeDetails.manager.last_name}` : "Executive Board"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] uppercase font-semibold text-muted-foreground/60 block",
										children: "Location"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium text-foreground",
										children: selectedEmployeeDetails.employee.branch || "Headquarters"
									})] }),
									isEmpDetailsAllowed && selectedEmployeeDetails.employee.ctc && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-span-2 pt-2 border-t border-border/50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] uppercase font-semibold text-muted-foreground/60 flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-3 w-3 text-emerald-400" }), " Confidential CTC"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-mono text-xs font-semibold text-emerald-400",
											children: [
												"₹ ",
												Number(selectedEmployeeDetails.employee.ctc).toLocaleString(),
												" / yr"
											]
										})]
									})
								]
							}),
							selectedEmployeeDetails.direct_reports.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] font-semibold text-muted-foreground block mb-1.5",
								children: [
									"Direct Reports (",
									selectedEmployeeDetails.direct_reports.length,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-1 max-h-32 overflow-auto",
								children: selectedEmployeeDetails.direct_reports.map((dr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onClick: () => handleSelectNode(dr),
									className: "flex items-center justify-between rounded-lg border border-border/60 bg-card p-2 hover:border-primary/50 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-medium text-foreground truncate",
										children: [
											dr.first_name,
											" ",
											dr.last_name
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground truncate",
										children: dr.designation
									})]
								}, dr.id))
							})] })
						]
					})
				]
			}),
			isGraphMode && graphDetailPanelOpen && selectedGraphNode && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraphDetailPanel, {
				details: selectedGraphNode,
				onClose: () => dispatch(closeGraphDetailPanel()),
				onFocusNode: (nodeId) => dispatch(setFocusedNode(nodeId)),
				onExplore: () => dispatch(toggleExplorer()),
				explorerActive
			}),
			isGraphMode && graphAiPanelOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraphAIPanel, {
				graphData,
				messages: graphAiMessages,
				processing: graphAiProcessing,
				onSendMessage: handleAiMessage,
				onClose: () => dispatch(toggleGraphAiPanel())
			})
		]
	});
}
function HealthMetricsPanel({ metrics }) {
	if (!metrics.sufficientData) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-dashed border-border bg-card/40 p-6 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-6 w-6 mx-auto text-muted-foreground/40 mb-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-semibold text-muted-foreground",
			children: "Insufficient organizational data for analysis."
		})]
	});
	const kpis = [
		{
			label: "Total Workforce",
			value: metrics.totalWorkforce.toString(),
			sub: "Active Employees",
			icon: Users,
			color: "text-blue-400",
			bg: "bg-blue-500/10 border-blue-500/20"
		},
		{
			label: "Leadership",
			value: metrics.totalManagers.toString(),
			sub: "Active Managers",
			icon: ShieldCheck,
			color: "text-indigo-400",
			bg: "bg-indigo-500/10 border-indigo-500/20"
		},
		{
			label: "Org Depth",
			value: `${metrics.hierarchyDepth} Levels`,
			sub: "Max Hierarchy Depth",
			icon: GitBranch,
			color: "text-purple-400",
			bg: "bg-purple-500/10 border-purple-500/20"
		},
		{
			label: "Span of Control",
			value: `${metrics.avgSpanOfControl} Avg`,
			sub: "Reports per Manager",
			icon: Network,
			color: "text-emerald-400",
			bg: "bg-emerald-500/10 border-emerald-500/20"
		}
	];
	const issues = [
		metrics.unassignedReportingManagers > 0 && {
			label: `${metrics.unassignedReportingManagers} employee(s) without assigned reporting manager`,
			type: "warning"
		},
		metrics.employeesWithoutDepartment > 0 && {
			label: `${metrics.employeesWithoutDepartment} employee(s) without department assignment`,
			type: "warning"
		},
		metrics.teamsWithoutManagers > 0 && {
			label: `${metrics.teamsWithoutManagers} department(s) without a manager`,
			type: "info"
		}
	].filter(Boolean);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3",
			children: kpis.map((kpi) => {
				const Icon = kpi.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `rounded-xl border ${kpi.bg} bg-card/60 p-3.5 backdrop-blur-md text-left shadow-sm`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: kpi.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `p-2 rounded-lg ${kpi.bg} ${kpi.color}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-xl font-bold mt-1 text-foreground",
							children: kpi.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-muted-foreground mt-0.5",
							children: kpi.sub
						})
					]
				}, kpi.label);
			})
		}), issues.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-brand/20 bg-brand/5 p-3 backdrop-blur-md space-y-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-[11px] font-semibold text-brand",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), "Organizational Health Insights"]
			}), issues.map((issue, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-2 text-[11px] text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: `h-3 w-3 shrink-0 mt-0.5 ${issue.type === "warning" ? "text-amber-400" : "text-blue-400"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: issue.label })]
			}, idx))]
		})]
	});
}
//#endregion
export { EmployeeHierarchyView as t };
