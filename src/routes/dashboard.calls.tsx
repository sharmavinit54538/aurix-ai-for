import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CallsPage = lazyFeaturePage(
  () => import("@/features/connect/pages/CallsPage"),
  "CallsPage"
);

export const Route = createFileRoute("/dashboard/calls")({
  head: () => ({ meta: [{ title: "Calls & Logs — OFC360" }] }),
  component: CallsPage,
});
