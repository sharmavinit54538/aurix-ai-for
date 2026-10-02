import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { r as SiteLayout, t as Section } from "./Section-DJoe2-ib.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/terms-BKovT3dx.js
var import_jsx_runtime = require_jsx_runtime();
var sections = [
	{
		h: "1. Acceptance of terms",
		p: "By accessing or using OFC360, you agree to be bound by these Terms & Conditions and our Privacy Policy. If you do not agree, do not use the service."
	},
	{
		h: "2. Use of the service",
		p: "You may use OFC360 only in compliance with these terms and all applicable laws. You are responsible for the activities that occur under your account."
	},
	{
		h: "3. Accounts",
		p: "You must provide accurate information when creating an account and keep your credentials confidential. You are responsible for all activity on your account."
	},
	{
		h: "4. Subscriptions and billing",
		p: "Paid plans are billed in advance on a recurring basis. Fees are non-refundable except where required by law."
	},
	{
		h: "5. Acceptable use",
		p: "You agree not to misuse the service, including but not limited to: reverse engineering, distributing malware, infringing intellectual property, or harassing other users."
	},
	{
		h: "6. Intellectual property",
		p: "OFC360 retains all rights in the service. You retain all rights to content you create. You grant us a limited license to host and display your content as needed to provide the service."
	},
	{
		h: "7. Termination",
		p: "We may suspend or terminate your account for violations of these terms. You may cancel your account at any time."
	},
	{
		h: "8. Disclaimers",
		p: "The service is provided \"as is\" without warranties of any kind. To the maximum extent permitted by law, OFC360 disclaims all warranties, express or implied."
	},
	{
		h: "9. Limitation of liability",
		p: "OFC360's liability is limited to the fees you paid in the twelve months prior to the event giving rise to the claim."
	},
	{
		h: "10. Changes to terms",
		p: "We may modify these terms from time to time. Continued use of the service constitutes acceptance of the modified terms."
	},
	{
		h: "11. Governing law",
		p: "These terms are governed by the laws of Portugal, without regard to its conflict of law principles."
	},
	{
		h: "12. Contact",
		p: "Questions about these terms? Contact legal@ofc360.com."
	}
];
function TermsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
		className: "max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-brand font-medium",
				children: "Legal"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl sm:text-5xl font-bold tracking-tight",
				children: "Terms & Conditions"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-muted-foreground",
				children: "Last updated: June 1, 2026"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 space-y-10",
				children: sections.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-bold",
					children: s.h
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-muted-foreground leading-relaxed",
					children: s.p
				})] }, s.h))
			})
		]
	}) });
}
//#endregion
export { TermsPage as component };
