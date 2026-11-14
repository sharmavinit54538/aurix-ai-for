import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/auth/pages/LoginPage"));

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign In — OFC360" }] }),
  component: PageComponent,
});
