import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";
import { guardGuestAuthRoute } from "@/lib/auth-route-guards";

const PageComponent = lazyFeaturePage(() => import("@/features/auth/pages/LoginPage"));

export const Route = createFileRoute("/login")({
  beforeLoad: async ({ search }) => guardGuestAuthRoute("login", search as Record<string, unknown>),
  head: () => ({ meta: [{ title: "Sign In — OFC360" }] }),
  component: PageComponent,
});
