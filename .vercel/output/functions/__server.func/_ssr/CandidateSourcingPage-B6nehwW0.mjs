import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, Jn as Eye, Q as Send, S as Upload, ht as Plus, p as Users, si as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { n as useRecruitment, t as newId } from "./useRecruitment-Cuznx8sx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CandidateSourcingPage-B6nehwW0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var BASE_SOURCES = [
	{
		name: "LinkedIn Recruiter",
		type: "LinkedIn",
		color: "from-blue-600 to-sky-500",
		desc: "InMail outreach to senior passive talent & tech leads."
	},
	{
		name: "Naukri Resdex",
		type: "Naukri",
		color: "from-indigo-600 to-violet-500",
		desc: "Active jobseekers database across Tier-1 Indian tech hubs."
	},
	{
		name: "GitHub & Open Source",
		type: "GitHub",
		color: "from-zinc-800 to-zinc-600",
		desc: "Source high-impact developers from repo commits & stars."
	},
	{
		name: "Employee Referral Portal",
		type: "Referral",
		color: "from-emerald-600 to-teal-500",
		desc: "Internal network sourcing with referral bonuses."
	},
	{
		name: "Agency & Search Partners",
		type: "Agency",
		color: "from-amber-600 to-orange-500",
		desc: "Specialized staffing partners for executive & niche roles."
	},
	{
		name: "Inbound Career Site",
		type: "Career Site",
		color: "from-fuchsia-600 to-pink-500",
		desc: "Organic applicant inflow through ofc360.com/careers."
	}
];
function CandidateSourcingPage() {
	const { candidates, upsertCandidate, jobs } = useRecruitment();
	const [sourcedList, setSourcedList] = (0, import_react.useState)(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("ofc360:sourced_candidates");
			if (saved) try {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed)) {
					const clean = parsed.filter((c) => ![
						"src-101",
						"src-102",
						"src-103",
						"src-104"
					].includes(c.id));
					if (clean.length !== parsed.length) localStorage.setItem("ofc360:sourced_candidates", JSON.stringify(clean));
					return clean;
				}
			} catch {}
		}
		return [];
	});
	const sources = (0, import_react.useMemo)(() => {
		return BASE_SOURCES.map((s) => {
			const fromSourced = sourcedList.filter((c) => c.source === s.type);
			const fromCandidates = candidates.filter((c) => c.source === s.type);
			const totalProspects = fromSourced.length;
			const converted = fromSourced.filter((c) => c.status === "Converted to Applicant").length + fromCandidates.length;
			const totalAll = totalProspects + fromCandidates.length;
			const convRate = totalAll > 0 ? `${Math.round(converted / totalAll * 100)}%` : "0%";
			return {
				...s,
				activeSourced: totalProspects,
				conversionRate: convRate
			};
		});
	}, [sourcedList, candidates]);
	const [search, setSearch] = (0, import_react.useState)("");
	const [filterSource, setFilterSource] = (0, import_react.useState)("all");
	const [filterStatus, setFilterStatus] = (0, import_react.useState)("all");
	const [showUploadModal, setShowUploadModal] = (0, import_react.useState)(false);
	const [showOutreachModal, setShowOutreachModal] = (0, import_react.useState)(false);
	const [selectedCandidate, setSelectedCandidate] = (0, import_react.useState)(null);
	const [composerChannel, setComposerChannel] = (0, import_react.useState)("Email");
	const [composerSubject, setComposerSubject] = (0, import_react.useState)("");
	const [composerBody, setComposerBody] = (0, import_react.useState)("");
	const [importSource, setImportSource] = (0, import_react.useState)("LinkedIn");
	const [importTargetRole, setImportTargetRole] = (0, import_react.useState)(jobs[0]?.title || "");
	const [importRawNames, setImportRawNames] = (0, import_react.useState)("");
	const saveSourced = (data) => {
		setSourcedList(data);
		if (typeof window !== "undefined") localStorage.setItem("ofc360:sourced_candidates", JSON.stringify(data));
	};
	const handleOpenOutreach = (cand) => {
		setSelectedCandidate(cand);
		setComposerChannel(cand.channel);
		setComposerSubject(`Career Opportunity: ${cand.targetRole} role`);
		setComposerBody(`Hi ${cand.name.split(" ")[0]},\n\nI came across your profile on ${cand.source} and was very impressed by your track record. We are expanding our team and looking for a ${cand.targetRole}.\n\nWould you be open for a brief 15-minute introductory call this week to explore this?\n\nBest regards,\nTalent Acquisition Team`);
		setShowOutreachModal(true);
	};
	const handleSendOutreach = (e) => {
		e.preventDefault();
		if (!selectedCandidate) return;
		saveSourced(sourcedList.map((c) => c.id === selectedCandidate.id ? {
			...c,
			status: "Outreach Sent",
			channel: composerChannel,
			lastContacted: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
		} : c));
		toast.success(`Outreach sent to ${selectedCandidate.name} via ${composerChannel}!`);
		setShowOutreachModal(false);
	};
	const handleBulkImport = (e) => {
		e.preventDefault();
		const lines = importRawNames.split("\n").filter((l) => l.trim());
		if (lines.length === 0) {
			toast.error("Please enter at least one candidate entry.");
			return;
		}
		const newItems = lines.map((line, idx) => {
			const parts = line.split(",").map((p) => p.trim());
			return {
				id: `src-${Date.now()}-${idx}`,
				name: parts[0] || "Candidate",
				email: parts[1] || `sourced.${Date.now()}.${idx}@example.com`,
				phone: parts[2] || "",
				source: importSource,
				targetRole: importTargetRole || "Role Not Specified",
				status: "Sourced",
				lastContacted: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
				channel: "Email",
				notes: `Imported via sourcing wizard from ${importSource}`
			};
		});
		saveSourced([...newItems, ...sourcedList]);
		toast.success(`Imported ${newItems.length} candidate${newItems.length === 1 ? "" : "s"} into sourcing pipeline!`);
		setImportRawNames("");
		setShowUploadModal(false);
	};
	const handleConvertToApplicant = (cand) => {
		upsertCandidate({
			id: newId("cand"),
			name: cand.name,
			email: cand.email,
			phone: cand.phone,
			location: "Hybrid / On-site",
			jobId: jobs[0]?.id || "job-101",
			applicationId: newId("app"),
			appliedPosition: cand.targetRole,
			stage: "applied",
			atsScore: 85,
			jobMatch: 80,
			source: cand.source,
			tags: ["Sourced Candidate", "Pre-qualified"],
			skills: ["Core Competency", "Problem Solving"],
			yearsExperience: 4,
			resumeName: `${cand.name.replace(/\s+/g, "_")}_Resume.pdf`,
			summary: `Pre-screened candidate sourced via ${cand.source}. ${cand.notes}`,
			experience: [],
			education: [],
			projects: [],
			certifications: [],
			languages: ["English"],
			feedback: [],
			notes: [{
				id: "n-init",
				at: (/* @__PURE__ */ new Date()).toISOString(),
				author: "Sourcing",
				text: `Converted from sourcing lead on ${cand.channel}.`
			}],
			documents: [],
			timeline: [{
				id: "t-src",
				at: (/* @__PURE__ */ new Date()).toISOString(),
				kind: "system",
				title: `Converted to active applicant from ${cand.source}`
			}],
			appliedAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		saveSourced(sourcedList.map((c) => c.id === cand.id ? {
			...c,
			status: "Converted to Applicant"
		} : c));
		toast.success(`${cand.name} moved to Active Applicant Pipeline!`);
	};
	const filteredSourced = (0, import_react.useMemo)(() => {
		return sourcedList.filter((c) => {
			if (filterSource !== "all" && c.source !== filterSource) return false;
			if (filterStatus !== "all" && c.status !== filterStatus) return false;
			if (search && !`${c.name} ${c.email} ${c.targetRole}`.toLowerCase().includes(search.toLowerCase())) return false;
			return true;
		});
	}, [
		sourcedList,
		filterSource,
		filterStatus,
		search
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setShowUploadModal(true),
					className: "gap-1.5 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }), "Import Resumes / Candidates"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: sources.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:shadow-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-sm text-foreground",
								children: s.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[11px] font-bold text-emerald-500",
								children: [s.conversionRate, " Conv."]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: s.desc
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-center justify-between border-t border-border/60 pt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Prospects: "
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: s.activeSourced
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => {
									setFilterSource(s.type);
									toast.info(`Filtering candidates from ${s.name}`);
								},
								className: "inline-flex items-center text-xs text-indigo-500 hover:text-indigo-400 font-medium cursor-pointer",
								children: ["View Leads ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5 ml-0.5" })]
							})]
						})
					]
				}, s.name))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-1 items-center gap-2 max-w-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative w-full",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: search,
								onChange: (e) => setSearch(e.target.value),
								placeholder: "Search by candidate name, role, email...",
								className: "h-9 pl-8 text-xs"
							})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: filterSource,
							onValueChange: setFilterSource,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-9 text-xs w-[140px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Sources" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "All Sources"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "LinkedIn",
									children: "LinkedIn"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Naukri",
									children: "Naukri"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "GitHub",
									children: "GitHub"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Referral",
									children: "Referral"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Agency",
									children: "Agency"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Career Site",
									children: "Career Site"
								})
							] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: filterStatus,
							onValueChange: setFilterStatus,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "h-9 text-xs w-[160px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All Responses" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "all",
									children: "All Responses"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Sourced",
									children: "Sourced"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Outreach Sent",
									children: "Outreach Sent"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Replied - Interested",
									children: "Interested"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Replied - Not Interested",
									children: "Not Interested"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "Converted to Applicant",
									children: "Converted"
								})
							] })]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "border-b border-border bg-muted/40 font-medium text-muted-foreground uppercase tracking-wider text-[10px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Candidate"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Target Role"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Origin Source"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Outreach Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Last Contact"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-right",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border",
							children: filteredSourced.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								colSpan: 6,
								className: "py-14 text-center text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mx-auto h-9 w-9 opacity-35 mb-2.5 text-primary" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold text-foreground",
										children: "No sourced candidates found"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-1 max-w-sm mx-auto",
										children: filterSource !== "all" || filterStatus !== "all" || search ? "No candidates match your current filter or search criteria." : "No candidates found. Import or add prospective candidates to build your multi-channel talent pipeline."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										onClick: () => setShowUploadModal(true),
										size: "sm",
										className: "mt-4 gap-1.5 shadow-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }), "Import Candidates"]
									})
								]
							}) }) : filteredSourced.map((cand) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-accent/30 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-semibold text-foreground text-sm",
											children: cand.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-[11px] text-muted-foreground",
											children: [
												cand.email,
												" ",
												cand.phone ? `• ${cand.phone}` : ""
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-medium text-muted-foreground",
										children: cand.targetRole
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[10px]",
											children: cand.source
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${cand.status === "Replied - Interested" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" : cand.status === "Converted to Applicant" ? "bg-purple-500/15 text-purple-600 dark:text-purple-400" : cand.status === "Outreach Sent" ? "bg-blue-500/15 text-blue-600 dark:text-blue-400" : "bg-muted text-muted-foreground"}`,
											children: cand.status
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-4 py-3 text-muted-foreground",
										children: [
											cand.lastContacted,
											" (",
											cand.channel,
											")"
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-end gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												variant: "outline",
												className: "h-7 text-xs px-2 gap-1",
												onClick: () => handleOpenOutreach(cand),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3 w-3" }), "Outreach"]
											}), cand.status !== "Converted to Applicant" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												size: "sm",
												className: "h-7 text-xs px-2 bg-gradient-brand text-brand-foreground shadow-glow gap-1",
												onClick: () => handleConvertToApplicant(cand),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" }), "To Applicant"]
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "secondary",
												className: "text-[10px]",
												children: "In Pipeline"
											})]
										})
									})
								]
							}, cand.id))
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: showOutreachModal,
				onOpenChange: setShowOutreachModal,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "max-w-xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSendOutreach,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
								className: "text-lg font-bold",
								children: "Candidate Outreach Composer"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
								"Reach out directly to ",
								selectedCandidate?.name,
								" (",
								selectedCandidate?.targetRole,
								")."
							] })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 py-3 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Communication Channel:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-center gap-2",
											children: [
												"Email",
												"WhatsApp",
												"SMS"
											].map((ch) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setComposerChannel(ch),
												className: `px-3 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${composerChannel === ch ? "bg-foreground text-background border-foreground" : "border-border text-muted-foreground hover:bg-accent/40"}`,
												children: ch
											}, ch))
										})]
									}),
									composerChannel === "Email" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Subject Line"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "mt-1 h-9 text-xs",
										value: composerSubject,
										onChange: (e) => setComposerSubject(e.target.value),
										required: true
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs",
											children: "Message Content"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground",
											children: "Supported variables: {{name}}, {{role}}"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										className: "mt-1 text-xs font-mono",
										rows: 6,
										value: composerBody,
										onChange: (e) => setComposerBody(e.target.value),
										required: true
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg bg-muted/40 p-2.5 border border-border/80",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground mb-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" }),
												"Live ",
												composerChannel,
												" Preview"
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-foreground whitespace-pre-line leading-relaxed",
											children: composerBody
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setShowOutreachModal(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								className: "gap-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }),
									"Send via ",
									composerChannel
								]
							})] })
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: showUploadModal,
				onOpenChange: setShowUploadModal,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "max-w-lg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleBulkImport,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
								className: "text-lg font-bold",
								children: "Import Prospective Talent"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Paste candidate details or lead lists to import them into your sourcing pipeline." })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 py-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Source Platform"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: importSource,
										onValueChange: (v) => setImportSource(v),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "mt-1 h-9 text-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "LinkedIn",
												children: "LinkedIn Recruiter"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Naukri",
												children: "Naukri Resdex"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "GitHub",
												children: "GitHub"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Referral",
												children: "Internal Referral"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Agency",
												children: "Staffing Agency"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: "Career Site",
												children: "Career Site"
											})
										] })]
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs",
										children: "Target Job / Role"
									}), jobs.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: importTargetRole,
										onValueChange: setImportTargetRole,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "mt-1 h-9 text-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select target job" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: jobs.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: j.title,
											children: j.title
										}, j.id)) })]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										className: "mt-1 h-9 text-xs",
										placeholder: "e.g. Senior Software Engineer",
										value: importTargetRole,
										onChange: (e) => setImportTargetRole(e.target.value)
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs",
									children: "Candidate Entries (Name, Email, Phone — one per line)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									className: "mt-1 font-mono text-xs",
									rows: 5,
									placeholder: `e.g.\nRahul Sharma, rahul.sharma@example.com, +91 98765 43210\nAnanya Iyer, ananya.iyer@example.com, +91 98112 33445`,
									value: importRawNames,
									onChange: (e) => setImportRawNames(e.target.value)
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setShowUploadModal(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								children: "Import to Pipeline"
							})] })
						]
					})
				})
			})
		]
	});
}
//#endregion
export { CandidateSourcingPage };
