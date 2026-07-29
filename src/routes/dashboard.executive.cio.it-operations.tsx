import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CioItOperationsPage = lazyFeaturePage(
  () => import("@/features/cio/pages/CioItOperationsPage"),
  "CioItOperationsPage"
);

export const Route = createFileRoute("/dashboard/executive/cio/it-operations")({
  head: () => ({ meta: [{ title: "IT Operations — CIO Portal" }] }),
  component: CioItOperationsPage,
});
