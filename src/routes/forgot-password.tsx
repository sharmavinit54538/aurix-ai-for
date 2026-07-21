import { createFileRoute } from "@tanstack/react-router";
import { ForgotPasswordPage } from "@/features/auth/pages/ForgotPasswordPage";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — Aurix" }] }),
  component: ForgotPasswordPage,
});
