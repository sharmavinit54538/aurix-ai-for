import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-o03qs3ZS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var STORAGE_KEY = "aurix.hrms.v1";
var initial = {
	timeline: [],
	assets: [],
	visitors: [],
	expenses: [],
	travel: [],
	exits: [],
	onboarding: [],
	offboarding: []
};
function load() {
	if (typeof window === "undefined") return initial;
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return initial;
		const parsed = JSON.parse(raw);
		return {
			...initial,
			...parsed
		};
	} catch {
		return initial;
	}
}
var state = load();
var listeners = /* @__PURE__ */ new Set();
function persist() {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
	} catch {}
}
function set(next) {
	state = {
		...state,
		...next
	};
	persist();
	listeners.forEach((l) => l());
}
var hrms = {
	get: () => state,
	subscribe: (l) => {
		listeners.add(l);
		return () => listeners.delete(l);
	},
	reset: () => {
		state = { ...initial };
		persist();
		listeners.forEach((l) => l());
	},
	addTimelineEvent: (e) => set({ timeline: [e, ...state.timeline] }),
	upsertAsset: (a) => {
		const idx = state.assets.findIndex((x) => x.id === a.id);
		const next = [...state.assets];
		if (idx >= 0) next[idx] = a;
		else next.push(a);
		set({ assets: next });
	},
	deleteAsset: (id) => set({ assets: state.assets.filter((a) => a.id !== id) }),
	assignAsset: (id, employee) => {
		set({ assets: state.assets.map((a) => a.id === id ? {
			...a,
			assignedTo: employee,
			assignedAt: (/* @__PURE__ */ new Date()).toISOString(),
			status: "assigned"
		} : a) });
	},
	returnAsset: (id) => {
		set({ assets: state.assets.map((a) => a.id === id ? {
			...a,
			assignedTo: void 0,
			assignedAt: void 0,
			status: "available"
		} : a) });
	},
	upsertVisitor: (v) => {
		const idx = state.visitors.findIndex((x) => x.id === v.id);
		const next = [...state.visitors];
		if (idx >= 0) next[idx] = v;
		else next.unshift(v);
		set({ visitors: next });
	},
	checkInVisitor: (id) => set({ visitors: state.visitors.map((v) => v.id === id ? {
		...v,
		status: "checked-in",
		checkInAt: (/* @__PURE__ */ new Date()).toISOString()
	} : v) }),
	checkOutVisitor: (id) => set({ visitors: state.visitors.map((v) => v.id === id ? {
		...v,
		status: "checked-out",
		checkOutAt: (/* @__PURE__ */ new Date()).toISOString()
	} : v) }),
	setVisitorStatus: (id, status) => set({ visitors: state.visitors.map((v) => v.id === id ? {
		...v,
		status
	} : v) }),
	upsertExpense: (x) => {
		const idx = state.expenses.findIndex((e) => e.id === x.id);
		const next = [...state.expenses];
		if (idx >= 0) next[idx] = x;
		else next.unshift(x);
		set({ expenses: next });
	},
	setExpenseStatus: (id, status, note) => set({ expenses: state.expenses.map((e) => e.id === id ? {
		...e,
		status,
		managerNote: note ?? e.managerNote,
		paidAt: status === "paid" ? (/* @__PURE__ */ new Date()).toISOString() : e.paidAt
	} : e) }),
	upsertTravel: (t) => {
		const idx = state.travel.findIndex((x) => x.id === t.id);
		const next = [...state.travel];
		if (idx >= 0) next[idx] = t;
		else next.unshift(t);
		set({ travel: next });
	},
	advanceTravel: (id, stage, note) => set({ travel: state.travel.map((t) => t.id === id ? {
		...t,
		status: stage,
		history: [...t.history, {
			stage,
			at: (/* @__PURE__ */ new Date()).toISOString(),
			note
		}]
	} : t) }),
	upsertExit: (e) => {
		const idx = state.exits.findIndex((x) => x.id === e.id);
		const next = [...state.exits];
		if (idx >= 0) next[idx] = e;
		else next.unshift(e);
		set({ exits: next });
	},
	toggleExitChecklist: (id, key) => set({ exits: state.exits.map((e) => e.id === id ? {
		...e,
		checklist: e.checklist.map((c) => c.key === key ? {
			...c,
			done: !c.done,
			doneAt: !c.done ? (/* @__PURE__ */ new Date()).toISOString() : void 0
		} : c)
	} : e) }),
	issueExitDoc: (id, name) => set({ exits: state.exits.map((e) => e.id === id ? {
		...e,
		documents: e.documents.map((d) => d.name === name ? {
			...d,
			issued: true
		} : d)
	} : e) }),
	toggleOnboardingTask: (id, key) => set({ onboarding: state.onboarding.map((o) => o.id === id ? {
		...o,
		tasks: o.tasks.map((t) => t.key === key ? {
			...t,
			done: !t.done
		} : t)
	} : o) }),
	addOnboarding: (o) => set({ onboarding: [o, ...state.onboarding] }),
	toggleOffboardingTask: (id, key) => set({ offboarding: state.offboarding.map((o) => o.id === id ? {
		...o,
		tasks: o.tasks.map((t) => t.key === key ? {
			...t,
			done: !t.done
		} : t)
	} : o) }),
	markOffboardingDoc: (id, name) => set({ offboarding: state.offboarding.map((o) => o.id === id ? {
		...o,
		documents: o.documents.map((d) => d.name === name ? {
			...d,
			ready: true
		} : d)
	} : o) }),
	completeOffboarding: (id) => set({ offboarding: state.offboarding.map((o) => o.id === id ? {
		...o,
		status: "completed"
	} : o) })
};
function useHrms(selector) {
	return (0, import_react.useSyncExternalStore)(hrms.subscribe, () => selector(state), () => selector(initial));
}
function newId(prefix = "id") {
	return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
//#endregion
export { newId as n, useHrms as r, hrms as t };
