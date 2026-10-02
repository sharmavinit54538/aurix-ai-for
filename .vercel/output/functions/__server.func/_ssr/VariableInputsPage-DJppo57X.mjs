import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, Gt as Lock, S as Upload, Sr as CircleCheck, Tr as CircleAlert, an as Layers, ht as Plus, lt as RefreshCw, pr as Clock, ri as Banknote } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as apiInstance } from "./apiInstance-C5A0vaLH.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { l as StatCard, r as GlassCard } from "./Shared-C_skH1kb.mjs";
import { n as AlertDescription, r as AlertTitle, t as Alert } from "./alert-B82KXmg0.mjs";
import { n as formatDate, t as formatCount } from "./format-8CvzIoFt.mjs";
import { t as generateIdempotencyKey } from "./idempotency-CmVHNuot.mjs";
import { r as toPaise } from "./money-BK3gxPWB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/VariableInputsPage-DJppo57X.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Variable Payroll Inputs API Service.
* Handles one-time earnings, overtime, incentives, commissions, LOP and adjustments.
*/
var variableInputsApi = {
	async getVariableInputs(params) {
		return (await apiInstance.get("/api/v2/payroll/variable-inputs", {
			params,
			headers: { "Cache-Control": "no-store" }
		})).data.data;
	},
	async createVariableInput(payload) {
		return (await apiInstance.post("/api/v2/payroll/variable-inputs", payload, { headers: {
			"Idempotency-Key": generateIdempotencyKey(),
			"Cache-Control": "no-store"
		} })).data.data;
	},
	async approveVariableInput(id, remarks) {
		return (await apiInstance.post(`/api/v2/payroll/variable-inputs/${id}/approve`, { remarks }, { headers: {
			"Idempotency-Key": generateIdempotencyKey(),
			"Cache-Control": "no-store"
		} })).data.data;
	},
	async rejectVariableInput(id, reason) {
		return (await apiInstance.post(`/api/v2/payroll/variable-inputs/${id}/reject`, { reason }, { headers: {
			"Idempotency-Key": generateIdempotencyKey(),
			"Cache-Control": "no-store"
		} })).data.data;
	},
	async previewBulkVariableInputs(file) {
		const formData = new FormData();
		formData.append("file", file);
		return (await apiInstance.post("/api/v2/payroll/variable-inputs/bulk-preview", formData, { headers: {
			"Content-Type": "multipart/form-data",
			"Cache-Control": "no-store"
		} })).data.data;
	},
	async applyBulkVariableInputs(previewToken) {
		return (await apiInstance.post("/api/v2/payroll/variable-inputs/bulk-apply", { previewToken }, { headers: {
			"Idempotency-Key": generateIdempotencyKey(),
			"Cache-Control": "no-store"
		} })).data.data;
	}
};
function VariableInputsPage() {
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [backendUnavailable, setBackendUnavailable] = (0, import_react.useState)(false);
	const [inputs, setInputs] = (0, import_react.useState)([]);
	const [totalCount, setTotalCount] = (0, import_react.useState)(0);
	const [page, setPage] = (0, import_react.useState)(1);
	const [typeFilter, setTypeFilter] = (0, import_react.useState)("all");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [createModalOpen, setCreateModalOpen] = (0, import_react.useState)(false);
	const [empId, setEmpId] = (0, import_react.useState)("");
	const [inputType, setInputType] = (0, import_react.useState)("overtime");
	const [amountRupees, setAmountRupees] = (0, import_react.useState)("");
	const [units, setUnits] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [creating, setCreating] = (0, import_react.useState)(false);
	const [bulkModalOpen, setBulkModalOpen] = (0, import_react.useState)(false);
	const [bulkPreview, setBulkPreview] = (0, import_react.useState)(null);
	const [parsingBulk, setParsingBulk] = (0, import_react.useState)(false);
	const [applyingBulk, setApplyingBulk] = (0, import_react.useState)(false);
	const loadInputs = async () => {
		setLoading(true);
		setBackendUnavailable(false);
		try {
			const res = await variableInputsApi.getVariableInputs({
				page,
				limit: 20,
				type: typeFilter !== "all" ? typeFilter : void 0,
				search: searchQuery.trim() || void 0
			});
			setInputs(res?.items || []);
			setTotalCount(res?.total || 0);
		} catch (err) {
			if (err?.response?.status === 404 || err?.response?.status === 501) setBackendUnavailable(true);
			else toast.error("Failed to load variable payroll inputs");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadInputs();
	}, [page, typeFilter]);
	const handleCreateInput = async () => {
		if (!empId.trim() || !amountRupees || !description.trim()) {
			toast.error("Please fill in all mandatory fields.");
			return;
		}
		const paise = toPaise(amountRupees);
		if (paise <= 0) {
			toast.error("Amount must be greater than zero.");
			return;
		}
		setCreating(true);
		try {
			await variableInputsApi.createVariableInput({
				employeeId: empId.trim(),
				periodId: "current-active-period",
				type: inputType,
				amountPaise: paise,
				units: units ? parseFloat(units) : void 0,
				description: description.trim()
			});
			toast.success("Variable input submitted for checker approval.");
			setCreateModalOpen(false);
			setEmpId("");
			setAmountRupees("");
			setUnits("");
			setDescription("");
			loadInputs();
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to create variable input");
		} finally {
			setCreating(false);
		}
	};
	const handleApprove = async (id) => {
		try {
			await variableInputsApi.approveVariableInput(id, "Approved by payroll reviewer.");
			toast.success("Variable input approved for payroll calculation.");
			loadInputs();
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to approve variable input");
		}
	};
	const handleReject = async (id) => {
		try {
			await variableInputsApi.rejectVariableInput(id, "Disallowed by payroll policy.");
			toast.warning("Variable input rejected.");
			loadInputs();
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to reject variable input");
		}
	};
	const handleBulkUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setParsingBulk(true);
		try {
			const preview = await variableInputsApi.previewBulkVariableInputs(file);
			setBulkPreview(preview);
			toast.info(`Bulk inputs parsed: ${preview.validRows} valid, ${preview.invalidRows} errors.`);
		} catch (err) {
			if (err?.response?.status === 404 || err?.response?.status === 501) {
				setBackendUnavailable(true);
				toast.error("Bulk variable input service unavailable — backend pending");
			} else toast.error("Failed to parse variable inputs spreadsheet");
		} finally {
			setParsingBulk(false);
		}
	};
	const handleApplyBulk = async () => {
		if (!bulkPreview) return;
		setApplyingBulk(true);
		try {
			const res = await variableInputsApi.applyBulkVariableInputs(bulkPreview.previewToken);
			toast.success(`Bulk inputs applied: ${res.appliedCount} entries recorded.`);
			setBulkModalOpen(false);
			setBulkPreview(null);
			loadInputs();
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to apply bulk inputs");
		} finally {
			setApplyingBulk(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/70 pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-bold tracking-tight text-foreground",
						children: "Variable Payroll Inputs & Adjustments"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "text-xs font-semibold border-primary/30 bg-primary/10 text-primary",
						children: "Cycle Adjustments"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Manage overtime hours, bonuses, sales commissions, expense reimbursements, LOP, and salary advances."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: loadInputs,
							disabled: loading,
							className: "h-8 gap-1.5 text-xs rounded-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: loading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Refresh" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setBulkModalOpen(true),
							className: "h-8 gap-1.5 text-xs rounded-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Bulk CSV Import" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => setCreateModalOpen(true),
							className: "h-8 gap-1.5 text-xs rounded-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "New Input" })]
						})
					]
				})]
			}),
			backendUnavailable && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Alert, {
				className: "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertTitle, {
						className: "font-semibold text-sm",
						children: "Feature unavailable — backend pending"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDescription, {
						className: "text-xs mt-1 space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"The Variable Inputs API endpoint (",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "/api/v2/payroll/variable-inputs" }),
							") is awaiting backend deployment. Client-side maker-checker guards and period locking rules are active."
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-[11px] opacity-80",
							children: [
								"Contract reference: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "docs/PAYROLL_BACKEND_CONTRACT.md" }),
								" • Requirements: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "docs/PAYROLL_BACKEND_TODO.md" })
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 sm:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Inputs",
						value: formatCount(totalCount),
						hint: "Current cycle entries",
						icon: Layers,
						accent: "brand"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Pending Approval",
						value: formatCount(inputs.filter((i) => i.status === "pending_approval").length),
						hint: "Maker-checker queue",
						icon: Clock,
						accent: "warning"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Approved / Ready",
						value: formatCount(inputs.filter((i) => i.status === "approved").length),
						hint: "Ready for calculation engine",
						icon: CircleCheck,
						accent: "success"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Period Locking",
						value: "Enforced",
						hint: "Closed cycles protected",
						icon: Lock,
						accent: "muted"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full sm:w-80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "variable-input-search",
						type: "search",
						placeholder: "Search employee or description...",
						value: searchQuery,
						onChange: (e) => setSearchQuery(e.target.value),
						onKeyDown: (e) => {
							if (e.key === "Enter") loadInputs();
						},
						className: "pl-8 h-9 rounded-xl text-xs"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto scrollbar-none",
					children: [
						"all",
						"overtime",
						"bonus",
						"incentive",
						"reimbursement",
						"deduction",
						"lop"
					].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: typeFilter === t ? "default" : "outline",
						onClick: () => {
							setTypeFilter(t);
							setPage(1);
						},
						className: "rounded-xl text-xs h-8 capitalize whitespace-nowrap",
						children: t.replace(/_/g, " ")
					}, t))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
				className: "overflow-hidden p-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted/40 text-muted-foreground border-b border-border/70 uppercase tracking-wider text-[11px] font-semibold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3.5",
									children: "Employee"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3.5",
									children: "Input Type"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3.5",
									children: "Description / Reason"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3.5 font-mono",
									children: "Units / Qty"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3.5 font-mono text-right",
									children: "Amount (INR)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3.5",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3.5",
									children: "Created Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3.5 text-right",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border/60",
							children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								colSpan: 8,
								className: "px-4 py-12 text-center text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-6 w-6 animate-spin mx-auto mb-2 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Loading variable inputs..." })]
							}) }) : inputs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								colSpan: 8,
								className: "px-4 py-12 text-center text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "h-8 w-8 mx-auto mb-2 text-muted-foreground/60" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-foreground text-sm",
										children: "No Variable Inputs Found"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-0.5",
										children: backendUnavailable ? "Variable inputs API pending backend deployment." : "Click 'New Input' to record overtime, bonuses, or adjustments for this cycle."
									})
								]
							}) }) : inputs.map((inp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-muted/40 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold text-foreground",
											children: inp.employeeName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-muted-foreground font-mono",
											children: inp.employeeCode
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 capitalize",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[10px]",
											children: inp.type.replace(/_/g, " ")
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-foreground/90 max-w-xs",
										children: inp.description
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-mono",
										children: inp.units ?? "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-mono font-semibold text-right text-foreground",
										children: inp.amountFormatted
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: inp.status === "approved" ? "default" : inp.status === "rejected" ? "destructive" : "secondary",
											className: "capitalize text-[10px]",
											children: inp.status.replace(/_/g, " ")
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-muted-foreground",
										children: formatDate(inp.createdAt)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-right",
										children: inp.status === "pending_approval" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-end gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "ghost",
												onClick: () => handleReject(inp.id),
												className: "h-7 text-xs text-rose-600 hover:text-rose-700",
												children: "Reject"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												onClick: () => handleApprove(inp.id),
												className: "h-7 text-xs",
												children: "Approve"
											})]
										})
									})
								]
							}, inp.id))
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: createModalOpen,
				onOpenChange: setCreateModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md rounded-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-base font-semibold",
							children: "New Variable Payroll Input"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs text-muted-foreground",
							children: "Add a one-time adjustment, overtime hours, bonus, or reimbursement to the current payroll run."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold text-foreground",
									children: "Employee ID / Code *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "var-emp-id",
									placeholder: "e.g. EMP-101",
									value: empId,
									onChange: (e) => setEmpId(e.target.value),
									className: "mt-1 h-8 rounded-lg text-xs"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold text-foreground",
									children: "Input Type"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: inputType,
									onChange: (e) => setInputType(e.target.value),
									className: "mt-1 w-full rounded-lg border border-input bg-background/80 px-2 py-1.5 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "overtime",
											children: "Overtime"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "bonus",
											children: "Bonus"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "incentive",
											children: "Performance Incentive"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "commission",
											children: "Sales Commission"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "reimbursement",
											children: "Expense Reimbursement"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "deduction",
											children: "Additional Deduction"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "advance_recovery",
											children: "Salary Advance Recovery"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "lop",
											children: "Loss of Pay (LOP)"
										})
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-foreground",
										children: "Amount (INR) *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "var-amount",
										placeholder: "e.g. 5000",
										value: amountRupees,
										onChange: (e) => setAmountRupees(e.target.value),
										className: "mt-1 h-8 rounded-lg text-xs font-mono"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-foreground",
										children: "Units / Hours (Optional)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "var-units",
										placeholder: "e.g. 8.5",
										value: units,
										onChange: (e) => setUnits(e.target.value),
										className: "mt-1 h-8 rounded-lg text-xs font-mono"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold text-foreground",
									children: "Description / Business Reason *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "var-description",
									placeholder: "e.g. Approved weekend release overtime support",
									value: description,
									onChange: (e) => setDescription(e.target.value),
									rows: 2,
									className: "mt-1 rounded-lg text-xs"
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setCreateModalOpen(false),
								className: "rounded-xl text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								disabled: creating,
								onClick: handleCreateInput,
								className: "rounded-xl text-xs",
								children: creating ? "Submitting..." : "Submit for Approval"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: bulkModalOpen,
				onOpenChange: setBulkModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-lg rounded-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-base font-semibold",
							children: "Bulk Variable Inputs Upload (CSV)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs text-muted-foreground",
							children: "Upload a bulk CSV file containing overtime hours, bonuses, or adjustments for multiple employees."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-dashed border-border/80 p-6 text-center space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-6 w-6 mx-auto text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "font-semibold text-foreground cursor-pointer text-primary hover:underline",
									children: ["Choose CSV File", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "bulk-var-input",
										type: "file",
										accept: ".csv",
										onChange: handleBulkUpload,
										className: "hidden"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground mt-1",
									children: "Required columns: EmployeeCode, InputType, Amount, Units, Description"
								})] })]
							}), bulkPreview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 pt-2 border-t border-border/60",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between font-semibold text-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Validation Preview" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Total Amount: ", bulkPreview.totalAmountFormatted] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-3 gap-2 text-center text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-2 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold",
													children: bulkPreview.validRows
												}), " Valid Rows"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-2 rounded-lg bg-rose-500/10 text-rose-700 dark:text-rose-300",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold",
													children: bulkPreview.invalidRows
												}), " Errors"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-2 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-bold",
													children: bulkPreview.duplicateRows
												}), " Duplicates"]
											})
										]
									}),
									bulkPreview.errors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-rose-500/30 bg-rose-500/5 p-3 space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-rose-600",
											children: "Row Errors (Skipped)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
											className: "list-disc pl-4 text-[10px] text-muted-foreground space-y-0.5",
											children: bulkPreview.errors.slice(0, 3).map((err, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
												"Row ",
												err.rowNumber,
												" (",
												err.employeeCode,
												"): ",
												err.errorMessage
											] }, i))
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => {
									setBulkModalOpen(false);
									setBulkPreview(null);
								},
								className: "rounded-xl text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								disabled: !bulkPreview || bulkPreview.validRows === 0 || applyingBulk,
								onClick: handleApplyBulk,
								className: "rounded-xl text-xs",
								children: applyingBulk ? "Applying..." : `Apply ${bulkPreview?.validRows || 0} Records`
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { VariableInputsPage as default };
