import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { G as SlidersVertical, at as Save, st as RotateCcw } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Switch } from "./switch-C_mzcXif.mjs";
import { _ as isAuthorizationError, n as EmptyState, r as ErrorState, s as Panel, t as AccessDeniedState } from "./SuperAdminStates-C68AaNca.mjs";
import { m as useUpdateSuperAdminSettings, u as useSuperAdminSettings } from "./hooks-sx1lwuE8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.super-admin.settings-C8SwEaox.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Labels for the keys served by GET /super-admin/settings. Unknown keys are still rendered. */
var SETTING_META = {
	emailSenderName: {
		label: "Email sender name",
		description: "Display name used on platform emails.",
		group: "General"
	},
	emailSenderAddress: {
		label: "Email sender address",
		description: "From-address used on platform emails.",
		group: "General"
	},
	securityAlertEmail: {
		label: "Security alert email",
		description: "Mailbox that should receive security alerts.",
		group: "General"
	},
	allowNewRegistrations: {
		label: "Allow new registrations",
		description: "Whether new companies may sign up.",
		group: "Access & security"
	},
	enforceMfaGlobally: {
		label: "Enforce MFA globally",
		description: "Require multi-factor authentication for every account.",
		group: "Access & security"
	},
	sessionTimeoutMinutes: {
		label: "Session timeout (minutes)",
		description: "Idle time before a session should expire.",
		group: "Access & security"
	},
	defaultTrialDays: {
		label: "Default trial length (days)",
		description: "Trial period for newly created tenants.",
		group: "Access & security"
	},
	maintenanceMode: {
		label: "Maintenance mode",
		description: "Marks the platform as under maintenance for non-Super-Admin users.",
		group: "Operations"
	},
	aiTokenRateLimitPerHour: {
		label: "AI token limit per hour",
		description: "Hourly AI token budget.",
		group: "Operations"
	},
	autoBackupIntervalHours: {
		label: "Automatic backup interval (hours)",
		description: "Hours between automatic backups.",
		group: "Operations"
	}
};
var GROUP_ORDER = [
	"General",
	"Access & security",
	"Operations",
	"Other"
];
var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function humanize(key) {
	const spaced = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").toLowerCase();
	return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}
/** Keys holding an email address end in "Email"/"Address" (e.g. securityAlertEmail), unlike emailSenderName. */
function isEmailKey(key) {
	return /(?:email|address)$/i.test(key);
}
function SuperAdminSettingsPage() {
	const settings = useSuperAdminSettings();
	const updateSettings = useUpdateSuperAdminSettings();
	const [edits, setEdits] = (0, import_react.useState)({});
	const server = settings.data;
	const valueFor = (key) => {
		if (key in edits) return edits[key];
		const original = server?.[key];
		return typeof original === "boolean" ? original : original === void 0 ? "" : String(original);
	};
	const validationError = (key, original) => {
		const value = valueFor(key);
		if (typeof original === "number") {
			const parsed = Number(value);
			if (value === "" || !Number.isFinite(parsed) || parsed < 0 || !Number.isInteger(parsed)) return "Enter a whole number of 0 or more.";
		}
		if (typeof original === "string" && isEmailKey(key) && typeof value === "string" && value.trim() !== "" && !EMAIL_PATTERN.test(value.trim())) return "Enter a valid email address.";
		return null;
	};
	const changes = (0, import_react.useMemo)(() => {
		if (!server) return {};
		const result = {};
		for (const [key, value] of Object.entries(edits)) {
			const original = server[key];
			if (original === void 0) continue;
			if (typeof original === "number") {
				const parsed = typeof value === "string" && value.trim() !== "" ? Number(value) : NaN;
				if (Number.isFinite(parsed) && parsed !== original) result[key] = parsed;
			} else if (typeof original === "boolean") {
				if (value !== original) result[key] = Boolean(value);
			} else if (typeof value === "string" && value.trim() !== original) result[key] = value.trim();
		}
		return result;
	}, [edits, server]);
	const grouped = (0, import_react.useMemo)(() => {
		if (!server) return [];
		const groups = /* @__PURE__ */ new Map();
		for (const key of Object.keys(server)) {
			const group = SETTING_META[key]?.group ?? "Other";
			groups.set(group, [...groups.get(group) ?? [], key]);
		}
		return GROUP_ORDER.filter((group) => groups.has(group)).map((group) => ({
			group,
			keys: groups.get(group) ?? []
		}));
	}, [server]);
	if (settings.isError && isAuthorizationError(settings.error)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessDeniedState, { error: settings.error });
	const changedKeys = Object.keys(changes);
	const hasErrors = server ? Object.keys(server).some((key) => validationError(key, server[key]) !== null) : false;
	const handleSave = async (event) => {
		event.preventDefault();
		if (changedKeys.length === 0 || hasErrors) return;
		try {
			await updateSettings.mutateAsync(changes);
			setEdits({});
			toast.success(`Saved ${changedKeys.length} platform setting${changedKeys.length === 1 ? "" : "s"}.`);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to update platform settings.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto",
		children: settings.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-5 w-48" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-full" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-full" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-full" })
			]
		}) }) : settings.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
			title: "Unable to load platform settings. Please try again.",
			error: settings.error,
			onRetry: () => void settings.refetch(),
			retrying: settings.isFetching
		}) : Object.keys(settings.data).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: SlidersVertical,
			title: "No data available",
			description: "The settings endpoint returned no configuration values."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: (event) => void handleSave(event),
			className: "space-y-6",
			children: [grouped.map(({ group, keys }) => {
				const booleanKeys = keys.filter((key) => typeof settings.data[key] === "boolean");
				const fieldKeys = keys.filter((key) => typeof settings.data[key] !== "boolean");
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-bold text-base text-foreground",
							children: group
						}),
						fieldKeys.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
							children: fieldKeys.map((key) => {
								const original = settings.data[key];
								const meta = SETTING_META[key];
								const error = validationError(key, original);
								const value = valueFor(key);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: `setting-${key}`,
											className: "text-xs",
											children: meta?.label ?? humanize(key)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: `setting-${key}`,
											type: typeof original === "number" ? "number" : isEmailKey(key) ? "email" : "text",
											min: typeof original === "number" ? 0 : void 0,
											step: typeof original === "number" ? 1 : void 0,
											value: typeof value === "string" ? value : String(value),
											onChange: (event) => setEdits((current) => ({
												...current,
												[key]: event.target.value
											})),
											"aria-invalid": error !== null,
											className: "h-9 text-xs"
										}),
										error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-rose-400",
											children: error
										}) : meta && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground",
											children: meta.description
										})
									]
								}, key);
							})
						}),
						booleanKeys.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4 divide-y divide-border/40",
							children: booleanKeys.map((key, index) => {
								const meta = SETTING_META[key];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: index === 0 ? "flex items-center justify-between gap-4" : "flex items-center justify-between gap-4 pt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold text-sm text-foreground",
											children: meta?.label ?? humanize(key)
										}), meta && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground",
											children: meta.description
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: valueFor(key) === true,
										onCheckedChange: (checked) => setEdits((current) => ({
											...current,
											[key]: checked
										})),
										"aria-label": meta?.label ?? humanize(key)
									})]
								}, key);
							})
						})
					]
				}, group);
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground sm:mr-auto",
						children: changedKeys.length === 0 ? "No unsaved changes" : `${changedKeys.length} unsaved change${changedKeys.length === 1 ? "" : "s"}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						disabled: Object.keys(edits).length === 0 || updateSettings.isPending,
						onClick: () => setEdits({}),
						className: "gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" }), "Discard"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						disabled: changedKeys.length === 0 || hasErrors || updateSettings.isPending,
						className: "gap-2 bg-purple-600 hover:bg-purple-700 text-white",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), updateSettings.isPending ? "Saving Changes…" : "Save Platform Settings"]
					})
				]
			})]
		})
	});
}
var SplitComponent = SuperAdminSettingsPage;
//#endregion
export { SplitComponent as component };
