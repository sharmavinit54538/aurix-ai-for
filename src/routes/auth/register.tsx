import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const RegisterPage = lazyFeaturePage(
  () => import("@/features/auth/pages/RegisterPage"),
  "RegisterPage",
);

export const Route = createFileRoute("/auth/register")({
  head: () => ({ meta: [{ title: "Create your workspace — OFC360" }] }),
  component: RegisterPage,
});
