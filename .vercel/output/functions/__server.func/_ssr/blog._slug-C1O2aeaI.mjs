import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { It as MessageSquare } from "../_libs/lucide-react.mjs";
import { n as posts } from "./blog-data-3DVoSlEv.mjs";
import { t as Route } from "./blog._slug-B3ANgj6D.mjs";
import { r as SiteLayout, t as Section } from "./Section-DJoe2-ib.mjs";
import { t as CTA } from "./CTA-CtJUg4T2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog._slug-C1O2aeaI.js
var import_jsx_runtime = require_jsx_runtime();
function BlogPost() {
	const { post } = Route.useLoaderData();
	const related = posts.filter((p) => p.slug !== post.slug).slice(0, 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteLayout, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			className: "max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs uppercase tracking-widest text-brand font-medium",
					children: post.category
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl sm:text-5xl font-bold tracking-tight leading-tight",
					children: post.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex items-center gap-3 text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-9 w-9 rounded-full bg-gradient-brand grid place-items-center text-brand-foreground font-medium text-xs",
						children: post.author.split(" ").map((n) => n[0]).join("")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-foreground font-medium",
						children: post.author
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						post.authorRole,
						" · ",
						post.date,
						" · ",
						post.readTime
					] })] })]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			className: "max-w-5xl py-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "aspect-[16/8] rounded-3xl shadow-elegant",
				style: { background: post.cover }
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			className: "max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
					className: "prose prose-lg max-w-none space-y-6 text-lg leading-relaxed text-muted-foreground",
					children: post.content.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p }, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-16 glass rounded-2xl p-6 flex items-start gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-14 w-14 rounded-full bg-gradient-brand grid place-items-center text-brand-foreground font-display font-bold",
						children: post.author.split(" ").map((n) => n[0]).join("")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold",
							children: post.author
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-brand",
							children: post.authorRole
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Writing about product, craft, and the future of work at OFC360."
						})
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-display text-xl font-bold flex items-center gap-2 mb-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-5 w-5" }), " Comments (3)"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4",
							children: [
								{
									author: "Tomás Costa",
									time: "2 days ago",
									text: "This resonated. The bit about tight loops vs handoffs is exactly what we're working through."
								},
								{
									author: "Alex Romero",
									time: "4 days ago",
									text: "Would love to see a follow-up with concrete numbers from a few of the teams."
								},
								{
									author: "Yuki Tanaka",
									time: "1 week ago",
									text: "Sharing this with my team — thanks for writing it up so clearly."
								}
							].map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "glass rounded-2xl p-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 mb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-8 w-8 rounded-full bg-gradient-brand grid place-items-center text-brand-foreground text-xs font-medium",
										children: c.author.split(" ").map((n) => n[0]).join("")
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-medium",
										children: c.author
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: c.time
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted-foreground",
									children: c.text
								})]
							}, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 glass rounded-2xl p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								rows: 3,
								placeholder: "Leave a comment…",
								className: "w-full bg-transparent text-sm focus:outline-none resize-none"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex justify-end",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "px-4 py-2 rounded-lg bg-gradient-brand text-brand-foreground text-sm font-medium",
									children: "Post comment"
								})
							})]
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "font-display text-2xl font-bold mb-8",
			children: "Related posts"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid md:grid-cols-3 gap-6",
			children: related.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/blog/$slug",
				params: { slug: p.slug },
				className: "group glass rounded-2xl overflow-hidden hover:shadow-elegant transition-all",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "aspect-[16/10]",
					style: { background: p.cover }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase tracking-widest text-brand font-medium",
						children: p.category
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-lg font-bold mt-2 group-hover:text-gradient transition-colors",
						children: p.title
					})]
				})]
			}, p.slug))
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CTA, {})
	] });
}
//#endregion
export { BlogPost as component };
