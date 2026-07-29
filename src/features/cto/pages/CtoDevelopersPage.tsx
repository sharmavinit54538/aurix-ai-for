import React, { useState } from "react";
import { UserCheck, GitCommit, GitPullRequest, Code2, Award, Zap, Activity, Filter, Search, Plus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

export function CtoDevelopersPage() {
  const developers = [
    { name: "Vinit Sharma", title: "Chief Technology Officer", skills: ["System Design", "Python", "Kubernetes", "AI/ML"], commits: 342, prs: 48, score: "99%", status: "Online" },
    { name: "Alex Rivera", title: "Principal Systems Architect", skills: ["PostgreSQL", "FastAPI", "Redis", "Distributed Systems"], commits: 218, prs: 34, score: "96%", status: "Online" },
    { name: "Neha Gupta", title: "Senior Backend Engineer", skills: ["Python", "AsyncIO", "WebSockets", "Docker"], commits: 184, prs: 29, score: "94%", status: "In Meeting" },
    { name: "Rohan Verma", title: "Lead DevOps Specialist", skills: ["Terraform", "Kubernetes", "AWS", "CI/CD"], commits: 156, prs: 22, score: "98%", status: "Online" },
    { name: "Priya Patel", title: "Senior Frontend Engineer", skills: ["React", "TypeScript", "TailwindCSS", "State Mgmt"], commits: 142, prs: 19, score: "95%", status: "Offline" },
  ];

  return (
    <div className="space-y-6 pb-12 text-left">
      <div className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">
                <UserCheck className="h-4 w-4" />
              </span>
              <Badge className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-bold uppercase">
                Developer Engineering Team
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Engineering Talent Directory & Workload Management
            </h1>
            <p className="text-xs text-blue-200/70 max-w-2xl">
              Developer directory, technical skill matrix, git activity, assigned tasks, PR reviews count, and workload distribution.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => toast.success("Add Developer Form opened")} className="bg-blue-600 hover:bg-blue-500 text-white text-xs cursor-pointer">
              <UserPlus className="mr-1.5 h-3.5 w-3.5" />
              Add Developer
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Active Developers", val: "24 Engineers", sub: "18 Senior • 6 Lead", color: "text-blue-400" },
          { label: "Total Commits (30d)", val: "1,248 Commits", sub: "+18% vs last month", color: "text-emerald-400" },
          { label: "PR Code Review Time", val: "1.4 Hours", sub: "Fast review cycle", color: "text-cyan-400" },
          { label: "Team Productivity", val: "96.4%", sub: "High efficiency score", color: "text-indigo-400" },
        ].map((k, i) => (
          <div key={i} className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-1">
            <div className="text-xs text-muted-foreground font-semibold uppercase">{k.label}</div>
            <div className={`text-2xl font-bold font-display ${k.color}`}>{k.val}</div>
            <div className="text-[11px] text-muted-foreground">{k.sub}</div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="directory" className="space-y-4">
        <TabsList className="bg-card/60 border border-border/80 p-1 rounded-xl flex flex-wrap gap-1">
          <TabsTrigger value="directory" className="text-xs font-semibold">Developers Directory</TabsTrigger>
          <TabsTrigger value="skills" className="text-xs font-semibold">Skill Matrix</TabsTrigger>
          <TabsTrigger value="activity" className="text-xs font-semibold">Git Activity</TabsTrigger>
          <TabsTrigger value="workload" className="text-xs font-semibold">Workload & Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="directory">
          <div className="rounded-xl border border-border/80 bg-card/60 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] border-b border-border/60">
                <tr>
                  <th className="p-3">Engineer Name</th>
                  <th className="p-3">Title / Specialization</th>
                  <th className="p-3">Top Skills</th>
                  <th className="p-3">Commits (30d)</th>
                  <th className="p-3">PRs Closed</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {developers.map((d, i) => (
                  <tr key={i} className="hover:bg-accent/20 transition-colors">
                    <td className="p-3 font-bold text-foreground">{d.name}</td>
                    <td className="p-3 text-muted-foreground">{d.title}</td>
                    <td className="p-3 flex flex-wrap gap-1">
                      {d.skills.map((s, si) => (
                        <Badge key={si} variant="outline" className="text-[9px] border-blue-500/20 text-blue-300">{s}</Badge>
                      ))}
                    </td>
                    <td className="p-3 font-mono text-blue-400 font-bold">{d.commits}</td>
                    <td className="p-3 font-mono text-emerald-400 font-bold">{d.prs}</td>
                    <td className="p-3">
                      <Badge className="text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30">{d.status}</Badge>
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

export default CtoDevelopersPage;
