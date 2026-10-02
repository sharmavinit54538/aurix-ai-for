import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { An as Gauge, Xr as Bot, Z as Server, nr as Database } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { _ as isAuthorizationError, f as formatDateTime, i as InlineNotice, p as formatMilliseconds, r as ErrorState, s as Panel, t as AccessDeniedState, u as formatCount } from "./SuperAdminStates-C68AaNca.mjs";
import { i as useReadiness, p as useSystemHealth, r as usePublicHealth } from "./hooks-sx1lwuE8.mjs";
import { a as ServiceStatusBadge, i as ServiceDot } from "./Badges-BovbKWqK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.super-admin.platform-config-CEVfYjuS.js
var import_jsx_runtime = require_jsx_runtime();
function connectivityState(value) {
	if (!value) return "unknown";
	const normalized = value.toLowerCase();
	if (normalized === "connected" || normalized === "healthy" || normalized === "online") return "online";
	if (normalized === "degraded") return "degraded";
	return "offline";
}
function SuperAdminPlatformConfigPage() {
	const systemHealth = useSystemHealth();
	const publicHealth = usePublicHealth();
	const readiness = useReadiness();
	if (systemHealth.isError && isAuthorizationError(systemHealth.error)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessDeniedState, { error: systemHealth.error });
	const apiState = connectivityState(publicHealth.data?.status);
	const dbState = systemHealth.data?.database.status ?? connectivityState(publicHealth.data?.database);
	const llm = readiness.data?.llm ?? null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						icon: Server,
						iconClass: "bg-emerald-500/10 text-emerald-400",
						label: "API service",
						loading: publicHealth.isPending,
						failed: publicHealth.isError,
						value: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: cn("capitalize", apiState === "online" ? "text-emerald-400" : apiState === "degraded" ? "text-amber-400" : "text-rose-400"),
							children: publicHealth.data?.status ?? "Unknown"
						}),
						footerLabel: "Version",
						footerValue: publicHealth.data?.version ? `${publicHealth.data.version}${publicHealth.data.environment ? ` · ${publicHealth.data.environment}` : ""}` : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						icon: Database,
						iconClass: "bg-purple-500/10 text-purple-400",
						label: "Database ping (server-side)",
						loading: systemHealth.isPending,
						failed: systemHealth.isError,
						value: formatMilliseconds(systemHealth.data?.database.pingMs),
						footerLabel: "Status",
						footerValue: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceStatusBadge, { state: dbState })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
						icon: Gauge,
						iconClass: "bg-blue-500/10 text-blue-400",
						label: "API round-trip (this browser)",
						loading: systemHealth.isPending,
						failed: systemHealth.isError,
						value: formatMilliseconds(systemHealth.data?.apiRoundTripMs),
						footerLabel: "Checked",
						footerValue: formatDateTime(systemHealth.data?.checkedAt)
					})
				]
			}),
			systemHealth.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
				title: "Unable to run the authenticated system health check.",
				error: systemHealth.error,
				onRetry: () => void systemHealth.refetch(),
				retrying: systemHealth.isFetching
			}),
			publicHealth.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
				title: "Unable to reach the public API health endpoint.",
				error: publicHealth.error,
				onRetry: () => void publicHealth.refetch(),
				retrying: publicHealth.isFetching
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex flex-wrap items-center justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold text-base text-foreground",
						children: "Service Dependencies"
					}), readiness.data && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceStatusBadge, {
						state: readiness.data.ready ? "online" : "degraded",
						label: readiness.data.ready ? "Ready" : `Not ready (HTTP ${readiness.data.httpStatus})`
					})]
				}),
				readiness.isPending && systemHealth.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-full rounded-xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-full rounded-xl" })]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DependencyRow, {
						state: dbState,
						name: "PostgreSQL database",
						detail: systemHealth.data?.database.pingMs != null ? `SELECT 1 in ${formatMilliseconds(systemHealth.data.database.pingMs)}` : readiness.data?.database ? `Readiness probe: ${readiness.data.database}` : void 0
					}), readiness.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
						title: "Unable to load the readiness probe (AI / LLM providers).",
						error: readiness.error,
						onRetry: () => void readiness.refetch(),
						retrying: readiness.isFetching
					}) : llm === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DependencyRow, {
						state: "unknown",
						name: "AI / LLM providers",
						detail: "The readiness probe did not report LLM status."
					}) : llm.providers.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DependencyRow, {
						state: llm.healthy === null ? "unknown" : llm.healthy ? "online" : "offline",
						name: "AI / LLM providers",
						detail: "No providers reported by the readiness probe."
					}) : llm.providers.map((provider) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DependencyRow, {
						state: provider.healthy ? "online" : "offline",
						name: `AI / LLM provider: ${provider.name}`,
						detail: llm.totalCount !== null ? `${formatCount(llm.healthyCount)} of ${formatCount(llm.totalCount)} configured providers healthy` : void 0,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bot, { className: "h-3.5 w-3.5 text-muted-foreground" })
					}, provider.name))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(InlineNotice, {
					className: "mt-4",
					children: "Only services that the backend actually probes are listed. CPU, memory, connection-pool and cache metrics are not exposed by the API, so they are not shown."
				})
			] })
		]
	});
}
function MetricCard({ icon: Icon, iconClass, label, loading, failed, value, footerLabel, footerValue }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("grid h-10 w-10 place-items-center rounded-xl", iconClass),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-lg font-bold text-foreground",
					children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-1 h-6 w-20" }) : failed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-rose-400",
						children: "Unavailable"
					}) : value
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 text-xs text-muted-foreground border-t border-border/40 pt-2 flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [footerLabel, ":"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono text-foreground text-right",
				children: loading || failed ? "—" : footerValue
			})]
		})]
	});
}
function DependencyRow({ state, name, detail, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-3 p-3 rounded-xl border border-border/40 bg-background/40",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2.5 min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceDot, { state }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 text-sm font-semibold text-foreground",
					children: [icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: name
					})]
				}), detail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] text-muted-foreground",
					children: detail
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServiceStatusBadge, { state })]
	});
}
var SplitComponent = SuperAdminPlatformConfigPage;
//#endregion
export { SplitComponent as component };
