export interface OtpTimingMeta {
  otp_expires_at?: string;
  otpExpiresAt?: string;
  expires_in?: number;
  expiresIn?: number;
  resend_available_at?: string;
  resendAvailableAt?: string;
  resend_cooldown_seconds?: number;
  resendCooldownSeconds?: number;
}

export interface StoredOtpTimerState {
  otpExpiresAt: string;
  resendAvailableAt: string;
}

const STORAGE_PREFIX = "aurix:otp_timer:";

function safeGetSessionStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function buildOtpTimerKey(email?: string | null, verificationId?: string | null): string {
  const cleanEmail = (email || "").trim().toLowerCase();
  const cleanVid = (verificationId || "").trim();
  if (cleanEmail && cleanVid) return `${cleanEmail}|${cleanVid}`;
  return cleanEmail || cleanVid || "default";
}

export function extractOtpMeta(res: unknown): OtpTimingMeta | null {
  if (!res || typeof res !== "object") return null;
  const record = res as Record<string, unknown>;
  const data =
    record.data && typeof record.data === "object" ? (record.data as Record<string, unknown>) : null;
  const meta =
    (record.meta && typeof record.meta === "object" ? (record.meta as Record<string, unknown>) : null) ??
    (data?.meta && typeof data.meta === "object" ? (data.meta as Record<string, unknown>) : null);

  if (!meta) return null;
  return meta as OtpTimingMeta;
}

export function computeSecondsRemaining(isoTimestamp?: string | null, fallback = 0): number {
  if (!isoTimestamp) return Math.max(0, fallback);
  const targetMs = Date.parse(isoTimestamp);
  if (!Number.isFinite(targetMs)) return Math.max(0, fallback);
  return Math.max(0, Math.ceil((targetMs - Date.now()) / 1000));
}

export function saveOtpTimerState(
  scopeKey: string,
  meta?: OtpTimingMeta | null,
  defaults?: { expirySeconds?: number; cooldownSeconds?: number },
): { expirySeconds: number; resendSeconds: number } {
  const fallbackExpiry = defaults?.expirySeconds ?? 600;
  const fallbackCooldown = defaults?.cooldownSeconds ?? 30;
  const now = Date.now();

  const rawExpiresAt = meta?.otp_expires_at ?? meta?.otpExpiresAt;
  const rawExpiresIn = meta?.expires_in ?? meta?.expiresIn;
  const rawResendAt = meta?.resend_available_at ?? meta?.resendAvailableAt;
  const rawCooldown = meta?.resend_cooldown_seconds ?? meta?.resendCooldownSeconds;

  const otpExpiresAt =
    typeof rawExpiresAt === "string" && Number.isFinite(Date.parse(rawExpiresAt))
      ? rawExpiresAt
      : new Date(
          now + (typeof rawExpiresIn === "number" && rawExpiresIn >= 0 ? rawExpiresIn : fallbackExpiry) * 1000,
        ).toISOString();

  const resendAvailableAt =
    typeof rawResendAt === "string" && Number.isFinite(Date.parse(rawResendAt))
      ? rawResendAt
      : new Date(
          now + (typeof rawCooldown === "number" && rawCooldown >= 0 ? rawCooldown : fallbackCooldown) * 1000,
        ).toISOString();

  const storage = safeGetSessionStorage();
  if (storage) {
    try {
      const payload: StoredOtpTimerState = { otpExpiresAt, resendAvailableAt };
      storage.setItem(`${STORAGE_PREFIX}${scopeKey}`, JSON.stringify(payload));
    } catch {
      // Ignore storage quota errors
    }
  }

  return {
    expirySeconds: computeSecondsRemaining(otpExpiresAt, fallbackExpiry),
    resendSeconds: computeSecondsRemaining(resendAvailableAt, fallbackCooldown),
  };
}

export function loadOtpTimerState(
  scopeKey: string,
): { expirySeconds: number; resendSeconds: number; otpExpiresAt: string; resendAvailableAt: string } | null {
  const storage = safeGetSessionStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(`${STORAGE_PREFIX}${scopeKey}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredOtpTimerState>;
    if (!parsed.otpExpiresAt || !parsed.resendAvailableAt) return null;
    return {
      otpExpiresAt: parsed.otpExpiresAt,
      resendAvailableAt: parsed.resendAvailableAt,
      expirySeconds: computeSecondsRemaining(parsed.otpExpiresAt, 0),
      resendSeconds: computeSecondsRemaining(parsed.resendAvailableAt, 0),
    };
  } catch {
    return null;
  }
}

export function clearOtpTimerState(scopeKey: string): void {
  const storage = safeGetSessionStorage();
  if (!storage) return;
  try {
    storage.removeItem(`${STORAGE_PREFIX}${scopeKey}`);
  } catch {
    // Ignore storage removal errors
  }
}
