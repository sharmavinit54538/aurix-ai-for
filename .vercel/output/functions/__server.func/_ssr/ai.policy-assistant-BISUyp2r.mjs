import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Q as Send, Tr as CircleAlert, ei as BookOpen, lt as RefreshCw, qt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { s as createSelector } from "../_libs/@reduxjs/toolkit+[...].mjs";
import { n as useAppSelector, t as useAppDispatch } from "./hooks-BpVIWXzj.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { N as fetchPolicyAssistantDashboard, l as askPolicyQuestion } from "./auth-bootstrap-CR9kF6gO.mjs";
import { t as AIHero } from "./AIModule-BcIdRN9Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.policy-assistant-BISUyp2r.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var selectPolicyAssistantState = (state) => state.policyAssistant;
var selectPolicyAssistantLoading = createSelector([selectPolicyAssistantState], (state) => state?.loading ?? false);
var selectPolicyAssistantAsking = createSelector([selectPolicyAssistantState], (state) => state?.asking ?? false);
var selectPolicyAssistantError = createSelector([selectPolicyAssistantState], (state) => state?.error ?? null);
var selectPolicyAssistantMessages = createSelector([selectPolicyAssistantState], (state) => Array.isArray(state?.messages) ? state.messages : []);
var selectPolicyAssistantSummary = createSelector([selectPolicyAssistantState], (state) => state?.summary ?? null);
function Page() {
	const dispatch = useAppDispatch();
	const loading = useAppSelector(selectPolicyAssistantLoading);
	const asking = useAppSelector(selectPolicyAssistantAsking);
	const error = useAppSelector(selectPolicyAssistantError);
	const msgs = useAppSelector(selectPolicyAssistantMessages);
	const summary = useAppSelector(selectPolicyAssistantSummary);
	const [input, setInput] = (0, import_react.useState)("");
	const messagesEndRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		dispatch(fetchPolicyAssistantDashboard());
	}, [dispatch]);
	(0, import_react.useEffect)(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [msgs, asking]);
	function ask(q) {
		if (!q.trim() || asking) return;
		dispatch(askPolicyQuestion(q.trim()));
		setInput("");
	}
	if (loading && (!msgs || msgs.length === 0) && !summary) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-36 w-full rounded-3xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-[520px] rounded-2xl lg:col-span-2" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-[520px] rounded-2xl" })]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIHero, {
			icon: BookOpen,
			eyebrow: "AI Policy Assistant",
			title: "Your company knowledge base, on tap",
			description: "Ask questions about HR, leave, attendance, payroll and policy — get instant, sourced answers.",
			lastAnalysis: summary?.lastAnalysis ?? "Live Knowledge Base"
		}),
		error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-xs text-destructive",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				onClick: () => dispatch(fetchPolicyAssistantDashboard()),
				className: "gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3 w-3" }), " Retry"]
			})]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-[520px] flex-col rounded-2xl border border-border bg-card/60 backdrop-blur-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 space-y-3 overflow-y-auto p-5",
				children: [
					msgs.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `flex ${m.role === "user" ? "justify-end" : "justify-start"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-foreground text-background" : "bg-accent text-foreground"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: m.text }), m.sources && m.sources.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex flex-wrap gap-1 border-t border-border/40 pt-1 text-[11px] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: "Sources:"
								}), m.sources.map((s, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded bg-background/50 px-1 py-0.5",
									children: s
								}, idx))]
							})]
						})
					}, i)),
					asking && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex justify-start",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 rounded-2xl bg-accent px-4 py-2.5 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Searching company policies…" })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: messagesEndRef })
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					ask(input);
				},
				className: "flex items-center gap-2 border-t border-border p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: input,
					disabled: asking,
					onChange: (e) => setInput(e.target.value),
					placeholder: "Ask about leave, payroll, HR policy…"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					disabled: asking || !input.trim(),
					className: "gap-1.5",
					children: [asking ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }), "Send"]
				})]
			})]
		})
	] });
}
//#endregion
export { Page as component };
