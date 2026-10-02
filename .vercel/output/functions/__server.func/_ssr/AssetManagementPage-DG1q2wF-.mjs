import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Dt as Package, Sr as CircleCheck, T as TriangleAlert, bt as Pencil, dt as QrCode, ht as Plus, k as Trash2, o as Wrench, vr as CircleX } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { C as Legend, S as Tooltip, a as PieChart, b as Cell, c as YAxis, f as CartesianGrid, h as Pie, l as XAxis, o as BarChart, p as Bar, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { l as StatCard, r as GlassCard, s as SearchBox, t as CsvButton, u as StatusBadge } from "./Shared-C_skH1kb.mjs";
import { n as newId, r as useHrms, t as hrms } from "./store-o03qs3ZS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AssetManagementPage-DG1q2wF-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIES = [
	"laptop",
	"desktop",
	"monitor",
	"phone",
	"accessory",
	"vehicle",
	"other"
];
var STATUSES = [
	"available",
	"assigned",
	"under-repair",
	"lost",
	"expired"
];
var STATUS_TONE = {
	available: "success",
	assigned: "info",
	"under-repair": "warning",
	lost: "danger",
	expired: "danger",
	retired: "muted"
};
var PIE_COLORS = [
	"#10b981",
	"#6366f1",
	"#f59e0b",
	"#ef4444",
	"#6b7280"
];
function emptyAsset() {
	return {
		id: newId("a"),
		tag: `LAP-${Math.floor(Math.random() * 9e3 + 1e3)}`,
		name: "",
		category: "laptop",
		serial: "",
		vendor: "",
		purchaseDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		warrantyUntil: new Date(Date.now() + 1e3 * 60 * 60 * 24 * 365).toISOString().slice(0, 10),
		status: "available"
	};
}
function AssetManagementPage() {
	const assets = useHrms((s) => s.assets);
	const [query, setQuery] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(emptyAsset());
	const [qrFor, setQrFor] = (0, import_react.useState)(null);
	const stats = (0, import_react.useMemo)(() => {
		const by = (s) => assets.filter((a) => a.status === s).length;
		return {
			total: assets.length,
			assigned: by("assigned"),
			available: by("available"),
			repair: by("under-repair"),
			lost: by("lost"),
			expired: by("expired")
		};
	}, [assets]);
	const filtered = (0, import_react.useMemo)(() => {
		return assets.filter((a) => statusFilter === "all" ? true : a.status === statusFilter).filter((a) => query.trim() === "" ? true : `${a.tag} ${a.name} ${a.serial} ${a.vendor} ${a.assignedTo ?? ""}`.toLowerCase().includes(query.toLowerCase()));
	}, [
		assets,
		statusFilter,
		query
	]);
	const categoryData = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		assets.forEach((a) => map.set(a.category, (map.get(a.category) ?? 0) + 1));
		return Array.from(map, ([name, value]) => ({
			name,
			value
		}));
	}, [assets]);
	const statusData = (0, import_react.useMemo)(() => STATUSES.map((s) => ({
		name: s,
		value: assets.filter((a) => a.status === s).length
	})), [assets]);
	function save() {
		if (!draft.name) return;
		hrms.upsertAsset(draft);
		setOpen(false);
		setDraft(emptyAsset());
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-end gap-2 mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CsvButton, {
				rows: assets,
				filename: "assets.csv"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				onClick: () => {
					setDraft(emptyAsset());
					setOpen(true);
				},
				className: "gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add asset"]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Total",
					value: stats.total,
					icon: Package
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Assigned",
					value: stats.assigned,
					icon: CircleCheck,
					accent: "success"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Available",
					value: stats.available,
					icon: Package,
					accent: "muted"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Under Repair",
					value: stats.repair,
					icon: Wrench,
					accent: "warning"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Lost",
					value: stats.lost,
					icon: CircleX,
					accent: "danger"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Expired",
					value: stats.expired,
					icon: TriangleAlert,
					accent: "danger"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 font-medium",
				children: "By category"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-64",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
					data: categoryData,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							strokeDasharray: "3 3",
							opacity: .2
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "name",
							fontSize: 12
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							allowDecimals: false,
							fontSize: 12
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "value",
							radius: [
								6,
								6,
								0,
								0
							],
							fill: "#6366f1"
						})
					]
				}) })
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 font-medium",
				children: "By status"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-64",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
						data: statusData,
						dataKey: "value",
						nameKey: "name",
						outerRadius: 90,
						label: true,
						children: statusData.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: PIE_COLORS[i % PIE_COLORS.length] }, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {})
				] }) })
			})] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchBox, {
				value: query,
				onChange: setQuery,
				placeholder: "Search by tag, name, serial, employee…"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				value: statusFilter,
				onChange: (e) => setStatusFilter(e.target.value),
				className: "h-9 rounded-md border border-border bg-background px-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "all",
					children: "All statuses"
				}), STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: s,
					children: s
				}, s))]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
			className: "overflow-x-auto p-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "text-left text-xs uppercase tracking-wider text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Tag"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Name"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Category"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Vendor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Warranty"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Assigned to"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Actions"
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.map((a) => {
					const warrantyDate = new Date(a.warrantyUntil);
					const warningWarranty = warrantyDate.getTime() - Date.now() < 1e3 * 60 * 60 * 24 * 60;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/60 last:border-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 font-mono text-xs",
								children: a.tag
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 font-medium",
								children: a.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 capitalize",
								children: a.category
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: a.vendor
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: warningWarranty ? "text-amber-600" : "",
									children: warrantyDate.toLocaleDateString()
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
									status: a.status,
									tone: STATUS_TONE[a.status]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: a.assignedTo ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "—"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-end gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											onClick: () => setQrFor(a),
											"aria-label": "QR",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-4 w-4" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											onClick: () => {
												setDraft(a);
												setOpen(true);
											},
											"aria-label": "Edit",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
										}),
										a.assignedTo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											size: "sm",
											onClick: () => hrms.returnAsset(a.id),
											children: "Return"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "outline",
											size: "sm",
											onClick: () => {
												const name = window.prompt("Assign to employee:");
												if (name) hrms.assignAsset(a.id, name);
											},
											children: "Assign"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											onClick: () => hrms.deleteAsset(a.id),
											"aria-label": "Delete",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-rose-500" })
										})
									]
								})
							})
						]
					}, a.id);
				}) })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-lg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [draft.id.startsWith("a-") ? "Add" : "Edit", " asset"] }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tag" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.tag,
								onChange: (e) => setDraft({
									...draft,
									tag: e.target.value
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.name,
								onChange: (e) => setDraft({
									...draft,
									name: e.target.value
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Category" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: draft.category,
								onChange: (e) => setDraft({
									...draft,
									category: e.target.value
								}),
								className: "h-9 w-full rounded-md border border-border bg-background px-3 text-sm",
								children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: draft.status,
								onChange: (e) => setDraft({
									...draft,
									status: e.target.value
								}),
								className: "h-9 w-full rounded-md border border-border bg-background px-3 text-sm",
								children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s }, s))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Serial" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.serial,
								onChange: (e) => setDraft({
									...draft,
									serial: e.target.value
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Vendor" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.vendor,
								onChange: (e) => setDraft({
									...draft,
									vendor: e.target.value
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Purchase date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: draft.purchaseDate.slice(0, 10),
								onChange: (e) => setDraft({
									...draft,
									purchaseDate: e.target.value
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Warranty until" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "date",
								value: draft.warrantyUntil.slice(0, 10),
								onChange: (e) => setDraft({
									...draft,
									warrantyUntil: e.target.value
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Assigned to" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: draft.assignedTo ?? "",
									onChange: (e) => setDraft({
										...draft,
										assignedTo: e.target.value
									})
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setOpen(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: save,
						children: "Save"
					})] })
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!qrFor,
			onOpenChange: (o) => !o && setQrFor(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Asset QR / Barcode" }) }), qrFor ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-3",
					children: [
						qrFor.qrCodeData ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: qrFor.qrCodeData,
							width: 160,
							height: 160,
							className: "w-[160px] h-[160px]",
							alt: "Asset QR Code"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-[160px] h-[160px] flex items-center justify-center bg-slate-50 text-[10px] text-slate-400",
							children: "Generating QR..."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-mono text-xs",
							children: qrFor.tag
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Scan to view asset details."
						})
					]
				}) : null]
			})
		})
	] });
}
//#endregion
export { AssetManagementPage, AssetManagementPage as default };
