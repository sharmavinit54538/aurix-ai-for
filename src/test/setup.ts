import "@testing-library/jest-dom/vitest";
import { afterAll, afterEach, beforeAll } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// jsdom's Blob implementation omits `.stream()`, which MSW uses when serializing Blob responses
if (typeof Blob !== "undefined" && typeof Blob.prototype.stream !== "function") {
  Blob.prototype.stream = function stream() {
    return new ReadableStream({
      start: async (controller) => {
        try {
          const buf = await this.arrayBuffer();
          controller.enqueue(new Uint8Array(buf));
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });
  };
}

const defaultHandlers = [
  // Prevent 401 refresh retries from hanging or hitting real network in unit tests
  http.post("*/api/v1/auth/refresh", () =>
    HttpResponse.json({ message: "Unauthorized" }, { status: 401 })
  ),
];

export const server = setupServer(...defaultHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
