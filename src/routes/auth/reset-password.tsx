import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ResetPasswordPage } from "@/features/auth/pages/ResetPasswordPage";

export const Route = createFileRoute("/auth/reset-password")({
  validateSearch: z.object({
    email: z.string().optional(),
    resetToken: z.string().optional(),
    token: z.string().optional(),
  }),
  head: () => ({ meta: [{ title: "Set new password — Aurix" }] }),
  component: ResetPasswordPage,
});
