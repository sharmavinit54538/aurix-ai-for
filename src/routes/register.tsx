import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";
import { guardGuestAuthRoute } from "@/lib/auth-route-guards";

const PageComponent = lazyFeaturePage(() => import("@/features/auth/pages/RegisterPage"));

export const Route = createFileRoute("/register")({
  beforeLoad: async ({ search }) => guardGuestAuthRoute("register", search as Record<string, unknown>),
  head: () => ({ meta: [{ title: "Create Account — OFC360" }] }),
  component: PageComponent,
});
