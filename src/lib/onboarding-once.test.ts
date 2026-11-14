import test from "node:test";
import assert from "node:assert/strict";
import {
  isUserOnboardingComplete,
  resolveOnboardingGuardRedirect,
  resolveRootEntryDestination,
  markInviteTokenActivated,
  isInviteTokenActivated,
  markHrOnboardingCompletedInStorage,
  isHrOnboardingCompletedInStorage,
} from "./onboarding-once";

function createMemoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear() {
      map.clear();
    },
    getItem(key: string) {
      return map.has(key) ? map.get(key)! : null;
    },
    key(index: number) {
      return Array.from(map.keys())[index] ?? null;
    },
    removeItem(key: string) {
      map.delete(key);
    },
    setItem(key: string, value: string) {
      map.set(key, String(value));
    },
  };
}

test("isUserOnboardingComplete checks all supported completion flags", () => {
  assert.equal(isUserOnboardingComplete(null), false);
  assert.equal(isUserOnboardingComplete({ onboardingComplete: false }), false);
  assert.equal(isUserOnboardingComplete({ onboardingComplete: true }), true);
  assert.equal(isUserOnboardingComplete({ onboarding_completed: true }), true);
  assert.equal(isUserOnboardingComplete({ onboardingCompleted: true }), true);
  assert.equal(isUserOnboardingComplete({ is_onboarded: true }), true);
});

test("resolveOnboardingGuardRedirect redirects already-onboarded users away from /onboarding", () => {
  assert.equal(
    resolveOnboardingGuardRedirect({
      user: { id: "usr-1", role: "hr_admin", emailVerified: true, onboardingComplete: true },
      hasInviteToken: false,
    }),
    "/dashboard",
  );

  assert.equal(
    resolveOnboardingGuardRedirect({
      user: { id: "emp-kabir", role: "employee", emailVerified: true, onboardingComplete: true },
      hasInviteToken: false,
    }),
    "/dashboard/employee",
  );

  assert.equal(
    resolveOnboardingGuardRedirect({
      user: { id: "emp-kabir", role: "employee", emailVerified: true, onboardingComplete: true },
      hasInviteToken: true,
      inviteAlreadyActivated: true,
    }),
    "/dashboard/employee",
  );
});

test("resolveOnboardingGuardRedirect permits one-time onboarding only when incomplete or justCompleted", () => {
  assert.equal(
    resolveOnboardingGuardRedirect({
      user: { id: "hr-new", role: "hr_admin", emailVerified: true, onboardingComplete: false },
      hasInviteToken: false,
    }),
    null,
  );

  assert.equal(
    resolveOnboardingGuardRedirect({
      user: { id: "hr-new", role: "hr_admin", emailVerified: true, onboardingComplete: true },
      hasInviteToken: false,
      justCompleted: true,
    }),
    null,
  );

  assert.equal(
    resolveOnboardingGuardRedirect({
      user: { id: "usr-1", role: "hr_admin", emailVerified: true, onboardingComplete: true },
      hasInviteToken: true,
      inviteAlreadyActivated: false,
    }),
    null,
  );
});

test("resolveRootEntryDestination enters demo onboarding once, then always routes to dashboard", () => {
  const placeholderUser = { id: "usr-1", role: "hr_admin", emailVerified: true, onboardingComplete: true };

  // First-ever visit: allowed to open one-time employee demo onboarding
  assert.deepEqual(
    resolveRootEntryDestination({
      user: placeholderUser,
      hasAccessToken: false,
      demoInviteActivated: false,
      hrOnboardingCompleted: false,
    }),
    { to: "/onboarding", search: { token: "emp_invite_demo" } },
  );

  // After employee completes onboarding once: never goes back to onboarding
  const activatedEmployee = { id: "emp-kabir", role: "employee", emailVerified: true, onboardingComplete: true };
  assert.deepEqual(
    resolveRootEntryDestination({
      user: activatedEmployee,
      hasAccessToken: true,
      demoInviteActivated: true,
      hrOnboardingCompleted: false,
    }),
    { to: "/dashboard/employee" },
  );

  // Even on placeholder user, once demo invite was already activated, `/` goes to dashboard
  assert.deepEqual(
    resolveRootEntryDestination({
      user: placeholderUser,
      hasAccessToken: false,
      demoInviteActivated: true,
      hrOnboardingCompleted: false,
    }),
    { to: "/dashboard" },
  );

  // Pending HR Admin with incomplete onboarding goes to /onboarding
  assert.deepEqual(
    resolveRootEntryDestination({
      user: { id: "hr-2", role: "hr_admin", emailVerified: true, onboardingComplete: false },
      hasAccessToken: true,
      demoInviteActivated: false,
      hrOnboardingCompleted: false,
    }),
    { to: "/onboarding" },
  );
});

test("storage helpers persist activated tokens and HR onboarding completion idempotently", () => {
  const storage = createMemoryStorage();
  assert.equal(isInviteTokenActivated("emp_invite_demo", storage), false);
  markInviteTokenActivated("emp_invite_demo", storage);
  markInviteTokenActivated("emp_invite_demo", storage);
  assert.equal(isInviteTokenActivated("emp_invite_demo", storage), true);

  assert.equal(isHrOnboardingCompletedInStorage(storage), false);
  markHrOnboardingCompletedInStorage(true, storage);
  assert.equal(isHrOnboardingCompletedInStorage(storage), true);
  markHrOnboardingCompletedInStorage(false, storage);
  assert.equal(isHrOnboardingCompletedInStorage(storage), false);
});
