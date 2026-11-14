import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/auth/pages/VerifyResetOtpPage"));

export const Route = createFileRoute("/verify-reset-otp")({
  head: () => ({ meta: [{ title: "Verify OTP — OFC360" }] }),
  component: PageComponent,
});
