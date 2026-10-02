import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, H as Sparkles, Qn as EllipsisVertical, Vt as Mail, er as Download, ht as Plus, q as ShieldCheck, qr as Building2, rr as Crown, st as RotateCcw, x as UserCheck, xt as Pen } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { n as useAppSelector, t as useAppDispatch } from "./hooks-BpVIWXzj.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as getRejectMessage } from "./utils-DQc9Fr86.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { E as fetchEmployees, K as resendEmployeeInvite, a as activateEmployee, et as updateEmployee, m as createEmployee, q as resetEmployeePassword } from "./auth-bootstrap-CR9kF6gO.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-DXMm4jWj.mjs";
import { r as PageHeader } from "./DashboardShell-DIr27KpW.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as useDebounce } from "./useDebounce-Duf9-Nss.mjs";
import { n as exportEmployeesCsv } from "./employeeStatus-CjTvvMla.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ExecutivesPage-DVN5fUh-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EXECUTIVE_TITLE_OPTIONS = [
	"Chief Executive Officer (CEO)",
	"Chief Technology Officer (CTO)",
	"Chief Financial Officer (CFO)",
	"Chief Information Officer (CIO)",
	"Chief Operating Officer (COO)",
	"Chief Marketing Officer (CMO)",
	"President & Managing Director",
	"Vice President of Engineering",
	"Vice President of Operations",
	"Executive Director"
];
function ExecutivesPage() {
	const dispatch = useAppDispatch();
	const { employees, loading, submitting } = useAppSelector((state) => state.employees);
	const [q, setQ] = (0, import_react.useState)("");
	const debouncedQ = useDebounce(q, 300);
	const [selectedDept, setSelectedDept] = (0, import_react.useState)("all");
	const [selectedStatus, setSelectedStatus] = (0, import_react.useState)("all");
	const [dialogOpen, setDialogOpen] = (0, import_react.useState)(false);
	const [editingExecutive, setEditingExecutive] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)({
		fullName: "",
		email: "",
		phone: "",
		department: "Executive Board",
		designation: "Chief Executive Officer (CEO)",
		joiningDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		employeeId: "",
		shift: "General"
	});
	(0, import_react.useEffect)(() => {
		dispatch(fetchEmployees());
	}, [dispatch]);
	const executives = (0, import_react.useMemo)(() => {
		return employees.filter((emp) => {
			const isRoleMatch = emp.role === "executive";
			const desigLower = (emp.designation || "").toLowerCase();
			const deptLower = (emp.department || "").toLowerCase();
			const isCLevel = desigLower.includes("ceo") || desigLower.includes("cto") || desigLower.includes("cfo") || desigLower.includes("cio") || desigLower.includes("coo") || desigLower.includes("cmo") || desigLower.includes("chief") || desigLower.includes("president") || desigLower.includes("vice president") || desigLower.includes("executive director") || deptLower.includes("executive") || deptLower.includes("leadership") || deptLower.includes("board");
			if (!(isRoleMatch || isCLevel)) return false;
			if (debouncedQ) {
				const query = debouncedQ.toLowerCase();
				if (!(emp.fullName.toLowerCase().includes(query) || emp.email.toLowerCase().includes(query) || emp.employeeId.toLowerCase().includes(query) || emp.designation.toLowerCase().includes(query))) return false;
			}
			if (selectedDept !== "all" && emp.department !== selectedDept) return false;
			if (selectedStatus !== "all" && emp.status !== selectedStatus) return false;
			return true;
		});
	}, [
		employees,
		debouncedQ,
		selectedDept,
		selectedStatus
	]);
	const departments = (0, import_react.useMemo)(() => {
		const set = /* @__PURE__ */ new Set();
		employees.forEach((e) => {
			const d = (e.department || "").toLowerCase();
			if (d.includes("exec") || d.includes("board") || d.includes("lead")) set.add(e.department);
		});
		set.add("Executive Board");
		set.add("Corporate Strategy");
		set.add("Office of the CEO");
		return Array.from(set);
	}, [employees]);
	const activeCount = executives.filter((e) => e.status === "ACTIVE" || e.status === "CONFIRMED").length;
	const cLevelCount = executives.filter((e) => {
		const d = (e.designation || "").toLowerCase();
		return d.includes("chief") || d.includes("ceo") || d.includes("cto") || d.includes("cfo") || d.includes("cio");
	}).length;
	function openCreate() {
		setEditingExecutive(null);
		setFormData({
			fullName: "",
			email: "",
			phone: "",
			department: "Executive Board",
			designation: "Chief Executive Officer (CEO)",
			joiningDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			employeeId: `EXEC-${Math.floor(1e5 + Math.random() * 9e5)}`,
			shift: "General"
		});
		setDialogOpen(true);
	}
	function openEdit(exec) {
		setEditingExecutive(exec);
		setFormData({
			fullName: exec.fullName,
			email: exec.email,
			phone: exec.phone || "",
			department: exec.department || "Executive Board",
			designation: exec.designation || "Chief Executive Officer (CEO)",
			joiningDate: exec.joiningDate || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			employeeId: exec.employeeId || "",
			shift: exec.shift || "General"
		});
		setDialogOpen(true);
	}
	async function handleSave() {
		if (!formData.fullName.trim() || !formData.email.trim()) return toast.error("Full name and corporate email are required");
		const names = formData.fullName.trim().split(/\s+/);
		const first_name = names[0] || "";
		const last_name = names.slice(1).join(" ") || " ";
		if (editingExecutive) {
			const result = await dispatch(updateEmployee({
				id: editingExecutive.id,
				payload: {
					first_name,
					last_name,
					personal_email: formData.email,
					company_email: formData.email,
					phone: formData.phone,
					department: formData.department,
					designation: formData.designation,
					joining_date: formData.joiningDate,
					shift: formData.shift
				}
			}));
			if (updateEmployee.fulfilled.match(result)) {
				toast.success("Executive officer profile updated successfully");
				setDialogOpen(false);
				dispatch(fetchEmployees());
			} else toast.error(getRejectMessage(result.payload, "Failed to update executive profile"));
		} else {
			const result = await dispatch(createEmployee({
				first_name,
				last_name,
				personal_email: formData.email,
				company_email: formData.email,
				phone: formData.phone,
				department: formData.department,
				designation: formData.designation,
				joining_date: formData.joiningDate,
				employee_id: formData.employeeId || `EXEC-${Math.floor(1e5 + Math.random() * 9e5)}`,
				employment_type: "FULL_TIME",
				employment_status: "CONFIRMED",
				role: "executive",
				shift: formData.shift
			}));
			if (createEmployee.fulfilled.match(result)) {
				toast.success("Executive leader record created and invitation sent");
				setDialogOpen(false);
				dispatch(fetchEmployees());
			} else toast.error(getRejectMessage(result.payload, "Failed to create executive record"));
		}
	}
	async function handleResendInvite(id) {
		const res = await dispatch(resendEmployeeInvite(id));
		if (resendEmployeeInvite.fulfilled.match(res)) toast.success("Invitation email resent successfully");
		else toast.error(getRejectMessage(res.payload, "Failed to resend invite"));
	}
	async function handleResetPassword(id) {
		if (!confirm("Send temporary password reset instructions to this executive?")) return;
		const res = await dispatch(resetEmployeePassword(id));
		if (resetEmployeePassword.fulfilled.match(res)) toast.success("Password reset instructions sent");
		else toast.error(getRejectMessage(res.payload, "Failed to reset password"));
	}
	async function handleActivate(id) {
		const res = await dispatch(activateEmployee(id));
		if (activateEmployee.fulfilled.match(res)) {
			toast.success("Executive account confirmed and active");
			dispatch(fetchEmployees());
		} else toast.error(getRejectMessage(res.payload, "Failed to activate"));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 text-left",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Executive Leadership",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => exportEmployeesCsv(executives),
						disabled: executives.length === 0,
						className: "gap-1.5 text-xs h-9 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), " Export CSV"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: openCreate,
						className: "gap-1.5 text-xs h-9 bg-amber-600 hover:bg-amber-500 text-white cursor-pointer shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add Executive"]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-amber-500/20 bg-card/60 p-4 backdrop-blur-md shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Executives" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-2 rounded-lg bg-amber-500/10 text-amber-400",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-4 w-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-2xl font-bold mt-2 text-foreground",
								children: executives.length
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground mt-0.5",
								children: "Board & Officer Records"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-emerald-500/20 bg-card/60 p-4 backdrop-blur-md shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Active & Confirmed" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-2 rounded-lg bg-emerald-500/10 text-emerald-400",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-2xl font-bold mt-2 text-emerald-400",
								children: activeCount
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground mt-0.5",
								children: "Active Strategic Mandate"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-purple-500/20 bg-card/60 p-4 backdrop-blur-md shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "C-Suite Chiefs" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-2 rounded-lg bg-purple-500/10 text-purple-400",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-2xl font-bold mt-2 text-purple-400",
								children: cLevelCount
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground mt-0.5",
								children: "CEO / CTO / CFO / CIO / COO"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-blue-500/20 bg-card/60 p-4 backdrop-blur-md shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Corporate Units" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-2 rounded-lg bg-blue-500/10 text-blue-400",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-2xl font-bold mt-2 text-foreground",
								children: departments.length
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground mt-0.5",
								children: "Executive Divisions"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-center justify-between gap-3 rounded-2xl border border-border bg-card/60 p-3.5 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 w-full max-w-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "Search executive by name, title, corporate email...",
						className: "pl-9 h-8 text-xs bg-muted/20 border-border/60"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2 w-full sm:w-auto",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: selectedDept,
						onChange: (e) => setSelectedDept(e.target.value),
						className: "h-8 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "All Divisions"
						}), departments.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: d,
							children: d
						}, d))]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: selectedStatus,
						onChange: (e) => setSelectedStatus(e.target.value),
						className: "h-8 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground cursor-pointer",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "all",
								children: "All Statuses"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "ACTIVE",
								children: "Active"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "CONFIRMED",
								children: "Confirmed"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "INVITED",
								children: "Invited"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "PROBATION",
								children: "Probation"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-2xl border border-border bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm",
				children: loading && executives.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-8 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-full rounded-xl" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-full rounded-xl" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-full rounded-xl" })
					]
				}) : executives.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-16 text-center space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-12 w-12 place-items-center rounded-xl bg-amber-500/10 text-amber-400 mx-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-6 w-6" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-display text-base font-semibold text-foreground",
							children: "No Executives Found"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground max-w-sm mx-auto",
							children: "No executive leadership records match your query. Add your company's CEO, CTO, CFO and board members."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: openCreate,
							className: "mt-2 text-xs bg-amber-600 hover:bg-amber-500 text-white cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5 mr-1" }), " Add First Executive"]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-xs text-left",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border/80 bg-accent/20 text-muted-foreground font-semibold",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Executive Leader"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Corporate Title"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Division / Board"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Employee ID"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-right",
									children: "Actions"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border/40",
							children: executives.map((exec) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-accent/30 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-300 font-bold border border-amber-500/30",
												children: exec.fullName.slice(0, 2).toUpperCase()
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-foreground",
												children: exec.fullName
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-muted-foreground",
												children: exec.email
											})] })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: "bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px] font-semibold",
											children: exec.designation || "Executive Officer"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium text-foreground",
											children: exec.department || "Executive Board"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-mono font-medium text-muted-foreground",
										children: exec.employeeId
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: exec.status === "ACTIVE" || exec.status === "CONFIRMED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20",
											children: exec.status || "CONFIRMED"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
											asChild: true,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "icon",
												className: "h-7 w-7 cursor-pointer",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "h-3.5 w-3.5" })
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
											align: "end",
											className: "text-xs",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => openEdit(exec),
													className: "gap-2 cursor-pointer",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "h-3.5 w-3.5" }), " Edit Details"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => handleResendInvite(exec.id),
													className: "gap-2 cursor-pointer",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5" }), " Resend Invitation"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => handleResetPassword(exec.id),
													className: "gap-2 cursor-pointer",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), " Reset Password"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => handleActivate(exec.id),
													className: "gap-2 cursor-pointer",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-3.5 w-3.5" }), " Activate Account"]
												})
											]
										})] })
									})
								]
							}, exec.id))
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: dialogOpen,
				onOpenChange: setDialogOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-4 w-4 text-amber-400" }), editingExecutive ? "Edit Executive Profile" : "Add Executive Leader"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs",
							children: "Configure C-suite corporate title, governance oversight, and leadership records."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3.5 py-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-[11px] font-semibold text-muted-foreground",
									children: "Full Name *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: formData.fullName,
									onChange: (e) => setFormData({
										...formData,
										fullName: e.target.value
									}),
									placeholder: "e.g. Eleanor Vance",
									className: "mt-1 h-8 text-xs"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-[11px] font-semibold text-muted-foreground",
									children: "Corporate Email *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "email",
									value: formData.email,
									onChange: (e) => setFormData({
										...formData,
										email: e.target.value
									}),
									placeholder: "e.g. eleanor.vance@company.com",
									className: "mt-1 h-8 text-xs"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-[11px] font-semibold text-muted-foreground",
										children: "Phone"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formData.phone,
										onChange: (e) => setFormData({
											...formData,
											phone: e.target.value
										}),
										placeholder: "+1 555-0811",
										className: "mt-1 h-8 text-xs"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-[11px] font-semibold text-muted-foreground",
										children: "Employee ID"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formData.employeeId,
										onChange: (e) => setFormData({
											...formData,
											employeeId: e.target.value
										}),
										placeholder: "EXEC-902143",
										className: "mt-1 h-8 text-xs font-mono"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-[11px] font-semibold text-muted-foreground",
									children: "Corporate Title *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: formData.designation,
										onChange: (e) => setFormData({
											...formData,
											designation: e.target.value
										}),
										className: "w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground cursor-pointer",
										children: EXECUTIVE_TITLE_OPTIONS.map((title) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: title,
											children: title
										}, title))
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formData.designation,
										onChange: (e) => setFormData({
											...formData,
											designation: e.target.value
										}),
										placeholder: "Or type custom executive title",
										className: "h-8 text-xs"
									})]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-[11px] font-semibold text-muted-foreground",
										children: "Division / Board"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formData.department,
										onChange: (e) => setFormData({
											...formData,
											department: e.target.value
										}),
										placeholder: "Executive Board",
										className: "mt-1 h-8 text-xs"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-[11px] font-semibold text-muted-foreground",
										children: "Joining Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: formData.joiningDate,
										onChange: (e) => setFormData({
											...formData,
											joiningDate: e.target.value
										}),
										className: "mt-1 h-8 text-xs"
									})] })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setDialogOpen(false),
							className: "text-xs cursor-pointer",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							disabled: submitting,
							onClick: handleSave,
							className: "text-xs bg-amber-600 hover:bg-amber-500 text-white cursor-pointer",
							children: submitting ? "Saving..." : editingExecutive ? "Update Executive Profile" : "Create & Send Invite"
						})] })
					]
				})
			})
		]
	});
}
//#endregion
export { ExecutivesPage, ExecutivesPage as default };
