import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const LeavesPage = lazyFeaturePage(() => import("@/pages/LeavesPage"));

export const Route = createFileRoute("/dashboard/leaves")({
  head: () => ({ meta: [{ title: "Leave Management — Aurix" }] }),
  component: LeavesPage,
});
