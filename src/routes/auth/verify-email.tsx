import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const VerifyEmailPage = lazyFeaturePage(
  () => import("@/features/auth/pages/VerifyEmailPage"),
  "VerifyEmailPage",
);

export const Route = createFileRoute("/auth/verify-email")({
  head: () => ({ meta: [{ title: "Verify your email — OFC360" }] }),
  component: VerifyEmailPage,
});
