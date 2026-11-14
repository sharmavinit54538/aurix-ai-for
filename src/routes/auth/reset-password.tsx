import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const ResetPasswordPage = lazyFeaturePage(
  () => import("@/features/auth/pages/ResetPasswordPage"),
  "ResetPasswordPage",
);

export const Route = createFileRoute("/auth/reset-password")({
  validateSearch: z.object({
    email: z.string().optional(),
    resetToken: z.string().optional(),
    token: z.string().optional(),
  }),
  head: () => ({ meta: [{ title: "Set new password — OFC360" }] }),
  component: ResetPasswordPage,
});
