import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, Gt as Lock, Qn as EllipsisVertical, Vt as Mail, er as Download, ht as Plus, on as Laptop, q as ShieldCheck, st as RotateCcw, x as UserCheck, xt as Pen } from "../_libs/lucide-react.mjs";
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
//#region node_modules/.nitro/vite/services/ssr/assets/ItAdminPage-BCk62VFD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ItAdminPage() {
	const dispatch = useAppDispatch();
	const { employees, loading, submitting } = useAppSelector((state) => state.employees);
	const [q, setQ] = (0, import_react.useState)("");
	const debouncedQ = useDebounce(q, 300);
	const [selectedDept, setSelectedDept] = (0, import_react.useState)("all");
	const [selectedStatus, setSelectedStatus] = (0, import_react.useState)("all");
	const [dialogOpen, setDialogOpen] = (0, import_react.useState)(false);
	const [editingAdmin, setEditingAdmin] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)({
		fullName: "",
		email: "",
		phone: "",
		department: "Information Technology",
		designation: "Senior Systems Administrator",
		joiningDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		employeeId: "",
		shift: "General"
	});
	const [deleteAdmin, setDeleteAdmin] = (0, import_react.useState)(null);
	const [deactivateAdmin, setDeactivateAdmin] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		dispatch(fetchEmployees());
	}, [dispatch]);
	const itAdmins = (0, import_react.useMemo)(() => {
		return employees.filter((emp) => {
			const isRoleMatch = emp.role === "it_admin";
			const deptLower = (emp.department || "").toLowerCase();
			const desigLower = (emp.designation || "").toLowerCase();
			const isDeptOrDesigMatch = deptLower.includes("it") || deptLower.includes("information technology") || deptLower.includes("infrastructure") || deptLower.includes("devops") || deptLower.includes("security") || desigLower.includes("systems administrator") || desigLower.includes("it admin") || desigLower.includes("devops") || desigLower.includes("network engineer");
			if (!(isRoleMatch || isDeptOrDesigMatch)) return false;
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
			if (d.includes("it") || d.includes("tech") || d.includes("infra") || d.includes("security")) set.add(e.department);
		});
		set.add("Information Technology");
		set.add("Cloud & Infrastructure");
		set.add("Cyber Security");
		return Array.from(set);
	}, [employees]);
	const activeCount = itAdmins.filter((a) => a.status === "ACTIVE" || a.status === "CONFIRMED").length;
	const pendingCount = itAdmins.filter((a) => a.status === "INVITED" || a.status === "PROBATION").length;
	function openCreate() {
		setEditingAdmin(null);
		setFormData({
			fullName: "",
			email: "",
			phone: "",
			department: "Information Technology",
			designation: "Senior Systems Administrator",
			joiningDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			employeeId: `IT-${Math.floor(1e5 + Math.random() * 9e5)}`,
			shift: "General"
		});
		setDialogOpen(true);
	}
	function openEdit(admin) {
		setEditingAdmin(admin);
		setFormData({
			fullName: admin.fullName,
			email: admin.email,
			phone: admin.phone || "",
			department: admin.department || "Information Technology",
			designation: admin.designation || "Senior Systems Administrator",
			joiningDate: admin.joiningDate || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			employeeId: admin.employeeId || "",
			shift: admin.shift || "General"
		});
		setDialogOpen(true);
	}
	async function handleSave() {
		if (!formData.fullName.trim() || !formData.email.trim()) return toast.error("Full name and email are required");
		const names = formData.fullName.trim().split(/\s+/);
		const first_name = names[0] || "";
		const last_name = names.slice(1).join(" ") || " ";
		if (editingAdmin) {
			const result = await dispatch(updateEmployee({
				id: editingAdmin.id,
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
				toast.success("IT Administrator updated successfully");
				setDialogOpen(false);
				dispatch(fetchEmployees());
			} else toast.error(getRejectMessage(result.payload, "Failed to update IT administrator"));
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
				employee_id: formData.employeeId || `IT-${Math.floor(1e5 + Math.random() * 9e5)}`,
				employment_type: "FULL_TIME",
				employment_status: "PROBATION",
				role: "it_admin",
				shift: formData.shift
			}));
			if (createEmployee.fulfilled.match(result)) {
				toast.success("IT Administrator created and invitation sent");
				setDialogOpen(false);
				dispatch(fetchEmployees());
			} else toast.error(getRejectMessage(result.payload, "Failed to create IT administrator"));
		}
	}
	async function handleResendInvite(id) {
		const res = await dispatch(resendEmployeeInvite(id));
		if (resendEmployeeInvite.fulfilled.match(res)) toast.success("Invitation email resent successfully");
		else toast.error(getRejectMessage(res.payload, "Failed to resend invite"));
	}
	async function handleResetPassword(id) {
		if (!confirm("Send temporary password reset instructions to this administrator?")) return;
		const res = await dispatch(resetEmployeePassword(id));
		if (resetEmployeePassword.fulfilled.match(res)) toast.success("Password reset instructions sent");
		else toast.error(getRejectMessage(res.payload, "Failed to reset password"));
	}
	async function handleActivate(id) {
		const res = await dispatch(activateEmployee(id));
		if (activateEmployee.fulfilled.match(res)) {
			toast.success("IT Administrator account activated");
			dispatch(fetchEmployees());
		} else toast.error(getRejectMessage(res.payload, "Failed to activate"));
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 text-left",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "IT Administrators",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => exportEmployeesCsv(itAdmins),
						disabled: itAdmins.length === 0,
						className: "gap-1.5 text-xs h-9 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), " Export CSV"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: openCreate,
						className: "gap-1.5 text-xs h-9 bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add IT Admin"]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-cyan-500/20 bg-card/60 p-4 backdrop-blur-md shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total IT Admins" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-2 rounded-lg bg-cyan-500/10 text-cyan-400",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Laptop, { className: "h-4 w-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-2xl font-bold mt-2 text-foreground",
								children: itAdmins.length
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground mt-0.5",
								children: "Configured Technical Leads"
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
								children: "Active Operational Access"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-amber-500/20 bg-card/60 p-4 backdrop-blur-md shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pending Setup" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-2 rounded-lg bg-amber-500/10 text-amber-400",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-2xl font-bold mt-2 text-amber-400",
								children: pendingCount
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground mt-0.5",
								children: "Invited / Onboarding Status"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-blue-500/20 bg-card/60 p-4 backdrop-blur-md shadow-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Security & Systems" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-2 rounded-lg bg-blue-500/10 text-blue-400",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-2xl font-bold mt-2 text-foreground",
								children: departments.length
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground mt-0.5",
								children: "Active Technical Units"
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
						placeholder: "Search IT admin by name, email, employee ID...",
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
							children: "All Departments"
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
				children: loading && itAdmins.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-8 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-full rounded-xl" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-full rounded-xl" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-full rounded-xl" })
					]
				}) : itAdmins.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-16 text-center space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-12 w-12 place-items-center rounded-xl bg-cyan-500/10 text-cyan-400 mx-auto",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Laptop, { className: "h-6 w-6" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "font-display text-base font-semibold text-foreground",
							children: "No IT Administrators Found"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground max-w-sm mx-auto",
							children: "No technical staff match your query. Add your organization's IT specialists and systems engineers."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: openCreate,
							className: "mt-2 text-xs bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5 mr-1" }), " Add First IT Admin"]
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
									children: "Administrator"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Employee ID"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Department & Designation"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Access Level"
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
							children: itAdmins.map((admin) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-accent/30 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-300 font-bold border border-cyan-500/30",
												children: admin.fullName.slice(0, 2).toUpperCase()
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-foreground",
												children: admin.fullName
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-muted-foreground",
												children: admin.email
											})] })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-mono font-medium text-muted-foreground",
										children: admin.employeeId
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium text-foreground",
											children: admin.designation || "Systems Administrator"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground",
											children: admin.department || "IT"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-[10px] font-semibold",
											children: "System Admin"
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: admin.status === "ACTIVE" || admin.status === "CONFIRMED" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20",
											children: admin.status || "INVITED"
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
													onClick: () => openEdit(admin),
													className: "gap-2 cursor-pointer",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "h-3.5 w-3.5" }), " Edit Details"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => handleResendInvite(admin.id),
													className: "gap-2 cursor-pointer",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5" }), " Resend Invitation"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => handleResetPassword(admin.id),
													className: "gap-2 cursor-pointer",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), " Reset Password"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
													onClick: () => handleActivate(admin.id),
													className: "gap-2 cursor-pointer",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-3.5 w-3.5" }), " Activate Account"]
												})
											]
										})] })
									})
								]
							}, admin.id))
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
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Laptop, { className: "h-4 w-4 text-cyan-400" }), editingAdmin ? "Edit IT Administrator" : "Add IT Administrator"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs",
							children: "Configure technical credentials and system administration access for this staff member."
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
									placeholder: "e.g. Alex Morgan",
									className: "mt-1 h-8 text-xs"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-[11px] font-semibold text-muted-foreground",
									children: "Email Address *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "email",
									value: formData.email,
									onChange: (e) => setFormData({
										...formData,
										email: e.target.value
									}),
									placeholder: "e.g. alex.morgan@company.com",
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
										placeholder: "+1 555-0192",
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
										placeholder: "IT-102934",
										className: "mt-1 h-8 text-xs font-mono"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-[11px] font-semibold text-muted-foreground",
										children: "Department"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formData.department,
										onChange: (e) => setFormData({
											...formData,
											department: e.target.value
										}),
										placeholder: "Information Technology",
										className: "mt-1 h-8 text-xs"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-[11px] font-semibold text-muted-foreground",
										children: "Designation"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formData.designation,
										onChange: (e) => setFormData({
											...formData,
											designation: e.target.value
										}),
										placeholder: "Senior Systems Administrator",
										className: "mt-1 h-8 text-xs"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
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
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-[11px] font-semibold text-muted-foreground",
										children: "Work Shift"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: formData.shift,
										onChange: (e) => setFormData({
											...formData,
											shift: e.target.value
										}),
										className: "mt-1 w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-foreground cursor-pointer",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "General",
												children: "General (9AM - 6PM)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Morning",
												children: "Morning Shift"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Night",
												children: "Night On-Call"
											})
										]
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
							className: "text-xs bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer",
							children: submitting ? "Saving..." : editingAdmin ? "Update Administrator" : "Create & Send Invite"
						})] })
					]
				})
			})
		]
	});
}
//#endregion
export { ItAdminPage, ItAdminPage as default };
