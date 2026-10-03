import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CandidateAIInterviewPage = lazyFeaturePage(() => import("@/pages/CandidateAIInterviewPage"));

export const Route = createFileRoute("/ai-interview/$token")({
  head: () => ({
    meta: [
      { title: "AI Interview Assessment — Candidate Portal" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Complete your automated conversational technical assessment." },
    ],
  }),
  component: CandidateAIInterviewPage,
});
