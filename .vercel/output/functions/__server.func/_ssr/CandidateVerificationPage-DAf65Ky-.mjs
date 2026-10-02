import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Ar as Check, Sr as CircleCheck, T as TriangleAlert, p as Users, q as ShieldCheck } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CandidateVerificationPage-DAf65Ky-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var INITIAL_BGV_DATA = [];
function CandidateVerificationPage() {
	const [bgvList, setBgvList] = (0, import_react.useState)(INITIAL_BGV_DATA);
	const [selectedProfileId, setSelectedProfileId] = (0, import_react.useState)("");
	const [manualOverrideModal, setManualOverrideModal] = (0, import_react.useState)(null);
	const [overrideNotes, setOverrideNotes] = (0, import_react.useState)("");
	const activeProfile = bgvList.find((p) => p.candidateId === selectedProfileId) || bgvList[0] || null;
	const handleApproveCheck = (checkId) => {
		if (!activeProfile) return;
		setBgvList(bgvList.map((prof) => {
			if (prof.candidateId !== activeProfile.candidateId) return prof;
			return {
				...prof,
				checks: prof.checks.map((chk) => chk.id === checkId ? {
					...chk,
					status: "Verified",
					verifiedAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
				} : chk)
			};
		}));
		toast.success("Verification check approved & marked Verified!");
	};
	const handleManualOverrideSubmit = (e) => {
		e.preventDefault();
		if (!manualOverrideModal || !activeProfile) return;
		setBgvList(bgvList.map((prof) => {
			if (prof.candidateId !== activeProfile.candidateId) return prof;
			return {
				...prof,
				overallStatus: "Clear",
				checks: prof.checks.map((chk) => chk.id === manualOverrideModal.id ? {
					...chk,
					status: "Verified",
					notes: `[Manual HR Override Approved]: ${overrideNotes}`,
					verifiedAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
				} : chk)
			};
		}));
		toast.success("Manual review override approved and audit trail updated.");
		setManualOverrideModal(null);
		setOverrideNotes("");
	};
	const statusBadgeColor = {
		Verified: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400",
		"In Review": "bg-indigo-500/15 text-indigo-600 border-indigo-500/30 dark:text-indigo-400",
		"Pending Document": "bg-amber-500/15 text-amber-600 border-amber-500/30 dark:text-amber-400",
		"Exception Flagged": "bg-rose-500/15 text-rose-600 border-rose-500/30 dark:text-rose-400"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-6 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-semibold text-sm flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Candidates in BGV" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "text-xs",
						children: [bgvList.length, " Active"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [bgvList.map((prof) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setSelectedProfileId(prof.candidateId),
						className: `w-full p-3 rounded-xl border text-left transition-all cursor-pointer ${activeProfile?.candidateId === prof.candidateId ? "border-indigo-500 bg-accent/60 shadow-sm" : "border-border bg-card/40 hover:bg-accent/30"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-sm text-foreground",
									children: prof.candidateName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: `text-[9px] ${prof.overallStatus === "Clear" ? "text-emerald-600 border-emerald-500/40" : prof.overallStatus === "Manual Review" ? "text-rose-600 border-rose-500/40" : "text-amber-600 border-amber-500/40"}`,
									children: prof.overallStatus
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: prof.appliedPosition
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[10px] text-muted-foreground mt-2 flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Checks: ",
									prof.checks.filter((c) => c.status === "Verified").length,
									" / ",
									prof.checks.length,
									" Verified"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold text-foreground",
									children: ["Risk: ", prof.riskScore]
								})]
							})
						]
					}, prof.candidateId)), bgvList.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground text-center py-6",
						children: "No candidates in verification pipeline."
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-2 space-y-4",
				children: activeProfile ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-lg text-foreground",
								children: activeProfile.candidateName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									activeProfile.appliedPosition,
									" • BGV Status: ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-foreground",
										children: activeProfile.overallStatus
									})
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									className: "h-8 text-xs gap-1.5",
									onClick: () => toast.info("Triggered refresh on external BGV partner webhooks"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), " Re-sync Checks"]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3",
							children: activeProfile.checks.map((chk) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-card/40 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-foreground",
												children: chk.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: `text-[10px] ${statusBadgeColor[chk.status]}`,
												children: chk.status
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-muted-foreground",
											children: [
												"Document: ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium text-foreground",
													children: chk.documentName
												}),
												" • Partner: ",
												chk.verifier
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-muted-foreground italic",
											children: [
												"\"",
												chk.notes,
												"\""
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 shrink-0",
									children: [
										chk.status === "Exception Flagged" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											className: "h-7 text-xs px-2.5 bg-rose-600 hover:bg-rose-700 text-white gap-1",
											onClick: () => {
												setManualOverrideModal(chk);
												setOverrideNotes("");
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3 w-3" }), " Manual Review"]
										}),
										chk.status !== "Verified" && chk.status !== "Exception Flagged" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											className: "h-7 text-xs px-2.5 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10 gap-1",
											onClick: () => handleApproveCheck(chk.id),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }), " Approve"]
										}),
										chk.status === "Verified" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-emerald-600 font-semibold flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }),
												" Verified on ",
												chk.verifiedAt
											]
										})
									]
								})]
							}, chk.id))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-3 border-t border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "font-semibold text-xs text-muted-foreground mb-2",
								children: "Verification Audit Log"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [activeProfile.timeline.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground text-center py-3",
									children: "No audit entries yet."
								}), activeProfile.timeline.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"• ",
										t.title,
										" ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] text-muted-foreground/70",
											children: [
												"(",
												t.actor,
												")"
											]
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[10px]",
										children: t.date
									})]
								}, i))]
							})]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-8 backdrop-blur-xl flex flex-col items-center justify-center text-center min-h-[300px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-10 w-10 text-muted-foreground/40 mb-3" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-sm text-foreground",
							children: "No Verification Cases"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground mt-1 max-w-xs",
							children: "There are no candidates currently in the background verification pipeline. BGV cases will appear here once initiated."
						})
					]
				})
			})]
		}), manualOverrideModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: Boolean(manualOverrideModal),
			onOpenChange: () => setManualOverrideModal(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
				className: "max-w-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleManualOverrideSubmit,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "text-base font-bold flex items-center gap-2 text-rose-600",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5" }), "Manual Review Exception Override"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
							"Resolve exception for ",
							manualOverrideModal.name,
							" for ",
							activeProfile?.candidateName,
							"."
						] })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-3 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Flagged Issue:" }),
									" ",
									manualOverrideModal.notes
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs",
								children: "Resolution Rationale & HR Auditor Notes *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								className: "mt-1 text-xs",
								rows: 4,
								value: overrideNotes,
								onChange: (e) => setOverrideNotes(e.target.value),
								required: true
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setManualOverrideModal(null),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "bg-emerald-600 hover:bg-emerald-700 text-white",
							children: "Approve Exception Override"
						})] })
					]
				})
			})
		})]
	});
}
//#endregion
export { CandidateVerificationPage };
