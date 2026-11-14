import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/auth/pages/ResetPasswordPage"));

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset Password — OFC360" }] }),
  component: PageComponent,
});
