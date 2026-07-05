import { useSyncExternalStore } from "react";
import {
  seedAssets, seedExits, seedExpenses, seedOffboarding, seedOnboarding, seedTimeline, seedTravel, seedVisitors,
} from "./seed";
import type {
  Asset, Expense, ExitCase, OffboardingCase, OnboardingCase, TimelineEvent, TravelRequest, Visitor,
} from "./types";

interface HrmsState {
  timeline: TimelineEvent[];
  assets: Asset[];
  visitors: Visitor[];
  expenses: Expense[];
  travel: TravelRequest[];
  exits: ExitCase[];
  onboarding: OnboardingCase[];
  offboarding: OffboardingCase[];
}

const STORAGE_KEY = "aurix.hrms.v1";

const initial: HrmsState = {
  timeline: seedTimeline,
  assets: seedAssets,
  visitors: seedVisitors,
  expenses: seedExpenses,
  travel: seedTravel,
  exits: seedExits,
  onboarding: seedOnboarding,
  offboarding: seedOffboarding,
};

function load(): HrmsState {
  if (typeof window === "undefined") return initial;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initial;
    const parsed = JSON.parse(raw) as Partial<HrmsState>;
    return { ...initial, ...parsed };
  } catch {
    return initial;
  }
}

let state: HrmsState = load();
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function set(next: Partial<HrmsState>) {
  state = { ...state, ...next };
  persist();
  listeners.forEach((l) => l());
}

export const hrms = {
  get: () => state,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  reset: () => {
    state = { ...initial };
    persist();
    listeners.forEach((l) => l());
  },
  // Timeline
  addTimelineEvent: (e: TimelineEvent) => set({ timeline: [e, ...state.timeline] }),
  // Assets
  upsertAsset: (a: Asset) => {
    const idx = state.assets.findIndex((x) => x.id === a.id);
    const next = [...state.assets];
    if (idx >= 0) next[idx] = a;
    else next.push(a);
    set({ assets: next });
  },
  deleteAsset: (id: string) => set({ assets: state.assets.filter((a) => a.id !== id) }),
  assignAsset: (id: string, employee: string) => {
    set({
      assets: state.assets.map((a) =>
        a.id === id ? { ...a, assignedTo: employee, assignedAt: new Date().toISOString(), status: "assigned" } : a,
      ),
    });
  },
  returnAsset: (id: string) => {
    set({
      assets: state.assets.map((a) =>
        a.id === id ? { ...a, assignedTo: undefined, assignedAt: undefined, status: "available" } : a,
      ),
    });
  },
  // Visitors
  upsertVisitor: (v: Visitor) => {
    const idx = state.visitors.findIndex((x) => x.id === v.id);
    const next = [...state.visitors];
    if (idx >= 0) next[idx] = v;
    else next.unshift(v);
    set({ visitors: next });
  },
  checkInVisitor: (id: string) =>
    set({
      visitors: state.visitors.map((v) =>
        v.id === id ? { ...v, status: "checked-in", checkInAt: new Date().toISOString() } : v,
      ),
    }),
  checkOutVisitor: (id: string) =>
    set({
      visitors: state.visitors.map((v) =>
        v.id === id ? { ...v, status: "checked-out", checkOutAt: new Date().toISOString() } : v,
      ),
    }),
  setVisitorStatus: (id: string, status: Visitor["status"]) =>
    set({ visitors: state.visitors.map((v) => (v.id === id ? { ...v, status } : v)) }),
  // Expenses
  upsertExpense: (x: Expense) => {
    const idx = state.expenses.findIndex((e) => e.id === x.id);
    const next = [...state.expenses];
    if (idx >= 0) next[idx] = x;
    else next.unshift(x);
    set({ expenses: next });
  },
  setExpenseStatus: (id: string, status: Expense["status"], note?: string) =>
    set({
      expenses: state.expenses.map((e) =>
        e.id === id
          ? { ...e, status, managerNote: note ?? e.managerNote, paidAt: status === "paid" ? new Date().toISOString() : e.paidAt }
          : e,
      ),
    }),
  // Travel
  upsertTravel: (t: TravelRequest) => {
    const idx = state.travel.findIndex((x) => x.id === t.id);
    const next = [...state.travel];
    if (idx >= 0) next[idx] = t;
    else next.unshift(t);
    set({ travel: next });
  },
  advanceTravel: (id: string, stage: TravelRequest["status"], note?: string) =>
    set({
      travel: state.travel.map((t) =>
        t.id === id ? { ...t, status: stage, history: [...t.history, { stage, at: new Date().toISOString(), note }] } : t,
      ),
    }),
  // Exits
  upsertExit: (e: ExitCase) => {
    const idx = state.exits.findIndex((x) => x.id === e.id);
    const next = [...state.exits];
    if (idx >= 0) next[idx] = e;
    else next.unshift(e);
    set({ exits: next });
  },
  toggleExitChecklist: (id: string, key: string) =>
    set({
      exits: state.exits.map((e) =>
        e.id === id
          ? {
              ...e,
              checklist: e.checklist.map((c) =>
                c.key === key ? { ...c, done: !c.done, doneAt: !c.done ? new Date().toISOString() : undefined } : c,
              ),
            }
          : e,
      ),
    }),
  issueExitDoc: (id: string, name: string) =>
    set({
      exits: state.exits.map((e) =>
        e.id === id ? { ...e, documents: e.documents.map((d) => (d.name === name ? { ...d, issued: true } : d)) } : e,
      ),
    }),
  // Onboarding
  toggleOnboardingTask: (id: string, key: string) =>
    set({
      onboarding: state.onboarding.map((o) =>
        o.id === id ? { ...o, tasks: o.tasks.map((t) => (t.key === key ? { ...t, done: !t.done } : t)) } : o,
      ),
    }),
  addOnboarding: (o: OnboardingCase) => set({ onboarding: [o, ...state.onboarding] }),
  // Offboarding
  toggleOffboardingTask: (id: string, key: string) =>
    set({
      offboarding: state.offboarding.map((o) =>
        o.id === id ? { ...o, tasks: o.tasks.map((t) => (t.key === key ? { ...t, done: !t.done } : t)) } : o,
      ),
    }),
  markOffboardingDoc: (id: string, name: string) =>
    set({
      offboarding: state.offboarding.map((o) =>
        o.id === id ? { ...o, documents: o.documents.map((d) => (d.name === name ? { ...d, ready: true } : d)) } : o,
      ),
    }),
  completeOffboarding: (id: string) =>
    set({ offboarding: state.offboarding.map((o) => (o.id === id ? { ...o, status: "completed" } : o)) }),
};

export function useHrms<T>(selector: (s: HrmsState) => T): T {
  return useSyncExternalStore(
    hrms.subscribe,
    () => selector(state),
    () => selector(initial),
  );
}

export function newId(prefix = "id"): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
