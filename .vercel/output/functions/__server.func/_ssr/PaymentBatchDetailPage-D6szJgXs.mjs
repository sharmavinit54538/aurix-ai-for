import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { x as useParams, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, Gn as FileCheck, J as ShieldAlert, Jn as Eye, Q as Send, Rn as FileSpreadsheet, S as Upload, Sr as CircleCheck, T as TriangleAlert, Tr as CircleAlert, di as ArrowLeft, er as Download, g as UserX, kt as OctagonAlert, lt as RefreshCw, p as Users, q as ShieldCheck, ri as Banknote, vr as CircleX, x as UserCheck } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { c as useAurix } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { l as StatCard, r as GlassCard } from "./Shared-C_skH1kb.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BgKcOzjx.mjs";
import { n as AlertDescription, r as AlertTitle, t as Alert } from "./alert-B82KXmg0.mjs";
import { n as formatDate, r as formatDateTime, t as formatCount } from "./format-8CvzIoFt.mjs";
import { t as generateIdempotencyKey } from "./idempotency-CmVHNuot.mjs";
import { n as formatPaiseToINR, t as evaluateReconciliation } from "./money-BK3gxPWB.mjs";
import { t as PayrollStepper } from "./PayrollStepper-BAu7sJ8N.mjs";
import { t as paymentApi } from "./paymentApi-ymZ2k77q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PaymentBatchDetailPage-D6szJgXs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MakerCheckerBanner({ creatorId, creatorName, createdAt, approverName, approvedAt, approvalRemarks, currentUserId, className }) {
	const isCreator = Boolean(currentUserId && currentUserId === creatorId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-2xl border p-4 backdrop-blur-xl transition-all", isCreator ? "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200" : "border-border/60 bg-muted/30 text-foreground", className),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl", isCreator ? "bg-amber-500/20 text-amber-600 dark:text-amber-400" : "bg-primary/10 text-primary"),
					children: isCreator ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, {
						className: "h-5 w-5",
						"aria-hidden": "true"
					}) : approverName ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
						className: "h-5 w-5 text-emerald-600",
						"aria-hidden": "true"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, {
						className: "h-5 w-5",
						"aria-hidden": "true"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "text-sm font-semibold tracking-tight",
						children: "Governance & Maker-Checker Protocol"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-0.5 text-xs opacity-85",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							"Created by ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: creatorName }),
							" on ",
							formatDate(createdAt)
						] }), approverName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-2",
							children: [
								"• Approved by ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: approverName }),
								" on ",
								formatDate(approvedAt)
							]
						})]
					}),
					approvalRemarks && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs italic opacity-80",
						children: [
							"\"",
							approvalRemarks,
							"\""
						]
					})
				] })]
			}), isCreator && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "inline-flex items-center gap-1.5 rounded-xl bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300 ring-1 ring-amber-500/40",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "The batch creator cannot approve this batch." })]
			})]
		})
	});
}
function BankValidationTable({ issues, isValidating = false, onRevalidate, className }) {
	const [filterSeverity, setFilterSeverity] = (0, import_react.useState)("all");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const filteredIssues = issues.filter((iss) => {
		if (filterSeverity !== "all" && iss.severity !== filterSeverity) return false;
		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase();
			return iss.employeeName.toLowerCase().includes(q) || iss.employeeCode.toLowerCase().includes(q) || iss.code.toLowerCase().includes(q) || iss.message.toLowerCase().includes(q);
		}
		return true;
	});
	const errorCount = issues.filter((i) => i.severity === "error").length;
	const warningCount = issues.filter((i) => i.severity === "warning").length;
	const blockingCount = issues.filter((i) => i.blocking).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-2xl border border-border/70 bg-background/80 backdrop-blur-xl shadow-sm overflow-hidden", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border/70 p-4 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-semibold tracking-tight",
					children: "Bank Details & IFSC Validation"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-xs text-muted-foreground",
					children: "Authoritative RBI master validation and disbursement sanity checks"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [blockingCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-1.5 rounded-xl bg-rose-500/15 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-300 ring-1 ring-rose-500/30",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							blockingCount,
							" Blocking Issue",
							blockingCount > 1 ? "s" : ""
						] })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-300 ring-1 ring-emerald-500/30",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Zero Blocking Errors" })]
					}), onRevalidate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						disabled: isValidating,
						onClick: onRevalidate,
						className: "rounded-xl text-xs",
						children: isValidating ? "Validating..." : "Revalidate"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-center justify-between border-b border-border/60 bg-muted/20 p-3 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 w-full sm:w-auto",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: filterSeverity === "all" ? "default" : "ghost",
							onClick: () => setFilterSeverity("all"),
							className: "rounded-lg text-xs h-8",
							children: [
								"All (",
								issues.length,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: filterSeverity === "error" ? "destructive" : "ghost",
							onClick: () => setFilterSeverity("error"),
							className: "rounded-lg text-xs h-8",
							children: [
								"Errors (",
								errorCount,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: filterSeverity === "warning" ? "secondary" : "ghost",
							onClick: () => setFilterSeverity("warning"),
							className: "rounded-lg text-xs h-8",
							children: [
								"Warnings (",
								warningCount,
								")"
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full sm:w-64",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "bank-validation-search",
						type: "search",
						placeholder: "Search employee or error...",
						value: searchQuery,
						onChange: (e) => setSearchQuery(e.target.value),
						className: "pl-8 h-8 rounded-lg text-xs"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-muted/40 text-muted-foreground border-b border-border/60 uppercase tracking-wider text-[11px] font-semibold",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Severity"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Employee"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Target Field"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Issue Code"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Message"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Action Required"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border/50",
						children: filteredIssues.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							colSpan: 6,
							className: "px-4 py-8 text-center text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center justify-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-8 w-8 text-emerald-500/80 mb-2" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium text-foreground",
										children: "No bank validation issues found"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-0.5",
										children: "All employee account numbers and IFSC codes adhere to banking standards."
									})
								]
							})
						}) }) : filteredIssues.map((iss) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: cn("hover:bg-muted/40 transition-colors", iss.blocking && "bg-rose-500/5 dark:bg-rose-500/10"),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 whitespace-nowrap",
									children: iss.severity === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 rounded-md bg-rose-500/15 px-2 py-0.5 font-medium text-rose-600 dark:text-rose-400",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3 w-3" }),
											"Error ",
											iss.blocking && "• Blocking"
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-0.5 font-medium text-amber-600 dark:text-amber-400",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3 w-3" }), "Warning"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium text-foreground",
										children: iss.employeeName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[11px] text-muted-foreground",
										children: iss.employeeCode
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-mono text-[11px]",
									children: iss.field
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-mono text-[11px] text-muted-foreground",
									children: iss.code
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-foreground/90 max-w-xs",
									children: iss.message
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground text-[11px]",
									children: iss.suggestedAction || "Review employee profile"
								})
							]
						}, iss.id))
					})]
				})
			})
		]
	});
}
function PaymentReconciliationCard({ reconciliation, className }) {
	const { expectedPaise, paidPaise, failedPaise, heldPaise, processingPaise, unmatchedPaise, isReconciled, mismatchPaise, summaryText } = reconciliation;
	const hasMismatch = mismatchPaise !== 0 || !isReconciled;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-2xl border p-5 backdrop-blur-xl shadow-sm transition-all", hasMismatch ? "border-rose-500/40 bg-rose-500/5 dark:bg-rose-500/10" : "border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border/60 pb-4 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl", hasMismatch ? "bg-rose-500/20 text-rose-600 dark:text-rose-400" : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"),
						children: hasMismatch ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctagonAlert, {
							className: "h-5 w-5",
							"aria-hidden": "true"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, {
							className: "h-5 w-5",
							"aria-hidden": "true"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-semibold tracking-tight",
						children: "Disbursement & Mathematical Reconciliation"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-0.5",
						children: "Strict integer paise balance verification: Expected == Paid + Failed + Held + Processing"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: hasMismatch ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-1.5 rounded-xl bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Paise Discrepancy Detected" })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "100% Mathematically Reconciled" })]
					})
				})]
			}),
			hasMismatch && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-800 dark:text-rose-200",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-semibold flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Blocking Reconciliation Warning" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1",
					children: [
						"Expected total does not match sum of disbursement outcomes by",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formatPaiseToINR(Math.abs(mismatchPaise)) }),
						" (",
						Math.abs(mismatchPaise),
						" paise). This payroll run cannot transition to \"Paid\" until all transactions are accounted for on the backend."
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border/60 bg-background/60 p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-medium text-muted-foreground uppercase",
								children: "Expected"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-mono text-sm sm:text-base font-semibold text-foreground",
								children: formatPaiseToINR(expectedPaise)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-muted-foreground font-mono",
								children: [expectedPaise, " paise"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border/60 bg-emerald-500/5 p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-medium text-emerald-600 dark:text-emerald-400 uppercase",
								children: "Paid (UTR Confirmed)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-mono text-sm sm:text-base font-semibold text-emerald-600 dark:text-emerald-400",
								children: formatPaiseToINR(paidPaise)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-muted-foreground font-mono",
								children: [paidPaise, " paise"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border/60 bg-rose-500/5 p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-medium text-rose-600 dark:text-rose-400 uppercase",
								children: "Failed"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-mono text-sm sm:text-base font-semibold text-rose-600 dark:text-rose-400",
								children: formatPaiseToINR(failedPaise)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-muted-foreground font-mono",
								children: [failedPaise, " paise"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border/60 bg-amber-500/5 p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-medium text-amber-600 dark:text-amber-400 uppercase",
								children: "Held"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-mono text-sm sm:text-base font-semibold text-amber-600 dark:text-amber-400",
								children: formatPaiseToINR(heldPaise)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-muted-foreground font-mono",
								children: [heldPaise, " paise"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border/60 bg-sky-500/5 p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-medium text-sky-600 dark:text-sky-400 uppercase",
								children: "Processing"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-mono text-sm sm:text-base font-semibold text-sky-600 dark:text-sky-400",
								children: formatPaiseToINR(processingPaise)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-muted-foreground font-mono",
								children: [processingPaise, " paise"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border/60 bg-purple-500/5 p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] font-medium text-purple-600 dark:text-purple-400 uppercase",
								children: "Unmatched"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-mono text-sm sm:text-base font-semibold text-purple-600 dark:text-purple-400",
								children: formatPaiseToINR(unmatchedPaise)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-muted-foreground font-mono",
								children: [unmatchedPaise, " paise"]
							})
						]
					})
				]
			}),
			summaryText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 text-xs text-muted-foreground",
				children: summaryText
			})
		]
	});
}
function PaymentBatchDetailPage() {
	const batchId = useParams({ strict: false })?.batchId?.trim() || "";
	const navigate = useNavigate();
	const currentUser = useAurix().user;
	const [activeTab, setActiveTab] = (0, import_react.useState)("overview");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [backendUnavailable, setBackendUnavailable] = (0, import_react.useState)(false);
	const [batch, setBatch] = (0, import_react.useState)(null);
	const [items, setItems] = (0, import_react.useState)([]);
	const [validationIssues, setValidationIssues] = (0, import_react.useState)([]);
	const [bankFile, setBankFile] = (0, import_react.useState)(null);
	const [reconciliation, setReconciliation] = (0, import_react.useState)(null);
	const inFlightRef = (0, import_react.useRef)(false);
	const [approveModalOpen, setApproveModalOpen] = (0, import_react.useState)(false);
	const [approvalRemarks, setApprovalRemarks] = (0, import_react.useState)("");
	const [rejectModalOpen, setRejectModalOpen] = (0, import_react.useState)(false);
	const [rejectReason, setRejectReason] = (0, import_react.useState)("");
	const [submitModalOpen, setSubmitModalOpen] = (0, import_react.useState)(false);
	const [bankRefNumber, setBankRefNumber] = (0, import_react.useState)("");
	const [submitNotes, setSubmitNotes] = (0, import_react.useState)("");
	const [selectedFormat, setSelectedFormat] = (0, import_react.useState)("HDFC_CSV");
	const [generatingFile, setGeneratingFile] = (0, import_react.useState)(false);
	const [csvFile, setCsvFile] = (0, import_react.useState)(null);
	const [importPreview, setImportPreview] = (0, import_react.useState)(null);
	const [importingCsv, setImportingCsv] = (0, import_react.useState)(false);
	const [applyingCsv, setApplyingCsv] = (0, import_react.useState)(false);
	const [revealEmpId, setRevealEmpId] = (0, import_react.useState)(null);
	const [revealReason, setRevealReason] = (0, import_react.useState)("");
	const [revealedAccount, setRevealedAccount] = (0, import_react.useState)(null);
	const [revealModalOpen, setRevealModalOpen] = (0, import_react.useState)(false);
	const loadBatchData = async () => {
		if (!batchId) return;
		setLoading(true);
		setBackendUnavailable(false);
		try {
			const res = await paymentApi.getPaymentBatch(batchId);
			setBatch(res.batch);
			setItems(res.items || []);
			try {
				setValidationIssues((await paymentApi.validatePaymentBatch(batchId)).issues || []);
			} catch {}
			if (res.batch) {
				const expected = res.batch.netAmountPaise || 0;
				const held = res.batch.heldAmountPaise || 0;
				const evalRec = evaluateReconciliation(expected, 0, 0, held, 0);
				setReconciliation({
					batchId: res.batch.id,
					runId: res.batch.runId,
					expectedPaise: expected,
					paidPaise: 0,
					failedPaise: 0,
					heldPaise: held,
					processingPaise: 0,
					unmatchedPaise: 0,
					isReconciled: evalRec.isReconciled,
					mismatchPaise: evalRec.mismatchPaise,
					summaryText: "Initial batch state prior to banking response import.",
					reconciledAt: null,
					reconciledBy: null
				});
			}
		} catch (err) {
			if (err?.response?.status === 404 || err?.response?.status === 501) setBackendUnavailable(true);
			else toast.error("Failed to load payment batch details");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadBatchData();
	}, [batchId]);
	const isBatchCreator = Boolean(currentUser?.id && batch?.createdBy?.id && currentUser.id === batch.createdBy.id);
	const hasBlockingValidation = validationIssues.some((v) => v.blocking);
	const handleApproveBatch = async () => {
		if (inFlightRef.current || !batch) return;
		if (isBatchCreator) {
			toast.error("The batch creator cannot approve this batch.");
			return;
		}
		if (approvalRemarks.trim().length < 5) {
			toast.error("Approval remarks must be at least 5 characters.");
			return;
		}
		inFlightRef.current = true;
		const idempotencyKey = generateIdempotencyKey();
		try {
			setBatch(await paymentApi.approvePaymentBatch(batch.id, { remarks: approvalRemarks.trim() }, idempotencyKey));
			setApproveModalOpen(false);
			setApprovalRemarks("");
			toast.success("Payment batch approved successfully!");
		} catch (err) {
			const status = err?.response?.status;
			if (status === 403) toast.error(err?.response?.data?.message || "Maker-checker violation: You cannot approve this batch.");
			else if (status === 404 || status === 501) {
				setBackendUnavailable(true);
				toast.error("Feature unavailable — backend pending");
			} else toast.error(err?.response?.data?.message || "Failed to approve payment batch");
		} finally {
			inFlightRef.current = false;
		}
	};
	const handleRejectBatch = async () => {
		if (inFlightRef.current || !batch) return;
		if (rejectReason.trim().length < 5) {
			toast.error("Rejection reason must be at least 5 characters.");
			return;
		}
		inFlightRef.current = true;
		const idempotencyKey = generateIdempotencyKey();
		try {
			setBatch(await paymentApi.rejectPaymentBatch(batch.id, { reason: rejectReason.trim() }, idempotencyKey));
			setRejectModalOpen(false);
			setRejectReason("");
			toast.warning("Payment batch sent back to Draft.");
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to reject payment batch");
		} finally {
			inFlightRef.current = false;
		}
	};
	const handleGenerateBankFile = async () => {
		if (inFlightRef.current || !batch) return;
		setGeneratingFile(true);
		inFlightRef.current = true;
		const idempotencyKey = generateIdempotencyKey();
		try {
			const metadata = await paymentApi.generateBankFile(batch.id, { format: selectedFormat }, idempotencyKey);
			setBankFile(metadata);
			toast.success(`Bank file ${metadata.fileName} generated by backend!`);
		} catch (err) {
			if (err?.response?.status === 404 || err?.response?.status === 501) {
				setBackendUnavailable(true);
				toast.error("Feature unavailable — backend pending");
			} else toast.error(err?.response?.data?.message || "Failed to generate bank file");
		} finally {
			setGeneratingFile(false);
			inFlightRef.current = false;
		}
	};
	const handleDownloadBankFile = async () => {
		if (!batch) return;
		try {
			const blob = await paymentApi.downloadBankFile(batch.id);
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = bankFile?.fileName || `SALARY_${batch.batchNumber}.csv`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
			toast.success("Bank file downloaded.");
		} catch {
			toast.error("Failed to download bank file");
		}
	};
	const handleSubmitBatch = async () => {
		if (inFlightRef.current || !batch) return;
		if (!bankRefNumber.trim()) {
			toast.error("Bank reference number is required.");
			return;
		}
		inFlightRef.current = true;
		const idempotencyKey = generateIdempotencyKey();
		try {
			setBatch(await paymentApi.submitPaymentBatch(batch.id, {
				bankReferenceNumber: bankRefNumber.trim(),
				submissionDate: (/* @__PURE__ */ new Date()).toISOString(),
				notes: submitNotes.trim() || void 0
			}, idempotencyKey));
			setSubmitModalOpen(false);
			toast.success("Batch marked as submitted to bank portal.");
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to mark batch as submitted");
		} finally {
			inFlightRef.current = false;
		}
	};
	const handlePreviewCsv = async (e) => {
		const file = e.target.files?.[0];
		if (!file || !batch) return;
		setCsvFile(file);
		setImportingCsv(true);
		try {
			const preview = await paymentApi.previewBankResponse(batch.id, file);
			setImportPreview(preview);
			toast.info(`CSV parsed: ${preview.validRows} valid rows, ${preview.invalidRows} invalid rows.`);
		} catch (err) {
			if (err?.response?.status === 404 || err?.response?.status === 501) {
				setBackendUnavailable(true);
				toast.error("Feature unavailable — backend pending");
			} else toast.error(err?.response?.data?.message || "Failed to parse bank response CSV");
		} finally {
			setImportingCsv(false);
		}
	};
	const handleApplyCsv = async () => {
		if (inFlightRef.current || !batch || !importPreview) return;
		setApplyingCsv(true);
		inFlightRef.current = true;
		const idempotencyKey = generateIdempotencyKey();
		try {
			const res = await paymentApi.applyBankResponse(batch.id, {
				previewToken: importPreview.previewToken,
				allowPartial: false
			}, idempotencyKey);
			toast.success(`Disbursement applied: ${res.paidCount} paid, ${res.failedCount} failed.`);
			loadBatchData();
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to apply bank response");
		} finally {
			setApplyingCsv(false);
			inFlightRef.current = false;
		}
	};
	const handleRevealAccount = async () => {
		if (!revealEmpId || revealReason.trim().length < 5) {
			toast.error("Justification reason of at least 5 characters is required.");
			return;
		}
		try {
			const data = await paymentApi.revealEmployeeBankAccount(revealEmpId, revealReason.trim());
			setRevealedAccount(data);
			setTimeout(() => {
				setRevealedAccount(null);
				setRevealModalOpen(false);
			}, (data.autoHideSeconds || 15) * 1e3);
			toast.warning(`Account revealed for ${data.autoHideSeconds || 15}s under audit log.`);
		} catch {
			toast.error("Failed to reveal account details");
		}
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
							onClick: () => navigate({ to: "/dashboard/payroll/payments" }),
							className: "h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "All Payment Batches" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground/40",
							children: "•"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground font-mono",
							children: batch?.batchNumber || `Batch: ${batchId}`
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: loadBatchData,
						disabled: loading,
						className: "h-8 gap-1.5 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: loading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Refresh" })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayrollStepper, {
				currentStep: "payment",
				runId: batch?.runId,
				batchId,
				runStatus: batch?.status || "Finalized"
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
							"Payment batch details endpoint (",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", { children: ["/api/v2/payroll/payment-batches/", batchId] }),
							") is awaiting backend deployment. All frontend components, maker-checker guards, and schemas are operational."
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
			batch && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MakerCheckerBanner, {
				creatorId: batch.createdBy.id,
				creatorName: batch.createdBy.name,
				createdAt: batch.createdAt,
				approverName: batch.approvedBy?.name,
				approvedAt: batch.approvedAt,
				approvalRemarks: batch.approvalRemarks,
				currentUserId: currentUser?.id
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/70 pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-bold tracking-tight text-foreground",
						children: batch?.batchNumber || `Payment Batch ${batchId}`
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "text-xs font-semibold border-primary/30 bg-primary/10 text-primary capitalize",
						children: batch?.status ? batch.status.replace(/_/g, " ") : "Draft"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: [
						"Disbursement Period: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: batch?.periodName || "—" }),
						" • Mode:",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: batch?.paymentMode || "NEFT" }),
						" • Run ID: ",
						batch?.runId || "—"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [batch && batch.status === "validated" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => setRejectModalOpen(true),
						className: "h-8 gap-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-500/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Send Back" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						id: "batch-approve-btn",
						variant: "default",
						size: "sm",
						disabled: isBatchCreator || hasBlockingValidation,
						onClick: () => setApproveModalOpen(true),
						className: "h-8 gap-1.5 text-xs font-semibold shadow-sm",
						title: isBatchCreator ? "The batch creator cannot approve this batch." : hasBlockingValidation ? "Cannot approve while blocking validation errors exist" : "Approve this payment batch",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Approve Batch" })]
					})] }), batch && batch.status === "approved" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "default",
						size: "sm",
						onClick: () => setSubmitModalOpen(true),
						className: "h-8 gap-1.5 text-xs font-semibold shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mark as Submitted to Bank" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 sm:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Total Employees",
						value: formatCount(batch?.employeeCount || 0),
						hint: "Line items in batch",
						icon: Users,
						accent: "brand"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Gross Amount",
						value: batch?.grossAmountFormatted || "—",
						hint: "Calculated total",
						icon: Banknote,
						accent: "muted"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Held Amount",
						value: batch?.heldAmountFormatted || "₹0.00",
						hint: "Withheld from disbursement",
						icon: UserX,
						accent: "warning"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Net Payable",
						value: batch?.payableAmountFormatted || "—",
						hint: "Authorized for bank release",
						icon: ShieldCheck,
						accent: "success"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				value: activeTab,
				onValueChange: (val) => setActiveTab(val),
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "bg-muted/50 p-1 rounded-2xl border border-border/60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "overview",
								className: "rounded-xl text-xs",
								children: "Overview & Employees"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "validation",
								className: "rounded-xl text-xs",
								children: ["Bank Validation", validationIssues.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: "ml-1.5 px-1 py-0 text-[10px]",
									children: validationIssues.length
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "file",
								className: "rounded-xl text-xs",
								children: "Bank Payment File"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "import",
								className: "rounded-xl text-xs",
								children: "Bank Response Import"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: "reconcile",
								className: "rounded-xl text-xs",
								children: "Reconciliation"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "overview",
						className: "space-y-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							className: "overflow-hidden p-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-4 border-b border-border/70 flex items-center justify-between",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-base font-semibold text-foreground",
									children: "Employee Payment Items"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Individual line items with masked banking details and disbursement status"
								})] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-left text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "bg-muted/40 text-muted-foreground border-b border-border/70 uppercase tracking-wider text-[11px] font-semibold",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Employee"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Bank Name"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Account Number"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "IFSC"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Net Pay"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Status"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "UTR Reference"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3 text-right",
												children: "Actions"
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
										className: "divide-y divide-border/60",
										children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											colSpan: 8,
											className: "px-4 py-8 text-center text-muted-foreground",
											children: "No employee items available. All numbers are authoritatively provided by the backend."
										}) }) : items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-muted/40 transition-colors",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "px-4 py-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "font-semibold text-foreground",
														children: item.employeeName
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[11px] text-muted-foreground font-mono",
														children: item.employeeCode
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 text-foreground",
													children: item.bankName
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 font-mono text-muted-foreground",
													children: item.accountNumberMasked
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 font-mono text-foreground",
													children: item.ifscCode
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 font-mono font-semibold text-emerald-600 dark:text-emerald-400",
													children: item.netAmountFormatted
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3",
													children: item.isHeld ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: "outline",
														className: "text-amber-600 border-amber-500/40",
														children: "Held"
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: "secondary",
														className: "capitalize",
														children: item.status
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 font-mono text-muted-foreground",
													children: item.utr || "—"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 text-right",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														size: "sm",
														variant: "ghost",
														onClick: () => {
															setRevealEmpId(item.employeeId);
															setRevealModalOpen(true);
														},
														className: "h-7 text-xs gap-1",
														title: "Audited reveal of bank account",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3 w-3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Verify" })]
													})
												})
											]
										}, item.id))
									})]
								})
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "validation",
						className: "space-y-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BankValidationTable, {
							issues: validationIssues,
							onRevalidate: async () => {
								if (!batch) return;
								try {
									setValidationIssues((await paymentApi.validatePaymentBatch(batch.id)).issues || []);
									toast.success("Validation re-run completed.");
								} catch {
									toast.error("Failed to revalidate bank details");
								}
							}
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "file",
						className: "space-y-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							className: "p-6 space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 border-b border-border pb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-base font-semibold text-foreground",
										children: "Server-Side Bank Payment File Generation"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Strict security compliance: Frontend never generates payment files. The backend compiles and signs bank-formatted salary files."
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-semibold text-foreground",
										children: "Select Corporate Banking Format"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										id: "bank-file-format-select",
										value: selectedFormat,
										onChange: (e) => setSelectedFormat(e.target.value),
										className: "mt-1.5 w-full rounded-xl border border-input bg-background/90 px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "HDFC_CSV",
												children: "HDFC Bank Corporate NetBanking (CSV)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "ICICI_EXCEL",
												children: "ICICI Bank Corporate Eazypay (Excel)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "SBI_TXT",
												children: "State Bank of India Corporate (TXT)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "GENERIC_NEFT_CSV",
												children: "Generic RBI NEFT/RTGS Master File (CSV)"
											})
										]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-end",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											id: "generate-bank-file-btn",
											onClick: handleGenerateBankFile,
											disabled: generatingFile || !batch || batch.status === "draft",
											className: "h-9 gap-2 text-xs font-semibold rounded-xl w-full",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: generatingFile ? "h-4 w-4 animate-spin" : "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Request File from Backend" })]
										})
									})]
								}),
								bankFile ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-4 text-xs space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 font-semibold text-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "h-4 w-4 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "File Ready for Corporate Banking Download" })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											onClick: handleDownloadBankFile,
											className: "h-8 gap-1.5 text-xs rounded-xl",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Download File" })]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-muted-foreground pt-2 border-t border-border/50",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-foreground",
													children: "File Name:"
												}),
												" ",
												bankFile.fileName
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-foreground",
													children: "Format:"
												}),
												" ",
												bankFile.format
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-foreground",
													children: "Generated At:"
												}),
												" ",
												formatDateTime(bankFile.generatedAt)
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "truncate",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold text-foreground",
														children: "SHA-256 Hash:"
													}),
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
														className: "text-[10px]",
														children: bankFile.sha256Checksum
													})
												]
											})
										]
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "rounded-xl border border-dashed border-border/80 p-6 text-center text-xs text-muted-foreground",
									children: "No bank payment file generated yet. Approved batches can request file compilation from the server."
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "import",
						className: "space-y-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
							className: "p-6 space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2.5 border-b border-border pb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-base font-semibold text-foreground",
										children: "Import Bank Disbursement Outcome (CSV)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: "Upload the bank outcome statement containing UTR references, credit timestamps, and failure reason codes."
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-dashed border-border/80 p-8 text-center space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-8 w-8 mx-auto text-primary opacity-80" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "font-semibold text-foreground cursor-pointer text-primary hover:underline",
											children: ["Click to select bank response CSV", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												id: "bank-csv-upload",
												type: "file",
												accept: ".csv",
												onChange: handlePreviewCsv,
												className: "hidden"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground mt-1",
											children: "Expected columns: Payment Reference, UTR, Status (PAID/FAILED), Failure Reason, Transaction Date"
										})]
									})]
								}),
								importPreview && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4 pt-3 border-t border-border/60",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "text-sm font-semibold text-foreground",
												children: "Validation Preview"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												disabled: applyingCsv || importPreview.validRows === 0,
												onClick: handleApplyCsv,
												className: "h-8 gap-1.5 text-xs rounded-xl",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
													"Apply ",
													importPreview.validRows,
													" Valid Rows"
												] })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "p-3 rounded-xl border border-border/60 bg-muted/20",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-muted-foreground",
														children: "Total Rows"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-mono font-semibold text-foreground mt-1",
														children: importPreview.totalRows
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-emerald-600 dark:text-emerald-400",
														children: "Valid Rows"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-mono font-semibold text-emerald-600 dark:text-emerald-400 mt-1",
														children: importPreview.validRows
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "p-3 rounded-xl border border-rose-500/40 bg-rose-500/5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-rose-600 dark:text-rose-400",
														children: "Invalid / Errors"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-mono font-semibold text-rose-600 dark:text-rose-400 mt-1",
														children: importPreview.invalidRows
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "p-3 rounded-xl border border-amber-500/40 bg-amber-500/5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-amber-600 dark:text-amber-400",
														children: "Duplicate Rows"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-mono font-semibold text-amber-600 dark:text-amber-400 mt-1",
														children: importPreview.duplicateRows
													})]
												})
											]
										}),
										importPreview.errors.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-rose-500/40 bg-rose-500/5 p-4 text-xs space-y-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-rose-600 dark:text-rose-400",
												children: "Row Errors Detected (Will Not Be Applied)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
												className: "list-disc pl-4 space-y-1 text-muted-foreground text-[11px]",
												children: importPreview.errors.slice(0, 5).map((err, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
													"Row ",
													err.rowNumber,
													" (",
													err.paymentReference,
													"): ",
													err.errorMessage
												] }, idx))
											})]
										})
									]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "reconcile",
						className: "space-y-6",
						children: reconciliation ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaymentReconciliationCard, { reconciliation }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl border border-dashed border-border/80 p-8 text-center text-xs text-muted-foreground",
							children: "Reconciliation calculations await bank disbursement responses."
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: approveModalOpen,
				onOpenChange: setApproveModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md rounded-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-base font-semibold",
							children: "Approve Payment Batch"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs text-muted-foreground",
							children: "Sign off on the disbursement batch as a certified checker. The batch creator cannot execute this action."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3 py-2 text-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold text-foreground",
									children: "Checker Approval Remarks *"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									id: "approve-remarks-input",
									placeholder: "e.g. Bank split and totals verified against finalized payroll run. Approved.",
									value: approvalRemarks,
									onChange: (e) => setApprovalRemarks(e.target.value),
									rows: 3,
									className: "mt-1 rounded-lg text-xs"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground",
									children: "Minimum 5 characters required."
								})
							] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setApproveModalOpen(false),
								className: "rounded-xl text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: handleApproveBatch,
								className: "rounded-xl text-xs",
								children: "Sign & Approve"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: rejectModalOpen,
				onOpenChange: setRejectModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md rounded-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-base font-semibold",
							children: "Send Back Payment Batch"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs text-muted-foreground",
							children: "Return the payment batch to Draft for revision or hold adjustments."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3 py-2 text-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-semibold text-foreground",
								children: "Rejection Reason *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "reject-reason-input",
								placeholder: "e.g. Please put employee EMP204 on hold due to pending account verification.",
								value: rejectReason,
								onChange: (e) => setRejectReason(e.target.value),
								rows: 3,
								className: "mt-1 rounded-lg text-xs"
							})] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setRejectModalOpen(false),
								className: "rounded-xl text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "destructive",
								size: "sm",
								onClick: handleRejectBatch,
								className: "rounded-xl text-xs",
								children: "Send Back"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: submitModalOpen,
				onOpenChange: setSubmitModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md rounded-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-base font-semibold",
							children: "Mark as Submitted to Bank"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs text-muted-foreground",
							children: "Record corporate bank portal upload details for audit tracking."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-semibold text-foreground",
								children: "Bank Reference / Acknowledgement Number *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "bank-ref-number-input",
								placeholder: "e.g. HDFC-CMS-991204",
								value: bankRefNumber,
								onChange: (e) => setBankRefNumber(e.target.value),
								className: "mt-1 h-8 rounded-lg text-xs"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-semibold text-foreground",
								children: "Notes (Optional)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "submit-notes-input",
								placeholder: "e.g. Uploaded via Corporate NetBanking portal by Finance.",
								value: submitNotes,
								onChange: (e) => setSubmitNotes(e.target.value),
								rows: 2,
								className: "mt-1 rounded-lg text-xs"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setSubmitModalOpen(false),
								className: "rounded-xl text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: handleSubmitBatch,
								className: "rounded-xl text-xs",
								children: "Confirm Submission"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: revealModalOpen,
				onOpenChange: setRevealModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md rounded-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-base font-semibold",
							children: "Audited Bank Account Reveal"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs text-muted-foreground",
							children: "Temporarily reveals unmasked bank details. An unalterable audit log entry will be created."
						})] }),
						revealedAccount ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 text-xs space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-mono text-base font-bold text-foreground",
									children: ["Account Number: ", revealedAccount.accountNumber]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-mono text-sm text-foreground",
									children: ["IFSC Code: ", revealedAccount.ifscCode]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[10px] text-amber-800 dark:text-amber-200",
									children: [
										"This dialog will automatically close in ",
										revealedAccount.autoHideSeconds,
										" seconds."
									]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3 py-2 text-xs",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "font-semibold text-foreground",
								children: "Mandatory Audit Justification *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "reveal-reason-input",
								placeholder: "e.g. Validating employee banking information for failed UTR reconciliation",
								value: revealReason,
								onChange: (e) => setRevealReason(e.target.value),
								rows: 3,
								className: "mt-1 rounded-lg text-xs"
							})] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => {
									setRevealModalOpen(false);
									setRevealedAccount(null);
								},
								className: "rounded-xl text-xs",
								children: "Close"
							}), !revealedAccount && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: handleRevealAccount,
								className: "rounded-xl text-xs",
								children: "Reveal (Audited)"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { PaymentBatchDetailPage as default };
