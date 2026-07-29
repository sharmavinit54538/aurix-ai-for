import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";
import { PayrollBackButton } from "@/features/admin/payroll/components/PayrollBackButton";

const TravelPage = lazyFeaturePage(() => import("@/pages/TravelPage"));

export const Route = createFileRoute("/dashboard/payroll/travel-requests")({
  head: () => ({ meta: [{ title: "Travel Requests — Aurix" }] }),
  component: TravelRequestsRouteComponent,
});

function TravelRequestsRouteComponent() {
  return (
    <div className="space-y-4">
      <PayrollBackButton />
      <TravelPage />
    </div>
  );
}
