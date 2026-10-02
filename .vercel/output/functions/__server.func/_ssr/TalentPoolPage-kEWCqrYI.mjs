import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, F as Tag, H as Sparkles, Qr as BookmarkPlus, R as Star, S as Upload, Zr as Bookmark, _ as UserPlus, a as X, er as Download, jn as Funnel, k as Trash2, p as Users } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as apiInstance } from "./apiInstance-C5A0vaLH.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { n as useRecruitment } from "./useRecruitment-Cuznx8sx.mjs";
import { a as ScoreRing, o as StageBadge, t as CandidateAvatar } from "./Bits-BEiUi0-S.mjs";
import { t as AddCandidateDialog } from "./AddCandidateDialog-D_6Agw5O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/TalentPoolPage-kEWCqrYI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STORAGE_KEY = "ofc360:talent_pool_saved_searches";
function TalentPoolPage() {
	const { candidates, jobs, refreshAll } = useRecruitment();
	const [q, setQ] = (0, import_react.useState)("");
	const [tag, setTag] = (0, import_react.useState)(null);
	const [minScore, setMinScore] = (0, import_react.useState)(0);
	const [showAddModal, setShowAddModal] = (0, import_react.useState)(false);
	const [savedSearches, setSavedSearches] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed)) return parsed;
			}
		} catch {}
		return [];
	});
	const [saveSearchModalOpen, setSaveSearchModalOpen] = (0, import_react.useState)(false);
	const [newSearchName, setNewSearchName] = (0, import_react.useState)("");
	const saveSearchesToStorage = (updated) => {
		setSavedSearches(updated);
		if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
	};
	const handleSaveSearch = (e) => {
		e.preventDefault();
		if (!newSearchName.trim()) {
			toast.error("Please enter a name for this search");
			return;
		}
		const newSearch = {
			id: `ss-${Date.now()}`,
			name: newSearchName.trim(),
			query: q.trim(),
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		saveSearchesToStorage([newSearch, ...savedSearches]);
		setSaveSearchModalOpen(false);
		setNewSearchName("");
		toast.success(`Search "${newSearch.name}" saved successfully`);
	};
	const handleDeleteSearch = (id, e) => {
		e.stopPropagation();
		saveSearchesToStorage(savedSearches.filter((s) => s.id !== id));
		toast.success("Saved search removed");
	};
	const computedSavedSearches = (0, import_react.useMemo)(() => {
		return savedSearches.map((s) => {
			const ql = s.query.toLowerCase().split(" ").filter(Boolean);
			const count = candidates.filter((c) => {
				const text = `${c.name} ${c.appliedPosition} ${c.currentRole} ${c.location} ${c.skills.join(" ")} ${c.tags.join(" ")}`.toLowerCase();
				return ql.every((term) => text.includes(term));
			}).length;
			return {
				...s,
				count
			};
		});
	}, [savedSearches, candidates]);
	const allTags = (0, import_react.useMemo)(() => Array.from(new Set(candidates.flatMap((c) => [...c.skills, ...c.tags]))).slice(0, 28), [candidates]);
	const results = (0, import_react.useMemo)(() => {
		const ql = q.toLowerCase().trim();
		return candidates.filter((c) => {
			if (minScore && (c.atsScore ?? 0) < minScore) return false;
			if (tag && ![...c.skills, ...c.tags].includes(tag)) return false;
			if (!ql) return true;
			const terms = ql.split(" ").filter(Boolean);
			const text = `${c.name} ${c.appliedPosition} ${c.currentRole} ${c.currentCompany} ${c.location} ${c.skills.join(" ")} ${c.tags.join(" ")}`.toLowerCase();
			return terms.every((term) => text.includes(term));
		});
	}, [
		candidates,
		q,
		tag,
		minScore
	]);
	const evaluatedCount = (0, import_react.useMemo)(() => candidates.filter((c) => (c.atsScore ?? 0) > 0).length, [candidates]);
	const avgExp = (0, import_react.useMemo)(() => {
		if (!candidates.length) return 0;
		const total = candidates.reduce((sum, c) => sum + (c.yearsExperience || 0), 0);
		return Math.round(total / candidates.length * 10) / 10;
	}, [candidates]);
	const handleExportCSV = async () => {
		try {
			const response = await apiInstance.get("/candidates/export/csv", { responseType: "blob" });
			const url = window.URL.createObjectURL(new Blob([response.data]));
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", `talent_pool_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`);
			document.body.appendChild(link);
			link.click();
			link.remove();
			toast.success("CSV export downloaded successfully!");
		} catch {
			if (results.length === 0) {
				toast.error("No candidates available to export.");
				return;
			}
			const headers = [
				"Candidate ID",
				"Full Name",
				"Email",
				"Phone",
				"Applied Position",
				"Current Role",
				"Current Company",
				"Location",
				"Experience (Yrs)",
				"Skills",
				"Stage",
				"ATS Score",
				"Source"
			];
			const rows = results.map((c) => [
				c.id,
				c.name,
				c.email,
				c.phone,
				c.appliedPosition,
				c.currentRole,
				c.currentCompany,
				c.location,
				c.yearsExperience,
				c.skills.join("; "),
				c.stage,
				c.atsScore ?? "",
				c.source
			]);
			const csvContent = [headers.join(","), ...rows.map((row) => row.map((val) => `"${String(val ?? "").replace(/"/g, "\"\"")}"`).join(","))].join("\n");
			const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
			const url = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.setAttribute("download", `talent_pool_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`);
			document.body.appendChild(link);
			link.click();
			link.remove();
			toast.success(`Exported ${results.length} talent pool candidates to CSV.`);
		}
	};
	const handleImportCSV = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const fileData = new FormData();
		fileData.append("file", file);
		try {
			const response = await apiInstance.post("/candidates/import", fileData, { headers: { "Content-Type": "multipart/form-data" } });
			if (response.data?.success) {
				toast.success(response.data?.message || "Successfully imported candidates!");
				await refreshAll();
			} else toast.error("Import failed");
		} catch {
			toast.error("Failed to import candidates. Make sure the file format is correct.");
		} finally {
			e.target.value = "";
		}
	};
	const hasActiveFilters = Boolean(q || tag || minScore > 0);
	const resetAllFilters = () => {
		setQ("");
		setTag(null);
		setMinScore(0);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "file",
			id: "csv-import-input",
			accept: ".csv",
			className: "hidden",
			onChange: handleImportCSV
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap items-center justify-end gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => document.getElementById("csv-import-input")?.click(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mr-1.5 h-3.5 w-3.5" }), "Import CSV"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: handleExportCSV,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1.5 h-3.5 w-3.5" }), "Export CSV"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: () => setShowAddModal(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "mr-1.5 h-3.5 w-3.5" }), "Add to Pool"]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-3.5 backdrop-blur-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium",
								children: "Total in Pool"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 font-display text-2xl font-bold",
							children: candidates.length
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-[11px] text-muted-foreground",
							children: "Active candidate profiles"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-3.5 backdrop-blur-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium",
								children: "Filtered Results"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 font-display text-2xl font-bold",
							children: results.length
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-[11px] text-muted-foreground",
							children: hasActiveFilters ? "Matches current filters" : "All records visible"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-3.5 backdrop-blur-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium",
								children: "ATS Evaluated"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 font-display text-2xl font-bold",
							children: evaluatedCount
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-[11px] text-muted-foreground",
							children: candidates.length ? `${Math.round(evaluatedCount / candidates.length * 100)}% of candidates` : "No candidates"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-3.5 backdrop-blur-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium",
								children: "Avg Experience"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 text-amber-500" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 font-display text-2xl font-bold",
							children: [avgExp, "y"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-0.5 text-[11px] text-muted-foreground",
							children: [allTags.length, " distinct skills indexed"]
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-4 lg:grid-cols-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "space-y-4 lg:col-span-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2.5 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "h-4 w-4 text-primary" }), "Saved Searches"]
							}), q.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								size: "sm",
								className: "h-7 px-2 text-xs text-primary hover:text-primary",
								onClick: () => {
									setNewSearchName(q.trim());
									setSaveSearchModalOpen(true);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkPlus, { className: "mr-1 h-3.5 w-3.5" }), "Save"]
							})]
						}), computedSavedSearches.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-dashed border-border/70 p-3.5 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium text-foreground",
								children: "No saved searches"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: "Search by skills or title above and bookmark your favorite queries."
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "space-y-1.5",
							children: computedSavedSearches.map((s) => {
								const isActive = q.toLowerCase() === s.query.toLowerCase();
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "group/item flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setQ(isActive ? "" : s.query),
										className: `flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition-colors text-left ${isActive ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/40 text-muted-foreground hover:text-foreground"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "truncate",
											children: s.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: isActive ? "default" : "secondary",
											className: "ml-2",
											children: s.count
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: (e) => handleDeleteSearch(s.id, e),
										title: "Delete saved search",
										className: "opacity-0 group-hover/item:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-opacity rounded",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
									})]
								}, s.id);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-2.5 flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 text-sm font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-4 w-4 text-primary" }), "Skills & Tags"]
							}), tag && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setTag(null),
								className: "text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2",
								children: "Clear"
							})]
						}), allTags.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "No candidate skills or tags recorded yet."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setTag(null),
								className: `rounded-full px-2.5 py-0.5 text-xs transition-colors ring-1 ${!tag ? "bg-foreground text-background ring-foreground font-medium" : "ring-border hover:bg-accent/40 text-muted-foreground"}`,
								children: [
									"All (",
									candidates.length,
									")"
								]
							}), allTags.map((t) => {
								const tagCount = candidates.filter((c) => [...c.skills, ...c.tags].includes(t)).length;
								const isSelected = tag === t;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setTag(isSelected ? null : t),
									className: `inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs transition-colors ring-1 ${isSelected ? "bg-foreground text-background ring-foreground font-medium" : "ring-border hover:bg-accent/40 text-muted-foreground"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: t }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] opacity-70",
										children: [
											"(",
											tagCount,
											")"
										]
									})]
								}, t);
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-2 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 text-sm font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-4 w-4 text-primary" }), "Min ATS Score"]
								}), minScore > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setMinScore(0),
									className: "text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2",
									children: "Reset"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: 0,
								max: 95,
								step: 5,
								value: minScore,
								onChange: (e) => setMinScore(Number(e.target.value)),
								className: "w-full accent-primary cursor-pointer"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 flex items-center justify-between text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"≥ ",
									minScore,
									" score"
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									candidates.filter((c) => (c.atsScore ?? 0) >= minScore).length,
									" ",
									"candidates"
								] })]
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-3 lg:col-span-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 rounded-xl border border-border bg-card/60 px-3 py-2 backdrop-blur-xl focus-within:ring-1 focus-within:ring-primary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 text-muted-foreground shrink-0" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: q,
								onChange: (e) => setQ(e.target.value),
								placeholder: "Search by candidate name, role, skills, location, or company…",
								className: "border-0 bg-transparent shadow-none focus-visible:ring-0 p-0 h-auto text-sm placeholder:text-muted-foreground"
							}),
							q && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setQ(""),
								className: "p-1 text-muted-foreground hover:text-foreground rounded",
								title: "Clear search",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
							}),
							q.trim() && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "secondary",
								size: "sm",
								className: "h-7 text-xs shrink-0",
								onClick: () => {
									setNewSearchName(q.trim());
									setSaveSearchModalOpen(true);
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookmarkPlus, { className: "mr-1 h-3 w-3" }), "Save Search"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								className: "shrink-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "mr-1 h-3 w-3 text-amber-500" }), "Live Match"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							results.length,
							" candidate",
							results.length === 1 ? "" : "s",
							" found",
							hasActiveFilters ? " (filters active)" : ""
						] }), hasActiveFilters && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: resetAllFilters,
							className: "hover:text-foreground underline underline-offset-2",
							children: "Reset all filters"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-3 md:grid-cols-2",
						children: [results.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard/recruitment/candidates/$candidateId",
							params: { candidateId: c.id },
							className: "group block rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-elegant",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandidateAvatar, { name: c.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "truncate font-semibold group-hover:text-primary transition-colors",
												children: c.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StageBadge, { stage: c.stage })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "truncate text-xs text-muted-foreground mt-0.5",
											children: [
												c.currentRole || c.appliedPosition || "Candidate",
												" ·",
												" ",
												c.location || "Location not specified"
											]
										}),
										c.currentCompany && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "truncate text-[11px] text-muted-foreground/80 mt-0.5",
											children: ["Currently at ", c.currentCompany]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2.5 flex flex-wrap gap-1",
											children: [c.skills.slice(0, 5).map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "secondary",
												className: "text-[10px] px-1.5 py-0 font-normal",
												children: s
											}, s)), c.skills.length > 5 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-[10px] text-muted-foreground self-center",
												children: ["+", c.skills.length - 5]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-3 flex items-center justify-between border-t border-border/50 pt-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5 text-xs text-muted-foreground",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3 text-amber-500" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [c.yearsExperience || 0, "y exp"] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "capitalize",
														children: c.source?.toLowerCase() || "Direct"
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRing, {
												value: c.atsScore,
												size: 40
											})]
										})
									]
								})]
							})
						}, c.id)), candidates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-full rounded-2xl border border-dashed border-border bg-card/30 p-10 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-muted/60 text-muted-foreground mb-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-6 w-6" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-semibold",
									children: "No Candidates in Talent Pool"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground max-w-md mx-auto",
									children: "Your talent pool is currently empty. Add prospective candidates or import a CSV file to build your candidate database."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 flex items-center justify-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => document.getElementById("csv-import-input")?.click(),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mr-1.5 h-3.5 w-3.5" }), "Import CSV"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										onClick: () => setShowAddModal(true),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "mr-1.5 h-3.5 w-3.5" }), "Add Candidate"]
									})]
								})
							]
						}) : results.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-full rounded-2xl border border-dashed border-border bg-card/30 p-10 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-muted/60 text-muted-foreground mb-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-6 w-6" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-semibold",
									children: "No Matching Candidates"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground max-w-md mx-auto",
									children: "No candidates match your current search and filter criteria. Try adjusting your query or resetting filters."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-4 flex items-center justify-center gap-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "sm",
										onClick: resetAllFilters,
										children: "Reset All Filters"
									})
								})
							]
						}) : null]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: saveSearchModalOpen,
			onOpenChange: setSaveSearchModalOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "sm:max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Save Talent Pool Search" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Bookmark this query to quickly filter candidate profiles in the future." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSaveSearch,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-medium text-foreground",
								children: "Search Bookmark Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "e.g. Senior Frontend Specialists",
								value: newSearchName,
								onChange: (e) => setNewSearchName(e.target.value),
								autoFocus: true,
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1 rounded-lg bg-muted/50 p-2.5 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "Search Query: "
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "text-foreground font-mono",
								children: q || "(all candidates)"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setSaveSearchModalOpen(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								children: "Save Search"
							})]
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddCandidateDialog, {
			open: showAddModal,
			onOpenChange: setShowAddModal,
			title: "Add Candidate to Pool",
			description: "Create a new candidate profile to include in the talent pool database.",
			successMessage: "Candidate added to Talent Pool successfully.",
			stage: "screening",
			jobs,
			appliedPositionFallback: "Candidate"
		})
	] });
}
//#endregion
export { TalentPoolPage };
