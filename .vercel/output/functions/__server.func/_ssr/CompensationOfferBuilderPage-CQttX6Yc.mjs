import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { E as TrendingUp, Ln as FileText, Q as Send, St as PenLine, er as Download, q as ShieldCheck } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { n as useRecruitment } from "./useRecruitment-Cuznx8sx.mjs";
import { t as Slider } from "./slider-DZzI4Odi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CompensationOfferBuilderPage-CQttX6Yc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CompensationOfferBuilderPage() {
	const { candidates, jobs, offers, upsertOffer } = useRecruitment();
	const [selectedCandidateId, setSelectedCandidateId] = (0, import_react.useState)(candidates[0]?.id || "");
	const [showOfferPreview, setShowOfferPreview] = (0, import_react.useState)(false);
	const [showRevisionModal, setShowRevisionModal] = (0, import_react.useState)(false);
	const [baseSalary, setBaseSalary] = (0, import_react.useState)(0);
	const [variableBonus, setVariableBonus] = (0, import_react.useState)(0);
	const [esopGrant, setEsopGrant] = (0, import_react.useState)(0);
	const [joiningBonus, setJoiningBonus] = (0, import_react.useState)(0);
	const [targetJoiningDate, setTargetJoiningDate] = (0, import_react.useState)("");
	const [negotiationLog, setNegotiationLog] = (0, import_react.useState)([]);
	const [revisionNote, setRevisionNote] = (0, import_react.useState)("");
	const candidate = candidates.find((c) => c.id === selectedCandidateId) || candidates[0] || null;
	const job = candidate ? jobs.find((j) => j.id === candidate?.jobId) || jobs[0] || null : null;
	const totalCtc = baseSalary + variableBonus + esopGrant + joiningBonus;
	const candidateExpected = candidate?.expectedSalary || 0;
	const budgetMax = job?.salaryMax || 0;
	const basic = Math.round(baseSalary * .5);
	const hra = Math.round(baseSalary * .25);
	const specialAllowance = baseSalary - basic - hra;
	const handleCreateOrUpdateOffer = () => {
		if (!candidate || !job) return;
		upsertOffer({
			id: `off-${Date.now()}`,
			applicationId: candidate.applicationId || "",
			candidateId: candidate.id,
			candidateName: candidate.name,
			jobId: job.id,
			jobTitle: candidate.appliedPosition || job.title,
			salary: totalCtc,
			currency: "INR",
			joiningDate: targetJoiningDate,
			benefits: [
				`Base Salary: ₹${(baseSalary / 1e5).toFixed(1)} LPA`,
				`Annual Performance Bonus: ₹${(variableBonus / 1e5).toFixed(1)} LPA`,
				`ESOP Equity Value: ₹${(esopGrant / 1e5).toFixed(1)} LPA`,
				`One-time Joining Bonus: ₹${(joiningBonus / 1e5).toFixed(1)} Lakhs`
			],
			status: "pending-approval",
			sentAt: (/* @__PURE__ */ new Date()).toISOString(),
			approvals: []
		});
		toast.success(`Formal Compensation Package for ${candidate.name} submitted for Approval!`);
		setShowOfferPreview(true);
	};
	const handleReviseOffer = (e) => {
		e.preventDefault();
		if (!revisionNote.trim()) return;
		setNegotiationLog([{
			round: `Revision ${negotiationLog.length + 1}`,
			date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			amount: `₹${(totalCtc / 1e5).toFixed(1)} LPA`,
			note: revisionNote
		}, ...negotiationLog]);
		toast.success("Offer parameters revised and logged in audit history.");
		setShowRevisionModal(false);
		setRevisionNote("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-end items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => setShowRevisionModal(true),
					className: "gap-1.5",
					disabled: !candidate,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-4 w-4" }), " Revise Offer Terms"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: handleCreateOrUpdateOffer,
					className: "bg-gradient-brand text-brand-foreground shadow-glow gap-1.5",
					disabled: !candidate,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }), " Submit for Approval"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs text-muted-foreground",
								children: "Candidate for Offer Structuring"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: selectedCandidateId,
								onValueChange: setSelectedCandidateId,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "mt-1 h-9 text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select a candidate" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: candidates.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: c.id,
									children: [
										c.name,
										" — ",
										c.appliedPosition
									]
								}, c.id)) })]
							})]
						}),
						candidate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-background/50 p-3.5 space-y-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Target Role:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: candidate.appliedPosition
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Current Company:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: candidate.currentCompany || "—"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Candidate Expectation:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-foreground",
										children: candidateExpected > 0 ? `₹${(candidateExpected / 1e5).toFixed(1)} LPA` : "—"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Approved Job Band Max:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-emerald-600 dark:text-emerald-400",
										children: budgetMax > 0 ? `₹${(budgetMax / 1e5).toFixed(1)} LPA` : "—"
									})]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground text-center py-4",
							children: "Select a candidate to view details."
						}),
						candidate && budgetMax > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl bg-muted/40 p-3 space-y-1.5 border border-border/80 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Budget Consumption" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: totalCtc <= budgetMax ? "text-emerald-500" : "text-rose-500",
										children: [Math.round(totalCtc / budgetMax * 100), "% of Max"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-full bg-muted h-2 rounded-full overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `h-full ${totalCtc <= budgetMax ? "bg-emerald-500" : "bg-rose-500"}`,
										style: { width: `${Math.min(100, Math.round(totalCtc / budgetMax * 100))}%` }
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground pt-1",
									children: totalCtc <= budgetMax ? `✓ Proposed package is ₹${((budgetMax - totalCtc) / 1e5).toFixed(1)}L below upper cap.` : `⚠ Exceeds department budget allocation by ₹${((totalCtc - budgetMax) / 1e5).toFixed(1)}L.`
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl lg:col-span-2 space-y-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between border-b border-border pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-bold text-base text-foreground",
								children: [
									"Annual CTC Breakdown: ₹",
									(totalCtc / 1e5).toFixed(2),
									" LPA"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Dynamically calculate fixed basic, HRA, performance bonus, and stock options."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "secondary",
								className: "text-xs font-bold font-mono",
								children: [
									"₹",
									Math.round(totalCtc / 12).toLocaleString(),
									"/month gross"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold",
											children: "Fixed Base Salary (INR)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono font-bold",
											children: [
												"₹",
												(baseSalary / 1e5).toFixed(1),
												" LPA"
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
										value: [baseSalary],
										min: 0,
										max: 4e6,
										step: 5e4,
										onValueChange: (v) => setBaseSalary(v[0])
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold",
											children: "Annual Variable Performance Bonus"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono font-bold",
											children: [
												"₹",
												(variableBonus / 1e5).toFixed(1),
												" LPA"
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
										value: [variableBonus],
										min: 0,
										max: 15e5,
										step: 25e3,
										onValueChange: (v) => setVariableBonus(v[0])
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold",
											children: "Annualized ESOP Equity Grant"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono font-bold",
											children: [
												"₹",
												(esopGrant / 1e5).toFixed(1),
												" LPA"
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
										value: [esopGrant],
										min: 0,
										max: 2e6,
										step: 5e4,
										onValueChange: (v) => setEsopGrant(v[0])
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold",
											children: "One-Time Joining Bonus"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono font-bold",
											children: [
												"₹",
												(joiningBonus / 1e5).toFixed(1),
												" Lakhs"
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
										value: [joiningBonus],
										min: 0,
										max: 1e6,
										step: 25e3,
										onValueChange: (v) => setJoiningBonus(v[0])
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-2 bg-muted/30 p-3 rounded-xl text-center text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted-foreground text-[10px] uppercase",
									children: "Basic (50%)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-bold text-sm text-foreground",
									children: [
										"₹",
										(basic / 1e5).toFixed(2),
										"L"
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted-foreground text-[10px] uppercase",
									children: "HRA (25%)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-bold text-sm text-foreground",
									children: [
										"₹",
										(hra / 1e5).toFixed(2),
										"L"
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted-foreground text-[10px] uppercase",
									children: "Special Allowance"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-bold text-sm text-foreground",
									children: [
										"₹",
										(specialAllowance / 1e5).toFixed(2),
										"L"
									]
								})] })
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
						className: "font-semibold text-sm text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4 text-indigo-500" }), "Offer Negotiation & Audit Trail"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 text-xs",
						children: [negotiationLog.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-muted-foreground text-center py-6",
							children: "No negotiation history yet. Revisions will appear here."
						}), negotiationLog.map((n, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-3 rounded-xl border border-border bg-card/40 space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: n.round }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-indigo-500",
										children: n.amount
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted-foreground",
									children: n.note
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] text-muted-foreground/70",
									children: n.date
								})
							]
						}, i))]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
						className: "font-semibold text-sm text-foreground flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-emerald-500" }), "Executive Approval Chain"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2 text-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-muted-foreground text-center py-6",
							children: "No approval workflow configured yet. Submit an offer to initiate the approval chain."
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: showOfferPreview,
				onOpenChange: setShowOfferPreview,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "text-lg font-bold flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-5 w-5 text-indigo-500" }), "Formal Offer Letter Preview"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: ["Binding employment agreement for ", candidate?.name] })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-h-[450px] overflow-y-auto p-6 rounded-xl border border-border bg-zinc-950 text-zinc-100 font-serif text-xs leading-relaxed space-y-4 shadow-inner",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-center border-b border-zinc-800 pb-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "text-base font-bold font-sans tracking-wide uppercase",
										children: "Offer of Employment"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] font-sans",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Date:" }),
										" ",
										(/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", { dateStyle: "long" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "To:" }),
										" ",
										candidate?.name,
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Address:" }),
										" ",
										candidate?.location
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									"Dear ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: candidate?.name }),
									","
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									"We are delighted to offer you full-time employment as ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: candidate?.appliedPosition }),
									"."
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3 rounded border border-zinc-800 bg-zinc-900/60 font-sans space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-bold text-xs",
											children: "Summary of Compensation Terms:"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["• Total Annual Cost to Company (CTC): ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
											"₹",
											(totalCtc / 1e5).toFixed(2),
											" LPA"
										] })] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											"• Fixed Base Salary: ₹",
											(baseSalary / 1e5).toFixed(2),
											" LPA"
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											"• Annual Performance Incentive: ₹",
											(variableBonus / 1e5).toFixed(2),
											" LPA"
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
											"• ESOP Stock Value: ₹",
											(esopGrant / 1e5).toFixed(2),
											" LPA (4-year vesting schedule)"
										] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["• Target Joining Date: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: targetJoiningDate || "TBD" })] })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This offer is contingent upon successful verification of your academic credentials and prior employment references." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-4 border-t border-zinc-800 flex justify-between font-sans text-[11px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-zinc-400",
										children: "Authorized Signatory:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-zinc-500 text-[10px] mt-2",
										children: "Pending Assignment"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-zinc-400",
											children: "Accepted & Signed:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-emerald-400 font-mono text-[10px] mt-2",
											children: "Digital Signature Pending"
										})]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setShowOfferPreview(false),
							children: "Close"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "bg-gradient-brand text-brand-foreground shadow-glow gap-1.5",
							onClick: () => {
								toast.success("Offer Letter downloaded as PDF!");
								setShowOfferPreview(false);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), " Download PDF"]
						})] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: showRevisionModal,
				onOpenChange: setShowRevisionModal,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "max-w-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleReviseOffer,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
								className: "text-base font-bold",
								children: "Log Compensation Revision"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Record negotiation notes or adjusted salary parameters for audit." })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-3 py-2 text-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Revision Reason / Counter-Offer Notes *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									className: "mt-1 text-xs",
									rows: 4,
									placeholder: "e.g. Candidate countered with competing offer. Agreed to adjust base salary.",
									value: revisionNote,
									onChange: (e) => setRevisionNote(e.target.value),
									required: true
								})] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setShowRevisionModal(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								children: "Save Revision"
							})] })
						]
					})
				})
			})
		]
	});
}
//#endregion
export { CompensationOfferBuilderPage };
