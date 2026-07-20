import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/routes/_lib/lazyFeaturePage";

const TimesheetsPage = lazyFeaturePage(
  () => import("./dashboard.timesheets") as any,
  "TimesheetsPage"
);

export const Route = createFileRoute("/dashboard/workforce/timesheets")({
  head: () => ({ meta: [{ title: "Timesheets — Aurix" }] }),
  component: TimesheetsPage,
});
