import React, { useState } from "react";
import { Rocket, Workflow, Send, History, Package, Layers, Globe, Building, Cpu, Folder, ShieldCheck, Scale, PlayCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

export function CtoDevOpsPage() {
  const pipelines = [
    { name: "aurix-backend-production-deploy", env: "Production", status: "Success", duration: "3m 42s", lastRun: "12 mins ago" },
    { name: "aurix-frontend-vercel-deploy", env: "Production", status: "Success", duration: "1m 18s", lastRun: "24 mins ago" },
    { name: "aurix-ai-inference-gpu-deploy", env: "Staging", status: "Running", duration: "2m 04s", lastRun: "Just now" },
    { name: "aurix-postgres-migration-check", env: "Development", status: "Success", duration: "45s", lastRun: "1 hour ago" },
  ];

  const servers = [
    { name: "aws-us-east-prod-api-01", type: "c6i.2xlarge", ip: "54.210.14.88", cpu: "34%", ram: "6.2/16 GB", status: "Healthy" },
    { name: "aws-us-east-prod-api-02", type: "c6i.2xlarge", ip: "54.210.15.12", cpu: "28%", ram: "5.8/16 GB", status: "Healthy" },
    { name: "aws-us-east-gpu-cluster-01", type: "g5.4xlarge (NVIDIA A10G)", ip: "34.204.88.19", cpu: "74%", ram: "42/64 GB", status: "Healthy" },
    { name: "aws-us-east-db-primary", type: "r6g.2xlarge", ip: "10.0.4.12", cpu: "42%", ram: "28/32 GB", status: "Healthy" },
  ];

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
            <Button size="sm" onClick={() => toast.success("Triggered Production Deploy Pipeline")} className="bg-purple-600 hover:bg-purple-500 text-white text-xs cursor-pointer">
              <PlayCircle className="mr-1.5 h-3.5 w-3.5" />
              Trigger Deploy
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Build Success Rate", val: "99.4%", sub: "142 builds today", color: "text-emerald-400" },
          { label: "Avg Deploy Duration", val: "2m 14s", sub: "-18s faster", color: "text-cyan-400" },
          { label: "Active Containers", val: "184 Pods", sub: "Kubernetes healthy", color: "text-purple-400" },
          { label: "Zero-Downtime Rollback", val: "Ready", sub: "Instant 1-click rollback", color: "text-emerald-400" },
        ].map((kpi, idx) => (
          <div key={idx} className="rounded-xl border border-border/80 bg-card/60 p-4 backdrop-blur-xl space-y-1">
            <div className="text-xs text-muted-foreground font-semibold uppercase">{kpi.label}</div>
            <div className={`text-2xl font-bold font-display ${kpi.color}`}>{kpi.val}</div>
            <div className="text-[11px] text-muted-foreground">{kpi.sub}</div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="pipelines" className="space-y-4">
        <TabsList className="bg-card/60 border border-border/80 p-1 rounded-xl flex flex-wrap gap-1">
          <TabsTrigger value="pipelines" className="text-xs font-semibold">CI/CD Pipelines</TabsTrigger>
          <TabsTrigger value="deployments" className="text-xs font-semibold">Deployments & Builds</TabsTrigger>
          <TabsTrigger value="k8s" className="text-xs font-semibold">Kubernetes & Docker</TabsTrigger>
          <TabsTrigger value="servers" className="text-xs font-semibold">Servers & Storage</TabsTrigger>
          <TabsTrigger value="networking" className="text-xs font-semibold">Networking & SSL</TabsTrigger>
        </TabsList>

        <TabsContent value="pipelines">
          <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-4">
            <h3 className="font-bold text-sm text-foreground">Active CI/CD Pipelines</h3>
            <div className="divide-y divide-border/40">
              {pipelines.map((p, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-foreground flex items-center gap-2">
                      <span>{p.name}</span>
                      <Badge variant="outline" className="text-[9px] border-purple-500/30 text-purple-400">{p.env}</Badge>
                    </div>
                    <div className="text-[11px] text-muted-foreground">Duration: {p.duration} • Ran: {p.lastRun}</div>
                  </div>
                  <Badge className={`text-[10px] ${p.status === "Running" ? "bg-amber-500/20 text-amber-400 border-amber-500/30 animate-pulse" : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"}`}>
                    {p.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="servers">
          <div className="rounded-xl border border-border/80 bg-card/60 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] border-b border-border/60">
                <tr>
                  <th className="p-3">Server Instance</th>
                  <th className="p-3">Instance Type</th>
                  <th className="p-3">IP Address</th>
                  <th className="p-3">CPU Usage</th>
                  <th className="p-3">RAM Usage</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {servers.map((s, idx) => (
                  <tr key={idx} className="hover:bg-accent/20 transition-colors">
                    <td className="p-3 font-bold text-foreground">{s.name}</td>
                    <td className="p-3 text-muted-foreground">{s.type}</td>
                    <td className="p-3 font-mono text-purple-400">{s.ip}</td>
                    <td className="p-3 font-mono text-emerald-400">{s.cpu}</td>
                    <td className="p-3 font-mono text-indigo-400">{s.ram}</td>
                    <td className="p-3">
                      <Badge className="text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30">{s.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CtoDevOpsPage;
