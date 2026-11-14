import { getDefaultDashboardPath } from "./role-paths";
import { normalizeRole } from "./roles";
import { safeStorage } from "./safe-storage";

export const ACTIVATED_TOKENS_STORAGE_KEY = "ofc360:activated_invite_tokens";
export const HR_ONBOARDING_COMPLETED_STORAGE_KEY = "ofc360:hr_onboarding_completed";

export interface OnboardingUserLike {
  id?: string;
  role?: string | null;
  emailVerified?: boolean;
  is_verified?: boolean;
  onboardingComplete?: boolean;
  onboarding_completed?: boolean;
  onboardingCompleted?: boolean;
  is_onboarded?: boolean;
}

export function isUserOnboardingComplete(user: OnboardingUserLike | null | undefined): boolean {
  if (!user || typeof user !== "object") {
    return false;
  }
  return Boolean(
    user.onboardingComplete === true ||
      user.onboarding_completed === true ||
      user.onboardingCompleted === true ||
      user.is_onboarded === true,
  );
}

function readStorageItem(key: string, storage?: Storage | null): string | null {
  if (storage) {
    try {
      return storage.getItem(key);
    } catch {
      return null;
    }
  }
  return safeStorage.getItem(key);
}

function writeStorageItem(key: string, value: string, storage?: Storage | null): void {
  if (storage) {
    try {
      storage.setItem(key, value);
    } catch {
      /* ignore */
    }
    return;
  }
  safeStorage.setItem(key, value);
}

function removeStorageItem(key: string, storage?: Storage | null): void {
  if (storage) {
    try {
      storage.removeItem(key);
    } catch {
      /* ignore */
    }
    return;
  }
  safeStorage.removeItem(key);
}

export function getActivatedInviteTokens(storage?: Storage | null): string[] {
  const raw = readStorageItem(ACTIVATED_TOKENS_STORAGE_KEY, storage);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.map((item) => String(item).trim()).filter(Boolean)
      : [];
  } catch {
    return [];
  }
}

export function isInviteTokenActivated(
  token: string | null | undefined,
  storage?: Storage | null,
): boolean {
  const clean = String(token || "").trim();
  if (!clean) return false;
  return getActivatedInviteTokens(storage).includes(clean);
}

export function markInviteTokenActivated(
  token: string | null | undefined,
  storage?: Storage | null,
): void {
  const clean = String(token || "").trim();
  if (!clean) return;
  const existing = getActivatedInviteTokens(storage);
  if (existing.includes(clean)) return;
  writeStorageItem(
    ACTIVATED_TOKENS_STORAGE_KEY,
    JSON.stringify([...existing, clean]),
    storage,
  );
}

export function isHrOnboardingCompletedInStorage(storage?: Storage | null): boolean {
  return readStorageItem(HR_ONBOARDING_COMPLETED_STORAGE_KEY, storage) === "1";
}

export function markHrOnboardingCompletedInStorage(
  completed: boolean,
  storage?: Storage | null,
): void {
  if (completed) {
    writeStorageItem(HR_ONBOARDING_COMPLETED_STORAGE_KEY, "1", storage);
  } else {
    removeStorageItem(HR_ONBOARDING_COMPLETED_STORAGE_KEY, storage);
  }
}

export interface OnboardingGuardInput {
  user: OnboardingUserLike | null | undefined;
  hasInviteToken: boolean;
  inviteAlreadyActivated?: boolean;
  justCompleted?: boolean;
  hrOnboardingCompleted?: boolean;
}

/**
 * Determines whether the `/onboarding` route should immediately redirect away
 * because onboarding is a one-time-only step and has already been completed.
 *
 * Returns `null` if the user is allowed to remain on `/onboarding`.
 */
export function resolveOnboardingGuardRedirect({
  user,
  hasInviteToken,
  inviteAlreadyActivated = false,
  justCompleted = false,
  hrOnboardingCompleted = false,
}: OnboardingGuardInput): string | null {
  if (justCompleted) {
    return null;
  }

  if (hasInviteToken) {
    if (inviteAlreadyActivated && user && isUserOnboardingComplete(user)) {
      return getDefaultDashboardPath(user as any);
    }
    return null;
  }

  if (user) {
    const emailVerified =
      "emailVerified" in user
        ? user.emailVerified !== false
        : "is_verified" in user
          ? user.is_verified !== false
          : true;

    if (!emailVerified) {
      return null;
    }

    if (isUserOnboardingComplete(user)) {
      return getDefaultDashboardPath(user as any);
    }

    if (hrOnboardingCompleted && normalizeRole(user.role) === "hr_admin") {
      return getDefaultDashboardPath({ ...user, onboardingComplete: true } as any);
    }
  }

  return null;
}

export interface RootEntryInput {
  user: OnboardingUserLike | null | undefined;
  hasAccessToken?: boolean;
  demoInviteActivated?: boolean;
  hrOnboardingCompleted?: boolean;
  demoInviteToken?: string;
}

/**
 * Resolves where `/` should navigate:
 * - Once onboarding or the initial employee demo invite has been completed, never
 *   send the user back into onboarding again; send them straight to their dashboard.
 * - Un-onboarded HR Admins go to `/onboarding`.
 * - Only on a clean initial session (before any onboarding/activation has occurred
 *   and while still on the untouched demo placeholder or unauthenticated) opens the
 *   one-time employee onboarding demo.
 */
export function resolveRootEntryDestination({
  user,
  hasAccessToken = false,
  demoInviteActivated = false,
  hrOnboardingCompleted = false,
  demoInviteToken = "emp_invite_demo",
}: RootEntryInput): { to: string; search?: Record<string, string> } {
  const role = normalizeRole(user?.role);
  const userOnboarded = isUserOnboardingComplete(user);

  if (user && !userOnboarded) {
    if (role === "hr_admin" && !hrOnboardingCompleted) {
      return { to: "/onboarding" };
    }
    return { to: getDefaultDashboardPath(user as any) };
  }

  const isUntouchedDefaultPlaceholder = Boolean(
    user &&
      user.id === "usr-1" &&
      !hasAccessToken &&
      !demoInviteActivated &&
      !hrOnboardingCompleted,
  );

  if ((!user || isUntouchedDefaultPlaceholder) && !demoInviteActivated && !hrOnboardingCompleted) {
    return {
      to: "/onboarding",
      search: { token: demoInviteToken },
    };
  }

  return { to: getDefaultDashboardPath(user as any) };
}
