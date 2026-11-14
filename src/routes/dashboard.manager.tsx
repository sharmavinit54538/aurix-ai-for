import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/portal/manager/pages/ManagerPage"), "ManagerPage");

export const Route = createFileRoute("/dashboard/manager")({
  head: () => ({ meta: [{ title: "Manager Portal — OFC360" }] }),
  component: PageComponent,
});
