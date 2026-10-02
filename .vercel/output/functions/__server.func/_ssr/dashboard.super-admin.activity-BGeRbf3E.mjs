import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { ln as KeyRound, mi as Activity } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { _ as isAuthorizationError, f as formatDateTime, g as formatTime, l as SkeletonRows, m as formatRelativeTime, n as EmptyState, r as ErrorState, s as Panel, t as AccessDeniedState, u as formatCount, v as shortId } from "./SuperAdminStates-C68AaNca.mjs";
import { l as useSuperAdminSessions, n as useOrganizationDirectory, o as useSuperAdminAuditFeed } from "./hooks-sx1lwuE8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.super-admin.activity-BGeRbf3E.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FEED_PAGE_SIZE = 25;
/** Backend limit of GET /super-admin/security/sessions. */
var SESSION_LIST_LIMIT = 50;
function dayLabel(iso, now) {
	if (!iso) return "Unknown date";
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return "Unknown date";
	const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
	const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
	const diffDays = Math.round((startOfToday - startOfDate) / (1440 * 60 * 1e3));
	if (diffDays === 0) return "Today";
	if (diffDays === 1) return "Yesterday";
	return date.toLocaleDateString("en-IN", {
		weekday: "short",
		day: "numeric",
		month: "short",
		year: "numeric"
	});
}
function groupByDay(events) {
	const now = /* @__PURE__ */ new Date();
	const groups = [];
	for (const event of events) {
		const label = dayLabel(event.timestamp, now);
		const last = groups[groups.length - 1];
		if (last && last.label === label) last.events.push(event);
		else groups.push({
			label,
			events: [event]
		});
	}
	return groups;
}
function SuperAdminActivityPage() {
	const feed = useSuperAdminAuditFeed(FEED_PAGE_SIZE, false);
	const sessions = useSuperAdminSessions(false);
	const directory = useOrganizationDirectory();
	const events = (0, import_react.useMemo)(() => feed.data?.pages.flat() ?? [], [feed.data]);
	const groups = (0, import_react.useMemo)(() => groupByDay(events), [events]);
	const organizationNames = (0, import_react.useMemo)(() => new Map((directory.data ?? []).map((org) => [org.id, org.name])), [directory.data]);
	if (feed.isError && isAuthorizationError(feed.error)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessDeniedState, { error: feed.error });
	const organizationLabel = (organizationId) => organizationId ? organizationNames.get(organizationId) ?? `Tenant ${shortId(organizationId)}` : "Platform-level";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-6 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "lg:col-span-2 p-0 overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 border-b border-border/40 px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-5 w-5 text-purple-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-bold text-foreground",
						children: "Event Timeline"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"Newest first · ",
							formatCount(events.length),
							" loaded"
						]
					})] })]
				}), feed.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkeletonRows, {
					rows: 6,
					className: "p-4"
				}) : feed.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
					className: "m-4",
					title: "Unable to load platform activity.",
					error: feed.error,
					onRetry: () => void feed.refetch(),
					retrying: feed.isFetching
				}) : events.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						icon: Activity,
						title: "No activity available",
						description: "No audit events have been recorded yet."
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "sticky top-0 bg-muted/60 px-5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur",
					children: group.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-border/40",
					children: group.events.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-8 w-8 place-items-center rounded-lg bg-purple-500/10 text-purple-400 mt-0.5 shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-semibold text-foreground font-mono break-all",
										children: event.action ?? "—"
									}),
									event.details && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground break-words",
										children: event.details
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs text-muted-foreground flex flex-wrap items-center gap-x-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-foreground font-medium",
												children: event.actorEmail ?? "Actor not recorded"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: organizationLabel(event.organizationId) })
										]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "shrink-0 text-right text-xs text-muted-foreground",
							title: formatDateTime(event.timestamp),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: formatTime(event.timestamp) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px]",
								children: formatRelativeTime(event.timestamp)
							})]
						})]
					}, event.id))
				})] }, group.label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-t border-border/40 p-4 text-center",
					children: feed.hasNextPage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						className: "text-xs",
						onClick: () => void feed.fetchNextPage(),
						disabled: feed.isFetchingNextPage,
						children: feed.isFetchingNextPage ? "Loading older events…" : "Load older events"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: "Beginning of the recorded audit trail"
					})
				})] })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "p-0 overflow-hidden h-fit",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2 border-b border-border/40 px-5 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "h-5 w-5 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-bold text-foreground",
							children: "Active Sessions"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Non-expired, non-revoked sign-in sessions"
						})] })]
					}), sessions.data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-lg font-bold text-foreground",
						children: [formatCount(sessions.data.length), sessions.data.length >= SESSION_LIST_LIMIT ? "+" : ""]
					})]
				}), sessions.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkeletonRows, {
					rows: 4,
					className: "p-4"
				}) : sessions.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
					className: "m-4",
					title: "Unable to load active sessions.",
					error: sessions.error,
					onRetry: () => void sessions.refetch(),
					retrying: sessions.isFetching
				}) : sessions.data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						icon: KeyRound,
						title: "No active sessions",
						description: "No user currently holds a valid sign-in session."
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "divide-y divide-border/40",
					children: [sessions.data.map((session) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3 px-5 py-3 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold text-foreground truncate",
								children: session.userName ?? "—"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-mono text-[11px] text-muted-foreground truncate",
								children: session.userEmail ?? "—"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "shrink-0 text-right text-muted-foreground",
							title: formatDateTime(session.startedAt),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-wide",
								children: "Signed in"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: formatRelativeTime(session.startedAt) })]
						})]
					}, session.id)), sessions.data.length >= SESSION_LIST_LIMIT && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-5 py-2.5 text-[11px] text-muted-foreground",
						children: [
							"The API returns the ",
							SESSION_LIST_LIMIT,
							" most recent sessions; more may be active."
						]
					})]
				})]
			})]
		})
	});
}
var SplitComponent = SuperAdminActivityPage;
//#endregion
export { SplitComponent as component };
