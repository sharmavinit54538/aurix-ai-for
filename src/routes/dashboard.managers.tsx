import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "./_lib/lazyFeaturePage";

const ManagersPage = lazyFeaturePage(
  () => import("@/features/managers/pages/ManagersPage"),
  "ManagersPage",
);

export const Route = createFileRoute("/dashboard/managers")({
  head: () => ({ meta: [{ title: "Managers — Aurix" }] }),
  component: ManagersPage,
});
