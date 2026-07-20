import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/routes/_lib/lazyFeaturePage";

const LeavesPage = lazyFeaturePage(
  () => import("./dashboard.leaves") as any,
  "LeavesPage"
);

export const Route = createFileRoute("/dashboard/workforce/leaves")({
  head: () => ({ meta: [{ title: "Leaves — Aurix" }] }),
  component: LeavesPage,
});
