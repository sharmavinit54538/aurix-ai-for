import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Ar as Check, Dt as Package, Gn as FileCheck, Jn as Eye, Q as Send, St as PenLine, Ur as CalendarDays, Vt as Mail, g as UserX, ht as Plus, k as Trash2, or as Copy, zn as FileSearch } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/RecruitmentTemplatesPage-CPfj8nDt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORY_CONFIG = {
	Outreach: {
		id: "Outreach",
		label: "Outreach",
		icon: Mail,
		color: "from-sky-500/20 to-blue-500/20 text-sky-400 border-sky-500/30"
	},
	Interview: {
		id: "Interview",
		label: "Interview",
		icon: CalendarDays,
		color: "from-violet-500/20 to-purple-500/20 text-violet-400 border-violet-500/30"
	},
	Offer: {
		id: "Offer",
		label: "Offer",
		icon: FileCheck,
		color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30"
	},
	Rejection: {
		id: "Rejection",
		label: "Rejection",
		icon: UserX,
		color: "from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30"
	},
	Onboarding: {
		id: "Onboarding",
		label: "Onboarding",
		icon: Package,
		color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30"
	},
	Assessment: {
		id: "Assessment",
		label: "Assessment",
		icon: FileSearch,
		color: "from-cyan-500/20 to-teal-500/20 text-cyan-400 border-cyan-500/30"
	}
};
var LOCAL_STORAGE_KEY = "aurix.recruitment.templates";
var MERGE_TAGS = [
	{
		tag: "{{candidate.first_name}}",
		label: "First Name"
	},
	{
		tag: "{{candidate.last_name}}",
		label: "Last Name"
	},
	{
		tag: "{{job.title}}",
		label: "Job Title"
	},
	{
		tag: "{{company.name}}",
		label: "Company"
	},
	{
		tag: "{{interview.date}}",
		label: "Interview Date"
	},
	{
		tag: "{{interview.time}}",
		label: "Interview Time"
	},
	{
		tag: "{{interview.meeting_url}}",
		label: "Meeting Link"
	},
	{
		tag: "{{joining.date}}",
		label: "Joining Date"
	},
	{
		tag: "{{sender.name}}",
		label: "Sender Name"
	}
];
function RecruitmentTemplatesPage() {
	const [items, setItems] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") {
			const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
			if (raw) try {
				const parsed = JSON.parse(raw);
				if (Array.isArray(parsed)) return parsed.filter((item) => !item.id?.startsWith("t_") && !item.id?.startsWith("tmpl_") && item.name !== "New Template");
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
					const cleanTemplates = parsed.filter((item) => !item.id?.startsWith("t_") && !item.id?.startsWith("tmpl_") && item.name !== "New Template");
					window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cleanTemplates));
					setItems(cleanTemplates);
				}
			} catch {
				window.localStorage.removeItem(LOCAL_STORAGE_KEY);
				setItems([]);
			}
		}
	}, []);
	const [selectedId, setSelectedId] = (0, import_react.useState)(null);
	const [viewMode, setViewMode] = (0, import_react.useState)("edit");
	const [testEmailRecipient, setTestEmailRecipient] = (0, import_react.useState)("candidate@example.com");
	const textareaRef = (0, import_react.useRef)(null);
	const saveItems = (newItems) => {
		setItems(newItems);
		if (typeof window !== "undefined") window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newItems));
	};
	const currentTemplate = items.find((t) => t.id === selectedId) || null;
	const updateCurrent = (patch) => {
		if (!currentTemplate) return;
		saveItems(items.map((t) => t.id === currentTemplate.id ? {
			...t,
			...patch
		} : t));
	};
	const handleDuplicate = (templateToDup) => {
		const newTId = `template_${Date.now()}`;
		saveItems([{
			...templateToDup,
			id: newTId,
			name: `${templateToDup.name} (Copy)`
		}, ...items]);
		setSelectedId(newTId);
		toast.success("Template duplicated successfully!");
	};
	const handleDelete = (idToDelete) => {
		saveItems(items.filter((t) => t.id !== idToDelete));
		if (selectedId === idToDelete) setSelectedId(null);
		toast.success("Template deleted successfully!");
	};
	const createTemplate = () => {
		const newTId = `template_${Date.now()}`;
		saveItems([{
			id: newTId,
			name: "Custom Template",
			category: "Outreach",
			description: "Custom template for recruiting communications.",
			subject: "",
			body: ""
		}, ...items]);
		setSelectedId(newTId);
	};
	const handleInsertTag = (tag) => {
		if (!currentTemplate) return;
		const textarea = textareaRef.current;
		if (textarea) {
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;
			const originalText = currentTemplate.body;
			updateCurrent({ body: originalText.substring(0, start) + tag + originalText.substring(end) });
			setTimeout(() => {
				textarea.focus();
				textarea.setSelectionRange(start + tag.length, start + tag.length);
			}, 0);
		} else updateCurrent({ body: `${currentTemplate.body} ${tag}` });
	};
	const handleSendTestEmail = () => {
		if (!testEmailRecipient) {
			toast.error("Please provide a valid recipient email.");
			return;
		}
		toast.success(`Test email dispatched to ${testEmailRecipient}!`);
	};
	const resolvePreviewContent = (template) => {
		let subject = template.subject || "(No subject)";
		let body = template.body || "(No message body)";
		Object.entries({
			"{{candidate.first_name}}": "Candidate",
			"{{candidate.last_name}}": "Name",
			"{{job.title}}": "Position Title",
			"{{company.name}}": "OFC360",
			"{{interview.date}}": "[Interview Date]",
			"{{interview.time}}": "[Interview Time]",
			"{{interview.meeting_url}}": "[Meeting URL]",
			"{{joining.date}}": "[Joining Date]",
			"{{sender.name}}": "Recruiting Team"
		}).forEach(([token, value]) => {
			subject = subject.replaceAll(token, value);
			body = body.replaceAll(token, value);
		});
		return {
			subject,
			body
		};
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-6",
		children: !selectedId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-6",
			children: items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center py-24 text-center border border-dashed border-border rounded-2xl bg-card/30",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-semibold text-base text-foreground",
						children: "No templates available"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-sm text-xs text-muted-foreground",
						children: "Create a communication template for your recruitment workflow."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: createTemplate,
						size: "sm",
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1.5 h-4 w-4" }), " Create Template"]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: items.map((template) => {
					const meta = CATEGORY_CONFIG[template.category] || CATEGORY_CONFIG.Outreach;
					const Icon = meta.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setSelectedId(template.id),
						className: "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-xl hover:bg-accent/40 text-left cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br border ${meta.color} transition-transform duration-200 group-hover:scale-105`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary",
									children: template.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2",
									children: template.description || template.subject
								})]
							})]
						})
					}, template.id);
				})
			})
		}) : currentTemplate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => setSelectedId(null),
						className: "text-muted-foreground hover:text-foreground",
						children: "Close"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex rounded-lg border border-border bg-card/60 p-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setViewMode("edit"),
									className: `flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${viewMode === "edit" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-3.5 w-3.5" }), " Edit"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setViewMode("preview"),
									className: `flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium transition-colors cursor-pointer ${viewMode === "preview" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }), " Live Preview"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => handleDuplicate(currentTemplate),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "mr-1.5 h-3.5 w-3.5" }), " Duplicate"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => handleDelete(currentTemplate.id),
								className: "hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-1.5 h-3.5 w-3.5" }), " Delete"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								onClick: () => {
									toast.success("Template saved successfully!");
									setSelectedId(null);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-1.5 h-3.5 w-3.5" }), " Save Changes"]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-between rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br border ${CATEGORY_CONFIG[currentTemplate.category]?.color || CATEGORY_CONFIG.Outreach.color}`,
							children: (() => {
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CATEGORY_CONFIG[currentTemplate.category]?.icon || Mail, { className: "h-5 w-5" });
							})()
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-bold text-foreground",
							children: currentTemplate.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: currentTemplate.description
						})] })]
					})
				}),
				viewMode === "edit" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-6 lg:grid-cols-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs lg:col-span-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 gap-4 sm:grid-cols-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "sm:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "t-name",
										className: "text-xs font-medium text-muted-foreground",
										children: "Template Name *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "t-name",
										value: currentTemplate.name,
										onChange: (e) => updateCurrent({ name: e.target.value }),
										className: "mt-1 font-semibold",
										placeholder: "Template Name"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "t-cat",
									className: "text-xs font-medium text-muted-foreground",
									children: "Category *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									id: "t-cat",
									value: currentTemplate.category,
									onChange: (e) => updateCurrent({ category: e.target.value }),
									className: "mt-1 block w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Outreach",
											className: "bg-background text-foreground",
											children: "Outreach"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Interview",
											className: "bg-background text-foreground",
											children: "Interview"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Offer",
											className: "bg-background text-foreground",
											children: "Offer"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Rejection",
											className: "bg-background text-foreground",
											children: "Rejection"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Onboarding",
											className: "bg-background text-foreground",
											children: "Onboarding"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Assessment",
											className: "bg-background text-foreground",
											children: "Assessment"
										})
									]
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "t-desc",
								className: "text-xs font-medium text-muted-foreground",
								children: "Description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "t-desc",
								value: currentTemplate.description,
								onChange: (e) => updateCurrent({ description: e.target.value }),
								className: "mt-1",
								placeholder: "Brief overview of when this template is used..."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "t-subject",
								className: "text-xs font-medium text-muted-foreground",
								children: "Subject Line *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "t-subject",
								value: currentTemplate.subject,
								onChange: (e) => updateCurrent({ subject: e.target.value }),
								className: "mt-1",
								placeholder: "Subject line"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-medium text-muted-foreground",
									children: "Dynamic Merge Variables (click to insert into body)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground",
									children: "Replaced with candidate info"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 flex flex-wrap gap-1.5",
								children: MERGE_TAGS.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => handleInsertTag(tag.tag),
									className: "rounded-md border border-border/80 bg-accent/40 px-2 py-1 text-[11px] font-mono font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-primary/10 cursor-pointer",
									children: tag.tag
								}, tag.tag))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "t-body",
								className: "text-xs font-medium text-muted-foreground",
								children: "Email Body Content *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								ref: textareaRef,
								id: "t-body",
								value: currentTemplate.body,
								onChange: (e) => updateCurrent({ body: e.target.value }),
								className: "mt-1 min-h-[300px] font-mono text-sm leading-relaxed",
								placeholder: "Type your message here..."
							})] })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs lg:col-span-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-foreground font-semibold text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4 text-primary" }), " Candidate Preview"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "This is how the email appears with sample candidate placeholders resolved."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border/80 bg-background/60 p-4 text-xs space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-b border-border/40 pb-2 space-y-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-foreground",
												children: "From:"
											}), " OFC360 Talent <recruiting@ofc360.com>"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-muted-foreground",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-foreground",
												children: "To:"
											}), " Candidate Name <candidate@example.com>"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] font-medium text-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-muted-foreground",
													children: "Subject:"
												}),
												" ",
												resolvePreviewContent(currentTemplate).subject
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "whitespace-pre-line text-foreground/90 font-sans text-xs leading-relaxed max-h-[300px] overflow-y-auto",
									children: resolvePreviewContent(currentTemplate).body
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2 border-t border-border/40 space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-medium text-muted-foreground",
									children: "Test Dispatch"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: testEmailRecipient,
										onChange: (e) => setTestEmailRecipient(e.target.value),
										placeholder: "test@company.com",
										className: "text-xs h-8"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "outline",
										className: "h-8 shrink-0",
										onClick: handleSendTestEmail,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "mr-1 h-3 w-3" }), " Test"]
									})]
								})]
							})
						]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-8 backdrop-blur-xl shadow-xs max-w-3xl mx-auto space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "border-b border-border pb-4 space-y-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Simulated Candidate Inbox"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "Today at 09:41 AM"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xl font-bold text-foreground",
									children: resolvePreviewContent(currentTemplate).subject
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-xs text-muted-foreground pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-7 w-7 rounded-full bg-primary/20 text-primary grid place-items-center font-bold text-xs",
										children: "OF"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: "OFC360 Talent Acquisition"
										}),
										" ",
										"<recruiting@ofc360.com>"
									] })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "whitespace-pre-line text-sm text-foreground/90 leading-relaxed font-sans min-h-[200px]",
							children: resolvePreviewContent(currentTemplate).body
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-6 border-t border-border flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								onClick: () => setViewMode("edit"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "mr-1.5 h-4 w-4" }), " Back to Edit"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: handleSendTestEmail,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "mr-1.5 h-4 w-4" }), " Send Test Email"]
							})]
						})
					]
				})
			]
		})
	});
}
//#endregion
export { RecruitmentTemplatesPage };
