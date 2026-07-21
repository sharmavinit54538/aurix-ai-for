import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const TravelPage = lazyFeaturePage(() => import("@/pages/TravelPage"));

export const Route = createFileRoute("/dashboard/travel")({
  head: () => ({ meta: [{ title: "Travel Management — Aurix" }] }),
  component: TravelPage,
});
