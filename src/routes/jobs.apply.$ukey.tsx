import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/pages/CandidateJobApplicationPage"));

export const Route = createFileRoute("/jobs/apply/$ukey")({
  head: () => ({ meta: [{ title: "Apply for Job — OFC360" }] }),
  component: PageComponent,
});
