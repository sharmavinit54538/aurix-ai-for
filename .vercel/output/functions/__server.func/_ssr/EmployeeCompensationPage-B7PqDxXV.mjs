import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, E as TrendingUp, S as Upload, T as TriangleAlert, Tr as CircleAlert, an as Layers, lt as RefreshCw, mn as History, p as Users, q as ShieldCheck, x as UserCheck } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { l as StatCard, r as GlassCard } from "./Shared-C_skH1kb.mjs";
import { n as AlertDescription, r as AlertTitle, t as Alert } from "./alert-B82KXmg0.mjs";
import { n as formatDate, t as formatCount } from "./format-8CvzIoFt.mjs";
import { t as compensationApi } from "./compensationApi-B-vb0VVg.mjs";
import { r as toPaise } from "./money-BK3gxPWB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/EmployeeCompensationPage-B7PqDxXV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EmployeeCompensationPage() {
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [backendUnavailable, setBackendUnavailable] = (0, import_react.useState)(false);
	const [compensations, setCompensations] = (0, import_react.useState)([]);
	const [totalCount, setTotalCount] = (0, import_react.useState)(0);
	const [page, setPage] = (0, import_react.useState)(1);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [revisionModalOpen, setRevisionModalOpen] = (0, import_react.useState)(false);
	const [selectedEmp, setSelectedEmp] = (0, import_react.useState)(null);
	const [newCtcRupees, setNewCtcRupees] = (0, import_react.useState)("");
	const [effectiveDate, setEffectiveDate] = (0, import_react.useState)("");
	const [revisionReason, setRevisionReason] = (0, import_react.useState)("");
	const [submittingRevision, setSubmittingRevision] = (0, import_react.useState)(false);
	const [historyModalOpen, setHistoryModalOpen] = (0, import_react.useState)(false);
	const [bulkModalOpen, setBulkModalOpen] = (0, import_react.useState)(false);
	const [bulkFile, setBulkFile] = (0, import_react.useState)(null);
	const [bulkPreview, setBulkPreview] = (0, import_react.useState)(null);
	const [parsingBulk, setParsingBulk] = (0, import_react.useState)(false);
	const [applyingBulk, setApplyingBulk] = (0, import_react.useState)(false);
	const loadCompensations = async () => {
		setLoading(true);
		setBackendUnavailable(false);
		try {
			const res = await compensationApi.getEmployeeCompensations({
				page,
				limit: 20,
				search: searchQuery.trim() || void 0
			});
			setCompensations(res?.items || []);
			setTotalCount(res?.total || 0);
		} catch (err) {
			if (err?.response?.status === 404 || err?.response?.status === 501) setBackendUnavailable(true);
			else toast.error("Failed to load employee compensations");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadCompensations();
	}, [page]);
	const isPastEffectiveDate = Boolean(effectiveDate && new Date(effectiveDate) < new Date((/* @__PURE__ */ new Date()).setHours(0, 0, 0, 0)));
	const handleProposeRevision = async () => {
		if (!selectedEmp || !newCtcRupees || !effectiveDate || !revisionReason.trim()) {
			toast.error("Please fill in all mandatory revision fields.");
			return;
		}
		const paise = toPaise(newCtcRupees);
		if (paise <= 0) {
			toast.error("CTC must be a positive amount.");
			return;
		}
		setSubmittingRevision(true);
		try {
			await compensationApi.proposeCompensationRevision(selectedEmp.employeeId, {
				newCtcAnnualPaise: paise,
				effectiveDate,
				reason: revisionReason.trim()
			});
			toast.success("Compensation revision proposed for checker approval.");
			setRevisionModalOpen(false);
			setNewCtcRupees("");
			setEffectiveDate("");
			setRevisionReason("");
			loadCompensations();
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to propose compensation revision");
		} finally {
			setSubmittingRevision(false);
		}
	};
	const handleBulkUpload = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setBulkFile(file);
		setParsingBulk(true);
		try {
			const preview = await compensationApi.previewBulkCompensation(file);
			setBulkPreview(preview);
			toast.info(`Bulk template validated: ${preview.validRows} valid rows, ${preview.invalidRows} errors.`);
		} catch (err) {
			if (err?.response?.status === 404 || err?.response?.status === 501) {
				setBackendUnavailable(true);
				toast.error("Bulk compensation service unavailable — backend pending");
			} else toast.error("Failed to validate bulk compensation CSV");
		} finally {
			setParsingBulk(false);
		}
	};
	const handleApplyBulk = async () => {
		if (!bulkPreview) return;
		setApplyingBulk(true);
		try {
			const res = await compensationApi.applyBulkCompensation(bulkPreview.previewToken);
			toast.success(`Bulk compensation updated: ${res.appliedCount} employee records updated.`);
			setBulkModalOpen(false);
			setBulkPreview(null);
			setBulkFile(null);
			loadCompensations();
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to apply bulk compensation updates");
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
						children: "Employee Compensation & Revisions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "text-xs font-semibold border-primary/30 bg-primary/10 text-primary",
						children: "CTC Management"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Manage employee salary structures, execute maker-checker compensation revisions, and process bulk increments."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: loadCompensations,
						disabled: loading,
						className: "h-8 gap-1.5 text-xs rounded-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: loading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Refresh" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => setBulkModalOpen(true),
						className: "h-8 gap-1.5 text-xs rounded-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Bulk CSV Import" })]
					})]
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
							"The Employee Compensation & Revision API endpoint (",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "/api/v2/payroll/compensations" }),
							") is awaiting backend deployment. Salary breakdown views and bulk validation checks are ready."
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
						label: "Total Compensations",
						value: formatCount(totalCount),
						hint: "Active employee records",
						icon: Users,
						accent: "brand"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Pending Revisions",
						value: formatCount(compensations.filter((c) => c.status === "pending_approval").length),
						hint: "Awaiting checker approval",
						icon: UserCheck,
						accent: "warning"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Structures Assigned",
						value: formatCount(new Set(compensations.map((c) => c.structureId)).size),
						hint: "Active templates in use",
						icon: Layers,
						accent: "muted"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Arrears Protected",
						value: "Active",
						hint: "Retroactive revision guard",
						icon: ShieldCheck,
						accent: "success"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-between gap-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full sm:w-80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "emp-comp-search-input",
						type: "search",
						placeholder: "Search employee code or name...",
						value: searchQuery,
						onChange: (e) => setSearchQuery(e.target.value),
						onKeyDown: (e) => {
							if (e.key === "Enter") loadCompensations();
						},
						className: "pl-8 h-9 rounded-xl text-xs"
					})]
				})
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
									children: "Department"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3.5",
									children: "Salary Structure"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3.5 font-mono text-right",
									children: "Annual CTC"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3.5 font-mono text-right",
									children: "Monthly Gross"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3.5",
									children: "Effective Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3.5",
									children: "Status"
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
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-6 w-6 animate-spin mx-auto mb-2 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Loading compensation records..." })]
							}) }) : compensations.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								colSpan: 8,
								className: "px-4 py-12 text-center text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-8 w-8 mx-auto mb-2 text-muted-foreground/60" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-foreground text-sm",
										children: "No Compensation Records Found"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-0.5",
										children: backendUnavailable ? "Compensation API pending backend deployment." : "Assign salary structures to employees to view their CTC details."
									})
								]
							}) }) : compensations.map((emp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-muted/40 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold text-foreground",
											children: emp.employeeName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-muted-foreground font-mono",
											children: emp.employeeCode
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-foreground",
										children: emp.department
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-medium text-primary",
										children: emp.structureName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-mono font-semibold text-right text-foreground",
										children: emp.ctcAnnualFormatted
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-mono text-right text-emerald-600 dark:text-emerald-400 font-semibold",
										children: emp.ctcMonthlyFormatted
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-muted-foreground",
										children: formatDate(emp.effectiveDate)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: emp.status === "active" ? "default" : "secondary",
											className: "capitalize text-[10px]",
											children: emp.status.replace(/_/g, " ")
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-end gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "outline",
												onClick: () => {
													setSelectedEmp(emp);
													setHistoryModalOpen(true);
												},
												className: "h-7 text-xs rounded-lg gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "History" })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												onClick: () => {
													setSelectedEmp(emp);
													setRevisionModalOpen(true);
												},
												className: "h-7 text-xs rounded-lg gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Revise CTC" })]
											})]
										})
									})
								]
							}, emp.id))
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: revisionModalOpen,
				onOpenChange: setRevisionModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md rounded-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-base font-semibold",
							children: "Propose Compensation Revision"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
							className: "text-xs text-muted-foreground",
							children: [
								"Submit a revised annual CTC for ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: selectedEmp?.employeeName }),
								" (",
								selectedEmp?.employeeCode,
								"). Subject to maker-checker governance approval."
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-muted-foreground",
									children: "Current Annual CTC"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-mono font-bold text-sm text-foreground mt-0.5",
									children: selectedEmp?.ctcAnnualFormatted
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold text-foreground",
									children: "New Proposed Annual CTC (INR) *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "new-ctc-input",
									placeholder: "e.g. 1500000",
									value: newCtcRupees,
									onChange: (e) => setNewCtcRupees(e.target.value),
									className: "mt-1 h-8 rounded-lg text-xs font-mono"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold text-foreground",
									children: "Effective Date *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "effective-date-input",
									type: "date",
									value: effectiveDate,
									onChange: (e) => setEffectiveDate(e.target.value),
									className: "mt-1 h-8 rounded-lg text-xs"
								})] }),
								isPastEffectiveDate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-amber-900 dark:text-amber-200 space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-amber-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Retroactive Revision & Arrears Impact" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] leading-relaxed",
										children: "The chosen effective date is in the past. If approved, retroactive arrears will automatically be queued for calculation in the next payroll calculation run."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold text-foreground",
									children: "Justification Reason *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "revision-reason-input",
									placeholder: "e.g. Annual appraisal increment / promotion to Senior Staff",
									value: revisionReason,
									onChange: (e) => setRevisionReason(e.target.value),
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
								onClick: () => setRevisionModalOpen(false),
								className: "rounded-xl text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								disabled: submittingRevision,
								onClick: handleProposeRevision,
								className: "rounded-xl text-xs",
								children: submittingRevision ? "Submitting..." : "Propose for Approval"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: historyModalOpen,
				onOpenChange: setHistoryModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-lg rounded-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "text-base font-semibold",
							children: ["Compensation History: ", selectedEmp?.employeeName]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs text-muted-foreground",
							children: "Audit log of salary structure revisions, maker-checker sign-offs, and effective dates."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3 py-2 text-xs max-h-96 overflow-y-auto",
							children: !selectedEmp?.revisions || selectedEmp.revisions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-center text-muted-foreground py-6",
								children: "No past revisions recorded for this employee."
							}) : selectedEmp.revisions.map((rev) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border/70 p-3 space-y-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-semibold text-foreground",
											children: [
												"Revision #",
												rev.revisionNumber,
												" • ",
												formatDate(rev.effectiveDate)
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: rev.status === "approved" ? "default" : "secondary",
											children: rev.status
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Previous: "
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono",
												children: rev.previousCtcFormatted
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mx-2 text-muted-foreground",
												children: "→"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono font-bold text-foreground",
												children: rev.newCtcFormatted
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-[11px] text-muted-foreground italic",
										children: [
											"\"",
											rev.reason,
											"\""
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-muted-foreground pt-1 border-t border-border/40",
										children: [
											"Proposed by: ",
											rev.maker.name,
											" •",
											" ",
											rev.checker ? `Approved by: ${rev.checker.name}` : "Pending Approval"
										]
									})
								]
							}, rev.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setHistoryModalOpen(false),
							className: "rounded-xl text-xs",
							children: "Close"
						}) })
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
							children: "Bulk Compensation Update (CSV)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs text-muted-foreground",
							children: "Upload a batch spreadsheet to update employee CTC figures across your organization."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-dashed border-border/80 p-6 text-center space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-6 w-6 mx-auto text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "font-semibold text-foreground cursor-pointer text-primary hover:underline",
									children: ["Select Bulk Compensation CSV", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										id: "bulk-comp-input",
										type: "file",
										accept: ".csv",
										onChange: handleBulkUpload,
										className: "hidden"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground mt-1",
									children: "Required columns: EmployeeCode, ComponentCode, Amount, EffectiveDate"
								})] })]
							}), bulkPreview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 pt-2 border-t border-border/60",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between font-semibold text-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Validation Preview" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [bulkPreview.affectedEmployeesCount, " Employees Affected"] })]
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
											children: "Row Errors (Will be skipped)"
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
export { EmployeeCompensationPage as default };
