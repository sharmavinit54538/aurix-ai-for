import { createFileRoute } from "@tanstack/react-router";
import { AccessDeniedView } from "@/features/settings";
import { useAurix } from "@/lib/aurix-store";
import { resolveRbacRole } from "@/features/settings/types";

export const Route = createFileRoute("/dashboard/settings/billing")({
  head: () => ({ meta: [{ title: "Billing Settings — Access Restricted" }] }),
  component: BillingRestrictedPage,
});

function BillingRestrictedPage() {
  const ws = useAurix();
  const currentRole = resolveRbacRole(ws.user?.role);

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <AccessDeniedView
        title="SaaS Billing & Subscriptions Restricted"
        message="SaaS subscription plans, payment methods, and platform billing management are restricted from the OFC360 Organization HR Settings scope. Please contact your platform owner."
        currentRole={currentRole}
        returnUrl="/dashboard/settings"
      />
    </div>
  );
}
