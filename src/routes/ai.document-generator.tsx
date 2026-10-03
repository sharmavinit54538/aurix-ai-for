import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/ai/document-generator")({
  beforeLoad: () => {
    throw redirect({ to: "/dashboard/ai-hub/document-generator" });
  },
  component: () => null,
});
