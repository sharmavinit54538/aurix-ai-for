import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const PageComponent = lazyFeaturePage(() => import("@/features/cio/pages/CioDigitalTransformationPage"));

export const Route = createFileRoute("/dashboard/executive/cio/digital-transformation")({
  head: () => ({ meta: [{ title: "Digital Transformation — OFC360" }] }),
  component: PageComponent,
});
