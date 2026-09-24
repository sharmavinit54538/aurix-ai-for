import "@testing-library/jest-dom/vitest";
import { setupServer } from "msw/node";
import { beforeAll, afterEach, afterAll } from "vitest";

export const server = setupServer();

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
