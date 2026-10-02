import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Ar as Check } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as SectionHeader, r as SiteLayout, t as Section } from "./Section-DJoe2-ib.mjs";
import { t as CTA } from "./CTA-CtJUg4T2.mjs";
import { t as FAQ } from "./FAQ-d92xYAgI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pricing-CW-AmVOu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var plans = [
	{
		name: "Free",
		tagline: "For individuals exploring OFC360.",
		monthly: 0,
		yearly: 0,
		cta: "Start free",
		features: [
			"Up to 10 members",
			"Unlimited projects",
			"7-day activity history",
			"Community support"
		]
	},
	{
		name: "Pro",
		tagline: "For growing teams that need more.",
		monthly: 12,
		yearly: 10,
		cta: "Start free trial",
		highlight: true,
		features: [
			"Unlimited members",
			"Unlimited history",
			"OFC360 included",
			"Advanced integrations",
			"Priority support"
		]
	},
	{
		name: "Business",
		tagline: "For organizations that ship at scale.",
		monthly: 28,
		yearly: 24,
		cta: "Start free trial",
		features: [
			"Everything in Pro",
			"SSO & SCIM",
			"Audit logs",
			"Custom roles",
			"99.99% uptime SLA"
		]
	},
	{
		name: "Enterprise",
		tagline: "For the largest, most security-conscious teams.",
		monthly: null,
		yearly: null,
		cta: "Contact sales",
		features: [
			"Custom contracts",
			"Dedicated CSM",
			"Custom security review",
			"Volume pricing",
			"24/7 premium support"
		]
	}
];
var comparison = [
	{
		feature: "Members",
		values: [
			"10",
			"Unlimited",
			"Unlimited",
			"Unlimited"
		]
	},
	{
		feature: "Projects",
		values: [
			"Unlimited",
			"Unlimited",
			"Unlimited",
			"Unlimited"
		]
	},
	{
		feature: "OFC360",
		values: [
			"—",
			"Included",
			"Included",
			"Custom"
		]
	},
	{
		feature: "Integrations",
		values: [
			"Basic",
			"Advanced",
			"Advanced",
			"Custom"
		]
	},
	{
		feature: "SSO / SCIM",
		values: [
			"—",
			"—",
			"Yes",
			"Yes"
		]
	},
	{
		feature: "Audit logs",
		values: [
			"—",
			"—",
			"Yes",
			"Yes"
		]
	},
	{
		feature: "Uptime SLA",
		values: [
			"—",
			"99.9%",
			"99.99%",
			"Custom"
		]
	},
	{
		feature: "Support",
		values: [
			"Community",
			"Priority",
			"Priority",
			"24/7 Premium"
		]
	}
];
var faqs = [
	{
		q: "Can I change plans later?",
		a: "Yes. Upgrade, downgrade, or cancel at any time — changes are pro-rated automatically."
	},
	{
		q: "Do you offer discounts for nonprofits or education?",
		a: "We offer 50% off Pro and Business for verified nonprofits and educational institutions."
	},
	{
		q: "Is there a free trial of Pro?",
		a: "Yes. Pro and Business come with a 14-day free trial — no credit card required."
	},
	{
		q: "How does billing work?",
		a: "You'll be billed monthly or annually based on your selection. Annual plans save you ~16%."
	}
];
function PricingPage() {
	const [yearly, setYearly] = (0, import_react.useState)(true);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
				eyebrow: "Pricing",
				title: "Simple pricing that scales with your team",
				subtitle: "Start free. Upgrade when you need to. Cancel anytime."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 flex justify-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-full p-1 inline-flex text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setYearly(false),
						className: cn("px-5 py-2 rounded-full transition-colors", !yearly && "bg-foreground text-background"),
						children: "Monthly"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setYearly(true),
						className: cn("px-5 py-2 rounded-full transition-colors inline-flex items-center gap-2", yearly && "bg-foreground text-background"),
						children: ["Yearly ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs px-2 py-0.5 rounded-full bg-gradient-brand text-brand-foreground",
							children: "-16%"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-5",
				children: plans.map((p) => {
					const price = yearly ? p.yearly : p.monthly;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("relative rounded-3xl p-7 flex flex-col", p.highlight ? "bg-gradient-brand text-brand-foreground shadow-glow" : "glass"),
						children: [
							p.highlight && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-background text-foreground text-xs font-medium border border-border",
								children: "Most popular"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-xl font-bold",
								children: p.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: cn("text-sm mt-1", p.highlight ? "opacity-80" : "text-muted-foreground"),
								children: p.tagline
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6 mb-2",
								children: price === null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-4xl font-bold",
									children: "Custom"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-display text-5xl font-bold",
									children: ["$", price]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: cn("ml-1 text-sm", p.highlight ? "opacity-80" : "text-muted-foreground"),
									children: "/user/mo"
								})] })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#",
								className: cn("mt-4 inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-medium transition-opacity", p.highlight ? "bg-background text-foreground hover:opacity-90" : "bg-foreground text-background hover:opacity-90"),
								children: p.cta
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-7 space-y-3 text-sm",
								children: p.features.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex gap-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: cn("h-4 w-4 mt-0.5 shrink-0", p.highlight ? "" : "text-brand") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: p.highlight ? "" : "text-muted-foreground",
										children: f
									})]
								}, f))
							})
						]
					}, p.name);
				})
			})
		] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			eyebrow: "Comparison",
			title: "Compare every plan"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-12 glass rounded-3xl overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm min-w-[640px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left p-5 font-medium",
							children: "Feature"
						}), plans.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-left p-5 font-medium",
							children: p.name
						}, p.name))]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: comparison.map((row, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: i % 2 ? "bg-secondary/30" : "",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-5 font-medium",
							children: row.feature
						}), row.values.map((v, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-5 text-muted-foreground",
							children: v
						}, j))]
					}, row.feature)) })]
				})
			})
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQ, {
			items: faqs,
			title: "Pricing questions",
			subtitle: "Common questions about our plans."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTA, {})
	] });
}
//#endregion
export { PricingPage as component };
