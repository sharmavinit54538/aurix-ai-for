import React from "react";
import { Rocket, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";

export function CtoDevOpsPage() {
  return (
    <div className="space-y-6 pb-12 text-left">
      <div className="relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-r from-slate-900 via-purple-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <Rocket className="h-4 w-4" />
              </span>
              <Badge className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-bold uppercase">
                DevOps & Infrastructure Control
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              CI/CD Pipelines, Kubernetes & Infrastructure Hub
            </h1>
            <p className="text-xs text-purple-200/70 max-w-2xl">
              Automated pipelines, Kubernetes pod cluster orchestration, Docker container registry, EC2 instances, SSL certificates, and load balancing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              disabled
              title="Coming soon"
              className="bg-purple-600/50 text-white/70 text-xs cursor-not-allowed opacity-70"
            >
              <PlayCircle className="mr-1.5 h-3.5 w-3.5" />
              Trigger Deploy
            </Button>
          </div>
        </div>
      </div>

      <EmptyState
        title="Data not available yet"
        description="CI/CD pipelines, container cluster orchestration, deployment builds, and server telemetry are not connected to a backend service."
      />
    </div>
  );
}

export default CtoDevOpsPage;
