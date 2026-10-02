import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, Br as Calendar, Cr as CircleCheckBig, Dr as ChevronRight, E as TrendingUp, Fn as Flame, Fr as ChartLine, H as Sparkles, Ir as ChartColumn, Jn as Eye, Kr as Building, Ln as FileText, Mr as ChartPie, Or as ChevronLeft, P as Target, Rn as FileSpreadsheet, S as Upload, Sr as CircleCheck, T as TriangleAlert, Tr as CircleAlert, Zn as Ellipsis, bn as GraduationCap, ci as ArrowUpDown, ei as BookOpen, er as Download, ht as Plus, i as Zap, jn as Funnel, k as Trash2, mi as Activity, oi as Award, p as Users, pr as Clock, vr as CircleX, w as Trophy, x as UserCheck, xt as Pen } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { n as useAppSelector, t as useAppDispatch } from "./hooks-BpVIWXzj.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Progress } from "./progress-ZynOkOPX.mjs";
import { c as useAurix, u as useMounted } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as bulkDeleteReviews, c as createGoal, d as deleteReview, f as fetchPerformance, g as updateTrainingStatus, h as updateReview, i as assignTraining, l as createReview, m as updateGoal, n as addReward, o as bulkSetReviewStatus, p as importReviews, r as assignGoal, s as completeGoal, t as addFeedback, u as deleteGoal } from "./performanceThunk-CenAzX-9.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { t as ScrollArea } from "./scroll-area-BlnbM3_c.mjs";
import { a as DropdownMenuSeparator, i as DropdownMenuLabel, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-DXMm4jWj.mjs";
import { C as Legend, S as Tooltip, _ as PolarRadiusAxis, a as PieChart, b as Cell, c as YAxis, d as Line, f as CartesianGrid, g as PolarAngleAxis, h as Pie, i as RadarChart, l as XAxis, m as Radar, o as BarChart, p as Bar, s as LineChart, v as PolarGrid, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BgKcOzjx.mjs";
import { a as SheetTitle, i as SheetHeader, n as SheetContent, t as Sheet } from "./sheet-3YlcNW_l.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-CkAivaVl.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DJOO1b-0.mjs";
import { t as Checkbox } from "./checkbox-BhwBotB1.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-BCrgGGf7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PerformancePage-JzsRSMR8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function usePerformance() {
	const dispatch = useAppDispatch();
	const { reviews, goals, feedback360, rewards, courses, loading, error } = useAppSelector((state) => state.performance);
	(0, import_react.useEffect)(() => {
		dispatch(fetchPerformance());
	}, [dispatch]);
	return {
		reviews,
		goals,
		feedback360,
		rewards,
		courses,
		loading,
		error,
		createReview: (review) => dispatch(createReview(review)),
		updateReview: (review) => dispatch(updateReview(review)),
		deleteReview: (id) => dispatch(deleteReview(id)),
		bulkDeleteReviews: (ids) => dispatch(bulkDeleteReviews(ids)),
		bulkSetReviewStatus: (ids, status) => dispatch(bulkSetReviewStatus({
			ids,
			status
		})),
		importReviews: (items) => dispatch(importReviews(items)),
		createGoal: (goal) => dispatch(createGoal(goal)),
		updateGoal: (goal) => dispatch(updateGoal(goal)),
		deleteGoal: (id) => dispatch(deleteGoal(id)),
		assignGoal: (employeeId, title, description, priority, dueDate) => dispatch(assignGoal({
			employeeId,
			title,
			description,
			priority,
			dueDate
		})),
		completeGoal: (id) => dispatch(completeGoal(id)),
		addFeedback: (fb) => dispatch(addFeedback(fb)),
		addReward: (reward) => dispatch(addReward(reward)),
		assignTraining: (employeeId, courseName) => dispatch(assignTraining({
			employeeId,
			courseName
		})),
		updateTrainingStatus: (id, status) => dispatch(updateTrainingStatus({
			id,
			status
		}))
	};
}
function PerformanceStatsCards({ reviews, goals }) {
	const totalReviewed = reviews.length;
	const pendingReviews = reviews.filter((r) => r.reviewStatus === "draft" || r.reviewStatus === "in_review").length;
	const highPerformers = reviews.filter((r) => r.overallRating >= 4.5).length;
	const needingImprovement = reviews.filter((r) => r.overallRating <= 2.5).length;
	const totalScore = reviews.reduce((acc, r) => acc + r.overallRating, 0);
	const avgScore = totalReviewed > 0 ? (totalScore / totalReviewed).toFixed(1) : "0.0";
	const totalGoals = goals.length;
	const completedGoals = goals.filter((g) => g.status === "completed").length;
	const goalsCompletedPct = totalGoals > 0 ? Math.round(completedGoals / totalGoals * 100) : 0;
	const promotionEligible = reviews.filter((r) => r.promotionEligible).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 2xl:grid-cols-8 gap-3 sm:gap-4",
		children: [
			{
				label: "Employees Reviewed",
				value: totalReviewed,
				icon: Users,
				desc: "Total evaluations",
				color: "from-blue-500/20 to-indigo-500/20 text-blue-500 border-blue-500/20"
			},
			{
				label: "Pending Reviews",
				value: pendingReviews,
				icon: Clock,
				desc: "Awaiting review",
				color: "from-amber-500/20 to-orange-500/20 text-amber-500 border-amber-500/20"
			},
			{
				label: "High Performers",
				value: highPerformers,
				icon: Award,
				desc: "Score >= 4.5 rating",
				color: "from-emerald-500/20 to-teal-500/20 text-emerald-500 border-emerald-500/20"
			},
			{
				label: "Needing Improvement",
				value: needingImprovement,
				icon: TriangleAlert,
				desc: "Score <= 2.5 rating",
				color: "from-rose-500/20 to-red-500/20 text-rose-500 border-rose-500/20"
			},
			{
				label: "Avg. Performance Score",
				value: `${avgScore} / 5`,
				icon: TrendingUp,
				desc: "Company rating baseline",
				color: "from-purple-500/20 to-pink-500/20 text-purple-500 border-purple-500/20"
			},
			{
				label: "Goals Completed %",
				value: `${goalsCompletedPct}%`,
				icon: CircleCheckBig,
				desc: "OKRs objectives met",
				color: "from-cyan-500/20 to-sky-500/20 text-cyan-500 border-cyan-500/20"
			},
			{
				label: "Promotion Eligible",
				value: promotionEligible,
				icon: UserCheck,
				desc: "Recommended for promotion",
				color: "from-teal-500/20 to-emerald-500/20 text-teal-500 border-teal-500/20"
			},
			{
				label: "Performance Trend",
				value: totalReviewed > 0 ? parseFloat(avgScore) >= 4 ? "Excellent" : parseFloat(avgScore) >= 3 ? "Good" : "Needs Review" : "—",
				icon: TrendingUp,
				desc: totalReviewed > 0 ? "Based on active reviews" : "No evaluations yet",
				color: "from-slate-500/20 to-gray-500/20 text-slate-500 border-slate-500/20"
			}
		].map((stat, i) => {
			const Icon = stat.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "group relative overflow-hidden rounded-2xl border border-border/80 bg-card/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-md hover:bg-card/60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-4 flex flex-col justify-between h-full min-h-[125px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0 pr-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground block truncate",
								title: stat.label,
								children: stat.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-2xl font-bold tracking-tight text-foreground mt-1.5 truncate",
								children: stat.value
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br border shrink-0 ${stat.color} shadow-xs`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4.5 w-4.5 shrink-0" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2.5 pt-2 border-t border-border/30",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted-foreground block truncate",
							title: stat.desc,
							children: stat.desc
						})
					})]
				})]
			}, i);
		})
	});
}
var REVIEW_STATUS_OPTIONS = [
	{
		value: "draft",
		label: "Draft",
		color: "text-slate-500 bg-slate-500/10 border-slate-500/20"
	},
	{
		value: "in_review",
		label: "In Review",
		color: "text-amber-500 bg-amber-500/10 border-amber-500/20"
	},
	{
		value: "approved",
		label: "Approved",
		color: "text-blue-500 bg-blue-500/10 border-blue-500/20"
	},
	{
		value: "completed",
		label: "Completed",
		color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
	}
];
var RATING_BADGES = {
	5: {
		label: "Excellent",
		color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
	},
	4: {
		label: "Good",
		color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
	},
	3: {
		label: "Average",
		color: "bg-amber-500/10 text-amber-500 border-amber-500/20"
	},
	2: {
		label: "Needs Improvement",
		color: "bg-orange-500/10 text-orange-500 border-orange-500/20"
	},
	1: {
		label: "Poor",
		color: "bg-rose-500/10 text-rose-500 border-rose-500/20"
	}
};
var PROMOTION_STATUS_OPTIONS = [
	{
		value: "not_recommended",
		label: "Not Recommended"
	},
	{
		value: "eligible",
		label: "Eligible"
	},
	{
		value: "recommended",
		label: "Recommended"
	},
	{
		value: "promoted",
		label: "Promoted"
	}
];
var DEFAULT_FILTERS = {
	department: "all",
	manager: "all",
	rating: "all",
	reviewStatus: "all",
	promotionEligible: "all",
	scoreMin: "",
	scoreMax: "",
	reviewDateFrom: "",
	reviewDateTo: ""
};
function validatePerformanceReviewForm(draft, existingReviews, isEdit) {
	const errors = {};
	if (!draft.employeeId) errors.employeeId = "Employee selection is required";
	if (!draft.managerName?.trim()) errors.managerName = "Manager name is required";
	if (draft.overallRating === void 0 || draft.overallRating < 1 || draft.overallRating > 5) errors.overallRating = "Overall rating must be between 1 and 5";
	if (draft.kpiScore === void 0 || draft.kpiScore < 0 || draft.kpiScore > 100) errors.kpiScore = "KPI score must be between 0 and 100";
	if (draft.goalProgress === void 0 || draft.goalProgress < 0 || draft.goalProgress > 100) errors.goalProgress = "Goal progress percentage must be between 0 and 100";
	if (!draft.reviewDate) errors.reviewDate = "Review date is required";
	else if (new Date(draft.reviewDate) > /* @__PURE__ */ new Date("2026-06-26")) errors.reviewDate = "Future review dates are not allowed";
	if (draft.employeeId && draft.reviewDate) {
		if (existingReviews.find((r) => r.employeeId === draft.employeeId && r.reviewDate === draft.reviewDate && (!isEdit || r.id !== draft.id))) errors.reviewDate = "A review for this employee on this date already exists";
	}
	return {
		valid: Object.keys(errors).length === 0,
		errors
	};
}
function applyFilters(reviews, query, filters) {
	const q = query.toLowerCase().trim();
	return reviews.filter((r) => {
		if (q) {
			if (!(r.employeeName.toLowerCase().includes(q) || r.employeeIdCode.toLowerCase().includes(q) || r.department.toLowerCase().includes(q) || r.managerName.toLowerCase().includes(q))) return false;
		}
		if (filters.department !== "all" && r.department !== filters.department) return false;
		if (filters.manager !== "all" && r.managerName !== filters.manager) return false;
		if (filters.reviewStatus !== "all" && r.reviewStatus !== filters.reviewStatus) return false;
		if (filters.promotionEligible !== "all") {
			const eligible = filters.promotionEligible === "true";
			if (r.promotionEligible !== eligible) return false;
		}
		if (filters.rating !== "all") {
			const rating = r.overallRating;
			if (filters.rating === "excellent" && rating !== 5) return false;
			if (filters.rating === "good" && rating !== 4) return false;
			if (filters.rating === "average" && rating !== 3) return false;
			if (filters.rating === "needs_improvement" && rating !== 2) return false;
			if (filters.rating === "poor" && rating !== 1) return false;
		}
		if (filters.scoreMin) {
			const val = parseFloat(filters.scoreMin);
			if (r.overallRating < val) return false;
		}
		if (filters.scoreMax) {
			const val = parseFloat(filters.scoreMax);
			if (r.overallRating > val) return false;
		}
		if (filters.reviewDateFrom && r.reviewDate < filters.reviewDateFrom) return false;
		if (filters.reviewDateTo && r.reviewDate > filters.reviewDateTo) return false;
		return true;
	});
}
function applySorting(reviews, field, dir) {
	return [...reviews].sort((a, b) => {
		let va;
		let vb;
		switch (field) {
			case "employeeName":
				va = a.employeeName;
				vb = b.employeeName;
				break;
			case "employeeIdCode":
				va = a.employeeIdCode;
				vb = b.employeeIdCode;
				break;
			case "department":
				va = a.department;
				vb = b.department;
				break;
			case "overallRating":
				va = a.overallRating;
				vb = b.overallRating;
				break;
			case "goalProgress":
				va = a.goalProgress;
				vb = b.goalProgress;
				break;
			case "kpiScore":
				va = a.kpiScore;
				vb = b.kpiScore;
				break;
			case "reviewStatus":
				va = a.reviewStatus;
				vb = b.reviewStatus;
				break;
			case "lastReview":
				va = a.lastReview;
				vb = b.lastReview;
				break;
			default:
				va = a.employeeName;
				vb = b.employeeName;
		}
		if (typeof va === "number" && typeof vb === "number") return dir === "asc" ? va - vb : vb - va;
		const cmp = String(va).localeCompare(String(vb));
		return dir === "asc" ? cmp : -cmp;
	});
}
function paginate(items, page, perPage) {
	return items.slice((page - 1) * perPage, page * perPage);
}
function buildCSV(reviews) {
	const headers = [
		"Employee Name",
		"Employee ID",
		"Department",
		"Designation",
		"Manager",
		"Overall Rating",
		"KPI Score",
		"Goal Completion %",
		"Status",
		"Review Date",
		"Last Review",
		"Promotion Status",
		"Increment %"
	];
	const rows = reviews.map((r) => [
		r.employeeName,
		r.employeeIdCode,
		r.department,
		r.designation,
		r.managerName,
		r.overallRating,
		r.kpiScore,
		r.goalProgress,
		r.reviewStatus,
		r.reviewDate,
		r.lastReview,
		r.promotionStatus,
		r.salaryIncrement
	].map((v) => `"${String(v ?? "").replace(/"/g, "\"\"")}"`).join(","));
	return [headers.join(","), ...rows].join("\n");
}
function fmtDate(iso) {
	if (!iso) return "—";
	const [y, m, d] = iso.split("T")[0].split("-");
	return `${[
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	][parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
}
function PerformanceTable({ reviews, selectedIds, onSelectAll, onSelectRow, onView, onEdit, onDelete, sortField, sortDir, onSort }) {
	const allSelected = (0, import_react.useMemo)(() => {
		return reviews.length > 0 && selectedIds.length === reviews.length;
	}, [reviews, selectedIds]);
	const isSomeSelected = (0, import_react.useMemo)(() => {
		return selectedIds.length > 0 && selectedIds.length < reviews.length;
	}, [reviews, selectedIds]);
	const SortHeader = ({ field, children }) => {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "ghost",
			size: "sm",
			onClick: () => onSort(field),
			className: "-ml-3 h-8 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:bg-muted/50",
			children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "ml-1.5 h-3.5 w-3.5" })]
		});
	};
	const getPromotionBadge = (status) => {
		switch (status) {
			case "promoted": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				className: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px]",
				children: "Promoted"
			});
			case "recommended": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				className: "bg-purple-500/10 text-purple-500 border border-purple-500/20 text-[10px]",
				children: "Recommended"
			});
			case "eligible": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				className: "bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[10px]",
				children: "Eligible"
			});
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground/60 text-xs",
				children: "—"
			});
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-2xl border border-border/80 bg-card/30 overflow-hidden shadow-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto max-h-[600px] overflow-y-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
					className: "bg-muted/10 border-b border-border/60 sticky top-0 bg-background/95 backdrop-blur z-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "w-[50px] pl-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
								checked: allSelected ? true : isSomeSelected ? "indeterminate" : false,
								onCheckedChange: (checked) => onSelectAll(!!checked),
								"aria-label": "Select all performance rows",
								className: "cursor-pointer"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "min-w-[200px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHeader, {
								field: "employeeName",
								children: "Employee"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHeader, {
								field: "employeeIdCode",
								children: "Employee ID"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "min-w-[150px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHeader, {
								field: "department",
								children: "Department"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
							children: "Manager"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "min-w-[110px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHeader, {
								field: "overallRating",
								children: "Rating Score"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "min-w-[130px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHeader, {
								field: "goalProgress",
								children: "Goal Progress"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "min-w-[110px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHeader, {
								field: "kpiScore",
								children: "KPI Score"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
							children: "Attendance"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "min-w-[110px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHeader, {
								field: "reviewStatus",
								children: "Status"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "min-w-[130px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHeader, {
								field: "lastReview",
								children: "Last Review"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
							children: "Next Review"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
							children: "Promotion Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "w-[80px] text-right pr-4",
							children: "Actions"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: reviews.map((r) => {
					const isSelected = selectedIds.includes(r.id);
					const initials = r.employeeName.split(" ").map((n) => n[0]).slice(0, 2).join("");
					const hue = Array.from(r.employeeName).reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
					const badgeDetails = RATING_BADGES[r.overallRating] || {
						label: "Unknown",
						color: "text-slate-500 bg-slate-500/10 border-slate-500/20"
					};
					const statusDetails = REVIEW_STATUS_OPTIONS.find((s) => s.value === r.reviewStatus) || { color: "text-slate-500 bg-slate-500/10 border-slate-500/20" };
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
						className: `group/row border-b border-border/50 transition-colors hover:bg-muted/15 cursor-pointer ${isSelected ? "bg-muted/10" : ""}`,
						onClick: () => onView(r),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "pl-4 py-3",
								onClick: (e) => e.stopPropagation(),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									checked: isSelected,
									onCheckedChange: (checked) => onSelectRow(r.id, !!checked),
									"aria-label": `Select ${r.employeeName}`,
									className: "cursor-pointer"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-3 font-medium text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold text-white shadow-inner flex-shrink-0",
										style: { background: `linear-gradient(135deg, hsl(${hue}, 60%, 55%), hsl(${(hue + 45) % 360}, 65%, 45%))` },
										children: initials
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold text-sm truncate hover:underline",
											children: r.employeeName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] text-muted-foreground truncate",
											children: r.designation
										})]
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-3 text-xs font-mono font-medium text-muted-foreground",
								children: r.employeeIdCode
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-3 text-xs font-semibold text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "h-3.5 w-3.5 text-muted-foreground/60" }), r.department]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-3 text-xs text-muted-foreground",
								children: r.managerName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-col gap-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "outline",
										className: `px-2 py-0.5 text-[10px] font-semibold border ${badgeDetails.color} justify-center w-fit`,
										children: [
											r.overallRating,
											" ★ ",
											badgeDetails.label
										]
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 max-w-[100px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
										value: r.goalProgress,
										className: "h-1.5 flex-1"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] font-bold text-foreground font-mono",
										children: [r.goalProgress, "%"]
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-3 text-xs font-semibold text-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-3.5 w-3.5 text-muted-foreground/50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [r.kpiScore, "%"] })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
								className: "py-3 text-xs text-muted-foreground font-mono font-medium",
								children: [r.attendance, "/5"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: `px-2 py-0.5 text-[10px] font-semibold border ${statusDetails.color}`,
									children: r.reviewStatus.replace("_", " ").toUpperCase()
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-3 text-xs text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5 text-muted-foreground/50" }), fmtDate(r.lastReview)]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-3 text-xs text-muted-foreground",
								children: fmtDate(r.nextReview)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-3",
								children: getPromotionBadge(r.promotionStatus)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-3 text-right pr-4",
								onClick: (e) => e.stopPropagation(),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										className: "h-8 w-8 p-0 rounded-lg hover:bg-muted/50 cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "h-4 w-4" })
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
									align: "end",
									className: "rounded-xl border-border bg-card",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
											onClick: () => onView(r),
											className: "text-xs flex items-center gap-2 cursor-pointer py-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5 text-muted-foreground" }), "View Profile"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
											onClick: () => onEdit(r),
											className: "text-xs flex items-center gap-2 cursor-pointer py-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "h-3.5 w-3.5 text-muted-foreground" }), "Edit Review"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
											onClick: () => onDelete(r),
											className: "text-xs flex items-center gap-2 cursor-pointer py-2 text-rose-500 hover:bg-rose-500/10 focus:text-rose-500",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), "Delete Review"]
										})
									]
								})] })
							})
						]
					}, r.id);
				}) })]
			})
		})
	});
}
function PerformanceFormDialog({ open, onOpenChange, review, existingReviews, onSave }) {
	const ws = useAurix();
	const isEdit = !!review;
	const [employeeId, setEmployeeId] = (0, import_react.useState)("");
	const [employeeName, setEmployeeName] = (0, import_react.useState)("");
	const [employeeIdCode, setEmployeeIdCode] = (0, import_react.useState)("");
	const [department, setDepartment] = (0, import_react.useState)("");
	const [designation, setDesignation] = (0, import_react.useState)("");
	const [managerName, setManagerName] = (0, import_react.useState)("");
	const [overallRating, setOverallRating] = (0, import_react.useState)("3");
	const [kpiScore, setKpiScore] = (0, import_react.useState)("80");
	const [productivity, setProductivity] = (0, import_react.useState)("3");
	const [attendance, setAttendance] = (0, import_react.useState)("3");
	const [communication, setCommunication] = (0, import_react.useState)("3");
	const [leadership, setLeadership] = (0, import_react.useState)("3");
	const [teamwork, setTeamwork] = (0, import_react.useState)("3");
	const [innovation, setInnovation] = (0, import_react.useState)("3");
	const [problemSolving, setProblemSolving] = (0, import_react.useState)("3");
	const [technicalSkills, setTechnicalSkills] = (0, import_react.useState)("3");
	const [discipline, setDiscipline] = (0, import_react.useState)("3");
	const [goalProgress, setGoalProgress] = (0, import_react.useState)("50");
	const [achievements, setAchievements] = (0, import_react.useState)("");
	const [challenges, setChallenges] = (0, import_react.useState)("");
	const [feedback, setFeedback] = (0, import_react.useState)("");
	const [managerComments, setManagerComments] = (0, import_react.useState)("");
	const [promotionEligible, setPromotionEligible] = (0, import_react.useState)(false);
	const [promotionStatus, setPromotionStatus] = (0, import_react.useState)("not_recommended");
	const [salaryIncrement, setSalaryIncrement] = (0, import_react.useState)("");
	const [bonusRecommendation, setBonusRecommendation] = (0, import_react.useState)("");
	const [reviewStatus, setReviewStatus] = (0, import_react.useState)("draft");
	const [reviewDate, setReviewDate] = (0, import_react.useState)("");
	const [errors, setErrors] = (0, import_react.useState)({});
	const handleEmployeeChange = (empId) => {
		setEmployeeId(empId);
		const emp = ws.employees.find((e) => e.id === empId);
		if (emp) {
			setEmployeeName(emp.fullName);
			setEmployeeIdCode(emp.employeeId || emp.id);
			setDepartment(emp.department || "Engineering");
			setDesignation(emp.designation || "Software Developer");
			setManagerName(emp.managerName || "");
		}
	};
	(0, import_react.useEffect)(() => {
		if (open) {
			setErrors({});
			if (review) {
				setEmployeeId(review.employeeId);
				setEmployeeName(review.employeeName);
				setEmployeeIdCode(review.employeeIdCode);
				setDepartment(review.department);
				setDesignation(review.designation);
				setManagerName(review.managerName);
				setOverallRating(String(review.overallRating));
				setKpiScore(String(review.kpiScore));
				setProductivity(String(review.productivity));
				setAttendance(String(review.attendance));
				setCommunication(String(review.communication));
				setLeadership(String(review.leadership));
				setTeamwork(String(review.teamwork));
				setInnovation(String(review.innovation));
				setProblemSolving(String(review.problemSolving));
				setTechnicalSkills(String(review.technicalSkills));
				setDiscipline(String(review.discipline));
				setGoalProgress(String(review.goalProgress));
				setAchievements(review.achievements);
				setChallenges(review.challenges);
				setFeedback(review.feedback);
				setManagerComments(review.managerComments);
				setPromotionEligible(review.promotionEligible);
				setPromotionStatus(review.promotionStatus);
				setSalaryIncrement(String(review.salaryIncrement));
				setBonusRecommendation(String(review.bonusRecommendation));
				setReviewStatus(review.reviewStatus);
				setReviewDate(review.reviewDate);
			} else {
				if (ws.employees.length > 0) handleEmployeeChange(ws.employees[0].id);
				else {
					setEmployeeId("");
					setEmployeeName("");
					setEmployeeIdCode("");
					setDepartment("");
					setDesignation("");
					setManagerName("");
				}
				setOverallRating("3");
				setKpiScore("80");
				setProductivity("3");
				setAttendance("4");
				setCommunication("3");
				setLeadership("3");
				setTeamwork("4");
				setInnovation("3");
				setProblemSolving("3");
				setTechnicalSkills("3");
				setDiscipline("4");
				setGoalProgress("50");
				setAchievements("");
				setChallenges("");
				setFeedback("");
				setManagerComments("");
				setPromotionEligible(false);
				setPromotionStatus("not_recommended");
				setSalaryIncrement("");
				setBonusRecommendation("");
				setReviewStatus("draft");
				setReviewDate((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
			}
		}
	}, [
		open,
		review,
		ws.employees
	]);
	const handleSubmit = (e) => {
		e.preventDefault();
		const val = validatePerformanceReviewForm({
			id: review?.id,
			employeeId,
			employeeName,
			employeeIdCode,
			department,
			designation,
			managerName,
			overallRating: parseInt(overallRating) || 3,
			kpiScore: parseInt(kpiScore) || 80,
			productivity: parseInt(productivity) || 3,
			attendance: parseInt(attendance) || 3,
			communication: parseInt(communication) || 3,
			leadership: parseInt(leadership) || 3,
			teamwork: parseInt(teamwork) || 3,
			innovation: parseInt(innovation) || 3,
			problemSolving: parseInt(problemSolving) || 3,
			technicalSkills: parseInt(technicalSkills) || 3,
			discipline: parseInt(discipline) || 3,
			goalProgress: parseInt(goalProgress) || 50,
			achievements: achievements.trim(),
			challenges: challenges.trim(),
			feedback: feedback.trim(),
			managerComments: managerComments.trim(),
			promotionEligible,
			promotionStatus: promotionEligible ? promotionStatus === "not_recommended" ? "eligible" : promotionStatus : "not_recommended",
			salaryIncrement: salaryIncrement ? parseFloat(salaryIncrement) : 0,
			bonusRecommendation: bonusRecommendation ? parseFloat(bonusRecommendation) : 0,
			reviewStatus,
			reviewDate
		}, existingReviews, isEdit);
		if (!val.valid) {
			setErrors(val.errors);
			toast.error("Please resolve validation errors in the form.");
			return;
		}
		onSave({
			id: review?.id || `rev_${Math.random().toString(36).substr(2, 9)}`,
			employeeId,
			employeeName,
			employeeIdCode,
			department,
			designation,
			managerName,
			overallRating: parseInt(overallRating),
			kpiScore: parseInt(kpiScore),
			productivity: parseInt(productivity),
			attendance: parseInt(attendance),
			communication: parseInt(communication),
			leadership: parseInt(leadership),
			teamwork: parseInt(teamwork),
			innovation: parseInt(innovation),
			problemSolving: parseInt(problemSolving),
			technicalSkills: parseInt(technicalSkills),
			discipline: parseInt(discipline),
			goalProgress: parseInt(goalProgress),
			achievements: achievements.trim(),
			challenges: challenges.trim(),
			feedback: feedback.trim(),
			managerComments: managerComments.trim(),
			promotionEligible,
			promotionStatus: promotionEligible ? promotionStatus === "not_recommended" ? "eligible" : promotionStatus : "not_recommended",
			salaryIncrement: salaryIncrement ? parseFloat(salaryIncrement) : 0,
			bonusRecommendation: bonusRecommendation ? parseFloat(bonusRecommendation) : 0,
			reviewStatus,
			reviewDate,
			lastReview: review?.lastReview || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			nextReview: review?.nextReview || new Date(Date.now() + 4320 * 60 * 60 * 1e3).toISOString().split("T")[0],
			createdAt: review?.createdAt || (/* @__PURE__ */ new Date()).toISOString()
		});
		toast.success(isEdit ? "Review Updated Successfully" : "Review Created Successfully");
		onOpenChange(false);
	};
	const scoreValues = [
		"1",
		"2",
		"3",
		"4",
		"5"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border-border bg-card p-6 backdrop-blur-xl md:max-w-4xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "text-xl font-bold",
				children: isEdit ? "✏️ Edit Performance Review" : "➕ New Performance Review"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-6 py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Employee Information"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "employee",
											className: "after:content-['*'] after:text-rose-500 after:ml-0.5",
											children: "Select Employee"
										}),
										isEdit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "employee",
											value: employeeName,
											disabled: true,
											className: "bg-muted/30 cursor-not-allowed"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: employeeId,
											onValueChange: handleEmployeeChange,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												id: "employee",
												className: errors.employeeId ? "border-rose-500" : "",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose Employee..." })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: ws.employees.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
												value: e.id,
												children: [
													e.fullName,
													" (",
													e.employeeId || e.id,
													")"
												]
											}, e.id)) })]
										}),
										errors.employeeId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-rose-500",
											children: errors.employeeId
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "department",
										children: "Department"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "department",
										value: department,
										disabled: true,
										className: "bg-muted/20 text-muted-foreground"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "designation",
										children: "Designation"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "designation",
										value: designation,
										disabled: true,
										className: "bg-muted/20 text-muted-foreground"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "manager",
											children: "Reporting Manager"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "manager",
											value: managerName,
											onChange: (e) => setManagerName(e.target.value)
										}),
										errors.managerName && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-rose-500",
											children: errors.managerName
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "reviewDate",
											className: "after:content-['*'] after:text-rose-500 after:ml-0.5",
											children: "Review Cycle Date"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "reviewDate",
											type: "date",
											value: reviewDate,
											onChange: (e) => setReviewDate(e.target.value),
											className: errors.reviewDate ? "border-rose-500" : ""
										}),
										errors.reviewDate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-rose-500",
											children: errors.reviewDate
										})
									]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-border/60" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Performance Scores & Core Metrics"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 col-span-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "overallRating",
											className: "after:content-['*'] after:text-rose-500 after:ml-0.5",
											children: "Overall Score (1-5)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: overallRating,
											onValueChange: setOverallRating,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												id: "overallRating",
												className: errors.overallRating ? "border-rose-500" : "",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "5",
													children: "5 ★ Excellent"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "4",
													children: "4 ★ Good"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "3",
													children: "3 ★ Average"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "2",
													children: "2 ★ Needs Improvement"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "1",
													children: "1 ★ Poor"
												})
											] })]
										}),
										errors.overallRating && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-rose-500",
											children: errors.overallRating
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 col-span-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "kpiScore",
											className: "after:content-['*'] after:text-rose-500 after:ml-0.5",
											children: "KPI Completion Score (0-100)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "kpiScore",
											type: "number",
											value: kpiScore,
											onChange: (e) => setKpiScore(e.target.value),
											className: errors.kpiScore ? "border-rose-500" : ""
										}),
										errors.kpiScore && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-rose-500",
											children: errors.kpiScore
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 col-span-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "goalProgress",
											className: "after:content-['*'] after:text-rose-500 after:ml-0.5",
											children: "Goal Completion Progress %"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "goalProgress",
											type: "number",
											value: goalProgress,
											onChange: (e) => setGoalProgress(e.target.value),
											className: errors.goalProgress ? "border-rose-500" : ""
										}),
										errors.goalProgress && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-rose-500",
											children: errors.goalProgress
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "prod",
										children: "Productivity"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: productivity,
										onValueChange: setProductivity,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "prod",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: scoreValues.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: v,
											children: v
										}, v)) })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "att",
										children: "Attendance"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: attendance,
										onValueChange: setAttendance,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "att",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: scoreValues.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: v,
											children: v
										}, v)) })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "comm",
										children: "Communication"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: communication,
										onValueChange: setCommunication,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "comm",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: scoreValues.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: v,
											children: v
										}, v)) })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "lead",
										children: "Leadership"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: leadership,
										onValueChange: setLeadership,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "lead",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: scoreValues.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: v,
											children: v
										}, v)) })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "team",
										children: "Teamwork"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: teamwork,
										onValueChange: setTeamwork,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "team",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: scoreValues.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: v,
											children: v
										}, v)) })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "inno",
										children: "Innovation"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: innovation,
										onValueChange: setInnovation,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "inno",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: scoreValues.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: v,
											children: v
										}, v)) })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "prob",
										children: "Prob Solving"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: problemSolving,
										onValueChange: setProblemSolving,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "prob",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: scoreValues.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: v,
											children: v
										}, v)) })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "tech",
										children: "Tech Skills"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: technicalSkills,
										onValueChange: setTechnicalSkills,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "tech",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: scoreValues.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: v,
											children: v
										}, v)) })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "disc",
										children: "Discipline"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: discipline,
										onValueChange: setDiscipline,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "disc",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: scoreValues.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: v,
											children: v
										}, v)) })]
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-border/60" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Core Achievements & Feedback"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-4 md:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "achieve",
										children: "Key Achievements"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										id: "achieve",
										value: achievements,
										onChange: (e) => setAchievements(e.target.value),
										placeholder: "Summarize the core project achievements and deliverables completed...",
										rows: 3
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "challs",
										children: "Encountered Challenges"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										id: "challs",
										value: challenges,
										onChange: (e) => setChallenges(e.target.value),
										placeholder: "Outline any roadblocks, resource dependencies, or skill gaps encountered...",
										rows: 3
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "feedb",
										children: "360° Feedback / Self Review Notes"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										id: "feedb",
										value: feedback,
										onChange: (e) => setFeedback(e.target.value),
										placeholder: "Provide brief notes summarizing peer inputs and continuous feedback indicators...",
										rows: 3
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "mComments",
										children: "Manager Comments & Next Action"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										id: "mComments",
										value: managerComments,
										onChange: (e) => setManagerComments(e.target.value),
										placeholder: "Managers notes regarding development targets, goals alignments, and promotions...",
										rows: 3
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-border/60" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Promotions & Financial Recommendations"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-4 md:grid-cols-4 items-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center space-x-2 rounded-xl border border-border/40 p-3 bg-muted/20 hover:bg-muted/40 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
										id: "promoEligible",
										checked: promotionEligible,
										onCheckedChange: (checked) => setPromotionEligible(!!checked),
										className: "cursor-pointer"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "promoEligible",
										className: "text-xs font-semibold cursor-pointer leading-tight select-none",
										children: "Promotion Eligible Candidate"
									})]
								}),
								promotionEligible && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "promoStatus",
										children: "Recommended Status"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: promotionStatus,
										onValueChange: (val) => setPromotionStatus(val),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "promoStatus",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PROMOTION_STATUS_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: opt.value,
											children: opt.label
										}, opt.value)) })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "salaryInc",
										children: "Salary Increment %"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "salaryInc",
										type: "number",
										value: salaryIncrement,
										onChange: (e) => setSalaryIncrement(e.target.value),
										placeholder: "e.g. 10 (for 10% raise)"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "bonusRecommendation",
										children: "Bonus Recommendation %"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "bonusRecommendation",
										type: "number",
										value: bonusRecommendation,
										onChange: (e) => setBonusRecommendation(e.target.value),
										placeholder: "e.g. 5 (for 5% cash bonus)"
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-border/60" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 gap-4 md:grid-cols-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "reviewStatus",
								children: "Review Status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: reviewStatus,
								onValueChange: (val) => setReviewStatus(val),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									id: "reviewStatus",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Status" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: REVIEW_STATUS_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: opt.value,
									children: opt.label
								}, opt.value)) })]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
						className: "mt-6 flex gap-2 justify-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => onOpenChange(false),
							className: "rounded-xl border-border bg-card hover:bg-muted/50",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90",
							children: "Save Review"
						})]
					})
				]
			})]
		})
	});
}
function EmployeePerformanceProfile({ open, onOpenChange, review, goals, feedbackList, rewards, courses, onAssignGoal, onCompleteGoal, onAssignTraining, onUpdateTrainingStatus, onAddReward }) {
	const mounted = useMounted();
	const [activeSubTab, setActiveSubTab] = (0, import_react.useState)("overview");
	const [goalTitle, setGoalTitle] = (0, import_react.useState)("");
	const [goalDesc, setGoalDesc] = (0, import_react.useState)("");
	const [goalPriority, setGoalPriority] = (0, import_react.useState)("medium");
	const [goalDueDate, setGoalDueDate] = (0, import_react.useState)("");
	const [isAddingGoal, setIsAddingGoal] = (0, import_react.useState)(false);
	const [courseName, setCourseName] = (0, import_react.useState)("");
	const [isAssigningTraining, setIsAssigningTraining] = (0, import_react.useState)(false);
	const [rewardName, setRewardName] = (0, import_react.useState)("");
	const [rewardType, setRewardType] = (0, import_react.useState)("award");
	const [rewardValue, setRewardValue] = (0, import_react.useState)("");
	const [isAddingReward, setIsAddingReward] = (0, import_react.useState)(false);
	const strengths = (0, import_react.useMemo)(() => {
		if (!review) return ["General Work Ethic"];
		const list = [];
		if (review.productivity >= 4) list.push("Productivity");
		if (review.teamwork >= 4) list.push("Team Collaboration");
		if (review.innovation >= 4) list.push("Creative Innovation");
		if (review.problemSolving >= 4) list.push("Logical Problem Solving");
		if (review.technicalSkills >= 4) list.push("Technical Knowledge");
		if (review.discipline >= 4) list.push("Professional Discipline");
		if (review.communication >= 4) list.push("Clear Communications");
		if (list.length === 0) list.push("General Work Ethic");
		return list;
	}, [review]);
	const weaknesses = (0, import_react.useMemo)(() => {
		if (!review) return ["None Identified"];
		const list = [];
		if (review.productivity <= 2) list.push("Work Productivity Velocity");
		if (review.teamwork <= 2) list.push("Inter-team Collaboration");
		if (review.innovation <= 2) list.push("Independent Idea Sourcing");
		if (review.problemSolving <= 2) list.push("Structured Problem Analysis");
		if (review.technicalSkills <= 2) list.push("Specific Technical Training");
		if (review.discipline <= 2) list.push("Timely Attendance & Discipline");
		if (review.communication <= 2) list.push("Proactive Communications");
		if (list.length === 0) list.push("None Identified");
		return list;
	}, [review]);
	if (!review) return null;
	const employeeId = review.employeeId;
	const employeeGoals = goals.filter((g) => g.employeeId === employeeId);
	const employeeFeedback = feedbackList.filter((f) => f.employeeId === employeeId);
	const employeeRewards = rewards.filter((r) => r.employeeId === employeeId);
	const employeeCourses = courses.filter((c) => c.employeeId === employeeId);
	const initials = review.employeeName.split(" ").map((n) => n[0]).slice(0, 2).join("");
	const hue = Array.from(review.employeeName).reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
	const radarData = [
		{
			subject: "Productivity",
			value: review.productivity * 20
		},
		{
			subject: "Teamwork",
			value: review.teamwork * 20
		},
		{
			subject: "Innovation",
			value: review.innovation * 20
		},
		{
			subject: "Problem Solving",
			value: review.problemSolving * 20
		},
		{
			subject: "Technical Skills",
			value: review.technicalSkills * 20
		},
		{
			subject: "Discipline",
			value: review.discipline * 20
		}
	];
	const handleAssignGoalSubmit = (e) => {
		e.preventDefault();
		if (!goalTitle.trim() || !goalDueDate) {
			toast.error("Goal Title and Due Date are required");
			return;
		}
		onAssignGoal(employeeId, goalTitle.trim(), goalDesc.trim(), goalPriority, goalDueDate);
		toast.success("OKR Target Goal Assigned Successfully");
		setGoalTitle("");
		setGoalDesc("");
		setGoalPriority("medium");
		setGoalDueDate("");
		setIsAddingGoal(false);
	};
	const handleAssignTrainingSubmit = (e) => {
		e.preventDefault();
		if (!courseName.trim()) {
			toast.error("Course Name is required");
			return;
		}
		onAssignTraining(employeeId, courseName.trim());
		toast.success("Training Course Recommended Successfully");
		setCourseName("");
		setIsAssigningTraining(false);
	};
	const handleAddRewardSubmit = (e) => {
		e.preventDefault();
		if (!rewardName.trim()) {
			toast.error("Reward Award Name is required");
			return;
		}
		onAddReward({
			id: `r_${Math.random().toString(36).substr(2, 9)}`,
			employeeId,
			awardName: rewardName.trim(),
			type: rewardType,
			value: rewardValue.trim(),
			date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
		});
		toast.success("Corporate Recognition Reward Logged Successfully");
		setRewardName("");
		setRewardValue("");
		setRewardType("award");
		setIsAddingReward(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			className: "w-full sm:max-w-md md:max-w-xl border-l border-border bg-card/95 backdrop-blur-xl p-0 shadow-2xl flex flex-col h-full z-45",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, {
					className: "p-6 border-b border-border/60",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-14 w-14 items-center justify-center rounded-2xl font-bold text-white shadow-inner text-lg flex-shrink-0",
							style: { background: `linear-gradient(135deg, hsl(${hue}, 60%, 55%), hsl(${(hue + 45) % 360}, 65%, 45%))` },
							children: initials
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
									className: "text-lg font-bold truncate text-foreground flex items-center gap-2",
									children: review.employeeName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground truncate",
									children: [
										review.designation,
										" • ",
										review.department
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2 mt-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										className: "px-2 py-0.5 text-xs font-semibold",
										children: review.employeeIdCode
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "outline",
										className: "px-2 py-0.5 text-xs font-medium text-brand bg-brand/5 border-brand/20",
										children: ["Manager: ", review.managerName]
									})]
								})
							]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-b border-border/60 px-6 bg-muted/10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, {
						className: "bg-transparent h-9 p-0 flex justify-between gap-1 w-full overflow-x-auto select-none",
						children: [
							"overview",
							"goals",
							"feedback",
							"development",
							"rewards"
						].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActiveSubTab(tab),
							className: `py-2 text-xs font-semibold border-b-2 cursor-pointer transition-all duration-200 capitalize flex-1 text-center truncate ${activeSubTab === tab ? "border-brand text-brand" : "border-transparent text-muted-foreground hover:text-foreground"}`,
							children: tab === "development" ? "L&D / Training" : tab
						}, tab))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
					className: "flex-1 p-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 pb-6",
						children: [
							activeSubTab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-border/60 bg-card/40 p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
											className: "text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLine, { className: "h-4 w-4 text-brand" }), " Competency Profile (%)"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-[200px] w-full",
											children: mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
												width: "100%",
												height: "100%",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadarChart, {
													cx: "50%",
													cy: "50%",
													outerRadius: "70%",
													data: radarData,
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolarGrid, { stroke: "#e2e8f0" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolarAngleAxis, {
															dataKey: "subject",
															stroke: "#888888",
															fontSize: 9
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolarRadiusAxis, {
															angle: 30,
															domain: [0, 100],
															fontSize: 8
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radar, {
															name: "Employee",
															dataKey: "value",
															stroke: "#3b82f6",
															fill: "#3b82f6",
															fillOpacity: .25
														})
													]
												})
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full bg-muted/10 rounded-2xl animate-pulse" })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-2xl border border-border/60 bg-card p-4 flex flex-col justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-4 w-4 text-brand" }), " Overall Score"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-2xl font-black text-foreground",
												children: [review.overallRating, " / 5"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-muted-foreground mt-0.5",
												children: "Rating criteria benchmarked"
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-2xl border border-border/60 bg-card p-4 flex flex-col justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4 text-amber-500" }), " KPI Index"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-2xl font-black text-foreground",
												children: [review.kpiScore, "%"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-muted-foreground mt-0.5",
												children: "Project deliveries quota"
											})] })]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 md:grid-cols-2 gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-2xl border border-emerald-500/25 bg-emerald-500/5 p-4 space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
												className: "text-[10px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), " Strengths"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
												className: "text-xs text-foreground/80 list-disc pl-4 space-y-0.5",
												children: strengths.map((str, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: str }, idx))
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-2xl border border-orange-500/25 bg-orange-500/5 p-4 space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
												className: "text-[10px] font-bold uppercase tracking-wider text-orange-600 flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5" }), " Growth Gaps"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
												className: "text-xs text-foreground/80 list-disc pl-4 space-y-0.5",
												children: weaknesses.map((weak, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: weak }, idx))
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
											className: "text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4" }), " Assessment Summary"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-border bg-muted/10 p-4 space-y-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[10px] uppercase font-bold text-muted-foreground",
													children: "Achievements logged"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-foreground mt-0.5 leading-relaxed",
													children: review.achievements || "No notes logged."
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-border/60" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[10px] uppercase font-bold text-muted-foreground",
													children: "Manager continuous feedback"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-foreground mt-0.5 leading-relaxed",
													children: review.feedback || "No notes logged."
												})] })
											]
										})]
									})
								]
							}),
							activeSubTab === "goals" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
											className: "text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-4 w-4" }),
												" Core Goals OKRs (",
												employeeGoals.length,
												")"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											onClick: () => setIsAddingGoal(!isAddingGoal),
											className: "h-8 text-xs rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90 cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5 mr-1" }), "Assign OKR"]
										})]
									}),
									isAddingGoal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										onSubmit: handleAssignGoalSubmit,
										className: "rounded-xl border border-border bg-muted/10 p-4 space-y-3 animate-in slide-in-from-top-1 duration-200",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-bold text-foreground",
												children: "Assign New Target Objective"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "gTitle",
													className: "text-[10px] uppercase font-bold",
													children: "Goal Title"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "gTitle",
													value: goalTitle,
													onChange: (e) => setGoalTitle(e.target.value),
													placeholder: "e.g. Optimize server loads",
													className: "h-8 text-xs bg-background"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "gDesc",
													className: "text-[10px] uppercase font-bold",
													children: "Objective Description"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "gDesc",
													value: goalDesc,
													onChange: (e) => setGoalDesc(e.target.value),
													placeholder: "e.g. Code split frontend routes...",
													className: "h-8 text-xs bg-background"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-2 gap-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														className: "text-[10px] uppercase font-bold",
														children: "Priority"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
														value: goalPriority,
														onValueChange: (val) => setGoalPriority(val),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
															className: "h-8 text-xs bg-background",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "low",
																children: "Low"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "medium",
																children: "Medium"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "high",
																children: "High"
															})
														] })]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														htmlFor: "gDue",
														className: "text-[10px] uppercase font-bold",
														children: "Due Date"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "gDue",
														type: "date",
														value: goalDueDate,
														onChange: (e) => setGoalDueDate(e.target.value),
														className: "h-8 text-xs bg-background px-2"
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex gap-2 justify-end pt-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													type: "button",
													variant: "ghost",
													size: "sm",
													onClick: () => setIsAddingGoal(false),
													className: "h-7 text-[11px] rounded-lg",
													children: "Cancel"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													type: "submit",
													size: "sm",
													className: "h-7 text-[11px] rounded-lg bg-brand text-brand-foreground shadow-glow",
													children: "Assign Goal"
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-3",
										children: employeeGoals.length > 0 ? employeeGoals.map((goal) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-4 rounded-xl border border-border bg-card shadow-sm space-y-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-start justify-between gap-4",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "min-w-0",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-xs font-bold text-foreground truncate",
															children: goal.title
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "text-[10px] text-muted-foreground mt-0.5",
															children: goal.description
														})]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex flex-wrap gap-1 items-center flex-shrink-0",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
															variant: "outline",
															className: "text-[9px] uppercase tracking-wider px-1.5 py-0 font-bold border-border/80",
															children: [goal.priority, " Priority"]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
															variant: "secondary",
															className: "text-[9px] uppercase tracking-wider px-1.5 py-0 font-semibold bg-muted text-foreground",
															children: goal.status.replace("_", " ")
														})]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
														value: goal.progress,
														className: "h-1.5 flex-1"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-[10px] font-bold text-foreground font-mono",
														children: [goal.progress, "%"]
													})]
												}),
												goal.status !== "completed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex gap-2 justify-end",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														variant: "outline",
														size: "sm",
														onClick: () => {
															onCompleteGoal(goal.id);
															toast.success("OKR Target objective completed!");
														},
														className: "h-6 text-[10px] rounded-md border-border bg-card hover:bg-muted text-foreground gap-1 font-semibold cursor-pointer",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3 text-emerald-500" }), "Mark Complete"]
													})
												})
											]
										}, goal.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground italic text-center py-8 border border-dashed border-border rounded-xl",
											children: "No target goals configured for this employee."
										})
									})
								]
							}),
							activeSubTab === "feedback" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
									className: "text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }),
										" 360° Peer & Manager reviews (",
										employeeFeedback.length,
										")"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-4",
									children: employeeFeedback.length > 0 ? employeeFeedback.map((fb) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-4 rounded-xl border border-border bg-card/50 space-y-2.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "grid h-6 w-6 place-items-center rounded-full bg-brand text-[9px] text-brand-foreground font-bold font-mono",
													children: fb.reviewerName.split(" ").map((n) => n[0]).slice(0, 2).join("")
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs font-bold text-foreground",
													children: fb.reviewerName
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[9px] text-muted-foreground font-semibold uppercase",
													children: fb.role
												})] })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
												variant: "outline",
												className: "text-[10px] font-bold border-brand/20 text-brand bg-brand/5",
												children: [fb.rating, " ★ Rating"]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-foreground/80 leading-relaxed italic",
											children: [
												"\"",
												fb.feedbackText,
												"\""
											]
										})]
									}, fb.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground italic text-center py-8 border border-dashed border-border rounded-xl",
										children: "No peer feedback collected recently."
									})
								})]
							}),
							activeSubTab === "development" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
											className: "text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-4 w-4" }),
												" Recommended Training & Courses (",
												employeeCourses.length,
												")"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											onClick: () => setIsAssigningTraining(!isAssigningTraining),
											className: "h-8 text-xs rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90 cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5 mr-1" }), "Recommend Course"]
										})]
									}),
									isAssigningTraining && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										onSubmit: handleAssignTrainingSubmit,
										className: "rounded-xl border border-border bg-muted/10 p-4 space-y-3 animate-in slide-in-from-top-1 duration-200",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-bold text-foreground",
												children: "Recommend L&D Course"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "cName",
													className: "text-[10px] uppercase font-bold",
													children: "Course Title"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "cName",
													value: courseName,
													onChange: (e) => setCourseName(e.target.value),
													placeholder: "e.g. React Server Components Design",
													className: "h-8 text-xs bg-background"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex gap-2 justify-end pt-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													type: "button",
													variant: "ghost",
													size: "sm",
													onClick: () => setIsAssigningTraining(false),
													className: "h-7 text-[11px] rounded-lg",
													children: "Cancel"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													type: "submit",
													size: "sm",
													className: "h-7 text-[11px] rounded-lg bg-brand text-brand-foreground shadow-glow",
													children: "Recommend"
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-2.5",
										children: employeeCourses.length > 0 ? employeeCourses.map((course) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between p-3 rounded-xl border border-border/50 bg-card hover:bg-muted/10",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs font-bold text-foreground truncate",
													children: course.courseName
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[9px] text-muted-foreground mt-0.5",
													children: [
														"Assigned on ",
														fmtDate(course.assignedDate),
														course.completionDate && ` • Completed ${fmtDate(course.completionDate)}`
													]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex items-center gap-2 flex-shrink-0",
												children: course.status !== "completed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "text-[9px] uppercase tracking-wider bg-amber-500/5 text-amber-500 border-amber-500/10",
													children: "Pending"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													onClick: () => {
														onUpdateTrainingStatus(course.id, "completed");
														toast.success("Course completion logged!");
													},
													className: "h-6 text-[9px] rounded-md bg-emerald-500 text-white hover:bg-emerald-600 px-2 cursor-pointer font-semibold",
													children: "Mark Done"
												})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "text-[9px] uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-bold",
													children: "✓ Completed"
												})
											})]
										}, course.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground italic text-center py-8 border border-dashed border-border rounded-xl",
											children: "No training courses recommended yet."
										})
									})
								]
							}),
							activeSubTab === "rewards" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
											className: "text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-4 w-4" }),
												" Recognition, Awards & Bonuses (",
												employeeRewards.length,
												")"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											onClick: () => setIsAddingReward(!isAddingReward),
											className: "h-8 text-xs rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90 cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5 mr-1" }), "Log Recognition"]
										})]
									}),
									isAddingReward && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										onSubmit: handleAddRewardSubmit,
										className: "rounded-xl border border-border bg-muted/10 p-4 space-y-3 animate-in slide-in-from-top-1 duration-200",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-bold text-foreground",
												children: "Log Reward & Award"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "rName",
													className: "text-[10px] uppercase font-bold",
													children: "Award Title"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "rName",
													value: rewardName,
													onChange: (e) => setRewardName(e.target.value),
													placeholder: "e.g. Employee of the Quarter",
													className: "h-8 text-xs bg-background"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-2 gap-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														className: "text-[10px] uppercase font-bold",
														children: "Award Type"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
														value: rewardType,
														onValueChange: (val) => setRewardType(val),
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
															className: "h-8 text-xs bg-background",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "employee_of_month",
																children: "Employee of the Month"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "award",
																children: "Special Award"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "achievement",
																children: "Corporate Achievement"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
																value: "certificate",
																children: "Certification Value"
															})
														] })]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														htmlFor: "rValue",
														className: "text-[10px] uppercase font-bold",
														children: "Incentive / Value"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "rValue",
														value: rewardValue,
														onChange: (e) => setRewardValue(e.target.value),
														placeholder: "e.g. $1,000 Bonus",
														className: "h-8 text-xs bg-background"
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex gap-2 justify-end pt-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													type: "button",
													variant: "ghost",
													size: "sm",
													onClick: () => setIsAddingReward(false),
													className: "h-7 text-[11px] rounded-lg",
													children: "Cancel"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													type: "submit",
													size: "sm",
													className: "h-7 text-[11px] rounded-lg bg-brand text-brand-foreground shadow-glow",
													children: "Log Reward"
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-2.5",
										children: employeeRewards.length > 0 ? employeeRewards.map((reward) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between p-3 rounded-xl border border-border bg-card shadow-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2.5 min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "h-8 w-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center flex-shrink-0",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4 w-4" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs font-bold text-foreground truncate",
														children: reward.awardName
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[9px] text-muted-foreground uppercase font-semibold",
														children: reward.type.replace(/_/g, " ")
													})]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-right flex-shrink-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs font-bold text-brand font-mono",
													children: reward.value || "Citation"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[9px] text-muted-foreground",
													children: fmtDate(reward.date)
												})]
											})]
										}, reward.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground italic text-center py-8 border border-dashed border-border rounded-xl",
											children: "No corporate recognitions awarded yet."
										})
									})
								]
							})
						]
					})
				})
			]
		})
	});
}
function AIInsightsPanel({ reviews, goals }) {
	const insights = (0, import_react.useMemo)(() => {
		if (reviews.length === 0) return null;
		const topPerformer = [...reviews].sort((a, b) => {
			if (b.overallRating !== a.overallRating) return b.overallRating - a.overallRating;
			return b.kpiScore - a.kpiScore;
		})[0];
		const atRisk = reviews.filter((r) => {
			const g = goals.filter((gl) => gl.employeeId === r.employeeId);
			const avgGoalProgress = g.length > 0 ? g.reduce((acc, gl) => acc + gl.progress, 0) / g.length : r.goalProgress;
			return r.overallRating <= 2.5 || avgGoalProgress < 40;
		});
		const promotions = reviews.filter((r) => r.promotionEligible && r.overallRating >= 4);
		const trainingSuggestions = reviews.map((r) => {
			const gaps = [];
			if (r.technicalSkills <= 3) gaps.push("Technical Skills");
			if (r.communication <= 3) gaps.push("Communication Skillsets");
			if (r.leadership <= 3) gaps.push("Systems Leadership");
			if (r.productivity <= 3) gaps.push("Task Productivity Velocity");
			if (r.teamwork <= 3) gaps.push("Cross-functional Teamwork");
			if (gaps.length > 0) {
				const course = gaps[0] === "Technical Skills" ? "Advanced React & Scale Architectures" : gaps[0] === "Communication Skillsets" ? "Corporate Communications & Conflict Sync" : gaps[0] === "Systems Leadership" ? "Executive Presence & Team Management" : "Agile Scopes & Velocity Frameworks";
				return {
					name: r.employeeName,
					course,
					gap: gaps[0]
				};
			}
			return null;
		}).filter((x) => x !== null);
		const deptGroups = {};
		reviews.forEach((r) => {
			if (!deptGroups[r.department]) deptGroups[r.department] = {
				total: 0,
				count: 0
			};
			deptGroups[r.department].total += r.overallRating;
			deptGroups[r.department].count += 1;
		});
		return {
			topPerformer,
			atRisk,
			promotions,
			trainingSuggestions,
			deptSummary: Object.entries(deptGroups).map(([name, val]) => ({
				name,
				avgRating: (val.total / val.count).toFixed(1)
			})),
			attritionRisk: reviews.filter((r) => {
				const delayedGoals = goals.filter((g) => g.employeeId === r.employeeId && g.status === "delayed").length;
				return r.overallRating <= 3 && delayedGoals > 0;
			})
		};
	}, [reviews, goals]);
	if (!insights) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border/80 bg-card/40 p-5 shadow-sm space-y-4 backdrop-blur-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-7 w-7 rounded-lg bg-brand/10 text-brand flex items-center justify-center flex-shrink-0 animate-pulse",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-semibold text-foreground flex items-center gap-1.5",
				children: "AI Talent Performance Insights"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Continuous machine learning analytics of company OKRs & rating indices."
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "rounded-xl border border-border bg-card/30 hover:border-brand/40 transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "p-4 pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-4 w-4 text-amber-500" }), " Performer of the Month"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "p-4 pt-0",
						children: insights.topPerformer ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 pt-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-bold text-foreground",
									children: insights.topPerformer.employeeName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[10px] text-muted-foreground",
									children: [
										insights.topPerformer.designation,
										" • ",
										insights.topPerformer.department
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-1.5 mt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "outline",
										className: "text-[9px] font-bold border-emerald-500/25 bg-emerald-500/5 text-emerald-500",
										children: [insights.topPerformer.overallRating, " ★ Rating"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "outline",
										className: "text-[9px] font-bold border-brand/25 bg-brand/5 text-brand",
										children: [insights.topPerformer.kpiScore, "% KPIs"]
									})]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground italic",
							children: "No evaluations completed"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "rounded-xl border border-border bg-card/30",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "p-4 pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-4 w-4 text-emerald-500" }), " Promotion Candidates"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "p-4 pt-0",
						children: insights.promotions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2 pt-2",
							children: insights.promotions.slice(0, 2).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground truncate max-w-[130px]",
									children: p.employeeName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "secondary",
									className: "text-[9px] font-bold bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 border-none",
									children: [
										"+",
										p.salaryIncrement,
										"% raise recommended"
									]
								})]
							}, p.id))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground italic pt-2 block",
							children: "No promotion candidates flagged"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "rounded-xl border border-border bg-card/30",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "p-4 pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GraduationCap, { className: "h-4 w-4 text-blue-500" }), " Recommended Training Gaps"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "p-4 pt-0",
						children: insights.trainingSuggestions.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2 pt-2",
							children: insights.trainingSuggestions.slice(0, 2).map((t, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold text-foreground truncate",
									children: t.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[9px] text-muted-foreground truncate",
									children: [
										"Suggest: ",
										t.course,
										" (",
										t.gap,
										")"
									]
								})]
							}, idx))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground italic pt-2 block",
							children: "No skill gaps identified recently"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "rounded-xl border border-border bg-card/30",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "p-4 pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-4 w-4 text-rose-500" }), " Attrition Risk Alerts"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "p-4 pt-0",
						children: insights.attritionRisk.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2 pt-2",
							children: insights.attritionRisk.slice(0, 2).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground truncate max-w-[120px]",
									children: a.employeeName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-[9px] font-bold bg-rose-500/10 text-rose-500 border-none",
									children: "High attrition risk"
								})]
							}, a.id))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground italic pt-2 block",
							children: "No attrition flags triggered"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "rounded-xl border border-border bg-card/30",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "p-4 pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-orange-500" }), " Attention Needed"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "p-4 pt-0",
						children: insights.atRisk.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2 pt-2",
							children: insights.atRisk.slice(0, 2).map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground truncate max-w-[130px]",
									children: r.employeeName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: "text-[9px] font-bold bg-orange-500/10 text-orange-500 border-none",
									children: [
										"Rating ",
										r.overallRating,
										" ★"
									]
								})]
							}, r.id))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground italic pt-2 block",
							children: "All employees meeting indices baseline"
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "rounded-xl border border-border bg-card/30",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
						className: "p-4 pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
							className: "text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "h-4 w-4 text-purple-500" }), " Dept Ratings Summary"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
						className: "p-4 pt-0",
						children: insights.deptSummary.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-2 pt-2",
							children: insights.deptSummary.slice(0, 4).map((d, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs flex items-center justify-between border border-border/40 p-1.5 rounded-lg bg-muted/10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-muted-foreground truncate max-w-[70px]",
									children: d.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-bold text-foreground font-mono",
									children: [d.avgRating, "★"]
								})]
							}, idx))
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground italic pt-2 block",
							children: "No summaries generated"
						})
					})]
				})
			]
		})]
	});
}
function PerformanceCharts({ reviews, goals }) {
	const mounted = useMounted();
	const departmentAverages = import_react.useMemo(() => {
		const map = {};
		reviews.forEach((r) => {
			if (!map[r.department]) map[r.department] = {
				total: 0,
				count: 0
			};
			map[r.department].total += r.overallRating;
			map[r.department].count += 1;
		});
		return Object.entries(map).map(([name, val]) => ({
			name,
			rating: parseFloat((val.total / val.count).toFixed(1))
		}));
	}, [reviews]);
	const goalsDistribution = import_react.useMemo(() => {
		const counts = {
			not_started: 0,
			in_progress: 0,
			completed: 0,
			delayed: 0
		};
		goals.forEach((g) => {
			if (counts[g.status] !== void 0) counts[g.status] += 1;
		});
		return [
			{
				name: "Not Started",
				value: counts.not_started,
				fill: "#64748b"
			},
			{
				name: "In Progress",
				value: counts.in_progress,
				fill: "#3b82f6"
			},
			{
				name: "Completed",
				value: counts.completed,
				fill: "#10b981"
			},
			{
				name: "Delayed",
				value: counts.delayed,
				fill: "#ec4899"
			}
		];
	}, [goals]);
	const attendanceVsPerf = import_react.useMemo(() => {
		return reviews.map((r) => ({
			name: r.employeeName,
			performance: r.overallRating * 20,
			attendance: r.attendance * 20
		}));
	}, [reviews]);
	const employeeRankings = import_react.useMemo(() => {
		return [...reviews].sort((a, b) => b.kpiScore - a.kpiScore).slice(0, 6).map((r) => ({
			name: r.employeeName,
			kpi: r.kpiScore,
			rating: r.overallRating * 20
		}));
	}, [reviews]);
	const promotionAnalytics = import_react.useMemo(() => {
		const eligibleCount = reviews.filter((r) => r.promotionEligible).length;
		const remainingCount = reviews.length - eligibleCount;
		return [{
			name: "Promotion Candidates",
			value: eligibleCount,
			fill: "#8b5cf6"
		}, {
			name: "Regular Pipeline",
			value: remainingCount,
			fill: "#cbd5e1"
		}];
	}, [reviews]);
	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-border bg-card/90 p-3 shadow-lg text-xs leading-none backdrop-blur-md",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-bold mb-2 text-foreground",
				children: label || payload[0].payload.name
			}), payload.map((p, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1",
				style: { color: p.color || p.fill },
				children: [
					p.name,
					": ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-semibold text-foreground",
						children: [p.value.toLocaleString(), "%"]
					})
				]
			}, idx))]
		});
		return null;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 gap-6 md:grid-cols-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "p-4 pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-sm font-semibold text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-4 w-4 text-brand" }), " Average Performance Ratings by Department"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "h-[280px]",
					children: mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: departmentAverages,
							margin: {
								top: 10,
								right: 10,
								left: -10,
								bottom: 5
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									className: "stroke-border/40",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "name",
									stroke: "#888888",
									fontSize: 10,
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									stroke: "#888888",
									fontSize: 10,
									tickLine: false,
									axisLine: false,
									domain: [0, 5]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomTooltip, {}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "rating",
									fill: "#3b82f6",
									radius: [
										6,
										6,
										0,
										0
									],
									name: "Avg Rating Score"
								})
							]
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full bg-muted/10 rounded-2xl animate-pulse" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "p-4 pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-sm font-semibold text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trophy, { className: "h-4 w-4 text-amber-500" }), " Employee Performance Rankings (KPIs Index)"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "h-[280px]",
					children: mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: employeeRankings,
							layout: "vertical",
							margin: {
								top: 10,
								right: 10,
								left: 30,
								bottom: 5
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									className: "stroke-border/40",
									horizontal: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									type: "number",
									stroke: "#888888",
									fontSize: 10,
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									dataKey: "name",
									type: "category",
									stroke: "#888888",
									fontSize: 10,
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomTooltip, {}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "kpi",
									fill: "#10b981",
									radius: [
										0,
										4,
										4,
										0
									],
									name: "KPI Completion"
								})
							]
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full bg-muted/10 rounded-2xl animate-pulse" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "p-4 pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-sm font-semibold text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartPie, { className: "h-4 w-4 text-purple-500" }), " OKR Target Goals Status Share"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "h-[280px]",
					children: mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: goalsDistribution,
								cx: "50%",
								cy: "45%",
								innerRadius: 60,
								outerRadius: 85,
								paddingAngle: 4,
								dataKey: "value",
								children: goalsDistribution.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: entry.fill }, `cell-${index}`))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
								verticalAlign: "bottom",
								height: 36,
								iconType: "circle",
								wrapperStyle: { fontSize: "10px" }
							})
						] })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full bg-muted/10 rounded-2xl animate-pulse" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "p-4 pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-sm font-semibold text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLine, { className: "h-4 w-4 text-rose-500" }), " Attendance vs overall Ratings Trends"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "h-[280px]",
					children: mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
							data: attendanceVsPerf,
							margin: {
								top: 10,
								right: 15,
								left: -15,
								bottom: 5
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									className: "stroke-border/40",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "name",
									stroke: "#888888",
									fontSize: 9,
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									stroke: "#888888",
									fontSize: 10,
									tickLine: false,
									axisLine: false,
									domain: [0, 100]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomTooltip, {}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: "10px" } }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "performance",
									stroke: "#ec4899",
									strokeWidth: 2.5,
									name: "Overall Rating Index"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "attendance",
									stroke: "#10b981",
									strokeWidth: 2.5,
									name: "Attendance Index"
								})
							]
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full bg-muted/10 rounded-2xl animate-pulse" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "rounded-2xl border border-border/60 bg-card/40 shadow-sm backdrop-blur-xl md:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "p-4 pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-sm font-semibold text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4 text-teal-500" }), " Promotion Eligibility Pool Share"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "h-[250px] flex items-center justify-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-1/2 h-full",
						children: mounted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: promotionAnalytics,
								cx: "50%",
								cy: "50%",
								innerRadius: 50,
								outerRadius: 75,
								dataKey: "value",
								children: promotionAnalytics.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: entry.fill }, `cell-${index}`))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {})] })
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full w-full bg-muted/10 rounded-2xl animate-pulse" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-1/2 space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3.5 w-3.5 rounded-full bg-purple-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Recommended Promotion Candidates (",
									reviews.filter((r) => r.promotionEligible).length,
									")"
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-xs font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3.5 w-3.5 rounded-full bg-slate-300" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Regular Review Pipeline (",
									reviews.length - reviews.filter((r) => r.promotionEligible).length,
									")"
								] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground",
								children: "Based on rating scores >= 4.0 ★ and positive manager comments flags."
							})
						]
					})]
				})]
			})
		]
	});
}
function ImportDialog({ open, onOpenChange, existingReviews, onImport }) {
	const ws = useAurix();
	const [file, setFile] = (0, import_react.useState)(null);
	const [parsedRows, setParsedRows] = (0, import_react.useState)([]);
	const [hasErrors, setHasErrors] = (0, import_react.useState)(false);
	const fileInputRef = (0, import_react.useRef)(null);
	const resetState = () => {
		setFile(null);
		setParsedRows([]);
		setHasErrors(false);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};
	const handleDragOver = (e) => {
		e.preventDefault();
	};
	const handleDrop = (e) => {
		e.preventDefault();
		const droppedFile = e.dataTransfer.files[0];
		if (droppedFile && droppedFile.name.endsWith(".csv")) processFile(droppedFile);
		else toast.error("Please upload a CSV template file");
	};
	const handleFileChange = (e) => {
		const selectedFile = e.target.files?.[0];
		if (selectedFile) processFile(selectedFile);
	};
	const parseCSVLine = (text) => {
		const result = [];
		let insideQuote = false;
		let entry = "";
		for (let i = 0; i < text.length; i++) {
			const char = text[i];
			if (char === "\"") insideQuote = !insideQuote;
			else if (char === "," && !insideQuote) {
				result.push(entry.trim());
				entry = "";
			} else entry += char;
		}
		result.push(entry.trim());
		return result;
	};
	const processFile = (file) => {
		setFile(file);
		const reader = new FileReader();
		reader.onload = (e) => {
			const text = e.target?.result;
			if (!text) {
				toast.error("Empty file or unreadable contents");
				return;
			}
			const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
			if (lines.length <= 1) {
				toast.error("File must include a header row and at least one data row");
				return;
			}
			const headers = parseCSVLine(lines[0]).map((h) => h.replace(/^"|"$/g, "").toLowerCase().trim());
			const fieldMap = {
				"employee id": "employeeIdCode",
				"employeeid": "employeeIdCode",
				"employee name": "employeeName",
				"employeename": "employeeName",
				"department": "department",
				"designation": "designation",
				"manager": "managerName",
				"manager name": "managerName",
				"overall rating": "overallRating",
				"overallrating": "overallRating",
				"rating": "overallRating",
				"kpi score": "kpiScore",
				"kpiscore": "kpiScore",
				"goal completion": "goalProgress",
				"goal completion %": "goalProgress",
				"goalprogress": "goalProgress",
				"status": "reviewStatus",
				"review status": "reviewStatus",
				"review date": "reviewDate",
				"reviewdate": "reviewDate"
			};
			const rows = [];
			let globalError = false;
			for (let i = 1; i < lines.length; i++) {
				const values = parseCSVLine(lines[i]).map((v) => v.replace(/^"|"$/g, "").trim());
				const raw = {};
				const draft = {};
				headers.forEach((h, idx) => {
					const val = values[idx] || "";
					raw[h] = val;
					const key = fieldMap[h];
					if (key) if (key === "overallRating") draft.overallRating = val ? parseInt(val) : 3;
					else if (key === "kpiScore") draft.kpiScore = val ? parseInt(val) : 80;
					else if (key === "goalProgress") draft.goalProgress = val ? parseInt(val) : 50;
					else draft[key] = val;
				});
				const rowErrors = [];
				const rowWarnings = [];
				if (!draft.employeeName) rowErrors.push("Employee Name is required");
				if (!draft.employeeIdCode) rowErrors.push("Employee ID code is required");
				if (!draft.managerName) rowErrors.push("Manager name is required");
				if (draft.overallRating !== void 0 && (draft.overallRating < 1 || draft.overallRating > 5)) rowErrors.push("Rating must be between 1 and 5");
				if (draft.reviewDate) {
					if (new Date(draft.reviewDate) > /* @__PURE__ */ new Date("2026-06-26")) rowErrors.push("Future review dates are not allowed");
				} else draft.reviewDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
				if (draft.employeeIdCode && draft.reviewDate) {
					const dupLocal = rows.find((r) => r.data.employeeIdCode === draft.employeeIdCode && r.data.reviewDate === draft.reviewDate);
					const dupDb = existingReviews.find((r) => r.employeeIdCode === draft.employeeIdCode && r.reviewDate === draft.reviewDate);
					if (dupLocal || dupDb) rowErrors.push(`Duplicate Review: ${draft.employeeIdCode} has a review on ${draft.reviewDate}`);
				}
				if (rowErrors.length > 0) globalError = true;
				rows.push({
					rowNum: i + 1,
					data: draft,
					errors: rowErrors,
					warnings: rowWarnings,
					raw
				});
			}
			setParsedRows(rows);
			setHasErrors(globalError);
			if (globalError) toast.warning("Validation errors found in spreadsheet. Clean columns before importing.");
			else toast.success(`Validated ${rows.length} rows successfully.`);
		};
		reader.readAsText(file);
	};
	const handleImport = () => {
		if (parsedRows.length === 0) {
			toast.error("No valid lines parsed to import");
			return;
		}
		if (hasErrors) {
			toast.error("Cannot import rows with errors. Upload a clean CSV template.");
			return;
		}
		const importedReviews = parsedRows.map((r, idx) => {
			const d = r.data;
			const matchedEmp = ws.employees.find((e) => (e.employeeId || e.id).toLowerCase() === d.employeeIdCode?.toLowerCase());
			const employeeId = matchedEmp ? matchedEmp.id : `emp_imported_${idx}`;
			const department = d.department || matchedEmp?.department || "Engineering";
			const designation = d.designation || matchedEmp?.designation || "Engineer";
			return {
				id: `rev_imported_${Math.random().toString(36).substr(2, 9)}`,
				employeeId,
				employeeName: d.employeeName || "Imported Employee",
				employeeIdCode: d.employeeIdCode || "EMP-IMP",
				department,
				designation,
				managerName: d.managerName || "",
				overallRating: d.overallRating || 3,
				kpiScore: d.kpiScore || 80,
				productivity: d.overallRating || 3,
				attendance: 4,
				communication: 3,
				leadership: 3,
				teamwork: 4,
				innovation: 3,
				problemSolving: 3,
				technicalSkills: 4,
				discipline: 4,
				goalProgress: d.goalProgress || 50,
				achievements: "Imported from batch CSV upload",
				challenges: "",
				feedback: "Continuous feedback imports",
				managerComments: "",
				promotionEligible: false,
				promotionStatus: "not_recommended",
				salaryIncrement: 0,
				bonusRecommendation: 0,
				reviewStatus: d.reviewStatus || "draft",
				reviewDate: d.reviewDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
				lastReview: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
				nextReview: new Date(Date.now() + 4320 * 60 * 60 * 1e3).toISOString().split("T")[0],
				createdAt: (/* @__PURE__ */ new Date()).toISOString()
			};
		});
		onImport(importedReviews);
		toast.success(`Batch Import Complete: ${importedReviews.length} performance reviews added`);
		resetState();
		onOpenChange(false);
	};
	const downloadTemplate = () => {
		const blob = new Blob(["Employee ID,Employee Name,Department,Designation,Manager,Overall Rating,KPI Score,Goal Completion,Status,Review Date", "\nEMP-0001,Jane Doe,Engineering,Software Engineer,Manager Name,4,85,80,completed,2026-01-15"], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute("download", "aurix_performance_import_template.csv");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast.success("CSV spreadsheet template downloaded");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (val) => {
			onOpenChange(val);
			if (!val) resetState();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-4xl max-h-[85vh] overflow-y-auto rounded-2xl border-border bg-card p-6 backdrop-blur-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "text-xl font-bold flex items-center gap-2",
					children: "📂 Import Performance Evaluations"
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border/60 bg-muted/20 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-foreground",
								children: "Import Reviews Template"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Download the standardized CSV layout, add employee details, overall ratings (1-5), and KPI score percentage."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: downloadTemplate,
							className: "text-xs font-semibold rounded-xl border-border bg-card hover:bg-muted",
							children: "📥 Download CSV Template"
						})]
					}), !file ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onDragOver: handleDragOver,
						onDrop: handleDrop,
						onClick: () => fileInputRef.current?.click(),
						className: "border-2 border-dashed border-border/80 hover:border-brand/60 rounded-2xl p-8 text-center cursor-pointer bg-card/20 hover:bg-card/40 transition-all duration-300 group flex flex-col items-center justify-center min-h-[180px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								ref: fileInputRef,
								onChange: handleFileChange,
								accept: ".csv",
								className: "hidden"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-12 w-12 rounded-2xl bg-muted group-hover:bg-brand/10 group-hover:text-brand flex items-center justify-center text-muted-foreground transition-colors mb-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-6 w-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-medium text-foreground",
								children: ["Drag & drop your evaluations CSV, or ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-brand hover:underline",
									children: "browse files"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-1",
								children: "Supports CSV formats (Max 5MB)"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between p-3 rounded-xl border border-border bg-muted/20",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-10 w-10 rounded-xl bg-brand/10 text-brand flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-5 w-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold text-foreground truncate max-w-[250px]",
										children: file.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: [
											(file.size / 1024).toFixed(1),
											" KB • ",
											parsedRows.length,
											" reviews detected"
										]
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: resetState,
									className: "text-xs text-rose-500 hover:bg-rose-500/10 cursor-pointer rounded-lg",
									children: "Remove File"
								})]
							}),
							parsedRows.some((r) => r.errors.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-rose-500 font-semibold text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" }), "Validation Errors Found in Spreadsheet"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
									className: "max-h-[120px] pr-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "space-y-1 text-xs text-muted-foreground",
										children: parsedRows.map((row) => {
											if (row.errors.length === 0) return null;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-semibold text-foreground flex-shrink-0",
													children: [
														"Row ",
														row.rowNum,
														":"
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-rose-500",
													children: row.errors.join(", ")
												})]
											}, row.rowNum);
										})
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
									children: "Import Preview"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-xl border border-border/80 overflow-hidden bg-card/20",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
										className: "max-h-[220px]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
											className: "bg-muted/10",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
													className: "w-[80px]",
													children: "Row"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Employee ID" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Employee Name" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Manager" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Rating" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "KPI Score" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" })
											] })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: parsedRows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
											className: row.errors.length > 0 ? "bg-rose-500/5" : "",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "font-mono text-xs",
													children: row.rowNum
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "font-mono text-xs",
													children: row.data.employeeIdCode || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-rose-500 italic",
														children: "Missing"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "text-xs font-semibold",
													children: row.data.employeeName || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-rose-500 italic",
														children: "Missing"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "text-xs",
													children: row.data.managerName || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-rose-500 italic",
														children: "Missing"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "text-xs font-semibold",
													children: row.data.overallRating ? `${row.data.overallRating} ★` : "3 ★"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
													className: "text-xs font-mono",
													children: [row.data.kpiScore || 80, "%"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: row.errors.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "bg-rose-500/10 text-rose-500 border-rose-500/20 text-[9px] px-1 py-0",
													children: "Error"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] px-1 py-0",
													children: "Valid"
												}) })
											]
										}, row.rowNum)) })] })
									})
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "mt-4 flex gap-2 justify-end",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						onClick: () => {
							onOpenChange(false);
							resetState();
						},
						className: "rounded-xl border-border bg-card hover:bg-muted",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						onClick: handleImport,
						disabled: !file || hasErrors,
						className: "rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90 disabled:opacity-50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 mr-2" }), "Complete Import"]
					})]
				})
			]
		})
	});
}
function EmployeePerformanceView() {
	const { goals, feedback360, courses } = usePerformance();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "goals",
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
					className: "bg-card/60 border border-border p-1 rounded-xl h-10 w-fit shrink-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "goals",
							className: "text-xs h-8 px-4 font-medium rounded-lg",
							children: "My Goals"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "feedback",
							className: "text-xs h-8 px-4 font-medium rounded-lg",
							children: "360 Feedback"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "trainings",
							className: "text-xs h-8 px-4 font-medium rounded-lg",
							children: "Learning & Courses"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "goals",
					className: "space-y-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border bg-card/40 backdrop-blur-xl p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold mb-3",
							children: "Active Goals & OKRs"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4",
							children: goals.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "py-8 text-center text-xs text-muted-foreground",
								children: "No active goals or OKRs assigned yet."
							}) : goals.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border/80 bg-background/50 p-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-3 mb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-sm font-semibold",
											children: g.title
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: g.description
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: g.status === "completed" ? "default" : "secondary",
											className: "capitalize text-[10px]",
											children: g.status
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs text-muted-foreground mb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Progress" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold text-foreground",
											children: [g.progress, "%"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-2 rounded-full bg-muted overflow-hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full bg-emerald-500 transition-all duration-500",
											style: { width: `${g.progress}%` }
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 text-[11px] text-muted-foreground",
										children: ["Target due: ", g.dueDate]
									})
								]
							}, g.id))
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "feedback",
					className: "space-y-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border bg-card/40 backdrop-blur-xl p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold mb-3",
							children: "Recent 360 Feedback & Appraisals"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: feedback360.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "py-8 text-center text-xs text-muted-foreground",
								children: "No 360 feedback or appraisals yet."
							}) : feedback360.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border/80 bg-background/50 p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-semibold",
										children: [
											f.reviewerName,
											" (",
											f.role,
											")"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "outline",
										className: "text-[10px]",
										children: [
											"Rating: ",
											f.rating,
											"/5"
										]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground mt-1",
									children: [
										"\"",
										f.feedbackText,
										"\""
									]
								})]
							}, f.id))
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "trainings",
					className: "space-y-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "border-border bg-card/40 backdrop-blur-xl p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold mb-3",
							children: "Enrolled Courses & Skill Programs"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: courses.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "py-8 text-center text-xs text-muted-foreground",
								children: "No enrolled courses or skill programs yet."
							}) : courses.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-xl border border-border/80 bg-background/50 p-3.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-xs font-semibold",
									children: c.courseName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] text-muted-foreground",
									children: ["Assigned: ", c.assignedDate]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: c.status === "completed" ? "default" : "secondary",
									className: "capitalize text-[10px]",
									children: c.status
								})]
							}, c.id))
						})]
					})
				})
			]
		})
	});
}
function PerformancePage() {
	const ws = useAurix();
	const { reviews, goals, feedback360, rewards, courses, createReview, updateReview, deleteReview, bulkDeleteReviews, bulkSetReviewStatus, importReviews, assignGoal, completeGoal, updateGoal, assignTraining, updateTrainingStatus, addReward } = usePerformance();
	const [activeTab, setActiveTab] = (0, import_react.useState)("directory");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [filters, setFilters] = (0, import_react.useState)({ ...DEFAULT_FILTERS });
	const [showAdvancedFilters, setShowAdvancedFilters] = (0, import_react.useState)(false);
	const [sortField, setSortField] = (0, import_react.useState)("employeeName");
	const [sortDir, setSortDir] = (0, import_react.useState)("asc");
	const [currentPage, setCurrentPage] = (0, import_react.useState)(1);
	const [perPage, setPerPage] = (0, import_react.useState)(10);
	const [selectedIds, setSelectedIds] = (0, import_react.useState)([]);
	const [formOpen, setFormOpen] = (0, import_react.useState)(false);
	const [activeReview, setActiveReview] = (0, import_react.useState)(null);
	const [profileOpen, setProfileOpen] = (0, import_react.useState)(false);
	const [profileReview, setProfileReview] = (0, import_react.useState)(null);
	const [importOpen, setImportOpen] = (0, import_react.useState)(false);
	const [bulkGoalOpen, setBulkGoalOpen] = (0, import_react.useState)(false);
	const [bulkGoalTitle, setBulkGoalTitle] = (0, import_react.useState)("");
	const [bulkGoalDesc, setBulkGoalDesc] = (0, import_react.useState)("");
	const [bulkGoalPriority, setBulkGoalPriority] = (0, import_react.useState)("medium");
	const [bulkGoalDueDate, setBulkGoalDueDate] = (0, import_react.useState)("");
	const [deleteAlertOpen, setDeleteAlertOpen] = (0, import_react.useState)(false);
	const [reviewToDelete, setReviewToDelete] = (0, import_react.useState)(null);
	const [bulkDeleteAlertOpen, setBulkDeleteAlertOpen] = (0, import_react.useState)(false);
	const departments = (0, import_react.useMemo)(() => {
		return Array.from(new Set(reviews.map((r) => r.department)));
	}, [reviews]);
	const managersList = (0, import_react.useMemo)(() => {
		return Array.from(new Set(reviews.map((r) => r.managerName)));
	}, [reviews]);
	const processedReviews = (0, import_react.useMemo)(() => {
		return applySorting(applyFilters(reviews, searchQuery, filters), sortField, sortDir);
	}, [
		reviews,
		searchQuery,
		filters,
		sortField,
		sortDir
	]);
	const paginatedReviews = (0, import_react.useMemo)(() => {
		return paginate(processedReviews, currentPage, perPage);
	}, [
		processedReviews,
		currentPage,
		perPage
	]);
	const totalPages = Math.ceil(processedReviews.length / perPage);
	if (ws.user?.role === "employee") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeePerformanceView, {});
	const handleSort = (field) => {
		if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
		else {
			setSortField(field);
			setSortDir("asc");
		}
		setCurrentPage(1);
	};
	const handleSelectAll = (checked) => {
		if (checked) setSelectedIds(paginatedReviews.map((r) => r.id));
		else setSelectedIds([]);
	};
	const handleSelectRow = (id, checked) => {
		if (checked) setSelectedIds((prev) => [...prev, id]);
		else setSelectedIds((prev) => prev.filter((x) => x !== id));
	};
	const handleAddClick = () => {
		if (ws.employees.length === 0) {
			toast.warning("Cannot create reviews: No employees exist in your directory.");
			return;
		}
		setActiveReview(null);
		setFormOpen(true);
	};
	const handleEditClick = (r) => {
		setActiveReview(r);
		setFormOpen(true);
	};
	const handleDeleteClick = (r) => {
		setReviewToDelete(r);
		setDeleteAlertOpen(true);
	};
	const handleConfirmDelete = () => {
		if (reviewToDelete) {
			deleteReview(reviewToDelete.id);
			setSelectedIds((prev) => prev.filter((id) => id !== reviewToDelete.id));
			toast.success("Review Deleted Successfully");
			setDeleteAlertOpen(false);
			setReviewToDelete(null);
		}
	};
	const handleViewClick = (r) => {
		setProfileReview(r);
		setProfileOpen(true);
	};
	const handleSaveReview = (r) => {
		if (reviews.some((rev) => rev.id === r.id)) {
			updateReview(r);
			if (profileReview?.id === r.id) setProfileReview(r);
		} else createReview(r);
	};
	const handleConfirmBulkDelete = () => {
		bulkDeleteReviews(selectedIds);
		toast.success(`${selectedIds.length} Reviews Deleted Successfully`);
		setSelectedIds([]);
		setBulkDeleteAlertOpen(false);
	};
	const handleBulkStatusChange = (status) => {
		bulkSetReviewStatus(selectedIds, status);
		toast.success(`${selectedIds.length} Reviews ${{
			draft: "moved to Draft",
			in_review: "moved to In Review",
			approved: "Approved",
			completed: "Completed"
		}[status]} Successfully`);
		setSelectedIds([]);
	};
	const handleBulkAssignGoalClick = () => {
		setBulkGoalTitle("");
		setBulkGoalDesc("");
		setBulkGoalPriority("medium");
		setBulkGoalDueDate("");
		setBulkGoalOpen(true);
	};
	const handleConfirmBulkAssignGoal = () => {
		if (!bulkGoalTitle.trim() || !bulkGoalDueDate) {
			toast.error("Goal Title and Due Date are required");
			return;
		}
		selectedIds.forEach((id) => {
			const rev = reviews.find((r) => r.id === id);
			if (rev) assignGoal(rev.employeeId, bulkGoalTitle.trim(), bulkGoalDesc.trim(), bulkGoalPriority, bulkGoalDueDate);
		});
		toast.success(`Assigned goal "${bulkGoalTitle.trim()}" to ${selectedIds.length} employees`);
		setSelectedIds([]);
		setBulkGoalOpen(false);
	};
	const handleClearFilters = () => {
		setSearchQuery("");
		setFilters({ ...DEFAULT_FILTERS });
		setCurrentPage(1);
		toast.success("Filters Reset Successfully");
	};
	const handleExportCSV = () => {
		const data = selectedIds.length > 0 ? reviews.filter((r) => selectedIds.includes(r.id)) : processedReviews;
		if (data.length === 0) {
			toast.error("No performance reviews available to export");
			return;
		}
		const csvContent = buildCSV(data);
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute("download", `aurix_performance_export_${Date.now()}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast.success("CSV Export Completed Successfully");
	};
	const handleExportExcel = () => {
		handleExportCSV();
	};
	const handleExportPDF = () => {
		const data = selectedIds.length > 0 ? reviews.filter((r) => selectedIds.includes(r.id)) : processedReviews;
		if (data.length === 0) {
			toast.error("No reviews available to export");
			return;
		}
		const printWindow = window.open("", "_blank");
		if (!printWindow) {
			toast.error("Popup blocked! Enable popups to export as PDF.");
			return;
		}
		const rowsHTML = data.map((r) => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px; font-size: 11px;">${r.employeeIdCode}</td>
        <td style="padding: 10px; font-size: 11px; font-weight: bold;">${r.employeeName}</td>
        <td style="padding: 10px; font-size: 11px;">${r.department}</td>
        <td style="padding: 10px; font-size: 11px;">${r.managerName}</td>
        <td style="padding: 10px; font-size: 11px;">${r.overallRating} ★</td>
        <td style="padding: 10px; font-size: 11px;">${r.goalProgress}%</td>
        <td style="padding: 10px; font-size: 11px;">${r.kpiScore}%</td>
        <td style="padding: 10px; font-size: 11px;">${r.reviewStatus.toUpperCase()}</td>
        <td style="padding: 10px; font-size: 11px;">${r.reviewDate}</td>
      </tr>
    `).join("");
		printWindow.document.write(`
      <html>
        <head>
          <title>Performance Reviews Pool - OFC360</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 20px; color: #333; }
            h1 { font-size: 18px; margin-bottom: 5px; }
            p { font-size: 12px; margin-bottom: 20px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background: #f5f5f5; text-align: left; padding: 10px; font-size: 11px; font-weight: bold; border-bottom: 2px solid #ddd; }
          </style>
        </head>
        <body>
          <h1>Performance evaluations Directory</h1>
          <p>Generated on ${(/* @__PURE__ */ new Date()).toLocaleDateString()} • Total Records: ${data.length}</p>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Reporting Manager</th>
                <th>Rating</th>
                <th>Goal Progress</th>
                <th>KPI Index</th>
                <th>Status</th>
                <th>Review Date</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHTML}
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            };
          <\/script>
        </body>
      </html>
    `);
		printWindow.document.close();
		toast.success("PDF Print Layout Triggered");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setImportOpen(true),
					variant: "outline",
					className: "rounded-xl border-border bg-card/60 hover:bg-muted text-xs font-semibold gap-1.5 h-10 px-4 flex-1 sm:flex-initial",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }), "Import CSV"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: handleAddClick,
					className: "rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90 text-xs font-semibold gap-1.5 h-10 px-4 flex-1 sm:flex-initial",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "New Review"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				value: activeTab,
				onValueChange: setActiveTab,
				className: "space-y-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between border-b border-border/80 pb-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
							className: "bg-muted/40 p-1 rounded-xl h-10",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "directory",
									className: "rounded-lg text-xs font-medium px-4 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-3.5 w-3.5" }), "Evaluations Directory"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "analytics",
									className: "rounded-lg text-xs font-medium px-4 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-3.5 w-3.5" }), "Visual Analytics"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
									value: "ai_insights",
									className: "rounded-lg text-xs font-medium px-4 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-brand animate-pulse" }), "AI Talent Insights"]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
						value: "directory",
						className: "space-y-6 mt-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PerformanceStatsCards, {
							reviews,
							goals
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border/60 bg-card/40 p-5 shadow-sm backdrop-blur-xl space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-1 items-center gap-2 max-w-lg",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													placeholder: "Search by name, employee ID, department, manager or email...",
													value: searchQuery,
													onChange: (e) => {
														setSearchQuery(e.target.value);
														setCurrentPage(1);
													},
													className: "pl-9 pr-4 rounded-xl border-border/80 bg-background/50 h-9 text-xs focus-visible:ring-brand"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												size: "sm",
												onClick: () => setShowAdvancedFilters(!showAdvancedFilters),
												className: `rounded-xl border-border/80 h-9 gap-1.5 text-xs font-medium cursor-pointer ${showAdvancedFilters ? "bg-muted text-foreground" : "bg-background/40 hover:bg-muted/40"}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-3.5 w-3.5" }), "Filters"]
											}),
											(searchQuery || Object.values(filters).some((v) => v && v !== "all")) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "sm",
												onClick: handleClearFilters,
												className: "text-xs text-rose-500 hover:bg-rose-500/10 cursor-pointer h-9 px-2 rounded-xl",
												children: "Reset"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 justify-end",
										children: [selectedIds.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs text-muted-foreground mr-1",
												children: [selectedIds.length, " selected:"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
												asChild: true,
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "outline",
													size: "sm",
													className: "rounded-xl border-border/80 h-9 text-xs bg-background/40 hover:bg-muted/40 font-semibold cursor-pointer",
													children: "Bulk Actions"
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
												align: "end",
												className: "rounded-xl border-border bg-card",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, {
														className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground",
														children: "Modify Status"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
														onClick: () => handleBulkStatusChange("completed"),
														className: "text-xs flex items-center gap-1.5 cursor-pointer py-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-3.5 w-3.5 text-emerald-500" }), "Approve reviews"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
														onClick: () => handleBulkStatusChange("draft"),
														className: "text-xs flex items-center gap-1.5 cursor-pointer py-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-3.5 w-3.5 text-rose-500" }), "Reject reviews"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, { className: "bg-border/60" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, {
														className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground",
														children: "Objective Tasks"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
														onClick: handleBulkAssignGoalClick,
														className: "text-xs flex items-center gap-1.5 cursor-pointer py-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-3.5 w-3.5 text-blue-500" }), "Assign Target Goal"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, { className: "bg-border/60" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
														onClick: () => setBulkDeleteAlertOpen(true),
														className: "text-xs flex items-center gap-1.5 cursor-pointer py-1.5 text-rose-500 hover:bg-rose-500/10 focus:text-rose-500",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), "Delete Selected"]
													})
												]
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												size: "sm",
												className: "rounded-xl border-border/80 h-9 gap-1.5 text-xs bg-background/40 hover:bg-muted/40 font-semibold cursor-pointer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), "Export"]
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
											align: "end",
											className: "rounded-xl border-border bg-card",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, {
													className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground",
													children: "Download Options"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: handleExportCSV,
													className: "text-xs flex items-center gap-2 cursor-pointer py-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-3.5 w-3.5 text-emerald-500" }), "Export CSV"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: handleExportExcel,
													className: "text-xs flex items-center gap-2 cursor-pointer py-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-3.5 w-3.5 text-emerald-600" }), "Export Excel"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: handleExportPDF,
													className: "text-xs flex items-center gap-2 cursor-pointer py-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5 text-rose-500" }), "Export PDF / Print"]
												})
											]
										})] })]
									})]
								}),
								showAdvancedFilters && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-4 rounded-xl border border-border/40 bg-muted/10 p-4 md:grid-cols-3 lg:grid-cols-6 animate-in fade-in duration-200",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-[10px] uppercase font-bold text-muted-foreground",
												children: "Department"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: filters.department,
												onValueChange: (val) => {
													setFilters((prev) => ({
														...prev,
														department: val
													}));
													setCurrentPage(1);
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "h-8 rounded-lg text-xs bg-background",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Departments" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "all",
													children: "All Departments"
												}), departments.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: d,
													children: d
												}, d))] })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-[10px] uppercase font-bold text-muted-foreground",
												children: "Manager"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: filters.manager,
												onValueChange: (val) => {
													setFilters((prev) => ({
														...prev,
														manager: val
													}));
													setCurrentPage(1);
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "h-8 rounded-lg text-xs bg-background",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Managers" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "all",
													children: "All Managers"
												}), managersList.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: m,
													children: m
												}, m))] })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-[10px] uppercase font-bold text-muted-foreground",
												children: "Rating Category"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: filters.rating,
												onValueChange: (val) => {
													setFilters((prev) => ({
														...prev,
														rating: val
													}));
													setCurrentPage(1);
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "h-8 rounded-lg text-xs bg-background",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Ratings" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "all",
														children: "All Ratings"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "excellent",
														children: "5 ★ Excellent"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "good",
														children: "4 ★ Good"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "average",
														children: "3 ★ Average"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "needs_improvement",
														children: "2 ★ Needs Improvement"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "poor",
														children: "1 ★ Poor"
													})
												] })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-[10px] uppercase font-bold text-muted-foreground",
												children: "Review Status"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: filters.reviewStatus,
												onValueChange: (val) => {
													setFilters((prev) => ({
														...prev,
														reviewStatus: val
													}));
													setCurrentPage(1);
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "h-8 rounded-lg text-xs bg-background",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Statuses" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "all",
													children: "All Statuses"
												}), REVIEW_STATUS_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: opt.value,
													children: opt.label
												}, opt.value))] })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-[10px] uppercase font-bold text-muted-foreground",
												children: "Promotion Eligible"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: filters.promotionEligible,
												onValueChange: (val) => {
													setFilters((prev) => ({
														...prev,
														promotionEligible: val
													}));
													setCurrentPage(1);
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "h-8 rounded-lg text-xs bg-background",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Candidates" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "all",
														children: "All Candidates"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "true",
														children: "Eligible Candidates"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "false",
														children: "Regular Pipeline"
													})
												] })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-[10px] uppercase font-bold text-muted-foreground",
												children: "Reviewed Since"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "date",
												value: filters.reviewDateFrom,
												onChange: (e) => {
													setFilters((prev) => ({
														...prev,
														reviewDateFrom: e.target.value
													}));
													setCurrentPage(1);
												},
												className: "h-8 rounded-lg text-xs bg-background px-2 py-0 border-border/80"
											})]
										})
									]
								}),
								processedReviews.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-2xl border border-dashed border-border/80 bg-card/10 p-12 text-center flex flex-col items-center justify-center min-h-[300px]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-muted/60 text-muted-foreground shadow-sm",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-6 w-6" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-semibold text-lg text-foreground",
											children: "No Performance Reviews Found"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-sm text-muted-foreground max-w-sm",
											children: reviews.length === 0 ? "Start by creating your first employee performance review cycles to evaluate company OKRs." : "No evaluations match your search query. Try clearing filters."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											onClick: reviews.length === 0 ? handleAddClick : handleClearFilters,
											className: "mt-5 rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90 font-semibold text-xs h-9 px-4 cursor-pointer",
											children: reviews.length === 0 ? "Create Review" : "Reset Filters"
										})
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PerformanceTable, {
									reviews: paginatedReviews,
									selectedIds,
									onSelectAll: handleSelectAll,
									onSelectRow: handleSelectRow,
									onView: handleViewClick,
									onEdit: handleEditClick,
									onDelete: handleDeleteClick,
									sortField,
									sortDir,
									onSort: handleSort
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row justify-between items-center gap-4 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: [
												"Showing ",
												Math.min(processedReviews.length, (currentPage - 1) * perPage + 1),
												" to",
												" ",
												Math.min(processedReviews.length, currentPage * perPage),
												" of ",
												processedReviews.length,
												" entries"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-muted-foreground",
												children: "Per Page:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: String(perPage),
												onValueChange: (val) => {
													setPerPage(Number(val));
													setCurrentPage(1);
												},
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "h-7 w-[60px] rounded-lg text-xs bg-background px-1 py-0",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "5",
														children: "5"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "10",
														children: "10"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "25",
														children: "25"
													})
												] })]
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "outline",
												size: "icon",
												onClick: () => setCurrentPage((p) => Math.max(1, p - 1)),
												disabled: currentPage === 1,
												className: "h-8 w-8 rounded-lg border-border/80 bg-background/50 hover:bg-muted disabled:opacity-40 cursor-pointer",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
											}),
											Array.from({ length: totalPages }).map((_, i) => {
												const pNum = i + 1;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: currentPage === pNum ? "default" : "outline",
													size: "icon",
													onClick: () => setCurrentPage(pNum),
													className: `h-8 w-8 rounded-lg text-xs font-semibold cursor-pointer ${currentPage === pNum ? "bg-brand text-brand-foreground shadow-glow hover:bg-brand/90" : "border-border/80 bg-background/50 hover:bg-muted"}`,
													children: pNum
												}, pNum);
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "outline",
												size: "icon",
												onClick: () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
												disabled: currentPage === totalPages,
												className: "h-8 w-8 rounded-lg border-border/80 bg-background/50 hover:bg-muted disabled:opacity-40 cursor-pointer",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
											})
										]
									})]
								})] })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "analytics",
						className: "mt-0 space-y-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PerformanceCharts, {
							reviews,
							goals
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "ai_insights",
						className: "mt-0 space-y-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIInsightsPanel, {
							reviews,
							goals
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PerformanceFormDialog, {
				open: formOpen,
				onOpenChange: setFormOpen,
				review: activeReview,
				existingReviews: reviews,
				onSave: handleSaveReview
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeePerformanceProfile, {
				open: profileOpen,
				onOpenChange: setProfileOpen,
				review: profileReview,
				goals,
				feedbackList: feedback360,
				rewards,
				courses,
				onAssignGoal: assignGoal,
				onCompleteGoal: completeGoal,
				onAssignTraining: assignTraining,
				onUpdateTrainingStatus: updateTrainingStatus,
				onAddReward: addReward
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImportDialog, {
				open: importOpen,
				onOpenChange: setImportOpen,
				existingReviews: reviews,
				onImport: importReviews
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: bulkGoalOpen,
				onOpenChange: setBulkGoalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "rounded-2xl border-border bg-card p-6 backdrop-blur-xl max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "font-bold text-lg",
							children: "Bulk Assign OKR Objective Goal"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-4 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "bgTitle",
										className: "text-xs font-semibold",
										children: "Goal Objective Title"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "bgTitle",
										value: bulkGoalTitle,
										onChange: (e) => setGoalTitle(e.target.value),
										placeholder: "e.g. Optimize platform indexing latencies"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "bgDesc",
										className: "text-xs font-semibold",
										children: "Objective description"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "bgDesc",
										value: bulkGoalDesc,
										onChange: (e) => setGoalDesc(e.target.value),
										placeholder: "e.g. Add indexes, replicate databases..."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold",
											children: "Priority"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: bulkGoalPriority,
											onValueChange: (val) => setGoalPriority(val),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "h-10 text-xs bg-background",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "low",
													children: "Low"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "medium",
													children: "Medium"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "high",
													children: "High"
												})
											] })]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "bgDue",
											className: "text-xs font-semibold",
											children: "Due Date"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "bgDue",
											type: "date",
											value: bulkGoalDueDate,
											onChange: (e) => setGoalDueDate(e.target.value),
											className: "h-10 px-2 bg-background"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[10px] text-muted-foreground mt-2",
									children: [
										"This will assign the target objective goal to all ",
										selectedIds.length,
										" selected employee profiles."
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "flex gap-2 justify-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setBulkGoalOpen(false),
								className: "rounded-xl border-border bg-card",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: handleConfirmBulkAssignGoal,
								className: "rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90",
								children: "Assign Goal"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: deleteAlertOpen,
				onOpenChange: setDeleteAlertOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, {
					className: "rounded-2xl border-border bg-card p-6 backdrop-blur-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, {
						className: "font-bold text-lg",
						children: "Are you sure you want to delete this performance review?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, {
						className: "text-sm text-muted-foreground mt-2",
						children: [
							"This action is permanent and cannot be undone. This will delete the evaluation records of",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: reviewToDelete?.employeeName
							}),
							" on",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: reviewToDelete?.reviewDate
							}),
							" from the systems database."
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, {
						className: "mt-4 flex gap-2 justify-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
							className: "rounded-xl border-border bg-card hover:bg-muted",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
							onClick: handleConfirmDelete,
							className: "rounded-xl bg-rose-500 text-white hover:bg-rose-600 shadow-glow border-none",
							children: "Delete"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
				open: bulkDeleteAlertOpen,
				onOpenChange: setBulkDeleteAlertOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, {
					className: "rounded-2xl border-border bg-card p-6 backdrop-blur-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, {
						className: "font-bold text-lg",
						children: "Confirm Bulk Delete Reviews"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, {
						className: "text-sm text-muted-foreground mt-2",
						children: [
							"Are you sure you want to delete the ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: selectedIds.length
							}),
							" selected performance reviews? This action is irreversible."
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, {
						className: "mt-4 flex gap-2 justify-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
							className: "rounded-xl border-border bg-card hover:bg-muted",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
							onClick: handleConfirmBulkDelete,
							className: "rounded-xl bg-rose-500 text-white hover:bg-rose-600 shadow-glow border-none",
							children: "Delete Selected"
						})]
					})]
				})
			})
		]
	});
	function setGoalTitle(val) {
		setBulkGoalTitle(val);
	}
	function setGoalDesc(val) {
		setBulkGoalDesc(val);
	}
	function setGoalPriority(val) {
		setBulkGoalPriority(val);
	}
	function setGoalDueDate(val) {
		setBulkGoalDueDate(val);
	}
}
//#endregion
export { PerformancePage };
