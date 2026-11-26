import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";
import { guardGuestAuthRoute } from "@/lib/auth-route-guards";

const LoginPage = lazyFeaturePage(
  () => import("@/features/auth/pages/LoginPage"),
  "LoginPage",
);

export const Route = createFileRoute("/auth/login")({
  beforeLoad: async ({ search }) => guardGuestAuthRoute("login", search as Record<string, unknown>),
  head: () => ({ meta: [{ title: "Sign in — OFC360" }] }),
  component: LoginPage,
});
