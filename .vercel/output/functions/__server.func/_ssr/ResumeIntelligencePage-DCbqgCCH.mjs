import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { En as GitCompareArrows, H as Sparkles, S as Upload, T as TriangleAlert, mn as History, nt as ScanLine, zn as FileSearch } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Progress } from "./progress-ZynOkOPX.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as api } from "./apiInstance-C5A0vaLH.mjs";
import { r as PageHeader } from "./DashboardShell-DIr27KpW.mjs";
import { n as useRecruitment } from "./useRecruitment-Cuznx8sx.mjs";
import { t as CandidateAvatar } from "./Bits-BEiUi0-S.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ResumeIntelligencePage-DCbqgCCH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ResumeIntelligencePage() {
	const { candidates, refreshAll } = useRecruitment();
	const [q, setQ] = (0, import_react.useState)("");
	const [compareIds, setCompareIds] = (0, import_react.useState)([]);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	async function handleFileUpload(e) {
		const file = e.target.files?.[0];
		if (!file) return;
		setUploading(true);
		const toastId = toast.loading("Uploading and parsing resume with AI...");
		try {
			const formData = new FormData();
			formData.append("file", file);
			formData.append("generate_embedding", "true");
			await api.post("/resume-parser/upload-and-parse", formData);
			toast.success("Resume parsed successfully and candidate added!", { id: toastId });
			await refreshAll();
		} catch (error) {
			console.error("Resume parsing error:", error);
			toast.error(error.message || "Failed to parse resume.", { id: toastId });
		} finally {
			setUploading(false);
			e.target.value = "";
		}
	}
	const duplicates = (0, import_react.useMemo)(() => {
		const groups = {};
		candidates.forEach((c) => {
			const key = `${c.name.toLowerCase().replace(/\s+/g, "")}|${c.email.split("@")[0]}`;
			(groups[key] ||= []).push(c);
		});
		return Object.values(groups).filter((g) => g.length > 1);
	}, [candidates]);
	const filtered = candidates.filter((c) => !q || c.name.toLowerCase().includes(q.toLowerCase()) || c.skills.join(" ").toLowerCase().includes(q.toLowerCase())).slice(0, 18);
	const allSkills = Array.from(new Set(candidates.flatMap((c) => c.skills)));
	function toggleCompare(id) {
		setCompareIds((arr) => arr.includes(id) ? arr.filter((x) => x !== id) : arr.length < 3 ? [...arr, id] : arr);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "file",
			id: "resume-upload-input",
			className: "hidden",
			accept: ".pdf,.docx,.doc,.txt",
			onChange: handleFileUpload,
			disabled: uploading
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Resume Intelligence",
			description: "Parsing, duplicate detection, skill extraction, OCR, and version history.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => document.getElementById("resume-upload-input")?.click(),
				disabled: uploading,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mr-2 h-4 w-4" }), uploading ? "Parsing..." : "Upload Resumes"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-4 md:grid-cols-4",
			children: [
				{
					k: "Parsed Resumes",
					v: candidates.length,
					icon: ScanLine
				},
				{
					k: "Duplicates Found",
					v: duplicates.length,
					icon: TriangleAlert
				},
				{
					k: "Unique Skills",
					v: allSkills.length,
					icon: Sparkles
				},
				{
					k: "OCR Processed",
					v: Math.round(candidates.length * .62),
					icon: FileSearch
				}
			].map((s) => {
				const I = s.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.k }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I, { className: "h-4 w-4" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 font-display text-2xl font-semibold",
						children: s.v
					})]
				}, s.k);
			})
		}),
		duplicates.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 inline-flex items-center gap-2 text-sm font-semibold",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-amber-500" }), " Duplicate Candidates Detected"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: duplicates.slice(0, 5).map((g, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 rounded-lg border border-border bg-card/40 p-2 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "outline",
							children: [g.length, " matches"]
						}),
						g.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandidateAvatar, {
								name: c.name,
								size: 20
							}), c.name]
						}, c.id)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							className: "ml-auto h-7",
							children: "Merge"
						})
					]
				}, i))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-base font-semibold",
						children: "Parsed Candidates"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Search by name or skill…",
						value: q,
						onChange: (e) => setQ(e.target.value),
						className: "max-w-xs"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: filtered.map((c) => {
						const missing = [
							"React",
							"TypeScript",
							"AWS",
							"Python",
							"Node.js"
						].filter((r) => !c.skills.includes(r));
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 rounded-xl border border-border bg-card/40 p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: compareIds.includes(c.id),
									onChange: () => toggleCompare(c.id),
									"aria-label": `Compare ${c.name}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandidateAvatar, {
									name: c.name,
									size: 32
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-sm font-medium",
										children: c.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 flex flex-wrap gap-1",
										children: [c.skills.slice(0, 5).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "secondary",
											className: "text-[10px]",
											children: s
										}, s)), missing.slice(0, 2).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
											variant: "outline",
											className: "border-rose-500/30 text-[10px] text-rose-600",
											children: ["missing ", m]
										}, m))]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "hidden text-right md:block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-[10px] text-muted-foreground",
										children: "Experience"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-sm font-semibold",
										children: [c.yearsExperience, "y"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "outline",
									className: "h-7",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "mr-1 h-3 w-3" }),
										"v",
										c.id.split("").reduce((a, ch) => a + ch.charCodeAt(0), 0) % 4 + 1
									]
								})
							]
						}, c.id);
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 inline-flex items-center gap-2 text-sm font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GitCompareArrows, { className: "h-4 w-4" }), " Resume Comparison"]
					}), compareIds.length < 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "Select 2-3 candidates to compare."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: compareIds.map((id) => {
							const c = candidates.find((x) => x.id === id);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg border border-border p-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: c.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 grid grid-cols-2 gap-1 text-[11px]",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "ATS" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
											value: c.atsScore,
											className: "h-1.5"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Match" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
											value: c.jobMatch,
											className: "h-1.5"
										})
									]
								})]
							}, id);
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 text-sm font-semibold",
						children: "Top Extracted Skills"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-1",
						children: allSkills.slice(0, 24).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							className: "text-[10px]",
							children: s
						}, s))
					})]
				})]
			})]
		})
	] });
}
//#endregion
export { ResumeIntelligencePage };
