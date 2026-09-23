import React, { useState } from "react";
import {
  Folder, ListTodo, Calendar, AlertTriangle, Coins, Users, Plus, Search, Filter,
  CheckCircle2, Clock, FileText, MessageSquare, Paperclip, Activity, Eye, ChevronRight, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { toast } from "sonner";

export function CtoProjectsPage() {
  const [activeTab, setActiveTab] = useState("list");
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  const projects: any[] = [];
  const milestones: any[] = [];
  const risks: any[] = [];
  const teamAllocations: any[] = [];

  return (
    <div className="space-y-6 pb-12 text-left">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-slate-900 via-cyan-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                <Folder className="h-4 w-4" />
              </span>
              <Badge className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold uppercase">
                Project Portfolio Management
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Engineering Project Portfolio & Details
            </h1>
            <p className="text-xs text-cyan-200/70 max-w-2xl">
              Project list, timeline, Kanban board, Gantt chart view, milestones, risk matrix, budget tracking, team allocation, and detailed project drawers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => toast.success("New Project Modal Opened")} className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs cursor-pointer">
              <Plus className="mr-1.5 h-3.5 w-3.5" />
              New Project
            </Button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Active Portfolio", val: "0 Projects", sub: "Backend API integration pending", color: "text-cyan-400" },
          { label: "Engineering Budget", val: "—", sub: "Backend API integration pending", color: "text-emerald-400" },
          { label: "Milestones Target", val: "—", sub: "Backend API integration pending", color: "text-indigo-400" },
          { label: "Open Portfolio Risks", val: "0 Tracked", sub: "No active risks", color: "text-amber-400" },
        ].map((k, i) => (
          <div key={i} className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-1">
            <div className="text-xs text-muted-foreground font-semibold uppercase">{k.label}</div>
            <div className={`text-2xl font-bold font-display ${k.color}`}>{k.val}</div>
            <div className="text-[11px] text-muted-foreground">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* 8 Features Sub-Tabs */}
      <Tabs defaultValue="list" onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-card/60 border border-border/80 p-1 rounded-xl flex flex-wrap gap-1">
          <TabsTrigger value="list" className="text-xs font-semibold">Project List</TabsTrigger>
          <TabsTrigger value="timeline" className="text-xs font-semibold">Timeline</TabsTrigger>
          <TabsTrigger value="kanban" className="text-xs font-semibold">Kanban</TabsTrigger>
          <TabsTrigger value="gantt" className="text-xs font-semibold">Gantt View</TabsTrigger>
          <TabsTrigger value="milestones" className="text-xs font-semibold">Milestones</TabsTrigger>
          <TabsTrigger value="risks" className="text-xs font-semibold">Risks</TabsTrigger>
          <TabsTrigger value="budget" className="text-xs font-semibold">Budget</TabsTrigger>
          <TabsTrigger value="allocation" className="text-xs font-semibold">Team Allocation</TabsTrigger>
        </TabsList>

        {/* 1. Project List */}
        <TabsContent value="list">
          <div className="rounded-xl border border-border/80 bg-card/60 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] border-b border-border/60">
                <tr>
                  <th className="p-3">Project ID</th>
                  <th className="p-3">Project Name</th>
                  <th className="p-3">Lead Engineer</th>
                  <th className="p-3">Progress</th>
                  <th className="p-3">Budget</th>
                  <th className="p-3">Risk Level</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {projects.length > 0 ? (
                  projects.map((p) => (
                    <tr key={p.id} className="hover:bg-accent/20 transition-colors">
                      <td className="p-3 font-mono text-cyan-400 font-bold">{p.id}</td>
                      <td className="p-3 font-bold text-foreground">{p.name}</td>
                      <td className="p-3 text-muted-foreground">{p.lead}</td>
                      <td className="p-3 font-mono text-cyan-400 font-semibold">{p.progress}%</td>
                      <td className="p-3 font-mono text-emerald-400 font-semibold">{p.budget}</td>
                      <td className="p-3">
                        <Badge variant="outline" className={`text-[10px] ${p.risk === "Low" ? "border-emerald-500/30 text-emerald-400" : "border-amber-500/30 text-amber-400"}`}>{p.risk}</Badge>
                      </td>
                      <td className="p-3">
                        <Badge className="text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30">{p.status}</Badge>
                      </td>
                      <td className="p-3 text-right">
                        <Button size="sm" variant="ghost" onClick={() => setSelectedProject(p)} className="h-7 px-2 text-xs text-cyan-400 hover:bg-cyan-500/20 cursor-pointer">
                          <Eye className="mr-1 h-3 w-3" /> Details
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-xs text-muted-foreground">
                      No engineering projects found. Backend API integration pending.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* 2. Timeline */}
        <TabsContent value="timeline">
          <div className="rounded-xl border border-border/80 bg-card/60 p-5 space-y-4">
            <h3 className="font-bold text-sm text-foreground">Project Timeline Roadmap</h3>
            {projects.length > 0 ? (
              <div className="space-y-3">
                {projects.map((p) => (
                  <div key={p.id} className="rounded-lg border border-border/60 bg-card/80 p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-foreground">{p.name}</div>
                      <div className="text-[11px] text-muted-foreground">Due Date: {p.dueDate} • Lead: {p.lead}</div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      <div className="w-32 bg-slate-800 rounded-full h-2 overflow-hidden border border-border/60">
                        <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="text-xs font-mono font-bold text-cyan-400">{p.progress}%</span>
                      <Button size="sm" variant="outline" onClick={() => setSelectedProject(p)} className="text-[10px] h-7 cursor-pointer">View</Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No active project timelines.
              </div>
            )}
          </div>
        </TabsContent>

        {/* 3. Kanban */}
        <TabsContent value="kanban">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["In Progress", "On Track", "Completed"].map((statusCol) => (
              <div key={statusCol} className="rounded-xl border border-border/60 bg-card/40 p-3 space-y-3">
                <div className="flex items-center justify-between border-b border-border/40 pb-2">
                  <span className="text-xs font-bold text-foreground uppercase tracking-wider">{statusCol}</span>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {projects.filter((p) => p.status === statusCol).length}
                  </Badge>
                </div>
                <div className="space-y-2.5">
                  {projects.filter((p) => p.status === statusCol).length > 0 ? (
                    projects.filter((p) => p.status === statusCol).map((p) => (
                      <div key={p.id} onClick={() => setSelectedProject(p)} className="rounded-lg border border-border/60 bg-card/80 p-3 space-y-2 hover:border-cyan-500/50 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-mono text-cyan-400 font-bold">{p.id}</span>
                          <Badge className="text-[9px] bg-cyan-500/10 text-cyan-300 border-cyan-500/20">{p.dept}</Badge>
                        </div>
                        <h4 className="text-xs font-bold text-foreground">{p.name}</h4>
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 border-t border-border/30">
                          <span>{p.lead}</span>
                          <span className="font-mono font-bold text-emerald-400">{p.budget}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-muted-foreground">No projects in this stage</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* 4. Gantt View */}
        <TabsContent value="gantt">
          <div className="p-8 rounded-xl border border-dashed border-border/80 bg-card/60 text-center space-y-3">
            <Calendar className="h-8 w-8 text-cyan-400 mx-auto" />
            <h3 className="font-bold text-sm text-foreground">Gantt View Blueprint</h3>
            <p className="text-xs text-muted-foreground max-w-xl mx-auto">
              Visualizing engineering task dependencies and critical path schedules will be active once projects are loaded.
            </p>
          </div>
        </TabsContent>

        {/* 5. Milestones */}
        <TabsContent value="milestones">
          <div className="rounded-xl border border-border/80 bg-card/60 p-5 space-y-3">
            <h3 className="font-bold text-sm text-foreground">Engineering Milestones Tracker</h3>
            {milestones.length > 0 ? (
              <div className="space-y-2.5">
                {milestones.map((m, idx) => (
                  <div key={idx} className="rounded-lg border border-border/60 bg-card/80 p-3 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-xs text-foreground">{m.title}</h4>
                      <div className="text-[11px] text-muted-foreground">Project: {m.project} • Target Date: {m.date}</div>
                    </div>
                    <Badge className={`text-[10px] ${m.status === "Completed" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-indigo-500/20 text-indigo-400 border-indigo-500/30"}`}>
                      {m.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-lg">
                No engineering milestones scheduled.
              </div>
            )}
          </div>
        </TabsContent>

        {/* 6. Risks */}
        <TabsContent value="risks">
          <div className="space-y-3">
            {risks.length > 0 ? (
              risks.map((r, idx) => (
                <div key={idx} className="rounded-xl border border-border/80 bg-card/60 p-4 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-400" />
                      <h4 className="font-bold text-sm text-foreground">{r.title}</h4>
                    </div>
                    <div className="text-xs text-muted-foreground">Project: {r.project} • Impact: {r.impact} • Likelihood: {r.likelihood}</div>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-xs">{r.status}</Badge>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl">
                No active portfolio risks identified.
              </div>
            )}
          </div>
        </TabsContent>

        {/* 7. Budget */}
        <TabsContent value="budget">
          <div className="rounded-xl border border-border/80 bg-card/60 p-5 space-y-4">
            <h3 className="font-bold text-sm text-foreground">Project Budget & Expenditure</h3>
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {projects.map((p) => (
                  <div key={p.id} className="rounded-lg border border-border/60 bg-card/80 p-3 space-y-1">
                    <div className="text-xs font-bold text-foreground truncate">{p.name}</div>
                    <div className="text-lg font-bold font-mono text-emerald-400">{p.spent} / {p.budget}</div>
                    <div className="text-[11px] text-muted-foreground">Utilized: {Math.round((parseInt(p.spent.replace(/[^0-9]/g, '')) / parseInt(p.budget.replace(/[^0-9]/g, ''))) * 100)}%</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-lg">
                No budget allocations tracked yet.
              </div>
            )}
          </div>
        </TabsContent>

        {/* 8. Team Allocation */}
        <TabsContent value="allocation">
          <div className="rounded-xl border border-border/80 bg-card/60 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] border-b border-border/60">
                <tr>
                  <th className="p-3">Engineer Name</th>
                  <th className="p-3">Assigned Project</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Allocation Pct</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {teamAllocations.length > 0 ? (
                  teamAllocations.map((ta, i) => (
                    <tr key={i} className="hover:bg-accent/20 transition-colors">
                      <td className="p-3 font-bold text-foreground">{ta.name}</td>
                      <td className="p-3 text-cyan-400 font-semibold">{ta.project}</td>
                      <td className="p-3 text-muted-foreground">{ta.role}</td>
                      <td className="p-3 font-mono text-emerald-400 font-bold">{ta.allocation}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-xs text-muted-foreground">
                      No engineering allocations assigned yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      {/* Project Details Modal / Drawer */}
      <Sheet open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl bg-slate-950 text-foreground border-l border-border/80 p-6 space-y-6 overflow-y-auto">
          {selectedProject && (
            <div className="space-y-6 text-left">
              <SheetHeader className="space-y-1 text-left border-b border-border/60 pb-4">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-cyan-400 font-bold text-xs">{selectedProject.id}</span>
                  <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-[10px]">{selectedProject.status}</Badge>
                </div>
                <SheetTitle className="text-xl font-bold text-white">{selectedProject.name}</SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  Department: {selectedProject.dept} • Lead Engineer: {selectedProject.lead} • Due: {selectedProject.dueDate}
                </SheetDescription>
              </SheetHeader>

              {/* Progress & Budget Summary */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border/60 bg-card/60 p-3 space-y-1">
                  <div className="text-[10px] text-muted-foreground uppercase font-semibold">Completion Progress</div>
                  <div className="text-xl font-bold font-mono text-cyan-400">{selectedProject.progress}%</div>
                </div>
                <div className="rounded-lg border border-border/60 bg-card/60 p-3 space-y-1">
                  <div className="text-[10px] text-muted-foreground uppercase font-semibold">Budget Spent</div>
                  <div className="text-xl font-bold font-mono text-emerald-400">{selectedProject.spent} / {selectedProject.budget}</div>
                </div>
              </div>

              {/* Project Details Sub-Tabs: Tasks, Files, Comments, Activity */}
              <Tabs defaultValue="tasks" className="space-y-3">
                <TabsList className="bg-card/60 border border-border/80 p-1 rounded-lg w-full flex">
                  <TabsTrigger value="tasks" className="text-xs flex-1">Tasks</TabsTrigger>
                  <TabsTrigger value="files" className="text-xs flex-1">Files</TabsTrigger>
                  <TabsTrigger value="comments" className="text-xs flex-1">Comments</TabsTrigger>
                  <TabsTrigger value="activity" className="text-xs flex-1">Activity</TabsTrigger>
                </TabsList>

                {/* Sub-Tab 1: Tasks */}
                <TabsContent value="tasks" className="space-y-2">
                  {selectedProject.tasks.map((task: any) => (
                    <div key={task.id} className="rounded-lg border border-border/60 bg-card/80 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className={`h-4 w-4 ${task.status === "Done" ? "text-emerald-400" : "text-amber-400"}`} />
                        <span className="text-xs font-semibold text-foreground">{task.name}</span>
                      </div>
                      <Badge variant="outline" className="text-[9px] font-mono">{task.status}</Badge>
                    </div>
                  ))}
                </TabsContent>

                {/* Sub-Tab 2: Files */}
                <TabsContent value="files" className="space-y-2">
                  {selectedProject.files.map((file: string, idx: number) => (
                    <div key={idx} className="rounded-lg border border-border/60 bg-card/80 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Paperclip className="h-4 w-4 text-cyan-400" />
                        <span className="text-xs font-semibold font-mono text-foreground">{file}</span>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => toast.success(`Downloading ${file}`)} className="h-6 text-[10px] text-cyan-400 cursor-pointer">Download</Button>
                    </div>
                  ))}
                </TabsContent>

                {/* Sub-Tab 3: Comments */}
                <TabsContent value="comments" className="space-y-3">
                  {selectedProject.comments.map((c: any, idx: number) => (
                    <div key={idx} className="rounded-lg border border-border/60 bg-card/80 p-3 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-foreground">{c.author}</span>
                        <span className="text-muted-foreground">{c.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{c.text}</p>
                    </div>
                  ))}
                </TabsContent>

                {/* Sub-Tab 4: Activity Timeline */}
                <TabsContent value="activity" className="space-y-2">
                  {selectedProject.activities.map((act: string, idx: number) => (
                    <div key={idx} className="rounded-lg border border-border/60 bg-card/80 p-3 flex items-center gap-2">
                      <Activity className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                      <span className="text-xs text-foreground">{act}</span>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default CtoProjectsPage;
