import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";
import { guardGuestAuthRoute } from "@/lib/auth-route-guards";

const VerifyEmailPage = lazyFeaturePage(
  () => import("@/features/auth/pages/VerifyEmailPage"),
  "VerifyEmailPage",
);

export const Route = createFileRoute("/auth/verify-email")({
  beforeLoad: async ({ search }) =>
    guardGuestAuthRoute("verify_email", search as Record<string, unknown>),
  head: () => ({ meta: [{ title: "Verify your email — OFC360" }] }),
  component: VerifyEmailPage,
});
