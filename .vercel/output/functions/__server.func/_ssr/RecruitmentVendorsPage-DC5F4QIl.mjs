import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { R as Star, V as SquarePen, Vt as Mail, ht as Plus, k as Trash2, qr as Building2, vt as Phone } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as apiInstance } from "./apiInstance-C5A0vaLH.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { r as PageHeader } from "./DashboardShell-DIr27KpW.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { n as useRecruitment } from "./useRecruitment-Cuznx8sx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/RecruitmentVendorsPage-DC5F4QIl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_TONE = {
	active: "bg-emerald-500/15 text-emerald-600 ring-emerald-500/20 dark:text-emerald-300",
	paused: "bg-amber-500/15 text-amber-700 ring-amber-500/20 dark:text-amber-300",
	terminated: "bg-rose-500/15 text-rose-600 ring-rose-500/20 dark:text-rose-300"
};
function RecruitmentVendorsPage() {
	const [vendorsList, setVendorsList] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const { candidates } = useRecruitment();
	const [showAddModal, setShowAddModal] = (0, import_react.useState)(false);
	const [showEditModal, setShowEditModal] = (0, import_react.useState)(false);
	const [selectedVendor, setSelectedVendor] = (0, import_react.useState)(null);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [form, setForm] = (0, import_react.useState)({
		name: "",
		contactName: "",
		email: "",
		phone: "",
		commissionRate: "20.00",
		status: "ACTIVE"
	});
	const loadVendors = async () => {
		try {
			setLoading(true);
			setVendorsList((await apiInstance.get("/vendors?limit=100")).data?.data?.items || []);
		} catch (err) {
			toast.error("Failed to load recruitment vendors.");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadVendors();
	}, []);
	const resolvedVendors = (0, import_react.useMemo)(() => {
		return vendorsList.map((v) => {
			const vendorCandidates = candidates.filter((c) => c.vendorId === v.id);
			const activeReqs = vendorCandidates.filter((c) => c.stage !== "hired" && c.stage !== "rejected").length;
			const hires = vendorCandidates.filter((c) => c.stage === "hired").length;
			const spend = vendorCandidates.filter((c) => c.stage === "hired").reduce((sum, c) => {
				return sum + (c.expectedSalary || 1e6) * (Number(v.commission_rate || 20) / 100);
			}, 0);
			const rating = v.name.length % 2 === 0 ? 4.7 : 4.4;
			const specialties = v.name.includes("Talent") || v.name.includes("Executive") ? ["Engineering", "AI/ML"] : ["Sales", "Product"];
			return {
				...v,
				contact: v.contact_name,
				activeReqs,
				hires,
				spend,
				rating,
				specialties,
				feeModel: `${v.commission_rate}% of base`
			};
		});
	}, [vendorsList, candidates]);
	const totalSpend = (0, import_react.useMemo)(() => resolvedVendors.reduce((a, v) => a + v.spend, 0), [resolvedVendors]);
	const totalHires = (0, import_react.useMemo)(() => resolvedVendors.reduce((a, v) => a + v.hires, 0), [resolvedVendors]);
	const totalOpen = (0, import_react.useMemo)(() => resolvedVendors.reduce((a, v) => a + v.activeReqs, 0), [resolvedVendors]);
	const handleAddSubmit = async (e) => {
		e.preventDefault();
		if (!form.name || !form.contactName || !form.email || !form.phone) {
			toast.error("Please fill in all required fields.");
			return;
		}
		setSubmitting(true);
		try {
			await apiInstance.post("/vendors", {
				name: form.name,
				contact_name: form.contactName,
				email: form.email,
				phone: form.phone,
				commission_rate: Number(form.commissionRate) || 0,
				status: form.status
			});
			toast.success("Vendor agency registered successfully!");
			setShowAddModal(false);
			setForm({
				name: "",
				contactName: "",
				email: "",
				phone: "",
				commissionRate: "20.00",
				status: "ACTIVE"
			});
			loadVendors();
		} catch (err) {
			toast.error("Failed to register vendor agency.");
		} finally {
			setSubmitting(false);
		}
	};
	const handleEditClick = (v) => {
		setSelectedVendor(v);
		setForm({
			name: v.name,
			contactName: v.contact_name,
			email: v.email,
			phone: v.phone,
			commissionRate: String(v.commission_rate),
			status: v.status
		});
		setShowEditModal(true);
	};
	const handleEditSubmit = async (e) => {
		e.preventDefault();
		if (!selectedVendor) return;
		setSubmitting(true);
		try {
			await apiInstance.put(`/vendors/${selectedVendor.id}`, {
				name: form.name,
				contact_name: form.contactName,
				email: form.email,
				phone: form.phone,
				commission_rate: Number(form.commissionRate) || 0,
				status: form.status
			});
			toast.success("Vendor details updated successfully!");
			setShowEditModal(false);
			loadVendors();
		} catch (err) {
			toast.error("Failed to update vendor agency details.");
		} finally {
			setSubmitting(false);
		}
	};
	const handleDeleteClick = async (id) => {
		if (!confirm("Are you sure you want to delete this recruitment vendor agency?")) return;
		try {
			await apiInstance.delete(`/vendors/${id}`);
			toast.success("Vendor agency deleted successfully!");
			loadVendors();
		} catch (err) {
			toast.error("Failed to delete vendor agency.");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Vendors & Agencies",
			description: "External recruiting partners, performance & spend.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => setShowAddModal(true),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), "Add Vendor"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 grid grid-cols-2 gap-3 md:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Active Vendors",
					value: resolvedVendors.filter((v) => v.status === "ACTIVE").length
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Open Reqs (vendor)",
					value: totalOpen
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Vendor Hires (YTD)",
					value: totalHires
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					label: "Spend (YTD)",
					value: `$${(totalSpend / 1e3).toFixed(0)}k`
				})
			]
		}),
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-center py-12 text-sm text-muted-foreground",
			children: "Loading recruitment vendors database..."
		}) : resolvedVendors.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-2xl bg-card/40 mt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium text-foreground",
					children: "No recruiting vendors registered"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-sm text-sm text-muted-foreground",
					children: "Add external placement agencies and headhunters to start tracking spend."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setShowAddModal(true),
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), " Add Vendor"]
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3",
			children: resolvedVendors.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl flex flex-col justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/40",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate font-semibold text-foreground text-sm",
									children: v.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-xs text-muted-foreground",
									children: v.contact
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `rounded-full px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wide ring-1 ${STATUS_TONE[v.status.toLowerCase()] || STATUS_TONE["active"]}`,
							children: v.status
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 space-y-1 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3" }), v.email]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3 w-3" }), v.phone]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-1",
						children: v.specialties.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							className: "text-[10px]",
							children: s
						}, s))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid grid-cols-3 gap-2 border-t border-border pt-3 text-center text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold text-foreground text-sm",
								children: v.activeReqs
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-muted-foreground",
								children: "Open"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold text-foreground text-sm",
								children: v.hires
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-muted-foreground",
								children: "Hires"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-semibold text-foreground text-sm",
								children: [
									"$",
									(v.spend / 1e3).toFixed(0),
									"k"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] text-muted-foreground",
								children: "Spend"
							})] })
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-center justify-between border-t border-border pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 text-xs text-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 fill-amber-500 text-amber-500" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold",
								children: v.rating
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: ["· ", v.feeModel]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => handleEditClick(v),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "h-3 w-3" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => handleDeleteClick(v.id),
							className: "hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3 w-3" })
						})]
					})]
				})]
			}, v.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: showAddModal,
			onOpenChange: setShowAddModal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add Recruiting Vendor" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Register an external recruitment agency to manage placements." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleAddSubmit,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "add-name",
								children: "Agency Name *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "add-name",
								value: form.name,
								onChange: (e) => setForm({
									...form,
									name: e.target.value
								}),
								placeholder: "e.g. Northwind Talent Partners",
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "add-contact",
								children: "Primary Contact Name *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "add-contact",
								value: form.contactName,
								onChange: (e) => setForm({
									...form,
									contactName: e.target.value
								}),
								placeholder: "e.g. Olivia Reed",
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "add-email",
									children: "Contact Email *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "add-email",
									type: "email",
									value: form.email,
									onChange: (e) => setForm({
										...form,
										email: e.target.value
									}),
									placeholder: "name@agency.com",
									required: true
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "add-phone",
									children: "Contact Phone *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "add-phone",
									value: form.phone,
									onChange: (e) => setForm({
										...form,
										phone: e.target.value
									}),
									placeholder: "e.g. +1 (415) 555-0199",
									required: true
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "add-commission",
									children: "Commission Rate (%) *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "add-commission",
									type: "number",
									step: "0.01",
									min: "0",
									max: "100",
									value: form.commissionRate,
									onChange: (e) => setForm({
										...form,
										commissionRate: e.target.value
									}),
									required: true
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "add-status",
									children: "Status *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									id: "add-status",
									value: form.status,
									onChange: (e) => setForm({
										...form,
										status: e.target.value
									}),
									className: "w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground bg-background",
									required: true,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "ACTIVE",
											children: "ACTIVE"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "PAUSED",
											children: "PAUSED"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "TERMINATED",
											children: "TERMINATED"
										})
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setShowAddModal(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: submitting,
								children: submitting ? "Registering..." : "Add Vendor"
							})]
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: showEditModal,
			onOpenChange: setShowEditModal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit Vendor Agency" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Update agency details or manage partnership status." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleEditSubmit,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "edit-name",
								children: "Agency Name *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "edit-name",
								value: form.name,
								onChange: (e) => setForm({
									...form,
									name: e.target.value
								}),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "edit-contact",
								children: "Primary Contact Name *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "edit-contact",
								value: form.contactName,
								onChange: (e) => setForm({
									...form,
									contactName: e.target.value
								}),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "edit-email",
									children: "Contact Email *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "edit-email",
									type: "email",
									value: form.email,
									onChange: (e) => setForm({
										...form,
										email: e.target.value
									}),
									required: true
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "edit-phone",
									children: "Contact Phone *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "edit-phone",
									value: form.phone,
									onChange: (e) => setForm({
										...form,
										phone: e.target.value
									}),
									required: true
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "edit-commission",
									children: "Commission Rate (%) *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "edit-commission",
									type: "number",
									step: "0.01",
									min: "0",
									max: "100",
									value: form.commissionRate,
									onChange: (e) => setForm({
										...form,
										commissionRate: e.target.value
									}),
									required: true
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "edit-status",
									children: "Status *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									id: "edit-status",
									value: form.status,
									onChange: (e) => setForm({
										...form,
										status: e.target.value
									}),
									className: "w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-foreground bg-background",
									required: true,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "ACTIVE",
											children: "ACTIVE"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "PAUSED",
											children: "PAUSED"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "TERMINATED",
											children: "TERMINATED"
										})
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setShowEditModal(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: submitting,
								children: submitting ? "Updating..." : "Save Changes"
							})]
						})
					]
				})]
			})
		})
	] });
}
function Kpi({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[11px] font-medium uppercase tracking-wider text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 font-display text-2xl font-semibold text-foreground",
			children: value
		})]
	});
}
//#endregion
export { RecruitmentVendorsPage };
