import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { aurix, useAurix } from "@/lib/aurix-store";

export const Route = createFileRoute("/employee-onboarding")({
  head: () => ({ meta: [{ title: "Dashboard — OFC360" }] }),
  component: EmployeeOnboardingRedirect,
});

function EmployeeOnboardingRedirect() {
  const ws = useAurix();

  useEffect(() => {
    if (ws.user && !ws.user.onboardingComplete) {
      aurix.set({
        user: { ...ws.user, onboardingComplete: true },
      });
    }
  }, [ws.user]);

  return <Navigate to="/dashboard" replace />;
}
