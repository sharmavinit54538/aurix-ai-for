import "@testing-library/jest-dom/vitest";
import { setupServer } from "msw/node";
import { beforeAll, afterEach, afterAll } from "vitest";

export const server = setupServer();

class ResizeObserverShim {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof window !== "undefined" && !window.ResizeObserver) {
  window.ResizeObserver = ResizeObserverShim;
}
if (typeof globalThis !== "undefined" && !globalThis.ResizeObserver) {
  globalThis.ResizeObserver = ResizeObserverShim;
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
