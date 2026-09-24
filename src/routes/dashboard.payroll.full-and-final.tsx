import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const FullAndFinalPage = lazyFeaturePage(
  () => import("@/features/payroll/pages/FullAndFinalPage"),
);

export const Route = createFileRoute("/dashboard/payroll/full-and-final")({
  head: () => ({ meta: [{ title: "Full & Final (F&F) Settlement — OFC360" }] }),
  component: FullAndFinalPage,
});
