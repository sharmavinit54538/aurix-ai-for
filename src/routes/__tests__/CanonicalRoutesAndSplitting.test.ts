import { describe, it, expect, vi } from "vitest";

describe("F-09: Canonical Routes, Redirections, and Settings Code-Splitting", () => {
  it("redirects /dashboard/resources/assets to /dashboard/assets", async () => {
    const { Route } = await import("@/routes/dashboard.resources.assets");
    expect(Route.options.beforeLoad).toBeDefined();
    try {
      (Route.options.beforeLoad as any)({});
      expect.fail("Expected redirect exception");
    } catch (err: any) {
      expect(err).toBeDefined();
      expect(err.to || err.options?.to).toBe("/dashboard/assets");
    }
  });

  it("redirects /dashboard/resources/asset-management to /dashboard/asset-management", async () => {
    const { Route } = await import("@/routes/dashboard.resources.asset-management");
    expect(Route.options.beforeLoad).toBeDefined();
    try {
      (Route.options.beforeLoad as any)({});
      expect.fail("Expected redirect exception");
    } catch (err: any) {
      expect(err).toBeDefined();
      expect(err.to || err.options?.to).toBe("/dashboard/asset-management");
    }
  });

  it("redirects /dashboard/exit-management to /dashboard/hr-operations/exit-management", async () => {
    const { Route } = await import("@/routes/dashboard.exit-management");
    expect(Route.options.beforeLoad).toBeDefined();
    try {
      (Route.options.beforeLoad as any)({});
      expect.fail("Expected redirect exception");
    } catch (err: any) {
      expect(err).toBeDefined();
      expect(err.to || err.options?.to).toBe("/dashboard/hr-operations/exit-management");
    }
  });

  it("redirects /dashboard/offboarding to /dashboard/hr-operations/offboarding", async () => {
    const { Route } = await import("@/routes/dashboard.offboarding");
    expect(Route.options.beforeLoad).toBeDefined();
    try {
      (Route.options.beforeLoad as any)({});
      expect.fail("Expected redirect exception");
    } catch (err: any) {
      expect(err).toBeDefined();
      expect(err.to || err.options?.to).toBe("/dashboard/hr-operations/offboarding");
    }
  });

  it("redirects /dashboard/onboarding-checklist to /dashboard/hr-operations/onboarding", async () => {
    const { Route } = await import("@/routes/dashboard.onboarding-checklist");
    expect(Route.options.beforeLoad).toBeDefined();
    try {
      (Route.options.beforeLoad as any)({});
      expect.fail("Expected redirect exception");
    } catch (err: any) {
      expect(err).toBeDefined();
      expect(err.to || err.options?.to).toBe("/dashboard/hr-operations/onboarding");
    }
  });

  it("redirects /dashboard/visitors to /dashboard/hr-operations/visitor-management", async () => {
    const { Route } = await import("@/routes/dashboard.visitors");
    expect(Route.options.beforeLoad).toBeDefined();
    try {
      (Route.options.beforeLoad as any)({});
      expect.fail("Expected redirect exception");
    } catch (err: any) {
      expect(err).toBeDefined();
      expect(err.to || err.options?.to).toBe("/dashboard/hr-operations/visitor-management");
    }
  });

  it("redirects /dashboard/timeline to /dashboard/hr-operations/timeline", async () => {
    const { Route } = await import("@/routes/dashboard.timeline");
    expect(Route.options.beforeLoad).toBeDefined();
    try {
      (Route.options.beforeLoad as any)({});
      expect.fail("Expected redirect exception");
    } catch (err: any) {
      expect(err).toBeDefined();
      expect(err.to || err.options?.to).toBe("/dashboard/hr-operations/timeline");
    }
  });

  it("redirects /dashboard/hr-ops to /dashboard/hr-operations/command-center", async () => {
    const { Route } = await import("@/routes/dashboard.hr-ops");
    expect(Route.options.beforeLoad).toBeDefined();
    try {
      (Route.options.beforeLoad as any)({});
      expect.fail("Expected redirect exception");
    } catch (err: any) {
      expect(err).toBeDefined();
      expect(err.to || err.options?.to).toBe("/dashboard/hr-operations/command-center");
    }
  });

  it("redirects /dashboard/ai-insights to /dashboard/analytics/ai-insights", async () => {
    const { Route } = await import("@/routes/dashboard.ai-insights");
    expect(Route.options.beforeLoad).toBeDefined();
    try {
      (Route.options.beforeLoad as any)({});
      expect.fail("Expected redirect exception");
    } catch (err: any) {
      expect(err).toBeDefined();
      expect(err.to || err.options?.to).toBe("/dashboard/analytics/ai-insights");
    }
  });

  it("redirects /ai/ to /dashboard/ai-hub and AI subroutes to /dashboard/ai-hub/*", async () => {
    const { Route: AiIndexRoute } = await import("@/routes/ai.index");
    try {
      (AiIndexRoute.options.beforeLoad as any)({});
      expect.fail("Expected redirect exception");
    } catch (err: any) {
      expect(err.to || err.options?.to).toBe("/dashboard/ai-hub");
    }

    const { Route: AiDocGenRoute } = await import("@/routes/ai.document-generator");
    try {
      (AiDocGenRoute.options.beforeLoad as any)({});
      expect.fail("Expected redirect exception");
    } catch (err: any) {
      expect(err.to || err.options?.to).toBe("/dashboard/ai-hub/document-generator");
    }

    const { Route: AiChatAssistantRoute } = await import("@/routes/ai.chat-assistant");
    try {
      (AiChatAssistantRoute.options.beforeLoad as any)({});
      expect.fail("Expected redirect exception");
    } catch (err: any) {
      expect(err.to || err.options?.to).toBe("/dashboard/ai-hub/assistant");
    }
  });

  it("confirms duplicate API wrappers are removed", async () => {
    const fs = await import("fs");
    const path = await import("path");
    const aiHubApiPath = path.resolve(process.cwd(), "src/services/aiHubApi.ts");
    const analyticsApiPath = path.resolve(process.cwd(), "src/services/analyticsApi.ts");
    expect(fs.existsSync(aiHubApiPath)).toBe(false);
    expect(fs.existsSync(analyticsApiPath)).toBe(false);
  });
});
