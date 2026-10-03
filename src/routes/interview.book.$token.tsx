import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CandidateBookingPage = lazyFeaturePage(() => import("@/pages/CandidateInterviewBookingPage"));

export const Route = createFileRoute("/interview/book/$token")({
  head: () => ({
    meta: [
      { title: "Select Interview Time — Candidate Portal" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Select your preferred interview time slot." },
    ],
  }),
  component: CandidateBookingPage,
});
