import React, { useState } from "react";
import { Bot, Cpu, MessageSquare, Brain, Zap, Layers, Hash, Coins, Send, Activity, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

export function CtoAiPlatformPage() {
  const models = [
    { name: "Llama-3-70B-Instruct", type: "LLM / Text Generation", status: "Active", gpu: "4x A10G (42 GB)", latency: "140ms" },
    { name: "Qwen-2.5-Coder-32B", type: "Code Intelligence", status: "Active", gpu: "2x A10G (24 GB)", latency: "95ms" },
    { name: "bge-large-en-v1.5", type: "Vector Embeddings", status: "Active", gpu: "1x A10G (8 GB)", latency: "12ms" },
    { name: "Whisper-v3-Turbo", type: "Speech Recognition", status: "Idle", gpu: "Shared GPU", latency: "180ms" },
  ];

  const agents = [
    { name: "Payroll Copilot Agent", model: "Qwen-2.5-Coder", role: "Automated Tax & Calculation Engine", status: "Running" },
    { name: "Recruitment Resume Screener", model: "Llama-3-70B", role: "AI Candidate Scoring & Shortlisting", status: "Running" },
    { name: "Attendance Anomaly Agent", model: "Llama-3-8B", role: "Geofence & Overtime Verification", status: "Running" },
  ];

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
            <Button size="sm" onClick={() => toast.success("Deploy AI Agent modal opened")} className="bg-violet-600 hover:bg-violet-500 text-white text-xs cursor-pointer">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              Deploy AI Agent
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Active LLM Models", val: "8 Deployed", sub: "100% Uptime SLA", color: "text-violet-400" },
          { label: "Daily Token Consumption", val: "1.4M Tokens", sub: "$14.20 daily cost", color: "text-emerald-400" },
          { label: "Avg Inference Latency", val: "140ms", sub: "NVIDIA A10G Cluster", color: "text-cyan-400" },
          { label: "Vector Search Index", val: "4.2M Items", sub: "Qdrant Vector DB", color: "text-purple-400" },
        ].map((k, i) => (
          <div key={i} className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-1">
            <div className="text-xs text-muted-foreground font-semibold uppercase">{k.label}</div>
            <div className={`text-2xl font-bold font-display ${k.color}`}>{k.val}</div>
            <div className="text-[11px] text-muted-foreground">{k.sub}</div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="models" className="space-y-4">
        <TabsList className="bg-card/60 border border-border/80 p-1 rounded-xl flex flex-wrap gap-1">
          <TabsTrigger value="models" className="text-xs font-semibold">AI Models</TabsTrigger>
          <TabsTrigger value="agents" className="text-xs font-semibold">AI Agents</TabsTrigger>
          <TabsTrigger value="prompt" className="text-xs font-semibold">Prompt Analytics</TabsTrigger>
          <TabsTrigger value="vector" className="text-xs font-semibold">Vector Database</TabsTrigger>
          <TabsTrigger value="cost" className="text-xs font-semibold">Cost Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="models">
          <div className="rounded-xl border border-border/80 bg-card/60 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] border-b border-border/60">
                <tr>
                  <th className="p-3">Model Name</th>
                  <th className="p-3">Model Type</th>
                  <th className="p-3">GPU Allocation</th>
                  <th className="p-3">Inference Latency</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {models.map((m, idx) => (
                  <tr key={idx} className="hover:bg-accent/20 transition-colors">
                    <td className="p-3 font-bold text-foreground">{m.name}</td>
                    <td className="p-3 text-muted-foreground">{m.type}</td>
                    <td className="p-3 font-mono text-purple-400">{m.gpu}</td>
                    <td className="p-3 font-mono text-emerald-400">{m.latency}</td>
                    <td className="p-3">
                      <Badge className="text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30">{m.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="agents">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {agents.map((a, i) => (
              <div key={i} className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-foreground">{a.name}</h4>
                  <Badge className="text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30">{a.status}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">{a.role}</div>
                <div className="text-[11px] font-mono text-violet-400 pt-2 border-t border-border/40">Base LLM: {a.model}</div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CtoAiPlatformPage;
