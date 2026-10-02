import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, li as ArrowRight } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { n as posts, t as categories } from "./blog-data-3DVoSlEv.mjs";
import { n as SectionHeader, r as SiteLayout, t as Section } from "./Section-DJoe2-ib.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog.index-DZYiXiXP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BlogIndex() {
	const [query, setQuery] = (0, import_react.useState)("");
	const [cat, setCat] = (0, import_react.useState)("All");
	const filtered = (0, import_react.useMemo)(() => {
		return posts.filter((p) => {
			const matchesCat = cat === "All" || p.category === cat;
			const matchesQ = !query || (p.title + p.excerpt).toLowerCase().includes(query.toLowerCase());
			return matchesCat && matchesQ;
		});
	}, [query, cat]);
	const featured = posts[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteLayout, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
			eyebrow: "Blog",
			title: "Ideas, stories, and product updates",
			subtitle: "Writing from the team building OFC360."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/blog/$slug",
			params: { slug: featured.slug },
			className: "mt-16 grid md:grid-cols-2 gap-6 glass rounded-3xl overflow-hidden group hover:shadow-elegant transition-all",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "aspect-[16/10] md:aspect-auto",
				style: { background: featured.cover }
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-8 flex flex-col justify-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-xs uppercase tracking-widest text-brand font-medium",
						children: ["Featured · ", featured.category]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-2xl sm:text-3xl font-bold mt-3 group-hover:text-gradient transition-colors",
						children: featured.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground mt-3",
						children: featured.excerpt
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 text-sm text-muted-foreground",
						children: [
							featured.author,
							" · ",
							featured.date,
							" · ",
							featured.readTime
						]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-16 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex-1 max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Search articles",
					className: "w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setCat(c),
					className: cn("px-3 py-1.5 rounded-full text-sm transition-colors", cat === c ? "bg-foreground text-background" : "glass hover:bg-secondary"),
					children: c
				}, c))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6",
			children: filtered.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/blog/$slug",
				params: { slug: p.slug },
				className: "group glass rounded-2xl overflow-hidden hover:shadow-elegant transition-all flex flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "aspect-[16/10]",
					style: { background: p.cover }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6 flex-1 flex flex-col",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs uppercase tracking-widest text-brand font-medium",
							children: p.category
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-xl font-bold mt-2 group-hover:text-gradient transition-colors",
							children: p.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground mt-2 flex-1",
							children: p.excerpt
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 text-xs text-muted-foreground flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								p.date,
								" · ",
								p.readTime
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4 group-hover:translate-x-1 transition-transform" })]
						})
					]
				})]
			}, p.slug))
		}),
		filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-center py-20 text-muted-foreground",
			children: "No articles match your search."
		})
	] }) });
}
//#endregion
export { BlogIndex as component };
