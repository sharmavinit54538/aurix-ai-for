import { describe, it, expect } from "vitest";
import { generateIdempotencyKey, createIdempotentHeaders } from "../utils/idempotency";

describe("Idempotency Management", () => {
  it("generates a valid UUIDv4 string", () => {
    const key = generateIdempotencyKey();
    expect(key).toBeDefined();
    expect(typeof key).toBe("string");
    // Standard UUIDv4 regex
    expect(key).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  it("generates distinct keys across successive calls to prevent collision", () => {
    const keys = new Set(Array.from({ length: 100 }, () => generateIdempotencyKey()));
    expect(keys.size).toBe(100);
  });

  it("creates idempotency headers with generated or provided key", () => {
    const headers1 = createIdempotentHeaders();
    expect(headers1["Idempotency-Key"]).toBeDefined();

    const customKey = "11111111-2222-4333-8444-555555555555";
    const headers2 = createIdempotentHeaders(customKey);
    expect(headers2["Idempotency-Key"]).toBe(customKey);
  });
});
