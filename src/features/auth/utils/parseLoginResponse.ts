import type { AuthUserPayload } from "@/api/types";

export interface ParsedLoginResult {
  accessToken: string;
  refreshToken: string;
  user: AuthUserPayload;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function normalizeUser(raw: unknown): AuthUserPayload | null {
  const user = asRecord(raw);
  if (!user || typeof user.email !== "string") return null;

  const first = typeof user.first_name === "string" ? user.first_name : "";
  const last = typeof user.last_name === "string" ? user.last_name : "";
  const combinedName = [first, last].filter(Boolean).join(" ");

  return {
    id: typeof user.id === "string" || typeof user.id === "number" ? user.id : "",
    name: String(user.name ?? user.full_name ?? user.fullName ?? combinedName ?? ""),
    email: user.email,
    phone: typeof user.phone === "string" ? user.phone : undefined,
    role: (user.role ?? "employee") as AuthUserPayload["role"],
    is_verified: Boolean(user.is_verified ?? user.isVerified ?? user.email_verified),
    onboarding_completed: Boolean(user.onboarding_completed ?? user.onboardingCompleted),
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

export function parseLoginResponse(res: unknown): ParsedLoginResult | null {
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

  const user = normalizeUser(userCandidate);

  if (typeof accessToken !== "string" || typeof refreshToken !== "string" || !user) {
    return null;
  }

  return { accessToken, refreshToken, user };
}

export function getApiResponseMessage(res: unknown, fallback = "Server error"): string {
  const body = asRecord(res);
  if (!body) return fallback;
  return typeof body.message === "string" && body.message ? body.message : fallback;
}
