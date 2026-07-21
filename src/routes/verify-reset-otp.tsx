import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { VerifyResetOtpPage } from "@/features/auth/pages/VerifyResetOtpPage";

export const Route = createFileRoute("/verify-reset-otp")({
  validateSearch: z.object({
    email: z.string().optional(),
  }),
  head: () => ({ meta: [{ title: "Verify OTP — Aurix" }] }),
  component: VerifyResetOtpPage,
});
