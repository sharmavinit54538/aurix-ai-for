import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const JobApplyPage = lazyFeaturePage(() => import("@/pages/CandidateJobApplicationPage"));

export const Route = createFileRoute("/jobs/apply/$ukey")({
  head: () => ({
    meta: [
      { title: "Apply for Position — Careers" },
      { name: "description", content: "Submit your application and join our team." },
    ],
  }),
  component: JobApplyPage,
});
