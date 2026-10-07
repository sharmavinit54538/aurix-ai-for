import { ExternalLink, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/hrms/Shared";
import { toast } from "sonner";
import { Link, useNavigate } from "@tanstack/react-router";

export function WorkflowActionNotice({ runId }: { runId: string }) {
  const navigate = useNavigate();

  return (
    <GlassCard className="border-border p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 font-display text-sm font-semibold text-foreground">
            <UserCheck className="h-4 w-4 text-primary" />
            <span>Next Step: Formal Review & Approval</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            After auditing preview calculations, submit the run for formal review & authorization.
            Payment transfers cannot be initiated until approval is granted.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            onClick={() => {
              toast.info("Review & Approval workflow is handled in the next stage.");
            }}
            style={{ background: "var(--gradient-brand)" }}
            className="gap-1.5 text-xs shadow-sm"
          >
            <span>Continue to Review & Approval</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}