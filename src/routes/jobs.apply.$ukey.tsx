import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const JobApplyPage = lazyFeaturePage(() => import("@/pages/CandidateJobApplicationPage"));

export const Route = createFileRoute("/jobs/apply/$ukey")({
  head: () => ({
    meta: [
      { title: "Apply for Position — Careers | OFC360" },
      { name: "description", content: "Submit your application and join our world-class engineering and enterprise intelligence teams." },
    ],
  }),
  component: JobApplyPage,
});
