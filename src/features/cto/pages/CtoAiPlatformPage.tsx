import React from "react";
import { Bot, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/common/EmptyState";

export function CtoAiPlatformPage() {
  return (
    <div className="space-y-6 pb-12 text-left">
      <div className="relative overflow-hidden rounded-2xl border border-violet-500/30 bg-gradient-to-r from-slate-900 via-violet-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet-500/20 text-violet-300 border border-violet-500/30">
                <Bot className="h-4 w-4" />
              </span>
              <Badge className="bg-violet-500/20 text-violet-300 border border-violet-500/30 text-[11px] font-bold uppercase">
                Enterprise AI & LLM Platform
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              AI Agents, LLM Models & Vector Database Center
            </h1>
            <p className="text-xs text-violet-200/70 max-w-2xl">
              AI Models registry, autonomous AI agents, prompt analytics, Qdrant vector database, embedding pipelines, token usage, and AI inference cost control.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              disabled
              title="Coming soon"
              className="bg-violet-600/50 text-white/70 text-xs cursor-not-allowed opacity-70"
            >
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Deploy AI Agent
            </Button>
          </div>
        </div>
      </div>

      <EmptyState
        title="Data not available yet"
        description="Enterprise AI model registry, autonomous AI agents, prompt telemetry, and vector database indexes are not connected to a backend service."
      />
    </div>
  );
}

export default CtoAiPlatformPage;
