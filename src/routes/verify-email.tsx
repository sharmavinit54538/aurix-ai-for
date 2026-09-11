import { createFileRoute } from "@tanstack/react-router";
import { VerifyEmailPage } from "@/features/auth/pages/VerifyEmailPage";

export const Route = createFileRoute("/verify-email")({
  head: () => ({ meta: [{ title: "Verify your email — OFC360" }] }),
  component: VerifyEmailPage,
});
