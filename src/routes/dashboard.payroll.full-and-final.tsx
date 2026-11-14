import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/payroll/pages/FullAndFinalPage"));

export const Route = createFileRoute("/dashboard/payroll/full-and-final")({
  head: () => ({ meta: [{ title: "Full & Final Settlement — OFC360" }] }),
  component: PageComponent,
});
