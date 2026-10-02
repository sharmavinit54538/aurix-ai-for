import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Br as Calendar, H as Sparkles, Ht as MailCheck, J as ShieldAlert, Jr as Briefcase, Ln as FileText, Sr as CircleCheck, T as TriangleAlert, Vt as Mail, Xn as ExternalLink, dn as IndianRupee, fn as Inbox, jr as CheckCheck, lt as RefreshCw, ni as Bell, on as Laptop, pi as Archive, pr as Clock, q as ShieldCheck, x as UserCheck } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { a as useMarkAllRead, c as useNotifications, i as useArchive, l as useUnreadCount, o as useMarkRead, r as isInternalSafeLink, s as useMarkUnread, t as formatRelativeTime } from "./notification-utils-1y-FPLpt.mjs";
import { r as PageHeader } from "./DashboardShell-DIr27KpW.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/NotificationsPage-CaboIZaa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIES = [
	{
		value: "all",
		label: "All Categories"
	},
	{
		value: "attendance",
		label: "Attendance"
	},
	{
		value: "leave",
		label: "Leave"
	},
	{
		value: "payroll",
		label: "Payroll"
	},
	{
		value: "documents",
		label: "Documents"
	},
	{
		value: "assets",
		label: "Assets"
	},
	{
		value: "recruitment",
		label: "Recruitment"
	},
	{
		value: "onboarding_exit",
		label: "Onboarding & Exit"
	},
	{
		value: "approvals",
		label: "Approvals"
	},
	{
		value: "security",
		label: "Security"
	},
	{
		value: "system",
		label: "System"
	},
	{
		value: "ai_insights",
		label: "AI Insights"
	}
];
var PRIORITIES = [
	{
		value: "all",
		label: "All Priorities"
	},
	{
		value: "critical",
		label: "Critical"
	},
	{
		value: "high",
		label: "High"
	},
	{
		value: "normal",
		label: "Normal"
	},
	{
		value: "low",
		label: "Low"
	}
];
function getCategoryIcon(category, priority) {
	if (priority === "critical") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-rose-500" });
	switch (category) {
		case "recruitment": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-4 w-4 text-blue-500" });
		case "payroll": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndianRupee, { className: "h-4 w-4 text-emerald-500" });
		case "leave": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-4 w-4 text-purple-500" });
		case "attendance": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-sky-500" });
		case "documents": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-amber-500" });
		case "assets": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Laptop, { className: "h-4 w-4 text-cyan-500" });
		case "onboarding_exit": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-4 w-4 text-indigo-500" });
		case "approvals": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-teal-500" });
		case "security": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-4 w-4 text-rose-500" });
		case "system": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-slate-500" });
		case "ai_insights": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-violet-500" });
		default: return priority === "high" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-amber-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4 text-muted-foreground" });
	}
}
function getPriorityBadge(priority) {
	switch (priority) {
		case "critical": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: "destructive",
			className: "h-5 px-1.5 text-[10px] uppercase font-bold",
			children: "Critical"
		});
		case "high": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			className: "h-5 px-1.5 text-[10px] uppercase font-bold bg-amber-500 text-white hover:bg-amber-600",
			children: "High"
		});
		case "normal": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: "secondary",
			className: "h-5 px-1.5 text-[10px] uppercase font-medium",
			children: "Normal"
		});
		case "low": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: "outline",
			className: "h-5 px-1.5 text-[10px] uppercase font-medium text-muted-foreground",
			children: "Low"
		});
	}
}
function NotificationsPage() {
	const [unreadOnly, setUnreadOnly] = (0, import_react.useState)(false);
	const [selectedCategory, setSelectedCategory] = (0, import_react.useState)("all");
	const [selectedPriority, setSelectedPriority] = (0, import_react.useState)("all");
	const navigate = useNavigate();
	const { items, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useNotifications({
		unread: unreadOnly ? true : void 0,
		category: selectedCategory !== "all" ? selectedCategory : void 0,
		priority: selectedPriority !== "all" ? selectedPriority : void 0,
		limit: 20
	});
	const { unreadCount } = useUnreadCount();
	const markReadMutation = useMarkRead();
	const markUnreadMutation = useMarkUnread();
	const markAllReadMutation = useMarkAllRead();
	const archiveMutation = useArchive();
	const handleItemClick = (item) => {
		if (!item.readAt) markReadMutation.mutate(item.id);
		if (isInternalSafeLink(item.link)) navigate({ to: item.link });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "w-full min-w-0 space-y-6 pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Notifications",
				description: "Real-time alerts, operational updates, and system communications.",
				actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => markAllReadMutation.mutate(selectedCategory !== "all" ? selectedCategory : void 0),
						disabled: markAllReadMutation.isPending || unreadCount === 0,
						className: "cursor-pointer text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "mr-1.5 h-3.5 w-3.5 text-emerald-500" }), "Mark all as read"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => refetch(),
						className: "cursor-pointer text-xs",
						title: "Refresh notifications",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" })
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: unreadOnly ? "default" : "outline",
							onClick: () => setUnreadOnly((prev) => !prev),
							className: "h-8 text-xs cursor-pointer gap-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Unread only" }),
								unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: unreadOnly ? "secondary" : "destructive",
									className: "ml-1 h-4 px-1 text-[9px] font-bold",
									children: unreadCount
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-[180px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: selectedCategory,
								onValueChange: (val) => setSelectedCategory(val),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-8 text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Category" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: c.value,
									className: "text-xs",
									children: c.label
								}, c.value)) })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-[150px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: selectedPriority,
								onValueChange: (val) => setSelectedPriority(val),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "h-8 text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Priority" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: PRIORITIES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: p.value,
									className: "text-xs",
									children: p.label
								}, p.value)) })]
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-xs text-muted-foreground",
					children: [
						"Showing ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-foreground",
							children: items.length
						}),
						" ",
						"notification",
						items.length === 1 ? "" : "s"
					]
				})]
			}),
			isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-4 rounded-2xl border border-border bg-card/60 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-10 rounded-xl shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-1/3" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3.5 w-full" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-1/4" })
						]
					})]
				}, i))
			}) : isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-dashed border-border bg-card/40",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-destructive/10 text-destructive",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-6 w-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold text-foreground",
						children: "Failed to load notifications"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-sm text-xs text-muted-foreground",
						children: "We encountered a problem fetching notifications. Please try again."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => refetch(),
						className: "mt-4 text-xs",
						children: "Retry"
					})
				]
			}) : items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-border bg-card/40",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary border border-primary/20",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "h-7 w-7" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-semibold text-foreground",
						children: "All caught up!"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-sm text-xs text-muted-foreground",
						children: unreadOnly ? "No unread notifications match your filters." : "No notifications found. Active notifications and system alerts will appear here."
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [items.map((item) => {
					const isUnread = !item.readAt;
					const hasSafeLink = isInternalSafeLink(item.link);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						role: "button",
						tabIndex: 0,
						onClick: () => handleItemClick(item),
						onKeyDown: (e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								handleItemClick(item);
							}
						},
						className: `group relative flex items-start gap-4 rounded-2xl border p-4 transition-all duration-200 hover:shadow-md cursor-pointer ${isUnread ? "bg-primary/5 border-primary/30" : "bg-card/70 border-border hover:bg-card"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-muted/70 border border-border/60",
								children: getCategoryIcon(item.category, item.priority)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1 pr-12",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `text-sm tracking-tight ${isUnread ? "font-semibold text-foreground" : "font-medium text-foreground/80"}`,
												children: item.title
											}),
											isUnread && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-2 w-2 rounded-full bg-primary shrink-0" }),
											getPriorityBadge(item.priority),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												className: "h-5 px-1.5 text-[10px] capitalize",
												children: item.category.replace(/_/g, " ")
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted-foreground leading-relaxed",
										children: item.body
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2.5 flex items-center gap-3 text-[11px] text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono",
												children: formatRelativeTime(item.createdAt)
											}),
											item.actor?.name && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["• By ", item.actor.name] }),
											hasSafeLink && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "inline-flex items-center gap-1 font-semibold text-primary hover:underline",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Navigate" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })]
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute top-4 right-4 flex items-center gap-1",
								children: [isUnread ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: (e) => {
										e.stopPropagation();
										markReadMutation.mutate(item.id);
									},
									className: "h-7 w-7 p-0 text-muted-foreground hover:text-emerald-500 cursor-pointer",
									title: "Mark as read",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MailCheck, { className: "h-3.5 w-3.5" })
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: (e) => {
										e.stopPropagation();
										markUnreadMutation.mutate(item.id);
									},
									className: "h-7 w-7 p-0 text-muted-foreground hover:text-primary cursor-pointer",
									title: "Mark as unread",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "sm",
									onClick: (e) => {
										e.stopPropagation();
										archiveMutation.mutate(item.id);
									},
									className: "h-7 w-7 p-0 text-muted-foreground hover:text-destructive cursor-pointer",
									title: "Archive notification",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "h-3.5 w-3.5" })
								})]
							})
						]
					}, item.id);
				}), hasNextPage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pt-4 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: () => fetchNextPage(),
						disabled: isFetchingNextPage,
						className: "gap-2 text-xs cursor-pointer",
						children: [isFetchingNextPage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 animate-spin" }), isFetchingNextPage ? "Loading more..." : "Load more notifications"]
					})
				})]
			})
		]
	});
}
//#endregion
export { NotificationsPage, NotificationsPage as default };
