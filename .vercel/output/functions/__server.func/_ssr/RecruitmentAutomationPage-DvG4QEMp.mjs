import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { H as Sparkles, Sr as CircleCheck, gt as Play, ht as Plus, i as Zap, k as Trash2, pr as Clock, s as Workflow } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { t as Switch } from "./switch-C_mzcXif.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/RecruitmentAutomationPage-DvG4QEMp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LOCAL_STORAGE_KEY = "aurix.recruitment.workflows";
var LOGS_LOCAL_STORAGE_KEY = "aurix.recruitment.workflow_logs";
function RecruitmentAutomationPage() {
	const [workflows, setWorkflows] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") {
			const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
			if (raw) try {
				const parsed = JSON.parse(raw);
				if (Array.isArray(parsed)) return parsed.filter((w) => !w.id?.startsWith("wf-1") && !w.id?.startsWith("wf-2") && !w.id?.startsWith("wf-3") && !w.id?.startsWith("wf-4") && !w.id?.startsWith("wf-5"));
			} catch {}
		}
		return [];
	});
	const [logs, setLogs] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") {
			const raw = window.localStorage.getItem(LOGS_LOCAL_STORAGE_KEY);
			if (raw) try {
				const parsed = JSON.parse(raw);
				if (Array.isArray(parsed)) return parsed;
			} catch {}
		}
		return [];
	});
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") {
			const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
			if (raw) try {
				const parsed = JSON.parse(raw);
				if (Array.isArray(parsed)) {
					const cleanWorkflows = parsed.filter((w) => !w.id?.startsWith("wf-1") && !w.id?.startsWith("wf-2") && !w.id?.startsWith("wf-3") && !w.id?.startsWith("wf-4") && !w.id?.startsWith("wf-5"));
					window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cleanWorkflows));
					setWorkflows(cleanWorkflows);
				}
			} catch {
				window.localStorage.removeItem(LOCAL_STORAGE_KEY);
				setWorkflows([]);
			}
		}
	}, []);
	const [activeWorkflowId, setActiveWorkflowId] = (0, import_react.useState)(() => {
		return workflows[0]?.id || null;
	});
	const [showBuilderModal, setShowBuilderModal] = (0, import_react.useState)(false);
	const [newWorkflowName, setNewWorkflowName] = (0, import_react.useState)("");
	const [newWorkflowTrigger, setNewWorkflowTrigger] = (0, import_react.useState)("Candidate applied");
	const [newWorkflowAction, setNewWorkflowAction] = (0, import_react.useState)("Send automated email");
	const activeWorkflow = workflows.find((w) => w.id === activeWorkflowId) || workflows[0] || null;
	const saveWorkflows = (updated) => {
		setWorkflows(updated);
		if (typeof window !== "undefined") window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
	};
	const saveLogs = (updatedLogs) => {
		setLogs(updatedLogs);
		if (typeof window !== "undefined") window.localStorage.setItem(LOGS_LOCAL_STORAGE_KEY, JSON.stringify(updatedLogs));
	};
	const handleToggleWorkflow = (id) => {
		saveWorkflows(workflows.map((w) => w.id === id ? {
			...w,
			enabled: !w.enabled
		} : w));
		toast.success("Workflow status updated!");
	};
	const handleDeleteWorkflow = (id, e) => {
		e.stopPropagation();
		const updated = workflows.filter((w) => w.id !== id);
		saveWorkflows(updated);
		if (activeWorkflowId === id) setActiveWorkflowId(updated[0]?.id || null);
		toast.success("Workflow rule permanently deleted!");
	};
	const handleCreateWorkflow = (e) => {
		e.preventDefault();
		if (!newWorkflowName.trim()) return;
		const newWf = {
			id: `wf-${Date.now()}`,
			name: newWorkflowName,
			description: `Automated trigger on ${newWorkflowTrigger}.`,
			enabled: true,
			totalRuns: 0,
			lastTriggered: "Never",
			triggerEvent: newWorkflowTrigger,
			steps: [{
				id: `st-${Date.now()}-1`,
				type: "trigger",
				title: `Trigger: ${newWorkflowTrigger}`,
				detail: "Initiated automatically by recruitment events",
				category: "System"
			}, {
				id: `st-${Date.now()}-2`,
				type: "action",
				title: `Action: ${newWorkflowAction}`,
				detail: "Dispatched without manual intervention",
				category: "Notification"
			}]
		};
		saveWorkflows([newWf, ...workflows]);
		setActiveWorkflowId(newWf.id);
		toast.success(`Workflow '${newWf.name}' created and activated!`);
		setShowBuilderModal(false);
		setNewWorkflowName("");
	};
	const handleTestRun = (wf) => {
		const now = /* @__PURE__ */ new Date();
		const timeStr = now.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit"
		});
		const dateStr = now.toISOString().split("T")[0];
		saveWorkflows(workflows.map((w) => w.id === wf.id ? {
			...w,
			totalRuns: w.totalRuns + 1,
			lastTriggered: "Just now"
		} : w));
		saveLogs([{
			id: `log-${Date.now()}`,
			timestamp: `${dateStr} ${timeStr}`,
			message: `Simulated trigger for '${wf.name}' executed successfully`,
			status: "Success"
		}, ...logs.slice(0, 19)]);
		toast.success(`Simulated test execution for '${wf.name}'!`);
	};
	const totalRunsAll = workflows.reduce((acc, w) => acc + w.totalRuns, 0);
	const activeCount = workflows.filter((w) => w.enabled).length;
	const hoursSaved = (totalRunsAll * .25).toFixed(1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setShowBuilderModal(true),
					className: "gap-1.5 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Create Workflow Rule"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Active Automated Rules" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Workflow, { className: "h-4 w-4 text-indigo-500" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 font-display text-2xl font-bold",
								children: [
									activeCount,
									" of ",
									workflows.length,
									" Active"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: "Operating across pipelines"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Automated Runs" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4 text-amber-500" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 font-display text-2xl font-bold",
								children: [totalRunsAll, " Executions"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: "Lifetime executions"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Recruiter Hours Saved" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-emerald-500" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400",
								children: [hoursSaved, " Hours"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: "Automated repetitive tasks"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Execution Success Rate" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-purple-500" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 font-display text-2xl font-bold",
								children: totalRunsAll > 0 ? "100%" : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: totalRunsAll > 0 ? "0 failures detected" : "Awaiting first run"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between font-semibold text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Automation Library" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: "text-xs",
								children: [workflows.length, " Rules"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => setShowBuilderModal(true),
								className: "h-7 text-xs gap-1 shadow-2xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" }), " New"]
							})]
						})]
					}), workflows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-dashed border-border/80 bg-card/30 p-8 text-center space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Workflow, { className: "h-8 w-8 text-muted-foreground/40 mx-auto" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs font-semibold text-foreground",
								children: "No automation rules configured"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground leading-relaxed",
								children: "No active automation workflows. Build visual trigger rules to automate resume screening, interview invites, and candidate communications."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: () => setShowBuilderModal(true),
								className: "gap-1.5 text-xs mt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Create Rule"]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: workflows.map((wf) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => setActiveWorkflowId(wf.id),
							className: `group p-3.5 rounded-xl border text-left transition-all cursor-pointer space-y-2 ${activeWorkflow?.id === wf.id ? "border-indigo-500 bg-accent/60 shadow-sm" : "border-border bg-card/40 hover:bg-accent/30"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-bold text-xs text-foreground leading-snug",
										children: wf.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
											checked: wf.enabled,
											onCheckedChange: () => handleToggleWorkflow(wf.id),
											onClick: (e) => e.stopPropagation()
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: (e) => handleDeleteWorkflow(wf.id, e),
											className: "text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-1",
											title: "Delete Rule",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground line-clamp-2",
									children: wf.description
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-[10px] text-muted-foreground/80 pt-1 border-t border-border/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [wf.totalRuns, " runs"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Last run: ", wf.lastTriggered] })]
								})
							]
						}, wf.id))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-2 space-y-4",
					children: activeWorkflow ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-bold text-base text-foreground",
										children: activeWorkflow.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: activeWorkflow.enabled ? "default" : "secondary",
										className: "text-[10px]",
										children: activeWorkflow.enabled ? "Active" : "Disabled"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mt-0.5",
									children: activeWorkflow.description
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "outline",
										className: "h-8 text-xs gap-1",
										onClick: () => handleTestRun(activeWorkflow),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-3 w-3 fill-current" }), " Test Run"]
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs uppercase font-bold text-muted-foreground tracking-wider",
									children: "Visual Step Pipeline Execution Flow"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative pl-6 space-y-4 border-l-2 border-dashed border-indigo-500/40 ml-2",
									children: activeWorkflow.steps.map((step, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative group",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "absolute -left-[31px] top-3.5 grid h-4 w-4 place-items-center rounded-full bg-indigo-500 text-[9px] text-white font-bold shadow-md",
											children: idx + 1
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-3.5 rounded-xl border border-border bg-card/40 hover:bg-card/75 transition-colors space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "font-semibold text-xs text-foreground flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: step.title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: "outline",
														className: "text-[9px] uppercase font-bold",
														children: step.type
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-muted-foreground",
													children: step.category
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground leading-relaxed",
												children: step.detail
											})]
										})]
									}, step.id))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-4 border-t border-border space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "font-semibold text-xs text-muted-foreground uppercase tracking-wider",
									children: "Live Execution Stream"
								}), logs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-3 rounded-xl border border-dashed border-border/70 text-center text-xs text-muted-foreground bg-muted/10",
									children: "No workflow executions recorded yet. Triggers and test simulations will log live status here."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-1.5 font-mono text-[11px]",
									children: logs.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2 rounded bg-muted/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"✓ [",
											log.timestamp,
											"] ",
											log.message
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground",
											children: log.status
										})]
									}, log.id))
								})]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-dashed border-border/80 bg-card/20 p-12 text-center space-y-3 flex flex-col items-center justify-center min-h-[360px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-12 w-12 rounded-2xl bg-primary/10 grid place-items-center text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-6 w-6" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold text-sm text-foreground",
								children: "Visual Workflow Canvas"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground max-w-md",
								children: "Select or create an automation workflow to configure trigger events, conditional rules, and automatic action pipelines."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: () => setShowBuilderModal(true),
								className: "mt-2 gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Build First Automation"]
							})
						]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: showBuilderModal,
				onOpenChange: setShowBuilderModal,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "max-w-lg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleCreateWorkflow,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
								className: "text-base font-bold",
								children: "Create No-Code Automation Rule"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Define an event trigger and subsequent automated actions." })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 py-3 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Workflow Name *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "mt-1 h-9 text-xs",
										placeholder: "e.g. Reject below 60% ATS score with warm feedback",
										value: newWorkflowName,
										onChange: (e) => setNewWorkflowName(e.target.value),
										required: true
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "When this Event Occurs (Trigger)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: newWorkflowTrigger,
										onValueChange: setNewWorkflowTrigger,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "mt-1 h-9 text-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Candidate applied",
												children: "Candidate submits application"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Score exceeds 85%",
												children: "AI Screening ATS score > 85%"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Interview scheduled",
												children: "Interview scheduled by panel"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Offer accepted",
												children: "Candidate accepts digital offer"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Day 1 joined",
												children: "Employee orientation completed"
											})
										] })]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Then Execute this Action"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: newWorkflowAction,
										onValueChange: setNewWorkflowAction,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "mt-1 h-9 text-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Send automated email",
												children: "Dispatch personalized email template"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Send WhatsApp notification",
												children: "Send WhatsApp message with calendar link"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Advance to technical interview",
												children: "Move stage to Technical Interview"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Trigger hardware provision ticket",
												children: "Create IT laptop provision ticket"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Assign onboarding buddy",
												children: "Assign department mentor"
											})
										] })]
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setShowBuilderModal(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								children: "Activate Automation"
							})] })
						]
					})
				})
			})
		]
	});
}
//#endregion
export { RecruitmentAutomationPage };
