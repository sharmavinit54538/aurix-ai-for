import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/auth/pages/VerifyEmailPage"));

export const Route = createFileRoute("/verify-email")({
  head: () => ({ meta: [{ title: "Verify Email — OFC360" }] }),
  component: PageComponent,
});
