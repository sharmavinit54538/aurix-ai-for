import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/auth/pages/RegisterPage"));

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create Account — OFC360" }] }),
  component: PageComponent,
});
