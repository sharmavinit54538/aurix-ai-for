import { safeStorage } from "./safe-storage";
import { normalizeRole } from "./roles";

export interface SuperAdminAccount {
  id: string;
  name: string;
  email: string;
  role: "super_admin";
  status: "active" | "inactive";
  isPlatformOwner: true;
  createdAt: string;
  lastLogin: string;
}

const SUPER_ADMIN_STORAGE_KEY = "ofc360:platform_owner:v1";

/**
 * Default safe initialization credentials from environment or platform defaults.
 */
export const INITIAL_SUPER_ADMIN_CONFIG = {
  email:
    (typeof process !== "undefined" && process.env?.INITIAL_SUPER_ADMIN_EMAIL) ||
    (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_INITIAL_SUPER_ADMIN_EMAIL) ||
    "owner@ofc360.com",
  name: "Platform Owner",
  id: "sa_owner_001",
};

/**
 * Loads the existing single Super Admin record from persistent storage,
 * or safely initializes it if this is the first system boot.
 */
export function getSingleSuperAdmin(): SuperAdminAccount {
  const raw = safeStorage.getItem(SUPER_ADMIN_STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.email) {
        return parsed as SuperAdminAccount;
      }
    } catch {
      // Fallback to fresh seed
    }
  }

  // Safe first-time initialization
  const initialOwner: SuperAdminAccount = {
    id: INITIAL_SUPER_ADMIN_CONFIG.id,
    name: INITIAL_SUPER_ADMIN_CONFIG.name,
    email: INITIAL_SUPER_ADMIN_CONFIG.email,
    role: "super_admin",
    status: "active",
    isPlatformOwner: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };

  safeStorage.setItem(SUPER_ADMIN_STORAGE_KEY, JSON.stringify(initialOwner));
  return initialOwner;
}

/**
 * Checks if a Super Admin account already exists.
 * Because OFC360 has a strict single-instance constraint, this will be true after initialization.
 */
export function doesSuperAdminExist(): boolean {
  const owner = getSingleSuperAdmin();
  return Boolean(owner && owner.email);
}

/**
 * Validates whether an email belongs to the sole platform Super Admin.
 */
export function isPlatformOwnerEmail(email?: string | null): boolean {
  if (!email) return false;
  const owner = getSingleSuperAdmin();
  return owner.email.trim().toLowerCase() === email.trim().toLowerCase();
}

/**
 * Validates a proposed role for a new user or signup.
 * Throws an Error / rejects if someone tries to create a SUPER_ADMIN via normal routes.
 */
export function assertCanCreateRole(
  requestedRole: string | null | undefined,
  targetEmail?: string,
): void {
  const norm = normalizeRole(requestedRole);

  if (norm === "super_admin") {
    // If a super admin already exists, unconditionally prevent creating a second one
    if (doesSuperAdminExist()) {
      const owner = getSingleSuperAdmin();
      if (!targetEmail || targetEmail.trim().toLowerCase() !== owner.email.toLowerCase()) {
        throw new Error(
          "Single-Instance Violation: OFC360 allows exactly ONE Super Admin platform owner. " +
            "Creation of a secondary Super Admin is strictly prohibited.",
        );
      }
    }
  }
}

/**
 * Enforces single-instance restriction on updating or saving the Super Admin profile.
 */
export function updateSuperAdmin(updates: Partial<SuperAdminAccount>): SuperAdminAccount {
  const current = getSingleSuperAdmin();
  const updated: SuperAdminAccount = {
    ...current,
    ...updates,
    role: "super_admin",
    isPlatformOwner: true,
  };
  safeStorage.setItem(SUPER_ADMIN_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}
