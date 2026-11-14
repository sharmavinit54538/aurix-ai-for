import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const ForgotPasswordPage = lazyFeaturePage(
  () => import("@/features/auth/pages/ForgotPasswordPage"),
  "ForgotPasswordPage",
);

export const Route = createFileRoute("/auth/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — OFC360" }] }),
  component: ForgotPasswordPage,
});
