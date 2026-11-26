import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";
import { useAurix } from "@/lib/aurix-store";
import { isUserOnboardingComplete } from "@/lib/onboarding-once";
import { getDefaultDashboardPath } from "@/lib/role-paths";
import { normalizeRole } from "@/lib/roles";

import { guardEmployeeOnboardingRoute } from "@/lib/auth-route-guards";

const PageComponent = lazyFeaturePage(() => import("@/features/admin/recruitment/pages/EnterpriseOnboardingPage"));

function GuardedEmployeeOnboarding() {
  const ws = useAurix();
  const navigate = useNavigate();
  const role = normalizeRole(ws.user?.role);
  const shouldRedirect =
    Boolean(ws.user) &&
    (role === "employee" || role === "manager") &&
    isUserOnboardingComplete(ws.user);

  useEffect(() => {
    if (shouldRedirect && ws.user) {
      navigate({ to: getDefaultDashboardPath(ws.user) as any, replace: true });
    }
  }, [shouldRedirect, ws.user, navigate]);

  if (shouldRedirect) {
    return null;
  }

  return <PageComponent />;
}

export const Route = createFileRoute("/employee-onboarding")({
  beforeLoad: async ({ search }) => guardEmployeeOnboardingRoute(search as Record<string, unknown>),
  head: () => ({ meta: [{ title: "Employee Onboarding — OFC360" }] }),
  component: GuardedEmployeeOnboarding,
});
