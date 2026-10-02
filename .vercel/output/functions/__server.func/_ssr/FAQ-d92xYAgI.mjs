import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as SectionHeader, t as Section } from "./Section-DJoe2-ib.mjs";
import { i as AccordionTrigger, n as AccordionContent, r as AccordionItem, t as Accordion } from "./accordion-DoiBdWvY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/FAQ-d92xYAgI.js
var import_jsx_runtime = require_jsx_runtime();
function FAQ({ items, title = "Frequently asked questions", subtitle = "Everything you need to know about OFC360.", eyebrow = "FAQ" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
		eyebrow,
		title,
		subtitle
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-12 max-w-3xl mx-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, {
			type: "single",
			collapsible: true,
			className: "space-y-3",
			children: items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, {
				value: `item-${i}`,
				className: "glass rounded-2xl px-5 border-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, {
					className: "text-left font-medium hover:no-underline py-5",
					children: item.q
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, {
					className: "text-muted-foreground leading-relaxed pb-5",
					children: item.a
				})]
			}, i))
		})
	})] });
}
//#endregion
export { FAQ as t };
