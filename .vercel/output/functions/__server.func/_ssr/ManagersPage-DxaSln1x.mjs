import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, Br as Calendar, Bt as MapPin, Cr as CircleCheckBig, Dr as ChevronRight, J as ShieldAlert, Jn as Eye, Kr as Building, Ln as FileText, Nn as FolderOpen, Or as ChevronLeft, Pn as FolderKanban, Rn as FileSpreadsheet, S as Upload, Sr as CircleCheck, Tr as CircleAlert, Vt as Mail, Zn as Ellipsis, _ as UserPlus, _t as Plane, ci as ArrowUpDown, er as Download, h as User, it as Scale, k as Trash2, m as UsersRound, oi as Award, p as Users, pr as Clock, v as UserRoundCheck, vr as CircleX, vt as Phone, x as UserCheck, xt as Pen } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { n as useAppSelector, t as useAppDispatch } from "./hooks-BpVIWXzj.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Progress } from "./progress-ZynOkOPX.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as apiInstance } from "./apiInstance-C5A0vaLH.mjs";
import { D as clearSelectedManager, G as importManagers, I as fetchManagerById, J as labelFor, K as initManagerForm, L as fetchManagers, R as fmtDate, S as buildCSV, U as getVisiblePages, V as getDepartmentLabel, X as mapApiFieldErrors, b as applySorting, ct as updateManager, d as MANAGER_FORM_EMPLOYMENT_TYPE_OPTIONS, dt as validatePhone, f as MANAGER_FORM_WORK_LOCATION_OPTIONS, h as STATUS_OPTIONS, i as DEPARTMENTS, j as deleteManager, k as createManager, l as EMPLOYMENT_TYPE_OPTIONS, lt as validateEmail, m as SHIFT_OPTIONS, nt as resolveDepartmentValue, p as SHIFTS, r as DEFAULT_PERMISSIONS, rt as setManagerForm, t as DEFAULT_FILTERS, tt as resetManagerForm, u as GENDER_OPTIONS, ut as validateManagerForm, x as avatarHue, y as applyFilters, z as fmtRelative } from "./departmentsSlice-BOlsHBgC.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { t as ScrollArea } from "./scroll-area-BlnbM3_c.mjs";
import { a as DropdownMenuSeparator, i as DropdownMenuLabel, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-DXMm4jWj.mjs";
import { r as PageHeader } from "./DashboardShell-DIr27KpW.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { a as SheetTitle, i as SheetHeader, n as SheetContent, t as Sheet } from "./sheet-3YlcNW_l.mjs";
import { n as CardContent, t as Card } from "./card-CkAivaVl.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DJOO1b-0.mjs";
import { t as Checkbox } from "./checkbox-BhwBotB1.mjs";
import { n as useManagers, t as OFFICES } from "./useManagers-CxQEbRHq.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-BCrgGGf7.mjs";
import { t as DepartmentSelectContent } from "./DepartmentSelectContent-BboI2aL5.mjs";
import { t as Loader } from "./Loader-Cc5dgb_b.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ManagersPage-DxaSln1x.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ManagerStatsCards({ managers }) {
	const totalManagers = managers.length;
	const activeManagers = managers.filter((m) => m.status === "active").length;
	const departmentsCount = new Set(managers.map((m) => m.department)).size;
	const totalReporting = managers.reduce((acc, m) => acc + (m.teamSize || 0), 0);
	const avgTeamSize = totalManagers > 0 ? Math.round(totalReporting / totalManagers) : 0;
	const managersOnLeave = managers.filter((m) => m.status === "on_leave").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-6 grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 2xl:grid-cols-6",
		children: [
			{
				label: "Total Managers",
				value: totalManagers,
				icon: Users,
				color: "from-blue-500/20 to-indigo-500/20 text-blue-500 border-blue-500/20"
			},
			{
				label: "Active Managers",
				value: activeManagers,
				icon: UserCheck,
				color: "from-emerald-500/20 to-teal-500/20 text-emerald-500 border-emerald-500/20"
			},
			{
				label: "Departments",
				value: departmentsCount,
				icon: FolderKanban,
				color: "from-amber-500/20 to-orange-500/20 text-amber-500 border-amber-500/20"
			},
			{
				label: "Employees Reporting",
				value: totalReporting,
				icon: UsersRound,
				color: "from-purple-500/20 to-pink-500/20 text-purple-500 border-purple-500/20"
			},
			{
				label: "Avg. Team Size",
				value: avgTeamSize,
				icon: Scale,
				color: "from-cyan-500/20 to-sky-500/20 text-cyan-500 border-cyan-500/20"
			},
			{
				label: "Managers On Leave",
				value: managersOnLeave,
				icon: Plane,
				color: "from-rose-500/20 to-red-500/20 text-rose-500 border-rose-500/20"
			}
		].map((stat, i) => {
			const Icon = stat.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "group relative min-w-0 overflow-hidden rounded-2xl border border-border/80 bg-card/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-md hover:bg-card/60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "flex h-full min-h-[110px] flex-col justify-between p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "min-w-0 flex-1 truncate text-xs font-medium text-muted-foreground",
							children: stat.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br border ${stat.color}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-bold tracking-tight text-foreground",
							children: stat.value
						})
					})]
				})]
			}, i);
		})
	});
}
function ManagersTable({ managers, selectedIds, onSelectAll, onSelectRow, onView, onEdit, onDelete, sortField, sortDir, onSort }) {
	const allSelected = (0, import_react.useMemo)(() => {
		return managers.length > 0 && selectedIds.length === managers.length;
	}, [managers, selectedIds]);
	const isSomeSelected = (0, import_react.useMemo)(() => {
		return selectedIds.length > 0 && selectedIds.length < managers.length;
	}, [managers, selectedIds]);
	const statusColors = {
		active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
		probation: "bg-amber-500/10 text-amber-500 border-amber-500/20",
		inactive: "bg-rose-500/10 text-rose-500 border-rose-500/20",
		on_leave: "bg-blue-500/10 text-blue-500 border-blue-500/20"
	};
	const statusLabels = {
		active: "Active",
		probation: "Probation",
		inactive: "Inactive",
		on_leave: "On Leave"
	};
	const SortHeader = ({ field, children }) => {
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "ghost",
			size: "sm",
			onClick: () => onSort(field),
			className: "-ml-3 h-8 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:bg-muted/50",
			children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpDown, { className: "ml-1.5 h-3.5 w-3.5" })]
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "w-full max-w-full overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-[1100px] caption-bottom text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
				className: "bg-muted/10 border-b border-border/60",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "w-[50px] pl-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
							checked: allSelected ? true : isSomeSelected ? "indeterminate" : false,
							onCheckedChange: (checked) => onSelectAll(!!checked),
							"aria-label": "Select all managers",
							className: "cursor-pointer"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "min-w-[200px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHeader, {
							field: "fullName",
							children: "Full Name"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
						children: "Employee ID"
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
						children: "Designation"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "min-w-[110px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHeader, {
							field: "teamSize",
							children: "Team Size"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
						children: "Reporting To"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
						children: "Office Location"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "min-w-[140px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHeader, {
							field: "joiningDate",
							children: "Joining Date"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
						children: "Employment"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "min-w-[110px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHeader, {
							field: "status",
							children: "Status"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "min-w-[130px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SortHeader, {
							field: "lastActive",
							children: "Last Active"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "w-[80px] text-right pr-4",
						children: "Actions"
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: managers.map((m) => {
				const displayName = m.fullName || "Manager";
				const hue = avatarHue(displayName);
				const initials = displayName.split(" ").map((n) => n[0]).slice(0, 2).join("");
				const isSelected = selectedIds.includes(m.id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
					className: `group/row border-b border-border/50 transition-colors hover:bg-muted/15 cursor-pointer ${isSelected ? "bg-muted/10" : ""}`,
					onClick: () => onView(m),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "pl-4 py-3",
							onClick: (e) => e.stopPropagation(),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
								checked: isSelected,
								onCheckedChange: (checked) => onSelectRow(m.id, !!checked),
								"aria-label": `Select ${m.fullName}`,
								className: "cursor-pointer"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "py-3 font-medium text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [m.profileImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: m.profileImage,
									alt: m.fullName,
									className: "h-9 w-9 rounded-xl object-cover border border-border/80 shadow-sm"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold text-white shadow-inner",
									style: { background: `linear-gradient(135deg, hsl(${hue}, 65%, 55%), hsl(${(hue + 45) % 360}, 70%, 45%))` },
									children: initials
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold text-sm truncate hover:underline",
										children: m.fullName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted-foreground truncate",
										children: m.email
									})]
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "py-3 text-xs font-mono font-medium text-muted-foreground",
							children: m.employeeId
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "py-3 text-xs font-semibold text-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "h-3.5 w-3.5 text-muted-foreground/60" }), m.department]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "py-3 text-xs text-muted-foreground",
							children: m.designation
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "py-3 text-xs text-foreground font-semibold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3.5 w-3.5 text-muted-foreground/50" }),
									m.teamSize,
									" reports"
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "py-3 text-xs text-muted-foreground",
							children: m.reportingManagerName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "py-3 text-xs text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1 truncate max-w-[120px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5 text-muted-foreground/50" }), m.office]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "py-3 text-xs text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5 text-muted-foreground/50" }), fmtDate(m.joiningDate)]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "py-3 text-xs text-muted-foreground",
							children: labelFor(m.employmentType, EMPLOYMENT_TYPE_OPTIONS)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: `px-2 py-0.5 text-[10px] font-semibold border ${statusColors[m.status]}`,
								children: statusLabels[m.status]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "py-3 text-xs text-muted-foreground",
							children: fmtRelative(m.lastActive)
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
										onClick: () => onView(m),
										className: "text-xs flex items-center gap-2 cursor-pointer py-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5 text-muted-foreground" }), "View Profile"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: () => onEdit(m),
										className: "text-xs flex items-center gap-2 cursor-pointer py-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "h-3.5 w-3.5 text-muted-foreground" }), "Edit Manager"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
										onClick: () => onDelete(m),
										className: "text-xs flex items-center gap-2 cursor-pointer py-2 text-rose-500 hover:bg-rose-500/10 focus:text-rose-500",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), "Delete Manager"]
									})
								]
							})] })
						})
					]
				}, m.id);
			}) })]
		})
	});
}
function ManagersListContent({ loading, submitting, error, managers, paginatedManagers, filteredCount, selectedIds, sortField, sortDir, onRetry, onAdd, onClearFilters, onSelectAll, onSelectRow, onView, onEdit, onDelete, onSort, pagination }) {
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loader, {
		variant: "panel",
		label: "Loading managers...",
		skeletonRows: 6
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[280px] flex-col items-center justify-center p-12 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium text-destructive",
				children: "Failed to load managers"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-sm text-sm text-muted-foreground",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: onRetry,
				className: "mt-5",
				children: "Retry"
			})
		]
	});
	if (filteredCount === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[280px] flex-col items-center justify-center p-12 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-muted/60 text-muted-foreground shadow-sm",
				children: managers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-6 w-6" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { className: "h-6 w-6" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
				className: "text-lg font-semibold text-foreground",
				children: "No Managers Found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-sm text-sm text-muted-foreground",
				children: managers.length === 0 ? "Start by creating your first manager to seed the directory tree." : "No listings match your search criteria. Try modifying your filters."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: managers.length === 0 ? onAdd : onClearFilters,
				className: "mt-5",
				children: managers.length === 0 ? "Add Manager" : "Clear Filters"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [
			submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loader, {
				variant: "overlay",
				label: "Saving changes..."
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManagersTable, {
				managers: paginatedManagers,
				selectedIds,
				onSelectAll,
				onSelectRow,
				onView,
				onEdit,
				onDelete,
				sortField,
				sortDir,
				onSort
			}),
			pagination
		]
	});
}
function ManagerFormDialog({ open, onOpenChange, isEdit = false, manager, detailLoading = false, detailError = null, existingManagers = [], onSubmit }) {
	const dispatch = useAppDispatch();
	const form = useAppSelector((state) => state.managers.managerForm);
	const selectedManagerForm = useAppSelector((state) => state.managers.selectedManagerForm);
	const submitting = useAppSelector((state) => state.managers.submitting);
	const [formErrors, setFormErrors] = (0, import_react.useState)({});
	const departmentValue = (0, import_react.useMemo)(() => resolveDepartmentValue(form.department), [form.department]);
	const reportingManagerOptions = (0, import_react.useMemo)(() => {
		const options = existingManagers.filter((m) => !manager || m.id !== manager.id);
		const reportingId = form.reporting_to;
		if (reportingId && !options.some((m) => m.id === reportingId)) return [{
			id: reportingId,
			fullName: manager?.reportingManagerName || existingManagers.find((m) => m.id === reportingId)?.fullName || "Reporting Manager",
			designation: ""
		}, ...options];
		return options;
	}, [
		existingManagers,
		form.reporting_to,
		manager
	]);
	const officeOptions = (0, import_react.useMemo)(() => {
		if (form.branch && !OFFICES.includes(form.branch)) return [form.branch, ...OFFICES];
		return OFFICES;
	}, [form.branch]);
	const shiftOptions = (0, import_react.useMemo)(() => {
		if (form.shift && !SHIFT_OPTIONS.some((opt) => opt.value === form.shift)) return [{
			value: form.shift,
			label: form.shift
		}, ...SHIFT_OPTIONS];
		return SHIFT_OPTIONS;
	}, [form.shift]);
	const genderOptions = (0, import_react.useMemo)(() => {
		if (form.gender && !GENDER_OPTIONS.some((opt) => opt.value === form.gender)) {
			const label = form.gender.charAt(0).toUpperCase() + form.gender.slice(1).replace(/_/g, " ");
			return [{
				value: form.gender,
				label
			}, ...GENDER_OPTIONS];
		}
		return GENDER_OPTIONS;
	}, [form.gender]);
	const workLocationOptions = (0, import_react.useMemo)(() => {
		if (form.work_location && !MANAGER_FORM_WORK_LOCATION_OPTIONS.some((opt) => opt.value === form.work_location)) {
			const label = form.work_location.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
			return [{
				value: form.work_location,
				label
			}, ...MANAGER_FORM_WORK_LOCATION_OPTIONS];
		}
		return MANAGER_FORM_WORK_LOCATION_OPTIONS;
	}, [form.work_location]);
	import_react.useEffect(() => {
		if (!open) return;
		setFormErrors({});
		if (!isEdit) {
			dispatch(resetManagerForm());
			return;
		}
		if (detailLoading || !selectedManagerForm) return;
		dispatch(initManagerForm(selectedManagerForm));
	}, [
		dispatch,
		detailLoading,
		isEdit,
		open,
		selectedManagerForm
	]);
	const updateField = (field, value) => {
		dispatch(setManagerForm({ [field]: value }));
		if (formErrors[field]) setFormErrors((prev) => {
			const next = { ...prev };
			delete next[field];
			return next;
		});
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		const validation = validateManagerForm(form, existingManagers, isEdit, manager?.id);
		if (!validation.valid) {
			setFormErrors(validation.errors);
			toast.error("Please fix the highlighted fields");
			return;
		}
		const result = await onSubmit();
		if (!result.success) {
			setFormErrors(result.fieldErrors);
			if (result.message) toast.error(result.message);
			return;
		}
		setFormErrors({});
		onOpenChange(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border-border bg-card p-6 md:max-w-4xl",
			onPointerDownOutside: (e) => e.preventDefault(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "text-xl font-bold",
				children: isEdit ? "✏️ Edit Manager" : "➕ Add Manager"
			}) }), isEdit && detailLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loader, {
				variant: "panel",
				label: "Loading manager details...",
				className: "py-12"
			}) : isEdit && detailError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "py-12 text-center text-sm text-destructive",
				children: detailError
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-6 py-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Personal Information"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "first_name",
											className: "after:content-['*'] after:text-destructive after:ml-0.5",
											children: "First Name"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "first_name",
											value: form.first_name,
											onChange: (e) => updateField("first_name", e.target.value),
											placeholder: "e.g. John",
											className: formErrors.first_name ? "border-destructive" : ""
										}),
										formErrors.first_name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-destructive",
											children: formErrors.first_name
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "last_name",
											className: "after:content-['*'] after:text-destructive after:ml-0.5",
											children: "Last Name"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "last_name",
											value: form.last_name,
											onChange: (e) => updateField("last_name", e.target.value),
											placeholder: "e.g. Doe",
											className: formErrors.last_name ? "border-destructive" : ""
										}),
										formErrors.last_name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-destructive",
											children: formErrors.last_name
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "personal_email",
											className: "after:content-['*'] after:text-destructive after:ml-0.5",
											children: "Email Address"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "personal_email",
											type: "email",
											value: form.personal_email,
											onChange: (e) => {
												const email = e.target.value;
												dispatch(setManagerForm({
													personal_email: email,
													company_email: email
												}));
											},
											placeholder: "e.g. john.doe@ofc360.com",
											className: formErrors.personal_email ? "border-destructive" : ""
										}),
										formErrors.personal_email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-destructive",
											children: formErrors.personal_email
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "phone",
											className: "after:content-['*'] after:text-destructive after:ml-0.5",
											children: "Phone Number"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "phone",
											value: form.phone,
											onChange: (e) => updateField("phone", e.target.value),
											placeholder: "e.g. +91 98765 43210",
											className: formErrors.phone ? "border-destructive" : ""
										}),
										formErrors.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-destructive",
											children: formErrors.phone
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "date_of_birth",
											className: "after:content-['*'] after:text-destructive after:ml-0.5",
											children: "Date of Birth"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "date_of_birth",
											type: "date",
											value: form.date_of_birth,
											onChange: (e) => updateField("date_of_birth", e.target.value),
											className: formErrors.date_of_birth ? "border-destructive" : ""
										}),
										formErrors.date_of_birth && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-destructive",
											children: formErrors.date_of_birth
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "gender",
											className: "after:content-['*'] after:text-destructive after:ml-0.5",
											children: "Gender"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.gender || void 0,
											onValueChange: (val) => updateField("gender", val),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												id: "gender",
												className: formErrors.gender ? "border-destructive" : "",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Gender" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: genderOptions.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: g.value,
												children: g.label
											}, g.value)) })]
										}, `gender-${form.gender}`),
										formErrors.gender && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-destructive",
											children: formErrors.gender
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "blood_group",
										className: "after:content-['*'] after:text-destructive after:ml-0.5",
										children: "Blood Group"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "blood_group",
										value: form.blood_group,
										onChange: (e) => updateField("blood_group", e.target.value),
										placeholder: "e.g. A+"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "marital_status",
										className: "after:content-['*'] after:text-destructive after:ml-0.5",
										children: "Marital Status"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "marital_status",
										value: form.marital_status,
										onChange: (e) => updateField("marital_status", e.target.value),
										placeholder: "e.g. Single"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 md:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "profile_photo_url",
										children: "Profile Image URL (Optional)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "profile_photo_url",
										value: form.profile_photo_url,
										onChange: (e) => updateField("profile_photo_url", e.target.value),
										placeholder: "https://images.unsplash.com/... or leave blank for initials"
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
							children: "Job Information"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "department",
											className: "after:content-['*'] after:text-destructive after:ml-0.5",
											children: "Department"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: departmentValue,
											onValueChange: (val) => updateField("department", val),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												id: "department",
												className: formErrors.department ? "border-destructive" : "",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Department" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepartmentSelectContent, {
												selectedValue: departmentValue ?? form.department,
												extraValues: form.department ? [form.department] : []
											}, `${manager?.id ?? "new"}-${departmentValue ?? form.department}`)]
										}, `department-${departmentValue ?? form.department}`),
										formErrors.department && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-destructive",
											children: formErrors.department
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "designation",
											className: "after:content-['*'] after:text-destructive after:ml-0.5",
											children: "Designation"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "designation",
											value: form.designation,
											onChange: (e) => updateField("designation", e.target.value),
											placeholder: "e.g. Senior Engineering Manager",
											className: formErrors.designation ? "border-destructive" : ""
										}),
										formErrors.designation && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-destructive",
											children: formErrors.designation
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "reporting_to",
										children: "Reporting Manager"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: form.reporting_to || void 0,
										onValueChange: (val) => updateField("reporting_to", val),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "reporting_to",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Reporting Manager" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: reportingManagerOptions.length > 0 ? reportingManagerOptions.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: opt.id,
											children: opt.designation ? `${opt.fullName} (${opt.designation})` : opt.fullName
										}, opt.id)) : null })]
									}, `reporting-${form.reporting_to}`)]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "branch",
											className: "after:content-['*'] after:text-destructive after:ml-0.5",
											children: "Office Location"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.branch || void 0,
											onValueChange: (val) => updateField("branch", val),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												id: "branch",
												className: formErrors.branch ? "border-destructive" : "",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Office" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: officeOptions.map((off) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: off,
												children: off
											}, off)) })]
										}, `branch-${form.branch}`),
										formErrors.branch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-destructive",
											children: formErrors.branch
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "work_location",
											className: "after:content-['*'] after:text-destructive after:ml-0.5",
											children: "Work Location Mode"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: form.work_location || void 0,
											onValueChange: (val) => updateField("work_location", val),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												id: "work_location",
												className: formErrors.work_location ? "border-destructive" : "",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Location Mode" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: workLocationOptions.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: opt.value,
												children: opt.label
											}, opt.value)) })]
										}, `work-location-${form.work_location}`),
										formErrors.work_location && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-destructive",
											children: formErrors.work_location
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "joining_date",
											className: "after:content-['*'] after:text-destructive after:ml-0.5",
											children: "Joining Date"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "joining_date",
											type: "date",
											value: form.joining_date,
											onChange: (e) => updateField("joining_date", e.target.value),
											className: formErrors.joining_date ? "border-destructive" : ""
										}),
										formErrors.joining_date && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-destructive",
											children: formErrors.joining_date
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "employment_type",
										children: "Employment Type"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: form.employment_type || void 0,
										onValueChange: (val) => updateField("employment_type", val),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "employment_type",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Employment Type" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: MANAGER_FORM_EMPLOYMENT_TYPE_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: opt.value,
											children: opt.label
										}, opt.value)) })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "shift",
										children: "Work Shift"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: form.shift || void 0,
										onValueChange: (val) => updateField("shift", val),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "shift",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Work Shift" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: shiftOptions.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: opt.value,
											children: opt.label
										}, opt.value)) })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "ctc",
										children: "CTC (Optional Annual USD)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "ctc",
										type: "number",
										value: form.ctc || "",
										onChange: (e) => updateField("ctc", Number(e.target.value) || 0),
										placeholder: "e.g. 120000"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "employment_status",
										children: "Employment Status"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: form.employment_status || void 0,
										onValueChange: (val) => {
											dispatch(setManagerForm({
												employment_status: val,
												probation_period_months: val === "PROBATION" ? 3 : 0
											}));
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											id: "employment_status",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Status" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: STATUS_OPTIONS.map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: status.value,
											children: status.label
										}, status.value)) })]
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
							children: "Permissions & Access Settings"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
							children: Object.keys(form.permissions).map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center space-x-2 rounded-xl border border-border/40 p-3 bg-muted/20 hover:bg-muted/40 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
									id: key,
									checked: form.permissions[key],
									onCheckedChange: (checked) => updateField("permissions", {
										...form.permissions,
										[key]: !!checked
									}),
									className: "cursor-pointer"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: key,
									className: "text-xs font-medium cursor-pointer leading-tight select-none",
									children: key.charAt(0).toUpperCase() + key.slice(1)
								})]
							}, key))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
						className: "mt-6 flex gap-2 justify-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => onOpenChange(false),
							disabled: submitting,
							className: "rounded-xl border-border bg-card hover:bg-muted/50",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: submitting,
							className: "rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90",
							children: submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loader, {
								label: "Saving...",
								size: "sm",
								className: "text-brand-foreground"
							}) : "Save Manager"
						})]
					})
				]
			}, manager?.id ?? "new-manager")]
		})
	});
}
var STATUS_STYLES = {
	PROBATION: "bg-amber-500/10 text-amber-500 border-amber-500/20",
	CONFIRMED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
	NOTICE_PERIOD: "bg-rose-500/10 text-rose-500 border-rose-500/20"
};
var WORK_LOCATION_LABELS = {
	on_site: "On Site",
	remote: "Remote",
	hybrid: "Hybrid"
};
function getStatusLabel(status) {
	return STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
}
function formatReportingManager(manager) {
	if (!manager.reportingManagerName) return "—";
	if (manager.reportingManagerCode) return `${manager.reportingManagerName} (${manager.reportingManagerCode})`;
	return manager.reportingManagerName;
}
function ManagerProfileDrawer({ open, onOpenChange, manager, loading = false, error = null }) {
	const [documents, setDocuments] = import_react.useState([]);
	const [loadingDocs, setLoadingDocs] = import_react.useState(false);
	import_react.useEffect(() => {
		if (!manager?.id && !manager?.employeeId) return;
		let active = true;
		setLoadingDocs(true);
		apiInstance.get("/documents/employees", { params: {
			employee_id: manager.id || manager.employeeId,
			limit: 10
		} }).then((res) => {
			if (!active) return;
			setDocuments((res.data?.data?.items || res.data?.items || []).map((d) => ({
				name: d.name || d.document_name || "Document.pdf",
				size: d.size || d.file_size || "1.0 MB",
				date: d.date || d.created_at || d.upload_date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
				url: d.url || d.file_url
			})));
		}).catch(() => {
			if (active) setDocuments([]);
		}).finally(() => {
			if (active) setLoadingDocs(false);
		});
		return () => {
			active = false;
		};
	}, [manager?.id, manager?.employeeId]);
	if (!open) return null;
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
			className: "w-full sm:max-w-md md:max-w-lg border-l border-border bg-card/90 backdrop-blur-xl p-0 shadow-2xl flex flex-col h-full",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loader, {
				variant: "panel",
				label: "Loading manager profile...",
				className: "h-full"
			})
		})
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
			className: "w-full sm:max-w-md md:max-w-lg border-l border-border bg-card/90 backdrop-blur-xl p-0 shadow-2xl flex flex-col h-full",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-full items-center justify-center p-6 text-sm text-rose-500",
				children: error
			})
		})
	});
	if (!manager) return null;
	const initials = manager.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("");
	const hue = avatarHue(manager.fullName);
	const activePermissions = Object.entries(manager.permissions).filter(([_, value]) => value).map(([key]) => {
		return key.replace(/([A-Z])/g, " $1").replace(/^can /, "Can ");
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			className: "w-full sm:max-w-md md:max-w-lg border-l border-border bg-card/90 backdrop-blur-xl p-0 shadow-2xl flex flex-col h-full",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, {
				className: "p-6 border-b border-border/60",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [manager.profileImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: manager.profileImage,
						alt: manager.fullName,
						className: "h-16 w-16 rounded-2xl object-cover border border-border shadow-sm"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-16 w-16 items-center justify-center rounded-2xl font-bold text-white shadow-inner text-xl",
						style: { background: `linear-gradient(135deg, hsl(${hue}, 70%, 55%), hsl(${(hue + 40) % 360}, 75%, 45%))` },
						children: initials
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
								className: "text-xl font-bold truncate text-foreground flex items-center gap-2",
								children: manager.fullName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-muted-foreground truncate",
								children: manager.designation
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2 mt-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: `px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[manager.status]}`,
									children: getStatusLabel(manager.status)
								}), manager.managerId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: "px-2 py-0.5 text-xs font-medium",
									children: manager.managerId
								}) : null]
							})
						]
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
				className: "flex-1 p-6 space-y-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 pb-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-4 rounded-2xl border border-border/50 bg-muted/20 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground",
											children: "Email"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-medium truncate text-foreground",
											children: manager.email
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground",
											children: "Phone"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-medium truncate text-foreground",
											children: manager.phone
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground",
											children: "Dept & Office"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs font-medium truncate text-foreground",
											children: [
												getDepartmentLabel(manager.department),
												" · ",
												manager.office
											]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground",
											children: "Joined On"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-medium truncate text-foreground",
											children: fmtDate(manager.joiningDate)
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground",
											children: "Reporting To"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-medium truncate text-foreground",
											children: formatReportingManager(manager)
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground",
											children: "Work Mode"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-medium truncate text-foreground",
											children: WORK_LOCATION_LABELS[manager.workLocation]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRoundCheck, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground",
											children: "Team Size"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs font-medium truncate text-foreground",
											children: [manager.teamSize, " direct reports"]
										})]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border/60 bg-card p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4 w-4 text-brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-sm font-semibold text-foreground",
											children: "Performance Rating"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "outline",
										className: "font-bold text-brand bg-brand/5 border-brand/20",
										children: [manager.performanceScore, "%"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
									value: manager.performanceScore,
									className: "h-2"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground mt-2",
									children: "Based on peer feedback, quarterly objective completions, and team deliverables."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border/50 bg-card p-4 flex flex-col justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 text-xs font-semibold text-foreground mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-emerald-500" }), "Attendance (Month)"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2 text-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "bg-emerald-500/5 rounded-lg p-1.5 border border-emerald-500/10",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-sm font-bold text-emerald-500",
												children: manager.attendanceSummary.present
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[8px] font-medium text-muted-foreground uppercase",
												children: "Present"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "bg-rose-500/5 rounded-lg p-1.5 border border-rose-500/10",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-sm font-bold text-rose-500",
												children: manager.attendanceSummary.absent
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[8px] font-medium text-muted-foreground uppercase",
												children: "Absent"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "bg-amber-500/5 rounded-lg p-1.5 border border-amber-500/10",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-sm font-bold text-amber-500",
												children: manager.attendanceSummary.late
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[8px] font-medium text-muted-foreground uppercase",
												children: "Late"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "bg-blue-500/5 rounded-lg p-1.5 border border-blue-500/10",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "block text-sm font-bold text-blue-500",
												children: manager.attendanceSummary.leave
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[8px] font-medium text-muted-foreground uppercase",
												children: "Leave"
											})]
										})
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border/50 bg-card p-4 flex flex-col justify-between",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 text-xs font-semibold text-foreground mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plane, { className: "h-3.5 w-3.5 text-blue-500" }), "Leave Balances"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-3 gap-1 text-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "bg-blue-500/5 rounded-lg p-1.5 border border-blue-500/10",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "block text-sm font-bold text-blue-500",
													children: [manager.leaveBalance.annual, "d"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[8px] font-medium text-muted-foreground uppercase",
													children: "Annual"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "bg-purple-500/5 rounded-lg p-1.5 border border-purple-500/10",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "block text-sm font-bold text-purple-500",
													children: [manager.leaveBalance.sick, "d"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[8px] font-medium text-muted-foreground uppercase",
													children: "Sick"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "bg-cyan-500/5 rounded-lg p-1.5 border border-cyan-500/10",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "block text-sm font-bold text-cyan-500",
													children: [manager.leaveBalance.casual, "d"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[8px] font-medium text-muted-foreground uppercase",
													children: "Casual"
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[9px] text-muted-foreground text-center mt-2",
										children: "Accrued leave cycles reset annually."
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-3.5 w-3.5" }), " Approved Scope & Permissions"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-1.5",
								children: activePermissions.length > 0 ? activePermissions.map((perm, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: "bg-muted/30 border-border px-2 py-0.5 text-[10px] font-medium",
									children: ["✓ ", perm]
								}, i)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground italic",
									children: "No elevated dashboard permissions active"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" }), " Recent Activity"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-4 relative border-l border-border/80 ml-2 pl-4 py-1",
								children: manager.recentActivity && manager.recentActivity.length > 0 ? manager.recentActivity.map((act) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border border-card bg-brand" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-foreground leading-tight",
											children: act.action
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] text-muted-foreground mt-0.5",
											children: [
												fmtDate(act.timestamp),
												" at ",
												new Date(act.timestamp).toLocaleTimeString([], {
													hour: "2-digit",
													minute: "2-digit"
												})
											]
										})
									]
								}, act.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground italic pl-1",
									children: "No activities logged recently"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
								className: "text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5" }), " Shared & Verified Documents"]
							}), loadingDocs ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "py-4 text-center text-xs text-muted-foreground",
								children: "Loading documents..."
							}) : documents.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2",
								children: documents.map((doc, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/10 hover:bg-muted/20 transition-all duration-200 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-muted-foreground flex-shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-medium text-foreground truncate",
												children: doc.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[9px] text-muted-foreground",
												children: [
													doc.size,
													" • Uploaded ",
													fmtDate(doc.date)
												]
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0",
										children: "Download"
									})]
								}, idx))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center justify-center p-6 border border-dashed border-border/60 rounded-xl bg-muted/5 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-7 w-7 text-muted-foreground/40 mb-1.5" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-medium text-muted-foreground",
										children: "No documents found"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground/70 mt-0.5",
										children: "No verified or uploaded files for this manager."
									})
								]
							})]
						})
					]
				})
			})]
		})
	});
}
function ImportDialog({ open, onOpenChange, existingManagers, submitting = false, onImport }) {
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
		if (droppedFile && (droppedFile.name.endsWith(".csv") || droppedFile.name.endsWith(".xlsx") || droppedFile.name.endsWith(".xls"))) processFile(droppedFile);
		else toast.error("Please upload a CSV or Excel template file");
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
				"employee id": "employeeId",
				"employeeid": "employeeId",
				"first name": "firstName",
				"firstname": "firstName",
				"last name": "lastName",
				"lastname": "lastName",
				"email": "email",
				"phone": "phone",
				"department": "department",
				"designation": "designation",
				"office": "office",
				"status": "status",
				"role": "managerRole",
				"managerrole": "managerRole",
				"reporting manager": "reportingManagerName",
				"reportingmanager": "reportingManagerName",
				"joining date": "joiningDate",
				"joiningdate": "joiningDate",
				"salary": "salary"
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
					if (key) if (key === "salary") draft.salary = val ? parseFloat(val) : void 0;
					else draft[key] = val;
				});
				const rowErrors = [];
				const rowWarnings = [];
				if (!draft.employeeId) rowErrors.push("Employee ID is required");
				if (!draft.firstName) rowErrors.push("First name is required");
				if (!draft.lastName) rowErrors.push("Last name is required");
				if (!draft.email) rowErrors.push("Email is required");
				if (!draft.phone) rowErrors.push("Phone is required");
				if (!draft.department) rowErrors.push("Department is required");
				if (draft.email && !validateEmail(draft.email)) rowErrors.push("Invalid email format");
				if (draft.phone && !validatePhone(draft.phone)) rowWarnings.push("Phone number may be too short");
				if (draft.employeeId) {
					const dupLocal = rows.find((r) => r.data.employeeId === draft.employeeId);
					const dupDb = existingManagers.find((m) => m.employeeId === draft.employeeId);
					if (dupLocal || dupDb) rowErrors.push(`Duplicate Employee ID: ${draft.employeeId}`);
				}
				if (draft.email) {
					const dupLocal = rows.find((r) => r.data.email?.toLowerCase() === draft.email?.toLowerCase());
					const dupDb = existingManagers.find((m) => m.email.toLowerCase() === draft.email?.toLowerCase());
					if (dupLocal || dupDb) rowErrors.push(`Duplicate Email Address: ${draft.email}`);
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
			if (globalError) toast.warning("Validation errors found. Correct them before importing.");
			else toast.success(`Validated ${rows.length} rows. Ready for import.`);
		};
		reader.readAsText(file);
	};
	const handleImport = async () => {
		if (parsedRows.length === 0) {
			toast.error("No valid data parsed to import");
			return;
		}
		if (hasErrors) {
			toast.error("Cannot import with validation errors. Please re-upload a clean file.");
			return;
		}
		const importedManagers = parsedRows.map((r, idx) => {
			const d = r.data;
			const firstName = d.firstName || "Imported";
			const lastName = d.lastName || "User";
			const office = OFFICES.includes(d.office || "") ? d.office : OFFICES[0];
			const deptObj = DEPARTMENTS.find((opt) => opt.value === d.department);
			const department = deptObj ? deptObj.value : DEPARTMENTS[0].value;
			return {
				id: `mgr_imported_${Math.random().toString(36).substr(2, 9)}`,
				managerId: d.employeeId || `MGR-IMP-${idx + 1}`,
				employeeId: d.employeeId || `EMP-IMP-${idx + 1}`,
				firstName,
				lastName,
				fullName: `${firstName} ${lastName}`,
				email: d.email || `imported.${idx}@ofc360.com`,
				phone: d.phone || "+91 99999 99999",
				dob: "1990-01-01",
				gender: "prefer_not_to_say",
				department,
				designation: d.designation || "Manager",
				managerRole: d.managerRole || "team_lead",
				reportingManagerId: null,
				reportingManagerCode: "",
				reportingManagerName: d.reportingManagerName || "None",
				office,
				workLocation: "hybrid",
				joiningDate: d.joiningDate || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
				employmentType: "full_time",
				shift: SHIFTS[0],
				salary: d.salary,
				status: d.status || "active",
				teamSize: 0,
				teamIds: [],
				permissions: { ...DEFAULT_PERMISSIONS },
				lastActive: (/* @__PURE__ */ new Date()).toISOString(),
				attendanceSummary: {
					present: 20,
					absent: 0,
					late: 0,
					leave: 0
				},
				leaveBalance: {
					annual: 12,
					sick: 6,
					casual: 4
				},
				performanceScore: 85,
				recentActivity: [{
					id: `act_imp_${Date.now()}`,
					action: "Imported via CSV upload",
					timestamp: (/* @__PURE__ */ new Date()).toISOString()
				}]
			};
		});
		await onImport(importedManagers);
		toast.success(`Import Successful: ${importedManagers.length} managers added`);
		resetState();
		onOpenChange(false);
	};
	const downloadTemplate = () => {
		const blob = new Blob(["Employee ID,First Name,Last Name,Email,Phone,Department,Designation,Office,Status,Role,Reporting Manager,Joining Date,Salary", "\nEMP-0001,First,Last,first.last@company.com,+91 00000 00000,Engineering,Engineering Manager,Head Office,active,team_lead,Manager Name,2026-01-01,100000"], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute("download", "ofc360_managers_import_template.csv");
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		toast.success("Import template downloaded");
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
					children: "📂 Import Managers Directory"
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border/60 bg-muted/20 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-foreground",
								children: "Upload CSV or Excel Template"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Download our standardized CSV template structure, fill out the employee credentials, and drag and drop it below."
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
								accept: ".csv,.xlsx,.xls",
								className: "hidden"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-12 w-12 rounded-2xl bg-muted group-hover:bg-brand/10 group-hover:text-brand flex items-center justify-center text-muted-foreground transition-colors mb-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-6 w-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-medium text-foreground",
								children: ["Drag & drop your directory spreadsheet, or ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-brand hover:underline",
									children: "browse files"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-1",
								children: "Supports CSV, XLSX, or XLS formats (Max 5MB)"
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
											" Rows Detected"
										]
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: resetState,
									className: "text-xs text-rose-500 hover:bg-rose-500/10 cursor-pointer rounded-lg",
									children: "Remove File"
								})]
							}),
							parsedRows.some((r) => r.errors.length > 0 || r.warnings.length > 0) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-rose-500 font-semibold text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" }), "Validation Concerns Found in Document"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
									className: "max-h-[120px] pr-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
										className: "space-y-1 text-xs text-muted-foreground",
										children: parsedRows.map((row) => {
											if (row.errors.length === 0 && row.warnings.length === 0) return null;
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
												className: "flex gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-semibold text-foreground flex-shrink-0",
														children: [
															"Row ",
															row.rowNum,
															":"
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-rose-500",
														children: row.errors.join(", ")
													}),
													row.warnings.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-amber-500",
														children: [
															"(",
															row.warnings.join(", "),
															")"
														]
													})
												]
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
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Full Name" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Email" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Department" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Designation" }),
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
													children: row.data.employeeId || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-rose-500 italic",
														children: "Missing"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "text-xs font-semibold",
													children: row.data.firstName || row.data.lastName ? `${row.data.firstName || ""} ${row.data.lastName || ""}`.trim() : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-rose-500 italic",
														children: "Missing"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "text-xs",
													children: row.data.email || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-rose-500 italic",
														children: "Missing"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "text-xs",
													children: row.data.department || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-rose-500 italic",
														children: "Missing"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													className: "text-xs",
													children: row.data.designation || "Manager"
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
						variant: "outline",
						onClick: () => {
							onOpenChange(false);
							resetState();
						},
						disabled: submitting,
						className: "rounded-xl border-border bg-card hover:bg-muted",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						onClick: handleImport,
						disabled: !file || hasErrors || submitting,
						className: "rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90 disabled:opacity-50",
						children: submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loader, {
							label: "Importing...",
							size: "sm",
							className: "text-brand-foreground"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-2 h-4 w-4" }), "Complete Import"] })
					})]
				})
			]
		})
	});
}
function ManagersToolbar({ searchQuery, filters, showAdvancedFilters, selectedCount, onSearchChange, onToggleFilters, onClearFilters, onBulkStatusChange, onBulkDelete, onExportCSV, onExportExcel, onExportPDF }) {
	searchQuery || Object.values(filters).some((v) => v && v !== "all");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 flex-col gap-3 border-b border-border p-4 lg:flex-row lg:items-center lg:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex min-w-0 flex-1 flex-wrap items-center gap-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative min-w-0 flex-1 sm:min-w-[200px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Search by name, email, employee ID, phone or department...",
					value: searchQuery,
					onChange: (e) => onSearchChange(e.target.value),
					className: "h-9 pl-9"
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-wrap items-center justify-end gap-2",
			children: [selectedCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted-foreground",
					children: [selectedCount, " selected"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						className: "h-9",
						children: "Bulk Actions"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
					align: "end",
					className: "rounded-xl border-border bg-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, {
							className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
							children: "Modify Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => onBulkStatusChange("active"),
							className: "flex cursor-pointer items-center gap-1.5 py-1.5 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-3.5 w-3.5 text-emerald-500" }), "Activate Managers"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => onBulkStatusChange("inactive"),
							className: "flex cursor-pointer items-center gap-1.5 py-1.5 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-3.5 w-3.5 text-rose-500" }), "Deactivate Managers"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, { className: "bg-border/60" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: onBulkDelete,
							className: "flex cursor-pointer items-center gap-1.5 py-1.5 text-xs text-rose-500 hover:bg-rose-500/10 focus:text-rose-500",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), "Delete Selected"]
						})
					]
				})] })]
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					className: "h-9 gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), "Export"]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
				align: "end",
				className: "rounded-xl border-border bg-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, {
						className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
						children: "Download Options"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
						onClick: onExportCSV,
						className: "flex cursor-pointer items-center gap-2 py-2 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-3.5 w-3.5 text-emerald-500" }), "Export CSV"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
						onClick: onExportExcel,
						className: "flex cursor-pointer items-center gap-2 py-2 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-3.5 w-3.5 text-emerald-600" }), "Export Excel"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
						onClick: onExportPDF,
						className: "flex cursor-pointer items-center gap-2 py-2 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5 text-rose-500" }), "Export PDF Document"]
					})
				]
			})] })]
		})]
	});
}
function ManagersPagination({ totalItems, currentPage, perPage, totalPages, visiblePages, onPageChange, onPerPageChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xs text-muted-foreground",
				children: [
					"Showing ",
					Math.min(totalItems, (currentPage - 1) * perPage + 1),
					" to ",
					Math.min(totalItems, currentPage * perPage),
					" of ",
					totalItems,
					" entries"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: "Per Page:"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: String(perPage),
					onValueChange: (val) => onPerPageChange(Number(val)),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "h-8 w-[68px]",
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
							value: "20",
							children: "20"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "25",
							children: "25"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "50",
							children: "50"
						})
					] })]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "icon",
					onClick: () => onPageChange(Math.max(1, currentPage - 1)),
					disabled: currentPage === 1,
					className: "h-8 w-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
				}),
				visiblePages.map((pageNum, index) => {
					const prev = visiblePages[index - 1];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [prev != null && pageNum - prev > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "px-1 text-xs text-muted-foreground",
						children: "..."
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: currentPage === pageNum ? "default" : "outline",
						size: "icon",
						onClick: () => onPageChange(pageNum),
						className: "h-8 w-8 text-xs",
						children: pageNum
					})] }, pageNum);
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "icon",
					onClick: () => onPageChange(Math.min(totalPages, currentPage + 1)),
					disabled: currentPage === totalPages,
					className: "h-8 w-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
				})
			]
		})]
	});
}
function ManagersDeleteDialogs({ deleteOpen, managerToDelete, bulkDeleteOpen, selectedCount, onDeleteOpenChange, onBulkDeleteOpenChange, onConfirmDelete, onConfirmBulkDelete }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
		open: deleteOpen,
		onOpenChange: onDeleteOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, {
			className: "rounded-2xl border-border bg-card p-6 backdrop-blur-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, {
				className: "text-lg font-bold",
				children: "Are you sure you want to delete this manager?"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, {
				className: "mt-2 text-sm text-muted-foreground",
				children: [
					"This action cannot be undone. This will permanently remove",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground",
						children: managerToDelete?.fullName
					}),
					" and all associated attendance metadata from the database store."
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, {
				className: "mt-4 flex justify-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
					className: "rounded-xl border-border bg-card hover:bg-muted",
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: onConfirmDelete,
					className: "rounded-xl border-none bg-rose-500 text-white shadow-glow hover:bg-rose-600",
					children: "Delete"
				})]
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
		open: bulkDeleteOpen,
		onOpenChange: onBulkDeleteOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, {
			className: "rounded-2xl border-border bg-card p-6 backdrop-blur-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, {
				className: "text-lg font-bold",
				children: "Are you sure you want to delete these managers?"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogDescription, {
				className: "mt-2 text-sm text-muted-foreground",
				children: [
					"This will permanently delete the",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground",
						children: selectedCount
					}),
					" selected managers from the system directory. This action is irreversible."
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, {
				className: "mt-4 flex justify-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
					className: "rounded-xl border-border bg-card hover:bg-muted",
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: onConfirmBulkDelete,
					className: "rounded-xl border-none bg-rose-500 text-white shadow-glow hover:bg-rose-600",
					children: "Delete Selected"
				})]
			})]
		})
	})] });
}
function getManagersExportData(managers, processedManagers, selectedIds) {
	return selectedIds.length > 0 ? managers.filter((m) => selectedIds.includes(m.id)) : processedManagers;
}
function exportManagersCSV(data) {
	if (data.length === 0) {
		toast.error("No managers available to export");
		return;
	}
	const csvContent = buildCSV(data);
	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.setAttribute("href", url);
	link.setAttribute("download", `ofc360_managers_export_${Date.now()}.csv`);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	toast.success("CSV Export Completed Successfully");
}
function exportManagersExcel(data) {
	exportManagersCSV(data);
}
function exportManagersPDF(data) {
	if (data.length === 0) {
		toast.error("No managers available to export");
		return;
	}
	const printWindow = window.open("", "_blank");
	if (!printWindow) {
		toast.error("Popup blocked! Enable popups to export as PDF.");
		return;
	}
	const rowsHTML = data.map((m) => `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px; font-size: 11px;">${m.employeeId}</td>
        <td style="padding: 10px; font-size: 11px; font-weight: bold;">${m.fullName}</td>
        <td style="padding: 10px; font-size: 11px;">${m.email}</td>
        <td style="padding: 10px; font-size: 11px;">${m.department}</td>
        <td style="padding: 10px; font-size: 11px;">${m.designation}</td>
        <td style="padding: 10px; font-size: 11px;">${m.office}</td>
        <td style="padding: 10px; font-size: 11px;">${m.status.toUpperCase()}</td>
        <td style="padding: 10px; font-size: 11px;">${m.joiningDate}</td>
      </tr>
    `).join("");
	printWindow.document.write(`
    <html>
      <head>
        <title>Managers Directory - OFC360</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 20px; color: #333; }
          h1 { font-size: 18px; margin-bottom: 5px; }
          p { font-size: 12px; margin-bottom: 20px; color: #666; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { background: #f5f5f5; text-align: left; padding: 10px; font-size: 11px; font-weight: bold; border-bottom: 2px solid #ddd; }
        </style>
      </head>
      <body>
        <h1>Managers Directory</h1>
        <p>Generated on ${(/* @__PURE__ */ new Date()).toLocaleDateString()} • Total Records: ${data.length}</p>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Office</th>
              <th>Status</th>
              <th>Joining Date</th>
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
	toast.success("PDF Generation Triggered");
}
function useManagersPage() {
	const dispatch = useAppDispatch();
	const { managers, loading, submitting, error, total, totalPages: apiTotalPages, selectedManager, selectedManagerLoading, selectedManagerError, fetchManagerById: fetchManagerByIdAction, deleteManager: deleteManagerAction, createManager: createManagerAction, updateManager: updateManagerAction, bulkDelete, bulkSetStatus, importManagers: importManagersAction } = useManagers();
	const managerForm = useAppSelector((state) => state.managers.managerForm);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [debouncedSearch, setDebouncedSearch] = (0, import_react.useState)("");
	const [filters, setFilters] = (0, import_react.useState)({ ...DEFAULT_FILTERS });
	const [showAdvancedFilters, setShowAdvancedFilters] = (0, import_react.useState)(false);
	const [sortField, setSortField] = (0, import_react.useState)("fullName");
	const [sortDir, setSortDir] = (0, import_react.useState)("asc");
	const [currentPage, setCurrentPage] = (0, import_react.useState)(1);
	const [perPage, setPerPage] = (0, import_react.useState)(20);
	const [selectedIds, setSelectedIds] = (0, import_react.useState)([]);
	const [formOpen, setFormOpen] = (0, import_react.useState)(false);
	const [isEditMode, setIsEditMode] = (0, import_react.useState)(false);
	const [profileOpen, setProfileOpen] = (0, import_react.useState)(false);
	const [importOpen, setImportOpen] = (0, import_react.useState)(false);
	const [deleteAlertOpen, setDeleteAlertOpen] = (0, import_react.useState)(false);
	const [managerToDelete, setManagerToDelete] = (0, import_react.useState)(null);
	const [bulkDeleteAlertOpen, setBulkDeleteAlertOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const timer = window.setTimeout(() => setDebouncedSearch(searchQuery), 300);
		return () => window.clearTimeout(timer);
	}, [searchQuery]);
	const refetchManagers = (0, import_react.useCallback)(() => {
		dispatch(fetchManagers({
			search: debouncedSearch.trim() || void 0,
			page: currentPage,
			limit: perPage
		}));
	}, [
		dispatch,
		debouncedSearch,
		currentPage,
		perPage
	]);
	(0, import_react.useEffect)(() => {
		refetchManagers();
	}, [refetchManagers]);
	const processedManagers = (0, import_react.useMemo)(() => {
		return applySorting(applyFilters(managers, "", filters), sortField, sortDir);
	}, [
		managers,
		filters,
		sortField,
		sortDir
	]);
	const paginatedManagers = processedManagers;
	const totalPages = apiTotalPages;
	const visiblePages = (0, import_react.useMemo)(() => getVisiblePages(currentPage, totalPages), [currentPage, totalPages]);
	function resetToFirstPage() {
		setCurrentPage(1);
	}
	function handleSearchChange(value) {
		setSearchQuery(value);
		resetToFirstPage();
	}
	function handleFiltersChange(next) {
		setFilters(next);
		resetToFirstPage();
	}
	function handlePerPageChange(next) {
		setPerPage(next);
		resetToFirstPage();
	}
	function handleSort(field) {
		if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
		else {
			setSortField(field);
			setSortDir("asc");
		}
		resetToFirstPage();
	}
	function handleSelectAll(checked) {
		setSelectedIds(checked ? paginatedManagers.map((m) => m.id) : []);
	}
	function handleSelectRow(id, checked) {
		setSelectedIds((prev) => checked ? [...prev, id] : prev.filter((x) => x !== id));
	}
	function handleAddClick() {
		dispatch(clearSelectedManager());
		setIsEditMode(false);
		setFormOpen(true);
	}
	async function handleEditClick(manager) {
		setIsEditMode(true);
		setFormOpen(true);
		const result = await fetchManagerByIdAction(manager.id);
		if (fetchManagerById.rejected.match(result)) {
			toast.error(result.payload ?? "Failed to load manager details");
			setFormOpen(false);
			setIsEditMode(false);
			dispatch(clearSelectedManager());
		}
	}
	function handleDeleteClick(manager) {
		setManagerToDelete(manager);
		setDeleteAlertOpen(true);
	}
	async function handleConfirmDelete() {
		if (!managerToDelete) return;
		const result = await deleteManagerAction(managerToDelete.id);
		if (deleteManager.fulfilled.match(result)) {
			setSelectedIds((prev) => prev.filter((id) => id !== managerToDelete.id));
			toast.success("Manager Deleted Successfully");
			setDeleteAlertOpen(false);
			setManagerToDelete(null);
			refetchManagers();
		} else toast.error(result.payload?.message ?? "Failed to delete manager");
	}
	async function handleViewClick(manager) {
		setProfileOpen(true);
		const result = await fetchManagerByIdAction(manager.id);
		if (fetchManagerById.rejected.match(result)) {
			toast.error(result.payload ?? "Failed to load manager details");
			setProfileOpen(false);
			dispatch(clearSelectedManager());
		}
	}
	function handleFormOpenChange(open) {
		setFormOpen(open);
		if (!open) {
			setIsEditMode(false);
			dispatch(clearSelectedManager());
		}
	}
	function handleProfileOpenChange(open) {
		setProfileOpen(open);
		if (!open) dispatch(clearSelectedManager());
	}
	async function handleSaveManager() {
		const isEdit = isEditMode && !!selectedManager;
		const validation = validateManagerForm(managerForm, managers, isEdit, selectedManager?.id);
		if (!validation.valid) return {
			success: false,
			message: "Please fix the highlighted fields",
			fieldErrors: validation.errors
		};
		if (isEdit && selectedManager) {
			const result = await updateManagerAction(selectedManager.id, managerForm);
			if (updateManager.fulfilled.match(result)) {
				toast.success("Manager Updated Successfully");
				handleFormOpenChange(false);
				refetchManagers();
				return { success: true };
			}
			const error = result.payload;
			return {
				success: false,
				message: error?.message ?? "Failed to update manager",
				fieldErrors: mapApiFieldErrors(error?.fieldErrors ?? {})
			};
		}
		const result = await createManagerAction(managerForm);
		if (createManager.fulfilled.match(result)) {
			toast.success("Manager Created Successfully");
			handleFormOpenChange(false);
			refetchManagers();
			return { success: true };
		}
		const error = result.payload;
		return {
			success: false,
			message: error?.message ?? "Failed to create manager",
			fieldErrors: mapApiFieldErrors(error?.fieldErrors ?? {})
		};
	}
	async function handleConfirmBulkDelete() {
		setSelectedIds([]);
		setBulkDeleteAlertOpen(false);
		toast.info("Bulk delete is currently unavailable.");
	}
	async function handleBulkStatusChange(_status) {
		setSelectedIds([]);
		toast.info("Bulk status change is currently unavailable.");
	}
	function handleClearFilters() {
		setSearchQuery("");
		setDebouncedSearch("");
		setFilters({ ...DEFAULT_FILTERS });
		resetToFirstPage();
		toast.success("Filters Reset Successfully");
	}
	async function handleImportManagers(imported) {
		const result = await importManagersAction(imported);
		if (!importManagers.fulfilled.match(result)) toast.error("Failed to import managers");
	}
	function getExportData() {
		return getManagersExportData(managers, processedManagers, selectedIds);
	}
	function handleExportCSV() {
		exportManagersCSV(getExportData());
	}
	function handleExportExcel() {
		exportManagersExcel(getExportData());
	}
	function handleExportPDF() {
		exportManagersPDF(getExportData());
	}
	return {
		managers,
		loading,
		submitting,
		error,
		total,
		refetch: refetchManagers,
		searchQuery,
		filters,
		showAdvancedFilters,
		setShowAdvancedFilters,
		sortField,
		sortDir,
		currentPage,
		setCurrentPage,
		perPage,
		selectedIds,
		processedManagers,
		paginatedManagers,
		totalPages,
		visiblePages,
		formOpen,
		handleFormOpenChange,
		isEditMode,
		selectedManager,
		selectedManagerLoading,
		selectedManagerError,
		profileOpen,
		handleProfileOpenChange,
		importOpen,
		setImportOpen,
		deleteAlertOpen,
		setDeleteAlertOpen,
		managerToDelete,
		bulkDeleteAlertOpen,
		setBulkDeleteAlertOpen,
		handleSearchChange,
		handleFiltersChange,
		handlePerPageChange,
		handleSort,
		handleSelectAll,
		handleSelectRow,
		handleAddClick,
		handleEditClick,
		handleDeleteClick,
		handleConfirmDelete,
		handleViewClick,
		handleSaveManager,
		handleConfirmBulkDelete,
		handleBulkStatusChange,
		handleClearFilters,
		handleImportManagers,
		handleExportCSV,
		handleExportExcel,
		handleExportPDF
	};
}
function ManagersPage() {
	const page = useManagersPage();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-w-0 max-w-full overflow-x-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Managers Directory",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => page.setImportOpen(true),
					variant: "outline",
					className: "rounded-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mr-2 h-4 w-4" }), "Import CSV"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: page.handleAddClick,
					className: "rounded-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "mr-2 h-4 w-4" }), "Add Manager"]
				})] })
			}),
			!page.loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManagerStatsCards, { managers: page.managers }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full min-w-0 overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManagersToolbar, {
					searchQuery: page.searchQuery,
					filters: page.filters,
					showAdvancedFilters: page.showAdvancedFilters,
					selectedCount: page.selectedIds.length,
					onSearchChange: page.handleSearchChange,
					onToggleFilters: () => page.setShowAdvancedFilters((open) => !open),
					onClearFilters: page.handleClearFilters,
					onBulkStatusChange: page.handleBulkStatusChange,
					onBulkDelete: () => page.setBulkDeleteAlertOpen(true),
					onExportCSV: page.handleExportCSV,
					onExportExcel: page.handleExportExcel,
					onExportPDF: page.handleExportPDF
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManagersListContent, {
					loading: page.loading,
					submitting: page.submitting,
					error: page.error,
					managers: page.managers,
					paginatedManagers: page.paginatedManagers,
					filteredCount: page.total,
					selectedIds: page.selectedIds,
					sortField: page.sortField,
					sortDir: page.sortDir,
					onRetry: page.refetch,
					onAdd: page.handleAddClick,
					onClearFilters: page.handleClearFilters,
					onSelectAll: page.handleSelectAll,
					onSelectRow: page.handleSelectRow,
					onView: page.handleViewClick,
					onEdit: page.handleEditClick,
					onDelete: page.handleDeleteClick,
					onSort: page.handleSort,
					pagination: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManagersPagination, {
						totalItems: page.total,
						currentPage: page.currentPage,
						perPage: page.perPage,
						totalPages: page.totalPages,
						visiblePages: page.visiblePages,
						onPageChange: page.setCurrentPage,
						onPerPageChange: page.handlePerPageChange
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManagerFormDialog, {
				open: page.formOpen,
				onOpenChange: page.handleFormOpenChange,
				isEdit: page.isEditMode,
				manager: page.selectedManager,
				detailLoading: page.selectedManagerLoading,
				detailError: page.selectedManagerError,
				existingManagers: page.managers,
				onSubmit: page.handleSaveManager
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManagerProfileDrawer, {
				open: page.profileOpen,
				onOpenChange: page.handleProfileOpenChange,
				manager: page.selectedManager,
				loading: page.selectedManagerLoading,
				error: page.selectedManagerError
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImportDialog, {
				open: page.importOpen,
				onOpenChange: page.setImportOpen,
				existingManagers: page.managers,
				submitting: page.submitting,
				onImport: page.handleImportManagers
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ManagersDeleteDialogs, {
				deleteOpen: page.deleteAlertOpen,
				managerToDelete: page.managerToDelete,
				bulkDeleteOpen: page.bulkDeleteAlertOpen,
				selectedCount: page.selectedIds.length,
				onDeleteOpenChange: page.setDeleteAlertOpen,
				onBulkDeleteOpenChange: page.setBulkDeleteAlertOpen,
				onConfirmDelete: page.handleConfirmDelete,
				onConfirmBulkDelete: page.handleConfirmBulkDelete
			})
		]
	});
}
//#endregion
export { ManagersPage };
