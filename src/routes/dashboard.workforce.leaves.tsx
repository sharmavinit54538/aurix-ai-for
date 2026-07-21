import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const LeavesPage = lazyFeaturePage(() => import("@/pages/LeavesPage"));

export const Route = createFileRoute("/dashboard/workforce/leaves")({
  head: () => ({ meta: [{ title: "Leaves — Aurix" }] }),
  component: LeavesPage,
});
