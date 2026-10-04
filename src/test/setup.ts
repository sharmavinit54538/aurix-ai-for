import "@testing-library/jest-dom/vitest";
import { setupServer } from "msw/node";
import { beforeAll, afterEach, afterAll } from "vitest";

export const server = setupServer();

class ResizeObserverShim {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof window !== "undefined") {
  if (!window.ResizeObserver) {
    window.ResizeObserver = ResizeObserverShim;
  }
  if (typeof window.isSecureContext === "undefined") {
    Object.defineProperty(window, "isSecureContext", { value: true, writable: true, configurable: true });
  }
}
if (typeof globalThis !== "undefined" && !globalThis.ResizeObserver) {
  globalThis.ResizeObserver = ResizeObserverShim;
}

if (typeof Blob !== "undefined" && !Blob.prototype.stream) {
  Blob.prototype.stream = function stream() {
    return new ReadableStream({
      start: async (controller) => {
        const buffer = await this.arrayBuffer();
        controller.enqueue(new Uint8Array(buffer));
        controller.close();
      },
    });
  };
}

beforeAll(() => {
  server.listen({ onUnhandledRequest: "warn" });
});

afterEach(() => {
  server.resetHandlers();
  try {
    localStorage.clear();
  } catch {
    // ignore in environments without localStorage
  }
  try {
    sessionStorage.clear();
  } catch {
    // ignore in environments without sessionStorage
  }
});

afterAll(() => {
  server.close();
});
