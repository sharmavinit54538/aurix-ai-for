import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";
import { guardGuestAuthRoute } from "@/lib/auth-route-guards";

const RegisterPage = lazyFeaturePage(
  () => import("@/features/auth/pages/RegisterPage"),
  "RegisterPage",
);

export const Route = createFileRoute("/auth/register")({
  beforeLoad: async ({ search }) => guardGuestAuthRoute("register", search as Record<string, unknown>),
  head: () => ({ meta: [{ title: "Create your workspace — OFC360" }] }),
  component: RegisterPage,
});
