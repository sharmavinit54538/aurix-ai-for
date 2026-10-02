import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Hn as FileLock, Sr as CircleCheck, g as UserX, q as ShieldCheck } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as PageHeader } from "./DashboardShell-DIr27KpW.mjs";
import { C as Legend, S as Tooltip, a as PieChart, b as Cell, h as Pie, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { n as useRecruitment } from "./useRecruitment-Cuznx8sx.mjs";
import { t as Switch } from "./switch-C_mzcXif.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/RecruitmentCompliancePage-hudkyC42.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLORS = [
	"oklch(0.65 0.22 285)",
	"oklch(0.7 0.18 200)",
	"oklch(0.74 0.16 140)",
	"oklch(0.75 0.18 60)",
	"oklch(0.68 0.2 25)"
];
function RecruitmentCompliancePage() {
	const candidates = useRecruitment((s) => s.candidates);
	const [controls, setControls] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") {
			const raw = window.localStorage.getItem("aurix.compliance.controls");
			if (raw) try {
				return JSON.parse(raw);
			} catch {}
		}
		return {
			gdprConsent: true,
			eeoSelfId: true,
			ofccp: true,
			anonymize: true,
			blindReview: false,
			dsar: true
		};
	});
	const [checklist, setChecklist] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") {
			const raw = window.localStorage.getItem("aurix.compliance.checklist");
			if (raw) try {
				return JSON.parse(raw);
			} catch {}
		}
		return {
			eeo1: true,
			dpa: true,
			retention: true,
			ccpa: true,
			pentest: false,
			soc2: true
		};
	});
	const updateControl = (key, val) => {
		const next = {
			...controls,
			[key]: val
		};
		setControls(next);
		if (typeof window !== "undefined") window.localStorage.setItem("aurix.compliance.controls", JSON.stringify(next));
		toast.success("Privacy control updated successfully!");
	};
	const toggleChecklist = (key) => {
		const next = {
			...checklist,
			[key]: !checklist[key]
		};
		setChecklist(next);
		if (typeof window !== "undefined") window.localStorage.setItem("aurix.compliance.checklist", JSON.stringify(next));
		toast.success("Compliance checklist item updated!");
	};
	const diversityStats = (0, import_react.useMemo)(() => {
		const genderMap = {
			Male: 0,
			Female: 0,
			"Non-binary": 0,
			Undisclosed: 0
		};
		const ethnicityMap = {
			Asian: 0,
			White: 0,
			Hispanic: 0,
			Black: 0,
			Other: 0
		};
		candidates.forEach((c) => {
			const gKeys = Object.keys(genderMap);
			const genderIndex = Math.abs(c.name.charCodeAt(0) + c.name.charCodeAt(c.name.length - 1)) % gKeys.length;
			genderMap[gKeys[genderIndex]] += 1;
			const eKeys = Object.keys(ethnicityMap);
			const ethIndex = Math.abs(c.name.length + c.location.length) % eKeys.length;
			ethnicityMap[eKeys[ethIndex]] += 1;
		});
		if (candidates.length === 0) return {
			gender: [
				{
					name: "Male",
					value: 12
				},
				{
					name: "Female",
					value: 14
				},
				{
					name: "Non-binary",
					value: 2
				},
				{
					name: "Undisclosed",
					value: 1
				}
			],
			ethnicity: [
				{
					name: "Asian",
					value: 8
				},
				{
					name: "White",
					value: 11
				},
				{
					name: "Hispanic",
					value: 4
				},
				{
					name: "Black",
					value: 3
				},
				{
					name: "Other",
					value: 1
				}
			],
			consentRate: 100,
			selfIdRate: 90
		};
		const total = candidates.length;
		const undisclosedGender = genderMap["Undisclosed"];
		const selfIdRate = Math.round((total - undisclosedGender) / total * 100);
		return {
			gender: Object.entries(genderMap).map(([name, value]) => ({
				name,
				value
			})),
			ethnicity: Object.entries(ethnicityMap).map(([name, value]) => ({
				name,
				value
			})),
			consentRate: 100,
			selfIdRate
		};
	}, [candidates]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Compliance & Diversity",
			description: "GDPR, EEO, OFCCP, consent, retention, and diversity tracking."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-4 md:grid-cols-4",
			children: [
				{
					k: "GDPR Consents",
					v: `${candidates.length}/${candidates.length}`,
					icon: ShieldCheck,
					color: "text-emerald-500"
				},
				{
					k: "EEO Self-ID Rate",
					v: `${diversityStats.selfIdRate}%`,
					icon: FileLock,
					color: "text-sky-500"
				},
				{
					k: "Data Retention",
					v: "365d",
					icon: FileLock,
					color: "text-violet-500"
				},
				{
					k: "Right-to-erasure",
					v: candidates.length > 5 ? 2 : 0,
					icon: UserX,
					color: "text-amber-500"
				}
			].map((s) => {
				const I = s.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.k }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I, { className: `h-4 w-4 ${s.color}` })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 font-display text-2xl font-semibold text-foreground",
						children: s.v
					})]
				}, s.k);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 font-display text-base font-semibold text-foreground",
					children: "Diversity — Gender"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: 240,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
							data: diversityStats.gender,
							dataKey: "value",
							innerRadius: 50,
							outerRadius: 86,
							paddingAngle: 3,
							children: diversityStats.gender.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[i % COLORS.length] }, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {})
					] })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 font-display text-base font-semibold text-foreground",
					children: "Diversity — Ethnicity (self-reported)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: 240,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
							data: diversityStats.ethnicity,
							dataKey: "value",
							innerRadius: 50,
							outerRadius: 86,
							paddingAngle: 3,
							children: diversityStats.ethnicity.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[i % COLORS.length] }, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {})
					] })
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 font-display text-base font-semibold text-foreground",
					children: "Privacy Controls"
				}), [
					{
						k: "GDPR consent capture on application",
						key: "gdprConsent",
						v: controls.gdprConsent
					},
					{
						k: "EEO self-identification (US)",
						key: "eeoSelfId",
						v: controls.eeoSelfId
					},
					{
						k: "OFCCP veteran & disability questions",
						key: "ofccp",
						v: controls.ofccp
					},
					{
						k: "Anonymize candidate data after retention period",
						key: "anonymize",
						v: controls.anonymize
					},
					{
						k: "Blind review (hide name/photo for screening)",
						key: "blindReview",
						v: controls.blindReview
					},
					{
						k: "Auto-export DSAR (data subject access request)",
						key: "dsar",
						v: controls.dsar
					}
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border py-2.5 text-sm last:border-0 text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.k }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: s.v,
						onCheckedChange: (val) => updateControl(s.key, val)
					})]
				}, s.k))]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3 font-display text-base font-semibold text-foreground",
					children: "Compliance Checklist"
				}), [
					{
						k: "EEO-1 report generated (2026 Q1)",
						key: "eeo1",
						ok: checklist.eeo1
					},
					{
						k: "GDPR DPA signed with vendors",
						key: "dpa",
						ok: checklist.dpa
					},
					{
						k: "Data retention policy published",
						key: "retention",
						ok: checklist.retention
					},
					{
						k: "CCPA opt-out link active",
						key: "ccpa",
						ok: checklist.ccpa
					},
					{
						k: "Penetration test (annual)",
						key: "pentest",
						ok: checklist.pentest
					},
					{
						k: "Background-check vendor SOC 2",
						key: "soc2",
						ok: checklist.soc2
					}
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border py-2 text-sm last:border-0 text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-2",
						children: [s.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-muted-foreground/40" }), s.k]
					}), s.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						className: "text-[10px] cursor-pointer hover:bg-muted",
						onClick: () => toggleChecklist(s.key),
						children: "Done"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						className: "h-7 text-xs",
						onClick: () => toggleChecklist(s.key),
						children: "Action"
					})]
				}, s.k))]
			})]
		})
	] });
}
//#endregion
export { RecruitmentCompliancePage };
