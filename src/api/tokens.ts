/**
 * In-memory Access Token Manager
 *
 * Security enhancement:
 * - Access token is stored exclusively in a module-scoped memory variable.
 * - Refresh token is NEVER stored in frontend JavaScript (stored in HttpOnly, Secure, SameSite cookie by backend).
 * - Legacy localStorage keys ("aurix:tokens") are cleaned up to mitigate XSS risks.
 */

const LEGACY_TOKENS_KEY = "aurix:tokens";

let inMemoryAccessToken: string | null = null;

// Initial migration: Purge legacy tokens from localStorage if present
if (typeof window !== "undefined") {
  try {
    localStorage.removeItem(LEGACY_TOKENS_KEY);
  } catch {}
}

export interface Tokens {
  accessToken: string;
  refreshToken?: string;
}

export function getTokens(): Tokens | null {
  if (!inMemoryAccessToken) return null;
  return {
    accessToken: inMemoryAccessToken,
    refreshToken: "",
  };
}

export function setTokens(tokens: { accessToken?: string; refreshToken?: string } | null) {
  inMemoryAccessToken = tokens?.accessToken || null;
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(LEGACY_TOKENS_KEY);
    } catch {}
  }
}

export function getAccessToken(): string | null {
  return inMemoryAccessToken;
}

export function setAccessToken(token: string | null) {
  inMemoryAccessToken = token;
}

export function clearTokens() {
  inMemoryAccessToken = null;
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(LEGACY_TOKENS_KEY);
    } catch {}
  }
}
