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

// Silence [AUTH] Request/Response console logs in test runs
const originalConsoleLog = console.log;
console.log = (...args: unknown[]) => {
  if (typeof args[0] === "string" && args[0].startsWith("[AUTH]")) {
    return;
  }
  originalConsoleLog(...args);
};

const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  if (typeof args[0] === "string" && args[0].startsWith("[AUTH]")) {
    return;
  }
  originalConsoleError(...args);
};

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
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
