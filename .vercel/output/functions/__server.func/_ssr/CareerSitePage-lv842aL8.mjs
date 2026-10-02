import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Et as Palette, Jn as Eye, Xn as ExternalLink, Y as Share2, at as Save, xn as Globe } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { r as PageHeader } from "./DashboardShell-DIr27KpW.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { n as useRecruitment } from "./useRecruitment-Cuznx8sx.mjs";
import { t as Switch } from "./switch-C_mzcXif.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CareerSitePage-lv842aL8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CareerSitePage() {
	const allJobs = useRecruitment((s) => s.jobs);
	const jobs = (0, import_react.useMemo)(() => allJobs.filter((j) => j.status === "active"), [allJobs]);
	const [brand, setBrand] = (0, import_react.useState)("OFC360");
	const [tagline, setTagline] = (0, import_react.useState)("Build the future of work with us.");
	const [accent, setAccent] = (0, import_react.useState)("#7c5cff");
	const [showSalary, setShowSalary] = (0, import_react.useState)(true);
	const [allowReferrals, setAllowReferrals] = (0, import_react.useState)(true);
	const [eeoStatement, setEeoStatement] = (0, import_react.useState)("We're an equal opportunity employer. We celebrate diversity and are committed to creating an inclusive environment for all employees.");
	(0, import_react.useEffect)(() => {
		try {
			if (typeof window !== "undefined" && window.localStorage) {
				const savedBrand = window.localStorage.getItem("ofc360.careers.brand");
				if (savedBrand) setBrand(savedBrand);
				const savedTagline = window.localStorage.getItem("ofc360.careers.tagline");
				if (savedTagline) setTagline(savedTagline);
				const savedAccent = window.localStorage.getItem("ofc360.careers.accent");
				if (savedAccent) setAccent(savedAccent);
				const savedShowSalary = window.localStorage.getItem("ofc360.careers.showSalary");
				if (savedShowSalary !== null) setShowSalary(savedShowSalary === "true");
				const savedAllowReferrals = window.localStorage.getItem("ofc360.careers.allowReferrals");
				if (savedAllowReferrals !== null) setAllowReferrals(savedAllowReferrals === "true");
				const savedEeo = window.localStorage.getItem("ofc360.careers.eeoStatement");
				if (savedEeo) setEeoStatement(savedEeo);
			}
		} catch (e) {
			console.warn("localStorage is not accessible:", e);
		}
	}, []);
	const handleSave = () => {
		if (typeof window !== "undefined") {
			window.localStorage.setItem("ofc360.careers.brand", brand);
			window.localStorage.setItem("ofc360.careers.tagline", tagline);
			window.localStorage.setItem("ofc360.careers.accent", accent);
			window.localStorage.setItem("ofc360.careers.showSalary", String(showSalary));
			window.localStorage.setItem("ofc360.careers.allowReferrals", String(allowReferrals));
			window.localStorage.setItem("ofc360.careers.eeoStatement", eeoStatement);
			toast.success("Career site configuration saved successfully!");
		}
	};
	const handleCopyUrl = () => {
		if (typeof window !== "undefined") {
			const slug = brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
			const url = `${window.location.origin}/careers/${slug}`;
			navigator.clipboard.writeText(url);
			toast.success(`Copied career site URL: ${url}`);
		}
	};
	const handleOpenLive = () => {
		if (typeof window !== "undefined") {
			const slug = brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
			const url = `${window.location.origin}/careers/${slug}`;
			window.open(url, "_blank");
			toast.info("Opening live public job board (simulated)...");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Career Site",
		description: "Your public-facing job board. Branding, settings, and live preview.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: handleSave,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-2 h-4 w-4" }), "Save Settings"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: handleCopyUrl,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, { className: "mr-2 h-4 w-4" }), "Copy URL"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: handleOpenLive,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "mr-2 h-4 w-4" }), "Open Live"]
			})
		] })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 gap-4 lg:grid-cols-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 lg:col-span-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center gap-2 text-sm font-semibold text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { className: "h-4 w-4 text-primary" }), "Branding"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Company name",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: brand,
								onChange: (e) => setBrand(e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Tagline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: tagline,
								onChange: (e) => setTagline(e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Accent color",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "color",
									value: accent,
									onChange: (e) => setAccent(e.target.value),
									className: "h-9 w-12 rounded-md border border-border bg-background cursor-pointer"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: accent,
									onChange: (e) => setAccent(e.target.value),
									className: "font-mono text-xs"
								})]
							})
						})
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center gap-2 text-sm font-semibold text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-4 w-4 text-primary" }), "Visibility & Compliance"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Show salary ranges",
							checked: showSalary,
							onCheckedChange: setShowSalary
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toggle, {
							label: "Allow employee referrals from public page",
							checked: allowReferrals,
							onCheckedChange: setAllowReferrals
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "EEO statement",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 4,
								value: eeoStatement,
								onChange: (e) => setEeoStatement(e.target.value)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									children: "GDPR consent"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									children: "CCPA notice"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									children: "WCAG AA"
								})
							]
						})
					]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg:col-span-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center gap-2 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }), "Live preview"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-2xl border border-border bg-background shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-8",
						style: { background: `linear-gradient(135deg, ${accent}22, transparent 60%)` },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs font-semibold uppercase tracking-wider",
								style: { color: accent },
								children: ["Careers at ", brand]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-2 font-display text-3xl font-semibold tracking-tight text-foreground",
								children: tagline
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 max-w-xl text-sm text-muted-foreground",
								children: [
									"Join ",
									jobs.length,
									" open roles across engineering, design, sales and operations. Remote-friendly with offices in SF, London and Berlin."
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "divide-y divide-border",
						children: [jobs.slice(0, 6).map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3 p-4 hover:bg-accent/20",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate font-semibold text-foreground text-sm",
									children: j.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "truncate text-xs text-muted-foreground",
									children: [
										j.department,
										" · ",
										j.location,
										" · ",
										j.workMode
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [showSalary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "hidden text-xs text-muted-foreground sm:inline font-medium",
									children: [
										"INR ",
										(j.salaryMin / 1e3).toFixed(0),
										"k–",
										(j.salaryMax / 1e3).toFixed(0),
										"k"
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									style: {
										background: accent,
										color: "white"
									},
									children: "Apply"
								})]
							})]
						}, j.id)), !jobs.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "p-6 text-center text-sm text-muted-foreground",
							children: "No active roles right now."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "border-t border-border p-4 text-[11px] text-muted-foreground leading-relaxed",
						children: eeoStatement
					})
				]
			})]
		})]
	})] });
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "mb-1 block text-xs font-semibold text-muted-foreground",
		children: label
	}), children] });
}
function Toggle({ label, checked, onCheckedChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex items-center justify-between gap-3 rounded-lg border border-border bg-background/60 p-2 text-sm text-foreground cursor-pointer hover:bg-accent/10 transition-colors",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
			checked,
			onCheckedChange
		})]
	});
}
//#endregion
export { CareerSitePage };
