import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Bt as MapPin, It as MessageSquare, Q as Send, Vt as Mail, vt as Phone } from "../_libs/lucide-react.mjs";
import { n as toast, t as Toaster } from "../_libs/sonner.mjs";
import { n as SectionHeader, r as SiteLayout, t as Section } from "./Section-DJoe2-ib.mjs";
import { t as CTA } from "./CTA-CtJUg4T2.mjs";
import { t as FAQ } from "./FAQ-d92xYAgI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/contact-0K0EnfRj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
var offices = [
	{
		city: "Lisbon",
		region: "HQ · Europe",
		address: "Rua Augusta 100, Lisbon, Portugal"
	},
	{
		city: "San Francisco",
		region: "Americas",
		address: "535 Mission St, San Francisco, CA"
	},
	{
		city: "Singapore",
		region: "APAC",
		address: "1 Raffles Place, Singapore"
	}
];
var faqs = [
	{
		q: "How quickly will you respond?",
		a: "Within one business day, usually faster."
	},
	{
		q: "Do you offer demos?",
		a: "Yes — pick a time on the form and we'll set up a live walkthrough tailored to your team."
	},
	{
		q: "Is there a phone number?",
		a: "Yes, our sales team is reachable at +1 (415) 555-0142 during business hours PT."
	}
];
function ContactPage() {
	const [sending, setSending] = (0, import_react.useState)(false);
	function onSubmit(e) {
		e.preventDefault();
		setSending(true);
		setTimeout(() => {
			setSending(false);
			toast.success("Message sent — we'll be in touch shortly.");
			e.target.reset();
		}, 800);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			eyebrow: "Contact",
			title: "Let's talk",
			subtitle: "Tell us what you're building and we'll get back to you within a business day."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-16 grid lg:grid-cols-5 gap-8",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "lg:col-span-3 glass rounded-3xl p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid sm:grid-cols-2 gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Full name",
								name: "name",
								placeholder: "Jane Doe",
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Work email",
								name: "email",
								type: "email",
								placeholder: "jane@company.com",
								required: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Company",
								name: "company",
								placeholder: "Acme Inc"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Team size",
								name: "size",
								placeholder: "1-10, 11-50…"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-sm font-medium",
							children: "Message"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							name: "message",
							rows: 5,
							required: true,
							placeholder: "Tell us what you're hoping to do with OFC360…",
							className: "mt-2 w-full rounded-xl bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "submit",
						disabled: sending,
						className: "mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-brand text-brand-foreground font-medium shadow-glow hover:opacity-90 transition-opacity disabled:opacity-60",
						children: [
							sending ? "Sending…" : "Send message",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-2 space-y-4",
				children: [
					{
						icon: Mail,
						label: "Email",
						value: "hello@ofc360.com"
					},
					{
						icon: Phone,
						label: "Phone",
						value: "+1 (415) 555-0142"
					},
					{
						icon: MessageSquare,
						label: "Sales",
						value: "sales@ofc360.com"
					},
					{
						icon: MapPin,
						label: "Headquarters",
						value: "Lisbon, Portugal"
					}
				].map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "glass rounded-2xl p-5 flex items-start gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-10 w-10 shrink-0 rounded-xl bg-gradient-brand grid place-items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(b.icon, { className: "h-4 w-4 text-brand-foreground" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: b.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: b.value
					})] })]
				}, b.label))
			})]
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			eyebrow: "Offices",
			title: "Where you'll find us"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-12 grid md:grid-cols-3 gap-5",
			children: offices.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "glass rounded-2xl p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm text-brand",
						children: o.region
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-2xl font-bold mt-1",
						children: o.city
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-3",
						children: o.address
					})
				]
			}, o.city))
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQ, { items: faqs }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTA, {})
	] });
}
function Field({ label, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "text-sm font-medium",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		...props,
		className: "mt-2 w-full rounded-xl bg-background border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
	})] });
}
//#endregion
export { ContactPage as component };
