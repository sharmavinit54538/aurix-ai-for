import { createFileRoute } from "@tanstack/react-router";
import { VerifyEmailPage } from "@/features/auth/pages/VerifyEmailPage";

export const Route = createFileRoute("/auth/verify-email")({
  head: () => ({ meta: [{ title: "Verify your email — Aurix" }] }),
  component: VerifyEmailPage,
});
