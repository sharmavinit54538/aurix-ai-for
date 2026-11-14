import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const VerifyResetOtpPage = lazyFeaturePage(
  () => import("@/features/auth/pages/VerifyResetOtpPage"),
  "VerifyResetOtpPage",
);

export const Route = createFileRoute("/auth/verify-reset-otp")({
  validateSearch: z.object({
    email: z.string().optional(),
  }),
  head: () => ({ meta: [{ title: "Verify OTP — OFC360" }] }),
  component: VerifyResetOtpPage,
});
