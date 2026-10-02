import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $t as Linkedin, C as Twitter, H as Sparkles, I as Sun, Lt as Menu, Sn as Github, a as X, jt as Moon } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as useTheme } from "./ThemeProvider-2CHrEfXV.mjs";
import { t as BackButton } from "./BackButton-CCFK3RCS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Section-DJoe2-ib.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var links = [
	{
		to: "/",
		label: "Home"
	},
	{
		to: "/features",
		label: "Features"
	},
	{
		to: "/pricing",
		label: "Pricing"
	},
	{
		to: "/about",
		label: "About"
	},
	{
		to: "/blog",
		label: "Blog"
	},
	{
		to: "/faq",
		label: "FAQ"
	},
	{
		to: "/contact",
		label: "Contact"
	}
];
function Navbar() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [scrolled, setScrolled] = (0, import_react.useState)(false);
	const { theme, toggle } = useTheme();
	(0, import_react.useEffect)(() => {
		const onScroll = () => setScrolled(window.scrollY > 8);
		onScroll();
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: cn("fixed top-0 inset-x-0 z-50 transition-all duration-300", scrolled ? "py-2" : "py-4"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("flex items-center justify-between rounded-2xl px-4 sm:px-6 py-3 transition-all", scrolled ? "glass shadow-elegant" : "bg-transparent"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-center gap-2 group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-brand blur-md opacity-60 group-hover:opacity-100 transition-opacity" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative h-8 w-8 rounded-lg bg-gradient-brand grid place-items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-brand-foreground" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-xl font-bold tracking-tight",
							children: "OFC360"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "hidden lg:flex items-center gap-1",
						children: links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: l.to,
							activeOptions: { exact: l.to === "/" },
							className: "px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg transition-colors",
							activeProps: { className: "text-foreground bg-secondary" },
							children: l.label
						}, l.to))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/login",
								className: "hidden sm:inline-flex px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg transition-colors",
								children: "Sign in"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/register",
								className: "hidden sm:inline-flex items-center rounded-lg px-3.5 py-2 text-sm font-medium text-brand-foreground shadow-glow transition-transform hover:scale-[1.02]",
								style: { background: "var(--gradient-brand)" },
								children: "Get started"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: toggle,
								"aria-label": "Toggle theme",
								className: "h-9 w-9 grid place-items-center rounded-lg hover:bg-secondary transition-colors",
								children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setOpen(!open),
								"aria-label": "Toggle menu",
								className: "lg:hidden h-9 w-9 grid place-items-center rounded-lg hover:bg-secondary transition-colors",
								children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-4 w-4" })
							})
						]
					})
				]
			}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:hidden mt-2 glass rounded-2xl p-3 animate-fade-up",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex flex-col",
					children: links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: l.to,
						activeOptions: { exact: l.to === "/" },
						onClick: () => setOpen(false),
						className: "px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors",
						activeProps: { className: "text-foreground bg-secondary" },
						children: l.label
					}, l.to))
				})
			})]
		})
	});
}
var cols = [
	{
		title: "Product",
		links: [
			{
				to: "/features",
				label: "Features"
			},
			{
				to: "/pricing",
				label: "Pricing"
			},
			{
				to: "/faq",
				label: "FAQ"
			}
		]
	},
	{
		title: "Company",
		links: [
			{
				to: "/about",
				label: "About"
			},
			{
				to: "/blog",
				label: "Blog"
			},
			{
				to: "/contact",
				label: "Contact"
			}
		]
	},
	{
		title: "Legal",
		links: [{
			to: "/privacy",
			label: "Privacy Policy"
		}, {
			to: "/terms",
			label: "Terms & Conditions"
		}]
	}
];
function Footer() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "relative border-t border-border mt-32",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4 sm:px-6 py-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 md:grid-cols-5 gap-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-8 w-8 rounded-lg bg-gradient-brand grid place-items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-brand-foreground" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-xl font-bold",
								children: "OFC360"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-muted-foreground max-w-xs",
							children: "The modern operating system for teams that ship. Built for speed, designed for clarity."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-2 mt-6",
							children: [
								Twitter,
								Github,
								Linkedin
							].map((Icon, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#",
								className: "h-9 w-9 grid place-items-center rounded-lg border border-border hover:bg-secondary transition-colors",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
							}, i))
						})
					]
				}), cols.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "text-sm font-semibold mb-4",
					children: col.title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3",
					children: col.links.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: l.to,
						className: "text-sm text-muted-foreground hover:text-foreground transition-colors",
						children: l.label
					}) }, l.to))
				})] }, col.title))]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between gap-4 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" OFC360 Inc. All rights reserved."
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Crafted with precision." })]
			})]
		})]
	});
}
function SiteLayout({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen flex flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navbar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "flex-1 pt-24",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackButton, { className: "mb-4" })
				}), children]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Footer, {})
		]
	});
}
function Section({ children, className, id }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id,
		className: cn("mx-auto max-w-7xl px-4 sm:px-6 py-20 sm:py-28", className),
		children
	});
}
function SectionHeader({ eyebrow, title, subtitle, center = true }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("max-w-3xl", center && "mx-auto text-center"),
		children: [
			eyebrow && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-xs font-medium text-muted-foreground mb-5"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-gradient-brand" }), eyebrow]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight",
				children: title
			}),
			subtitle && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed",
				children: subtitle
			})
		]
	});
}
//#endregion
export { SectionHeader as n, SiteLayout as r, Section as t };
