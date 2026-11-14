import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/pages/TimesheetsPage"));

export const Route = createFileRoute("/dashboard/workforce/timesheets")({
  head: () => ({ meta: [{ title: "Timesheets — OFC360" }] }),
  component: PageComponent,
});
