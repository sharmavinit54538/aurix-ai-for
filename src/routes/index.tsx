import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuthReady } from "@/lib/auth-bootstrap";
import { useAurix } from "@/lib/aurix-store";
import { hasValidAccessToken } from "@/api";
import {
  isHrOnboardingCompletedInStorage,
  isInviteTokenActivated,
  resolveRootEntryDestination,
} from "@/lib/onboarding-once";
import { PageSkeleton } from "@/components/common/PageSkeleton";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OFC360 — Operations & Intelligence Platform" },
      { name: "description", content: "Recruitment Insight Engine dashboard for jobs, candidates, pipeline health, and hiring velocity." },
      { property: "og:description", content: "Recruitment Insight Engine dashboard for jobs, candidates, pipeline health, and hiring velocity." },
    ],
  }),
  component: IndexRouteComponent,
});

function IndexRouteComponent() {
  const navigate = useNavigate();
  const authReady = useAuthReady();
  const ws = useAurix();

  useEffect(() => {
    if (!authReady || ws.isRestoring) return;
    const dest = resolveRootEntryDestination({
      user: ws.user,
      hasAccessToken: hasValidAccessToken(),
      demoInviteActivated: isInviteTokenActivated("emp_invite_demo"),
      hrOnboardingCompleted: isHrOnboardingCompletedInStorage(),
    });
    navigate({
      to: dest.to as any,
      ...(dest.search ? { search: dest.search as any } : {}),
      replace: true,
    });
  }, [authReady, ws.isRestoring, ws.user, navigate]);

  return <PageSkeleton />;
}
