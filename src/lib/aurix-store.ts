import { useEffect, useState, useSyncExternalStore } from "react";
import { safeStorage } from "./safe-storage";
import { normalizeRole, type AppRole } from "./roles";

export type Role = AppRole;

export interface RoleConfig {
  role: Role;
  label: string;
  badge: string;
  description: string;
  defaultPath: string;
}

export const AVAILABLE_ROLES: RoleConfig[] = [
  {
    role: "super_admin",
    label: "Super Admin",
    badge: "Platform Owner",
    description: "Full application, company, security and system control",
    defaultPath: "/dashboard/super-admin",
  },
  {
    role: "hr_admin",
    label: "HR Admin",
    badge: "HR",
    description: "Complete HR administration and workforce management",
    defaultPath: "/dashboard",
  },
  {
    role: "employee",
    label: "Employee",
    badge: "Self Service",
    description: "Personal employee portal and self-service",
    defaultPath: "/dashboard/employee",
  },
  {
    role: "manager",
    label: "Manager",
    badge: "Team",
    description: "Team management, approvals and team operations",
    defaultPath: "/dashboard/manager",
  },
  {
    role: "it_admin",
    label: "IT Admin",
    badge: "IT",
    description: "IT, assets, access and system operations",
    defaultPath: "/dashboard/admin",
  },
  {
    role: "executive",
    label: "Executive",
    badge: "Executive",
    description: "Executive business intelligence and reporting",
    defaultPath: "/dashboard/executive",
  },
  {
    role: "recruiter",
    label: "Recruiter",
    badge: "Talent",
    description: "Talent acquisition, candidate pipelines and job requisitions",
    defaultPath: "/dashboard/recruitment",
  },
];

export interface AurixUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  companyId: string;
  company_name?: string;
  companyName?: string;
  emailVerified: boolean;
  onboardingComplete: boolean;
  documentVerificationStatus?: "NOT_STARTED" | "IN_PROGRESS" | "VERIFIED" | "FAILED";
  documentsVerified?: boolean;
  documentsVerifiedAt?: string;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  logoDataUrl?: string;
  logoUrl?: string;
  stampDataUrl?: string;
  stampUrl?: string;
  company_stamp_url?: string;
  company_stamp?: string;
  company_logo_url?: string;
  company_logo?: string;
  signatureDataUrl?: string;
  signatureUrl?: string;
  signature_url?: string;
  digital_signature_url?: string;
  signatoryName?: string;
  signatoryDesignation?: string;
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
  currency?: string;
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
  location?: string;
  bloodGroup?: string;
  salary?: string;
  ctc?: string;
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
  category: "Employee Documents" | "Education" | "Employment" | "Company Documents";
  type: string;
  uploadedBy: string;
  uploadDate: string;
  expiryDate?: string;
  status: "Verified" | "Pending" | "Rejected" | "Expired";
  fileSize: string;
  fileType: "pdf" | "jpg" | "png" | "docx";
  description?: string;
  rejectionReason?: string;
  fileUrl?: string;
}

export interface HRDocumentActivity {
  id: string;
  documentId: string;
  documentName: string;
  action: "Uploaded" | "Verified" | "Rejected" | "Downloaded" | "Updated";
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

const KEY = "aurix:workspace:v3";
const REMEMBER_KEY = "aurix:remember";
const MOCK_SEED_KEY = "aurix:mock_hr_seeded";

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
  // Purge any leftover mock demo workspace data from prior development builds
  const storedAccessToken = safeStorage.getItem("aurix:access_token") || safeStorage.getItem("access_token");
  if (safeStorage.getItem(MOCK_SEED_KEY) === "1" || storedAccessToken?.startsWith("mock-demo-")) {
    safeStorage.removeItem(MOCK_SEED_KEY);
    safeStorage.removeItem(KEY);
    safeStorage.removeItem("aurix:access_token");
    safeStorage.removeItem("access_token");
    safeStorage.removeItem("aurix:tokens");
    safeStorage.removeItem("ofc_session_hint");
  }

  const raw = safeStorage.getItem(KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      delete parsed.documents;
      delete parsed.documentActivities;
      state = {
        ...defaultState,
        ...parsed,
        user: parsed.user
          ? { ...parsed.user, role: normalizeRole(parsed.user.role) || "employee" }
          : null,
      };
    } catch {
      state = { ...defaultState };
    }
  } else {
    state = { ...defaultState };
  }
  state.isRestoring = false;
}
load();

function persist() {
  const toSave = { ...state };
  delete toSave.isRestoring;
  delete toSave.documents;
  delete toSave.documentActivities;
  safeStorage.setItem(KEY, JSON.stringify(toSave));
}

function emit() {
  listeners.forEach((l) => l());
}

export const aurix = {
  get: () => state,
  set: (partial: Partial<Workspace>) => {
    state = {
      ...state,
      ...partial,
      user:
        partial.user !== undefined
          ? partial.user
            ? { ...partial.user, role: normalizeRole(partial.user.role) || "employee" }
            : null
          : state.user,
    };
    persist();
    emit();
  },
  reset: () => {
    state = defaultState;
    persist();
    emit();
  },
  switchRole: (role: Role) => {
    if (!import.meta.env.DEV) return;
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
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
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
