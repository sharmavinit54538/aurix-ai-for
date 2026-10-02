import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Jn as Eye, Q as Send, Sr as CircleCheck, Vt as Mail, or as Copy } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { n as useRecruitment } from "./useRecruitment-Cuznx8sx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CandidateCommunicationPage-BlCrgsQh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TEMPLATE_TYPES = [
	"Application Received",
	"Screening Result",
	"Interview Invitation",
	"Interview Reminder",
	"Offer Letter",
	"Rejection"
];
function CandidateCommunicationPage() {
	const { candidates, jobs } = useRecruitment();
	const [messages, setMessages] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") try {
			const saved = localStorage.getItem("aurix:comm_messages");
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed)) return parsed;
			}
		} catch {}
		return [];
	});
	const [activeTemplateType, setActiveTemplateType] = (0, import_react.useState)("");
	const [selectedChannel, setSelectedChannel] = (0, import_react.useState)("Email");
	const [selectedCandidateId, setSelectedCandidateId] = (0, import_react.useState)("");
	const [filterChannel, setFilterChannel] = (0, import_react.useState)("all");
	const [composerSubject, setComposerSubject] = (0, import_react.useState)("");
	const [composerBody, setComposerBody] = (0, import_react.useState)("");
	(0, import_react.useMemo)(() => {
		if ((!selectedCandidateId || !candidates.some((c) => c.id === selectedCandidateId)) && candidates.length > 0) setSelectedCandidateId(candidates[0].id);
	}, [candidates, selectedCandidateId]);
	const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId) || null;
	const selectedJob = selectedCandidate ? jobs.find((j) => j.id === selectedCandidate.jobId) || null : null;
	const handleTemplateSelect = (type) => {
		setActiveTemplateType(type);
		setComposerSubject("");
		setComposerBody("");
	};
	const candidateName = selectedCandidate?.name || "";
	const jobTitle = selectedJob?.title || selectedCandidate?.appliedPosition || "";
	const previewSubject = composerSubject.replace(/\{\{candidate_name\}\}/g, candidateName).replace(/\{\{job_title\}\}/g, jobTitle);
	const previewBody = composerBody.replace(/\{\{candidate_name\}\}/g, candidateName).replace(/\{\{job_title\}\}/g, jobTitle).replace(/\{\{interview_time\}\}/g, "").replace(/\{\{meeting_link\}\}/g, "");
	const handleSendMessage = () => {
		if (!selectedCandidate) {
			toast.error("Please select a candidate first.");
			return;
		}
		if (!composerBody.trim()) {
			toast.error("Please write a message body before sending.");
			return;
		}
		const updated = [{
			id: `msg-${Date.now()}`,
			recipientName: selectedCandidate.name || "",
			recipientContact: selectedChannel === "Email" ? selectedCandidate.email || "" : selectedCandidate.phone || "",
			templateType: activeTemplateType || "Custom",
			channel: selectedChannel,
			subject: previewSubject,
			body: previewBody,
			status: "Delivered",
			sentAt: (/* @__PURE__ */ new Date()).toLocaleString()
		}, ...messages];
		setMessages(updated);
		if (typeof window !== "undefined") localStorage.setItem("aurix:comm_messages", JSON.stringify(updated));
		toast.success(`Message dispatched via ${selectedChannel} to ${selectedCandidate.name}!`);
	};
	const filteredMessages = (0, import_react.useMemo)(() => {
		if (filterChannel === "all") return messages;
		return messages.filter((m) => m.channel === filterChannel);
	}, [messages, filterChannel]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-semibold text-sm flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 text-indigo-500" }), "Message Composer"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1",
						children: [
							"Email",
							"WhatsApp",
							"SMS"
						].map((ch) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setSelectedChannel(ch),
							className: `px-2.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${selectedChannel === ch ? "bg-foreground text-background border-foreground font-semibold" : "border-border text-muted-foreground hover:bg-accent"}`,
							children: ch
						}, ch))
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs",
							children: "Template Category"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-1.5 mt-1 sm:grid-cols-3",
							children: TEMPLATE_TYPES.map((type) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => handleTemplateSelect(type),
								className: `p-2 rounded-lg text-left border text-[11px] font-medium transition-colors cursor-pointer ${activeTemplateType === type ? "bg-indigo-500/15 text-indigo-600 border-indigo-500/40 dark:text-indigo-300" : "border-border bg-card hover:bg-accent"}`,
								children: type
							}, type))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs",
							children: "Recipient Candidate"
						}), candidates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 p-2 rounded-lg border border-dashed border-border text-xs text-muted-foreground bg-muted/20",
							children: "No candidates available in pipeline"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: selectedCandidateId,
							onValueChange: setSelectedCandidateId,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "mt-1 h-9 text-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select a candidate" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: candidates.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
								value: c.id,
								children: [c.name || "Unnamed", c.appliedPosition ? ` (${c.appliedPosition})` : ""]
							}, c.id)) })]
						})] }),
						selectedChannel === "Email" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs",
							children: "Subject Line"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1 h-9 text-xs font-mono",
							placeholder: "Enter subject line...",
							value: composerSubject,
							onChange: (e) => setComposerSubject(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs",
								children: "Message Body"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-muted-foreground font-mono",
								children: "Variables: {{candidate_name}}, {{job_title}}"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							className: "mt-1 text-xs font-mono",
							rows: 6,
							placeholder: "Write your message here...",
							value: composerBody,
							onChange: (e) => setComposerBody(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "pt-2 flex justify-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								disabled: !selectedCandidate || !composerBody.trim(),
								onClick: handleSendMessage,
								className: "bg-gradient-brand text-brand-foreground shadow-glow gap-1.5 text-xs disabled:opacity-50",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }),
									"Dispatch via ",
									selectedChannel
								]
							})
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl flex flex-col justify-between space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border pb-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs uppercase tracking-wider font-semibold text-muted-foreground flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }),
							"Live ",
							selectedChannel,
							" Preview"
						]
					}), selectedCandidate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "text-[10px]",
						children: ["To: ", selectedCandidate.name]
					})]
				}), !composerBody.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-card/20",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-8 w-8 text-muted-foreground/30 mb-2" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-muted-foreground",
							children: "No message to preview"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground/60 mt-1",
							children: "Start composing a message to see the live preview here."
						})
					]
				}) : selectedChannel === "Email" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 rounded-xl border border-border bg-background p-4 shadow-sm text-xs space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-b border-border pb-2 space-y-1",
						children: [selectedCandidate?.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "To: "
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-foreground",
							children: selectedCandidate.email
						})] }), previewSubject && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Subject: "
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-bold text-foreground",
							children: previewSubject
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-foreground whitespace-pre-line leading-relaxed",
						children: previewBody
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 max-w-sm mx-auto rounded-2xl border border-border bg-zinc-900 p-4 text-xs text-white space-y-3 shadow-lg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-zinc-800 pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-bold text-sm",
							children: [selectedChannel, " Preview"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							className: "text-[9px] bg-emerald-500/20 text-emerald-400",
							children: selectedChannel
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "bg-zinc-800/80 p-3 rounded-xl rounded-tl-none text-zinc-100 whitespace-pre-line leading-relaxed",
						children: previewBody
					})]
				})] }), composerBody.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-[11px] text-muted-foreground border-t border-border pt-2 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Variables resolved from selected candidate record." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						size: "sm",
						className: "h-6 text-[10px]",
						onClick: () => {
							navigator.clipboard.writeText(previewBody);
							toast.success("Preview copied to clipboard!");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3 mr-1" }), " Copy"]
					})]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-semibold text-sm text-foreground",
					children: "Communication Delivery History"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Messages sent to candidates across channels."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: filterChannel,
						onValueChange: setFilterChannel,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "h-8 text-xs w-[130px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Channels" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "all",
								children: "All Channels"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "Email",
								children: "Email"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "WhatsApp",
								children: "WhatsApp"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: "SMS",
								children: "SMS"
							})
						] })]
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "border-b border-border bg-muted/40 font-medium text-muted-foreground uppercase tracking-wider text-[10px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2.5",
								children: "Recipient"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2.5",
								children: "Template"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2.5",
								children: "Channel"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2.5",
								children: "Content Preview"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2.5",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2.5",
								children: "Dispatched At"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border",
						children: filteredMessages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							colSpan: 6,
							className: "px-4 py-8 text-center text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium text-xs",
								children: "No dispatched messages yet"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] mt-0.5 text-muted-foreground/80",
								children: "Use the composer above to send messages to candidates."
							})]
						}) }) : filteredMessages.map((msg) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-accent/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-semibold text-foreground",
										children: msg.recipientName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted-foreground",
										children: msg.recipientContact
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2.5 font-medium",
									children: msg.templateType
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "text-[10px]",
										children: msg.channel
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2.5 max-w-xs truncate text-muted-foreground",
									children: msg.body
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), msg.status]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2.5 text-muted-foreground font-mono text-[10px]",
									children: msg.sentAt
								})
							]
						}, msg.id))
					})]
				})
			})]
		})]
	});
}
//#endregion
export { CandidateCommunicationPage };
