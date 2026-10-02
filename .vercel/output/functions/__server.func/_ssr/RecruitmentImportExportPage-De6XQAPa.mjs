import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Ln as FileText, Rn as FileSpreadsheet, S as Upload, Sr as CircleCheck, er as Download } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { r as PageHeader } from "./DashboardShell-DIr27KpW.mjs";
import { n as useRecruitment } from "./useRecruitment-Cuznx8sx.mjs";
import { t as require_papaparse } from "../_libs/papaparse.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/RecruitmentImportExportPage-De6XQAPa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_papaparse = /* @__PURE__ */ __toESM(require_papaparse());
var REQUIRED = [
	"name",
	"email",
	"appliedPosition"
];
var OPTIONAL = [
	"phone",
	"location",
	"source",
	"skills",
	"yearsExperience"
];
function RecruitmentImportExportPage() {
	const candidates = useRecruitment((s) => s.candidates);
	const [rows, setRows] = (0, import_react.useState)([]);
	const [mapping, setMapping] = (0, import_react.useState)({});
	const [step, setStep] = (0, import_react.useState)(1);
	function onFile(file) {
		import_papaparse.default.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: (res) => {
				setRows(res.data);
				const headers = res.meta.fields ?? [];
				const auto = {};
				[...REQUIRED, ...OPTIONAL].forEach((f) => {
					const m = headers.find((h) => h.toLowerCase().replace(/[^a-z]/g, "") === f.toLowerCase().replace(/[^a-z]/g, ""));
					if (m) auto[f] = m;
				});
				setMapping(auto);
				setStep(2);
			}
		});
	}
	function exportCsv() {
		const csv = import_papaparse.default.unparse(candidates.map((c) => ({
			id: c.id,
			name: c.name,
			email: c.email,
			phone: c.phone,
			position: c.appliedPosition,
			stage: c.stage,
			ats: c.atsScore,
			skills: c.skills.join("|"),
			source: c.source
		})));
		const blob = new Blob([csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `candidates-${Date.now()}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	}
	function exportJson() {
		const blob = new Blob([JSON.stringify(candidates, null, 2)], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `candidates-${Date.now()}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Import & Export",
		description: "Bulk move candidates in and out of OFC360 — CSV, Excel, JSON."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 gap-4 lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border bg-card p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 inline-flex items-center gap-2 font-display text-base font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }), " Candidate Import Wizard"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mb-3 flex items-center gap-2 text-[11px]",
					children: [
						"Upload CSV",
						"Map fields",
						"Review & import"
					].map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: `inline-flex items-center gap-1 ${step >= i + 1 ? "text-foreground" : "text-muted-foreground"}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `grid h-5 w-5 place-items-center rounded-full text-[10px] ${step >= i + 1 ? "bg-foreground text-background" : "bg-accent"}`,
								children: i + 1
							}),
							s,
							i < 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mx-1 text-muted-foreground",
								children: "›"
							}) : null
						]
					}, s))
				}),
				step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-8 text-sm text-muted-foreground hover:bg-accent/30",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mb-2 h-6 w-6" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Drop CSV here or click to upload" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: ".csv",
							className: "hidden",
							onChange: (e) => e.target.files?.[0] && onFile(e.target.files[0])
						})
					]
				}),
				step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								"Parsed ",
								rows.length,
								" rows. Map your columns:"
							]
						}),
						[...REQUIRED, ...OPTIONAL].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "w-40 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: f
								}), REQUIRED.includes(f) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-destructive",
									children: " *"
								}) : null]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "flex-1 rounded-md border border-border bg-background p-1.5 text-xs",
								value: mapping[f] ?? "",
								onChange: (e) => setMapping((m) => ({
									...m,
									[f]: e.target.value
								})),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "— Skip —"
								}), Object.keys(rows[0] ?? {}).map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: h,
									children: h
								}, h))]
							})]
						}, f)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setStep(1),
								children: "Back"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => setStep(3),
								disabled: REQUIRED.some((f) => !mapping[f]),
								children: "Continue"
							})]
						})
					]
				}),
				step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 inline-flex items-center gap-2 text-sm text-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-primary" }),
							" Ready to import ",
							rows.length,
							" candidates."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "max-h-56 overflow-auto rounded-lg border border-border text-xs",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-muted/40",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: REQUIRED.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-1 text-left",
									children: f
								}, f)) })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.slice(0, 8).map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
								className: "border-t border-border",
								children: REQUIRED.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-1",
									children: r[mapping[f]] || "—"
								}, f))
							}, i)) })]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setStep(2),
							children: "Back"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => {
								setStep(1);
								setRows([]);
								setMapping({});
							},
							children: [
								"Import ",
								rows.length,
								" candidates"
							]
						})]
					})
				] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border bg-card p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 inline-flex items-center gap-2 font-display text-base font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), " Export"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-lg border border-border p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-4 w-4 text-primary" }),
									"Candidates CSV",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										children: candidates.length
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: exportCsv,
								children: "Download"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-lg border border-border p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-primary" }), "Candidates JSON"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: exportJson,
								children: "Download"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-lg border border-border p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-4 w-4 text-primary" }), "Excel report (.xlsx)"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								disabled: true,
								children: "Coming soon"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-lg border border-border p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "inline-flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-primary" }), "Hiring summary PDF"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								disabled: true,
								children: "Coming soon"
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 rounded-xl border border-border p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-2 text-sm font-semibold",
							children: "Bulk Actions"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-2 text-xs",
							children: [
								"Bulk Email",
								"Move Stage",
								"Add Tags",
								"Archive",
								"Reject",
								"Assign Recruiter"
							].map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								className: "justify-start",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: b
								})
							}, b))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-2",
							placeholder: "Paste candidate IDs (comma-separated) for bulk action"
						})
					]
				})
			]
		})]
	})] });
}
//#endregion
export { RecruitmentImportExportPage };
