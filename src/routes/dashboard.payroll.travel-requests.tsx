import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/routes/_lib/lazyFeaturePage";

const TravelPage = lazyFeaturePage(
  () => import("./dashboard.travel") as any,
  "TravelPage"
);

export const Route = createFileRoute("/dashboard/payroll/travel-requests")({
  head: () => ({ meta: [{ title: "Travel Requests — Aurix" }] }),
  component: TravelPage,
});
