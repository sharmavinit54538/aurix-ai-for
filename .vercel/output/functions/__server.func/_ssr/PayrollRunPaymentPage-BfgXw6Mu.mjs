import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { x as useParams, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Gt as Lock, J as ShieldAlert, Tr as CircleAlert, Xn as ExternalLink, an as Layers, di as ArrowLeft, g as UserX, lt as RefreshCw, p as Users, q as ShieldCheck, qr as Building2, ri as Banknote } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { c as useAurix } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { l as StatCard, r as GlassCard } from "./Shared-C_skH1kb.mjs";
import { n as AlertDescription, r as AlertTitle, t as Alert } from "./alert-B82KXmg0.mjs";
import { i as formatINR, t as formatCount } from "./format-8CvzIoFt.mjs";
import { t as generateIdempotencyKey } from "./idempotency-CmVHNuot.mjs";
import { t as payrollApi } from "./payrollApi-Q5rJ9by9.mjs";
import { t as PayrollStepper } from "./PayrollStepper-BAu7sJ8N.mjs";
import { t as paymentApi } from "./paymentApi-ymZ2k77q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PayrollRunPaymentPage-BfgXw6Mu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PayrollRunPaymentPage() {
	const runId = useParams({ strict: false })?.runId?.trim() || "";
	const navigate = useNavigate();
	useAurix().user;
	const [loadingRun, setLoadingRun] = (0, import_react.useState)(true);
	const [backendUnavailable, setBackendUnavailable] = (0, import_react.useState)(false);
	const [runData, setRunData] = (0, import_react.useState)(null);
	const [existingBatches, setExistingBatches] = (0, import_react.useState)([]);
	const [sourceAccounts, setSourceAccounts] = (0, import_react.useState)([]);
	const [selectedAccountId, setSelectedAccountId] = (0, import_react.useState)("");
	const [paymentMode, setPaymentMode] = (0, import_react.useState)("NEFT");
	const [batchNotes, setBatchNotes] = (0, import_react.useState)("");
	const [heldEmployees, setHeldEmployees] = (0, import_react.useState)([]);
	const [holdModalOpen, setHoldModalOpen] = (0, import_react.useState)(false);
	const [holdEmpId, setHoldEmpId] = (0, import_react.useState)("");
	const [holdEmpName, setHoldEmpName] = (0, import_react.useState)("");
	const [holdReason, setHoldReason] = (0, import_react.useState)("");
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const inFlightRef = (0, import_react.useRef)(false);
	const loadData = async () => {
		if (!runId) return;
		setLoadingRun(true);
		setBackendUnavailable(false);
		try {
			setRunData(await payrollApi.getPayrollFinalization(runId));
			try {
				setExistingBatches(await paymentApi.getPaymentBatchesForRun(runId));
			} catch (err) {
				if (err?.response?.status === 404 || err?.response?.status === 501) setBackendUnavailable(true);
			}
			try {
				const accounts = await paymentApi.getCompanyBankAccounts("default");
				setSourceAccounts(accounts);
				if (accounts.length > 0) setSelectedAccountId(accounts[0].id);
			} catch {}
		} catch (err) {
			if (err?.response?.status === 404) setBackendUnavailable(true);
			else toast.error("Failed to load payroll run information");
		} finally {
			setLoadingRun(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadData();
	}, [runId]);
	const isFinalized = Boolean(runData?.isFinalized || runData?.isLocked || runData?.status?.toLowerCase().includes("final") || runData?.status?.toLowerCase().includes("lock"));
	const handleCreateBatch = async () => {
		if (inFlightRef.current || isSubmitting) return;
		if (!selectedAccountId && sourceAccounts.length > 0) {
			toast.error("Please select a source bank account");
			return;
		}
		inFlightRef.current = true;
		setIsSubmitting(true);
		const idempotencyKey = generateIdempotencyKey();
		try {
			const createdBatch = await paymentApi.createPaymentBatch(runId, {
				sourceAccountId: selectedAccountId || "default-account-id",
				paymentMode,
				heldEmployeeIds: heldEmployees.map((h) => ({
					employeeId: h.employeeId,
					reason: h.reason
				})),
				notes: batchNotes.trim() || void 0
			}, idempotencyKey);
			toast.success(`Payment batch ${createdBatch.batchNumber} created successfully!`);
			navigate({ to: `/dashboard/payroll/payments/${createdBatch.id}` });
		} catch (err) {
			const status = err?.response?.status;
			if (status === 404 || status === 501) {
				setBackendUnavailable(true);
				toast.error("Feature unavailable — backend pending");
			} else if (status === 409) toast.error(err?.response?.data?.message || "Payment batch conflict detected");
			else toast.error(err?.response?.data?.message || "Failed to create payment batch");
		} finally {
			inFlightRef.current = false;
			setIsSubmitting(false);
		}
	};
	const handleAddHold = () => {
		if (!holdEmpId || !holdReason.trim() || holdReason.trim().length < 5) {
			toast.error("Hold reason must be at least 5 characters");
			return;
		}
		setHeldEmployees((prev) => [...prev.filter((p) => p.employeeId !== holdEmpId), {
			employeeId: holdEmpId,
			employeeName: holdEmpName || `Employee ${holdEmpId}`,
			reason: holdReason.trim()
		}]);
		setHoldModalOpen(false);
		setHoldEmpId("");
		setHoldEmpName("");
		setHoldReason("");
	};
	const handleRemoveHold = (empId) => {
		setHeldEmployees((prev) => prev.filter((p) => p.employeeId !== empId));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => navigate({ to: `/dashboard/payroll/runs/${runId}/finalize` }),
							className: "h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Back to Finalization" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground/40",
							children: "•"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground font-mono",
							children: ["Run: ", runId]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: loadData,
						disabled: loadingRun,
						className: "h-8 gap-1.5 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: loadingRun ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Refresh" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => navigate({ to: "/dashboard/payroll/payments" }),
						className: "h-8 gap-1.5 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "All Payment Batches" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayrollStepper, {
				currentStep: "payment",
				runId,
				runStatus: runData?.status || "Finalized"
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
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The Payment & Disbursement API service (Step 9) is currently awaiting backend deployment. All frontend interfaces, Zod contracts, and maker-checker structures are fully implemented." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
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
			!loadingRun && !isFinalized && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Alert, {
				className: "border-rose-500/40 bg-rose-500/10 text-rose-900 dark:text-rose-200",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-4 w-4" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertTitle, {
						className: "font-semibold text-sm",
						children: "Disbursement Blocked — Run Not Finalized"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDescription, {
						className: "text-xs mt-1",
						children: "Payment batches can only be initiated against a finalized and locked payroll run. Please complete Step 7 (Finalization) before proceeding to disbursement."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/70 pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-bold tracking-tight text-foreground",
						children: "Step 9: Payment & Disbursement"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "text-xs font-semibold border-primary/30 bg-primary/10 text-primary",
						children: "Salary Release"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Initiate corporate bank payment batch, review hold list, and generate authoritative bank disbursement files."
				})] }), existingBatches.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "text-xs border-emerald-500/40 text-emerald-600",
						children: [
							existingBatches.length,
							" Batch",
							existingBatches.length > 1 ? "es" : "",
							" Created"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => navigate({ to: `/dashboard/payroll/payments/${existingBatches[0].id}` }),
						className: "h-8 gap-1.5 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Latest Batch" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 sm:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Employees",
						value: formatCount(runData?.summary?.employeeCount ?? 0),
						hint: "Eligible for payment",
						icon: Users,
						accent: "brand"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Net Payroll",
						value: formatINR(runData?.summary?.netPayroll || 0),
						hint: "Calculated in Finalization",
						icon: Banknote,
						accent: "success"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Held Employees",
						value: formatCount(heldEmployees.length),
						hint: heldEmployees.length > 0 ? "Excluded from batch" : "No holds active",
						icon: UserX,
						accent: heldEmployees.length > 0 ? "warning" : "muted"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Run Status",
						value: runData?.status || "Finalized",
						hint: isFinalized ? "Locked & Ready" : "Unfinalized",
						icon: Lock,
						accent: isFinalized ? "success" : "danger"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-2 space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-6 space-y-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2.5 border-b border-border pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-base font-semibold text-foreground",
								children: "Source Bank Account & Disbursement Method"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Select the corporate account from which salary disbursements will be debited."
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-semibold text-foreground",
										children: "Company Disbursement Account"
									}),
									sourceAccounts.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										id: "payment-source-account",
										value: selectedAccountId,
										onChange: (e) => setSelectedAccountId(e.target.value),
										className: "mt-1.5 w-full rounded-xl border border-input bg-background/90 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs",
										children: sourceAccounts.map((acc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: acc.id,
											children: [
												acc.bankName,
												" — ",
												acc.accountHolderName,
												" (",
												acc.accountNumberMasked,
												") • IFSC: ",
												acc.ifscCode
											]
										}, acc.id))
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1.5 rounded-xl border border-border/60 bg-muted/20 p-3 text-xs text-muted-foreground flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Primary Corporate Account (HDFC Bank • ••••••••4431)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[10px]",
											children: "Default"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-[11px] text-muted-foreground",
										children: "Full account numbers are masked for financial security compliance."
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold text-foreground",
									children: "Disbursement Mode"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1.5 grid grid-cols-2 sm:grid-cols-4 gap-2",
									children: [
										"NEFT",
										"RTGS",
										"IMPS",
										"UPI"
									].map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										onClick: () => setPaymentMode(mode),
										className: `flex flex-col items-center justify-center rounded-xl border p-3 text-center transition-all ${paymentMode === mode ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/40 shadow-xs" : "border-border/60 bg-background/60 text-muted-foreground hover:bg-muted/40"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-medium",
											children: mode
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] opacity-75 mt-0.5",
											children: mode === "NEFT" ? "Batch settlement" : mode === "RTGS" ? "Real-time gross" : mode === "IMPS" ? "Immediate" : "VPA handle"
										})]
									}, mode))
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold text-foreground",
									children: "Batch Notes / Reference Description (Optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "payment-batch-notes",
									value: batchNotes,
									onChange: (e) => setBatchNotes(e.target.value),
									placeholder: "e.g. Salary disbursement for September 2026 Batch 1",
									rows: 2,
									className: "mt-1.5 text-xs rounded-xl",
									maxLength: 500
								})] })
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-6 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserX, { className: "h-5 w-5 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-base font-semibold text-foreground",
									children: "Disbursement Holds"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Temporarily withhold disbursement for employees pending KYC, notice period, or tax review."
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => setHoldModalOpen(true),
								className: "h-8 gap-1.5 text-xs rounded-xl",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserX, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Add Employee Hold" })]
							})]
						}), heldEmployees.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-dashed border-border/80 p-6 text-center text-xs text-muted-foreground",
							children: "No employees currently on hold. All eligible employees in this run will be included in the disbursement batch."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2",
							children: heldEmployees.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold text-foreground",
										children: h.employeeName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[11px] text-muted-foreground font-mono",
										children: ["ID: ", h.employeeId]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-1 text-xs text-amber-800 dark:text-amber-200",
										children: ["Reason: ", h.reason]
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => handleRemoveHold(h.employeeId),
									className: "h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-500/10",
									children: "Remove Hold"
								})]
							}, h.employeeId))
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
						className: "p-6 space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-base font-semibold text-foreground border-b border-border pb-3",
								children: "Batch Creation Summary"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between py-1 border-b border-border/50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Payroll Period"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: runData?.periodName || "—"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between py-1 border-b border-border/50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Payment Mode"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-primary",
											children: paymentMode
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between py-1 border-b border-border/50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Total In Run"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-semibold",
											children: formatCount(runData?.summary?.employeeCount ?? 0)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between py-1 border-b border-border/50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Employees Held"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-semibold text-amber-600",
											children: heldEmployees.length
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between py-1 border-b border-border/50",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Batch Employees"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono font-semibold text-foreground",
											children: formatCount(Math.max(0, (runData?.summary?.employeeCount ?? 0) - heldEmployees.length))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between py-1 text-sm font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Net Payable (Run)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-emerald-600 font-mono",
											children: formatINR(runData?.summary?.netPayroll || 0)
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									id: "create-payment-batch-btn",
									variant: "default",
									disabled: !isFinalized || isSubmitting || loadingRun,
									onClick: handleCreateBatch,
									className: "w-full h-10 gap-2 text-xs font-semibold rounded-xl shadow-md",
									style: { background: isFinalized ? "var(--gradient-brand)" : void 0 },
									children: isSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-4 w-4 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Creating Batch (Idempotent)..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Create Payment Batch" })] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-[10px] text-center text-muted-foreground",
									children: [
										"Uses unique ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "Idempotency-Key" }),
										" to guarantee duplicate-submission protection."
									]
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border/60 bg-muted/20 p-4 text-xs space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 font-semibold text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Compliance & Money Safety" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted-foreground text-[11px] leading-relaxed",
							children: "Amounts are generated strictly by backend authorization. Frontend calculations are never authoritative. Full bank account numbers are never exposed in URL parameters or browser local storage."
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: holdModalOpen,
				onOpenChange: setHoldModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md rounded-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-base font-semibold",
							children: "Place Employee Payment on Hold"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs text-muted-foreground",
							children: "Enter the employee details and mandatory business reason for withholding disbursement."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold text-foreground",
									children: "Employee ID / Code *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "hold-employee-id",
									placeholder: "e.g. EMP-101",
									value: holdEmpId,
									onChange: (e) => setHoldEmpId(e.target.value),
									className: "mt-1 h-8 rounded-lg text-xs"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold text-foreground",
									children: "Employee Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "hold-employee-name",
									placeholder: "e.g. Rajesh Kumar",
									value: holdEmpName,
									onChange: (e) => setHoldEmpName(e.target.value),
									className: "mt-1 h-8 rounded-lg text-xs"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-semibold text-foreground",
										children: "Mandatory Reason for Hold *"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										id: "hold-reason-input",
										placeholder: "e.g. Pending bank account name mismatch verification with HR",
										value: holdReason,
										onChange: (e) => setHoldReason(e.target.value),
										rows: 3,
										className: "mt-1 rounded-lg text-xs"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground",
										children: "Minimum 5 characters required."
									})
								] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setHoldModalOpen(false),
								className: "rounded-xl text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: handleAddHold,
								className: "rounded-xl text-xs",
								children: "Apply Hold"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { PayrollRunPaymentPage as default };
