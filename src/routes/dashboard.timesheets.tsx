import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const TimesheetsPage = lazyFeaturePage(() => import("@/pages/TimesheetsPage"));

export const Route = createFileRoute("/dashboard/timesheets")({
  head: () => ({ meta: [{ title: "Timesheets — Aurix" }] }),
  component: TimesheetsPage,
});
