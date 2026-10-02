import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, Gt as Lock, Sr as CircleCheck, Tr as CircleAlert, er as Download, g as UserX, ht as Plus, lt as RefreshCw, pr as Clock } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { c as useAurix } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as apiInstance } from "./apiInstance-C5A0vaLH.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { l as StatCard, r as GlassCard } from "./Shared-C_skH1kb.mjs";
import { n as AlertDescription, r as AlertTitle, t as Alert } from "./alert-B82KXmg0.mjs";
import { i as formatINR, n as formatDate, t as formatCount } from "./format-8CvzIoFt.mjs";
import { t as generateIdempotencyKey } from "./idempotency-CmVHNuot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/FullAndFinalPage-DPtmKl-P.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Full & Final Settlement (F&F) API Service.
* Backend owns all severance calculations, encashment, recoveries, and settlement finalization.
*/
var fnfApi = {
	async getFnfRecords(params) {
		return (await apiInstance.get("/api/v2/payroll/full-and-final", {
			params,
			headers: { "Cache-Control": "no-store" }
		})).data.data;
	},
	async getFnfDetail(fnfId) {
		return (await apiInstance.get(`/api/v2/payroll/full-and-final/${fnfId}`, { headers: { "Cache-Control": "no-store" } })).data.data;
	},
	async initiateFnf(payload) {
		return (await apiInstance.post("/api/v2/payroll/full-and-final", payload, { headers: {
			"Idempotency-Key": generateIdempotencyKey(),
			"Cache-Control": "no-store"
		} })).data.data;
	},
	async approveFnf(fnfId, remarks) {
		return (await apiInstance.post(`/api/v2/payroll/full-and-final/${fnfId}/approve`, { remarks }, { headers: {
			"Idempotency-Key": generateIdempotencyKey(),
			"Cache-Control": "no-store"
		} })).data.data;
	},
	async rejectFnf(fnfId, reason) {
		return (await apiInstance.post(`/api/v2/payroll/full-and-final/${fnfId}/reject`, { reason }, { headers: {
			"Idempotency-Key": generateIdempotencyKey(),
			"Cache-Control": "no-store"
		} })).data.data;
	},
	async finalizeFnf(fnfId, notes) {
		return (await apiInstance.post(`/api/v2/payroll/full-and-final/${fnfId}/finalize`, { notes }, { headers: {
			"Idempotency-Key": generateIdempotencyKey(),
			"Cache-Control": "no-store"
		} })).data.data;
	},
	async downloadFnfStatement(fnfId) {
		return (await apiInstance.get(`/api/v2/payroll/full-and-final/${fnfId}/statement/download`, {
			responseType: "blob",
			headers: { "Cache-Control": "no-store" }
		})).data;
	}
};
function FullAndFinalPage() {
	const currentUser = useAurix().user;
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [backendUnavailable, setBackendUnavailable] = (0, import_react.useState)(false);
	const [records, setRecords] = (0, import_react.useState)([]);
	const [totalCount, setTotalCount] = (0, import_react.useState)(0);
	const [page, setPage] = (0, import_react.useState)(1);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [initiateModalOpen, setInitiateModalOpen] = (0, import_react.useState)(false);
	const [empId, setEmpId] = (0, import_react.useState)("");
	const [exitType, setExitType] = (0, import_react.useState)("resignation");
	const [lastWorkingDate, setLastWorkingDate] = (0, import_react.useState)("");
	const [noticeRequired, setNoticeRequired] = (0, import_react.useState)("60");
	const [noticeServed, setNoticeServed] = (0, import_react.useState)("60");
	const [exitReason, setExitReason] = (0, import_react.useState)("");
	const [initiating, setInitiating] = (0, import_react.useState)(false);
	const [selectedRecord, setSelectedRecord] = (0, import_react.useState)(null);
	const [detailModalOpen, setDetailModalOpen] = (0, import_react.useState)(false);
	const [approvalRemarks, setApprovalRemarks] = (0, import_react.useState)("");
	const [finalizing, setFinalizing] = (0, import_react.useState)(false);
	const loadRecords = async () => {
		setLoading(true);
		setBackendUnavailable(false);
		try {
			const res = await fnfApi.getFnfRecords({
				page,
				limit: 20,
				search: searchQuery.trim() || void 0
			});
			setRecords(res?.items || []);
			setTotalCount(res?.total || 0);
		} catch (err) {
			if (err?.response?.status === 404 || err?.response?.status === 501) setBackendUnavailable(true);
			else toast.error("Failed to load F&F settlement records");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadRecords();
	}, [page]);
	const handleInitiate = async () => {
		if (!empId.trim() || !lastWorkingDate || !exitReason.trim()) {
			toast.error("Please fill in all mandatory exit fields.");
			return;
		}
		setInitiating(true);
		try {
			const reqDays = parseInt(noticeRequired, 10) || 0;
			const srvDays = parseInt(noticeServed, 10) || 0;
			await fnfApi.initiateFnf({
				employeeId: empId.trim(),
				exitDetails: {
					exitType,
					lastWorkingDate,
					reason: exitReason.trim(),
					noticePeriodDaysRequired: reqDays,
					noticePeriodDaysServed: srvDays,
					shortfallDays: Math.max(0, reqDays - srvDays)
				}
			});
			toast.success("F&F case initiated. Calculation queued on server.");
			setInitiateModalOpen(false);
			setEmpId("");
			setLastWorkingDate("");
			setExitReason("");
			loadRecords();
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to initiate F&F");
		} finally {
			setInitiating(false);
		}
	};
	const handleApprove = async () => {
		if (!selectedRecord) return;
		if (currentUser?.id && selectedRecord.maker.id === currentUser.id) {
			toast.error("Maker-checker violation: You cannot approve an F&F case you initiated.");
			return;
		}
		try {
			await fnfApi.approveFnf(selectedRecord.id, approvalRemarks.trim() || "Approved by Finance/HR.");
			toast.success("F&F settlement approved.");
			setDetailModalOpen(false);
			loadRecords();
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to approve F&F");
		}
	};
	const handleFinalize = async () => {
		if (!selectedRecord) return;
		setFinalizing(true);
		try {
			await fnfApi.finalizeFnf(selectedRecord.id, "Authoritative lock and settlement finalization.");
			toast.success("F&F settlement finalized & locked for disbursement.");
			setDetailModalOpen(false);
			loadRecords();
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to finalize F&F");
		} finally {
			setFinalizing(false);
		}
	};
	const handleDownloadStatement = async (fnfId) => {
		try {
			const blob = await fnfApi.downloadFnfStatement(fnfId);
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `FNF_STATEMENT_${fnfId}.pdf`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
			toast.success("F&F statement downloaded.");
		} catch {
			toast.error("Failed to download settlement statement");
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
						children: "Full & Final (F&F) Settlement"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "text-xs font-semibold border-primary/30 bg-primary/10 text-primary",
						children: "Exit Management"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Authoritative severance calculations: unpaid salary, leave encashment, gratuity, notice adjustments, and recovery."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: loadRecords,
						disabled: loading,
						className: "h-8 gap-1.5 text-xs rounded-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: loading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Refresh" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => setInitiateModalOpen(true),
						className: "h-8 gap-1.5 text-xs rounded-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Initiate F&F" })]
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
							"The Full & Final Settlement API endpoint (",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "/api/v2/payroll/full-and-final" }),
							") is awaiting backend deployment. Severance preview tables and maker-checker sign-off structures are ready."
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
						label: "Total Exit Cases",
						value: formatCount(totalCount),
						hint: "All time F&F files",
						icon: UserX,
						accent: "brand"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Pending Sign-off",
						value: formatCount(records.filter((r) => r.status === "pending_approval" || r.status === "calculated").length),
						hint: "Awaiting checker",
						icon: Clock,
						accent: "warning"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Finalized Cases",
						value: formatCount(records.filter((r) => r.status === "finalized").length),
						hint: "Locked for release",
						icon: Lock,
						accent: "muted"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Settled",
						value: formatCount(records.filter((r) => r.status === "settled").length),
						hint: "Bank disbursed",
						icon: CircleCheck,
						accent: "success"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-between gap-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full sm:w-80",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "fnf-search-input",
						type: "search",
						placeholder: "Search employee name or code...",
						value: searchQuery,
						onChange: (e) => setSearchQuery(e.target.value),
						onKeyDown: (e) => {
							if (e.key === "Enter") loadRecords();
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
									children: "Exit Type"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3.5",
									children: "Last Working Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3.5 font-mono text-right",
									children: "Net Settlement"
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
								colSpan: 7,
								className: "px-4 py-12 text-center text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-6 w-6 animate-spin mx-auto mb-2 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Loading settlement cases..." })]
							}) }) : records.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								colSpan: 7,
								className: "px-4 py-12 text-center text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserX, { className: "h-8 w-8 mx-auto mb-2 text-muted-foreground/60" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-foreground text-sm",
										children: "No F&F Cases Found"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-0.5",
										children: backendUnavailable ? "F&F endpoint pending backend deployment." : "Click 'Initiate F&F' to begin exit settlement processing for a separating employee."
									})
								]
							}) }) : records.map((fnf) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-muted/40 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold text-foreground",
											children: fnf.employeeName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[11px] text-muted-foreground font-mono",
											children: fnf.employeeCode
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-foreground",
										children: fnf.department
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 capitalize",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[10px]",
											children: fnf.exitDetails.exitType.replace(/_/g, " ")
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-muted-foreground",
										children: formatDate(fnf.exitDetails.lastWorkingDate)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-mono font-semibold text-right text-emerald-600 dark:text-emerald-400",
										children: fnf.netSettlementFormatted
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: fnf.status === "finalized" || fnf.status === "settled" ? "default" : fnf.status === "rejected" ? "destructive" : "secondary",
											className: "capitalize text-[10px]",
											children: fnf.status.replace(/_/g, " ")
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-end gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "outline",
												onClick: () => {
													setSelectedRecord(fnf);
													setDetailModalOpen(true);
												},
												className: "h-7 text-xs rounded-lg",
												children: "Review Case"
											}), (fnf.status === "finalized" || fnf.status === "settled") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "ghost",
												onClick: () => handleDownloadStatement(fnf.id),
												className: "h-7 text-xs gap-1",
												title: "Download settlement statement",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PDF" })]
											})]
										})
									})
								]
							}, fnf.id))
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: initiateModalOpen,
				onOpenChange: setInitiateModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md rounded-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-base font-semibold",
							children: "Initiate Full & Final Settlement"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs text-muted-foreground",
							children: "Provide separating employee details to trigger server-side severance calculation."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold text-foreground",
									children: "Employee ID / Code *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "fnf-emp-id",
									placeholder: "e.g. EMP-101",
									value: empId,
									onChange: (e) => setEmpId(e.target.value),
									className: "mt-1 h-8 rounded-lg text-xs"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold text-foreground",
									children: "Separation Type"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: exitType,
									onChange: (e) => setExitType(e.target.value),
									className: "mt-1 w-full rounded-lg border border-input bg-background/80 px-2 py-1.5 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "resignation",
											children: "Resignation"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "termination",
											children: "Termination"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "retirement",
											children: "Retirement"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "layoff",
											children: "Layoff"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "contract_end",
											children: "Contract Completion"
										})
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold text-foreground",
									children: "Last Working Day *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "fnf-lwd-input",
									type: "date",
									value: lastWorkingDate,
									onChange: (e) => setLastWorkingDate(e.target.value),
									className: "mt-1 h-8 rounded-lg text-xs"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-foreground",
										children: "Notice Required (Days)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "fnf-notice-req",
										type: "number",
										value: noticeRequired,
										onChange: (e) => setNoticeRequired(e.target.value),
										className: "mt-1 h-8 rounded-lg text-xs"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-foreground",
										children: "Notice Served (Days)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "fnf-notice-srv",
										type: "number",
										value: noticeServed,
										onChange: (e) => setNoticeServed(e.target.value),
										className: "mt-1 h-8 rounded-lg text-xs"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold text-foreground",
									children: "Separation Reason *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "fnf-reason-input",
									placeholder: "e.g. Voluntary resignation for career opportunity",
									value: exitReason,
									onChange: (e) => setExitReason(e.target.value),
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
								onClick: () => setInitiateModalOpen(false),
								className: "rounded-xl text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								disabled: initiating,
								onClick: handleInitiate,
								className: "rounded-xl text-xs",
								children: initiating ? "Calculating..." : "Initiate F&F"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: detailModalOpen,
				onOpenChange: setDetailModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "text-base font-semibold",
							children: [
								"Settlement Breakdown: ",
								selectedRecord?.employeeName,
								" (",
								selectedRecord?.employeeCode,
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs text-muted-foreground",
							children: "Review authoritative severance components computed by the backend payroll engine."
						})] }),
						selectedRecord && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border/70 p-4 space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between font-semibold text-foreground border-b border-border/50 pb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Severance Earnings" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-emerald-600 dark:text-emerald-400",
											children: selectedRecord.earnings.totalEarningsFormatted
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-2 text-muted-foreground text-[11px]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Unpaid Days Salary: ", formatINR(selectedRecord.earnings.unpaidSalaryPaise / 100)] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Leave Encashment: ", formatINR(selectedRecord.earnings.leaveEncashmentPaise / 100)] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Gratuity: ", formatINR(selectedRecord.earnings.gratuityPaise / 100)] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Statutory Bonus: ", formatINR(selectedRecord.earnings.statutoryBonusPaise / 100)] })
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border/70 p-4 space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between font-semibold text-foreground border-b border-border/50 pb-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Severance Deductions & Recoveries" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-rose-600 dark:text-rose-400",
											children: selectedRecord.deductions.totalDeductionsFormatted
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-2 text-muted-foreground text-[11px]",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Notice Shortfall: ", formatINR(selectedRecord.deductions.noticeShortfallRecoveryPaise / 100)] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Loan / Advance Recovery: ", formatINR(selectedRecord.deductions.loanAdvanceRecoveryPaise / 100)] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Asset Recovery: ", formatINR(selectedRecord.deductions.assetDamageRecoveryPaise / 100)] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Tax / Statutory Deductions: ", formatINR(selectedRecord.deductions.tdsDeductionPaise / 100)] })
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-primary/40 bg-primary/10 p-4 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold text-foreground uppercase tracking-wider",
										children: "Net Settlement Payable"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground mt-0.5",
										children: "Final amount to be disbursed upon settlement execution"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-xl font-bold text-primary",
										children: selectedRecord.netSettlementFormatted
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[10px] text-muted-foreground italic border-t border-border/40 pt-2",
									children: [
										"Initiated by: ",
										selectedRecord.maker.name,
										" on ",
										formatDate(selectedRecord.createdAt),
										selectedRecord.checker && ` • Approved by: ${selectedRecord.checker.name}`
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => setDetailModalOpen(false),
									className: "rounded-xl text-xs",
									children: "Close"
								}),
								selectedRecord?.status === "calculated" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									onClick: handleApprove,
									className: "rounded-xl text-xs",
									children: "Approve Settlement"
								}),
								selectedRecord?.status === "approved" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									disabled: finalizing,
									onClick: handleFinalize,
									className: "rounded-xl text-xs",
									children: finalizing ? "Finalizing..." : "Finalize & Seal F&F"
								})
							]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { FullAndFinalPage as default };
