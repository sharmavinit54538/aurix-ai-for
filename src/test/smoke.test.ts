import { describe, it, expect } from "vitest";

describe("Test Infrastructure Smoke Test", () => {
  it("runs in jsdom environment with DOM globals", () => {
    expect(window).toBeDefined();
    expect(document).toBeDefined();
    expect(localStorage).toBeDefined();
  });
});
