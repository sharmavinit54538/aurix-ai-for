import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Ar as Check, H as Sparkles, Ir as ChartColumn, It as MessageSquare, Ln as FileText, M as ThumbsUp, N as ThumbsDown, Q as Send, Tr as CircleAlert, Wr as CalendarClock, ht as Plus, k as Trash2, lt as RefreshCw, mn as History, qt as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { s as createSelector } from "../_libs/@reduxjs/toolkit+[...].mjs";
import { n as useAppSelector, t as useAppDispatch } from "./hooks-BpVIWXzj.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as fetchChatConversations, J as sendChatMessage, S as fetchChatConversation, Y as setActiveConversation, _ as deleteChatConversation, d as clearOperationStatus$1, p as createChatConversation, s as aiHubApi } from "./auth-bootstrap-CR9kF6gO.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { S as Tooltip, c as YAxis, f as CartesianGrid, l as XAxis, o as BarChart, p as Bar, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { n as useRecruitment, t as newId } from "./useRecruitment-Cuznx8sx.mjs";
import { t as AIHero } from "./AIModule-BcIdRN9Q.mjs";
import { t as Markdown } from "../_libs/react-markdown+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ChatAssistantPage-DmgU3aNg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var THEMES = {
	light: "",
	dark: ".dark"
};
var ChartContext = import_react.createContext(null);
function useChart() {
	const context = import_react.useContext(ChartContext);
	if (!context) throw new Error("useChart must be used within a <ChartContainer />");
	return context;
}
var ChartContainer = import_react.forwardRef(({ id, className, children, config, ...props }, ref) => {
	const uniqueId = import_react.useId();
	const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartContext.Provider, {
		value: { config },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			"data-chart": chartId,
			ref,
			className: cn("flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-none [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-sector]:outline-none [&_.recharts-surface]:outline-none", className),
			...props,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartStyle, {
				id: chartId,
				config
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children })]
		})
	});
});
ChartContainer.displayName = "Chart";
var ChartStyle = ({ id, config }) => {
	const colorConfig = Object.entries(config).filter(([, config]) => config.theme || config.color);
	if (!colorConfig.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { dangerouslySetInnerHTML: { __html: Object.entries(THEMES).map(([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig.map(([key, itemConfig]) => {
		const color = itemConfig.theme?.[theme] || itemConfig.color;
		return color ? `  --color-${key}: ${color};` : null;
	}).join("\n")}
}
`).join("\n") } });
};
var ChartTooltip = Tooltip;
var ChartTooltipContent = import_react.forwardRef(({ active, payload, className, indicator = "dot", hideLabel = false, hideIndicator = false, label, labelFormatter, labelClassName, formatter, color, nameKey, labelKey }, ref) => {
	const { config } = useChart();
	const tooltipLabel = import_react.useMemo(() => {
		if (hideLabel || !payload?.length) return null;
		const [item] = payload;
		const itemConfig = getPayloadConfigFromPayload(config, item, `${labelKey || item?.dataKey || item?.name || "value"}`);
		const value = !labelKey && typeof label === "string" ? config[label]?.label || label : itemConfig?.label;
		if (labelFormatter) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("font-medium", labelClassName),
			children: labelFormatter(value, payload)
		});
		if (!value) return null;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("font-medium", labelClassName),
			children: value
		});
	}, [
		label,
		labelFormatter,
		payload,
		hideLabel,
		labelClassName,
		config,
		labelKey
	]);
	if (!active || !payload?.length) return null;
	const nestLabel = payload.length === 1 && indicator !== "dot";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: cn("grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl", className),
		children: [!nestLabel ? tooltipLabel : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-1.5",
			children: payload.filter((item) => item.type !== "none").map((item, index) => {
				const itemConfig = getPayloadConfigFromPayload(config, item, `${nameKey || item.name || item.dataKey || "value"}`);
				const indicatorColor = color || item.payload.fill || item.color;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground", indicator === "dot" && "items-center"),
					children: formatter && item?.value !== void 0 && item.name ? formatter(item.value, item.name, item, index, item.payload) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [itemConfig?.icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(itemConfig.icon, {}) : !hideIndicator && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)", {
							"h-2.5 w-2.5": indicator === "dot",
							"w-1": indicator === "line",
							"w-0 border-[1.5px] border-dashed bg-transparent": indicator === "dashed",
							"my-0.5": nestLabel && indicator === "dashed"
						}),
						style: {
							"--color-bg": indicatorColor,
							"--color-border": indicatorColor
						}
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("flex flex-1 justify-between leading-none", nestLabel ? "items-end" : "items-center"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-1.5",
							children: [nestLabel ? tooltipLabel : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: itemConfig?.label || item.name
							})]
						}), item.value && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono font-medium tabular-nums text-foreground",
							children: item.value.toLocaleString()
						})]
					})] })
				}, item.dataKey);
			})
		})]
	});
});
ChartTooltipContent.displayName = "ChartTooltip";
var ChartLegendContent = import_react.forwardRef(({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
	const { config } = useChart();
	if (!payload?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		className: cn("flex items-center justify-center gap-4", verticalAlign === "top" ? "pb-3" : "pt-3", className),
		children: payload.filter((item) => item.type !== "none").map((item) => {
			const itemConfig = getPayloadConfigFromPayload(config, item, `${nameKey || item.dataKey || "value"}`);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"),
				children: [itemConfig?.icon && !hideIcon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(itemConfig.icon, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-2 w-2 shrink-0 rounded-[2px]",
					style: { backgroundColor: item.color }
				}), itemConfig?.label]
			}, item.value);
		})
	});
});
ChartLegendContent.displayName = "ChartLegend";
function getPayloadConfigFromPayload(config, payload, key) {
	if (typeof payload !== "object" || payload === null) return;
	const payloadPayload = "payload" in payload && typeof payload.payload === "object" && payload.payload !== null ? payload.payload : void 0;
	let configLabelKey = key;
	if (key in payload && typeof payload[key] === "string") configLabelKey = payload[key];
	else if (payloadPayload && key in payloadPayload && typeof payloadPayload[key] === "string") configLabelKey = payloadPayload[key];
	return configLabelKey in config ? config[configLabelKey] : config[key];
}
var selectAIHubState = (state) => state.aiHub;
createSelector([selectAIHubState], (state) => state.overview);
createSelector([selectAIHubState], (state) => state.overview.data);
createSelector([selectAIHubState], (state) => state.overview.loading);
createSelector([selectAIHubState], (state) => state.overview.error);
createSelector([selectAIHubState], (state) => state.agents);
createSelector([selectAIHubState], (state) => state.agents.data ?? []);
createSelector([selectAIHubState], (state) => state.agents.loading);
createSelector([selectAIHubState], (state) => state.selectedAgent);
createSelector([selectAIHubState], (state) => state.agentDetails);
createSelector([selectAIHubState], (state) => state.agentHistory);
createSelector([selectAIHubState], (state) => state.agentStatus);
createSelector([selectAIHubState], (state) => state.workforceInsights);
createSelector([selectAIHubState], (state) => state.recruiter);
createSelector([selectAIHubState], (state) => state.attendanceMonitor);
createSelector([selectAIHubState], (state) => state.leaveAssistant);
createSelector([selectAIHubState], (state) => state.performanceCoach);
createSelector([selectAIHubState], (state) => state.payrollInsights);
createSelector([selectAIHubState], (state) => state.workforcePlanning);
createSelector([selectAIHubState], (state) => state.employeeHealth);
createSelector([selectAIHubState], (state) => state.policyAssistant);
createSelector([selectAIHubState], (state) => state.documentGenerator);
createSelector([selectAIHubState], (state) => state.meetingIntelligence);
createSelector([selectAIHubState], (state) => state.complianceMonitor);
var selectChatAssistant = createSelector([selectAIHubState], (state) => state.chatAssistant);
createSelector([selectAIHubState], (state) => state.analyticsCenter);
var selectAIHubOperationLoading = (opKey) => (state) => Boolean(state.aiHub?.operationLoading?.[opKey]);
var selectAIHubOperationError = (opKey) => (state) => state.aiHub?.operationErrors?.[opKey] ?? null;
var COMMAND_SUGGESTIONS = [
	{
		label: "Search candidate",
		cmd: "Search candidate"
	},
	{
		label: "Active job postings",
		cmd: "List active job openings"
	},
	{
		label: "Show onboarding progress",
		cmd: "Show employee onboarding progress"
	},
	{
		label: "Show pending HR tasks",
		cmd: "Show pending HR tasks and approvals"
	},
	{
		label: "Payroll & attendance summary",
		cmd: "Show monthly payroll and attendance summary"
	}
];
var SESSION_KEY = "lastActiveChatConversationId";
var WELCOME_MESSAGE = {
	id: "m-welcome",
	conversationId: void 0,
	sender: "assistant",
	role: "ai",
	content: "Hi 👋 I am Aurix AI, your central OFC360 workforce copilot. You can ask questions about your workforce or issue text commands to search candidates, inspect job postings, review scheduled interviews, structure offers, and monitor payroll records.",
	timestamp: (/* @__PURE__ */ new Date()).toISOString()
};
function ChatChartRenderer({ chart }) {
	if (!chart.data || chart.data.length === 0) return null;
	const sample = chart.data[0];
	const keys = Object.keys(sample);
	const xKey = keys.find((k) => typeof sample[k] === "string") || keys[0] || "name";
	const yKey = keys.find((k) => k !== xKey && typeof sample[k] === "number") || keys.find((k) => k !== xKey) || "value";
	const chartConfig = { [yKey]: {
		label: chart.title || "Metric",
		color: "hsl(var(--primary))"
	} };
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 rounded-xl border border-border bg-background/80 p-3 shadow-sm",
		children: [chart.title && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-3.5 w-3.5 text-primary" }), chart.title]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-44 w-full",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartContainer, {
				config: chartConfig,
				className: "h-full w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
					data: chart.data,
					margin: {
						top: 10,
						right: 10,
						left: -20,
						bottom: 0
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							strokeDasharray: "3 3",
							vertical: false,
							stroke: "hsl(var(--border))"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: xKey,
							tickLine: false,
							axisLine: false,
							tickMargin: 8,
							tick: { fontSize: 10 }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							tickLine: false,
							axisLine: false,
							tickMargin: 8,
							tick: { fontSize: 10 }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltipContent, {}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: yKey,
							fill: "var(--color-primary, #6366f1)",
							radius: [
								4,
								4,
								0,
								0
							]
						})
					]
				})
			})
		})]
	});
}
function ChatAssistantPage() {
	const dispatch = useAppDispatch();
	const { moveStage, upsertInterview, upsertOffer, upsertJob } = useRecruitment();
	const isSending = useAppSelector(selectAIHubOperationLoading("sendChatMessage"));
	const sendError = useAppSelector(selectAIHubOperationError("sendChatMessage"));
	const chatAssistantSection = useAppSelector(selectChatAssistant);
	const [msgs, setMsgs] = (0, import_react.useState)([WELCOME_MESSAGE]);
	const [input, setInput] = (0, import_react.useState)("");
	const [currentConversationId, setCurrentConversationId] = (0, import_react.useState)(null);
	const [lastQuery, setLastQuery] = (0, import_react.useState)("");
	const [failedMessageIds, setFailedMessageIds] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [executedActionMessageIds, setExecutedActionMessageIds] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [feedbackMap, setFeedbackMap] = (0, import_react.useState)({});
	const [suggestions, setSuggestions] = (0, import_react.useState)(COMMAND_SUGGESTIONS);
	const [confirmModal, setConfirmModal] = (0, import_react.useState)(null);
	const [isConfirmingAction, setIsConfirmingAction] = (0, import_react.useState)(false);
	const [activityHistory, setActivityHistory] = (0, import_react.useState)(["Aurix AI initialized session"]);
	const bottomRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let mounted = true;
		aiHubApi.getChatSuggestions().then((res) => {
			if (mounted && res && res.length > 0) setSuggestions(res);
		}).catch(() => {});
		return () => {
			mounted = false;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		dispatch(fetchChatConversations());
	}, [dispatch]);
	(0, import_react.useEffect)(() => {
		const savedId = sessionStorage.getItem(SESSION_KEY);
		if (savedId && !currentConversationId) {
			setCurrentConversationId(savedId);
			dispatch(fetchChatConversation(savedId)).then((res) => {
				if (fetchChatConversation.fulfilled.match(res)) {
					if (res.payload.messages && res.payload.messages.length > 0) setMsgs(res.payload.messages);
				}
			});
		}
	}, [dispatch, currentConversationId]);
	(0, import_react.useEffect)(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [
		msgs,
		isSending,
		sendError
	]);
	const handleSelectConversation = (0, import_react.useCallback)(async (convId) => {
		if (convId === currentConversationId) return;
		setCurrentConversationId(convId);
		sessionStorage.setItem(SESSION_KEY, convId);
		dispatch(setActiveConversation(convId));
		dispatch(clearOperationStatus$1("sendChatMessage"));
		setFailedMessageIds(/* @__PURE__ */ new Set());
		const res = await dispatch(fetchChatConversation(convId));
		if (fetchChatConversation.fulfilled.match(res)) if (res.payload.messages && res.payload.messages.length > 0) setMsgs(res.payload.messages);
		else setMsgs([WELCOME_MESSAGE]);
	}, [currentConversationId, dispatch]);
	const handleNewChat = (0, import_react.useCallback)(() => {
		setCurrentConversationId(null);
		sessionStorage.removeItem(SESSION_KEY);
		dispatch(setActiveConversation(null));
		dispatch(clearOperationStatus$1("sendChatMessage"));
		setMsgs([WELCOME_MESSAGE]);
		setFailedMessageIds(/* @__PURE__ */ new Set());
		setInput("");
	}, [dispatch]);
	const handleDeleteConversation = (0, import_react.useCallback)(async (convId, e) => {
		e.stopPropagation();
		const res = await dispatch(deleteChatConversation(convId));
		if (deleteChatConversation.fulfilled.match(res)) {
			toast.success("Conversation deleted.");
			if (currentConversationId === convId) handleNewChat();
		} else toast.error("Failed to delete conversation.");
	}, [
		currentConversationId,
		dispatch,
		handleNewChat
	]);
	const handleExecuteCommand = (0, import_react.useCallback)(async (q, retryOptions) => {
		const trimmed = q.trim();
		if (!trimmed || isSending) return;
		setLastQuery(trimmed);
		dispatch(clearOperationStatus$1("sendChatMessage"));
		let userMsgId = retryOptions?.messageId;
		if (!userMsgId) {
			const newMsg = {
				id: `u-${Date.now()}`,
				conversationId: currentConversationId || void 0,
				sender: "user",
				role: "user",
				content: trimmed,
				timestamp: (/* @__PURE__ */ new Date()).toISOString()
			};
			userMsgId = newMsg.id;
			setMsgs((prev) => [...prev, newMsg]);
			setInput("");
		} else setFailedMessageIds((prev) => {
			const next = new Set(prev);
			next.delete(userMsgId);
			return next;
		});
		try {
			let convId = currentConversationId;
			if (!convId) {
				const createAction = await dispatch(createChatConversation({
					title: trimmed.slice(0, 40) || "Workforce Copilot Chat",
					agentId: "general-copilot"
				}));
				if (createChatConversation.fulfilled.match(createAction)) {
					convId = createAction.payload.id;
					setCurrentConversationId(convId);
					sessionStorage.setItem(SESSION_KEY, convId);
				} else {
					const errMsg = createAction.payload || "Failed to create chat conversation with the backend.";
					toast.error(errMsg);
					setFailedMessageIds((prev) => new Set(prev).add(userMsgId));
					return;
				}
			}
			const sendAction = await dispatch(sendChatMessage({
				conversationId: convId,
				content: trimmed,
				agentId: "general-copilot"
			}));
			if (sendChatMessage.fulfilled.match(sendAction)) {
				const aiMsg = sendAction.payload;
				setMsgs((prev) => [...prev, aiMsg]);
				if (aiMsg.actionRequired) setActivityHistory((p) => [`AI proposed action: ${aiMsg.actionRequired.actionName}`, ...p]);
				else setActivityHistory((p) => [`Processed: ${trimmed.slice(0, 30)}${trimmed.length > 30 ? "…" : ""}`, ...p]);
			} else if (sendChatMessage.rejected.match(sendAction)) {
				const errMsg = sendAction.payload || "Failed to receive response from AI backend";
				toast.error(errMsg);
				setFailedMessageIds((prev) => new Set(prev).add(userMsgId));
			}
		} catch (err) {
			const msg = err instanceof Error ? err.message : "An unexpected error occurred while communicating with the AI service.";
			toast.error(msg);
			setFailedMessageIds((prev) => new Set(prev).add(userMsgId));
		}
	}, [
		currentConversationId,
		dispatch,
		isSending
	]);
	const handleRetry = (0, import_react.useCallback)(() => {
		const lastUserMsg = [...msgs].reverse().find((m) => m.role === "user" || m.sender === "user");
		if (lastUserMsg) handleExecuteCommand(lastUserMsg.content, { messageId: lastUserMsg.id });
		else if (lastQuery) handleExecuteCommand(lastQuery);
	}, [
		handleExecuteCommand,
		lastQuery,
		msgs
	]);
	const handleFeedback = (0, import_react.useCallback)(async (messageId, rating) => {
		setFeedbackMap((prev) => ({
			...prev,
			[messageId]: rating
		}));
		try {
			await aiHubApi.sendChatFeedback({
				messageId,
				conversationId: currentConversationId || void 0,
				rating
			});
			toast.success(rating === "up" ? "Thanks for your feedback!" : "Feedback recorded. We'll improve.");
		} catch {}
	}, [currentConversationId]);
	const handleConfirmAction = async () => {
		if (!confirmModal) return;
		const { action, messageId } = confirmModal;
		const actionNameLower = (action.actionName || "").toLowerCase();
		const payload = action.payload || {};
		setIsConfirmingAction(true);
		try {
			if (actionNameLower.includes("shortlist") || actionNameLower.includes("move") || actionNameLower.includes("stage")) {
				const candidateId = String(payload.candidateId || payload.id || "");
				const stage = payload.stage;
				if (!candidateId || !stage) {
					toast.error("Action validation failed: Candidate ID and target Stage are required.");
					return;
				}
				await moveStage(candidateId, stage);
				toast.success(`Action Executed: Candidate moved to ${stage} stage.`);
			} else if (actionNameLower.includes("interview")) {
				const interviewData = payload.interview && typeof payload.interview === "object" ? payload.interview : payload;
				const candidateId = interviewData.candidateId;
				const candidateName = interviewData.candidateName;
				const interviewer = interviewData.interviewer;
				const round = interviewData.round;
				const time = interviewData.time || interviewData.date;
				if (!candidateId || !candidateName || !interviewer || !round || !time) {
					toast.error("Action validation failed: Candidate ID, Candidate Name, Interviewer, Round, and Date/Time are required in the payload.");
					return;
				}
				await upsertInterview({
					id: String(interviewData.id || newId()),
					candidateId,
					candidateName,
					jobTitle: String(interviewData.jobTitle || "Open Role"),
					interviewer,
					round,
					date: new Date(time).toISOString(),
					durationMins: Number(interviewData.durationMins || 45),
					meetingLink: String(interviewData.meetingLink || ""),
					status: "scheduled"
				});
				toast.success(`Action Executed: Interview scheduled for ${candidateName}.`);
			} else if (actionNameLower.includes("offer")) {
				const offerData = payload.offer && typeof payload.offer === "object" ? payload.offer : payload;
				const candidateId = offerData.candidateId;
				const candidateName = offerData.candidateName;
				const role = offerData.role || offerData.jobTitle;
				const salary = offerData.salary ?? offerData.ctc;
				const joiningDate = offerData.joiningDate;
				if (!candidateId || !candidateName || !role || salary == null || !joiningDate) {
					toast.error("Action validation failed: Candidate ID, Candidate Name, Role, Salary/CTC, and Joining Date are required.");
					return;
				}
				await upsertOffer({
					id: String(offerData.id || newId()),
					candidateId,
					candidateName,
					jobId: String(offerData.jobId || newId()),
					jobTitle: role,
					salary: typeof salary === "number" ? salary : Number(String(salary).replace(/[^0-9.]/g, "")),
					currency: String(offerData.currency || "INR"),
					joiningDate,
					benefits: Array.isArray(offerData.benefits) ? offerData.benefits : [],
					status: "draft",
					approvals: []
				});
				toast.success(`Action Executed: Offer draft structured for ${candidateName}.`);
			} else if (actionNameLower.includes("job")) {
				const jobData = payload.job && typeof payload.job === "object" ? payload.job : payload;
				const title = jobData.title;
				const department = jobData.department;
				if (!title || !department) {
					toast.error("Action validation failed: Job Title and Department are required.");
					return;
				}
				await upsertJob({
					id: String(jobData.id || newId()),
					title,
					department,
					employmentType: jobData.employmentType || "Full-time",
					experience: String(jobData.experience || "Mid"),
					skills: Array.isArray(jobData.skills) ? jobData.skills : [],
					salaryMin: Number(jobData.salaryMin || 0),
					salaryMax: Number(jobData.salaryMax || 0),
					currency: String(jobData.currency || "INR"),
					vacancies: Number(jobData.vacancies || 1),
					location: String(jobData.location || "Remote"),
					workMode: jobData.workMode || "Remote",
					description: String(jobData.description || ""),
					responsibilities: Array.isArray(jobData.responsibilities) ? jobData.responsibilities : [],
					requirements: Array.isArray(jobData.requirements) ? jobData.requirements : [],
					benefits: Array.isArray(jobData.benefits) ? jobData.benefits : [],
					hiringManager: String(jobData.hiringManager || ""),
					recruiter: String(jobData.recruiter || ""),
					status: "active",
					publishedAt: (/* @__PURE__ */ new Date()).toISOString(),
					closingAt: new Date(Date.now() + 30 * 864e5).toISOString(),
					applicants: 0
				});
				toast.success(`Action Executed: Job requisition updated successfully.`);
			} else {
				toast.info(`${action.actionName}: Autonomous direct agent execution for this module domain is coming soon. Please manage this record in its respective module.`);
				return;
			}
			if (messageId) setExecutedActionMessageIds((prev) => new Set(prev).add(messageId));
			const sysMsg = {
				id: `sys-${Date.now()}`,
				conversationId: currentConversationId || void 0,
				sender: "system",
				role: "system",
				content: `Action executed: ${action.actionName}`,
				timestamp: (/* @__PURE__ */ new Date()).toISOString()
			};
			setMsgs((prev) => [...prev, sysMsg]);
			setActivityHistory((prev) => [`Executed: ${action.actionName}`, ...prev]);
		} catch (err) {
			const msg = err instanceof Error ? err.message : `Failed to execute ${action.actionName}`;
			toast.error(msg);
		} finally {
			setIsConfirmingAction(false);
			setConfirmModal(null);
		}
	};
	const conversations = chatAssistantSection?.data?.conversations || [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AIHero, {
				icon: MessageSquare,
				eyebrow: "Central People AI Agent",
				title: "Command your entire workforce with natural language",
				description: "Search candidates, shortlist applicants, draft offer letters, trigger onboardings, and inspect payroll through an intelligent central conversational interface backed by live LLM inference.",
				lastAnalysis: "Active & Connected"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs font-semibold text-muted-foreground flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 text-indigo-400" }), " Quick Commands:"]
				}), suggestions.map((item, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					className: "h-7 text-xs bg-background/60 hover:bg-accent/80 border-border/60 transition-colors",
					onClick: () => handleExecuteCommand(item.cmd),
					disabled: isSending,
					children: item.label
				}, idx))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex md:hidden items-center justify-between gap-2 p-2 rounded-xl border border-border bg-card/60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 text-xs font-medium text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-3.5 w-3.5 text-indigo-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate max-w-[200px]",
						children: conversations.find((c) => c.id === currentConversationId)?.title || "Current Chat"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						className: "h-7 text-xs gap-1",
						onClick: handleNewChat,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" }), " New"]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row gap-4 h-[calc(100vh-270px)] min-h-[520px] max-h-[750px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "hidden md:flex w-64 shrink-0 flex-col rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-3 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pb-3 border-b border-border/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-semibold text-foreground flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-3.5 w-3.5 text-indigo-400" }), " Chat History"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								className: "h-7 text-xs gap-1 bg-background/50 hover:bg-accent cursor-pointer",
								onClick: handleNewChat,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" }), " New"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 overflow-y-auto space-y-1 pt-2 pr-1",
							children: conversations.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-center py-8 text-[11px] text-muted-foreground",
								children: "No past conversations"
							}) : conversations.map((conv) => {
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onClick: () => handleSelectConversation(conv.id),
									className: `group flex items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors cursor-pointer ${conv.id === currentConversationId ? "bg-primary/10 text-primary font-medium border border-primary/20" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground border border-transparent"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 min-w-0 flex-1 mr-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: conv.title || "Chat Conversation"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										"aria-label": "Delete conversation",
										onClick: (e) => handleDeleteConversation(conv.id, e),
										className: "opacity-0 group-hover:opacity-100 p-1 hover:text-destructive transition-opacity cursor-pointer rounded",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
									})]
								}, conv.id);
							})
						}),
						activityHistory.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 pt-2 border-t border-border/60",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-[10px] font-semibold uppercase text-muted-foreground mb-1.5 flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 text-indigo-400" }), " Recent Actions"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-1 max-h-24 overflow-y-auto pr-1",
								children: activityHistory.slice(0, 4).map((act, aIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[10px] text-muted-foreground truncate",
									title: act,
									children: ["• ", act]
								}, aIdx))
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-1 flex-col rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-sm overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 space-y-4 overflow-y-auto p-5 text-xs",
						children: [
							msgs.map((m) => {
								const isUser = m.role === "user" || m.sender === "user";
								const isSystem = m.role === "system" || m.sender === "system";
								const isFailed = failedMessageIds.has(m.id);
								const isActionExecuted = executedActionMessageIds.has(m.id);
								if (isSystem) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-center my-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-full bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 shadow-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }), m.content]
									})
								}, m.id);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `flex ${isUser ? "justify-end" : "justify-start"}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `max-w-[85%] rounded-2xl p-4 leading-relaxed ${isUser ? isFailed ? "bg-destructive/15 text-foreground border border-destructive/60 shadow-sm" : "bg-foreground text-background" : "bg-accent/80 text-foreground border border-border/60"}`,
										children: [
											isUser ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs whitespace-pre-wrap",
												children: [isFailed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5 text-destructive font-semibold mb-1 text-[11px]",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5 shrink-0" }), "Failed to send"]
												}), m.content]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs leading-relaxed prose dark:prose-invert max-w-none text-foreground",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, {
													components: {
														h1: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
															className: "text-base font-bold my-2 text-foreground",
															children
														}),
														h2: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
															className: "text-sm font-bold my-1.5 text-foreground",
															children
														}),
														h3: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
															className: "text-xs font-semibold my-1 text-foreground",
															children
														}),
														p: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "my-1 text-xs text-foreground leading-relaxed",
															children
														}),
														ul: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
															className: "my-1.5 ml-4 list-disc space-y-0.5",
															children
														}),
														ol: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
															className: "my-1.5 ml-4 list-decimal space-y-0.5",
															children
														}),
														li: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
															className: "text-xs leading-relaxed",
															children
														}),
														strong: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
															className: "font-semibold text-foreground",
															children
														}),
														code: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
															className: "rounded bg-muted/60 px-1 py-0.5 font-mono text-[11px] text-foreground",
															children
														}),
														table: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "overflow-x-auto my-2 rounded-lg border border-border",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
																className: "w-full text-[11px] text-left",
																children
															})
														}),
														th: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
															className: "px-2 py-1 bg-muted/40 font-semibold border-b border-border",
															children
														}),
														td: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-2 py-1 border-b border-border/40",
															children
														})
													},
													children: m.content
												})
											}),
											m.cardType === "candidate" && m.cardData && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 rounded-xl border border-border bg-background/80 p-3 text-foreground space-y-1.5 shadow-sm",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-between",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-sm",
															children: m.cardData.name
														}), m.cardData.atsScore !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
															variant: "secondary",
															className: "text-[10px]",
															children: [m.cardData.atsScore, "% Match"]
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-muted-foreground",
														children: [m.cardData.appliedPosition || "Applicant", m.cardData.yearsExperience ? ` • ${m.cardData.yearsExperience} yrs exp` : ""]
													}),
													m.cardData.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-[11px] text-muted-foreground",
														children: m.cardData.summary
													})
												]
											}),
											m.cardType === "job" && m.cardData && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 rounded-xl border border-border bg-background/80 p-3 text-foreground space-y-1.5 shadow-sm",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-between",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "font-bold text-sm",
															children: m.cardData.title
														}), m.cardData.department && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
															variant: "secondary",
															className: "text-[10px]",
															children: m.cardData.department
														})]
													}),
													m.cardData.salary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-muted-foreground",
														children: m.cardData.salary
													}),
													Array.isArray(m.cardData.skills) && (m.cardData.skills?.length ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "flex flex-wrap gap-1 mt-1",
														children: m.cardData.skills.map((s, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
															variant: "outline",
															className: "text-[10px]",
															children: s
														}, idx))
													})
												]
											}),
											m.cardType === "interview" && m.cardData && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 rounded-xl border border-border bg-background/80 p-3 text-foreground space-y-1.5 shadow-sm",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "font-bold text-sm flex items-center gap-1.5 text-indigo-500",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarClock, { className: "h-4 w-4" }), m.cardData.round || "Interview Round"]
													}),
													m.cardData.candidateName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
														"Candidate:",
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: m.cardData.candidateName })
													] }),
													m.cardData.interviewer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
														"Interviewer:",
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: m.cardData.interviewer })
													] }),
													m.cardData.time && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-muted-foreground font-mono text-[11px]",
														children: m.cardData.time
													})
												]
											}),
											m.cardType === "offer" && m.cardData && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 rounded-xl border border-border bg-background/80 p-3 text-foreground space-y-1.5 shadow-sm",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "font-bold text-sm text-emerald-600 dark:text-emerald-400",
														children: ["Offer: ", m.cardData.candidateName]
													}),
													m.cardData.role && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: ["Role: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: m.cardData.role })] }),
													m.cardData.ctc && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
														"Total CTC:",
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
															className: "font-mono text-indigo-500",
															children: m.cardData.ctc
														})
													] }),
													m.cardData.joiningDate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "text-muted-foreground",
														children: ["Target Joining: ", m.cardData.joiningDate]
													})
												]
											}),
											m.cardType === "onboarding" && m.cardData?.joiners && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 rounded-xl border border-border bg-background/80 p-3 text-foreground space-y-2 shadow-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-bold text-xs uppercase tracking-wider text-muted-foreground",
													children: "Day-One Readiness Tracker"
												}), m.cardData.joiners.map((j, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between items-center text-xs border-b border-border/40 pb-1 last:border-0",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
														j.name,
														" (",
														j.role,
														")"
													] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: "outline",
														className: "text-emerald-500 border-emerald-500/30",
														children: j.readiness
													})]
												}, idx))]
											}),
											m.cardType === "payroll" && m.cardData?.metrics && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-3 rounded-xl border border-border bg-background/80 p-3 text-foreground space-y-1.5 shadow-sm",
												children: m.cardData.metrics.map((met, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between items-center text-xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-muted-foreground",
														children: [met.label, ":"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold",
														children: met.val
													})]
												}, idx))
											}),
											m.tables && m.tables.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-3 space-y-2",
												children: m.tables.map((tbl, tIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "overflow-x-auto rounded-xl border border-border bg-background/80 p-2 shadow-sm",
													children: [tbl.title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "text-xs font-semibold px-2 py-1 text-foreground",
														children: tbl.title
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
														className: "w-full text-[11px] text-left",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
															className: "border-b border-border/50 text-muted-foreground",
															children: tbl.headers.map((h, hIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																className: "px-2 py-1",
																children: h
															}, hIdx))
														}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: tbl.rows.map((row, rIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
															className: "border-b border-border/30 last:border-0 hover:bg-muted/40",
															children: row.map((cell, cIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "px-2 py-1",
																children: String(cell ?? "—")
															}, cIdx))
														}, rIdx)) })]
													})]
												}, tIdx))
											}),
											m.charts && m.charts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "space-y-2",
												children: m.charts.map((chart, cIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatChartRenderer, { chart }, cIdx))
											}),
											m.sources && m.sources.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-2.5 flex flex-wrap gap-1.5",
												children: m.sources.map((src, sIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
													variant: "outline",
													className: "text-[10px] text-muted-foreground gap-1 bg-background/50",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3 w-3 text-indigo-400" }),
														src.document,
														" ",
														src.section ? `(${src.section})` : ""
													]
												}, sIdx))
											}),
											m.actionRequired && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mt-3 pt-2 border-t border-border/40 flex justify-end",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													size: "sm",
													disabled: isActionExecuted,
													className: `h-7 text-xs gap-1 cursor-pointer ${isActionExecuted ? "bg-muted text-muted-foreground border border-border" : "bg-gradient-brand text-brand-foreground shadow-glow"}`,
													onClick: () => setConfirmModal({
														action: m.actionRequired,
														messageId: m.id
													}),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" }), isActionExecuted ? "Action Executed" : "Confirm & Execute"]
												})
											}),
											m.suggestions && m.suggestions.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 pt-2 border-t border-border/40",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[10px] font-medium text-muted-foreground mb-1.5 flex items-center gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 text-indigo-400" }), " Suggested queries:"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex flex-wrap gap-1.5",
													children: m.suggestions.map((sug, sIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => handleExecuteCommand(sug),
														disabled: isSending,
														className: "text-[11px] px-2.5 py-1 rounded-full bg-background/70 hover:bg-background border border-border text-foreground/80 hover:text-foreground transition-colors text-left cursor-pointer",
														children: sug
													}, sIdx))
												})]
											}),
											!isUser && m.id !== "m-welcome" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-2.5 pt-2 border-t border-border/30 flex items-center justify-between text-[11px] text-muted-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px]",
													children: "Was this helpful?"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														"aria-label": "Thumbs up",
														onClick: () => handleFeedback(m.id, "up"),
														className: `p-1 rounded-md hover:bg-muted/80 transition-colors cursor-pointer ${feedbackMap[m.id] === "up" ? "text-emerald-500 bg-emerald-500/10 font-bold" : "text-muted-foreground"}`,
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: "h-3 w-3" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														"aria-label": "Thumbs down",
														onClick: () => handleFeedback(m.id, "down"),
														className: `p-1 rounded-md hover:bg-muted/80 transition-colors cursor-pointer ${feedbackMap[m.id] === "down" ? "text-rose-500 bg-rose-500/10 font-bold" : "text-muted-foreground"}`,
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsDown, { className: "h-3 w-3" })
													})]
												})]
											})
										]
									})
								}, m.id);
							}),
							isSending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-start",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "max-w-[85%] rounded-2xl p-4 bg-accent/80 text-foreground border border-border/60 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin text-indigo-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground animate-pulse",
										children: "Aurix AI is analyzing live workforce data and formulating response…"
									})]
								})
							}),
							Boolean(sendError) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-start",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "max-w-[85%] rounded-2xl p-4 bg-destructive/10 text-destructive border border-destructive/30 space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-destructive shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs font-medium",
											children: [
												"AI Service Notice:",
												" ",
												sendError || "Failed to receive AI response from the server."
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex justify-end gap-2 pt-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "outline",
											className: "h-7 text-xs border-destructive/40 hover:bg-destructive/20 gap-1 text-destructive cursor-pointer",
											onClick: handleRetry,
											disabled: isSending,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3 w-3" }), " Retry Message"]
										})
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: bottomRef })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: (e) => {
							e.preventDefault();
							handleExecuteCommand(input);
						},
						className: "flex items-center gap-2 border-t border-border p-3 bg-card/80 backdrop-blur",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: input,
							onChange: (e) => setInput(e.target.value),
							placeholder: "Ask or command Aurix AI… (e.g. Schedule interview for Siddharth tomorrow 2 PM)",
							className: "text-xs h-10",
							disabled: isSending
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							disabled: isSending || !input.trim(),
							className: "h-10 px-4 bg-gradient-brand text-brand-foreground shadow-glow gap-1.5 cursor-pointer",
							children: [isSending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }), "Send"]
						})]
					})]
				})]
			}),
			confirmModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: Boolean(confirmModal),
				onOpenChange: () => setConfirmModal(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "text-base font-bold flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-5 w-5 text-indigo-500" }), "Confirm Backend AI Action"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: confirmModal.action.actionName })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-2 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "p-3 rounded-lg border border-border bg-muted/30 text-foreground leading-relaxed",
								children: confirmModal.action.description
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-[11px] italic",
								children: "Execution will dispatch verified transactions to the OFC360 workspace modules."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							disabled: isConfirmingAction,
							onClick: () => setConfirmModal(null),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: isConfirmingAction,
							className: "bg-gradient-brand text-brand-foreground shadow-glow cursor-pointer",
							onClick: handleConfirmAction,
							children: isConfirmingAction ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin mr-1.5" }), "Executing..."] }) : "Confirm & Proceed"
						})] })
					]
				})
			})
		]
	});
}
//#endregion
export { ChatAssistantPage as default };
