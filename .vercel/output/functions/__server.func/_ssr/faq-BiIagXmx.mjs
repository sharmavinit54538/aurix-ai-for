import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as SectionHeader, r as SiteLayout, t as Section } from "./Section-DJoe2-ib.mjs";
import { t as CTA } from "./CTA-CtJUg4T2.mjs";
import { i as AccordionTrigger, n as AccordionContent, r as AccordionItem, t as Accordion } from "./accordion-DoiBdWvY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/faq-BiIagXmx.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var groups = [
	{
		name: "Product",
		items: [
			{
				q: "What is OFC360?",
				a: "OFC360 is a unified workspace for product teams — combining planning, execution, and analytics in one fast interface."
			},
			{
				q: "What platforms does it run on?",
				a: "We have native macOS, Windows, iOS, and Android apps, plus a web app that runs anywhere."
			},
			{
				q: "Can I use it offline?",
				a: "Yes — OFC360 is local-first. Your data is available offline and syncs when you're back online."
			}
		]
	},
	{
		name: "Pricing & billing",
		items: [
			{
				q: "Is there a free plan?",
				a: "Yes. Our Free plan supports up to 10 members and is generous enough for most early-stage teams."
			},
			{
				q: "Can I change plans later?",
				a: "Anytime — upgrades and downgrades are pro-rated automatically."
			},
			{
				q: "Do you offer discounts?",
				a: "Yes, 50% off for verified nonprofits and educational institutions."
			}
		]
	},
	{
		name: "Security",
		items: [
			{
				q: "Is OFC360 SOC 2 certified?",
				a: "We are SOC 2 Type II certified and undergo annual audits."
			},
			{
				q: "Do you support SSO?",
				a: "Yes — SAML SSO and SCIM provisioning are available on Business and Enterprise plans."
			},
			{
				q: "Where is my data stored?",
				a: "You can choose between US, EU, or APAC regions. Data is encrypted in transit and at rest."
			}
		]
	},
	{
		name: "Integrations",
		items: [
			{
				q: "Does OFC360 integrate with GitHub?",
				a: "Yes — bi-directional sync with GitHub, GitLab, Bitbucket, and others."
			},
			{
				q: "Can I bring my data from another tool?",
				a: "We support one-click migration from Jira, Linear, Asana, and Notion."
			},
			{
				q: "Do you have a public API?",
				a: "Yes — fully documented REST and GraphQL APIs, plus webhooks for every event."
			}
		]
	}
];
function FAQPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const [tab, setTab] = (0, import_react.useState)(groups[0].name);
	const visible = (0, import_react.useMemo)(() => {
		if (!q) return groups;
		return groups.map((g) => ({
			...g,
			items: g.items.filter((i) => (i.q + i.a).toLowerCase().includes(q.toLowerCase()))
		})).filter((g) => g.items.length);
	}, [q]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			eyebrow: "Help center",
			title: "Frequently asked questions",
			subtitle: "Quick answers to the questions our team hears most."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-10 max-w-2xl mx-auto relative",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: q,
				onChange: (e) => setQ(e.target.value),
				placeholder: "Search questions",
				className: "w-full pl-11 pr-4 py-3.5 rounded-2xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
			})]
		}),
		!q && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8 flex flex-wrap justify-center gap-2",
			children: groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => {
					setTab(g.name);
					document.getElementById(`g-${g.name}`)?.scrollIntoView({
						behavior: "smooth",
						block: "start"
					});
				},
				className: cn("px-4 py-2 rounded-full text-sm transition-colors", tab === g.name ? "bg-foreground text-background" : "glass hover:bg-secondary"),
				children: g.name
			}, g.name))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-12 max-w-3xl mx-auto space-y-12",
			children: [visible.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				id: `g-${g.name}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-xl font-bold mb-4",
					children: g.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
					type: "single",
					collapsible: true,
					className: "space-y-3",
					children: g.items.map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
						value: `${g.name}-${i}`,
						className: "glass rounded-2xl px-5 border-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
							className: "text-left font-medium hover:no-underline py-5",
							children: it.q
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, {
							className: "text-muted-foreground leading-relaxed pb-5",
							children: it.a
						})]
					}, i))
				})]
			}, g.name)), visible.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-muted-foreground",
				children: "No questions match your search."
			})]
		})
	] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTA, {
		title: "Still have questions?",
		subtitle: "Our team is happy to help — usually within a few hours."
	})] });
}
//#endregion
export { FAQPage as component };
