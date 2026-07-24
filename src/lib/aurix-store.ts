import { useEffect, useState, useSyncExternalStore } from "react";

export type Role = "admin" | "manager" | "employee";

export interface AurixUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  companyId: string;
  emailVerified: boolean;
  onboardingComplete: boolean;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  logoDataUrl?: string;
  industry?: string;
  size?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  timezone?: string;
}

export interface HR {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: string;
  managerName?: string;
  shift?: string;
  status?: string;
  activationToken?: string;
  activationTokenExpiresAt?: string;
}

export interface Manager {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  team: string[];
  shiftStart: string;
  shiftEnd: string;
  workingDays: string[];
}

export interface HRDocument {
  id: string;
  name: string;
  employeeId?: string;
  employeeName?: string;
  category: 'Employee Documents' | 'Education' | 'Employment' | 'Company Documents';
  type: string;
  uploadedBy: string;
  uploadDate: string;
  expiryDate?: string;
  status: 'Verified' | 'Pending' | 'Rejected' | 'Expired';
  fileSize: string;
  fileType: 'pdf' | 'jpg' | 'png' | 'docx';
  description?: string;
  rejectionReason?: string;
  fileUrl?: string;
}

export interface HRDocumentActivity {
  id: string;
  documentId: string;
  documentName: string;
  action: 'Uploaded' | 'Verified' | 'Rejected' | 'Downloaded' | 'Updated';
  performedBy: string;
  timestamp: string;
  details?: string;
}

export interface Workspace {
  user: AurixUser | null;
  company: Company | null;
  hrs: HR[];
  employees: Employee[];
  managers: Manager[];
  documents?: HRDocument[];
  documentActivities?: HRDocumentActivity[];
  pendingOtp?: string;
  isDemoUser?: boolean;
  isRestoring?: boolean;
}

const KEY = "aurix:workspace:v1";
const REMEMBER_KEY = "aurix:remember";

const defaultState: Workspace = {
  user: null,
  company: null,
  hrs: [],
  employees: [],
  managers: [],
  documents: [],
  documentActivities: [],
  isRestoring: false,
};

let state: Workspace = defaultState;
const listeners = new Set<() => void>();

function load() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      state = { ...defaultState, ...parsed };
    }
    
    // Check if we have tokens stored to restore session on startup
    const tokensRaw = localStorage.getItem("aurix:tokens");
    if (tokensRaw) {
      const tokens = JSON.parse(tokensRaw);
      if (tokens && tokens.accessToken) {
        state.isRestoring = true;
      }
    }
  } catch {}
}
load();

function persist() {
  if (typeof window === "undefined") return;
  try {
    const toSave = { ...state };
    delete toSave.isRestoring;
    localStorage.setItem(KEY, JSON.stringify(toSave));
  } catch {}
}

function emit() {
  listeners.forEach((l) => l());
}

export const aurix = {
  get: () => state,
  set: (partial: Partial<Workspace>) => {
    state = { ...state, ...partial };
    persist();
    emit();
  },
  reset: () => {
    state = defaultState;
    persist();
    emit();
  },
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },
};

export function useAurix(): Workspace {
  return useSyncExternalStore(
    aurix.subscribe,
    () => state,
    () => defaultState,
  );
}

export function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function genOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const rememberStore = {
  get: () => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(REMEMBER_KEY) || "";
  },
  set: (email: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(REMEMBER_KEY, email);
  },
  clear: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(REMEMBER_KEY);
  },
};
