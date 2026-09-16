import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const OnboardingPage = lazyFeaturePage(() => import("@/pages/OnboardingPage"));

export const Route = createFileRoute("/onboarding")({
  validateSearch: z.object({
    token: z.string().optional(),
  }),
  head: () => ({ meta: [{ title: "Set up your workspace — OFC360" }] }),
  component: OnboardingPage,
});
