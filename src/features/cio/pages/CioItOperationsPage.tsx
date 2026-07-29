import React, { useState } from "react";
import { Laptop, Ticket, CheckCircle2, AlertTriangle, ShieldCheck, Clock, Layers, Package, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export function CioItOperationsPage() {
  const incidentData = [
    { category: "Hardware", resolved: 142, open: 2, sla: "99.2%" },
    { category: "Software", resolved: 310, open: 5, sla: "98.5%" },
    { category: "Network & VPN", resolved: 88, open: 1, sla: "99.8%" },
    { category: "Identity & Access", resolved: 215, open: 3, sla: "99.1%" },
  ];

  const tickets = [
    { id: "INC-801", title: "VPN Gateway Tokyo Pod Re-authentication", status: "Resolved", priority: "Low", owner: "IT Ops Team" },
    { id: "INC-802", title: "Patch update deployment for Windows 11 Enterprise", status: "In Progress", priority: "Medium", owner: "Patch Admin" },
    { id: "INC-803", title: "Employee SSO Token Refresh Cache Flush", status: "Resolved", priority: "Low", owner: "IAM Team" },
  ];

  return (
    <div className="space-y-6 pb-12 text-left">
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <Laptop className="h-4 w-4" />
              </span>
              <Badge className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold uppercase">
                Service Desk & ITSM Operations
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              IT Service Desk & Incident Management Operations
            </h1>
            <p className="text-xs text-indigo-200/70 max-w-2xl">
              ITSM incident resolution, change request workflows, software asset inventory, automated patch management, and SLA compliance.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Resolved Tickets", val: "755 Tickets", sub: "99.1% SLA compliant", color: "text-indigo-400" },
          { label: "Active Open Incidents", val: "11 Tickets", sub: "0 Critical incidents", color: "text-emerald-400" },
          { label: "Avg Resolution Time", val: "14.2 Mins", sub: "Automated ITSM bot", color: "text-cyan-400" },
          { label: "Patch Compliance Rate", val: "99.4%", sub: "Windows/macOS/Linux", color: "text-purple-400" },
        ].map((k, i) => (
          <div key={i} className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-1">
            <div className="text-xs text-muted-foreground font-semibold uppercase">{k.label}</div>
            <div className={`text-2xl font-bold font-display ${k.color}`}>{k.val}</div>
            <div className="text-[11px] text-muted-foreground">{k.sub}</div>
          </div>
        ))}
      </div>

      <Tabs defaultValue="desk" className="space-y-4">
        <TabsList className="bg-card/60 border border-border/80 p-1 rounded-xl flex flex-wrap gap-1">
          <TabsTrigger value="desk" className="text-xs font-semibold">Service Desk</TabsTrigger>
          <TabsTrigger value="incidents" className="text-xs font-semibold">Incident Management</TabsTrigger>
          <TabsTrigger value="changes" className="text-xs font-semibold">Change Management</TabsTrigger>
          <TabsTrigger value="inventory" className="text-xs font-semibold">Software Inventory</TabsTrigger>
          <TabsTrigger value="patches" className="text-xs font-semibold">Patch Management</TabsTrigger>
        </TabsList>

        <TabsContent value="desk">
          <div className="rounded-xl border border-border/80 bg-card/60 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] border-b border-border/60">
                <tr>
                  <th className="p-3">Ticket ID</th>
                  <th className="p-3">Subject Title</th>
                  <th className="p-3">Assigned Owner</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-accent/20 transition-colors">
                    <td className="p-3 font-mono text-indigo-400 font-bold">{t.id}</td>
                    <td className="p-3 font-bold text-foreground">{t.title}</td>
                    <td className="p-3 text-muted-foreground">{t.owner}</td>
                    <td className="p-3">
                      <Badge variant="outline" className="text-[10px] border-indigo-500/30 text-indigo-400">{t.priority}</Badge>
                    </td>
                    <td className="p-3">
                      <Badge className="text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30">{t.status}</Badge>
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

export default CioItOperationsPage;
