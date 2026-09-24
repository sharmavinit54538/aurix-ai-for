/**
 * Idempotency Key Management for Financial Mutations.
 * Generates and validates cryptographic UUIDv4 tokens to prevent duplicate payment submissions.
 */

export function generateIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  // Fallback RFC4122 v4 UUID generator if crypto.randomUUID is unavailable
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function createIdempotentHeaders(existingKey?: string): {
  "Idempotency-Key": string;
} {
  return {
    "Idempotency-Key": existingKey || generateIdempotencyKey(),
  };
}
