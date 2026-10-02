import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, Jn as Eye, Qn as EllipsisVertical, Vt as Mail, cn as Key, en as Link2, er as Download, ht as Plus, k as Trash2, p as Users, qt as LoaderCircle, x as UserCheck, y as UserMinus } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { n as useAppSelector, t as useAppDispatch } from "./hooks-BpVIWXzj.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as getRejectMessage } from "./utils-DQc9Fr86.mjs";
import { nt as resolveDepartmentValue } from "./departmentsSlice-BOlsHBgC.mjs";
import { E as fetchEmployees, K as resendEmployeeInvite, a as activateEmployee, et as updateEmployee, h as deactivateEmployee, m as createEmployee, q as resetEmployeePassword, v as deleteEmployee } from "./auth-bootstrap-CR9kF6gO.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { a as DropdownMenuSeparator, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-DXMm4jWj.mjs";
import { r as PageHeader } from "./DashboardShell-DIr27KpW.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { a as AlertDialogDescription, c as AlertDialogTitle, i as AlertDialogContent, n as AlertDialogAction, o as AlertDialogFooter, r as AlertDialogCancel, s as AlertDialogHeader, t as AlertDialog } from "./alert-dialog-BCrgGGf7.mjs";
import { t as useDebounce } from "./useDebounce-Duf9-Nss.mjs";
import { t as DepartmentSelectContent } from "./DepartmentSelectContent-BboI2aL5.mjs";
import { n as exportEmployeesCsv, r as getEmployeeStatusDetails, t as createEmptyEmployee } from "./employeeStatus-CjTvvMla.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/EmployeesPage-DMJKGnkb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EmployeesFilters({ search, department, onSearchChange, onDepartmentChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-3 border-b border-border p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex-1 min-w-[200px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: search,
				onChange: (e) => onSearchChange(e.target.value),
				placeholder: "Search by name, email, or ID",
				className: "h-9 pl-9"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
			value: department,
			onValueChange: onDepartmentChange,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
				className: "h-9 w-48",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All departments" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepartmentSelectContent, { includeAllOption: true })]
		})]
	});
}
function EmployeesTable({ employees, onEdit, onResendInvite, onResetPassword, onDeactivate, onActivate, onDelete }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Employee"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Department"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Designation"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Joined"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Shift"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3",
						children: "Status"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-3" })
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: employees.map((employee) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeRow, {
				employee,
				onEdit,
				onResendInvite,
				onResetPassword,
				onDeactivate,
				onActivate,
				onDelete
			}, employee.id)) })]
		})
	});
}
function EmployeeRow({ employee, onEdit, onResendInvite, onResetPassword, onDeactivate, onActivate, onDelete }) {
	const status = getEmployeeStatusDetails(employee);
	const isInvited = status.text === "INVITED" || status.text === "EXPIRED";
	const isActive = status.text === "ACTIVE";
	const isDisabled = status.text === "DISABLED";
	function copyInviteLink() {
		const link = window.location.origin + "/onboarding?token=" + (employee.activationToken || "");
		navigator.clipboard.writeText(link);
		toast.success("Invitation link copied to clipboard");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
		className: "border-t border-border transition-colors hover:bg-accent/30",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-9 w-9 place-items-center rounded-full bg-foreground text-xs font-semibold text-background",
						children: employee.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: employee.fullName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: employee.email
					})] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-3",
				children: employee.department || "—"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-3",
				children: employee.designation || "—"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-3 text-muted-foreground",
				children: employee.joiningDate || "—"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "secondary",
					children: employee.shift
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeStatusBadge, { status })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "px-4 py-3 text-right",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						className: "h-8 w-8 p-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "h-4 w-4" })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
					align: "end",
					className: "w-48 bg-card border border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => onEdit(employee),
							className: "cursor-pointer gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View / Edit Profile" })]
						}),
						isInvited && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => onResendInvite(employee.id),
							className: "cursor-pointer gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Resend Invitation" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: copyInviteLink,
							className: "cursor-pointer gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Copy Invite Link" })]
						})] }),
						isActive && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => onResetPassword(employee.id),
							className: "cursor-pointer gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Reset Password" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => onDeactivate(employee.id),
							className: "cursor-pointer gap-2 text-destructive focus:text-destructive",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserMinus, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Deactivate Employee" })]
						})] }),
						isDisabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => onActivate(employee.id),
							className: "cursor-pointer gap-2 text-emerald-500 focus:text-emerald-500",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Activate Employee" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, { className: "border-t border-border" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
							onClick: () => onDelete(employee.id),
							className: "cursor-pointer gap-2 text-destructive focus:text-destructive",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Delete Employee" })]
						})
					]
				})] })
			})
		]
	});
}
function EmployeeStatusBadge({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: status.variant,
		className: status.text === "ACTIVE" ? "border-transparent bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" : status.text === "PENDING" ? "border-transparent bg-amber-500/10 text-amber-500 hover:bg-amber-500/20" : void 0,
		children: status.text
	});
}
function EmployeesListContent({ loading, error, employees, onRetry, onAdd, onEdit, onResendInvite, onResetPassword, onDeactivate, onActivate, onDelete }) {
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "p-8 space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Loading employees..."]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: [
				1,
				2,
				3,
				4
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-12 bg-muted/30 animate-pulse rounded-lg" }, i))
		})]
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-destructive font-medium",
				children: "Failed to load employees"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mt-1",
				children: "Please verify backend connection details."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: onRetry,
				className: "mt-4",
				children: "Retry"
			})
		]
	});
	if (employees.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium",
				children: "No employees found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-sm text-sm text-muted-foreground",
				children: "Register your first employee or import records to populate your workforce dashboard."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: onAdd,
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), " Add employee"]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeesTable, {
		employees,
		onEdit,
		onResendInvite,
		onResetPassword,
		onDeactivate,
		onActivate,
		onDelete
	});
}
var SHIFT_OPTIONS = [
	"General",
	"Morning",
	"Evening",
	"Night"
];
function EmployeeFormDialog({ open, onOpenChange, draft, onDraftChange, submitting, onSave }) {
	const departmentValue = resolveDepartmentValue(draft?.department);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: draft && draft.id !== "" ? "Edit employee" : "Add employee" }) }),
				draft ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							label: "Shift",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: draft.shift,
								onValueChange: (v) => onDraftChange({
									...draft,
									shift: v
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: SHIFT_OPTIONS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: s,
									children: s
								}, s)) })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							label: "Full name",
							wide: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.fullName,
								onChange: (e) => onDraftChange({
									...draft,
									fullName: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							label: "Email",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "email",
								value: draft.email,
								onChange: (e) => onDraftChange({
									...draft,
									email: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							label: "Phone",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.phone,
								onChange: (e) => onDraftChange({
									...draft,
									phone: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							label: "Department",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: departmentValue,
								onValueChange: (v) => onDraftChange({
									...draft,
									department: v
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select department" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepartmentSelectContent, {
									selectedValue: departmentValue,
									extraValues: draft.department ? [draft.department] : []
								}, draft.id || "new")]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							label: "Designation",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.designation,
								onChange: (e) => onDraftChange({
									...draft,
									designation: e.target.value
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
							label: "Joining date",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: draft.joiningDate,
								onChange: (e) => onDraftChange({
									...draft,
									joiningDate: e.target.value
								})
							})
						})
					]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => onOpenChange(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: onSave,
					disabled: submitting,
					children: [submitting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), "Save"]
				})] })
			]
		})
	});
}
function FormField({ label, children, wide }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `space-y-1.5 ${wide ? "sm:col-span-2" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs",
			children: label
		}), children]
	});
}
function ConfirmAlertDialog({ open, onOpenChange, title, description, confirmLabel, onConfirm, cancelLabel = "Cancel", destructive = true }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogContent, {
			className: "rounded-2xl border-border bg-card p-6 backdrop-blur-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogTitle, {
				className: "text-lg font-bold",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogDescription, {
				className: "mt-2 text-sm text-muted-foreground",
				children: description
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDialogFooter, {
				className: "mt-4 flex justify-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogCancel, {
					className: "rounded-xl border-border bg-card hover:bg-muted",
					children: cancelLabel
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDialogAction, {
					onClick: onConfirm,
					className: cn("rounded-xl border-none shadow-glow", destructive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : "bg-brand text-brand-foreground hover:bg-brand/90"),
					children: confirmLabel
				})]
			})]
		})
	});
}
function EmployeesConfirmDialogs({ deleteConfirm, deactivateConfirm }) {
	const isActiveEmployee = deactivateConfirm.employee != null && getEmployeeStatusDetails(deactivateConfirm.employee).text === "ACTIVE";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmAlertDialog, {
		open: deleteConfirm.open,
		onOpenChange: deleteConfirm.onOpenChange,
		title: "Are you sure you want to remove this employee?",
		description: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			"This action cannot be undone. This will permanently remove",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-semibold text-foreground",
				children: deleteConfirm.employee?.fullName ?? "this employee"
			}),
			" ",
			"from the workforce directory."
		] }),
		confirmLabel: "Remove",
		onConfirm: deleteConfirm.onConfirm
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfirmAlertDialog, {
		open: deactivateConfirm.open,
		onOpenChange: deactivateConfirm.onOpenChange,
		title: "Are you sure you want to deactivate this employee?",
		description: isActiveEmployee ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			"This will deactivate",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-semibold text-foreground",
				children: deactivateConfirm.employee?.fullName
			}),
			". They will lose access to the portal until reactivated."
		] }) : "They will lose access to the portal until reactivated.",
		confirmLabel: "Deactivate",
		onConfirm: deactivateConfirm.onConfirm
	})] });
}
function useConfirmDialog() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [item, setItem] = (0, import_react.useState)(null);
	return {
		open,
		item,
		openWith: (0, import_react.useCallback)((nextItem) => {
			setItem(nextItem);
			setOpen(true);
		}, []),
		handleOpenChange: (0, import_react.useCallback)((nextOpen) => {
			setOpen(nextOpen);
			if (!nextOpen) setItem(null);
		}, []),
		close: (0, import_react.useCallback)(() => {
			setOpen(false);
			setItem(null);
		}, [])
	};
}
function useEmployeeConfirmDialogs({ employees, onChanged }) {
	const dispatch = useAppDispatch();
	const { open: deleteOpen, item: employeeToDelete, openWith: openDeleteWith, handleOpenChange: onDeleteOpenChange, close: closeDelete } = useConfirmDialog();
	const { open: deactivateOpen, item: employeeToDeactivate, openWith: openDeactivateWith, handleOpenChange: onDeactivateOpenChange, close: closeDeactivate } = useConfirmDialog();
	const requestRemove = (0, import_react.useCallback)((id) => {
		const employee = employees.find((e) => e.id === id);
		if (employee) openDeleteWith(employee);
	}, [employees, openDeleteWith]);
	const confirmRemove = (0, import_react.useCallback)(async () => {
		if (!employeeToDelete) return;
		const result = await dispatch(deleteEmployee(employeeToDelete.id));
		if (deleteEmployee.fulfilled.match(result)) {
			toast.success("Employee removed successfully");
			closeDelete();
			onChanged?.();
		} else toast.error(getRejectMessage(result.payload, "Failed to remove employee"));
	}, [
		closeDelete,
		dispatch,
		employeeToDelete,
		onChanged
	]);
	const requestDeactivate = (0, import_react.useCallback)((id) => {
		const employee = employees.find((e) => e.id === id);
		if (employee) openDeactivateWith(employee);
	}, [employees, openDeactivateWith]);
	const confirmDeactivate = (0, import_react.useCallback)(async () => {
		if (!employeeToDeactivate) return;
		const result = await dispatch(deactivateEmployee(employeeToDeactivate.id));
		if (deactivateEmployee.fulfilled.match(result)) {
			toast.success("Employee account deactivated successfully");
			closeDeactivate();
			onChanged?.();
		} else toast.error(getRejectMessage(result.payload, "Failed to deactivate employee"));
	}, [
		closeDeactivate,
		dispatch,
		employeeToDeactivate,
		onChanged
	]);
	return {
		deleteConfirm: {
			open: deleteOpen,
			employee: employeeToDelete,
			onOpenChange: onDeleteOpenChange,
			onRequest: requestRemove,
			onConfirm: confirmRemove
		},
		deactivateConfirm: {
			open: deactivateOpen,
			employee: employeeToDeactivate,
			onOpenChange: onDeactivateOpenChange,
			onRequest: requestDeactivate,
			onConfirm: confirmDeactivate
		}
	};
}
function EmployeesPage() {
	const dispatch = useAppDispatch();
	const { employees, loading, submitting, error } = useAppSelector((state) => state.employees);
	const [q, setQ] = (0, import_react.useState)("");
	const debouncedQ = useDebounce(q, 300);
	const [dept, setDept] = (0, import_react.useState)("all");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		dispatch(fetchEmployees({
			search: debouncedQ,
			department: dept
		}));
	}, [
		dispatch,
		debouncedQ,
		dept
	]);
	const departments = (0, import_react.useMemo)(() => Array.from(new Set(employees.map((e) => e.department).filter(Boolean))), [employees]);
	function refetch() {
		dispatch(fetchEmployees({
			search: q,
			department: dept
		}));
	}
	const { deleteConfirm, deactivateConfirm } = useEmployeeConfirmDialogs({
		employees,
		onChanged: refetch
	});
	async function resendInvite(id) {
		const result = await dispatch(resendEmployeeInvite(id));
		if (resendEmployeeInvite.fulfilled.match(result)) toast.success("Invitation email resent successfully");
		else toast.error(getRejectMessage(result.payload, "Failed to resend invitation"));
	}
	async function activateEmployeeAction(id) {
		const result = await dispatch(activateEmployee(id));
		if (activateEmployee.fulfilled.match(result)) {
			toast.success("Employee account activated successfully");
			refetch();
		} else toast.error(getRejectMessage(result.payload, "Failed to activate employee"));
	}
	async function resetPassword(id) {
		if (!confirm("Are you sure you want to reset this employee's password? A temporary password will be sent to their email.")) return;
		const result = await dispatch(resetEmployeePassword(id));
		if (resetEmployeePassword.fulfilled.match(result)) toast.success("Employee password reset email sent successfully");
		else toast.error(getRejectMessage(result.payload, "Failed to reset password"));
	}
	function openNew() {
		setDraft(createEmptyEmployee());
		setOpen(true);
	}
	function openEdit(employee) {
		setDraft(employee);
		setOpen(true);
	}
	async function save() {
		if (!draft) return;
		if (!draft.fullName || !draft.email) return toast.error("Name and email required");
		const names = draft.fullName.trim().split(/\s+/);
		const first_name = names[0] || "";
		const last_name = names.slice(1).join(" ") || " ";
		if (draft.id !== "") {
			const result = await dispatch(updateEmployee({
				id: draft.id,
				payload: {
					first_name,
					last_name,
					personal_email: draft.email,
					phone: draft.phone || void 0,
					department: draft.department,
					designation: draft.designation,
					joining_date: draft.joiningDate || void 0,
					shift: draft.shift
				}
			}));
			if (updateEmployee.fulfilled.match(result)) {
				toast.success("Employee updated successfully");
				setOpen(false);
				refetch();
			} else toast.error(getRejectMessage(result.payload, "Failed to update employee"));
		} else {
			const result = await dispatch(createEmployee({
				first_name,
				last_name,
				personal_email: draft.email,
				company_email: draft.email,
				phone: draft.phone || "",
				department: draft.department || "Engineering",
				designation: draft.designation || "Engineer",
				joining_date: draft.joiningDate,
				employee_id: draft.employeeId || `EMP-${Math.floor(1e5 + Math.random() * 9e5)}`,
				employment_type: "FULL_TIME",
				employment_status: "PROBATION",
				role: "employee",
				shift: draft.shift || "General"
			}));
			if (createEmployee.fulfilled.match(result)) {
				toast.success("Employee added successfully");
				setOpen(false);
				refetch();
			} else toast.error(getRejectMessage(result.payload, "Failed to add employee"));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Employees",
			description: `${employees.length} people across ${departments.length || 0} departments`,
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: () => exportEmployeesCsv(employees),
				disabled: employees.length === 0,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-4 w-4" }), " Export"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: openNew,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), " Add employee"]
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border bg-card/60 backdrop-blur-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeesFilters, {
				search: q,
				department: dept,
				onSearchChange: setQ,
				onDepartmentChange: setDept
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeesListContent, {
				loading,
				error,
				employees,
				onRetry: refetch,
				onAdd: openNew,
				onEdit: openEdit,
				onResendInvite: resendInvite,
				onResetPassword: resetPassword,
				onDeactivate: deactivateConfirm.onRequest,
				onActivate: activateEmployeeAction,
				onDelete: deleteConfirm.onRequest
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeFormDialog, {
			open,
			onOpenChange: setOpen,
			draft,
			onDraftChange: setDraft,
			submitting,
			onSave: save
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeesConfirmDialogs, {
			deleteConfirm,
			deactivateConfirm
		})
	] });
}
//#endregion
export { EmployeesPage };
