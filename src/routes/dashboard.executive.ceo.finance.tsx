import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/ceo/pages/CeoFinancePage"));

export const Route = createFileRoute("/dashboard/executive/ceo/finance")({
  head: () => ({ meta: [{ title: "CEO Finance — OFC360" }] }),
  component: PageComponent,
});
