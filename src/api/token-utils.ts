import { getTokens } from "./tokens";

function parseJwtPayload(token: string): { exp?: number } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return payload && typeof payload === "object" ? payload : null;
  } catch {
    return null;
  }
}

/** Returns true when the access token is missing or past its expiry (with optional leeway). */
export function isAccessTokenExpired(token: string, leewaySec = 30): boolean {
  const payload = parseJwtPayload(token);
  if (!payload?.exp) return false;
  return Date.now() >= (payload.exp - leewaySec) * 1000;
}

export function hasValidAccessToken(): boolean {
  const tokens = getTokens();
  if (!tokens?.accessToken) return false;
  return !isAccessTokenExpired(tokens.accessToken);
}
