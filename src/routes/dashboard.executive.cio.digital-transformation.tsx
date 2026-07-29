import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "@/lib/lazyFeaturePage";

const CioDigitalTransformationPage = lazyFeaturePage(
  () => import("@/features/cio/pages/CioDigitalTransformationPage"),
  "CioDigitalTransformationPage"
);

export const Route = createFileRoute("/dashboard/executive/cio/digital-transformation")({
  head: () => ({ meta: [{ title: "Digital Transformation — CIO Portal" }] }),
  component: CioDigitalTransformationPage,
});
