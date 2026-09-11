import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const ManagersPage = lazyFeaturePage(
  () => import("@/features/admin/managers/pages/ManagersPage"),
  "ManagersPage",
);

export const Route = createFileRoute("/dashboard/managers")({
  head: () => ({ meta: [{ title: "Managers — OFC360" }] }),
  component: ManagersPage,
});
