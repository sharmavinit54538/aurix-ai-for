import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const TravelPage = lazyFeaturePage(() => import("@/pages/TravelPage"));

export const Route = createFileRoute("/dashboard/payroll/travel-requests")({
  head: () => ({ meta: [{ title: "Travel Requests — Aurix" }] }),
  component: TravelPage,
});
