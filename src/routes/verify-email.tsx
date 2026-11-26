import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";
import { guardGuestAuthRoute } from "@/lib/auth-route-guards";

const PageComponent = lazyFeaturePage(() => import("@/features/auth/pages/VerifyEmailPage"));

export const Route = createFileRoute("/verify-email")({
  beforeLoad: async ({ search }) =>
    guardGuestAuthRoute("verify_email", search as Record<string, unknown>),
  head: () => ({ meta: [{ title: "Verify Email — OFC360" }] }),
  component: PageComponent,
});
