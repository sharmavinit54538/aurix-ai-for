import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/pages/ExitManagementPage"));

export const Route = createFileRoute("/dashboard/hr-operations/exit-management")({
  head: () => ({ meta: [{ title: "Exit Management — OFC360" }] }),
  component: PageComponent,
});
