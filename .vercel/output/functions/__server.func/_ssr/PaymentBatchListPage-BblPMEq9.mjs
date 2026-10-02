import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, Sr as CircleCheck, Xn as ExternalLink, an as Layers, ht as Plus, lt as RefreshCw, pr as Clock, ri as Banknote } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { l as StatCard, r as GlassCard } from "./Shared-C_skH1kb.mjs";
import { n as formatDate, t as formatCount } from "./format-8CvzIoFt.mjs";
import { t as payrollApi } from "./payrollApi-Q5rJ9by9.mjs";
import { t as paymentApi } from "./paymentApi-ymZ2k77q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PaymentBatchListPage-BblPMEq9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PaymentBatchListPage() {
	const navigate = useNavigate();
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [batches, setBatches] = (0, import_react.useState)([]);
	const [totalCount, setTotalCount] = (0, import_react.useState)(0);
	const [page, setPage] = (0, import_react.useState)(1);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [selectRunModalOpen, setSelectRunModalOpen] = (0, import_react.useState)(false);
	const [loadingRuns, setLoadingRuns] = (0, import_react.useState)(false);
	const [availableRuns, setAvailableRuns] = (0, import_react.useState)([]);
	const [selectedRunId, setSelectedRunId] = (0, import_react.useState)("");
	const [customRunId, setCustomRunId] = (0, import_react.useState)("");
	const fetchAvailableRuns = async () => {
		setLoadingRuns(true);
		try {
			let runs = [];
			const dash = await payrollApi.getDashboard().catch(() => null);
			if (dash?.recentRuns && dash.recentRuns.length > 0) runs = dash.recentRuns.map((r) => ({
				id: r.id,
				name: r.periodName || `Run #${r.id}`,
				status: r.status,
				employeeCount: r.employeeCount
			}));
			if (runs.length === 0) {
				const periods = await payrollApi.getPeriodsList({ limit: 10 }).catch(() => null);
				if (periods?.items && periods.items.length > 0) runs = periods.items.map((p) => ({
					id: p.id,
					name: p.name,
					status: p.status || "draft",
					employeeCount: p.employeeCount
				}));
			}
			setAvailableRuns(runs);
			if (runs.length > 0) setSelectedRunId(runs[0].id);
		} catch {
			setAvailableRuns([]);
		} finally {
			setLoadingRuns(false);
		}
	};
	const handleOpenNewBatchModal = () => {
		setSelectRunModalOpen(true);
		fetchAvailableRuns();
	};
	const handleProceedToRunPayment = (runIdToUse) => {
		const targetRunId = (runIdToUse || customRunId.trim() || selectedRunId).trim();
		if (!targetRunId) {
			toast.error("Please select a payroll run or enter a Run ID");
			return;
		}
		setSelectRunModalOpen(false);
		navigate({ to: `/dashboard/payroll/runs/${targetRunId}/payment` });
	};
	const loadBatches = async () => {
		setLoading(true);
		try {
			const data = await paymentApi.getPaymentBatches({
				page,
				limit: 20,
				status: statusFilter !== "all" ? statusFilter : void 0,
				search: searchQuery.trim() || void 0
			});
			setBatches(data?.items || []);
			setTotalCount(data?.total || 0);
		} catch (err) {
			if (err?.response?.status === 404 || err?.response?.status === 501) {
				setBatches([]);
				setTotalCount(0);
			} else toast.error("Failed to load payment batches");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadBatches();
	}, [page, statusFilter]);
	const getStatusBadge = (status) => {
		if (!status) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: "outline",
			children: "Unknown"
		});
		switch (status) {
			case "approved": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
				children: "Approved"
			});
			case "submitted": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				className: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
				children: "Submitted to Bank"
			});
			case "reconciled":
			case "closed": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				className: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
				children: "Reconciled"
			});
			case "validation_failed":
			case "rejected": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "destructive",
				children: "Validation Failed"
			});
			case "validated": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				className: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
				children: "Validated"
			});
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "outline",
				children: status.replace(/_/g, " ")
			});
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: loadBatches,
					disabled: loading,
					className: "h-8 gap-1.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: loading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Refresh" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: handleOpenNewBatchModal,
					className: "h-8 gap-1.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "New Batch from Run" })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 sm:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Batches",
						value: formatCount(totalCount),
						hint: "All time disbursements",
						icon: Layers,
						accent: "brand"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Pending Approval",
						value: formatCount(batches.filter((b) => b.status === "validated" || b.status === "pending_approval").length),
						hint: "Awaiting checker",
						icon: Clock,
						accent: "warning"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Submitted to Bank",
						value: formatCount(batches.filter((b) => b.status === "submitted").length),
						hint: "In banking processing",
						icon: Banknote,
						accent: "brand"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Reconciled",
						value: formatCount(batches.filter((b) => b.status === "reconciled" || b.status === "closed").length),
						hint: "100% matched",
						icon: CircleCheck,
						accent: "success"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full sm:w-80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "batch-search-input",
						type: "search",
						placeholder: "Search batch number or period...",
						value: searchQuery,
						onChange: (e) => setSearchQuery(e.target.value),
						onKeyDown: (e) => {
							if (e.key === "Enter") loadBatches();
						},
						className: "pl-8 h-9 rounded-xl text-xs"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto scrollbar-none",
					children: [
						"all",
						"draft",
						"validated",
						"approved",
						"submitted",
						"reconciled"
					].map((st) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: statusFilter === st ? "default" : "outline",
						onClick: () => {
							setStatusFilter(st);
							setPage(1);
						},
						className: "rounded-xl text-xs h-8 capitalize",
						children: st
					}, st))
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
									children: "Batch Number"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3.5",
									children: "Payroll Period"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3.5",
									children: "Payment Mode"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3.5",
									children: "Employees"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3.5",
									children: "Payable Amount"
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
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-6 w-6 animate-spin mx-auto mb-2 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Loading payment batches..." })]
							}) }) : batches.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								colSpan: 8,
								className: "px-4 py-12 text-center text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-8 w-8 mx-auto mb-2 text-muted-foreground/60" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-foreground text-sm",
										children: "No Payment Batches Found"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-0.5",
										children: "Create a payment batch from any finalized payroll run to get started."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-4",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											onClick: handleOpenNewBatchModal,
											className: "h-8 gap-1.5 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "New Batch from Run" })]
										})
									})
								]
							}) }) : batches.map((batch) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-muted/40 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-mono font-semibold text-foreground",
										children: batch.batchNumber
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-foreground",
										children: batch.periodName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-medium text-primary",
										children: batch.paymentMode
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-mono",
										children: formatCount(batch.employeeCount)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-mono font-semibold text-emerald-600 dark:text-emerald-400",
										children: batch.payableAmountFormatted
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: getStatusBadge(batch.status)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-muted-foreground",
										children: formatDate(batch.createdAt)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "ghost",
											onClick: () => navigate({ to: `/dashboard/payroll/payments/${batch.id}` }),
											className: "h-7 text-xs gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Manage" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })]
										})
									})
								]
							}, batch.id))
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: selectRunModalOpen,
				onOpenChange: setSelectRunModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md rounded-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "text-base font-semibold text-foreground flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Create Payment Batch from Run" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs text-muted-foreground",
							children: "Select a finalized payroll run or enter a Run ID to initiate payment disbursements."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-2",
							children: [loadingRuns ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-center py-6 text-muted-foreground gap-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Loading available payroll runs..." })]
							}) : availableRuns.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-medium text-foreground",
									children: "Available Payroll Runs"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "max-h-48 overflow-y-auto space-y-1.5 pr-1",
									children: availableRuns.map((r) => {
										const isSelected = selectedRunId === r.id;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											onClick: () => {
												setSelectedRunId(r.id);
												setCustomRunId("");
											},
											className: `flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${isSelected ? "border-primary bg-primary/10 shadow-xs" : "border-border/70 hover:border-border hover:bg-muted/40"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-semibold text-foreground truncate",
													children: r.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[11px] text-muted-foreground font-mono",
													children: ["Run ID: ", r.id]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2 shrink-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "text-[10px] capitalize",
													children: r.status || "Ready"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: isSelected ? "default" : "ghost",
													className: "h-7 text-xs px-2.5",
													onClick: (e) => {
														e.stopPropagation();
														handleProceedToRunPayment(r.id);
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Select" })
												})]
											})]
										}, r.id);
									})
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-dashed border-border/70 p-4 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-6 w-6 text-muted-foreground/60 mx-auto mb-1.5" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-medium text-foreground",
										children: "No recent payroll runs detected"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground mt-0.5",
										children: "Enter a Payroll Run ID below to configure its payment disbursement."
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 pt-1 border-t border-border/60",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Or enter Payroll Run ID directly:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									placeholder: "e.g. run-2026-09 or 1",
									value: customRunId,
									onChange: (e) => {
										setCustomRunId(e.target.value);
										if (e.target.value) setSelectedRunId("");
									},
									onKeyDown: (e) => {
										if (e.key === "Enter") handleProceedToRunPayment();
									},
									className: "h-8 text-xs font-mono"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "flex items-center justify-between sm:justify-between gap-2 border-t border-border/60 pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => setSelectRunModalOpen(false),
								className: "h-8 text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: () => handleProceedToRunPayment(),
								disabled: !selectedRunId && !customRunId.trim(),
								className: "h-8 text-xs gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Continue to Payment Batch" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3.5 w-3.5" })]
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { PaymentBatchListPage as default };
