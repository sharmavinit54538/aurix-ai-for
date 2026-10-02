import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Dr as ChevronRight, H as Sparkles, P as Target, Sr as CircleCheck, ht as Plus, jn as Funnel, p as Users, pr as Clock, tr as DollarSign } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as apiInstance } from "./apiInstance-C5A0vaLH.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { n as useRecruitment } from "./useRecruitment-Cuznx8sx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/WorkforcePlanningPage-B7-Bz_2g.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_DEPARTMENTS = [
	"Engineering",
	"Data & AI Analytics",
	"Product Management",
	"Design & Creative",
	"Sales & Business Dev",
	"Human Resources",
	"Finance & Accounting",
	"Operations"
];
function WorkforcePlanningPage() {
	const navigate = useNavigate();
	const { upsertJob } = useRecruitment();
	const [departments, setDepartments] = (0, import_react.useState)(DEFAULT_DEPARTMENTS);
	(0, import_react.useEffect)(() => {
		let mounted = true;
		async function loadDepts() {
			try {
				const res = await apiInstance.get("/departments", { params: { limit: 100 } });
				const dData = res.data?.data ?? res.data;
				const list = Array.isArray(dData) ? dData : Array.isArray(dData?.items) ? dData.items : Array.isArray(dData?.departments) ? dData.departments : [];
				if (mounted && list.length > 0) {
					const names = list.map((d) => d.name || d.title || d.department_name).filter(Boolean);
					if (names.length > 0) setDepartments(Array.from(/* @__PURE__ */ new Set([...names, ...DEFAULT_DEPARTMENTS])));
				}
			} catch {}
		}
		loadDepts();
		return () => {
			mounted = false;
		};
	}, []);
	const [requirements, setRequirements] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("ofc360:workforce_requirements");
			if (saved) try {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed)) {
					const clean = parsed.filter((r) => ![
						"WFR-101",
						"WFR-102",
						"WFR-103",
						"WFR-104",
						"WFR-105"
					].includes(r.id));
					if (clean.length !== parsed.length) localStorage.setItem("ofc360:workforce_requirements", JSON.stringify(clean));
					return clean;
				}
			} catch {}
		}
		return [];
	});
	const [filterDept, setFilterDept] = (0, import_react.useState)("all");
	const [filterStatus, setFilterStatus] = (0, import_react.useState)("all");
	const [showCreateModal, setShowCreateModal] = (0, import_react.useState)(false);
	const [selectedReq, setSelectedReq] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)({
		department: "Engineering",
		roleTitle: "",
		headcountNeeded: 1,
		currentHeadcount: 0,
		plannedQuarter: "Q2 2026",
		priority: "High",
		budgetMin: 0,
		budgetMax: 0,
		currency: "INR",
		requiredSkills: "",
		experienceLevel: "3-5 yrs (Mid-Level)",
		justification: ""
	});
	const saveRequirements = (updated) => {
		setRequirements(updated);
		if (typeof window !== "undefined") localStorage.setItem("ofc360:workforce_requirements", JSON.stringify(updated));
	};
	const handleCreateSubmit = (e) => {
		e.preventDefault();
		if (!form.roleTitle.trim()) {
			toast.error("Please enter a role title.");
			return;
		}
		const newReq = {
			id: `WFR-${Math.floor(100 + Math.random() * 900)}`,
			department: form.department,
			roleTitle: form.roleTitle,
			headcountNeeded: Number(form.headcountNeeded) || 1,
			currentHeadcount: Number(form.currentHeadcount) || 0,
			plannedQuarter: form.plannedQuarter,
			priority: form.priority,
			budgetMin: Number(form.budgetMin),
			budgetMax: Number(form.budgetMax),
			currency: form.currency,
			requiredSkills: form.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean),
			experienceLevel: form.experienceLevel,
			justification: form.justification || "Headcount required for planned project milestones.",
			status: "Submitted",
			createdAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
		};
		saveRequirements([newReq, ...requirements]);
		toast.success(`Workforce requirement ${newReq.id} created successfully!`);
		setShowCreateModal(false);
		setForm({
			department: departments[0] || "Engineering",
			roleTitle: "",
			headcountNeeded: 1,
			currentHeadcount: 0,
			plannedQuarter: "Q2 2026",
			priority: "High",
			budgetMin: 0,
			budgetMax: 0,
			currency: "INR",
			requiredSkills: "",
			experienceLevel: "3-5 yrs (Mid-Level)",
			justification: ""
		});
	};
	const handleStatusChange = (id, newStatus) => {
		saveRequirements(requirements.map((r) => r.id === id ? {
			...r,
			status: newStatus
		} : r));
		toast.success(`Requirement ${id} marked as ${newStatus}`);
	};
	const handleConvertToJob = (req) => {
		const newJobId = `job-${Math.floor(100 + Math.random() * 900)}`;
		upsertJob({
			id: newJobId,
			title: req.roleTitle,
			department: req.department,
			employmentType: "Full-time",
			experience: req.experienceLevel,
			skills: req.requiredSkills,
			salaryMin: req.budgetMin,
			salaryMax: req.budgetMax,
			currency: req.currency,
			vacancies: req.headcountNeeded,
			location: "Bengaluru, India (Hybrid)",
			workMode: "Hybrid",
			description: `We are hiring ${req.headcountNeeded} ${req.roleTitle} for our ${req.department} team.\n\nJustification: ${req.justification}`,
			responsibilities: [`Deliver high-impact features aligned with ${req.department} priorities.`, "Collaborate cross-functionally across product, design, and engineering."],
			requirements: [`Demonstrated experience in ${req.requiredSkills.join(", ")}.`, `Minimum ${req.experienceLevel} required.`],
			benefits: [
				"Competitive CTC",
				"Comprehensive Health Cover",
				"Growth Opportunities"
			],
			hiringManager: "Department Lead",
			recruiter: "Recruitment Team",
			status: "active",
			publishedAt: (/* @__PURE__ */ new Date()).toISOString(),
			closingAt: new Date(Date.now() + 60 * 864e5).toISOString(),
			applicants: 0
		});
		saveRequirements(requirements.map((r) => r.id === req.id ? {
			...r,
			status: "Converted to Job",
			convertedJobId: newJobId
		} : r));
		toast.success(`Requirement ${req.id} converted into Active Job ${newJobId}!`);
		navigate({ to: "/dashboard/recruitment/jobs" });
	};
	const totalPlannedHeadcount = requirements.reduce((acc, r) => acc + r.headcountNeeded, 0);
	const totalApproved = requirements.filter((r) => r.status === "Approved" || r.status === "Converted to Job").length;
	const totalPending = requirements.filter((r) => r.status === "Submitted" || r.status === "Finance Approved" || r.status === "Dept Head Approved").length;
	const totalBudgetEst = requirements.reduce((acc, r) => acc + (r.budgetMin + r.budgetMax) / 2 * r.headcountNeeded, 0);
	const filtered = (0, import_react.useMemo)(() => {
		return requirements.filter((r) => {
			if (filterDept !== "all" && r.department !== filterDept) return false;
			if (filterStatus !== "all" && r.status !== filterStatus) return false;
			return true;
		});
	}, [
		requirements,
		filterDept,
		filterStatus
	]);
	const priorityColors = {
		Urgent: "bg-rose-500/15 text-rose-600 border-rose-500/30 dark:text-rose-400",
		High: "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
		Medium: "bg-blue-500/15 text-blue-600 border-blue-500/30 dark:text-blue-400",
		Low: "bg-muted text-muted-foreground border-border"
	};
	const statusColors = {
		Draft: "bg-muted text-muted-foreground",
		Submitted: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
		"Dept Head Approved": "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",
		"Finance Approved": "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
		Approved: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
		"Converted to Job": "bg-purple-500/15 text-purple-600 dark:text-purple-400",
		Rejected: "bg-rose-500/15 text-rose-600 dark:text-rose-400"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setShowCreateModal(true),
					className: "gap-1.5 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "New Workforce Requirement"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Headcount Needed" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4 text-indigo-500" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 font-display text-2xl font-bold",
								children: [totalPlannedHeadcount, " Positions"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: [
									"Across ",
									departments.length,
									" functional units"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Approved Requisitions" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-500" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400",
								children: [totalApproved, " Approved"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: "Ready for recruiter sourcing"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pending Approvals" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-amber-500" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 font-display text-2xl font-bold text-amber-600 dark:text-amber-400",
								children: [totalPending, " In Review"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: "Dept Head & Finance sign-off"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Annualized Budget Pool" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-4 w-4 text-purple-500" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 font-display text-2xl font-bold",
								children: [
									"₹",
									(totalBudgetEst / 1e7).toFixed(2),
									" Cr"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: "Est. salary allocations"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card/40 p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-xs text-muted-foreground mr-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-3.5 w-3.5" }), "Filter by:"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: filterDept,
							onValueChange: setFilterDept,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-8 text-xs w-[160px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Departments" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "All Departments"
							}), departments.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: d,
								children: d
							}, d))] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: filterStatus,
							onValueChange: setFilterStatus,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-8 text-xs w-[170px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Statuses" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "All Statuses"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Draft",
									children: "Draft"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Submitted",
									children: "Submitted"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Dept Head Approved",
									children: "Dept Head Approved"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Finance Approved",
									children: "Finance Approved"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Approved",
									children: "Approved"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Converted to Job",
									children: "Converted to Job"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Rejected",
									children: "Rejected"
								})
							] })]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground",
					children: [
						"Showing ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-foreground",
							children: filtered.length
						}),
						" of ",
						requirements.length,
						" requirements"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "border-b border-border bg-muted/40 font-medium text-muted-foreground uppercase tracking-wider text-[10px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Requirement ID & Role"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Department"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Headcount"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Priority"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Timeline"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Budget Range"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-right",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border",
							children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								colSpan: 8,
								className: "py-14 text-center text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "mx-auto h-9 w-9 opacity-35 mb-2.5 text-primary" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold text-foreground",
										children: "No workforce requirements found"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-1 max-w-sm mx-auto",
										children: filterDept !== "all" || filterStatus !== "all" ? "No requisitions match your selected department or status filters." : "No workforce requirements found. Create a new workforce requirement to track department headcount needs."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: () => setShowCreateModal(true),
										size: "sm",
										className: "mt-4 gap-1.5 shadow-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "New Workforce Requirement"]
									})
								]
							}) }) : filtered.map((req) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-accent/30 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium text-foreground text-sm flex items-center gap-1.5",
											children: req.roleTitle
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-muted-foreground",
											children: [
												req.id,
												" • ",
												req.experienceLevel
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-muted-foreground",
											children: req.department
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400",
											children: ["+", req.headcountNeeded]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] text-muted-foreground ml-1",
											children: [
												"(Current: ",
												req.currentHeadcount,
												")"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: `text-[10px] px-2 py-0.5 ${priorityColors[req.priority]}`,
											children: req.priority
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-medium text-muted-foreground",
										children: req.plannedQuarter
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3 font-medium",
										children: [
											"₹",
											(req.budgetMin / 1e5).toFixed(1),
											"L - ₹",
											(req.budgetMax / 1e5).toFixed(1),
											"L"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "secondary",
											className: `text-[10px] ${statusColors[req.status]}`,
											children: req.status
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-end gap-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "ghost",
													className: "h-7 text-xs px-2",
													onClick: () => setSelectedReq(req),
													children: "Details"
												}),
												req.status === "Approved" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													size: "sm",
													className: "h-7 text-xs px-2.5 bg-gradient-brand text-brand-foreground shadow-glow gap-1",
													onClick: () => handleConvertToJob(req),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }), "Convert to Job"]
												}),
												req.status === "Submitted" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "outline",
													className: "h-7 text-xs px-2 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10",
													onClick: () => handleStatusChange(req.id, "Approved"),
													children: "Approve"
												}),
												req.status === "Converted to Job" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "ghost",
													className: "h-7 text-xs px-2 text-indigo-500",
													asChild: true,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
														to: "/dashboard/recruitment/jobs",
														children: ["View Job ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3 ml-0.5" })]
													})
												})
											]
										})
									})
								]
							}, req.id))
						})]
					})
				})
			}),
			selectedReq && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: Boolean(selectedReq),
				onOpenChange: () => setSelectedReq(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: priorityColors[selectedReq.priority],
								children: selectedReq.priority
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								className: statusColors[selectedReq.status],
								children: selectedReq.status
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-xl font-bold mt-2",
							children: selectedReq.roleTitle
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
							selectedReq.id,
							" • ",
							selectedReq.department,
							" • Planned for ",
							selectedReq.plannedQuarter
						] })
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 py-2 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3 bg-muted/30 p-3 rounded-xl",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Headcount Needed:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-semibold text-sm text-foreground",
										children: [
											"+",
											selectedReq.headcountNeeded,
											" Openings"
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Annual Budget Band:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-semibold text-sm text-foreground",
										children: [
											"₹",
											(selectedReq.budgetMin / 1e5).toFixed(1),
											"L – ₹",
											(selectedReq.budgetMax / 1e5).toFixed(1),
											"L"
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Experience Level:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold text-foreground",
										children: selectedReq.experienceLevel
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Target Quarter:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold text-foreground",
										children: selectedReq.plannedQuarter
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Business Justification & Project Alignment"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 p-3 rounded-lg border border-border bg-card/60 text-foreground leading-relaxed",
								children: selectedReq.justification
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Required Skillsets"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1.5 flex flex-wrap gap-1.5",
								children: selectedReq.requiredSkills.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-xs",
									children: s
								}, s))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 border-t border-border flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Workflow Stage:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: selectedReq.status,
										onValueChange: (val) => {
											handleStatusChange(selectedReq.id, val);
											setSelectedReq({
												...selectedReq,
												status: val
											});
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "h-8 text-xs w-[180px]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Draft",
												children: "Draft"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Submitted",
												children: "Submitted"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Dept Head Approved",
												children: "Dept Head Approved"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Finance Approved",
												children: "Finance Approved"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Approved",
												children: "Approved"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Rejected",
												children: "Rejected"
											})
										] })]
									})]
								}), selectedReq.status === "Approved" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									className: "bg-gradient-brand text-brand-foreground shadow-glow gap-1.5",
									onClick: () => {
										const cur = selectedReq;
										setSelectedReq(null);
										handleConvertToJob(cur);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), "Convert to Active Job"]
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: showCreateModal,
				onOpenChange: setShowCreateModal,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "max-w-lg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleCreateSubmit,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
								className: "text-lg font-bold",
								children: "Create Workforce Requirement"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Submit a new hiring requisition for approval by Department Head and Finance." })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 py-3 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Department *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.department,
											onValueChange: (v) => setForm({
												...form,
												department: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "mt-1 h-9 text-xs",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: departments.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: d,
												children: d
											}, d)) })]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Target Timeline *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.plannedQuarter,
											onValueChange: (v) => setForm({
												...form,
												plannedQuarter: v
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "mt-1 h-9 text-xs",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Q1 2026",
													children: "Q1 2026"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Q2 2026",
													children: "Q2 2026"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Q3 2026",
													children: "Q3 2026"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: "Q4 2026",
													children: "Q4 2026"
												})
											] })]
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Role Title *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "mt-1 h-9 text-xs",
										placeholder: "e.g. Senior Distributed Systems Engineer",
										value: form.roleTitle,
										onChange: (e) => setForm({
											...form,
											roleTitle: e.target.value
										}),
										required: true
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-3 gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs",
												children: "Headcount *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												min: "1",
												className: "mt-1 h-9 text-xs",
												value: form.headcountNeeded,
												onChange: (e) => setForm({
													...form,
													headcountNeeded: Number(e.target.value)
												})
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs",
												children: "Priority *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: form.priority,
												onValueChange: (v) => setForm({
													...form,
													priority: v
												}),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "mt-1 h-9 text-xs",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "Urgent",
														children: "Urgent"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "High",
														children: "High"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "Medium",
														children: "Medium"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: "Low",
														children: "Low"
													})
												] })]
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs",
												children: "Experience *"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												className: "mt-1 h-9 text-xs",
												value: form.experienceLevel,
												onChange: (e) => setForm({
													...form,
													experienceLevel: e.target.value
												})
											})] })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Min Salary (INR / yr)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											className: "mt-1 h-9 text-xs",
											value: form.budgetMin,
											onChange: (e) => setForm({
												...form,
												budgetMin: Number(e.target.value)
											})
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Max Salary (INR / yr)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											className: "mt-1 h-9 text-xs",
											value: form.budgetMax,
											onChange: (e) => setForm({
												...form,
												budgetMax: Number(e.target.value)
											})
										})] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Required Skills (Comma separated)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "mt-1 h-9 text-xs",
										placeholder: "React, TypeScript, AWS, System Architecture",
										value: form.requiredSkills,
										onChange: (e) => setForm({
											...form,
											requiredSkills: e.target.value
										})
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Business Justification & Impact"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										className: "mt-1 text-xs",
										rows: 2,
										placeholder: "Describe why this role is needed and the business goals it impacts...",
										value: form.justification,
										onChange: (e) => setForm({
											...form,
											justification: e.target.value
										})
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setShowCreateModal(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								children: "Submit for Approval"
							})] })
						]
					})
				})
			})
		]
	});
}
//#endregion
export { WorkforcePlanningPage };
