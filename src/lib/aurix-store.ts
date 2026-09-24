import { useEffect, useState, useSyncExternalStore } from "react";
import { safeStorage } from "./safe-storage";

export type Role =
  | "admin"
  | "hr"
  | "manager"
  | "interviewer"
  | "employee"
  | "candidate"
  | "ceo"
  | "cto"
  | "cio";

export interface RoleConfig {
  role: Role;
  label: string;
  badge: string;
  description: string;
  defaultPath: string;
}

export const AVAILABLE_ROLES: RoleConfig[] = [
  {
    role: "admin",
    label: "Super Admin",
    badge: "Full Control",
    description: "Complete system governance, security, and global config",
    defaultPath: "/dashboard",
  },
  {
    role: "hr",
    label: "HR Executive",
    badge: "Recruitment",
    description: "End-to-end talent pipelines, requisitions, offers & BGV",
    defaultPath: "/dashboard/recruitment",
  },
  {
    role: "manager",
    label: "Hiring Manager",
    badge: "Department",
    description: "Role requisitions, approvals, team pipeline & interviews",
    defaultPath: "/dashboard/recruitment/hiring-manager",
  },
  {
    role: "interviewer",
    label: "Interviewer / Panel",
    badge: "Evaluator",
    description: "Assigned rounds, AI interview monitoring & scorecards",
    defaultPath: "/dashboard/recruitment/interviews",
  },
  {
    role: "employee",
    label: "Employee",
    badge: "Self-Service",
    description: "Personal portal, KT onboarding, attendance & documents",
    defaultPath: "/dashboard/employee",
  },
  {
    role: "candidate",
    label: "Candidate Portal",
    badge: "Applicant",
    description: "Application tracking, AI interview room, offers & preboarding",
    defaultPath: "/dashboard/recruitment/candidates",
  },
];

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
  const raw = safeStorage.getItem(KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      state = { ...defaultState, ...parsed };
    } catch {
      state = { ...defaultState };
    }
  }
  // If a cached user profile exists, mark as restoring until bootstrapAuth verifies with backend
  if (state.user) {
    state.isRestoring = true;
  }
}
load();

function persist() {
  const toSave = { ...state };
  delete toSave.isRestoring;
  safeStorage.setItem(KEY, JSON.stringify(toSave));
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
  switchRole: (role: Role) => {
    if (state.user) {
      state = { ...state, user: { ...state.user, role } };
      persist();
      emit();
    }
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
    return safeStorage.getItem(REMEMBER_KEY) || "";
  },
  set: (email: string) => {
    safeStorage.setItem(REMEMBER_KEY, email);
  },
  clear: () => {
    safeStorage.removeItem(REMEMBER_KEY);
  },
};
