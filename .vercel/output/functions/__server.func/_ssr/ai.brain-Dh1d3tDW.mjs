import { o as __toESM } from "../_runtime.mjs";
import { n as DefaultChatTransport, o as require_react, t as useChat } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { An as Gauge, B as Square, Dr as ChevronRight, H as Sparkles, Ir as ChartColumn, Jr as Briefcase, Ln as FileText, P as Target, Q as Send, Sr as CircleCheck, T as TriangleAlert, Vt as Mail, Yr as Brain, ei as BookOpen, f as Video, h as User, kr as ChevronDown, nn as Library, o as Wrench, p as Users, q as ShieldCheck, qt as LoaderCircle, ri as Banknote, rr as Crown, s as Workflow, st as RotateCcw } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { l as getTokens } from "./apiInstance-C5A0vaLH.mjs";
import { n as AGENT_LIST, t as AGENTS } from "./auth-bootstrap-CR9kF6gO.mjs";
import { t as ScrollArea } from "./scroll-area-BlnbM3_c.mjs";
import { n as AnimatePresence, t as motion } from "../_libs/framer-motion.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { t as AIHero } from "./AIModule-BcIdRN9Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.brain-Dh1d3tDW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ICONS = {
	Brain,
	Briefcase,
	Video,
	User,
	Users,
	Gauge,
	AlertTriangle: TriangleAlert,
	Target,
	Banknote,
	ShieldCheck,
	BookOpen,
	Mail,
	FileText,
	BarChart3: ChartColumn,
	Workflow,
	Library,
	Crown
};
var MODELS = [
	{
		id: "google/gemini-3-flash-preview",
		label: "Gemini 3 Flash · fast"
	},
	{
		id: "google/gemini-2.5-flash",
		label: "Gemini 2.5 Flash"
	},
	{
		id: "google/gemini-2.5-pro",
		label: "Gemini 2.5 Pro · reasoning"
	},
	{
		id: "openai/gpt-5-mini",
		label: "GPT-5 mini"
	},
	{
		id: "openai/gpt-5",
		label: "GPT-5 · premium"
	}
];
function BrainPage() {
	const [agentId, setAgentId] = (0, import_react.useState)("router");
	const [model, setModel] = (0, import_react.useState)(MODELS[0].id);
	const [input, setInput] = (0, import_react.useState)("");
	const inputRef = (0, import_react.useRef)(null);
	const agent = AGENTS[agentId];
	const transport = (0, import_react.useMemo)(() => new DefaultChatTransport({
		api: "/api/ai-brain",
		body: {
			agentId,
			model
		},
		headers: () => {
			const tokens = getTokens();
			const headers = {};
			if (tokens?.accessToken) headers.Authorization = `Bearer ${tokens.accessToken}`;
			return headers;
		}
	}), [agentId, model]);
	const { messages, sendMessage, status, stop, setMessages } = useChat({
		id: `brain:${agentId}:${model}`,
		transport,
		onError: (err) => console.error("[AI Brain]", err)
	});
	const isBusy = status === "submitted" || status === "streaming";
	const endRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		endRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, status]);
	(0, import_react.useEffect)(() => {
		inputRef.current?.focus();
	}, [agentId, status]);
	function submit(text) {
		const trimmed = text.trim();
		if (!trimmed || isBusy) return;
		sendMessage({ text: trimmed });
		setInput("");
	}
	function clear() {
		setMessages([]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIHero, {
		icon: Brain,
		eyebrow: "AI Insight 2.0",
		title: "Autonomous HR Brain",
		description: "A multi-agent system that screens, predicts, drafts and recommends across every HR workflow — with human approval gates on anything sensitive.",
		lastAnalysis: "Live"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "space-y-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-3 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
					children: "Specialist agents"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "max-h-[480px] space-y-1 overflow-y-auto pr-1",
					children: AGENT_LIST.map((a) => {
						const Icon = ICONS[a.icon] ?? Brain;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setAgentId(a.id),
							className: `group flex w-full items-start gap-2.5 rounded-xl border p-2.5 text-left transition-all ${a.id === agentId ? "border-foreground/30 bg-accent shadow-glow" : "border-transparent hover:border-border hover:bg-accent/50"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${a.accent} text-foreground`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-1.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate text-[13px] font-semibold tracking-tight",
										children: a.name
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "line-clamp-2 text-[11px] text-muted-foreground",
									children: a.tagline
								})]
							})]
						}, a.id);
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Model"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: model,
						onValueChange: setModel,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: MODELS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: m.id,
							children: m.label
						}, m.id)) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-[11px] leading-relaxed text-muted-foreground",
						children: "Streamed via the Aurix AI Gateway. Switch models any time — the next message uses the new one."
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "flex h-[640px] flex-col rounded-2xl border border-border bg-card/60 backdrop-blur-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex items-center justify-between gap-2 border-b border-border px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgentBadge, { agent }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm font-semibold tracking-tight",
							children: agent.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] text-muted-foreground",
							children: agent.tagline
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [isBusy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => stop(),
							className: "gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "h-3 w-3" }), " Stop"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: clear,
							className: "gap-1.5 text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3 w-3" }), " New"]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
					className: "flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 p-5",
						children: [
							messages.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
								agent,
								onPick: submit
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatePresence, {
								initial: false,
								children: messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageBubble, {
									message: m,
									agent
								}, m.id))
							}),
							status === "submitted" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThinkingBubble, { agent }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: endRef })
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						submit(input);
					},
					className: "border-t border-border p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end gap-2 rounded-xl border border-border bg-background p-2 focus-within:border-foreground/30",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							ref: inputRef,
							value: input,
							onChange: (e) => setInput(e.target.value),
							onKeyDown: (e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									submit(input);
								}
							},
							placeholder: `Ask ${agent.name}…  (Shift+Enter for newline)`,
							rows: 1,
							className: "min-h-[40px] flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm shadow-none focus-visible:ring-0"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							disabled: !input.trim() || isBusy,
							className: "h-9 gap-1.5 bg-gradient-brand text-brand-foreground hover:opacity-90",
							children: [isBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }), "Send"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 px-1 text-[11px] text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-1 inline h-3 w-3" }),
							"Actions that mutate data, send communication or affect compensation are returned as ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: "Proposed actions" }),
							" for human approval."
						]
					})]
				})
			]
		})]
	})] });
}
function AgentBadge({ agent }) {
	const Icon = ICONS[agent.icon] ?? Brain;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br ${agent.accent} text-foreground shadow-glow`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
	});
}
function EmptyState({ agent, onPick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid place-items-center py-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgentBadge, { agent }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "mt-3 font-display text-lg font-semibold tracking-tight",
				children: ["Talk to the ", agent.name]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-md text-sm text-muted-foreground",
				children: agent.tagline
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid w-full max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2",
				children: agent.suggestions.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => onPick(s),
					className: "rounded-xl border border-border bg-card/60 p-3 text-left text-xs text-foreground transition-all hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-glow",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mb-1.5 h-3 w-3 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "leading-relaxed",
						children: s
					})]
				}, s))
			})
		]
	});
}
function ThinkingBubble({ agent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgentBadge, { agent }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-2xl bg-accent px-4 py-2.5 text-sm text-muted-foreground",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }),
					agent.name,
					" is thinking…"
				]
			})
		})]
	});
}
function MessageBubble({ message, agent }) {
	const isUser = message.role === "user";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(motion.div, {
		initial: {
			opacity: 0,
			y: 6
		},
		animate: {
			opacity: 1,
			y: 0
		},
		transition: { duration: .18 },
		className: `flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`,
		children: [
			!isUser && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AgentBadge, { agent }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `max-w-[78%] space-y-2 ${isUser ? "items-end" : "items-start"}`,
				children: message.parts.map((part, idx) => {
					if (part.type === "text") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${isUser ? "bg-foreground text-background" : "bg-accent text-foreground"}`,
						children: part.text
					}, idx);
					if (part.type.startsWith("tool-")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToolCard, { part }, idx);
					return null;
				})
			}),
			isUser && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-9 w-9 place-items-center rounded-xl bg-foreground text-background",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" })
			})
		]
	});
}
function ToolCard({ part }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const toolName = part.toolName ?? part.type.replace(/^tool-/, "");
	const done = part.state === "output-available" || part.state === "result";
	const failed = part.state === "output-error" || !!part.errorText;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-xl border border-border bg-background/60",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen((v) => !v),
			className: "flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex min-w-0 items-center gap-2",
				children: [
					failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5 text-amber-500" }) : done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5 text-emerald-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-3 w-3 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
							className: "truncate font-mono text-[12px] text-foreground",
							children: toolName
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						className: "ml-1 text-[10px]",
						children: failed ? "error" : done ? "done" : "running"
					})
				]
			}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5 text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5 text-muted-foreground" })]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2 border-t border-border bg-muted/30 p-3",
			children: [
				part.input !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
					children: "Input"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "overflow-x-auto rounded-md bg-background p-2 text-[11px] leading-snug",
					children: safeStringify(part.input)
				})] }),
				part.output !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
					children: "Output"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "overflow-x-auto rounded-md bg-background p-2 text-[11px] leading-snug",
					children: safeStringify(part.output)
				})] }),
				part.errorText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-md bg-destructive/10 p-2 text-[11px] text-destructive",
					children: part.errorText
				})
			]
		})]
	});
}
function safeStringify(value) {
	try {
		return JSON.stringify(value, null, 2);
	} catch {
		return String(value);
	}
}
//#endregion
export { BrainPage as component };
