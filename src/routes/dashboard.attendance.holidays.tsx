import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const HolidaysPage = lazyFeaturePage(() => import("@/features/attendance/pages/HolidaysPage"));

export const Route = createFileRoute("/dashboard/attendance/holidays")({
  head: () => ({ meta: [{ title: "Holidays — OFC360" }] }),
  component: HolidaysPage,
});
