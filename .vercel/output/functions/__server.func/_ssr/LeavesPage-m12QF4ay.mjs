import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, Br as Calendar, Sr as CircleCheck, T as TriangleAlert, Tr as CircleAlert, ht as Plus, ii as Ban, lt as RefreshCw, p as Users, pr as Clock, q as ShieldCheck, un as Info, vr as CircleX, x as UserCheck } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Progress } from "./progress-ZynOkOPX.mjs";
import { c as useAurix, l as useCurrentRole } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as api } from "./apiInstance-C5A0vaLH.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { t as statusBadgeClass } from "./status-styles-B1M3Yvd8.mjs";
import { n as getLeaveTypeDot } from "./color-maps-DnqgCmfa.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CkAivaVl.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DJOO1b-0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/LeavesPage-m12QF4ay.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Normalizes any casing ("PENDING", "APPROVED", "REJECTED", "CANCELLED") to canonical LeaveStatus.
*/
function mapStatus(rawStatus) {
	const s = String(rawStatus || "pending").trim().toLowerCase();
	if (s === "approved" || s === "rejected" || s === "cancelled") return s;
	return "pending";
}
/**
* Normalizes backend leave response into safe LeaveRequest.
*/
function mapLeave(raw) {
	if (!raw || typeof raw !== "object") return {
		id: "",
		employee_name: "Employee",
		department: "Staff",
		leave_type: "Leave",
		start_date: "",
		end_date: "",
		total_days: 0,
		reason: "No reason provided",
		status: "pending"
	};
	const rawEmpName = raw.employee_name ?? raw.employee?.fullName ?? raw.employee?.full_name ?? raw.full_name;
	const rawDept = raw.department ?? raw.employee?.department;
	return {
		id: String(raw.id ?? ""),
		employee_name: rawEmpName && String(rawEmpName).trim() ? String(rawEmpName).trim() : "Employee",
		department: rawDept && String(rawDept).trim() ? String(rawDept).trim() : "Staff",
		leave_type: String(raw.leave_type ?? "Leave"),
		start_date: String(raw.start_date ?? ""),
		end_date: String(raw.end_date ?? ""),
		total_days: Number(raw.total_days) || 0,
		reason: String(raw.reason ?? "No reason provided"),
		status: mapStatus(raw.status),
		rejection_reason: raw.rejection_reason ? String(raw.rejection_reason) : void 0
	};
}
/**
* Normalizes backend leave balance item into safe LeaveBalance.
*/
function mapBalance(raw) {
	if (!raw || typeof raw !== "object") return {
		leave_type: "Leave",
		total_days: 0,
		used_days: 0,
		remaining_days: 0
	};
	return {
		leave_type: String(raw.leave_type ?? "Leave"),
		total_days: Number(raw.total_days) || 0,
		used_days: Number(raw.used_days) || 0,
		remaining_days: Number(raw.remaining_days) || 0
	};
}
/**
* Formats YYYY-MM-DD strings without timezone shift.
* Parses as local date parts (year, month, day) instead of new Date("YYYY-MM-DD").
* Uses "en-IN" locale formatting.
*/
function formatDateStr(dateStr) {
	if (!dateStr) return "—";
	const match = String(dateStr).match(/^(\d{4})-(\d{2})-(\d{2})/);
	if (match) {
		const year = parseInt(match[1], 10);
		const month = parseInt(match[2], 10) - 1;
		const day = parseInt(match[3], 10);
		return new Date(year, month, day).toLocaleDateString("en-IN", {
			day: "numeric",
			month: "short",
			year: "numeric"
		});
	}
	const d = new Date(dateStr);
	if (isNaN(d.getTime())) return String(dateStr);
	return d.toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric"
	});
}
/**
* Calculates estimated calendar days between start and end dates inclusive.
* Parses as local date parts to prevent timezone shifts.
*/
function calculateEstimatedDays(startStr, endStr) {
	if (!startStr || !endStr) return 0;
	const startMatch = startStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
	const endMatch = endStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
	if (!startMatch || !endMatch) return 0;
	const s = new Date(parseInt(startMatch[1], 10), parseInt(startMatch[2], 10) - 1, parseInt(startMatch[3], 10));
	const diffTime = new Date(parseInt(endMatch[1], 10), parseInt(endMatch[2], 10) - 1, parseInt(endMatch[3], 10)).getTime() - s.getTime();
	if (diffTime < 0) return 0;
	return Math.round(diffTime / (1e3 * 60 * 60 * 24)) + 1;
}
/**
* Returns today's date formatted as YYYY-MM-DD in local time.
*/
function getTodayDateString() {
	const d = /* @__PURE__ */ new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
/**
* Determines whether a leave request can be cancelled by the user.
* Pending rows or future Approved rows (start_date >= today).
*/
function isLeaveCancellable(leave, todayStr = getTodayDateString()) {
	if (leave.status === "pending") return true;
	if (leave.status === "approved" && leave.start_date >= todayStr) return true;
	return false;
}
/**
* Returns safe uppercase single letter avatar initial.
*/
function getSafeInitial(name) {
	if (!name) return "E";
	const trimmed = name.trim();
	return trimmed.length > 0 ? trimmed.charAt(0).toUpperCase() : "E";
}
function BalanceCards({ balances, loading = false, error = false, onRetry }) {
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid h-10 w-10 place-items-center rounded-full bg-destructive/10 text-destructive",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-5 w-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold text-foreground",
				children: "Failed to load leave balances"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground mt-0.5",
				children: "Unable to retrieve current balance records from the server."
			})] }),
			onRetry && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				onClick: onRetry,
				className: "gap-2 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), "Retry"]
			})
		]
	});
	if (loading && balances.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4 sm:grid-cols-3",
		children: [
			1,
			2,
			3
		].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "border border-border bg-card animate-pulse",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "pb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-20 bg-muted rounded" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-28 bg-muted rounded mt-2" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3 w-36 bg-muted rounded mb-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-1.5 w-full bg-muted rounded-full" })] })]
		}, i))
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 sm:grid-cols-3",
		children: [balances.map((b) => {
			const total = Number(b.total_days) || 0;
			const used = Number(b.used_days) || 0;
			const remaining = Number(b.remaining_days) || 0;
			const percentage = total > 0 ? Math.min(100, Math.max(0, used / total * 100)) : 0;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border border-border bg-card transition-all duration-300 hover:shadow-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "pb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("h-2 w-2 rounded-full shrink-0", getLeaveTypeDot(b.leave_type)) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
							className: "text-xs font-semibold tracking-wider uppercase text-muted-foreground",
							children: b.leave_type
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "text-3xl font-display font-bold text-foreground mt-1 tabular-nums",
						children: [
							remaining,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-normal text-muted-foreground",
								children: "days left"
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"Used: ",
							used,
							" / Total: ",
							total,
							" days"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
						value: percentage,
						className: "h-1.5 w-full bg-primary/20",
						"aria-label": `${b.leave_type} usage`
					})]
				})]
			}, b.leave_type);
		}), balances.length === 0 && !loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "col-span-3 rounded-2xl border border-dashed border-border bg-card p-8 text-center text-xs text-muted-foreground",
			children: "No leave policies or balances allocated yet."
		})]
	});
}
function HistoryTable({ history, loading = false, error = false, onRetry, onCancelRequest, cancellingId }) {
	const todayStr = getTodayDateString();
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid h-10 w-10 place-items-center rounded-full bg-destructive/10 text-destructive",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-5 w-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold text-foreground",
				children: "Failed to load leave history"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground mt-0.5",
				children: "Unable to fetch past leave applications from the server."
			})] }),
			onRetry && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				onClick: onRetry,
				className: "gap-2 text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), "Retry"]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-sm font-semibold text-foreground uppercase tracking-wider",
			children: "Leave Applications History"
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "border border-border bg-card overflow-hidden",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
			className: "bg-muted/50",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "pl-6 py-4",
					children: "Leave Type"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "py-4",
					children: "Dates Range"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "text-center py-4",
					children: "Days Claimed"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "py-4",
					children: "Reason"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "py-4",
					children: "Status"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "pr-6 py-4 text-right",
					children: "Actions"
				})
			] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [
			history.map((rec) => {
				const cancellable = isLeaveCancellable(rec, todayStr);
				const isCancelling = cancellingId === rec.id;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
					className: "border-b border-border hover:bg-muted/50 transition-colors",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "pl-6 py-4 font-semibold text-foreground",
							children: rec.leave_type
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
							className: "py-4 text-muted-foreground whitespace-nowrap",
							children: [
								formatDateStr(rec.start_date),
								" – ",
								formatDateStr(rec.end_date)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
							className: "text-center py-4 font-semibold tabular-nums text-foreground",
							children: [rec.total_days, " d"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "py-4 text-muted-foreground max-w-[200px] truncate",
							children: rec.reason
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "py-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: cn("text-xs capitalize border", statusBadgeClass(rec.status)),
								children: rec.status
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "pr-6 py-4 text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-end gap-2",
								children: [rec.status === "rejected" && rec.rejection_reason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-destructive flex items-center gap-1.5 justify-end",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5 shrink-0" }),
										" Reason: ",
										rec.rejection_reason
									]
								}), cancellable && onCancelRequest && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "ghost",
									size: "sm",
									disabled: isCancelling,
									onClick: () => onCancelRequest(rec),
									className: "h-8 text-xs gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "h-3.5 w-3.5" }), isCancelling ? "Cancelling..." : "Cancel"]
								})]
							})
						})
					]
				}, rec.id);
			}),
			history.length === 0 && !loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				colSpan: 6,
				className: "text-center py-10 text-muted-foreground",
				children: "No leave applications logged yet."
			}) }),
			loading && history.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				colSpan: 6,
				className: "text-center py-10 text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Loading leave history..." })]
				})
			}) })
		] })] })
	})] });
}
function ApprovalsList({ approvals, loading = false, onRefresh, onApproveClick, onRejectClick, actionLoadingId }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-lg font-semibold text-foreground",
				children: "Review Team Time-Off Requests"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Approve leave filings or request revisions with feedback comments."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
					variant: "outline",
					className: cn("border", statusBadgeClass("pending")),
					children: [approvals.length, " Pending"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: onRefresh,
					disabled: loading,
					className: "gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-4 w-4 ${loading ? "animate-spin" : ""}` }), "Refresh"]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4",
			children: [approvals.map((req) => {
				const isRowLoading = actionLoadingId === req.id;
				const isAnyRowLoading = Boolean(actionLoadingId);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "border border-border bg-card overflow-hidden hover:shadow-md transition-shadow",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-primary font-semibold",
										children: getSafeInitial(req.employee_name)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-semibold text-foreground flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: req.employee_name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[10px] uppercase font-normal",
											children: req.department
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground mt-1 flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: req.leave_type }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												"(",
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-foreground font-medium",
													children: [req.total_days, " days"]
												}),
												")"
											] })
										]
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground block",
									children: "Requested Dates Range"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm font-semibold text-foreground",
									children: [
										formatDateStr(req.start_date),
										" to ",
										formatDateStr(req.end_date)
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "max-w-xs md:max-w-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground block",
										children: "Reason for absence"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-foreground mt-0.5 leading-relaxed truncate",
										children: req.reason
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										disabled: isAnyRowLoading,
										className: "text-emerald-600 dark:text-emerald-400 gap-1.5",
										onClick: () => onApproveClick(req),
										children: [isRowLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Approve" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										disabled: isAnyRowLoading,
										className: "text-destructive border-destructive/30 gap-1.5",
										onClick: () => onRejectClick(req),
										children: [isRowLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Reject" })]
									})]
								})
							]
						})
					})
				}, req.id);
			}), approvals.length === 0 && !loading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-dashed border-border bg-card p-12 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium text-foreground",
						children: "All caught up!"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "There are no pending leave requests for your review."
					})
				]
			})]
		})]
	});
}
function AllBalancesPanel() {
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [debouncedQuery, setDebouncedQuery] = (0, import_react.useState)("");
	const [employees, setEmployees] = (0, import_react.useState)([]);
	const [employeesLoading, setEmployeesLoading] = (0, import_react.useState)(false);
	const [employeesError, setEmployeesError] = (0, import_react.useState)(null);
	const [selectedEmp, setSelectedEmp] = (0, import_react.useState)(null);
	const [empBalances, setEmpBalances] = (0, import_react.useState)([]);
	const [empBalancesLoading, setEmpBalancesLoading] = (0, import_react.useState)(false);
	const searchSeqRef = (0, import_react.useRef)(0);
	const activeEmpIdRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const handler = setTimeout(() => {
			setDebouncedQuery(searchQuery);
		}, 300);
		return () => clearTimeout(handler);
	}, [searchQuery]);
	const fetchEmployees = (0, import_react.useCallback)(async (query) => {
		const seq = ++searchSeqRef.current;
		setEmployeesLoading(true);
		setEmployeesError(null);
		try {
			const cleanQ = (query ?? "").trim();
			const res = await api.get(`/leaves/employees?q=${encodeURIComponent(cleanQ)}`, { headers: { "x-skip-cache": "true" } });
			if (seq !== searchSeqRef.current) return;
			setEmployees((Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []).map((e) => ({
				id: String(e.id ?? ""),
				employee_code: String(e.employee_code ?? e.employeeId ?? "—"),
				full_name: String(e.full_name ?? e.fullName ?? "Unnamed"),
				department: String(e.department ?? "—"),
				designation: String(e.designation ?? "—")
			})));
		} catch (err) {
			if (seq !== searchSeqRef.current) return;
			console.error("Error fetching employees for leave balances", err);
			setEmployeesError(err?.data?.message || err?.message || "Failed to load employees.");
		} finally {
			if (seq === searchSeqRef.current) setEmployeesLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		fetchEmployees(debouncedQuery);
	}, [debouncedQuery, fetchEmployees]);
	const handleSelectEmployee = async (emp) => {
		setSelectedEmp(emp);
		setEmpBalances([]);
		setEmpBalancesLoading(true);
		activeEmpIdRef.current = emp.id;
		try {
			const res = await api.get(`/leaves/balances/${emp.id}`, { headers: { "x-skip-cache": "true" } });
			if (activeEmpIdRef.current !== emp.id) return;
			if (res?.success && res.data) setEmpBalances((Array.isArray(res.data) ? res.data : []).map(mapBalance));
			else if (Array.isArray(res)) setEmpBalances(res.map(mapBalance));
			else setEmpBalances([]);
		} catch (err) {
			if (activeEmpIdRef.current !== emp.id) return;
			console.error("Error fetching employee balances", err);
			toast.error(err?.data?.message || err?.message || "Failed to load balances for selected employee.");
			setEmpBalances([]);
		} finally {
			if (activeEmpIdRef.current === emp.id) setEmpBalancesLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-lg font-semibold text-foreground",
				children: "Organizational Leave Allocations"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Select any employee to view their detailed leave balances from database."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative w-full sm:w-[260px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Search employees...",
					value: searchQuery,
					onChange: (e) => setSearchQuery(e.target.value),
					className: "pl-9"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 md:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border border-border bg-card md:col-span-2 overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
					className: "bg-muted/50",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "pl-6 py-4",
							children: "Employee ID"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "py-4",
							children: "Name"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "py-4",
							children: "Department"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
							className: "py-4",
							children: "Designation"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { className: "pr-6 py-4 text-right" })
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [
					employeesLoading && employees.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: 5,
						className: "text-center py-10 text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Loading employees..." })]
						})
					}) }),
					employeesError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: 5,
						className: "text-center py-8 text-destructive",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center justify-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-5 w-5" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs",
									children: employeesError
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									onClick: () => fetchEmployees(debouncedQuery),
									className: "text-xs gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), "Retry"]
								})
							]
						})
					}) }),
					!employeesLoading && !employeesError && employees.map((emp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
						className: cn("border-b border-border hover:bg-muted/50 transition-colors cursor-pointer", selectedEmp?.id === emp.id && "bg-muted border-l-2 border-l-primary"),
						onClick: () => handleSelectEmployee(emp),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "pl-6 py-4 font-mono text-xs",
								children: emp.employee_code
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-4 font-semibold text-foreground",
								children: emp.full_name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-4 text-muted-foreground text-xs",
								children: emp.department
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "py-4 text-muted-foreground text-xs",
								children: emp.designation
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
								className: "pr-6 py-4 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									className: "h-8 text-primary",
									onClick: (e) => {
										e.stopPropagation();
										handleSelectEmployee(emp);
									},
									children: "View Balances"
								})
							})
						]
					}, emp.id)),
					!employeesLoading && !employeesError && employees.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
						colSpan: 5,
						className: "text-center py-8 text-muted-foreground",
						children: "No employees match search."
					}) })
				] })] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "border border-border bg-card h-fit",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
					className: "text-sm font-semibold flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-4 w-4 text-primary" }), "Detailed Balances"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: selectedEmp ? `Viewing balances for ${selectedEmp.full_name}` : "Select an employee from the table" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "space-y-4",
					children: selectedEmp ? empBalancesLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center py-10 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-5 w-5 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "Fetching records..."
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [empBalances.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border border-border bg-muted/50 rounded-lg p-3 space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: b.leave_type
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: "font-semibold bg-primary/10 text-primary border-primary/20",
									children: [b.remaining_days, " remaining"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[10px] text-muted-foreground flex justify-between pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Total: ",
									b.total_days,
									" days"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Used: ",
									b.used_days,
									" days"
								] })]
							})]
						}, b.leave_type)), empBalances.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground text-center py-4",
							children: "No balances registered for this user."
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center py-12 text-center text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-8 w-8 mb-2 stroke-1" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs",
							children: "Select an employee profile to query database balances."
						})]
					})
				})]
			})]
		})]
	});
}
var LEAVE_TYPES = [
	"Sick Leave",
	"Casual Leave",
	"Vacation Leave"
];
function ApplyLeaveDialog({ open, onOpenChange, balances, isHrAdmin, onSuccess }) {
	const [leaveType, setLeaveType] = (0, import_react.useState)(LEAVE_TYPES[0]);
	const [startDate, setStartDate] = (0, import_react.useState)("");
	const [endDate, setEndDate] = (0, import_react.useState)("");
	const [reason, setReason] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const todayStr = getTodayDateString();
	(0, import_react.useEffect)(() => {
		if (!open) {
			setLeaveType(LEAVE_TYPES[0]);
			setStartDate("");
			setEndDate("");
			setReason("");
			setLoading(false);
		}
	}, [open]);
	const calculatedDays = calculateEstimatedDays(startDate, endDate);
	const selectedBalance = balances.find((b) => b.leave_type === leaveType);
	const remainingDays = selectedBalance ? Number(selectedBalance.remaining_days) || 0 : 0;
	const isExceedingBalance = calculatedDays > 0 && calculatedDays > remainingDays;
	const minStartDate = isHrAdmin ? void 0 : todayStr;
	const minEndDate = startDate || (isHrAdmin ? void 0 : todayStr);
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (calculatedDays <= 0) {
			toast.error("Invalid dates selected. End date must be on or after start date.");
			return;
		}
		if (!reason.trim() || reason.trim().length < 5) {
			toast.error("Please provide a valid reason (min 5 characters).");
			return;
		}
		setLoading(true);
		try {
			const payload = {
				leave_type: leaveType,
				start_date: startDate,
				end_date: endDate,
				reason: reason.trim()
			};
			const res = await api.post("/leaves/apply", payload);
			if (res?.success !== false) {
				toast.success("Leave request submitted successfully!");
				onOpenChange(false);
				onSuccess();
			} else throw new Error(res?.message || "Failed to submit leave request.");
		} catch (err) {
			console.error("Error submitting leave request", err);
			toast.error(err?.data?.message || err?.message || "Failed to apply leave. Ensure you have sufficient balance.");
		} finally {
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md border border-border bg-card text-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
				className: "flex items-center gap-2 text-xl font-bold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-5 w-5 text-primary" }), "Apply for Leave"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
				className: "text-xs",
				children: "Fill in your leave details and submit to your manager for approval."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-4 py-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold text-muted-foreground uppercase",
								children: "Leave Type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted-foreground",
								children: [
									"Remaining:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-semibold text-foreground tabular-nums",
										children: [remainingDays, " days"]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: leaveType,
							onValueChange: setLeaveType,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select type" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: LEAVE_TYPES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: t,
								children: t
							}, t)) })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "apply-start-date",
								className: "text-xs font-semibold text-muted-foreground uppercase",
								children: "Start Date"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "apply-start-date",
								type: "date",
								required: true,
								min: minStartDate,
								value: startDate,
								onChange: (e) => setStartDate(e.target.value)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "apply-end-date",
								className: "text-xs font-semibold text-muted-foreground uppercase",
								children: "End Date"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "apply-end-date",
								type: "date",
								required: true,
								min: minEndDate,
								value: endDate,
								onChange: (e) => setEndDate(e.target.value)
							})]
						})]
					}),
					calculatedDays > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-3 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground text-xs",
							children: "Estimated Duration:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-bold text-primary tabular-nums",
							children: [
								calculatedDays,
								" ",
								calculatedDays === 1 ? "day" : "days",
								" (estimated)"
							]
						})]
					}),
					isExceedingBalance && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("p-3 rounded-lg flex items-start gap-2.5 text-xs border", statusBadgeClass("warning")),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Balance Warning:" }),
							" Requested ",
							calculatedDays,
							" days exceed your remaining",
							" ",
							remainingDays,
							" days for ",
							leaveType,
							". You may still submit, but approval is subject to managerial discretion."
						] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "apply-reason-input",
							className: "text-xs font-semibold text-muted-foreground uppercase",
							children: "Reason for absence"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "apply-reason-input",
							required: true,
							value: reason,
							onChange: (e) => setReason(e.target.value),
							placeholder: "Describe why you need time off (min 5 characters)...",
							className: "min-h-[90px]"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
						className: "gap-2 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							onClick: () => onOpenChange(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: loading || calculatedDays <= 0 || reason.trim().length < 5,
							children: loading ? "Submitting..." : "Submit Application"
						})]
					})
				]
			})]
		})
	});
}
function RejectDialog({ open, onOpenChange, targetLeave, onConfirm, loading = false }) {
	const [rejectionReason, setRejectionReason] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!open) setRejectionReason("");
	}, [open]);
	const handleConfirm = async () => {
		if (!targetLeave || !rejectionReason.trim()) return;
		await onConfirm(targetLeave.id, rejectionReason.trim());
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md border border-border bg-card text-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "text-base font-bold flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-5 w-5 text-destructive" }), "Reason for Rejection"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
					className: "text-xs",
					children: [
						"Provide feedback explaining why this leave application for",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-foreground",
							children: targetLeave?.employee_name
						}),
						" ",
						"is being rejected."
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "reject-textarea",
						className: "sr-only",
						children: "Rejection Reason"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "reject-textarea",
						value: rejectionReason,
						disabled: loading,
						placeholder: "e.g. Project deliverable schedules are tight during these dates...",
						className: "min-h-[100px]",
						onChange: (e) => setRejectionReason(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						disabled: loading,
						onClick: () => onOpenChange(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "destructive",
						disabled: loading || !rejectionReason.trim(),
						className: "gap-2",
						onClick: handleConfirm,
						children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 animate-spin" }), "Confirm Rejection"]
					})]
				})
			]
		})
	});
}
function ApproveDialog({ open, onOpenChange, targetLeave, onConfirm, loading = false }) {
	if (!targetLeave) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md border border-border bg-card text-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "text-base font-bold flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 text-primary" }), "Confirm Leave Approval"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "text-xs",
					children: "Please confirm that you want to approve this leave request."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-3 space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between border-b border-border pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-xs",
								children: "Employee:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: targetLeave.employee_name
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between border-b border-border pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-xs",
								children: "Department:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground",
								children: targetLeave.department
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between border-b border-border pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-xs",
								children: "Leave Type:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-primary",
								children: targetLeave.leave_type
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between border-b border-border pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-xs",
								children: "Duration:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold text-foreground",
								children: [
									targetLeave.total_days,
									" ",
									targetLeave.total_days === 1 ? "day" : "days",
									" (",
									formatDateStr(targetLeave.start_date),
									" to ",
									formatDateStr(targetLeave.end_date),
									")"
								]
							})]
						}),
						targetLeave.reason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-xs block mb-1",
								children: "Reason:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs bg-muted p-2.5 rounded-lg border border-border text-foreground",
								children: targetLeave.reason
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						disabled: loading,
						onClick: () => onOpenChange(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						disabled: loading,
						className: "gap-2",
						onClick: () => onConfirm(targetLeave.id),
						children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 animate-spin" }), "Confirm Approval"]
					})]
				})
			]
		})
	});
}
function CancelLeaveDialog({ open, onOpenChange, targetLeave, onConfirm, loading = false }) {
	if (!targetLeave) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-md border border-border bg-card text-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "text-base font-bold flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, { className: "h-5 w-5 text-destructive" }), "Cancel Leave Application"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "text-xs",
					children: "Are you sure you want to cancel this leave application? This will withdraw the request and restore allocated balances."
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-3 space-y-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between border-b border-border pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-xs",
								children: "Leave Type:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-foreground",
								children: targetLeave.leave_type
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between border-b border-border pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-xs",
								children: "Dates:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold text-foreground",
								children: [
									formatDateStr(targetLeave.start_date),
									" to ",
									formatDateStr(targetLeave.end_date)
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between border-b border-border pb-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground text-xs",
								children: "Total Days:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-semibold tabular-nums text-foreground",
								children: [
									targetLeave.total_days,
									" ",
									targetLeave.total_days === 1 ? "day" : "days"
								]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						disabled: loading,
						onClick: () => onOpenChange(false),
						children: "Keep Leave"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "destructive",
						disabled: loading,
						className: "gap-2",
						onClick: () => onConfirm(targetLeave.id),
						children: [loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 animate-spin" }), "Confirm Cancellation"]
					})]
				})
			]
		})
	});
}
function LeavesPage() {
	const ws = useAurix();
	const currentRole = useCurrentRole();
	const isHrAdmin = currentRole === "hr_admin";
	const isManager = currentRole === "manager";
	const isSuperAdminRole = currentRole === "super_admin";
	const [superAdminReviewAllowed, setSuperAdminReviewAllowed] = (0, import_react.useState)(false);
	const [noEmployeeProfile, setNoEmployeeProfile] = (0, import_react.useState)(false);
	const [activeTab, setActiveTab] = (0, import_react.useState)("my-leaves");
	const [balances, setBalances] = (0, import_react.useState)([]);
	const [balancesLoading, setBalancesLoading] = (0, import_react.useState)(false);
	const [balancesError, setBalancesError] = (0, import_react.useState)(false);
	const [history, setHistory] = (0, import_react.useState)([]);
	const [historyLoading, setHistoryLoading] = (0, import_react.useState)(false);
	const [historyError, setHistoryError] = (0, import_react.useState)(false);
	const hasShownBalanceToastRef = (0, import_react.useRef)(false);
	const hasShownHistoryToastRef = (0, import_react.useRef)(false);
	const [approvals, setApprovals] = (0, import_react.useState)([]);
	const [pendingLoading, setPendingLoading] = (0, import_react.useState)(false);
	const [actionLoadingId, setActionLoadingId] = (0, import_react.useState)(null);
	const [applyOpen, setApplyOpen] = (0, import_react.useState)(false);
	const [approveTarget, setApproveTarget] = (0, import_react.useState)(null);
	const [rejectTarget, setRejectTarget] = (0, import_react.useState)(null);
	const [cancelTarget, setCancelTarget] = (0, import_react.useState)(null);
	const [cancellingId, setCancellingId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!isSuperAdminRole) return;
		let isMounted = true;
		const checkSuperAdminPermissions = async () => {
			try {
				const res = await api.get("/leaves/pending", { headers: { "x-skip-cache": "true" } });
				if (isMounted && res?.success !== false) setSuperAdminReviewAllowed(true);
			} catch {
				if (isMounted) setSuperAdminReviewAllowed(false);
			}
		};
		checkSuperAdminPermissions();
		return () => {
			isMounted = false;
		};
	}, [isSuperAdminRole]);
	const capabilities = (0, import_react.useMemo)(() => {
		const superAllowed = Boolean(ws.user?.can_review_leaves) || Boolean(ws.user?.can_review) || superAdminReviewAllowed;
		return {
			canReview: isHrAdmin || isManager || isSuperAdminRole && superAllowed,
			canViewAllBalances: isHrAdmin,
			canApply: !noEmployeeProfile && !isSuperAdminRole
		};
	}, [
		isHrAdmin,
		isManager,
		isSuperAdminRole,
		ws.user,
		superAdminReviewAllowed,
		noEmployeeProfile
	]);
	(0, import_react.useEffect)(() => {
		if (activeTab === "approvals" && !capabilities.canReview) setActiveTab("my-leaves");
		else if (activeTab === "employee-balances" && !capabilities.canViewAllBalances) setActiveTab("my-leaves");
	}, [
		activeTab,
		capabilities.canReview,
		capabilities.canViewAllBalances
	]);
	const loadBalances = (0, import_react.useCallback)(async () => {
		setBalancesLoading(true);
		setBalancesError(false);
		try {
			const res = await api.get("/leaves/balances", { headers: { "x-skip-cache": "true" } });
			if (res?.success && res.data) setBalances((Array.isArray(res.data) ? res.data : []).map(mapBalance));
			else if (Array.isArray(res)) setBalances(res.map(mapBalance));
			else setBalances([]);
		} catch (err) {
			console.error("Error loading leave balances", err);
			if (err?.status === 404 || err?.data?.message?.toLowerCase?.()?.includes("employee profile not found") || err?.message?.toLowerCase?.()?.includes("employee profile not found")) setNoEmployeeProfile(true);
			else {
				setBalancesError(true);
				if (!hasShownBalanceToastRef.current) {
					hasShownBalanceToastRef.current = true;
					toast.error(err?.data?.message || err?.message || "Failed to load leave balances.");
				}
			}
		} finally {
			setBalancesLoading(false);
		}
	}, []);
	const loadHistory = (0, import_react.useCallback)(async () => {
		setHistoryLoading(true);
		setHistoryError(false);
		try {
			const res = await api.get("/leaves/history", { headers: { "x-skip-cache": "true" } });
			if (res?.success && res.data) setHistory((Array.isArray(res.data) ? res.data : []).map(mapLeave));
			else if (Array.isArray(res)) setHistory(res.map(mapLeave));
			else setHistory([]);
		} catch (err) {
			console.error("Error loading leave history", err);
			if (err?.status === 404 || err?.data?.message?.toLowerCase?.()?.includes("employee profile not found") || err?.message?.toLowerCase?.()?.includes("employee profile not found")) setNoEmployeeProfile(true);
			else {
				setHistoryError(true);
				if (!hasShownHistoryToastRef.current) {
					hasShownHistoryToastRef.current = true;
					toast.error(err?.data?.message || err?.message || "Failed to load leave history.");
				}
			}
		} finally {
			setHistoryLoading(false);
		}
	}, []);
	const loadPendingApprovals = (0, import_react.useCallback)(async () => {
		setPendingLoading(true);
		try {
			const res = await api.get("/leaves/pending", { headers: { "x-skip-cache": "true" } });
			if (!res?.success && res?.success !== void 0) throw new Error(res?.message || "Failed to load pending leave requests.");
			setApprovals((Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []).map(mapLeave));
		} catch (err) {
			console.error("Error loading pending leaves", err);
			toast.error(err?.data?.message || err?.message || "Failed to load pending leave requests.");
		} finally {
			setPendingLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		if (activeTab === "my-leaves") {
			loadBalances();
			loadHistory();
		}
	}, [
		activeTab,
		loadBalances,
		loadHistory
	]);
	(0, import_react.useEffect)(() => {
		if (capabilities.canReview) loadPendingApprovals();
	}, [capabilities.canReview, loadPendingApprovals]);
	(0, import_react.useEffect)(() => {
		if (!capabilities.canReview || activeTab !== "approvals") return;
		loadPendingApprovals();
		const interval = window.setInterval(() => {
			if (!document.hidden) loadPendingApprovals();
		}, 3e4);
		const handleVisibilityChange = () => {
			if (!document.hidden) loadPendingApprovals();
		};
		document.addEventListener("visibilitychange", handleVisibilityChange);
		return () => {
			window.clearInterval(interval);
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, [
		capabilities.canReview,
		activeTab,
		loadPendingApprovals
	]);
	const handleApproveConfirm = async (id) => {
		if (actionLoadingId) return;
		setActionLoadingId(id);
		try {
			const res = await api.post(`/leaves/${id}/review`, { status: "APPROVED" });
			if (res?.success !== false) {
				toast.success("Leave request approved.");
				setApprovals((prev) => prev.filter((item) => item.id !== id));
				setApproveTarget(null);
			} else throw new Error(res?.message || "Failed to approve leave request.");
		} catch (err) {
			console.error("Error approving leave request", err);
			toast.error(err?.data?.message || err?.message || "Failed to approve leave request.");
		} finally {
			setActionLoadingId(null);
		}
	};
	const handleRejectConfirm = async (id, reason) => {
		if (actionLoadingId) return;
		setActionLoadingId(id);
		try {
			const res = await api.post(`/leaves/${id}/review`, {
				status: "REJECTED",
				rejection_reason: reason
			});
			if (res?.success !== false) {
				toast.success("Leave request rejected.");
				setApprovals((prev) => prev.filter((item) => item.id !== id));
				setRejectTarget(null);
			} else throw new Error(res?.message || "Failed to reject leave request.");
		} catch (err) {
			console.error("Error rejecting leave request", err);
			toast.error(err?.data?.message || err?.message || "Failed to reject leave request.");
		} finally {
			setActionLoadingId(null);
		}
	};
	const handleCancelConfirm = async (id) => {
		if (cancellingId) return;
		setCancellingId(id);
		try {
			const res = await api.post(`/leaves/${id}/cancel`);
			if (res?.success !== false) {
				toast.success("Leave request cancelled successfully.");
				setCancelTarget(null);
				loadBalances();
				loadHistory();
			} else throw new Error(res?.message || "Failed to cancel leave request.");
		} catch (err) {
			console.error("Error cancelling leave request", err);
			toast.error(err?.data?.message || err?.message || "Failed to cancel leave request.");
		} finally {
			setCancellingId(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		noEmployeeProfile && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 rounded-xl border border-border bg-muted p-4 text-foreground flex items-start gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-5 w-5 shrink-0 mt-0.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
				className: "font-semibold text-sm text-foreground",
				children: "Employee Profile Not Found"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground mt-0.5",
				children: "Your account does not have an active employee profile associated with it. Personal leave filing is unavailable."
			})] })]
		}),
		capabilities.canApply && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-end mb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => setApplyOpen(true),
				className: "gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Apply for Leave"]
			})
		}),
		(capabilities.canReview || capabilities.canViewAllBalances) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex border border-border bg-muted p-1 rounded-xl max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setActiveTab("my-leaves"),
					className: cn("flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all", activeTab === "my-leaves" ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"),
					children: "My Leaves"
				}),
				capabilities.canReview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setActiveTab("approvals"),
					className: cn("flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all", activeTab === "approvals" ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"),
					children: ["Review Requests", approvals.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: cn("ml-2 border", statusBadgeClass("pending")),
						children: approvals.length
					})]
				}),
				capabilities.canViewAllBalances && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setActiveTab("employee-balances"),
					className: cn("flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all", activeTab === "employee-balances" ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"),
					children: "All Balances"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AnimatePresence, {
			mode: "wait",
			children: [
				activeTab === "my-leaves" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
					initial: {
						opacity: 0,
						y: 15
					},
					animate: {
						opacity: 1,
						y: 0
					},
					exit: {
						opacity: 0,
						y: -15
					},
					transition: { duration: .2 },
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BalanceCards, {
						balances,
						loading: balancesLoading,
						error: balancesError,
						onRetry: loadBalances
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HistoryTable, {
						history,
						loading: historyLoading,
						error: historyError,
						onRetry: loadHistory,
						onCancelRequest: (leave) => setCancelTarget(leave),
						cancellingId
					})]
				}, "my-leaves"),
				activeTab === "approvals" && capabilities.canReview && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					initial: {
						opacity: 0,
						y: 15
					},
					animate: {
						opacity: 1,
						y: 0
					},
					exit: {
						opacity: 0,
						y: -15
					},
					transition: { duration: .2 },
					className: "space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApprovalsList, {
						approvals,
						loading: pendingLoading,
						onRefresh: loadPendingApprovals,
						onApproveClick: (leave) => setApproveTarget(leave),
						onRejectClick: (leave) => setRejectTarget(leave),
						actionLoadingId
					})
				}, "approvals"),
				activeTab === "employee-balances" && capabilities.canViewAllBalances && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(motion.div, {
					initial: {
						opacity: 0,
						y: 15
					},
					animate: {
						opacity: 1,
						y: 0
					},
					exit: {
						opacity: 0,
						y: -15
					},
					transition: { duration: .2 },
					className: "space-y-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AllBalancesPanel, {})
				}, "employee-balances")
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApplyLeaveDialog, {
			open: applyOpen,
			onOpenChange: setApplyOpen,
			balances,
			isHrAdmin,
			onSuccess: () => {
				loadBalances();
				loadHistory();
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApproveDialog, {
			open: Boolean(approveTarget),
			onOpenChange: (open) => {
				if (!open) setApproveTarget(null);
			},
			targetLeave: approveTarget,
			onConfirm: handleApproveConfirm,
			loading: Boolean(actionLoadingId)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RejectDialog, {
			open: Boolean(rejectTarget),
			onOpenChange: (open) => {
				if (!open) setRejectTarget(null);
			},
			targetLeave: rejectTarget,
			onConfirm: handleRejectConfirm,
			loading: Boolean(actionLoadingId)
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CancelLeaveDialog, {
			open: Boolean(cancelTarget),
			onOpenChange: (open) => {
				if (!open) setCancelTarget(null);
			},
			targetLeave: cancelTarget,
			onConfirm: handleCancelConfirm,
			loading: Boolean(cancellingId)
		})
	] });
}
//#endregion
export { LeavesPage, LeavesPage as default };
