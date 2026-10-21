import type { AuthUserPayload } from "@/api/types";
import { normalizeRole } from "@/lib/rbac";

export interface AuthenticatedLoginResult {
  status: "authenticated";
  accessToken: string;
  refreshToken: string;
  user: AuthUserPayload;
}

export interface VerificationRequiredLoginResult {
  status: "verification_required";
  email: string;
  userId?: string;
  message?: string;
  tempToken?: string;
  mode?: string;
}

export type ParsedLoginResult = AuthenticatedLoginResult | VerificationRequiredLoginResult;

export function isVerificationRequired(
  login: ParsedLoginResult | null,
): login is VerificationRequiredLoginResult {
  return login?.status === "verification_required";
}

export function isAuthenticated(
  login: ParsedLoginResult | null,
): login is AuthenticatedLoginResult {
  return login?.status === "authenticated";
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function parseJwtRole(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    if (payload && typeof payload === "object") {
      return (
        payload.role ||
        payload.user_role ||
        payload.userRole ||
        payload.role_name ||
        null
      );
    }
    return null;
  } catch {
    return null;
  }
}

function normalizeUser(raw: unknown, tokenRole?: string | null): AuthUserPayload | null {
  const user = asRecord(raw);
  if (!user || typeof user.email !== "string") return null;

  const first = typeof user.first_name === "string" ? user.first_name : "";
  const last = typeof user.last_name === "string" ? user.last_name : "";
  const combinedName = [first, last].filter(Boolean).join(" ");
  const rawRole =
    (typeof user.role === "string" ? user.role : null) ??
    (typeof user.userRole === "string" ? user.userRole : null) ??
    (typeof user.role_name === "string" ? user.role_name : null) ??
    tokenRole ??
    null;

  return {
    id: typeof user.id === "string" || typeof user.id === "number" ? user.id : "",
    name: String(user.name ?? user.full_name ?? user.fullName ?? combinedName ?? ""),
    email: user.email,
    phone: typeof user.phone === "string" ? user.phone : undefined,
    role: normalizeRole(rawRole) ?? "employee",
    is_verified: Boolean(user.is_verified ?? user.isVerified ?? user.email_verified),
    onboarding_completed: Boolean(user.onboarding_completed ?? user.onboardingCompleted ?? false),
    created_at: typeof user.created_at === "string" ? user.created_at : undefined,
    company_id:
      typeof user.company_id === "string" || typeof user.company_id === "number"
        ? user.company_id
        : typeof user.companyId === "string" || typeof user.companyId === "number"
          ? user.companyId
          : undefined,
    company_name:
      typeof user.company_name === "string"
        ? user.company_name
        : typeof user.companyName === "string"
          ? user.companyName
          : undefined,
  };
}

function isChallengeResponse(sources: Record<string, unknown>[]): boolean {
  for (const src of sources) {
    if (
      src.requires_verification === true ||
      src.requiresVerification === true ||
      src.requires_email_verification === true ||
      src.requiresEmailVerification === true ||
      src.verification_required === true ||
      src.verificationRequired === true ||
      src.requires_otp === true ||
      src.requiresOtp === true ||
      src.otp_required === true ||
      src.otpRequired === true ||
      src.mfa_required === true ||
      src.mfaRequired === true ||
      src.requires_mfa === true ||
      src.requiresMfa === true
    ) {
      return true;
    }

    if (typeof src.status === "string") {
      const s = src.status.toLowerCase();
      if (
        s === "verification_required" ||
        s === "otp_required" ||
        s === "pending_verification" ||
        s === "email_verification_required" ||
        s === "mfa_required"
      ) {
        return true;
      }
    }

    if (typeof src.message === "string") {
      const m = src.message.toLowerCase();
      if (
        m.includes("verification") ||
        m.includes("verify") ||
        m.includes("otp") ||
        m.includes("check your email")
      ) {
        return true;
      }
    }
  }
  return false;
}

export function parseLoginResponse(res: unknown, fallbackEmail?: string): ParsedLoginResult | null {
  const body = asRecord(res);
  if (!body) return null;

  const nested = asRecord(body.data);
  const tokenSources = [asRecord(nested?.tokens), nested, body].filter(Boolean) as Record<string, unknown>[];

  let accessToken: unknown;
  let refreshToken: unknown;
  for (const source of tokenSources) {
    accessToken ??= source.access_token ?? source.accessToken ?? source.token;
    refreshToken ??= source.refresh_token ?? source.refreshToken;
  }

  const userCandidate =
    nested?.user ??
    body.user ??
    (nested &&
    typeof nested.email === "string" &&
    accessToken !== nested.access_token &&
    accessToken !== nested.accessToken
      ? nested
      : null);

  const tokenRole = typeof accessToken === "string" ? parseJwtRole(accessToken) : null;
  const user = normalizeUser(userCandidate, tokenRole);

  if (typeof accessToken === "string" && typeof refreshToken === "string" && user) {
    return {
      status: "authenticated",
      accessToken,
      refreshToken,
      user,
    };
  }

  // Check for email verification / login OTP challenge
  const challengeSources = [nested, body].filter(Boolean) as Record<string, unknown>[];
  const challengeDetected = isChallengeResponse(challengeSources);

  const emailCandidate =
    (typeof nested?.email === "string" ? nested.email : null) ??
    (typeof body.email === "string" ? body.email : null) ??
    (userCandidate && typeof (userCandidate as any).email === "string" ? (userCandidate as any).email : null) ??
    fallbackEmail ??
    "";

  const userIdCandidate =
    (typeof nested?.user_id === "string" || typeof nested?.user_id === "number" ? String(nested.user_id) : null) ??
    (typeof nested?.userId === "string" || typeof nested?.userId === "number" ? String(nested.userId) : null) ??
    (typeof body.user_id === "string" || typeof body.user_id === "number" ? String(body.user_id) : null) ??
    (typeof body.userId === "string" || typeof body.userId === "number" ? String(body.userId) : null) ??
    (userCandidate && (typeof (userCandidate as any).id === "string" || typeof (userCandidate as any).id === "number")
      ? String((userCandidate as any).id)
      : undefined);

  const messageCandidate =
    (typeof body.message === "string" && body.message ? body.message : null) ??
    (typeof nested?.message === "string" && nested.message ? nested.message : null) ??
    (typeof body.detail === "string" && body.detail ? body.detail : null) ??
    (typeof nested?.detail === "string" && nested.detail ? nested.detail : null) ??
    undefined;

  const tempTokenCandidate =
    (typeof nested?.temp_token === "string" ? nested.temp_token : null) ??
    (typeof nested?.tempToken === "string" ? nested.tempToken : null) ??
    (typeof body.temp_token === "string" ? body.temp_token : null) ??
    (typeof body.tempToken === "string" ? body.tempToken : null) ??
    undefined;

  if (challengeDetected || (!accessToken && emailCandidate && messageCandidate)) {
    return {
      status: "verification_required",
      email: emailCandidate,
      userId: userIdCandidate,
      message: messageCandidate || "Verification code sent to your email. Please verify to continue.",
      tempToken: tempTokenCandidate,
    };
  }

  return null;
}

export function getApiResponseMessage(res: unknown, fallback = "Server error"): string {
  const body = asRecord(res);
  if (!body) return fallback;
  return typeof body.message === "string" && body.message ? body.message : fallback;
}
