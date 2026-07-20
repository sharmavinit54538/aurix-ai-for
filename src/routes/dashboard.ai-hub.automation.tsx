import { createFileRoute } from "@tanstack/react-router";
import { Workflow } from "lucide-react";
import { ComingSoon } from "@/components/aurix/DashboardShell";

export const Route = createFileRoute("/dashboard/ai-hub/automation")({
  head: () => ({ meta: [{ title: "AI Automation — Aurix" }] }),
  component: AIAutomationPage,
});

function AIAutomationPage() {
  return (
    <ComingSoon
      title="AI Automation Workflows"
      description="Automate repetitive HR processes, leave approvals, document routing, and notifications using autonomous AI agents."
      icon={Workflow}
    />
  );
}
