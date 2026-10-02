import "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Jr as Briefcase, T as TriangleAlert, Xn as ExternalLink, fn as Inbox, jr as CheckCheck } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { a as useMarkAllRead, c as useNotifications, o as useMarkRead, r as isInternalSafeLink, t as formatRelativeTime } from "./notification-utils-1y-FPLpt.mjs";
import { r as PageHeader } from "./DashboardShell-DIr27KpW.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function RecruitmentNotificationsPage() {
	const navigate = useNavigate();
	const { items, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useNotifications({ module: "recruitment" });
	const markReadMutation = useMarkRead();
	const markAllReadMutation = useMarkAllRead();
	const unreadCount = items.filter((n) => !n.readAt).length;
	const handleItemClick = (n) => {
		if (!n.readAt) markReadMutation.mutate(n.id);
		if (isInternalSafeLink(n.link)) navigate({ to: n.link });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Recruitment Notification Center",
			description: "Candidate applications, interview schedules, SLA alerts, and hiring manager updates.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: () => markAllReadMutation.mutate("recruitment"),
				disabled: unreadCount === 0 || markAllReadMutation.isPending,
				className: "cursor-pointer text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "mr-2 h-4 w-4" }), "Mark all read"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				variant: "secondary",
				className: "px-2.5 py-0.5 text-xs",
				children: [unreadCount, " unread"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xs text-muted-foreground",
				children: [
					items.length,
					" total alert",
					items.length === 1 ? "" : "s"
				]
			})]
		}),
		isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3 rounded-xl border border-border p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-9 w-9 rounded-lg shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-1/3" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-3/4" })]
				})]
			}, i))
		}) : isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-2xl bg-card/40",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 grid h-10 w-10 place-items-center rounded-xl bg-destructive/10 text-destructive",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium text-sm",
					children: "Failed to load recruitment notifications"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => refetch(),
					className: "mt-3 text-xs",
					children: "Retry"
				})
			]
		}) : items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-2xl bg-card/40",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: "No recruitment notifications"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-sm text-sm text-muted-foreground",
					children: "You're all caught up! Candidate applications, interview updates, and mentions will appear here."
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [items.map((n) => {
				const isUnread = !n.readAt;
				const hasSafeLink = isInternalSafeLink(n.link);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					role: "button",
					tabIndex: 0,
					onClick: () => handleItemClick(n),
					onKeyDown: (e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.preventDefault();
							handleItemClick(n);
						}
					},
					className: `flex cursor-pointer items-start gap-3 rounded-xl border border-border p-3 transition-colors ${isUnread ? "bg-accent/30 font-medium" : "bg-card/40"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent text-primary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium",
										children: n.title
									}),
									isUnread && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-violet-500 shrink-0" }),
									n.priority === "high" || n.priority === "critical" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "destructive",
										className: "h-4 px-1 text-[9px] uppercase font-bold",
										children: n.priority
									}) : null
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: n.body
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex items-center gap-2 text-[10px] text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono",
									children: formatRelativeTime(n.createdAt)
								}), hasSafeLink && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-0.5 font-semibold text-primary",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-2.5 w-2.5" })]
								})]
							})
						]
					})]
				}, n.id);
			}), hasNextPage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pt-3 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => fetchNextPage(),
					disabled: isFetchingNextPage,
					className: "text-xs",
					children: isFetchingNextPage ? "Loading..." : "Load more"
				})
			})]
		})
	] });
}
//#endregion
export { RecruitmentNotificationsPage, RecruitmentNotificationsPage as default };
